
import { useEffect, useState, useRef } from 'react';

const TrustLogos = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const technologies = [
    { name: 'React', icon: '⚛️' },
    { name: 'Next.js', icon: '▲' },
    { name: 'Supabase', icon: '🗄️' },
    { name: 'Stripe', icon: '💳' },
    { name: 'Vercel', icon: '🚀' },
    { name: 'Tailwind', icon: '🎨' }
  ];

  return (
    <section ref={sectionRef} className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className={`text-slate-600 text-lg transition-all duration-800 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}>
            Trusted by Ethiopian startups, SMEs & international clients
          </p>
          <p className={`text-slate-500 text-sm mt-2 transition-all duration-800 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}>
            Built with modern, reliable technology stack
          </p>
        </div>
        
        <div className="grid grid-cols-3 md:grid-cols-6 gap-8 items-center justify-items-center">
          {technologies.map((tech, index) => (
            <div
              key={tech.name}
              className={`flex flex-col items-center p-4 rounded-lg transition-all duration-800 hover:scale-110 hover:bg-slate-50 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <span className="text-3xl mb-2">{tech.icon}</span>
              <span className="text-sm text-slate-500 font-medium">{tech.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustLogos;
