
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Clock, CheckCircle2, XCircle, Mail, RefreshCw, MessageSquare, Code } from 'lucide-react';

interface Payment {
  id: string;
  plan_id: string;
  amount: number;
  status: string;
  bank: string;
  bank_reference: string;
  created_at: string;
  notes?: string;
}

const PaymentVerificationPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchPayments();
  }, [user, navigate]);

  const fetchPayments = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPayments(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch payment history",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!user || !message.trim()) return;
    
    setSendingMessage(true);
    try {
      const { error } = await supabase
        .from('contact_inquiries')
        .insert({
          name: user.user_metadata?.full_name || 'User',
          email: user.email || '',
          message: message,
          project_type: 'Payment Support',
          status: 'new'
        });

      if (error) throw error;

      toast({
        title: "Message Sent",
        description: "Your message has been sent to our support team",
      });
      setMessage('');
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setSendingMessage(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ET', {
      style: 'currency',
      currency: 'ETB',
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-2xl border-b border-slate-200 sticky top-0 z-50 shadow-lg">
        <div className="relative max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="absolute left-0 right-0 bottom-0 h-4 rounded-b-3xl bg-white/80 pointer-events-none -z-10" />
          <div className="flex justify-between items-center py-3 md:py-5">
            <div className="flex items-center space-x-3 group select-none">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-2.5 rounded-xl shadow transition-transform duration-700 group-hover:rotate-[16deg] group-hover:scale-110">
                <Code className="h-7 w-7 text-white transition-transform duration-500 group-hover:animate-spin-slow" />
              </div>
              <span className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-slate-800 to-blue-600 bg-clip-text text-transparent tracking-tight">
                MERKL.DEV
              </span>
            </div>
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="flex items-center text-slate-600 hover:text-blue-600 font-medium transition-colors rounded-xl"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-8 px-4 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2 bg-gradient-to-r from-slate-800 to-blue-600 bg-clip-text text-transparent">
            Payment Verification & History
          </h1>
          <p className="text-slate-600 text-lg">
            Track your payment status and contact support if needed
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Status & History */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-slate-800">Your Payments</h2>
              <Button
                onClick={fetchPayments}
                disabled={loading}
                variant="outline"
                size="sm"
                className="rounded-xl"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-slate-600">Loading payment history...</p>
              </div>
            ) : payments.length === 0 ? (
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-3xl">
                <CardContent className="text-center py-12">
                  <Mail className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">No payments found</h3>
                  <p className="text-slate-600">You haven't made any payments yet.</p>
                  <Button
                    onClick={() => navigate('/choose-project')}
                    className="mt-4 rounded-xl"
                  >
                    Start a Project
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {payments.map((payment) => (
                  <Card key={payment.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-3xl">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-semibold text-slate-800">
                          Payment #{payment.id.slice(-8)}
                        </CardTitle>
                        <div className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium border ${getStatusColor(payment.status)}`}>
                          {getStatusIcon(payment.status)}
                          <span className="ml-1 capitalize">{payment.status}</span>
                        </div>
                      </div>
                      <CardDescription className="text-slate-600">
                        {formatDate(payment.created_at)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-slate-600">Amount:</span>
                          <p className="font-semibold text-slate-800">{formatCurrency(payment.amount)}</p>
                        </div>
                        <div>
                          <span className="text-slate-600">Bank:</span>
                          <p className="font-semibold text-slate-800">{payment.bank}</p>
                        </div>
                        <div>
                          <span className="text-slate-600">Reference:</span>
                          <p className="font-semibold text-slate-800">{payment.bank_reference}</p>
                        </div>
                        <div>
                          <span className="text-slate-600">Plan:</span>
                          <p className="font-semibold text-slate-800 capitalize">{payment.plan_id.replace('-', ' ')}</p>
                        </div>
                      </div>
                      
                      {payment.status === 'pending' && (
                        <Alert className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 rounded-xl">
                          <Clock className="h-4 w-4 text-blue-600" />
                          <AlertTitle className="text-blue-800">Verification in Progress</AlertTitle>
                          <AlertDescription className="text-blue-700">
                            Your payment will be verified by our payment management within 5-10mins.
                            You'll receive an email notification once it's processed.
                          </AlertDescription>
                        </Alert>
                      )}
                      
                      {payment.status === 'verified' && (
                        <Alert className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 rounded-xl">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          <AlertTitle className="text-green-800">Payment Verified</AlertTitle>
                          <AlertDescription className="text-green-700">
                            Your payment has been successfully verified. Your project will begin shortly.
                          </AlertDescription>
                        </Alert>
                      )}
                      
                      {payment.status === 'rejected' && (
                        <Alert className="bg-gradient-to-r from-red-50 to-rose-50 border-red-200 rounded-xl">
                          <XCircle className="h-4 w-4 text-red-600" />
                          <AlertTitle className="text-red-800">Payment Rejected</AlertTitle>
                          <AlertDescription className="text-red-700">
                            There was an issue with your payment. Please contact support for assistance.
                          </AlertDescription>
                        </Alert>
                      )}
                      
                      {payment.notes && (
                        <div className="bg-slate-50 rounded-lg p-3">
                          <span className="text-slate-600 text-sm font-medium">Notes:</span>
                          <p className="text-slate-700 text-sm mt-1">{payment.notes}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Contact Support */}
          <div>
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-3xl sticky top-24">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold text-slate-800 flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Contact Support
                </CardTitle>
                <CardDescription className="text-slate-600">
                  Need help with your payment? Send us a message.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Describe your issue or question..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={sendingMessage || !message.trim()}
                  className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  {sendingMessage ? 'Sending...' : 'Send Message'}
                </Button>
                
                <div className="text-xs text-slate-500 space-y-1 bg-slate-50 rounded-xl p-4">
                  <p>• Response time: 5-10 minutes</p>
                  <p>• Include payment reference for faster support</p>
                  <p>• Check your email for updates</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Logo Animation Styles */}
      <style>
        {`
          @keyframes spin-slow { 
            0% { transform: rotate(0deg);}
            100% { transform: rotate(360deg);}
          }
          .group:hover .animate-spin-slow {
            animation: spin-slow 1.2s linear;
          }
        `}
      </style>
    </div>
  );
};

export default PaymentVerificationPage;
