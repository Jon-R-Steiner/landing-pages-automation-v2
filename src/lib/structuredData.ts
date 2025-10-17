/**
 * Structured Data Generation Utilities
 *
 * Functions to generate Schema.org JSON-LD for AI Max/PMax optimization
 *
 * CRITICAL ANTI-HALLUCINATION MEASURES:
 * - All factual data MUST come from Airtable (no calculations or derivations)
 * - Latitude/Longitude from Branch Locations table (NOT geocoded)
 * - Business info from Clients/Branch Locations (NOT generated)
 * - Service info from Services table (NOT inferred)
 * - Validation errors will FAIL the build (not warnings)
 */

import type {
  ServiceSchema,
  LocalBusinessSchema,
  PromotionSchema,
  GeoCoordinates,
  PostalAddress,
  StructuredDataValidation,
  CoordinateValidationOptions,
  OfferCatalog,
  OfferItem,
  WarrantyPromise,
} from '@/types/structured-data'
import type { OfferData, BrandingData } from '@/types/content-data'

// ============================================
// Service Schema Generation
// ============================================

/**
 * Generate Service Schema.org JSON-LD
 *
 * Used for service landing pages to describe the service offered
 * and the business providing it.
 *
 * ENHANCED: Now includes offer catalog, terms of service, and dual warranty structure
 *
 * @param serviceName - Service Name (e.g., "Bathroom Remodeling")
 * @param serviceDescription - Service Description (from Services table)
 * @param clientName - Client Name (e.g., "Bath Planet")
 * @param branchPhone - Branch Phone (e.g., "(704) 555-1234")
 * @param branchAddress - PostalAddress object with complete address
 * @param locationName - Location name (e.g., "Cleveland, OH")
 * @param canonicalUrl - Canonical URL of the page
 * @param heroImageUrl - Hero Image URL (optional)
 * @param latitude - Branch latitude (optional but recommended)
 * @param longitude - Branch longitude (optional but recommended)
 * @param clientDomain - Client Domain URL (e.g., "https://bathsrus.com")
 * @param servicePriceHigh - Service price range high (optional, for offer catalog)
 * @param offerData - Active offer data (optional, for offer catalog)
 * @param branding - Branding data including warranty info (optional)
 * @returns ServiceSchema JSON-LD object
 */
export function generateServiceSchema({
  serviceName,
  serviceDescription,
  clientName,
  branchPhone,
  branchAddress,
  locationName,
  canonicalUrl,
  heroImageUrl,
  latitude,
  longitude,
  clientDomain,
  servicePriceHigh,
  offerData,
  branding,
}: {
  serviceName: string
  serviceDescription: string
  clientName: string
  branchPhone: string
  branchAddress: PostalAddress
  locationName: string
  canonicalUrl: string
  heroImageUrl?: string
  latitude?: number
  longitude?: number
  clientDomain: string
  servicePriceHigh?: number
  offerData?: OfferData
  branding?: BrandingData
}): ServiceSchema {
  // Validation: Ensure all required fields present
  if (!serviceName || !serviceDescription || !clientName || !branchPhone || !canonicalUrl || !clientDomain) {
    throw new Error(
      'Missing required fields for Service Schema. ' +
        'All fields must come from Airtable (no placeholders).'
    )
  }

  // Build base schema
  const schema: ServiceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: serviceName,
    description: serviceDescription,
    provider: {
      '@type': 'LocalBusiness',
      name: clientName,
      telephone: branchPhone,
      address: branchAddress,
      image: heroImageUrl,
      url: clientDomain,
    },
    areaServed: {
      '@type': 'Place',
      name: locationName,
    },
    url: canonicalUrl,
  }

  // Add geo coordinates to provider if available
  if (latitude !== undefined && longitude !== null && longitude !== undefined && longitude !== null) {
    schema.provider.geo = {
      '@type': 'GeoCoordinates',
      latitude,
      longitude,
    }
  }

  // Add offer catalog if price is available
  if (servicePriceHigh) {
    schema.hasOfferCatalog = generateOfferCatalog({
      serviceName,
      price: servicePriceHigh,
      canonicalUrl,
    })
  }

  // Add terms of service URL
  schema.termsOfService = `${clientDomain}/terms`

  // Add warranty array if warranty data available
  if (branding) {
    const warranties = generateWarrantyArray(branding)
    if (warranties.length > 0) {
      schema.warranty = warranties
    }
  }

  return schema
}

