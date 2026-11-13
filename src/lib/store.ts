'use client';

import { useState, useEffect } from 'react';
import { Product, PartnerCardholder, EscrowOrder, OptimizedDeal } from '../types';
import { SAMPLE_PRODUCTS, MOCK_PARTNER_CARDHOLDERS, INITIAL_ORDERS } from './mock-data';
import { optimizeProductDeals } from './deal-engine';

export interface SystemMetrics {
  totalSavingsDelivered: number;
  totalOrdersProcessed: number;
  activeCardholders: number;
  escrowPoolValue: number;
  avgComputeLatencyMs: number;
  cacheHitRatio: number;
}

class CompareCartStore {
  private products: Product[] = SAMPLE_PRODUCTS;
  private partners: PartnerCardholder[] = MOCK_PARTNER_CARDHOLDERS;
  private orders: EscrowOrder[] = INITIAL_ORDERS;
  private listeners: (() => void)[] = [];

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
   * Matches an eligible partner cardholder for an order
   */
  public matchCardholder(requiredBank: string, requiredCardName: string, amount: number): PartnerCardholder | undefined {
    return this.partners.find(partner => {
      if (partner.status !== 'ACTIVE') return false;
      return partner.cardsHeld.some(card => 
        (card.bank.toLowerCase().includes(requiredBank.toLowerCase()) ||
         requiredCardName.toLowerCase().includes(card.cardName.toLowerCase()) ||
         card.cardName.toLowerCase().includes(requiredBank.toLowerCase())) &&
        card.availableLimit >= amount
      );
    }) || this.partners[0]; // fallback to top trusted partner in demo
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
    getProductById: (id: string) => store.getProductById(id),
    createEscrowOrder: store.createEscrowOrder.bind(store),
    advanceOrderStatus: store.advanceOrderStatus.bind(store),
    addPartnerCard: store.addPartnerCard.bind(store),
    optimizeProductDeals,
  };
}
