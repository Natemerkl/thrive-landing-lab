
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Code, LogOut, User, FolderOpen, Menu, X } from 'lucide-react';

const Navigation = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const navItems = [
    ['services', 'Services'],
    ['why-choose-me', 'Why us'],
    ['how-it-works', 'Process'],
    ['recent-works', 'Work'],
    ['faq', 'FAQ'],
  ] as const;

  return (
    <nav className="bg-[#f7fbf9]/95 backdrop-blur border-b border-emerald-950/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3.5">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group select-none">
            <div className="bg-gradient-to-r from-emerald-950 to-teal-700 p-2.5 rounded-xl shadow transition-transform duration-700 group-hover:rotate-[16deg] group-hover:scale-110">
              <Code className="h-7 w-7 text-white transition-transform duration-500 group-hover:animate-spin-slow" />
            </div>
            <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-emerald-950 to-teal-700 bg-clip-text text-transparent tracking-tight">
              DevNM
            </span>
          </Link>

          {/* Navigation Menu */}
          <div className="hidden lg:flex items-center gap-6">
            {navItems.map(([id, label]) => (
              <button key={id} onClick={() => scrollToSection(id)} className="mono-label text-slate-600 transition-colors hover:text-emerald-800 focus-visible:text-emerald-800">
                {label}
              </button>
            ))}
            <button onClick={() => scrollToSection('contact')} className="mono-label border-b border-emerald-700 pb-1 text-emerald-800 transition-colors hover:text-emerald-950">
              Contact
            </button>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-2">
            {user ? (
              <>
                <Button 
                  variant="ghost" 
                  onClick={() => navigate('/dashboard')}
                  className="hidden xl:flex items-center text-slate-600 hover:text-emerald-950 font-medium transition-colors rounded-md"
                >
                  <User className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => navigate('/project-tracking')}
                  className="hidden xl:flex items-center text-slate-600 hover:text-emerald-950 font-medium transition-colors rounded-md"
                >
                  <FolderOpen className="mr-2 h-4 w-4" />
                  My Projects
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={handleSignOut}
                  className="hidden xl:flex items-center text-slate-600 hover:text-red-600 font-medium transition-colors rounded-md"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </>
            ) : (
              <Button 
                onClick={() => navigate('/auth')}
                className="hidden sm:inline-flex bg-emerald-950 text-white px-5 py-2 rounded-md hover:bg-teal-800 transition-all duration-200 active:translate-y-px font-medium"
              >
                Sign In
              </Button>
            )}
            <Button variant="ghost" size="icon" className="lg:hidden text-emerald-950" onClick={() => setIsMenuOpen((open) => !open)} aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={isMenuOpen}>
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
        {isMenuOpen && (
          <div className="lg:hidden border-t border-emerald-950/10 py-4">
            <div className="grid gap-1">
              {navItems.map(([id, label]) => (
                <button key={id} onClick={() => scrollToSection(id)} className="min-h-11 px-3 text-left text-base font-medium text-slate-700 transition-colors hover:bg-emerald-50 hover:text-emerald-950">
                  {label}
                </button>
              ))}
              <button onClick={() => scrollToSection('contact')} className="mt-2 min-h-11 bg-emerald-950 px-3 text-left font-medium text-white transition-colors hover:bg-teal-800">
                Contact us
              </button>
              {!user && <button onClick={() => { navigate('/auth'); setIsMenuOpen(false); }} className="sm:hidden min-h-11 px-3 text-left font-medium text-emerald-950">Sign in</button>}
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
