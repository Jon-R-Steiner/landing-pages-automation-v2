/**
 * Airtable Schema Types
 *
 * TypeScript interfaces for Airtable records as returned from the API.
 * These types document the field names and structure from Airtable.
 *
 * NOTE: Airtable returns linked records as string arrays (Record IDs)
 *       and lookup fields as their actual values.
 *
 * SCHEMA REFERENCE: See Archive/airtable-schema-phase1.md for complete field definitions
 *
 * BASE ID: appATvatPtaoJ8MmS
 * BASE NAME: Landing Pages Content Management
 *
 * TABLES (12):
 * 1. Clients - Business information, branding, tracking IDs
 * 2. Services - Service definitions with keyword grouping
 * 3. Locations - Validated city master data
 * 4. Branch Locations - Physical office locations
 * 5. Service Areas - Junction table (branches × cities)
 * 6. Branch Staff - Team member profiles
 * 7. Pages - Landing page content (main table)
 * 8. CTAs - Call-to-action library
 * 9. Hero Images Library - Image asset management
 * 10. Testimonials - Customer reviews
 * 11. Offers - Promotional campaigns
 * 12. Campaigns - Marketing campaign tracking
 */

// ============================================
// Airtable Clients Table Record
// ============================================

/**
 * Clients table: Business information, branding, tracking IDs
 * Schema reference: Archive/airtable-schema-phase1.md lines 36-96
 */
export interface AirtableClientRecord {
  id: string // Airtable Record ID (e.g., "recABC123")
  fields: {
    // === IDENTITY ===
    'Client ID'?: number // Auto-number
    'Client Name'?: string // Required
    Domain?: string // Required - "bathsrus.com" (no https://, no trailing /)
    Active?: boolean // Default: true

    // === BRANDING ===
    'Logo URL'?: string
    'Primary Color'?: string // "#0ea5e9"
    'Secondary Color'?: string // "#8b5cf6"
    'Google Fonts'?: string // "Inter"

    // === CONTACT ===
    'Primary Phone'?: string // Required
    'Primary Email'?: string // Required
    'Corporate Address'?: string

    // === TRACKING & INTEGRATIONS ===
    'GTM Container ID'?: string
    'CallRail Swap Target'?: string
    'reCAPTCHA Site Key'?: string
    'Salesforce Campaign ID'?: string
    'Make.com Webhook URL'?: string
    'Google Analytics Property ID'?: string

    // === BUSINESS INFO ===
    'Founded Date'?: string // Date - Required
    'Years in Business'?: number // Formula
    'Licensed Since'?: number // Year (e.g., 2010)
    'Years Licensed'?: number // Formula
    'Insurance Amount'?: number // Currency
    'BBB Rating'?: string // Single select
    'Product Warranty'?: string // e.g., "Double Lifetime", "10 Years"
    'Workmanship Warranty Years'?: number

    // === METADATA ===
    'Total Pages'?: number // Rollup count
    'Total Branches'?: number // Rollup count
    'Created Date'?: string // Created time
    'Last Modified'?: string // Last modified time

    // === RELATIONSHIPS ===
    'Branch Locations'?: string[] // Linked records
    Pages?: string[] // Linked records
    Testimonials?: string[] // Linked records
    Services?: string[] // Linked records
    Offers?: string[] // Linked records
    Campaigns?: string[] // Linked records

    [key: string]: unknown
  }
}

// ============================================
// Airtable Services Table Record
// ============================================

/**
 * Services table: Service definitions with keyword grouping for SEO
 * Schema reference: Archive/airtable-schema-phase1.md lines 98-251
 */
