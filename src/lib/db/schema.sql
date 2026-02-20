-- gotzportal schema (run this in your Postgres/Neon database)
-- The database itself is external; this file lives in the Next.js repo for version control.

-- Admin users (for future multi-user auth; login currently uses ADMIN_PASSWORD token)
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  role VARCHAR(32) DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email) WHERE deleted_at IS NULL;

-- Contact form submissions
CREATE TABLE IF NOT EXISTS contact_messages (
  id SERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL,
  phone VARCHAR(40),
  message TEXT NOT NULL,
  status VARCHAR(32) DEFAULT 'new',
  meta JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Bookings
CREATE TABLE IF NOT EXISTS tour_packages (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  short_description TEXT,
  description TEXT,
  price_from DECIMAL(10,2),
  duration_days SMALLINT,
  max_participants SMALLINT,
  is_featured BOOLEAN DEFAULT FALSE,
  display_order INT DEFAULT 0,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  tour_package_id INT REFERENCES tour_packages(id) ON DELETE SET NULL,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(255) NOT NULL,
  whatsapp VARCHAR(255),
  travel_date DATE,
  number_of_travelers SMALLINT NOT NULL DEFAULT 1,
  customization_data JSONB,
  special_requests TEXT,
  status VARCHAR(32) DEFAULT 'pending',
  admin_notes TEXT,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Content tables (read by API)
CREATE TABLE IF NOT EXISTS hero_slides (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  label VARCHAR(255),
  subtitle VARCHAR(512),
  description TEXT,
  image_base64 TEXT,
  cta_label VARCHAR(255),
  cta_url VARCHAR(512),
  position INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  schedule_start TIMESTAMPTZ,
  schedule_end TIMESTAMPTZ,
  meta JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS feature_cards (
  id SERIAL PRIMARY KEY,
  icon VARCHAR(64),
  title VARCHAR(255) NOT NULL,
  headline VARCHAR(255),
  copy TEXT,
  count_value INT,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS about_stats (
  id SERIAL PRIMARY KEY,
  value VARCHAR(64) NOT NULL,
  label VARCHAR(255) NOT NULL,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS about_highlights (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  copy TEXT NOT NULL,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS contact_channels (
  id SERIAL PRIMARY KEY,
  label VARCHAR(64) NOT NULL,
  value VARCHAR(255) NOT NULL,
  detail TEXT,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS contact_quick_facts (
  id SERIAL PRIMARY KEY,
  fact TEXT NOT NULL,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS itineraries (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  summary TEXT,
  badge VARCHAR(64),
  image_base64 TEXT,
  duration_days SMALLINT,
  price_from DECIMAL(10,2),
  difficulty VARCHAR(64),
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS destinations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  region VARCHAR(128),
  teaser TEXT,
  tag VARCHAR(128),
  description TEXT,
  image_base64 TEXT,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS lodges (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  location VARCHAR(255),
  type VARCHAR(64),
  mood VARCHAR(255),
  short_description TEXT,
  image_base64 TEXT,
  price_from DECIMAL(10,2),
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Indexes for common filters
CREATE INDEX IF NOT EXISTS idx_hero_slides_active ON hero_slides(is_active) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_tour_packages_slug ON tour_packages(slug);
CREATE INDEX IF NOT EXISTS idx_tour_packages_published ON tour_packages(published_at) WHERE deleted_at IS NULL;
