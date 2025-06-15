
# Component Library - Merkl.dev Platform

## Introduction

This guide covers the component library used in the Merkl.dev platform, built on top of shadcn/ui components with custom extensions for our specific use cases.

## Component Architecture

### Base Layer: shadcn/ui Components

The platform uses shadcn/ui as the foundation component library, providing:
- Consistent design system
- Accessibility compliance
- TypeScript support
- Customizable themes

### Custom Layer: Platform-Specific Components

Built on top of shadcn/ui, we have custom components for:
- Admin functionality
- Project management
- Payment processing
- User dashboards

## Core UI Components

### Layout Components

#### Card Components
```typescript
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>Project Title</CardTitle>
  </CardHeader>
  <CardContent>
    Content goes here
  </CardContent>
</Card>
```

#### Navigation Components
```typescript
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Usage in navigation
<Button variant="outline" size="sm">
  <Badge variant="secondary">Admin</Badge>
</Button>
```

### Form Components

#### Input Components
```typescript
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

<div className="space-y-2">
  <Label htmlFor="email">Email Address</Label>
  <Input
    id="email"
    type="email"
    placeholder="Enter your email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
  />
</div>
```

#### Select Components
```typescript
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

<Select value={status} onValueChange={setStatus}>
  <SelectTrigger>
    <SelectValue placeholder="Select status" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="pending">Pending</SelectItem>
    <SelectItem value="completed">Completed</SelectItem>
  </SelectContent>
</Select>
```

### Interactive Components

#### Dialog Components
```typescript
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
    </DialogHeader>
    <p>Dialog content goes here</p>
  </DialogContent>
</Dialog>
```

#### Toast Notifications
```typescript
import { useToast } from '@/hooks/use-toast';

const { toast } = useToast();

// Success notification
toast({
  title: "Success",
  description: "Operation completed successfully",
});

// Error notification
toast({
  title: "Error",
  description: "Something went wrong",
  variant: "destructive",
});
```

## Custom Platform Components

### Admin Components

#### AdminAccessGuard
Protects admin routes from unauthorized access.

```typescript
import { AdminAccessGuard } from '@/components/admin/AdminAccessGuard';

<AdminAccessGuard>
  <AdminDashboard />
</AdminAccessGuard>
```

#### AdminDashboardLayout
Provides consistent layout for admin pages.

```typescript
import { AdminDashboardLayout } from '@/components/admin/AdminDashboardLayout';

<AdminDashboardLayout>
  <YourAdminContent />
</AdminDashboardLayout>
```

### Project Components

#### MyProjectsSection
Displays user's projects with status and progress.

```typescript
import { MyProjectsSection } from '@/components/MyProjectsSection';

<MyProjectsSection />
```

#### ProjectCard
Individual project display component.

```typescript
// Used within MyProjectsSection
<ProjectCard
  project={project}
  onStatusUpdate={handleStatusUpdate}
/>
```

### Contact Components

#### ContactMessageCard
Displays contact inquiry with admin actions.

```typescript
import { ContactMessageCard } from '@/components/ContactMessageCard';

<ContactMessageCard
  message={inquiry}
  onStatusChange={handleStatusChange}
/>
```

## Component Patterns

### 1. Compound Components

Many components follow the compound component pattern:

```typescript
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    Content
  </CardContent>
  <CardFooter>
    Footer actions
  </CardFooter>
</Card>
```

### 2. Render Props Pattern

Some components accept render functions for flexibility:

```typescript
<DataTable
  data={projects}
  renderRow={(project) => (
    <ProjectRow key={project.id} project={project} />
  )}
/>
```

### 3. Context-Based Components

Components that rely on context providers:

```typescript
// Must be wrapped in AuthProvider
const { user, userRole } = useAuth();
```

## Styling Guidelines

### Tailwind CSS Classes

Use consistent Tailwind classes throughout:

```typescript
// Layout
"flex flex-col space-y-4"
"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"

// Colors
"bg-blue-600 hover:bg-blue-700"
"text-gray-600 dark:text-gray-300"

// Spacing
"p-4 mb-6"
"space-y-2 space-x-4"

// Responsive
"hidden md:block"
"w-full md:w-1/2 lg:w-1/3"
```

### Custom CSS Variables

The platform uses CSS custom properties for theming:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;
  --primary-foreground: 210 40% 98%;
}
```

## Component Creation Guidelines

### 1. Single Responsibility

Each component should have one clear purpose:

```typescript
// Good: Focused component
const ProjectStatus = ({ status }: { status: string }) => {
  return <Badge variant={getVariant(status)}>{status}</Badge>;
};

