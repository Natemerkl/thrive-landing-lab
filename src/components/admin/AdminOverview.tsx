
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, MessageSquare, CreditCard, TrendingUp } from 'lucide-react';

interface DashboardStats {
  totalUsers: number;
  totalMessages: number;
  pendingPayments: number;
  totalRevenue: number;
}

const AdminOverview: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalMessages: 0,
    pendingPayments: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);

      // Fetch total users
      const { count: usersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Fetch total contact messages
      const { count: messagesCount } = await supabase
        .from('contact_inquiries')
        .select('*', { count: 'exact', head: true });

      // Fetch pending payments
      const { count: pendingPaymentsCount } = await supabase
        .from('payments')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      // Fetch total revenue from verified payments
      const { data: revenueData } = await supabase
        .from('payments')
        .select('amount')
        .eq('status', 'verified');

      const totalRevenue = revenueData?.reduce((sum, payment) => sum + Number(payment.amount), 0) || 0;

      setStats({
        totalUsers: usersCount || 0,
        totalMessages: messagesCount || 0,
        pendingPayments: pendingPaymentsCount || 0,
        totalRevenue
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              Registered users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contact Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMessages}</div>
            <p className="text-xs text-muted-foreground">
              Total inquiries
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingPayments}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting review
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRevenue.toFixed(2)} ETB</div>
            <p className="text-xs text-muted-foreground">
              From verified payments
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common administrative tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Recent Activity</h3>
              <p className="text-sm text-muted-foreground">
                {stats.totalUsers} users registered
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Payment Status</h3>
              <p className="text-sm text-muted-foreground">
                {stats.pendingPayments} payments need review
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Support Queue</h3>
              <p className="text-sm text-muted-foreground">
                {stats.totalMessages} messages in queue
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOverview;
