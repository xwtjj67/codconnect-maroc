
-- ============================================
-- CODCONNECT PRODUCTION DATABASE SCHEMA
-- ============================================

-- 1. Role enum
CREATE TYPE public.app_role AS ENUM ('affiliate', 'product_owner', 'admin');

-- 2. User status enum
CREATE TYPE public.user_status AS ENUM ('pending', 'approved', 'active', 'suspended');

-- 3. Affiliate plan enum
CREATE TYPE public.plan_type AS ENUM ('standard', 'premium', 'vip');

-- 4. Seller plan enum
CREATE TYPE public.seller_plan_type AS ENUM ('basic', 'pro');

-- 5. Order status enum
CREATE TYPE public.order_status AS ENUM ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled');

-- 6. Product visibility enum
CREATE TYPE public.visibility_level AS ENUM ('standard', 'premium', 'vip');

-- 7. Product approval enum
CREATE TYPE public.approval_status AS ENUM ('pending', 'approved', 'rejected');

-- ============================================
-- HELPER: Update timestamps (created first since triggers reference it)
-- ============================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ============================================
-- USER ROLES TABLE (security definer pattern)
-- ============================================
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  UNIQUE(user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles (avoids RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can view own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert roles"
  ON public.user_roles FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update roles"
  ON public.user_roles FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete roles"
  ON public.user_roles FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- ============================================
-- PROFILES TABLE (linked to auth.users)
-- ============================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  city TEXT,
  whatsapp TEXT,
  store_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- USER STATUS TABLE
-- ============================================
CREATE TABLE public.user_statuses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  status user_status NOT NULL DEFAULT 'pending',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.user_statuses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own status"
  ON public.user_statuses FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all statuses"
  ON public.user_statuses FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update statuses"
  ON public.user_statuses FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_user_statuses_updated_at BEFORE UPDATE ON public.user_statuses FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- SUBSCRIPTIONS TABLE
-- ============================================
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan plan_type,
  seller_plan seller_plan_type,
  is_active BOOLEAN NOT NULL DEFAULT true,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscriptions"
  ON public.subscriptions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can select subscriptions"
  ON public.subscriptions FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert subscriptions"
  ON public.subscriptions FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update subscriptions"
  ON public.subscriptions FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- ============================================
-- PRODUCTS TABLE
-- ============================================
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  cost_price NUMERIC(10,2) NOT NULL,
  selling_price NUMERIC(10,2),
  commission NUMERIC(10,2),
  category TEXT,
  image TEXT,
  stock INTEGER NOT NULL DEFAULT 0,
  visibility visibility_level NOT NULL DEFAULT 'standard',
  approval_status approval_status NOT NULL DEFAULT 'pending',
  is_active BOOLEAN NOT NULL DEFAULT true,
  views INTEGER NOT NULL DEFAULT 0,
  clicks INTEGER NOT NULL DEFAULT 0,
  orders_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Merchants can view own products"
  ON public.products FOR SELECT
  TO authenticated
  USING (auth.uid() = merchant_id);

CREATE POLICY "Merchants can insert own products"
  ON public.products FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = merchant_id AND public.has_role(auth.uid(), 'product_owner'));

CREATE POLICY "Merchants can update own products"
  ON public.products FOR UPDATE
  TO authenticated
  USING (auth.uid() = merchant_id);

CREATE POLICY "Affiliates can view approved products"
  ON public.products FOR SELECT
  TO authenticated
  USING (
    approval_status = 'approved' 
    AND is_active = true
    AND public.has_role(auth.uid(), 'affiliate')
  );

CREATE POLICY "Admins can select all products"
  ON public.products FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert products"
  ON public.products FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update products"
  ON public.products FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete products"
  ON public.products FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- ORDERS TABLE
-- ============================================
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id),
  affiliate_id UUID NOT NULL REFERENCES auth.users(id),
  merchant_id UUID NOT NULL REFERENCES auth.users(id),
  client_name TEXT NOT NULL,
  client_phone TEXT NOT NULL,
  city TEXT NOT NULL,
  status order_status NOT NULL DEFAULT 'pending',
  selling_price NUMERIC(10,2) NOT NULL,
  cost_price NUMERIC(10,2) NOT NULL,
  commission_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  platform_profit NUMERIC(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Affiliates can view own orders"
  ON public.orders FOR SELECT
  TO authenticated
  USING (auth.uid() = affiliate_id);

CREATE POLICY "Affiliates can create orders"
  ON public.orders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = affiliate_id AND public.has_role(auth.uid(), 'affiliate'));

