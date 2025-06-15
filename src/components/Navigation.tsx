
import { useState, useEffect } from 'react';
import { Button } from './ui/button';

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-lg' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="font-bold text-xl text-slate-800">
            MERKL.DEV
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection('hero')}
              className="text-slate-600 hover:text-slate-900 transition-colors"
            >
              Home
            </button>
            <button 
              onClick={() => scrollToSection('services')}
              className="text-slate-600 hover:text-slate-900 transition-colors"
            >
              Services
            </button>
            <button 
              onClick={() => scrollToSection('testimonials')}
              className="text-slate-600 hover:text-slate-900 transition-colors"
            >
              Portfolio
            </button>
            <button 
              onClick={() => scrollToSection('about')}
              className="text-slate-600 hover:text-slate-900 transition-colors"
            >
              About
            </button>
            <button 
              onClick={() => scrollToSection('contact')}
              className="text-slate-600 hover:text-slate-900 transition-colors"
            >
              Contact
            </button>
          </div>

          <Button 
            onClick={() => scrollToSection('contact')}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
          >
            Book a Call
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
