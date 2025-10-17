/**
 * Structured Data Type Definitions
 *
 * TypeScript interfaces for Schema.org JSON-LD generation
 * Used for AI Max/PMax optimization signals
 *
 * CRITICAL: All factual data MUST come from Airtable (no calculations)
 * - Latitude/Longitude from Branch Locations table (NOT derived)
 * - Business info from Clients/Branch Locations (NOT generated)
 * - Service info from Services table (NOT inferred)
 */

// ============================================
// Service Schema.org
// ============================================

/**
 * Service Schema.org for landing pages
 * Used to describe the service offered and the business providing it
 * https://schema.org/Service
 */
export interface ServiceSchema {
  '@context': 'https://schema.org'
  '@type': 'Service'
  name: string // Service Name (e.g., "Bathroom Remodeling")
  description: string // Service Description
  provider: ServiceProvider // Business providing the service
  areaServed: AreaServed // Geographic area served
  url: string // Canonical URL of the page
  hasOfferCatalog?: OfferCatalog // Pricing information (optional)
  termsOfService?: string // URL to terms of service page (optional)
  warranty?: WarrantyPromise[] // Array of warranty promises (optional)
}

/**
 * Service provider (nested in ServiceSchema)
 * https://schema.org/LocalBusiness
 */
export interface ServiceProvider {
  '@type': 'LocalBusiness'
  name: string // Client Name
  telephone: string // Branch Phone
  address: PostalAddress // Branch Address
  image?: string // Hero Image URL (optional)
  geo?: GeoCoordinates // Geo coordinates (optional but recommended)
  url?: string // Client Domain URL (optional)
}

/**
 * Area served (nested in ServiceSchema)
 * https://schema.org/Place
 */
export interface AreaServed {
  '@type': 'Place'
  name: string // Location (e.g., "Cleveland, OH")
}

// ============================================
// LocalBusiness Schema.org
// ============================================

/**
 * LocalBusiness Schema.org for landing pages
 * Provides complete business information including geolocation
 * https://schema.org/LocalBusiness
 */
export interface LocalBusinessSchema {
  '@context': 'https://schema.org'
  '@type': 'LocalBusiness'
  name: string // Client Name
  description?: string // Client Description
  telephone: string // Branch Phone
  email?: string // Client Email
  address: PostalAddress // Branch Address
  geo: GeoCoordinates // CRITICAL: Must have lat/long from Airtable
  openingHoursSpecification?: string // Hours of Operation
  url: string // Client Domain
  logo?: string // Client Logo URL
  image?: string // Hero Image URL
}

/**
 * Postal Address
 * Used in both ServiceSchema and LocalBusinessSchema
 * https://schema.org/PostalAddress
 */
export interface PostalAddress {
  '@type': 'PostalAddress'
  streetAddress: string // Branch Street Address
  addressLocality: string // Branch City
  addressRegion: string // Branch State (2-letter code)
  postalCode: string // Branch Zip Code
  addressCountry: 'US' // Always US for this project
}

/**
 * Geo Coordinates
 * CRITICAL: NO HALLUCINATION - Must come from Airtable Branch Locations
 * https://schema.org/GeoCoordinates
 */
export interface GeoCoordinates {
  '@type': 'GeoCoordinates'
  latitude: number // From Airtable Branch Locations.Latitude (-90 to 90)
  longitude: number // From Airtable Branch Locations.Longitude (-180 to 180)
}

// ============================================
// Promotion Schema.org
// ============================================

/**
 * Promotion/Offer Schema.org
 * Only used when an active offer is present on the page
 * https://schema.org/Offer
 */
export interface PromotionSchema {
  '@context': 'https://schema.org'
  '@type': 'Offer'
  name: string // Offer Title
  description: string // Offer Description
  priceSpecification?: PriceSpecification // Discount details (optional)
  validFrom?: string // Offer Start Date (ISO 8601 format)
  validThrough?: string // Offer End Date (ISO 8601 format)
  availableAtOrFrom: OfferProvider // Business offering the promotion
}

/**
 * Price specification for offers
 * https://schema.org/PriceSpecification
 */
export interface PriceSpecification {
  '@type': 'PriceSpecification'
  price: string // Discount Amount (e.g., "1000" or "20")
  priceCurrency: 'USD' // Always USD for this project
}

