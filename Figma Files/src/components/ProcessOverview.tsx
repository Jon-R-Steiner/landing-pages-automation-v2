import { ArrowRight } from "lucide-react";

const steps = [
  {
    number: 1,
    title: "Free Consultation",
    description: "We visit your home to assess your bathroom, discuss your vision, and answer all your questions. No pressure, no obligation.",
    timeline: "30-45 min"
  },
  {
    number: 2,
    title: "Custom Design",
    description: "We create a detailed design plan with 3D renderings and provide a fixed-price quote that includes everything.",
    timeline: "3-5 days"
  },
  {
    number: 3,
    title: "Installation",
    description: "Our licensed team handles all work from demolition to finishing. We keep your home clean and communicate daily.",
    timeline: "1-2 weeks"
  },
  {
    number: 4,
    title: "Final Review",
    description: "We conduct a thorough inspection, ensuring every detail meets your expectations with our comprehensive warranty.",
    timeline: "1 hour"
  }
];

export function ProcessOverview() {
  return (
    <section className="bg-white px-4 py-24 lg:py-32">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-block mb-4 px-4 py-2 bg-[#0ea5e9]/10 rounded-full text-sm text-[#0ea5e9] uppercase tracking-wider">
            Our Process
          </div>
          <h2 className="text-[40px] lg:text-[56px] mb-6 text-[#1f2937] leading-tight tracking-tight">
            How It Works
          </h2>
          <p className="text-xl text-[#6b7280] max-w-2xl mx-auto">
            From call to completion in 4 simple steps
          </p>
        </div>

        {/* Desktop Timeline */}
        <div className="hidden lg:grid grid-cols-4 gap-8 mb-16 relative">
          {/* Connecting Line */}
          <div className="absolute top-12 left-[12.5%] right-[12.5%] h-1 bg-gradient-to-r from-[#0ea5e9] via-[#8b5cf6] to-[#f59e0b]" />
          
          {steps.map((step, index) => {
            const colors = ['#0ea5e9', '#8b5cf6', '#f59e0b', '#0ea5e9'];
            const bgColors = ['bg-[#0ea5e9]', 'bg-[#8b5cf6]', 'bg-[#f59e0b]', 'bg-[#0ea5e9]'];
            return (
              <div key={index} className="flex flex-col items-center text-center relative">
                <div className={`w-24 h-24 rounded-3xl ${bgColors[index]} text-white flex items-center justify-center mb-6 relative z-10 shadow-xl`}>
                  <span className="text-3xl">{step.number}</span>
                </div>
                <h3 className="text-2xl text-[#1f2937] mb-3">{step.title}</h3>
                <p className="text-[#6b7280] mb-4 leading-relaxed">{step.description}</p>
                <div className="inline-block px-4 py-2 rounded-full text-sm" style={{ backgroundColor: `${colors[index]}20`, color: colors[index] }}>
                  {step.timeline}
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile Timeline */}
        <div className="lg:hidden space-y-6 mb-16">
          {steps.map((step, index) => {
            const colors = ['#0ea5e9', '#8b5cf6', '#f59e0b', '#0ea5e9'];
            const bgColors = ['bg-[#0ea5e9]', 'bg-[#8b5cf6]', 'bg-[#f59e0b]', 'bg-[#0ea5e9]'];
            return (
              <div key={index} className="flex gap-6 items-start">
                <div className="flex flex-col items-center">
                  <div className={`w-16 h-16 rounded-2xl ${bgColors[index]} text-white flex items-center justify-center flex-shrink-0 shadow-lg`}>
                    <span className="text-2xl">{step.number}</span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="w-1 flex-1 mt-3" style={{ background: `linear-gradient(to bottom, ${colors[index]}, ${colors[index + 1]})`, minHeight: '40px' }} />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl text-[#1f2937] mb-2">{step.title}</h3>
                  <p className="text-[#6b7280] mb-3 leading-relaxed">{step.description}</p>
                  <div className="inline-block px-3 py-1 rounded-full text-sm" style={{ backgroundColor: `${colors[index]}20`, color: colors[index] }}>
                    {step.timeline}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="text-center bg-gradient-to-br from-[#f9fafb] to-white p-8 rounded-3xl border border-gray-100">
          <div className="inline-block px-6 py-3 bg-[#0ea5e9]/10 rounded-full text-[#0ea5e9] mb-2">
            Average Timeline
          </div>
          <p className="text-2xl text-[#1f2937] mt-4">
            Most projects: <strong className="text-[#0ea5e9]">2-3 weeks</strong> from start to finish
          </p>
        </div>
      </div>
    </section>
  );
}
