-- ============================================
-- CodConnect Database Schema
-- Run as postgres superuser:
--   sudo -u postgres psql -d codconnect_db -f schema.sql
-- ============================================

-- ENUMs (IF NOT EXISTS workaround)
DO $$ BEGIN CREATE TYPE app_role AS ENUM ('affiliate', 'product_owner', 'admin'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE user_status AS ENUM ('pending', 'approved', 'active', 'suspended'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE approval_status AS ENUM ('pending', 'approved', 'rejected'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE plan_type AS ENUM ('standard', 'premium', 'vip'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE seller_plan_type AS ENUM ('basic', 'pro'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE visibility_level AS ENUM ('standard', 'premium', 'vip'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Users
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  username VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  city VARCHAR(100),
  store_name VARCHAR(255),
  preferred_category VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add preferred_category if not exists
DO $$ BEGIN
  ALTER TABLE users ADD COLUMN preferred_category VARCHAR(100);
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

-- User Roles
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE(user_id, role)
);

-- User Statuses
CREATE TABLE IF NOT EXISTS user_statuses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  status user_status DEFAULT 'pending',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subscriptions
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  plan plan_type DEFAULT 'standard',
  seller_plan seller_plan_type,
  is_active BOOLEAN DEFAULT true,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id UUID REFERENCES users(id) NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  cost_price DECIMAL(10,2) NOT NULL,
  selling_price DECIMAL(10,2),
  commission DECIMAL(10,2),
  stock INTEGER DEFAULT 0,
  category VARCHAR(100),
  image TEXT,
  images TEXT[],
  thumbnail TEXT,
  video_url TEXT,
  visibility visibility_level DEFAULT 'standard',
  approval_status approval_status DEFAULT 'pending',
  is_active BOOLEAN DEFAULT true,
  views INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  orders_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) NOT NULL,
  affiliate_id UUID REFERENCES users(id) NOT NULL,
  merchant_id UUID REFERENCES users(id) NOT NULL,
  client_name VARCHAR(255) NOT NULL,
  client_phone VARCHAR(20) NOT NULL,
  city VARCHAR(100) NOT NULL,
  selling_price DECIMAL(10,2) NOT NULL,
  cost_price DECIMAL(10,2) NOT NULL,
  commission_amount DECIMAL(10,2) DEFAULT 0,
  platform_profit DECIMAL(10,2) DEFAULT 0,
  status order_status DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Affiliate Links
CREATE TABLE IF NOT EXISTS affiliate_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id UUID REFERENCES users(id) NOT NULL,
  product_id UUID REFERENCES products(id) NOT NULL,
  code VARCHAR(100) NOT NULL,
  clicks INTEGER DEFAULT 0,
  sales INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Commissions
CREATE TABLE IF NOT EXISTS commissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id UUID REFERENCES users(id) NOT NULL,
  order_id UUID REFERENCES orders(id) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Referrals
CREATE TABLE IF NOT EXISTS referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID REFERENCES users(id) NOT NULL,
  referred_id UUID REFERENCES users(id) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Training Content
CREATE TABLE IF NOT EXISTS training_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  content TEXT,
  type VARCHAR(20) DEFAULT 'article',
  category VARCHAR(100) DEFAULT 'عام',
  access_level VARCHAR(20) DEFAULT 'standard',
  video_url TEXT,
  thumbnail TEXT,
  is_published BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  read_time VARCHAR(20),
  views_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Watch History
CREATE TABLE IF NOT EXISTS watch_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) NOT NULL,
  content_id UUID REFERENCES training_content(id) NOT NULL,
  watch_count INTEGER DEFAULT 1,
  last_watched_at TIMESTAMPTZ DEFAULT NOW()
);

-- Service Requests
CREATE TABLE IF NOT EXISTS service_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  role VARCHAR(50) NOT NULL,
  service_name VARCHAR(255) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Distribution State
CREATE TABLE IF NOT EXISTS distribution_state (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  current_index INTEGER DEFAULT 0,
  total_sheets INTEGER DEFAULT 7,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Distribution Logs
CREATE TABLE IF NOT EXISTS distribution_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sheet_index INTEGER NOT NULL,
  user_name VARCHAR(255),
  user_phone VARCHAR(20),
  user_role VARCHAR(50),
  success BOOLEAN DEFAULT true,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Merchant Limits
CREATE TABLE IF NOT EXISTS merchant_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  approved_product_limit INTEGER DEFAULT 3,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Affiliate Product Access
CREATE TABLE IF NOT EXISTS affiliate_product_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  is_authorized BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(affiliate_id, product_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_products_merchant ON products(merchant_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_orders_affiliate ON orders(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_orders_merchant ON orders(merchant_id);
CREATE INDEX IF NOT EXISTS idx_training_published ON training_content(is_published);
CREATE INDEX IF NOT EXISTS idx_affiliate_access ON affiliate_product_access(affiliate_id);

-- Grant permissions to app user (only if role exists)
DO $$ BEGIN
  GRANT USAGE ON SCHEMA public TO codconnect_user;
  GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO codconnect_user;
  GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO codconnect_user;
  ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO codconnect_user;
  ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO codconnect_user;
EXCEPTION WHEN undefined_object THEN
  RAISE NOTICE 'codconnect_user role does not exist, skipping grants';
END $$;
