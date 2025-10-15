# Component Data Contracts for Dev Agent

**Purpose:** Define what data each React component receives from content.json

**Audience:** Dev Agent (for component implementation)

**Last Updated:** 2025-10-14
**Phase:** Epic 0 Phase 0.4 - Content Enhancement

---

## Overview

All components receive data from the **EnhancedPageData** structure exported to `content.json`.

**Data Flow:**
```
Airtable (3 tables)
  → export script
  → content.json
  → page.tsx (Next.js)
  → Components (props)
```

**TypeScript Types:**
- Defined in: `src/types/content-data.ts`
- Import: `import type { EnhancedPageData, HeroData, etc. } from '@/types/content-data'`

---

## 1. HeroSection Component

### Purpose
Display hero section with headline, subheadline, hero image, dual CTAs, and trust signals.

### Props Interface

```typescript
import type { HeroData, TrustBarData, BrandingData } from '@/types/content-data'

interface HeroSectionProps {
  hero: HeroData
  trustBar: TrustBarData
  branding: BrandingData
}
```

### Data Structure

```typescript
// props.hero
{
  h1Headline: string        // e.g., "Professional Bathroom Remodeling in Strongsville"
  subheadline: string       // e.g., "Licensed, insured contractors with 15+ years..."
  imageUrl: string          // e.g., "https://res.cloudinary.com/.../hero.jpg"
  imageAlt: string          // e.g., "Modern bathroom remodel in Strongsville, Ohio"
  primaryCta: {
    text: string            // e.g., "Get Free Quote"
    actionType: 'phone' | 'form' | 'link'
    actionValue: string     // e.g., "tel:(330) 555-1234" or "#contact-form"
  }
}

// props.trustBar
{
  signals: string[]         // e.g., ["Licensed OH #123456", "15+ Years", "⭐ 4.9/5", "500+ Projects"]
}

// props.branding
{
  primaryColor: string      // e.g., "#0ea5e9"
  secondaryColor: string    // e.g., "#8b5cf6"
  logoUrl: string          // e.g., "https://bathsrus.com/logo.svg"
  googleFonts: string      // e.g., "Inter"
}
```

### Usage Example

```tsx
// src/components/HeroSection.tsx
import type { HeroSectionProps } from '@/types/component-props'

export function HeroSection({ hero, trustBar, branding }: HeroSectionProps) {
  return (
    <section className="hero" style={{
      '--primary-color': branding.primaryColor,
      '--secondary-color': branding.secondaryColor,
    }}>
      <h1>{hero.h1Headline}</h1>
      <p>{hero.subheadline}</p>

      {hero.imageUrl && (
        <img src={hero.imageUrl} alt={hero.imageAlt} />
      )}

      <a href={hero.primaryCta.actionValue}>
        {hero.primaryCta.text}
      </a>

      <div className="trust-signals">
        {trustBar.signals.map((signal, i) => (
          <span key={i}>{signal}</span>
        ))}
      </div>
    </section>
  )
}
```

### Branding Application

**CSS Custom Properties:**
```css
/* Apply branding colors dynamically */
.hero {
  background: linear-gradient(to right, var(--primary-color), var(--secondary-color));
}

.cta-button {
  background-color: var(--primary-color);
}
```

**Fonts:**
```tsx
// Load Google Fonts dynamically in page.tsx
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })
// Use branding.googleFonts to determine which font to load
```

---

## 2. TrustBar Component

### Purpose
Persistent trust signals bar (optional sticky) with license, years, rating, phone.

### Props Interface

```typescript
interface TrustBarProps {
  signals: string[]
  phone: string
  sticky?: boolean
}
```

### Data Structure

```typescript
// props.signals (from page.trustBar.signals)
[
  "Licensed OH #123456",
  "15+ Years Experience",
  "⭐ 4.9/5 Rating",
  "500+ Projects Completed",
  "$2M Insured"
]

// props.phone (from page.branch.phone)
"(330) 555-1234"

// props.sticky (optional, default false)
true | false
```

### Usage Example

```tsx
// src/components/TrustBar.tsx
export function TrustBar({ signals, phone, sticky = false }: TrustBarProps) {
  return (
    <div className={`trust-bar ${sticky ? 'sticky' : ''}`}>
      {signals.map((signal, i) => (
        <div key={i} className="trust-signal">
          {signal}
        </div>
      ))}

      <a href={`tel:${phone.replace(/\D/g, '')}`} className="phone-cta">
        📞 {phone}
      </a>
    </div>
  )
}
```

### Mobile Optimization

On mobile (<768px), trust bar should:
- Condense to show only phone number
- Become sticky on scroll
- Have large tap target (48x48px minimum)

