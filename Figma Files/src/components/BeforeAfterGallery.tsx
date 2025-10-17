import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ArrowRight } from "lucide-react";

const projects = [
  {
    before: "https://images.unsplash.com/photo-1664227430687-9299c593e3da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXRocm9vbSUyMHJlbm92YXRpb24lMjBiZWZvcmV8ZW58MXx8fHwxNzYwNjI2OTY2fDA&ixlib=rb-4.1.0&q=80&w=1080",
    after: "https://images.unsplash.com/photo-1651442897558-47cff0f64bd9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXRocm9vbSUyMHJlbm92YXRpb24lMjBhZnRlciUyMG1vZGVybnxlbnwxfHx8fDE3NjA2MjY5NjZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    caption: "Lincoln Park Master Bath",
    year: "2023"
  },
  {
    before: "https://images.unsplash.com/photo-1664227430687-9299c593e3da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXRocm9vbSUyMHJlbm92YXRpb24lMjBiZWZvcmV8ZW58MXx8fHwxNzYwNjI2OTY2fDA&ixlib=rb-4.1.0&q=80&w=1080",
    after: "https://images.unsplash.com/photo-1758548157466-7c454382035a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBiYXRocm9vbSUyMHJlbW9kZWwlMjBsdXh1cnl8ZW58MXx8fHwxNzYwNjI2OTY1fDA&ixlib=rb-4.1.0&q=80&w=1080",
    caption: "Oak Park Guest Bath",
    year: "2024"
  },
  {
    before: "https://images.unsplash.com/photo-1664227430687-9299c593e3da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXRocm9vbSUyMHJlbm92YXRpb24lMjBiZWZvcmV8ZW58MXx8fHwxNzYwNjI2OTY2fDA&ixlib=rb-4.1.0&q=80&w=1080",
    after: "https://images.unsplash.com/photo-1651442897558-47cff0f64bd9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXRocm9vbSUyMHJlbm92YXRpb24lMjBhZnRlciUyMG1vZGVybnxlbnwxfHx8fDE3NjA2MjY5NjZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    caption: "Naperville Full Renovation",
    year: "2023"
  }
];

interface BeforeAfterGalleryProps {
  city?: string;
}

export function BeforeAfterGallery({ city = "Chicago" }: BeforeAfterGalleryProps) {
  return (
    <section className="bg-gradient-to-b from-[#f9fafb] to-white px-4 py-24 lg:py-32">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-block mb-4 px-4 py-2 bg-[#8b5cf6]/10 rounded-full text-sm text-[#8b5cf6] uppercase tracking-wider">
            Our Work
          </div>
          <h2 className="text-[40px] lg:text-[56px] mb-6 text-[#1f2937] leading-tight tracking-tight">
            Transformations<br />in {city}
          </h2>
        </div>

        {/* Projects Grid */}
        <div className="space-y-16 mb-16">
          {projects.map((project, index) => (
            <div key={index} className="group">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                {/* Before */}
                <div className="relative overflow-hidden rounded-3xl">
                  <ImageWithFallback
                    src={project.before}
                    alt="Before bathroom remodel"
                    className="w-full aspect-[4/3] object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full text-sm text-[#1f2937]">
                    Before
                  </div>
                </div>

                {/* After */}
                <div className="relative overflow-hidden rounded-3xl shadow-2xl">
                  <ImageWithFallback
                    src={project.after}
                    alt="After bathroom remodel"
                    className="w-full aspect-[4/3] object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-6 left-6 bg-[#0ea5e9] px-4 py-2 rounded-full text-sm text-white">
                    After
                  </div>
                  <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm p-6 rounded-2xl">
                    <div className="text-xl text-[#1f2937] mb-1">{project.caption}</div>
                    <div className="text-sm text-[#6b7280]">{project.year}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button className="bg-[#8b5cf6] hover:bg-[#7c3aed] text-white h-14 px-10 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-xl group">
            View More Projects
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
}
