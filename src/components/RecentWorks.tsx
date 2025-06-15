
import { useEffect, useState, useRef } from 'react';
import { ExternalLink, Code, Zap } from 'lucide-react';

const RecentWorks = () => {
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

  const works = [
    {
      id: 'stocksyncai',
      title: 'StockSyncAI Dashboard',
      description: 'AI-powered inventory management system with real-time analytics and automated stock tracking.',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
      url: 'https://stocksyncai.pro.et/',
      tags: ['React', 'AI', 'Dashboard', 'Analytics'],
      featured: true
    },
    {
      id: 'ecommerce',
      title: 'E-Commerce Platform',
      description: 'Modern online store with payment integration and inventory management.',
      image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=600&fit=crop',
      tags: ['React', 'Stripe', 'E-commerce'],
      featured: false
    },
    {
      id: 'portfolio',
      title: 'Creative Portfolio',
      description: 'Stunning portfolio website with smooth animations and responsive design.',
      image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop',
      tags: ['Next.js', 'Animation', 'Portfolio'],
      featured: false
    },
    {
      id: 'business',
      title: 'Business Landing Page',
      description: 'Professional landing page with lead generation and analytics integration.',
      image: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&h=600&fit=crop',
      tags: ['React', 'SEO', 'Analytics'],
      featured: false
    }
  ];

  const handleWorkClick = (work: typeof works[0]) => {
    if (work.url) {
      window.open(work.url, '_blank');
    }
  };

  return (
    <section ref={sectionRef} className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className={`text-4xl md:text-5xl font-bold text-slate-800 mb-6 transition-all duration-800 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            Recent Works
          </h2>
          <p className={`text-xl text-slate-600 max-w-3xl mx-auto transition-all duration-800 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            Take a look at some of my latest projects and see what I can create for you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {works.map((work, index) => (
            <div
              key={work.id}
              className={`group cursor-pointer transition-all duration-500 hover:-translate-y-2 ${
                work.featured ? 'md:col-span-2 lg:col-span-1' : ''
              } ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
              onClick={() => handleWorkClick(work)}
            >
              <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-slate-100">
                <div className="relative overflow-hidden">
                  <img
                    src={work.image}
                    alt={work.title}
                    className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                    <div className="p-6 text-white">
                      <ExternalLink size={24} className="mb-2" />
                      <p className="text-sm">Click to view live project</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                    {work.title}
                  </h3>
                  <p className="text-slate-600 mb-4 line-clamp-2">
                    {work.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    {work.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm font-medium group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors duration-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <p className="text-slate-600 text-lg">
            💼 Want to see your project here? Let's build something amazing together!
          </p>
        </div>
      </div>
    </section>
  );
};

export default RecentWorks;
