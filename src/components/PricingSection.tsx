
import { useEffect, useState, useRef } from 'react';
import { Button } from './ui/button';

const PricingSection = () => {
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

  const plans = [
    {
      name: 'Starter Website',
      price: '25,000 ETB',
      description: 'Perfect for small businesses and personal brands',
      features: [
        'Responsive mobile-first design',
        'SEO optimization & meta tags',
        'Contact forms with validation',
        'Google Analytics integration',
        'Social media integration',
        'SSL certificate setup',
        'Performance optimization',
        '1-2 week delivery',
        '30 days free support'
      ],
      highlighted: false
    },
    {
      name: 'Business Pro',
      price: '65,000 ETB',
      description: 'Ideal for growing businesses and startups',
      features: [
        'Custom web application',
        'User authentication system',
        'Database integration (Supabase)',
        'Admin dashboard panel',
        'Payment integration (Stripe/PayPal)',
        'Email automation setup',
        'Advanced SEO optimization',
        'Blog/CMS functionality',
        'API integrations',
        'Mobile app-like experience',
        '2-3 week delivery',
        '60 days free support'
      ],
      highlighted: true
    },
    {
      name: 'Enterprise Solution',
      price: 'Custom Quote',
      description: 'Complex projects and enterprise solutions',
      features: [
        'Full-stack application development',
        'Microservices architecture',
        'Advanced backend systems',
        'Third-party integrations',
        'Multi-user role management',
        'Advanced analytics dashboard',
        'Automated testing suite',
        'DevOps & deployment setup',
        'Performance monitoring',
        'Scalable cloud infrastructure',
        'Timeline varies (4-12 weeks)',
        '90 days free support'
      ],
      highlighted: false
    }
  ];

  return (
    <section ref={sectionRef} id="pricing" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className={`text-4xl md:text-5xl font-bold text-slate-800 mb-6 transition-all duration-800 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            Transparent Pricing in Ethiopian Birr
          </h2>
          <p className={`text-xl text-slate-600 max-w-3xl mx-auto transition-all duration-800 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            Professional web development services at Ethiopian-friendly rates. 
            All projects include revisions, training, and ongoing support.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border-2 overflow-hidden ${
                plan.highlighted 
                  ? 'border-blue-500 scale-105' 
                  : 'border-slate-100'
              } ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${(index + 1) * 200}ms` }}
            >
              {plan.highlighted && (
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white text-center py-2 text-sm font-medium">
                  Most Popular ⭐
                </div>
              )}
              
              <div className="p-8">
                <h3 className="text-2xl font-bold text-slate-800 mb-2">{plan.name}</h3>
                <div className="text-4xl font-bold text-blue-600 mb-4">
                  {plan.price}
                  {plan.price !== 'Custom Quote' && <span className="text-lg text-slate-500"> starting</span>}
                </div>
                <p className="text-slate-600 mb-6">{plan.description}</p>
                
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start text-slate-600">
                      <span className="text-green-500 mr-2 mt-1 flex-shrink-0">✓</span>
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  onClick={() => scrollToSection('contact')}
                  className={`w-full py-3 font-medium transition-all duration-300 ${
                    plan.highlighted
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white'
                      : 'border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white'
                  }`}
                  variant={plan.highlighted ? 'default' : 'outline'}
                >
                  {plan.price === 'Custom Quote' ? 'Get Custom Quote' : 'Start Project'}
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <p className="text-slate-600 text-lg mb-4">💳 Flexible payment options available</p>
          <p className="text-slate-500">Payment plans available | Bank transfer accepted | No hidden fees</p>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