// ============================================
// LocalBusiness Schema Generation
// ============================================

/**
 * Generate LocalBusiness Schema.org JSON-LD
 *
 * CRITICAL: Latitude/Longitude MUST come from Airtable Branch Locations table.
 * This function will THROW an error if coordinates are missing or invalid,
 * causing the build to fail. This prevents AI hallucination of business location.
 *
 * @param clientName - Client Name (e.g., "Bath Planet")
 * @param clientDescription - Client Description (optional)
 * @param branchPhone - Branch Phone (e.g., "(704) 555-1234")
 * @param clientEmail - Client Email (optional)
 * @param branchAddress - PostalAddress object with complete address
 * @param latitude - Latitude from Airtable Branch Locations.Latitude (-90 to 90)
 * @param longitude - Longitude from Airtable Branch Locations.Longitude (-180 to 180)
 * @param hoursOfOperation - Hours of Operation (optional)
 * @param clientDomain - Client Domain (e.g., "https://bathplanet.com")
 * @param clientLogoUrl - Client Logo URL (optional)
 * @param heroImageUrl - Hero Image URL (optional)
 * @returns LocalBusinessSchema JSON-LD object
 * @throws Error if latitude/longitude missing or invalid
 */
export function generateLocalBusinessSchema({
  clientName,
  clientDescription,
  branchPhone,
  clientEmail,
  branchAddress,
  latitude,
  longitude,
  hoursOfOperation,
  clientDomain,
  clientLogoUrl,
  heroImageUrl,
}: {
  clientName: string
  clientDescription?: string
  branchPhone: string
  clientEmail?: string
  branchAddress: PostalAddress
  latitude: number | undefined | null
  longitude: number | undefined | null
  hoursOfOperation?: string
  clientDomain: string
  clientLogoUrl?: string
  heroImageUrl?: string
}): LocalBusinessSchema {
  // CRITICAL VALIDATION: Ensure coordinates are from Airtable (not null/undefined)
  if (latitude === undefined || latitude === null) {
    throw new Error(
      'Latitude is missing from Airtable Branch Locations table. ' +
        'This field MUST be manually entered with data from Google Maps to prevent hallucination. ' +
        'Build cannot continue without valid coordinates.'
    )
  }

  if (longitude === undefined || longitude === null) {
    throw new Error(
      'Longitude is missing from Airtable Branch Locations table. ' +
        'This field MUST be manually entered with data from Google Maps to prevent hallucination. ' +
        'Build cannot continue without valid coordinates.'
    )
  }

  // CRITICAL VALIDATION: Ensure coordinates are in valid range
  if (latitude < -90 || latitude > 90) {
    throw new Error(
      `Invalid latitude: ${latitude}. Must be between -90 and 90. ` +
        'Please check the Latitude field in Airtable Branch Locations table.'
    )
  }

  if (longitude < -180 || longitude > 180) {
    throw new Error(
      `Invalid longitude: ${longitude}. Must be between -180 and 180. ` +
        'Please check the Longitude field in Airtable Branch Locations table.'
    )
  }

  // Additional validation: Ensure required fields present
  if (!clientName || !branchPhone || !clientDomain) {
    throw new Error(
      'Missing required fields for LocalBusiness Schema. ' +
        'All fields must come from Airtable (no placeholders).'
    )
  }

  // Create geo coordinates (FROM AIRTABLE - NO CALCULATION)
  const geo: GeoCoordinates = {
    '@type': 'GeoCoordinates',
    latitude, // Direct from Airtable - NO CALCULATION
    longitude, // Direct from Airtable - NO CALCULATION
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: clientName,
    description: clientDescription,
    telephone: branchPhone,
    email: clientEmail,
    address: branchAddress,
    geo, // CRITICAL: Contains Airtable-sourced coordinates
    openingHoursSpecification: hoursOfOperation,
    url: clientDomain,
    logo: clientLogoUrl,
    image: heroImageUrl,
  }
}

// ============================================
// Promotion Schema Generation
// ============================================

