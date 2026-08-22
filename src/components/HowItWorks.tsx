
import { useEffect, useState, useRef } from 'react';
import { Target, Wrench, Rocket, Code } from 'lucide-react';

const HowItWorks = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const steps = [
    {
      number: 1,
      title: 'Choose Your Features',
      description: 'Pick from our feature library or select a pre-built package. Customize exactly what you need for your project.',
      icon: Target,
      color: 'text-stone-800'
    },
    {
      number: 2,
      title: 'Secure Payment & Build',
      description: 'Complete secure payment and I immediately start building your custom solution with regular progress updates.',
      icon: Wrench,
      color: 'text-stone-900'
    },
    {
      number: 3,
      title: 'Launch & Support',
      description: 'Receive your completed project with documentation, SEO optimization, and dedicated support period.',
      icon: Rocket,
      color: 'text-stone-600'
    }
  ];

  return (
    <section ref={sectionRef} id="how-it-works" className="py-20 bg-[#f8faf7]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Logo Section */}
        <div className="text-center mb-12">
          <div className={`flex items-center justify-center space-x-3 group select-none mb-8 transition-all duration-800 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div
              className="bg-gradient-to-r from-emerald-950 to-teal-700 p-3 rounded-xl shadow-lg transition-transform duration-700 group-hover:rotate-[16deg] group-hover:scale-110 animate-logo-pop"
              style={{ willChange: 'transform' }}
            >
              <Code className="h-8 w-8 text-white transition-transform duration-500 group-hover:animate-spin-slow" />
            </div>
            <span className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-stone-950 to-stone-600 bg-clip-text text-transparent tracking-tight">
              DevNM
            </span>
          </div>
        </div>

        <div className="text-center mb-16">
          <h2 className={`text-4xl md:text-5xl font-bold text-slate-800 mb-6 transition-all duration-800 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            How It Works
          </h2>
          <p className={`text-xl text-slate-600 max-w-3xl mx-auto transition-all duration-800 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            A simple, transparent process from feature selection to launch.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className={`text-center transition-all duration-800 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${(index + 1) * 300}ms` }}
            >
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-gradient-to-r from-emerald-950 to-teal-700 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 shadow-lg">
                  {step.number}
                </div>
                <div className={`w-12 h-12 mx-auto ${step.color}`}>
                  <step.icon size={48} strokeWidth={1.5} />
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-slate-800 mb-4">{step.title}</h3>
              <p className="text-slate-600 leading-relaxed">{step.description}</p>
              
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-stone-200 to-stone-400 transform -translate-x-1/2"></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Logo Animation Styles */}
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
    </section>
  );
};

export default HowItWorks;
