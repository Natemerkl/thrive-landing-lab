
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
    <section id="hero" className="page-section min-h-[100dvh] flex items-center justify-center relative isolate overflow-hidden bg-emerald-950 py-20 md:py-24">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(120deg,#062b25,#0a4237_56%,#115247)]" />
      <div className="site-grid absolute inset-0 -z-0 opacity-30" aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-8">
          <div className="text-center lg:text-left">
            <p className={`mono-label mb-5 text-emerald-200 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
              DevNM / web systems and digital products
            </p>
            <h1 className={`max-w-3xl text-5xl leading-[0.98] md:text-7xl font-bold text-white mb-6 transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              Build digital products that <span className="text-emerald-200">feel engineered.</span>
            </h1>

            <p className={`text-xl md:text-2xl text-slate-200 mb-8 max-w-3xl mx-auto lg:mx-0 transition-all duration-1000 delay-300 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              We design and ship clear, fast websites and full-stack tools for organisations ready to work with precision.
            </p>

            <div className={`flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center transition-all duration-1000 delay-600 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              <Button
                onClick={() => scrollToSection('contact')}
                className="bg-gradient-to-r from-emerald-300 to-teal-400 text-slate-950 hover:from-emerald-200 hover:to-amber-300 px-8 py-4 text-lg rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-emerald-500/30 flex items-center gap-2"
              >
                <ArrowRight size={20} />
                Start a project
              </Button>

              <Button
                variant="outline"
                onClick={() => scrollToSection('contact')}
                className="border-2 border-emerald-200/70 bg-slate-950/20 px-8 py-4 text-lg font-semibold text-emerald-50 shadow-xl shadow-black/50 transition-all duration-300 hover:scale-105 hover:bg-emerald-50 hover:text-slate-950 hover:shadow-2xl focus-visible:ring-4 focus-visible:ring-emerald-200/70 flex items-center gap-2"
              >
                <Phone size={20} />
                Book a call
              </Button>
            </div>
          </div>

          <div className={`hero-device-showcase relative mx-auto h-[310px] w-full max-w-[580px] sm:h-[390px] transition-all duration-1000 delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`} aria-label="DevNM websites displayed across desktop, tablet, and phone">
            <div className="absolute inset-x-4 top-0 overflow-hidden rounded-md border border-emerald-100/25 bg-slate-950 p-1 shadow-2xl shadow-emerald-950/60 sm:inset-x-8">
              <div className="flex items-center gap-1.5 border-b border-white/10 px-3 py-2">
                <span className="h-2 w-2 rounded-full bg-red-400" />
                <span className="h-2 w-2 rounded-full bg-amber-300" />
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <span className="ml-3 h-3 flex-1 rounded-full bg-white/10" />
              </div>
              <img src="/lovable-uploads/8b51cefa-7b54-4688-895a-ea6c129ec461.png" alt="DevNM desktop web application preview" className="aspect-[16/9] w-full object-cover object-top" />
            </div>

            <div className="absolute bottom-0 left-0 w-28 overflow-hidden rounded-md border-4 border-slate-950 bg-slate-950 shadow-xl shadow-slate-950/60 sm:w-36">
              <div className="mx-auto mt-1 h-1.5 w-10 rounded-full bg-slate-700" />
              <img src="/lovable-uploads/03651402-ea4d-4e49-a02f-fdbebd1c1b32.png" alt="Mobile website preview" className="aspect-[9/16] w-full object-cover object-top" />
            </div>

            <div className="absolute bottom-2 right-0 w-40 overflow-hidden rounded-md border-4 border-slate-950 bg-slate-950 shadow-xl shadow-slate-950/60 sm:w-52">
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
