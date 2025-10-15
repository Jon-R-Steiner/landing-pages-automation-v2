# Airtable Data Model v2.0

> **⚠️ FUTURE ENHANCEMENT - NOT CURRENT IMPLEMENTATION**
>
> **Current Phase:** Phase 0.3 - Phase 1 MVP (12 tables) is production-ready and LOCKED
>
> **This Document:** Phase 2 enhancement proposal (15 tables, A/B testing, analytics, bulk imports)
>
> **Status:** Evaluated by architect, ready for future implementation
>
> **When to Use:** Phase 1.0+ planning and implementation
>
> **Current Data Model:** See [`data-models.md`](data-models.md) for Phase 1 MVP (12 tables, in production)

---

**Comprehensive Schema with Best Practices**

## Overview

This is a battle-tested, production-ready Airtable schema designed for:
- ✅ 5,000+ landing pages
- ✅ Multi-client management
- ✅ AI content generation at scale
- ✅ Advanced workflow automation
- ✅ A/B testing and analytics
- ✅ Data integrity and validation

---

## Table Architecture (14 Tables)

```
CORE TABLES:
  1. Clients
  2. Services
  3. Locations
  4. Branch Locations
  5. Branch Staff
  6. Pages (main content table)
  7. Page Variants (for A/B testing)

CONTENT TABLES:
  8. Content Blocks
  9. CTAs
  10. Hero Images Library
  11. Testimonials

WORKFLOW TABLES:
  12. Campaigns
  13. Page Analytics
  14. Bulk Import Jobs
```

---

## 1. Clients Table

### Purpose
Master client configuration and branding

### Fields

```yaml
IDENTITY:
  - Client ID (auto-number) [Primary Key]
  - Client Name (single line text) *Required
  - Domain (URL) *Required - "bathsrus.com"
  - Active (checkbox) *Default: true

BRANDING:
  - Logo URL (URL)
  - Primary Color (single line text) - "#0ea5e9"
  - Secondary Color (single line text) - "#8b5cf6"
  - Google Fonts (single line text) - "Inter"
  - Brand Voice (single select) - Professional, Friendly, Urgent, Luxury

CONTACT:
  - Primary Phone (phone)
  - Primary Email (email)
  - Corporate Address (single line text)

TRACKING & INTEGRATIONS:
  - GTM Container ID (single line text)
  - CallRail Swap Target (single line text)
  - reCAPTCHA Site Key (single line text)
  - Salesforce Campaign ID (single line text)
  - Make.com Webhook URL (URL)
  - Google Analytics Property ID (single line text)

BUSINESS INFO:
  - Years in Business (number)
  - Licensed Since (number) - Year
  - Insurance Amount (currency)
  - BBB Rating (single select) - A+, A, B, etc.
  - Default Warranty Years (number)

METADATA:
  - Total Pages (rollup count from Pages)
  - Total Branches (rollup count from Branch Locations)
  - Created Date (created time)
  - Last Modified (last modified time)

RELATIONSHIPS:
  - Branch Locations (linked to Branch Locations)
  - Pages (linked to Pages)
  - Services Offered (linked to Services)
```

### Validations
```yaml
Unique Constraint: Client Name + Domain must be unique
Required: Client Name, Domain, Active
Domain Format: Must not include "https://" or trailing "/"
```

---

## 2. Services Table ⭐ NEW

### Purpose
Centralized service definitions and configuration

### Fields

```yaml
IDENTITY:
  - Service ID (auto-number) [Primary Key]
  - Service Name (single line text) *Required - "Bathroom Remodeling"
  - Service Slug (single line text) *Required - "bathroom-remodeling"
  - Service Category (single select) - Remodeling, Repair, Installation, Maintenance
  - Active (checkbox) *Default: true

SEO & CONTENT:
  - SEO Keywords (long text) - Comma-separated
  - Default Meta Description Template (long text)
  - Icon Name (single line text) - For UI icons

SERVICE DETAILS:
  - Typical Timeline (single line text) - "2-3 weeks"
  - Price Range Low (currency) - $8,000
  - Price Range High (currency) - $25,000
  - Service Description (long text)

AI CONFIGURATION:
  - AI Prompt Template (long text) - Service-specific instructions
  - Default Trust Bar Topics (long text, JSON array)
  - Default FAQ Topics (long text, JSON array)
  - Tone Preference (single select) - Professional, Conversational, Urgent

DEFAULTS:
  - Default CTA ID (linked to CTAs)
  - Default Hero Image Category (single select)

METADATA:
  - Total Pages (rollup count from Pages)
  - Avg Conversion Rate (rollup avg from Page Analytics)
  - Last Used (rollup max from Pages → Created Date)

RELATIONSHIPS:
  - Pages (linked to Pages)
  - Available CTAs (linked to CTAs)
```

