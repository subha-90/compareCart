import { Product } from '../types';
import * as fs from 'fs';
import * as path from 'path';
import { redis } from './redis';

export interface CachedPriceRecord {
  query: string;
  product: Product;
  scrapedAt: number;
  ttlMs: number;
  hitCount: number;
}

// In-memory fast L1 cache map
const memoryCache = new Map<string, CachedPriceRecord>();

// Cache TTL: 1 hour for live market pricing
const DEFAULT_CACHE_TTL_MS = 60 * 60 * 1000;

// Disk persistence file path
const CACHE_FILE_PATH = path.join(process.cwd(), '.cache', 'comparecart-cache.json');

/**
 * Normalizes query string for uniform cache hits
 */
export function normalizeQueryKey(q: string): string {
  return q
    .toLowerCase()
    .replace(/^https?:\/\/(www\.)?/, '')
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Initializes cache from disk if available (only genuine scraped entries)
 */
function loadDiskCache() {
  try {
    if (fs.existsSync(CACHE_FILE_PATH)) {
      const raw = fs.readFileSync(CACHE_FILE_PATH, 'utf-8');
      const parsed: Record<string, CachedPriceRecord> = JSON.parse(raw);
      const now = Date.now();
      for (const [key, record] of Object.entries(parsed)) {
        if (
          now - record.scrapedAt < record.ttlMs &&
          record.product?.listings?.some(l => !l.priceUnavailable && l.listedPrice > 0)
        ) {
          memoryCache.set(key, record);
        }
      }
    }
  } catch {
    // Disk cache read is optional
  }
}

/**
 * Saves non-expired entries to disk for server restarts
 */
function saveDiskCache() {
  try {
    const dir = path.dirname(CACHE_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const serializable: Record<string, CachedPriceRecord> = {};
    const now = Date.now();
    for (const [key, record] of memoryCache.entries()) {
      if (now - record.scrapedAt < record.ttlMs) {
        serializable[key] = record;
      }
    }
    fs.writeFileSync(CACHE_FILE_PATH, JSON.stringify(serializable, null, 2), 'utf-8');
  } catch {
    // Disk write is best-effort
  }
}

// Initial load
loadDiskCache();

/**
 * Synchronous L1 cache retrieval
 */
export function getCachedProduct(query: string): CachedPriceRecord | null {
  const key = normalizeQueryKey(query);
  const record = memoryCache.get(key);

  if (!record) return null;

  const isExpired = Date.now() - record.scrapedAt > record.ttlMs;
  if (isExpired) {
    memoryCache.delete(key);
    return null;
  }

  const hasValidStore =
    record.product.listings &&
    record.product.listings.some(l => !l.priceUnavailable && l.listedPrice > 0);
  if (!hasValidStore) {
    memoryCache.delete(key);
    return null;
  }

  record.hitCount += 1;
  return record;
}

/**
 * Asynchronous multi-tier cache retrieval:
 * Checks L1 (Memory) -> L2 (Upstash Cloud Redis) -> L3 (Disk)
 */
export async function getCachedProductAsync(query: string): Promise<CachedPriceRecord | null> {
  const key = normalizeQueryKey(query);

  // 1. Check L1 Memory Cache (<0.1ms)
  const memHit = getCachedProduct(query);
  if (memHit) return memHit;

  // 2. Check L2 Upstash Redis Cloud Cache (<10ms)
  if (redis) {
    try {
      const redisKey = `cc:price:${key}`;
      const cached = await redis.get<CachedPriceRecord>(redisKey);
      if (cached && cached.product) {
        const hasValidStore =
          cached.product.listings &&
          cached.product.listings.some(l => !l.priceUnavailable && l.listedPrice > 0);

        if (hasValidStore) {
          // Promote to local L1 memory cache
          memoryCache.set(key, cached);
          return cached;
        }
      }
    } catch (err) {
      console.warn('[Redis] Cache lookup fallback:', err);
    }
  }

  return null;
}

/**
 * Stores a freshly scraped product in L1 (Memory) and L2 (Upstash Redis)
 */
export async function setCachedProductAsync(
  query: string,
  product: Product,
  ttlMs: number = DEFAULT_CACHE_TTL_MS
): Promise<void> {
  // Synchronous L1 + disk write
  setCachedProduct(query, product, ttlMs);

  // Asynchronous L2 Upstash Redis write with TTL
  if (redis) {
    try {
      const key = normalizeQueryKey(query);
      const redisKey = `cc:price:${key}`;
      const ttlSec = Math.floor(ttlMs / 1000);
      const record: CachedPriceRecord = {
        query,
        product,
        scrapedAt: Date.now(),
        ttlMs,
        hitCount: 1,
      };

      await redis.set(redisKey, record, { ex: ttlSec });

      if (product.title) {
        const titleKey = normalizeQueryKey(product.title);
        if (titleKey !== key) {
          await redis.set(`cc:price:${titleKey}`, record, { ex: ttlSec });
        }
      }
    } catch (err) {
      console.warn('[Redis] Cache save fallback:', err);
    }
  }
}

/**
 * Stores a freshly scraped product in L1
 */
export function setCachedProduct(query: string, product: Product, ttlMs: number = DEFAULT_CACHE_TTL_MS): void {
  const hasValidListing =
    product.listings && product.listings.some(l => !l.priceUnavailable && l.listedPrice > 0);
  if (!hasValidListing) return;

  const key = normalizeQueryKey(query);
  const record: CachedPriceRecord = {
    query,
    product,
    scrapedAt: Date.now(),
    ttlMs,
    hitCount: 1,
  };

  memoryCache.set(key, record);

  if (product.title) {
    const titleKey = normalizeQueryKey(product.title);
    if (titleKey !== key) {
      memoryCache.set(titleKey, record);
    }
  }

  saveDiskCache();
}

/**
 * Clears in-memory, disk, and Redis cache
 */
export async function clearAllCache(): Promise<void> {
  memoryCache.clear();
  try {
    if (fs.existsSync(CACHE_FILE_PATH)) {
      fs.unlinkSync(CACHE_FILE_PATH);
    }
  } catch {
    // Best effort
  }

  if (redis) {
    try {
      const keys = await redis.keys('cc:price:*');
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    } catch {
      // Best effort
    }
  }
}

export function getCacheStats(): { size: number; keys: string[] } {
  return {
    size: memoryCache.size,
    keys: Array.from(memoryCache.keys()),
  };
}
