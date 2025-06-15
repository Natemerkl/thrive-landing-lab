
import { useEffect, useState } from 'react';
import Navigation from '../components/Navigation';
import HeroSection from '../components/HeroSection';
import TrustLogos from '../components/TrustLogos';
import ServicesSection from '../components/ServicesSection';
import HowItWorks from '../components/HowItWorks';
import WhyChooseMe from '../components/WhyChooseMe';
import Testimonials from '../components/Testimonials';
import PricingSection from '../components/PricingSection';
import FAQSection from '../components/FAQSection';
import FinalCTA from '../components/FinalCTA';
import Footer from '../components/Footer';

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className={`min-h-screen bg-white transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <Navigation />
      <HeroSection />
      <TrustLogos />
      <ServicesSection />
      <HowItWorks />
      <WhyChooseMe />
      <Testimonials />
      <PricingSection />
      <FAQSection />
      <FinalCTA />
      <Footer />
    </div>
  );
};

export default Index;
