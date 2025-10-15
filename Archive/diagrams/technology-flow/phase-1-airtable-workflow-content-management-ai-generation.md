# Phase 1: Airtable Workflow (Content Management & AI Generation)

**Location:** Airtable + Netlify Functions (serverless)
**Trigger:** Marketing creates/updates pages in Airtable
**Frequency:** On-demand (Marketing-driven)

## Step 1: Marketing Creates Draft Page

```
┌─────────────────────────────────────────────────────────┐
│  AIRTABLE BASE: Landing Pages Content Management        │
│  Base ID: appATvatPtaoJ8MmS                              │
│                                                          │
│  Tables (12 total):                                      │
│  FOUNDATION TABLES:                                      │
│  - Clients (client config, branding, tracking IDs)      │
│  - Services (service definitions with keywords)          │
│  - Locations (validated city master data)               │
│  - Branch Locations (physical offices)                  │
│  - Service Areas (branch-to-city mappings)              │
│  - Branch Staff (team profiles)                         │
│                                                          │
│  CONTENT TABLES:                                         │
│  - Pages (landing page workflow & AI-generated content) │
│  - CTAs (call-to-action library for AI selection)       │
│  - Hero Images Library (image assets)                   │
│  - Testimonials (customer reviews)                      │
│                                                          │
│  MARKETING TABLES:                                       │
│  - Offers (promotional campaigns)                       │
│  - Campaigns (marketing campaign tracking)              │
│                                                          │
│  Schema Status: LOCKED (Phase 1 complete)               │
└─────────────────────────────────────────────────────────┘
                        ↓
              [Marketing Manager: Creates New Page]
                        ↓
┌─────────────────────────────────────────────────────────┐
│  NEW RECORD IN PAGES TABLE                               │
│                                                          │
│  Manual Input:                                           │
│  - Service: bathroom-remodeling                          │
│  - Location: strongsville                                │
│  - Client Name: Baths R Us (linked)                     │
│  - Status: Draft                                         │
│  - Special Instructions: "Emphasize urgency"            │
│                                                          │
│  Auto-Populated (Airtable Automation):                   │
│  - Matched Branch: Medina Office (lookup)               │
│  - Branch City: Medina (lookup)                         │
│  - Branch Phone: (330) 555-1234 (lookup)                │
│  - Page URL: /bathroom-remodeling/strongsville (formula)│
└─────────────────────────────────────────────────────────┘
                        ↓
        [Marketing Reviews, Changes Status → "AI Processing"]
```

**Technologies:**
- Airtable (12-table schema)
- Airtable Automations (branch matching)
- Airtable Formulas (URL generation)

**Performance:**
- Duration: 30 seconds (manual input)
- Auto-matching: <1 second

---

## Step 2: AI Generation (Netlify Functions - Serverless)

