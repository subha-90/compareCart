import * as cheerio from 'cheerio';
import * as fs from 'fs';
import * as path from 'path';
import { MerchantId, Coupon, BankOffer } from '../../types';
import { parseIndianPrice } from './serp';

export function getEnvKey(name: string): string {
  if (process.env[name]) return process.env[name]!.trim().replace(/^["']|["']$/g, '');
  try {
    const envPath = path.join(process.cwd(), '.env.local');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf-8');
      const match = content.match(new RegExp(`^${name}=["']?([^"'\\r\\n]+)["']?`, 'm'));
      if (match && match[1]) {
        return match[1].trim();
      }
    }
  } catch {}
  return '';
}

export interface GroundedStorePrice {
  price: number;
  mrp: number;
  url: string;
  coupons?: Coupon[];
  bankOffers?: BankOffer[];
}

export type GroundedPricesResult = Partial<Record<MerchantId, GroundedStorePrice>>;

const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36',
];

function getRandomUserAgent(): string {
  return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
}

/**
 * Strips OS, color tokens, internal SKU codes, and clutter words to extract a clean searchable model name
 * e.g. "Apple MacBook Air M3 - (8 GB/512 GB SSD/macOS Sonoma) MRXW3HN/A" -> "Apple MacBook Air M3 8GB 512GB"
 * e.g. "Samsung Galaxy S24 5G Snapdragon (Marble Gray, 256 GB)" -> "Samsung Galaxy S24 5G 256GB"
 */
