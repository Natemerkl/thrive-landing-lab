
-- Fix RLS policies for project_features table to allow users to insert features for their own projects

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their project features" ON public.project_features;
DROP POLICY IF EXISTS "Only admins can manage project features" ON public.project_features;

-- Allow users to insert project features for their own projects
CREATE POLICY "Users can create project features for their own projects" 
  ON public.project_features 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.projects 
      WHERE id = project_id AND user_id = auth.uid()
    )
  );

-- Allow users to view project features for their own projects
CREATE POLICY "Users can view their project features" 
  ON public.project_features 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.projects 
      WHERE id = project_id AND user_id = auth.uid()
    )
    OR 
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Allow admins to manage all project features
CREATE POLICY "Admins can manage all project features" 
  ON public.project_features 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );
