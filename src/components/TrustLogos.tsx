
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
    { name: 'StocksyncAI', icon: '📈', isCustom: true },
    { name: 'Supabase', icon: '🗄️' },
    { name: 'Stripe', icon: '💳' },
    { name: 'Vercel', icon: '🚀' },
    { name: 'Tailwind', icon: '🎨' },
    { name: 'Node.js', icon: '🟢' }
  ];

  // Duplicate the array for seamless infinite scroll
  const duplicatedTechnologies = [...technologies, ...technologies];

  return (
    <section ref={sectionRef} className="py-16 bg-white overflow-hidden">
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
        
        <div className="relative">
          <div className="flex animate-scroll">
            {duplicatedTechnologies.map((tech, index) => (
              <div
                key={`${tech.name}-${index}`}
                className={`flex flex-col items-center p-6 rounded-lg transition-all duration-800 hover:scale-110 hover:bg-slate-50 flex-shrink-0 mx-4 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
                }`}
                style={{ transitionDelay: `${(index % technologies.length) * 100}ms` }}
              >
                {tech.isCustom ? (
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg mb-2">
                    {tech.icon}
                  </div>
                ) : (
                  <span className="text-4xl mb-2">{tech.icon}</span>
                )}
                <span className="text-sm text-slate-500 font-medium whitespace-nowrap">{tech.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
        
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};

export default TrustLogos;
