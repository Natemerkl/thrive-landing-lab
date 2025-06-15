
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Mail, Phone, RefreshCw, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  project_type: string | null;
  budget_range: string | null;
  status: string;
  created_at: string;
}

const ContactMessagesTab: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('contact_inquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching messages:', error);
        toast({
          title: "Error",
          description: "Failed to fetch contact messages",
          variant: "destructive",
        });
        return;
      }

      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Error",
        description: "Failed to fetch contact messages",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateMessageStatus = async (messageId: string, newStatus: string) => {
    setUpdatingStatus(prev => new Set(prev).add(messageId));
    
    try {
      const { error } = await supabase
        .from('contact_inquiries')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', messageId);

      if (error) {
        console.error('Error updating message status:', error);
        toast({
          title: "Error",
          description: "Failed to update message status",
          variant: "destructive",
        });
        return;
      }

      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? { ...msg, status: newStatus } : msg
      ));

      toast({
        title: "Success",
        description: `Message marked as ${newStatus}`,
      });
    } catch (error) {
      console.error('Error updating message status:', error);
      toast({
        title: "Error",
        description: "Failed to update message status",
        variant: "destructive",
      });
    } finally {
      setUpdatingStatus(prev => {
        const newSet = new Set(prev);
        newSet.delete(messageId);
        return newSet;
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

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'new': return 'default';
      case 'in_progress': return 'secondary';
      case 'resolved': return 'outline';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageSquare className="mr-2 h-5 w-5" />
            Contact Messages
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin mr-2" />
            Loading messages...
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
            <MessageSquare className="mr-2 h-5 w-5" />
            Contact Messages
          </div>
          <Button onClick={fetchMessages} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </CardTitle>
        <CardDescription>
          Review and respond to customer inquiries. Total messages: {messages.length}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {messages.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No contact messages found
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Contact</TableHead>
                  <TableHead>Project Details</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {messages.map((message) => (
                  <TableRow key={message.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{message.name}</div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Mail className="h-3 w-3 mr-1" />
                          {message.email}
                        </div>
                        {message.phone && (
                          <div className="text-sm text-gray-500 flex items-center">
                            <Phone className="h-3 w-3 mr-1" />
                            {message.phone}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        {message.project_type && (
                          <div className="text-sm">
                            <span className="font-medium">Type:</span> {message.project_type}
                          </div>
                        )}
                        {message.budget_range && (
                          <div className="text-sm">
                            <span className="font-medium">Budget:</span> {message.budget_range}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div className="truncate" title={message.message}>
                        {message.message.length > 100 
                          ? `${message.message.substring(0, 100)}...` 
                          : message.message
                        }
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(message.status)}>
                        {message.status.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {formatDate(message.created_at)}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        {message.status === 'new' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateMessageStatus(message.id, 'in_progress')}
                            disabled={updatingStatus.has(message.id)}
                          >
                            {updatingStatus.has(message.id) ? (
                              <RefreshCw className="h-3 w-3 animate-spin" />
                            ) : (
                              <>
                                <Eye className="h-3 w-3 mr-1" />
                                Review
                              </>
                            )}
                          </Button>
                        )}
                        {message.status === 'in_progress' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateMessageStatus(message.id, 'resolved')}
                            disabled={updatingStatus.has(message.id)}
                          >
                            {updatingStatus.has(message.id) ? (
                              <RefreshCw className="h-3 w-3 animate-spin" />
                            ) : (
                              'Mark Resolved'
                            )}
                          </Button>
                        )}
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

export default ContactMessagesTab;