### Validations
```yaml
Unique Constraint: Service Slug must be unique
URL Format: Service Slug must be lowercase, hyphens only, no spaces
Required: Service Name, Service Slug, Active
```

---

## 3. Locations Table ⭐ NEW

### Purpose
Validated city/location master data

### Fields

```yaml
IDENTITY:
  - Location ID (auto-number) [Primary Key]
  - City (single line text) *Required - "Strongsville"
  - State (single select) *Required - OH, NC, FL, etc.
  - County (single line text) - "Cuyahoga"
  - URL Slug (formula) - LOWER(SUBSTITUTE({City}, " ", "-"))
  - Active (checkbox) *Default: true

GEOGRAPHY:
  - Zip Codes (long text) - "44136, 44149" (comma-separated)
  - Latitude (number) - For distance calculations
  - Longitude (number)
  - Service Radius Miles (number) - 25

DEMOGRAPHICS (for AI context):
  - Population (number) - 44,750
  - Median Income (currency) - $72,500
  - Median Home Value (currency) - $185,000
  - Primary Industry (single line text)

SEO:
  - SEO Keywords (long text) - "strongsville, strongsville ohio, 44136"
  - Local Landmarks (long text) - "Strongsville Commons, SouthPark Mall"

METADATA:
  - Total Pages (rollup count from Pages)
  - Served By Branches (linked to Branch Locations via Service Areas)
  - Created Date (created time)

RELATIONSHIPS:
  - Pages (linked to Pages)
  - Branch Locations (linked via Service Areas table)
```

### Validations
```yaml
Unique Constraint: City + State must be unique
Required: City, State, Active
State: Must be 2-letter state code
```

---

## 4. Branch Locations Table (UPDATED)

### Purpose
Physical office locations with service area mapping

### Fields

```yaml
IDENTITY:
  - Branch ID (auto-number) [Primary Key]
  - Branch Name (single line text) *Required - "Medina Office"
  - Client Name (linked to Clients) *Required
  - Active (checkbox) *Default: true

LOCATION:
  - Street Address (single line text)
  - City (single line text) *Required
  - State (single select) *Required
  - Zip Code (single line text)
  - Full Address (formula) - Concatenate address fields

CONTACT:
  - Phone (phone) *Required
  - Email (email)
  - Fax (phone) - Optional

METADATA:
  - Google Maps Embed URL (URL)
  - Google Maps Place ID (single line text)
  - Photos (attachment) - Office photos

HOURS:
  - Hours Summary (long text) - "Mon-Fri 8am-6pm, Sat 9am-4pm"
  - After Hours Phone (phone) - Emergency contact

SERVICE AREA:
  - Service Radius Miles (number) - 25
  - Service Areas (linked to Service Areas table) - Multiple cities

RELATIONSHIPS:
  - Client (linked to Clients)
  - Service Areas (linked to Service Areas table)
  - Staff (linked to Branch Staff)
  - Pages Served (rollup from Pages via Matched Branch)

METADATA:
  - Total Cities Served (rollup count from Service Areas)
  - Total Pages (rollup count from Pages)
  - Created Date (created time)
  - Last Modified (last modified time)
```

---

## 5. Service Areas Table ⭐ NEW

### Purpose
Junction table for Branch → Cities relationship (many-to-many)

### Fields

```yaml
IDENTITY:
  - Service Area ID (auto-number) [Primary Key]
  - Branch ID (linked to Branch Locations) *Required
  - Location ID (linked to Locations) *Required
  - Active (checkbox) *Default: true

COMPUTED:
  - Unique Key (formula) - CONCATENATE({Branch ID}, "-", {Location ID})
  - Branch Name (lookup from Branch ID)
  - City (lookup from Location ID)
  - State (lookup from Location ID)

METADATA:
  - Pages in This Area (rollup count from Pages where Location = this Location)
  - Created Date (created time)
```

### Why This Design?

```yaml
OLD DESIGN (Limited):
  Branch Locations.Service Area Cities = [Strongsville, Brunswick, Medina]
  Problem: Multiple select limited to ~50 options, can't dynamically add cities

NEW DESIGN (Scalable):
  Service Areas Table:
    Row 1: Medina Office → Strongsville
    Row 2: Medina Office → Brunswick
    Row 3: Medina Office → Medina
    Row 4: Hilliard Office → Columbus
    Row 5: Hilliard Office → Dublin

  Benefits:
    ✅ Unlimited cities per branch
    ✅ Validated cities from Locations table
    ✅ Easy to query "which branches serve Strongsville?"
    ✅ Can add new cities without schema changes
```

---

## 6. Branch Staff Table ⭐ NEW

### Purpose
Team member profiles for personalization

### Fields

