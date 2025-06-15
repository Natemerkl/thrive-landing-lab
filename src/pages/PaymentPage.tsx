
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, CreditCard, Upload } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Define the Bank interface
interface Bank {
  id: string;
  name: string;
  accountName: string;
  accountNumber: string;
}

// Define the SubscriptionPlan interface
interface SubscriptionPlan {
  id: string;
  name: string;
  monthly_price: number;
  features?: string[];
}

// Define the banks array
const banks: Bank[] = [
  { id: 'cbe', name: 'Commercial Bank of Ethiopia', accountName: 'Natnael Bereket Yoseph', accountNumber: '1000341531385' },
  { id: 'awash', name: 'Awash Bank', accountName: 'Natnael Bereket Yoseph', accountNumber: '01301234567890' },
  { id: 'dashen', name: 'Dashen Bank', accountName: 'Natnael Bereket Yoseph', accountNumber: '5000123456789' },
  { id: 'abyssinia', name: 'Bank of Abyssinia', accountName: 'Natnael Bereket Yoseph', accountNumber: '8000123456789' },
  { id: 'telebirr', name: 'Telebirr', accountName: 'Natnael Bereket Yoseph', accountNumber: '+251998113131' },
];

// Payment form schema
const paymentFormSchema = z.object({
  bank: z.string().min(1, 'Please select a bank'),
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  companyName: z.string().optional(),
  bankReference: z.string().min(1, 'Bank reference number is required'),
  additionalInfo: z.string().optional(),
});

const PaymentPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  const plan = location.state?.plan;
  const selectedFeatureIds = location.state?.selectedFeatureIds || [];
  
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(plan || null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnnual, setIsAnnual] = useState(location.state?.isAnnual || false);
  const [showYearlyPayment, setShowYearlyPayment] = useState(location.state?.isAnnual || false);
  const [selectedBank, setSelectedBank] = useState<Bank | null>(banks[0]);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [paymentSuccessful, setPaymentSuccessful] = useState(false);

  const form = useForm<z.infer<typeof paymentFormSchema>>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      bank: banks[0].id,
      fullName: '',
      email: user?.email || '',
      phone: '',
      companyName: '',
      bankReference: '',
      additionalInfo: '',
    },
  });

  useEffect(() => {
    if (user) {
      form.setValue('email', user.email || '');
    }
  }, [user, form]);

  const handleBankChange = (bankId: string) => {
    const bank = banks.find(b => b.id === bankId);
    setSelectedBank(bank || null);
    form.setValue('bank', bankId);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleSubmit = async (data: z.infer<typeof paymentFormSchema>) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to continue with payment",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }

    try {
      setIsSubmitting(true);

      console.log('Starting payment submission with selectedFeatureIds:', selectedFeatureIds);

      // Create payment record
      const { data: paymentData, error: paymentError } = await supabase
        .from('payments')
        .insert({
          user_id: user.id,
          amount: plan.monthly_price,
          currency: 'ETB',
          plan_id: plan.id,
          payment_method: 'bank_transfer',
          bank: selectedBank?.name || '',
          bank_reference: data.bankReference,
          payer_email: data.email,
          status: 'pending',
          notes: `Project: ${plan.name}${data.additionalInfo ? `. Additional info: ${data.additionalInfo}` : ''}`
        })
        .select()
        .single();

      if (paymentError) {
        console.error('Payment creation error:', paymentError);
        throw paymentError;
      }

      console.log('Payment created successfully:', paymentData);

      // Create project description
      const projectDescription = `
PROJECT: ${plan.name}

SELECTED FEATURES:
${plan.features ? plan.features.map((feature: string) => `• ${feature}`).join('\n') : 'Custom project features'}

CLIENT INFORMATION:
• Client: ${data.fullName}
• Email: ${data.email}
• Phone: ${data.phone}
• Payment Amount: ${plan.monthly_price.toLocaleString()} ETB
• Payment Method: Bank Transfer (${selectedBank?.name})
• Bank Reference: ${data.bankReference}
${data.additionalInfo ? `• Additional Info: ${data.additionalInfo}` : ''}

PROJECT STATUS: Payment submitted and pending verification
PAYMENT NOTES: Payment verification required before project can begin
      `.trim();

      // Create project
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .insert({
          user_id: user.id,
          title: plan.name,
          description: projectDescription,
          payment_id: paymentData.id,
          status: 'pending'
        })
        .select()
        .single();

      if (projectError) {
        console.error('Project creation error:', projectError);
        throw projectError;
      }

      console.log('Project created successfully:', projectData);

      // Insert selected features into project_features table
      if (selectedFeatureIds && selectedFeatureIds.length > 0) {
        console.log('Inserting project features for project:', projectData.id);
        
        const projectFeatures = selectedFeatureIds.map((featureId: string) => ({
          project_id: projectData.id,
          feature_id: featureId,
          quantity: 1
        }));

        console.log('Project features to insert:', projectFeatures);

        const { data: featuresData, error: featuresError } = await supabase
          .from('project_features')
          .insert(projectFeatures)
          .select();

        if (featuresError) {
          console.error('Error inserting project features:', featuresError);
          toast({
            title: "Warning",
            description: "Project created but features may not be properly recorded. Please contact support.",
            variant: "destructive",
          });
        } else {
          console.log('Project features inserted successfully:', featuresData);
        }
      } else {
        console.log('No features to insert for this project');
      }

      toast({
        title: "Payment Submitted Successfully! 🎉",
        description: "Your payment information has been submitted. We'll verify and start your project soon.",
        duration: 5000,
      });

      navigate('/payment-verification', { 
        state: { 
          paymentId: paymentData.id,
          projectId: projectData.id,
          plan 
        } 
      });

    } catch (error: any) {
      console.error('Payment submission error:', error);
      toast({
        title: "Payment Submission Failed",
        description: error.message || "There was an error submitting your payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-300 to-blue-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative bg-white shadow-lg sm:rounded-3xl p-8">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Payment Information</CardTitle>
            <CardDescription>Enter your details below to complete your order</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              {/* Back Button */}
              <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Project Choice
              </Button>

              {/* Bank Selection */}
              <div>
                <Label className="block text-gray-700 text-sm font-bold mb-2">Select Bank</Label>
                <RadioGroup value={form.watch('bank')} onValueChange={handleBankChange}>
                  {banks.map((bank) => (
                    <div key={bank.id} className="flex items-center space-x-2 p-3 border rounded-lg">
                      <RadioGroupItem value={bank.id} id={bank.id} />
                      <Label htmlFor={bank.id} className="flex-1 cursor-pointer">
                        <div className="font-medium">{bank.name}</div>
                        <div className="text-sm text-gray-600">
                          {bank.accountName} - {bank.accountNumber}
                        </div>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Bank Transfer Details */}
              {selectedBank && (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h3 className="font-semibold text-blue-900 mb-2">Bank Transfer Details</h3>
                  <div className="space-y-1 text-sm text-blue-800">
                    <p><strong>Bank Name:</strong> {selectedBank.name}</p>
                    <p><strong>Account Name:</strong> {selectedBank.accountName}</p>
                    <p><strong>Account Number:</strong> {selectedBank.accountNumber}</p>
                  </div>
                </div>
              )}

              {/* Bank Reference Number */}
              <div>
                <Label htmlFor="bankReference" className="block text-gray-700 text-sm font-bold mb-2">Bank Reference Number</Label>
                <Input
                  type="text"
                  id="bankReference"
                  placeholder="Enter bank reference number"
                  {...form.register('bankReference')}
                  required
                />
                {form.formState.errors.bankReference && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.bankReference.message}</p>
                )}
              </div>

              <Separator />

              {/* Contact Information */}
              <div>
                <Label htmlFor="fullName" className="block text-gray-700 text-sm font-bold mb-2">Full Name</Label>
                <Input
                  type="text"
                  id="fullName"
                  placeholder="Enter your full name"
                  {...form.register('fullName')}
                  required
                />
                {form.formState.errors.fullName && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.fullName.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email Address</Label>
                <Input
                  type="email"
                  id="email"
                  placeholder="Enter your email address"
                  {...form.register('email')}
                  required
                />
                {form.formState.errors.email && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.email.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="phone" className="block text-gray-700 text-sm font-bold mb-2">Phone Number</Label>
                <Input
                  type="tel"
                  id="phone"
                  placeholder="Enter your phone number"
                  {...form.register('phone')}
                  required
                />
                {form.formState.errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.phone.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="companyName" className="block text-gray-700 text-sm font-bold mb-2">Company Name (Optional)</Label>
                <Input
                  type="text"
                  id="companyName"
                  placeholder="Enter your company name"
                  {...form.register('companyName')}
                />
              </div>

              {/* Additional Information */}
              <div>
                <Label htmlFor="additionalInfo" className="block text-gray-700 text-sm font-bold mb-2">Additional Information</Label>
                <Textarea
                  id="additionalInfo"
                  placeholder="Any additional details about your project?"
                  rows={3}
                  {...form.register('additionalInfo')}
                />
              </div>

              <Separator />

              {/* Order Summary */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 font-bold">Plan:</span>
                  <span className="text-blue-600">{plan?.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 font-bold">Amount:</span>
                  <span className="text-blue-600">{plan?.monthly_price.toLocaleString()} ETB</span>
                </div>
                {selectedFeatureIds && selectedFeatureIds.length > 0 && (
                  <div className="text-sm text-gray-600">
                    Selected {selectedFeatureIds.length} feature{selectedFeatureIds.length !== 1 ? 's' : ''}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <Button disabled={isSubmitting} className="w-full">
                {isSubmitting ? (
                  <>
                    Submitting...
                    <svg className="animate-spin h-5 w-5 ml-2" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </>
                ) : (
                  <>
                    Submit Payment
                    <CreditCard className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
