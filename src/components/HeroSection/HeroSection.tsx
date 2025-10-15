import Image from 'next/image'
import type { HeroData, BrandingData } from '@/types/content-data'
import CTAButton from './CTAButton'

interface HeroSectionProps {
  hero: HeroData
  branding: BrandingData
}

/**
 * HeroSection Component
 *
 * Above-the-fold hero section with:
 * - Dynamic branding (colors, fonts)
 * - Responsive design (320px, 768px, 1440px breakpoints)
 * - LCP-optimized hero image (priority loading, AVIF/WebP/JPEG)
 * - Accessible CTA buttons (44×44px touch targets, ARIA labels)
 * - Primary and optional secondary CTAs
 *
 * Performance targets: LCP <500ms, CLS = 0
 */
export default function HeroSection({ hero, branding }: HeroSectionProps) {
  return (
    <section
      className="relative w-full"
      style={
        {
          '--brand-primary': branding.primaryColor,
          '--brand-secondary': branding.secondaryColor,
        } as React.CSSProperties
      }
    >
      <div className="grid grid-cols-1 gap-8 max-w-7xl mx-auto px-4 py-12 md:grid-cols-2 md:gap-12 md:py-16 xl:gap-16 xl:py-20">
        {/* Text Content */}
        <div className="flex flex-col justify-center">
          <h1
            className="text-4xl font-bold mb-4 md:text-5xl xl:text-6xl"
            style={{ color: 'var(--brand-primary)' }}
          >
            {hero.h1Headline}
          </h1>

          <p className="text-lg text-gray-700 mb-8 md:text-xl">
            {hero.subheadline}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <CTAButton cta={hero.primaryCta} variant="primary" />
            {hero.secondaryCta && (
              <CTAButton cta={hero.secondaryCta} variant="secondary" />
            )}
          </div>
        </div>

        {/* Hero Image */}
        {hero.imageUrl && (
          <div className="relative h-64 md:h-96 xl:h-[500px]">
            <Image
              src={hero.imageUrl}
              alt={hero.imageAlt}
              fill
              priority
              className="object-cover rounded-lg"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        )}
      </div>
    </section>
  )
}
