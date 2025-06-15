
import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { ArrowRight, Phone } from 'lucide-react';

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 relative overflow-hidden">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-blue-500 rounded-full animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 bg-slate-500 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-blue-400 rounded-full animate-pulse delay-500"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center relative z-10">
        <h1 className={`text-5xl md:text-7xl font-bold text-slate-800 mb-6 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          Design. Build. <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">Scale</span>
          <br />
          <span className="text-3xl md:text-5xl text-slate-600">Expert Web Development in Ethiopia</span>
        </h1>
        
        <p className={`text-xl md:text-2xl text-slate-600 mb-8 max-w-3xl mx-auto transition-all duration-1000 delay-300 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          Custom websites & full-stack solutions built with modern technology. 
          Professional development services at Ethiopian-friendly prices.
        </p>

        <div className={`flex flex-col sm:flex-row gap-4 justify-center items-center transition-all duration-1000 delay-600 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <Button 
            onClick={() => scrollToSection('services')}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 text-lg rounded-lg font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center gap-2"
          >
            <ArrowRight size={20} />
            Start Your Project
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => scrollToSection('contact')}
            className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-4 text-lg rounded-lg font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center gap-2"
          >
            <Phone size={20} />
            Book Free Call
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
