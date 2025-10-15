# Airtable Field Mapping Guide

**Purpose:** Document which Airtable fields map to which content.json properties

**Last Updated:** 2025-10-14
**Phase:** Epic 0 Phase 0.4 - Content Enhancement

---

## Overview

The enhanced export script fetches **3 tables** from Airtable:
1. **Pages** (with ALL lookup fields from related tables)
2. **Testimonials** (filtered by client/service/branch)
3. **Branch Staff** (filtered by branch)

The Pages table uses **lookup fields** to pull data from Clients, Services, Locations, Branch Locations, CTAs, Hero Images, Offers, and Campaigns tables.

---

## Pages Table - Required Lookup Fields

### ✅ Currently Available (Already in Airtable)

```yaml
Client Name:          Linked record → Clients table
Service ID:           Linked record → Services table
Location ID:          Linked record → Locations table
Matched Branch:       Linked record → Branch Locations table
URL Slug:             Formula field
Page URL:             Formula field
Service Slug:         Lookup from Service ID
Location Slug:        Lookup from Location ID
Client Domain:        Lookup from Client Name
Status:               Single select
Created Date:         Created time
Last Modified:        Last modified time
```

### 🔴 HIGH PRIORITY - Add These Lookup Fields First

These fields have the **highest impact** for component development and should be added immediately:

```yaml
=== FROM CLIENT (via Client Name link) ===
Primary Color:        Lookup → Client.Primary Color
Secondary Color:      Lookup → Client.Secondary Color
Logo URL:             Lookup → Client.Logo URL
Google Fonts:         Lookup → Client.Google Fonts
GTM Container ID:     Lookup → Client.GTM Container ID
GA Property ID:       Lookup → Client.Google Analytics Property ID
Primary Phone:        Lookup → Client.Primary Phone (fallback if no branch)

=== FROM BRANCH (via Matched Branch link) ===
Branch Name:          Lookup → Branch Locations.Branch Name
Branch Phone:         Lookup → Branch Locations.Phone
Branch Email:         Lookup → Branch Locations.Email
Branch Address:       Lookup → Branch Locations.Full Address
Branch Timezone:      Lookup → Branch Locations.Timezone
Branch Hours:         Lookup → Branch Locations.Hours Summary

=== FROM SERVICE (via Service ID link) ===
Service Name:         Lookup → Services.Service Name
Service Description:  Lookup → Services.Service Description
```

### 🟡 MEDIUM PRIORITY - Add These Next

```yaml
=== FROM CTA (via Selected CTA ID link) ===
Selected CTA ID:      Linked record → CTAs table
CTA Text:             Lookup → CTAs.CTA Text
CTA Action Type:      Lookup → CTAs.CTA Action Type
CTA Action Value:     Lookup → CTAs.Action Value

=== FROM HERO IMAGE (via Selected Hero Image ID link) ===
Selected Hero Image ID: Linked record → Hero Images Library table
Hero Image URL:       Lookup → Hero Images.Cloudinary URL (or Netlify Path)
Hero Image Alt Text:  Lookup → Hero Images.Alt Text Template

=== FROM LOCATION (via Location ID link) ===
City:                 Lookup → Locations.City
State:                Lookup → Locations.State
SEO Keywords:         Lookup → Locations.SEO Keywords (comma-separated)
```

### 🟢 LOW PRIORITY - Add When Offers/Campaigns Launch

```yaml
=== FROM OFFER (via Offer ID link) ===
Offer ID:             Linked record → Offers table (optional)
Offer Name:           Lookup → Offers.Offer Name
Offer Type:           Lookup → Offers.Offer Type
Discount Value:       Lookup → Offers.Discount Value
Offer Description:    Lookup → Offers.Offer Description
Fine Print:           Lookup → Offers.Fine Print
Start Date:           Lookup → Offers.Start Date
End Date:             Lookup → Offers.End Date

=== FROM CAMPAIGN (via Campaign link) ===
Campaign:             Linked record → Campaigns table (optional)
UTM Campaign:         Lookup → Campaigns.UTM Campaign
UTM Source:           Lookup → Campaigns.UTM Source
UTM Medium:           Lookup → Campaigns.UTM Medium
```

---

## Pages Table - AI-Generated Content Fields

These fields will be **populated by Claude** via AI generation automation:

### Direct Text Fields (AI-written)

