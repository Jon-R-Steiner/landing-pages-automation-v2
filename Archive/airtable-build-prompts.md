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

**IMPORTANT:** Use these EXACT Airtable field types as specified below.

**Identity Fields:**
- **Client ID**: Auto-number field type **(PRIMARY KEY)** - Auto-increments starting at 1
- **Client Name**: Single line text field type (Required) - Example: "Baths R Us"
- **Domain**: Single line text field type (Required) - Store domain only, no protocol: "bathsrus.com" (NOT https://bathsrus.com)
- **Active**: Checkbox field type (Default: checked/true) - Indicates if client is currently active

**Branding Fields:**
- **Logo URL**: URL field type - Stores full URL: "https://example.com/logo.png" (Airtable validates as full URL)
- **Primary Color**: Single line text field type - Hex color code: "#0ea5e9"
- **Secondary Color**: Single line text field type - Hex color code: "#8b5cf6"
- **Google Fonts**: Single line text field type - Font family name: "Inter" or "Roboto"

**Contact Fields:**
- **Primary Phone**: Phone number field type (Required) - Airtable will format as phone: "(330) 555-1234"
- **Primary Email**: Email field type (Required) - Airtable validates email format: "info@bathsrus.com"
- **Corporate Address**: Single line text field type - Full address: "123 Main St, Medina, OH 44256"

**Tracking & Integrations Fields:**
- **GTM Container ID**: Single line text field type - Google Tag Manager ID: "GTM-XXXXXXX"
- **CallRail Swap Target**: Phone number field type - Phone number to swap: "(888) 555-1234"
- **reCAPTCHA Site Key**: Single line text field type - Google reCAPTCHA key: "6Le..."
- **Salesforce Campaign ID**: Single line text field type - Salesforce ID: "701..."
- **Make.com Webhook URL**: URL field type - Full webhook URL: "https://hook.us1.make.com/..."
- **Google Analytics Property ID**: Single line text field type - GA4 property: "G-XXXXXXXXXX"

**Business Info Fields:**
- **Years in Business**: Number field type (Integer, no decimals) - Whole number: 15
- **Licensed Since**: Number field type (Integer, no decimals) - Year only: 2010
- **Insurance Amount**: Currency field type (USD, 2 decimals) - Dollar amount: $2,000,000.00
- **BBB Rating**: Single select field type - Options: A+, A, B, C, D, F, Not Rated (Create all 7 options)
- **Default Warranty Years**: Number field type (Integer, no decimals) - Years: 5, 10, or "Lifetime" as text field?

**Metadata Fields:**
- **Total Pages**: Rollup field type → Count from Pages table's linked field - **ADD LATER** after Pages table exists
- **Total Branches**: Rollup field type → Count from Branch Locations table's linked field - **ADD LATER** after Branch Locations exists
- **Created Date**: Created time field type (Auto-populates when record created, displays date + time)
- **Last Modified**: Last modified time field type (Auto-updates when any field changes, displays date + time)

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

**IMPORTANT:** Use these EXACT Airtable field types as specified below.

**Identity Fields:**
- **Service ID**: Auto-number field type **(PRIMARY KEY)** - Auto-increments starting at 1
- **Service Name**: Single line text field type (Required) - Display name: "Bathroom Remodeling"
- **Service Slug**: Single line text field type (Required) - URL-friendly: "bathroom-remodeling" (lowercase, hyphens)
- **Active**: Checkbox field type (Default: checked/true) - Indicates if service is offered

**Keyword Grouping Fields (CRITICAL FOR SEO):**
- **Primary Keywords**: Long text field type (Required) - Multiline list of keyword variations, one per line:
  ```
  bathroom remodeling
  bathroom remodel
  bath remodeling
  bath renovation
  ```
- **Canonical Keyword**: Single line text field type (Required) - The ONE primary keyword for URLs and H1s: "bathroom remodeling"
- **Keyword Group Notes**: Long text field type - Document WHY keywords are grouped together, explain decisions about which keywords to combine vs separate

**SEO & Content Fields:**
- **Meta Description Template**: Long text field type - Template with variables: "Professional {service} in {location}. Licensed, insured, {years}+ years experience."
- **Icon Name**: Single line text field type - Icon identifier for UI: "bathtub", "kitchen", "basement" (matches icon library)

**Service Details Fields:**
- **Typical Timeline**: Single line text field type - Human-readable duration: "2-3 weeks", "1-2 months"
- **Price Range Low**: Currency field type (USD, 2 decimals) - Minimum typical price: $8,000.00
- **Price Range High**: Currency field type (USD, 2 decimals) - Maximum typical price: $25,000.00
- **Service Description**: Long text field type - Detailed description for AI context, 2-4 sentences about the service

**AI Configuration Fields:**
- **AI Tone Preference**: Single select field type - Options: Professional, Conversational, Urgent, Luxury (Create all 4 options)
- **AI Prompt Template**: Long text field type - Custom AI instructions: "Emphasize speed and quality. Mention licensed contractors and warranty."
- **Default Trust Bar Topics**: Long text field type - JSON array format: `["Licensed & Insured", "Years in Business", "5-Star Reviews", "Lifetime Warranty"]`

**Metadata Fields:**
- **Total Pages**: Rollup field type → Count from Pages table's Service ID linked field - **ADD LATER** after Pages table exists
- **Last Used**: Rollup field type → MAX(Pages.Created Date) where Service ID matches - **ADD LATER** after Pages table exists
- **Created Date**: Created time field type (Auto-populates when record created, displays date + time)
- **Last Modified**: Last modified time field type (Auto-updates when any field changes, displays date + time)

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

**IMPORTANT:** Use these EXACT Airtable field types as specified below.

**Identity Fields:**
- **Location ID**: Auto-number field type **(PRIMARY KEY)** - Auto-increments starting at 1
- **City**: Single line text field type (Required) - City name: "Strongsville", "North Royalton"
- **State**: Single select field type (Required) - Add options: OH, PA, NY, FL, TX, CA, AZ, NC, SC, GA, MI, IL (add more US states as needed)
- **County**: Single line text field type - County name: "Cuyahoga", "Medina"
- **URL Slug**: Formula field type = `LOWER(SUBSTITUTE({City}, " ", "-"))` - Auto-generates URL-friendly slug: "north-royalton"
- **Active**: Checkbox field type (Default: checked/true) - Indicates if location is actively targeted

**Geography Fields:**
- **Zip Codes**: Long text field type - Comma-separated list: "44136, 44149, 44142"
- **Primary Zip**: Single line text field type - Main zip code for mapping: "44136"

**Demographics Fields (for AI context):**
- **Population**: Number field type (Integer, no decimals) - Whole number: 44750
- **Median Income**: Currency field type (USD, 2 decimals) - Dollar amount: $72,500.00
- **Median Home Value**: Currency field type (USD, 2 decimals) - Dollar amount: $185,000.00

**SEO Fields:**
- **SEO Keywords**: Long text field type - Comma-separated keywords: "strongsville, strongsville ohio, strongsville oh, 44136"
- **Local Landmarks**: Long text field type - Comma-separated landmarks for AI: "Strongsville Commons, SouthPark Mall, Cleveland Metroparks"

**Metadata Fields:**
- **Total Pages**: Rollup field type → Count from Pages table's Location ID linked field - **ADD LATER** after Pages table exists
- **Served By Branches**: Rollup field type → Count from Service Areas table's Location ID linked field - **ADD LATER** after Service Areas table exists
- **Created Date**: Created time field type (Auto-populates when record created, displays date + time)
- **Last Modified**: Last modified time field type (Auto-updates when any field changes, displays date + time)

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

**IMPORTANT:** Use these EXACT Airtable field types as specified below.

**Identity Fields:**
- **Branch ID**: Auto-number field type **(PRIMARY KEY)** - Auto-increments starting at 1
- **Branch Name**: Single line text field type (Required) - Office name: "Medina Office", "Downtown Branch"
- **Client Name**: Link to another record field type → Links to Clients table **(FOREIGN KEY)** (Required) - Select which client owns this branch
- **Active**: Checkbox field type (Default: checked/true) - Indicates if branch is operational

**Location Fields:**
- **Street Address**: Single line text field type - Street address: "123 Main Street"
- **City**: Single line text field type (Required) - City name: "Medina"
- **State**: Single select field type (Required) - Same options as Locations table: OH, PA, NY, FL, TX, CA, AZ, etc.
- **Zip Code**: Single line text field type - 5-digit zip: "44256"
- **Full Address**: Formula field type = `CONCATENATE({Street Address}, ", ", {City}, ", ", {State}, " ", {Zip Code})` - Auto-generates: "123 Main Street, Medina, OH 44256"

**Timezone Fields (CRITICAL FOR MULTI-STATE OPERATIONS):**
- **Timezone**: Single select field type (Required) - IANA timezone identifiers (Create all 7 options):
  * America/New_York (EST/EDT) - Eastern Time
  * America/Chicago (CST/CDT) - Central Time
  * America/Denver (MST/MDT) - Mountain Time
  * America/Phoenix (MST - no DST) - Arizona
  * America/Los_Angeles (PST/PDT) - Pacific Time
  * America/Anchorage (AKST/AKDT) - Alaska Time
  * Pacific/Honolulu (HST) - Hawaii Time

**Contact Fields:**
- **Phone**: Phone number field type (Required) - Main office phone: "(330) 555-1234"
- **Email**: Email field type (Required) - Office email: "medina@bathsrus.com"
- **After Hours Phone**: Phone number field type - Emergency contact: "(330) 555-9999"

**Metadata Fields:**
- **Google Maps Embed URL**: URL field type - Full embed URL: "https://maps.google.com/..."
- **Google Maps Place ID**: Single line text field type - Google Place ID: "ChIJ..."
- **Office Photos**: Attachment field type - Upload office photos (images)

**Hours Fields:**
- **Hours Summary**: Long text field type - Multiline formatted hours:
  ```
  Monday-Friday: 8:00 AM - 6:00 PM EST
  Saturday: 9:00 AM - 4:00 PM EST
  Sunday: Closed
  ```
- **Open Time Weekday**: Single line text field type - 24-hour format: "08:00"
- **Close Time Weekday**: Single line text field type - 24-hour format: "18:00"
- **Open Time Saturday**: Single line text field type - 24-hour format: "09:00"
- **Close Time Saturday**: Single line text field type - 24-hour format: "16:00"
- **Sunday Hours**: Single line text field type - Text: "Closed" or "10:00-14:00"

**Service Area Field:**
- **Service Radius Miles**: Number field type (Integer, no decimals) - Whole number: 25

**Rollup Fields:**
- **Total Cities Served**: Rollup field type → Count from Service Areas table's Branch ID linked field - **ADD LATER** after Service Areas table exists
- **Total Pages**: Rollup field type → Count from Pages table where Matched Branch = this branch - **ADD LATER** after Pages table exists
- **Created Date**: Created time field type (Auto-populates when record created, displays date + time)
- **Last Modified**: Last modified time field type (Auto-updates when any field changes, displays date + time)

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

**IMPORTANT:** Use these EXACT Airtable field types as specified below.

**Identity Fields:**
- **Service Area ID**: Auto-number field type **(PRIMARY KEY)** - Auto-increments starting at 1
- **Branch ID**: Link to another record field type → Links to Branch Locations table **(FOREIGN KEY)** (Required) - Which branch serves this area
- **Location ID**: Link to another record field type → Links to Locations table **(FOREIGN KEY)** (Required) - Which city is served
- **Active**: Checkbox field type (Default: checked/true) - Indicates if this service area mapping is active

**Computed Fields (Lookups):**
- **Branch Name**: Lookup field type → From Branch ID, show Branch Name field
- **Branch City**: Lookup field type → From Branch ID, show City field
- **Branch State**: Lookup field type → From Branch ID, show State field
- **Service City**: Lookup field type → From Location ID, show City field
- **Service State**: Lookup field type → From Location ID, show State field
- **Unique Key**: Formula field type = `CONCATENATE({Branch ID}, "-", {Location ID})` - Creates unique identifier: "rec123-rec456"

**Metadata Fields:**
- **Pages in This Area**: Rollup field type → Count from Pages table where Location ID = this Location - **ADD LATER** after Pages table exists
- **Created Date**: Created time field type (Auto-populates when record created, displays date + time)

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

**IMPORTANT:** Use these EXACT Airtable field types as specified below.

**Identity Fields:**
- **Staff ID**: Auto-number field type **(PRIMARY KEY)** - Auto-increments starting at 1
- **Full Name**: Single line text field type (Required) - Employee name: "John Smith", "Sarah Johnson"
- **Branch ID**: Link to another record field type → Links to Branch Locations table **(FOREIGN KEY)** (Required) - Which branch employs this person
- **Active**: Checkbox field type (Default: checked/true) - Indicates if employee is currently active

**Role Fields:**
- **Job Title**: Single line text field type (Required) - Job title: "Lead Project Manager", "Senior Designer"
- **Role Type**: Single select field type - Options: Sales, Project Manager, Installer, Admin, Owner (Create all 5 options)
- **Primary Contact**: Checkbox field type - Is this the main point of contact for the branch?

**Experience Fields:**
- **Years of Experience**: Number field type (Integer, no decimals) - Whole number of years: 15
- **Certifications**: Long text field type - Comma-separated list: "NARI Certified, OSHA 30-Hour, Lead-Safe Certified"
- **Specialties**: Multiple select field type - Options: Bathroom, Kitchen, Basement, Flooring, Windows, Doors, Roofing, Siding (Create all 8 options, allow multiple selections)

**Content Fields (for AI-generated team pages):**
- **Photo URL**: URL field type - Full URL to employee photo: "https://res.cloudinary.com/.../john-smith.jpg"
- **Bio**: Long text field type - 2-3 sentence biography for website
- **Quote**: Long text field type - Personal quote or motto: "Quality craftsmanship is our standard"

**Contact Fields:**
- **Email**: Email field type - Employee email: "john.smith@bathsrus.com"
- **Phone Extension**: Single line text field type - Extension: "ext. 205" or "x205"

**Display Fields:**
- **Featured**: Checkbox field type - Show prominently on team/about pages
- **Display Order**: Number field type (Integer, no decimals) - Sort order on team pages: 1, 2, 3...
- **Hired Date**: Date field type - Date of hire: "2015-06-15"

**Metadata Fields:**
- **Created Date**: Created time field type (Auto-populates when record created, displays date + time)
- **Client**: Lookup field type → From Branch ID → Client Name (shows which client this employee belongs to)

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

**IMPORTANT:** Use these EXACT Airtable field types as specified below. This is the largest table with 50+ fields.

**Identity & Routing Fields:**
- **Page ID**: Auto-number field type **(PRIMARY KEY)** - Auto-increments starting at 1
- **Client Name**: Link to another record field type → Links to Clients table **(FOREIGN KEY)** (Required)
- **Service ID**: Link to another record field type → Links to Services table **(FOREIGN KEY)** (Required)
- **Location ID**: Link to another record field type → Links to Locations table **(FOREIGN KEY)** (Optional - for national/non-location pages like "About Us")
- **Unique Key**: Formula field type = `CONCATENATE({Client Name}, "-", {Service Slug}, "-", IF({Location Slug}, {Location Slug}, "national"))` - Prevents duplicates
- **URL Slug**: Formula field type = `IF({Location ID} = BLANK(), {Service Slug}, CONCATENATE({Service Slug}, "/", {Location Slug}))` - Generates "bathroom-remodeling/strongsville"
- **Page URL**: Formula field type = `CONCATENATE("https://", {Client Domain}, "/", {URL Slug})` - Full URL: "https://bathsrus.com/bathroom-remodeling/strongsville"

**Workflow Status Fields:**
- **Status**: Single select field type (Required, Default: Draft) - Options: Draft, AI Processing, Ready for Review, Approved, Published (Create all 5 options)
- **Published**: Checkbox field type - Is page live on website?
- **Publish Date**: Date field type - When page went live
- **Unpublish Date**: Date field type - Scheduled removal (future feature)

**Auto-Matched Data Fields (Lookups from Branch):**
- **Matched Branch**: Link to another record field type → Links to Branch Locations table **(FOREIGN KEY)** - Auto-populated by Airtable automation
- **Branch City**: Lookup field type → From Matched Branch, show City
- **Branch State**: Lookup field type → From Matched Branch, show State
- **Branch Timezone**: Lookup field type → From Matched Branch, show Timezone
- **Branch Phone**: Lookup field type → From Matched Branch, show Phone
- **Branch Address**: Lookup field type → From Matched Branch, show Full Address
- **Branch Email**: Lookup field type → From Matched Branch, show Email

**Additional Lookups Needed (for URL/routing formulas):**
- **Service Slug**: Lookup field type → From Service ID, show Service Slug field
- **Location Slug**: Lookup field type → From Location ID, show URL Slug field
- **Client Domain**: Lookup field type → From Client Name, show Domain field

**Manual Input Fields (Marketing Team fills these):**
- **Special Instructions**: Long text field type - Context for AI: "Emphasize fast turnaround - client wants urgency angle"
- **Campaign**: Link to another record field type → Links to Campaigns table **(FOREIGN KEY)** - **ADD LATER** after Campaigns table exists
- **Offer**: Link to another record field type → Links to Offers table **(FOREIGN KEY)** - **ADD LATER** after Offers table exists
- **Priority**: Single select field type - Options: High, Medium, Low (Create all 3 options)
- **Notes**: Long text field type - Internal notes for team

**AI-Generated Content Fields:**
- **SEO Title**: Single line text field type - 60 chars max: "Bathroom Remodeling Strongsville | Licensed Contractor | Baths R Us"
- **SEO Description**: Long text field type - 160 chars max meta description
- **H1 Headline**: Single line text field type - Main page headline: "Bathroom Remodeling in Strongsville, Ohio"
- **Hero Subheadline**: Long text field type - Supporting text below H1
- **Selected CTA ID**: Link to another record field type → Links to CTAs table **(FOREIGN KEY)** - **ADD LATER**
- **CTA Text**: Lookup field type → From Selected CTA ID, show CTA Text - **ADD LATER**
- **CTA Action Type**: Lookup field type → From Selected CTA ID, show CTA Action Type - **ADD LATER**
- **CTA Action Value**: Lookup field type → From Selected CTA ID, show Action Value - **ADD LATER**
- **Selected Hero Image ID**: Link to another record field type → Links to Hero Images Library table **(FOREIGN KEY)** - **ADD LATER**
- **Hero Image URL**: Lookup field type → From Selected Hero Image ID, show Cloudinary URL - **ADD LATER**
- **Hero Image Alt Text**: Lookup field type → From Selected Hero Image ID, show Alt Text Template - **ADD LATER**
- **Trust Bar 1**: Single line text field type - "Licensed & Insured"
- **Trust Bar 2**: Single line text field type - "15+ Years Experience"
- **Trust Bar 3**: Single line text field type - "500+ Projects Completed"
- **Trust Bar 4**: Single line text field type - "A+ BBB Rating"
- **Trust Bar 5**: Single line text field type - "Lifetime Warranty"
- **FAQs**: Long text field type - JSON array: `[{"question":"...","answer":"..."}]`
- **Gallery Captions**: Long text field type - JSON array: `["Caption 1", "Caption 2"]`

**Version Control Fields (Future - Fields exist but not used yet):**
- **AI Original Content**: Long text field type - JSON blob of original AI output (dormant)
- **Content Version**: Number field type (Integer) - Increments on edits (dormant)
- **Human Edited**: Checkbox field type - Flagged if manually changed (dormant)

**AI Metadata Fields:**
- **AI Generation Timestamp**: Date field type - When AI generated content
- **AI Model Used**: Single line text field type - "claude-sonnet-4-5-20250929"
- **AI Tokens Used**: Number field type (Integer) - Token count for billing
- **CTA Selection Reasoning**: Long text field type - Why AI chose this CTA
- **AI Retry Count**: Number field type (Integer) - Failed attempts (future: error handling)
- **AI Last Error**: Long text field type - Error messages (future: error handling)

**SEO Fields (Future):**
- **Canonical URL Override**: URL field type - If different from Page URL (future feature)
- **Robots Meta**: Single select field type - Options: index,follow, noindex,follow, index,nofollow, noindex,nofollow

**Approval Workflow Fields:**
- **Created By**: User field type - Airtable user who created record
- **Approved By**: User field type - Airtable user who approved
- **Approval Date**: Date field type - When approved for publish

**Metadata Fields:**
- **Created Date**: Created time field type (Auto-populates when record created)
- **Last Modified**: Last modified time field type (Auto-updates when any field changes)
- **Last Export Date**: Date field type - Updated by export script when pushed to GitHub

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

**IMPORTANT:** Use these EXACT Airtable field types as specified below.

**Identity Fields:**
- **CTA ID**: Auto-number field type **(PRIMARY KEY)** - Auto-increments starting at 1
- **CTA Text**: Single line text field type (Required) - Button text: "Get Free Quote", "Call Now"
- **CTA Type**: Single select field type (Required) - Options: Primary, Secondary, Urgency, Call (Create all 4 options)
- **Active**: Checkbox field type (Default: checked/true) - Is CTA available for AI selection?

**Action Fields:**
- **CTA Action Type**: Single select field type (Required) - Options: Scroll to Form, Phone Call, External Link (Create all 3 options)
- **Action Value**: Single line text field type (Required) - Examples: "#contact-form", "tel:{client_phone}", "https://calendly.com/..."

**Targeting Fields:**
- **Service Types**: Multiple select field type - Options: bathroom-remodeling, kitchen-remodeling, basement-finishing, all (Create all options, allows multiple)

**AI Configuration Fields:**
- **Priority**: Number field type (Integer, Required, 1-10 where 1 = highest priority) - AI selection ranking: 1
- **AI Selection Notes**: Long text field type - When to use: "Use for urgent, scarcity-driven copy with aggressive tone"
- **Tone Match**: Multiple select field type - Options: Professional, Conversational, Urgent, Luxury (Create all 4 options, allows multiple)

**Performance Fields (Future):**
- **Times Used**: Rollup field type → Count from Pages table's Selected CTA ID linked field - **ADD LATER** after Pages table created
- **Last Used Date**: Rollup field type → MAX(Pages.Created Date) where Selected CTA ID = this - **ADD LATER**

**Metadata Fields:**
- **Created Date**: Created time field type (Auto-populates when record created)
- **Last Modified**: Last modified time field type (Auto-updates when any field changes)

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

**IMPORTANT:** Use these EXACT Airtable field types as specified below.

**Identity Fields:**
- **Image ID**: Auto-number field type **(PRIMARY KEY)** - Auto-increments starting at 1
- **Filename**: Single line text field type (Required) - Naming convention: "bathroom-remodeling-strongsville-hero-01.jpg"
- **Active**: Checkbox field type (Default: checked/true) - Is image available for AI selection?

**Categorization Fields:**
- **Service ID**: Link to another record field type → Links to Services table **(FOREIGN KEY)** (Optional - blank = generic, usable for any service)
- **Location ID**: Link to another record field type → Links to Locations table **(FOREIGN KEY)** (Optional - blank = generic, usable for any location)
- **Image Type**: Single select field type (Required) - Options: Hero, Gallery, Before/After (Create all 3 options)

**URL Fields:**
- **Cloudinary URL**: URL field type (Required) - Full CDN URL: "https://res.cloudinary.com/.../image.jpg"
- **Netlify Path**: Single line text field type - Site-relative path: "/images/heroes/bathroom-strongsville-01.jpg"

**Accessibility Fields:**
- **Alt Text Template**: Long text field type (Required) - Template: "Modern {service} in {location} - professional results"

**Approval Fields:**
- **Upload Status**: Single select field type (Default: Approved) - Options: Draft, Approved (Create both options)
- **Uploaded By**: User field type - Airtable user who uploaded
- **Upload Date**: Created time field type (Auto-populates when record created)

**Performance Fields:**
- **Times Used**: Rollup field type → Count from Pages table's Selected Hero Image ID linked field - **ADD LATER** after Pages table created
- **Last Used Date**: Rollup field type → MAX(Pages.Created Date) where Selected Hero Image ID = this - **ADD LATER**

**Metadata Fields:**
- **Last Modified**: Last modified time field type (Auto-updates when any field changes)

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

**IMPORTANT:** Use these EXACT Airtable field types as specified below.

**Identity Fields:**
- **Testimonial ID**: Auto-number field type **(PRIMARY KEY)** - Auto-increments starting at 1
- **Client Name**: Link to another record field type → Links to Clients table **(FOREIGN KEY)** (Required)
- **Active**: Checkbox field type (Default: checked/true) - Is testimonial approved for use?
- **Featured**: Checkbox field type - Show prominently on pages?

**Customer Info Fields:**
- **Customer Name**: Single line text field type (Required) - "Sarah M.", "John D." (first name + last initial for privacy)
- **Customer City**: Single line text field type - "Strongsville", "Brunswick"
- **Customer State**: Single select field type - Same options as Locations/Branches: OH, PA, NY, FL, TX, etc.

**Review Fields:**
- **Rating**: Single select field type (Required) - Options: 1, 2, 3, 4, 5 (Create all 5 options as text)
- **Review Title**: Single line text field type - "Amazing bathroom transformation!"
- **Review Text**: Long text field type (Required) - Full review text, 2-5 sentences
- **Review Date**: Date field type (Required) - When review was posted: "2024-11-15"

**Source Fields:**
- **Source**: Single select field type (Required) - Options: Google, Yelp, Facebook, Angi, BBB, Direct (Create all 6 options)
- **Source URL**: URL field type - Link to original review: "https://g.page/r/..."
- **Verified**: Checkbox field type - Verified as real customer?

**Context Fields:**
- **Service ID**: Link to another record field type → Links to Services table **(FOREIGN KEY)** (Optional - what service did they buy?)
- **Branch ID**: Link to another record field type → Links to Branch Locations table **(FOREIGN KEY)** (Optional - which branch served them?)
- **Project Cost Range**: Single select field type - Options: Under $5k, $5-15k, $15-30k, $30k+, Not Disclosed (Create all 5 options)

**Media Fields:**
- **Before Photo URL**: URL field type - Before photo: "https://res.cloudinary.com/.../before.jpg"
- **After Photo URL**: URL field type - After photo: "https://res.cloudinary.com/.../after.jpg"
- **Video Testimonial URL**: URL field type - Video URL: "https://youtube.com/..."

**Metadata Fields:**
- **Created Date**: Created time field type (Auto-populates when record created)
- **Last Modified**: Last modified time field type (Auto-updates when any field changes)

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

**IMPORTANT:** Use these EXACT Airtable field types as specified below.

**Identity Fields:**
- **Offer ID**: Auto-number field type **(PRIMARY KEY)** - Auto-increments starting at 1
- **Offer Name**: Single line text field type (Required) - Internal name: "Spring 2025 Bathroom Promo"
- **Client Name**: Link to another record field type → Links to Clients table **(FOREIGN KEY)** (Required)
- **Active**: Checkbox field type (Default: checked/true) - Is offer currently available?

**Offer Details Fields:**
- **Offer Type**: Single select field type (Required) - Options: Percentage Discount, Dollar Amount Off, Free Upgrade, Bundle Deal, Financing (Create all 5 options)
- **Discount Value**: Single line text field type - Human-readable value: "20%", "$1,000", "Free luxury faucet upgrade"
- **Offer Description**: Long text field type (Required) - Full description: "Save 20% on all bathroom remodeling projects over $10,000..."
- **Fine Print**: Long text field type - Terms: "Minimum project value $10,000. Cannot be combined. New contracts only."

**Validity Fields:**
- **Start Date**: Date field type (Required) - When offer begins: "2025-03-01"
- **End Date**: Date field type (Required) - When offer expires: "2025-05-31"
- **Status**: Formula field type = `IF(AND({Start Date} <= TODAY(), {End Date} >= TODAY()), "Active", IF({End Date} < TODAY(), "Expired", "Scheduled"))` - Auto-calculates status

**Targeting Fields (Leave blank to target ALL):**
- **Target Services**: Link to another record field type → Links to Services table **(FOREIGN KEY)** (Multiple selections allowed) - Blank = all services
- **Target Locations**: Link to another record field type → Links to Locations table **(FOREIGN KEY)** (Multiple selections allowed) - Blank = all locations
- **Target Branches**: Link to another record field type → Links to Branch Locations table **(FOREIGN KEY)** (Multiple selections allowed) - Blank = all branches

**AI Configuration Fields:**
- **AI Prompt Addition**: Long text field type - Extra AI instructions: "Emphasize limited-time 20% savings. Create urgency around May 31 deadline."
- **Headline Emphasis**: Single select field type - Options: Discount Amount, Urgency, Value, Quality (Create all 4 options)
- **CTA Override**: Link to another record field type → Links to CTAs table **(FOREIGN KEY)** (Optional - force specific CTA for this offer)

**Tracking Fields:**
- **UTM Campaign**: Single line text field type - Analytics tracking: "spring-2025-bathroom-20off"
- **Promo Code**: Single line text field type - Coupon code: "SPRING20"

**Performance Fields (Future):**
- **Total Pages Using**: Rollup field type → Count from Pages table's Offer linked field - **ADD LATER** after Pages table created
- **Total Conversions**: Number field type (Integer) - From analytics webhook (future)
- **Estimated Revenue**: Currency field type (USD, 2 decimals) - Projected revenue (future)

**Metadata Fields:**
- **Created Date**: Created time field type (Auto-populates when record created)
- **Last Modified**: Last modified time field type (Auto-updates when any field changes)
- **Created By**: User field type - Airtable user who created offer

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

**IMPORTANT:** Use these EXACT Airtable field types as specified below.

**Identity Fields:**
- **Campaign ID**: Auto-number field type **(PRIMARY KEY)** - Auto-increments starting at 1
- **Campaign Name**: Single line text field type (Required) - Internal name: "Q2 2025 Bathroom Push"
- **Client Name**: Link to another record field type → Links to Clients table **(FOREIGN KEY)** (Required)
- **Active**: Checkbox field type (Default: checked/true) - Is campaign currently running?

**Campaign Type Fields:**
- **Campaign Type**: Single select field type (Required) - Options: Seasonal, Geographic Expansion, Service Launch, Product Launch (Create all 4 options)
- **Start Date**: Date field type (Required) - Campaign launch: "2025-04-01"
- **End Date**: Date field type - Campaign completion: "2025-06-30"
- **Status**: Single select field type - Options: Planning, Active, Paused, Completed (Create all 4 options)

**Targeting Fields:**
- **Target Services**: Link to another record field type → Links to Services table **(FOREIGN KEY)** (Multiple selections allowed)
- **Target Locations**: Link to another record field type → Links to Locations table **(FOREIGN KEY)** (Multiple selections allowed)
- **Campaign Offer**: Link to another record field type → Links to Offers table **(FOREIGN KEY)** (Single selection) - Which offer is tied to this campaign?

**Tracking Fields:**
- **UTM Campaign**: Single line text field type (Required) - Analytics tracking slug: "q2-2025-bathroom"
- **UTM Source**: Single line text field type - Traffic source: "google", "facebook", "email"
- **UTM Medium**: Single line text field type - Marketing medium: "cpc", "social", "email"

**Budget Fields (Future ROI Tracking):**
- **Budget**: Currency field type (USD, 2 decimals) - Total budget allocated: $15,000.00
- **Total Spend**: Currency field type (USD, 2 decimals) - Actual spend to date (manually updated)

**Content Fields:**
- **Campaign Description**: Long text field type - Overview and strategy
- **Campaign Goals**: Long text field type - Success metrics and objectives

**Metadata Fields:**
- **Total Pages**: Rollup field type → Count from Pages table's Campaign linked field - **ADD LATER** after Pages table created
- **Created Date**: Created time field type (Auto-populates when record created)
- **Created By**: User field type - Airtable user who created campaign

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

## AIRTABLE EXTENSIONS SETUP

### Task 4: Install Recommended Marketplace Extensions

**Date Installed:** 2025-01-10
**Installed By:** Jon Steiner
**Airtable Plan Required:** Team plan or higher ($20/user/month)

Install these 7 official Airtable Marketplace extensions to enhance workflow capabilities:

#### 1. **Scripting Extension** (HIGH PRIORITY)
**Purpose:** Custom JavaScript automation, API integrations, complex data operations
**Use Cases for Landing Pages System:**
- Claude API integration for AI content generation
- Bulk page generation from templates
- Custom data transformations for export to GitHub/Netlify
- Webhook triggers to Make.com scenarios
- Relationship validation (ensure Pages have required CTAs, Hero Images)

**How to Install:**
1. Click Extensions button (puzzle piece icon) in top-right
2. Click "+ Add an extension"
3. Search "Scripting"
4. Click "Add extension"

---

#### 2. **Batch Update Extension** (HIGH PRIORITY)
**Purpose:** Update multiple records with multiple actions simultaneously
**Use Cases:**
- Bulk status updates (Draft → Ready for Review across 50 pages)
- Campaign assignment (add Campaign ID to all pages in a view)
- CTA rotation (switch all "bathroom-remodeling" pages to new CTA)
- Hero image updates (update Selected Hero Image for multiple pages)
- Service updates (apply new description across related pages)

**Common Workflows:**
- Update Status for all pages in specific locations
- Change Offer field for all pages in a campaign
- Set Published = true for approved pages
- Update Priority to "High" for pages missing CTAs

---

#### 3. **Base Schema Extension** (HIGH PRIORITY)
**Purpose:** Visualize all tables, fields, and relationships
**Use Cases:**
- Onboard new team members with visual database structure
- Audit data model to verify relationships are correct
- Document 12-table schema for technical documentation
- Troubleshoot relationship issues

**What It Shows:** Visual diagram of:
- All 12 tables with field counts
- Foreign key relationships (arrows between tables)
- Field types and configurations

---

#### 4. **CSV Import Extension** (HIGH PRIORITY)
**Purpose:** Import/merge data from CSV files
**Use Cases:**
- Initial data population (100+ locations from spreadsheet)
- Client onboarding (import client list with all fields)
- Service library setup (import standard services from template)
- Testimonial import (bulk import reviews from Google/Yelp exports)
- Location demographics (import census data: population, income, home values)

**Features:**
- Add new records OR merge with existing (by unique field)
- Field mapping interface
- Preview before import
- Limits: 25,000 rows, 5MB file size

---

#### 5. **Chart Extension** (HIGH PRIORITY)
**Purpose:** Visualize data with charts and graphs
**Use Cases:**
- Page status dashboard (pie chart: Draft/Review/Approved/Published)
- Pages by branch (bar chart showing page count per branch)
- Campaign performance (line chart: pages published over time)
- Service distribution (which services have most pages)
- Location coverage (geographic spread visualization)

**Chart Types Available:**
- Bar: Pages by Location/Branch/Service
- Line: Pages published per month
- Pie: Status distribution, CTA usage
- Scatter: Engagement metrics by attributes

---

#### 6. **Pivot Table Extension** (HIGH PRIORITY)
**Purpose:** Summarize and analyze data in pivot tables
**Use Cases:**
- Branch × Service matrix (how many pages per combination?)
- Campaign analysis (Pages by Campaign × Location × Status)
- CTA effectiveness (which CTAs used most per service?)
- Content audit (Pages by Status × Service × Priority)
- Resource planning (Branch Staff × Specialties × Pages)

**Example Pivot:**
```
Rows: Branch Locations
Columns: Services
Values: COUNT of Pages
Filter: Status = "Published"
Result: See which branches have pages for which services
```

---

#### 7. **Summary Extension** (HIGH PRIORITY)
**Purpose:** Display summary values from views
**Use Cases:**
- Total pages counter (show total published pages prominently)
- Active campaigns (count campaigns with Status = "Active")
- Pending approvals (show pages in "Ready for Review" status)
- Branch performance (count pages per branch real-time)
- Content gaps (show services with < 5 pages)

**Display Options:**
- Large number display
- Percentage calculations
- Sparkline trends

---

### Extensions NOT Installed (Lower Priority)

These official extensions are available but not currently needed:

**May Install Later:**
- **Gantt**: Campaign timeline visualization (install if date-driven campaigns)
- **Map**: Geographic visualization of locations (requires Google Maps API key)
- **Search**: Advanced record searching (native search usually sufficient)
- **Dedupe**: Find/merge duplicate records (for quarterly data cleanup)
- **Page Designer**: Export PDFs (manual only, cannot automate)
- **JSON Editor**: Edit JSON in text fields (nice for debugging)

**Skip These:**
- Org Chart, Flowchart, Vega-Lite, Matrix: Not applicable to workflow
- SendGrid, Twilio (SMS): Better handled by Make.com automation
- Jira Cloud: Using GitHub for task management
- Vision, Translate: Require paid Google Cloud APIs
- Utility extensions: Countdown, World Clock, Chime, Flashcard, Color Palette, etc.

---

### Extension Management Best Practices

**Performance Considerations:**
- Extensions load when you open their tab
- Too many extensions can slow base loading
- Archive unused extensions via Extensions menu

**Recommended Usage Pattern:**
- **Daily:** Scripting, Batch Update, Chart
- **Weekly:** Pivot Table, Summary
- **Monthly:** CSV Import, Base Schema (for audits)

**Cost:** All installed extensions are FREE with Team plan ($20/user/month)

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