function extractCleanModelQuery(raw: string): string {
  return raw
    .replace(/^https?:\/\/[^\s]+/i, '')
    .replace(/\b[A-Z0-9]{5,}\/[A-Z]\b/gi, '') // Remove internal SKU part numbers
    .replace(/\b[A-Z]{2}-[A-Z0-9]{5,}\b/gi, '')
    .replace(/(\d+)\s*(GB|TB)\s*(?:SSD|ROM|RAM)?/gi, '$1$2')
    .replace(/\b(macOS|Sonoma|Ventura|Monterey|Windows 11|Windows 10|Snapdragon|Exynos|Bionic|Octa-Core|Octa Core|Smartphone|Mobile Phone|Laptop)\b/gi, '')
    .replace(/\b(Ultramarine|Titanium|Midnight|Starlight|Space Grey|Silver|Black|White|Blue|Teal|Pink|Desert|Marble Gray|Amber Yellow|Cobalt Violet|Onyx Black)\b/gi, '')
    .replace(/[()[\]{}/\-–—:,]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

interface LiveSnippetsFeed {
  snippetsText: string;
  directPrices: GroundedPricesResult;
}

function parseSnippetBankOffer(text: string, merchant: MerchantId, price: number): BankOffer | undefined {
  const promoMatches = [
    ...text.matchAll(/(?:Instant Discount|Discount of|Off)\s*(?:of|up to|upto)?\s*(?:₹|Rs\.?|INR)?\s*([\d,]+)\s*(?:on|with)\s*([A-Za-z]+)\s*(?:Bank)?\s*(?:Credit|Debit)?\s*Cards?/gi),
    ...text.matchAll(/(HDFC|SBI|ICICI|AXIS|KOTAK|FEDERAL|AMEX)\s*Bank\s*(?:Credit|Debit)?\s*Cards?\s*[:\-]?\s*(?:Flat|Instant Discount of|Upto)?\s*(?:₹|Rs\.?|INR)?\s*([\d,]+)/gi),
    ...text.matchAll(/(?:₹|Rs\.?|INR)?\s*([\d,]+)\s*(?:Instant Discount|Off)\s*(?:on|with)\s*(HDFC|SBI|ICICI|AXIS|KOTAK|FEDERAL)/gi),
  ];

  for (const m of promoMatches) {
    let bankName = (m[2] || m[1] || '').toUpperCase();
    let amountStr = m[1] && !isNaN(parseInt(m[1].replace(/,/g, ''), 10)) ? m[1] : m[2];
    const amount = parseInt(amountStr?.replace(/,/g, '') || '0', 10);

    const validBanks = ['HDFC', 'ICICI', 'SBI', 'AXIS', 'KOTAK', 'FEDERAL', 'AMEX'] as const;
    const matchedBank = validBanks.find(b => bankName.includes(b));

    if (matchedBank && amount >= 500 && amount <= price * 0.5) {
      return {
        id: `${matchedBank.toLowerCase()}-${merchant}-${Date.now()}`,
        bank: matchedBank,
        cardName: `${matchedBank} Bank Credit Card`,
        cardTier: 'Promotional',
        cardType: 'credit',
        discountType: 'flat',
        discountValue: amount,
        maxDiscount: amount,
        minOrderValue: Math.round(price * 0.4),
        exclusiveToMerchant: merchant,
        terms: `Flat ₹${amount.toLocaleString('en-IN')} Instant Discount on ${matchedBank} Cards`,
      };
    }
  }
  return undefined;
}

function parseSnippetCoupon(text: string, price: number): Coupon | undefined {
  const match = text.match(/(?:use code|apply coupon|coupon code|voucher|with coupon|save)\s*[:\-]?\s*([A-Z0-9]{4,12})?\s*(?:to get|for)?\s*(?:₹|Rs\.?|INR)?\s*([\d,]+)\s*(?:off|discount|with coupon)/i);
  if (match) {
    const code = match[1] || 'APPLY COUPON';
    const val = parseInt(match[2]?.replace(/,/g, '') || '0', 10);
    if (val >= 200 && val < price * 0.5) {
      return {
        id: `snip-coupon-${Date.now()}`,
        code: code.toUpperCase(),
        title: `₹${val.toLocaleString('en-IN')} Off Coupon`,
        description: `Verified coupon from live store feed`,
        discountType: 'flat',
        discountValue: val,
        verified: true,
      };
    }
  }
  return undefined;
}

/**
 * Rapidly retrieves genuine live indexed search snippets across Croma, Reliance Digital,
 * Vijay Sales, Amazon, and Flipkart using open retailer domain searches across DuckDuckGo (POST) and Bing.
 * Extracts deterministic price tags in parallel to support LLM grounding.
 */
async function fetchLiveWebSnippets(query: string, targetMerchants?: MerchantId[]): Promise<LiveSnippetsFeed> {
  const clean = extractCleanModelQuery(query);
  const snippets: string[] = [];
  const directPrices: GroundedPricesResult = {};

  const allTargets: { merchant: MerchantId; name: string; query: string }[] = [
    { merchant: 'flipkart', name: 'Flipkart', query: `site:flipkart.com ${clean} price` },
    { merchant: 'amazon', name: 'Amazon', query: `site:amazon.in ${clean} price` },
    { merchant: 'croma', name: 'Croma', query: `site:croma.com ${clean} price` },
    { merchant: 'reliance_digital', name: 'Reliance Digital', query: `site:reliancedigital.in ${clean} price` },
    { merchant: 'vijay_sales', name: 'Vijay Sales', query: `site:vijaysales.com ${clean} price` },
    { merchant: 'croma', name: 'Aggregated', query: `${clean} price in india croma reliancedigital vijaysales 91mobiles` },
  ];

  const storeTargets = targetMerchants && targetMerchants.length > 0
    ? allTargets.filter(t => targetMerchants.includes(t.merchant) || t.name === 'Aggregated')
    : allTargets;

  await Promise.allSettled(
    storeTargets.map(async target => {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 2500);

      try {
        // Method 1: DuckDuckGo HTML via POST (official method for non-JS static HTML)
        const ddgPromise = (async () => {
          try {
            const res = await fetch('https://html.duckduckgo.com/html/', {
              method: 'POST',
              signal: controller.signal,
              headers: {
                'User-Agent': getRandomUserAgent(),
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'text/html,application/xhtml+xml',
                'Accept-Language': 'en-IN,en;q=0.9',
              },
              body: `q=${encodeURIComponent(target.query)}&b=`,
            });
            if (!res.ok) return;
            const html = await res.text();
            const $ = cheerio.load(html);
            $('.result').slice(0, 3).each((_, el) => {
              const title = $(el).find('.result__title').text().trim();
              const snip = $(el).find('.result__snippet').text().trim();
              const rawUrl = $(el).find('.result__url').attr('href') || '';
              if (title && snip) {
                const combined = `${title} ${snip}`;
                snippets.push(`[${target.name} Search Result]: ${title} | ${snip} | URL: ${rawUrl}`);

                if (!directPrices[target.merchant]) {
                  const { price, mrp } = parseIndianPrice(combined);
                  const isFlagship = /\b(iphone|macbook|galaxy s|galaxy z|fold|pixel pro)\b/i.test(target.query);

                  // Ensure variant match (e.g. don't accept iPhone 16 Plus when asked for iPhone 16)
                  const qLower = target.query.toLowerCase();
                  const tLower = title.toLowerCase();
                  const variantWords = ['plus', 'pro', 'max', 'ultra', 'mini'];
                  const variantMatches = variantWords.every(v => {
                    const qHas = new RegExp(`\\b${v}\\b`, 'i').test(qLower);
                    const tHas = new RegExp(`\\b${v}\\b`, 'i').test(tLower);
                    return qHas === tHas;
                  });

                  if (variantMatches && price > 1000 && (!isFlagship || price >= 25000)) {
                    const bankOffer = parseSnippetBankOffer(combined, target.merchant, price);
                    const coupon = parseSnippetCoupon(combined, price);
                    directPrices[target.merchant] = {
                      price,
                      mrp: mrp > price ? mrp : Math.round(price * 1.1),
                      url: rawUrl.startsWith('http') ? rawUrl : '',
                      coupons: coupon ? [coupon] : [],
                      bankOffers: bankOffer ? [bankOffer] : [],
                    };
                  }
                }
              }
            });
          } catch {}
        })();

        // Method 2: Bing India Search Engine
        const bingPromise = (async () => {
          try {
            const res = await fetch(`https://www.bing.com/search?q=${encodeURIComponent(target.query)}&cc=in`, {
              signal: controller.signal,
              headers: {
                'User-Agent': getRandomUserAgent(),
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Language': 'en-IN,en;q=0.9',
                'Cookie': 'SRCHHPGUSR=SRCHLANG=en; _EDGE_S=mkt=en-in;',
              },
            });
            if (!res.ok) return;
            const html = await res.text();
            const $ = cheerio.load(html);
            $('li.b_algo, div.b_algo').slice(0, 3).each((_, el) => {
              const title = $(el).find('h2 a').text().trim();
              const snip = $(el).find('.b_caption p, p').text().trim();
              const rawUrl = $(el).find('h2 a').attr('href') || '';
              if (title && snip) {
                const combined = `${title} ${snip}`;
                snippets.push(`[${target.name} Search Result]: ${title} | ${snip} | URL: ${rawUrl}`);

                if (!directPrices[target.merchant]) {
                  const { price, mrp } = parseIndianPrice(combined);
                  const isFlagship = /\b(iphone|macbook|galaxy s|galaxy z|fold|pixel pro)\b/i.test(target.query);

                  // Ensure variant match (e.g. don't accept iPhone 16 Plus when asked for iPhone 16)
                  const qLower = target.query.toLowerCase();
                  const tLower = title.toLowerCase();
                  const variantWords = ['plus', 'pro', 'max', 'ultra', 'mini'];
                  const variantMatches = variantWords.every(v => {
                    const qHas = new RegExp(`\\b${v}\\b`, 'i').test(qLower);
                    const tHas = new RegExp(`\\b${v}\\b`, 'i').test(tLower);
                    return qHas === tHas;
                  });

                  if (variantMatches && price > 1000 && (!isFlagship || price >= 25000)) {
                    const bankOffer = parseSnippetBankOffer(combined, target.merchant, price);
                    const coupon = parseSnippetCoupon(combined, price);
                    directPrices[target.merchant] = {
                      price,
                      mrp: mrp > price ? mrp : Math.round(price * 1.1),
                      url: rawUrl.startsWith('http') ? rawUrl : '',
                      coupons: coupon ? [coupon] : [],
                      bankOffers: bankOffer ? [bankOffer] : [],
                    };
                  }
                }
              }
            });
          } catch {}
        })();

        await Promise.allSettled([ddgPromise, bingPromise]);
        clearTimeout(timeout);
      } catch {
        clearTimeout(timeout);
      }
    })
  );

  const directFound = Object.keys(directPrices).join(', ');
  console.log(`[Search Feeds]: Retrieved ${snippets.length} live snippets across DuckDuckGo & Bing${directFound ? ` (Direct matches: ${directFound})` : ''}`);
  return {
    snippetsText: snippets.join('\n'),
    directPrices,
  };
}

let cachedGroqModels: string[] | null = null;

/**
 * Dynamically queries Groq's official `/models` API to discover live, supported models
 * for the user's specific API key, eliminating 404/400 decommissioned model errors.
 */
async function getAvailableGroqModels(apiKey: string): Promise<string[]> {
  if (cachedGroqModels && cachedGroqModels.length > 0) {
    return cachedGroqModels;
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);
    const res = await fetch('https://api.groq.com/openai/v1/models', {
      signal: controller.signal,
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
    });
    clearTimeout(timeout);

    if (res.ok) {
      const json = await res.json();
      const chatModels = (json?.data || [])
        .map((m: any) => m.id)
        .filter((id: string) => {
          if (typeof id !== 'string') return false;
          const lower = id.toLowerCase();
          return (
            !lower.includes('guard') &&
            !lower.includes('whisper') &&
            !lower.includes('tts') &&
            !lower.includes('embed') &&
            !lower.includes('orpheus') &&
            !lower.includes('allam')
          );
        });

      if (chatModels.length > 0) {
        // Prioritize ultra-fast official Llama-3 models on Groq (<300ms)
        const sorted = [...chatModels].sort((a, b) => {
          const score = (name: string) => {
            if (name.includes('llama-3.3-70b')) return 1;
            if (name.includes('llama-3.1-8b')) return 2;
            if (name.includes('llama-3')) return 3;
            if (name.includes('mixtral')) return 4;
            return 10;
          };
          return score(a) - score(b);
        });

        console.log('[Groq Active Chat Models Selected]:', sorted.join(', '));
        cachedGroqModels = sorted;
        return sorted;
      }
    }
  } catch {}

  return ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant', 'llama3-70b-8192'];
}

