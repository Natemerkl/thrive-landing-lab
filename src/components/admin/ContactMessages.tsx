
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const ContactMessages: React.FC = () => {
  return (
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
  );
};

export default ContactMessages;