CREATE POLICY "Merchants can view orders for their products"
  ON public.orders FOR SELECT
  TO authenticated
  USING (auth.uid() = merchant_id);

CREATE POLICY "Admins can select all orders"
  ON public.orders FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert orders"
  ON public.orders FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update orders"
  ON public.orders FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete orders"
  ON public.orders FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- COMMISSIONS TABLE
-- ============================================
CREATE TABLE public.commissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  affiliate_id UUID NOT NULL REFERENCES auth.users(id),
  amount NUMERIC(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.commissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Affiliates can view own commissions"
  ON public.commissions FOR SELECT
  TO authenticated
  USING (auth.uid() = affiliate_id);

CREATE POLICY "Admins can select commissions"
  ON public.commissions FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert commissions"
  ON public.commissions FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update commissions"
  ON public.commissions FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- ============================================
-- AFFILIATE LINKS TABLE
-- ============================================
CREATE TABLE public.affiliate_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  code TEXT NOT NULL UNIQUE,
  clicks INTEGER NOT NULL DEFAULT 0,
  sales INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(affiliate_id, product_id)
);

ALTER TABLE public.affiliate_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Affiliates can view own links"
  ON public.affiliate_links FOR SELECT
  TO authenticated
  USING (auth.uid() = affiliate_id);

CREATE POLICY "Affiliates can create links"
  ON public.affiliate_links FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = affiliate_id);

CREATE POLICY "Admins can manage all links"
  ON public.affiliate_links FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- ============================================
-- APPROVALS LOG TABLE
-- ============================================
CREATE TABLE public.approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  target_type TEXT NOT NULL CHECK (target_type IN ('user', 'product')),
  target_id UUID NOT NULL,
  admin_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL CHECK (action IN ('approved', 'rejected', 'suspended')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.approvals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can select approvals"
  ON public.approvals FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert approvals"
  ON public.approvals FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============================================
-- TRIGGER: Auto-create profile + status on signup
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _role app_role;
  _name TEXT;
  _phone TEXT;
  _city TEXT;
  _whatsapp TEXT;
  _store_name TEXT;
BEGIN
  _role := COALESCE((NEW.raw_user_meta_data->>'role')::app_role, 'affiliate');
  _name := COALESCE(NEW.raw_user_meta_data->>'name', '');
  _phone := COALESCE(NEW.raw_user_meta_data->>'phone', '');
  _city := COALESCE(NEW.raw_user_meta_data->>'city', '');
  _whatsapp := COALESCE(NEW.raw_user_meta_data->>'whatsapp', '');
  _store_name := NEW.raw_user_meta_data->>'store_name';

  INSERT INTO public.profiles (id, name, phone, city, whatsapp, store_name)
  VALUES (NEW.id, _name, _phone, _city, _whatsapp, _store_name);

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, _role);

  INSERT INTO public.user_statuses (user_id, status)
  VALUES (NEW.id, 'pending');

  IF _role = 'affiliate' THEN
    INSERT INTO public.subscriptions (user_id, plan)
    VALUES (NEW.id, 'standard');
  ELSIF _role = 'product_owner' THEN
    INSERT INTO public.subscriptions (user_id, seller_plan)
    VALUES (NEW.id, 'basic');
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
