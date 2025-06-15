
-- Update RLS policies for contact inquiries to allow admin access
DROP POLICY IF EXISTS "Admin can view all contact inquiries" ON public.contact_inquiries;

CREATE POLICY "Admin can view all contact inquiries" ON public.contact_inquiries
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Allow admin to update contact inquiry status
CREATE POLICY "Admin can update contact inquiries" ON public.contact_inquiries
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );
