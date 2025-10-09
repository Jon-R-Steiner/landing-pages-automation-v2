# Airtable Schema - Phase 1 MVP
**Production-Ready Data Model for Launch**

## Overview

Phase 1 focuses on core functionality with room for future expansion.

**Tables:** 11 core tables
**Max Capacity:** 3,000 pages
**Future-Proofed:** Fields planned for later features (dormant until needed)

---

## Table List

### **CORE TABLES** (7)
1. Clients
2. Services ⭐ (with keyword grouping)
3. Locations ⭐ (validated cities)
4. Branch Locations (with timezones)
5. Service Areas ⭐ (junction table)
6. Branch Staff ⭐
7. Pages (main content)

### **CONTENT TABLES** (3)
8. CTAs
9. Hero Images Library
10. Testimonials ⭐

### **MARKETING TABLES** (2)
11. Offers ⭐ (simultaneous promotions)
12. Campaigns

---

## 1. Clients Table

### Fields

```yaml
IDENTITY:
  - Client ID (auto-number) [Primary Key]
  - Client Name (single line text) *Required
  - Domain (URL) *Required - "bathsrus.com" (no https://, no trailing /)
  - Active (checkbox) *Default: true

BRANDING:
  - Logo URL (URL)
  - Primary Color (single line text) - "#0ea5e9"
  - Secondary Color (single line text) - "#8b5cf6"
  - Google Fonts (single line text) - "Inter"

CONTACT:
  - Primary Phone (phone) *Required
  - Primary Email (email) *Required
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
  - Licensed Since (number) - Year (e.g., 2010)
  - Insurance Amount (currency) - $2,000,000
  - BBB Rating (single select) - A+, A, B, C, etc.
  - Default Warranty Years (number) - Lifetime, 5, 10

METADATA:
  - Total Pages (rollup count from Pages)
  - Total Branches (rollup count from Branch Locations)
  - Created Date (created time)
  - Last Modified (last modified time)

RELATIONSHIPS:
  - Branch Locations (linked to Branch Locations table)
  - Pages (linked to Pages table)
  - Services Offered (linked to Services table)
  - Active Offers (linked to Offers table)
```

### Views
- All Clients
- Active Clients Only
- By Total Pages

---

## 2. Services Table ⭐

### Purpose
Centralized service definitions with **keyword grouping** to prevent duplicate pages

### Fields

```yaml
IDENTITY:
  - Service ID (auto-number) [Primary Key]
  - Service Name (single line text) *Required - "Bathroom Remodeling"
  - Service Slug (single line text) *Required - "bathroom-remodeling"
  - Active (checkbox) *Default: true

KEYWORD GROUPING: ⭐ CRITICAL FOR SEO
  - Primary Keywords (long text) *Required
    Format: Comma-separated, one per line
    Example:
      bathroom remodeling
      bathroom remodel
      bath remodeling
      bath remodel
      bathroom renovation

  - Canonical Keyword (single line text) *Required
    Purpose: The ONE keyword we use for URLs and H1s
    Example: "bathroom remodeling"

  - Keyword Group Notes (long text)
    Purpose: Explain grouping decisions
    Example: "Bath vs Bathroom: Not different enough for separate pages.
             Use 'bathroom remodeling' as canonical, others as synonyms."

SEO & CONTENT:
  - Meta Description Template (long text)
    Example: "Professional {service} in {location}. Licensed, insured, {years}+ years experience."
  - Icon Name (single line text) - "bathtub" (for UI)

SERVICE DETAILS:
  - Typical Timeline (single line text) - "2-3 weeks"
  - Price Range Low (currency) - $8,000
  - Price Range High (currency) - $25,000
  - Service Description (long text) - For AI context

AI CONFIGURATION:
  - AI Tone Preference (single select) - Professional, Conversational, Urgent, Luxury
  - AI Prompt Template (long text)
    Example: "Emphasize speed and quality. Mention licensed contractors."
  - Default Trust Bar Topics (long text, JSON)
    ["Licensed & Insured", "Years in Business", "Reviews", "Warranty", "Financing"]

DEFAULTS:
  - Default CTA ID (linked to CTAs)
  - Default Offer ID (linked to Offers) - Optional

METADATA:
  - Total Pages (rollup count from Pages)
  - Last Used (rollup max from Pages → Created Date)
  - Created Date (created time)
  - Last Modified (last modified time)

RELATIONSHIPS:
  - Pages (linked to Pages)
  - Default CTA (linked to CTAs)
  - Default Offer (linked to Offers)
```

### Keyword Grouping Logic

```yaml
Decision Framework:

Question: Should "bath remodel" and "bathroom remodel" be separate pages?

Analysis:
  - Search intent: Same (user wants bathroom renovation)
  - Search volume: Check Google Trends
  - Competition: Check if competitors have separate pages
  - Client preference: Ask marketing team

Decision:
  ✅ SAME PAGE if:
    - Search intent identical
    - Volume difference < 50%
    - No clear differentiation

  ❌ SEPARATE PAGES if:
    - Different intent (bath = bathtub only vs bathroom = full room)
    - High volume for both (10k+ searches/month each)
    - Competitors rank separate pages

Implementation:
  Service 1:
    Service Name: Bathroom Remodeling
    Service Slug: bathroom-remodeling
    Canonical Keyword: bathroom remodeling
    Primary Keywords:
      - bathroom remodeling
      - bathroom remodel
      - bath remodeling
      - bath remodel
      - master bathroom renovation

  AI Uses:
    - H1: "Bathroom Remodeling in {location}" (canonical)
    - Body copy: Uses all keyword variations naturally
    - SEO Title: "Bathroom Remodeling {location} | Bath Remodel | {Client}"
```

### Example Records

