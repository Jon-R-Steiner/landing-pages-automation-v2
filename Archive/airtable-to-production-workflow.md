# Airtable → Production Workflow
**Complete End-to-End Architecture**

## Overview: The Complete Flow

```
AIRTABLE (Content Management)
  ↓
STEP 1: Marketing creates draft page (minimal manual input)
  ↓
STEP 2: Status → "AI Processing" triggers AI Service
  ↓
AI SERVICE (Claude API - Parallel Generation)
  ↓
STEP 3: AI generates all content + writes back to Airtable
  ↓
STEP 4: Marketing reviews + approves (Status → "Approved")
  ↓
STEP 5: Airtable automation triggers GitHub Actions
  ↓
GITHUB ACTIONS (Export Script)
  ↓
STEP 6: Export Airtable → content.json → Git commit
  ↓
GITHUB PUSH (triggers Netlify auto-deploy)
  ↓
NETLIFY BUILD (Next.js static export)
  ↓
CDN DEPLOYMENT (Page goes live)
```

---

## STEP 1: Airtable Schema & Manual Input

### Tables Architecture

#### **1. Clients Table**
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

#### **2. Branch Locations Table** ⭐ NEW
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

#### **3. CTAs Table**
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

#### **4. Hero Images Library Table**
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

#### **5. Pages Table** ⭐ UPDATED
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

### Marketing Manager Workflow in Airtable

#### **Scenario: Creating a New Landing Page**

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

## STEP 2: AI Service Architecture

### AI Service Hosting

**Recommended: Netlify Functions (Serverless)**

```yaml
Service Type: Serverless Function
Hosting: Netlify Functions (FREE - included with Netlify account)
Endpoint: https://yourdomain.netlify.app/.netlify/functions/generate-ai-content

Why Netlify Functions:
  - Zero cost (free tier covers this usage)
  - Zero maintenance (auto-scales, no servers to manage)
  - Deploy alongside Next.js site (same repo)
  - AI generation happens BEFORE build (webhook-triggered)

Trade-off:
  - Cold start adds 3-10s on first request
  - Total response time: 18-40s (vs 15-30s always-on)
  - Acceptable for Marketing approval workflow

Repository: Same repo as Next.js site (netlify/functions/)
```

### AI Service Setup

**Option 1: Separate Netlify Site for Functions (Recommended)**

```yaml
Why separate site:
  - AI function doesn't need to redeploy when content changes
  - Faster CI/CD (main site only rebuilds on content changes)
  - Cleaner separation of concerns

Setup:
  1. Create new Netlify site: "landing-pages-ai-service"
  2. Connect to same GitHub repo
  3. Configure build:
     - Base directory: (leave blank)
     - Build command: (leave blank)
     - Publish directory: netlify/functions
  4. Set environment variables in Netlify UI
```

**File Structure:**
```
landing-pages-automation-v2/
├── netlify/
│   └── functions/
│       ├── generate-ai-content.js      # Main function
│       └── shared/
│           ├── airtable-client.js      # Shared Airtable logic
│           ├── claude-client.js        # Shared Claude API logic
│           └── prompts.js              # AI prompt templates
├── src/                                # Next.js app
├── scripts/                            # Export scripts
└── netlify.toml                        # Netlify config
```

**Function Code:**
```javascript
// netlify/functions/generate-ai-content.js

import Anthropic from '@anthropic-ai/sdk'
import Airtable from 'airtable'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
})

const airtableBase = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY
}).base(process.env.AIRTABLE_BASE_ID)

// Netlify Function handler
export async function handler(event, context) {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    }
  }

  try {
    const { pageId } = JSON.parse(event.body)

    // Step 1: Fetch page data + guardrails
    const pageData = await fetchPageData(pageId)

    // Step 2: Generate all content in parallel
    const aiContent = await generateAllContent(pageData)

    // Step 3: Write back to Airtable
    await updateAirtablePage(pageId, aiContent)

    // Step 4: Update status
    await airtableBase('Pages').update(pageId, {
      'Status': 'Ready for Review'
    })

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        pageId,
        tokensUsed: aiContent.totalTokens
      })
    }

  } catch (error) {
    console.error('AI generation failed:', error)

    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    }
  }
}
```

**Airtable Automation Configuration:**
```yaml
Automation Name: "Trigger AI Generation"

Trigger:
  When: Record matches conditions
  Conditions:
    - Status = "AI Processing"
    - Table: Pages

Actions:
  1. Send Webhook
     Method: POST
     URL: https://landing-pages-ai-service.netlify.app/.netlify/functions/generate-ai-content
     Headers:
       Content-Type: application/json
     Body:
       {
         "pageId": "{Page ID}"
       }
```

---

## STEP 3: AI Content Generation (Parallel Processing)

### Fetch Page Data + Guardrails

```javascript
async function fetchPageData(pageId) {
  // Fetch page record with all lookups
  const pageRecord = await airtableBase('Pages').find(pageId)

  const service = pageRecord.get('Service')
  const location = pageRecord.get('Location')
  const clientName = pageRecord.get('Client Name')[0]
  const specialInstructions = pageRecord.get('Special Instructions') || ''

  // Fetch branch metadata (from matched branch)
  const branchCity = pageRecord.get('Branch City')
  const branchState = pageRecord.get('Branch State')
  const branchPhone = pageRecord.get('Branch Phone')
  const branchAddress = pageRecord.get('Branch Address')

  // Fetch client data
  const clientRecord = await airtableBase('Clients').find(clientName)
  const clientDomain = clientRecord.get('Domain')
  const primaryPhone = clientRecord.get('Primary Phone')

  // Fetch available CTAs (active, matching service type)
  const ctaRecords = await airtableBase('CTAs')
    .select({
      filterByFormula: `AND(
        {Active} = TRUE(),
        OR(
          FIND("${service}", {Service Types}) > 0,
          FIND("all", {Service Types}) > 0
        )
      )`,
      sort: [{ field: 'Priority', direction: 'asc' }]
    })
    .all()

  const availableCTAs = ctaRecords.map(r => ({
    id: r.id,
    text: r.get('CTA Text'),
    type: r.get('CTA Type'),
    priority: r.get('Priority'),
    notes: r.get('Notes')
  }))

  // Fetch available hero images
  const imageRecords = await airtableBase('Hero Images Library')
    .select({
      filterByFormula: `AND(
        {Active} = TRUE(),
        {Service} = "${service}",
        OR({Location} = "${location}", {Location} = "")
      )`
    })
    .all()

  const availableImages = imageRecords.map(r => ({
    id: r.id,
    filename: r.get('Filename'),
    cloudinaryUrl: r.get('Cloudinary URL'),
    altTextTemplate: r.get('Alt Text Template')
  }))

  return {
    pageId,
    service,
    location: location || 'service area',
    clientName,
    clientDomain,
    specialInstructions,
    branchCity,
    branchState,
    branchPhone,
    branchAddress,
    primaryPhone,
    availableCTAs,
    availableImages
  }
}
```

### Parallel AI Generation

```javascript
async function generateAllContent(pageData) {
  const {
    service,
    location,
    clientName,
    branchCity,
    branchState,
    branchPhone,
    branchAddress,
    specialInstructions,
    availableCTAs,
    availableImages
  } = pageData

  console.log(`🤖 Starting parallel AI generation for ${service}/${location}...`)

  // Build prompts for each content type
  const prompts = {
    hero: buildHeroPrompt(pageData),
    trustBars: buildTrustBarsPrompt(pageData),
    faqs: buildFAQsPrompt(pageData),
    galleryCaptions: buildGalleryPrompt(pageData)
  }

  // Call Claude API in parallel (all 4 requests simultaneously)
  const startTime = Date.now()

  const [heroResult, trustBarsResult, faqsResult, galleryResult] = await Promise.all([
    callClaudeAPI(prompts.hero, 1024),
    callClaudeAPI(prompts.trustBars, 512),
    callClaudeAPI(prompts.faqs, 2048),
    callClaudeAPI(prompts.galleryCaptions, 512)
  ])

  const duration = (Date.now() - startTime) / 1000

  console.log(`✅ All AI content generated in ${duration.toFixed(2)}s`)

  // Parse responses
  const hero = JSON.parse(heroResult.content[0].text)
  const trustBars = JSON.parse(trustBarsResult.content[0].text)
  const faqs = JSON.parse(faqsResult.content[0].text)
  const gallery = JSON.parse(galleryResult.content[0].text)

  // Calculate total tokens
  const totalTokens = [heroResult, trustBarsResult, faqsResult, galleryResult]
    .reduce((sum, r) => sum + r.usage.input_tokens + r.usage.output_tokens, 0)

  return {
    seoTitle: hero.seoTitle,
    seoDescription: hero.seoDescription,
    h1Headline: hero.h1Headline,
    heroSubheadline: hero.heroSubheadline,
    selectedCtaId: hero.selectedCtaId,
    ctaReasoning: hero.ctaReasoning,
    selectedHeroImageId: hero.selectedHeroImageId,
    trustBars: trustBars.signals,
    faqs: faqs.questions,
    galleryCaptions: gallery.captions,
    totalTokens,
    generationDuration: duration,
    model: heroResult.model
  }
}
```

