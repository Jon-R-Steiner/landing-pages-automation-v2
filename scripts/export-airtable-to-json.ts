/**
 * Enhanced Airtable Export Script
 *
 * Purpose: Fetch Pages, Testimonials, and Staff from Airtable and export
 * enhanced content.json with full context for Next.js static generation.
 *
 * Strategy:
 * - Fetch 3 tables: Pages (with ALL lookups), Testimonials, Branch Staff
 * - Pages table lookups provide: Client, Service, Location, Branch, CTA, Hero, Offer data
 * - Filter and attach testimonials per page (client + service + branch match)
 * - Filter and attach staff per branch
 * - Parse AI-generated JSON fields (FAQs, Benefits, Process Steps)
 *
 * Usage:
 *   npm run export-airtable
 *
 * Environment Variables Required:
 *   AIRTABLE_API_KEY - Airtable personal access token
 *   AIRTABLE_BASE_ID - Base ID (appATvatPtaoJ8MmS)
 */

// Load environment variables from .env.local (override system variables)
import { config } from 'dotenv'
import { resolve } from 'path'
config({ path: resolve(process.cwd(), '.env.local'), override: true })

import Airtable from 'airtable'
import fs from 'fs/promises'
import path from 'path'

// Import types
import type {
  ContentData,
  EnhancedPageData,
  BenefitItem,
  ProcessStep,
  FAQItem,
} from '../src/types/content-data'

import type {
  AirtablePageRecord,
  AirtableTestimonialRecord,
  AirtableBranchStaffRecord,
} from '../src/types/airtable-schema'

// ============================================
// Configuration
// ============================================

const BASE_ID = process.env.AIRTABLE_BASE_ID || 'appATvatPtaoJ8MmS'
const API_KEY = process.env.AIRTABLE_API_KEY
const OUTPUT_FILE = path.join(process.cwd(), 'content.json')

// ============================================
// Helper Functions
// ============================================

/**
 * Safe field getter - returns value or default
 */
function getField<T>(fields: Record<string, unknown>, fieldName: string, defaultValue: T): T {
  const value = fields[fieldName]
  return value !== undefined && value !== null ? (value as T) : defaultValue
}

/**
 * Parse JSON field safely
 */
function parseJSON<T>(jsonString: string | undefined, defaultValue: T): T {
  if (!jsonString) return defaultValue
  try {
    return JSON.parse(jsonString) as T
  } catch (error) {
    console.warn(`Failed to parse JSON: ${jsonString.substring(0, 100)}...`)
    return defaultValue
  }
}

/**
 * Get first linked record ID
 */
function getLinkedRecordId(field: string[] | undefined): string | undefined {
  return field && field.length > 0 ? field[0] : undefined
}

/**
 * Calculate average rating
 */
function calculateAverageRating(ratings: number[]): number {
  if (ratings.length === 0) return 0
  const sum = ratings.reduce((acc, rating) => acc + rating, 0)
  return Math.round((sum / ratings.length) * 10) / 10 // Round to 1 decimal
}

/**
 * Replace placeholders in CTA action value
 */
function replacePlaceholders(value: string, branchPhone: string): string {
  return value.replace(/{client_phone}/g, branchPhone)
}

// ============================================
// Main Export Function
// ============================================

