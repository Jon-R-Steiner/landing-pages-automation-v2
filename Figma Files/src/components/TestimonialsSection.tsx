import { Card, CardContent } from "./ui/card";
import { Star, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";

const testimonials = [
  {
    name: "Sarah M.",
    location: "Lincoln Park",
    rating: 5,
    text: "ABC Remodeling completely transformed our outdated master bath into a stunning spa-like retreat. The team was professional, punctual, and incredibly detail-oriented. They finished on time and stayed within budget. I couldn't be happier with the results!",
    initials: "SM",
    photo: "https://images.unsplash.com/photo-1585236872545-fd32ccef4c41?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMGhvbWVvd25lciUyMHdvbWFufGVufDF8fHx8MTc2MDYyNjk2N3ww&ixlib=rb-4.1.0&q=80&w=1080"
  },
  {
    name: "Robert J.",
    location: "Oak Park",
    rating: 5,
    text: "After getting quotes from 5 different contractors, ABC stood out for their transparency and professionalism. They guided us through every decision, from tile selection to fixture placement. The walk-in shower they installed is absolutely beautiful and makes our bathroom so much more accessible.",
    initials: "RJ",
    photo: "https://images.unsplash.com/photo-1703759354716-b777fd195508?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXN0b21lciUyMHBvcnRyYWl0JTIwbWFufGVufDF8fHx8MTc2MDYyNjk2N3ww&ixlib=rb-4.1.0&q=80&w=1080"
  },
  {
    name: "Jennifer K.",
    location: "Naperville",
    rating: 5,
    text: "We were nervous about remodeling during the pandemic, but ABC made the process stress-free. They maintained excellent communication, kept the work area clean, and delivered exactly what they promised. Our new bathroom is gorgeous and has already increased our home's value significantly.",
    initials: "JK",
    photo: "https://images.unsplash.com/photo-1722876720000-f39b65b7d4a1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBjb250cmFjdG9yJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzYwNjE0MjkxfDA&ixlib=rb-4.1.0&q=80&w=1080"
  }
];

const badges = [
  { name: "Google Reviews", logo: "⭐" },
  { name: "BBB A+", logo: "🏆" },
  { name: "Angi", logo: "✓" }
];

interface TestimonialsSectionProps {
  city?: string;
}

export function TestimonialsSection({ city = "Cleveland" }: TestimonialsSectionProps) {
  return (
    <section className="bg-white px-4 py-16 lg:px-8 lg:py-24">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-[28px] lg:text-[36px] text-center mb-4 text-[#1f2937]">
          What Our {city} Customers Say
        </h2>

        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 text-xl">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 text-[#f59e0b] fill-[#f59e0b]" />
              ))}
            </div>
            <span className="text-[#1f2937]">4.9/5 Average Rating (127 Reviews)</span>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-white shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center mb-4">
                  <div className="w-20 h-20 rounded-full bg-[#0ea5e9] flex items-center justify-center text-white mb-3 overflow-hidden">
                    <img 
                      src={testimonial.photo} 
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-[#1f2937] mb-1">
                    {testimonial.name}, {testimonial.location}
                  </h3>
                  <div className="flex gap-1 mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-[#f59e0b] fill-[#f59e0b]" />
                    ))}
                  </div>
                </div>
                <p className="text-[#6b7280] italic">"{testimonial.text}"</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="flex justify-center items-center gap-8 mb-8">
          {badges.map((badge, index) => (
            <div key={index} className="flex items-center gap-2 text-gray-500">
              <span className="text-2xl">{badge.logo}</span>
              <span>{badge.name}</span>
            </div>
          ))}
        </div>

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
