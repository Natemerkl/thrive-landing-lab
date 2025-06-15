
import { useEffect, useState, useRef } from 'react';
import { Target, Wrench, Rocket } from 'lucide-react';

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
      title: 'Discovery Call',
      description: 'We discuss your vision, goals, and requirements to create the perfect roadmap.',
      icon: Target,
      color: 'text-blue-500'
    },
    {
      number: 2,
      title: 'Design & Build',
      description: 'I create and develop your solution with regular updates and your feedback.',
      icon: Wrench,
      color: 'text-purple-500'
    },
    {
      number: 3,
      title: 'Launch & Scale',
      description: 'Deploy your project with SEO optimization, documentation, and ongoing support.',
      icon: Rocket,
      color: 'text-green-500'
    }
  ];

  return (
    <section ref={sectionRef} className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className={`text-4xl md:text-5xl font-bold text-slate-800 mb-6 transition-all duration-800 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            How It Works
          </h2>
          <p className={`text-xl text-slate-600 max-w-3xl mx-auto transition-all duration-800 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            A simple, transparent process that gets you from idea to launch quickly.
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
                <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 shadow-lg">
                  {step.number}
                </div>
                <div className={`w-12 h-12 mx-auto ${step.color}`}>
                  <step.icon size={48} strokeWidth={1.5} />
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-slate-800 mb-4">{step.title}</h3>
              <p className="text-slate-600 leading-relaxed">{step.description}</p>
              
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-blue-200 to-blue-300 transform -translate-x-1/2"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
