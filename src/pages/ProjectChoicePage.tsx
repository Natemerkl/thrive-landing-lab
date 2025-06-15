
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowRight, Sparkles, Clock, Users, ArrowLeft } from 'lucide-react';

interface ProjectFeature {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'essential' | 'premium' | 'advanced';
  recommended?: boolean;
  icon?: string;
}

const ProjectChoicePage = () => {
  const navigate = useNavigate();
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(['landing-page']); // Landing page is pre-selected

  const features: ProjectFeature[] = [
    // Essential Features (Cheap - Good for landing pages)
    {
      id: 'landing-page',
      name: '1 Page Landing Site',
      description: 'Beautiful single page website with modern design',
      price: 8000,
      category: 'essential',
      recommended: true,
      icon: '🎯'
    },
    {
      id: 'responsive-design',
      name: 'Mobile Responsive Design',
      description: 'Looks perfect on all devices - phones, tablets, desktop',
      price: 2000,
      category: 'essential',
      recommended: true,
      icon: '📱'
    },
    {
      id: 'seo-basic',
      name: 'Basic SEO Setup',
      description: 'Meta tags, titles, and search engine optimization',
      price: 1500,
      category: 'essential',
      recommended: true,
      icon: '🔍'
    },
    {
      id: 'contact-form',
      name: 'Contact Form',
      description: 'Simple contact form with email notifications',
      price: 1000,
      category: 'essential',
      icon: '✉️'
    },
    
    // Premium Features
    {
      id: 'multi-page',
      name: 'Multi-Page Website (3-5 pages)',
      description: 'About, Services, Portfolio, Contact pages',
      price: 3000,
      category: 'premium',
      icon: '📄'
    },
    {
      id: 'blog-cms',
      name: 'Blog/News Section',
      description: 'Content management system for blogs and updates',
      price: 8000,
      category: 'premium',
      icon: '📝'
    },
    {
      id: 'gallery-portfolio',
      name: 'Image Gallery/Portfolio',
      description: 'Showcase your work with beautiful image galleries',
      price: 2500,
      category: 'premium',
      icon: '🖼️'
    },
    {
      id: 'social-integration',
      name: 'Social Media Integration',
      description: 'Connect Instagram, Facebook, Twitter feeds',
      price: 3000,
      category: 'premium',
      icon: '📲'
    },
    {
      id: 'google-analytics',
      name: 'Analytics Setup',
      description: 'Track visitors and website performance',
      price: 2000,
      category: 'premium',
      icon: '📊'
    },
    {
      id: 'user-registration',
      name: 'User Registration & Login',
      description: 'Secure user accounts and authentication system',
      price: 5000,
      category: 'premium',
      icon: '🔐'
    },

    // Advanced Features
    {
      id: 'ai-integration',
      name: 'AI Integration for Website',
      description: 'Custom AI chatbots, content generation, or smart features for your business',
      price: 45000,
      category: 'advanced',
      recommended: true,
      icon: '🤖'
    },
    {
      id: 'payment-manual',
      name: 'Manual Payment Integration',
      description: 'Bank transfer and manual payment processing',
      price: 12000,
      category: 'advanced',
      icon: '💰'
    },
    {
      id: 'payment-automatic',
      name: 'Automatic Payment Integration',
      description: 'Stripe, PayPal, or automated payment processing',
      price: 25000,
      category: 'advanced',
      icon: '💳'
    },
    {
      id: 'admin-panel',
      name: 'Admin Dashboard',
      description: 'Manage content, users, and site settings',
      price: 30000,
      category: 'advanced',
      icon: '⚙️'
    },
    {
      id: 'database-integration',
      name: 'Database & Backend',
      description: 'Store and manage dynamic content and user data',
      price: 35000,
      category: 'advanced',
      icon: '🗄️'
    },
    {
      id: 'api-integrations',
      name: 'Third-party API Integrations',
      description: 'Connect to external services and platforms',
      price: 15000,
      category: 'advanced',
      icon: '🔌'
    },
    {
      id: 'advanced-seo',
      name: 'Advanced SEO & Performance',
      description: 'Speed optimization, advanced SEO, schema markup',
      price: 8000,
      category: 'advanced',
      icon: '🚀'
    }
  ];

  const handleFeatureToggle = (featureId: string) => {
    if (featureId === 'landing-page') return; // Can't uncheck the base landing page
    
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
      features: selectedFeaturesList.map(f => f.name)
    };

    navigate('/payment', { 
      state: { 
        plan,
        customFeatures: selectedFeaturesList
      } 
    });
  };

  const getCategoryFeatures = (category: 'essential' | 'premium' | 'advanced') => {
    return features.filter(feature => feature.category === category);
  };

  const getCategoryTotal = (category: 'essential' | 'premium' | 'advanced') => {
    return getCategoryFeatures(category)
      .filter(feature => selectedFeatures.includes(feature.id))
      .reduce((total, feature) => total + feature.price, 0);
  };

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
            Pick exactly what you need. Start simple with a landing page, or go full-stack with AI integration. 
            You only pay for what you choose!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Feature Selection */}
          <div className="lg:col-span-3 space-y-8">
            {/* Essential Features */}
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="flex items-center text-green-800">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Essential Features
                  <Badge variant="secondary" className="ml-2 bg-green-100 text-green-800">
                    Perfect for startups
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Great for small businesses, personal brands, and simple websites
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {getCategoryFeatures('essential').map((feature) => (
                    <div
                      key={feature.id}
                      className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                        selectedFeatures.includes(feature.id)
                          ? 'border-green-500 bg-green-100'
                          : 'border-gray-200 bg-white hover:border-green-300'
                      }`}
                      onClick={() => handleFeatureToggle(feature.id)}
                    >
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          checked={selectedFeatures.includes(feature.id)}
                          disabled={feature.id === 'landing-page'}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex items-center">
                            <span className="text-2xl mr-2">{feature.icon}</span>
                            <h3 className="font-medium text-gray-900">{feature.name}</h3>
                            {feature.recommended && (
                              <Badge variant="outline" className="ml-2 text-xs">
                                Recommended
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
                          <p className="text-lg font-semibold text-green-600 mt-2">
                            {formatCurrency(feature.price)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-green-100 rounded-lg">
                  <p className="text-sm text-green-800">
                    <strong>Category Total: {formatCurrency(getCategoryTotal('essential'))}</strong>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Premium Features */}
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center text-blue-800">
                  <Users className="mr-2 h-5 w-5" />
                  Premium Features
                  <Badge variant="secondary" className="ml-2 bg-blue-100 text-blue-800">
                    Most popular
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Advanced functionality for growing businesses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {getCategoryFeatures('premium').map((feature) => (
                    <div
                      key={feature.id}
                      className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                        selectedFeatures.includes(feature.id)
                          ? 'border-blue-500 bg-blue-100'
                          : 'border-gray-200 bg-white hover:border-blue-300'
                      }`}
                      onClick={() => handleFeatureToggle(feature.id)}
                    >
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          checked={selectedFeatures.includes(feature.id)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex items-center">
                            <span className="text-2xl mr-2">{feature.icon}</span>
                            <h3 className="font-medium text-gray-900">{feature.name}</h3>
                            {feature.recommended && (
                              <Badge variant="outline" className="ml-2 text-xs">
                                Recommended
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
                          <p className="text-lg font-semibold text-blue-600 mt-2">
                            {formatCurrency(feature.price)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-blue-100 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Category Total: {formatCurrency(getCategoryTotal('premium'))}</strong>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Advanced Features */}
            <Card className="border-purple-200 bg-purple-50">
              <CardHeader>
                <CardTitle className="flex items-center text-purple-800">
                  <Clock className="mr-2 h-5 w-5" />
                  Advanced Features
                  <Badge variant="secondary" className="ml-2 bg-purple-100 text-purple-800">
                    Enterprise grade
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Full-stack applications with AI integration and complex functionality
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {getCategoryFeatures('advanced').map((feature) => (
                    <div
                      key={feature.id}
                      className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                        selectedFeatures.includes(feature.id)
                          ? 'border-purple-500 bg-purple-100'
                          : 'border-gray-200 bg-white hover:border-purple-300'
                      }`}
                      onClick={() => handleFeatureToggle(feature.id)}
                    >
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          checked={selectedFeatures.includes(feature.id)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex items-center">
                            <span className="text-2xl mr-2">{feature.icon}</span>
                            <h3 className="font-medium text-gray-900">{feature.name}</h3>
                            {feature.recommended && (
                              <Badge variant="outline" className="ml-2 text-xs">
                                Hot 🔥
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
                          <p className="text-lg font-semibold text-purple-600 mt-2">
                            {formatCurrency(feature.price)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-purple-100 rounded-lg">
                  <p className="text-sm text-purple-800">
                    <strong>Category Total: {formatCurrency(getCategoryTotal('advanced'))}</strong>
                  </p>
                </div>
              </CardContent>
            </Card>
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
                  {selectedFeatures.includes('ai-integration') && (
                    <p>🤖 Custom AI trained for your business</p>
                  )}
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
