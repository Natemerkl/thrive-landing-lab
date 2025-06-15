import { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const FinalCTA = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectBrief: '',
    phone: '',
    projectType: '',
    budgetRange: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const { toast } = useToast();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('contact_inquiries')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            message: formData.projectBrief,
            phone: formData.phone || null,
            project_type: formData.projectType || null,
            budget_range: formData.budgetRange || null
          }
        ]);

      if (error) {
        console.error('Error submitting contact form:', error);
        toast({
          title: "Error",
          description: "Failed to send message. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Message Sent!",
          description: "Thanks for reaching out. I'll get back to you within 24 hours.",
        });
        setFormData({ 
          name: '', 
          email: '', 
          projectBrief: '', 
          phone: '', 
          projectType: '', 
          budgetRange: '' 
        });
      }
    } catch (error) {
      console.error('Error submitting contact form:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }

    setIsSubmitting(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section id="contact" ref={sectionRef} className="py-20 bg-gradient-to-br from-slate-800 to-slate-900 text-white">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className={`text-4xl md:text-5xl font-bold mb-6 transition-all duration-800 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            Let's Build Something Smart — Together.
          </h2>
          <p className={`text-xl text-slate-300 max-w-3xl mx-auto transition-all duration-800 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            Direct communication = better results. Tell me about your project and let's get started.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className={`transition-all duration-800 delay-400 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="bg-white/10 border-white/20 text-white placeholder:text-slate-300 focus:border-blue-400 focus:ring-blue-400"
                />
                <Input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="bg-white/10 border-white/20 text-white placeholder:text-slate-300 focus:border-blue-400 focus:ring-blue-400"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  type="tel"
                  name="phone"
                  placeholder="Phone (Optional)"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="bg-white/10 border-white/20 text-white placeholder:text-slate-300 focus:border-blue-400 focus:ring-blue-400"
                />
                <select
                  name="projectType"
                  value={formData.projectType}
                  onChange={handleInputChange}
                  className="bg-white/10 border border-white/20 text-white rounded-md px-3 py-2 focus:border-blue-400 focus:ring-blue-400"
                >
                  <option value="" className="text-slate-800">Project Type</option>
                  <option value="website" className="text-slate-800">Website</option>
                  <option value="web-app" className="text-slate-800">Web Application</option>
                  <option value="e-commerce" className="text-slate-800">E-commerce</option>
                  <option value="other" className="text-slate-800">Other</option>
                </select>
              </div>

              <select
                name="budgetRange"
                value={formData.budgetRange}
                onChange={handleInputChange}
                className="w-full bg-white/10 border border-white/20 text-white rounded-md px-3 py-2 focus:border-blue-400 focus:ring-blue-400"
              >
                <option value="" className="text-slate-800">Budget Range</option>
                <option value="10000-25000" className="text-slate-800">10,000 - 25,000 ETB</option>
                <option value="25000-50000" className="text-slate-800">25,000 - 50,000 ETB</option>
                <option value="50000-100000" className="text-slate-800">50,000 - 100,000 ETB</option>
                <option value="100000+" className="text-slate-800">100,000+ ETB</option>
              </select>
              
              <Textarea
                name="projectBrief"
                placeholder="Tell me about your project..."
                value={formData.projectBrief}
                onChange={handleInputChange}
                required
                rows={4}
                className="bg-white/10 border-white/20 text-white placeholder:text-slate-300 focus:border-blue-400 focus:ring-blue-400"
              />
              
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 font-medium transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          </div>

          <div className={`text-center lg:text-left transition-all duration-800 delay-600 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="bg-white/5 p-8 rounded-xl border border-white/10">
              <h3 className="text-2xl font-bold mb-4">Prefer to talk directly?</h3>
              <p className="text-slate-300 mb-6">
                Sometimes a quick call is the best way to discuss your project and answer any questions.
              </p>
              
              <Button
                variant="outline"
                className="border-2 border-white/20 text-white hover:bg-white hover:text-slate-800 transition-all duration-300"
              >
                📞 Schedule a Discovery Call
              </Button>
              
              <div className="mt-8 space-y-2 text-slate-300">
                <p>📧 hello@devcraft.dev</p>
                <p>⚡ Usually respond within 2 hours</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
