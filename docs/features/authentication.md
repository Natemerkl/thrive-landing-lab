
# Authentication System Documentation - Merkl.dev Platform

## Overview

The Merkl.dev platform implements a comprehensive authentication and authorization system using Supabase Auth with custom role-based access control (RBAC). The system supports user registration, login, role management, and secure session handling.

## Architecture

### Authentication Flow

```
Registration → Email Verification → Profile Creation → Role Assignment → Dashboard Access
     ↓              ↓                    ↓               ↓              ↓
  Supabase       Optional            Trigger         Auto-assign    Protected
   Auth         Verification        Function         User Role      Routes
```

### Technology Stack

- **Supabase Auth**: Core authentication service
- **PostgreSQL**: User data and role storage
- **React Context**: Frontend state management
- **React Router**: Route protection
- **TypeScript**: Type safety

## User Registration

### Registration Process

1. **Form Submission**: User provides email, password, and full name
2. **Supabase Auth**: Creates user in auth.users table
3. **Database Trigger**: Automatically creates profile and assigns role
4. **Email Verification**: Optional email confirmation
5. **Redirect**: User redirected to dashboard

### Registration Implementation

```typescript
// AuthContext.tsx
const signUp = async (email: string, password: string, fullName: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/`,
      data: {
        full_name: fullName,
      }
    }
  });

  if (error) throw error;
  return data;
};
```

### Database Trigger

```sql
-- Automatically creates profile and assigns role
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
  
  -- Check if this is the admin email and assign admin role
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

## User Login

### Login Process

1. **Credentials Verification**: Supabase validates email/password
2. **Session Creation**: JWT token generated and stored
3. **State Update**: Frontend auth context updated
4. **Role Retrieval**: User roles fetched from database
5. **Route Redirect**: User redirected to appropriate dashboard

### Login Implementation

```typescript
const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
};
```

### Session Management

```typescript
// AuthContext.tsx - Session persistence
useEffect(() => {
  // Set up auth state listener
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        // Fetch user role when session is established
        const role = await fetchUserRole(session.user.id);
        setUserRole(role);
      } else {
        setUserRole(null);
      }
    }
  );

  // Check for existing session
  supabase.auth.getSession().then(({ data: { session } }) => {
    setSession(session);
    setUser(session?.user ?? null);
  });

  return () => subscription.unsubscribe();
}, []);
```

## Role-Based Access Control (RBAC)

### Role System

The platform implements a flexible role system with two primary roles:

#### User Roles

1. **user** (Default)
   - Access to personal dashboard
   - Can create and track projects
   - Can make payments
   - View own data only

2. **admin**
   - Full system access
   - User management capabilities
   - Project management for all users
   - Payment verification
   - System administration

### Role Data Model

```sql
-- Role enum definition
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- User roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  UNIQUE (user_id, role)
);
```

### Role Checking Function

```sql
-- Security definer function to prevent RLS recursion
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

## Route Protection

### Protected Route Component

```typescript
// ProtectedRoute.tsx
interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole 
}) => {
  const { user, userRole, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
```

### Route Configuration

```typescript
// App.tsx - Route definitions
const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/auth",
    element: <AuthPage />,
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute requiredRole="admin">
        <AdminDashboard />
      </ProtectedRoute>
    ),
  },
]);
```

## Security Policies

### Row Level Security (RLS)

All user data tables implement RLS policies to ensure data isolation:

#### User Data Access

```sql
-- Users can only see their own projects
CREATE POLICY "Users can view their own projects" 
  ON public.projects 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Users can create their own projects
CREATE POLICY "Users can create their own projects" 
  ON public.projects 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);
```

#### Admin Access

```sql
-- Admins can access all data
CREATE POLICY "Admins can view all projects"
  ON public.projects
  FOR SELECT
  USING (
    auth.uid() = '9034c3af-b095-45a9-bda3-2447c6ed81c5'::uuid
  );
