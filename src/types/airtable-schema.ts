/**
 * Airtable Schema Types
 *
 * TypeScript interfaces for Airtable records as returned from the API.
 * These types document the field names and structure from Airtable.
 *
 * NOTE: Airtable returns linked records as string arrays (Record IDs)
 *       and lookup fields as their actual values.
 */

// ============================================
// Airtable Pages Table Record
// ============================================

export interface AirtablePageRecord {
  id: string // Airtable Record ID (e.g., "recABC123")
  fields: {
    // === IDENTITY & ROUTING ===
    'Page ID'?: number // Auto-number
    'Client Name'?: string[] // Linked record (array of record IDs)
    'Service ID'?: string[] // Linked record
    'Location ID'?: string[] // Linked record
    'Unique Key'?: string // Formula
    'URL Slug'?: string // Formula
    'Page URL'?: string // Formula

    // === WORKFLOW STATUS ===
    Status?: string // Single select
    Published?: boolean // Checkbox
    'Publish Date'?: string // Date

    // === AUTO-MATCHED DATA ===
    'Matched Branch'?: string[] // Linked record
    'Branch City'?: string // Lookup
    'Branch State'?: string // Lookup
    'Branch Timezone'?: string // Lookup
    'Branch Phone'?: string // Lookup
    'Branch Email'?: string // Lookup
    'Branch Address'?: string // Lookup (Full Address formula)
    'Branch Hours'?: string // Lookup (Hours Summary)
    'Branch Name'?: string // Lookup

    // === LOOKUPS FROM SERVICE ===
    'Service Slug'?: string // Lookup
    'Service Name'?: string // Lookup
    'Service Description'?: string // Lookup

    // === LOOKUPS FROM LOCATION ===
    'Location Slug'?: string // Lookup
    City?: string // Lookup
    State?: string // Lookup
    'SEO Keywords'?: string // Lookup (comma-separated string)

    // === LOOKUPS FROM CLIENT ===
    'Client Domain'?: string // Lookup
    'Primary Color'?: string // Lookup
    'Secondary Color'?: string // Lookup
    'Logo URL'?: string // Lookup
    'Google Fonts'?: string // Lookup
    'GTM Container ID'?: string // Lookup
    'GA Property ID'?: string // Lookup
    'CallRail Swap Target'?: string // Lookup
    'Primary Phone'?: string // Lookup (from Client)
    'Primary Email'?: string // Lookup (from Client)
    'Years in Business'?: number // Lookup
    'Licensed Since'?: number // Lookup
    'Insurance Amount'?: number // Lookup
    'BBB Rating'?: string // Lookup

    // === AI-GENERATED CONTENT (Direct Fields) ===
    'SEO Title'?: string
    'SEO Description'?: string
    'H1 Headline'?: string
    'Hero Subheadline'?: string

    // === AI-GENERATED JSON FIELDS ===
    FAQs?: string // Long text (JSON array)
    Benefits?: string // Long text (JSON array)
    'Process Steps'?: string // Long text (JSON array)

    // === TRUST BAR ===
    'Trust Bar 1'?: string
    'Trust Bar 2'?: string
    'Trust Bar 3'?: string
    'Trust Bar 4'?: string
    'Trust Bar 5'?: string

    // === SELECTED CTA (Linked + Lookups) ===
    'Selected CTA ID'?: string[] // Linked record
    'CTA Text'?: string // Lookup
    'CTA Action Type'?: string // Lookup
    'CTA Action Value'?: string // Lookup

    // === SELECTED HERO IMAGE (Linked + Lookups) ===
    'Selected Hero Image ID'?: string[] // Linked record
    'Hero Image URL'?: string // Lookup
    'Hero Image Alt Text'?: string // Lookup

    // === OFFER (Linked + Lookups) ===
    'Offer ID'?: string[] // Linked record
    'Offer Name'?: string // Lookup
    'Offer Type'?: string // Lookup
    'Discount Value'?: string // Lookup
    'Offer Description'?: string // Lookup
    'Fine Print'?: string // Lookup
    'Start Date'?: string // Lookup
    'End Date'?: string // Lookup

    // === CAMPAIGN (Linked + Lookups) ===
    Campaign?: string[] // Linked record
    'UTM Campaign'?: string // Lookup
    'UTM Source'?: string // Lookup
    'UTM Medium'?: string // Lookup

    // === METADATA ===
    'Created Date'?: string // Created time
    'Last Modified'?: string // Last modified time
    'Last Export Date'?: string // Date

    // Allow for any additional fields
    [key: string]: unknown
  }
}

// ============================================
// Airtable Testimonials Table Record
// ============================================

export interface AirtableTestimonialRecord {
  id: string
  fields: {
    'Testimonial ID'?: number
    'Client Name'?: string[] // Linked record
    Active?: boolean
    Featured?: boolean

    'Customer Name'?: string
    'Customer City'?: string
    'Customer State'?: string

    Rating?: number // 1-5
    'Review Title'?: string
    'Review Text'?: string
    'Review Date'?: string

    Source?: string // Google, Yelp, Facebook, etc.
    'Source URL'?: string
    Verified?: boolean

    'Service ID'?: string[] // Linked record (optional)
    'Branch ID'?: string[] // Linked record (optional)

    'Before Photo URL'?: string
    'After Photo URL'?: string

    'Created Date'?: string
    'Last Modified'?: string

    [key: string]: unknown
  }
}

// ============================================
// Airtable Branch Staff Table Record
// ============================================

export interface AirtableBranchStaffRecord {
  id: string
  fields: {
    'Staff ID'?: number
    'Full Name'?: string
    'Branch ID'?: string[] // Linked record
    Active?: boolean

    'Job Title'?: string
    'Role Type'?: string
    'Primary Contact'?: boolean

    'Years of Experience'?: number
    Certifications?: string
    Specialties?: string[] // Multiple select

    'Photo URL'?: string
    Bio?: string
    Quote?: string

    Email?: string
    'Phone Extension'?: string

    Featured?: boolean
    'Display Order'?: number
    'Hired Date'?: string

    'Created Date'?: string

    [key: string]: unknown
  }
}

// ============================================
// Airtable API Response Types
// ============================================

/**
 * Generic Airtable API response for paginated queries
 */
export interface AirtableListResponse<T> {
  records: T[]
  offset?: string // Pagination token
}

/**
 * Airtable error response
 */
export interface AirtableError {
  error: {
    type: string
    message: string
  }
}