```yaml
SEO Title:            Single line text (AI-generated)
SEO Description:      Long text (AI-generated)
H1 Headline:          Single line text (AI-generated)
Hero Subheadline:     Long text (AI-generated)

Trust Bar 1:          Single line text (AI-generated) - e.g., "Licensed OH #123456"
Trust Bar 2:          Single line text (AI-generated) - e.g., "15+ Years Experience"
Trust Bar 3:          Single line text (AI-generated) - e.g., "⭐ 4.9/5 Rating"
Trust Bar 4:          Single line text (AI-generated) - e.g., "500+ Projects"
Trust Bar 5:          Single line text (AI-generated) - e.g., "$2M Insured"
```

### JSON Fields (AI-generated structures)

```yaml
FAQs:                 Long text (JSON array)
  Format: [
    {"question": "How long does a bathroom remodel take?", "answer": "Most projects..."},
    {"question": "Do you handle permits?", "answer": "Yes, we manage..."}
  ]

Benefits:             Long text (JSON array)
  Format: [
    {"title": "Licensed & Insured", "description": "Full licensing...", "icon": "shield"},
    {"title": "Fast Turnaround", "description": "Most projects...", "icon": "clock"}
  ]

Process Steps:        Long text (JSON array)
  Format: [
    {"stepNumber": 1, "title": "Free Consultation", "description": "We meet...", "timeline": "Day 1"},
    {"stepNumber": 2, "title": "Design & Quote", "description": "Get detailed...", "timeline": "Days 2-3"}
  ]
```

---

## Testimonials Table - Required Fields

```yaml
Testimonial ID:       Auto-number [Primary Key]
Client Name:          Linked record → Clients table *Required
Active:               Checkbox *Default: TRUE
Featured:             Checkbox

Customer Name:        Single line text *Required
Customer City:        Single line text
Customer State:       Single select (OH, NC, FL, etc.)

Rating:               Single select (1, 2, 3, 4, 5) *Required
Review Title:         Single line text
Review Text:          Long text *Required
Review Date:          Date *Required

Source:               Single select (Google, Yelp, Facebook, Direct)
Service ID:           Linked record → Services table (optional filter)
Branch ID:            Linked record → Branch Locations table (optional filter)

Created Date:         Created time
```

**Filter Logic:**
- Export script fetches: `Active = TRUE()`
- Per-page filtering:
  - Must have `Rating >= 4`
  - If testimonial has `Service ID`, must match page's service
  - If testimonial has `Branch ID`, must match page's branch
  - Top 5 testimonials per page

---

## Branch Staff Table - Required Fields

```yaml
Staff ID:             Auto-number [Primary Key]
Full Name:            Single line text *Required
Branch ID:            Linked record → Branch Locations table *Required
Active:               Checkbox *Default: TRUE

Job Title:            Single line text *Required (e.g., "Lead Project Manager")
Role Type:            Single select (Sales, Project Manager, Installer, etc.)
Primary Contact:      Checkbox (main contact for branch)

Years of Experience:  Number
Certifications:       Long text (comma-separated)
Specialties:          Multiple select (Bathroom, Kitchen, Basement, etc.)

Photo URL:            URL
Bio:                  Long text (2-3 sentences)
Quote:                Long text (optional)

Email:                Email
Phone Extension:      Single line text

Featured:             Checkbox
Display Order:        Number

Created Date:         Created time
```

**Filter Logic:**
- Export script fetches: `Active = TRUE()`
- Attached to pages by matching `Branch ID` to page's `Matched Branch`

---

## How to Add Lookup Fields in Airtable

### Step-by-Step Instructions

1. **Open Pages Table** in Airtable

2. **Click "+" to add a new field**

3. **Select "Lookup" field type**

4. **Choose the linked record field** (e.g., "Client Name")

5. **Select the field to lookup** (e.g., "Primary Color")

6. **Name the field** exactly as shown in this guide (e.g., "Primary Color")

7. **Repeat for all lookup fields**

### Example: Adding "Primary Color" Lookup

```
1. Click "+" in Pages table
2. Select "Lookup" field type
3. Link: Client Name
4. Field: Primary Color
5. Name: Primary Color
6. Click "Create field"
```

The lookup will automatically populate for all pages with a linked Client!

---

## Field Mapping Summary Table

