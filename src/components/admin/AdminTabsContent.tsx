
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import AdminOverview from './AdminOverview';
import UserManagementTab from './UserManagementTab';
import ContactMessages from './ContactMessages';
import PaymentManagement from './PaymentManagement';

const AdminTabsContent: React.FC = () => {
  return (
    <>
      <TabsContent value="overview" className="space-y-4">
        <AdminOverview />
      </TabsContent>

      <TabsContent value="users" className="space-y-4">
        <UserManagementTab />
      </TabsContent>

      <TabsContent value="messages" className="space-y-4">
        <ContactMessages />
      </TabsContent>

      <TabsContent value="payments" className="space-y-4">
        <PaymentManagement />
      </TabsContent>
    </>
  );
};

export default AdminTabsContent;
