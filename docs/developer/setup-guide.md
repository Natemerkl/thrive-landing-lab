
# Developer Setup Guide - Merkl.dev Platform

## Prerequisites

Before setting up the development environment, ensure you have the following installed:

- **Node.js** (version 18 or higher)
- **npm** or **yarn** package manager
- **Git** for version control
- **Code Editor** (VS Code recommended)

## Initial Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd merkl-dev-platform
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- React 18 with TypeScript
- Vite build tool
- Tailwind CSS for styling
- shadcn/ui component library
- Supabase client
- React Query for state management
- Lucide React for icons
- Recharts for data visualization

### 3. Environment Configuration

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Add your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Supabase Setup

#### Database Configuration

1. Create a new Supabase project
2. Run the migration files in order:
   ```bash
   # Apply migrations in chronological order
   supabase migration up
   ```

#### Required Tables

The platform uses these main tables:
- `profiles` - User profile information
- `user_roles` - Role-based access control
- `projects` - Project management
- `features` - Available features and pricing
- `project_features` - Project-feature relationships
- `payments` - Payment tracking
- `contact_inquiries` - Customer inquiries
- `newsletter_subscriptions` - Email subscriptions

#### Row Level Security (RLS)

RLS policies are automatically applied through migrations to ensure:
- Users can only access their own data
- Admins have full access to all data
- Public features are accessible to everyone

## Development Workflow

### 1. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:8080`

### 2. Code Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   └── admin/          # Admin-specific components
├── pages/              # Page components
├── contexts/           # React contexts (Auth, etc.)
├── hooks/              # Custom React hooks
├── integrations/       # External service integrations
│   └── supabase/       # Supabase client and types
├── lib/                # Utility functions
└── types/              # TypeScript type definitions
```

### 3. Key Technologies

#### Frontend Framework
- **React 18** with TypeScript for type safety
- **Vite** for fast development and optimized builds
- **React Router DOM** for client-side routing

#### Styling
- **Tailwind CSS** for utility-first styling
- **shadcn/ui** for pre-built, accessible components
- **Lucide React** for consistent iconography

#### Backend Integration
- **Supabase** for authentication, database, and real-time features
- **React Query** for server state management and caching

#### State Management
- **React Context** for global state (authentication)
- **React Query** for server state
- **Local state** with React hooks for component state

## Development Guidelines

### 1. Component Development

#### Creating New Components

Always create focused, single-responsibility components:

```typescript
// Good: Focused component
const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{project.title}</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Component content */}
      </CardContent>
    </Card>
  );
};
```

#### Component File Structure

- One component per file
- Co-locate related types in the same file
- Use named exports for components
- Keep components under 150 lines

#### Props and TypeScript

Always define proper TypeScript interfaces:

```typescript
interface ProjectCardProps {
  project: {
    id: string;
    title: string;
    status: string;
    created_at: string;
  };
  onStatusChange?: (projectId: string, status: string) => void;
}
```

### 2. Styling Guidelines

#### Tailwind CSS Usage

Use Tailwind classes consistently:

```tsx
// Responsive design
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  
// Color scheme consistency
<button className="bg-blue-600 hover:bg-blue-700 text-white">
  
// Spacing consistency
<div className="p-4 mb-6 space-y-4">
```

#### Component Library

Use shadcn/ui components for consistency:

```tsx
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
```

### 3. Data Fetching

#### Using React Query

All server state should use React Query:

```typescript
const { data: projects, isLoading, error } = useQuery({
  queryKey: ['projects', userId],
  queryFn: () => fetchUserProjects(userId),
  enabled: !!userId,
});
```

#### Error Handling

Implement proper error handling:

```typescript
if (error) {
  toast({
    title: "Error",
    description: "Failed to fetch projects",
    variant: "destructive",
  });
}
```

### 4. Authentication

#### Protected Routes

Use the ProtectedRoute component:

```tsx
<Route path="/dashboard" element={
  <ProtectedRoute>
    <DashboardPage />
  </ProtectedRoute>
} />
```

#### Role-Based Access

Check user roles in components:

```typescript
const { user, userRole } = useAuth();

if (userRole === 'admin') {
  // Render admin features
}
```

## Testing

### 1. Manual Testing

#### User Flows to Test

1. **Authentication Flow**
   - User registration
   - Email verification
   - Login/logout
   - Password reset

2. **Project Flow**
   - Package selection
   - Feature customization
   - Payment process
   - Project tracking

3. **Admin Flow**
   - User management
   - Project management
   - Payment verification
   - Contact message handling

#### Browser Testing

Test in multiple browsers:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

#### Device Testing

Test responsive design on:
- Desktop (1920x1080, 1366x768)
- Tablet (768x1024, 1024x768)
- Mobile (375x667, 414x896)

### 2. Performance Testing

#### Key Metrics to Monitor

- **First Contentful Paint** < 2s
- **Largest Contentful Paint** < 3s
- **Cumulative Layout Shift** < 0.1
- **First Input Delay** < 100ms

#### Tools for Testing

- Lighthouse (built into Chrome DevTools)
- Web Vitals browser extension
- GTmetrix for detailed analysis

## Deployment

### 1. Build Process

```bash
# Create production build
npm run build

# Preview production build locally
npm run preview
```

### 2. Environment Variables

Ensure production environment variables are set:

```env
VITE_SUPABASE_URL=your_production_supabase_url
VITE_SUPABASE_ANON_KEY=your_production_supabase_anon_key
```

### 3. Production Checklist

- [ ] All environment variables configured
- [ ] Database migrations applied
- [ ] RLS policies tested
- [ ] Admin user created
- [ ] Payment methods configured
- [ ] Email settings verified
- [ ] SSL certificate installed
- [ ] Domain configured
- [ ] Performance optimized
- [ ] Error monitoring setup

## Common Issues and Solutions

### 1. Development Issues

#### Build Errors

```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf node_modules/.vite
```

#### TypeScript Errors

- Check `tsconfig.json` configuration
- Ensure all types are properly imported
- Verify Supabase types are up to date

#### Supabase Connection Issues

- Verify environment variables
- Check network connectivity
- Confirm project URL and keys
- Review RLS policies

### 2. Database Issues

#### RLS Policy Errors

- Review policy definitions
- Check user authentication state
- Verify role assignments
- Test with proper user context

#### Migration Issues

- Apply migrations in correct order
- Check for conflicting changes
- Backup database before migrations
- Test migrations in development first

## VS Code Setup

### Recommended Extensions

```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-typescript-next",
    "ms-vscode.vscode-json",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense"
  ]
}
```

### Settings

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "tailwindCSS.includeLanguages": {
    "typescript": "javascript",
    "typescriptreact": "javascript"
  }
}
```

## Debugging

### 1. Browser DevTools

Use Chrome DevTools effectively:
- **Console**: Check for JavaScript errors
- **Network**: Monitor API calls
- **Application**: Check localStorage and cookies
- **Lighthouse**: Performance auditing

### 2. React DevTools

Install React DevTools browser extension to:
- Inspect component tree
- Debug state changes
- Profile performance
- Track renders

### 3. Supabase Dashboard

Use Supabase dashboard for:
- Database queries and inspection
- Authentication logs
- Real-time monitoring
- API logs

## Next Steps

After setup:
1. Review the [Architecture Documentation](./architecture.md)
2. Study the [Component Library](./components.md)
3. Understand the [Code Standards](./standards.md)
4. Explore the [Database Schema](../database/schema.md)

---

*For additional help, refer to the troubleshooting guide or contact the development team.*
