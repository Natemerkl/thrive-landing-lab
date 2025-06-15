
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, Users, CreditCard, MessageSquare } from 'lucide-react';

interface AdminNavigationCardsProps {
  onTabChange: (tab: string) => void;
}

const AdminNavigationCards: React.FC<AdminNavigationCardsProps> = ({ onTabChange }) => {
  return (
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
            onClick={() => onTabChange('overview')} 
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
            onClick={() => onTabChange('users')} 
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
            onClick={() => onTabChange('payments')} 
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
            onClick={() => onTabChange('messages')} 
            className="w-full bg-teal-600 hover:bg-teal-700"
          >
            View Messages
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminNavigationCards;