```yaml
Record 1:
  Service Name: Bathroom Remodeling
  Service Slug: bathroom-remodeling
  Canonical Keyword: bathroom remodeling
  Primary Keywords: |
    bathroom remodeling
    bathroom remodel
    bath remodeling
    bath remodel
    bathroom renovation
  Keyword Group Notes: "Bath vs Bathroom tested - no intent difference. Use bathroom as canonical."
  Active: ✓

Record 2:
  Service Name: Kitchen Remodeling
  Service Slug: kitchen-remodeling
  Canonical Keyword: kitchen remodeling
  Primary Keywords: |
    kitchen remodeling
    kitchen remodel
    kitchen renovation
    kitchen redesign
  Active: ✓

Record 3:
  Service Name: Basement Finishing
  Service Slug: basement-finishing
  Canonical Keyword: basement finishing
  Primary Keywords: |
    basement finishing
    basement remodeling
    finished basement
    basement renovation
  Keyword Group Notes: "Finishing vs Remodeling: Same intent, use finishing (more common in industry)."
  Active: ✓
```

### Views
- All Services
- Active Services Only
- By Total Pages
- Needs Keyword Review (where Keyword Group Notes is empty)

---

## 3. Locations Table ⭐

### Purpose
Validated city master data with demographics for AI

### Fields

```yaml
IDENTITY:
  - Location ID (auto-number) [Primary Key]
  - City (single line text) *Required - "Strongsville"
  - State (single select) *Required - OH, NC, FL, TX, etc.
  - County (single line text) - "Cuyahoga"
  - URL Slug (formula) *Auto-generated
    LOWER(SUBSTITUTE({City}, " ", "-"))
    Result: "strongsville"
  - Active (checkbox) *Default: true

GEOGRAPHY:
  - Zip Codes (long text) - "44136, 44149" (comma-separated)
  - Primary Zip (single line text) - "44136" (for maps)

DEMOGRAPHICS (for AI context):
  - Population (number) - 44,750
  - Median Income (currency) - $72,500
  - Median Home Value (currency) - $185,000

SEO:
  - SEO Keywords (long text)
    Example: "strongsville, strongsville ohio, strongsville oh, 44136"
  - Local Landmarks (long text)
    Example: "Strongsville Commons, SouthPark Mall, Cleveland Metroparks"

METADATA:
  - Total Pages (rollup count from Pages)
  - Served By Branches (rollup count from Service Areas)
  - Created Date (created time)
  - Last Modified (last modified time)

RELATIONSHIPS:
  - Pages (linked to Pages)
  - Service Areas (linked to Service Areas)
```

### Formula Fields

```javascript
// URL Slug
LOWER(SUBSTITUTE({City}, " ", "-"))

// Example: "North Royalton" → "north-royalton"
```

### Why This Approach?

```yaml
WITHOUT Locations Table:
  Pages.Location = free text "strongsville"
  Problems:
    ❌ User types "Strongsville" vs "strongsville" vs "Strongsville, OH"
    ❌ Creates duplicate pages
    ❌ No metadata for AI
    ❌ Inconsistent URLs

WITH Locations Table:
  Pages.Location = dropdown (linked record)
  Benefits:
    ✅ Guaranteed spelling consistency
    ✅ AI gets demographics automatically
    ✅ URL slugs always lowercase
    ✅ Prevents duplicates
    ✅ Easy to add new cities (just add row)
```

### Example Records

```yaml
Record 1:
  City: Strongsville
  State: OH
  County: Cuyahoga
  URL Slug: strongsville (auto)
  Population: 44,750
  Median Income: $72,500
  Zip Codes: 44136, 44149
  SEO Keywords: strongsville, strongsville ohio, strongsville oh, 44136
  Active: ✓

Record 2:
  City: Brunswick
  State: OH
  County: Medina
  URL Slug: brunswick (auto)
  Population: 34,255
  Median Income: $68,200
  Zip Codes: 44212
  Active: ✓
```

### Views
- All Locations
- Active Locations Only
- By State
- By County
- Needs Demographics (where Population is empty)

---

## 4. Branch Locations Table

### Purpose
Physical office locations with **timezone support**

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
  - Full Address (formula)
    CONCATENATE({Street Address}, ", ", {City}, ", ", {State}, " ", {Zip Code})