export interface AirtableServiceRecord {
  id: string
  fields: {
    // === IDENTITY ===
    'Service ID'?: number // Auto-number
    'Service Name'?: string // Required - "Bathroom Remodeling"
    'Service Slug'?: string // Required - "bathroom-remodeling"
    Active?: boolean // Default: true

    // === KEYWORD GROUPING (CRITICAL FOR SEO) ===
    'Primary Keywords'?: string // Long text - Required - Comma-separated, one per line
    'Canonical Keyword'?: string // Required - The ONE keyword for URLs and H1s
    'Keyword Group Notes'?: string // Long text - Explain grouping decisions

    // === SEO & CONTENT ===
    'Meta Description Template'?: string // Long text
    'Icon Name'?: string // "bathtub" (for UI)

    // === SERVICE DETAILS ===
    'Typical Timeline'?: string // "2-3 weeks"
    'Price Range Low'?: number // Currency
    'Price Range High'?: number // Currency
    'Service Description'?: string // Long text - For AI context

    // === AI CONFIGURATION ===
    'AI Tone Preference'?: string // Single select - Professional, Conversational, Urgent, Luxury
    'AI Prompt Template'?: string // Long text
    'Default Trust Bar Topics'?: string // Long text, JSON array

    // === METADATA ===
    'Total Pages'?: number // Rollup count
    'Last Used'?: string // Rollup max from Pages → Created Date
    'Created Date'?: string // Created time
    'Last Modified'?: string // Last modified time

    // === RELATIONSHIPS ===
    Client?: string[] // Linked to Clients
    Pages?: string[] // Linked to Pages
    'Hero Images Library'?: string[] // Linked records
    Testimonials?: string[] // Linked records
    Offers?: string[] // Linked records
    Campaigns?: string[] // Linked records

    [key: string]: unknown
  }
}

// ============================================
// Airtable Locations Table Record
// ============================================

/**
 * Locations table: Validated city master data with demographics
 * Schema reference: Archive/airtable-schema-phase1.md lines 253-360
 */
export interface AirtableLocationRecord {
  id: string
  fields: {
    // === IDENTITY ===
    'Location ID'?: number // Auto-number
    City?: string // Required - "Strongsville"
    State?: string // Single select - Required
    County?: string
    'URL Slug'?: string // Formula - Auto-generated - "strongsville"
    Active?: boolean // Default: true

    // === GEOGRAPHY ===
    'Zip Codes'?: string // Long text - "44136, 44149"
    'Primary Zip'?: string // "44136"

    // === DEMOGRAPHICS (for AI context) ===
    Population?: number
    'Median Income'?: number // Currency
    'Median Home Value'?: number // Currency

    // === SEO ===
    'SEO Keywords'?: string // Long text
    'Local Landmarks'?: string // Long text

    // === METADATA ===
    'Total Pages'?: number // Rollup count
    'Served By Branches'?: number // Rollup count
    'Created Date'?: string
    'Last Modified'?: string

    // === RELATIONSHIPS ===
    Pages?: string[] // Linked records
    'Service Areas'?: string[] // Linked records

    [key: string]: unknown
  }
}

// ============================================
// Airtable Branch Locations Table Record
// ============================================

/**
 * Branch Locations table: Physical office locations with timezone support
 * Schema reference: Archive/airtable-schema-phase1.md lines 362-507
 */
export interface AirtableBranchLocationRecord {
  id: string
  fields: {
    // === IDENTITY ===
    'Branch ID'?: number // Auto-number
    'Branch Name'?: string // Required - "Medina Office"
    'Client Name'?: string[] // Linked to Clients - Required
    Active?: boolean // Default: true

    // === LOCATION ===
    'Street Address'?: string
    City?: string // Required
    State?: string // Single select - Required
    'Zip Code'?: string
    'Full Address'?: string // Formula

    // === GEOLOCATION (AI MAX/PMAX OPTIMIZATION) ===
    Latitude?: number // Google Maps latitude coordinate (-90 to 90) - Required for LocalBusiness Schema
    Longitude?: number // Google Maps longitude coordinate (-180 to 180) - Required for LocalBusiness Schema

    // === TIMEZONE (CRITICAL FOR MULTI-STATE) ===
    Timezone?: string // Single select - Required - America/New_York, America/Chicago, etc.
    'Current Time'?: string // Formula - Display only

    // === CONTACT ===
    Phone?: string // Required
    Email?: string // Required
    'After Hours Phone'?: string

    // === METADATA ===
    'Google Maps Embed URL'?: string
    'Google Maps Place ID'?: string
    'Office Photos'?: unknown[] // Attachment

    // === HOURS ===
    'Hours Summary'?: string // Long text
    'Open Time Weekday'?: string // "08:00"
    'Close Time Weekday'?: string // "18:00"
    'Open Time Saturday'?: string
    'Close Time Saturday'?: string
    'Sunday Hours'?: string

    // === SERVICE AREA ===
    'Service Radius Miles'?: number

    // === METADATA ===
    'Total Cities Served'?: number // Rollup count
    'Total Pages'?: number // Rollup count
    'Created Date'?: string
    'Last Modified'?: string

    // === RELATIONSHIPS ===
    Client?: string[] // Linked to Clients
    'Service Areas'?: string[] // Linked records
    Staff?: string[] // Linked to Branch Staff
    'Pages Served'?: string[] // Linked via Matched Branch

    [key: string]: unknown
  }
}

