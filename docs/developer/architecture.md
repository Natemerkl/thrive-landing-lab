
# Architecture Overview - Merkl.dev Platform

## System Architecture

The Merkl.dev platform is built as a modern full-stack web application with a clear separation between frontend and backend services.

### High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Supabase      │    │   External      │
│   (React)       │◄──►│   Backend       │◄──►│   Services      │
│                 │    │                 │    │                 │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│ • React 18      │    │ • PostgreSQL    │    │ • Email         │
│ • TypeScript    │    │ • Auth Service  │    │ • Payment Gway  │
│ • Tailwind CSS  │    │ • Real-time     │    │ • File Storage  │
│ • Vite          │    │ • Edge Funcs    │    │ • Analytics     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Frontend Architecture

### Technology Stack

- **React 18**: Latest React with concurrent features
- **TypeScript**: Type safety and better developer experience
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Modern, accessible component library

### Component Architecture

```
src/
├── components/
│   ├── ui/              # Base UI components (shadcn/ui)
│   ├── admin/           # Admin-specific components
│   └── [feature]/       # Feature-specific components
├── pages/               # Route-level components
├── contexts/            # Global state management
├── hooks/               # Custom React hooks
└── lib/                 # Utility functions
```

#### Component Hierarchy

```
App
├── AuthContext Provider
├── React Query Provider
├── Router
│   ├── Public Routes
│   │   ├── Home (/)
│   │   ├── Auth (/auth)
│   │   └── Payment Verification
│   └── Protected Routes
│       ├── Dashboard (/dashboard)
│       ├── Project Choice (/project-choice)
│       ├── Payment (/payment)
│       └── Admin (/admin)
```

### State Management Strategy

#### 1. Server State (React Query)
- API data fetching and caching
- Background synchronization
- Optimistic updates
- Error handling and retries

```typescript
// Example: Project data fetching
const { data: projects, isLoading } = useQuery({
  queryKey: ['projects', userId],
  queryFn: () => fetchUserProjects(userId),
  staleTime: 5 * 60 * 1000, // 5 minutes
});
```

#### 2. Global Client State (React Context)
- Authentication state
- User roles and permissions
- Theme preferences
- Global UI state

```typescript
// AuthContext manages user session
const AuthContext = createContext<{
  user: User | null;
  userRole: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}>({...});
```

#### 3. Local Component State (useState/useReducer)
- Form data
- UI interaction state
- Component-specific state
- Temporary data

### Routing Architecture

#### Route Structure

```typescript
// Main routing configuration
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

#### Route Protection

- **Public Routes**: Accessible to all users
- **Protected Routes**: Require authentication
- **Role-Based Routes**: Require specific user roles

## Backend Architecture (Supabase)

### Database Layer

#### PostgreSQL Database
- Primary data storage
- ACID compliance
- Advanced querying capabilities
- JSON support for flexible schemas

#### Row Level Security (RLS)
- Table-level security policies
- User-based data isolation
- Role-based access control
- Automatic policy enforcement

```sql
-- Example RLS policy
CREATE POLICY "Users can view their own projects" 
  ON public.projects 
  FOR SELECT 
  USING (auth.uid() = user_id);
```

### Authentication & Authorization

#### Supabase Auth
- Email/password authentication
- Session management
- Password recovery
- Email verification

#### Role-Based Access Control
```sql
-- User roles enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Role assignment table
CREATE TABLE public.user_roles (
  user_id UUID REFERENCES auth.users(id),
  role app_role NOT NULL DEFAULT 'user'
);
```

### API Layer

#### Auto-generated REST API
- CRUD operations for all tables
- Real-time subscriptions
- Filter and pagination support
- Type-safe client generation

#### Custom Edge Functions
- Business logic processing
- External API integrations
- Background job processing
- Custom authentication flows

### Real-time Features

#### Live Data Updates
```typescript
// Real-time project updates
const subscription = supabase
  .channel('projects')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'projects' },
    handleProjectUpdate
  )
  .subscribe();