/**
 * Generate Promotion Schema.org JSON-LD
 *
 * Only used when an active offer is present on the page.
 * All offer data must come from Airtable Offers table.
 *
 * @param offerTitle - Offer Title (e.g., "Spring 2025 Bathroom Promo")
 * @param offerDescription - Offer Description
 * @param discountAmount - Discount Amount (optional, e.g., "1000" or "20")
 * @param startDate - Offer Start Date (optional, ISO 8601 format)
 * @param endDate - Offer End Date (optional, ISO 8601 format)
 * @param clientName - Client Name (e.g., "Bath Planet")
 * @returns PromotionSchema JSON-LD object
 */
export function generatePromotionSchema({
  offerTitle,
  offerDescription,
  discountAmount,
  startDate,
  endDate,
  clientName,
}: {
  offerTitle: string
  offerDescription: string
  discountAmount?: string
  startDate?: string
  endDate?: string
  clientName: string
}): PromotionSchema {
  // Validation: Ensure required fields present
  if (!offerTitle || !offerDescription || !clientName) {
    throw new Error(
      'Missing required fields for Promotion Schema. ' +
        'All fields must come from Airtable Offers table (no placeholders).'
    )
  }

  const schema: PromotionSchema = {
    '@context': 'https://schema.org',
    '@type': 'Offer',
    name: offerTitle,
    description: offerDescription,
    availableAtOrFrom: {
      '@type': 'LocalBusiness',
      name: clientName,
    },
  }

  // Optional: Add price specification if discount amount provided
  if (discountAmount) {
    schema.priceSpecification = {
      '@type': 'PriceSpecification',
      price: discountAmount,
      priceCurrency: 'USD',
    }
  }

  // Optional: Add validity dates if provided
  if (startDate) schema.validFrom = startDate
  if (endDate) schema.validThrough = endDate

  return schema
}

// ============================================
// Helper Functions
// ============================================

/**
 * Create PostalAddress from branch data
 *
 * @param streetAddress - Street Address (e.g., "5005 Rockside Rd")
 * @param city - City (e.g., "Independence")
 * @param state - State (2-letter code, e.g., "OH")
 * @param zipCode - Zip Code (e.g., "44131")
 * @returns PostalAddress object
 */
export function createPostalAddress({
  streetAddress,
  city,
  state,
  zipCode,
}: {
  streetAddress: string
  city: string
  state: string
  zipCode: string
}): PostalAddress {
  // Validation: Ensure all required fields present
  if (!streetAddress || !city || !state || !zipCode) {
    throw new Error(
      'Missing required address fields. ' +
        'All address data must come from Airtable Branch Locations table.'
    )
  }

  return {
    '@type': 'PostalAddress',
    streetAddress,
    addressLocality: city,
    addressRegion: state,
    postalCode: zipCode,
    addressCountry: 'US',
  }
}

/**
 * Validate coordinates from Airtable
 *
 * This function provides detailed validation for latitude/longitude
 * with customizable options.
 *
 * @param latitude - Latitude value from Airtable
 * @param longitude - Longitude value from Airtable
 * @param options - Validation options
 * @returns StructuredDataValidation object
 */
export function validateCoordinates(
  latitude: number | undefined | null,
  longitude: number | undefined | null,
  options: Partial<CoordinateValidationOptions> = {}
): StructuredDataValidation {
  const {
    requireLatitude = true,
    requireLongitude = true,
    throwOnError = false,
  } = options

  const errors: string[] = []
  const warnings: string[] = []

  // Check if latitude is present
  if (requireLatitude && (latitude === undefined || latitude === null)) {
    errors.push('Latitude is missing from Airtable Branch Locations table')
  }

  // Check if longitude is present
  if (requireLongitude && (longitude === undefined || longitude === null)) {
    errors.push('Longitude is missing from Airtable Branch Locations table')
  }

  // Validate latitude range
  if (latitude !== undefined && latitude !== null) {
    if (latitude < -90 || latitude > 90) {
      errors.push(`Invalid latitude: ${latitude}. Must be between -90 and 90.`)
    }
  }

  // Validate longitude range
  if (longitude !== undefined && longitude !== null) {
    if (longitude < -180 || longitude > 180) {
      errors.push(`Invalid longitude: ${longitude}. Must be between -180 and 180.`)
    }
  }

  // Check for suspiciously round numbers (possible placeholders)
  if (latitude !== undefined && latitude !== null && longitude !== undefined && longitude !== null) {
    if (latitude === 0 && longitude === 0) {
      warnings.push(
        'Coordinates are (0, 0) which is in the ocean off Africa. ' +
          'This may be a placeholder value. Please verify in Airtable.'
      )
    }

    // Check if both are whole numbers (unlikely for real coordinates)
    if (Number.isInteger(latitude) && Number.isInteger(longitude)) {
      warnings.push(
        'Both latitude and longitude are whole numbers, which is unusual for precise coordinates. ' +
          'Please verify these are real coordinates from Google Maps.'
      )
    }
  }

  const isValid = errors.length === 0

  // Throw error if requested
  if (!isValid && throwOnError) {
    throw new Error(
      'Coordinate validation failed:\n' + errors.join('\n') +
      (warnings.length > 0 ? '\n\nWarnings:\n' + warnings.join('\n') : '')
    )
  }

  return {
    isValid,
    errors,
    warnings,
  }
}