```yaml
IDENTITY:
  - Staff ID (auto-number) [Primary Key]
  - Full Name (single line text) *Required
  - Branch ID (linked to Branch Locations) *Required
  - Active (checkbox) *Default: true

ROLE:
  - Job Title (single line text) - "Lead Project Manager"
  - Role Type (single select) - Sales, Project Manager, Installer, Admin
  - Primary (checkbox) - Is this the main contact for branch?

EXPERIENCE:
  - Years of Experience (number)
  - Certifications (long text) - Comma-separated
  - Specialties (multiple select) - Bathroom, Kitchen, Basement, etc.

CONTENT:
  - Photo URL (URL)
  - Bio (long text) - 2-3 sentences
  - Quote (long text) - "Quality craftsmanship is our standard"

CONTACT:
  - Email (email)
  - Phone Extension (single line text)
  - LinkedIn URL (URL)

METADATA:
  - Featured (checkbox) - Show on "Meet the Team" pages
  - Display Order (number) - For team page ordering
  - Hired Date (date)
  - Created Date (created time)

RELATIONSHIPS:
  - Branch (linked to Branch Locations)
  - Client (lookup from Branch → Client)
```

### Use Case
```yaml
AI Prompt Context:
  "Our Medina team is led by John Smith, a certified Project Manager
   with 15 years of experience in bathroom remodeling."
```

---

## 7. Pages Table (COMPREHENSIVE UPDATE)

### Purpose
Landing page content and workflow management

### Fields

```yaml
IDENTITY & ROUTING:
  - Page ID (auto-number) [Primary Key]
  - Client Name (linked to Clients) *Required
  - Service ID (linked to Services) *Required
  - Location ID (linked to Locations) - Optional for non-location pages
  - Unique Key (formula) - {Client}-{Service}-{Location} for duplicate detection
  - URL Slug (formula) - Auto-generated from service/location
  - Page URL (formula) - Full URL with domain

WORKFLOW STATUS:
  - Status (single select) *Required
    Options: Draft, AI Processing, Ready for Review, Approved, Scheduled, Published, Archived, Failed
  - Published (checkbox) - Is it live?
  - Publish Date (date) - When it went live
  - Unpublish Date (date) - Scheduled removal
  - Scheduled Publish Date (date) - Future publishing

AUTO-MATCHED DATA:
  - Matched Branch (linked to Branch Locations via automation)
  - Branch City (lookup)
  - Branch State (lookup)
  - Branch Phone (lookup)
  - Branch Address (lookup)
  - Branch Email (lookup)

MANUAL INPUT (Marketing fills):
  - Special Instructions (long text) - Context for AI
  - Campaign (linked to Campaigns) - Optional
  - Priority (single select) - High, Medium, Low
  - Notes (long text) - Internal notes

AI-GENERATED CONTENT:
  - SEO Title (single line text)
  - SEO Description (long text)
  - H1 Headline (single line text)
  - Hero Subheadline (long text)

  - Selected CTA ID (linked to CTAs)
  - CTA Text (lookup)
  - CTA Action Type (lookup)
  - CTA Action Value (lookup)

  - Selected Hero Image ID (linked to Hero Images Library)
  - Hero Image URL (lookup)
  - Hero Image Alt Text (lookup)

  - Trust Bar 1-5 (single line text x5)
  - FAQs (long text, JSON array)
  - Gallery Captions (long text, JSON array)

VERSION CONTROL: ⭐ NEW
  - AI Original Content (long text, JSON) - Frozen AI output
  - Content Version (number) - Increments on edits
  - Human Edited (checkbox) - Flagged if manually changed
  - Edit History (long text, JSON) - Who changed what when
  - Last Edited By (user field)

AI METADATA:
  - AI Generation Timestamp (date/time)
  - AI Model Used (single line text)
  - AI Tokens Used (number)
  - CTA Selection Reasoning (long text)
  - AI Retry Count (number) - Failed attempts
  - AI Last Error (long text) - Error messages
  - AI Error Date (date)

SEO ADVANCED: ⭐ NEW
  - Canonical URL Override (URL) - If different from Page URL
  - Robots Meta (single select) - index,follow / noindex,nofollow
  - OG Image URL (URL) - Social sharing image
  - OG Title Override (single line text)
  - OG Description Override (long text)
  - Twitter Card Type (single select) - summary_large_image
  - Schema.org Type (single select) - LocalBusiness, Service, Product
  - Sitemap Priority (number 0-1) - Default 0.5
  - Sitemap Change Freq (single select) - weekly, monthly

APPROVAL WORKFLOW: ⭐ NEW
  - Created By (user field)
  - Submitted By (user field) - Who triggered AI
  - Reviewed By (user field) - Who reviewed AI output
  - Approved By (user field) - Who approved for publish
  - Approval Date (date)
  - Rejection Reason (long text)

URL MANAGEMENT: ⭐ NEW
  - Previous URLs (long text) - Old URLs for redirects
  - Redirect From (long text, JSON array)
  - Redirect To (URL) - New URL if changed
  - Redirect Type (single select) - 301 Permanent, 302 Temporary

METADATA:
  - Created Date (created time)
  - Last Modified (last modified time)
  - Last Export Date (date) - For incremental exports
  - Modified Since Export (checkbox formula) - {Last Modified} > {Last Export Date}

RELATIONSHIPS:
  - Client (linked to Clients)
  - Service (linked to Services)
  - Location (linked to Locations)
  - Matched Branch (linked to Branch Locations)
  - Campaign (linked to Campaigns)
  - Selected CTA (linked to CTAs)
  - Selected Hero Image (linked to Hero Images Library)
  - Content Blocks (linked to Content Blocks)
  - Page Variants (linked to Page Variants)
  - Analytics (linked to Page Analytics)
```