TIMEZONE: ⭐ CRITICAL FOR MULTI-STATE
  - Timezone (single select) *Required
    Options:
      - America/New_York (EST/EDT)
      - America/Chicago (CST/CDT)
      - America/Denver (MST/MDT)
      - America/Phoenix (MST - no DST)
      - America/Los_Angeles (PST/PDT)
      - America/Anchorage (AKST/AKDT)
      - Pacific/Honolulu (HST)

  - Current Time (formula) - Display only, for reference
    Uses: NOW() with timezone offset (Airtable limitation: can't do true timezone conversion)
    Note: Use this field for display only. Backend should handle timezone conversions.

CONTACT:
  - Phone (phone) *Required
  - Email (email) *Required
  - After Hours Phone (phone) - Optional emergency contact

METADATA:
  - Google Maps Embed URL (URL)
  - Google Maps Place ID (single line text)
  - Office Photos (attachment)

HOURS:
  - Hours Summary (long text)
    Example: "Monday-Friday: 8:00 AM - 6:00 PM\nSaturday: 9:00 AM - 4:00 PM\nSunday: Closed"

  - Open Time Weekday (single line text) - "08:00"
  - Close Time Weekday (single line text) - "18:00"
  - Open Time Saturday (single line text) - "09:00"
  - Close Time Saturday (single line text) - "16:00"
  - Sunday Hours (single line text) - "Closed"

SERVICE AREA:
  - Service Radius Miles (number) - 25

METADATA:
  - Total Cities Served (rollup count from Service Areas)
  - Total Pages (rollup count from Pages where Matched Branch = this branch)
  - Created Date (created time)
  - Last Modified (last modified time)

RELATIONSHIPS:
  - Client (linked to Clients)
  - Service Areas (linked to Service Areas)
  - Staff (linked to Branch Staff)
  - Pages Served (linked to Pages via Matched Branch)
```

### Timezone Use Cases

```yaml
Scenario 1: AI Content Generation
  Branch: Hilliard Office (Columbus, OH)
  Timezone: America/New_York (EST)

  AI generates: "Call us today between 8 AM - 6 PM EST"
  OR: "Open Monday-Friday 8:00 AM - 6:00 PM Eastern Time"

Scenario 2: Multi-State Client
  Client: National Remodeling Co

  Branch 1: Cleveland Office
    Timezone: America/New_York (EST)
    Hours: 8 AM - 6 PM EST

  Branch 2: Phoenix Office
    Timezone: America/Phoenix (MST, no DST)
    Hours: 8 AM - 6 PM MST

  Pages show correct local time for each branch

Scenario 3: Scheduled Publishing
  Publishing automation runs at: 6:00 AM (system time)

  Branch in EST: Publishes at 6:00 AM EST
  Branch in PST: Publishes at 6:00 AM PST (3 hours later in absolute time)

  Solution: Store "Scheduled Publish Time" in UTC, convert based on branch timezone
```

### Example Records

```yaml
Record 1:
  Branch Name: Medina Office
  Client: Baths R Us
  City: Medina
  State: OH
  Timezone: America/New_York
  Phone: (330) 555-1234
  Email: medina@bathsrus.com
  Hours Summary: |
    Monday-Friday: 8:00 AM - 6:00 PM EST
    Saturday: 9:00 AM - 4:00 PM EST
    Sunday: Closed
  Open Time Weekday: 08:00
  Close Time Weekday: 18:00
  Service Radius Miles: 25
  Active: ✓

Record 2:
  Branch Name: Phoenix Office
  Client: National Remodeling
  City: Phoenix
  State: AZ
  Timezone: America/Phoenix
  Phone: (602) 555-5678
  Hours Summary: |
    Monday-Friday: 8:00 AM - 6:00 PM MST
    Saturday: 9:00 AM - 2:00 PM MST
    Sunday: Closed
  Active: ✓
```

### Views
- All Branches
- Active Branches Only
- By Client
- By State
- By Timezone

---

## 5. Service Areas Table ⭐

### Purpose
Junction table: Which branches serve which cities? (Many-to-many relationship)

### Fields

```yaml
IDENTITY:
  - Service Area ID (auto-number) [Primary Key]
  - Branch ID (linked to Branch Locations) *Required
  - Location ID (linked to Locations) *Required
  - Active (checkbox) *Default: true

COMPUTED (Lookups):
  - Branch Name (lookup from Branch ID)
  - Branch City (lookup from Branch ID)
  - Branch State (lookup from Branch ID)
  - Service City (lookup from Location ID)
  - Service State (lookup from Location ID)
  - Unique Key (formula)
    CONCATENATE({Branch ID}, "-", {Location ID})

METADATA:
  - Pages in This Area (rollup count from Pages where Location ID = this Location)
  - Created Date (created time)

RELATIONSHIPS:
  - Branch (linked to Branch Locations)
  - Location (linked to Locations)
```

### Why Junction Table?

```yaml
OLD APPROACH (Doesn't Scale):
  Branch Locations.Service Area Cities = [Strongsville, Brunswick, Medina]

  Problems:
    ❌ Multiple select limited to ~50 cities
    ❌ Can't dynamically add cities
    ❌ Hard to query "which branches serve Strongsville?"

NEW APPROACH (Scalable):
  Service Areas Table:
    Row 1: Medina Office → Strongsville
    Row 2: Medina Office → Brunswick
    Row 3: Medina Office → Medina
    Row 4: Hilliard Office → Columbus
    Row 5: Hilliard Office → Dublin

  Benefits:
    ✅ Unlimited cities per branch
    ✅ Easy to query in both directions
    ✅ No schema changes needed to add cities
    ✅ Validated against Locations table
```

### Example Records

```yaml
Record 1:
  Branch ID: Medina Office
  Location ID: Strongsville
  Branch Name: Medina Office (lookup)
  Service City: Strongsville (lookup)
  Service State: OH (lookup)
  Unique Key: recBranch123-recLocation456
  Active: ✓

Record 2:
  Branch ID: Medina Office
  Location ID: Brunswick
  Active: ✓

Record 3:
  Branch ID: Hilliard Office
  Location ID: Columbus
  Active: ✓
```

### Automation: Auto-Match Branch to Page

```yaml
Trigger: Page record created OR Location field updated

Logic:
  1. Find Service Areas where:
     - Location ID = Page.Location ID
     - Active = TRUE

  2. If found:
     - Update Page.Matched Branch = Service Area.Branch ID

  3. If NOT found:
     - Find Client's default/HQ branch
     - Update Page.Matched Branch = Default Branch
     - Add warning to Page.Notes
```

### Views
- All Service Areas
- Active Service Areas
- By Branch
- By Location
- By State

---

## 6. Branch Staff Table ⭐

### Purpose
Team member profiles for AI personalization

### Fields

```yaml
IDENTITY:
  - Staff ID (auto-number) [Primary Key]
  - Full Name (single line text) *Required
  - Branch ID (linked to Branch Locations) *Required
  - Active (checkbox) *Default: true

ROLE:
  - Job Title (single line text) *Required - "Lead Project Manager"
  - Role Type (single select) - Sales, Project Manager, Installer, Admin, Owner
  - Primary Contact (checkbox) - Is this the main contact for branch?

EXPERIENCE:
  - Years of Experience (number)
  - Certifications (long text) - Comma-separated
  - Specialties (multiple select) - Bathroom, Kitchen, Basement, Flooring, etc.

CONTENT (for AI):
  - Photo URL (URL)
  - Bio (long text) - 2-3 sentences
  - Quote (long text) - "Quality craftsmanship is our standard"

CONTACT:
  - Email (email)
  - Phone Extension (single line text) - "ext. 205"

METADATA:
  - Featured (checkbox) - Show on team pages
  - Display Order (number) - For team page ordering
  - Hired Date (date)
  - Created Date (created time)

RELATIONSHIPS:
  - Branch (linked to Branch Locations)
  - Client (lookup from Branch → Client)
```

### AI Use Case

```yaml
Page: bathroom-remodeling/strongsville
Matched Branch: Medina Office

Staff at Medina Office:
  - John Smith (Project Manager, 15 years experience, Primary Contact)
  - Sarah Johnson (Lead Designer, 8 years experience)

AI Generates:
  "Your Strongsville bathroom remodel will be managed by our Medina office team,
   led by John Smith, a certified Project Manager with 15 years of experience
   in bathroom renovations. John and his team have completed over 500 bathroom
   projects across Cuyahoga and Medina counties."
```

### Example Records

```yaml
Record 1:
  Full Name: John Smith
  Branch: Medina Office
  Job Title: Lead Project Manager
  Role Type: Project Manager
  Primary Contact: ✓
  Years of Experience: 15
  Certifications: NARI Certified, OSHA 30-Hour
  Specialties: Bathroom, Kitchen
  Bio: "John has been transforming homes in Northeast Ohio since 2010..."
  Photo URL: https://res.cloudinary.com/.../john-smith.jpg
  Active: ✓

Record 2:
  Full Name: Sarah Johnson
  Branch: Medina Office
  Job Title: Lead Designer
  Role Type: Sales
  Years of Experience: 8
  Specialties: Bathroom, Kitchen
  Active: ✓
```

### Views
- All Staff
- Active Staff Only
- By Branch
- Primary Contacts Only
- Featured Staff (for team pages)

---

## 7. Pages Table

### Purpose
Landing page content and workflow management

### Fields

```yaml
=== IDENTITY & ROUTING ===

  - Page ID (auto-number) [Primary Key]
  - Client Name (linked to Clients) *Required
  - Service ID (linked to Services) *Required
  - Location ID (linked to Locations) - Optional (for non-location pages like About Us)

  - Unique Key (formula)
    CONCATENATE({Client Name}, "-", {Service Slug}, "-", IF({Location Slug}, {Location Slug}, "national"))
    Purpose: Duplicate detection
    Example: "Baths R Us-bathroom-remodeling-strongsville"

  - URL Slug (formula)
    IF(
      {Location ID} = BLANK(),
      {Service Slug},
      CONCATENATE({Service Slug}, "/", {Location Slug})
    )
    Result: "bathroom-remodeling/strongsville" OR "about-us"

  - Page URL (formula)
    CONCATENATE("https://", {Client Domain}, "/", {URL Slug})
    Result: "https://bathsrus.com/bathroom-remodeling/strongsville"

=== WORKFLOW STATUS ===

  - Status (single select) *Required *Default: Draft
    Options: Draft, AI Processing, Ready for Review, Approved, Published

  - Published (checkbox) - Is it live on site?
  - Publish Date (date) - When it went live
  - Unpublish Date (date) - Scheduled removal (future feature)

=== AUTO-MATCHED DATA ===

  - Matched Branch (linked to Branch Locations) - Auto-populated by automation
  - Branch City (lookup from Matched Branch)
  - Branch State (lookup from Matched Branch)
  - Branch Timezone (lookup from Matched Branch)
  - Branch Phone (lookup from Matched Branch)
  - Branch Address (lookup from Matched Branch)
  - Branch Email (lookup from Matched Branch)

=== MANUAL INPUT (Marketing fills) ===

  - Special Instructions (long text) - Context for AI
    Example: "Emphasize fast turnaround - client wants urgency angle"

  - Campaign (linked to Campaigns) - Optional
  - Offer (linked to Offers) - Optional (overrides service default)
  - Priority (single select) - High, Medium, Low
  - Notes (long text) - Internal notes

=== AI-GENERATED CONTENT ===

  - SEO Title (single line text)
  - SEO Description (long text)
  - H1 Headline (single line text)
  - Hero Subheadline (long text)

  - Selected CTA ID (linked to CTAs)
  - CTA Text (lookup from Selected CTA)
  - CTA Action Type (lookup)
  - CTA Action Value (lookup)

  - Selected Hero Image ID (linked to Hero Images Library)
  - Hero Image URL (lookup)
  - Hero Image Alt Text (lookup)

  - Trust Bar 1 (single line text)
  - Trust Bar 2 (single line text)
  - Trust Bar 3 (single line text)
  - Trust Bar 4 (single line text)
  - Trust Bar 5 (single line text)

  - FAQs (long text, JSON array)
    Example: [{"question":"...","answer":"..."},...]

  - Gallery Captions (long text, JSON array)
    Example: ["Caption 1", "Caption 2", ...]

=== VERSION CONTROL (Future Feature - Fields Added, No Workflow Yet) ===

  - AI Original Content (long text, JSON) - Frozen AI output (not used yet)
  - Content Version (number) - Increments on edits (not used yet)
  - Human Edited (checkbox) - Flagged if manually changed (not used yet)

=== AI METADATA ===

  - AI Generation Timestamp (date/time)
  - AI Model Used (single line text) - "claude-sonnet-4-5-20250929"
  - AI Tokens Used (number)
  - CTA Selection Reasoning (long text)

  - AI Retry Count (number) - Failed attempts (future: error handling)
  - AI Last Error (long text) - Error messages (future: error handling)

=== SEO (Basic for Now, Advanced Later) ===

  - Canonical URL Override (URL) - If different from Page URL (future)
  - Robots Meta (single select) - index,follow / noindex (future)

=== APPROVAL WORKFLOW (One Approver for Now) ===

  - Created By (user field)
  - Approved By (user field)
  - Approval Date (date)

=== METADATA ===

  - Created Date (created time)
  - Last Modified (last modified time)
  - Last Export Date (date) - Updated by export script

=== RELATIONSHIPS ===

  - Client (linked to Clients)
  - Service (linked to Services)
  - Location (linked to Locations)
  - Matched Branch (linked to Branch Locations)
  - Campaign (linked to Campaigns)
  - Offer (linked to Offers)
  - Selected CTA (linked to CTAs)
  - Selected Hero Image (linked to Hero Images Library)
```

### Formula Fields

```javascript
// Unique Key (for duplicate detection)
CONCATENATE(
  {Client Name},
  "-",
  {Service Slug},
  "-",
  IF({Location Slug} = BLANK(), "national", {Location Slug})
)

// URL Slug
IF(
  {Location ID} = BLANK(),
  {Service Slug},
  CONCATENATE({Service Slug}, "/", {Location Slug})
)

// Page URL
CONCATENATE("https://", {Client Domain}, "/", {URL Slug})
```

### Views
- All Pages
- Draft Pages
- AI Processing
- Ready for Review
- Approved (Ready to Export)
- Published Pages
- By Client
- By Service
- By Location
- By Status

---

## 8. CTAs Table

### Fields

```yaml
IDENTITY:
  - CTA ID (auto-number) [Primary Key]
  - CTA Text (single line text) *Required - "Get Free Quote"
  - CTA Type (single select) *Required - Primary, Secondary, Urgency, Call
  - Active (checkbox) *Default: true

ACTION:
  - CTA Action Type (single select) *Required
    Options: Scroll to Form, Phone Call, External Link

  - Action Value (single line text) *Required
    Examples:
      - "#contact-form" (Scroll to Form)
      - "tel:{client_phone}" (Phone Call - replaced at runtime)
      - "https://calendly.com/..." (External Link)

TARGETING:
  - Service Types (multiple select) - [bathroom-remodeling, kitchen-remodeling, all]

AI CONFIGURATION:
  - Priority (number) *Required - 1-10 (1 = highest priority for AI selection)
  - AI Selection Notes (long text)
    Example: "Use for urgent, scarcity-driven copy with aggressive tone"
  - Tone Match (multiple select) - Professional, Conversational, Urgent, Luxury

PERFORMANCE (Future Feature - GA4 Integration):
  - Times Used (rollup count from Pages)
  - Last Used Date (rollup max from Pages → Created Date)

METADATA:
  - Created Date (created time)
  - Last Modified (last modified time)

RELATIONSHIPS:
  - Pages Using This CTA (linked to Pages)
  - Services (linked to Services via default CTA)
```

### Example Records

```yaml
Record 1:
  CTA Text: Get Free Quote
  CTA Type: Primary
  CTA Action Type: Scroll to Form
  Action Value: #contact-form
  Service Types: [all]
  Priority: 1
  AI Selection Notes: Default CTA for most conversational, professional copy
  Tone Match: Professional, Conversational
  Active: ✓

Record 2:
  CTA Text: Call Now - Limited Slots!
  CTA Type: Urgency
  CTA Action Type: Phone Call
  Action Value: tel:{client_phone}
  Service Types: [all]
  Priority: 3
  AI Selection Notes: Use when copy emphasizes urgency, scarcity, or time-sensitive offers
  Tone Match: Urgent
  Active: ✓

Record 3:
  CTA Text: Schedule Your Free Consultation
  CTA Type: Primary
  CTA Action Type: Scroll to Form
  Action Value: #contact-form
  Service Types: [all]
  Priority: 2
  AI Selection Notes: Professional, higher-end projects. Works well with luxury tone.
  Tone Match: Professional, Luxury
  Active: ✓
```

### Views
- All CTAs
- Active CTAs
- By Type
- By Priority
- Most Used (sorted by Times Used)

---

## 9. Hero Images Library Table

### Fields

```yaml
IDENTITY:
  - Image ID (auto-number) [Primary Key]
  - Filename (single line text) *Required
    Format: {service}-{location}-{type}-{number}.jpg
    Example: "bathroom-remodeling-strongsville-hero-01.jpg"
  - Active (checkbox) *Default: true

CATEGORIZATION:
  - Service ID (linked to Services) - Optional (blank = generic, usable for any service)
  - Location ID (linked to Locations) - Optional (blank = generic, usable for any location)
  - Image Type (single select) *Required - Hero, Gallery, Before/After

URLS:
  - Cloudinary URL (URL) *Required
  - Netlify Path (single line text) - "/images/heroes/bathroom-strongsville-01.jpg"

ACCESSIBILITY:
  - Alt Text Template (long text) *Required
    Example: "Modern {service} in {location} - professional results"

APPROVAL (Phase 1: Assume Uploaded = Approved):
  - Upload Status (single select) *Default: Approved
    Options: Draft, Approved
  - Uploaded By (user field)
  - Upload Date (created time)

PERFORMANCE:
  - Times Used (rollup count from Pages)
  - Last Used Date (rollup max from Pages → Created Date)

METADATA:
  - Last Modified (last modified time)

RELATIONSHIPS:
  - Service (linked to Services)
  - Location (linked to Locations)
  - Pages Using This Image (linked to Pages)
```

### Upload Process (Phase 1)

```yaml
Step 1: Developer uploads to Netlify
  Path: /public/images/heroes/bathroom-remodeling-strongsville-hero-01.jpg

Step 2: Netlify build completes
  Image available at: https://bathsrus.netlify.app/images/heroes/bathroom-remodeling-strongsville-hero-01.jpg

Step 3: Developer creates Airtable record
  Filename: bathroom-remodeling-strongsville-hero-01.jpg
  Service: Bathroom Remodeling
  Location: Strongsville
  Cloudinary URL: [Upload to Cloudinary]
  Netlify Path: /images/heroes/bathroom-remodeling-strongsville-hero-01.jpg
  Alt Text Template: Professional bathroom remodeling in Strongsville, Ohio
  Upload Status: Approved (default)
  Active: ✓

Step 4: AI can now select this image
```

### Future Feature: Automated Sync
```yaml
Netlify Build Hook → Post-build script:
  - Scan /public/images/ directory
  - Check if each image exists in Airtable
  - If not, create Airtable record automatically
  - Status: Draft (requires manual approval)
```

### Example Records

```yaml
Record 1:
  Filename: bathroom-remodeling-strongsville-hero-01.jpg
  Service: Bathroom Remodeling
  Location: Strongsville
  Image Type: Hero
  Cloudinary URL: https://res.cloudinary.com/.../bathroom-strongsville-01.jpg
  Netlify Path: /images/heroes/bathroom-remodeling-strongsville-hero-01.jpg
  Alt Text Template: Modern bathroom remodeling in Strongsville, Ohio
  Upload Status: Approved
  Active: ✓

Record 2:
  Filename: kitchen-generic-hero-01.jpg
  Service: Kitchen Remodeling
  Location: [blank] (generic, usable for any location)
  Image Type: Hero
  Cloudinary URL: https://res.cloudinary.com/.../kitchen-generic-01.jpg
  Upload Status: Approved
  Active: ✓
```

### Views
- All Images
- Active Images
- By Service
- By Location
- By Image Type
- Needs Approval (Upload Status = Draft)
- Most Used

---

## 10. Testimonials Table ⭐

### Purpose
Customer reviews for AI personalization and social proof

### Fields

```yaml
IDENTITY:
  - Testimonial ID (auto-number) [Primary Key]
  - Client Name (linked to Clients) *Required
  - Active (checkbox) *Default: true
  - Featured (checkbox) - Show prominently on pages

CUSTOMER INFO:
  - Customer Name (single line text) *Required
  - Customer City (single line text)
  - Customer State (single select)

REVIEW:
  - Rating (single select) *Required - 1, 2, 3, 4, 5
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
  - Created Date (created time)
  - Last Modified (last modified time)

RELATIONSHIPS:
  - Client (linked to Clients)
  - Service (linked to Services)
  - Branch (linked to Branch Locations)
```

### AI Use Case

```yaml
Page: bathroom-remodeling/strongsville
Matched Branch: Medina Office

Query Testimonials:
  - Client = Baths R Us
  - Service = Bathroom Remodeling OR blank
  - Branch = Medina Office OR blank
  - Rating >= 4
  - Featured = TRUE
  - Active = TRUE

AI Generates:
  "Don't just take our word for it. Here's what Sarah M. from Strongsville said
   about our Medina team:

   '⭐⭐⭐⭐⭐ Amazing bathroom transformation! The team completed our master bath
   remodel in just 2.5 weeks. Professional, courteous, and the quality is
   outstanding. Highly recommend!' - Sarah M., Strongsville, OH"
```

### Example Records

```yaml
Record 1:
  Client: Baths R Us
  Customer Name: Sarah M.
  Customer City: Strongsville
  Customer State: OH
  Rating: 5
  Review Title: Amazing bathroom transformation!
  Review Text: |
    The Medina team completed our master bath remodel in just 2.5 weeks.
    Professional, courteous, and the quality is outstanding. Highly recommend!
  Review Date: 2024-11-15
  Source: Google
  Service: Bathroom Remodeling
  Branch: Medina Office
  Featured: ✓
  Active: ✓

Record 2:
  Client: Baths R Us
  Customer Name: John D.
  Customer City: Brunswick
  Rating: 5
  Review Text: |
    Couldn't be happier with our new kitchen. The team was amazing!
  Review Date: 2024-10-22
  Source: Yelp
  Service: Kitchen Remodeling
  Active: ✓
```

### Views
- All Testimonials
- Active Testimonials
- Featured Only
- 5-Star Reviews
- By Client
- By Service
- By Branch
- Recent Reviews (sorted by Review Date)

---

## 11. Offers Table ⭐ NEW

### Purpose
Manage simultaneous promotions across services and locations

### Fields

```yaml
IDENTITY:
  - Offer ID (auto-number) [Primary Key]
  - Offer Name (single line text) *Required - "Spring 2025 Bathroom Promo"
  - Client Name (linked to Clients) *Required
  - Active (checkbox) *Default: true

OFFER DETAILS:
  - Offer Type (single select) *Required
    Options: Percentage Discount, Dollar Amount Off, Free Upgrade, Bundle Deal, Financing

  - Discount Value (single line text)
    Examples: "20%", "$1,000", "Free luxury faucet upgrade"

  - Offer Description (long text) *Required
    Example: "Save 20% on all bathroom remodeling projects over $10,000.
             Limited time offer - expires May 31, 2025."

  - Fine Print (long text)
    Example: "Minimum project value $10,000. Cannot be combined with other offers.
             New contracts only."

VALIDITY:
  - Start Date (date) *Required
  - End Date (date) *Required
  - Status (formula)
    IF(
      AND(START_DATE <= TODAY(), END_DATE >= TODAY()),
      "Active",
      IF(END_DATE < TODAY(), "Expired", "Scheduled")
    )

TARGETING:
  - Target Services (linked to Services)
    Example: [Bathroom Remodeling, Kitchen Remodeling]
    Blank = all services

  - Target Locations (linked to Locations)
    Example: [Strongsville, Brunswick, Medina]
    Blank = all locations

  - Target Branches (linked to Branch Locations)
    Example: [Medina Office]
    Blank = all branches

AI CONFIGURATION:
  - AI Prompt Addition (long text)
    Example: "Emphasize the limited-time 20% savings. Create urgency around
             the May 31st deadline. Mention free luxury upgrade option."

  - Headline Emphasis (single select) - Discount Amount, Urgency, Value, Quality
  - CTA Override (linked to CTAs) - Optional, force specific CTA for this offer

TRACKING:
  - UTM Campaign (single line text) - "spring-2025-bathroom-20off"
  - Promo Code (single line text) - "SPRING20"

PERFORMANCE (Future: GA4 Integration):
  - Total Pages Using (rollup count from Pages)
  - Total Conversions (number) - From analytics webhook
  - Estimated Revenue (currency)

METADATA:
  - Created Date (created time)
  - Last Modified (last modified time)
  - Created By (user field)

RELATIONSHIPS:
  - Client (linked to Clients)
  - Target Services (linked to Services)
  - Target Locations (linked to Locations)
  - Target Branches (linked to Branch Locations)
  - CTA Override (linked to CTAs)
  - Pages Using This Offer (linked to Pages)
```

### Simultaneous Offers Example

```yaml
Client: Baths R Us
Date: April 15, 2025

ACTIVE OFFERS:

Offer 1: Spring Bathroom Promo
  Discount: 20% off
  Services: [Bathroom Remodeling]
  Locations: [ALL]
  Dates: Mar 1 - May 31
  Status: Active

Offer 2: Kitchen Financing
  Discount: 0% financing for 24 months
  Services: [Kitchen Remodeling]
  Locations: [ALL]
  Dates: Jan 1 - Dec 31
  Status: Active

Offer 3: Medina Grand Opening
  Discount: $1,500 off + free upgrade
  Services: [ALL]
  Locations: [Strongsville, Brunswick, Medina only]
  Branches: [Medina Office only]
  Dates: Apr 1 - Apr 30
  Status: Active

Page Assignment Logic:

Page: bathroom-remodeling/strongsville
  Location: Strongsville
  Branch: Medina Office
  Service: Bathroom Remodeling

  Applicable Offers:
    ✓ Spring Bathroom Promo (service match)
    ✓ Medina Grand Opening (location + branch match)

  Selected Offer: Medina Grand Opening (more specific targeting wins)

  AI Generates:
    "Special Grand Opening Offer: Save $1,500 on your Strongsville bathroom
     remodel PLUS get a free luxury faucet upgrade! Our new Medina office is
     celebrating with unbeatable savings. Offer ends April 30th - act now!"

Page: kitchen-remodeling/dublin
  Location: Dublin
  Branch: Hilliard Office
  Service: Kitchen Remodeling

  Applicable Offers:
    ✓ Kitchen Financing (service match)

  Selected Offer: Kitchen Financing

  AI Generates:
    "Transform your Dublin kitchen with 0% financing for 24 months! No interest,
     no payments for 2 years on approved credit. Start your project today!"
```

### Offer Priority Logic

```yaml
When multiple offers apply to same page:

Priority Order:
  1. Branch-specific offer (highest priority)
  2. Location-specific offer
  3. Service-specific offer
  4. Client-wide offer (lowest priority)

Example:
  Page: bathroom-remodeling/strongsville

  Offer A: Medina Grand Opening
    Targeting: Branch = Medina Office, Services = [all], Locations = [Strongsville, Brunswick, Medina]
    Priority: 1 (branch-specific)

  Offer B: Spring Bathroom Promo
    Targeting: Services = [Bathroom Remodeling], Locations = [all], Branches = [all]
    Priority: 3 (service-specific)

  Winner: Offer A (higher priority)
```

### Example Records

```yaml
Record 1:
  Offer Name: Spring 2025 Bathroom Promo
  Client: Baths R Us
  Offer Type: Percentage Discount
  Discount Value: 20%
  Offer Description: Save 20% on all bathroom remodeling projects over $10,000
  Fine Print: Minimum project value $10,000. New contracts only. Expires 5/31/25.
  Start Date: 2025-03-01
  End Date: 2025-05-31
  Target Services: [Bathroom Remodeling]
  AI Prompt Addition: Emphasize limited-time 20% savings and May 31 deadline
  Headline Emphasis: Discount Amount
  UTM Campaign: spring-2025-bathroom-20off
  Status: Active (formula)
  Active: ✓

Record 2:
  Offer Name: Kitchen Financing - Year-Round
  Client: Baths R Us
  Offer Type: Financing
  Discount Value: 0% for 24 months
  Offer Description: No interest, no payments for 2 years on approved credit
  Start Date: 2025-01-01
  End Date: 2025-12-31
  Target Services: [Kitchen Remodeling]
  AI Prompt Addition: Emphasize no interest and easy approval process
  Status: Active
  Active: ✓

Record 3:
  Offer Name: Medina Office Grand Opening
  Client: Baths R Us
  Offer Type: Bundle Deal
  Discount Value: $1,500 off + free luxury upgrade
  Offer Description: Grand opening special - $1,500 off plus free faucet upgrade
  Start Date: 2025-04-01
  End Date: 2025-04-30
  Target Services: [all]
  Target Locations: [Strongsville, Brunswick, Medina]
  Target Branches: [Medina Office]
  AI Prompt Addition: Create urgency - grand opening ends April 30th!
  Headline Emphasis: Urgency
  Status: Active
  Active: ✓
```

### Views
- All Offers
- Active Offers Only
- Expired Offers
- Scheduled Offers
- By Client
- By Service
- By End Date (sorted soonest first)

---

## 12. Campaigns Table

### Purpose
Group pages by marketing campaign for tracking

### Fields

```yaml
IDENTITY:
  - Campaign ID (auto-number) [Primary Key]
  - Campaign Name (single line text) *Required - "Q2 2025 Bathroom Push"
  - Client Name (linked to Clients) *Required
  - Active (checkbox) *Default: true

CAMPAIGN TYPE:
  - Campaign Type (single select) *Required
    Options: Seasonal, Geographic Expansion, Service Launch, Product Launch

  - Start Date (date) *Required
  - End Date (date)
  - Status (single select) - Planning, Active, Paused, Completed

TARGETING:
  - Target Services (linked to Services)
  - Target Locations (linked to Locations)
  - Campaign Offer (linked to Offers) - Optional

TRACKING:
  - UTM Campaign (single line text) *Required - "q2-2025-bathroom"
  - UTM Source (single line text) - "google"
  - UTM Medium (single line text) - "cpc"

BUDGET (Future: ROI Tracking):
  - Budget (currency)
  - Total Spend (currency)

CONTENT:
  - Campaign Description (long text)
  - Campaign Goals (long text)

METADATA:
  - Total Pages (rollup count from Pages)
  - Created Date (created time)
  - Created By (user field)

RELATIONSHIPS:
  - Client (linked to Clients)
  - Pages (linked to Pages)
  - Target Services (linked to Services)
  - Target Locations (linked to Locations)
  - Campaign Offer (linked to Offers)
```

### Example Records

```yaml
Record 1:
  Campaign Name: Q2 2025 Bathroom Push
  Client: Baths R Us
  Campaign Type: Seasonal
  Start Date: 2025-04-01
  End Date: 2025-06-30
  Status: Active
  Target Services: [Bathroom Remodeling]
  Target Locations: [Strongsville, Brunswick, Medina, North Royalton]
  Campaign Offer: Spring 2025 Bathroom Promo
  UTM Campaign: q2-2025-bathroom
  UTM Source: google
  UTM Medium: cpc
  Budget: $15,000
  Active: ✓

Record 2:
  Campaign Name: Columbus Market Entry
  Client: National Remodeling
  Campaign Type: Geographic Expansion
  Start Date: 2025-05-01
  End Date: 2025-07-31
  Status: Planning
  Target Locations: [Columbus, Dublin, Westerville, Hilliard]
  UTM Campaign: columbus-expansion-2025
  Active: ✓
```

### Views
- All Campaigns
- Active Campaigns
- By Client
- By Status
- By End Date

---

## Automations (Phase 1)

### Automation 1: Auto-Match Branch to Page
```yaml
Name: Match Branch Location to Page
Trigger: Page record created OR Location field updated
Conditions:
  - Location ID is not empty
  - Client Name is set

Logic:
  1. Find Service Areas records where:
     - Location ID = Page.Location ID
     - Active = TRUE
     - Branch.Active = TRUE

  2. If exactly 1 match found:
     - Update Page.Matched Branch = Service Area.Branch ID

  3. If multiple matches found:
     - Update Page.Matched Branch = First match (sorted by Branch Name)
     - Add note to Page.Notes: "⚠️ Multiple branches serve this location, auto-selected {Branch Name}"

  4. If NO match found:
     - Find Client's branches (any branch for this client)
     - Update Page.Matched Branch = First branch (sorted by Branch Name)
     - Add note to Page.Notes: "⚠️ No branch found for {Location}, using default: {Branch Name}"
```

### Automation 2: Trigger AI Generation
```yaml
Name: Trigger AI Content Generation
Trigger: Status field changes to "AI Processing"
Conditions:
  - Service ID is not empty
  - Client Name is not empty
  - Matched Branch is not empty

Actions:
  1. Webhook POST to AI Service
     URL: https://ai-service.yourapp.com/generate-content
     Method: POST
     Headers:
       Authorization: Bearer {AI_SERVICE_API_KEY}
       Content-Type: application/json
     Body:
       {
         "pageId": "{Page ID}",
         "serviceId": "{Service ID}",
         "locationId": "{Location ID}",
         "clientId": "{Client ID}",
         "branchId": "{Matched Branch ID}",
         "offerId": "{Offer ID}",
         "specialInstructions": "{Special Instructions}"
       }
```

### Automation 3: Export on Approval
```yaml
Name: Trigger Export to GitHub
Trigger: Status field changes to "Approved"
Conditions:
  - SEO Title is not empty
  - H1 Headline is not empty

Actions:
  1. Webhook POST to GitHub Actions
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
           "timestamp": "{Last Modified}"
         }
       }
