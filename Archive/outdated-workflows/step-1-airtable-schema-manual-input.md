# STEP 1: Airtable Schema & Manual Input

## Tables Architecture

### **1. Clients Table**
```yaml
Purpose: Master client configuration and branding

Fields:
  CORE IDENTITY:
    - Client ID (auto-number, primary key)
    - Client Name (single line text) - "Baths R Us"
    - Domain (URL) - "bathsrus.com"
    - Active (checkbox)

  BRANDING:
    - Primary Color (single line text) - "#0ea5e9"
    - Secondary Color (single line text) - "#8b5cf6"
    - Logo URL (URL) - Cloudinary link
    - Google Fonts (single line text) - "Inter"

  CONTACT:
    - Primary Phone (phone) - "(704) 555-1234"
    - Primary Email (email) - "info@bathsrus.com"

  TRACKING:
    - GTM Container ID (single line text) - "GTM-XXXXXXX"
    - CallRail Swap Target (single line text) - "CR-123456"
    - reCAPTCHA Site Key (single line text)
    - Salesforce Campaign ID (single line text)

  INTEGRATIONS:
    - Make.com Webhook URL (URL)

Example Record:
  Client Name: Baths R Us
  Domain: bathsrus.com
  Primary Color: #0ea5e9
  Primary Phone: (704) 555-1234
  GTM Container ID: GTM-ABC123
  Active: ✓
```

### **2. Branch Locations Table** ⭐ NEW
```yaml
Purpose: Physical locations with service area mapping for metadata

Fields:
  LOCATION INFO:
    - Branch ID (auto-number, primary key)
    - Branch Name (single line text) - "Medina Office"
    - City (single line text) - "Medina"
    - State (single select) - OH, NC, etc.
    - Full Address (single line text) - "123 Main St, Medina, OH 44256"

  CONTACT:
    - Phone (phone) - "(330) 555-1234"
    - Email (email) - "medina@bathsrus.com"

  SERVICE AREA:
    - Service Area Cities (multiple select) - [Strongsville, Brunswick, Medina, Wadsworth]
    - Service Radius Miles (number) - 25

  METADATA:
    - Google Maps Embed URL (URL)
    - Hours of Operation (long text) - "Mon-Fri 8am-6pm"
    - Client Name (linked record to Clients)
    - Active (checkbox)

Example Records:
  Record 1:
    Branch Name: Medina Office
    City: Medina
    State: OH
    Service Area Cities: [Strongsville, Brunswick, Medina, Wadsworth]
    Phone: (330) 555-1234
    Client: Baths R Us
    Active: ✓

  Record 2:
    Branch Name: Hilliard Office
    City: Hilliard
    State: OH
    Service Area Cities: [Columbus, Hilliard, Dublin, Grove City]
    Phone: (614) 555-5678
    Client: Baths R Us
    Active: ✓
```

### **3. CTAs Table**
```yaml
Purpose: Define available CTAs as AI guardrails

Fields:
  - CTA ID (auto-number, primary key)
  - CTA Text (single line text) - "Get Free Quote"
  - CTA Type (single select) - Primary, Secondary, Urgency
  - CTA Action Type (single select) - Scroll to Form, Phone Call, External Link
  - Action Value (single line text) - "#contact-form" OR "tel:{phone}" OR URL
  - Service Types (multiple select) - [bathroom-remodeling, kitchen-remodeling, all]
  - Priority (number) - For AI preference ranking (1 = highest)
  - Active (checkbox)
  - Notes (long text) - Context for when to use

Example Records:
  Record 1:
    CTA Text: Get Free Quote
    CTA Type: Primary
    Action Type: Scroll to Form
    Action Value: #contact-form
    Service Types: [all]
    Priority: 1
    Active: ✓
    Notes: Default CTA for most conversational/professional copy

  Record 2:
    CTA Text: Call Now - Limited Slots!
    CTA Type: Urgency
    Action Type: Phone Call
    Action Value: tel:{client_phone}
    Service Types: [all]
    Priority: 3
    Active: ✓
    Notes: Use when copy emphasizes urgency or scarcity
```