---

## 3. BenefitsGrid Component

### Purpose
Display 3-5 key benefits with icons, titles, and descriptions.

### Props Interface

```typescript
import type { BenefitItem } from '@/types/content-data'

interface BenefitsGridProps {
  benefits: BenefitItem[]
}
```

### Data Structure

```typescript
// props.benefits (from page.content.benefits)
[
  {
    title: "Licensed & Insured",
    description: "Full Ohio licensing and $2M liability insurance for your protection.",
    icon: "shield"  // optional icon name
  },
  {
    title: "Fast Turnaround",
    description: "Most bathroom remodels completed in 2-3 weeks, not months.",
    icon: "clock"
  },
  {
    title: "Quality Guarantee",
    description: "Lifetime warranty on craftsmanship, 10-year warranty on materials.",
    icon: "check-circle"
  }
]
```

### Usage Example

```tsx
// src/components/BenefitsGrid.tsx
export function BenefitsGrid({ benefits }: BenefitsGridProps) {
  return (
    <section className="benefits-grid">
      <h2>Why Choose Us</h2>

      <div className="grid">
        {benefits.map((benefit, i) => (
          <div key={i} className="benefit-card">
            {benefit.icon && <Icon name={benefit.icon} />}
            <h3>{benefit.title}</h3>
            <p>{benefit.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
```

### Layout

- **Desktop:** 3 columns (or 2 if only 4 benefits)
- **Tablet:** 2 columns
- **Mobile:** 1 column (vertical stack)

---

## 4. ProcessTimeline Component

### Purpose
Visual timeline showing 4-5 steps from consultation to completion.

### Props Interface

```typescript
import type { ProcessStep } from '@/types/content-data'

interface ProcessTimelineProps {
  steps: ProcessStep[]
}
```

### Data Structure

```typescript
// props.steps (from page.content.processSteps)
[
  {
    stepNumber: 1,
    title: "Free Consultation",
    description: "We meet at your home to discuss your vision and take measurements.",
    timeline: "Day 1"  // optional
  },
  {
    stepNumber: 2,
    title: "Design & Quote",
    description: "Receive detailed 3D design and transparent pricing within 48 hours.",
    timeline: "Days 2-3"
  },
  {
    stepNumber: 3,
    title: "Material Selection",
    description: "Choose fixtures, tiles, and finishes from our showroom.",
    timeline: "Week 1"
  },
  {
    stepNumber: 4,
    title: "Installation",
    description: "Our licensed team completes your remodel with minimal disruption.",
    timeline: "Weeks 2-3"
  },
  {
    stepNumber: 5,
    title: "Final Walkthrough",
    description: "Inspect completed work and receive care instructions.",
    timeline: "Week 3"
  }
]
```

### Usage Example

```tsx
// src/components/ProcessTimeline.tsx
export function ProcessTimeline({ steps }: ProcessTimelineProps) {
  return (
    <section className="process-timeline">
      <h2>Our Process</h2>

      <div className="timeline">
        {steps.map((step) => (
          <div key={step.stepNumber} className="timeline-step">
            <div className="step-number">{step.stepNumber}</div>
            <div className="step-content">
              <h3>{step.title}</h3>
              {step.timeline && <span className="timeline-badge">{step.timeline}</span>}
              <p>{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
```

### Visual Design

- **Desktop:** Horizontal timeline with connecting line
- **Mobile:** Vertical timeline with vertical connecting line
- Step numbers in circles with brand color background

---

## 5. TestimonialCard Component

### Purpose
Display customer testimonials with ratings, names, and locations.

### Props Interface

```typescript
import type { TestimonialItem } from '@/types/content-data'

interface TestimonialCardProps {
  testimonial: TestimonialItem
}

interface TestimonialsGridProps {
  testimonials: TestimonialItem[]
  aggregateRating: number
  totalReviews: number
}
```

### Data Structure

```typescript
// Single testimonial
{
  customerName: "Sarah M.",         // e.g., "Sarah M." (last initial for privacy)
  city: "Strongsville",
  state: "OH",
  rating: 5,                        // 1-5
  reviewTitle: "Amazing transformation!",
  reviewText: "The Medina team completed our master bath remodel in just 2.5 weeks...",
  reviewDate: "2024-11-15",
  source: "Google"                  // Google, Yelp, Facebook, Direct
}

// Full social proof data (from page.socialProof)
{
  testimonials: TestimonialItem[],  // Top 5 filtered testimonials
  aggregateRating: 4.9,             // Average of all testimonial ratings
  totalReviews: 127                 // Count of all testimonials
}
```

