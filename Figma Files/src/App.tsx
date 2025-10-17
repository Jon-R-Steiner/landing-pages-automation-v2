import { HeroSection } from "./components/HeroSection";
import { TrustBar } from "./components/TrustBar";
import { ServiceDescription } from "./components/ServiceDescription";
import { BeforeAfterGallery } from "./components/BeforeAfterGallery";
import { BenefitsSection } from "./components/BenefitsSection";
import { TestimonialsSection } from "./components/TestimonialsSection";
import { ProcessOverview } from "./components/ProcessOverview";
import { FAQSection } from "./components/FAQSection";
import { FinalCTA } from "./components/FinalCTA";
import { Footer } from "./components/Footer";

function App() {
  // Page configuration - easily customizable per location/client
  const config = {
    city: "Cleveland",
    phone: "(216) 555-1234",
    email: "info@abcremodeling.com",
    license: "OH #123456",
    yearsSince: "Since 2008",
    yearsExperience: "15 Years Experience",
    rating: "4.9",
    reviewCount: "127",
    address: "123 Main St, Suite 100, Cleveland, OH 44101"
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Sticky Trust Bar */}
      <TrustBar 
        phone={config.phone}
        license={config.license}
        yearsExperience={config.yearsExperience}
        rating={config.rating}
        reviewCount={config.reviewCount}
      />

      {/* Section 1: Hero */}
      <HeroSection 
        city={config.city}
        phone={config.phone}
        rating={`${config.rating}/5`}
        license={config.license}
        yearsSince={config.yearsSince}
      />

      {/* Section 3: Service Description */}
      <ServiceDescription city={config.city} />

      {/* Section 4: Before/After Gallery */}
      <BeforeAfterGallery city={config.city} />

      {/* Section 5: Why Choose Us / Benefits */}
      <BenefitsSection />

      {/* Section 6: Social Proof / Testimonials */}
      <TestimonialsSection city={config.city} />

      {/* Section 7: Process Overview */}
      <ProcessOverview />

      {/* Section 8: FAQ Section */}
      <FAQSection />

      {/* Section 9: Final CTA Section */}
      <FinalCTA phone={config.phone} />

      {/* Section 10: Footer */}
      <Footer 
        phone={config.phone}
        email={config.email}
        address={config.address}
      />

      {/* Add padding at bottom for mobile sticky button */}
      <div className="h-20 md:h-0" />
    </div>
  );
}

export default App;