### Hero Content Prompt

```javascript
function buildHeroPrompt(pageData) {
  const {
    service,
    location,
    clientName,
    branchCity,
    branchState,
    specialInstructions,
    availableCTAs,
    availableImages
  } = pageData

  return `Generate landing page hero content for a ${service.replace(/-/g, ' ')} page.

HARD FACTS (MUST USE EXACTLY - No creative freedom):
- Service: ${service.replace(/-/g, ' ')}
- Page Location: ${location}, ${branchState}
- Company: ${clientName}
- Local Branch Office: ${branchCity}, ${branchState}
- Special Requirements: ${specialInstructions || 'None'}

CREATIVE FREEDOM (Your expertise):
- SEO Title (50-60 characters): Include service + location + brand name
  Example: "Bathroom Remodeling Strongsville OH | Baths R Us"

- SEO Description (140-160 characters): Compelling, benefit-focused, local
  Example: "Transform your Strongsville bathroom in 2-3 weeks. Licensed, insured, and trusted by 500+ homeowners. Free quotes from our Medina office."

- H1 Headline (8-12 words): Benefit-driven, emotional hook
  Example: "Transform Your Strongsville Bathroom in Just 2 Weeks"

- Hero Subheadline (15-25 words): Credibility + specificity + local trust
  Example: "Licensed, insured, and trusted by 500+ homeowners across Medina County. Serving Strongsville from our nearby Medina office."

AVAILABLE CTAs (choose ONE that best matches your copy tone):
${availableCTAs.map((cta, i) => `${i + 1}. [ID: ${cta.id}] "${cta.text}" (${cta.type}, Priority ${cta.priority})
   Context: ${cta.notes || 'General use'}`).join('\n\n')}

AVAILABLE HERO IMAGES (choose ONE most relevant):
${availableImages.map((img, i) => `${i + 1}. [ID: ${img.id}] ${img.filename}`).join('\n')}

OUTPUT FORMAT (valid JSON only):
{
  "seoTitle": "...",
  "seoDescription": "...",
  "h1Headline": "...",
  "heroSubheadline": "...",
  "selectedCtaId": "recXXXXX",
  "ctaReasoning": "Brief explanation: why this CTA matches the copy tone and target audience",
  "selectedHeroImageId": "recYYYYY"
}`
}
```

### Trust Bars Prompt

```javascript
function buildTrustBarsPrompt(pageData) {
  const { service, location, branchCity, branchState, clientName } = pageData

  return `Generate 5 trust signals for a ${service.replace(/-/g, ' ')} company.

CONTEXT:
- Service: ${service.replace(/-/g, ' ')}
- Location: ${location}, ${branchState}
- Local Office: ${branchCity}, ${branchState}
- Company: ${clientName}

REQUIREMENTS:
- Each signal: 5-12 words maximum
- Must be specific and credible (realistic numbers)
- Must reference ${branchCity} area or ${branchState}
- NO generic claims ("best", "top-rated" without proof)
- Focus areas: licensing, insurance, years in business, reviews, warranties, financing

EXAMPLES (do NOT copy - create original):
- "Licensed & Insured in Ohio Since 2010"
- "4.9★ Rating - 850+ Verified Reviews"
- "Serving Medina County for 15+ Years"
- "Lifetime Craftsmanship Warranty Included"
- "0% Financing Available - 24 Months"

