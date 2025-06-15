
import HeroSection from "@/components/HeroSection";
import Navigation from "@/components/Navigation";
import ServicesSection from "@/components/ServicesSection";
import WhyChooseMe from "@/components/WhyChooseMe";
import HowItWorks from "@/components/HowItWorks";
import PricingSection from "@/components/PricingSection";
import Testimonials from "@/components/Testimonials";
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
      <ServicesSection />
      <WhyChooseMe />
      <HowItWorks />
      <PricingSection />
      <Testimonials />
      <FAQSection />
      
      {/* Newsletter section */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <NewsletterSubscription />
        </div>
      </section>
      
      <FinalCTA />
      <Footer />
    </div>
  );
};

export default Index;
