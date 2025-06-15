
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Eye, Mail, Phone, DollarSign, Briefcase, Calendar } from 'lucide-react';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  phone: string | null;
  project_type: string | null;
  budget_range: string | null;
  status: string;
  created_at: string;
}

interface ContactMessageCardProps {
  message: ContactMessage;
  onStatusUpdate: (id: string, status: string) => void;
}

const ContactMessageCard: React.FC<ContactMessageCardProps> = ({ message, onStatusUpdate }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-purple-100 text-purple-800';
      case 'in_progress': return 'bg-orange-100 text-orange-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getNextStatus = (currentStatus: string) => {
    switch (currentStatus) {
      case 'new': return 'contacted';
      case 'contacted': return 'in_progress';
      case 'in_progress': return 'completed';
      default: return null;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'new': return 'Mark as Contacted';
      case 'contacted': return 'Mark In Progress';
      case 'in_progress': return 'Mark Completed';
      default: return null;
    }
  };

  const nextStatus = getNextStatus(message.status);
  const statusLabel = getStatusLabel(message.status);

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">{message.name}</CardTitle>
          <Badge className={getStatusColor(message.status)}>
            {message.status.replace('_', ' ')}
          </Badge>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="h-4 w-4 mr-1" />
          {formatDate(message.created_at)}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div className="flex items-center">
            <Mail className="h-4 w-4 mr-2 text-blue-500" />
            <span className="font-medium">{message.email}</span>
          </div>
          
          {message.phone && (
            <div className="flex items-center">
              <Phone className="h-4 w-4 mr-2 text-green-500" />
              <span>{message.phone}</span>
            </div>
          )}
          
          {message.project_type && (
            <div className="flex items-center">
              <Briefcase className="h-4 w-4 mr-2 text-purple-500" />
              <span className="capitalize">{message.project_type.replace('-', ' ')}</span>
            </div>
          )}
          
          {message.budget_range && (
            <div className="flex items-center">
              <DollarSign className="h-4 w-4 mr-2 text-green-500" />
              <span>{message.budget_range} ETB</span>
            </div>
          )}
        </div>
        
        <div className="bg-gray-50 p-3 rounded-md">
          <p className="text-sm text-gray-700 line-clamp-3">
            {message.message}
          </p>
        </div>
        
        <div className="flex items-center gap-2 pt-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center">
                <Eye className="h-4 w-4 mr-1" />
                View Details
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Message from {message.name}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <strong>Name:</strong> {message.name}
                  </div>
                  <div>
                    <strong>Email:</strong> {message.email}
                  </div>
                  <div>
                    <strong>Phone:</strong> {message.phone || 'N/A'}
                  </div>
                  <div>
                    <strong>Project Type:</strong> {message.project_type ? message.project_type.replace('-', ' ') : 'N/A'}
                  </div>
                  <div>
                    <strong>Budget Range:</strong> {message.budget_range || 'N/A'}
                  </div>
                  <div>
                    <strong>Date:</strong> {formatDate(message.created_at)}
                  </div>
                </div>
                <div>
                  <strong>Message:</strong>
                  <p className="mt-2 p-3 bg-gray-50 rounded whitespace-pre-wrap">{message.message}</p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          {nextStatus && statusLabel && (
            <Button
              size="sm"
              onClick={() => onStatusUpdate(message.id, nextStatus)}
              className={`${
                nextStatus === 'completed' 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {statusLabel}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactMessageCard;
