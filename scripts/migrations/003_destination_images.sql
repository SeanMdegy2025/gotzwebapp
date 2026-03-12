-- Add destination_images for multiple images per destination (admin + front display).

CREATE TABLE IF NOT EXISTS destination_images (
  id SERIAL PRIMARY KEY,
  destination_id INT NOT NULL REFERENCES destinations(id) ON DELETE CASCADE,
  image_base64 TEXT NOT NULL,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_destination_images_destination_id ON destination_images(destination_id);