### Usage Example

```tsx
// src/components/TestimonialCard.tsx
export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <div className="testimonial-card">
      <div className="rating">
        {'⭐'.repeat(testimonial.rating)}
      </div>

      {testimonial.reviewTitle && (
        <h4>{testimonial.reviewTitle}</h4>
      )}

      <p className="review-text">{testimonial.reviewText}</p>

      <div className="reviewer">
        <span className="name">{testimonial.customerName}</span>
        <span className="location">
          {testimonial.city}, {testimonial.state}
        </span>
        <span className="source">{testimonial.source} Review</span>
      </div>
    </div>
  )
}

// src/components/TestimonialsGrid.tsx
export function TestimonialsGrid({ testimonials, aggregateRating, totalReviews }: TestimonialsGridProps) {
  return (
    <section className="testimonials">
      <div className="section-header">
        <h2>What Our Customers Say</h2>
        <div className="aggregate-rating">
          <span className="rating-number">{aggregateRating}</span>
          <span className="stars">{'⭐'.repeat(Math.round(aggregateRating))}</span>
          <span className="review-count">({totalReviews} reviews)</span>
        </div>
      </div>

      <div className="testimonials-grid">
        {testimonials.map((testimonial, i) => (
          <TestimonialCard key={i} testimonial={testimonial} />
        ))}
      </div>
    </section>
  )
}
```

### Layout

- **Desktop:** 2-3 column grid
- **Mobile:** Single column carousel/slider (optional)
- Show 5 testimonials maximum per page

---

## 6. FAQAccordion Component

### Purpose
Expandable Q&A section for common questions (SEO-friendly).

### Props Interface

```typescript
import type { FAQItem } from '@/types/content-data'

interface FAQAccordionProps {
  faqs: FAQItem[]
}
```

### Data Structure

```typescript
// props.faqs (from page.content.faqs - AI-generated JSON)
[
  {
    question: "How long does a bathroom remodel take?",
    answer: "Most bathroom remodels take 2-3 weeks from start to finish. The timeline depends on the scope of work, material availability, and any structural changes required."
  },
  {
    question: "Do you handle permits and inspections?",
    answer: "Yes, we manage all required permits and coordinate inspections with local authorities. This is included in our service at no additional cost."
  },
  {
    question: "What is included in your warranty?",
    answer: "We offer a lifetime warranty on craftsmanship and a 10-year warranty on materials. Any installation defects are covered for the life of your ownership."
  },
  {
    question: "Can I stay in my home during the remodel?",
    answer: "Yes! We work efficiently to minimize disruption. Most clients stay in their homes during bathroom remodels. We'll coordinate to ensure you have access to facilities."
  },
  {
    question: "How much does a bathroom remodel cost?",
    answer: "Bathroom remodels typically range from $8,000 to $25,000 depending on size, materials, and scope. We provide detailed quotes after a free consultation."
  }
]
```

### Usage Example

```tsx
// src/components/FAQAccordion.tsx
'use client'

import { useState } from 'react'

export function FAQAccordion({ faqs }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="faq-section">
      <h2>Frequently Asked Questions</h2>

      <div className="faq-accordion">
        {faqs.map((faq, index) => (
          <div key={index} className="faq-item">
            <button
              className="faq-question"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              aria-expanded={openIndex === index}
            >
              <span>{faq.question}</span>
              <span className="icon">{openIndex === index ? '−' : '+'}</span>
            </button>

            {openIndex === index && (
              <div className="faq-answer">
                <p>{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
```

### SEO Optimization

**Add structured data (JSON-LD) for FAQ schema:**

```tsx
// In page.tsx, add to <head>
<script type="application/ld+json">
{JSON.stringify({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": page.content.faqs.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  }))
})}
</script>
```

### Accessibility

- Use semantic `<button>` for questions (not `<div>`)
- Include `aria-expanded` attribute
- Keyboard navigation (Enter/Space to toggle)
- Focus management on open/close

---

## Complete Page Integration Example

### src/app/[service]/[location]/page.tsx