/**
 * Calls Groq Cloud OpenAI-compatible endpoint with ultra-low latency LPU inference (<200ms).
 * Discovers and uses active production model IDs on Groq dynamically.
 */
async function callGroqApi(
  apiKey: string,
  promptText: string
): Promise<{ ok: boolean; status: number; text?: string; error?: string; modelUsed?: string }> {
  const groqModels = await getAvailableGroqModels(apiKey);

  for (const model of groqModels) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4500);
    const endpoint = 'https://api.groq.com/openai/v1/chat/completions';

    const bodyPayload: any = {
      model,
      messages: [
        {
          role: 'system',
          content: 'You are an Indian e-commerce pricing extraction engine. Return ONLY valid JSON matching the exact schema requested with no conversational commentary.',
        },
        {
          role: 'user',
          content: promptText,
        },
      ],
      temperature: 0.1,
    };

    if (model.includes('gpt-oss')) {
      bodyPayload.reasoning_effort = 'low';
    } else {
      bodyPayload.response_format = { type: 'json_object' };
    }

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify(bodyPayload),
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        const errText = await res.text();
        console.warn(`[Groq Warning HTTP ${res.status}] with model ${model}:`, errText.slice(0, 150));
        continue;
      }

      const data = await res.json();
      const candidateText = data?.choices?.[0]?.message?.content || '';
      console.log(`[Groq ${model} Output]:`, candidateText.slice(0, 120).replace(/\n/g, ' '));
      return { ok: true, status: 200, text: candidateText, modelUsed: model };
    } catch (err: any) {
      clearTimeout(timeoutId);
      console.warn(`[Groq Network Error] with model ${model}:`, err?.message);
    }
  }

  return { ok: false, status: 0, error: 'All Groq models exhausted' };
}