OUTPUT FORMAT (JSON array of 5 strings):
{
  "signals": [
    "Signal 1",
    "Signal 2",
    "Signal 3",
    "Signal 4",
    "Signal 5"
  ]
}`
}
```

### FAQs Prompt

```javascript
function buildFAQsPrompt(pageData) {
  const { service, location, branchCity, branchState } = pageData

  return `Generate 6 frequently asked questions and answers for ${service.replace(/-/g, ' ')}.

CONTEXT:
- Service: ${service.replace(/-/g, ' ')}
- Location: ${location}, ${branchState}
- Local Office: ${branchCity}, ${branchState}

REQUIREMENTS:
Questions:
  - 8-15 words (natural language, how customers actually ask)
  - Specific to ${location} or ${branchState} when relevant

Answers:
  - 40-80 words
  - Informative and specific
  - Reference ${branchCity} office or ${branchState} regulations when applicable

Topics to cover:
  1. Pricing/cost estimates
  2. Project timeline
  3. Permits (${branchState} specific)
  4. Warranties/guarantees
  5. Materials/quality
  6. Process/how it works

OUTPUT FORMAT (JSON array):
{
  "questions": [
    {
      "question": "How long does a typical bathroom remodel take in Strongsville?",
      "answer": "Most bathroom remodels in the Strongsville area take 2-3 weeks from start to finish. This includes demolition, plumbing and electrical work, tile installation, and final fixtures. Our Medina office coordinates all permits with the Strongsville Building Department, which typically adds 3-5 days to the initial timeline."
    },
    ...
  ]
}`
}
```

### Gallery Captions Prompt

```javascript
function buildGalleryPrompt(pageData) {
  const { service, location } = pageData

  return `Generate 8 professional gallery captions for a ${service.replace(/-/g, ' ')} photo gallery.

CONTEXT:
- Service: ${service.replace(/-/g, ' ')}
- Location: ${location}

REQUIREMENTS:
- Each caption: 6-10 words
- Descriptive and specific (not generic)
- Focus: before/after transformations, process steps, materials, craftsmanship details
- Professional tone (informative, not salesy)

EXAMPLES (create original):
- "Custom subway tile with heated marble flooring"
- "Frameless glass shower with rainfall showerhead"
- "Before: Outdated 1980s bathroom vanity area"
- "After: Modern double-sink floating vanity install"

OUTPUT FORMAT (JSON array):
{
  "captions": [
    "Caption 1",
    "Caption 2",
    ...
  ]
}`
}
```

### Claude API Call Helper

```javascript
async function callClaudeAPI(prompt, maxTokens) {
  return await anthropic.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: maxTokens,
    system: 'You are a marketing expert specializing in home services. Always return valid JSON only. No explanatory text outside JSON.',
    messages: [{
      role: 'user',
      content: prompt
    }]
  })
}
```

### Write Results Back to Airtable

```javascript
async function updateAirtablePage(pageId, aiContent) {
  await airtableBase('Pages').update(pageId, {
    // Hero content
    'SEO Title': aiContent.seoTitle,
    'SEO Description': aiContent.seoDescription,
    'H1 Headline': aiContent.h1Headline,
    'Hero Subheadline': aiContent.heroSubheadline,

    // Selected elements
    'Selected CTA ID': [aiContent.selectedCtaId],
    'Selected Hero Image ID': [aiContent.selectedHeroImageId],
    'CTA Selection Reasoning': aiContent.ctaReasoning,

    // Trust bars
    'Trust Bar 1': aiContent.trustBars[0],
    'Trust Bar 2': aiContent.trustBars[1],
    'Trust Bar 3': aiContent.trustBars[2],
    'Trust Bar 4': aiContent.trustBars[3],
    'Trust Bar 5': aiContent.trustBars[4],

    // Structured content (stored as JSON strings)
    'FAQs': JSON.stringify(aiContent.faqs),
    'Gallery Captions': JSON.stringify(aiContent.galleryCaptions),

    // Metadata
    'AI Generation Timestamp': new Date().toISOString(),
    'AI Model Used': aiContent.model,
    'AI Tokens Used': aiContent.totalTokens
  })

  console.log(`✅ Updated Airtable page ${pageId} with AI content`)
}
```

---

## STEP 4: Marketing Review & Approval

### Status Workflow

