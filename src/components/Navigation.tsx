
import { useState } from 'react';
import { Button } from './ui/button';
import { Menu, X, Code } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  return (
    <nav className="bg-white/80 backdrop-blur-2xl border-b border-slate-200 sticky top-0 z-50 shadow-lg">
      {/* Curved top bar with modern, rounded lower corners */}
      <div className="relative max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="absolute left-0 right-0 bottom-0 h-4 rounded-b-3xl bg-white/80 pointer-events-none -z-10" />
        <div className="flex justify-between items-center py-3 md:py-5">
          {/* Logo */}
          <div className="flex items-center space-x-3 group select-none cursor-pointer">
            <div
              className="bg-gradient-to-r from-blue-600 to-blue-700 p-2.5 rounded-xl shadow transition-transform duration-700 group-hover:rotate-[16deg] group-hover:scale-110 animate-logo-pop"
              style={{ willChange: 'transform' }}
            >
              <Code className="h-7 w-7 text-white transition-transform duration-500 group-hover:animate-spin-slow" />
            </div>
            <span className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-slate-800 to-blue-600 bg-clip-text text-transparent tracking-tight transition-all duration-700">
              MERKL.DEV
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-3 xl:space-x-6">
            <button 
              onClick={() => scrollToSection('services')}
              className="px-3 py-2 rounded-lg text-slate-700 hover:text-blue-600 font-medium transition-colors"
            >
              Services
            </button>
            <button 
              onClick={() => scrollToSection('why-choose-me')}
              className="px-3 py-2 rounded-lg text-slate-700 hover:text-blue-600 font-medium transition-colors"
            >
              Why Choose Me
            </button>
            <button 
              onClick={() => scrollToSection('how-it-works')}
              className="px-3 py-2 rounded-lg text-slate-700 hover:text-blue-600 font-medium transition-colors"
            >
              Process
            </button>
            <button 
              onClick={() => scrollToSection('pricing')}
              className="px-3 py-2 rounded-lg text-slate-700 hover:text-blue-600 font-medium transition-colors"
            >
              Pricing
            </button>
            <button 
              onClick={() => scrollToSection('testimonials')}
              className="px-3 py-2 rounded-lg text-slate-700 hover:text-blue-600 font-medium transition-colors"
            >
              Testimonials
            </button>
            <button 
              onClick={() => scrollToSection('contact')}
              className="px-3 py-2 rounded-lg text-slate-700 hover:text-blue-600 font-medium transition-colors"
            >
              Contact
            </button>
            
            {user ? (
              <Button
                onClick={() => window.location.href = '/dashboard'}
                className="ml-4 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md font-bold transition-transform active:scale-95"
              >
                Dashboard
              </Button>
            ) : (
              <Button
                onClick={() => window.location.href = '/auth'}
                className="ml-4 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md font-bold transition-transform active:scale-95"
              >
                Get Started
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="rounded-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              {isOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 border-t border-slate-200 mt-3 pt-3 rounded-b-3xl bg-white/95 shadow-md animate-fade-in">
            <div className="flex flex-col space-y-2">
              <button 
                onClick={() => scrollToSection('services')}
                className="w-full rounded-lg text-left px-4 py-3 text-slate-700 hover:bg-blue-50 hover:text-blue-600 font-medium transition-all"
              >
                Services
              </button>
              <button 
                onClick={() => scrollToSection('why-choose-me')}
                className="w-full rounded-lg text-left px-4 py-3 text-slate-700 hover:bg-blue-50 hover:text-blue-600 font-medium transition-all"
              >
                Why Choose Me
              </button>
              <button 
                onClick={() => scrollToSection('how-it-works')}
                className="w-full rounded-lg text-left px-4 py-3 text-slate-700 hover:bg-blue-50 hover:text-blue-600 font-medium transition-all"
              >
                Process
              </button>
              <button 
                onClick={() => scrollToSection('pricing')}
                className="w-full rounded-lg text-left px-4 py-3 text-slate-700 hover:bg-blue-50 hover:text-blue-600 font-medium transition-all"
              >
                Pricing
              </button>
              <button 
                onClick={() => scrollToSection('testimonials')}
                className="w-full rounded-lg text-left px-4 py-3 text-slate-700 hover:bg-blue-50 hover:text-blue-600 font-medium transition-all"
              >
                Testimonials
              </button>
              <button 
                onClick={() => scrollToSection('contact')}
                className="w-full rounded-lg text-left px-4 py-3 text-slate-700 hover:bg-blue-50 hover:text-blue-600 font-medium transition-all"
              >
                Contact
              </button>
              
              {user ? (
                <Button 
                  onClick={() => window.location.href = '/dashboard'}
                  className="w-full mt-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md font-bold transition-transform active:scale-95"
                >
                  Dashboard
                </Button>
              ) : (
                <Button 
                  onClick={() => window.location.href = '/auth'}
                  className="w-full mt-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md font-bold transition-transform active:scale-95"
                >
                  Get Started
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
      {/* Logo keyframe style for pop animation + spin (inject directly, or move to CSS if preferred) */}
      <style>
        {`
          @keyframes logo-pop {
            0% { transform: scale(0.8) rotate(-10deg); opacity: 0; }
            60% { transform: scale(1.1) rotate(8deg); opacity: 1;}
            100% { transform: scale(1) rotate(0deg); opacity: 1;}
          }
          .animate-logo-pop { 
            animation: logo-pop 1.3s cubic-bezier(.24,1.31,.6,.99) 0s 1 both;
          }
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

