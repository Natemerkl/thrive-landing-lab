
# Troubleshooting Guide - Merkl.dev Platform

## Common Issues and Solutions

This guide covers the most frequently encountered issues and their solutions for both users and administrators of the Merkl.dev platform.

## User Issues

### Authentication Problems

#### 1. Cannot Sign Up / Registration Fails

**Symptoms:**
- Registration form doesn't submit
- Error messages during signup
- No confirmation email received

**Solutions:**

**Check Email Format:**
```
✓ Correct: user@example.com
✗ Incorrect: user.example.com (missing @)
✗ Incorrect: @example.com (missing username)
```

**Password Requirements:**
- Minimum 8 characters
- Include letters and numbers
- Avoid common passwords

**Email Delivery Issues:**
1. Check spam/junk folder
2. Wait 5-10 minutes for delivery
3. Contact admin if no email received after 30 minutes

**Browser Issues:**
1. Clear browser cache and cookies
2. Disable browser extensions temporarily
3. Try incognito/private browsing mode
4. Try a different browser

#### 2. Cannot Sign In / Login Fails

**Symptoms:**
- "Invalid credentials" error
- Login form doesn't respond
- Redirected back to login page

**Solutions:**

**Verify Credentials:**
1. Double-check email address (case-sensitive)
2. Ensure password is correct
3. Check if Caps Lock is on

**Account Status:**
1. Verify email if account is new
2. Check if account has been activated
3. Contact admin if account may be suspended

**Browser Issues:**
1. Enable cookies and JavaScript
2. Clear browser data
3. Update browser to latest version

**Password Reset:**
1. Click "Forgot Password" link
2. Enter your email address
3. Check email for reset link
4. Follow instructions to set new password

#### 3. Email Verification Issues

**Symptoms:**
- Verification email not received
- Verification link doesn't work
- "Email not confirmed" error

**Solutions:**

**Email Delivery:**
1. Check all email folders (inbox, spam, promotions)
2. Add noreply@merkl.dev to your contacts
3. Check if your email provider blocks automated emails

**Link Issues:**
1. Click the link from the original device/browser
2. Ensure the link hasn't expired (usually 24 hours)
3. Copy and paste the full URL if clicking doesn't work

**Request New Verification:**
1. Go to login page
2. Enter your email and password
3. Click "Resend verification email" if available
4. Contact support if option not available

### Project and Payment Issues

#### 4. Payment Not Recognized / Project Not Created

**Symptoms:**
- Payment made but project not created
- Payment status shows as "pending"
- No confirmation received after payment

**Solutions:**

**Verify Payment Details:**
1. Double-check bank reference number
2. Ensure payment amount matches exactly
3. Verify payment was sent to correct account

**Upload Receipt:**
1. Take clear photo/scan of payment receipt
2. Upload to payment verification page
3. Include all transaction details visible

**Wait for Verification:**
- Payments are verified within 24 hours during business days
- Weekends and holidays may take longer
- Check your email for updates

**Contact Support:**
If payment not recognized after 48 hours:
1. Use contact form on website
2. Include payment reference number
3. Attach copy of receipt
4. Provide your account email

#### 5. Project Status Not Updating

**Symptoms:**
- Project shows same status for extended period
- No progress updates received
- Completion date passed without update

**Solutions:**

**Check Dashboard:**
1. Log in to your account
2. Go to "My Projects" section
3. Click refresh button
4. Check for any notifications

**Expected Timelines:**
- **Starter Package**: 3-5 business days
- **Business Package**: 1-2 weeks  
- **Enterprise Package**: 2-4 weeks

**Status Meanings:**
- **Pending**: Project in queue, will start soon
- **Started**: Initial work has begun
- **In Progress**: Active development
- **Completed**: Project finished and delivered

**Contact for Updates:**
If no update after expected timeline:
1. Contact support through website
2. Include project ID
3. Request status update

