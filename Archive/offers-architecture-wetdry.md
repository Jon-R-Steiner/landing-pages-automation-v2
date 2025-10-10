# Offers Architecture - Wet/Dry Area Complexity
**Multi-Offer Display Strategy for Service Scope Variations**

## Overview

The offers system handles complex bathroom remodeling scenarios where:
- **Wet area only** projects (shower/tub) qualify for $1,500 off
- **Full remodel** projects (wet + dry) qualify for $3,000 off
- **50% install** offer applies to all projects but requires separate page

## Core Concepts

### Offer Categorization

```yaml
Two Categories of Offers:

1. MONETARY OFFERS (Displayed Together):
   - $1,500 Off Wet Area
   - $3,000 Off Full Remodel

   Display Strategy:
     - Show on SAME page (user chooses in form)
     - Service scope determines which offers are eligible

2. PERCENTAGE/SPECIAL OFFERS (Separate Page):
   - 50% Off Installation

   Display Strategy:
     - ALWAYS gets dedicated URL variant
     - Example: /service/location/install-special
```

### Service Scope

```yaml
Services categorized by scope:

Wet Area Only:
  - Walk-in Shower Installation
  - Shower Replacement
  - Tub-to-Shower Conversion
  Eligible Offers: $1,500 off, 50% install

Dry Area Only:
  - Vanity Replacement (future)
  - Tile Flooring Only (future)
  Eligible Offers: TBD (not currently offered)

Full Remodel (Wet + Dry):
  - Bathroom Remodeling
  - Master Bath Renovation
  Eligible Offers: $1,500 off (wet only), $3,000 off (full), 50% install
```

---

## Updated Airtable Schema

### Services Table - NEW FIELDS

```yaml
SERVICE SCOPE: ⭐ CRITICAL FOR OFFER LOGIC
  - Service Scope (single select) *Required
    Options:
      - Wet Area Only
      - Dry Area Only
      - Full Remodel (Wet + Dry)
      - Other (non-bathroom)

  - Scope Notes (long text)
    Purpose: Explain categorization for future reference
    Example: "Walk-in showers are wet area only - shower/tub replacement
             without vanity, flooring, or lighting work"

COMPATIBLE OFFERS:
  - Default Offer (linked to Offers, single) - Primary/most common offer
  - Compatible Offers (linked to Offers, multiple) - All applicable offers

Example Record - Walk-in Shower:
  Service Name: Walk-in Shower Installation
  Service Slug: walk-in-shower
  Service Scope: Wet Area Only
  Default Offer: [link to $1,500 off]
  Compatible Offers: [link to $1,500 off, 50% install]

Example Record - Bathroom Remodeling:
  Service Name: Bathroom Remodeling
  Service Slug: bathroom-remodeling
  Service Scope: Full Remodel (Wet + Dry)
  Default Offer: [link to $3,000 off]
  Compatible Offers: [link to $1,500 off, $3,000 off, 50% install]
```

---

### Offers Table - UPDATED FIELDS

```yaml
OFFER CATEGORIZATION: ⭐ NEW
  - Offer Category (single select) *Required
    Options:
      - Monetary (Dollar Amount) - Can display with other monetary offers
      - Percentage/Special - Gets separate page variant
      - Financing - Gets separate page variant

  - Display Group (single select) *Required
    Options:
      - Primary - Shows on base page (can be combined with other Primary)
      - Variant - Creates separate URL (/service/location/{suffix})

ELIGIBILITY: ⭐ CRITICAL
  - Eligible Service Scopes (multiple select) *Required
    Options:
      - Wet Area Only
      - Dry Area Only
      - Full Remodel (Wet + Dry)
      - All Scopes

  - Minimum Project Value (currency)
  - Maximum Project Value (currency) - Optional

URL CONFIGURATION:
  - Offer URL Suffix (single line text)
    Purpose: URL path for variant pages
    Example: "install-special" → /walk-in-shower/strongsville/install-special
    Note: Leave blank for Primary offers (show on base page)

  - Is Default Offer (checkbox)
    Purpose: Base URL uses this offer if multiple Primary offers apply
    Note: Only one default offer should exist per service scope

EXISTING FIELDS:
  - Offer ID (auto-number)
  - Offer Name (text)
  - Client Name (linked)
  - Offer Type (select)
  - Discount Value (text)
  - Offer Description (long text)
  - Fine Print (long text)
  - Start Date, End Date
  - AI Prompt Addition
  - Tracking fields
  - Relationships
```

### Complete Offer Examples

