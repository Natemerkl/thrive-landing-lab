
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogOut, Settings, Users, CreditCard, MessageSquare, ArrowLeft } from 'lucide-react';

const AdminDashboard = () => {
  const { user, userRole, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  // Redirect if not admin
  if (userRole !== 'admin' && user?.email !== 'nattyesquire@gmail.com') {
    navigate('/dashboard');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100">
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Button onClick={() => navigate('/dashboard')} variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-red-900">
                Admin Dashboard
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

        {/* Admin Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Admin Dashboard Card */}
          <Card className="cursor-pointer hover:shadow-lg transition-shadow border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="flex items-center text-red-900">
                <Settings className="mr-2 h-5 w-5" />
                Admin Dashboard
              </CardTitle>
              <CardDescription className="text-red-700">
                Access full admin dashboard with all management tools
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => setActiveTab('overview')} 
                className="w-full bg-red-600 hover:bg-red-700"
              >
                View Overview
              </Button>
            </CardContent>
          </Card>

          {/* User Management Card */}
          <Card className="cursor-pointer hover:shadow-lg transition-shadow border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center text-orange-900">
                <Users className="mr-2 h-5 w-5" />
                User Management
              </CardTitle>
              <CardDescription className="text-orange-700">
                View and manage user accounts and roles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => setActiveTab('users')} 
                className="w-full bg-orange-600 hover:bg-orange-700"
              >
                Manage Users
              </Button>
            </CardContent>
          </Card>

          {/* Payment Management Card */}
          <Card className="cursor-pointer hover:shadow-lg transition-shadow border-purple-200 bg-purple-50">
            <CardHeader>
              <CardTitle className="flex items-center text-purple-900">
                <CreditCard className="mr-2 h-5 w-5" />
                Payment Management
              </CardTitle>
              <CardDescription className="text-purple-700">
                Review payment screenshots and approve transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => setActiveTab('payments')} 
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                Manage Payments
              </Button>
            </CardContent>
          </Card>

          {/* Contact Messages Card */}
          <Card className="cursor-pointer hover:shadow-lg transition-shadow border-teal-200 bg-teal-50">
            <CardHeader>
              <CardTitle className="flex items-center text-teal-900">
                <MessageSquare className="mr-2 h-5 w-5" />
                Contact Messages
              </CardTitle>
              <CardDescription className="text-teal-700">
                Review and respond to customer inquiries
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => setActiveTab('messages')} 
                className="w-full bg-teal-600 hover:bg-teal-700"
              >
                View Messages
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Admin Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Dashboard Overview</CardTitle>
                <CardDescription>
                  Welcome to the admin dashboard. Use the navigation cards above or tabs below to access different sections.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-semibold text-blue-900">Total Users</h3>
                    <p className="text-2xl font-bold text-blue-600">Loading...</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h3 className="font-semibold text-green-900">Pending Payments</h3>
                    <p className="text-2xl font-bold text-green-600">Loading...</p>
                  </div>
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <h3 className="font-semibold text-yellow-900">New Messages</h3>
                    <p className="text-2xl font-bold text-yellow-600">Loading...</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  Manage user accounts and roles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">User management functionality coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Contact Messages</CardTitle>
                <CardDescription>
                  Review and respond to customer inquiries
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Contact messages functionality coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Payment Management</CardTitle>
                <CardDescription>
                  Review payment screenshots and approve transactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Payment management functionality coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
