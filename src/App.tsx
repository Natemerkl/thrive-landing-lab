
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import Index from '@/pages/Index';
import AuthPage from '@/pages/AuthPage';
import DashboardPage from '@/pages/DashboardPage';
import ProjectChoicePage from '@/pages/ProjectChoicePage';
import PaymentPage from '@/pages/PaymentPage';
import PaymentVerificationPage from '@/pages/PaymentVerificationPage';
import ProjectTrackingPage from '@/pages/ProjectTrackingPage';
import AdminDashboard from '@/pages/AdminDashboard';
import AdminManagementPage from '@/pages/AdminManagementPage';
import NotFound from '@/pages/NotFound';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/choose-project" element={<ProjectChoicePage />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/payment-verification" element={<PaymentVerificationPage />} />
            <Route path="/project-tracking" element={<ProjectTrackingPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/management" element={<AdminManagementPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