/**
 * Offer provider (nested in PromotionSchema)
 * https://schema.org/LocalBusiness
 */
export interface OfferProvider {
  '@type': 'LocalBusiness'
  name: string // Client Name
}

// ============================================
// Offer Catalog Schema.org
// ============================================

/**
 * Offer Catalog for Service Schema
 * Used to provide pricing information for services
 * https://schema.org/OfferCatalog
 */
export interface OfferCatalog {
  '@type': 'OfferCatalog'
  name: string // e.g., "Walk-In Tub Installation Offers"
  itemListElement: OfferItem[]
}

/**
 * Individual offer item within catalog
 * https://schema.org/Offer
 */
export interface OfferItem {
  '@type': 'Offer'
  itemOffered: string // Service name (e.g., "Walk-In Tub Installation")
  priceCurrency: 'USD' // Always USD for this project
  price: string // Price as string (e.g., "11500")
  availability: string // Schema.org availability URL (e.g., "https://schema.org/InStock")
  url: string // Canonical URL of the page
}

/**
 * Warranty Promise for Service Schema
 * Supports dual warranty structure (Product + Workmanship)
 * https://schema.org/WarrantyPromise
 */
export interface WarrantyPromise {
  '@type': 'WarrantyPromise'
  name: string // e.g., "Product Warranty" or "Workmanship Warranty"
  durationOfWarranty: string // ISO 8601 duration (e.g., "P12Y" for 12 years)
  warrantyScope: string // Description of warranty coverage
}

// ============================================
// AI Max/PMax Feed-Style Data Layer
// ============================================

/**
 * Feed-Style Data Layer for AI Max/PMax Optimization
 *
 * This interface defines the structure of JSON feed data embedded in
 * landing pages for Google Ads AI Max/PMax campaigns.
 *
 * The feed mimics Google Merchant Center feed format to help AI Max
 * generate more relevant headlines and improve campaign performance.
 *
 * Usage: Embedded as <script type="application/json" id="adsFeed">
 * in the <head> of each landing page.
 *
 * Data sources (all from Airtable):
 * - service: Pages.Service lookup (Service Slug)
 * - category: Pages.Service Category (AI-generated)
 * - price: Services.Price Range High lookup
 * - promo: Offer.Discount Value + dynamic "Through {end of month}"
 * - branchPhone: Branch.Phone lookup
 * - location: Location.City + Location.State lookup
 */
export interface AdsFeedData {
  service: string // Service Name (e.g., "Bathroom Remodeling")
  category: string // Service Category (e.g., "Home Improvement", "Aging-in-Place")
  price: number // Service Price Range High (e.g., 15000)
  promo: string // Promotion text (e.g., "20% Off Through Jan 31")
  branchPhone: string // Branch Phone (e.g., "(330) 555-1234")
  location: string // Location formatted as "City ST" (e.g., "Strongsville OH")
}

// ============================================
// Open Graph Metadata
// ============================================

/**
 * Open Graph and Twitter Card metadata
 * Used for social sharing optimization and Google Ads
 * https://ogp.me/
 * https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards
 */
export interface OpenGraphMetadata {
  // Open Graph Protocol
  'og:title': string // SEO Title
  'og:description': string // SEO Description
  'og:url': string // Canonical URL
  'og:type': 'website' // Always 'website' for landing pages
  'og:image'?: string // Hero Image URL (optional)
  'og:image:width'?: string // Image width in pixels (recommended: 1200)
  'og:image:height'?: string // Image height in pixels (recommended: 630)
  'og:locale': 'en_US' // Always en_US for this project
  'og:site_name': string // Client Name

  // Twitter Card
  'twitter:card': 'summary_large_image' // Always large image format
  'twitter:title': string // SEO Title
  'twitter:description': string // SEO Description
  'twitter:image'?: string // Hero Image URL (optional)
}

// ============================================
// Validation Helpers
// ============================================

/**
 * Validation result for structured data generation
 */
export interface StructuredDataValidation {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

/**
 * Validation options for coordinate validation
 */
export interface CoordinateValidationOptions {
  requireLatitude: boolean
  requireLongitude: boolean
  throwOnError: boolean
}
