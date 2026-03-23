
-- Merchant product limits table
CREATE TABLE IF NOT EXISTS public.merchant_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id UUID NOT NULL UNIQUE,
  approved_product_limit INTEGER NOT NULL DEFAULT 3,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Affiliate product access table
CREATE TABLE IF NOT EXISTS public.affiliate_product_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id UUID NOT NULL,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  is_authorized BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(affiliate_id, product_id)
);

-- Add preferred_category to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS preferred_category TEXT DEFAULT NULL;

-- RLS for merchant_limits
ALTER TABLE public.merchant_limits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage merchant limits" ON public.merchant_limits
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Merchants can view own limits" ON public.merchant_limits
  FOR SELECT TO authenticated
  USING (merchant_id = auth.uid());

-- RLS for affiliate_product_access
ALTER TABLE public.affiliate_product_access ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage affiliate access" ON public.affiliate_product_access
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Affiliates can view own access" ON public.affiliate_product_access
  FOR SELECT TO authenticated
  USING (affiliate_id = auth.uid());