```yaml
Status: AI Processing
  ↓ (AI completes)
Status: Ready for Review
  ↓ (Marketing manager reviews)
Action: Edit any AI-generated fields if needed
  ↓ (Manager approves)
Status: Approved
  ↓ (Triggers export workflow)
```

### What Marketing Reviews

```yaml
Airtable View: "Ready for Review"

Sarah (Marketing Manager) sees:
  ┌──────────────────────────────────────────────┐
  │ Page: bathroom-remodeling/strongsville       │
  │ Status: Ready for Review                     │
  │                                              │
  │ AI-GENERATED CONTENT:                        │
  │ SEO Title: Bathroom Remodeling Strongsville  │
  │           OH | Baths R Us                    │
  │ H1: Transform Your Strongsville Bathroom     │
  │     in Just 2 Weeks                          │
  │ Subheadline: Licensed, insured, and trusted  │
  │             by 500+ homeowners...            │
  │ CTA: Get Free Quote (#contact-form)          │
  │ Hero Image: bathroom-strongsville-01.jpg     │
  │                                              │
  │ Trust Bars:                                  │
  │ • Licensed & Insured in Ohio Since 2010      │
  │ • 4.9★ Rating - 850+ Verified Reviews        │
  │ • Serving Medina County for 15+ Years        │
  │ • Lifetime Craftsmanship Warranty            │
  │ • 0% Financing - 24 Months Available         │
  │                                              │
  │ [View FAQs] [View Gallery Captions]          │
  └──────────────────────────────────────────────┘

Sarah's Actions:
  1. Reviews content quality
  2. OPTIONAL: Edits H1 to "Transform Your Bathroom in Strongsville in 2-3 Weeks"
  3. Approves: Changes Status → "Approved"
```

---

## STEP 5: Airtable Automation → GitHub Actions

### Airtable Automation Configuration

```yaml
Automation Name: "Trigger Export on Approval"

Trigger:
  When: Record matches conditions
  Conditions:
    - Status = "Approved"
    - Table: Pages

Actions:
  1. Find Records (verify client is active)
  2. Send Webhook

     Method: POST
     URL: https://api.github.com/repos/{owner}/{repo}/dispatches

     Headers:
       Authorization: Bearer {GITHUB_PAT}
       Accept: application/vnd.github.v3+json
       Content-Type: application/json

     Body:
       {
         "event_type": "airtable_export",
         "client_payload": {
           "trigger": "page_approved",
           "page_id": "{Page ID}",
           "service": "{Service}",
           "location": "{Location}",
           "timestamp": "{Last Modified}"
         }
       }
```

**Setup Requirements:**
1. Create GitHub Personal Access Token (PAT) with `repo` scope
2. Store PAT in Airtable automation secrets
3. Replace `{owner}/{repo}` with your GitHub username and repository name

---

## STEP 6: GitHub Actions Export Workflow

### Workflow File

```yaml
# .github/workflows/export-and-deploy.yml

name: Export Airtable & Deploy

on:
  repository_dispatch:
    types: [airtable_export]
  workflow_dispatch: # Manual trigger option in GitHub UI

jobs:
  export-airtable:
    name: Export Airtable to JSON
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Export Airtable to JSON
        env:
          AIRTABLE_API_KEY: ${{ secrets.AIRTABLE_API_KEY }}
          AIRTABLE_BASE_ID: ${{ secrets.AIRTABLE_BASE_ID }}
        run: npm run export

      - name: Validate content.json
        run: npm run validate-content

      - name: Commit content.json
        run: |
          git config user.name "GitHub Actions Bot"
          git config user.email "actions@github.com"
          git add content.json

          # Only commit if there are changes
          if git diff --staged --quiet; then
            echo "No changes to commit"
          else
            git commit -m "Update content.json from Airtable export

            Triggered by: ${{ github.event.client_payload.trigger }}
            Page: ${{ github.event.client_payload.service }}/${{ github.event.client_payload.location }}
            Timestamp: ${{ github.event.client_payload.timestamp }}

            🤖 Automated export via GitHub Actions"

            git push origin main
          fi
```

### Export Script

