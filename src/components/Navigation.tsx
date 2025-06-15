
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleAuthAction = async () => {
    if (user) {
      await signOut();
      navigate('/');
    } else {
      navigate('/auth');
    }
  };

  const handleDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-blue-600">WebCraft</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/#services" className="text-gray-700 hover:text-blue-600 transition-colors">
              Services
            </Link>
            <Link to="/#how-it-works" className="text-gray-700 hover:text-blue-600 transition-colors">
              How It Works
            </Link>
            <Link to="/#pricing" className="text-gray-700 hover:text-blue-600 transition-colors">
              Pricing
            </Link>
            <Link to="/#testimonials" className="text-gray-700 hover:text-blue-600 transition-colors">
              Testimonials
            </Link>
            
            {/* Authentication Buttons */}
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <Button onClick={handleDashboard} variant="outline" size="sm">
                    <User className="mr-2 h-4 w-4" />
                    Dashboard
                  </Button>
                  <Button onClick={handleAuthAction} variant="outline" size="sm">
                    Sign Out
                  </Button>
                </>
              ) : (
                <Button onClick={handleAuthAction} variant="outline" size="sm">
                  <User className="mr-2 h-4 w-4" />
                  Sign In
                </Button>
              )}
              <Button asChild>
                <Link to="/choose-project">Get Started</Link>
              </Button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-blue-600 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg">
            <Link
              to="/#services"
              className="block px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Services
            </Link>
            <Link
              to="/#how-it-works"
              className="block px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              How It Works
            </Link>
            <Link
              to="/#pricing"
              className="block px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Pricing
            </Link>
            <Link
              to="/#testimonials"
              className="block px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Testimonials
            </Link>
            
            <div className="border-t pt-3 mt-3 space-y-2">
              {user ? (
                <>
                  <Button 
                    onClick={() => { handleDashboard(); setIsOpen(false); }} 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start"
                  >
                    <User className="mr-2 h-4 w-4" />
                    Dashboard
                  </Button>
                  <Button 
                    onClick={() => { handleAuthAction(); setIsOpen(false); }} 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start"
                  >
                    Sign Out
                  </Button>
                </>
              ) : (
                <Button 
                  onClick={() => { handleAuthAction(); setIsOpen(false); }} 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start"
                >
                  <User className="mr-2 h-4 w-4" />
                  Sign In
                </Button>
              )}
              <Button asChild className="w-full">
                <Link to="/choose-project" onClick={() => setIsOpen(false)}>
                  Get Started
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
