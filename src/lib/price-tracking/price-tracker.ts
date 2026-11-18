import { Product, PriceHistoryPoint } from '../../types';

export interface PriceIntelligenceVerdict {
  recommendation: 'STRONG_BUY' | 'GOOD_DEAL' | 'FAIR_PRICE' | 'WAIT';
  badgeText: string;
  badgeClass: string;
  reason: string;
  differenceFromAvg: number;
  percentFromHigh: number;
  isAllTimeLow: boolean;
}

export interface PriceAlertSubscription {
  id: string;
  productId: string;
  productTitle: string;
  targetPrice: number;
  currentPrice: number;
  contact: string;
  channel: 'WHATSAPP' | 'EMAIL';
  createdAt: string;
  active: boolean;
}

/**
 * Computes dynamic price signals, moving averages, and buy recommendations
 * based on current multi-store listings vs historical price movements.
 */
export function analyzeProductPrice(product: Product): {
  currentBestPrice: number;
  allTimeLow: number;
  allTimeHigh: number;
  movingAverage: number;
  verdict: PriceIntelligenceVerdict;
} {
  const currentPrices = product.listings
    .map((l) => l.listedPrice)
    .filter((p) => p > 0);

  const currentBestPrice = currentPrices.length > 0
    ? Math.min(...currentPrices)
    : product.lowestHistoricalPrice || 50000;

  const historyPoints = product.priceHistory || [];
  const historicalPrices: number[] = [];

  historyPoints.forEach((pt) => {
    if (pt.flipkartPrice > 0) historicalPrices.push(pt.flipkartPrice);
    if (pt.amazonPrice > 0) historicalPrices.push(pt.amazonPrice);
    if (pt.cromaPrice && pt.cromaPrice > 0) historicalPrices.push(pt.cromaPrice);
  });

  const allRecordedPrices = [...historicalPrices, currentBestPrice];
  const allTimeLow = Math.min(...allRecordedPrices);
  const allTimeHigh = Math.max(...allRecordedPrices);

  const movingAverage = Math.round(
    allRecordedPrices.reduce((sum, p) => sum + p, 0) / Math.max(1, allRecordedPrices.length)
  );

  const diffFromAvg = currentBestPrice - movingAverage;
  const percentFromHigh = allTimeHigh > 0
    ? Math.round(((allTimeHigh - currentBestPrice) / allTimeHigh) * 100)
    : 0;

  const isAllTimeLow = currentBestPrice <= allTimeLow * 1.015;

  let verdict: PriceIntelligenceVerdict;

  if (isAllTimeLow) {
    verdict = {
      recommendation: 'STRONG_BUY',
      badgeText: '🔥 ALL-TIME LOW',
      badgeClass: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30',
      reason: `Record low price! Current price ₹${currentBestPrice.toLocaleString('en-IN')} matches the lowest ever recorded price.`,
      differenceFromAvg: diffFromAvg,
      percentFromHigh,
      isAllTimeLow: true,
    };
  } else if (currentBestPrice < movingAverage) {
    const savings = Math.abs(diffFromAvg);
    verdict = {
      recommendation: 'GOOD_DEAL',
      badgeText: ' GOOD DEAL',
      badgeClass: 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30',
      reason: `Priced ₹${savings.toLocaleString('en-IN')} below the 180-day market average (₹${movingAverage.toLocaleString('en-IN')}).`,
      differenceFromAvg: diffFromAvg,
      percentFromHigh,
      isAllTimeLow: false,
    };
  } else if (Math.abs(diffFromAvg) / movingAverage <= 0.03) {
    verdict = {
      recommendation: 'FAIR_PRICE',
      badgeText: '⚖️ FAIR MARKET PRICE',
      badgeClass: 'bg-slate-500/15 text-slate-700 dark:text-slate-300 border border-slate-500/30',
      reason: `Current price is in line with the historical baseline average of ₹${movingAverage.toLocaleString('en-IN')}.`,
      differenceFromAvg: diffFromAvg,
      percentFromHigh,
      isAllTimeLow: false,
    };
  } else {
    const inflated = diffFromAvg;
    verdict = {
      recommendation: 'WAIT',
      badgeText: '⚠️ WAIT FOR DROP',
      badgeClass: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30',
      reason: `Currently ₹${inflated.toLocaleString('en-IN')} above average. Consider waiting for upcoming sale discounts.`,
      differenceFromAvg: diffFromAvg,
      percentFromHigh,
      isAllTimeLow: false,
    };
  }

  return {
    currentBestPrice,
    allTimeLow,
    allTimeHigh,
    movingAverage,
    verdict,
  };
}

/**
 * Filter price history points by selected timeframe
 */
export function filterHistoryByTimeframe(
  points: PriceHistoryPoint[],
  timeframe: '30D' | '90D' | '180D'
): PriceHistoryPoint[] {
  if (!points || points.length === 0) return [];
  const days = timeframe === '30D' ? 30 : timeframe === '90D' ? 90 : 180;
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;

  const filtered = points.filter((p) => new Date(p.date).getTime() >= cutoff);
  return filtered.length > 0 ? filtered : points;
}