```yaml
Offer 1: $1,500 Off Wet Area
  Offer Category: Monetary (Dollar Amount)
  Display Group: Primary
  Eligible Service Scopes: [Wet Area Only, Full Remodel (Wet + Dry)]
  Minimum Project Value: $5,000
  Offer URL Suffix: [blank] (shows on base page)
  Is Default Offer: TRUE (for Wet Area Only)
  Discount Value: $1,500
  Offer Description: Save $1,500 on wet area bathroom projects (shower/tub replacement)
  Fine Print: Minimum $5,000 project. Wet area work only (shower, tub, surrounds).

Offer 2: $3,000 Off Full Remodel
  Offer Category: Monetary (Dollar Amount)
  Display Group: Primary
  Eligible Service Scopes: [Full Remodel (Wet + Dry)]
  Minimum Project Value: $15,000
  Offer URL Suffix: [blank] (shows on base page with $1,500)
  Is Default Offer: TRUE (for Full Remodel)
  Discount Value: $3,000
  Offer Description: Save $3,000 on complete bathroom remodels (wet + dry areas)
  Fine Print: Minimum $15,000 project. Includes shower, tub, vanity, flooring, lighting.

Offer 3: 50% Off Installation
  Offer Category: Percentage/Special
  Display Group: Variant
  Eligible Service Scopes: [All Scopes]
  Minimum Project Value: $0
  Offer URL Suffix: install-special
  Is Default Offer: FALSE
  Discount Value: 50% off labor
  Offer Description: Save 50% on installation labor for any bathroom project
  Fine Print: Labor only. Materials at regular price. Cannot combine with other offers.
```

---

### Pages Table - UPDATED FIELDS

```yaml
OFFER MANAGEMENT: ⭐ REDESIGNED

  - Primary Offers (linked to Offers, MULTIPLE)
    Purpose: Base page can display multiple offers (user chooses in form)
    Example: Bathroom Remodeling page → [$1,500 off, $3,000 off]
    Note: Only applies to base pages (Is Offer Variant = FALSE)

  - Is Offer Variant (checkbox)
    Purpose: Identifies pages created for specific variant offers
    TRUE for: /service/location/install-special
    FALSE for: /service/location (base page)

  - Variant Offer (linked to Offers, SINGLE)
    Purpose: If Is Offer Variant = TRUE, which specific offer is this page for?
    Example: 50% Off Installation

  - Parent Page (linked to Pages, SINGLE)
    Purpose: Variant pages link back to base page
    Example: install-special variant → links to base page

  - Offer Variants (linked to Pages, MULTIPLE reverse link)
    Purpose: Base page sees all its variants
    Auto-populated by Parent Page links

AI-GENERATED CONTENT (Multi-Offer):

  - Offer Selection Strategy (long text) ⭐ NEW
    Purpose: AI explains which offers apply and why
    Example: "Full Remodel service in Strongsville - eligible for both $1,500
             (wet area focus) and $3,000 (complete remodel). Displaying both
             to allow customer choice based on project scope."

  - Form Offer Options (long text, JSON) ⭐ NEW
    Purpose: Structured data for multi-offer form rendering
    Example:
    [
      {
        "offerId": "rec123",
        "label": "Wet Area Only - Save $1,500",
        "value": "$1500-wet",
        "description": "Shower and tub replacement without full remodel",
        "eligibility": "Minimum $5,000 project"
      },
      {
        "offerId": "rec456",
        "label": "Full Bathroom Remodel - Save $3,000",
        "value": "$3000-full",
        "description": "Complete transformation: shower, tub, vanity, flooring, lighting",
        "eligibility": "Minimum $15,000 project"
      }
    ]

URL GENERATION (Formula):

  - Final URL (formula)
    IF(
      {Is Offer Variant} = TRUE,
      CONCATENATE({Base URL}, "/", {Variant Offer URL Suffix}),
      {Base URL}
    )

    Examples:
      Base page: /walk-in-shower/strongsville
      Variant: /walk-in-shower/strongsville/install-special
```

---

## Automation: Auto-Create Offer Variants

### Automation Logic

