
-- Drop all existing policies first
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Super admin can view all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Super admin can manage all roles" ON public.user_roles;

-- Create a policy that allows users to view their own roles
CREATE POLICY "Users can view their own roles" 
  ON public.user_roles 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create a policy for super admin based on user ID instead of email
-- We'll hardcode the super admin user ID since we know it from the logs
CREATE POLICY "Super admin can view all roles"
  ON public.user_roles
  FOR SELECT
  USING (
    auth.uid() = '9034c3af-b095-45a9-bda3-2447c6ed81c5'::uuid
    OR auth.uid() = user_id
  );

-- Allow super admin to manage all roles
CREATE POLICY "Super admin can manage all roles"
  ON public.user_roles
  FOR ALL
  USING (
    auth.uid() = '9034c3af-b095-45a9-bda3-2447c6ed81c5'::uuid
  );