```
┌─────────────────────────────────────────────────────────┐
│  AIRTABLE AUTOMATION: Trigger AI Generation             │
│                                                          │
│  Trigger: Status = "AI Processing"                      │
│  Action: Send webhook POST to Netlify Function          │
│                                                          │
│  Webhook URL:                                            │
│  https://ai-service.netlify.app/.netlify/functions/      │
│    generate-ai-content                                   │
│                                                          │
│  Payload: { "pageId": "recXXXXXXXXX" }                  │
└─────────────────────────────────────────────────────────┘
                        ↓
              [Netlify Function: generate-ai-content.js]
                        ↓
           Cold Start: 3-10s (first request)
           Warm: <500ms (subsequent requests)
                        ↓
        ┌───────────────────────────────────┐
        │ STEP 1: Fetch Page Data           │
        │ - Read page record from Airtable   │
        │ - Lookup branch metadata           │
        │ - Fetch available CTAs (guardrails)│
        │ - Fetch hero images (guardrails)   │
        └───────────────────────────────────┘
                        ↓
        ┌───────────────────────────────────┐
        │ STEP 2: Parallel AI Generation     │
        │ (4 simultaneous Claude API calls)  │
        └───────────────────────────────────┘
                        ↓
        ┌───────────────┴───────────────┬─────────────────┐
        ↓                               ↓                 ↓
   ┌────────────────────┐   ┌────────────────────┐   ┌────────────────────┐
   │ Hero Content       │   │ Trust Bars         │   │ FAQs               │
   │ (Claude API)       │   │ (Claude API)       │   │ (Claude API)       │
   │                    │   │                    │   │                    │
   │ Model:             │   │ Model:             │   │ Model:             │
   │ claude-sonnet-     │   │ claude-sonnet-     │   │ claude-sonnet-     │
   │ 4-5-20250929       │   │ 4-5-20250929       │   │ 4-5-20250929       │
   │                    │   │                    │   │                    │
   │ Output:            │   │ Output:            │   │ Output:            │
   │ - SEO title/desc   │   │ - 5 trust signals  │   │ - 6 Q&A pairs      │
   │ - H1 headline      │   │                    │   │                    │
   │ - Hero subheadline │   │                    │   │                    │
   │ - CTA selection    │   │                    │   │                    │
   │ - Image selection  │   │                    │   │                    │
   └────────────────────┘   └────────────────────┘   └────────────────────┘
        │                               │                 │
        │                               │                 │
   ┌────────────────────┐                                 │
   │ Gallery Captions   │                                 │
   │ (Claude API)       │                                 │
   │                    │                                 │
   │ Model:             │                                 │
   │ claude-sonnet-     │                                 │
   │ 4-5-20250929       │                                 │
   │                    │                                 │
   │ Output:            │                                 │
   │ - 8 captions       │                                 │
   └────────────────────┘                                 │
        │                               │                 │
        └───────────────┬───────────────┴─────────────────┘
                        ↓
        ┌───────────────────────────────────┐
        │ STEP 3: Write Back to Airtable    │
        │ - Update all AI-generated fields   │
        │ - Save SEO title, H1, subheadline  │
        │ - Link selected CTA & hero image   │
        │ - Save trust bars (5 fields)      │
        │ - Save FAQs (JSON)                 │
        │ - Save gallery captions (JSON)     │
        │ - Update Status → "Ready for Review"│
        └───────────────────────────────────┘
```

**Technologies:**
- Netlify Functions (serverless)
- Anthropic SDK ^0.65.0
- Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`)
- Airtable SDK ^0.12.2
- Environment Variables: `ANTHROPIC_API_KEY`, `AIRTABLE_API_KEY`, `AIRTABLE_BASE_ID`

**Performance:**
- Cold start: 3-10 seconds
- AI generation: 15-30 seconds (parallel calls)
- Total: 18-40 seconds
- Cost: $0.008-0.010 per page

**Error Handling:**
- Retry failed API calls (3 attempts with exponential backoff)
- Update Airtable Status → "AI Failed" on error
- Log errors to Netlify Function logs

---

## Step 3: Marketing Review & Approval

```
┌─────────────────────────────────────────────────────────┐
│  AIRTABLE VIEW: "Ready for Review"                       │
│                                                          │
│  Marketing Manager sees AI-generated content:            │
│  - SEO Title: "Bathroom Remodeling Strongsville OH..."  │
│  - H1 Headline: "Transform Your Strongsville Bathroom..." │
│  - Hero Subheadline: "Licensed, insured, trusted..."    │
│  - Selected CTA: "Get Free Quote"                       │
│  - Selected Hero Image: bathroom-strongsville-01.jpg    │
│  - Trust Bars (5): "Licensed & Insured...", etc.        │
│  - FAQs (6 Q&A pairs)                                    │
│  - Gallery Captions (8)                                  │
│                                                          │
│  Actions:                                                │
│  1. Review content quality                               │
│  2. OPTIONAL: Edit any AI-generated field               │
│  3. Approve: Change Status → "Approved"                 │
└─────────────────────────────────────────────────────────┘
                        ↓
        [Status → "Approved" triggers export workflow]
```

**Technologies:**
- Airtable Views (filtered by Status)
- Airtable Automations (approval trigger)

**Performance:**
- Duration: 1-5 minutes (human review, variable)

---
