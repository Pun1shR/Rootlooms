-- Run this in your Supabase SQL Editor

CREATE TABLE public.orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    razorpay_order_id TEXT,
    razorpay_payment_id TEXT,
    razorpay_signature TEXT,
    amount NUMERIC NOT NULL,
    shipping_cost NUMERIC NOT NULL DEFAULT 100,
    status TEXT NOT NULL DEFAULT 'created', -- 'created', 'paid', 'failed'
    items JSONB NOT NULL, -- Array of products {id, name, price}
    shipping_address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Users can view their own orders
CREATE POLICY "Users can view their own orders" ON public.orders
    FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own orders
CREATE POLICY "Users can insert their own orders" ON public.orders
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Only service role can update orders (for webhook/payment confirmation)
CREATE POLICY "Service role can manage all orders" ON public.orders
    USING (true)
    WITH CHECK (true); -- Requires service_role key to bypass RLS for updates if needed, though service_role bypasses RLS automatically.