```yaml
Name: Auto-Create Offer Variant Pages
Trigger: Page record created
Conditions:
  - Service ID is not empty
  - Status = "Draft"
  - Is Offer Variant = FALSE (base page only, don't recurse)

Steps:

STEP 1: Get Service Compatible Offers
  - Lookup: Service.Compatible Offers (multiple linked records)

STEP 2: Separate Offers by Display Group
  Primary Offers:
    - Filter: Display Group = "Primary"
    - Filter: Eligible Service Scopes includes Service.Service Scope

  Variant Offers:
    - Filter: Display Group = "Variant"
    - Filter: Eligible Service Scopes includes Service.Service Scope OR "All Scopes"

STEP 3: Assign Primary Offers to Base Page
  - Update: Page.Primary Offers = [eligible Primary offers]
  - Result: Base page will display multiple offers if applicable

STEP 4: Create Variant Pages
  For each Variant Offer:
    - Create new Page record:
        Service ID: [same as base page]
        Location ID: [same as base page]
        Client: [same as base page]
        Variant Offer: [this specific offer]
        Is Offer Variant: TRUE
        Parent Page: [link to base page]
        Status: Draft
        Campaign: [same as base page]
        Priority: [same as base page]
        Special Instructions: [copy from base page]

STEP 5: Update Base Page
  - Offer Variants field auto-updates via reverse link
```

### Example Execution

```yaml
Marketing creates:
  Service: Walk-in Shower (Wet Area Only)
  Location: Strongsville
  Status: Draft

Service.Compatible Offers:
  - $1,500 off (Monetary, Primary, eligible for Wet Area) ✓
  - 50% install (Percentage, Variant, eligible for All Scopes) ✓

Automation executes:

  Primary Offers Assignment:
    Page 1 (existing base page):
      Primary Offers: [$1,500 off]

  Variant Page Creation:
    Page 2 (auto-created):
      Service: Walk-in Shower
      Location: Strongsville
      Variant Offer: 50% install
      Is Offer Variant: TRUE
      Parent Page: [Page 1]
      Status: Draft

Result: 2 pages ready for AI generation
```

---

## AI Content Generation

### Multi-Offer Base Page Prompt

```javascript
// For pages with MULTIPLE Primary Offers (wet + dry)

function buildMultiOfferPrompt(pageData) {
  const {
    service,
    location,
    primaryOffers, // Array: [$1,500 off, $3,000 off]
    serviceScope
  } = pageData

  return `Generate landing page content for ${service} in ${location}.

SERVICE SCOPE: ${serviceScope}
This service can include wet area work AND full remodeling.

OFFERS TO DISPLAY (Customer chooses in form):
${primaryOffers.map(offer => `
  ${offer.offerName}: ${offer.discountValue}
  Eligibility: ${offer.eligibleScopes.join(', ')}
  Minimum: ${offer.minimumProjectValue}
  Description: ${offer.description}
`).join('\n')}

CONTENT REQUIREMENTS:

SEO Title (50-60 chars):
  - Highlight maximum savings: "Save Up To $3,000"
  - Format: "${service} ${location} | Save Up To $3,000 | {Client}"

H1 Headline (8-12 words):
  - Emphasize savings range: "Save $1,500-$3,000 on ${service} in ${location}"
  - Alternative: "Professional ${service} in ${location} - Save Up To $3,000"

Hero Subheadline (15-25 words):
  - Explain offer choice clearly
  - Example: "Choose the right solution for your project - wet area updates
    starting at $1,500 or complete bathroom transformation and save $3,000"

CTA Text:
  - Generic to cover both offers: "Get Free Quote - Save Up To $3,000"
  - NOT offer-specific (user selects in form)

Offer Comparison Section (for page body):
  Generate brief, helpful copy explaining the difference between offer options.
  Help customer understand which offer fits their needs.

  Example structure:
    "Which option is right for you?

     💰 Wet Area Only ($1,500 Off)
     Perfect if you're focusing on shower and tub replacement without changing
     vanity, flooring, or lighting. Great for targeted updates.

     💰 Full Bathroom Remodel ($3,000 Off)
     Transform your entire bathroom including shower, tub, vanity, flooring,
     and lighting. Complete renovation from floor to ceiling."

OUTPUT FORMAT (JSON):
{
  "seoTitle": "...",
  "seoDescription": "...",
  "h1Headline": "...",
  "heroSubheadline": "...",
  "selectedCtaId": "recXXX",
  "offerComparisonCopy": "Helpful explanation of offer options...",
  "offerSelectionStrategy": "Why both offers apply to this service...",
  "formOfferOptions": [
    {
      "offerId": "rec123",
      "label": "Wet Area Only - Save $1,500",
      "value": "$1500-wet",
      "description": "Shower and tub replacement",
      "eligibility": "Minimum $5,000 project"
    },
    {
      "offerId": "rec456",
      "label": "Full Bathroom Remodel - Save $3,000",
      "value": "$3000-full",
      "description": "Complete bathroom transformation",
      "eligibility": "Minimum $15,000 project"
    }
  ]
}`
}
```

### Single-Offer Base Page Prompt