#### 6. Cannot Access Downloaded Files

**Symptoms:**
- Download links don't work
- Files appear corrupted
- Cannot open project files

**Solutions:**

**Download Issues:**
1. Right-click download link and "Save As"
2. Try downloading from different browser
3. Disable download managers temporarily
4. Check if antivirus is blocking download

**File Corruption:**
1. Try downloading again
2. Use different internet connection
3. Contact support for direct file transfer

**File Format Issues:**
1. Ensure you have appropriate software to open files
2. For websites: Use any web browser
3. For source code: Use code editor (VS Code, Sublime Text)
4. For designs: Use appropriate design software

### Dashboard and Interface Issues

#### 7. Page Loading Problems

**Symptoms:**
- Pages load slowly or not at all
- White screen or error messages
- Features not working properly

**Solutions:**

**Browser Issues:**
1. Refresh the page (Ctrl+F5 or Cmd+Shift+R)
2. Clear browser cache and cookies
3. Update browser to latest version
4. Try different browser

**Internet Connection:**
1. Check internet connection stability
2. Try from different network
3. Contact ISP if connection issues persist

**Device Issues:**
1. Restart your device
2. Close other applications using internet
3. Try from different device

**Report Persistent Issues:**
If problems continue:
1. Note error messages
2. Include browser and OS version
3. Contact support with details

## Admin Issues

### User Management Problems

#### 8. Cannot Access Admin Dashboard

**Symptoms:**
- Redirected to regular dashboard
- Admin menu not visible
- Permission denied errors

**Solutions:**

**Verify Admin Role:**
1. Check user_roles table in database
2. Ensure user has 'admin' role assigned
3. Verify correct user ID in policies

**Database Issues:**
```sql
-- Check user role
SELECT ur.role, p.email 
FROM user_roles ur 
JOIN profiles p ON ur.user_id = p.id 
WHERE p.email = 'admin@example.com';

-- Assign admin role if needed
INSERT INTO user_roles (user_id, role) 
VALUES ('user-uuid-here', 'admin');
```

**Clear Session:**
1. Log out completely
2. Clear browser data
3. Log back in

#### 9. RLS Policy Errors

**Symptoms:**
- "Row level security" errors
- Cannot access user data
- Database permission errors

**Solutions:**

**Check Policies:**
```sql
-- View existing policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE schemaname = 'public';

-- Fix admin access policy
CREATE POLICY "Admins can view all projects"
  ON public.projects
  FOR SELECT
  USING (
    auth.uid() = '9034c3af-b095-45a9-bda3-2447c6ed81c5'::uuid
  );
```

**Update Admin UUID:**
1. Find admin user ID from auth.users
2. Update hardcoded UUID in policies
3. Test admin access

### Payment Verification Issues

#### 10. Payment Verification Errors

**Symptoms:**
- Cannot verify payments
- Payment status won't update
- Project not created after verification

**Solutions:**

**Database Connection:**
1. Check Supabase connection
2. Verify database credentials
3. Test with simple query

**Status Update Process:**
```sql
-- Update payment status
UPDATE payments 
SET status = 'verified', updated_at = now()
WHERE id = 'payment-uuid';

-- Create associated project
INSERT INTO projects (user_id, payment_id, title, description, status)
VALUES (
  'user-uuid',
  'payment-uuid', 
  'Project Title',
  'Project Description',
  'pending'
);
```

**Validation Checks:**
1. Verify bank reference numbers match
2. Check payment amounts are correct
3. Ensure user exists in system
4. Confirm no duplicate payments

### System Performance Issues

#### 11. Slow Database Queries

**Symptoms:**
- Dashboard loads slowly
- Admin operations timeout
- High database CPU usage

**Solutions:**

**Check Indexes:**
```sql
-- Add missing indexes
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
```

**Optimize Queries:**
1. Review slow query logs
2. Add WHERE clauses to limit results
3. Use pagination for large datasets
4. Consider query caching

