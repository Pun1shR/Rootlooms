-- Run this in your Supabase SQL Editor to set up the correct images bucket and clean up the old one.

-- 1. CLEAN UP THE UNUSED 'sarees_images' BUCKET
-- Delete policies we previously created (if they exist)
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Admin Upload Access" ON storage.objects;
DROP POLICY IF EXISTS "Admin Modify Access" ON storage.objects;
DROP POLICY IF EXISTS "Admin Delete Access" ON storage.objects;

-- Delete objects inside the sarees_images bucket metadata (required to drop the bucket)
DELETE FROM storage.objects WHERE bucket_id = 'sarees_images';

-- Delete the sarees_images bucket entry
DELETE FROM storage.buckets WHERE id = 'sarees_images';


-- 2. SETUP POLICIES FOR YOUR EXISTING 'saree_images' BUCKET
-- Ensure the bucket is registered in storage.buckets as public
INSERT INTO storage.buckets (id, name, public)
VALUES ('saree_images', 'saree_images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Setup unique policies specifically for 'saree_images'
-- Allow public access to read the files
CREATE POLICY "Public Access saree_images"
ON storage.objects FOR SELECT
USING ( bucket_id = 'saree_images' );

-- Allow authenticated users (Admins) to insert files
CREATE POLICY "Admin Upload Access saree_images"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'saree_images' 
    AND auth.role() = 'authenticated'
);

-- Allow authenticated users to update/delete files
CREATE POLICY "Admin Modify Access saree_images"
ON storage.objects FOR UPDATE
USING (
    bucket_id = 'saree_images' 
    AND auth.role() = 'authenticated'
);

CREATE POLICY "Admin Delete Access saree_images"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'saree_images' 
    AND auth.role() = 'authenticated'
);
