-- ==============================================================================
-- CompareCart Production PostgreSQL Schema for Supabase
-- Tables: profiles, partner_cards, escrow_orders, price_cache
-- Features: Row Level Security (RLS), Realtime replication, Automatic Timestamps
-- ==============================================================================

-- 1. PROFILES (Extends Supabase auth.users with RBAC: shopper, cardholder, admin)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    phone TEXT,
    avatar_url TEXT DEFAULT 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'partner', 'admin')),
    kyc_verified BOOLEAN DEFAULT FALSE,
    city TEXT DEFAULT 'Bengaluru',
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS on Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are readable by authenticated users"
    ON public.profiles FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    TO authenticated
    USING (auth.uid() = id);

-- Trigger to create profile automatically on auth.users signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, name, email, avatar_url, role)
    VALUES (
        new.id,
        COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
        new.email,
        COALESCE(new.raw_user_meta_data->>'avatar_url', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'),
        COALESCE(new.raw_user_meta_data->>'role', 'user')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- 2. PARTNER CARDS (Cardholder Liquidity Pool & Credit Limits)
CREATE TABLE IF NOT EXISTS public.partner_cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    partner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    bank_name TEXT NOT NULL,
    card_network TEXT NOT NULL,
    card_variant TEXT NOT NULL,
    last4 VARCHAR(4) NOT NULL,
    total_limit NUMERIC(12, 2) NOT NULL DEFAULT 100000.00,
    available_limit NUMERIC(12, 2) NOT NULL DEFAULT 100000.00,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.partner_cards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Partners can view and manage their own cards"
    ON public.partner_cards FOR ALL
    TO authenticated
    USING (auth.uid() = partner_id);

CREATE POLICY "Admins can view all partner cards"
    ON public.partner_cards FOR SELECT
    TO authenticated
    USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );


-- 3. ESCROW ORDERS (Two-sided P2P Escrow Ledger)
CREATE TABLE IF NOT EXISTS public.escrow_orders (
    id TEXT PRIMARY KEY,
    shopper_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    matched_partner_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL,
    product_image TEXT,
    store TEXT NOT NULL,
    product_url TEXT,
    listed_price NUMERIC(12, 2) NOT NULL,
    effective_price NUMERIC(12, 2) NOT NULL,
    total_savings NUMERIC(12, 2) NOT NULL,
    buyer_deposit NUMERIC(12, 2) NOT NULL,
    partner_commission NUMERIC(12, 2) NOT NULL,
    applied_bank TEXT,
    status TEXT NOT NULL DEFAULT 'CREATED' CHECK (
        status IN ('CREATED', 'MATCHING', 'SWIPE_PENDING', 'ORDERED', 'IN_TRANSIT', 'DELIVERED', 'COMPLETED', 'DISPUTED', 'REFUNDED')
    ),
    delivery_address JSONB,
    merchant_order_id TEXT,
    tracking_number TEXT,
    admin_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.escrow_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Shoppers can view their own escrow orders"
    ON public.escrow_orders FOR SELECT
    TO authenticated
    USING (auth.uid() = shopper_id);

CREATE POLICY "Matched partners can view their assigned swipe orders"
    ON public.escrow_orders FOR SELECT
    TO authenticated
    USING (auth.uid() = matched_partner_id);

CREATE POLICY "Admins have full access to all escrow orders"
    ON public.escrow_orders FOR ALL
    TO authenticated
    USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );


-- 4. REALTIME NOTIFICATIONS REPLICATION
-- Enable Supabase Realtime for instant swipe queue updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.escrow_orders;
ALTER PUBLICATION supabase_realtime ADD TABLE public.partner_cards;
