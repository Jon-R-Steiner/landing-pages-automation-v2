import { Button } from "./ui/button";
import { Shield, Calendar, Star, Phone } from "lucide-react";

interface TrustBarProps {
  phone?: string;
  license?: string;
  yearsExperience?: string;
  rating?: string;
  reviewCount?: string;
}

export function TrustBar({
  phone = "(216) 555-1234",
  license = "IL #123456",
  yearsExperience = "15 Years Experience",
  rating = "4.9",
  reviewCount = "127"
}: TrustBarProps) {
  return (
    <>
      {/* Desktop Trust Bar */}
      <div className="hidden md:block sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-8">
          <div className="h-[80px] grid grid-cols-4 items-center divide-x divide-gray-100">
            <div className="flex items-center justify-center gap-3 px-4">
              <div className="w-10 h-10 rounded-xl bg-[#0ea5e9]/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-[#0ea5e9]" />
              </div>
              <div>
                <div className="text-xs text-[#6b7280]">Licensed</div>
                <div className="text-sm text-[#1f2937]">{license}</div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 px-4">
              <div className="w-10 h-10 rounded-xl bg-[#8b5cf6]/10 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-[#8b5cf6]" />
              </div>
              <div>
                <div className="text-xs text-[#6b7280]">Experience</div>
                <div className="text-sm text-[#1f2937]">{yearsExperience}</div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 px-4">
              <div className="w-10 h-10 rounded-xl bg-[#f59e0b]/10 flex items-center justify-center">
                <Star className="w-5 h-5 text-[#f59e0b] fill-[#f59e0b]" />
              </div>
              <div>
                <div className="text-xs text-[#6b7280]">Rating</div>
                <div className="text-sm text-[#1f2937]">{rating} ({reviewCount})</div>
              </div>
            </div>
            <div className="flex items-center justify-center px-4">
              <a href={`tel:${phone.replace(/\D/g, '')}`} className="w-full">
                <Button className="bg-[#0ea5e9] hover:bg-[#0284c7] text-white h-12 px-6 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg group w-full">
                  <Phone className="w-4 h-4 mr-2" />
                  Call Now
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Button */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 p-4 bg-white/80 backdrop-blur-xl border-t border-gray-100">
        <a href={`tel:${phone.replace(/\D/g, '')}`}>
          <Button className="w-full bg-[#0ea5e9] hover:bg-[#0284c7] text-white h-14 rounded-full active:scale-95 transition-all duration-150 group">
            <Phone className="w-5 h-5 mr-2" />
            Call Now: {phone}
          </Button>
        </a>
      </div>
    </>
  );
}