### Formula Fields

```javascript
// URL Slug
IF(
  {Location ID} = BLANK(),
  LOWER({Service Slug}),
  CONCATENATE(LOWER({Service Slug}), "/", LOWER({Location Slug}))
)

// Page URL
CONCATENATE("https://", {Client Domain}, "/", {URL Slug})

// Unique Key (for duplicate detection)
CONCATENATE(
  {Client Name},
  "-",
  {Service Slug},
  "-",
  IF({Location Slug} = BLANK(), "national", {Location Slug})
)

// Modified Since Export
IF(
  {Last Export Date} = BLANK(),
  TRUE(),
  {Last Modified} > {Last Export Date}
)
```

### Validations
```yaml
Required: Client Name, Service ID, Status
Unique: Unique Key (enforced via automation)
Status Flow: Draft → AI Processing → Ready for Review → Approved → Published
```

---

## 8. Page Variants Table ⭐ NEW

### Purpose
A/B testing different headlines, CTAs, images

### Fields

```yaml
IDENTITY:
  - Variant ID (auto-number) [Primary Key]
  - Parent Page ID (linked to Pages) *Required
  - Variant Name (single line text) *Required - "Control", "Variant A", "Variant B"
  - Active (checkbox) *Default: true

VARIANT CONTENT (overrides):
  - H1 Headline Override (single line text)
  - Hero Subheadline Override (long text)
  - Selected CTA Override (linked to CTAs)
  - Selected Hero Image Override (linked to Hero Images Library)

A/B TEST CONFIG:
  - Traffic Split % (number) *Required - 33, 50, etc.
  - Start Date (date)
  - End Date (date)
  - Test Status (single select) - Running, Paused, Completed, Winner

PERFORMANCE:
  - Page Views (number) - From analytics webhook
  - Unique Visitors (number)
  - Form Submissions (number)
  - Conversion Rate (formula) - {Form Submissions} / {Unique Visitors}
  - Winner (checkbox) - Best performer

METADATA:
  - Created Date (created time)
  - Last Modified (last modified time)
  - Last Analytics Update (date)

RELATIONSHIPS:
  - Parent Page (linked to Pages)
```

### Use Case
```yaml
Page: bathroom-remodeling/strongsville

Variants:
  Control (50% traffic):
    H1: "Transform Your Strongsville Bathroom in 2 Weeks"
    CTA: "Get Free Quote"

  Variant A (50% traffic):
    H1: "Bathroom Remodeling Strongsville - Licensed & Insured"
    CTA: "Call Now - Limited Slots"

After 2 weeks:
  Control: 3.2% conversion rate
  Variant A: 4.8% conversion rate ← Winner!

Action: Promote Variant A to main page content
```

---

## 9. Content Blocks Table ⭐ NEW

### Purpose
Flexible, modular content sections

### Fields

```yaml
IDENTITY:
  - Block ID (auto-number) [Primary Key]
  - Page ID (linked to Pages) *Required
  - Block Type (single select) *Required
    Options: Features, Benefits, Process, Testimonials, Gallery, FAQ, Custom, Video
  - Active (checkbox) *Default: true

CONTENT:
  - Heading (single line text)
  - Subheading (single line text)
  - Body Text (long text, Markdown)
  - Custom HTML (long text) - For advanced layouts
  - Icon Name (single line text) - For icon libraries

LAYOUT:
  - Order (number) *Required - Sequencing on page
  - Layout Style (single select) - 2-column, 3-column, Full-width, Grid
  - Background Color (single line text) - Hex code
  - Background Image URL (URL)

AI METADATA:
  - AI Generated (checkbox)
  - AI Prompt Used (long text)
  - AI Tokens Used (number)

MEDIA:
  - Images (attachment) - Multiple images
  - Video URL (URL)
  - Video Embed Code (long text)

METADATA:
  - Created Date (created time)
  - Last Modified (last modified time)
  - Created By (user field)

RELATIONSHIPS:
  - Page (linked to Pages)
```

