import { supabase } from './supabase';
import { EscrowOrder, PartnerCardholder, EscrowOrderStatus, MerchantId } from '../types';

/**
 * Service to sync application state with live Supabase PostgreSQL database
 */
export const SupabaseService = {
  // 1. ESCROW ORDERS
  async fetchEscrowOrders(): Promise<EscrowOrder[]> {
    try {
      const { data, error } = await supabase
        .from('escrow_orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error || !data) return [];

      return data.map((row: any) => ({
        id: row.id,
        orderNumber: row.id,
        productId: row.id,
        productTitle: row.product_name,
        productImage: row.product_image || 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=400&q=80',
        merchantId: (row.store as MerchantId) || 'amazon',
        buyerName: row.delivery_address?.name || 'Rahul Deshmukh',
        buyerPhone: row.delivery_address?.phone || '+91 98201 44521',
        buyerAddress: row.delivery_address || {
          line1: 'Flat 402, Prestige Palms',
          city: 'Bengaluru',
          state: 'Karnataka',
          pincode: '560066',
        },
        listedPrice: Number(row.listed_price),
        effectivePricePaid: Number(row.effective_price),
        totalSavings: Number(row.total_savings),
        paymentMode: 'PARTNER_ESCROW_UPI',
        partnerId: row.matched_partner_id,
        cardholderCommission: Number(row.partner_commission || 0),
        status: row.status as EscrowOrderStatus,
        merchantOrderRef: row.merchant_order_id,
        awbTrackingNumber: row.tracking_number,
        createdAt: row.created_at,
        estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        returnWindowEndDate: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000).toISOString(),
      }));
    } catch (e) {
      console.warn('[SupabaseService] Fallback to local store for orders:', e);
      return [];
    }
  },

  async createEscrowOrder(order: EscrowOrder): Promise<boolean> {
    try {
      const { error } = await supabase.from('escrow_orders').insert({
        id: order.id,
        product_name: order.productTitle,
        product_image: order.productImage,
        store: order.merchantId,
        listed_price: order.listedPrice,
        effective_price: order.effectivePricePaid,
        total_savings: order.totalSavings,
        buyer_deposit: order.effectivePricePaid,
        partner_commission: order.cardholderCommission || 0,
        status: order.status,
        delivery_address: order.buyerAddress,
        merchant_order_id: order.merchantOrderRef,
        tracking_number: order.awbTrackingNumber,
      });

      return !error;
    } catch (e) {
      console.warn('[SupabaseService] Error saving order to database:', e);
      return false;
    }
  },

  async updateOrderStatus(orderId: string, status: EscrowOrderStatus, updates?: Partial<EscrowOrder>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('escrow_orders')
        .update({
          status,
          merchant_order_id: updates?.merchantOrderRef,
          tracking_number: updates?.awbTrackingNumber,
          updated_at: new Date().toISOString(),
        })
        .eq('id', orderId);

      return !error;
    } catch (e) {
      console.warn('[SupabaseService] Error updating order status:', e);
      return false;
    }
  },

  // 2. REALTIME ORDER SUBSCRIPTION
  subscribeToOrders(onUpdate: () => void) {
    try {
      const channel = supabase
        .channel('escrow_orders_realtime')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'escrow_orders' },
          () => {
            onUpdate();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } catch {
      return () => {};
    }
  },

  // 3. PARTNER CARDS
  async addPartnerCard(card: {
    bank: string;
    cardName: string;
    last4: string;
    network: string;
    limit: number;
  }): Promise<boolean> {
    try {
      // Get current auth user if available
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { error } = await supabase.from('partner_cards').insert({
        partner_id: user.id,
        bank_name: card.bank,
        card_variant: card.cardName,
        card_network: card.network,
        last4: card.last4,
        total_limit: card.limit,
        available_limit: card.limit,
      });

      return !error;
    } catch (e) {
      console.warn('[SupabaseService] Error adding card to database:', e);
      return false;
    }
  },
};