```

## Data Flow Architecture

### User Authentication Flow

```
1. User submits credentials
   ↓
2. Supabase Auth validates
   ↓
3. JWT token generated
   ↓
4. Frontend stores session
   ↓
5. AuthContext updates
   ↓
6. Protected routes accessible
```

### Project Creation Flow

```
1. User selects features
   ↓
2. Frontend calculates total
   ↓
3. Payment form submitted
   ↓
4. Payment record created
   ↓
5. Admin verifies payment
   ↓
6. Project auto-created
   ↓
7. User receives notification
```

### Admin Management Flow

```
1. Admin action triggered
   ↓
2. Role validation
   ↓
3. Database operation
   ↓
4. Real-time update
   ↓
5. UI reflects changes
   ↓
6. Audit log created
```

## Security Architecture

### Frontend Security

#### Input Validation
- TypeScript type checking
- Form validation with zod
- Sanitization of user inputs
- XSS prevention

#### Authentication State
- Secure token storage
- Automatic token refresh
- Session timeout handling
- Route protection

### Backend Security

#### Database Security
- Row Level Security policies
- Encrypted data storage
- SQL injection prevention
- Connection security

#### API Security
- JWT token validation
- Rate limiting
- CORS configuration
- Request validation

## Performance Architecture

### Frontend Optimization

#### Code Splitting
```typescript
// Lazy loading for routes
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
```

#### Caching Strategy
- React Query for API data
- Browser caching for static assets
- Service worker for offline support
- CDN for global distribution

### Backend Optimization

#### Database Optimization
- Proper indexing strategy
- Query optimization
- Connection pooling
- Read replicas for scaling

#### API Optimization
- Response caching
- Pagination for large datasets
- Background processing
- Edge function optimization

## Deployment Architecture

### Frontend Deployment

```
Development → Build → Static Files → CDN → Users
     ↓           ↓          ↓         ↓       ↓
   Vite       Bundle    Assets    Global   Fast
   Dev        JS/CSS    Optim.   Delivery  Load
```

### Backend Deployment

```
Supabase Cloud
├── Database (PostgreSQL)
├── Auth Service
├── Real-time Engine
├── Edge Functions
└── Storage Service
```

## Monitoring and Observability

### Frontend Monitoring
- Error tracking and reporting
- Performance metrics
- User interaction analytics
- Real user monitoring

### Backend Monitoring
- Database performance
- API response times
- Error rates
- Resource utilization

## Scalability Considerations

### Horizontal Scaling
- Stateless frontend architecture
- Database read replicas
- CDN distribution
- Load balancing

### Vertical Scaling
- Component optimization
- Database tuning
- Caching improvements
- Resource allocation

## Development Architecture

### Build System
```
Source Code → TypeScript → Vite → Bundle → Deploy
     ↓            ↓         ↓        ↓        ↓
   React        Types     Optim.   Assets   CDN
   Components   Check     Bundle   Comp.    Dist.
```

### Development Workflow
```
Feature Branch → Development → Testing → Code Review → Main → Deploy
       ↓             ↓          ↓          ↓         ↓        ↓
     Local         Local      Manual     GitHub    Staging  Prod
     Server        Tests      Testing    PR        Deploy   Deploy
```

## Integration Architecture

### External Services
- **Email**: Transactional emails for notifications
- **Payment**: Ethiopian bank integration
- **Analytics**: User behavior tracking
- **Monitoring**: Error tracking and performance

### API Integrations
- RESTful API design
- JSON data format
- Error handling standards
- Rate limiting

## Future Architecture Considerations

### Potential Enhancements
- Microservices architecture
- Event-driven architecture
- Advanced caching layers
- Mobile app integration
- AI/ML feature integration

### Migration Strategies
- Gradual feature migration
- Zero-downtime deployments
- Database migration tools
- Backward compatibility

---

*This architecture documentation should be updated as the system evolves and new requirements emerge.*
