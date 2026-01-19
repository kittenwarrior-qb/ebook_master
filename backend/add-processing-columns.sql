-- Add processing status columns to books table
ALTER TABLE books 
ADD COLUMN IF NOT EXISTS processing_status VARCHAR(50) DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS processed_pages INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS processing_message TEXT;