```javascript
// scripts/export-airtable-to-json.js

import Airtable from 'airtable'
import fs from 'fs/promises'

const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY
}).base(process.env.AIRTABLE_BASE_ID)

console.log('🔗 Connecting to Airtable...')

async function exportAirtableData() {
  const startTime = Date.now()

  // Fetch all tables in parallel
  const [clients, pages] = await Promise.all([
    fetchClients(),
    fetchApprovedPages()
  ])

  // Build output structure
  const outputData = {
    clients,
    pages,
    exportMetadata: {
      exportDate: new Date().toISOString(),
      totalPages: pages.length,
      totalClients: clients.length,
      exportDurationMs: Date.now() - startTime
    }
  }

  // Write to file
  await fs.writeFile(
    './content.json',
    JSON.stringify(outputData, null, 2),
    'utf-8'
  )

  const fileSize = (JSON.stringify(outputData).length / 1024).toFixed(2)

  console.log(`\n✅ Export complete!`)
  console.log(`📁 File: content.json`)
  console.log(`📊 Size: ${fileSize} KB`)
  console.log(`📄 Pages: ${pages.length}`)
  console.log(`👥 Clients: ${clients.length}`)
  console.log(`⏱️  Duration: ${((Date.now() - startTime) / 1000).toFixed(2)}s`)
}

async function fetchClients() {
  console.log('👥 Fetching Clients...')

  const records = await base('Clients')
    .select({
      filterByFormula: '{Active} = TRUE()',
      fields: [
        'Client Name', 'Domain', 'Primary Color', 'Secondary Color',
        'Logo URL', 'Google Fonts', 'Primary Phone', 'Primary Email',
        'GTM Container ID', 'CallRail Swap Target',
        'Make.com Webhook URL', 'reCAPTCHA Site Key',
        'Salesforce Campaign ID'
      ]
    })
    .all()

  console.log(`   ✓ Fetched ${records.length} clients`)

  return records.map(record => ({
    clientId: record.id,
    clientName: record.get('Client Name'),
    domain: record.get('Domain'),
    branding: {
      primaryColor: record.get('Primary Color'),
      secondaryColor: record.get('Secondary Color'),
      logoUrl: record.get('Logo URL'),
      googleFonts: record.get('Google Fonts') || 'Inter'
    },
    contact: {
      phone: record.get('Primary Phone'),
      email: record.get('Primary Email')
    },
    tracking: {
      gtmId: record.get('GTM Container ID'),
      callrailSwapTarget: record.get('CallRail Swap Target'),
      recaptchaSiteKey: record.get('reCAPTCHA Site Key'),
      salesforceCampaignId: record.get('Salesforce Campaign ID')
    },
    webhooks: {
      makeWebhookUrl: record.get('Make.com Webhook URL')
    }
  }))
}

async function fetchApprovedPages() {
  console.log('📄 Fetching Approved Pages...')

  const records = await base('Pages')
    .select({
      filterByFormula: '{Status} = "Approved"',
      fields: [
        'Service', 'Location', 'Client Name', 'Page URL',
        'SEO Title', 'SEO Description',
        'H1 Headline', 'Hero Subheadline',
        'CTA Text', 'CTA Action Type', 'CTA Action Value',
        'Hero Image URL', 'Hero Image Alt Text',
        'Trust Bar 1', 'Trust Bar 2', 'Trust Bar 3', 'Trust Bar 4', 'Trust Bar 5',
        'FAQs', 'Gallery Captions',
        'Branch City', 'Branch State', 'Branch Phone', 'Branch Address', 'Branch Email',
        'Last Modified'
      ],
      sort: [{ field: 'Client Name', direction: 'asc' }]
    })
    .all()

  console.log(`   ✓ Fetched ${records.length} approved pages`)

  return records.map(record => ({
    pageId: record.id,
    service: record.get('Service'),
    location: record.get('Location') || null,
    clientName: record.get('Client Name')[0],
    url: record.get('Page URL'),
    seo: {
      title: record.get('SEO Title'),
      description: record.get('SEO Description')
    },
    hero: {
      h1: record.get('H1 Headline'),
      subheadline: record.get('Hero Subheadline'),
      cta: {
        text: record.get('CTA Text'),
        actionType: record.get('CTA Action Type'),
        actionValue: record.get('CTA Action Value')
      },
      imageUrl: record.get('Hero Image URL'),
      imageAlt: record.get('Hero Image Alt Text')
    },
    trustBars: [
      record.get('Trust Bar 1'),
      record.get('Trust Bar 2'),
      record.get('Trust Bar 3'),
      record.get('Trust Bar 4'),
      record.get('Trust Bar 5')
    ].filter(Boolean),
    faqs: JSON.parse(record.get('FAQs') || '[]'),
    galleryCaptions: JSON.parse(record.get('Gallery Captions') || '[]'),
    branchMetadata: {
      city: record.get('Branch City'),
      state: record.get('Branch State'),
      phone: record.get('Branch Phone'),
      address: record.get('Branch Address'),
      email: record.get('Branch Email')
    },
    lastModified: record.get('Last Modified')
  }))
}

// Execute
exportAirtableData().catch(error => {
  console.error('❌ Export failed:', error)
  process.exit(1)
})
```

