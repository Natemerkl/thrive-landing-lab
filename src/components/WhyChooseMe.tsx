
import { useEffect, useState, useRef } from 'react';

const WhyChooseMe = () => {
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

  const benefits = [
    {
      icon: '🎯',
      title: 'Direct Collaboration',
      description: 'Work directly with me, not a team. Clear communication, personal attention.'
    },
    {
      icon: '⚡',
      title: 'Fast Turnaround',
      description: 'No bureaucracy or delays. Most projects completed within 2-4 weeks.'
    },
    {
      icon: '💬',
      title: 'Clear Communication',
      description: 'Regular updates, transparent process, and always available for questions.'
    },
    {
      icon: '🧠',
      title: 'Strategy + Execution',
      description: 'Not just development - strategic thinking to grow your business.'
    }
  ];

  return (
    <section id="about" ref={sectionRef} className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className={`text-4xl md:text-5xl font-bold text-slate-800 mb-6 transition-all duration-800 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            Why Choose Me
          </h2>
          <p className={`text-xl text-slate-600 max-w-3xl mx-auto transition-all duration-800 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            The advantages of working with a dedicated expert who cares about your success.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={benefit.title}
              className={`text-center bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border border-slate-100 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${(index + 1) * 200}ms` }}
            >
              <div className="text-4xl mb-4 animate-pulse">{benefit.icon}</div>
              <h3 className="text-xl font-bold text-slate-800 mb-4">{benefit.title}</h3>
              <p className="text-slate-600 leading-relaxed">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseMe;
