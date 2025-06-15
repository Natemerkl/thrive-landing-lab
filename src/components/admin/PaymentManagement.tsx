
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, CheckCircle, XCircle, RefreshCw, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Payment {
  id: string;
  user_id: string;
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
  updated_at: string;
}

const PaymentManagement: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching payments:', error);
        toast({
          title: "Error",
          description: "Failed to fetch payments",
          variant: "destructive",
        });
        return;
      }

      setPayments(data || []);
    } catch (error) {
      console.error('Error fetching payments:', error);
      toast({
        title: "Error",
        description: "Failed to fetch payments",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updatePaymentStatus = async (paymentId: string, newStatus: string) => {
    setUpdatingStatus(prev => new Set(prev).add(paymentId));
    
    try {
      const { error } = await supabase
        .from('payments')
        .update({ 
          status: newStatus, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', paymentId);

      if (error) {
        console.error('Error updating payment status:', error);
        toast({
          title: "Error",
          description: "Failed to update payment status",
          variant: "destructive",
        });
        return;
      }

      setPayments(prev => prev.map(payment => 
        payment.id === paymentId ? { ...payment, status: newStatus } : payment
      ));

      toast({
        title: "Success",
        description: `Payment ${newStatus}`,
      });
    } catch (error) {
      console.error('Error updating payment status:', error);
      toast({
        title: "Error",
        description: "Failed to update payment status",
        variant: "destructive",
      });
    } finally {
      setUpdatingStatus(prev => {
        const newSet = new Set(prev);
        newSet.delete(paymentId);
        return newSet;
      });
    }
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

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'pending': return 'secondary';
      case 'verified': return 'default';
      case 'rejected': return 'destructive';
      default: return 'secondary';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'verified': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="mr-2 h-5 w-5" />
            Payment Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin mr-2" />
            Loading payments...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <CreditCard className="mr-2 h-5 w-5" />
            Payment Management
          </div>
          <Button onClick={fetchPayments} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </CardTitle>
        <CardDescription>
          Review payment screenshots and approve transactions. Total payments: {payments.length}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {payments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No payments found
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Payer</TableHead>
                  <TableHead>Plan & Amount</TableHead>
                  <TableHead>Payment Details</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{payment.payer_email}</div>
                        <div className="text-sm text-gray-500">
                          ID: {payment.user_id.substring(0, 8)}...
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{payment.plan_id}</div>
                        <div className="text-sm text-gray-500">
                          {payment.amount} {payment.currency}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm">
                          <span className="font-medium">Bank:</span> {payment.bank}
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">Method:</span> {payment.payment_method}
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">Ref:</span> {payment.bank_reference}
                        </div>
                        {payment.receipt_url && (
                          <a 
                            href={payment.receipt_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline flex items-center"
                          >
                            <ExternalLink className="h-3 w-3 mr-1" />
                            View Receipt
                          </a>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={getStatusBadgeVariant(payment.status)}
                        className={getStatusColor(payment.status)}
                      >
                        {payment.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      <div>{formatDate(payment.created_at)}</div>
                      {payment.updated_at !== payment.created_at && (
                        <div className="text-xs">
                          Updated: {formatDate(payment.updated_at)}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        {payment.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updatePaymentStatus(payment.id, 'verified')}
                              disabled={updatingStatus.has(payment.id)}
                              className="text-green-600 hover:text-green-700"
                            >
                              {updatingStatus.has(payment.id) ? (
                                <RefreshCw className="h-3 w-3 animate-spin" />
                              ) : (
                                <>
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Approve
                                </>
                              )}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updatePaymentStatus(payment.id, 'rejected')}
                              disabled={updatingStatus.has(payment.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              {updatingStatus.has(payment.id) ? (
                                <RefreshCw className="h-3 w-3 animate-spin" />
                              ) : (
                                <>
                                  <XCircle className="h-3 w-3 mr-1" />
                                  Reject
                                </>
                              )}
                            </Button>
                          </>
                        )}
                        {payment.status === 'verified' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updatePaymentStatus(payment.id, 'pending')}
                            disabled={updatingStatus.has(payment.id)}
                          >
                            {updatingStatus.has(payment.id) ? (
                              <RefreshCw className="h-3 w-3 animate-spin" />
                            ) : (
                              'Mark Pending'
                            )}
                          </Button>
                        )}
                        {payment.status === 'rejected' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updatePaymentStatus(payment.id, 'pending')}
                            disabled={updatingStatus.has(payment.id)}
                          >
                            {updatingStatus.has(payment.id) ? (
                              <RefreshCw className="h-3 w-3 animate-spin" />
                            ) : (
                              'Reopen'
                            )}
                          </Button>
                        )}
                      </div>
                      {payment.notes && (
                        <div className="text-xs text-gray-500 mt-1">
                          Note: {payment.notes}
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentManagement;
