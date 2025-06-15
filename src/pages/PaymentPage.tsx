import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Copy, Upload, CheckCircle2, AlertTriangle, BanknoteIcon, ArrowLeft, Code, Mail, LogIn } from 'lucide-react';

// Define a basic schema for the payment form
const paymentFormSchema = z.object({
  bank: z.string().min(1, "Bank selection is required"),
  reference: z.string().min(1, "Reference number is required"),
  receiptImage: z.any().refine(files => files?.length > 0, 'Receipt image is required.'),
  notes: z.string().optional(),
});

// Define a type for bank objects
interface Bank {
  id: string;
  name: string;
  accountName: string;
  accountNumber: string;
}

// Define the banks array
const banks: Bank[] = [
  { id: 'cbe', name: 'Commercial Bank of Ethiopia', accountName: 'Natnael Bereket Yoseph', accountNumber: '1000123456789' },
  { id: 'awash', name: 'Awash Bank', accountName: 'Natnael Bereket Yoseph', accountNumber: '01301234567890' },
  { id: 'dashen', name: 'Dashen Bank', accountName: 'Natnael Bereket Yoseph', accountNumber: '5000123456789' },
  { id: 'abyssinia', name: 'Bank of Abyssinia', accountName: 'Natnael Bereket Yoseph', accountNumber: '8000123456789' },
  { id: 'telebirr', name: 'Telebirr', accountName: 'Natnael Bereket Yoseph', accountNumber: '+251998113131' },
];

// Define subscription plan interface
interface SubscriptionPlan {
  id: string;
  name: string;
  monthly_price: number;
  annual_price: number;
  features: string[];
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-ET', {
    style: 'currency',
    currency: 'ETB',
    minimumFractionDigits: 0,
  }).format(amount);
};

const PaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { user, loading } = useAuth();
  const planFromState = location.state?.plan as SubscriptionPlan | undefined;

  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(planFromState || null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedBank, setSelectedBank] = useState<Bank | null>(banks[0]);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [paymentSuccessful, setPaymentSuccessful] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showEmailVerificationAlert, setShowEmailVerificationAlert] = useState(false);

  const form = useForm<z.infer<typeof paymentFormSchema>>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      bank: banks[0].id,
      reference: "",
      notes: "",
    },
  });

  useEffect(() => {
    if (planFromState) {
      setSelectedPlan(planFromState);
    } else {
      setSelectedPlan({
        id: 'starter',
        name: 'Starter Website',
        monthly_price: 12000,
        annual_price: 120000,
        features: ['Responsive design', 'SEO optimization', 'Contact forms']
      });
    }
  }, [planFromState]);

  // Redirect to auth if not authenticated (after loading is complete)
  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth', { 
        state: { 
          returnTo: location.pathname,
          plan: selectedPlan 
        } 
      });
    }
  }, [user, loading, navigate, location.pathname, selectedPlan]);

  const getAmount = () => {
    if (!selectedPlan) return 0;
    return selectedPlan.monthly_price;
  };

  const copyAccountNumber = (accountNumber: string) => {
    navigator.clipboard.writeText(accountNumber);
    toast({
      title: "Copied!",
      description: "Account number copied to clipboard",
    });
  };

  const handleBankChange = (bankId: string) => {
    const bank = banks.find(b => b.id === bankId);
    if (bank) {
      setSelectedBank(bank);
      form.setValue("bank", bankId);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setUploadedFile(event.target.files[0]);
    }
  };

  const uploadReceipt = async (file: File): Promise<string> => {
    if (!user) {
      throw new Error("User must be authenticated to upload receipts");
    }

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('receipts')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('receipts')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (values: z.infer<typeof paymentFormSchema>) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to submit payment",
        variant: "destructive",
      });
      return;
    }

    if (!selectedPlan) {
      toast({
        title: "Error",
        description: "Plan information is missing",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const amount = getAmount();
      const file = values.receiptImage[0];

      let fileUrl = "";
      if (file) {
        toast({
          title: "Uploading...",
          description: "Uploading receipt image...",
        });
        fileUrl = await uploadReceipt(file);

        if (!fileUrl) {
          throw new Error("Failed to upload receipt image");
        }

        toast({
          title: "Success",
          description: "Receipt uploaded successfully!",
        });
      } else {
        throw new Error("Receipt image is required");
      }
      
      const { data: paymentData, error: paymentError } = await supabase
        .from("payments")
        .insert({
          user_id: user.id,
          plan_id: selectedPlan.id,
          amount: amount,
          payment_method: values.bank,
          bank_reference: values.reference,
          receipt_url: fileUrl,
          status: "pending",
          payer_email: user.email || "",
          bank: selectedBank?.name || values.bank,
          notes: values.notes
        })
        .select()
        .single();

      if (paymentError) throw paymentError;

      const { error: billingError } = await supabase
        .from("billing_history")
        .insert({
          user_id: user.id,
          payment_id: paymentData.id,
          invoice_number: `INV-${Date.now()}`,
          amount: amount,
          currency: 'ETB',
          status: 'pending',
          payment_method: selectedBank?.name || values.bank,
          billing_period_start: new Date().toISOString(),
          billing_period_end: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
        });

      if (billingError) throw billingError;

      setPaymentSuccessful(true);
      setShowEmailVerificationAlert(true);
      toast({
        title: "Success!",
        description: "Payment information submitted successfully!",
      });
      
    } catch (error: any) {
      console.error("Error submitting payment:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit payment information",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show sign in prompt if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-3xl">
            <CardHeader className="text-center pb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <LogIn className="h-10 w-10 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-slate-800">Sign In Required</CardTitle>
              <CardDescription className="text-lg text-slate-600">
                You need to sign in to continue with your payment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-600">
                Please sign in or create an account to proceed with your {selectedPlan?.name || 'service'} purchase.
              </p>
            </CardContent>
            <CardFooter className="flex justify-center pt-6">
              <Button 
                onClick={() => navigate('/auth', { 
                  state: { 
                    returnTo: location.pathname,
                    plan: selectedPlan 
                  } 
                })}
                className="rounded-xl px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md font-bold transition-transform active:scale-95"
              >
                <LogIn className="mr-2 h-5 w-5" />
                Sign In / Sign Up
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  if (!selectedPlan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading plan information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Header with logo */}
      <div className="bg-white/80 backdrop-blur-2xl border-b border-slate-200 sticky top-0 z-50 shadow-lg">
        <div className="relative max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="absolute left-0 right-0 bottom-0 h-4 rounded-b-3xl bg-white/80 pointer-events-none -z-10" />
          <div className="flex justify-between items-center py-3 md:py-5">
            <div className="flex items-center space-x-3 group select-none">
              <div
                className="bg-gradient-to-r from-blue-600 to-blue-700 p-2.5 rounded-xl shadow transition-transform duration-700 group-hover:rotate-[16deg] group-hover:scale-110"
                style={{ willChange: 'transform' }}
              >
                <Code className="h-7 w-7 text-white transition-transform duration-500 group-hover:animate-spin-slow" />
              </div>
              <span className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-slate-800 to-blue-600 bg-clip-text text-transparent tracking-tight">
                MERKL.DEV
              </span>
            </div>
            <Button 
              variant="ghost" 
              onClick={() => navigate(-1)}
              className="flex items-center text-slate-600 hover:text-blue-600 font-medium transition-colors rounded-xl"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-8 px-4 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2 bg-gradient-to-r from-slate-800 to-blue-600 bg-clip-text text-transparent">
            Complete Your {selectedPlan?.name || 'Custom Project'} Purchase
          </h1>
          <p className="text-slate-600 text-lg">
            One-time payment - {formatCurrency(getAmount())}
          </p>
        </div>

        {/* Email Verification Alert */}
        {showEmailVerificationAlert && (
          <div className="max-w-4xl mx-auto mb-8">
            <Alert className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 rounded-xl">
              <Mail className="h-4 w-4 text-blue-600" />
              <AlertTitle className="text-blue-800">Check Your Email!</AlertTitle>
              <AlertDescription className="text-blue-700">
                Please check your inbox and verify your email address to complete your account setup. 
                <strong> Don't forget to check your spam and trash folders</strong> if you don't see the verification email.
              </AlertDescription>
            </Alert>
          </div>
        )}

        {paymentSuccessful ? (
          <div className="max-w-2xl mx-auto">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-3xl">
              <CardHeader className="text-center pb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <CheckCircle2 className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-slate-800">Payment Submitted Successfully!</CardTitle>
                <CardDescription className="text-lg text-slate-600">
                  Your payment is now under review. We'll activate your project once verified.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert className="bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200 rounded-xl">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <AlertTitle className="text-yellow-800">Payment Confirmation</AlertTitle>
                  <AlertDescription className="text-yellow-700">
                    Your payment has been submitted and is pending verification. You'll be notified once it's processed.
                  </AlertDescription>
                </Alert>
                
                <div className="bg-gradient-to-r from-slate-50 to-blue-50 border border-slate-200 rounded-xl p-6">
                  <h3 className="font-semibold mb-4 text-slate-800">Payment Details</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="text-slate-600">Service:</div>
                    <div className="font-medium text-slate-800">{selectedPlan.name}</div>
                    <div className="text-slate-600">Amount:</div>
                    <div className="font-bold text-blue-600">{formatCurrency(getAmount())}</div>
                    <div className="text-slate-600">Status:</div>
                    <div>
                      <span className="inline-flex items-center rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800 border border-yellow-200">
                        Pending Verification
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between pt-6">
                <Button variant="outline" onClick={() => navigate("/")} className="rounded-xl px-6 py-3">
                  Go to Home
                </Button>
                <Button 
                  onClick={() => navigate("/")}
                  className="rounded-xl px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md font-bold transition-transform active:scale-95"
                >
                  Back to Site
                </Button>
              </CardFooter>
            </Card>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-3xl">
                <CardHeader className="pb-6">
                  <CardTitle className="text-2xl font-bold text-slate-800">Bank Transfer Payment</CardTitle>
                  <CardDescription className="text-slate-600">
                    Complete your purchase by making a bank transfer to one of our accounts.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue={banks[0].id} onValueChange={handleBankChange}>
                    <TabsList className="grid w-full grid-cols-5 mb-6 bg-slate-100/80 rounded-xl p-1">
                      {banks.map(bank => (
                        <TabsTrigger 
                          key={bank.id} 
                          value={bank.id} 
                          className="text-xs md:text-sm rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
                        >
                          {bank.id === 'abyssinia' ? 'Abyssinia' : bank.name.split(' ')[0]}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    
                    {banks.map(bank => (
                      <TabsContent key={bank.id} value={bank.id}>
                        <div className="space-y-6">
                          <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl p-6 border border-slate-200">
                            <div className="space-y-4">
                              <div>
                                <Label className="text-slate-600 font-medium">Bank Name</Label>
                                <div className="text-lg font-semibold text-slate-800">{bank.name}</div>
                              </div>
                              
                              <div>
                                <Label className="text-slate-600 font-medium">Account Name</Label>
                                <div className="text-lg font-semibold text-slate-800">{bank.accountName}</div>
                              </div>
                              
                              <div>
                                <Label className="text-slate-600 font-medium">Account Number</Label>
                                <div className="flex items-center mt-2">
                                  <div className="text-lg font-mono font-semibold bg-white px-4 py-3 rounded-l-xl border border-r-0 border-slate-200 flex-1 text-slate-800">
                                    {bank.accountNumber}
                                  </div>
                                  <Button 
                                    type="button" 
                                    variant="outline"
                                    onClick={() => copyAccountNumber(bank.accountNumber)}
                                    className="rounded-l-none rounded-r-xl border-l-0 px-4 py-3 h-auto hover:bg-blue-50"
                                  >
                                    <Copy className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
                            <Label className="text-blue-100 font-medium">Amount to Transfer</Label>
                            <div className="text-3xl font-bold mt-2">
                              {formatCurrency(getAmount())}
                            </div>
                            <p className="text-blue-100 text-sm mt-2">
                              Please transfer the exact amount
                            </p>
                          </div>
                          
                          <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                              <FormField
                                control={form.control}
                                name="bank"
                                render={({ field }) => (
                                  <FormItem hidden>
                                    <FormControl>
                                      <Input {...field} />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={form.control}
                                name="reference"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Transfer Reference/Confirmation Number</FormLabel>
                                    <FormControl>
                                      <Input placeholder="e.g. TRN123456789" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                      The reference number provided by your bank
                                    </FormDescription>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={form.control}
                                name="receiptImage"
                                render={({ field: { onChange, value, ...fieldProps } }) => (
                                  <FormItem>
                                    <FormLabel>Upload Receipt/Screenshot</FormLabel>
                                    <FormControl>
                                      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center cursor-pointer hover:border-muted-foreground/50 transition-colors">
                                        <Input
                                          type="file"
                                          accept="image/*"
                                          className="hidden"
                                          id="receipt-upload"
                                          onChange={(e) => {
                                            onChange(e.target.files);
                                            handleFileChange(e);
                                          }}
                                          {...fieldProps}
                                        />
                                        <Label htmlFor="receipt-upload" className="cursor-pointer">
                                          <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                                          <span className="text-muted-foreground font-medium">
                                            {uploadedFile ? uploadedFile.name : 'Click to upload receipt'}
                                          </span>
                                          {!uploadedFile && (
                                            <p className="text-xs text-muted-foreground mt-1">
                                              JPG, PNG or PDF, max 5MB
                                            </p>
                                          )}
                                        </Label>
                                      </div>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={form.control}
                                name="notes"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Additional Notes (Optional)</FormLabel>
                                    <FormControl>
                                      <Textarea 
                                        placeholder="Any additional information about your payment" 
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <Alert className="bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200 rounded-xl">
                                <AlertTriangle className="h-4 w-4 text-amber-600" />
                                <AlertTitle className="text-amber-800">Payment verification</AlertTitle>
                                <AlertDescription className="text-amber-700">
                                  Your payment will be verified by our admin team within 24 hours.
                                </AlertDescription>
                              </Alert>
                              
                              <Button
                                type="submit"
                                className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg font-bold transition-transform active:scale-95 text-lg"
                                disabled={isSubmitting || isUploading}
                              >
                                <BanknoteIcon className="mr-2 h-5 w-5" />
                                {isUploading ? "Uploading Receipt..." : isSubmitting ? "Submitting..." : "Submit Payment Details"}
                              </Button>
                            </form>
                          </Form>
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-3xl sticky top-24">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-bold text-slate-800">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl p-4 border border-slate-200">
                    <h3 className="font-semibold mb-2 text-slate-800">{selectedPlan.name}</h3>
                    <p className="text-sm text-slate-600 mb-4">
                      One-time payment
                    </p>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between text-slate-700">
                        <span>Service Fee</span>
                        <span className="font-medium">{formatCurrency(getAmount())}</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg border-t border-slate-200 pt-3 text-blue-600">
                        <span>Total</span>
                        <span>{formatCurrency(getAmount())}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-xs text-slate-500 space-y-1 bg-slate-50 rounded-xl p-4">
                    <p>• Secure payment processing</p>
                    <p>• 24-hour verification process</p>
                    <p>• Email confirmation upon approval</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
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

export default PaymentPage;
