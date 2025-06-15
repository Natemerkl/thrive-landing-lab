
# Database Schema Documentation - Merkl.dev Platform

## Overview

The Merkl.dev platform uses PostgreSQL (via Supabase) with a well-structured relational database design. The schema supports user management, project tracking, feature selection, payment processing, and administrative functions.

## Entity Relationship Diagram

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   auth.     │    │   public.   │    │   public.   │
│   users     │◄──►│  profiles   │    │ user_roles  │
│             │    │             │◄──►│             │
└─────────────┘    └─────────────┘    └─────────────┘
       │                                      │
       │                                      │
       ▼                                      ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   public.   │    │   public.   │    │   public.   │
│  payments   │◄──►│  projects   │◄──►│project_feat.│
│             │    │             │    │             │
└─────────────┘    └─────────────┘    └─────────────┘
                                             │
                                             ▼
                                    ┌─────────────┐
                                    │   public.   │
                                    │  features   │
                                    │             │
                                    └─────────────┘
```

## Core Tables

### 1. auth.users (Supabase Managed)

This table is managed by Supabase Auth and contains core user authentication data.

**Purpose**: User authentication and basic account information  
**Managed by**: Supabase Auth Service  
**Access**: Read-only from application code

**Key Fields**:
- `id` (UUID) - Primary key, used as foreign key in other tables
- `email` (TEXT) - User's email address
- `encrypted_password` (TEXT) - Encrypted password
- `email_confirmed_at` (TIMESTAMP) - Email verification time
- `created_at` (TIMESTAMP) - Account creation time

### 2. public.profiles

**Purpose**: Extended user profile information  
**Relationship**: One-to-one with auth.users

```sql
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  PRIMARY KEY (id)
);
```

**Fields**:
- `id` (UUID, PK) - Links to auth.users.id
- `email` (TEXT) - Cached email from auth.users
- `full_name` (TEXT) - User's display name
- `created_at` (TIMESTAMP) - Profile creation time
- `updated_at` (TIMESTAMP) - Last update time

**RLS Policies**:
- Users can view/update their own profile
- Admins can view all profiles

### 3. public.user_roles

**Purpose**: Role-based access control  
**Relationship**: Many-to-one with auth.users

```sql
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  UNIQUE (user_id, role)
);
```

**Fields**:
- `id` (UUID, PK) - Unique identifier
- `user_id` (UUID, FK) - References auth.users.id
- `role` (app_role ENUM) - User role (admin, user)

**RLS Policies**:
- Users can view their own roles
- Admins can view and manage all roles

### 4. public.features

**Purpose**: Available features and services catalog  
**Relationship**: Many-to-many with projects via project_features

```sql
CREATE TABLE public.features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL DEFAULT 0,
  category TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

**Fields**:
- `id` (UUID, PK) - Unique identifier
- `name` (TEXT) - Feature name
- `description` (TEXT) - Detailed description
- `price` (NUMERIC) - Base price in ETB
- `category` (TEXT) - Feature category (starter, business, enterprise, custom)
- `is_active` (BOOLEAN) - Whether feature is available
- `created_at` (TIMESTAMP) - Creation time
- `updated_at` (TIMESTAMP) - Last update time

**Categories**:
- `starter` - Basic website features
- `business` - Advanced business features
- `enterprise` - Complex application features
- `custom` - Custom development work

### 5. public.projects

**Purpose**: Project management and tracking  
**Relationship**: Belongs to user, has many features, optionally linked to payment

```sql
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
```

**Fields**:
- `id` (UUID, PK) - Unique identifier
- `user_id` (UUID, FK) - Project owner
- `payment_id` (UUID, FK) - Associated payment
- `title` (TEXT) - Project name
- `description` (TEXT) - Project details
- `status` (TEXT) - Current status
- `start_date` (TIMESTAMP) - Work start date
- `completion_date` (TIMESTAMP) - Completion date
- `notes` (TEXT) - Internal notes
- `created_at` (TIMESTAMP) - Creation time
- `updated_at` (TIMESTAMP) - Last update time

**Status Values**:
- `pending` - Awaiting start
- `started` - Initial work begun
- `in_progress` - Active development
- `completed` - Project finished
- `cancelled` - Project terminated

