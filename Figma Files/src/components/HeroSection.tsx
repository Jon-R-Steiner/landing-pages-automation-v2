import { Button } from "./ui/button";
import { Star, Shield, Calendar, ArrowRight } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface HeroSectionProps {
  city?: string;
  phone?: string;
  rating?: string;
  license?: string;
  yearsSince?: string;
  heroImageUrl?: string;
}

export function HeroSection({
  city = "Cleveland",
  phone = "(216) 555-1234",
  rating = "4.9/5",
  license = "OH #123456",
  yearsSince = "Since 2008",
  heroImageUrl = "https://images.unsplash.com/photo-1758548157466-7c454382035a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBiYXRocm9vbSUyMHJlbW9kZWwlMjBsdXh1cnl8ZW58MXx8fHwxNzYwNjI2OTY1fDA&ixlib=rb-4.1.0&q=80&w=1080"
}: HeroSectionProps) {
  return (
    <section className="relative min-h-[90vh] lg:min-h-[85vh] flex items-center overflow-hidden bg-gradient-to-br from-white via-[#f9fafb] to-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #0ea5e9 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 w-full py-20 lg:py-0">
        {/* Logo */}
        <div className="mb-12 lg:mb-16">
          <div className="text-[#0ea5e9] inline-block">
            <svg width="180" height="45" viewBox="0 0 180 45" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="45" height="45" rx="10" fill="currentColor"/>
              <text x="55" y="32" fill="currentColor" className="text-2xl">ABC Remodeling</text>
            </svg>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Column - Content */}
          <div className="relative z-10">
            {/* Headline */}
            <h1 className="text-[48px] sm:text-[56px] lg:text-[72px] leading-[1.1] mb-6 text-[#1f2937] tracking-tight">
              Bathroom<br />
              <span className="text-[#0ea5e9]">Remodeling</span><br />
              Near {city}
            </h1>

            {/* Subheadline */}
            <p className="text-xl lg:text-2xl mb-8 text-[#6b7280] max-w-lg leading-relaxed">
              Transform your bathroom with licensed experts. Serving {city} {yearsSince.toLowerCase()}.
            </p>

            {/* Trust Signals Row */}
            <div className="flex flex-wrap gap-6 mb-10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#f59e0b]/10 flex items-center justify-center">
                  <Star className="w-6 h-6 text-[#f59e0b] fill-[#f59e0b]" />
                </div>
                <div>
                  <div className="text-sm text-[#6b7280]">Rating</div>
                  <div className="text-lg text-[#1f2937]">{rating}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#0ea5e9]/10 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-[#0ea5e9]" />
                </div>
                <div>
                  <div className="text-sm text-[#6b7280]">Licensed</div>
                  <div className="text-lg text-[#1f2937]">{license}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#8b5cf6]/10 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-[#8b5cf6]" />
                </div>
                <div>
                  <div className="text-sm text-[#6b7280]">Experience</div>
                  <div className="text-lg text-[#1f2937]">{yearsSince}</div>
                </div>
              </div>
            </div>

            {/* Primary CTA Button */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                className="bg-[#0ea5e9] hover:bg-[#0284c7] text-white h-16 px-10 rounded-full text-lg group transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                size="lg"
              >
                Get Free Quote
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                variant="outline"
                className="border-2 border-[#1f2937] text-[#1f2937] hover:bg-[#1f2937] hover:text-white h-16 px-10 rounded-full text-lg transition-all duration-300"
                size="lg"
              >
                View Portfolio
              </Button>
            </div>
          </div>

          {/* Right Column - Hero Image */}
          <div className="relative lg:absolute lg:right-0 lg:top-1/2 lg:-translate-y-1/2 lg:w-[50vw] lg:h-[600px]">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl h-[400px] lg:h-full">
              <ImageWithFallback
                src={heroImageUrl}
                alt="Modern Bathroom Remodel"
                className="w-full h-full object-cover"
              />
              {/* Overlay Badge */}
              <div className="absolute bottom-8 left-8 bg-white/95 backdrop-blur-sm px-6 py-4 rounded-2xl shadow-xl">
                <div className="text-sm text-[#6b7280] mb-1">Premium Quality</div>
                <div className="text-2xl text-[#1f2937]">500+ Projects</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
