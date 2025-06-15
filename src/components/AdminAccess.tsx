
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Shield } from 'lucide-react';

const AdminAccess = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button
        onClick={() => navigate('/admin')}
        variant="outline"
        size="sm"
        className="bg-white/90 backdrop-blur-sm border-2 border-blue-200 hover:border-blue-400 shadow-lg"
      >
        <Shield className="h-4 w-4 mr-2" />
        Admin
      </Button>
    </div>
  );
};

export default AdminAccess;
