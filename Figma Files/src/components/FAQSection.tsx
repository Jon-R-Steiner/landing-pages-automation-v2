import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

const faqs = [
  {
    question: "How much does a typical bathroom remodel cost?",
    answer: "Our projects typically range from $8,000-$25,000 depending on scope, size, and materials. A basic refresh (new fixtures, paint, flooring) starts around $8,000-$12,000. A mid-range remodel (new tile, vanity, tub/shower replacement) runs $12,000-$18,000. Full luxury renovations with premium materials can reach $20,000-$25,000+. We provide detailed, itemized quotes so you know exactly what you're paying for."
  },
  {
    question: "How long will my bathroom remodel take?",
    answer: "Most bathroom remodels take 2-3 weeks from start to finish. Simple updates (1-2 fixtures) can be completed in 5-7 days. Full renovations requiring plumbing/electrical work typically take 2-3 weeks. We provide a detailed timeline during your consultation and communicate daily to keep you informed of progress."
  },
  {
    question: "Do I need permits for my bathroom remodel?",
    answer: "Yes, most bathroom remodels require permits for plumbing, electrical, and structural work. We handle all permit applications and inspections as part of our service - it's included in your quote. Working without permits can result in fines and issues when selling your home. Rest assured, we follow all local building codes and regulations."
  },
  {
    question: "What warranty do you offer on your work?",
    answer: "We provide a comprehensive 2-year labor warranty and pass through all manufacturer warranties on materials (typically 5-10 years on fixtures). If anything goes wrong due to our workmanship, we'll fix it at no charge. We also offer ongoing maintenance advice to help you protect your investment."
  },
  {
    question: "What payment options do you accept?",
    answer: "We accept cash, checks, credit cards (Visa/MC/Amex), and financing through our partner lenders. For larger projects, we typically require a 30% deposit to order materials, 40% at the midpoint, and final 30% upon completion. We never ask for full payment upfront and offer flexible financing options for qualified homeowners."
  },
  {
    question: "What areas do you serve?",
    answer: "We proudly serve Cleveland and all surrounding suburbs within a 30-mile radius, including Lincoln Park, Oak Park, Naperville, Evanston, Skokie, and more. If you're not sure whether we service your area, just give us a call - we're always happy to help and can often accommodate special requests."
  },
  {
    question: "Will I be able to use my bathroom during the remodel?",
    answer: "Unfortunately, the bathroom being remodeled will be out of service during construction. However, we work efficiently to minimize disruption and can often complete projects in stages if you have multiple bathrooms. We recommend planning ahead and discussing your specific needs during the consultation."
  },
  {
    question: "Do you offer design services?",
    answer: "Yes! Our design consultation is included free with every project. We'll help you select tiles, fixtures, colors, and layouts that match your style and budget. We also provide 3D renderings so you can visualize the finished space before we start. Our team stays current with the latest trends while respecting timeless design principles."
  }
];

export function FAQSection() {
  return (
    <section className="bg-gradient-to-b from-white to-[#f9fafb] px-4 py-24 lg:py-32">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block mb-4 px-4 py-2 bg-[#8b5cf6]/10 rounded-full text-sm text-[#8b5cf6] uppercase tracking-wider">
            FAQ
          </div>
          <h2 className="text-[40px] lg:text-[56px] mb-6 text-[#1f2937] leading-tight tracking-tight">
            Questions &<br />Answers
          </h2>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="bg-white border border-gray-100 rounded-2xl px-8 py-2 hover:border-[#0ea5e9]/30 hover:shadow-lg transition-all duration-300"
            >
              <AccordionTrigger className="text-left text-lg text-[#1f2937] hover:text-[#0ea5e9] py-6">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-[#6b7280] pb-6 leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
