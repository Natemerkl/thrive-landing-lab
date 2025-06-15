
-- Create a table for contact form submissions
CREATE TABLE public.contact_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  phone TEXT,
  project_type TEXT,
  budget_range TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'in_progress', 'completed', 'closed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create a table for newsletter subscriptions
CREATE TABLE public.newsletter_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  subscribed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  is_active BOOLEAN DEFAULT true,
  source TEXT DEFAULT 'landing_page'
);

-- Create a table for testimonials/reviews
CREATE TABLE public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name TEXT NOT NULL,
  client_company TEXT,
  client_role TEXT,
  content TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  project_type TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create a table for project quotes/estimates
CREATE TABLE public.project_quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  project_title TEXT NOT NULL,
  project_description TEXT NOT NULL,
  estimated_timeline TEXT,
  estimated_budget DECIMAL(10,2),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'in_progress', 'completed')),
  quote_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.contact_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_quotes ENABLE ROW LEVEL SECURITY;

-- Create policies for contact inquiries (public can insert, only authenticated admin can view)
CREATE POLICY "Anyone can submit contact inquiries" ON public.contact_inquiries
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin can view all contact inquiries" ON public.contact_inquiries
  FOR SELECT USING (false); -- Will be updated when admin authentication is added

-- Create policies for newsletter subscriptions
CREATE POLICY "Anyone can subscribe to newsletter" ON public.newsletter_subscriptions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin can view newsletter subscriptions" ON public.newsletter_subscriptions
  FOR SELECT USING (false); -- Will be updated when admin authentication is added

-- Create policies for testimonials (public can read published ones)
CREATE POLICY "Anyone can view published testimonials" ON public.testimonials
  FOR SELECT USING (is_published = true);

CREATE POLICY "Admin can manage testimonials" ON public.testimonials
  FOR ALL USING (false); -- Will be updated when admin authentication is added

-- Create policies for project quotes
CREATE POLICY "Anyone can submit project quotes" ON public.project_quotes
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin can view project quotes" ON public.project_quotes
  FOR SELECT USING (false); -- Will be updated when admin authentication is added

-- Create indexes for better performance
CREATE INDEX idx_contact_inquiries_created_at ON public.contact_inquiries(created_at DESC);
CREATE INDEX idx_contact_inquiries_status ON public.contact_inquiries(status);
CREATE INDEX idx_newsletter_email ON public.newsletter_subscriptions(email);
CREATE INDEX idx_testimonials_featured ON public.testimonials(is_featured) WHERE is_featured = true;
CREATE INDEX idx_testimonials_published ON public.testimonials(is_published) WHERE is_published = true;
CREATE INDEX idx_project_quotes_status ON public.project_quotes(status);
