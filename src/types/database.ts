
export interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  message: string;
  phone?: string;
  project_type?: string;
  budget_range?: string;
  status: 'new' | 'contacted' | 'in_progress' | 'completed' | 'closed';
  created_at: string;
  updated_at: string;
}

export interface NewsletterSubscription {
  id: string;
  email: string;
  subscribed_at: string;
  is_active: boolean;
  source: string;
}

export interface Testimonial {
  id: string;
  client_name: string;
  client_company?: string;
  client_role?: string;
  content: string;
  rating: number;
  project_type?: string;
  is_featured: boolean;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProjectQuote {
  id: string;
  client_name: string;
  client_email: string;
  project_title: string;
  project_description: string;
  estimated_timeline?: string;
  estimated_budget?: number;
  status: 'pending' | 'approved' | 'rejected' | 'in_progress' | 'completed';
  quote_expires_at?: string;
  created_at: string;
  updated_at: string;
}
