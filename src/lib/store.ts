'use client';

import { useState, useEffect } from 'react';
import {
  Product,
  PartnerCardholder,
  EscrowOrder,
  OptimizedDeal,
  UserProfile,
  CartItem,
  PartnerOnboardingRequest,
  CustomerOnboardingRecord,
  FRMRuleConfig,
} from '../types';
import { SAMPLE_PRODUCTS, MOCK_PARTNER_CARDHOLDERS, INITIAL_ORDERS } from './mock-data';
import { optimizeProductDeals } from './deal-engine';
import { DEFAULT_FRM_CONFIG, evaluateFRMRisk } from './frm/frm-engine';
import { SupabaseService } from './supabase-service';

export interface SystemMetrics {
  totalSavingsDelivered: number;
  totalOrdersProcessed: number;
  activeCardholders: number;
  escrowPoolValue: number;
  avgComputeLatencyMs: number;
  cacheHitRatio: number;
}

export const MOCK_PROFILES: Record<'user' | 'partner' | 'admin', UserProfile> = {
  user: {
    id: 'u-101',
    name: 'Rahul Deshmukh',
    email: 'rahul.d@gmail.com',
    phone: '+91 98201 44521',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    role: 'user',
    kycVerified: true,
    city: 'Bengaluru',
  },
  partner: {
    id: 'p-1',
    name: 'Vikramaditya Rao',
    email: 'vikram.rao@fintech.in',
    phone: '+91 98450 11234',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    role: 'partner',
    kycVerified: true,
    city: 'Mumbai',
  },
  admin: {
    id: 'adm-001',
    name: 'Dr. Arvind Swaminathan',
    email: 'arvind.admin@comparecart.in',
    phone: '+91 98110 99887',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    role: 'admin',
    kycVerified: true,
    city: 'New Delhi',
  },
};

export const INITIAL_PARTNER_REQUESTS: PartnerOnboardingRequest[] = [
  {
    id: 'req-301',
    name: 'Ananya Singhania',
    email: 'ananya.singh@outlook.com',
    phone: '+91 97112 34567',
    city: 'Hyderabad',
    panNumber: 'ABCPS1234F',
    aadhaarMasked: '•••• •••• 4591',
    employmentType: 'SALARIED',
    monthlyIncome: 240000,
    bankAccount: '50100234892110',
    ifsc: 'HDFC0001234',
    bankName: 'HDFC Bank Ltd',
    initialCardBank: 'HDFC Bank',
    initialCardName: 'HDFC Infinia Metal Card',
    initialCardLast4: '9921',
    initialCardLimit: 500000,
    billingCycleDay: 15,
    cardStatementUploaded: true,
    frmAssessment: {
      overallScore: 12,
      riskTier: 'TIER_1_LOW',
      cibilScore: 815,
      cibilStatus: 'EXCELLENT',
      panVerified: true,
      panHolderName: 'ANANYA SINGHANIA',
      aadhaarVerified: true,
      pennyDropMatched: true,
      pennyDropAccountHolder: 'ANANYA SINGHANIA',
      pennyDropMatchScore: 100,
      amlSanctionsClean: true,
      velocityRiskScore: 6,
      hourlySwipeVelocity: 0,
      dailySwipeGmv: 0,
      disputeReservePercentage: 5,
      flags: [],
    },
    status: 'PENDING_APPROVAL',
    submittedAt: '2026-11-14T10:15:00Z',
  },
  {
    id: 'req-302',
    name: 'Rohan Mehra',
    email: 'rohan.mehra@techcorp.com',
    phone: '+91 98234 56789',
    city: 'Pune',
    panNumber: 'BKRPM9876K',
    aadhaarMasked: '•••• •••• 8820',
    employmentType: 'BUSINESS',
    monthlyIncome: 120000,
    bankAccount: '91201004561102',
    ifsc: 'UTIB0000456',
    bankName: 'Axis Bank Ltd',
    initialCardBank: 'Axis Bank',
    initialCardName: 'Flipkart Axis Bank Credit Card',
    initialCardLast4: '4410',
    initialCardLimit: 250000,
    billingCycleDay: 20,
    cardStatementUploaded: true,
    frmAssessment: {
      overallScore: 28,
      riskTier: 'TIER_2_MODERATE',
      cibilScore: 742,
      cibilStatus: 'GOOD',
      panVerified: true,
      panHolderName: 'ROHAN MEHRA',
      aadhaarVerified: true,
      pennyDropMatched: true,
      pennyDropAccountHolder: 'ROHAN MEHRA',
      pennyDropMatchScore: 100,
      amlSanctionsClean: true,
      velocityRiskScore: 14,
      hourlySwipeVelocity: 0,
      dailySwipeGmv: 0,
      disputeReservePercentage: 5,
      flags: ['BUSINESS_LEVERAGE_MONITORING'],
    },
    status: 'PENDING_APPROVAL',
    submittedAt: '2026-11-14T11:45:00Z',
  },
  {
    id: 'req-303',
    name: 'Kavita Sundaram',
    email: 'kavita.s@chennaicorp.in',
    phone: '+91 98401 22334',
    city: 'Chennai',
    panNumber: 'CXDPS4412M',
    aadhaarMasked: '•••• •••• 3144',
    employmentType: 'SALARIED',
    monthlyIncome: 65000,
    bankAccount: '00120150998811',
    ifsc: 'ICIC0000012',
    bankName: 'ICICI Bank Ltd',
    initialCardBank: 'ICICI Bank',
    initialCardName: 'Amazon Pay ICICI Card',
    initialCardLast4: '3120',
    initialCardLimit: 300000,
    billingCycleDay: 5,
    cardStatementUploaded: true,
    frmAssessment: {
      overallScore: 58,
      riskTier: 'TIER_3_ELEVATED',
      cibilScore: 685,
      cibilStatus: 'FAIR',
      panVerified: true,
      panHolderName: 'KAVITA SUNDARAM',
      aadhaarVerified: true,
      pennyDropMatched: true,
      pennyDropAccountHolder: 'KAVITA SUNDARAM',
      pennyDropMatchScore: 100,
      amlSanctionsClean: true,
      velocityRiskScore: 22,
      hourlySwipeVelocity: 0,
      dailySwipeGmv: 0,
      disputeReservePercentage: 8,
      flags: ['SUB_700_CIBIL_SCORE', 'HIGH_LIMIT_LEVERAGE_DISPROPORTION'],
    },
    status: 'STEP_UP_REQUIRED',
    submittedAt: '2026-11-15T08:30:00Z',
    adminNotes: 'Requested 3-month bank statement to verify declared income against credit card limit.',
  },
];