```javascript
// For pages with SINGLE Primary Offer (wet only)

function buildSingleOfferPrompt(pageData) {
  const {
    service,
    location,
    primaryOffers, // Array with single offer: [$1,500 off]
    serviceScope
  } = pageData

  const offer = primaryOffers[0]

  return `Generate landing page content for ${service} in ${location}.

SERVICE SCOPE: ${serviceScope}
This is a wet area only service (shower/tub replacement).

OFFER (Exclusive):
  ${offer.offerName}: ${offer.discountValue}
  ${offer.description}
  Minimum: ${offer.minimumProjectValue}

CONTENT REQUIREMENTS:

SEO Title: "${service} ${location} | Save ${offer.discountValue} | {Client}"

H1 Headline: "Professional ${service} in ${location}"
  - Can mention savings: "Save ${offer.discountValue} on ${service}"

Hero Subheadline:
  - Include offer value and credibility
  - Example: "Save ${offer.discountValue} on expert ${service}. Licensed,
    insured, and trusted by 500+ homeowners."

CTA Text: "Get Free Quote - Save ${offer.discountValue}"

OUTPUT FORMAT (JSON):
{
  "seoTitle": "...",
  "seoDescription": "...",
  "h1Headline": "...",
  "heroSubheadline": "...",
  "selectedCtaId": "recXXX"
}`
}
```

### Variant Page Prompt (50% Install)

```javascript
// For /service/location/install-special pages

function buildVariantOfferPrompt(pageData) {
  const {
    service,
    location,
    variantOffer // 50% install
  } = pageData

  return `Generate landing page content for ${service} in ${location}.

SPECIAL OFFER PAGE - INSTALLATION DISCOUNT:
  ${variantOffer.offerName}: ${variantOffer.discountValue}
  ${variantOffer.description}
  ${variantOffer.finePrint}

CONTENT REQUIREMENTS:

SEO Title: "50% Off ${service} Installation | ${location} | {Client}"

H1 Headline: "50% Off Installation - ${service} in ${location}"

Hero Subheadline:
  - Emphasize labor savings and value
  - Example: "Save 50% on professional installation labor. Get expert ${service}
    installation at half the cost."

CTA Text: "Get Free Quote - 50% Off Install"

Messaging Focus:
  - Emphasize skilled labor at reduced cost
  - Quality craftsmanship guarantee
  - Professional installation expertise

OUTPUT FORMAT (JSON):
{
  "seoTitle": "...",
  "seoDescription": "...",
  "h1Headline": "...",
  "heroSubheadline": "...",
  "selectedCtaId": "recXXX"
}`
}
```

---

## Complete Page Examples

### Example 1: Walk-in Shower (Wet Area Only)

#### Page 1: `/walk-in-shower/strongsville` (Base)

```yaml
Service: Walk-in Shower (Wet Area Only)
Location: Strongsville
Primary Offers: [$1,500 off] (single offer)
Is Offer Variant: FALSE

AI-Generated Content:
  SEO Title: Walk-in Shower Installation Strongsville OH | Save $1,500 | Baths R Us
  H1: Save $1,500 on Walk-in Shower Installation in Strongsville
  Subheadline: Expert walk-in shower installation with $1,500 savings. Licensed,
               insured, and trusted by 500+ homeowners in Medina County.

  Offer Display:
    💰 SAVE $1,500 ON WET AREA INSTALLATION
    Professional walk-in shower and tub replacement
    Minimum $5,000 project
    [Get Free Quote - Save $1,500]
```

#### Page 2: `/walk-in-shower/strongsville/install-special` (Variant)

```yaml
Service: Walk-in Shower (Wet Area Only)
Location: Strongsville
Variant Offer: 50% off install
Is Offer Variant: TRUE
Parent Page: [Page 1]

AI-Generated Content:
  SEO Title: 50% Off Walk-in Shower Installation | Strongsville OH | Baths R Us
  H1: 50% Off Installation - Walk-in Shower in Strongsville
  Subheadline: Save 50% on professional installation labor. Expert walk-in shower
               installation at half the cost.

  Offer Display:
    🎉 50% OFF INSTALLATION LABOR
    Professional installation at half the price
    Materials at regular price, labor 50% off
    [Get Free Quote - 50% Off Install]
```

---

### Example 2: Bathroom Remodeling (Full Remodel)

#### Page 1: `/bathroom-remodeling/strongsville` (Base - Multi-Offer)

