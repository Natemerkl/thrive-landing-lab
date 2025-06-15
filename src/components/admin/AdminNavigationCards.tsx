
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, Users, CreditCard, MessageSquare, Home, DollarSign, CheckCircle, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AdminNavigationCardsProps {
  onTabChange: (tab: string) => void;
}

const AdminNavigationCards: React.FC<AdminNavigationCardsProps> = ({ onTabChange }) => {
  const navigate = useNavigate();

  const handleNavigation = (action: string) => {
    console.log('Navigation action:', action);
    
    switch (action) {
      case 'overview':
      case 'users':
      case 'payments':
      case 'messages':
        onTabChange(action);
        break;
      case 'choose-project':
        navigate('/choose-project');
        break;
      case 'payment':
        navigate('/payment');
        break;
      case 'payment-verification':
        navigate('/payment-verification');
        break;
      case 'home':
        navigate('/');
        break;
      default:
        console.warn('Unknown navigation action:', action);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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
            onClick={() => handleNavigation('overview')} 
            className="w-full bg-red-600 hover:bg-red-700"
          >
            Open Admin Dashboard
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
            onClick={() => handleNavigation('users')} 
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
            onClick={() => handleNavigation('payments')} 
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
            onClick={() => handleNavigation('messages')} 
            className="w-full bg-teal-600 hover:bg-teal-700"
          >
            View Messages
          </Button>
        </CardContent>
      </Card>

      {/* Start New Project Card */}
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
            onClick={() => handleNavigation('choose-project')} 
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            Choose Project
          </Button>
        </CardContent>
      </Card>

      {/* Make Payment Card */}
      <Card className="cursor-pointer hover:shadow-lg transition-shadow border-gray-200 bg-gray-50">
        <CardHeader>
          <CardTitle className="flex items-center text-gray-900">
            <DollarSign className="mr-2 h-5 w-5" />
            Make Payment
          </CardTitle>
          <CardDescription className="text-gray-700">
            Submit payment for your project
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={() => handleNavigation('payment')} 
            className="w-full bg-gray-600 hover:bg-gray-700"
          >
            Go to Payment
          </Button>
        </CardContent>
      </Card>

      {/* Payment Verification Card */}
      <Card className="cursor-pointer hover:shadow-lg transition-shadow border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center text-green-900">
            <CheckCircle className="mr-2 h-5 w-5" />
            Payment Verification
          </CardTitle>
          <CardDescription className="text-green-700">
            Track payment status, history, and contact support
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={() => handleNavigation('payment-verification')} 
            className="w-full bg-green-600 hover:bg-green-700"
          >
            Check Payment Status
          </Button>
        </CardContent>
      </Card>

      {/* Main Website Card */}
      <Card className="cursor-pointer hover:shadow-lg transition-shadow border-indigo-200 bg-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center text-indigo-900">
            <Home className="mr-2 h-5 w-5" />
            Main Website
          </CardTitle>
          <CardDescription className="text-indigo-700">
            Return to the main landing page
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={() => handleNavigation('home')} 
            className="w-full bg-indigo-600 hover:bg-indigo-700"
          >
            Go to Home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminNavigationCards;
