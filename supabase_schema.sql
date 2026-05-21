-- Supabase Schema for Saree Inventory

-- 1. Create the categories table
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create the sarees table
CREATE TABLE IF NOT EXISTS public.sarees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    price NUMERIC NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    image_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Set up Row Level Security (RLS)
-- We will enable RLS but create open policies for this specific use case, 
-- since our Node.js server will use the SERVICE_ROLE key which bypasses RLS anyway.
-- However, if you plan to fetch these from a frontend app, you'll want them readable by anyone.

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sarees ENABLE ROW LEVEL SECURITY;

-- Allow public read access to categories and sarees
CREATE POLICY "Public profiles are viewable by everyone."
ON public.categories FOR SELECT
USING ( true );

CREATE POLICY "Public profiles are viewable by everyone."
ON public.sarees FOR SELECT
USING ( true );

-- 4. Create the storage bucket for saree images
-- Note: It is often easier to create buckets via the Supabase UI Dashboard (Storage -> Create a new bucket -> "saree_images" -> check "Public bucket").
-- But here is the SQL to do it if pg_storage is enabled:
INSERT INTO storage.buckets (id, name, public) 
VALUES ('saree_images', 'saree_images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to the bucket
CREATE POLICY "Public read access for saree images"
ON storage.objects FOR SELECT
USING ( bucket_id = 'saree_images' );

-- Note: Our bot uses the SERVICE_ROLE key so it can upload files without specific insert policies.
