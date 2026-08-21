
import { useEffect, useState, useRef } from 'react';
import { Code, Zap, Database, CreditCard, Rocket, Palette, Globe, FileCode2, Layers, Settings } from 'lucide-react';

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
    { name: 'React', icon: Code, color: 'text-blue-500' },
    { name: 'Next.js', icon: Zap, color: 'text-slate-700' },
    { name: 'HTML5', icon: FileCode2, color: 'text-orange-500' },
    { name: 'CSS3', icon: Palette, color: 'text-blue-400' },
    { name: 'JavaScript', icon: Code, color: 'text-yellow-500' },
    { name: 'TypeScript', icon: Code, color: 'text-blue-600' },
    { name: 'Vite', icon: Zap, color: 'text-purple-500' },
    { name: 'Supabase', icon: Database, color: 'text-green-500' },
    { name: 'SQL', icon: Database, color: 'text-blue-700' },
    { name: 'Stripe', icon: CreditCard, color: 'text-purple-500' },
    { name: 'Vercel', icon: Rocket, color: 'text-slate-800' },
    { name: 'Tailwind', icon: Palette, color: 'text-teal-500' },
    { name: 'Node.js', icon: Globe, color: 'text-emerald-500' },
    { name: 'Express', icon: Layers, color: 'text-gray-600' },
    { name: 'API', icon: Settings, color: 'text-emerald-600' }
  ];

  // Duplicate the array for seamless infinite scroll
  const duplicatedTechnologies = [...technologies, ...technologies];

  return (
    <section ref={sectionRef} className="page-section py-16 bg-[#f7fbf9] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className={`text-slate-500 text-lg transition-all duration-800 ${
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
                <div className={`w-12 h-12 flex items-center justify-center mb-2 ${tech.color}`}>
                  <tech.icon size={32} strokeWidth={1.5} />
                </div>
                <span className="text-sm text-slate-500 font-medium whitespace-nowrap">{tech.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <style>{`
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

        @media (prefers-reduced-motion: reduce) {
          .animate-scroll {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
};

export default TrustLogos;
