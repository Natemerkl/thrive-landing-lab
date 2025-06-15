
-- Create a features table to store all available features with their prices
CREATE TABLE public.features (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL DEFAULT 0,
  category TEXT NOT NULL, -- e.g., 'starter', 'business', 'enterprise', 'custom'
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create a table to track which features are selected for each project
CREATE TABLE public.project_features (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  feature_id UUID REFERENCES public.features(id) ON DELETE CASCADE NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  custom_price NUMERIC, -- In case of custom pricing for this specific project
  notes TEXT, -- Any specific notes for this feature in this project
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(project_id, feature_id)
);

-- Add Row Level Security
ALTER TABLE public.features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_features ENABLE ROW LEVEL SECURITY;

-- Features are public for everyone to see
CREATE POLICY "Features are viewable by everyone" 
  ON public.features 
  FOR SELECT 
  USING (true);

-- Only admins can manage features
CREATE POLICY "Only admins can manage features" 
  ON public.features 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Users can view project features for their own projects, admins can view all
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

-- Only admins can manage project features
CREATE POLICY "Only admins can manage project features" 
  ON public.project_features 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Insert sample features for different packages
INSERT INTO public.features (name, description, price, category) VALUES
-- Starter Package Features
('Responsive Landing Page', 'Mobile-friendly single page design', 2000, 'starter'),
('Contact Form Integration', 'Basic contact form with email notifications', 1000, 'starter'),
('Basic SEO Optimization', 'Meta tags, titles, and basic SEO setup', 1500, 'starter'),
('Professional Design Template', 'Pre-designed professional layout', 1000, 'starter'),

-- Business Package Features
('Multi-page Website', 'Up to 5 pages with navigation', 4000, 'business'),
('Content Management System', 'Easy-to-use admin panel for content updates', 3000, 'business'),
('Advanced SEO Optimization', 'Comprehensive SEO with analytics integration', 2500, 'business'),
('Lead Generation Forms', 'Advanced forms with CRM integration', 2000, 'business'),
('Business Branding Integration', 'Custom branding and logo integration', 1500, 'business'),
('Social Media Integration', 'Social media feeds and sharing buttons', 1000, 'business'),

-- Enterprise Package Features
('Custom Web Application', 'Full-stack custom application development', 15000, 'enterprise'),
('Database Design & Integration', 'Custom database schema and integration', 5000, 'enterprise'),
('User Authentication System', 'Secure login and user management', 4000, 'enterprise'),
('Admin Dashboard', 'Comprehensive admin panel with analytics', 6000, 'enterprise'),
('API Development', 'RESTful API for third-party integrations', 4000, 'enterprise'),
('Advanced Security Features', 'Security auditing and implementation', 3000, 'enterprise'),
('Performance Optimization', 'Speed and performance optimizations', 2000, 'enterprise'),

-- Custom Features
('E-commerce Integration', 'Online store with payment processing', 8000, 'custom'),
('Payment Gateway Integration', 'Secure payment processing setup', 3000, 'custom'),
('Third-party API Integration', 'Integration with external services', 2500, 'custom'),
('Custom Database Features', 'Specialized database functionality', 4000, 'custom'),
('Mobile App Integration', 'Mobile app connectivity features', 6000, 'custom'),
('Real-time Features', 'Live chat, notifications, real-time updates', 3500, 'custom'),
('Advanced Analytics', 'Custom analytics and reporting dashboards', 3000, 'custom'),
('Multi-language Support', 'Internationalization and localization', 2500, 'custom');