### Use Case
```yaml
Page: bathroom-remodeling/strongsville

Content Blocks:
  Order 1: Hero (built-in to page)
  Order 2: Features (Content Block)
    - Type: Features
    - Layout: 3-column
    - AI Generated: ✓
    - Icons: [shield-check, clock, star, dollar-sign]

  Order 3: Process (Content Block)
    - Type: Process
    - Layout: Full-width
    - Steps: Consultation → Design → Build → Enjoy

  Order 4: Gallery (Content Block)
    - Type: Gallery
    - Images: 12 before/after photos
    - AI Captions: ✓

  Order 5: Testimonials (Content Block)
    - Type: Testimonials
    - Pulls from Testimonials table

  Order 6: FAQ (built-in to page, but could be block)

Benefits:
  ✅ Flexible page structures (not all pages identical)
  ✅ Reusable blocks (copy block to another page)
  ✅ Mix AI + manual content
  ✅ Easy reordering (change Order field)
```

---

## 10. CTAs Table (UPDATED)

### Fields

```yaml
IDENTITY:
  - CTA ID (auto-number) [Primary Key]
  - CTA Text (single line text) *Required - "Get Free Quote"
  - CTA Type (single select) *Required - Primary, Secondary, Urgency, Call
  - Active (checkbox) *Default: true

ACTION:
  - CTA Action Type (single select) *Required - Scroll to Form, Phone Call, External Link, Open Modal
  - Action Value (single line text) *Required - "#contact-form", "tel:{phone}", URL

TARGETING: ⭐ NEW
  - Service Types (multiple select) - [bathroom, kitchen, basement, all]
  - Target Audience (multiple select) - First-time, Returning, High-intent
  - Traffic Source (multiple select) - Google Ads, Organic, Direct, Social
  - Device Type (multiple select) - Mobile, Desktop, Tablet

AI CONFIGURATION:
  - Priority (number) *Required - 1-10 (1 = highest)
  - AI Selection Notes (long text) - "Use for urgent, scarcity-driven copy"
  - Tone Match (multiple select) - Professional, Conversational, Urgent, Luxury

PERFORMANCE: ⭐ NEW
  - Times Used (rollup count from Pages)
  - Total Clicks (number) - From analytics
  - Total Conversions (number) - From analytics
  - Conversion Rate (formula) - {Total Conversions} / {Total Clicks}
  - Last Used Date (rollup max from Pages → Created Date)

METADATA:
  - Created Date (created time)
  - Last Modified (last modified time)
  - Created By (user field)

RELATIONSHIPS:
  - Pages Using This CTA (linked to Pages)
```

### Validations
```yaml
Required: CTA Text, CTA Type, CTA Action Type, Action Value, Priority
Unique: CTA Text (enforce via automation or manual review)
```

---

## 11. Hero Images Library Table (UPDATED)

### Fields

```yaml
IDENTITY:
  - Image ID (auto-number) [Primary Key]
  - Filename (single line text) *Required - "bathroom-remodeling-strongsville-hero-01.jpg"
  - Active (checkbox) *Default: true

CATEGORIZATION:
  - Service ID (linked to Services) - Optional
  - Location ID (linked to Locations) - Optional (blank = generic)
  - Image Type (single select) *Required - Hero, Gallery, Before/After, Team

ADVANCED CATEGORIZATION: ⭐ NEW
  - Season (single select) - Spring, Summer, Fall, Winter, Year-round
  - Style (single select) - Modern, Traditional, Luxury, Budget-friendly, Industrial
  - Featured Elements (multiple select) - Bathtub, Shower, Vanity, Tile, Fixtures
  - Color Palette (multiple select) - Neutral, Bold, Dark, Light, Warm, Cool
  - Tags (long text) - Comma-separated keywords

URLS:
  - Cloudinary URL (URL) *Required
  - Netlify Path (single line text) - "/images/heroes/bathroom-charlotte-01.jpg"
  - WebP Version URL (URL) - Modern format for performance

IMAGE METADATA: ⭐ NEW
  - Width (number) - 1920
  - Height (number) - 1080
  - Aspect Ratio (formula) - "16:9"
  - File Size KB (number)
  - Optimized (checkbox) - Compressed for web

ACCESSIBILITY:
  - Alt Text Template (long text) *Required
  - Caption (long text)
  - Photographer Credit (single line text)

APPROVAL WORKFLOW: ⭐ NEW
  - Upload Status (single select) - Draft, Pending Review, Approved, Rejected
  - Uploaded By (user field)
  - Reviewed By (user field)
  - Review Date (date)
  - Rejection Reason (long text)

PERFORMANCE:
  - Times Used (rollup count from Pages)
  - Last Used Date (rollup max from Pages → Created Date)

METADATA:
  - Upload Date (created time)
  - Last Modified (last modified time)
  - Last Synced (date) - From Netlify sync

RELATIONSHIPS:
  - Service (linked to Services)
  - Location (linked to Locations)
  - Pages Using This Image (linked to Pages)
```

