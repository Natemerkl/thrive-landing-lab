
import HeroSection from "@/components/HeroSection";
import Navigation from "@/components/Navigation";
import ServicesSection from "@/components/ServicesSection";
import WhyChooseMe from "@/components/WhyChooseMe";
import HowItWorks from "@/components/HowItWorks";
import RecentWorks from "@/components/RecentWorks";
import FAQSection from "@/components/FAQSection";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";
import TrustLogos from "@/components/TrustLogos";
import NewsletterSubscription from "@/components/NewsletterSubscription";

const Index = () => {
  return (
    <div className="landing-shell w-full">
      <Navigation />
      <HeroSection />
      <TrustLogos />
      
      <section id="services" className="page-section w-full">
        <ServicesSection />
      </section>
      
      <section id="why-choose-me" className="page-section w-full">
        <WhyChooseMe />
      </section>
      
      <section id="how-it-works" className="page-section w-full">
        <HowItWorks />
      </section>
      
      <section id="recent-works" className="page-section w-full">
        <RecentWorks />
      </section>
      
      <section id="faq" className="page-section w-full">
        <FAQSection />
      </section>
      
      {/* Newsletter section */}
      <section className="page-section py-16 bg-[#f1f9f5] w-full">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <NewsletterSubscription />
        </div>
      </section>
      
      <section id="contact" className="page-section w-full">
        <FinalCTA />
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
