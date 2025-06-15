
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut, ArrowLeft, Users, CreditCard, MessageSquare } from 'lucide-react';
import UserManagementTab from './UserManagementTab';
import PaymentManagementTab from './PaymentManagementTab';
import ContactMessagesTab from './ContactMessagesTab';

const AdminManagementLayout: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('users');

  console.log('AdminManagementLayout rendered, activeTab:', activeTab);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleTabChange = (newTab: string) => {
    console.log('Changing tab to:', newTab);
    setActiveTab(newTab);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100">
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Button onClick={() => navigate('/admin')} variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Admin Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-red-900">
                Admin Management
              </h1>
              <p className="text-red-700">
                {user?.email} • Administrator Access
              </p>
            </div>
          </div>
          <Button onClick={handleSignOut} variant="outline">
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card 
            className={`cursor-pointer hover:shadow-lg transition-shadow border-orange-200 ${
              activeTab === 'users' ? 'bg-orange-100 border-orange-300' : 'bg-orange-50'
            }`}
            onClick={() => handleTabChange('users')}
          >
            <CardHeader>
              <CardTitle className="flex items-center text-orange-900">
                <Users className="mr-2 h-5 w-5" />
                User Management
              </CardTitle>
              <CardDescription className="text-orange-700">
                View and manage user accounts and roles
              </CardDescription>
            </CardHeader>
          </Card>

          <Card 
            className={`cursor-pointer hover:shadow-lg transition-shadow border-purple-200 ${
              activeTab === 'payments' ? 'bg-purple-100 border-purple-300' : 'bg-purple-50'
            }`}
            onClick={() => handleTabChange('payments')}
          >
            <CardHeader>
              <CardTitle className="flex items-center text-purple-900">
                <CreditCard className="mr-2 h-5 w-5" />
                Payment Management
              </CardTitle>
              <CardDescription className="text-purple-700">
                Review payment screenshots and approve transactions
              </CardDescription>
            </CardHeader>
          </Card>

          <Card 
            className={`cursor-pointer hover:shadow-lg transition-shadow border-teal-200 ${
              activeTab === 'messages' ? 'bg-teal-100 border-teal-300' : 'bg-teal-50'
            }`}
            onClick={() => handleTabChange('messages')}
          >
            <CardHeader>
              <CardTitle className="flex items-center text-teal-900">
                <MessageSquare className="mr-2 h-5 w-5" />
                Contact Messages
              </CardTitle>
              <CardDescription className="text-teal-700">
                Review and respond to customer inquiries
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="users" className="flex items-center">
              <Users className="mr-2 h-4 w-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex items-center">
              <CreditCard className="mr-2 h-4 w-4" />
              Payments
            </TabsTrigger>
            <TabsTrigger value="messages" className="flex items-center">
              <MessageSquare className="mr-2 h-4 w-4" />
              Messages
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            <UserManagementTab />
          </TabsContent>

          <TabsContent value="payments" className="space-y-4">
            <PaymentManagementTab />
          </TabsContent>

          <TabsContent value="messages" className="space-y-4">
            <ContactMessagesTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminManagementLayout;