### **4. Hero Images Library Table**
```yaml
Purpose: Centralized image asset management

Fields:
  - Image ID (auto-number, primary key)
  - Filename (single line text) - "bathroom-remodeling-charlotte-hero-01.jpg"
  - Service (single select) - bathroom-remodeling, kitchen-remodeling, etc.
  - Location (single select) - charlotte, strongsville, etc. (blank = generic)
  - Image Type (single select) - Hero, Gallery, Before/After
  - Cloudinary URL (URL) - Full CDN path
  - Netlify Path (single line text) - "/images/heroes/bathroom-charlotte-01.jpg"
  - Alt Text Template (long text) - For accessibility
  - Active (checkbox)
  - Upload Date (created time)
  - Last Synced (last modified time)

Example Records:
  Record 1:
    Filename: bathroom-remodeling-strongsville-hero-01.jpg
    Service: bathroom-remodeling
    Location: strongsville
    Image Type: Hero
    Cloudinary URL: https://res.cloudinary.com/.../bathroom-strongsville-01.jpg
    Netlify Path: /images/heroes/bathroom-remodeling-strongsville-hero-01.jpg
    Alt Text Template: Modern bathroom remodeling in {location}
    Active: ✓
```

### **5. Pages Table** ⭐ UPDATED
```yaml
Purpose: Landing page content and workflow management

MANUAL FIELDS (Marketing Manager fills):
  - Page ID (auto-number, primary key)
  - Service (single select) - bathroom-remodeling, kitchen-remodeling, about-us, etc.
  - Location (single line text) - "strongsville" (can be blank for non-location pages)
  - Client Name (linked record to Clients) - Required
  - Status (single select) - Draft, AI Processing, Ready for Review, Approved, Published
  - Special Instructions (long text) - Optional context for AI
  - Created Date (created time)
  - Last Modified (last modified time)

AUTO-POPULATED FIELDS (Airtable Automations):
  - Matched Branch (linked record to Branch Locations)
    Logic: Find branch where Location is in {Service Area Cities}

LOOKUP FIELDS (from Matched Branch):
  - Branch City (lookup)
  - Branch State (lookup)
  - Branch Phone (lookup)
  - Branch Address (lookup)
  - Branch Email (lookup)

COMPUTED FIELDS (Airtable Formulas):
  - Page URL (formula):
    IF(
      {Location} = BLANK(),
      CONCATENATE("https://", {Client Domain}, "/", {Service}),
      CONCATENATE("https://", {Client Domain}, "/", {Service}, "/", LOWER({Location}))
    )
    Result: "https://bathsrus.com/bathroom-remodeling/strongsville"

AI-GENERATED FIELDS (Claude populates):
  - SEO Title (single line text)
  - SEO Description (long text)
  - H1 Headline (single line text)
  - Hero Subheadline (long text)
  - Selected CTA ID (linked record to CTAs)
  - Selected Hero Image ID (linked record to Hero Images Library)
  - Trust Bar 1-5 (single line text x5)
  - Gallery Captions (long text, JSON array)
  - FAQs (long text, JSON array)
  - AI Generation Timestamp (date/time)
  - AI Model Used (single line text)
  - AI Tokens Used (number)
  - CTA Selection Reasoning (long text)

LOOKUP FIELDS (from linked records):
  - CTA Text (lookup from Selected CTA ID)
  - CTA Action Type (lookup)
  - CTA Action Value (lookup)
  - Hero Image URL (lookup from Selected Hero Image ID)
  - Hero Image Alt Text (lookup)
```

---

## Marketing Manager Workflow in Airtable

### **Scenario: Creating a New Landing Page**

**Marketing Manager: Sarah at Baths R Us**
**Goal: Create bathroom remodeling page for Strongsville, OH**

**Step-by-Step Actions:**

```yaml
1. Open Airtable Base: "Landing Pages Content Management"

2. Navigate to "Pages" table

3. Click "+ New Record"

4. Fill ONLY these fields:
   ┌─────────────────────────────────────────┐
   │ Service: bathroom-remodeling (dropdown) │
   │ Location: strongsville                  │
   │ Client Name: Baths R Us (linked)        │
   │ Status: Draft (default)                 │
   │ Special Instructions: "Emphasize fast   │
   │   turnaround - client wants urgency"    │
   └─────────────────────────────────────────┘

5. Click "Save"

6. Airtable Automation AUTO-RUNS:
   - Matches Location "strongsville" to Branch Locations
   - Finds: Medina Office (services Strongsville area)
   - Populates:
     ✓ Matched Branch: Medina Office
     ✓ Branch City: Medina (lookup)
     ✓ Branch Phone: (330) 555-1234 (lookup)
     ✓ Branch Address: 123 Main St, Medina, OH (lookup)
   - Computes:
     ✓ Page URL: https://bathsrus.com/bathroom-remodeling/strongsville

7. Sarah reviews auto-populated data:
   ✓ Correct branch matched
   ✓ URL looks correct
   ✓ Ready for AI generation

8. Sarah triggers AI: Changes Status → "AI Processing"
```

---
