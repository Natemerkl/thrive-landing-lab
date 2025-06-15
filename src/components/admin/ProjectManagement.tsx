import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  FolderOpen, 
  Calendar, 
  DollarSign, 
  RefreshCw, 
  Package, 
  CheckCircle2, 
  FileText,
  User,
  Edit3,
  Save,
  X
} from 'lucide-react';

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
  user_id: string;
  payment?: {
    amount: number;
    currency: string;
    plan_id: string;
    payer_email: string;
  } | null;
  profile?: {
    full_name: string | null;
    email: string | null;
  } | null;
  project_features: ProjectFeature[];
}

const ProjectManagement = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<string | null>(null);
  const [editingNotes, setEditingNotes] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          payments!projects_payment_id_fkey(amount, currency, plan_id, payer_email),
          profiles!projects_user_id_fkey(full_name, email),
          project_features(
            id,
            quantity,
            custom_price,
            notes,
            features(
              id,
              name,
              description,
              price,
              category
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching projects:', error);
        toast({
          title: "Error",
          description: "Failed to fetch projects",
          variant: "destructive",
        });
        return;
      }

      // Transform the data to match our interface
      const transformedProjects = (data || []).map(project => ({
        ...project,
        payment: project.payments?.[0] || null,
        profile: project.profiles?.[0] || null,
        project_features: (project.project_features || []).map(pf => ({
          ...pf,
          feature: pf.features
        }))
      }));

      setProjects(transformedProjects);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast({
        title: "Error",
        description: "Failed to fetch projects",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProjectStatus = async (projectId: string, status: string) => {
    try {
      const updateData: any = { status, updated_at: new Date().toISOString() };
      
      if (status === 'started' && !projects.find(p => p.id === projectId)?.start_date) {
        updateData.start_date = new Date().toISOString();
      } else if (status === 'completed') {
        updateData.completion_date = new Date().toISOString();
      }

      const { error } = await supabase
        .from('projects')
        .update(updateData)
        .eq('id', projectId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Project status updated successfully",
      });

      fetchProjects();
    } catch (error: any) {
      console.error('Error updating project status:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update project status",
        variant: "destructive",
      });
    }
  };

  const updateProjectNotes = async (projectId: string, notes: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ 
          notes,
          updated_at: new Date().toISOString()
        })
        .eq('id', projectId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Project notes updated successfully",
      });

      setEditingProject(null);
      setEditingNotes('');
      fetchProjects();
    } catch (error: any) {
      console.error('Error updating project notes:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update project notes",
        variant: "destructive",
      });
    }
  };

  const startEditingNotes = (projectId: string, currentNotes: string | null) => {
    setEditingProject(projectId);
    setEditingNotes(currentNotes || '');
  };

  const cancelEditingNotes = () => {
    setEditingProject(null);
    setEditingNotes('');
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
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-ET', {
      style: 'currency',
      currency: currency || 'ETB',
      minimumFractionDigits: 0,
    }).format(amount);
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

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FolderOpen className="mr-2 h-5 w-5" />
            Project Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin mr-2" />
            Loading projects...
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
            Project Management ({projects.length})
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchProjects}
            className="flex items-center"
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
        </CardTitle>
        <CardDescription>
          Manage all client projects and track their progress
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {projects.map((project) => (
            <div key={project.id} className="border rounded-lg p-6 space-y-4 bg-white shadow-sm">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{project.title}</h3>
                  
                  {/* Client Information */}
                  <div className="flex items-center mt-1 text-sm text-gray-600">
                    <User className="h-4 w-4 mr-1" />
                    {project.profile?.full_name || 'Unknown Client'} ({project.profile?.email || project.payment?.payer_email || 'No email'})
                  </div>
                  
                  {/* Payment Information */}
                  {project.payment && (
                    <div className="flex items-center mt-1 text-sm text-gray-600">
                      <DollarSign className="h-4 w-4 mr-1" />
                      {formatCurrency(project.payment.amount, project.payment.currency)} - {project.payment.plan_id.replace('-', ' ').toUpperCase()}
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  {getStatusIcon(project.status)}
                  <Select
                    value={project.status}
                    onValueChange={(value) => updateProjectStatus(project.id, value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="started">Started</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Project Features */}
              {project.project_features && project.project_features.length > 0 && (
                <div className="text-sm text-gray-700 bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-3 flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    Ordered Features & Services:
                  </h4>
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
                  <div className="mt-3 pt-3 border-t border-blue-200">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-blue-900">Features Total:</span>
                      <span className="font-bold text-blue-900">
                        {formatCurrency(
                          project.project_features.reduce((total, pf) => 
                            total + (pf.custom_price || pf.feature.price), 0
                          ), 'ETB'
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Project Notes */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Admin Notes:</Label>
                  {editingProject !== project.id && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => startEditingNotes(project.id, project.notes)}
                      className="h-auto p-1"
                    >
                      <Edit3 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
                
                {editingProject === project.id ? (
                  <div className="space-y-2">
                    <Textarea
                      value={editingNotes}
                      onChange={(e) => setEditingNotes(e.target.value)}
                      placeholder="Add notes about this project..."
                      className="min-h-[80px]"
                    />
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={() => updateProjectNotes(project.id, editingNotes)}
                        className="flex items-center"
                      >
                        <Save className="h-3 w-3 mr-1" />
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={cancelEditingNotes}
                        className="flex items-center"
                      >
                        <X className="h-3 w-3 mr-1" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md min-h-[60px]">
                    {project.notes || 'No notes added yet...'}
                  </div>
                )}
              </div>

              {/* Project Timeline */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t">
                <div className="text-sm">
                  <div className="flex items-center text-gray-500 mb-1">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span className="font-medium">Created</span>
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
          
          {projects.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <FolderOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">No projects found</p>
              <p className="text-sm">Projects will appear here once clients make payments</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectManagement;