```tsx
import type { Metadata } from 'next'
import contentData from '@/../../content.json'
import { HeroSection } from '@/components/HeroSection'
import { TrustBar } from '@/components/TrustBar'
import { BenefitsGrid } from '@/components/BenefitsGrid'
import { ProcessTimeline } from '@/components/ProcessTimeline'
import { TestimonialsGrid } from '@/components/TestimonialsGrid'
import { FAQAccordion } from '@/components/FAQAccordion'

// Generate static params for all pages
export async function generateStaticParams() {
  return contentData.pages.map((page) => ({
    service: page.service,
    location: page.location,
  }))
}

// Generate metadata for SEO
export async function generateMetadata({ params }): Promise<Metadata> {
  const page = contentData.pages.find(
    (p) => p.service === params.service && p.location === params.location
  )

  if (!page) return {}

  return {
    title: page.seo.title,
    description: page.seo.description,
    alternates: {
      canonical: page.seo.canonicalUrl,
    },
    keywords: page.seo.keywords,
  }
}

// Page component
export default function ServiceLocationPage({ params }) {
  const page = contentData.pages.find(
    (p) => p.service === params.service && p.location === params.location
  )

  if (!page) return <div>Page not found</div>

  return (
    <main style={{
      '--primary-color': page.branding.primaryColor,
      '--secondary-color': page.branding.secondaryColor,
    }}>
      {/* Hero Section */}
      <HeroSection
        hero={page.hero}
        trustBar={page.trustBar}
        branding={page.branding}
      />

      {/* Trust Bar (sticky on scroll) */}
      <TrustBar
        signals={page.trustBar.signals}
        phone={page.branch.phone}
        sticky={true}
      />

      {/* Service Description */}
      <section className="service-description">
        <h2>Professional {page.service} Services</h2>
        <p>{page.content.serviceDescription}</p>
      </section>

      {/* Benefits Grid */}
      {page.content.benefits.length > 0 && (
        <BenefitsGrid benefits={page.content.benefits} />
      )}

      {/* Process Timeline */}
      {page.content.processSteps.length > 0 && (
        <ProcessTimeline steps={page.content.processSteps} />
      )}

      {/* Testimonials */}
      {page.socialProof.testimonials.length > 0 && (
        <TestimonialsGrid
          testimonials={page.socialProof.testimonials}
          aggregateRating={page.socialProof.aggregateRating}
          totalReviews={page.socialProof.totalReviews}
        />
      )}

      {/* FAQ Accordion */}
      {page.content.faqs.length > 0 && (
        <FAQAccordion faqs={page.content.faqs} />
      )}

      {/* Branch Information */}
      <section className="branch-info">
        <h2>Contact {page.branch.name}</h2>
        <p>📞 {page.branch.phone}</p>
        <p>📧 {page.branch.email}</p>
        <p>📍 {page.branch.address}</p>
        <p>🕐 {page.branch.hours}</p>

        {/* Branch Staff */}
        {page.branch.staff.length > 0 && (
          <div className="staff-grid">
            {page.branch.staff.map((staff, i) => (
              <div key={i} className="staff-member">
                {staff.photoUrl && <img src={staff.photoUrl} alt={staff.name} />}
                <h4>{staff.name}</h4>
                <p>{staff.jobTitle}</p>
                <p>{staff.yearsExperience}+ years experience</p>
                <p>{staff.bio}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
```

---

## Testing with Sample Data

### Create Test Data in content.json

While waiting for Airtable lookup fields, you can test components with sample data:

```json
{
  "pages": [
    {
      "service": "bathroom-remodeling",
      "location": "strongsville",
      "hero": {
        "h1Headline": "Professional Bathroom Remodeling in Strongsville",
        "subheadline": "Licensed, insured contractors with 15+ years experience",
        "imageUrl": "",
        "imageAlt": "Modern bathroom",
        "primaryCta": {
          "text": "Get Free Quote",
          "actionType": "form",
          "actionValue": "#contact-form"
        }
      },
      "trustBar": {
        "signals": ["Licensed OH #123456", "15+ Years", "⭐ 4.9/5"]
      },
      "content": {
        "benefits": [
          {
            "title": "Licensed & Insured",
            "description": "Full Ohio licensing and $2M insurance"
          }
        ],
        "faqs": [
          {
            "question": "How long does it take?",
            "answer": "Most projects complete in 2-3 weeks."
          }
        ]
      },
      "branding": {
        "primaryColor": "#0ea5e9",
        "secondaryColor": "#8b5cf6"
      }
    }
  ]
}
```

---

## Next Steps for Dev Agent

1. **Review TypeScript types** in `src/types/content-data.ts`
2. **Build 6 components** using data contracts above
3. **Test with current content.json** (even if fields are empty)
4. **Apply dynamic branding** (CSS custom properties)
5. **Ensure mobile-responsive** (320px, 768px, 1440px breakpoints)
6. **Validate accessibility** (ARIA labels, keyboard nav)
7. **Run build** (`npm run build`) to verify static generation works

---

**Questions?**
- TypeScript types: `src/types/content-data.ts`
- Export script: `scripts/export-airtable-to-json.ts`
- Field mapping: `docs/architecture/airtable-field-mapping.md`