// Avoid: Multi-responsibility component
const ProjectEverything = ({ project }) => {
  // Handles display, editing, deletion, etc.
};
```

### 2. TypeScript Props

Always define proper TypeScript interfaces:

```typescript
interface ProjectCardProps {
  project: {
    id: string;
    title: string;
    status: string;
    created_at: string;
  };
  onEdit?: (project: Project) => void;
  onDelete?: (projectId: string) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ 
  project, 
  onEdit, 
  onDelete 
}) => {
  // Component implementation
};
```

### 3. Event Handling

Use consistent event handling patterns:

```typescript
// Good: Descriptive event handlers
const handleProjectEdit = (project: Project) => {
  onEdit?.(project);
};

const handleStatusChange = (newStatus: string) => {
  updateProjectStatus(project.id, newStatus);
};

// Avoid: Generic handlers
const handleClick = () => {
  // What does this do?
};
```

### 4. Accessibility

Ensure components are accessible:

```typescript
<button
  aria-label={`Edit project ${project.title}`}
  aria-describedby={`project-${project.id}-description`}
  onClick={handleEdit}
>
  <Edit className="h-4 w-4" />
</button>
```

## Testing Components

### Manual Testing Checklist

For each component, verify:
- [ ] Renders correctly in all supported browsers
- [ ] Responsive design works on mobile/tablet/desktop
- [ ] Keyboard navigation functions properly
- [ ] Screen reader compatibility
- [ ] Dark/light theme support
- [ ] Loading states display correctly
- [ ] Error states are handled gracefully

### Component Documentation

Document each custom component with:

```typescript
/**
 * ProjectCard - Displays project information with actions
 * 
 * @param project - Project data object
 * @param onEdit - Optional callback for edit action
 * @param onDelete - Optional callback for delete action
 * 
 * @example
 * <ProjectCard
 *   project={myProject}
 *   onEdit={handleEdit}
 *   onDelete={handleDelete}
 * />
 */
```

## Performance Optimization

### Memoization

Use React.memo for expensive components:

```typescript
const ProjectCard = React.memo(({ project, onEdit }: ProjectCardProps) => {
  // Component implementation
}, (prevProps, nextProps) => {
  return prevProps.project.id === nextProps.project.id &&
         prevProps.project.status === nextProps.project.status;
});
```

### Lazy Loading

Load components only when needed:

```typescript
const AdminDashboard = lazy(() => import('@/pages/AdminDashboard'));

<Suspense fallback={<div>Loading...</div>}>
  <AdminDashboard />
</Suspense>
```

## Icon Usage

### Lucide React Icons

Consistent icon usage throughout the platform:

```typescript
import { Users, Settings, FileText, Shield } from 'lucide-react';

// Standard size
<Users className="h-4 w-4" />

// With color
<Settings className="h-5 w-5 text-gray-500" />

// In buttons
<Button>
  <FileText className="h-4 w-4 mr-2" />
  View Details
</Button>
```

### Icon Guidelines

- Use h-4 w-4 for small icons (16px)
- Use h-5 w-5 for medium icons (20px)
- Use h-6 w-6 for large icons (24px)
- Always include accessible alt text or aria-labels
- Maintain consistent spacing with mr-2 or ml-2

## Component Library Extensions

### Adding New Components

When adding new components:

1. Create in appropriate directory (`/components` or `/components/admin`)
2. Follow naming conventions (PascalCase)
3. Include TypeScript types
4. Add to component exports
5. Document usage and props
6. Test across different screen sizes

### Extending Existing Components

To extend shadcn/ui components:

```typescript
// Extend Button with custom variants
const customButtonVariants = cva(
  // Base classes from original
  buttonVariants.base,
  {
    variants: {
      ...buttonVariants.variants,
      // Add custom variants
      success: "bg-green-600 text-white hover:bg-green-700",
      warning: "bg-yellow-600 text-white hover:bg-yellow-700",
    },
  }
);
```

## Best Practices Summary

1. **Consistency**: Use established patterns and naming conventions
2. **Accessibility**: Ensure all components are keyboard and screen reader accessible
3. **Performance**: Optimize for rendering performance with proper memoization
4. **TypeScript**: Always use proper typing for props and state
5. **Documentation**: Document complex components and their usage
6. **Testing**: Test components across different devices and browsers
7. **Reusability**: Create components that can be reused across the platform

---

*This component library documentation is regularly updated. Check for the latest version when developing new features.*
