
import HeroSection from "@/components/HeroSection";
import Navigation from "@/components/Navigation";
import ServicesSection from "@/components/ServicesSection";
import WhyChooseMe from "@/components/WhyChooseMe";
import HowItWorks from "@/components/HowItWorks";
import PricingSection from "@/components/PricingSection";
import RecentWorks from "@/components/RecentWorks";
import FAQSection from "@/components/FAQSection";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";
import TrustLogos from "@/components/TrustLogos";
import NewsletterSubscription from "@/components/NewsletterSubscription";

const Index = () => {
  return (
    <div className="w-full">
      <Navigation />
      <HeroSection />
      <TrustLogos />
      
      <section id="services" className="w-full">
        <ServicesSection />
      </section>
      
      <section id="why-choose-me" className="w-full">
        <WhyChooseMe />
      </section>
      
      <section id="how-it-works" className="w-full">
        <HowItWorks />
      </section>
      
      <section id="pricing" className="w-full">
        <PricingSection />
      </section>
      
      <section id="recent-works" className="w-full">
        <RecentWorks />
      </section>
      
      <section id="faq" className="w-full">
        <FAQSection />
      </section>
      
      {/* Newsletter section */}
      <section className="py-16 bg-slate-50 w-full">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <NewsletterSubscription />
        </div>
      </section>
      
      <section id="contact" className="w-full">
        <FinalCTA />
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