export const INITIAL_CUSTOMERS: CustomerOnboardingRecord[] = [
  {
    id: 'cust-1',
    name: 'Rahul Deshmukh',
    email: 'rahul.d@gmail.com',
    phone: '+91 98201 44521',
    city: 'Bengaluru',
    kycStatus: 'VERIFIED',
    totalOrders: 4,
    totalSaved: 38400,
    joinedAt: '2026-08-12',
  },
  {
    id: 'cust-2',
    name: 'Pooja Bhattacharya',
    email: 'pooja.b@corp.in',
    phone: '+91 98300 23456',
    city: 'Kolkata',
    kycStatus: 'VERIFIED',
    totalOrders: 2,
    totalSaved: 19800,
    joinedAt: '2026-09-01',
  },
  {
    id: 'cust-3',
    name: 'Sameer Kulkarni',
    email: 'sameer.k@startup.io',
    phone: '+91 98220 87654',
    city: 'Pune',
    kycStatus: 'TIER_1',
    totalOrders: 1,
    totalSaved: 8500,
    joinedAt: '2026-10-18',
  },
];

class CompareCartStore {
  private products: Product[] = SAMPLE_PRODUCTS;
  private partners: PartnerCardholder[] = MOCK_PARTNER_CARDHOLDERS;
  private orders: EscrowOrder[] = INITIAL_ORDERS;
  private currentRole: 'user' | 'partner' | 'admin' = 'user';
  private currentProfile: UserProfile = MOCK_PROFILES.user;
  private cartItems: CartItem[] = [];
  private lovedProductIds: Set<string> = new Set(['1', '4']); // default loved: iPhone 16 & Sony XM5
  private partnerRequests: PartnerOnboardingRequest[] = INITIAL_PARTNER_REQUESTS;
  private customers: CustomerOnboardingRecord[] = INITIAL_CUSTOMERS;
  private frmConfig: FRMRuleConfig = DEFAULT_FRM_CONFIG;
  private listeners: (() => void)[] = [];

