import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, CreditCard, Building, User, Mail, Phone } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const plan = location.state?.plan;
  const selectedFeatureIds = location.state?.selectedFeatureIds || [];
  
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [selectedBank, setSelectedBank] = useState('');
  const [bankReference, setBankReference] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    companyName: '',
    additionalInfo: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        email: user.email || '',
      }));
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
      setSubmitting(true);

      console.log('Starting payment submission with selectedFeatureIds:', selectedFeatureIds);

      // Create payment record
      const { data: paymentData, error: paymentError } = await supabase
        .from('payments')
        .insert({
          user_id: user.id,
          amount: plan.monthly_price,
          currency: 'ETB',
          plan_id: plan.id,
          payment_method: paymentMethod,
          bank: paymentMethod === 'bank_transfer' ? selectedBank : '',
          bank_reference: bankReference,
          payer_email: formData.email,
          status: 'pending',
          notes: `Project: ${plan.name}${formData.additionalInfo ? `. Additional info: ${formData.additionalInfo}` : ''}`
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
• Client: ${formData.fullName}
• Email: ${formData.email}
• Phone: ${formData.phone}
• Payment Amount: ${plan.monthly_price.toLocaleString()} ETB
• Payment Method: ${paymentMethod === 'bank_transfer' ? `Bank Transfer (${selectedBank})` : paymentMethod}
• Bank Reference: ${bankReference}
${formData.additionalInfo ? `• Additional Info: ${formData.additionalInfo}` : ''}

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
      setSubmitting(false);
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
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Back Button */}
              <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Project Choice
              </Button>

              {/* Payment Method Selection */}
              <div>
                <Label className="block text-gray-700 text-sm font-bold mb-2">Payment Method</Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="credit_card">Credit Card</SelectItem>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Bank Transfer Details (Conditional) */}
              {paymentMethod === 'bank_transfer' && (
                <div className="space-y-4">
                  <div>
                    <Label className="block text-gray-700 text-sm font-bold mb-2">Select Bank</Label>
                    <Select value={selectedBank} onValueChange={setSelectedBank}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select bank" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CBE">Commercial Bank of Ethiopia (CBE)</SelectItem>
                        <SelectItem value="BOA">Bank of Abyssinia (BOA)</SelectItem>
                        <SelectItem value="Dashen">Dashen Bank</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="bankReference" className="block text-gray-700 text-sm font-bold mb-2">Bank Reference Number</Label>
                    <Input
                      type="text"
                      id="bankReference"
                      name="bankReference"
                      placeholder="Enter bank reference number"
                      value={bankReference}
                      onChange={(e) => setBankReference(e.target.value)}
                      required
                    />
                  </div>
                </div>
              )}

              <Separator />

              {/* Contact Information */}
              <div>
                <Label htmlFor="fullName" className="block text-gray-700 text-sm font-bold mb-2">Full Name</Label>
                <Input
                  type="text"
                  id="fullName"
                  name="fullName"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email Address</Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone" className="block text-gray-700 text-sm font-bold mb-2">Phone Number</Label>
                <Input
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="companyName" className="block text-gray-700 text-sm font-bold mb-2">Company Name (Optional)</Label>
                <Input
                  type="text"
                  id="companyName"
                  name="companyName"
                  placeholder="Enter your company name"
                  value={formData.companyName}
                  onChange={handleInputChange}
                />
              </div>

              {/* Additional Information */}
              <div>
                <Label htmlFor="additionalInfo" className="block text-gray-700 text-sm font-bold mb-2">Additional Information</Label>
                <Textarea
                  id="additionalInfo"
                  name="additionalInfo"
                  placeholder="Any additional details about your project?"
                  rows={3}
                  value={formData.additionalInfo}
                  onChange={handleInputChange}
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
              <Button disabled={submitting} className="w-full">
                {submitting ? (
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
