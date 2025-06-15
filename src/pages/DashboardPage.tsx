
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LogOut, Settings, Users, CreditCard, Globe, FileText, CheckCircle, MessageSquare } from 'lucide-react';

const DashboardPage = () => {
  const { user, userRole, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  // Updated admin check to include email fallback
  const isAdmin = userRole === 'admin' || user?.email === 'nattyesquire@gmail.com';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto py-8 px-4 max-w-6xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Welcome{isAdmin ? ' Admin' : ''}!
            </h1>
            <p className="text-muted-foreground">
              {user?.email} • {isAdmin ? 'Administrator' : 'User'}
            </p>
          </div>
          <Button onClick={handleSignOut} variant="outline">
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>

        {/* Special message for admin */}
        {isAdmin && (
          <Card className="mb-8 border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-blue-900">Admin Access Granted</CardTitle>
              <CardDescription className="text-blue-700">
                You have administrator privileges. Access admin features below:
              </CardDescription>
            </CardHeader>
          </Card>
        )}

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Admin Dashboard - Only for admin */}
          {isAdmin && (
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
                  onClick={() => navigate('/admin')} 
                  className="w-full bg-red-600 hover:bg-red-700"
                >
                  Open Admin Dashboard
                </Button>
              </CardContent>
            </Card>
          )}

          {/* User Management - Only for admin */}
          {isAdmin && (
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
                  onClick={() => navigate('/admin')} 
                  className="w-full bg-orange-600 hover:bg-orange-700"
                >
                  Manage Users
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Payment Management - Only for admin */}
          {isAdmin && (
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
                  onClick={() => navigate('/admin')} 
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  Manage Payments
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Message Management - Only for admin */}
          {isAdmin && (
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
                  onClick={() => navigate('/admin')} 
                  className="w-full bg-teal-600 hover:bg-teal-700"
                >
                  View Messages
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Project Selection - For all users */}
          <Card className="cursor-pointer hover:shadow-lg transition-shadow border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center text-blue-900">
                <Globe className="mr-2 h-5 w-5" />
                Start New Project
              </CardTitle>
              <CardDescription className="text-blue-700">
                Choose your project type and get started
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => navigate('/choose-project')} 
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Choose Project
              </Button>
            </CardContent>
          </Card>

          {/* Payment Page - For all users */}
          <Card className="cursor-pointer hover:shadow-lg transition-shadow border-gray-200 bg-gray-50">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-900">
                <FileText className="mr-2 h-5 w-5" />
                Make Payment
              </CardTitle>
              <CardDescription className="text-gray-700">
                Submit payment for your project
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => navigate('/payment')} 
                className="w-full bg-gray-600 hover:bg-gray-700"
              >
                Go to Payment
              </Button>
            </CardContent>
          </Card>

          {/* Payment Verification - For all users */}
          <Card className="cursor-pointer hover:shadow-lg transition-shadow border-emerald-200 bg-emerald-50">
            <CardHeader>
              <CardTitle className="flex items-center text-emerald-900">
                <CheckCircle className="mr-2 h-5 w-5" />
                Payment Verification
              </CardTitle>
              <CardDescription className="text-emerald-700">
                Track payment status, history, and contact support
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => navigate('/payment-verification')} 
                className="w-full bg-emerald-600 hover:bg-emerald-700"
              >
                Check Payment Status
              </Button>
            </CardContent>
          </Card>

          {/* Home Page - For all users */}
          <Card className="cursor-pointer hover:shadow-lg transition-shadow border-indigo-200 bg-indigo-50">
            <CardHeader>
              <CardTitle className="flex items-center text-indigo-900">
                <Globe className="mr-2 h-5 w-5" />
                Main Website
              </CardTitle>
              <CardDescription className="text-indigo-700">
                Return to the main landing page
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => navigate('/')} 
                className="w-full bg-indigo-600 hover:bg-indigo-700"
              >
                Go to Home
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