  constructor() {
    if (typeof window !== 'undefined') {
      // Sync initial orders from Supabase PostgreSQL
      SupabaseService.fetchEscrowOrders().then(dbOrders => {
        if (dbOrders && dbOrders.length > 0) {
          this.orders = dbOrders;
          this.notify();
        }
      });

      // Subscribe to real-time order state updates via WebSockets
      SupabaseService.subscribeToOrders(() => {
        SupabaseService.fetchEscrowOrders().then(dbOrders => {
          if (dbOrders && dbOrders.length > 0) {
            this.orders = dbOrders;
            this.notify();
          }
        });
      });
    }
  }

  public getProducts(): Product[] {
    return this.products;
  }

  public getProductById(id: string): Product | undefined {
    return this.products.find(p => p.id === id);
  }

  public getPartners(): PartnerCardholder[] {
    return this.partners;
  }

  public getOrders(): EscrowOrder[] {
    return this.orders;
  }

  public getCurrentProfile(): UserProfile {
    return this.currentProfile;
  }

  public getCartItems(): CartItem[] {
    return this.cartItems;
  }

  public getLovedProductIds(): string[] {
    return Array.from(this.lovedProductIds);
  }

  public getPartnerRequests(): PartnerOnboardingRequest[] {
    return this.partnerRequests;
  }

  public getCustomers(): CustomerOnboardingRecord[] {
    return this.customers;
  }

  public switchProfile(role: 'user' | 'partner' | 'admin') {
    this.currentRole = role;
    this.currentProfile = MOCK_PROFILES[role];
    this.notify();
  }

  public loginAs(role: 'user' | 'partner' | 'admin') {
    this.currentRole = role;
    this.currentProfile = MOCK_PROFILES[role];
    this.notify();
  }

  public logout() {
    this.currentRole = 'user';
    this.currentProfile = MOCK_PROFILES.user;
    this.notify();
  }

  public toggleLovedProduct(productId: string) {
    if (this.lovedProductIds.has(productId)) {
      this.lovedProductIds.delete(productId);
    } else {
      this.lovedProductIds.add(productId);
    }
    this.notify();
  }

  public addToCart(product: Product, selectedDeal: OptimizedDeal) {
    const existing = this.cartItems.find(item => item.product.id === product.id && item.selectedDeal.merchantId === selectedDeal.merchantId);
    if (existing) {
      existing.quantity += 1;
    } else {
      this.cartItems.push({
        id: `cart-${Date.now()}`,
        product,
        selectedDeal,
        quantity: 1,
        addedAt: new Date().toISOString(),
      });
    }
    this.notify();
  }

  public removeFromCart(cartItemId: string) {
    this.cartItems = this.cartItems.filter(item => item.id !== cartItemId);
    this.notify();
  }

  public clearCart() {
    this.cartItems = [];
    this.notify();
  }

  public updateCardLimit(partnerId: string, cardId: string, newLimit: number) {
    const partner = this.partners.find(p => p.id === partnerId);
    if (partner) {
      const card = partner.cardsHeld.find(c => c.id === cardId);
      if (card) {
        card.monthlyLimit = newLimit;
        card.availableLimit = Math.min(newLimit, card.availableLimit);
        this.notify();
      }
    }
  }

  public getFRMConfig(): FRMRuleConfig {
    return { ...this.frmConfig };
  }

  public updateFRMConfig(config: Partial<FRMRuleConfig>) {
    this.frmConfig = { ...this.frmConfig, ...config };
    this.notify();
  }

  public submitPartnerOnboarding(data: Omit<PartnerOnboardingRequest, 'id' | 'status' | 'submittedAt'>) {
    const newReq: PartnerOnboardingRequest = {
      ...data,
      id: `req-${Date.now()}`,
      status: 'PENDING_APPROVAL',
      submittedAt: new Date().toISOString(),
    };
    this.partnerRequests.unshift(newReq);
    this.notify();
    return newReq;
  }

  public approvePartnerOnboarding(requestId: string, adminNotes?: string) {
    const req = this.partnerRequests.find(r => r.id === requestId);
    if (req) {
      req.status = 'APPROVED';
      if (adminNotes) req.adminNotes = adminNotes;
      // Add to active partners pool
      this.partners.push({
        id: `p-${Date.now()}`,
        name: req.name,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        city: req.city,
        trustScore: Math.max(70, 100 - req.frmAssessment.overallScore),
        kycVerified: true,
        cardsHeld: [
          {
            id: `c-${Date.now()}`,
            bank: req.initialCardBank,
            cardName: req.initialCardName,
            last4: req.initialCardLast4,
            network: 'VISA',
            monthlyLimit: req.initialCardLimit,
            availableLimit: req.initialCardLimit,
            billingCycleDate: req.billingCycleDay || 15,
            rewardPreference: 'Instant Cashback & Points',
          },
        ],
        totalOrdersFulfilled: 0,
        totalEarnings: 0,
        rewardPointsEarned: 0,
        status: 'ACTIVE',
      });
      this.notify();
    }
  }

