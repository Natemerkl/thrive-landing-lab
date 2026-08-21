
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
      image: '/lovable-uploads/34884686-6b53-4213-8343-8faa72f6c154.png',
      url: 'https://stocksyncai.pro.et/',
      tags: ['React', 'AI', 'Dashboard', 'Analytics'],
      featured: true
    },
    {
      id: 'construction',
      title: 'BuildRight Construction Portfolio',
      description: 'Professional construction company website with project showcases and client testimonials.',
      image: '/lovable-uploads/614430b8-d805-4d5f-aee8-10e0894937e5.png',
      tags: ['React', 'Portfolio', 'Construction'],
      featured: false
    },
    {
      id: 'realestate',
      title: 'Elite Homes Real Estate',
      description: 'Modern real estate platform with property listings and advanced search features.',
      image: '/lovable-uploads/03651402-ea4d-4e49-a02f-fdbebd1c1b32.png',
      tags: ['React', 'Real Estate', 'Property'],
      featured: false
    },
    {
      id: 'ecommerce',
      title: 'E-Commerce Platform',
      description: 'Modern online store with payment integration and inventory management.',
      image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=600&fit=crop',
      tags: ['React', 'Stripe', 'E-commerce'],
      featured: false
    }
  ];

  const handleWorkClick = (work: typeof works[0]) => {
    if (work.url) {
      window.open(work.url, '_blank');
    }
  };

  return (
    <section ref={sectionRef} className="py-20 bg-[#f4f9f6]">
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
              <div className="luxury-card bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border">
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
                  <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-emerald-700 transition-colors duration-300">
                    {work.title}
                  </h3>
                  <p className="text-slate-600 mb-4 line-clamp-2">
                    {work.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    {work.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium group-hover:bg-teal-100 group-hover:text-teal-900 transition-colors duration-300"
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
