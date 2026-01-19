-- Migration: Update pages table to use Cloudinary URLs instead of binary data
-- Run this after setting up Cloudinary

-- Step 1: Add new columns
ALTER TABLE pages 
ADD COLUMN IF NOT EXISTS image_url VARCHAR(500),
ADD COLUMN IF NOT EXISTS cloudinary_public_id VARCHAR(255);

-- Step 2: Drop old binary column (after migrating existing data)
-- WARNING: This will delete all existing page images!
-- Make sure to re-upload PDFs after running this migration
ALTER TABLE pages DROP COLUMN IF EXISTS image_data;

-- Step 3: Make new columns required (after data migration)
-- ALTER TABLE pages ALTER COLUMN image_url SET NOT NULL;
-- ALTER TABLE pages ALTER COLUMN cloudinary_public_id SET NOT NULL;

-- Note: Uncomment step 3 after you've uploaded all books with Cloudinary
