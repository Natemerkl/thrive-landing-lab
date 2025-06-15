
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const PaymentManagement: React.FC = () => {
  return (
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
  );
};

export default PaymentManagement;
