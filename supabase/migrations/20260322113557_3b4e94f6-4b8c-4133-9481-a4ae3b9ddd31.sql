
CREATE TYPE public.service_request_status AS ENUM ('pending', 'contacted', 'closed');

CREATE TABLE public.service_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL,
  role text NOT NULL,
  service_name text NOT NULL,
  status service_request_status NOT NULL DEFAULT 'pending',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.service_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage service requests" ON public.service_requests
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can create service requests" ON public.service_requests
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);
