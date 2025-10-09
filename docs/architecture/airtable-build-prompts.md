# Airtable Build Prompts - Sequential Creation Guide

**Purpose:** Step-by-step prompts to build the Airtable base structure using omni builder or MCP
**Execution Order:** Complete each prompt in sequence before moving to the next
**Testing Strategy:** After each group, add 1-2 test records and verify relationships work

**KEY TERMINOLOGY:**
- **PK (Primary Key)**: Auto-number field that uniquely identifies each record
- **FK (Foreign Key)**: "Linked record" field that references another table
- **[FK → Table]**: This table has a foreign key pointing to another table
- **Referenced By**: Other tables have foreign keys pointing to this table

---

## BUILD SEQUENCE

### Phase 1: Foundation Tables (Build These First)
1. Clients Table
2. Services Table
3. Locations Table

### Phase 2: Branch Management
4. Branch Locations Table
5. Service Areas Table (Junction)
6. Branch Staff Table

### Phase 3: Core Content
7. Pages Table (Main content table)

### Phase 4: Content Libraries
8. CTAs Table
9. Hero Images Library Table
10. Testimonials Table

### Phase 5: Marketing
11. Offers Table
12. Campaigns Table

---

## RELATIONSHIP DIAGRAM

```
Clients (PK: Client ID)
├── Branch Locations (FK: Client Name)
│   ├── Service Areas (FK: Branch ID)
│   └── Branch Staff (FK: Branch ID)
├── Pages (FK: Client Name)
├── Testimonials (FK: Client Name)
├── Offers (FK: Client Name)
└── Campaigns (FK: Client Name)

Services (PK: Service ID)
├── Pages (FK: Service ID)
├── Hero Images Library (FK: Service ID, optional)
├── Testimonials (FK: Service ID, optional)
├── Offers (FK: Target Services, multiple)
└── Campaigns (FK: Target Services, multiple)

Locations (PK: Location ID)
├── Service Areas (FK: Location ID)
├── Pages (FK: Location ID, optional)
├── Hero Images Library (FK: Location ID, optional)
├── Offers (FK: Target Locations, multiple)
└── Campaigns (FK: Target Locations, multiple)

Branch Locations (PK: Branch ID)
├── [FK → Clients via Client Name]
├── Service Areas (FK: Branch ID)
├── Branch Staff (FK: Branch ID)
├── Pages (FK: Matched Branch)
├── Testimonials (FK: Branch ID, optional)
└── Offers (FK: Target Branches, multiple)

Service Areas (Junction Table - PK: Service Area ID)
├── [FK → Branch Locations via Branch ID]
└── [FK → Locations via Location ID]

CTAs (PK: CTA ID)
├── Pages (FK: Selected CTA ID)
└── Offers (FK: CTA Override, optional)

Hero Images Library (PK: Image ID)
├── [FK → Services via Service ID, optional]
├── [FK → Locations via Location ID, optional]
└── Pages (FK: Selected Hero Image ID)

Offers (PK: Offer ID)
├── [FK → Clients via Client Name]
├── [FK → Services via Target Services, multiple]
├── [FK → Locations via Target Locations, multiple]
├── [FK → Branch Locations via Target Branches, multiple]
├── [FK → CTAs via CTA Override, optional]
├── Pages (FK: Offer)
└── Campaigns (FK: Campaign Offer)

Pages (Main Content - PK: Page ID)
├── [FK → Clients via Client Name]
├── [FK → Services via Service ID]
├── [FK → Locations via Location ID, optional]
├── [FK → Branch Locations via Matched Branch]
├── [FK → Campaigns via Campaign, optional]
├── [FK → Offers via Offer, optional]
├── [FK → CTAs via Selected CTA ID]
└── [FK → Hero Images Library via Selected Hero Image ID]
```

---

## PROMPT 1: Create Clients Table

Create an Airtable table named "Clients" with these fields:

