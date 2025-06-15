
import React from 'react';
import AdminAccessGuard from '@/components/admin/AdminAccessGuard';
import AdminManagementLayout from '@/components/admin/AdminManagementLayout';

const AdminManagementPage = () => {
  console.log('AdminManagementPage rendered');
  
  return (
    <AdminAccessGuard>
      <AdminManagementLayout />
    </AdminAccessGuard>
  );
};

export default AdminManagementPage;