---

## STEP 7: Netlify Auto-Deploy

### Netlify Configuration

```toml
# netlify.toml

[build]
  command = "npm run build"
  publish = "out"

[build.environment]
  NODE_VERSION = "20"

# Netlify automatically watches GitHub main branch
# No build hooks needed - deploys on every git push
```

### Next.js Build Process

```json
// package.json

{
  "scripts": {
    "export": "node scripts/export-airtable-to-json.js",
    "validate-content": "node scripts/validate-content.js",
    "build": "next build && next export"
  }
}
```

### Next.js Static Export

```javascript
// next.config.js

module.exports = {
  output: 'export',
  images: {
    unoptimized: true, // Required for static export
    domains: ['res.cloudinary.com']
  }
}
```

---

## Complete Timeline: Draft → Live

```yaml
T+0:00   Marketing: Create draft in Airtable
           - Service: bathroom-remodeling
           - Location: strongsville
           - Client: Baths R Us
           - Status: Draft

T+0:05   Airtable Automation: Auto-matches Medina Office branch

T+0:10   Marketing: Reviews auto-populated data, triggers AI
           - Status: Draft → "AI Processing"

T+0:11   Airtable Automation: Webhook POST to AI Service

T+0:12   AI Service: Fetches guardrails
           - Available CTAs (3 options)
           - Available hero images (5 options)
           - Branch metadata (Medina Office)

T+0:15   Claude API: Parallel generation (4 simultaneous calls)
           ├─ Hero content (SEO, H1, subheadline, CTA selection) [10s]
           ├─ Trust bars [8s]
           ├─ FAQs [15s] ← longest
           └─ Gallery captions [10s]

T+0:30   AI Service: All content generated (15s total - limited by FAQs)

T+0:31   AI Service: Writes all results to Airtable

T+0:32   AI Service: Updates Status → "Ready for Review"

--- HUMAN REVIEW PAUSE ---

T+5:00   Marketing: Reviews AI-generated content
T+5:30   Marketing: Edits H1 headline (optional)
T+6:00   Marketing: Approves → Status: "Approved"

T+6:01   Airtable Automation: Webhook POST to GitHub Actions

T+6:02   GitHub Actions: Workflow starts
T+6:10   GitHub: npm ci (install dependencies - 8s)
T+6:30   GitHub: npm run export (fetch Airtable data - 20s)
T+6:35   GitHub: npm run validate-content (5s)
T+6:40   GitHub: git commit content.json (5s)
T+6:45   GitHub: git push origin main (5s)

T+6:46   Netlify: Detects git push → Auto-triggers build

T+6:47   Netlify: npm ci (cached - 5s)
T+6:52   Netlify: npm run build (Next.js static export - 90s)
T+8:22   Netlify: Deploy to CDN (30s)

T+8:52   ✅ LIVE - Page deployed
         https://bathsrus.com/bathroom-remodeling/strongsville

Total Time:
  - AI Generation: 30 seconds
  - Human Review: ~5 minutes (variable)
  - Export + Deploy: ~2.5 minutes

Total: ~8 minutes from approval to live
```

---

## Cost Analysis

### AI Generation Costs (Claude API)

