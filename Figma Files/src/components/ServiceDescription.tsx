import { Button } from "./ui/button";
import { Droplet, Sparkles, Grid3x3, Accessibility, Wrench, Bath, ArrowRight } from "lucide-react";

const services = [
  { name: "Walk-In Showers", icon: Droplet, color: "bg-[#0ea5e9]" },
  { name: "Custom Vanities", icon: Sparkles, color: "bg-[#8b5cf6]" },
  { name: "Tile & Flooring", icon: Grid3x3, color: "bg-[#f59e0b]" },
  { name: "Accessibility", icon: Accessibility, color: "bg-[#0ea5e9]" },
  { name: "Full Renovations", icon: Wrench, color: "bg-[#8b5cf6]" },
  { name: "Tub Conversions", icon: Bath, color: "bg-[#f59e0b]" }
];

interface ServiceDescriptionProps {
  city?: string;
}

export function ServiceDescription({ city = "Chicago" }: ServiceDescriptionProps) {
  return (
    <section className="px-4 py-24 lg:py-32 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-block mb-4 px-4 py-2 bg-[#0ea5e9]/10 rounded-full text-sm text-[#0ea5e9] uppercase tracking-wider">
            Our Services
          </div>
          <h2 className="text-[40px] lg:text-[56px] mb-6 text-[#1f2937] leading-tight tracking-tight max-w-3xl mx-auto">
            Professional Bathroom Remodeling in {city}
          </h2>
          
          <p className="text-xl text-[#6b7280] max-w-2xl mx-auto leading-relaxed">
            From modern walk-in showers to elegant custom vanities, we handle every aspect 
            of your bathroom remodel with precision and care.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 lg:gap-8 mb-16">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div 
                key={index} 
                className="group relative bg-gradient-to-br from-white to-[#f9fafb] p-8 rounded-3xl border border-gray-100 hover:border-[#0ea5e9]/30 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2"
              >
                <div className={`w-16 h-16 rounded-2xl ${service.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg text-[#1f2937]">{service.name}</h3>
                <div className="absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowRight className="w-5 h-5 text-[#0ea5e9]" />
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button className="bg-[#0ea5e9] hover:bg-[#0284c7] text-white h-14 px-10 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-xl group">
            Get Free Quote
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
}
