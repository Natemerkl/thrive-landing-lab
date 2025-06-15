
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
    <nav className="bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-2 rounded-lg">
              <Code className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
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
              onClick={() => scrollToSection('why-choose-me')}
              className="text-slate-700 hover:text-blue-600 font-medium transition-colors"
            >
              Why Choose Me
            </button>
            <button 
              onClick={() => scrollToSection('how-it-works')}
              className="text-slate-700 hover:text-blue-600 font-medium transition-colors"
            >
              Process
            </button>
            <button 
              onClick={() => scrollToSection('pricing')}
              className="text-slate-700 hover:text-blue-600 font-medium transition-colors"
            >
              Pricing
            </button>
            <button 
              onClick={() => scrollToSection('testimonials')}
              className="text-slate-700 hover:text-blue-600 font-medium transition-colors"
            >
              Testimonials
            </button>
            <button 
              onClick={() => scrollToSection('contact')}
              className="text-slate-700 hover:text-blue-600 font-medium transition-colors"
            >
              Contact
            </button>
            
            {user ? (
              <Button 
                onClick={() => window.location.href = '/dashboard'}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
              >
                Dashboard
              </Button>
            ) : (
              <Button 
                onClick={() => window.location.href = '/auth'}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
              >
                Get Started
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 border-t border-slate-200 mt-4 pt-4">
            <div className="flex flex-col space-y-3">
              <button 
                onClick={() => scrollToSection('services')}
                className="text-slate-700 hover:text-blue-600 font-medium transition-colors text-left"
              >
                Services
              </button>
              <button 
                onClick={() => scrollToSection('why-choose-me')}
                className="text-slate-700 hover:text-blue-600 font-medium transition-colors text-left"
              >
                Why Choose Me
              </button>
              <button 
                onClick={() => scrollToSection('how-it-works')}
                className="text-slate-700 hover:text-blue-600 font-medium transition-colors text-left"
              >
                Process
              </button>
              <button 
                onClick={() => scrollToSection('pricing')}
                className="text-slate-700 hover:text-blue-600 font-medium transition-colors text-left"
              >
                Pricing
              </button>
              <button 
                onClick={() => scrollToSection('testimonials')}
                className="text-slate-700 hover:text-blue-600 font-medium transition-colors text-left"
              >
                Testimonials
              </button>
              <button 
                onClick={() => scrollToSection('contact')}
                className="text-slate-700 hover:text-blue-600 font-medium transition-colors text-left"
              >
                Contact
              </button>
              
              {user ? (
                <Button 
                  onClick={() => window.location.href = '/dashboard'}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white w-full"
                >
                  Dashboard
                </Button>
              ) : (
                <Button 
                  onClick={() => window.location.href = '/auth'}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white w-full"
                >
                  Get Started
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
