/**
 * AI Max/PMax Feed-Style Data Layer Generator
 *
 * Generates JSON feed data for Google Ads AI Max/PMax campaigns.
 * Feed data helps AI generate more relevant headlines and improves targeting.
 *
 * CRITICAL: All data comes from Airtable via content.json (no hallucination)
 *
 * Usage:
 *   const feedData = generateAdsFeedData(pageData)
 *   // Embed in <script type="application/json" id="adsFeed">
 */

import type { EnhancedPageData } from '@/types/content-data'
import type { AdsFeedData } from '@/types/structured-data'
import { getEndOfMonthFormatted } from '@/lib/dateHelpers'

/**
 * Generate ads feed data from page data
 *
 * @param pageData - Enhanced page data from content.json
 * @returns AdsFeedData object ready for JSON serialization
 */
export function generateAdsFeedData(pageData: EnhancedPageData): AdsFeedData {
  // ============================================
  // 1. SERVICE NAME
  // ============================================
  // Extract service name from H1 headline
  // H1 format is typically: "Service Name in Location"
  // Example: "Bathroom Remodeling in Strongsville"
  const h1 = pageData.hero.h1Headline
  const serviceName = extractServiceNameFromH1(h1)

  // ============================================
  // 2. SERVICE CATEGORY
  // ============================================
  // Use AI-generated category from Airtable Pages table
  // Default to "Home Services" if not set
  const category = pageData.serviceCategory || 'Home Services'

  // ============================================
  // 3. PRICE
  // ============================================
  // Use Price Range High from Services table lookup
  // Default to 0 if not set (AI Max will ignore 0 values)
  const price = pageData.servicePriceHigh || 0

  // ============================================
  // 4. PROMO (DYNAMIC)
  // ============================================
  // Build promo text with dynamic "Through {end of month}" date
  // If no offer exists, use generic promo text
  let promo = 'Special Offer Available'

  if (pageData.offer) {
    const discountValue = pageData.offer.discountValue
    const endOfMonth = getEndOfMonthFormatted()
    promo = `${discountValue} Off Through ${endOfMonth}`
  }

  // ============================================
  // 5. BRANCH PHONE
  // ============================================
  // Direct from Branch.Phone lookup (from Airtable)
  const branchPhone = pageData.branch.phone

  // ============================================
  // 6. LOCATION
  // ============================================
  // Extract location from H1 headline
  // Format: "City ST" (e.g., "Strongsville OH")
  const location = extractLocationFromH1(h1)

  // ============================================
  // VALIDATION
  // ============================================
  // Ensure all required fields are present
  if (!serviceName || !branchPhone || !location) {
    throw new Error(
      'Missing required fields for Ads Feed Data. ' +
        `Service: ${serviceName}, Phone: ${branchPhone}, Location: ${location}. ` +
        'All fields must come from Airtable (no placeholders).'
    )
  }

  // ============================================
  // RETURN FEED DATA
  // ============================================
  return {
    service: serviceName,
    category,
    price,
    promo,
    branchPhone,
    location,
  }
}

/**
 * Extract service name from H1 headline
 *
 * H1 format is typically one of:
 * - "Service Name in Location"
 * - "Service Name | Location"
 * - "Service Name - Location"
 *
 * @param h1 - H1 headline from page data
 * @returns Service name (e.g., "Bathroom Remodeling")
 */
function extractServiceNameFromH1(h1: string): string {
  // Try splitting by " in ", " | ", or " - "
  const separators = [' in ', ' | ', ' - ']

  for (const separator of separators) {
    if (h1.includes(separator)) {
      const parts = h1.split(separator)
      return parts[0].trim()
    }
  }

  // If no separator found, return full H1 (might be service-only headline)
  return h1.trim()
}

/**
 * Extract location from H1 headline
 *
 * H1 format is typically one of:
 * - "Service Name in Location"
 * - "Service Name | Location"
 * - "Service Name - Location"
 *
 * Location format is typically:
 * - "City, ST" (e.g., "Strongsville, OH")
 * - "City ST" (e.g., "Strongsville OH")
 * - Just "City" (we'll append state from branch data if needed)
 *
 * @param h1 - H1 headline from page data
 * @returns Location formatted as "City ST" (e.g., "Strongsville OH")
 */
function extractLocationFromH1(h1: string): string {
  // Try splitting by " in ", " | ", or " - "
  const separators = [' in ', ' | ', ' - ']

  for (const separator of separators) {
    if (h1.includes(separator)) {
      const parts = h1.split(separator)
      if (parts.length > 1) {
        let location = parts[1].trim()

        // Remove any trailing punctuation
        location = location.replace(/[.,;!?]$/, '')

        // Ensure format is "City ST" not "City, ST"
        location = location.replace(/,\s*/g, ' ')

        return location
      }
    }
  }

  // If no location found in H1, return empty string
  // (validation will catch this and throw error)
  return ''
}

/**
 * Alternative: Generate ads feed data with manual field mapping
 *
 * Use this if you want to pass in service name and location explicitly
 * instead of extracting from H1 headline.
 *
 * @param params - Manual field mapping
 * @returns AdsFeedData object
 */
export function generateAdsFeedDataManual({
  serviceName,
  category,
  price,
  offerDiscountValue,
  branchPhone,
  locationCity,
  locationState,
}: {
  serviceName: string
  category: string
  price: number
  offerDiscountValue?: string
  branchPhone: string
  locationCity: string
  locationState: string
}): AdsFeedData {
  // Build promo text
  let promo = 'Special Offer Available'
  if (offerDiscountValue) {
    const endOfMonth = getEndOfMonthFormatted()
    promo = `${offerDiscountValue} Off Through ${endOfMonth}`
  }

  // Format location as "City ST"
  const location = `${locationCity} ${locationState}`

  return {
    service: serviceName,
    category,
    price,
    promo,
    branchPhone,
    location,
  }
}
