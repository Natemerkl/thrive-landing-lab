
import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Testimonial {
  id: string;
  client_name: string;
  client_company?: string;
  client_role?: string;
  content: string;
  rating: number;
  project_type?: string;
}

const Testimonials = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('is_published', true)
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching testimonials:', error);
        // Fall back to default testimonials
        setTestimonials(defaultTestimonials);
      } else if (data && data.length > 0) {
        setTestimonials(data);
      } else {
        // Use default testimonials if no data
        setTestimonials(defaultTestimonials);
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      setTestimonials(defaultTestimonials);
    } finally {
      setLoading(false);
    }
  };

  // Default testimonials as fallback
  const defaultTestimonials: Testimonial[] = [
    {
      id: '1',
      client_name: 'Sarah Chen',
      client_role: 'Founder',
      client_company: 'TechStart',
      content: 'Absolutely incredible work! My website conversion rate increased by 300% after the redesign.',
      rating: 5,
      project_type: 'website'
    },
    {
      id: '2',
      client_name: 'Mike Rodriguez',
      client_role: 'CEO',
      client_company: 'LocalBiz',
      content: 'Fast, professional, and exactly what I needed. The automation dashboard saves me 10 hours per week.',
      rating: 5,
      project_type: 'web-app'
    },
    {
      id: '3',
      client_name: 'Emma Thompson',
      client_role: 'Creative Director',
      content: 'Working with DevCraft was seamless. Great communication and delivered ahead of schedule.',
      rating: 5,
      project_type: 'website'
    }
  ];

  useEffect(() => {
    if (testimonials.length > 1) {
      const timer = setInterval(() => {
        setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
      }, 5000);

      return () => clearInterval(timer);
    }
  }, [testimonials.length]);

  const getAvatar = (name: string) => {
    const avatars = ['👩‍💼', '👨‍💼', '👩‍🎨', '👨‍💻', '👩‍💻', '👨‍🎨'];
    const index = name.charCodeAt(0) % avatars.length;
    return avatars[index];
  };

  if (loading) {
    return (
      <section id="testimonials" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-slate-200 rounded w-1/3 mx-auto mb-4"></div>
              <div className="h-4 bg-slate-200 rounded w-1/2 mx-auto"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="testimonials" ref={sectionRef} className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className={`text-4xl md:text-5xl font-bold text-slate-800 mb-6 transition-all duration-800 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            What Clients Say
          </h2>
          <p className={`text-xl text-slate-600 max-w-3xl mx-auto transition-all duration-800 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            Real results from real businesses who trusted me with their digital presence.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-50 to-slate-50 p-8 md:p-12">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className={`text-center transition-all duration-500 ${
                  index === currentTestimonial
                    ? 'opacity-100 translate-x-0'
                    : 'opacity-0 absolute inset-0 translate-x-full'
                }`}
              >
                <div className="text-6xl mb-4">{getAvatar(testimonial.client_name)}</div>
                
                <div className="flex justify-center mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-2xl">⭐</span>
                  ))}
                </div>

                <blockquote className="text-xl md:text-2xl text-slate-700 italic mb-8 leading-relaxed">
                  "{testimonial.content}"
                </blockquote>

                <div>
                  <cite className="text-lg font-bold text-slate-800">{testimonial.client_name}</cite>
                  <p className="text-slate-600">
                    {testimonial.client_role}
                    {testimonial.client_company && `, ${testimonial.client_company}`}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {testimonials.length > 1 && (
            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentTestimonial
                      ? 'bg-blue-600 scale-125'
                      : 'bg-slate-300 hover:bg-slate-400'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
