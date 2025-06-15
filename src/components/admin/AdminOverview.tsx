
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const AdminOverview: React.FC = () => {
  return (
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
  );
};

export default AdminOverview;
