
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { FolderOpen, Calendar, DollarSign, RefreshCw, Package, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

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
          payment:payments(amount, currency, plan_id)
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
          {projects.map((project) => (
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

              {project.description && (
                <div className="text-sm text-gray-700 bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Project Details & Features:</h4>
                  <div className="whitespace-pre-line">{project.description}</div>
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
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MyProjectsSection;