**RLS Policies**:
- Users can view their own projects
- Users can create projects
- Admins can view and manage all projects

### 6. public.project_features

**Purpose**: Links projects to selected features with customization  
**Relationship**: Junction table between projects and features

```sql
CREATE TABLE public.project_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  feature_id UUID REFERENCES public.features(id) ON DELETE CASCADE NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  custom_price NUMERIC,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

**Fields**:
- `id` (UUID, PK) - Unique identifier
- `project_id` (UUID, FK) - Associated project
- `feature_id` (UUID, FK) - Selected feature
- `quantity` (INTEGER) - Number of instances
- `custom_price` (NUMERIC) - Overridden price
- `notes` (TEXT) - Feature-specific notes
- `created_at` (TIMESTAMP) - Selection time

**RLS Policies**:
- Users can view features for their own projects
- Users can create features for their own projects
- Admins can manage all project features

### 7. public.payments

**Purpose**: Payment tracking and verification  
**Relationship**: Has many projects, belongs to user

```sql
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  amount NUMERIC NOT NULL,
  currency TEXT DEFAULT 'ETB',
  payment_method TEXT NOT NULL,
  bank TEXT NOT NULL,
  bank_reference TEXT NOT NULL,
  payer_email TEXT NOT NULL,
  plan_id TEXT NOT NULL,
  receipt_url TEXT,
  status TEXT DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

**Fields**:
- `id` (UUID, PK) - Unique identifier
- `user_id` (UUID, FK) - Payment submitter
- `amount` (NUMERIC) - Payment amount
- `currency` (TEXT) - Currency code (ETB)
- `payment_method` (TEXT) - Payment type
- `bank` (TEXT) - Bank name
- `bank_reference` (TEXT) - Transaction reference
- `payer_email` (TEXT) - Payer's email
- `plan_id` (TEXT) - Selected package
- `receipt_url` (TEXT) - Receipt file URL
- `status` (TEXT) - Verification status
- `notes` (TEXT) - Admin notes
- `created_at` (TIMESTAMP) - Submission time
- `updated_at` (TIMESTAMP) - Last update time

**Status Values**:
- `pending` - Awaiting verification
- `verified` - Payment confirmed
- `failed` - Payment unsuccessful
- `refunded` - Payment returned

## Supporting Tables

### 8. public.contact_inquiries

**Purpose**: Customer inquiries and lead management

```sql
CREATE TABLE public.contact_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  project_type TEXT,
  budget_range TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

**Fields**:
- `id` (UUID, PK) - Unique identifier
- `name` (TEXT) - Inquirer name
- `email` (TEXT) - Contact email
- `phone` (TEXT) - Phone number
- `project_type` (TEXT) - Type of project
- `budget_range` (TEXT) - Budget expectation
- `message` (TEXT) - Inquiry message
- `status` (TEXT) - Processing status
- `created_at` (TIMESTAMP) - Inquiry time
- `updated_at` (TIMESTAMP) - Last update time

### 9. public.newsletter_subscriptions

**Purpose**: Email newsletter management

```sql
CREATE TABLE public.newsletter_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  is_active BOOLEAN DEFAULT true,
  source TEXT DEFAULT 'landing_page',
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

**Fields**:
- `id` (UUID, PK) - Unique identifier
- `email` (TEXT) - Subscriber email
- `is_active` (BOOLEAN) - Subscription status
- `source` (TEXT) - Subscription source
- `subscribed_at` (TIMESTAMP) - Subscription time

### 10. public.testimonials

**Purpose**: Customer testimonials and reviews

```sql
CREATE TABLE public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name TEXT NOT NULL,
  client_company TEXT,
  client_role TEXT,
  content TEXT NOT NULL,
  rating INTEGER,
  project_type TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

### 11. public.billing_history

**Purpose**: Historical billing and invoice tracking

```sql
CREATE TABLE public.billing_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  payment_id UUID REFERENCES public.payments(id),
  invoice_number TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  currency TEXT DEFAULT 'ETB',
  payment_method TEXT,
  status TEXT DEFAULT 'pending',
  billing_period_start TIMESTAMP WITH TIME ZONE,
  billing_period_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