  public requestStepUpVerification(requestId: string, notes: string) {
    const req = this.partnerRequests.find(r => r.id === requestId);
    if (req) {
      req.status = 'STEP_UP_REQUIRED';
      req.adminNotes = notes;
      this.notify();
    }
  }

  public rejectPartnerOnboarding(requestId: string, reason?: string) {
    const req = this.partnerRequests.find(r => r.id === requestId);
    if (req) {
      req.status = 'REJECTED';
      if (reason) req.rejectionReason = reason;
      this.notify();
    }
  }

  public getMetrics(): SystemMetrics {
    const totalSavings = this.orders.reduce((acc, o) => acc + o.totalSavings, 142850);
    const escrowLocked = this.orders
      .filter(o => o.status !== 'SETTLED' && o.status !== 'CANCELLED')
      .reduce((acc, o) => acc + o.effectivePricePaid, 0);

    return {
      totalSavingsDelivered: totalSavings,
      totalOrdersProcessed: 1248 + this.orders.length,
      activeCardholders: this.partners.filter(p => p.status === 'ACTIVE').length,
      escrowPoolValue: escrowLocked + 420000,
      avgComputeLatencyMs: 0.84, // Sub-millisecond Deal Engine evaluation
      cacheHitRatio: 99.4,
    };
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(listener => listener());
  }

  /**
   * Auto-assigns the most suitable verified cardholder based on card variant and available limit
   */
  public matchCardholder(requiredBank: string, requiredCardName: string, amount: number): PartnerCardholder | undefined {
    return this.partners.find(partner => {
      if (partner.status !== 'ACTIVE' || !partner.kycVerified) return false;
      return partner.cardsHeld.some(card => 
        (card.bank.toLowerCase().includes(requiredBank.toLowerCase()) ||
         requiredCardName.toLowerCase().includes(card.cardName.toLowerCase()) ||
         card.cardName.toLowerCase().includes(requiredBank.toLowerCase())) &&
        card.availableLimit >= amount
      );
    }) || this.partners[0]; // fallback to top trusted partner
  }

  /**
   * Creates an Escrow order via Partner Card Network flow
   */
  public createEscrowOrder(params: {
    product: Product;
    deal: OptimizedDeal;
    buyerName: string;
    buyerPhone: string;
    address: { line1: string; city: string; state: string; pincode: string };
    paymentMode: 'PARTNER_ESCROW_UPI' | 'SELF_CARD';
  }): EscrowOrder {
    const matchedPartner = params.paymentMode === 'PARTNER_ESCROW_UPI' && params.deal.partnerCard
      ? this.matchCardholder(
          params.deal.partnerCard.bank,
          params.deal.partnerCard.cardName,
          params.deal.listedPrice
        )
      : undefined;

    const matchedCard = matchedPartner?.cardsHeld[0];

    const newOrder: EscrowOrder = {
      id: `ord-${Math.floor(10000 + Math.random() * 90000)}`,
      orderNumber: `CC-2026-${Math.floor(10000 + Math.random() * 90000)}`,
      productId: params.product.id,
      productTitle: params.product.title,
      productImage: params.product.image,
      merchantId: params.deal.merchantId,
      buyerName: params.buyerName,
      buyerPhone: params.buyerPhone,
      buyerAddress: params.address,
      listedPrice: params.deal.listedPrice,
      effectivePricePaid: params.paymentMode === 'PARTNER_ESCROW_UPI'
        ? params.deal.partnerFinalEffectivePrice
        : params.deal.effectiveSelfPrice,
      totalSavings: params.paymentMode === 'PARTNER_ESCROW_UPI'
        ? (params.deal.listedPrice - params.deal.partnerFinalEffectivePrice)
        : (params.deal.listedPrice - params.deal.effectiveSelfPrice),
      paymentMode: params.paymentMode,
      partnerId: matchedPartner?.id,
      partnerName: matchedPartner?.name,
      partnerCardUsed: matchedCard ? `${matchedCard.cardName} (..${matchedCard.last4})` : undefined,
      cardholderCommission: params.deal.cardholderCommission,
      platformFee: params.deal.platformFee,
      status: 'ESCROW_DEPOSITED',
      merchantOrderRef: `OD${Math.floor(1000000000000 + Math.random() * 9000000000000)}`,
      awbTrackingNumber: `EXP-${Math.floor(100000 + Math.random() * 900000)}-IN`,
      createdAt: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      returnWindowEndDate: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    };

    // Deduct limit if partner card used
    if (matchedPartner && matchedCard) {
      matchedCard.availableLimit -= params.deal.listedPrice;
      matchedPartner.totalOrdersFulfilled += 1;
      matchedPartner.totalEarnings += params.deal.cardholderCommission;
    }

    this.orders.unshift(newOrder);
    this.notify();
    SupabaseService.createEscrowOrder(newOrder);
    return newOrder;
  }

