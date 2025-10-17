import { Button } from "./ui/button";
import { Shield, DollarSign, Calendar, ArrowRight, Check } from "lucide-react";

const benefits = [
  {
    title: "Licensed & Insured",
    description: "Fully licensed and carry $2M liability insurance. Every contractor is background-checked, certified, and trained in the latest remodeling techniques.",
    icon: Shield,
    badge: "IL License #123456",
    features: ["$2M Liability Coverage", "Background Checked", "Code Compliant"]
  },
  {
    title: "Fixed-Price Quotes",
    description: "No surprises. Your quote is your final price, guaranteed. Detailed, itemized estimates before starting work.",
    icon: DollarSign,
    badge: "Price Match Guarantee",
    features: ["No Hidden Fees", "Itemized Breakdown", "Price Guarantee"]
  },
  {
    title: "15+ Years Experience",
    description: "Over 500 bathrooms remodeled since 2008. Our veteran team brings decades of combined expertise to every project.",
    icon: Calendar,
    badge: "500+ Projects",
    features: ["15 Years in Business", "Expert Team", "Quality Craftsmanship"]
  }
];

export function BenefitsSection() {
  return (
    <section className="relative bg-[#1f2937] px-4 py-24 lg:py-32 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '48px 48px'
        }} />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-block mb-4 px-4 py-2 bg-[#f59e0b]/20 rounded-full text-sm text-[#f59e0b] uppercase tracking-wider">
            Why Choose Us
          </div>
          <h2 className="text-[40px] lg:text-[56px] mb-6 text-white leading-tight tracking-tight">
            Experience the<br />ABC Difference
          </h2>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            const colors = ['#0ea5e9', '#8b5cf6', '#f59e0b'];
            const bgColors = ['bg-[#0ea5e9]', 'bg-[#8b5cf6]', 'bg-[#f59e0b]'];
            return (
              <div 
                key={index} 
                className="group relative bg-white/5 backdrop-blur-sm p-8 rounded-3xl border border-white/10 hover:border-white/30 transition-all duration-500 hover:-translate-y-2"
              >
                <div className={`w-16 h-16 rounded-2xl ${bgColors[index]} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-2xl text-white mb-3">{benefit.title}</h3>
                <p className="text-gray-300 mb-6 leading-relaxed">{benefit.description}</p>
                
                <div className="space-y-2 mb-6">
                  {benefit.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Check className="w-4 h-4" style={{ color: colors[index] }} />
                      <span className="text-sm text-gray-400">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="inline-block px-4 py-2 bg-white/10 rounded-full text-sm text-white">
                  {benefit.badge}
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button className="bg-[#f59e0b] hover:bg-[#d97706] text-white h-14 px-10 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-2xl group">
            Get Free Quote
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
}
