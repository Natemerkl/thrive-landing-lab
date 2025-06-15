
import { useEffect, useState, useRef } from 'react';
import { Palette, Code, CreditCard, Zap, Shield, BarChart3 } from 'lucide-react';

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

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const services = [
    {
      icon: Palette,
      title: 'Custom Web Design',
      description: 'Beautiful, responsive designs that convert visitors into customers. Modern UI/UX with Ethiopian market insights.',
      features: ['Mobile-first responsive design', 'Brand identity integration', 'User experience optimization'],
      color: 'text-pink-500'
    },
    {
      icon: Code,
      title: 'Full-Stack Development',
      description: 'Complete web applications with React, Next.js, and Supabase. Scalable solutions for growing businesses.',
      features: ['React & Next.js development', 'Database design & management', 'API development & integration'],
      color: 'text-blue-500'
    },
    {
      icon: CreditCard,
      title: 'Payment Management System',
      description: 'Complete payment processing solution with Stripe integration, subscription management, and financial analytics.',
      features: ['Stripe payment gateway integration', 'Subscription & recurring billing', 'Payment analytics dashboard', 'Multi-currency support (ETB/USD)', 'Automated invoicing & receipts', 'Payment dispute management'],
      color: 'text-purple-500'
    },
    {
      icon: Zap,
      title: 'Performance Optimization',
      description: 'Lightning-fast websites optimized for Ethiopian internet speeds. SEO-ready for Google ranking.',
      features: ['Core Web Vitals optimization', 'SEO implementation', 'Speed & performance tuning'],
      color: 'text-yellow-500'
    },
    {
      icon: Shield,
      title: 'Authentication & Security',
      description: 'Secure user authentication, role management, and data protection for your applications.',
      features: ['User authentication system', 'Role-based access control', 'Data encryption & security'],
      color: 'text-green-500'
    },
    {
      icon: BarChart3,
      title: 'Analytics & Insights',
      description: 'Comprehensive analytics dashboard to track your business metrics and user behavior.',
      features: ['Google Analytics integration', 'Custom dashboard creation', 'Business intelligence reports'],
      color: 'text-indigo-500'
    }
  ];

  return (
    <section ref={sectionRef} id="services" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className={`text-4xl md:text-5xl font-bold text-slate-800 mb-6 transition-all duration-800 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            Complete Digital Solutions
          </h2>
          <p className={`text-xl text-slate-600 max-w-3xl mx-auto transition-all duration-800 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            From design to deployment, I handle every aspect of your digital presence. 
            Specialized in modern web technologies with Ethiopian business expertise.
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
              <div className={`w-12 h-12 ${service.color} mb-4`}>
                <service.icon size={48} strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-4">{service.title}</h3>
              <p className="text-slate-600 mb-6 leading-relaxed">{service.description}</p>
              
              <ul className="space-y-2">
                {service.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start text-sm text-slate-500">
                    <span className="text-green-500 mr-2 mt-1 flex-shrink-0">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button 
            onClick={() => scrollToSection('contact')}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
          >
            Start Your Project Today
          </button>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
