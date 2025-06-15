
-- First, drop the existing problematic policies
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;

-- Create new, simpler policies that don't cause recursion
-- Allow users to view their own roles only
CREATE POLICY "Users can view their own roles"
  ON public.user_roles
  FOR SELECT
  USING (auth.uid() = user_id);

-- Allow admins to view all roles (using direct email check to avoid recursion)
CREATE POLICY "Super admin can view all roles"
  ON public.user_roles
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email = 'nattyesquire@gmail.com'
    )
  );

-- Allow admins to insert/update/delete roles
CREATE POLICY "Super admin can manage all roles"
  ON public.user_roles
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email = 'nattyesquire@gmail.com'
    )
  );
