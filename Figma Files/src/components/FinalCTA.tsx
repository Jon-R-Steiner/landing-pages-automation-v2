import { Button } from "./ui/button";
import { Phone, ArrowRight } from "lucide-react";

interface FinalCTAProps {
  phone?: string;
}

export function FinalCTA({ phone = "(216) 555-1234" }: FinalCTAProps) {
  return (
    <section className="relative bg-gradient-to-br from-[#0ea5e9] via-[#0284c7] to-[#0369a1] px-4 py-32 lg:py-40 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 2px, transparent 0)',
          backgroundSize: '64px 64px'
        }} />
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-[#8b5cf6]/10 rounded-full blur-3xl" />

      <div className="max-w-5xl mx-auto text-center relative z-10">
        <h2 className="text-[48px] lg:text-[64px] text-white mb-6 leading-tight tracking-tight">
          Ready to Transform<br />Your Bathroom?
        </h2>
        
        <p className="text-xl lg:text-2xl text-white/90 mb-12 max-w-2xl mx-auto leading-relaxed">
          Get your free, no-obligation estimate today and start your journey to the bathroom of your dreams
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10">
          <Button 
            className="w-full sm:w-auto bg-white text-[#0ea5e9] hover:bg-gray-50 h-16 px-12 rounded-full text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl group"
            size="lg"
          >
            Get Free Quote
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
          <a href={`tel:${phone.replace(/\D/g, '')}`} className="w-full sm:w-auto">
            <Button 
              className="w-full sm:w-auto bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 border-2 border-white/30 h-16 px-12 rounded-full text-lg transition-all duration-300 hover:scale-105"
              size="lg"
            >
              <Phone className="w-5 h-5 mr-2" />
              Call {phone}
            </Button>
          </a>
        </div>

        {/* Trust Reinforcement */}
        <div className="flex flex-wrap justify-center gap-8 text-white/90 mb-8">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-white" />
            <span>Licensed & Insured</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-white" />
            <span>500+ Projects</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-white" />
            <span>15+ Years Experience</span>
          </div>
        </div>

        {/* Optional Urgency Banner */}
        <div className="inline-block bg-[#f59e0b] text-white px-8 py-3 rounded-full">
          📅 Book This Month for Spring Installation
        </div>
      </div>
    </section>
  );
}
