
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
import { Copy, Upload, CheckCircle2, AlertTriangle, BanknoteIcon } from 'lucide-react';

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
  const planFromState = location.state?.plan as SubscriptionPlan | undefined;

  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(planFromState || null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedBank, setSelectedBank] = useState<Bank | null>(banks[0]);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [paymentSuccessful, setPaymentSuccessful] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

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
      // If no plan in state, use a default plan for demo
      setSelectedPlan({
        id: 'starter',
        name: 'Starter Website',
        monthly_price: 12000,
        annual_price: 120000,
        features: ['Responsive design', 'SEO optimization', 'Contact forms']
      });
    }
  }, [planFromState]);

  const getAmount = () => {
    if (!selectedPlan) return 0;
    return selectedPlan.monthly_price; // Use monthly_price as the one-time payment amount
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
    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `receipts/${fileName}`;

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

      // Upload receipt image to Supabase Storage
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
      
      // Record the payment in the database
      const { data: paymentData, error: paymentError } = await supabase
        .from("payments")
        .insert({
          plan_id: selectedPlan.id,
          amount: amount,
          payment_method: values.bank,
          bank_reference: values.reference,
          receipt_url: fileUrl,
          status: "pending",
          payer_email: "user@example.com", // This would come from auth in real app
          bank: selectedBank?.name || values.bank,
          notes: values.notes
        })
        .select()
        .single();

      if (paymentError) throw paymentError;

      // Create billing history entry
      const { error: billingError } = await supabase
        .from("billing_history")
        .insert({
          payment_id: paymentData.id,
          invoice_number: `INV-${Date.now()}`,
          amount: amount,
          currency: 'ETB',
          status: 'pending',
          payment_method: selectedBank?.name || values.bank,
          billing_period_start: new Date().toISOString(),
          billing_period_end: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() // 1 year validity
        });

      if (billingError) throw billingError;

      setPaymentSuccessful(true);
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

  if (!selectedPlan) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        Loading plan information...
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Complete Your {selectedPlan.name} Purchase
        </h1>
        <p className="text-muted-foreground">
          One-time payment - {formatCurrency(getAmount())}
        </p>
      </div>

      {paymentSuccessful ? (
        <Card>
          <CardHeader className="text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-green-500 mb-4" />
            <CardTitle>Payment Submitted Successfully!</CardTitle>
            <CardDescription>
              Your payment is now under review. We'll activate your project once verified.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Payment Confirmation</AlertTitle>
              <AlertDescription>
                Your payment has been submitted and is pending verification. You'll be notified once it's processed.
              </AlertDescription>
            </Alert>
            
            <div className="mt-6 space-y-4">
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">Payment Details</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-muted-foreground">Service:</div>
                  <div>{selectedPlan.name}</div>
                  <div className="text-muted-foreground">Amount:</div>
                  <div>{formatCurrency(getAmount())}</div>
                  <div className="text-muted-foreground">Status:</div>
                  <div>
                    <span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
                      Pending Verification
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => navigate("/")}>
              Go to Home
            </Button>
            <Button onClick={() => navigate("/")}>
              Back to Site
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Bank Transfer Payment</CardTitle>
                <CardDescription>
                  Complete your purchase by making a bank transfer to one of our accounts.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue={banks[0].id} onValueChange={handleBankChange}>
                  <TabsList className="grid w-full grid-cols-5 mb-6">
                    {banks.map(bank => (
                      <TabsTrigger key={bank.id} value={bank.id} className="text-xs md:text-sm">
                        {bank.id === 'abyssinia' ? 'Abyssinia' : bank.name.split(' ')[0]}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  
                  {banks.map(bank => (
                    <TabsContent key={bank.id} value={bank.id}>
                      <div className="space-y-4">
                        <div>
                          <Label>Bank Name</Label>
                          <div className="text-lg font-medium">{bank.name}</div>
                        </div>
                        
                        <div>
                          <Label>Account Name</Label>
                          <div className="text-lg font-medium">{bank.accountName}</div>
                        </div>
                        
                        <div>
                          <Label>Account Number</Label>
                          <div className="flex items-center">
                            <div className="text-lg font-mono font-medium bg-muted px-3 py-1 rounded border flex-1">
                              {bank.accountNumber}
                            </div>
                            <Button 
                              type="button" 
                              variant="ghost" 
                              size="icon"
                              onClick={() => copyAccountNumber(bank.accountNumber)}
                              className="ml-2"
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  ))}
                  
                  <div className="mt-6 border-t pt-6">
                    <div className="space-y-4">
                      <div>
                        <Label>Amount to Transfer</Label>
                        <div className="text-2xl font-bold text-primary">
                          {formatCurrency(getAmount())}
                        </div>
                        <p className="text-muted-foreground text-sm mt-1">
                          Please transfer the exact amount
                        </p>
                      </div>
                    </div>
                    
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-6">
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
                        
                        <Alert>
                          <AlertTriangle className="h-4 w-4" />
                          <AlertTitle>Payment verification</AlertTitle>
                          <AlertDescription>
                            Your payment will be verified by our admin team within 24 hours.
                          </AlertDescription>
                        </Alert>
                        
                        <Button
                          type="submit"
                          className="w-full"
                          disabled={isSubmitting || isUploading}
                        >
                          <BanknoteIcon className="mr-2 h-4 w-4" />
                          {isUploading ? "Uploading Receipt..." : isSubmitting ? "Submitting..." : "Submit Payment Details"}
                        </Button>
                      </form>
                    </Form>
                  </div>
                </Tabs>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">{selectedPlan.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    One-time payment
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Service Fee</span>
                      <span>{formatCurrency(getAmount())}</span>
                    </div>
                    <div className="flex justify-between font-medium text-lg border-t pt-2">
                      <span>Total</span>
                      <span>{formatCurrency(getAmount())}</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-xs text-muted-foreground">
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
  );
};

export default PaymentPage;
