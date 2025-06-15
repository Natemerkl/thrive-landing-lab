
import { useEffect, useState, useRef } from 'react';

const ServicesSection = () => {
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

  const services = [
    {
      icon: '🎨',
      title: 'UI/UX & Web Design',
      description: 'Modern, mobile-first designs that convert visitors into customers. User-centered approach with Ethiopian market insights and international standards.'
    },
    {
      icon: '💻',
      title: 'Full-Stack Development',
      description: 'Complete web applications built with React, Next.js, Node.js, and Supabase. From simple websites to complex business management systems.'
    },
    {
      icon: '⚡',
      title: 'Performance Optimization',
      description: 'Lightning-fast websites optimized for Ethiopian internet conditions. Advanced caching, image optimization, and CDN implementation.'
    },
    {
      icon: '🔍',
      title: 'SEO & Digital Marketing',
      description: 'Strategic SEO for Ethiopian and international markets. Google My Business optimization, local SEO, and content strategy.'
    },
    {
      icon: '📱',
      title: 'Mobile-First Development',
      description: 'Progressive Web Apps (PWA) that work like native mobile apps. Offline functionality and app-like user experience.'
    },
    {
      icon: '🛡️',
      title: 'Security & Maintenance',
      description: 'Enterprise-grade security, SSL certificates, automated backups, and ongoing maintenance to keep your site secure and updated.'
    }
  ];

  return (
    <section id="services" ref={sectionRef} className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className={`text-4xl md:text-5xl font-bold text-slate-800 mb-6 transition-all duration-800 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            Complete Web Development Services
          </h2>
          <p className={`text-xl text-slate-600 max-w-3xl mx-auto transition-all duration-800 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            From stunning websites to powerful web applications, I deliver end-to-end digital solutions 
            tailored for Ethiopian businesses and international markets.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={service.title}
              className={`bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border border-slate-100 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${(index + 1) * 150}ms` }}
            >
              <div className="text-4xl mb-4">{service.icon}</div>
              <h3 className="text-xl font-bold text-slate-800 mb-4">{service.title}</h3>
              <p className="text-slate-600 leading-relaxed">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
