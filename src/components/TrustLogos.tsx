
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

  const logos = [
    { name: 'Supabase', icon: '🗄️' },
    { name: 'Stripe', icon: '💳' },
    { name: 'Notion', icon: '📝' },
    { name: 'Calendly', icon: '📅' },
    { name: 'Zapier', icon: '⚡' },
    { name: 'Airtable', icon: '📊' }
  ];

  return (
    <section ref={sectionRef} className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className={`text-slate-600 text-lg transition-all duration-800 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}>
            Trusted by startups, solo founders & local businesses.
          </p>
        </div>
        
        <div className="grid grid-cols-3 md:grid-cols-6 gap-8 items-center justify-items-center">
          {logos.map((logo, index) => (
            <div
              key={logo.name}
              className={`flex flex-col items-center p-4 rounded-lg transition-all duration-800 hover:scale-110 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <span className="text-3xl mb-2">{logo.icon}</span>
              <span className="text-sm text-slate-500 font-medium">{logo.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustLogos;
