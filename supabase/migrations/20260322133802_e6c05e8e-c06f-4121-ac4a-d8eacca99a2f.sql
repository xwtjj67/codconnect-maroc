
-- Add thumbnail and views columns to training_content
ALTER TABLE public.training_content 
  ADD COLUMN IF NOT EXISTS thumbnail text DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS views_count integer NOT NULL DEFAULT 0;

-- Create watch history table for tracking
CREATE TABLE public.watch_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  content_id uuid NOT NULL REFERENCES public.training_content(id) ON DELETE CASCADE,
  last_watched_at timestamp with time zone NOT NULL DEFAULT now(),
  watch_count integer NOT NULL DEFAULT 1,
  UNIQUE(user_id, content_id)
);

ALTER TABLE public.watch_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own watch history" ON public.watch_history
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can upsert own watch history" ON public.watch_history
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own watch history" ON public.watch_history
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all watch history" ON public.watch_history
  FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
