import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { FolderOpen, Calendar, DollarSign, RefreshCw, Package, CheckCircle2, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface ProjectFeature {
  id: string;
  feature: {
    id: string;
    name: string;
    description: string | null;
    price: number;
    category: string;
  };
  quantity: number;
  custom_price: number | null;
  notes: string | null;
}

interface ParsedFeature {
  name: string;
  price: number;
  category: string;
  description?: string;
}

interface Project {
  id: string;
  title: string;
  description: string | null;
  status: string;
  start_date: string | null;
  completion_date: string | null;
  created_at: string;
  payment?: {
    amount: number;
    currency: string;
    plan_id: string;
  };
  project_features: ProjectFeature[];
}

const MyProjectsSection: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchMyProjects();
    }
  }, [user]);

  const fetchMyProjects = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          payment:payments(amount, currency, plan_id),
          project_features(
            id,
            quantity,
            custom_price,
            notes,
            feature:features(
              id,
              name,
              description,
              price,
              category
            )
          )
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching projects:', error);
        toast({
          title: "Error",
          description: "Failed to fetch your projects",
          variant: "destructive",
        });
        return;
      }

      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast({
        title: "Error",
        description: "Failed to fetch your projects",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const parseDescriptionFeatures = (description: string | null): ParsedFeature[] => {
    if (!description) return [];
    
    const features: ParsedFeature[] = [];
    const featurePattern = /•\s*([^:]+):\s*ETB\s*([\d,]+)/g;
    let match;
    
    while ((match = featurePattern.exec(description)) !== null) {
      const name = match[1].trim();
      const price = parseInt(match[2].replace(/,/g, ''));
      
      if (name && !isNaN(price)) {
        // Determine category based on feature name or price
        let category = 'custom';
        if (name.toLowerCase().includes('starter') || price < 5000) {
          category = 'starter';
        } else if (name.toLowerCase().includes('business') || (price >= 5000 && price < 15000)) {
          category = 'business';
        } else if (name.toLowerCase().includes('enterprise') || price >= 15000) {
          category = 'enterprise';
        }
        
        features.push({
          name,
          price,
          category,
          description: `Feature parsed from project description`
        });
      }
    }
    
    return features;
  };

  const getStatusProgress = (status: string) => {
    switch (status) {
      case 'pending': return 10;
      case 'started': return 25;
      case 'in_progress': return 60;
      case 'completed': return 100;
      case 'cancelled': return 0;
      default: return 0;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-gray-100 text-gray-800';
      case 'started': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'in_progress':
        return <RefreshCw className="h-4 w-4 text-yellow-600" />;
      case 'started':
        return <Package className="h-4 w-4 text-blue-600" />;
      default:
        return <Calendar className="h-4 w-4 text-gray-600" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-ET', {
      style: 'currency',
      currency: currency || 'ETB',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Your project is in queue and will start soon. We\'ll notify you when work begins.';
      case 'started':
        return 'Great news! We\'ve started working on your project. Initial setup and planning is underway.';
      case 'in_progress':
        return 'Your project is actively being developed. We\'re making solid progress and will keep you updated.';
      case 'completed':
        return '🎉 Congratulations! Your project has been completed successfully. Check your email for delivery details.';
      case 'cancelled':
        return 'This project has been cancelled. If you have questions, please contact support.';
      default:
        return 'Project status will be updated as work progresses.';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'starter': return 'text-green-600';
      case 'business': return 'text-blue-600';
      case 'enterprise': return 'text-purple-600';
      case 'custom': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };

  const extractClientInfo = (description: string | null) => {
    if (!description) return null;
    
    const clientInfoMatch = description.match(/CLIENT INFORMATION:(.*?)(?=PROJECT STATUS:|PAYMENT NOTES:|$)/s);
    if (!clientInfoMatch) return null;
    
    const clientInfo = clientInfoMatch[1].trim();
    const info: any = {};
    
    const lines = clientInfo.split('\n');
    for (const line of lines) {
      const trimmedLine = line.trim();
      if (trimmedLine.startsWith('• Client:')) {
        info.client = trimmedLine.replace('• Client:', '').trim();
      } else if (trimmedLine.startsWith('• Payment Amount:')) {
        info.amount = trimmedLine.replace('• Payment Amount:', '').trim();
      } else if (trimmedLine.startsWith('• Payment Method:')) {
        info.method = trimmedLine.replace('• Payment Method:', '').trim();
      } else if (trimmedLine.startsWith('• Package:')) {
        info.package = trimmedLine.replace('• Package:', '').trim();
      }
    }
    
    return info;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FolderOpen className="mr-2 h-5 w-5" />
            My Projects
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin mr-2" />
            Loading your projects...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (projects.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FolderOpen className="mr-2 h-5 w-5" />
            My Projects
          </CardTitle>
          <CardDescription>
            Track your project progress and see what features you've ordered
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <FolderOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">No projects yet</p>
            <p className="text-sm">Once you make a payment for a project, it will appear here</p>
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
            <FolderOpen className="mr-2 h-5 w-5" />
            My Projects ({projects.length})
          </div>
          <button 
            onClick={fetchMyProjects}
            className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </button>
        </CardTitle>
        <CardDescription>
          Track your project progress and see what features you've ordered
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {projects.map((project) => {
            const clientInfo = extractClientInfo(project.description);
            const hasProjectFeatures = project.project_features && project.project_features.length > 0;
            const parsedFeatures = !hasProjectFeatures ? parseDescriptionFeatures(project.description) : [];
            const showParsedFeatures = parsedFeatures.length > 0;
            
            return (
              <div key={project.id} className="border rounded-lg p-6 space-y-4 bg-white shadow-sm">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{project.title}</h3>
                    {project.payment && (
                      <div className="flex items-center mt-1 text-sm text-gray-600">
                        <DollarSign className="h-4 w-4 mr-1" />
                        {formatCurrency(project.payment.amount, project.payment.currency)} - {project.payment.plan_id.replace('-', ' ').toUpperCase()} Package
                      </div>
                    )}
                  </div>
                  <div className="flex items-center">
                    {getStatusIcon(project.status)}
                    <Badge className={`ml-2 ${getStatusColor(project.status)}`}>
                      {project.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>

                {/* Project Features - Saved or Parsed */}
                {(hasProjectFeatures || showParsedFeatures) && (
                  <div className="text-sm text-gray-700 bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-3 flex items-center">
                      <FileText className="h-4 w-4 mr-2" />
                      Ordered Features & Services:
                      {showParsedFeatures && (
                        <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                          Parsed from description
                        </span>
                      )}
                    </h4>
                    
                    {hasProjectFeatures ? (
                      // Display saved project features
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {project.project_features.map((projectFeature) => (
                          <div key={projectFeature.id} className="flex items-start bg-white p-3 rounded-lg border">
                            <CheckCircle2 className="h-4 w-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                              <span className="font-medium text-blue-800">{projectFeature.feature.name}</span>
                              {projectFeature.feature.description && (
                                <p className="text-xs text-blue-600 mt-1">{projectFeature.feature.description}</p>
                              )}
                              <div className="flex items-center justify-between mt-2">
                                <span className={`text-xs px-2 py-1 rounded-full bg-gray-100 ${getCategoryColor(projectFeature.feature.category)}`}>
                                  {projectFeature.feature.category}
                                </span>
                                <span className="text-sm font-semibold text-blue-800">
                                  {formatCurrency(projectFeature.custom_price || projectFeature.feature.price, 'ETB')}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      // Display parsed features from description
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {parsedFeatures.map((feature, index) => (
                          <div key={index} className="flex items-start bg-white p-3 rounded-lg border border-yellow-200">
                            <CheckCircle2 className="h-4 w-4 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                              <span className="font-medium text-yellow-800">{feature.name}</span>
                              {feature.description && (
                                <p className="text-xs text-yellow-600 mt-1">{feature.description}</p>
                              )}
                              <div className="flex items-center justify-between mt-2">
                                <span className={`text-xs px-2 py-1 rounded-full bg-yellow-100 ${getCategoryColor(feature.category)}`}>
                                  {feature.category}
                                </span>
                                <span className="text-sm font-semibold text-yellow-800">
                                  {formatCurrency(feature.price, 'ETB')}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Features Total */}
                    {(hasProjectFeatures || showParsedFeatures) && (
                      <div className="mt-3 pt-3 border-t border-blue-200">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-blue-900">Features Total:</span>
                          <span className="font-bold text-blue-900">
                            {hasProjectFeatures ? (
                              formatCurrency(
                                project.project_features.reduce((total, pf) => 
                                  total + (pf.custom_price || pf.feature.price), 0
                                ), 'ETB'
                              )
                            ) : (
                              formatCurrency(
                                parsedFeatures.reduce((total, f) => total + f.price, 0), 'ETB'
                              )
                            )}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* No Features Message */}
                {!hasProjectFeatures && !showParsedFeatures && (
                  <div className="text-sm text-gray-500 bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                      <FileText className="h-4 w-4 mr-2" />
                      No specific features recorded
                    </h4>
                    <p>This project may have been created before the feature system was implemented.</p>
                  </div>
                )}

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-700">Project Progress</span>
                    <span className="text-gray-600">{getStatusProgress(project.status)}%</span>
                  </div>
                  <Progress value={getStatusProgress(project.status)} className="h-3" />
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm text-blue-800">{getStatusMessage(project.status)}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t">
                  <div className="text-sm">
                    <div className="flex items-center text-gray-500 mb-1">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span className="font-medium">Ordered</span>
                    </div>
                    <span className="text-gray-900">{formatDate(project.created_at)}</span>
                  </div>
                  
                  {project.start_date && (
                    <div className="text-sm">
                      <div className="flex items-center text-blue-500 mb-1">
                        <Package className="h-4 w-4 mr-1" />
                        <span className="font-medium">Started</span>
                      </div>
                      <span className="text-blue-700">{formatDate(project.start_date)}</span>
                    </div>
                  )}
                  
                  {project.completion_date && (
                    <div className="text-sm">
                      <div className="flex items-center text-green-500 mb-1">
                        <CheckCircle2 className="h-4 w-4 mr-1" />
                        <span className="font-medium">Completed</span>
                      </div>
                      <span className="text-green-700">{formatDate(project.completion_date)}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default MyProjectsSection;