```

### Security Best Practices

1. **Password Security**
   - Minimum 8 characters required
   - Password hashing handled by Supabase
   - No passwords stored in plain text

2. **Session Security**
   - JWT tokens with expiration
   - Automatic token refresh
   - Secure token storage

3. **Input Validation**
   - TypeScript type checking
   - Zod schema validation
   - SQL injection prevention

## Frontend Integration

### AuthContext Provider

```typescript
// AuthContext.tsx
const AuthContext = createContext<{
  user: User | null;
  userRole: string | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<AuthResponse>;
  signUp: (email: string, password: string, fullName: string) => Promise<AuthResponse>;
  signOut: () => Promise<void>;
}>({
  user: null,
  userRole: null,
  session: null,
  loading: true,
  signIn: async () => ({ data: {}, error: null }),
  signUp: async () => ({ data: {}, error: null }),
  signOut: async () => {},
});
```

### Hook Usage

```typescript
// Using authentication in components
const MyComponent = () => {
  const { user, userRole, signOut } = useAuth();

  if (userRole === 'admin') {
    return <AdminFeatures />;
  }

  return <UserFeatures />;
};
```

## Error Handling

### Authentication Errors

```typescript
// Error handling in auth operations
const handleSignIn = async (email: string, password: string) => {
  try {
    await signIn(email, password);
    navigate('/dashboard');
  } catch (error) {
    if (error.message === 'Invalid login credentials') {
      setError('Invalid email or password');
    } else if (error.message === 'Email not confirmed') {
      setError('Please check your email and confirm your account');
    } else {
      setError('An unexpected error occurred');
    }
  }
};
```

### Common Error Types

1. **Invalid Credentials**: Wrong email/password combination
2. **Email Not Confirmed**: User hasn't verified email
3. **User Not Found**: Account doesn't exist
4. **Network Errors**: Connection issues
5. **Rate Limiting**: Too many failed attempts

## Admin User Management

### Admin Dashboard Features

1. **User List**: View all registered users
2. **Role Management**: Change user roles
3. **User Activity**: Monitor user actions
4. **Account Status**: Enable/disable accounts

### Role Assignment

```typescript
// Admin function to change user roles
const updateUserRole = async (userId: string, newRole: string) => {
  const { error } = await supabase
    .from('user_roles')
    .update({ role: newRole })
    .eq('user_id', userId);

  if (error) throw error;
};
```

## Email Verification

### Configuration

Email verification is configurable in Supabase dashboard:
- **Development**: Often disabled for faster testing
- **Production**: Recommended to be enabled for security

### Custom Email Templates

Supabase allows customization of:
- Welcome emails
- Password reset emails
- Email confirmation templates
- Magic link emails

## Password Reset

### Reset Process

1. **Request Reset**: User provides email
2. **Email Sent**: Supabase sends reset link
3. **Secure Link**: User clicks secure reset link
4. **New Password**: User sets new password
5. **Session Created**: User automatically logged in

### Implementation

```typescript
const resetPassword = async (email: string) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });

  if (error) throw error;
};
```

## Security Considerations

### Frontend Security

1. **Token Storage**: Secure token handling
2. **XSS Prevention**: Input sanitization
3. **CSRF Protection**: Token-based requests
4. **Route Protection**: Authenticated access only

### Backend Security

1. **RLS Policies**: Database-level access control
2. **Function Security**: Security definer functions
3. **Input Validation**: Server-side validation
4. **Audit Logging**: Track authentication events

## Testing Authentication

### Manual Testing Checklist

- [ ] User registration with valid data
- [ ] User registration with invalid data
- [ ] Email verification flow
- [ ] Login with correct credentials
- [ ] Login with incorrect credentials
- [ ] Password reset flow
- [ ] Session persistence across browser refresh
- [ ] Logout functionality
- [ ] Role-based access control
- [ ] Protected route access

### Automated Testing

```typescript
// Example test for authentication
describe('Authentication', () => {
  test('should sign up new user', async () => {
    const result = await signUp('test@example.com', 'password123', 'Test User');
    expect(result.error).toBeNull();
    expect(result.data.user).toBeDefined();
  });

  test('should sign in existing user', async () => {
    const result = await signIn('test@example.com', 'password123');
    expect(result.error).toBeNull();
    expect(result.data.user).toBeDefined();
  });
});
```

## Monitoring and Analytics

### Authentication Metrics

1. **Registration Rate**: New users per day/week/month
2. **Login Success Rate**: Successful vs failed logins
3. **Session Duration**: Average user session length
4. **Password Reset Rate**: Reset requests frequency

### Audit Logging

Track important authentication events:
- User registrations
- Login attempts (success/failure)
- Password resets
- Role changes
- Admin actions

---

*This authentication documentation should be updated when authentication features change or new security requirements are implemented.*