  /**
   * Advances the order state for testing / demo
   */
  public advanceOrderStatus(orderId: string): EscrowOrder | undefined {
    const order = this.orders.find(o => o.id === orderId);
    if (!order) return undefined;

    const stateFlow: EscrowOrder['status'][] = [
      'ESCROW_DEPOSITED',
      'ORDER_PLACING',
      'MERCHANT_CONFIRMED',
      'DISPATCHED',
      'DELIVERED',
      'RETURN_WINDOW_CLOSED',
      'SETTLED'
    ];

    const currentIndex = stateFlow.indexOf(order.status);
    if (currentIndex >= 0 && currentIndex < stateFlow.length - 1) {
      order.status = stateFlow[currentIndex + 1];
      this.notify();
      SupabaseService.updateOrderStatus(order.id, order.status, {
        merchantOrderRef: order.merchantOrderRef,
        awbTrackingNumber: order.awbTrackingNumber,
      });
    }
    return order;
  }

  /**
   * Register a new card for a partner
   */
  public addPartnerCard(partnerId: string, card: {
    bank: string;
    cardName: string;
    last4: string;
    network: 'VISA' | 'MASTERCARD' | 'RUPAY';
    monthlyLimit: number;
  }) {
    const partner = this.partners.find(p => p.id === partnerId);
    if (partner) {
      partner.cardsHeld.push({
        id: `c-${Date.now()}`,
        bank: card.bank,
        cardName: card.cardName,
        last4: card.last4,
        network: card.network,
        monthlyLimit: card.monthlyLimit,
        availableLimit: card.monthlyLimit,
        billingCycleDate: 15,
        rewardPreference: 'Standard Cashback & Rewards'
      });
      this.notify();
    }
  }
}

export const store = new CompareCartStore();

export function useCompareCart() {
  const [, setVersion] = useState(0);

  useEffect(() => {
    return store.subscribe(() => setVersion(v => v + 1));
  }, []);

  return {
    products: store.getProducts(),
    partners: store.getPartners(),
    orders: store.getOrders(),
    metrics: store.getMetrics(),
    currentProfile: store.getCurrentProfile(),
    cartItems: store.getCartItems(),
    lovedProductIds: store.getLovedProductIds(),
    partnerRequests: store.getPartnerRequests(),
    customers: store.getCustomers(),
    frmConfig: store.getFRMConfig(),
    getFRMConfig: store.getFRMConfig.bind(store),
    updateFRMConfig: store.updateFRMConfig.bind(store),
    requestStepUpVerification: store.requestStepUpVerification.bind(store),
    getProductById: (id: string) => store.getProductById(id),
    createEscrowOrder: store.createEscrowOrder.bind(store),
    advanceOrderStatus: store.advanceOrderStatus.bind(store),
    addPartnerCard: store.addPartnerCard.bind(store),
    switchProfile: store.switchProfile.bind(store),
    loginAs: store.loginAs.bind(store),
    logout: store.logout.bind(store),
    toggleLovedProduct: store.toggleLovedProduct.bind(store),
    addToCart: store.addToCart.bind(store),
    removeFromCart: store.removeFromCart.bind(store),
    clearCart: store.clearCart.bind(store),
    updateCardLimit: store.updateCardLimit.bind(store),
    submitPartnerOnboarding: store.submitPartnerOnboarding.bind(store),
    approvePartnerOnboarding: store.approvePartnerOnboarding.bind(store),
    rejectPartnerOnboarding: store.rejectPartnerOnboarding.bind(store),
    matchCardholder: store.matchCardholder.bind(store),
    optimizeProductDeals,
  };
}