### Validations
```yaml
Required: Filename, Cloudinary URL, Alt Text Template, Upload Status
Unique: Filename (via automation)
Approval: Only "Approved" images available to AI
```

---

## 12. Testimonials Table ⭐ NEW

### Purpose
Customer reviews and testimonials

### Fields

```yaml
IDENTITY:
  - Testimonial ID (auto-number) [Primary Key]
  - Client Name (linked to Clients) *Required
  - Active (checkbox) *Default: true
  - Featured (checkbox) - Show prominently

CUSTOMER INFO:
  - Customer Name (single line text) *Required
  - Customer Initial (formula) - First letter only for privacy
  - Customer City (single line text)
  - Customer State (single select)

REVIEW:
  - Rating (single select) *Required - 1, 2, 3, 4, 5 stars
  - Review Title (single line text) - "Amazing bathroom transformation!"
  - Review Text (long text) *Required
  - Review Date (date) *Required

SOURCE:
  - Source (single select) *Required - Google, Yelp, Facebook, Angi, Direct
  - Source URL (URL) - Link to original review
  - Verified (checkbox) - Verified customer

CONTEXT:
  - Service ID (linked to Services) - Optional
  - Branch ID (linked to Branch Locations) - Optional
  - Project Cost Range (single select) - Under $5k, $5-15k, $15-30k, $30k+

MEDIA:
  - Before Photo URL (URL)
  - After Photo URL (URL)
  - Video Testimonial URL (URL)

METADATA:
  - Times Displayed (number) - Track usage
  - Created Date (created time)
  - Created By (user field)

RELATIONSHIPS:
  - Client (linked to Clients)
  - Service (linked to Services)
  - Branch (linked to Branch Locations)
```

### Use Case
```yaml
AI Prompt Context:
  "Don't just take our word for it - see what Sarah M. from Strongsville said:
   '5 stars - Amazing bathroom transformation! The Medina team completed our
   master bath remodel in just 2.5 weeks. Highly recommend!'"
```

---

## 13. Campaigns Table ⭐ NEW

### Purpose
Group pages by marketing campaign

### Fields

```yaml
IDENTITY:
  - Campaign ID (auto-number) [Primary Key]
  - Campaign Name (single line text) *Required - "Spring 2025 Bathroom Promo"
  - Client Name (linked to Clients) *Required
  - Active (checkbox) *Default: true

CAMPAIGN TYPE:
  - Campaign Type (single select) *Required - Seasonal, Geographic, Service-specific, Product Launch
  - Start Date (date) *Required
  - End Date (date)
  - Status (single select) - Planning, Active, Paused, Completed

TARGETING:
  - Target Services (linked to Services)
  - Target Locations (linked to Locations)
  - Target Audience (multiple select) - First-time, Returning, High-value

TRACKING:
  - UTM Campaign (single line text) *Required - "spring-2025-bathroom"
  - UTM Source (single line text) - "google", "facebook"
  - UTM Medium (single line text) - "cpc", "email"

BUDGET & PERFORMANCE:
  - Budget (currency)
  - Total Spend (currency) - Updated manually or via webhook
  - Total Conversions (rollup sum from Page Analytics)
  - Total Revenue (currency)
  - Cost Per Conversion (formula) - {Total Spend} / {Total Conversions}
  - ROI (formula) - ({Total Revenue} - {Total Spend}) / {Total Spend}

CONTENT:
  - Campaign Description (long text)
  - Promotion Details (long text) - "20% off all bathroom projects"
  - Landing Page Template (single select) - Standard, Urgent, Luxury

METADATA:
  - Total Pages (rollup count from Pages)
  - Created Date (created time)
  - Created By (user field)

RELATIONSHIPS:
  - Client (linked to Clients)
  - Pages (linked to Pages)
  - Target Services (linked to Services)
  - Target Locations (linked to Locations)
```

### Use Case
```yaml
Campaign: "Spring 2025 Bathroom Promo"
  - Start: March 1, 2025
  - End: May 31, 2025
  - Budget: $15,000
  - Offer: "20% off bathroom remodels, free upgrade"

  Pages in Campaign:
    - bathroom-remodeling/strongsville
    - bathroom-remodeling/brunswick
    - bathroom-remodeling/medina
    (all get special promo content)

  Tracking:
    - UTM: ?utm_campaign=spring-2025-bathroom&utm_source=google&utm_medium=cpc
    - Total Spend: $12,450
    - Total Conversions: 37
    - Cost Per Conversion: $336
    - Revenue: $248,500
    - ROI: 1,895%
```

---

## 14. Page Analytics Table ⭐ NEW

### Purpose
Track page performance over time

### Fields