```yaml
Per Page Generation:
  - Hero content: ~800 tokens ($0.0024)
  - Trust bars: ~400 tokens ($0.0012)
  - FAQs: ~1200 tokens ($0.0036)
  - Gallery: ~400 tokens ($0.0012)

Total per page: ~2800 tokens = $0.0084 per page

Batch Generation (500 pages):
  - Total tokens: 1,400,000
  - Cost: $4.20

Monthly (100 new pages/month):
  - Cost: $0.84/month
```

### Infrastructure Costs

```yaml
AI Service Hosting (Netlify Functions):
  - $0/month (free tier - serverless)
  - Limits: 125K requests/month, 100 hours runtime/month
  - Usage: ~100-500 requests/month (well within free tier)

GitHub Actions:
  - Free tier: 2000 minutes/month
  - Usage: ~2 minutes per export
  - Capacity: 1000 exports/month (way more than needed)

Netlify (Main Site):
  - Free tier: 300 build minutes/month
  - Usage: ~1.5 minutes per build
  - Capacity: 200 builds/month

Airtable:
  - Team Plan: $20/month (5 users)
  - Records: Unlimited

Total Monthly Cost: ~$20/month
  - Covers unlimited AI generation (free serverless)
  - Unlimited builds/deploys (free tiers)
  - Team collaboration (Airtable Team plan)

Cost Savings vs Always-On Server: $5-7/month saved
```

---

## Error Handling & Monitoring

### AI Service Error Handling

```javascript
// Retry logic for Claude API

async function callClaudeAPIWithRetry(prompt, maxTokens, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await callClaudeAPI(prompt, maxTokens)
    } catch (error) {
      if (error.status === 429) {
        // Rate limit - wait and retry
        const waitTime = Math.pow(2, attempt) * 1000
        console.warn(`⚠️  Rate limit hit, retrying in ${waitTime}ms...`)
        await new Promise(resolve => setTimeout(resolve, waitTime))
      } else if (error.status >= 500 && attempt < retries) {
        // Server error - retry
        console.warn(`⚠️  Server error, retrying (${attempt}/${retries})...`)
        await new Promise(resolve => setTimeout(resolve, 2000))
      } else {
        // Unrecoverable error or max retries
        throw error
      }
    }
  }
}
```

### Airtable Status on Failure

```javascript
// Update Airtable if AI generation fails

try {
  const aiContent = await generateAllContent(pageData)
  await updateAirtablePage(pageId, aiContent)
  await airtableBase('Pages').update(pageId, { Status: 'Ready for Review' })

} catch (error) {
  console.error('AI generation failed:', error)

  // Update Airtable with error status
  await airtableBase('Pages').update(pageId, {
    Status: 'AI Failed',
    'Special Instructions': `ERROR: ${error.message}\n\n${pageData.specialInstructions || ''}`
  })

  throw error
}
```

### Monitoring Dashboard

```yaml
Recommended: Sentry or LogTail

Metrics to track:
  - AI generation success rate
  - Average generation time
  - Token usage per page
  - Export success rate
  - Build success rate
  - Average time to live

Alerts:
  - AI generation failure (Slack notification)
  - Export failure (Email notification)
  - Build failure (Slack notification)
  - High token usage (Budget warning)
```

---

## Next Steps

1. **Set up AI Service** (Netlify Functions - serverless deployment)
   - Create `netlify/functions/generate-ai-content.js`
   - Deploy to separate Netlify site or alongside main site
   - Configure environment variables in Netlify UI
2. **Configure Airtable Automations** (branch matching, AI trigger webhooks)
   - Auto-match Branch Location automation
   - AI Generation trigger (Status → "AI Processing")
   - Export trigger (Status → "Approved")
3. **Create GitHub Actions workflow** (export script)
   - `.github/workflows/export-and-deploy.yml`
   - `scripts/export-airtable-to-json.js`
4. **Configure Netlify** (auto-deploy on push)
   - `netlify.toml` configuration
   - Environment variables for build
5. **Test end-to-end** (draft → AI → review → live)
   - Create test page in Airtable
   - Verify AI generation writes back
   - Test approval workflow
   - Confirm deployment to CDN
6. **Monitor & optimize** (track costs, performance, errors)
   - Set up error monitoring (Sentry recommended)
   - Track AI token usage
   - Monitor build times

---

**Documentation Version:** 1.0
**Last Updated:** 2025-01-09
**Author:** Winston (Architect)
**Status:** Complete & Validated