async function exportAirtablePages(): Promise<void> {
  const startTime = Date.now()

  console.log('=== Enhanced Airtable Export Script Started ===\n')

  // Validation
  if (!API_KEY) {
    throw new Error(
      'AIRTABLE_API_KEY environment variable is required. ' +
        'Set it in .env.local or pass it to the script.'
    )
  }

  // Initialize Airtable client
  const base = new Airtable({ apiKey: API_KEY }).base(BASE_ID)

  console.log('Configuration:')
  console.log(`  Base ID: ${BASE_ID}`)
  console.log(`  API Key: ${API_KEY.substring(0, 15)}...`)
  console.log(`  Output: ${OUTPUT_FILE}\n`)

  // ============================================
  // STEP 1: Fetch 3 tables in parallel
  // ============================================

  console.log('Fetching tables from Airtable...')

  const [pagesRecords, testimonialsRecords, staffRecords] = await Promise.all([
    // Pages table - fetch ALL records (no filter)
    base('Pages')
      .select({})
      .all()
      .then((records) => {
        console.log(`  ✅ Pages: ${records.length} records`)
        return records.map((r) => ({
          id: r.id,
          fields: r.fields as AirtablePageRecord['fields'],
        }))
      })
      .catch((error) => {
        console.error('  ❌ Failed to fetch Pages table')
        throw error
      }),

    // Testimonials table - active only
    base('Testimonials')
      .select({
        filterByFormula: '{Active} = TRUE()',
      })
      .all()
      .then((records) => {
        console.log(`  ✅ Testimonials: ${records.length} records`)
        return records.map((r) => ({
          id: r.id,
          fields: r.fields as AirtableTestimonialRecord['fields'],
        }))
      })
      .catch((error) => {
        console.warn('  ⚠️  Testimonials table not found or empty')
        return [] // Non-blocking - continue without testimonials
      }),

    // Branch Staff table - active only
    base('Branch Staff')
      .select({
        filterByFormula: '{Active} = TRUE()',
      })
      .all()
      .then((records) => {
        console.log(`  ✅ Branch Staff: ${records.length} records`)
        return records.map((r) => ({
          id: r.id,
          fields: r.fields as AirtableBranchStaffRecord['fields'],
        }))
      })
      .catch((error) => {
        console.warn('  ⚠️  Branch Staff table not found or empty')
        return [] // Non-blocking - continue without staff
      }),
  ])

  console.log('')

  // Debug: Show available fields from first page
  if (pagesRecords.length > 0) {
    console.log('Available lookup fields in first page record:')
    const sampleFields = Object.keys(pagesRecords[0].fields).filter(
      (key) => !key.includes('ID') && !key.includes('Unique Key')
    )
    console.log(sampleFields.slice(0, 20).join(', '))
    console.log(`  ... and ${Math.max(0, sampleFields.length - 20)} more\n`)
  }

  // ============================================
  // STEP 2: Build lookup maps for collections
  // ============================================

  console.log('Building lookup maps...')

  // Map: Client ID → Testimonials[]
  type TestimonialRecord = { id: string; fields: AirtableTestimonialRecord['fields'] }
  const testimonialsByClient = new Map<string, TestimonialRecord[]>()
  testimonialsRecords.forEach((t) => {
    const clientId = getLinkedRecordId(t.fields['Client Name'])
    if (clientId) {
      if (!testimonialsByClient.has(clientId)) {
        testimonialsByClient.set(clientId, [])
      }
      testimonialsByClient.get(clientId)!.push(t)
    }
  })

  // Map: Branch ID → Staff[]
  type StaffRecord = { id: string; fields: AirtableBranchStaffRecord['fields'] }
  const staffByBranch = new Map<string, StaffRecord[]>()
  staffRecords.forEach((s) => {
    const branchId = getLinkedRecordId(s.fields['Branch ID'])
    if (branchId) {
      if (!staffByBranch.has(branchId)) {
        staffByBranch.set(branchId, [])
      }
      staffByBranch.get(branchId)!.push(s)
    }
  })

  console.log(`  Testimonials grouped by ${testimonialsByClient.size} clients`)
  console.log(`  Staff grouped by ${staffByBranch.size} branches\n`)

  // ============================================
  // STEP 3: Transform pages with full context
  // ============================================

  console.log('Transforming pages with full context...')

  const enhancedPages: EnhancedPageData[] = []
  const errors: string[] = []

  for (const page of pagesRecords) {
    const { fields } = page

    // === REQUIRED FIELDS VALIDATION ===
    // Service Slug and Location Slug might be arrays (linked records) or strings (lookups)
    const serviceSlugRaw = fields['Service Slug']
    const locationSlugRaw = fields['Location Slug']

    const serviceSlug = Array.isArray(serviceSlugRaw)
      ? serviceSlugRaw[0] || ''
      : String(serviceSlugRaw || '')

    const locationSlug = Array.isArray(locationSlugRaw)
      ? locationSlugRaw[0] || ''
      : String(locationSlugRaw || '')

    if (!serviceSlug) {
      errors.push(`${page.id}: Missing Service Slug`)
      continue
    }

    if (!locationSlug) {
      errors.push(`${page.id}: Missing Location Slug`)
      continue
    }

    // === GET LINKED RECORD IDs ===
    const clientId = getLinkedRecordId(fields['Client Name'])
    const serviceId = getLinkedRecordId(fields['Service ID'])
    const branchId = getLinkedRecordId(fields['Matched Branch'])

    // === FILTER TESTIMONIALS ===
    const allClientTestimonials = clientId ? testimonialsByClient.get(clientId) || [] : []
    const relevantTestimonials = allClientTestimonials
      .filter((t) => {
        const rating = getField(t.fields, 'Rating', 0)
        const testimonialServiceId = getLinkedRecordId(t.fields['Service ID'])
        const testimonialBranchId = getLinkedRecordId(t.fields['Branch ID'])

        // Must have 4+ stars
        if (rating < 4) return false

        // If testimonial has service filter, must match page service
        if (testimonialServiceId && testimonialServiceId !== serviceId) return false

        // If testimonial has branch filter, must match page branch
        if (testimonialBranchId && testimonialBranchId !== branchId) return false

        return true
      })
      .slice(0, 5) // Top 5 testimonials

    // === GET BRANCH STAFF ===
    const branchStaff = branchId ? staffByBranch.get(branchId) || [] : []

    // === BUILD ENHANCED PAGE ===
    const enhancedPage: EnhancedPageData = {
      // Identity
      pageId: getField(fields, 'Page ID', 0),
      urlSlug: getField(fields, 'URL Slug', ''),
      pageUrl: getField(fields, 'Page URL', ''),

      // Routing
      service: serviceSlug,
      location: locationSlug,

      // SEO
      seo: {
        title: getField(fields, 'SEO Title', `${serviceSlug} in ${locationSlug}`),
        description: getField(fields, 'SEO Description', ''),
        canonicalUrl: getField(fields, 'Page URL', ''),
        keywords: getField(fields, 'SEO Keywords', '')
          .split(',')
          .map((k: string) => k.trim())
          .filter(Boolean),
      },

      // Hero
      hero: {
        h1Headline: getField(fields, 'H1 Headline', ''),
        subheadline: getField(fields, 'Hero Subheadline', ''),
        imageUrl: getField(fields, 'Hero Image URL', ''),
        imageAlt: getField(fields, 'Hero Image Alt Text', ''),
        primaryCta: {
          text: getField(fields, 'CTA Text', 'Get Free Quote'),
          actionType: getField(fields, 'CTA Action Type', 'form') as
            | 'phone'
            | 'form'
            | 'link',
          actionValue: replacePlaceholders(
            getField(fields, 'CTA Action Value', '#contact-form'),
            getField(fields, 'Branch Phone', '')
          ),
        },
      },

      // Trust Bar
      trustBar: {
        signals: [
          getField(fields, 'Trust Bar 1', ''),
          getField(fields, 'Trust Bar 2', ''),
          getField(fields, 'Trust Bar 3', ''),
          getField(fields, 'Trust Bar 4', ''),
          getField(fields, 'Trust Bar 5', ''),
        ].filter(Boolean),
      },

      // Content (AI-generated JSON + Service description lookup)
      content: {
        serviceDescription: getField(fields, 'Service Description', ''),
        benefits: parseJSON<BenefitItem[]>(fields.Benefits as string, []),
        processSteps: parseJSON<ProcessStep[]>(fields['Process Steps'] as string, []),
        faqs: parseJSON<FAQItem[]>(fields.FAQs as string, []),
      },

      // Social Proof
      socialProof: {
        testimonials: relevantTestimonials.map((t) => ({
          customerName: getField(t.fields, 'Customer Name', 'Anonymous'),
          city: getField(t.fields, 'Customer City', ''),
          state: getField(t.fields, 'Customer State', ''),
          rating: getField(t.fields, 'Rating', 5),
          reviewTitle: getField(t.fields, 'Review Title', ''),
          reviewText: getField(t.fields, 'Review Text', ''),
          reviewDate: getField(t.fields, 'Review Date', ''),
          source: getField(t.fields, 'Source', 'Direct'),
        })),
        aggregateRating: calculateAverageRating(
          relevantTestimonials.map((t) => getField(t.fields, 'Rating', 5))
        ),
        totalReviews: relevantTestimonials.length,
      },

      // Branch
      branch: {
        name: getField(fields, 'Branch Name', ''),
        phone: getField(fields, 'Branch Phone', ''),
        email: getField(fields, 'Branch Email', ''),
        address: getField(fields, 'Branch Address', ''),
        timezone: getField(fields, 'Branch Timezone', ''),
        hours: getField(fields, 'Branch Hours', ''),
        staff: branchStaff.map((s) => ({
          name: getField(s.fields, 'Full Name', ''),
          jobTitle: getField(s.fields, 'Job Title', ''),
          yearsExperience: getField(s.fields, 'Years of Experience', 0),
          bio: getField(s.fields, 'Bio', ''),
          photoUrl: getField(s.fields, 'Photo URL', ''),
          isPrimaryContact: getField(s.fields, 'Primary Contact', false),
        })),
      },

      // Branding
      branding: {
        primaryColor: getField(fields, 'Primary Color', '#0ea5e9'),
        secondaryColor: getField(fields, 'Secondary Color', '#8b5cf6'),
        logoUrl: getField(fields, 'Logo URL', ''),
        googleFonts: getField(fields, 'Google Fonts', 'Inter'),
      },

      // Offer (optional)
      offer: getLinkedRecordId(fields['Offer ID'])
        ? {
            name: getField(fields, 'Offer Name', ''),
            type: getField(fields, 'Offer Type', ''),
            discountValue: getField(fields, 'Discount Value', ''),
            description: getField(fields, 'Offer Description', ''),
            finePrint: getField(fields, 'Fine Print', ''),
            startDate: getField(fields, 'Start Date', ''),
            endDate: getField(fields, 'End Date', ''),
          }
        : undefined,

      // Tracking
      tracking: {
        gtmId: getField(fields, 'GTM Container ID', ''),
        gaPropertyId: getField(fields, 'GA Property ID', ''),
        utmCampaign: getField(fields, 'UTM Campaign', undefined),
        utmSource: getField(fields, 'UTM Source', undefined),
        utmMedium: getField(fields, 'UTM Medium', undefined),
      },
    }

    enhancedPages.push(enhancedPage)
  }

  // Report errors
  if (errors.length > 0) {
    console.warn(`\n⚠️  ${errors.length} pages skipped due to validation errors:`)
    errors.slice(0, 10).forEach((error) => console.warn(`  - ${error}`))
    if (errors.length > 10) {
      console.warn(`  ... and ${errors.length - 10} more`)
    }
    console.warn('')
  }

  console.log(`✅ Transformed ${enhancedPages.length} valid pages\n`)

  // Check for minimum pages
  if (enhancedPages.length === 0) {
    throw new Error(
      'No valid pages found in Airtable. ' +
        'Ensure pages have Service Slug and Location Slug fields populated.'
    )
  }

  // ============================================
  // STEP 4: Create export result
  // ============================================

  const exportResult: ContentData = {
    pages: enhancedPages,
    metadata: {
      exportDate: new Date().toISOString(),
      totalPages: enhancedPages.length,
      exportDurationMs: Date.now() - startTime,
      tablesExported: ['Pages', 'Testimonials', 'Branch Staff'],
    },
  }

  // ============================================
  // STEP 5: Write to file
  // ============================================

  console.log('Writing to content.json...')

  const json = JSON.stringify(exportResult, null, 2)
  await fs.writeFile(OUTPUT_FILE, json, 'utf-8')

  console.log(`\n✅ Export Complete!`)
  console.log(`   Pages exported: ${enhancedPages.length}`)
  console.log(`   File size: ${(json.length / 1024).toFixed(2)} KB`)
  console.log(`   Duration: ${exportResult.metadata.exportDurationMs}ms`)
  console.log(`   Output: ${OUTPUT_FILE}`)
  console.log('')
}

// ============================================
// Execute
// ============================================

exportAirtablePages().catch((error) => {
  console.error('\n❌ Export failed:\n')
  console.error(error.message)
  if (error.stack) {
    console.error('\nStack trace:')
    console.error(error.stack)
  }
  console.error('')
  process.exit(1)
})