## Database Functions

### 1. handle_new_user()

**Purpose**: Automatically create user profiles and assign roles when users register

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  -- Insert profile
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data ->> 'full_name', '')
  );
  
  -- Assign role
  IF new.email = 'nattyesquire@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (new.id, 'admin');
  ELSE
    INSERT INTO public.user_roles (user_id, role)
    VALUES (new.id, 'user');
  END IF;
  
  RETURN new;
END;
$$;
```

### 2. has_role()

**Purpose**: Security definer function to check user roles (prevents RLS recursion)

```sql
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;
```

## Row Level Security (RLS) Policies

### Security Overview

All tables have RLS enabled with policies that ensure:
1. Users can only access their own data
2. Admins have full access to all data
3. Public data (features, testimonials) is accessible to everyone

### Key Policy Patterns

#### User Data Access
```sql
-- Pattern: Users can access their own records
CREATE POLICY "Users can view their own projects" 
  ON public.projects 
  FOR SELECT 
  USING (auth.uid() = user_id);
```

#### Admin Access
```sql
-- Pattern: Admins can access all records
CREATE POLICY "Admins can manage all projects"
  ON public.projects
  FOR ALL
  USING (
    auth.uid() = '9034c3af-b095-45a9-bda3-2447c6ed81c5'::uuid
  );
```

#### Public Data Access
```sql
-- Pattern: Public read access
CREATE POLICY "Anyone can view active features"
  ON public.features
  FOR SELECT
  USING (is_active = true);
```

## Indexes and Performance

### Primary Indexes
- All tables have UUID primary keys with automatic indexes
- Foreign key columns have automatic indexes

### Custom Indexes
```sql
-- Project performance indexes
CREATE INDEX idx_projects_user_id ON public.projects(user_id);
CREATE INDEX idx_projects_status ON public.projects(status);
CREATE INDEX idx_projects_created_at ON public.projects(created_at);

-- Payment tracking indexes
CREATE INDEX idx_payments_user_id ON public.payments(user_id);
CREATE INDEX idx_payments_status ON public.payments(status);

-- Feature lookup indexes
CREATE INDEX idx_features_category ON public.features(category);
CREATE INDEX idx_features_is_active ON public.features(is_active);
```

## Data Relationships

### One-to-One Relationships
- `auth.users` ↔ `public.profiles`

### One-to-Many Relationships
- `auth.users` → `public.projects`
- `auth.users` → `public.payments`
- `public.projects` → `public.project_features`
- `public.features` → `public.project_features`

### Many-to-Many Relationships
- `projects` ↔ `features` (through `project_features`)

## Data Migration Strategy

### Version Control
- All schema changes tracked in numbered migration files
- Migrations applied in chronological order
- Rollback procedures documented for each migration

### Migration Files
```
supabase/migrations/
├── 20250615073948-initial-schema.sql
├── 20250615080000-update-contact-policies.sql
├── 20250615204041-add-projects-table.sql
└── ...
```

### Best Practices
1. Never modify existing migrations
2. Always create new migrations for changes
3. Test migrations in development first
4. Backup production before major migrations

## Data Validation

### Database Constraints
- NOT NULL constraints on required fields
- CHECK constraints for enum-like values
- UNIQUE constraints for business rules
- Foreign key constraints for referential integrity

### Application-Level Validation
- TypeScript interfaces for type safety
- Zod schemas for runtime validation
- Form validation in React components
- API validation in Supabase functions

## Backup and Recovery

### Automated Backups
- Supabase provides automated daily backups
- Point-in-time recovery available
- Cross-region backup replication

### Manual Backup Procedures
```sql
-- Export specific tables
pg_dump --table=public.projects > projects_backup.sql

-- Full database backup
pg_dump database_name > full_backup.sql
```

## Monitoring and Maintenance

### Performance Monitoring
- Query performance tracking
- Index usage analysis
- Connection pool monitoring
- Storage usage tracking

### Regular Maintenance
- Update table statistics
- Reindex when necessary
- Monitor for unused indexes
- Clean up old data

---

*This schema documentation should be updated whenever database changes are made.*