```yaml
IDENTITY:
  - Analytics ID (auto-number) [Primary Key]
  - Page ID (linked to Pages) *Required
  - Date (date) *Required

TRAFFIC:
  - Page Views (number)
  - Unique Visitors (number)
  - Sessions (number)

ENGAGEMENT:
  - Avg Time on Page (number) - Seconds
  - Bounce Rate (number) - Percentage (0-100)
  - Scroll Depth Avg (number) - Percentage

CONVERSIONS:
  - Form Submissions (number)
  - Phone Clicks (number)
  - CTA Clicks (number)
  - Total Conversions (formula) - Sum of all conversion types
  - Conversion Rate (formula) - {Total Conversions} / {Unique Visitors}

TRAFFIC SOURCES:
  - Organic Search (number)
  - Paid Search (number)
  - Direct (number)
  - Referral (number)
  - Social (number)

METADATA:
  - Data Source (single select) - Google Analytics, Mixpanel, Plausible
  - Import Date (created time)

RELATIONSHIPS:
  - Page (linked to Pages)
  - Campaign (lookup from Page → Campaign)
```

### Why Separate Table?

```yaml
Option A (Bad): Store analytics in Pages table
  Problem: Pages table gets huge with daily data

Option B (Good): Separate Page Analytics table
  Benefits:
    ✅ Historical tracking (one row per page per day)
    ✅ Trending analysis
    ✅ Doesn't bloat Pages table
    ✅ Easy to query "last 30 days performance"

Example Data:
  bathroom-remodeling/strongsville:
    2025-01-01: 234 views, 3.2% conversion
    2025-01-02: 198 views, 2.8% conversion
    2025-01-03: 312 views, 4.1% conversion
    ...
    (365 rows per page per year)
```

---

## 15. Bulk Import Jobs Table ⭐ NEW

### Purpose
Batch create pages via CSV upload

### Fields

```yaml
IDENTITY:
  - Job ID (auto-number) [Primary Key]
  - Job Name (single line text) *Required - "Ohio Expansion - 50 Cities"
  - Client Name (linked to Clients) *Required

IMPORT DATA:
  - CSV File (attachment) *Required
  - CSV Row Count (number)
  - Import Mapping (long text, JSON) - Column → field mapping

STATUS:
  - Status (single select) *Required - Pending, Processing, Complete, Failed
  - Progress (number) - Percentage complete
  - Started At (date)
  - Completed At (date)

RESULTS:
  - Total Rows (number)
  - Successful Imports (number)
  - Failed Imports (number)
  - Skipped Rows (number) - Duplicates
  - Error Log (long text) - Failed row details

CONFIGURATION:
  - Auto Trigger AI (checkbox) - Generate AI for all imported pages
  - Default Service (linked to Services) - If not in CSV
  - Default Status (single select) - Draft or AI Processing

METADATA:
  - Created Date (created time)
  - Created By (user field)

RELATIONSHIPS:
  - Client (linked to Clients)
  - Pages Created (linked to Pages)
```

### Use Case
```yaml
Marketing uploads CSV:
  service,location,special_instructions
  bathroom-remodeling,strongsville,Emphasize speed
  bathroom-remodeling,brunswick,
  kitchen-remodeling,medina,Luxury focus
  ...
  (50 rows)

Automation:
  1. Parse CSV
  2. Validate data (check for existing pages, validate services/locations)
  3. Create 50 Page records (Status: Draft)
  4. If "Auto Trigger AI" = checked:
     - Update all 50 pages → Status: AI Processing
     - AI Service processes batch
  5. Update Job Status: Complete
  6. Notify user: "50 pages created successfully"

Benefits:
  ✅ Bulk operations (500 pages in minutes, not hours)
  ✅ Error handling (tracks failed rows)
  ✅ Audit trail (who imported what when)
```

---

## Workflow Automations

### Automation 1: Auto-Match Branch Location
```yaml
Name: Match Branch to Page Location
Trigger: Page record created OR Location field updated
Conditions:
  - Location is not empty
  - Client Name is set

Actions:
  1. Find Records in Service Areas:
     - Location ID = Page.Location ID
     - Active = TRUE

  2. If found:
     - Update Page.Matched Branch = Service Area.Branch ID

  3. If NOT found:
     - Find Client's default/headquarters branch
     - Update Page.Matched Branch = Default Branch
     - Add note to Page.Notes: "⚠️ No branch found for {Location}, using default branch"
```

### Automation 2: Trigger AI Generation
```yaml
Name: Trigger AI Content Generation
Trigger: Status field changes to "AI Processing"
Conditions:
  - Service is not empty
  - Client Name is not empty

Actions:
  1. Webhook POST to AI Service:
     URL: https://ai-service.yourapp.com/generate-content
     Method: POST
     Headers:
       Authorization: Bearer {AI_SERVICE_API_KEY}
       Content-Type: application/json
     Body:
       {
         "pageId": "{Page ID}",
         "service": "{Service Slug}",
         "location": "{Location Slug}",
         "clientId": "{Client ID}",
         "branchId": "{Matched Branch ID}",
         "specialInstructions": "{Special Instructions}"
       }
```

