
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut, ArrowLeft } from 'lucide-react';

interface AdminHeaderProps {
  userEmail?: string;
  onSignOut: () => Promise<void>;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ userEmail, onSignOut }) => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center mb-8">
      <div className="flex items-center gap-4">
        <Button onClick={() => navigate('/dashboard')} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-red-900">
            Admin Dashboard
          </h1>
          <p className="text-red-700">
            {userEmail} • Administrator Access
          </p>
        </div>
      </div>
      <Button onClick={onSignOut} variant="outline">
        <LogOut className="mr-2 h-4 w-4" />
        Sign Out
      </Button>
    </div>
  );
};

export default AdminHeader;
