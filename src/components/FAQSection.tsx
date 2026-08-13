
import { useEffect, useState, useRef } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';

const FAQSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [openItems, setOpenItems] = useState<number[]>([]);
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

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const faqs = [
    {
      question: 'How long does a typical project take?',
      answer: 'Most websites are completed within 1-2 weeks, while full web applications typically take 2-4 weeks. Complex projects may take longer, but I always provide realistic timelines upfront.'
    },
    {
      question: 'Do I need to provide content and images?',
      answer: 'While I can help with content strategy and sourcing stock images, you know your business best. I recommend you provide key content, but I can guide you through the process and help with optimization.'
    },
    {
      question: 'Can you build custom dashboards and internal tools?',
      answer: 'Absolutely! I specialize in creating custom dashboards, admin panels, and internal tools that streamline your business operations and save you time.'
    },
    {
      question: 'Will my website rank well on Google?',
      answer: 'Every website I build includes SEO best practices, fast loading times, and proper technical optimization. I also offer ongoing SEO services to help improve your rankings over time.'
    },
    {
      question: 'What about ongoing support and maintenance?',
      answer: 'I provide 30 days of free support after launch. For ongoing maintenance, updates, and feature additions, I offer flexible monthly retainer packages.'
    }
  ];

  return (
    <section ref={sectionRef} className="py-20 bg-[#eef5ff]">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className={`text-4xl md:text-5xl font-bold text-slate-800 mb-6 transition-all duration-800 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            Frequently Asked Questions
          </h2>
          <p className={`text-xl text-slate-600 transition-all duration-800 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            Everything you need to know about working with me.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <Collapsible key={index} open={openItems.includes(index)} onOpenChange={() => toggleItem(index)}>
              <div className={`luxury-card bg-white/90 rounded-lg border transition-all duration-800 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${(index + 1) * 150}ms` }}>
                <CollapsibleTrigger className="w-full p-6 text-left flex items-center justify-between hover:bg-cyan-50 transition-colors">
                  <h3 className="text-lg font-semibold text-slate-800 pr-4">{faq.question}</h3>
                  <span className={`text-2xl transition-transform duration-300 ${
                    openItems.includes(index) ? 'rotate-45' : 'rotate-0'
                  }`}>
                    +
                  </span>
                </CollapsibleTrigger>
                <CollapsibleContent className="px-6 pb-6">
                  <div className="text-slate-600 leading-relaxed border-t border-slate-200 pt-4">
                    {faq.answer}
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