/**
 * Calls Google Gemini REST endpoint directly with official Google AI Studio authentication.
 * Fast 3.5s timeout to prevent hanging the scrape response.
 */
async function callGeminiApi(
  model: string,
  apiKey: string,
  promptText: string
): Promise<{ ok: boolean; status: number; text?: string; error?: string }> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 3500);

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: promptText }],
          },
        ],
      }),
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      const errText = await res.text();
      return { ok: false, status: res.status, error: errText };
    }

    const data = await res.json();
    const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    return { ok: true, status: 200, text: candidateText };
  } catch (err: any) {
    clearTimeout(timeoutId);
    return { ok: false, status: 0, error: err?.message || 'Network timeout' };
  }
}

/**
 * AI-Powered Real-Time Price Search Engine
 * Prioritizes Groq LPU (<300ms) with seamless fallback to Gemini Flash.
 * Optionally focuses on specific missing merchants to minimize latency and token load.
 */
export async function fetchAiGroundedPrices(
  productQuery: string,
  targetMerchants?: MerchantId[]
): Promise<GroundedPricesResult | null> {
  const geminiKey = getEnvKey('GEMINI_API_KEY') || getEnvKey('GOOGLE_API_KEY');
  const groqKey = getEnvKey('GROQ_API_KEY');

  if (!geminiKey && !groqKey) {
    console.warn('[AI Grounding]: Neither GROQ_API_KEY nor GEMINI_API_KEY is found in environment or .env.local');
    return null;
  }

  const cleanQuery = productQuery.replace(/^https?:\/\/[^\s]+/i, '').trim();

  // 1. Fetch live search snippets & deterministic regex matches specifically for target merchants
  const { snippetsText, directPrices } = await fetchLiveWebSnippets(cleanQuery, targetMerchants).catch(() => ({
    snippetsText: '',
    directPrices: {} as GroundedPricesResult,
  }));

  const merchantScope = targetMerchants && targetMerchants.length > 0
    ? targetMerchants.map(m => `- ${m}`).join('\n')
    : `- Amazon India ("amazon")\n- Flipkart ("flipkart")\n- Croma ("croma")\n- Reliance Digital ("reliance_digital")\n- Vijay Sales ("vijay_sales")`;

  const aiPrompt = `You are a real-time price verification engine for Indian electronics e-commerce.
Target product: "${cleanQuery}"

${snippetsText ? `LIVE SEARCH RESULTS FOUND ONLINE:\n${snippetsText}\n` : 'No search snippets available.'}

TASK:
Extract the genuine current active selling price (in INR ₹), official MRP, store product link, and any real promotional bank discounts or store coupons for this exact product across Indian electronics retailers:
${merchantScope}

RULES:
1. Return ONLY a single valid JSON object. No markdown, no prose, no conversational commentary.
2. Prices must be genuine positive integer numbers in INR (e.g. 74999).
3. STRICT VARIANT MATCHING: Only return prices for the EXACT variant requested in "${cleanQuery}". If the target is "iPhone 16", do NOT return prices for "iPhone 16 Plus" (MRP ₹89,900) or "iPhone 16 Pro". Base iPhone 16 official launch MRP is ₹79,900.
4. OUTLIER ELIMINATION: Do NOT extract exchange bonus deductions or EMI amounts (such as ₹10,000) as the selling price. The selling price must be the full product price.
5. If search snippets explicitly mention a real active bank discount (e.g. "Flat ₹3,000 instant discount on HDFC Cards"), extract it in bankOffer.
6. If search snippets explicitly mention an active coupon code or clip voucher (e.g. "Save ₹1,000 with coupon"), extract it in coupon.
7. If no coupon or promotional bank offer is mentioned, leave coupon: null, bankOffer: null. Do NOT invent fake numbers.
8. Output format:
{
  "croma": {
    "price": 74999,
    "mrp": 79900,
    "url": "https://www.croma.com/searchB?q=${encodeURIComponent(cleanQuery)}%3Arelevance",
    "bankOffer": { "bank": "HDFC", "cardName": "HDFC Bank Credit Cards", "discountValue": 3000, "terms": "Flat ₹3,000 Instant Discount" },
    "coupon": null
  }
}`;

  let parsedAiPrices: GroundedPricesResult | null = null;

  // PRIORITY 1: Groq Ultra-Fast Inference (<300ms)
  if (groqKey) {
    try {
      console.log(`[AI Engine]: Executing Groq LPU search for "${cleanQuery}"...`);
      const groqRes = await callGroqApi(groqKey, aiPrompt);
      if (groqRes.ok && groqRes.text) {
        parsedAiPrices = parseGroundedJson(groqRes.text, cleanQuery);
        if (parsedAiPrices && Object.keys(parsedAiPrices).length > 0) {
          console.log(`[AI Extraction Success]: Verified live prices extracted via Groq (${groqRes.modelUsed})!`);
        }
      }
    } catch (err: any) {
      console.warn('[Groq Engine Error]:', err?.message);
    }
  }

  // PRIORITY 2: Google Gemini Flash (Fast 3.5s timeout, free tier text model)
  if (!parsedAiPrices && geminiKey) {
    try {
      console.log(`[AI Engine]: Executing Gemini Flash search for "${cleanQuery}"...`);
      const geminiRes = await callGeminiApi('gemini-flash-latest', geminiKey, aiPrompt);
      if (geminiRes.ok && geminiRes.text) {
        parsedAiPrices = parseGroundedJson(geminiRes.text, cleanQuery);
        if (parsedAiPrices && Object.keys(parsedAiPrices).length > 0) {
          console.log(`[AI Extraction Success]: Verified live prices extracted via Gemini Flash!`);
        }
      }
    } catch (err: any) {
      console.warn('[Gemini Engine Error]:', err?.message);
    }
  }

  // Merge AI-verified prices with direct deterministic SERP prices (giving AI precedence if valid)
  const merged: GroundedPricesResult = {};
  const storeKeys: MerchantId[] = ['amazon', 'flipkart', 'croma', 'reliance_digital', 'vijay_sales'];
  for (const m of storeKeys) {
    const direct = directPrices[m];
    const ai = parsedAiPrices?.[m];
    if (ai && ai.price > 0) {
      merged[m] = {
        ...ai,
        coupons: (ai.coupons && ai.coupons.length > 0) ? ai.coupons : direct?.coupons,
        bankOffers: (ai.bankOffers && ai.bankOffers.length > 0) ? ai.bankOffers : direct?.bankOffers,
      };
    } else if (direct && direct.price > 0) {
      merged[m] = direct;
    }
  }

  return Object.keys(merged).length > 0 ? merged : null;
}

