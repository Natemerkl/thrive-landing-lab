import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Eye, Check, X, ArrowLeft, Users, CreditCard, FileText, MessageSquare, Mail, Search, Filter } from 'lucide-react';
import ContactMessageCard from '@/components/ContactMessageCard';

interface Payment {
  id: string;
  plan_id: string;
  amount: number;
  currency: string;
  payment_method: string;
  bank_reference: string;
  receipt_url: string | null;
  status: string;
  payer_email: string;
  bank: string;
  notes: string | null;
  created_at: string;
}

interface BillingHistory {
  id: string;
  payment_id: string;
  invoice_number: string;
  amount: number;
  currency: string;
  status: string;
  payment_method: string;
  created_at: string;
}

interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  message: string;
  phone: string | null;
  project_type: string | null;
  budget_range: string | null;
  status: string;
  created_at: string;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [billingHistory, setBillingHistory] = useState<BillingHistory[]>([]);
  const [contactInquiries, setContactInquiries] = useState<ContactInquiry[]>([]);
  const [filteredInquiries, setFilteredInquiries] = useState<ContactInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [stats, setStats] = useState({
    totalPayments: 0,
    pendingPayments: 0,
    verifiedPayments: 0,
    totalRevenue: 0,
    totalInquiries: 0,
    newInquiries: 0
  });

  useEffect(() => {
    fetchPayments();
    fetchBillingHistory();
    fetchContactInquiries();
    calculateStats();
  }, []);

  useEffect(() => {
    // Filter inquiries based on search term and status
    let filtered = contactInquiries;
    
    if (searchTerm) {
      filtered = filtered.filter(inquiry => 
        inquiry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inquiry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inquiry.message.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(inquiry => inquiry.status === statusFilter);
    }
    
    setFilteredInquiries(filtered);
  }, [contactInquiries, searchTerm, statusFilter]);

  const fetchContactInquiries = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_inquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContactInquiries(data || []);
    } catch (error: any) {
      console.error('Error fetching contact inquiries:', error);
      toast({
        title: "Error",
        description: "Failed to fetch contact inquiries",
        variant: "destructive",
      });
    }
  };

  const fetchPayments = async () => {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPayments(data || []);
    } catch (error: any) {
      console.error('Error fetching payments:', error);
      toast({
        title: "Error",
        description: "Failed to fetch payments",
        variant: "destructive",
      });
    }
  };

  const fetchBillingHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('billing_history')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBillingHistory(data || []);
    } catch (error: any) {
      console.error('Error fetching billing history:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = async () => {
    try {
      const { data: paymentsData } = await supabase
        .from('payments')
        .select('amount, status');

      const { data: inquiriesData } = await supabase
        .from('contact_inquiries')
        .select('status');

      if (paymentsData) {
        const totalPayments = paymentsData.length;
        const pendingPayments = paymentsData.filter(p => p.status === 'pending').length;
        const verifiedPayments = paymentsData.filter(p => p.status === 'verified').length;
        const totalRevenue = paymentsData
          .filter(p => p.status === 'verified')
          .reduce((sum, p) => sum + Number(p.amount), 0);

        const totalInquiries = inquiriesData?.length || 0;
        const newInquiries = inquiriesData?.filter(i => i.status === 'new').length || 0;

        setStats({
          totalPayments,
          pendingPayments,
          verifiedPayments,
          totalRevenue,
          totalInquiries,
          newInquiries
        });
      }
    } catch (error) {
      console.error('Error calculating stats:', error);
    }
  };

  const updateInquiryStatus = async (inquiryId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('contact_inquiries')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', inquiryId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Inquiry marked as ${status}`,
      });

      fetchContactInquiries();
      calculateStats();
    } catch (error: any) {
      console.error('Error updating inquiry status:', error);
      toast({
        title: "Error",
        description: "Failed to update inquiry status",
        variant: "destructive",
      });
    }
  };

  const updatePaymentStatus = async (paymentId: string, status: 'verified' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('payments')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', paymentId);

      if (error) throw error;

      await supabase
        .from('billing_history')
        .update({ status: status === 'verified' ? 'paid' : 'failed' })
        .eq('payment_id', paymentId);

      toast({
        title: "Success",
        description: `Payment ${status} successfully`,
      });

      fetchPayments();
      fetchBillingHistory();
      calculateStats();
    } catch (error: any) {
      console.error('Error updating payment status:', error);
      toast({
        title: "Error",
        description: "Failed to update payment status",
        variant: "destructive",
      });
    }
  };

  const formatCurrency = (amount: number, currency: string = 'ETB') => {
    return new Intl.NumberFormat('en-ET', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'verified': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'paid': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-purple-100 text-purple-800';
      case 'in_progress': return 'bg-orange-100 text-orange-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        Loading admin dashboard...
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="flex items-center text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage payments, users, and contact inquiries</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPayments}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pendingPayments}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verified</CardTitle>
            <Check className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.verifiedPayments}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(stats.totalRevenue)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Inquiries</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-indigo-600">{stats.totalInquiries}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Messages</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.newInquiries}</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="inquiries" className="space-y-6">
        <TabsList>
          <TabsTrigger value="inquiries">Contact Messages</TabsTrigger>
          <TabsTrigger value="payments">Payment Management</TabsTrigger>
          <TabsTrigger value="billing">Billing History</TabsTrigger>
        </TabsList>

        <TabsContent value="inquiries" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Contact Messages ({filteredInquiries.length})</span>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search messages..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 w-64"
                    />
                  </div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border border-input bg-background rounded-md text-sm"
                  >
                    <option value="all">All Status</option>
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Review and manage customer contact messages
              </p>
            </CardHeader>
            <CardContent>
              {filteredInquiries.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {contactInquiries.length === 0 ? 'No contact messages yet.' : 'No messages match your search criteria.'}
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filteredInquiries.map((inquiry) => (
                    <ContactMessageCard
                      key={inquiry.id}
                      message={inquiry}
                      onStatusUpdate={updateInquiryStatus}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Requests</CardTitle>
              <p className="text-sm text-muted-foreground">
                Review and manage payment submissions
              </p>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Bank</TableHead>
                      <TableHead>Reference</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Receipt</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>{formatDate(payment.created_at)}</TableCell>
                        <TableCell>{payment.payer_email}</TableCell>
                        <TableCell className="capitalize">{payment.plan_id}</TableCell>
                        <TableCell>{formatCurrency(Number(payment.amount))}</TableCell>
                        <TableCell>{payment.bank}</TableCell>
                        <TableCell className="font-mono text-sm">{payment.bank_reference}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(payment.status)}>
                            {payment.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {payment.receipt_url ? (
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => setSelectedReceipt(payment.receipt_url)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl">
                                <DialogHeader>
                                  <DialogTitle>Payment Receipt</DialogTitle>
                                </DialogHeader>
                                <div className="mt-4">
                                  <img 
                                    src={payment.receipt_url} 
                                    alt="Payment Receipt" 
                                    className="w-full h-auto max-h-96 object-contain rounded-lg border"
                                  />
                                  <div className="mt-4 text-sm text-muted-foreground">
                                    <p><strong>Reference:</strong> {payment.bank_reference}</p>
                                    <p><strong>Bank:</strong> {payment.bank}</p>
                                    <p><strong>Amount:</strong> {formatCurrency(Number(payment.amount))}</p>
                                    {payment.notes && <p><strong>Notes:</strong> {payment.notes}</p>}
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          ) : (
                            <span className="text-muted-foreground">No receipt</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {payment.status === 'pending' && (
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                onClick={() => updatePaymentStatus(payment.id, 'verified')}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => updatePaymentStatus(payment.id, 'rejected')}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Billing History</CardTitle>
              <p className="text-sm text-muted-foreground">
                Complete billing and invoice history
              </p>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Invoice #</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Payment Method</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Billing Period</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {billingHistory.map((billing) => (
                      <TableRow key={billing.id}>
                        <TableCell>{formatDate(billing.created_at)}</TableCell>
                        <TableCell className="font-mono">{billing.invoice_number}</TableCell>
                        <TableCell>{formatCurrency(Number(billing.amount))}</TableCell>
                        <TableCell>{billing.payment_method}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(billing.status)}>
                            {billing.status}
                          </Badge>
                        </TableCell>
                        <TableCell>One-time</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
