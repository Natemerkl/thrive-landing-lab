
# Deployment Guide - Merkl.dev Platform

## Overview

This guide covers the deployment process for the Merkl.dev platform, including environment setup, build optimization, and production deployment strategies.

## Prerequisites

Before deploying, ensure you have:
- Node.js 18+ installed
- A Supabase project configured
- Environment variables properly set
- Domain and hosting provider ready

## Environment Setup

### Production Environment Variables

Create production environment variables in your hosting platform:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_production_anon_key

# Optional: Additional Configuration
VITE_APP_VERSION=1.0.0
VITE_ENVIRONMENT=production
```

### Environment Validation

Verify all required environment variables are set:

```typescript
// Environment validation (optional)
const requiredEnvVars = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY'
];

requiredEnvVars.forEach(envVar => {
  if (!import.meta.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
});
```

## Build Process

### Production Build

Create an optimized production build:

```bash
# Install dependencies
npm install

# Create production build
npm run build

# Preview production build locally
npm run preview
```

### Build Optimization

The build process includes:
- **Code Splitting**: Automatic route-based code splitting
- **Tree Shaking**: Removes unused code
- **Minification**: Compresses JavaScript and CSS
- **Asset Optimization**: Optimizes images and static assets

### Build Output

The build creates a `dist/` directory containing:
```
dist/
├── assets/
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── [other-assets]
├── index.html
└── other static files
```

## Deployment Platforms

### Vercel Deployment

#### Automatic Deployment

1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on git push

#### Manual Deployment

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy to Vercel
vercel --prod
```

#### Vercel Configuration

Create `vercel.json` for custom configuration:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Netlify Deployment

#### Automatic Deployment

1. Connect repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Configure environment variables

#### Netlify Configuration

Create `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"
```

### Traditional Hosting

For traditional web hosting providers:

1. Build the project locally: `npm run build`
2. Upload the `dist/` folder contents to your web server
3. Configure your web server for SPA routing
4. Set up SSL certificate

#### Apache Configuration

Create `.htaccess` in your web root:

```apache
RewriteEngine On
RewriteBase /

# Handle Angular and React Router
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# Optional: Enable gzip compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>
```

#### Nginx Configuration

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    
    root /path/to/your/dist;
    index index.html;
    
    # Handle SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

## Database Setup

### Supabase Production Configuration

1. **Create Production Project**: Set up a separate Supabase project for production
2. **Run Migrations**: Apply all database migrations to production
3. **Configure RLS**: Ensure Row Level Security policies are properly set
4. **Set Up Authentication**: Configure authentication providers
5. **Create Admin User**: Set up initial admin user

### Migration Deployment

Apply migrations to production:

```bash
# Using Supabase CLI
supabase db push

# Or apply migrations manually through Supabase dashboard
```

### Initial Data Setup

Create initial admin user and essential data:

```sql
-- Create admin user (replace with your admin email)
INSERT INTO auth.users (email, email_confirmed_at, created_at, updated_at)
VALUES ('admin@merkl.dev', NOW(), NOW(), NOW());

-- Assign admin role
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'
FROM auth.users
WHERE email = 'admin@merkl.dev';
```

## Domain Configuration

### Custom Domain Setup

1. **DNS Configuration**: Point your domain to your hosting provider
2. **SSL Certificate**: Ensure SSL/TLS certificate is installed
3. **Domain Verification**: Verify domain ownership with hosting provider

### DNS Records

For most hosting providers:

```
Type: A
Name: @
Value: [Hosting Provider IP]

Type: CNAME
Name: www
Value: yourdomain.com
```

For Vercel/Netlify:

```
Type: CNAME
Name: @
Value: [platform-provided-url]

Type: CNAME
Name: www
Value: [platform-provided-url]
```

## Performance Optimization

### Build Optimization

Configure Vite for optimal production builds:

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    // Optimize chunk splitting
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-accordion', '@radix-ui/react-dialog'],
          supabase: ['@supabase/supabase-js']
        }
      }
    },
    // Enable source maps for debugging
    sourcemap: false,
    // Optimize bundle size
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  }
})
```

### CDN Configuration

For better performance, consider using a CDN:
- CloudFlare
- AWS CloudFront
- Azure CDN
- Google Cloud CDN

### Caching Strategy

Implement proper caching headers:

```
# Static assets (1 year)
Cache-Control: public, max-age=31536000, immutable

