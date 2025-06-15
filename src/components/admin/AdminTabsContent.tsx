
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ContactMessagesTab from './ContactMessagesTab';
import PaymentManagementTab from './PaymentManagementTab';
import UserManagementTab from './UserManagementTab';
import ProjectManagement from './ProjectManagement';

const AdminTabsContent = () => {
  return (
    <Tabs defaultValue="overview" className="space-y-4">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="projects">Projects</TabsTrigger>
        <TabsTrigger value="payments">Payments</TabsTrigger>
        <TabsTrigger value="messages">Messages</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Overview cards can be added here */}
        </div>
      </TabsContent>

      <TabsContent value="projects" className="space-y-4">
        <ProjectManagement />
      </TabsContent>

      <TabsContent value="payments" className="space-y-4">
        <PaymentManagementTab />
      </TabsContent>

      <TabsContent value="messages" className="space-y-4">
        <ContactMessagesTab />
      </TabsContent>
    </Tabs>
  );
};

export default AdminTabsContent;
