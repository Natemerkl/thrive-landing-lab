
import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Menu, X, Code, LogOut, User, FolderOpen } from 'lucide-react';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, signOut, userRole } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-xl shadow-lg border-b border-slate-200' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group select-none"
            onClick={() => navigate('/')}
          >
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-2.5 rounded-xl shadow-lg transition-transform duration-700 group-hover:rotate-[16deg] group-hover:scale-110">
              <Code className="h-7 w-7 text-white transition-transform duration-500 group-hover:animate-spin-slow" />
            </div>
            <span className="text-2xl font-extrabold bg-gradient-to-r from-slate-800 to-blue-600 bg-clip-text text-transparent tracking-tight">
              MERKL.DEV
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection('services')}
              className="text-slate-700 hover:text-blue-600 font-medium transition-colors"
            >
              Services
            </button>
            <button
              onClick={() => scrollToSection('work')}
              className="text-slate-700 hover:text-blue-600 font-medium transition-colors"
            >
              Work
            </button>
            <button
              onClick={() => scrollToSection('pricing')}
              className="text-slate-700 hover:text-blue-600 font-medium transition-colors"
            >
              Pricing
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="text-slate-700 hover:text-blue-600 font-medium transition-colors"
            >
              Contact
            </button>

            {/* User Authentication */}
            {user ? (
              <div className="flex items-center space-x-4">
                {user && (
                  <Button
                    onClick={() => navigate('/project-tracking')}
                    variant="outline"
                    size="sm"
                    className="flex items-center rounded-xl border-blue-200 text-blue-700 hover:bg-blue-50"
                  >
                    <FolderOpen className="h-4 w-4 mr-2" />
                    Projects
                  </Button>
                )}
                {userRole === 'admin' && (
                  <Button
                    onClick={() => navigate('/admin')}
                    variant="outline"
                    size="sm"
                    className="flex items-center rounded-xl"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Admin
                  </Button>
                )}
                <Button
                  onClick={handleSignOut}
                  variant="outline"
                  size="sm"
                  className="flex items-center rounded-xl"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Button
                  onClick={() => navigate('/auth')}
                  variant="outline"
                  className="rounded-xl"
                >
                  Sign In
                </Button>
                <Button
                  onClick={() => navigate('/choose-project')}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-2 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Start Project
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-slate-700"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-slate-200 py-4">
            <div className="flex flex-col space-y-4">
              <button
                onClick={() => scrollToSection('services')}
                className="text-left text-slate-700 hover:text-blue-600 font-medium transition-colors"
              >
                Services
              </button>
              <button
                onClick={() => scrollToSection('work')}
                className="text-left text-slate-700 hover:text-blue-600 font-medium transition-colors"
              >
                Work
              </button>
              <button
                onClick={() => scrollToSection('pricing')}
                className="text-left text-slate-700 hover:text-blue-600 font-medium transition-colors"
              >
                Pricing
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="text-left text-slate-700 hover:text-blue-600 font-medium transition-colors"
              >
                Contact
              </button>

              {user ? (
                <div className="flex flex-col space-y-3 pt-4 border-t border-slate-200">
                  <Button
                    onClick={() => {
                      navigate('/project-tracking');
                      setIsMenuOpen(false);
                    }}
                    variant="outline"
                    size="sm"
                    className="flex items-center justify-start rounded-xl"
                  >
                    <FolderOpen className="h-4 w-4 mr-2" />
                    Projects
                  </Button>
                  {userRole === 'admin' && (
                    <Button
                      onClick={() => {
                        navigate('/admin');
                        setIsMenuOpen(false);
                      }}
                      variant="outline"
                      size="sm"
                      className="flex items-center justify-start rounded-xl"
                    >
                      <User className="h-4 w-4 mr-2" />
                      Admin
                    </Button>
                  )}
                  <Button
                    onClick={handleSignOut}
                    variant="outline"
                    size="sm"
                    className="flex items-center justify-start rounded-xl"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col space-y-3 pt-4 border-t border-slate-200">
                  <Button
                    onClick={() => {
                      navigate('/auth');
                      setIsMenuOpen(false);
                    }}
                    variant="outline"
                    className="rounded-xl"
                  >
                    Sign In
                  </Button>
                  <Button
                    onClick={() => {
                      navigate('/choose-project');
                      setIsMenuOpen(false);
                    }}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl"
                  >
                    Start Project
                  </Button>
                </div>
              )}
            </div>
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
    </nav>
  );
};

export default Navigation;
