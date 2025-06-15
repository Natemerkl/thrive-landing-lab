
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAdminNavigation } from '@/hooks/useAdminNavigation';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminNavigationCards from '@/components/admin/AdminNavigationCards';
import AdminOverview from '@/components/admin/AdminOverview';
import UserManagement from '@/components/admin/UserManagement';
import ContactMessages from '@/components/admin/ContactMessages';
import PaymentManagement from '@/components/admin/PaymentManagement';

const AdminDashboard = () => {
  const { user, userRole, signOut } = useAuth();
  const navigate = useNavigate();
  const { activeTab, handleTabChange } = useAdminNavigation();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  // Redirect if not admin
  if (userRole !== 'admin' && user?.email !== 'nattyesquire@gmail.com') {
    navigate('/dashboard');
    return null;
  }

  console.log('Current active tab:', activeTab);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100">
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        <AdminHeader userEmail={user?.email} onSignOut={handleSignOut} />
        
        <AdminNavigationCards onTabChange={handleTabChange} />

        {/* Admin Tabs */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <AdminOverview />
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <UserManagement />
          </TabsContent>

          <TabsContent value="messages" className="space-y-4">
            <ContactMessages />
          </TabsContent>

          <TabsContent value="payments" className="space-y-4">
            <PaymentManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
