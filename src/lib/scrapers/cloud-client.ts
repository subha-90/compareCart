/**
 * Unified Cloud Unblocker Client
 * Bypasses Akamai, Cloudflare, AWS WAF, and renders client-side JavaScript (Angular/React)
 * for Croma, Reliance Digital, Vijay Sales, and Amazon across Vercel, AWS, or local dev.
 */

interface CloudFetchOptions {
  renderJs?: boolean;
  countryCode?: string;
  timeoutMs?: number;
}

export async function fetchWithCloudUnblocker(
  targetUrl: string,
  options: CloudFetchOptions = {}
): Promise<{ ok: boolean; html: string; status: number }> {
  // 1. Check for supported Cloud Unblocking Providers in environment
  const scraperApiKey = process.env.SCRAPER_API_KEY;
  const zenrowsApiKey = process.env.ZENROWS_API_KEY;
  const { renderJs = true, countryCode = 'in' } = options;

  // If cloud unblocker is configured, allow 10s. If direct connection to firewalled site, fail fast in 2.5s to prevent tarpit hangs
  const effectiveTimeout = scraperApiKey || zenrowsApiKey ? (options.timeoutMs || 10000) : 2500;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), effectiveTimeout);

  try {
    // ── PROVIDER A: ScraperAPI (Industry standard, free tier: 5,000 reqs) ──
    if (scraperApiKey) {
      const endpoint = `https://api.scraperapi.com/?api_key=${encodeURIComponent(
        scraperApiKey
      )}&url=${encodeURIComponent(targetUrl)}&country_code=${countryCode}&render=${
        renderJs ? 'true' : 'false'
      }`;

      const res = await fetch(endpoint, {
        signal: controller.signal,
        headers: {
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
      });

      clearTimeout(timeoutId);
      const html = await res.text();
      return { ok: res.ok, html, status: res.status };
    }

    // ── PROVIDER B: ZenRows (High-speed residential unblocker) ──
    if (zenrowsApiKey) {
      const endpoint = `https://api.zenrows.com/v1/?apikey=${encodeURIComponent(
        zenrowsApiKey
      )}&url=${encodeURIComponent(targetUrl)}&js_render=${
        renderJs ? 'true' : 'false'
      }&premium_proxy=true&proxy_country=in`;

      const res = await fetch(endpoint, {
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const html = await res.text();
      return { ok: res.ok, html, status: res.status };
    }

    // ── FALLBACK: Direct Fetch with Indian browser headers ──
    const directRes = await fetch(targetUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7',
        'Cache-Control': 'no-cache',
      },
    });

    clearTimeout(timeoutId);
    const html = await directRes.text();
    return { ok: directRes.ok, html, status: directRes.status };
  } catch (err: any) {
    clearTimeout(timeoutId);
    return { ok: false, html: '', status: 500 };
  }
}
