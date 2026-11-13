import { Product, MerchantListing, OptimizedDeal, Coupon, BankOffer, MerchantId } from '../types';

export const MERCHANT_METADATA: Record<MerchantId, { name: string; logoText: string; color: string; badge: string }> = {
  flipkart: { name: 'Flipkart', logoText: 'FK', color: '#2874f0', badge: 'SuperCoins Eligible' },
  amazon: { name: 'Amazon India', logoText: 'AZ', color: '#ff9900', badge: 'Prime Available' },
  croma: { name: 'Croma', logoText: 'CR', color: '#00e5d4', badge: 'Tata Neu NeuCoins' },
  reliance_digital: { name: 'Reliance Digital', logoText: 'RD', color: '#e42529', badge: 'InstaDelivery' },
  tata_cliq: { name: 'Tata CLiQ', logoText: 'TC', color: '#9d1e57', badge: 'CLiQ Luxury' },
};

/**
 * High-Throughput Deal Optimization Engine
 * Calculates the exact Effective Price:
 * Effective Price = Listed Price + Shipping - Best Coupon - Best Bank Discount
 * Also calculates the PiePay Partner Card scenario when buyer lacks the card.
 */
export function optimizeListing(listing: MerchantListing): OptimizedDeal {
  const meta = MERCHANT_METADATA[listing.merchantId];

  // 1. Find Best Coupon
  let bestCoupon: Coupon | undefined = undefined;
  let maxCouponDiscount = 0;

  for (const coupon of listing.availableCoupons) {
    if (coupon.minOrderValue && listing.listedPrice < coupon.minOrderValue) continue;

    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = (listing.listedPrice * coupon.discountValue) / 100;
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else {
      discount = coupon.discountValue;
    }

    if (discount > maxCouponDiscount) {
      maxCouponDiscount = discount;
      bestCoupon = coupon;
    }
  }

  // Price after coupon
  const priceAfterCoupon = Math.max(0, listing.listedPrice - maxCouponDiscount);

  // 2. Find Best Bank Offer (Self-card mode)
  let bestBankOffer: BankOffer | undefined = undefined;
  let maxBankDiscount = 0;

  for (const offer of listing.applicableBankOffers) {
    if (offer.minOrderValue && priceAfterCoupon < offer.minOrderValue) continue;

    let discount = 0;
    if (offer.discountType === 'percentage') {
      discount = (priceAfterCoupon * offer.discountValue) / 100;
      if (offer.maxDiscount && discount > offer.maxDiscount) {
        discount = offer.maxDiscount;
      }
    } else {
      discount = offer.discountValue;
    }

    if (discount > maxBankDiscount) {
      maxBankDiscount = discount;
      bestBankOffer = offer;
    }
  }

  const effectiveSelfPrice = Math.max(0, priceAfterCoupon - maxBankDiscount + listing.shippingCost);

  // 3. Calculate CompareCart Partner Card Model
  // Enables the customer to capture the best card discount via a verified partner cardholder.
  // Standard split:
  // - Buyer gets ~70% of gross discount
  // - Cardholder gets ~18% cash incentive + milestone/reward points
  // - Platform takes ~12% service fee
  const partnerCardEligible = maxBankDiscount > 0;
  const buyerSavings = Math.round(maxBankDiscount * 0.70);
  const cardholderCommission = Math.round(maxBankDiscount * 0.18);
  const platformFee = maxBankDiscount - buyerSavings - cardholderCommission;
  
  const partnerFinalEffectivePrice = Math.max(
    0,
    listing.listedPrice - maxCouponDiscount - buyerSavings + listing.shippingCost
  );

  return {
    merchantId: listing.merchantId,
    merchantName: meta.name,
    listedPrice: listing.listedPrice,
    mrp: listing.mrp,
    shippingCost: listing.shippingCost,
    effectiveDiscountTotal: (listing.mrp - effectiveSelfPrice),
    appliedCoupon: bestCoupon,
    couponDiscount: maxCouponDiscount,
    bestBankOffer: bestBankOffer,
    bankDiscount: maxBankDiscount,
    effectiveSelfPrice: effectiveSelfPrice,
    partnerCardEligible: partnerCardEligible,
    partnerCard: bestBankOffer,
    grossBankDiscount: maxBankDiscount,
    buyerSavings: buyerSavings,
    cardholderCommission: cardholderCommission,
    platformFee: platformFee,
    partnerFinalEffectivePrice: partnerFinalEffectivePrice,
    isOverallBest: false, // Calculated by optimizeProductDeals across merchants
  };
}

/**
 * Optimizes all listings for a product and determines the absolute winner
 */
export function optimizeProductDeals(product: Product): OptimizedDeal[] {
  const deals = product.listings.map(listing => optimizeListing(listing));
  
  // Find minimum effective price
  let minEffectivePrice = Infinity;
  let bestIndex = -1;

  deals.forEach((deal, idx) => {
    // We evaluate by partnerFinalEffectivePrice or effectiveSelfPrice
    const priceToCompare = deal.partnerCardEligible ? deal.partnerFinalEffectivePrice : deal.effectiveSelfPrice;
    if (priceToCompare < minEffectivePrice) {
      minEffectivePrice = priceToCompare;
      bestIndex = idx;
    }
  });

  if (bestIndex !== -1) {
    deals[bestIndex].isOverallBest = true;
  }

  // Sort ascending by effective price
  return deals.sort((a, b) => {
    const pA = a.partnerCardEligible ? a.partnerFinalEffectivePrice : a.effectiveSelfPrice;
    const pB = b.partnerCardEligible ? b.partnerFinalEffectivePrice : b.effectiveSelfPrice;
    return pA - pB;
  });
}