```yaml
Service: Bathroom Remodeling (Full Remodel - Wet + Dry)
Location: Strongsville
Primary Offers: [$1,500 off, $3,000 off] (both displayed)
Is Offer Variant: FALSE

AI-Generated Content:
  SEO Title: Bathroom Remodeling Strongsville OH | Save Up To $3,000 | Baths R Us
  H1: Save $1,500-$3,000 on Bathroom Remodeling in Strongsville
  Subheadline: Complete bathroom transformation or wet area update - choose your
               savings. Licensed contractors with 15+ years experience.

  Offer Display (Multi-Select Form):
    💰 CHOOSE YOUR SAVINGS:

    ○ Wet Area Only - Save $1,500
      Focus on shower and tub replacement
      Perfect for targeted bathroom updates
      Minimum $5,000 project

    ○ Full Bathroom Remodel - Save $3,000
      Complete transformation: shower, tub, vanity, flooring, lighting
      Floor-to-ceiling bathroom renovation
      Minimum $15,000 project

    Which option is right for you?
    Not sure? Our team will help you determine the best solution during
    your free in-home consultation. We'll assess your space, understand
    your goals, and recommend the right approach.

    [Get Free Quote - Save Up To $3,000]
```

#### Page 2: `/bathroom-remodeling/strongsville/install-special` (Variant)

```yaml
Service: Bathroom Remodeling (Full Remodel - Wet + Dry)
Location: Strongsville
Variant Offer: 50% off install
Is Offer Variant: TRUE
Parent Page: [Page 1]

AI-Generated Content:
  SEO Title: 50% Off Bathroom Remodeling Installation | Strongsville | Baths R Us
  H1: 50% Off Installation - Bathroom Remodeling in Strongsville
  Subheadline: Transform your bathroom and save 50% on professional installation
               labor. Quality craftsmanship at half the cost.

  Offer Display:
    🎉 50% OFF INSTALLATION LABOR
    Save on labor for any bathroom remodeling project
    Wet area or full remodel - your choice
    Materials at regular price, installation 50% off
    [Get Free Quote - 50% Off Install]
```

---

## URL Strategy Summary

```yaml
Service Scope Determines Page Count:

Wet Area Only Service:
  Example: Walk-in Shower
  Pages Created: 2
    - /walk-in-shower/strongsville (base: $1,500 off)
    - /walk-in-shower/strongsville/install-special (variant: 50% install)

Full Remodel Service:
  Example: Bathroom Remodeling
  Pages Created: 2
    - /bathroom-remodeling/strongsville (base: $1,500 AND $3,000 - user chooses)
    - /bathroom-remodeling/strongsville/install-special (variant: 50% install)

Dry Area Only Service (Future):
  Example: Vanity Replacement
  Pages Created: TBD based on future offers
```

---

## Frontend Form Component (Reference)

### Multi-Offer Form Structure

```jsx
// components/OfferSelectionForm.tsx

interface OfferOption {
  offerId: string
  label: string
  value: string
  description: string
  eligibility: string
}

export function OfferSelectionForm({ offerOptions }: { offerOptions: OfferOption[] }) {
  const [selectedOffer, setSelectedOffer] = useState<string | null>(null)

  return (
    <div className="offer-selection">
      <h3>Choose Your Savings</h3>

      {offerOptions.map(offer => (
        <label key={offer.offerId} className="offer-option">
          <input
            type="radio"
            name="offer"
            value={offer.value}
            checked={selectedOffer === offer.value}
            onChange={() => setSelectedOffer(offer.value)}
          />
          <div className="offer-content">
            <strong>{offer.label}</strong>
            <p>{offer.description}</p>
            <small>{offer.eligibility}</small>
          </div>
        </label>
      ))}

      <ContactForm selectedOffer={selectedOffer} />
    </div>
  )
}
```

**Note:** Frontend implementation already exists in standard layout. This reference shows how multi-offer data from AI integrates with form component.

---

## Bulk Upload (Future Feature)

### CSV Format

```csv
client_name,service_slug,location_slug,special_instructions,priority
Baths R Us,walk-in-shower,strongsville,Emphasize accessibility,High
Baths R Us,bathroom-remodeling,strongsville,Target luxury market,High
```

### Import Logic

```yaml
For each CSV row:
  1. Match service_slug to Services table
  2. Match location_slug to Locations table
  3. Create base page
  4. Automation auto-creates offer variants

  Result for walk-in-shower,strongsville:
    - Base page: /walk-in-shower/strongsville
    - Variant page: /walk-in-shower/strongsville/install-special

  Result for bathroom-remodeling,strongsville:
    - Base page: /bathroom-remodeling/strongsville (multi-offer)
    - Variant page: /bathroom-remodeling/strongsville/install-special
```

**Status:** Planned for Phase 2 (Months 2-3)

---

**Architecture Version:** 1.0
**Complexity:** Wet/Dry Area Multi-Offer Support
**Last Updated:** 2025-01-09
**Author:** Winston (Architect)