**Monitor Performance:**
1. Use Supabase dashboard analytics
2. Check connection pool usage
3. Monitor memory usage
4. Review error logs

## Development Issues

### Setup and Build Problems

#### 12. npm install Fails

**Symptoms:**
- Dependency installation errors
- Module not found errors
- Build process fails

**Solutions:**

**Clear Dependencies:**
```bash
# Remove node modules and package-lock
rm -rf node_modules package-lock.json

# Clear npm cache
npm cache clean --force

# Reinstall dependencies
npm install
```

**Node Version Issues:**
1. Check Node.js version (requires 18+)
2. Use nvm to switch versions if needed
3. Update npm to latest version

**Permission Issues:**
```bash
# Fix npm permissions (Mac/Linux)
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) /usr/local/lib/node_modules
```

#### 13. Environment Variable Issues

**Symptoms:**
- Supabase connection fails
- Environment variables undefined
- Build errors related to config

**Solutions:**

**Check .env File:**
```env
# Verify these variables exist and are correct
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

**Restart Development Server:**
```bash
# Stop server (Ctrl+C)
# Start again
npm run dev
```

**Verify Environment Loading:**
```typescript
// Check in browser console
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
```

#### 14. TypeScript Compilation Errors

**Symptoms:**
- Type checking errors
- Build fails with TS errors
- IDE shows type warnings

**Solutions:**

**Update Type Definitions:**
```bash
# Regenerate Supabase types
npx supabase gen types typescript --project-id your-project-id > src/integrations/supabase/types.ts
```

**Fix Common Type Issues:**
```typescript
// Use proper typing for Supabase queries
const { data, error } = await supabase
  .from('projects')
  .select('*')
  .eq('user_id', userId);

if (error) {
  console.error('Error:', error);
  return;
}

// data is now properly typed
console.log(data);
```

## Emergency Procedures

### System Outage Response

#### 15. Complete System Down

**Immediate Actions:**
1. Check Supabase dashboard for service status
2. Verify DNS and domain configuration
3. Check CDN status if using one
4. Monitor error tracking services

**Communication:**
1. Update status page if available
2. Send notification to users
3. Post updates on social media
4. Contact hosting provider if needed

**Recovery Steps:**
1. Identify root cause
2. Implement fix or rollback
3. Verify system functionality
4. Monitor for additional issues
5. Post-incident review

### Data Recovery

#### 16. Data Loss or Corruption

**Assessment:**
1. Determine scope of data loss
2. Identify last known good backup
3. Check if partial recovery possible
4. Estimate recovery time

**Recovery Process:**
1. Stop all write operations
2. Restore from most recent backup
3. Verify data integrity
4. Test critical functionality
5. Resume normal operations

**Prevention:**
1. Implement automated backups
2. Test backup restoration regularly
3. Monitor data integrity
4. Document recovery procedures

## Getting Additional Help

### When to Contact Support

Contact support if you experience:
- Issues not covered in this guide
- Problems persisting after trying solutions
- Critical system errors
- Data loss or corruption
- Security concerns

### How to Report Issues

When contacting support, include:

**For Users:**
- Your account email
- Browser and device information
- Screenshot of error messages
- Steps to reproduce the issue
- What you were trying to do

**For Admins:**
- Error logs and messages
- Database query results if applicable
- System configuration details
- Recent changes made to the system
- Impact on users

### Support Channels

- **Website Contact Form**: Primary support channel
- **Email**: info@merkl.dev
- **Emergency**: For critical issues affecting all users

### Response Times

- **Critical Issues**: Within 2 hours
- **High Priority**: Within 4 hours
- **Normal Issues**: Within 24 hours
- **General Questions**: Within 48 hours

---

*This troubleshooting guide is regularly updated based on common issues and user feedback. If you encounter an issue not covered here, please report it so we can add it to the guide.*
