-- Migration: Fix posters category check constraint + add before_image_url column
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard)

-- Step 1: Drop the old category check constraint
ALTER TABLE public.posters
  DROP CONSTRAINT IF EXISTS posters_category_check;

-- Step 2: Add updated constraint that includes 'Before / After'
ALTER TABLE public.posters
  ADD CONSTRAINT posters_category_check
  CHECK (category IN (
    'Instagram Posters',
    'Event Posters',
    'Promotional Posters',
    'Business Posters',
    'Before / After'
  ));

-- Step 3: Add before_image_url column if it doesn't exist
ALTER TABLE public.posters
  ADD COLUMN IF NOT EXISTS before_image_url TEXT;

-- Verify everything looks correct
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'posters' 
  AND table_schema = 'public'
ORDER BY ordinal_position;