# HTML files (no cache)
Cache-Control: no-cache, no-store, must-revalidate

# API responses (short cache)
Cache-Control: public, max-age=300
```

## Monitoring and Logging

### Error Monitoring

Consider implementing error monitoring:

```typescript
// Example with a monitoring service
if (import.meta.env.PROD) {
  // Initialize error monitoring
  // (Sentry, LogRocket, etc.)
}
```

### Performance Monitoring

Monitor key metrics:
- **First Contentful Paint** (FCP)
- **Largest Contentful Paint** (LCP)
- **Cumulative Layout Shift** (CLS)
- **First Input Delay** (FID)

### Health Checks

Implement health check endpoints:

```typescript
// Simple health check
const healthCheck = async () => {
  try {
    // Test database connection
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);
    
    return { status: 'healthy', database: !error };
  } catch (error) {
    return { status: 'unhealthy', error: error.message };
  }
};
```

## Deployment Checklist

### Pre-Deployment

- [ ] All tests passing
- [ ] Build succeeds without warnings
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] Security policies tested
- [ ] Performance optimized
- [ ] SEO meta tags updated
- [ ] Error handling implemented

### Post-Deployment

- [ ] Application loads correctly
- [ ] All routes functioning
- [ ] Authentication working
- [ ] Database connectivity verified
- [ ] Payment processing tested
- [ ] Admin functions accessible
- [ ] Contact forms working
- [ ] Mobile responsiveness verified
- [ ] Performance metrics acceptable
- [ ] Error monitoring active

## Rollback Strategy

### Quick Rollback

For critical issues, implement quick rollback:

1. **Hosting Platform**: Use platform's rollback feature
2. **Database**: Have migration rollback scripts ready
3. **DNS**: Keep previous deployment accessible via subdomain

### Backup Strategy

- **Database**: Regular automated backups
- **Application**: Tagged releases in version control
- **Assets**: CDN/storage backup of uploaded files

## Security Considerations

### HTTPS Enforcement

Ensure HTTPS is enforced:

```typescript
// Redirect to HTTPS in production
if (import.meta.env.PROD && location.protocol !== 'https:') {
  location.replace(`https:${location.href.substring(location.protocol.length)}`);
}
```

### Security Headers

Implement security headers:

```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000; includeSubDomains
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'
```

### Environment Security

- Never commit environment variables to version control
- Use secure methods to set production environment variables
- Regularly rotate API keys and secrets
- Monitor for unauthorized access

## Troubleshooting Deployment Issues

### Common Build Issues

**Missing Environment Variables**
```
Error: Missing environment variable VITE_SUPABASE_URL
```
Solution: Verify all required environment variables are set in your hosting platform.

**Build Memory Issues**
```
JavaScript heap out of memory
```
Solution: Increase Node.js memory limit:
```bash
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

**Import Path Issues**
```
Module not found: Can't resolve '@/components/...'
```
Solution: Verify path aliases are configured in `vite.config.ts`.

### Runtime Issues

**White Screen After Deployment**
- Check browser console for JavaScript errors
- Verify all assets are loading correctly
- Check for environment variable issues

**Routing Issues (404 on Refresh)**
- Configure web server for SPA routing
- Verify redirect rules are in place

**Database Connection Issues**
- Verify Supabase URL and keys
- Check network connectivity
- Verify RLS policies

## Maintenance

### Regular Maintenance Tasks

**Weekly**:
- Monitor application performance
- Check error logs
- Review security alerts
- Update dependencies (if needed)

**Monthly**:
- Analyze usage metrics
- Review database performance
- Update documentation
- Security audit

**Quarterly**:
- Full performance review
- Backup verification
- Disaster recovery testing
- Security penetration testing

---

*This deployment guide is regularly updated. For the latest deployment best practices, refer to your hosting provider's documentation.*
