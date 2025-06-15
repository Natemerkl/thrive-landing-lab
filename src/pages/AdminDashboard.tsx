
import React from 'react';
import AdminAccessGuard from '@/components/admin/AdminAccessGuard';
import AdminDashboardLayout from '@/components/admin/AdminDashboardLayout';

const AdminDashboard = () => {
  return (
    <AdminAccessGuard>
      <AdminDashboardLayout />
    </AdminAccessGuard>
  );
};

export default AdminDashboard;
