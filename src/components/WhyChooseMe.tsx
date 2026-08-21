
import { useEffect, useState, useRef } from 'react';
import { Target, Zap, MessageCircle, Brain } from 'lucide-react';

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
      icon: Target,
      title: 'Direct Collaboration',
      description: 'Work directly with our team. Clear communication and personal attention throughout your project.',
      color: 'text-teal-700'
    },
    {
      icon: Zap,
      title: 'Fast Turnaround',
      description: 'No bureaucracy or delays. Most projects completed within 2-4 weeks.',
      color: 'text-amber-700'
    },
    {
      icon: MessageCircle,
      title: 'Clear Communication',
      description: 'Regular updates, transparent process, and always available for questions.',
      color: 'text-emerald-600'
    },
    {
      icon: Brain,
      title: 'Strategy + Execution',
      description: 'Not just development - strategic thinking to grow your business.',
      color: 'text-teal-800'
    }
  ];

  return (
    <section id="about" ref={sectionRef} className="py-20 bg-[#eef8f3]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className={`text-4xl md:text-5xl font-bold text-slate-800 mb-6 transition-all duration-800 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            Why Choose Us
          </h2>
          <p className={`text-xl text-slate-600 max-w-3xl mx-auto transition-all duration-800 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            The advantages of working with a dedicated team that cares about your success.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={benefit.title}
              className={`luxury-card text-center bg-white/90 p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${(index + 1) * 200}ms` }}
            >
              <div className={`w-12 h-12 mx-auto mb-4 ${benefit.color} flex items-center justify-center`}>
                <benefit.icon size={48} strokeWidth={1.5} />
              </div>
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
