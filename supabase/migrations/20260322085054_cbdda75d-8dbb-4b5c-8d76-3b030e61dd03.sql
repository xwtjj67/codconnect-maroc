
-- Distribution state table (single row for atomic counter)
CREATE TABLE public.distribution_state (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  current_index integer NOT NULL DEFAULT 0,
  total_sheets integer NOT NULL DEFAULT 7,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.distribution_state ENABLE ROW LEVEL SECURITY;

-- Insert initial state
INSERT INTO public.distribution_state (current_index, total_sheets) VALUES (0, 7);

-- Distribution logs table
CREATE TABLE public.distribution_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_name text,
  user_phone text,
  user_role text,
  sheet_index integer NOT NULL,
  success boolean NOT NULL DEFAULT true,
  error_message text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.distribution_logs ENABLE ROW LEVEL SECURITY;

-- RLS: Admins can view
CREATE POLICY "Admins can view distribution state" ON public.distribution_state
  FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can view distribution logs" ON public.distribution_logs
  FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- Atomic function to get next sheet index and increment counter
CREATE OR REPLACE FUNCTION public.get_next_sheet_index()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  _current integer;
  _total integer;
BEGIN
  SELECT current_index, total_sheets INTO _current, _total
  FROM public.distribution_state
  LIMIT 1
  FOR UPDATE;

  UPDATE public.distribution_state
  SET current_index = (_current + 1) % _total,
      updated_at = now();

  RETURN _current;
END;
$$;
