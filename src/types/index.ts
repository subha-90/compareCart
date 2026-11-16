export type MerchantId = 'flipkart' | 'amazon' | 'croma' | 'reliance_digital' | 'vijay_sales' | 'tata_cliq';

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
  /** Set to true when scraping was blocked and no accurate price data is available */
  priceUnavailable?: boolean;
  /** Data source label for transparency */
  dataSource?: 'live_scrape' | 'market_index' | 'blocked';
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
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  createdAt: string;
  estimatedDelivery: string;
  returnWindowEndDate: string;
}

export interface CartItem {
  id: string;
  product: Product;
  selectedDeal: OptimizedDeal;
  quantity: number;
  addedAt: string;
}

export type FRMRiskTier = 'TIER_1_LOW' | 'TIER_2_MODERATE' | 'TIER_3_ELEVATED' | 'CRITICAL_HIGH';

export interface FRMRiskAssessment {
  overallScore: number; // 0 (safest) - 100 (high fraud risk)
  riskTier: FRMRiskTier;
  cibilScore: number; // 300 - 900
  cibilStatus: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR';
  panVerified: boolean;
  panHolderName: string;
  aadhaarVerified: boolean;
  pennyDropMatched: boolean;
  pennyDropAccountHolder: string;
  pennyDropMatchScore: number; // 0 - 100%
  amlSanctionsClean: boolean;
  velocityRiskScore: number; // 0 - 100
  hourlySwipeVelocity: number;
  dailySwipeGmv: number;
  disputeReservePercentage: number; // default 5% rolling reserve
  flags: string[];
}

export interface FRMRuleConfig {
  maxDailyGmvPerCard: number;
  maxHourlySwipes: number;
  minCibilScore: number;
  mandatoryPennyDrop: boolean;
  reserveRatioPercent: number;
  stepUpVerificationAboveGmv: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  role: 'user' | 'partner' | 'admin';
  kycVerified: boolean;
  city: string;
}

export interface PartnerOnboardingRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  panNumber: string;
  aadhaarMasked: string;
  employmentType: 'SALARIED' | 'SELF_EMPLOYED' | 'BUSINESS';
  monthlyIncome: number;
  bankAccount: string;
  ifsc: string;
  bankName: string;
  initialCardBank: string;
  initialCardName: string;
  initialCardLast4: string;
  initialCardLimit: number;
  billingCycleDay: number;
  cardStatementUploaded: boolean;
  frmAssessment: FRMRiskAssessment;
  status: 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED' | 'STEP_UP_REQUIRED';
  submittedAt: string;
  rejectionReason?: string;
  adminNotes?: string;
}

export interface CustomerOnboardingRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  kycStatus: 'VERIFIED' | 'PENDING' | 'TIER_1';
  totalOrders: number;
  totalSaved: number;
  joinedAt: string;
}
