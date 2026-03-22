-- Allow authenticated users to increment views_count on training_content
CREATE POLICY "Authenticated users can increment views"
  ON public.training_content
  FOR UPDATE
  TO authenticated
  USING (is_published = true)
  WITH CHECK (is_published = true);
