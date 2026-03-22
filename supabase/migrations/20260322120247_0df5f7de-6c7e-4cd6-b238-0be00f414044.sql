
-- Add username to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS username TEXT UNIQUE;

-- Add images array and video_url to products
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS video_url TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS thumbnail TEXT;

-- Create training_content table
CREATE TABLE public.training_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT,
  type TEXT NOT NULL DEFAULT 'article' CHECK (type IN ('article', 'video')),
  category TEXT NOT NULL DEFAULT 'أساسيات',
  access_level TEXT NOT NULL DEFAULT 'standard' CHECK (access_level IN ('standard', 'premium', 'vip')),
  video_url TEXT,
  read_time TEXT,
  is_published BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.training_content ENABLE ROW LEVEL SECURITY;

-- Everyone authenticated can read published content
CREATE POLICY "Authenticated users can view published training"
  ON public.training_content FOR SELECT TO authenticated
  USING (is_published = true);

-- Admins can manage all training content
CREATE POLICY "Admins can manage training content"
  ON public.training_content FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Create referrals tracking table
CREATE TABLE public.referrals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_id UUID NOT NULL,
  referred_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(referrer_id, referred_id)
);

ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own referrals"
  ON public.referrals FOR SELECT TO authenticated
  USING (auth.uid() = referrer_id);

CREATE POLICY "Admins can manage referrals"
  ON public.referrals FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));
