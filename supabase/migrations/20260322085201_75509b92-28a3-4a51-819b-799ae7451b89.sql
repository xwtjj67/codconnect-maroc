
CREATE OR REPLACE FUNCTION public.get_next_sheet_index()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  _current integer;
  _total integer;
  _id uuid;
BEGIN
  SELECT id, current_index, total_sheets INTO _id, _current, _total
  FROM public.distribution_state
  LIMIT 1
  FOR UPDATE;

  UPDATE public.distribution_state
  SET current_index = (_current + 1) % _total,
      updated_at = now()
  WHERE id = _id;

  RETURN _current;
END;
$$;
