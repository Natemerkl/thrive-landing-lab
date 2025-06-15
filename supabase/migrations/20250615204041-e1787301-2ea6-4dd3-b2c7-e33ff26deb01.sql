
-- First, let's add RLS policies for contact_inquiries so admins can view all messages
-- Enable RLS if not already enabled
ALTER TABLE public.contact_inquiries ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert contact inquiries (for the contact form)
CREATE POLICY "Anyone can create contact inquiries" 
  ON public.contact_inquiries 
  FOR INSERT 
  WITH CHECK (true);

-- Allow admins to view all contact inquiries
CREATE POLICY "Admins can view all contact inquiries"
  ON public.contact_inquiries
  FOR SELECT
  USING (
    auth.uid() = '9034c3af-b095-45a9-bda3-2447c6ed81c5'::uuid
  );

-- Allow admins to update contact inquiries (for status changes)
CREATE POLICY "Admins can update contact inquiries"
  ON public.contact_inquiries
  FOR UPDATE
  USING (
    auth.uid() = '9034c3af-b095-45a9-bda3-2447c6ed81c5'::uuid
  );

-- Create a projects table to track project status
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  payment_id UUID REFERENCES public.payments(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'started', 'in_progress', 'completed', 'cancelled')),
  start_date TIMESTAMPTZ,
  completion_date TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on projects table
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Users can view their own projects
CREATE POLICY "Users can view their own projects" 
  ON public.projects 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Admins can view all projects
CREATE POLICY "Admins can view all projects"
  ON public.projects
  FOR SELECT
  USING (
    auth.uid() = '9034c3af-b095-45a9-bda3-2447c6ed81c5'::uuid
    OR auth.uid() = user_id
  );

-- Admins can manage all projects
CREATE POLICY "Admins can manage all projects"
  ON public.projects
  FOR ALL
  USING (
    auth.uid() = '9034c3af-b095-45a9-bda3-2447c6ed81c5'::uuid
  );

-- Create an index for better performance
CREATE INDEX idx_projects_user_id ON public.projects(user_id);
CREATE INDEX idx_projects_status ON public.projects(status);
