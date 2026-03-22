
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  _role app_role;
  _name TEXT;
  _phone TEXT;
  _city TEXT;
  _whatsapp TEXT;
  _store_name TEXT;
  _username TEXT;
BEGIN
  _role := COALESCE((NEW.raw_user_meta_data->>'role')::app_role, 'affiliate');
  _name := COALESCE(NEW.raw_user_meta_data->>'name', '');
  _phone := COALESCE(NEW.raw_user_meta_data->>'phone', '');
  _city := COALESCE(NEW.raw_user_meta_data->>'city', '');
  _whatsapp := COALESCE(NEW.raw_user_meta_data->>'whatsapp', '');
  _store_name := NEW.raw_user_meta_data->>'store_name';
  _username := NEW.raw_user_meta_data->>'username';

  INSERT INTO public.profiles (id, name, phone, city, whatsapp, store_name, username)
  VALUES (NEW.id, _name, _phone, _city, _whatsapp, _store_name, _username);

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
$function$;

-- Create function to get email by username for login
CREATE OR REPLACE FUNCTION public.get_email_by_username(desired_username text)
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT au.email
  FROM public.profiles p
  JOIN auth.users au ON au.id = p.id
  WHERE p.username = desired_username
  LIMIT 1
$$;

GRANT EXECUTE ON FUNCTION public.get_email_by_username(text) TO anon, authenticated;