// ============================================
// Airtable Service Areas Table Record
// ============================================

/**
 * Service Areas table: Junction table (which branches serve which cities)
 * Schema reference: Archive/airtable-schema-phase1.md lines 510-616
 */
export interface AirtableServiceAreaRecord {
  id: string
  fields: {
    // === IDENTITY ===
    'Service Area ID'?: number // Auto-number
    'Branch ID'?: string[] // Linked to Branch Locations - Required
    'Location ID'?: string[] // Linked to Locations - Required
    Active?: boolean // Default: true

    // === COMPUTED (Lookups) ===
    'Branch Name'?: string // Lookup
    'Branch City'?: string // Lookup
    'Branch State'?: string // Lookup
    'Service City'?: string // Lookup
    'Service State'?: string // Lookup
    'Unique Key'?: string // Formula

    // === METADATA ===
    'Pages in This Area'?: number // Rollup count
    'Created Date'?: string

    // === RELATIONSHIPS ===
    Branch?: string[] // Linked to Branch Locations
    Location?: string[] // Linked to Locations

    [key: string]: unknown
  }
}

// ============================================
// Airtable CTAs Table Record
// ============================================

/**
 * CTAs table: Call-to-action library for AI selection
 * Schema reference: Archive/airtable-schema-phase1.md lines 909-995
 */
export interface AirtableCTARecord {
  id: string
  fields: {
    // === IDENTITY ===
    'CTA ID'?: number // Auto-number
    'CTA Text'?: string // Required - "Get Free Quote"
    'CTA Type'?: string // Single select - Required - Primary, Secondary, Urgency, Call
    Active?: boolean // Default: true

    // === ACTION ===
    'CTA Action Type'?: string // Single select - Required - Scroll to Form, Phone Call, External Link
    'Action Value'?: string // Required - "#contact-form", "tel:{client_phone}", etc.

    // === TARGETING ===
    'Service Types'?: string[] // Multiple select

    // === AI CONFIGURATION ===
    Priority?: number // Required - 1-10 (1 = highest)
    'AI Selection Notes'?: string // Long text
    'Tone Match'?: string[] // Multiple select

    // === PERFORMANCE ===
    'Times Used'?: number // Rollup count
    'Last Used Date'?: string // Rollup max

    // === METADATA ===
    'Created Date'?: string
    'Last Modified'?: string

    // === RELATIONSHIPS ===
    'Pages Using This CTA'?: string[] // Linked records
    Services?: string[] // Linked records

    [key: string]: unknown
  }
}

// ============================================
// Airtable Hero Images Library Table Record
// ============================================

/**
 * Hero Images Library table: Image asset management with categorization
 * Schema reference: Archive/airtable-schema-phase1.md lines 998-1105
 */
export interface AirtableHeroImageRecord {
  id: string
  fields: {
    // === IDENTITY ===
    'Image ID'?: number // Auto-number
    Filename?: string // Required
    Active?: boolean // Default: true

    // === CATEGORIZATION ===
    'Service ID'?: string[] // Linked to Services - Optional
    'Location ID'?: string[] // Linked to Locations - Optional
    'Image Type'?: string // Single select - Required - Hero, Gallery, Before/After

    // === URLS ===
    'Cloudinary URL'?: string // Required
    'Netlify Path'?: string

    // === ACCESSIBILITY ===
    'Alt Text Template'?: string // Long text - Required

    // === APPROVAL ===
    'Upload Status'?: string // Single select - Default: Approved
    'Uploaded By'?: unknown // User field
    'Upload Date'?: string // Created time

    // === PERFORMANCE ===
    'Times Used'?: number // Rollup count
    'Last Used Date'?: string // Rollup max

    // === METADATA ===
    'Last Modified'?: string

    // === RELATIONSHIPS ===
    Service?: string[] // Linked to Services
    Location?: string[] // Linked to Locations
    'Pages Using This Image'?: string[] // Linked records

    [key: string]: unknown
  }
}

// ============================================
// Airtable Offers Table Record
// ============================================

