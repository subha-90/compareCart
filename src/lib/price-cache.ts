import { Product } from '../types';
import * as fs from 'fs';
import * as path from 'path';
import { SAMPLE_PRODUCTS } from './mock-data';

export interface CachedPriceRecord {
  query: string;
  product: Product;
  scrapedAt: number;
  ttlMs: number;
  hitCount: number;
}

// In-memory fast cache map
const memoryCache = new Map<string, CachedPriceRecord>();

// Cache TTL: 2 hours for live scraped market pricing
const DEFAULT_CACHE_TTL_MS = 2 * 60 * 60 * 1000;

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
        // Only load non-expired entries with genuine live listings
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
 * Retrieves cached product if fresh (Ultra-fast <5ms retrieval)
 */
export function getCachedProduct(query: string): CachedPriceRecord | null {
  const key = normalizeQueryKey(query);
  
  // Direct exact match on normalized key
  let record = memoryCache.get(key);

  if (!record) {
    return null;
  }

  const isExpired = Date.now() - record.scrapedAt > record.ttlMs;
  if (isExpired) {
    memoryCache.delete(key);
    return null;
  }

  // Ensure record has at least 1 valid store price
  const hasValidStore = record.product.listings && record.product.listings.some(l => !l.priceUnavailable && l.listedPrice > 0);
  if (!hasValidStore) {
    memoryCache.delete(key);
    return null;
  }

  record.hitCount += 1;
  return record;
}

/**
 * Clears in-memory and disk cache
 */
export function clearAllCache(): void {
  memoryCache.clear();
  try {
    if (fs.existsSync(CACHE_FILE_PATH)) {
      fs.unlinkSync(CACHE_FILE_PATH);
    }
  } catch {
    // Best-effort
  }
}

/**
 * Stores a freshly scraped product in the shared crowdsource cache
 */
export function setCachedProduct(query: string, product: Product, ttlMs: number = DEFAULT_CACHE_TTL_MS): void {
  // Only cache if there is at least one valid listing
  const hasValidListing = product.listings && product.listings.some(l => !l.priceUnavailable && l.listedPrice > 0);
  if (!hasValidListing) {
    return;
  }

  // Verify that product title matches any specific model number in the query (e.g. "16" vs "17")
  const qLower = query.toLowerCase();
  const titleLower = (product.title || '').toLowerCase();
  const queryNums = qLower.match(/\b(1[1-9]|2[0-9]|SE|m[1-4]|s2[0-5]|xm[3-5])\b/gi) || [];
  if (queryNums.length > 0 && product.title) {
    const matchesAll = queryNums.every(n => new RegExp(`\\b${n}\\b`, 'i').test(titleLower));
    if (!matchesAll) {
      // Skip caching mismatched product (e.g. iPhone 17 when query asked for iPhone 16)
      return;
    }
  }

  // Verify variant qualifiers (e.g. if query does NOT have "plus", reject caching "plus" under this query)
  const variantWords = ['plus', 'pro', 'max', 'ultra', 'mini'];
  for (const v of variantWords) {
    const qHas = new RegExp(`\\b${v}\\b`, 'i').test(qLower);
    const tHas = new RegExp(`\\b${v}\\b`, 'i').test(titleLower);
    if (qHas !== tHas) {
      return;
    }
  }

  const key = normalizeQueryKey(query);
  const record: CachedPriceRecord = {
    query,
    product,
    scrapedAt: Date.now(),
    ttlMs,
    hitCount: 1,
  };

  memoryCache.set(key, record);

  // Also cache under the canonical product title if different
  if (product.title) {
    const titleKey = normalizeQueryKey(product.title);
    if (titleKey !== key) {
      memoryCache.set(titleKey, record);
    }
  }

  saveDiskCache();
}

/**
 * Returns cache statistics for system telemetry
 */
export function getCacheStats(): { size: number; keys: string[] } {
  return {
    size: memoryCache.size,
    keys: Array.from(memoryCache.keys()),
  };
}
