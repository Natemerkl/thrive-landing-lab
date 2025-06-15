
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
          <div className="font-bold text-xl text-slate-800 relative">
            <span className="merkl-logo">
              M<span className="letter">E</span><span className="letter">R</span><span className="letter">K</span><span className="letter">L</span><span className="dot">.</span><span className="letter">D</span><span className="letter">E</span><span className="letter">V</span>
            </span>
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

      <style>{`
        @keyframes bounce-dot {
          0% { transform: translateY(0); }
          10% { transform: translateY(-8px); }
          20% { transform: translateY(0); }
          30% { transform: translateY(-8px); }
          40% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
          60% { transform: translateY(0); }
          70% { transform: translateY(-8px); }
          80% { transform: translateY(0); }
          90% { transform: translateY(-8px); }
          100% { transform: translateY(0); }
        }

        @keyframes letter-glow {
          0%, 100% { color: #334155; }
          50% { color: #3b82f6; }
        }

        .merkl-logo {
          display: inline-block;
          cursor: pointer;
        }

        .merkl-logo:hover .dot {
          animation: bounce-dot 2s ease-in-out;
        }

        .merkl-logo:hover .letter:nth-child(1) {
          animation: letter-glow 2s ease-in-out 0s;
        }

        .merkl-logo:hover .letter:nth-child(2) {
          animation: letter-glow 2s ease-in-out 0.2s;
        }

        .merkl-logo:hover .letter:nth-child(3) {
          animation: letter-glow 2s ease-in-out 0.4s;
        }

        .merkl-logo:hover .letter:nth-child(4) {
          animation: letter-glow 2s ease-in-out 0.6s;
        }

        .merkl-logo:hover .letter:nth-child(6) {
          animation: letter-glow 2s ease-in-out 1.2s;
        }

        .merkl-logo:hover .letter:nth-child(7) {
          animation: letter-glow 2s ease-in-out 1.4s;
        }

        .merkl-logo:hover .letter:nth-child(8) {
          animation: letter-glow 2s ease-in-out 1.6s;
        }

        .dot {
          display: inline-block;
          color: #3b82f6;
          font-weight: bold;
        }

        .letter {
          display: inline-block;
          transition: color 0.3s ease;
        }
      `}</style>
    </nav>
  );
};

export default Navigation;