### Automation 3: Trigger Export on Approval
```yaml
Name: Export to GitHub on Approval
Trigger: Status field changes to "Approved"
Conditions:
  - Published checkbox = TRUE (optional)

Actions:
  1. Webhook POST to GitHub Actions:
     URL: https://api.github.com/repos/{owner}/{repo}/dispatches
     Method: POST
     Headers:
       Authorization: Bearer {GITHUB_PAT}
       Accept: application/vnd.github.v3+json
     Body:
       {
         "event_type": "airtable_export",
         "client_payload": {
           "trigger": "page_approved",
           "page_id": "{Page ID}",
           "service": "{Service Slug}",
           "location": "{Location Slug}",
           "timestamp": "{Last Modified}"
         }
       }
```

### Automation 4: Prevent Duplicate Pages
```yaml
Name: Detect Duplicate Pages
Trigger: Page record created OR Unique Key field updated
Conditions:
  - COUNTALL({Unique Key}) > 1

Actions:
  1. Update Status → "Duplicate - Needs Review"
  2. Add to Page.Notes:
     "⚠️ DUPLICATE: Another page exists with same Client + Service + Location"
  3. Send Slack notification to #marketing:
     "Duplicate page detected: {Page URL}"
```

### Automation 5: AI Failure Handling
```yaml
Name: Handle AI Generation Failure
Trigger: AI Retry Count field updated
Conditions:
  - AI Retry Count >= 3

Actions:
  1. Update Status → "AI Failed - Manual Review Required"
  2. Send email to marketing manager:
     Subject: AI Generation Failed - {Service}/{Location}
     Body:
       Page ID: {Page ID}
       Error: {AI Last Error}
       Please review and manually create content or retry.
  3. Add to "Failed AI" view for batch review
```

### Automation 6: Schedule Publishing
```yaml
Name: Auto-Publish Scheduled Pages
Trigger: Every day at 6:00 AM (scheduled automation)
Conditions:
  - Status = "Scheduled"
  - Scheduled Publish Date <= TODAY()

Actions:
  1. Update Status → "Approved"
  2. Update Published checkbox → TRUE
  3. Update Publish Date → TODAY()
  4. Trigger Export automation (via Status change)
```

---

## Best Practices Summary

### ✅ Data Integrity
- Single select over free text (Services, Locations, Status)
- Linked records for relationships (not text references)
- Formula fields for computed values (URL Slug, Unique Key)
- Validation formulas to catch bad data
- Automation-enforced unique constraints

### ✅ Scalability
- Separate tables for analytics (don't bloat Pages table)
- Junction tables for many-to-many (Service Areas)
- Incremental exports (Modified Since Export flag)
- Archive strategy for old pages
- Bulk import for large datasets

### ✅ Workflow Automation
- Clear status progression with automations
- Error handling and retry logic
- Notifications on failures
- Audit trails (Created By, Approved By)
- Scheduled automations for recurring tasks

### ✅ Performance
- Rollup fields for counts (avoid manual counting)
- Lookup fields for related data (avoid duplicating)
- Limited use of formulas (expensive)
- Indexed fields (linked records are auto-indexed)

### ✅ User Experience
- Descriptive field names (not cryptic codes)
- Helpful views ("Needs Review", "Failed AI", "Ready to Publish")
- Color-coded status (conditional formatting)
- Grouped records (by Client, by Status)
- Filtered views (only active records, only my records)

---

## Migration Strategy (From v1 to v2)

### Phase 1: Add New Tables (Non-Breaking)
1. Create Services table → Populate from existing Pages
2. Create Locations table → Populate from existing Pages
3. Create Service Areas table → Migrate from Branch Locations
4. Create Testimonials, Campaigns, Page Analytics (empty initially)
5. Create Bulk Import Jobs (for future use)

### Phase 2: Add New Fields to Existing Tables
1. Pages table: Add version control, SEO advanced, approval workflow fields
2. Branch Locations: Link to Service Areas
3. CTAs: Add performance tracking fields
4. Hero Images: Add approval workflow, advanced categorization

### Phase 3: Update Automations
1. Update branch matching to use Service Areas
2. Add duplicate detection automation
3. Add AI failure handling automation
4. Add scheduled publishing automation

### Phase 4: Data Migration
1. Convert existing Service (text) → Service (linked record)
2. Convert existing Location (text) → Location (linked record)
3. Backfill Service Areas from Branch Locations
4. Test all automations with new data model

### Phase 5: Cleanup
1. Archive old fields (keep for 30 days)
2. Update documentation
3. Train team on new workflows
4. Monitor for issues

---

**Data Model Version:** 2.0
**Recommended for:** Production deployments, 5000+ pages, multi-client
**Author:** Winston (Architect)
**Last Updated:** 2025-01-09
