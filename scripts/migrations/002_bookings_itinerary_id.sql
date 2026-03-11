-- Add itinerary_id to bookings so safari/itinerary bookings are linked.
-- Run this if you get: column "itinerary_id" of relation "bookings" does not exist

ALTER TABLE bookings ADD COLUMN IF NOT EXISTS itinerary_id INT REFERENCES itineraries(id) ON DELETE SET NULL;