/**
 * Format ISO date string from Airtable date field
 *
 * Airtable returns dates in YYYY-MM-DD format.
 * This function converts to ISO 8601 format required by Schema.org.
 *
 * @param dateString - Date string from Airtable (YYYY-MM-DD)
 * @returns ISO 8601 date string (YYYY-MM-DDTHH:mm:ssZ)
 */
export function formatDateToISO(dateString: string | undefined): string | undefined {
  if (!dateString) return undefined

  try {
    // Airtable returns dates in YYYY-MM-DD format
    // Convert to ISO 8601 with time set to midnight UTC
    const date = new Date(dateString + 'T00:00:00Z')
    return date.toISOString()
  } catch (error) {
    console.error(`Invalid date format: ${dateString}`, error)
    return undefined
  }
}

/**
 * Generate Offer Catalog for Service Schema
 *
 * Creates a simple offer catalog with a single service offering at the
 * specified price. Used to provide pricing information for AI Max/PMax.
 *
 * @param serviceName - Service Name (e.g., "Walk-In Tub Installation")
 * @param price - Service Price Range High (e.g., 11500)
 * @param canonicalUrl - Canonical URL of the page
 * @returns OfferCatalog object
 */
export function generateOfferCatalog({
  serviceName,
  price,
  canonicalUrl,
}: {
  serviceName: string
  price: number
  canonicalUrl: string
}): OfferCatalog {
  const offerItem: OfferItem = {
    '@type': 'Offer',
    itemOffered: serviceName,
    priceCurrency: 'USD',
    price: price.toString(),
    availability: 'https://schema.org/InStock',
    url: canonicalUrl,
  }

  return {
    '@type': 'OfferCatalog',
    name: `${serviceName} Offers`,
    itemListElement: [offerItem],
  }
}

/**
 * Generate Warranty Array for Service Schema
 *
 * Creates an array of WarrantyPromise objects from branding data.
 * Supports dual warranty structure (Product + Workmanship).
 *
 * IMPORTANT: Warranty fields are pre-formatted text from Airtable.
 * Duration should be ISO 8601 format (e.g., "P12Y" for 12 years, "P1Y" for 1 year).
 *
 * @param branding - Branding data containing warranty information
 * @returns Array of WarrantyPromise objects (can be empty if no warranty data)
 */
export function generateWarrantyArray(branding: BrandingData): WarrantyPromise[] {
  const warranties: WarrantyPromise[] = []

  // Add Product Warranty if available
  if (branding.productWarrantyDuration && branding.productWarrantyScope) {
    warranties.push({
      '@type': 'WarrantyPromise',
      name: 'Product Warranty',
      durationOfWarranty: branding.productWarrantyDuration,
      warrantyScope: branding.productWarrantyScope,
    })
  }

  // Add Workmanship Warranty if available
  if (branding.workmanshipWarrantyDuration && branding.workmanshipWarrantyScope) {
    warranties.push({
      '@type': 'WarrantyPromise',
      name: 'Workmanship Warranty',
      durationOfWarranty: branding.workmanshipWarrantyDuration,
      warrantyScope: branding.workmanshipWarrantyScope,
    })
  }

  return warranties
}
