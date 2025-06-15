
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, FolderOpen, Calendar, CheckCircle2, Clock, RefreshCw, Code } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description: string | null;
  status: string;
  start_date: string | null;
  completion_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  payment?: {
    amount: number;
    plan_id: string;
  };
}

const ProjectTrackingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchProjects();
  }, [user, navigate]);

  const fetchProjects = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          payment:payments(amount, plan_id)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error: any) {
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
      case 'pending': return 0;
      case 'started': return 25;
      case 'in_progress': return 60;
      case 'completed': return 100;
      case 'cancelled': return 0;
      default: return 0;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'started': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      default:
        return <Clock className="h-4 w-4 text-blue-600" />;
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
            Your Project Progress
          </h1>
          <p className="text-slate-600 text-lg">
            Track the progress of your projects in real-time
          </p>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-slate-800">Active Projects</h2>
          <Button
            onClick={fetchProjects}
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
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading your projects...</p>
          </div>
        ) : projects.length === 0 ? (
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-3xl">
            <CardContent className="text-center py-12">
              <FolderOpen className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-800 mb-2">No projects yet</h3>
              <p className="text-slate-600 mb-4">
                You don't have any active projects. Start by making a payment for your project.
              </p>
              <Button
                onClick={() => navigate('/choose-project')}
                className="rounded-xl"
              >
                Start a Project
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {projects.map((project) => (
              <Card key={project.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-3xl overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl font-bold text-slate-800 mb-2">
                        {project.title}
                      </CardTitle>
                      {project.description && (
                        <CardDescription className="text-slate-600 text-base">
                          {project.description}
                        </CardDescription>
                      )}
                    </div>
                    <div className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium border ${getStatusColor(project.status)}`}>
                      {getStatusIcon(project.status)}
                      <span className="ml-2 capitalize">{project.status.replace('_', ' ')}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Progress Bar */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-slate-700">Progress</span>
                      <span className="text-sm text-slate-600">{getStatusProgress(project.status)}%</span>
                    </div>
                    <Progress 
                      value={getStatusProgress(project.status)} 
                      className="h-2"
                    />
                  </div>

                  {/* Project Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-slate-50 rounded-xl p-4">
                      <div className="flex items-center mb-2">
                        <Calendar className="h-4 w-4 text-slate-600 mr-2" />
                        <span className="text-sm font-medium text-slate-700">Created</span>
                      </div>
                      <p className="text-sm text-slate-600">{formatDate(project.created_at)}</p>
                    </div>

                    {project.start_date && (
                      <div className="bg-blue-50 rounded-xl p-4">
                        <div className="flex items-center mb-2">
                          <Calendar className="h-4 w-4 text-blue-600 mr-2" />
                          <span className="text-sm font-medium text-blue-700">Started</span>
                        </div>
                        <p className="text-sm text-blue-600">{formatDate(project.start_date)}</p>
                      </div>
                    )}

                    {project.completion_date && (
                      <div className="bg-green-50 rounded-xl p-4">
                        <div className="flex items-center mb-2">
                          <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                          <span className="text-sm font-medium text-green-700">Completed</span>
                        </div>
                        <p className="text-sm text-green-600">{formatDate(project.completion_date)}</p>
                      </div>
                    )}

                    {project.payment && (
                      <div className="bg-yellow-50 rounded-xl p-4">
                        <div className="flex items-center mb-2">
                          <span className="text-sm font-medium text-yellow-700">Payment</span>
                        </div>
                        <p className="text-sm text-yellow-600">
                          {formatCurrency(project.payment.amount)} - {project.payment.plan_id.replace('-', ' ')}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Project Notes */}
                  {project.notes && (
                    <div className="bg-blue-50 rounded-xl p-4">
                      <h4 className="text-sm font-medium text-blue-800 mb-2">Project Notes</h4>
                      <p className="text-sm text-blue-700">{project.notes}</p>
                    </div>
                  )}

                  {/* Status Information */}
                  <div className="bg-slate-50 rounded-xl p-4">
                    <h4 className="text-sm font-medium text-slate-800 mb-3">What's happening now?</h4>
                    <div className="text-sm text-slate-600">
                      {project.status === 'pending' && (
                        <p>Your project is in queue and will start soon. We'll notify you when work begins.</p>
                      )}
                      {project.status === 'started' && (
                        <p>Great news! We've started working on your project. Initial setup and planning is underway.</p>
                      )}
                      {project.status === 'in_progress' && (
                        <p>Your project is actively being developed. We're making solid progress and will keep you updated.</p>
                      )}
                      {project.status === 'completed' && (
                        <p>🎉 Congratulations! Your project has been completed successfully. Check your email for delivery details.</p>
                      )}
                      {project.status === 'cancelled' && (
                        <p>This project has been cancelled. If you have questions, please contact support.</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
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

export default ProjectTrackingPage;