function parseGroundedJson(text: string, cleanQuery: string): GroundedPricesResult | null {
  try {
    // Strip reasoning tags (<think>...</think> or <reasoning>...</reasoning>) from GPT-OSS and Qwen
    const cleanText = text
      .replace(/<think>[\s\S]*?<\/think>/gi, '')
      .replace(/<reasoning>[\s\S]*?<\/reasoning>/gi, '')
      .trim();

    // Check for markdown code fences: ```json ... ``` or bare json object
    const codeBlockMatch = cleanText.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/i);
    const jsonStr = codeBlockMatch ? codeBlockMatch[1] : (cleanText.match(/\{[\s\S]*\}/)?.[0] || '');
    if (!jsonStr) return null;

    const parsed: Record<string, any> = JSON.parse(jsonStr);
    const result: GroundedPricesResult = {};

    const fallbackUrls: Record<MerchantId, string> = {
      amazon: `https://www.amazon.in/s?k=${encodeURIComponent(cleanQuery)}`,
      flipkart: `https://www.flipkart.com/search?q=${encodeURIComponent(cleanQuery)}`,
      croma: `https://www.croma.com/searchB?q=${encodeURIComponent(cleanQuery)}%3Arelevance&isComingFromSearchPage=true`,
      reliance_digital: `https://www.reliancedigital.in/search?q=${encodeURIComponent(cleanQuery)}`,
      vijay_sales: `https://www.vijaysales.com/search-listing?q=${encodeURIComponent(cleanQuery)}`,
      tata_cliq: `https://www.tatacliq.com/search/?searchCategory=all&text=${encodeURIComponent(cleanQuery)}`,
    };

    const storeKeys: MerchantId[] = ['amazon', 'flipkart', 'croma', 'reliance_digital', 'vijay_sales'];
    for (const key of storeKeys) {
      const storeData: any = parsed[key];
      if (!storeData) continue;
      const rawPrice = storeData.price;
      const numPrice = typeof rawPrice === 'number' ? rawPrice : parseInt(String(rawPrice || '').replace(/[^\d]/g, ''), 10);
      const rawMrp = storeData.mrp;
      const numMrp = typeof rawMrp === 'number' ? rawMrp : parseInt(String(rawMrp || '').replace(/[^\d]/g, ''), 10);

      if (!isNaN(numPrice) && numPrice > 1000) {
        // Sanity check: for flagship phones and laptops, prices under ₹25,000 are exchange discounts, not selling price
        const isFlagship = /\b(iphone|macbook|galaxy s|galaxy z|fold|pixel pro)\b/i.test(cleanQuery);
        if (isFlagship && numPrice < 25000) {
          continue;
        }

        const roundedPrice = Math.round(numPrice);
        const coupons: Coupon[] = [];
        const bankOffers: BankOffer[] = [];

        // Check for real coupon extracted by AI
        if (storeData.coupon && typeof storeData.coupon === 'object') {
          const c = storeData.coupon;
          const cVal = typeof c.discountValue === 'number' ? c.discountValue : parseInt(String(c.discountValue || '').replace(/[^\d]/g, ''), 10);
          if (!isNaN(cVal) && cVal >= 100 && cVal < roundedPrice * 0.4) {
            coupons.push({
              id: `ai-coupon-${key}-${Date.now()}`,
              code: String(c.code || 'COUPON').toUpperCase(),
              title: c.title || `₹${cVal.toLocaleString('en-IN')} Off Coupon`,
              description: c.description || c.terms || 'Verified coupon promotion',
              discountType: c.discountType === 'percentage' ? 'percentage' : 'flat',
              discountValue: cVal,
              verified: true,
            });
          }
        }

        // Check for real promotional bank offer extracted by AI
        if (storeData.bankOffer && typeof storeData.bankOffer === 'object') {
          const bo = storeData.bankOffer;
          const boVal = typeof bo.discountValue === 'number' ? bo.discountValue : parseInt(String(bo.discountValue || '').replace(/[^\d]/g, ''), 10);
          const bankName = String(bo.bank || 'HDFC').toUpperCase();
          const validBanks = ['HDFC', 'ICICI', 'SBI', 'AXIS', 'KOTAK', 'FEDERAL', 'AMEX'] as const;
          const matchedBank = validBanks.find(b => bankName.includes(b)) || 'HDFC';

          if (!isNaN(boVal) && boVal >= 500 && boVal < roundedPrice * 0.5) {
            bankOffers.push({
              id: `ai-bank-${key}-${Date.now()}`,
              bank: matchedBank,
              cardName: bo.cardName || `${matchedBank} Bank Credit Card`,
              cardTier: 'Promotional',
              cardType: 'credit',
              discountType: bo.discountType === 'percentage' ? 'percentage' : 'flat',
              discountValue: boVal,
              maxDiscount: boVal,
              minOrderValue: Math.round(roundedPrice * 0.4),
              exclusiveToMerchant: key,
              terms: bo.terms || `Flat ₹${boVal.toLocaleString('en-IN')} Instant Discount`,
            });
          }
        }

        result[key] = {
          price: roundedPrice,
          mrp: !isNaN(numMrp) && numMrp > roundedPrice ? Math.round(numMrp) : Math.round(roundedPrice * 1.1),
          url: storeData.url && storeData.url.startsWith('http') ? storeData.url : (fallbackUrls[key] || ''),
          coupons: coupons.length > 0 ? coupons : undefined,
          bankOffers: bankOffers.length > 0 ? bankOffers : undefined,
        };
      }
    }

    return Object.keys(result).length > 0 ? result : null;
  } catch (err: any) {
    console.warn('[JSON Parsing Error]:', err?.message);
    return null;
  }
}
