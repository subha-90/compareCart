'use client';

import React, { useState } from 'react';
import {
  Zap,
  Check,
  CheckCircle2,
  XCircle,
  RotateCcw,
} from 'lucide-react';
import { PartnerCardholder } from '../../types';

interface PartnerSwipeQueuesProps {
  currentPartner: PartnerCardholder;
  openRequests: any[];
  myActiveSwipes: any[];
  completedOrders: any[];
  refundedOrders: any[];
  onAcceptSwipe: (orderId: string) => void;
  onConfirmOrder: (orderId: string, merchantOrderRef: string, awbTrackingNumber: string) => void;
  onDeclineOrder: (orderId: string, reason: string) => void;
}

export const PartnerSwipeQueues: React.FC<PartnerSwipeQueuesProps> = ({
  currentPartner,
  openRequests,
  myActiveSwipes,
  completedOrders,
  refundedOrders,
  onAcceptSwipe,
  onConfirmOrder,
  onDeclineOrder,
}) => {
  const [activeQueueTab, setActiveQueueTab] = useState<'open_requests' | 'my_active' | 'completed' | 'refunded'>('open_requests');

  // Modal State for Confirm Order Placed
  const [confirmingOrder, setConfirmingOrder] = useState<any | null>(null);
  const [merchantOrderRefInput, setMerchantOrderRefInput] = useState('');
  const [awbTrackingInput, setAwbTrackingInput] = useState('');

  // Modal State for Card Declined / Cannot Swipe
  const [decliningOrder, setDecliningOrder] = useState<any | null>(null);
  const [declineReason, setDeclineReason] = useState('Bank daily transaction limit exceeded');

  const handleOpenConfirmModal = (ord: any) => {
    setConfirmingOrder(ord);
    setMerchantOrderRefInput(`OD${Math.floor(1000000000 + Math.random() * 9000000000)}`);
    setAwbTrackingInput(`DELHIVERY_${Math.floor(100000 + Math.random() * 900000)}`);
  };

  const handleConfirmSubmit = () => {
    if (!confirmingOrder) return;
    onConfirmOrder(confirmingOrder.id, merchantOrderRefInput, awbTrackingInput);
    setConfirmingOrder(null);
  };

  const handleDeclineSubmit = () => {
    if (!decliningOrder) return;
    onDeclineOrder(decliningOrder.id, declineReason);
    setDecliningOrder(null);
  };

  return (
    <>
      {/* P2P Liquidity Pool & Fulfillment Queues */}
      <div className="bg-[#161617]/90 rounded-[28px] border border-white/[0.08] p-6 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.6)] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2 tracking-tight">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Cardholder P2P Matching & Swipe Network</span>
            </h3>
            <p className="text-xs text-[#86868b] mt-1">
              Escrow-locked buyer checkout requests broadcast to eligible partners. Accept to claim and fulfill.
            </p>
          </div>

          {/* Sub-Queue Tabs */}
          <div className="flex items-center gap-1.5 bg-black/50 p-1 rounded-2xl border border-white/10 text-xs font-medium overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveQueueTab('open_requests')}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition flex items-center gap-1.5 ${
                activeQueueTab === 'open_requests'
                  ? 'bg-amber-400 text-black font-semibold shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <span>Incoming Requests</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${activeQueueTab === 'open_requests' ? 'bg-black text-amber-300' : 'bg-white/10 text-zinc-300'}`}>
                {openRequests.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveQueueTab('my_active')}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition flex items-center gap-1.5 ${
                activeQueueTab === 'my_active'
                  ? 'bg-[#2997ff] text-white font-semibold shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <span>My Active Swipes</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${activeQueueTab === 'my_active' ? 'bg-white text-blue-900' : 'bg-white/10 text-zinc-300'}`}>
                {myActiveSwipes.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveQueueTab('completed')}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition flex items-center gap-1.5 ${
                activeQueueTab === 'completed'
                  ? 'bg-[#30d158] text-black font-semibold shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <span>Fulfilled ({completedOrders.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveQueueTab('refunded')}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition flex items-center gap-1.5 ${
                activeQueueTab === 'refunded'
                  ? 'bg-rose-500 text-white font-semibold shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <span>Auto-Refunded ({refundedOrders.length})</span>
            </button>
          </div>
        </div>

        {/* TAB 1: OPEN BROADCAST REQUESTS */}
        {activeQueueTab === 'open_requests' && (
          <div className="space-y-4">
            {openRequests.length === 0 ? (
              <div className="text-center py-12 text-[#86868b] text-xs font-mono">
                No new buyer escrow checkout requests waiting. When a shopper locks escrow, eligible cardholders get notified here in real-time.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {openRequests.map((ord) => {
                  const hasDeclined = ord.declinedPartnerIds?.includes(currentPartner.id);
                  const matchingCard = currentPartner.cardsHeld.find((c: any) =>
                    (c.bank.toLowerCase().includes((ord.requiredBank || '').toLowerCase()) ||
                     c.cardName.toLowerCase().includes((ord.requiredBank || '').toLowerCase())) &&
                    c.availableLimit >= ord.listedPrice
                  ) || currentPartner.cardsHeld[0];

                  const isEligible = matchingCard && matchingCard.availableLimit >= ord.listedPrice && !hasDeclined;

                  return (
                    <div
                      key={ord.id}
                      className={`p-5 rounded-2xl border transition-all ${
                        isEligible
                          ? 'bg-black/60 border-amber-400/30 hover:border-amber-400/60 shadow-[0_4px_25px_rgba(251,191,36,0.08)]'
                          : 'bg-black/30 border-white/[0.06] opacity-75'
                      }`}
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <img
                            src={ord.productImage}
                            alt={ord.productTitle}
                            className="w-14 h-14 object-contain bg-zinc-950 rounded-xl border border-white/10 p-1.5 shrink-0"
                          />
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-mono text-xs font-bold text-white">{ord.orderNumber}</span>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-400/10 text-amber-300 border border-amber-400/20">
                                {ord.merchantId.toUpperCase()}
                              </span>
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-zinc-300 border border-white/10">
                                Attempt {ord.attemptCount} of {ord.maxAttempts}
                              </span>
                            </div>

                            <h4 className="text-sm font-semibold text-white">{ord.productTitle}</h4>

                            <p className="text-xs text-[#86868b]">
                              Required Card: <strong className="text-amber-300">{ord.requiredBank}</strong> • Delivery: <strong className="text-white">{ord.buyerAddress.city}</strong>
                            </p>

                            {ord.failureReason && (
                              <p className="text-[11px] text-rose-400 font-mono">
                                ⚠️ Previous Attempt Declined: {ord.failureReason}
                              </p>
                            )}

                            {isEligible && (
                              <p className="text-[11px] text-[#30d158] font-mono flex items-center gap-1 pt-1">
                                <Check className="w-3.5 h-3.5" />
                                Your card matches: <strong>{matchingCard.cardName}</strong> (Available: ₹{matchingCard.availableLimit.toLocaleString('en-IN')})
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Earnings & Accept Action */}
                        <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-white/10">
                          <div className="text-left sm:text-right">
                            <span className="text-[10px] text-[#86868b] uppercase font-bold block">Your Commission</span>
                            <span className="text-base font-extrabold text-[#30d158]">
                              +₹{ord.cardholderCommission?.toLocaleString('en-IN')}
                            </span>
                            <span className="text-[10px] text-amber-300/80 block font-mono">
                              (100% Escrow Guaranteed)
                            </span>
                          </div>

                          {hasDeclined ? (
                            <span className="text-xs font-mono text-zinc-500 bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
                              Declined by you
                            </span>
                          ) : isEligible ? (
                            <button
                              type="button"
                              onClick={() => onAcceptSwipe(ord.id)}
                              className="apple-pill-btn text-xs px-5 py-2.5 flex items-center gap-1.5 shadow-[0_4px_15px_rgba(251,191,36,0.25)] bg-gradient-to-r from-amber-400 to-amber-500 text-black font-bold"
                            >
                              <Zap className="w-3.5 h-3.5 fill-black" />
                              <span>Accept Swipe Request</span>
                            </button>
                          ) : (
                            <span className="text-xs font-mono text-zinc-500 bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
                              Card limit insufficient
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: MY ACTIVE SWIPES */}
        {activeQueueTab === 'my_active' && (
          <div className="space-y-4">
            {myActiveSwipes.length === 0 ? (
              <div className="text-center py-12 text-[#86868b] text-xs font-mono">
                No active swipe orders in your queue. Accept incoming requests above to begin fulfillment.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {myActiveSwipes.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-5 rounded-2xl bg-black/60 border border-[#2997ff]/40 shadow-[0_8px_30px_rgba(0,113,227,0.15)] space-y-4"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div className="flex items-start gap-4">
                        <img
                          src={ord.productImage}
                          alt={ord.productTitle}
                          className="w-14 h-14 object-contain bg-zinc-950 rounded-xl border border-white/10 p-1.5 shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-white">{ord.orderNumber}</span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/10 text-[#2997ff] border border-blue-500/20">
                              {ord.merchantId.toUpperCase()}
                            </span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/20">
                              SWIPE IN PROGRESS
                            </span>
                          </div>
                          <h4 className="text-sm font-semibold text-white mt-0.5">{ord.productTitle}</h4>
                          <p className="text-xs text-zinc-300 mt-1">
                            Card Assigned: <strong className="text-white">{ord.partnerCardUsed}</strong>
                          </p>
                        </div>
                      </div>

                      <div className="text-left md:text-right">
                        <span className="text-[10px] text-[#86868b] uppercase font-bold block">Your Profit</span>
                        <span className="text-lg font-extrabold text-[#30d158]">+₹{ord.cardholderCommission?.toLocaleString('en-IN')}</span>
                      </div>
                    </div>

                    {/* Buyer Shipping Details (Direct Delivery Requirement) */}
                    <div className="bg-black/50 p-3.5 rounded-xl border border-white/10 text-xs space-y-1 font-mono">
                      <div className="text-zinc-400 text-[11px] uppercase font-bold">Buyer Shipping Address (Deliver Here):</div>
                      <div className="text-white font-sans font-medium">{ord.buyerName} ({ord.buyerPhone})</div>
                      <div className="text-zinc-300">{ord.buyerAddress.line1}, {ord.buyerAddress.city}, {ord.buyerAddress.state} - {ord.buyerAddress.pincode}</div>
                    </div>

                    {/* Actions: Confirm Placed or Card Declined */}
                    <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setDecliningOrder(ord);
                          setDeclineReason('Bank daily transaction limit exceeded');
                        }}
                        className="apple-pill-btn-secondary w-full sm:w-auto text-xs py-2.5 px-4 text-rose-400 hover:text-rose-300 flex items-center justify-center gap-1.5"
                      >
                        <XCircle className="w-4 h-4 text-rose-400" />
                        <span>Card Declined / Cannot Swipe</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenConfirmModal(ord)}
                        className="apple-pill-btn w-full sm:w-auto text-xs py-2.5 px-5 flex items-center justify-center gap-1.5 shadow-lg bg-[#30d158] hover:bg-[#28b84d] text-black font-bold"
                      >
                        <Check className="w-4 h-4 stroke-[3]" />
                        <span>Confirm Order Placed</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: COMPLETED & SETTLED */}
        {activeQueueTab === 'completed' && (
          <div className="space-y-4">
            {completedOrders.length === 0 ? (
              <div className="text-center py-12 text-[#86868b] text-xs font-mono">
                No fulfilled orders yet. Completed orders will appear here ready for nodal payout settlement.
              </div>
            ) : (
              <div className="divide-y divide-white/[0.06]">
                {completedOrders.map((ord) => (
                  <div key={ord.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <img
                        src={ord.productImage}
                        alt={ord.productTitle}
                        className="w-12 h-12 object-contain bg-zinc-950 rounded-xl border border-white/10 p-1 shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-white">{ord.orderNumber}</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-[#30d158] border border-emerald-500/20">
                            {ord.status}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-white mt-0.5">{ord.productTitle}</h4>
                        <p className="text-[11px] text-zinc-400 mt-0.5 font-mono">
                          Ref: <strong className="text-white">{ord.merchantOrderRef}</strong> • AWB: <strong className="text-[#2997ff]">{ord.awbTrackingNumber}</strong>
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-zinc-500 uppercase font-bold block">Commission Earned</span>
                      <span className="text-sm font-extrabold text-[#30d158]">+₹{ord.cardholderCommission?.toLocaleString('en-IN')}</span>
                      <span className="text-[10px] text-zinc-400 block font-mono">Principal Settled</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: AUTO-REFUNDED AUDIT */}
        {activeQueueTab === 'refunded' && (
          <div className="space-y-4">
            {refundedOrders.length === 0 ? (
              <div className="text-center py-12 text-[#86868b] text-xs font-mono">
                No orders were refunded. All checkout requests have been fulfilled successfully.
              </div>
            ) : (
              <div className="divide-y divide-white/[0.06]">
                {refundedOrders.map((ord) => (
                  <div key={ord.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <img
                        src={ord.productImage}
                        alt={ord.productTitle}
                        className="w-12 h-12 object-contain bg-zinc-950 rounded-xl border border-white/10 p-1 shrink-0 grayscale"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-white">{ord.orderNumber}</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                            100% REFUNDED
                          </span>
                          <span className="text-[10px] font-mono text-zinc-400">
                            {ord.attemptCount} Cardholder Attempts Failed
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-zinc-300 mt-0.5">{ord.productTitle}</h4>
                        <p className="text-[11px] text-rose-300 mt-0.5 font-mono">
                          {ord.failureReason || 'All network cardholders declined. 100% refund executed.'}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-zinc-500 uppercase font-bold block">Refund Reference</span>
                      <span className="text-xs font-mono font-bold text-white">{ord.refundRef || 'RFND_AUTO'}</span>
                      <span className="text-[10px] text-rose-400 block font-semibold">₹{ord.effectivePricePaid.toLocaleString('en-IN')} Returned</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* MODAL: Confirm Order Placed */}
      {confirmingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-2xl animate-fade-in">
          <div className="bg-[#1c1c1e]/98 backdrop-blur-3xl rounded-[28px] max-w-md w-full p-6 sm:p-7 border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.8)] space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#30d158]/10 text-[#30d158] flex items-center justify-center border border-[#30d158]/20">
                <Check className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white tracking-tight">Confirm Order Placed</h3>
                <p className="text-xs text-[#86868b]">Order #{confirmingOrder.orderNumber}</p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  {confirmingOrder.merchantId.toUpperCase()} Order Reference ID
                </label>
                <input
                  type="text"
                  value={merchantOrderRefInput}
                  onChange={(e) => setMerchantOrderRefInput(e.target.value)}
                  className="w-full bg-zinc-950 text-white text-xs p-3 rounded-xl border border-white/10 focus:outline-none font-mono"
                  placeholder="e.g. OD339182049182"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Courier AWB Tracking Number
                </label>
                <input
                  type="text"
                  value={awbTrackingInput}
                  onChange={(e) => setAwbTrackingInput(e.target.value)}
                  className="w-full bg-zinc-950 text-white text-xs p-3 rounded-xl border border-white/10 focus:outline-none font-mono"
                  placeholder="e.g. DELHIVERY_88214"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setConfirmingOrder(null)}
                className="apple-pill-btn-secondary w-1/2 text-xs py-2.5"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmSubmit}
                className="apple-pill-btn w-1/2 text-xs py-2.5 font-bold"
              >
                Submit Confirmation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Card Declined / Cannot Swipe */}
      {decliningOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-2xl animate-fade-in">
          <div className="bg-[#1c1c1e]/98 backdrop-blur-3xl rounded-[28px] max-w-md w-full p-6 sm:p-7 border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.8)] space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center border border-rose-500/20">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white tracking-tight">Card Declined / Re-route</h3>
                <p className="text-xs text-[#86868b]">
                  Attempt {decliningOrder.attemptCount} of {decliningOrder.maxAttempts}
                </p>
              </div>
            </div>

            <p className="text-xs text-zinc-300">
              {decliningOrder.attemptCount < decliningOrder.maxAttempts ? (
                <>This order will be immediately released back to the network pool and re-broadcasted to other eligible cardholders.</>
              ) : (
                <strong className="text-rose-400">This is the final attempt (4/4). Declining now will automatically execute a 100% refund of ₹{decliningOrder.effectivePricePaid.toLocaleString('en-IN')} to the shopper.</strong>
              )}
            </p>

            <div className="space-y-2 pt-1">
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Select Failure Reason:</label>
              {[
                'Bank daily transaction limit exceeded',
                'Card declined / Merchant 3D Secure OTP failure',
                'Card promo discount inactive on merchant',
                'Item out of stock on merchant site',
              ].map((reason) => (
                <label
                  key={reason}
                  onClick={() => setDeclineReason(reason)}
                  className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition ${
                    declineReason === reason
                      ? 'bg-rose-500/10 border-rose-500/40 text-white font-medium'
                      : 'bg-black/40 border-white/[0.06] text-zinc-400 hover:text-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="declineReason"
                    checked={declineReason === reason}
                    onChange={() => setDeclineReason(reason)}
                    className="accent-rose-500"
                  />
                  <span>{reason}</span>
                </label>
              ))}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDecliningOrder(null)}
                className="apple-pill-btn-secondary w-1/2 text-xs py-2.5"
              >
                Go Back
              </button>
              <button
                type="button"
                onClick={handleDeclineSubmit}
                className="apple-pill-btn w-1/2 text-xs py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold"
              >
                {decliningOrder.attemptCount < decliningOrder.maxAttempts ? 'Re-Route to Next Partner' : 'Confirm 100% Refund'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