**Identity Fields:**
- Client ID: Auto-number **(PRIMARY KEY)**
- Client Name: Single line text (Required)
- Domain: URL field (Required) - Format: "bathsrus.com" (no https://, no trailing /)
- Active: Checkbox (Default: true)

**Branding Fields:**
- Logo URL: URL field
- Primary Color: Single line text (e.g., "#0ea5e9")
- Secondary Color: Single line text (e.g., "#8b5cf6")
- Google Fonts: Single line text (e.g., "Inter")

**Contact Fields:**
- Primary Phone: Phone field (Required)
- Primary Email: Email field (Required)
- Corporate Address: Single line text

**Tracking & Integrations Fields:**
- GTM Container ID: Single line text
- CallRail Swap Target: Single line text
- reCAPTCHA Site Key: Single line text
- Salesforce Campaign ID: Single line text
- Make.com Webhook URL: URL field
- Google Analytics Property ID: Single line text

**Business Info Fields:**
- Years in Business: Number field
- Licensed Since: Number field (Year format, e.g., 2010)
- Insurance Amount: Currency field (e.g., $2,000,000)
- BBB Rating: Single select (Options: A+, A, B, C, D, F, Not Rated)
- Default Warranty Years: Number field

**Metadata Fields:**
- Total Pages: Rollup field (Count from Pages table - ADD LATER after Pages table exists)
- Total Branches: Rollup field (Count from Branch Locations table - ADD LATER)
- Created Date: Created time field
- Last Modified: Last modified time field

**Create These Views:**
- All Clients (default, show all)
- Active Clients Only (filter: Active = true)
- By Total Pages (sort by Total Pages descending - ADD LATER)

**RELATIONSHIPS:**
- **Foreign Keys (this table links to):** None - this is a parent/lookup table
- **Referenced By (these tables link to this table):**
  - Branch Locations → Client Name (FK)
  - Pages → Client Name (FK)
  - Testimonials → Client Name (FK)
  - Offers → Client Name (FK)
  - Campaigns → Client Name (FK)

**Test Record:** Add "Baths R Us" with domain "bathsrus.com", phone "(330) 555-1234", email "info@bathsrus.com"

---

## PROMPT 2: Create Services Table

Create an Airtable table named "Services" with these fields:

**Identity Fields:**
- Service ID: Auto-number **(PRIMARY KEY)**
- Service Name: Single line text (Required) - e.g., "Bathroom Remodeling"
- Service Slug: Single line text (Required) - e.g., "bathroom-remodeling"
- Active: Checkbox (Default: true)

**Keyword Grouping Fields (CRITICAL FOR SEO):**
- Primary Keywords: Long text field (Required) - Format: Comma-separated, one per line
- Canonical Keyword: Single line text (Required) - The ONE keyword for URLs/H1s
- Keyword Group Notes: Long text field - Explain grouping decisions

**SEO & Content Fields:**
- Meta Description Template: Long text field
- Icon Name: Single line text (e.g., "bathtub")

**Service Details Fields:**
- Typical Timeline: Single line text (e.g., "2-3 weeks")
- Price Range Low: Currency field
- Price Range High: Currency field
- Service Description: Long text field

**AI Configuration Fields:**
- AI Tone Preference: Single select (Options: Professional, Conversational, Urgent, Luxury)
- AI Prompt Template: Long text field
- Default Trust Bar Topics: Long text field (JSON format)

**Metadata Fields:**
- Total Pages: Rollup field (Count from Pages table - ADD LATER)
- Last Used: Rollup field (Max from Pages → Created Date - ADD LATER)
- Created Date: Created time field
- Last Modified: Last modified time field

**Create These Views:**
- All Services (default)
- Active Services Only (filter: Active = true)
- By Total Pages (sort descending - ADD LATER)
- Needs Keyword Review (filter: Keyword Group Notes is empty)

**RELATIONSHIPS:**
- **Foreign Keys (this table links to):** None - this is a parent/lookup table
- **Referenced By (these tables link to this table):**
  - Pages → Service ID (FK)
  - Hero Images Library → Service ID (FK, optional)
  - Testimonials → Service ID (FK, optional)
  - Offers → Target Services (FK, multiple)
  - Campaigns → Target Services (FK, multiple)

**Test Records:**
1. Service Name: "Bathroom Remodeling", Slug: "bathroom-remodeling", Canonical: "bathroom remodeling", Keywords: "bathroom remodeling\nbathroom remodel\nbath remodeling"
2. Service Name: "Kitchen Remodeling", Slug: "kitchen-remodeling", Canonical: "kitchen remodeling"

---

## PROMPT 3: Create Locations Table

Create an Airtable table named "Locations" with these fields:

**Identity Fields:**
- Location ID: Auto-number **(PRIMARY KEY)**
- City: Single line text (Required) - e.g., "Strongsville"
- State: Single select (Required) - Add options: OH, PA, NY, FL, TX, CA, AZ, NC, SC (add more as needed)
- County: Single line text (e.g., "Cuyahoga")
- URL Slug: Formula field = `LOWER(SUBSTITUTE({City}, " ", "-"))`
- Active: Checkbox (Default: true)

**Geography Fields:**
- Zip Codes: Long text field (comma-separated, e.g., "44136, 44149")
- Primary Zip: Single line text (e.g., "44136")

**Demographics Fields (for AI context):**
- Population: Number field
- Median Income: Currency field
- Median Home Value: Currency field

**SEO Fields:**
- SEO Keywords: Long text field
- Local Landmarks: Long text field

**Metadata Fields:**
- Total Pages: Rollup field (Count from Pages table - ADD LATER)
- Served By Branches: Rollup field (Count from Service Areas - ADD LATER)
- Created Date: Created time field
- Last Modified: Last modified time field

**Create These Views:**
- All Locations (default)
- Active Locations Only (filter: Active = true)
- By State (group by State)
- By County (group by County)
- Needs Demographics (filter: Population is empty)

**RELATIONSHIPS:**
- **Foreign Keys (this table links to):** None - this is a parent/lookup table
- **Referenced By (these tables link to this table):**
  - Service Areas → Location ID (FK)
  - Pages → Location ID (FK, optional)
  - Hero Images Library → Location ID (FK, optional)
  - Offers → Target Locations (FK, multiple)
  - Campaigns → Target Locations (FK, multiple)

**Test Records:**
1. City: "Strongsville", State: "OH", County: "Cuyahoga", Zip Codes: "44136, 44149", Population: 44750
2. City: "Brunswick", State: "OH", County: "Medina", Zip Codes: "44212", Population: 34255

---

## PROMPT 4: Create Branch Locations Table

Create an Airtable table named "Branch Locations" with these fields:

**Identity Fields:**
- Branch ID: Auto-number **(PRIMARY KEY)**
- Branch Name: Single line text (Required) - e.g., "Medina Office"
- Client Name: Linked record to Clients table **(FOREIGN KEY)** (Required)
- Active: Checkbox (Default: true)

**Location Fields:**
- Street Address: Single line text
- City: Single line text (Required)
- State: Single select (Required) - Same options as Locations table
- Zip Code: Single line text
- Full Address: Formula field = `CONCATENATE({Street Address}, ", ", {City}, ", ", {State}, " ", {Zip Code})`

**Timezone Fields (CRITICAL):**
- Timezone: Single select (Required) - Options:
  * America/New_York (EST/EDT)
  * America/Chicago (CST/CDT)
  * America/Denver (MST/MDT)
  * America/Phoenix (MST - no DST)
  * America/Los_Angeles (PST/PDT)
  * America/Anchorage (AKST/AKDT)
  * Pacific/Honolulu (HST)

**Contact Fields:**
- Phone: Phone field (Required)
- Email: Email field (Required)
- After Hours Phone: Phone field

**Metadata Fields:**
- Google Maps Embed URL: URL field
- Google Maps Place ID: Single line text
- Office Photos: Attachment field

**Hours Fields:**
- Hours Summary: Long text field
- Open Time Weekday: Single line text (e.g., "08:00")
- Close Time Weekday: Single line text (e.g., "18:00")
- Open Time Saturday: Single line text
- Close Time Saturday: Single line text
- Sunday Hours: Single line text (e.g., "Closed")

**Service Area Field:**
- Service Radius Miles: Number field (e.g., 25)

**Rollup Fields:**
- Total Cities Served: Rollup field (Count from Service Areas - ADD LATER)
- Total Pages: Rollup field (Count from Pages where Matched Branch = this - ADD LATER)
- Created Date: Created time field
- Last Modified: Last modified time field

**Create These Views:**
- All Branches (default)
- Active Branches Only (filter: Active = true)
- By Client
- By State
- By Timezone

**RELATIONSHIPS:**
- **Foreign Keys (this table links to):**
  - Client Name → Clients table (FK)
- **Referenced By (these tables link to this table):**
  - Service Areas → Branch ID (FK)
  - Branch Staff → Branch ID (FK)
  - Pages → Matched Branch (FK)
  - Testimonials → Branch ID (FK, optional)
  - Offers → Target Branches (FK, multiple)

**Test Record:** Branch Name: "Medina Office", Client: [Link to Baths R Us], City: "Medina", State: "OH", Timezone: "America/New_York", Phone: "(330) 555-1234"

---

## PROMPT 5: Create Service Areas Table (Junction)

Create an Airtable table named "Service Areas" with these fields:

**Identity Fields:**
- Service Area ID: Auto-number **(PRIMARY KEY)**
- Branch ID: Linked record to Branch Locations table **(FOREIGN KEY)** (Required)
- Location ID: Linked record to Locations table **(FOREIGN KEY)** (Required)
- Active: Checkbox (Default: true)

**Computed Fields (Lookups):**
- Branch Name: Lookup field from Branch ID → Branch Name
- Branch City: Lookup field from Branch ID → City
- Branch State: Lookup field from Branch ID → State
- Service City: Lookup field from Location ID → City
- Service State: Lookup field from Location ID → State
- Unique Key: Formula field = `CONCATENATE({Branch ID}, "-", {Location ID})`

**Metadata Fields:**
- Pages in This Area: Rollup field (Count from Pages where Location ID = this Location - ADD LATER)
- Created Date: Created time field

**Create These Views:**
- All Service Areas (default)
- Active Service Areas (filter: Active = true)
- By Branch
- By Location
- By State

**RELATIONSHIPS:**
- **Foreign Keys (this table links to):**
  - Branch ID → Branch Locations table (FK)
  - Location ID → Locations table (FK)
- **Referenced By:** None - this is a junction table used for lookups only

**Test Records:**
1. Branch: [Medina Office], Location: [Strongsville]
2. Branch: [Medina Office], Location: [Brunswick]

**Purpose:** This junction table defines which branch offices serve which cities (many-to-many relationship)

---

## PROMPT 6: Create Branch Staff Table

Create an Airtable table named "Branch Staff" with these fields:

**Identity Fields:**
- Staff ID: Auto-number **(PRIMARY KEY)**
- Full Name: Single line text (Required)
- Branch ID: Linked record to Branch Locations table **(FOREIGN KEY)** (Required)
- Active: Checkbox (Default: true)

**Role Fields:**
- Job Title: Single line text (Required) - e.g., "Lead Project Manager"
- Role Type: Single select - Options: Sales, Project Manager, Installer, Admin, Owner
- Primary Contact: Checkbox (Is this the main contact for the branch?)

**Experience Fields:**
- Years of Experience: Number field
- Certifications: Long text field (comma-separated)
- Specialties: Multiple select - Options: Bathroom, Kitchen, Basement, Flooring, Windows, Doors, Roofing, Siding

**Content Fields (for AI):**
- Photo URL: URL field
- Bio: Long text field (2-3 sentences)
- Quote: Long text field

**Contact Fields:**
- Email: Email field
- Phone Extension: Single line text (e.g., "ext. 205")

**Display Fields:**
- Featured: Checkbox (Show on team pages)
- Display Order: Number field (For team page ordering)
- Hired Date: Date field

**Metadata Fields:**
- Created Date: Created time field
- Client: Lookup field from Branch → Client Name

**Create These Views:**
- All Staff (default)
- Active Staff Only (filter: Active = true)
- By Branch
- Primary Contacts Only (filter: Primary Contact = true)
- Featured Staff (filter: Featured = true)

**RELATIONSHIPS:**
- **Foreign Keys (this table links to):**
  - Branch ID → Branch Locations table (FK)
- **Referenced By:** None - this is staff profile data

**Test Record:** Full Name: "John Smith", Branch: [Medina Office], Job Title: "Lead Project Manager", Role Type: "Project Manager", Years of Experience: 15, Primary Contact: true

---

## PROMPT 7: Create Pages Table (MAIN CONTENT TABLE)

Create an Airtable table named "Pages" with these fields:

**Identity & Routing Fields:**
- Page ID: Auto-number **(PRIMARY KEY)**
- Client Name: Linked record to Clients table **(FOREIGN KEY)** (Required)
- Service ID: Linked record to Services table **(FOREIGN KEY)** (Required)
- Location ID: Linked record to Locations table **(FOREIGN KEY)** (Optional - for non-location pages)
- Unique Key: Formula field = `CONCATENATE({Client Name}, "-", {Service Slug}, "-", IF({Location Slug}, {Location Slug}, "national"))`
- URL Slug: Formula field = `IF({Location ID} = BLANK(), {Service Slug}, CONCATENATE({Service Slug}, "/", {Location Slug}))`
- Page URL: Formula field = `CONCATENATE("https://", {Client Domain}, "/", {URL Slug})`

**Workflow Status Fields:**
- Status: Single select (Required, Default: Draft) - Options: Draft, AI Processing, Ready for Review, Approved, Published
- Published: Checkbox
- Publish Date: Date field
- Unpublish Date: Date field

**Auto-Matched Data Fields (Lookups):**
- Matched Branch: Linked record to Branch Locations table **(FOREIGN KEY)** (Auto-populated by automation)
- Branch City: Lookup from Matched Branch → City
- Branch State: Lookup from Matched Branch → State
- Branch Timezone: Lookup from Matched Branch → Timezone
- Branch Phone: Lookup from Matched Branch → Phone
- Branch Address: Lookup from Matched Branch → Full Address
- Branch Email: Lookup from Matched Branch → Email

**Additional Lookups Needed:**
- Service Slug: Lookup from Service ID → Service Slug
- Location Slug: Lookup from Location ID → URL Slug
- Client Domain: Lookup from Client Name → Domain

**Manual Input Fields:**
- Special Instructions: Long text field
- Campaign: Linked record to Campaigns table **(FOREIGN KEY)** (ADD LATER)
- Offer: Linked record to Offers table **(FOREIGN KEY)** (ADD LATER)
- Priority: Single select - Options: High, Medium, Low
- Notes: Long text field

**AI-Generated Content Fields:**
- SEO Title: Single line text
- SEO Description: Long text field
- H1 Headline: Single line text
- Hero Subheadline: Long text field
- Selected CTA ID: Linked record to CTAs table **(FOREIGN KEY)** (ADD LATER)
- CTA Text: Lookup from Selected CTA → CTA Text (ADD LATER)
- CTA Action Type: Lookup from Selected CTA → Action Type (ADD LATER)
- CTA Action Value: Lookup from Selected CTA → Action Value (ADD LATER)
- Selected Hero Image ID: Linked record to Hero Images Library table **(FOREIGN KEY)** (ADD LATER)
- Hero Image URL: Lookup from Selected Hero Image → Cloudinary URL (ADD LATER)
- Hero Image Alt Text: Lookup from Selected Hero Image → Alt Text Template (ADD LATER)
- Trust Bar 1: Single line text
- Trust Bar 2: Single line text
- Trust Bar 3: Single line text
- Trust Bar 4: Single line text
- Trust Bar 5: Single line text
- FAQs: Long text field (JSON array format)
- Gallery Captions: Long text field (JSON array format)

**Version Control Fields (Future - Dormant for Now):**
- AI Original Content: Long text field (JSON)
- Content Version: Number field
- Human Edited: Checkbox

**AI Metadata Fields:**
- AI Generation Timestamp: Date field
- AI Model Used: Single line text
- AI Tokens Used: Number field
- CTA Selection Reasoning: Long text field
- AI Retry Count: Number field
- AI Last Error: Long text field

**SEO Fields (Future):**
- Canonical URL Override: URL field
- Robots Meta: Single select - Options: index,follow, noindex,follow, index,nofollow, noindex,nofollow

**Approval Workflow Fields:**
- Created By: User field
- Approved By: User field
- Approval Date: Date field

**Metadata Fields:**
- Created Date: Created time field
- Last Modified: Last modified time field
- Last Export Date: Date field

**Create These Views:**
- All Pages (default)
- Draft Pages (Status = Draft)
- AI Processing (Status = AI Processing)
- Ready for Review (Status = Ready for Review)
- Approved (Status = Approved)
- Published Pages (Published = true)
- By Client
- By Service
- By Location
- By Status

**RELATIONSHIPS:**
- **Foreign Keys (this table links to):**
  - Client Name → Clients table (FK)
  - Service ID → Services table (FK)
  - Location ID → Locations table (FK, optional)
  - Matched Branch → Branch Locations table (FK)
  - Campaign → Campaigns table (FK, optional) - ADD LATER
  - Offer → Offers table (FK, optional) - ADD LATER
  - Selected CTA ID → CTAs table (FK) - ADD LATER
  - Selected Hero Image ID → Hero Images Library table (FK) - ADD LATER
- **Referenced By:** None - this is the main content table

**Test Record:** Client: [Baths R Us], Service: [Bathroom Remodeling], Location: [Strongsville], Status: Draft

**CRITICAL NOTE:** Many lookup/rollup fields require relationships established AFTER other tables are created. Mark these as "ADD LATER" and revisit after Prompts 8-12.

---

## PROMPT 8: Create CTAs Table

Create an Airtable table named "CTAs" with these fields:

**Identity Fields:**
- CTA ID: Auto-number **(PRIMARY KEY)**
- CTA Text: Single line text (Required) - e.g., "Get Free Quote"
- CTA Type: Single select (Required) - Options: Primary, Secondary, Urgency, Call
- Active: Checkbox (Default: true)

**Action Fields:**
- CTA Action Type: Single select (Required) - Options: Scroll to Form, Phone Call, External Link
- Action Value: Single line text (Required) - Examples: "#contact-form", "tel:{client_phone}", "https://calendly.com/..."

**Targeting Fields:**
- Service Types: Multiple select - Options: bathroom-remodeling, kitchen-remodeling, basement-finishing, all

**AI Configuration Fields:**
- Priority: Number field (Required, 1-10, where 1 = highest priority)
- AI Selection Notes: Long text field
- Tone Match: Multiple select - Options: Professional, Conversational, Urgent, Luxury

**Performance Fields (Future):**
- Times Used: Rollup field (Count from Pages → Selected CTA ID)
- Last Used Date: Rollup field (Max from Pages → Created Date where Selected CTA = this)

**Metadata Fields:**
- Created Date: Created time field
- Last Modified: Last modified time field

**Create These Views:**
- All CTAs (default)
- Active CTAs (filter: Active = true)
- By Type
- By Priority (sort ascending)
- Most Used (sort by Times Used descending - ADD ROLLUP FIRST)

**RELATIONSHIPS:**
- **Foreign Keys (this table links to):** None - this is a lookup/content library table
- **Referenced By (these tables link to this table):**
  - Pages → Selected CTA ID (FK)
  - Offers → CTA Override (FK, optional)

**Test Records:**
1. CTA Text: "Get Free Quote", Type: Primary, Action Type: "Scroll to Form", Action Value: "#contact-form", Service Types: [all], Priority: 1, Tone Match: [Professional, Conversational]
2. CTA Text: "Call Now - Limited Slots!", Type: Urgency, Action Type: "Phone Call", Action Value: "tel:{client_phone}", Priority: 3, Tone Match: [Urgent]

**AFTER CREATING:** Go back to Pages table and add the CTA relationship fields (Selected CTA ID, CTA Text lookup, etc.)

---

## PROMPT 9: Create Hero Images Library Table

Create an Airtable table named "Hero Images Library" with these fields:

**Identity Fields:**
- Image ID: Auto-number **(PRIMARY KEY)**
- Filename: Single line text (Required) - Format: {service}-{location}-{type}-{number}.jpg
- Active: Checkbox (Default: true)

**Categorization Fields:**
- Service ID: Linked record to Services table **(FOREIGN KEY)** (Optional - blank = generic/any service)
- Location ID: Linked record to Locations table **(FOREIGN KEY)** (Optional - blank = generic/any location)
- Image Type: Single select (Required) - Options: Hero, Gallery, Before/After

**URL Fields:**
- Cloudinary URL: URL field (Required)
- Netlify Path: Single line text (e.g., "/images/heroes/bathroom-strongsville-01.jpg")

**Accessibility Fields:**
- Alt Text Template: Long text field (Required)

**Approval Fields:**
- Upload Status: Single select (Default: Approved) - Options: Draft, Approved
- Uploaded By: User field
- Upload Date: Created time field

**Performance Fields:**
- Times Used: Rollup field (Count from Pages → Selected Hero Image ID)
- Last Used Date: Rollup field (Max from Pages → Created Date where Selected Hero Image = this)

**Metadata Fields:**
- Last Modified: Last modified time field

**Create These Views:**
- All Images (default)
- Active Images (filter: Active = true)
- By Service
- By Location
- By Image Type
- Needs Approval (filter: Upload Status = Draft)
- Most Used (sort by Times Used descending)

**RELATIONSHIPS:**
- **Foreign Keys (this table links to):**
  - Service ID → Services table (FK, optional)
  - Location ID → Locations table (FK, optional)
- **Referenced By (these tables link to this table):**
  - Pages → Selected Hero Image ID (FK)

**Test Records:**
1. Filename: "bathroom-remodeling-strongsville-hero-01.jpg", Service: [Bathroom Remodeling], Location: [Strongsville], Type: Hero, Cloudinary URL: "https://via.placeholder.com/1920x1080", Alt Text: "Modern bathroom remodeling in Strongsville, Ohio", Upload Status: Approved
2. Filename: "kitchen-generic-hero-01.jpg", Service: [Kitchen Remodeling], Location: [blank], Type: Hero, Upload Status: Approved

**AFTER CREATING:** Go back to Pages table and add Hero Image relationship fields (Selected Hero Image ID, Hero Image URL lookup, etc.)

---

## PROMPT 10: Create Testimonials Table

Create an Airtable table named "Testimonials" with these fields:

**Identity Fields:**
- Testimonial ID: Auto-number **(PRIMARY KEY)**
- Client Name: Linked record to Clients table **(FOREIGN KEY)** (Required)
- Active: Checkbox (Default: true)
- Featured: Checkbox

**Customer Info Fields:**
- Customer Name: Single line text (Required)
- Customer City: Single line text
- Customer State: Single select (Same options as Locations/Branches)

**Review Fields:**
- Rating: Single select (Required) - Options: 1, 2, 3, 4, 5
- Review Title: Single line text
- Review Text: Long text field (Required)
- Review Date: Date field (Required)

**Source Fields:**
- Source: Single select (Required) - Options: Google, Yelp, Facebook, Angi, BBB, Direct
- Source URL: URL field
- Verified: Checkbox

**Context Fields:**
- Service ID: Linked record to Services table **(FOREIGN KEY)** (Optional)
- Branch ID: Linked record to Branch Locations table **(FOREIGN KEY)** (Optional)
- Project Cost Range: Single select - Options: Under $5k, $5-15k, $15-30k, $30k+, Not Disclosed

**Media Fields:**
- Before Photo URL: URL field
- After Photo URL: URL field
- Video Testimonial URL: URL field

**Metadata Fields:**
- Created Date: Created time field
- Last Modified: Last modified time field

**Create These Views:**
- All Testimonials (default)
- Active Testimonials (filter: Active = true)
- Featured Only (filter: Featured = true)
- 5-Star Reviews (filter: Rating = 5)
- By Client
- By Service
- By Branch
- Recent Reviews (sort by Review Date descending)

**RELATIONSHIPS:**
- **Foreign Keys (this table links to):**
  - Client Name → Clients table (FK)
  - Service ID → Services table (FK, optional)
  - Branch ID → Branch Locations table (FK, optional)
- **Referenced By:** None - this is content library data

**Test Record:** Client: [Baths R Us], Customer Name: "Sarah M.", City: "Strongsville", State: "OH", Rating: 5, Review Title: "Amazing bathroom transformation!", Review Text: "The team completed our master bath remodel in just 2.5 weeks...", Review Date: 2024-11-15, Source: Google, Service: [Bathroom Remodeling], Branch: [Medina Office], Featured: true

---

## PROMPT 11: Create Offers Table

Create an Airtable table named "Offers" with these fields:

**Identity Fields:**
- Offer ID: Auto-number **(PRIMARY KEY)**
- Offer Name: Single line text (Required) - e.g., "Spring 2025 Bathroom Promo"
- Client Name: Linked record to Clients table **(FOREIGN KEY)** (Required)
- Active: Checkbox (Default: true)

**Offer Details Fields:**
- Offer Type: Single select (Required) - Options: Percentage Discount, Dollar Amount Off, Free Upgrade, Bundle Deal, Financing
- Discount Value: Single line text (e.g., "20%", "$1,000", "Free luxury faucet upgrade")
- Offer Description: Long text field (Required)
- Fine Print: Long text field

**Validity Fields:**
- Start Date: Date field (Required)
- End Date: Date field (Required)
- Status: Formula field = `IF(AND({Start Date} <= TODAY(), {End Date} >= TODAY()), "Active", IF({End Date} < TODAY(), "Expired", "Scheduled"))`

**Targeting Fields:**
- Target Services: Linked record to Services table **(FOREIGN KEY)** (Multiple) - Blank = all services
- Target Locations: Linked record to Locations table **(FOREIGN KEY)** (Multiple) - Blank = all locations
- Target Branches: Linked record to Branch Locations table **(FOREIGN KEY)** (Multiple) - Blank = all branches

**AI Configuration Fields:**
- AI Prompt Addition: Long text field
- Headline Emphasis: Single select - Options: Discount Amount, Urgency, Value, Quality
- CTA Override: Linked record to CTAs table **(FOREIGN KEY)** (Optional)

**Tracking Fields:**
- UTM Campaign: Single line text (e.g., "spring-2025-bathroom-20off")
- Promo Code: Single line text (e.g., "SPRING20")

**Performance Fields (Future):**
- Total Pages Using: Rollup field (Count from Pages → Offer)
- Total Conversions: Number field
- Estimated Revenue: Currency field

**Metadata Fields:**
- Created Date: Created time field
- Last Modified: Last modified time field
- Created By: User field

**Create These Views:**
- All Offers (default)
- Active Offers Only (filter: Active = true)
- Expired Offers (filter: Status = "Expired")
- Scheduled Offers (filter: Status = "Scheduled")
- By Client
- By Service
- By End Date (sort ascending)

**RELATIONSHIPS:**
- **Foreign Keys (this table links to):**
  - Client Name → Clients table (FK)
  - Target Services → Services table (FK, multiple)
  - Target Locations → Locations table (FK, multiple)
  - Target Branches → Branch Locations table (FK, multiple)
  - CTA Override → CTAs table (FK, optional)
- **Referenced By (these tables link to this table):**
  - Pages → Offer (FK)
  - Campaigns → Campaign Offer (FK)

**Test Record:** Offer Name: "Spring 2025 Bathroom Promo", Client: [Baths R Us], Type: "Percentage Discount", Discount Value: "20%", Description: "Save 20% on all bathroom remodeling projects over $10,000", Start Date: 2025-03-01, End Date: 2025-05-31, Target Services: [Bathroom Remodeling]

**AFTER CREATING:** Go back to Pages table and add Offer relationship field

---

## PROMPT 12: Create Campaigns Table

Create an Airtable table named "Campaigns" with these fields:

**Identity Fields:**
- Campaign ID: Auto-number **(PRIMARY KEY)**
- Campaign Name: Single line text (Required) - e.g., "Q2 2025 Bathroom Push"
- Client Name: Linked record to Clients table **(FOREIGN KEY)** (Required)
- Active: Checkbox (Default: true)

**Campaign Type Fields:**
- Campaign Type: Single select (Required) - Options: Seasonal, Geographic Expansion, Service Launch, Product Launch
- Start Date: Date field (Required)
- End Date: Date field
- Status: Single select - Options: Planning, Active, Paused, Completed

**Targeting Fields:**
- Target Services: Linked record to Services table **(FOREIGN KEY)** (Multiple)
- Target Locations: Linked record to Locations table **(FOREIGN KEY)** (Multiple)
- Campaign Offer: Linked record to Offers table **(FOREIGN KEY)** (Single)

**Tracking Fields:**
- UTM Campaign: Single line text (Required) - e.g., "q2-2025-bathroom"
- UTM Source: Single line text (e.g., "google")
- UTM Medium: Single line text (e.g., "cpc")

**Budget Fields (Future ROI Tracking):**
- Budget: Currency field
- Total Spend: Currency field

**Content Fields:**
- Campaign Description: Long text field
- Campaign Goals: Long text field

**Metadata Fields:**
- Total Pages: Rollup field (Count from Pages → Campaign)
- Created Date: Created time field
- Created By: User field

**Create These Views:**
- All Campaigns (default)
- Active Campaigns (filter: Status = Active)
- By Client
- By Status
- By End Date (sort ascending)

**RELATIONSHIPS:**
- **Foreign Keys (this table links to):**
  - Client Name → Clients table (FK)
  - Target Services → Services table (FK, multiple)
  - Target Locations → Locations table (FK, multiple)
  - Campaign Offer → Offers table (FK)
- **Referenced By (these tables link to this table):**
  - Pages → Campaign (FK)

**Test Record:** Campaign Name: "Q2 2025 Bathroom Push", Client: [Baths R Us], Type: "Seasonal", Start Date: 2025-04-01, End Date: 2025-06-30, Status: Active, Target Services: [Bathroom Remodeling], UTM Campaign: "q2-2025-bathroom"

**AFTER CREATING:** Go back to Pages table and add Campaign relationship field

---

## POST-TABLE CREATION TASKS

### Task 1: Update Pages Table with Missing Relationships
After all tables are created, go back to Pages table and add/verify:
- Campaign: Linked record to Campaigns (FK)
- Offer: Linked record to Offers (FK)
- Selected CTA ID: Linked record to CTAs (FK)
- Selected Hero Image ID: Linked record to Hero Images Library (FK)
- All associated lookup fields (CTA Text, CTA Action Type, Hero Image URL, etc.)

### Task 2: Update Rollup Fields
Add rollup fields that count relationships (these couldn't be added initially):
- Clients table: Total Pages, Total Branches
- Services table: Total Pages, Last Used
- Locations table: Total Pages, Served By Branches
- Branch Locations table: Total Cities Served, Total Pages
- CTAs table: Times Used, Last Used Date
- Hero Images Library table: Times Used, Last Used Date
- Offers table: Total Pages Using
- Campaigns table: Total Pages

### Task 3: Test Relationships
Create a complete test record chain:
1. Create test client "Test Company"
2. Create test service "Test Service"
3. Create test location "Test City"
4. Create test branch for test client
5. Create service area linking branch to location
6. Create test page linking all above
7. Verify all lookups and rollups populate correctly
8. Delete test records

---

## AUTOMATION SETUP (After All Tables Created)

### Automation 1: Auto-Match Branch to Page
**Trigger:** When a Page record is created OR Location ID field is updated
**Conditions:** Location ID is not empty AND Client Name is set
**Actions:**
1. Find Service Areas records where Location ID matches Page.Location ID and Active = true
2. If match found, update Page.Matched Branch with Service Area.Branch ID
3. If no match found, find Client's default branch and add warning to Page.Notes

### Automation 2: Trigger AI Generation (Future)
**Trigger:** When Status field changes to "AI Processing"
**Conditions:** Service ID, Client Name, and Matched Branch are not empty
**Actions:** Send webhook to AI service with page data

### Automation 3: Trigger Export on Approval (Future)
**Trigger:** When Status field changes to "Approved"
**Conditions:** SEO Title and H1 Headline are not empty
**Actions:** Send webhook to GitHub Actions for export

---

## TESTING CHECKLIST

After completing all prompts, verify:

- [ ] All 12 tables created
- [ ] All formula fields calculate correctly
- [ ] All lookup fields display data from linked records
- [ ] All rollup fields count correctly
- [ ] All views filter/sort correctly
- [ ] Automation 1 (Auto-Match Branch) works
- [ ] Can create a complete page record with all relationships
- [ ] URL Slug and Page URL formulas generate correct URLs
- [ ] Unique Key formula prevents duplicate pages
- [ ] Status formula in Offers table shows correct status (Active/Expired/Scheduled)

---

## NEXT STEPS AFTER BASE IS BUILT

1. **Populate Foundation Data:**
   - Add all real services with keyword grouping
   - Add all target locations (cities)
   - Add all branch offices
   - Map service areas (which branches serve which cities)

2. **Build Content Libraries:**
   - Upload hero images to Cloudinary
   - Add hero image records with URLs
   - Create CTA variations
   - Import testimonials

3. **Configure AI Service:**
   - Deploy AI generation service
   - Configure webhook from Airtable to AI service
   - Test AI content generation workflow

4. **Setup Export Pipeline:**
   - Configure GitHub Actions
   - Setup Netlify deployment
   - Test end-to-end: Airtable → AI → GitHub → Netlify

5. **Launch First Campaign:**
   - Create first offer
   - Create first campaign
   - Generate first 10 pages
   - Monitor and iterate

---

**Build Time Estimate:** 2-3 hours for all tables + testing
**Schema Version:** 1.0 Phase 1 MVP
**Target Capacity:** 3,000 pages
**Created By:** Winston (Architect)
**Last Updated:** 2025-01-09
