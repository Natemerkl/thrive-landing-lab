
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
    <div className="min-h-screen">
      <Navigation />
      <HeroSection />
      <TrustLogos />
      
      <section id="services">
        <ServicesSection />
      </section>
      
      <section id="why-choose-me">
        <WhyChooseMe />
      </section>
      
      <section id="how-it-works">
        <HowItWorks />
      </section>
      
      <section id="pricing">
        <PricingSection />
      </section>
      
      <section id="recent-works">
        <RecentWorks />
      </section>
      
      <section id="faq">
        <FAQSection />
      </section>
      
      {/* Newsletter section */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <NewsletterSubscription />
        </div>
      </section>
      
      <section id="contact">
        <FinalCTA />
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
