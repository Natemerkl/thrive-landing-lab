
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowRight, Sparkles, Clock, Users, ArrowLeft, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface DatabaseFeature {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  is_active: boolean;
}

const ProjectChoicePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [features, setFeatures] = useState<DatabaseFeature[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeatures();
  }, []);

  // Handle pre-selected features from pricing cards
  useEffect(() => {
    const preSelectedFeatures = location.state?.preSelectedFeatures;
    if (preSelectedFeatures && preSelectedFeatures.length > 0) {
      setSelectedFeatures(preSelectedFeatures);
    }
  }, [location.state]);

  const fetchFeatures = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('features')
        .select('*')
        .eq('is_active', true)
        .order('category', { ascending: true })
        .order('price', { ascending: true });

      if (error) {
        console.error('Error fetching features:', error);
        toast({
          title: "Error",
          description: "Failed to load features",
          variant: "destructive",
        });
        return;
      }

      setFeatures(data || []);
      
      // Auto-select landing page if available
      const landingPageFeature = data?.find(f => f.name.toLowerCase().includes('landing'));
      if (landingPageFeature && selectedFeatures.length === 0) {
        setSelectedFeatures([landingPageFeature.id]);
      }
    } catch (error) {
      console.error('Error fetching features:', error);
      toast({
        title: "Error",
        description: "Failed to load features",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFeatureToggle = (featureId: string) => {
    const feature = features.find(f => f.id === featureId);
    if (feature?.name.toLowerCase().includes('landing')) return; // Can't uncheck the base landing page
    
    setSelectedFeatures(prev => 
      prev.includes(featureId) 
        ? prev.filter(id => id !== featureId)
        : [...prev, featureId]
    );
  };

  const calculateTotal = () => {
    return features
      .filter(feature => selectedFeatures.includes(feature.id))
      .reduce((total, feature) => total + feature.price, 0);
  };

  const getSelectedFeatures = () => {
    return features.filter(feature => selectedFeatures.includes(feature.id));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ET', {
      style: 'currency',
      currency: 'ETB',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleProceedToPayment = () => {
    const selectedFeaturesList = getSelectedFeatures();
    const total = calculateTotal();
    
    const plan = {
      id: 'custom',
      name: 'Custom Project',
      monthly_price: total,
      annual_price: total,
      features: selectedFeaturesList.map(f => f.name),
      selectedFeatureIds: selectedFeatures // Pass the feature IDs for database storage
    };

    navigate('/payment', { 
      state: { 
        plan,
        customFeatures: selectedFeaturesList,
        selectedFeatureIds: selectedFeatures
      } 
    });
  };

  const getCategoryFeatures = (category: string) => {
    return features.filter(feature => feature.category === category);
  };

  const getCategoryTotal = (category: string) => {
    return getCategoryFeatures(category)
      .filter(feature => selectedFeatures.includes(feature.id))
      .reduce((total, feature) => total + feature.price, 0);
  };

  const getCategoryInfo = (category: string) => {
    switch (category) {
      case 'starter':
        return {
          title: 'Essential Features',
          description: 'Great for small businesses, personal brands, and simple websites',
          color: 'green',
          badge: 'Perfect for startups'
        };
      case 'business':
        return {
          title: 'Premium Features',
          description: 'Advanced functionality for growing businesses',
          color: 'blue',
          badge: 'Most popular'
        };
      case 'enterprise':
        return {
          title: 'Advanced Features',
          description: 'Full-stack applications and complex functionality',
          color: 'purple',
          badge: 'Enterprise grade'
        };
      case 'custom':
        return {
          title: 'Custom Features',
          description: 'Specialized features and integrations',
          color: 'orange',
          badge: 'Specialized'
        };
      default:
        return {
          title: category,
          description: '',
          color: 'gray',
          badge: ''
        };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Loading features...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            What Would You Like Built? 🚀
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Pick exactly what you need. Start simple with a landing page, or go full-stack with advanced features. 
            You only pay for what you choose!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Feature Selection */}
          <div className="lg:col-span-3 space-y-8">
            {['starter', 'business', 'enterprise', 'custom'].map((category) => {
              const categoryFeatures = getCategoryFeatures(category);
              if (categoryFeatures.length === 0) return null;
              
              const categoryInfo = getCategoryInfo(category);
              
              return (
                <Card key={category} className={`border-${categoryInfo.color}-200 bg-${categoryInfo.color}-50`}>
                  <CardHeader>
                    <CardTitle className={`flex items-center text-${categoryInfo.color}-800`}>
                      {category === 'starter' && <Sparkles className="mr-2 h-5 w-5" />}
                      {category === 'business' && <Users className="mr-2 h-5 w-5" />}
                      {category === 'enterprise' && <Clock className="mr-2 h-5 w-5" />}
                      {category === 'custom' && <ArrowRight className="mr-2 h-5 w-5" />}
                      {categoryInfo.title}
                      {categoryInfo.badge && (
                        <Badge variant="secondary" className={`ml-2 bg-${categoryInfo.color}-100 text-${categoryInfo.color}-800`}>
                          {categoryInfo.badge}
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription>
                      {categoryInfo.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {categoryFeatures.map((feature) => (
                        <div
                          key={feature.id}
                          className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                            selectedFeatures.includes(feature.id)
                              ? `border-${categoryInfo.color}-500 bg-${categoryInfo.color}-100`
                              : 'border-gray-200 bg-white hover:border-gray-300'
                          }`}
                          onClick={() => handleFeatureToggle(feature.id)}
                        >
                          <div className="flex items-start space-x-3">
                            <Checkbox
                              checked={selectedFeatures.includes(feature.id)}
                              disabled={feature.name.toLowerCase().includes('landing')}
                              className="mt-1"
                            />
                            <div className="flex-1">
                              <h3 className="font-medium text-gray-900">{feature.name}</h3>
                              {feature.description && (
                                <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
                              )}
                              <p className={`text-lg font-semibold text-${categoryInfo.color}-600 mt-2`}>
                                {formatCurrency(feature.price)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className={`mt-4 p-3 bg-${categoryInfo.color}-100 rounded-lg`}>
                      <p className={`text-sm text-${categoryInfo.color}-800`}>
                        <strong>Category Total: {formatCurrency(getCategoryTotal(category))}</strong>
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Your Project Summary</CardTitle>
                <CardDescription>
                  {selectedFeatures.length} feature{selectedFeatures.length !== 1 ? 's' : ''} selected
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {getSelectedFeatures().map((feature) => (
                    <div key={feature.id} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{feature.name}</span>
                      <span className="text-sm font-medium">{formatCurrency(feature.price)}</span>
                    </div>
                  ))}
                </div>
                
                <Separator />
                
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-2xl font-bold text-blue-600">
                    {formatCurrency(calculateTotal())}
                  </span>
                </div>

                <div className="text-xs text-gray-500 space-y-1">
                  <p>✅ 2 weeks free support included</p>
                  <p>✅ Mobile responsive design</p>
                  <p>✅ Fast delivery (1-4 weeks)</p>
                  <p>✅ Source code ownership</p>
                </div>

                <Button 
                  onClick={handleProceedToPayment}
                  className="w-full"
                  size="lg"
                  disabled={selectedFeatures.length === 0}
                >
                  Proceed to Payment
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>

                <p className="text-xs text-center text-gray-500">
                  No hidden fees • Secure payment • Money-back guarantee
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectChoicePage;
