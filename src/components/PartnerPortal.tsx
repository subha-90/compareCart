'use client';

import React, { useState } from 'react';
import { useCompareCart } from '../lib/store';
import { PartnerCardholder } from '../types';
import { PartnerHeaderBanner } from './partner/PartnerHeaderBanner';
import { PartnerCardsPortfolio } from './partner/PartnerCardsPortfolio';
import { PartnerSwipeQueues } from './partner/PartnerSwipeQueues';

export const PartnerPortal: React.FC = () => {
  const {
    partners,
    orders,
    addPartnerCard,
    updateCardLimit,
    claimSwipeOrder,
    declineOrRetryOrder,
    confirmOrderPlaced,
  } = useCompareCart();

  const [selectedPartnerId, setSelectedPartnerId] = useState<string>(partners[0]?.id || 'partner-rohit-s');
  const [payoutNotice, setPayoutNotice] = useState<string | null>(null);

  const currentPartner: PartnerCardholder = partners.find((p: PartnerCardholder) => p.id === selectedPartnerId) || partners[0];

  // Derived order queues
  const openRequests = orders.filter((o: any) => o.status === 'MATCHING_CARDHOLDER');
  const myActiveSwipes = orders.filter((o: any) => o.partnerId === currentPartner?.id && o.status === 'ORDER_PLACING');
  const completedOrders = orders.filter((o: any) => o.partnerId === currentPartner?.id && ['MERCHANT_CONFIRMED', 'DISPATCHED', 'DELIVERED', 'RETURN_WINDOW_CLOSED', 'SETTLED'].includes(o.status));
  const refundedOrders = orders.filter((o: any) => o.status === 'REFUNDED');

  const showNotice = (msg: string) => {
    setPayoutNotice(msg);
    setTimeout(() => setPayoutNotice(null), 5000);
  };

  const handleWithdrawPayout = () => {
    if (!currentPartner) return;
    showNotice(`Payout request of ₹${currentPartner.totalEarnings.toLocaleString('en-IN')} initiated to linked HDFC Bank A/c ••••4892.`);
  };

  const handleAcceptSwipe = (orderId: string) => {
    if (!currentPartner) return;
    const success = claimSwipeOrder(orderId, currentPartner.id);
    if (success) {
      showNotice(`🎉 Accepted swipe request! Order locked to ${currentPartner.name}. Please fulfill with shipping address.`);
    } else {
      showNotice('Unable to claim order. Another cardholder may have accepted it first.');
    }
  };

  const handleConfirmOrder = (orderId: string, merchantOrderRef: string, awbTrackingNumber: string) => {
    confirmOrderPlaced(orderId, merchantOrderRef, awbTrackingNumber);
    showNotice(`✅ Order #${orderId} confirmed! Merchant Order ID and Tracking recorded.`);
  };

  const handleDeclineOrder = (orderId: string, reason: string) => {
    if (!currentPartner) return;
    const res = declineOrRetryOrder(orderId, currentPartner.id, reason);
    if (res?.status === 'REFUNDED') {
      showNotice(`All ${res.maxAttempts} cardholder attempts exhausted. 100% refund of ₹${res.effectivePricePaid.toLocaleString('en-IN')} initiated to shopper.`);
    } else {
      showNotice(`Card declined. Re-routing Order to next eligible cardholder...`);
    }
  };

  const handleAddCard = (cardData: {
    bank: string;
    cardName: string;
    last4: string;
    network: 'VISA' | 'MASTERCARD' | 'RUPAY';
    monthlyLimit: number;
  }) => {
    if (!currentPartner) return;
    addPartnerCard(currentPartner.id, cardData);
    showNotice(`Successfully added ${cardData.cardName} (..${cardData.last4}) to active cardholder pool.`);
  };

  const handleUpdateLimit = (cardId: string, newLimit: number) => {
    if (!currentPartner) return;
    updateCardLimit(currentPartner.id, cardId, newLimit);
    showNotice(`Updated monthly credit limit to ₹${newLimit.toLocaleString('en-IN')}.`);
  };

  if (!currentPartner) {
    return (
      <div className="min-h-screen bg-[#000000] text-white flex items-center justify-center p-6">
        <p className="text-sm font-mono text-zinc-400">Loading Card Partner Workspace...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-16">
      {/* 1. Partner Header Banner, Profile Switcher & Telemetry */}
      <PartnerHeaderBanner
        partners={partners}
        currentPartner={currentPartner}
        onSelectPartner={setSelectedPartnerId}
        onWithdrawPayout={handleWithdrawPayout}
        payoutNotice={payoutNotice}
      />

      {/* 2. Registered Cards Portfolio & Dynamic Limit Allocator */}
      <PartnerCardsPortfolio
        currentPartner={currentPartner}
        onAddCard={handleAddCard}
        onUpdateLimit={handleUpdateLimit}
      />

      {/* 3. P2P Matching Liquidity Pool & Fulfillment Queues */}
      <PartnerSwipeQueues
        currentPartner={currentPartner}
        openRequests={openRequests}
        myActiveSwipes={myActiveSwipes}
        completedOrders={completedOrders}
        refundedOrders={refundedOrders}
        onAcceptSwipe={handleAcceptSwipe}
        onConfirmOrder={handleConfirmOrder}
        onDeclineOrder={handleDeclineOrder}
      />
    </div>
  );
};
