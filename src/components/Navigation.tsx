
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Code, LogOut, User, Settings, FolderOpen } from 'lucide-react';

const Navigation = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="bg-white/80 backdrop-blur-2xl border-b border-slate-200 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group select-none">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-2.5 rounded-xl shadow transition-transform duration-700 group-hover:rotate-[16deg] group-hover:scale-110">
              <Code className="h-7 w-7 text-white transition-transform duration-500 group-hover:animate-spin-slow" />
            </div>
            <span className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-slate-800 to-blue-600 bg-clip-text text-transparent tracking-tight">
              DevNM
            </span>
          </Link>

          {/* Navigation Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection('services')}
              className="text-slate-600 hover:text-blue-600 font-medium transition-colors"
            >
              Services
            </button>
            <button
              onClick={() => scrollToSection('why-choose-me')}
              className="text-slate-600 hover:text-blue-600 font-medium transition-colors"
            >
              Why Choose Me
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="text-slate-600 hover:text-blue-600 font-medium transition-colors"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection('pricing')}
              className="text-slate-600 hover:text-blue-600 font-medium transition-colors"
            >
              Pricing
            </button>
            <button
              onClick={() => scrollToSection('recent-works')}
              className="text-slate-600 hover:text-blue-600 font-medium transition-colors"
            >
              Portfolio
            </button>
            <button
              onClick={() => scrollToSection('faq')}
              className="text-slate-600 hover:text-blue-600 font-medium transition-colors"
            >
              FAQ
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="text-slate-600 hover:text-blue-600 font-medium transition-colors"
            >
              Contact
            </button>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Button 
                  variant="ghost" 
                  onClick={() => navigate('/dashboard')}
                  className="flex items-center text-slate-600 hover:text-blue-600 font-medium transition-colors rounded-xl"
                >
                  <User className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => navigate('/project-tracking')}
                  className="flex items-center text-slate-600 hover:text-blue-600 font-medium transition-colors rounded-xl"
                >
                  <FolderOpen className="mr-2 h-4 w-4" />
                  My Projects
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={handleSignOut}
                  className="flex items-center text-slate-600 hover:text-red-600 font-medium transition-colors rounded-xl"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </>
            ) : (
              <Button 
                onClick={() => navigate('/auth')}
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-medium shadow-lg"
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
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
    </nav>
  );
};

export default Navigation;
