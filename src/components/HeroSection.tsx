
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
    <section id="hero" className="min-h-screen flex items-center justify-center relative isolate overflow-hidden bg-slate-950 py-24">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950" />

      {/* Animated background pattern */}
      <div className="absolute inset-0 -z-0 opacity-20" aria-hidden="true">
        <div className="absolute top-10 left-10 w-32 h-32 bg-blue-500 rounded-full animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 bg-slate-500 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-blue-400 rounded-full animate-pulse delay-500"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-8">
          <div className="text-center lg:text-left">
            <h1 className={`text-5xl md:text-7xl font-bold text-white mb-6 transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              Design. Build. <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">Scale</span>
              <br />
              <span className="text-3xl md:text-5xl text-slate-200">Expert Web Development in Ethiopia</span>
            </h1>

            <p className={`text-xl md:text-2xl text-slate-200 mb-8 max-w-3xl mx-auto lg:mx-0 transition-all duration-1000 delay-300 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              Custom websites & full-stack solutions built with modern technology.
              Professional development services at Ethiopian-friendly prices.
            </p>

            <div className={`flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center transition-all duration-1000 delay-600 ${
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
                className="border-2 border-blue-300 text-blue-100 hover:bg-white hover:text-slate-900 px-8 py-4 text-lg rounded-lg font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center gap-2"
              >
                <Phone size={20} />
                Book Free Call
              </Button>
            </div>
          </div>

          <div className={`relative mx-auto h-[310px] w-full max-w-[580px] sm:h-[390px] transition-all duration-1000 delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`} aria-label="DevNM websites displayed across desktop, tablet, and phone">
            <div className="absolute inset-x-4 top-0 overflow-hidden rounded-xl border border-white/20 bg-slate-950 p-1 shadow-2xl shadow-blue-950/60 sm:inset-x-8">
              <div className="flex items-center gap-1.5 border-b border-white/10 px-3 py-2">
                <span className="h-2 w-2 rounded-full bg-red-400" />
                <span className="h-2 w-2 rounded-full bg-amber-300" />
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <span className="ml-3 h-3 flex-1 rounded-full bg-white/10" />
              </div>
              <img src="/lovable-uploads/8b51cefa-7b54-4688-895a-ea6c129ec461.png" alt="Desktop web application preview" className="aspect-[16/9] w-full object-cover object-top" />
            </div>

            <div className="absolute bottom-0 left-0 w-28 overflow-hidden rounded-xl border-4 border-slate-950 bg-slate-950 shadow-xl shadow-slate-950/60 sm:w-36">
              <div className="mx-auto mt-1 h-1.5 w-10 rounded-full bg-slate-700" />
              <img src="/lovable-uploads/03651402-ea4d-4e49-a02f-fdbebd1c1b32.png" alt="Mobile website preview" className="aspect-[9/16] w-full object-cover object-top" />
            </div>

            <div className="absolute bottom-2 right-0 w-40 overflow-hidden rounded-xl border-4 border-slate-950 bg-slate-950 shadow-xl shadow-slate-950/60 sm:w-52">
              <div className="mx-auto mt-1 h-1.5 w-10 rounded-full bg-slate-700" />
              <img src="/lovable-uploads/614430b8-d805-4d5f-aee8-10e0894937e5.png" alt="Tablet website preview" className="aspect-[4/3] w-full object-cover object-top" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