/**
 * Offers table: Promotional campaigns with targeting rules
 * Schema reference: Archive/airtable-schema-phase1.md lines 1226-1453
 */
export interface AirtableOfferRecord {
  id: string
  fields: {
    // === IDENTITY ===
    'Offer ID'?: number // Auto-number
    'Offer Name'?: string // Required - "Spring 2025 Bathroom Promo"
    'Offer Slug'?: string // Formula - Auto-generated - "spring-2025-bathroom-promo"
    'Client Name'?: string[] // Linked to Clients - Required

    // === OFFER DETAILS ===
    'Offer Type'?: string // Single select - Required
    'Discount Value'?: string // "20%", "$1,000", etc.
    'Offer Description'?: string // Long text - Required
    'Fine Print'?: string // Long text

    // === VALIDITY ===
    'Start Date'?: string // Date - Required
    'End Date'?: string // Date - Required
    Status?: string // Formula - "Active", "Expired", or "Scheduled"

    // === TARGETING ===
    'Target Services'?: string[] // Linked to Services
    'Target Locations'?: string[] // Linked to Locations
    'Target Branches'?: string[] // Linked to Branch Locations

    // === AI CONFIGURATION ===
    'AI Prompt Addition'?: string // Long text
    'Headline Emphasis'?: string // Single select
    'CTA Override'?: string[] // Linked to CTAs

    // === TRACKING ===
    'UTM Campaign'?: string
    'Promo Code'?: string

    // === PERFORMANCE ===
    'Total Pages Using'?: number // Rollup count
    'Total Conversions'?: number
    'Estimated Revenue'?: number // Currency

    // === METADATA ===
    'Created Date'?: string
    'Last Modified'?: string
    'Created By'?: unknown // User field

    // === RELATIONSHIPS ===
    Client?: string[] // Linked to Clients
    'Pages Using This Offer'?: string[] // Linked records

    [key: string]: unknown
  }
}

// ============================================
// Airtable Campaigns Table Record
// ============================================

/**
 * Campaigns table: Marketing campaign tracking and UTM management
 * Schema reference: Archive/airtable-schema-phase1.md lines 1456-1546
 */
export interface AirtableCampaignRecord {
  id: string
  fields: {
    // === IDENTITY ===
    'Campaign ID'?: number // Auto-number
    'Campaign Name'?: string // Required - "Q2 2025 Bathroom Push"
    'Client Name'?: string[] // Linked to Clients - Required
    Active?: boolean // Default: true

    // === CAMPAIGN TYPE ===
    'Campaign Type'?: string // Single select - Required
    'Start Date'?: string // Date - Required
    'End Date'?: string // Date
    Status?: string // Single select - Planning, Active, Paused, Completed

    // === TARGETING ===
    'Target Services'?: string[] // Linked to Services
    'Target Locations'?: string[] // Linked to Locations
    'Campaign Offer'?: string[] // Linked to Offers

    // === TRACKING ===
    'UTM Campaign'?: string // Required
    'UTM Source'?: string
    'UTM Medium'?: string

    // === BUDGET ===
    Budget?: number // Currency
    'Total Spend'?: number // Currency

    // === CONTENT ===
    'Campaign Description'?: string // Long text
    'Campaign Goals'?: string // Long text

    // === METADATA ===
    'Total Pages'?: number // Rollup count
    'Created Date'?: string
    'Created By'?: unknown // User field

    // === RELATIONSHIPS ===
    Client?: string[] // Linked to Clients
    Pages?: string[] // Linked records

    [key: string]: unknown
  }
}

// ============================================
// Airtable Pages Table Record
// ============================================

/**
 * Pages table: Landing page content and workflow management (main table)
 * Schema reference: Archive/airtable-schema-phase1.md lines 715-906
 */

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

    // === PAGE TARGET KEYWORD ===
    'Target Keyword'?: string // Single line text - Specific keyword this page targets (from Service.Primary Keywords)

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
    'Founded Date'?: string // Lookup (Date)
    'Years in Business'?: number // Lookup (Formula)
    'Licensed Since'?: number // Lookup
    'Years Licensed'?: number // Lookup (Formula)
    'Insurance Amount'?: number // Lookup
    'BBB Rating'?: string // Lookup
    'Product Warranty'?: string // Lookup
    'Workmanship Warranty Years'?: number // Lookup

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
