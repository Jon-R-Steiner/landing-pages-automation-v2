/**
 * Enhanced Content Data Types
 *
 * TypeScript interfaces for the enriched content.json structure
 * exported from Airtable with full context for page rendering.
 *
 * Data Flow: Airtable (3 tables) → export script → content.json → Next.js
 */

// ============================================
// Root Export Structure
// ============================================

export interface ContentData {
  pages: EnhancedPageData[]
  metadata: ExportMetadata
}

export interface ExportMetadata {
  exportDate: string
  totalPages: number
  exportDurationMs: number
  tablesExported: string[] // ["Pages", "Testimonials", "Branch Staff"]
}

// ============================================
// Enhanced Page Data (Main Structure)
// ============================================

export interface EnhancedPageData {
  // === IDENTITY (direct fields) ===
  pageId: number
  urlSlug: string // e.g., "bathroom-remodeling/strongsville"
  pageUrl: string // e.g., "https://bathsrus.com/bathroom-remodeling/strongsville"

  // === ROUTING (lookups from Service/Location) ===
  service: string // Service Slug lookup (e.g., "bathroom-remodeling")
  location: string // Location Slug lookup (e.g., "strongsville")

  // === SEO ===
  seo: SEOData

  // === HERO SECTION ===
  hero: HeroData

  // === TRUST BAR ===
  trustBar: TrustBarData

  // === CONTENT SECTIONS ===
  content: ContentSections

  // === SOCIAL PROOF ===
  socialProof: SocialProofData

  // === BRANCH INFORMATION ===
  branch: BranchData

  // === BRANDING (Client lookups) ===
  branding: BrandingData

  // === OFFER (optional) ===
  offer?: OfferData

  // === TRACKING ===
  tracking: TrackingData
}

// ============================================
// Component Data Structures
// ============================================

export interface SEOData {
  title: string // Pages.SEO Title
  description: string // Pages.SEO Description
  canonicalUrl: string // Pages.Page URL
  keywords: string[] // Location.SEO Keywords lookup (comma-separated → array)
}

export interface HeroData {
  h1Headline: string // Pages.H1 Headline
  subheadline: string // Pages.Hero Subheadline
  imageUrl: string // Hero Image.URL lookup
  imageAlt: string // Hero Image.Alt Text lookup
  primaryCta: CTAAction
  secondaryCta?: CTAAction // Optional secondary CTA
}

export interface CTAAction {
  text: string // CTA.Text lookup
  actionType: 'phone' | 'form' | 'link' // CTA.Action Type lookup
  actionValue: string // CTA.Action Value lookup (with {client_phone} replaced)
}

export interface TrustBarData {
  signals: string[] // [Trust Bar 1, 2, 3, 4, 5] filtered for non-empty
}

export interface ContentSections {
  serviceDescription: string // Service.Description lookup
  benefits: BenefitItem[] // Pages.Benefits JSON field
  processSteps: ProcessStep[] // Pages.Process Steps JSON field
  faqs: FAQItem[] // Pages.FAQs JSON field (AI-generated)
}

export interface BenefitItem {
  title: string
  description: string
  icon?: string // Optional icon name (e.g., "check-circle", "shield")
}

export interface ProcessStep {
  stepNumber: number
  title: string
  description: string
  timeline?: string // Optional (e.g., "Day 1-2", "Week 1")
}

export interface FAQItem {
  question: string
  answer: string
}

export interface SocialProofData {
  testimonials: TestimonialItem[]
  aggregateRating: number // Average of testimonial ratings
  totalReviews: number // Count of testimonials
}

export interface TestimonialItem {
  customerName: string // Testimonials.Customer Name
  city: string // Testimonials.Customer City
  state: string // Testimonials.Customer State
  rating: number // Testimonials.Rating (1-5)
  reviewTitle: string // Testimonials.Review Title
  reviewText: string // Testimonials.Review Text
  reviewDate: string // Testimonials.Review Date (ISO string)
  source: string // Testimonials.Source (Google, Yelp, etc.)
}

export interface BranchData {
  name: string // Branch.Name lookup
  phone: string // Branch.Phone lookup
  email: string // Branch.Email lookup
  address: string // Branch.Address lookup
  timezone: string // Branch.Timezone lookup
  hours: string // Branch.Hours Summary lookup
  staff: StaffMember[] // Filtered from Branch Staff table
}

export interface StaffMember {
  name: string // Staff.Full Name
  jobTitle: string // Staff.Job Title
  yearsExperience: number // Staff.Years of Experience
  bio: string // Staff.Bio
  photoUrl: string // Staff.Photo URL
  isPrimaryContact: boolean // Staff.Primary Contact
}

export interface BrandingData {
  primaryColor: string // Client.Primary Color lookup (e.g., "#0ea5e9")
  secondaryColor: string // Client.Secondary Color lookup (e.g., "#8b5cf6")
  logoUrl: string // Client.Logo URL lookup
  googleFonts: string // Client.Google Fonts lookup (e.g., "Inter")
}

export interface OfferData {
  name: string // Offer.Name lookup
  type: string // Offer.Type lookup (Percentage, Dollar, Free Upgrade, etc.)
  discountValue: string // Offer.Discount Value lookup (e.g., "20%", "$1,000")
  description: string // Offer.Description lookup
  finePrint: string // Offer.Fine Print lookup
  startDate: string // Offer.Start Date lookup (ISO string)
  endDate: string // Offer.End Date lookup (ISO string)
}

export interface TrackingData {
  gtmId: string // Client.GTM Container ID lookup
  gaPropertyId: string // Client.GA Property ID lookup
  utmCampaign?: string // Campaign.UTM Campaign lookup (optional)
  utmSource?: string // Campaign.UTM Source lookup (optional)
  utmMedium?: string // Campaign.UTM Medium lookup (optional)
}

// ============================================
// Legacy Type (for backward compatibility)
// ============================================

/**
 * @deprecated Use EnhancedPageData instead
 *
 * Legacy PageData from Phase 0.3 (basic 4-field structure)
 * Kept for backward compatibility during migration
 */
export interface PageData {
  service: string
  location: string
  title: string
  description: string
}
