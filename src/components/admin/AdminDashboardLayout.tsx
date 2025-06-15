
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAdminNavigation } from '@/hooks/useAdminNavigation';
import AdminHeader from './AdminHeader';
import AdminNavigationCards from './AdminNavigationCards';
import AdminTabsContent from './AdminTabsContent';

const AdminDashboardLayout: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { activeTab, handleTabChange } = useAdminNavigation();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

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

          <AdminTabsContent />
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboardLayout;
