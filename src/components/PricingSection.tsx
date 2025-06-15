
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
      name: 'Starter Site',
      price: '$999',
      description: 'Perfect for small businesses and personal brands',
      features: [
        'Responsive design',
        'SEO optimization',
        'Contact forms',
        'Basic animations',
        '1 week delivery'
      ],
      highlighted: false
    },
    {
      name: 'Business Pro',
      price: '$2,499',
      description: 'Ideal for growing businesses',
      features: [
        'Custom web application',
        'User authentication',
        'Database integration',
        'Admin dashboard',
        '2-3 week delivery'
      ],
      highlighted: true
    },
    {
      name: 'Full Web App',
      price: 'Custom',
      description: 'Enterprise solutions and complex projects',
      features: [
        'Full-stack development',
        'Custom integrations',
        'Advanced features',
        'Ongoing support',
        'Timeline varies'
      ],
      highlighted: false
    }
  ];

  return (
    <section ref={sectionRef} className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className={`text-4xl md:text-5xl font-bold text-slate-800 mb-6 transition-all duration-800 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            Simple, Transparent Pricing
          </h2>
          <p className={`text-xl text-slate-600 max-w-3xl mx-auto transition-all duration-800 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            Choose the package that fits your needs. All projects include revisions and support.
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
                  Most Popular
                </div>
              )}
              
              <div className="p-8">
                <h3 className="text-2xl font-bold text-slate-800 mb-2">{plan.name}</h3>
                <div className="text-4xl font-bold text-blue-600 mb-4">
                  {plan.price}
                  {plan.price !== 'Custom' && <span className="text-lg text-slate-500">+</span>}
                </div>
                <p className="text-slate-600 mb-6">{plan.description}</p>
                
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-slate-600">
                      <span className="text-green-500 mr-2">✓</span>
                      {feature}
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
                  {plan.price === 'Custom' ? 'Get a Quote' : 'Start Now'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