| Content.json Path | Airtable Field | Table | Type | Priority |
|-------------------|----------------|-------|------|----------|
| `branding.primaryColor` | Primary Color | Client (lookup) | Lookup | 🔴 HIGH |
| `branding.secondaryColor` | Secondary Color | Client (lookup) | Lookup | 🔴 HIGH |
| `branding.logoUrl` | Logo URL | Client (lookup) | Lookup | 🔴 HIGH |
| `branding.googleFonts` | Google Fonts | Client (lookup) | Lookup | 🔴 HIGH |
| `branch.name` | Branch Name | Branch (lookup) | Lookup | 🔴 HIGH |
| `branch.phone` | Branch Phone | Branch (lookup) | Lookup | 🔴 HIGH |
| `branch.email` | Branch Email | Branch (lookup) | Lookup | 🔴 HIGH |
| `branch.address` | Branch Address | Branch (lookup) | Lookup | 🔴 HIGH |
| `branch.timezone` | Branch Timezone | Branch (lookup) | Lookup | 🔴 HIGH |
| `branch.hours` | Branch Hours | Branch (lookup) | Lookup | 🔴 HIGH |
| `content.serviceDescription` | Service Description | Service (lookup) | Lookup | 🔴 HIGH |
| `hero.h1Headline` | H1 Headline | Pages | Direct | AI |
| `hero.subheadline` | Hero Subheadline | Pages | Direct | AI |
| `hero.primaryCta.text` | CTA Text | CTA (lookup) | Lookup | 🟡 MED |
| `hero.primaryCta.actionType` | CTA Action Type | CTA (lookup) | Lookup | 🟡 MED |
| `hero.primaryCta.actionValue` | CTA Action Value | CTA (lookup) | Lookup | 🟡 MED |
| `hero.imageUrl` | Hero Image URL | Hero Image (lookup) | Lookup | 🟡 MED |
| `hero.imageAlt` | Hero Image Alt Text | Hero Image (lookup) | Lookup | 🟡 MED |
| `seo.title` | SEO Title | Pages | Direct | AI |
| `seo.description` | SEO Description | Pages | Direct | AI |
| `seo.keywords` | SEO Keywords | Location (lookup) | Lookup | 🟡 MED |
| `trustBar.signals[0-4]` | Trust Bar 1-5 | Pages | Direct | AI |
| `content.faqs` | FAQs | Pages | JSON | AI |
| `content.benefits` | Benefits | Pages | JSON | AI |
| `content.processSteps` | Process Steps | Pages | JSON | AI |
| `tracking.gtmId` | GTM Container ID | Client (lookup) | Lookup | 🔴 HIGH |
| `tracking.gaPropertyId` | GA Property ID | Client (lookup) | Lookup | 🔴 HIGH |
| `offer.*` | Offer Name, Type, etc. | Offer (lookup) | Lookup | 🟢 LOW |
| `tracking.utmCampaign` | UTM Campaign | Campaign (lookup) | Lookup | 🟢 LOW |

---

## Testing the Export

After adding lookup fields, test the export:

```bash
npm run export-airtable
```

**Check content.json for:**
- ✅ Branding colors populated (not default "#0ea5e9")
- ✅ Branch phone/email/address populated (not empty strings)
- ✅ Service description populated
- ✅ Hero headline/subheadline (if AI-generated)
- ✅ Trust bar signals (if AI-generated)

---

## Troubleshooting

### Problem: Lookup field shows as empty

**Possible causes:**
1. Linked record not selected (Client Name, Service ID, etc.)
2. Source table field is empty (Client has no Primary Color)
3. Field name mismatch (check exact spelling/capitalization)

**Solution:**
- Verify linked record is selected
- Populate source table fields
- Check field naming exactly matches this guide

### Problem: Service Slug / Location Slug show as arrays

**Status:** ✅ FIXED in export script (handles both arrays and strings)

The script automatically handles whether these are lookup fields (strings) or linked records (arrays).

---

## Next Steps

1. **Add HIGH PRIORITY lookup fields** (Client branding, Branch contact, Service description)
2. **Run export and validate** output in content.json
3. **Add MEDIUM PRIORITY fields** (CTAs, Hero Images, Location keywords)
4. **Set up AI automation** to populate AI-generated fields
5. **Add Offers/Campaigns** when ready for promotions

---

**Questions?** Check the export script: `scripts/export-airtable-to-json.ts` (lines 288-412 show exact field mapping)
