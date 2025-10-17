import { Phone, Mail, MapPin } from "lucide-react";

const quickLinks = [
  { name: "Privacy Policy", href: "#" },
  { name: "Terms of Service", href: "#" },
  { name: "Sitemap", href: "#" }
];

const serviceAreas = [
  "Chicago",
  "Naperville",
  "Oak Park",
  "Evanston",
  "Skokie",
  "Arlington Heights",
  "Schaumburg",
  "Palatine"
];

interface FooterProps {
  phone?: string;
  email?: string;
  address?: string;
}

export function Footer({
  phone = "(216) 555-1234",
  email = "info@abcremodeling.com",
  address = "123 Main St, Suite 100, Chicago, IL 60601"
}: FooterProps) {
  return (
    <footer className="bg-[#1f2937] text-white px-4 py-16 lg:px-8 lg:py-20">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Column 1: Logo & Tagline */}
          <div>
            <div className="text-[#0ea5e9] mb-6">
              <svg width="180" height="45" viewBox="0 0 180 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="45" height="45" rx="10" fill="currentColor"/>
                <text x="55" y="32" fill="currentColor" className="text-xl">ABC Remodeling</text>
              </svg>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Transforming bathrooms across Chicago since 2008. Licensed, insured, and committed to excellence.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-lg mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-gray-400 hover:text-[#0ea5e9] transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div>
            <h3 className="text-lg mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#0ea5e9]/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-[#0ea5e9]" />
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Phone</div>
                  <a href={`tel:${phone.replace(/\D/g, '')}`} className="text-gray-300 hover:text-white transition-colors">
                    {phone}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#0ea5e9]/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-[#0ea5e9]" />
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Email</div>
                  <a href={`mailto:${email}`} className="text-gray-300 hover:text-white transition-colors break-all">
                    {email}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#0ea5e9]/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-[#0ea5e9]" />
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Address</div>
                  <span className="text-gray-300">{address}</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Column 4: Service Areas */}
          <div>
            <h3 className="text-lg mb-6">Service Areas</h3>
            <ul className="space-y-2">
              {serviceAreas.map((area, index) => (
                <li key={index} className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                  {area}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500">
            © 2024 ABC Remodeling. All rights reserved.
          </p>
          <a href="#" className="text-gray-500 hover:text-[#0ea5e9] transition-colors">
            TCPA Disclaimer
          </a>
        </div>
      </div>
    </footer>
  );
}
