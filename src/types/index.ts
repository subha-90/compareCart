export type MerchantId = 'flipkart' | 'amazon' | 'croma' | 'reliance_digital' | 'tata_cliq';

export interface MerchantInfo {
  id: MerchantId;
  name: string;
  logo: string;
  badge?: string;
  accentColor: string;
}

export interface Coupon {
  id: string;
  code: string;
  title: string;
  description: string;
  discountType: 'percentage' | 'flat';
  discountValue: number;
  maxDiscount?: number;
  minOrderValue?: number;
  verified: boolean;
  expiresInDays?: number;
}

export interface BankOffer {
  id: string;
  bank: 'HDFC' | 'ICICI' | 'AXIS' | 'SBI' | 'KOTAK' | 'AMEX' | 'FEDERAL';
  cardName: string;
  cardTier: string;
  cardType: 'credit' | 'debit';
  discountType: 'percentage' | 'flat';
  discountValue: number; // e.g. 10 for 10% or 3000 for flat 3000
  maxDiscount: number;
  minOrderValue: number;
  exclusiveToMerchant?: MerchantId;
  terms: string;
  rewardMultiplier?: string; // e.g. "5x Edge Points"
}

export interface MerchantListing {
  merchantId: MerchantId;
  url: string;
  listedPrice: number;
  mrp: number;
  shippingCost: number;
  deliveryDays: number;
  inStock: boolean;
  rating: number;
  ratingCount: number;
  sellerName: string;
  isAssured: boolean;
  availableCoupons: Coupon[];
  applicableBankOffers: BankOffer[];
}

export interface PriceHistoryPoint {
  date: string; // YYYY-MM-DD
  flipkartPrice: number;
  amazonPrice: number;
  cromaPrice: number;
  event?: string; // e.g., 'Big Billion Days', 'Great Indian Festival', 'Price Drop'
}

export interface Product {
  id: string;
  title: string;
  category: 'smartphones' | 'laptops' | 'audio' | 'televisions' | 'appliances';
  brand: string;
  image: string;
  images: string[];
  specs: Record<string, string>;
  highlights: string[];
  lowestHistoricalPrice: number;
  highestHistoricalPrice: number;
  averageHistoricalPrice: number;
  priceDropPercentage: number;
  buyRecommendation: 'STRONG_BUY' | 'FAIR_PRICE' | 'WAIT_FOR_DROP';
  buyRecommendationReason: string;
  priceHistory: PriceHistoryPoint[];
  listings: MerchantListing[];
}

export interface OptimizedDeal {
  merchantId: MerchantId;
  merchantName: string;
  listedPrice: number;
  mrp: number;
  shippingCost: number;
  effectiveDiscountTotal: number;
  
  // Coupon breakdown
  appliedCoupon?: Coupon;
  couponDiscount: number;
  
  // Bank offer breakdown (if user has card)
  bestBankOffer?: BankOffer;
  bankDiscount: number;
  
  // Effective price if buying with user's own card
  effectiveSelfPrice: number;
  
  // Partner Card Network breakdown (if user lacks the card)
  partnerCardEligible: boolean;
  partnerCard?: BankOffer;
  grossBankDiscount: number;
  buyerSavings: number; // e.g. 70% of gross discount
  cardholderCommission: number; // e.g. 18% of gross discount
  platformFee: number; // e.g. 12% of gross discount
  partnerFinalEffectivePrice: number; // listedPrice - couponDiscount - buyerSavings
  
  isOverallBest: boolean;
}

export interface PartnerCardholder {
  id: string;
  name: string;
  avatar: string;
  city: string;
  trustScore: number; // 0-100
  kycVerified: boolean;
  cardsHeld: {
    id: string;
    bank: string;
    cardName: string;
    last4: string;
    network: 'VISA' | 'MASTERCARD' | 'RUPAY';
    monthlyLimit: number;
    availableLimit: number;
    billingCycleDate: number;
    rewardPreference: string;
  }[];
  totalOrdersFulfilled: number;
  totalEarnings: number;
  rewardPointsEarned: number;
  status: 'ACTIVE' | 'BUSY' | 'OFFLINE';
}

export type EscrowOrderStatus = 
  | 'MATCHING_CARDHOLDER'
  | 'ESCROW_DEPOSITED'
  | 'ORDER_PLACING'
  | 'MERCHANT_CONFIRMED'
  | 'DISPATCHED'
  | 'DELIVERED'
  | 'RETURN_WINDOW_CLOSED'
  | 'SETTLED'
  | 'CANCELLED'
  | 'DISPUTED';

export interface EscrowOrder {
  id: string;
  orderNumber: string;
  productId: string;
  productTitle: string;
  productImage: string;
  merchantId: MerchantId;
  buyerName: string;
  buyerPhone: string;
  buyerAddress: {
    line1: string;
    city: string;
    state: string;
    pincode: string;
  };
  listedPrice: number;
  effectivePricePaid: number;
  totalSavings: number;
  paymentMode: 'SELF_CARD' | 'PARTNER_ESCROW_UPI';
  
  // Partner attribution (Partner Card Network)
  partnerId?: string;
  partnerName?: string;
  partnerCardUsed?: string;
  cardholderCommission?: number;
  platformFee?: number;
  
  status: EscrowOrderStatus;
  merchantOrderRef?: string;
  awbTrackingNumber?: string;
  createdAt: string;
  estimatedDelivery: string;
  returnWindowEndDate: string;
}
