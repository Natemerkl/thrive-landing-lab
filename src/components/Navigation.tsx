
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

  const navigationItems = [
    { label: 'Services', sectionId: 'services' },
    { label: 'Why Choose Me', sectionId: 'why-choose-me' },
    { label: 'Process', sectionId: 'how-it-works' },
    { label: 'Pricing', sectionId: 'pricing' },
    { label: 'Recent Works', sectionId: 'recent-works' },
    { label: 'FAQ', sectionId: 'faq' },
    { label: 'Contact', sectionId: 'contact' }
  ];

  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center space-x-3 group select-none cursor-pointer">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-2.5 rounded-xl shadow-md transition-all duration-300 group-hover:shadow-lg group-hover:scale-105">
              <Code className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-blue-600 bg-clip-text text-transparent">
              MERKL.DEV
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <button
                key={item.sectionId}
                onClick={() => scrollToSection(item.sectionId)}
                className="px-4 py-2 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50/80 font-medium transition-all duration-200 text-sm"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden lg:flex items-center space-x-4">
            {user ? (
              <Button
                onClick={() => window.location.href = '/dashboard'}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md font-semibold transition-all duration-200 hover:shadow-lg hover:scale-105"
              >
                Dashboard
              </Button>
            ) : (
              <Button
                onClick={() => window.location.href = '/auth'}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md font-semibold transition-all duration-200 hover:shadow-lg hover:scale-105"
              >
                Get Started
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="rounded-xl p-2 hover:bg-slate-100 transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden pb-4 border-t border-slate-200 mt-2 pt-4 bg-white/95 backdrop-blur-md rounded-b-2xl shadow-lg animate-fade-in">
            <div className="flex flex-col space-y-1">
              {navigationItems.map((item) => (
                <button
                  key={item.sectionId}
                  onClick={() => scrollToSection(item.sectionId)}
                  className="w-full text-left px-4 py-3 text-slate-600 hover:text-blue-600 hover:bg-blue-50/80 font-medium transition-all duration-200 rounded-lg"
                >
                  {item.label}
                </button>
              ))}
              
              <div className="pt-2 mt-2 border-t border-slate-200">
                {user ? (
                  <Button 
                    onClick={() => window.location.href = '/dashboard'}
                    className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md font-semibold transition-all duration-200"
                  >
                    Dashboard
                  </Button>
                ) : (
                  <Button 
                    onClick={() => window.location.href = '/auth'}
                    className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md font-semibold transition-all duration-200"
                  >
                    Get Started
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
