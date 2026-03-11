-- Run this on an existing database to add multi-image and detail support for itineraries,
-- and itinerary_id to bookings. New installs use schema.sql which already includes these.
-- Required for: safari gallery, description/highlights/inclusions/exclusions/days, and booking a safari by itinerary.

-- Add detail columns to itineraries (idempotent)
ALTER TABLE itineraries ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE itineraries ADD COLUMN IF NOT EXISTS highlights JSONB;
ALTER TABLE itineraries ADD COLUMN IF NOT EXISTS inclusions JSONB;
ALTER TABLE itineraries ADD COLUMN IF NOT EXISTS exclusions JSONB;
ALTER TABLE itineraries ADD COLUMN IF NOT EXISTS days JSONB;

-- Multiple images per itinerary
CREATE TABLE IF NOT EXISTS itinerary_images (
  id SERIAL PRIMARY KEY,
  itinerary_id INT NOT NULL REFERENCES itineraries(id) ON DELETE CASCADE,
  image_base64 TEXT NOT NULL,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_itinerary_images_itinerary_id ON itinerary_images(itinerary_id);

-- Allow booking to reference an itinerary (safari)
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS itinerary_id INT REFERENCES itineraries(id) ON DELETE SET NULL;