```

---

## Future Features (Planned but Not Implemented)

### Version Control
```yaml
Status: Fields added to Pages table, no workflow yet
Fields:
  - AI Original Content (dormant)
  - Content Version (dormant)
  - Human Edited (dormant)

When to activate:
  - After 6 months of production use
  - When A/B testing is needed
  - When rollback capability is requested
```

### Content Blocks
```yaml
Status: Table designed, not created yet
Purpose: Flexible page layouts (beyond standard structure)

When to activate:
  - After validating standard layout works
  - When custom page structures are needed
  - When reusable content blocks are beneficial
```

### Forms Table
```yaml
Status: Planned for future
Purpose: Multiple form types

When to activate:
  - After single multi-step form is validated
  - When different form types are needed (quote vs consultation)
```

### Bulk Import
```yaml
Status: Planned for future
Purpose: CSV upload for 100+ pages at once

When to activate:
  - When creating 50+ pages manually becomes painful
  - When geographic expansion requires bulk page creation
```

### Advanced Analytics
```yaml
Status: Use GA4 for now, no Airtable integration yet

When to activate:
  - After 3 months of GA4 data collection
  - When Airtable-based reporting is needed
  - When conversion tracking is mature
```

---

## Migration Path

### Phase 1: MVP Launch (Weeks 1-4)
```yaml
Week 1: Setup
  - Create all 12 tables in Airtable
  - Add sample data (1 client, 2 services, 3 locations)
  - Configure 3 automations
  - Test AI generation workflow

Week 2: Content Population
  - Add all services with keyword grouping
  - Add all locations (cities to target)
  - Map service areas (which branches serve which cities)
  - Add branch staff profiles
  - Upload hero images

Week 3: Integration
  - Deploy AI Service (Railway)
  - Configure GitHub Actions export
  - Test Netlify deployment
  - Validate end-to-end workflow

Week 4: Production Launch
  - Create first 10 production pages
  - Monitor for issues
  - Iterate on AI prompts based on output quality
```

### Phase 2: Scale (Months 2-3)
```yaml
  - Create 100+ pages
  - Add testimonials
  - Launch first campaign with offer
  - Optimize based on analytics
```

### Phase 3: Advanced Features (Months 4-6)
```yaml
  - Activate version control
  - Implement content blocks
  - Add bulk import capability
  - Launch A/B testing (GTM/GA4)
```

---

**Schema Version:** 1.0 (Phase 1 MVP)
**Target Capacity:** 3,000 pages
**Launch Readiness:** Production-ready
**Author:** Winston (Architect)
**Last Updated:** 2025-01-09
