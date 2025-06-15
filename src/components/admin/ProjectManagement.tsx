
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { FolderOpen, Calendar, User, DollarSign, RefreshCw, Plus, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface Project {
  id: string;
  user_id: string;
  payment_id: string | null;
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
    payer_email: string;
    plan_id: string;
  };
}

interface Payment {
  id: string;
  amount: number;
  payer_email: string;
  plan_id: string;
  user_id: string;
}

const ProjectManagement: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState<Set<string>>(new Set());
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    payment_id: '',
    notes: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchProjects();
    fetchPayments();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      console.log('Fetching projects...');
      
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          payment:payments(amount, payer_email, plan_id)
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

      console.log('Projects fetched:', data);
      setProjects(data || []);
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

  const fetchPayments = async () => {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select('id, amount, payer_email, plan_id, user_id')
        .eq('status', 'verified')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching payments:', error);
        return;
      }

      setPayments(data || []);
    } catch (error) {
      console.error('Error fetching payments:', error);
    }
  };

  const updateProjectStatus = async (projectId: string, newStatus: string) => {
    setUpdatingStatus(prev => new Set(prev).add(projectId));
    
    try {
      const updateData: any = {
        status: newStatus,
        updated_at: new Date().toISOString()
      };

      if (newStatus === 'started' && !projects.find(p => p.id === projectId)?.start_date) {
        updateData.start_date = new Date().toISOString();
      }
      
      if (newStatus === 'completed') {
        updateData.completion_date = new Date().toISOString();
      }

      const { error } = await supabase
        .from('projects')
        .update(updateData)
        .eq('id', projectId);

      if (error) {
        console.error('Error updating project status:', error);
        toast({
          title: "Error",
          description: "Failed to update project status",
          variant: "destructive",
        });
        return;
      }

      setProjects(prev => prev.map(project => 
        project.id === projectId 
          ? { ...project, ...updateData }
          : project
      ));

      toast({
        title: "Success",
        description: `Project status updated to ${newStatus}`,
      });
    } catch (error) {
      console.error('Error updating project status:', error);
      toast({
        title: "Error",
        description: "Failed to update project status",
        variant: "destructive",
      });
    } finally {
      setUpdatingStatus(prev => {
        const newSet = new Set(prev);
        newSet.delete(projectId);
        return newSet;
      });
    }
  };

  const createProject = async () => {
    try {
      if (!newProject.title || !newProject.payment_id) {
        toast({
          title: "Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        return;
      }

      const selectedPayment = payments.find(p => p.id === newProject.payment_id);
      if (!selectedPayment) {
        toast({
          title: "Error",
          description: "Invalid payment selected",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('projects')
        .insert({
          title: newProject.title,
          description: newProject.description,
          payment_id: newProject.payment_id,
          user_id: selectedPayment.user_id,
          notes: newProject.notes,
          status: 'pending'
        });

      if (error) {
        console.error('Error creating project:', error);
        toast({
          title: "Error",
          description: "Failed to create project",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Project created successfully",
      });

      setCreateDialogOpen(false);
      setNewProject({ title: '', description: '', payment_id: '', notes: '' });
      fetchProjects();
    } catch (error) {
      console.error('Error creating project:', error);
      toast({
        title: "Error",
        description: "Failed to create project",
        variant: "destructive",
      });
    }
  };

  const updateProject = async () => {
    if (!selectedProject) return;

    try {
      const { error } = await supabase
        .from('projects')
        .update({
          title: selectedProject.title,
          description: selectedProject.description,
          notes: selectedProject.notes,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedProject.id);

      if (error) {
        console.error('Error updating project:', error);
        toast({
          title: "Error",
          description: "Failed to update project",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Project updated successfully",
      });

      setEditDialogOpen(false);
      setSelectedProject(null);
      fetchProjects();
    } catch (error) {
      console.error('Error updating project:', error);
      toast({
        title: "Error",
        description: "Failed to update project",
        variant: "destructive",
      });
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ET', {
      style: 'currency',
      currency: 'ETB',
      minimumFractionDigits: 0,
    }).format(amount);
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

  const availablePayments = payments.filter(payment => 
    !projects.some(project => project.payment_id === payment.id)
  );

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
            Project Management
          </div>
          <div className="flex space-x-2">
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Project
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Project</DialogTitle>
                  <DialogDescription>
                    Create a project from a verified payment
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Project Title</label>
                    <Input
                      value={newProject.title}
                      onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                      placeholder="Enter project title"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Payment</label>
                    <Select value={newProject.payment_id} onValueChange={(value) => setNewProject({...newProject, payment_id: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a payment" />
                      </SelectTrigger>
                      <SelectContent>
                        {availablePayments.map((payment) => (
                          <SelectItem key={payment.id} value={payment.id}>
                            {payment.payer_email} - {formatCurrency(payment.amount)} ({payment.plan_id})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Description</label>
                    <Textarea
                      value={newProject.description}
                      onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                      placeholder="Project description"
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Notes</label>
                    <Textarea
                      value={newProject.notes}
                      onChange={(e) => setNewProject({...newProject, notes: e.target.value})}
                      placeholder="Internal notes"
                      rows={2}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={createProject}>Create Project</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button onClick={fetchProjects} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardTitle>
        <CardDescription>
          Manage project status and track progress. Total projects: {projects.length}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {projects.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No projects found. Create a project from verified payments.
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project Details</TableHead>
                  <TableHead>Client & Payment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Timeline</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{project.title}</div>
                        {project.description && (
                          <div className="text-sm text-gray-500 max-w-xs truncate">
                            {project.description}
                          </div>
                        )}
                        {project.notes && (
                          <div className="text-xs text-blue-600 mt-1">
                            Notes: {project.notes}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        {project.payment && (
                          <>
                            <div className="text-sm font-medium">{project.payment.payer_email}</div>
                            <div className="text-sm text-gray-500">
                              {formatCurrency(project.payment.amount)} - {project.payment.plan_id}
                            </div>
                          </>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(project.status)}>
                        {project.status.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>Created: {formatDate(project.created_at)}</div>
                        {project.start_date && (
                          <div>Started: {formatDate(project.start_date)}</div>
                        )}
                        {project.completion_date && (
                          <div>Completed: {formatDate(project.completion_date)}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Select
                          value={project.status}
                          onValueChange={(newStatus) => updateProjectStatus(project.id, newStatus)}
                          disabled={updatingStatus.has(project.id)}
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
                        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedProject(project)}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit Project</DialogTitle>
                            </DialogHeader>
                            {selectedProject && (
                              <div className="space-y-4">
                                <div>
                                  <label className="text-sm font-medium">Project Title</label>
                                  <Input
                                    value={selectedProject.title}
                                    onChange={(e) => setSelectedProject({...selectedProject, title: e.target.value})}
                                  />
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Description</label>
                                  <Textarea
                                    value={selectedProject.description || ''}
                                    onChange={(e) => setSelectedProject({...selectedProject, description: e.target.value})}
                                    rows={3}
                                  />
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Notes</label>
                                  <Textarea
                                    value={selectedProject.notes || ''}
                                    onChange={(e) => setSelectedProject({...selectedProject, notes: e.target.value})}
                                    rows={2}
                                  />
                                </div>
                              </div>
                            )}
                            <DialogFooter>
                              <Button onClick={updateProject}>Update Project</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectManagement;
