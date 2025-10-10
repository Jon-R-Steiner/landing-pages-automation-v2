# Technology Flow Diagram - Landing Pages Automation v2

**Document Version:** 1.0
**Date:** 2025-01-09
**Author:** Winston (Architect)
**Status:** DRAFT - Review Required

---

## Purpose

This document provides a step-by-step flow diagram showing how all technologies work together across four distinct phases:
1. **Phase 1: Airtable Workflow** - Content creation, AI generation, approval
2. **Phase 2: Export & Deploy** - GitHub Actions export, Git commit, Netlify trigger
3. **Phase 3: Build Phase** (Netlify) - Static site generation
4. **Phase 4: Runtime Phase** (User Browser) - User interaction and conversion

This helps identify any missing tools, validate technology choices, and spot potential integration gaps.

---

## Phase 1: Airtable Workflow (Content Management & AI Generation)

**Location:** Airtable + Netlify Functions (serverless)
**Trigger:** Marketing creates/updates pages in Airtable
**Frequency:** On-demand (Marketing-driven)

### Step 1: Marketing Creates Draft Page

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

### Step 2: AI Generation (Netlify Functions - Serverless)

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

### Step 3: Marketing Review & Approval

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

## Phase 2: Export & Deploy (GitHub Actions)

**Location:** GitHub Actions CI
**Trigger:** Airtable Status → "Approved" (webhook to GitHub API)
**Frequency:** On-demand (approval-driven)

### Step 4: Airtable Triggers GitHub Actions

```
┌─────────────────────────────────────────────────────────┐
│  AIRTABLE AUTOMATION: Trigger Export on Approval        │
│                                                          │
│  Trigger: Status = "Approved"                           │
│  Action: Send webhook POST to GitHub API                │
│                                                          │
│  Webhook URL:                                            │
│  https://api.github.com/repos/{owner}/{repo}/dispatches  │
│                                                          │
│  Headers:                                                │
│  - Authorization: Bearer {GITHUB_PAT}                   │
│  - Accept: application/vnd.github.v3+json               │
│                                                          │
│  Payload:                                                │
│  {                                                       │
│    "event_type": "airtable_export",                     │
│    "client_payload": {                                   │
│      "trigger": "page_approved",                         │
│      "page_id": "recXXXXXXXXX",                         │
│      "service": "bathroom-remodeling",                   │
│      "location": "strongsville"                          │
│    }                                                     │
│  }                                                       │
└─────────────────────────────────────────────────────────┘
                        ↓
              [GitHub Actions Workflow Triggered]
```

**Technologies:**
- Airtable Automations (webhook sender)
- GitHub API (repository_dispatch)
- GitHub Personal Access Token (PAT)

**Performance:**
- Duration: 1-2 seconds (webhook delivery)

---

### Step 5: GitHub Actions Export & Commit

```
┌─────────────────────────────────────────────────────────┐
│  GITHUB ACTIONS: .github/workflows/export-and-deploy.yml│
│                                                          │
│  Trigger: repository_dispatch (airtable_export)         │
│                                                          │
│  Steps:                                                  │
│  1. Checkout repository                                  │
│  2. Setup Node.js 20                                     │
│  3. npm ci (install dependencies)                        │
│  4. npm run export (scripts/export-airtable-to-json.js)  │
│  5. npm run validate-content (validation script)         │
│  6. git commit content.json                              │
│  7. git push origin main                                 │
└─────────────────────────────────────────────────────────┘
                        ↓
        [Script: scripts/export-airtable-to-json.js]
                        ↓
┌─────────────────────────────────────────────────────────┐
│  AIRTABLE API: Fetch Approved Pages                      │
│                                                          │
│  Query:                                                  │
│  - Table: Pages                                          │
│  - Filter: Status = "Approved"                          │
│  - Fields: All content fields + lookups                 │
│  - Sort: Client Name (asc)                              │
│                                                          │
│  Also Fetch:                                             │
│  - Clients table (active clients only)                  │
│                                                          │
│  Rate Limiting: 5 req/sec (handled by SDK)              │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│  OUTPUT: content.json (Single File)                      │
│                                                          │
│  {                                                       │
│    "clients": [                                          │
│      {                                                   │
│        "clientId": "recXXX",                             │
│        "clientName": "Baths R Us",                      │
│        "domain": "bathsrus.com",                        │
│        "branding": { colors, fonts, logo },             │
│        "tracking": { gtmId, callrail, recaptcha },      │
│        ...                                               │
│      }                                                   │
│    ],                                                    │
│    "pages": [                                            │
│      {                                                   │
│        "pageId": "recYYY",                               │
│        "service": "bathroom-remodeling",                 │
│        "location": "strongsville",                       │
│        "seo": { title, description },                    │
│        "hero": { h1, subheadline, cta, image },         │
│        "trustBars": [...],                               │
│        "faqs": [...],                                    │
│        "galleryCaptions": [...],                         │
│        "branchMetadata": { city, phone, address }       │
│      }                                                   │
│    ],                                                    │
│    "exportMetadata": {                                   │
│      "exportDate": "2025-01-09T10:30:00Z",              │
│      "totalPages": 523,                                  │
│      "totalClients": 3                                   │
│    }                                                     │
│  }                                                       │
│                                                          │
│  Size: ~500KB for 500 pages                             │
│  Location: /content.json (project root)                 │
│  Contains: ALL content including AI-generated fields    │
└─────────────────────────────────────────────────────────┘
                        ↓
              [Git Commit & Push to main]
                        ↓
┌─────────────────────────────────────────────────────────┐
│  GITHUB REPOSITORY (Remote)                              │
│                                                          │
│  Updated File:                                           │
│  - content.json (single file with all data)             │
│                                                          │
│  Triggers: Netlify auto-deploy webhook                  │
└─────────────────────────────────────────────────────────┘
                        ↓
              [Netlify Detects Push → Triggers Build]
```

**Technologies:**
- GitHub Actions (CI/CD)
- Airtable SDK ^0.12.2 (export script)
- Node.js 20 (GitHub Actions runner)
- Git (version control)

**Performance:**
- Duration: 45-90 seconds total
  - npm ci: 5-10 seconds (cached)
  - Export: 20-40 seconds (API calls)
  - Commit + Push: 5-10 seconds

---

## Phase 3: Build Phase (Netlify - Static Site Generation)

**Location:** Netlify Build Agent (US-East)
**Trigger:** Git push to main branch (from GitHub Actions)
**Frequency:** Every approved page

### Step 6: Netlify Build Environment Setup

```
┌─────────────────────────────────────────────────────────┐
│  NETLIFY BUILD AGENT                                     │
│                                                          │
│  Resources:                                              │
│  - RAM: 4-8GB                                            │
│  - CPU: 4 cores                                          │
│  - Build Timeout: 15 minutes (default)                   │
│  - Node.js: 20.x (configured in package.json)            │
│                                                          │
│  Environment Variables (from Netlify UI):                │
│  - NEXT_PUBLIC_MAKE_WEBHOOK_URL                          │
│  - NEXT_PUBLIC_RECAPTCHA_SITE_KEY                        │
│  - NEXT_PUBLIC_GTM_ID                                    │
│  - NEXT_PUBLIC_CALLRAIL_COMPANY_ID                       │
│  - NEXT_PUBLIC_CALLRAIL_SCRIPT_ID                        │
│  - NEXT_PUBLIC_GA4_MEASUREMENT_ID                        │
│                                                          │
│  ⚠️ NOT NEEDED in Netlify Build:                         │
│  - AIRTABLE_API_KEY (build reads from JSON)              │
│  - ANTHROPIC_API_KEY (build reads from JSON)             │
└─────────────────────────────────────────────────────────┘
                        ↓
              [1. Clone Git Repository]
                        ↓
              [2. npm install (dependencies)]
                        ↓
┌─────────────────────────────────────────────────────────┐
│  Installed Dependencies:                                 │
│  - next ^15.5.0                                          │
│  - react ^19.2.0                                         │
│  - tailwindcss ^4.0.0                                    │
│  - sharp ^0.34.4                                         │
│  - beasties ^0.1.0                                       │
│  - (All from package.json)                               │
└─────────────────────────────────────────────────────────┘
```

**Technologies:**
- Netlify Build Agent
- Node.js 20.x
- npm (package manager)

**Performance:**
- Duration: 2-3 minutes (npm install with cache)

---

### Step 5: Next.js Static Build

```
┌─────────────────────────────────────────────────────────┐
│  BUILD COMMAND: npm run build                            │
│  (Configured in netlify.toml or Netlify UI)              │
└─────────────────────────────────────────────────────────┘
                        ↓
              [next build (Next.js 15)]
                        ↓
        Reads: content.json + ai-content.json
                        ↓
┌─────────────────────────────────────────────────────────┐
│  STATIC GENERATION PROCESS                               │
│                                                          │
│  1. generateStaticParams()                               │
│     - Reads content.json                                 │
│     - Returns array of [service, location] combos        │
│     - Creates 500+ route paths                           │
│                                                          │
│  2. generateMetadata() (per page)                        │
│     - Reads content.json for SEO data                    │
│     - Returns meta tags (title, description, OG)         │
│                                                          │
│  3. Page Component Rendering (per page)                  │
│     - Reads content.json for page data                   │
│     - Reads ai-content.json for AI sections              │
│     - Renders React components to HTML                   │
│                                                          │
│  4. Image Optimization (Sharp)                           │
│     - Processes all images in public/images/             │
│     - Generates AVIF, WebP, JPEG formats                 │
│     - Outputs to .next/static/media/                     │
│                                                          │
│  5. CSS Processing (Tailwind v4 + Beasties)              │
│     - Tailwind generates utility CSS                     │
│     - Beasties extracts critical CSS per page            │
│     - Inlines critical CSS in <head>                     │
│     - Defers non-critical CSS loading                    │
│                                                          │
│  6. JavaScript Bundling                                  │
│     - Bundles client components                          │
│     - Code splitting per route                           │
│     - Tree shaking unused code                           │
│     - Minification                                       │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│  BUILD OUTPUT: /out directory                            │
│                                                          │
│  Structure:                                              │
│  - /bathroom-remodeling/charlotte/index.html             │
│  - /kitchen-remodeling/raleigh/index.html                │
│  - ... (500+ HTML files)                                 │
│  - /_next/static/css/*.css (per-page CSS)                │
│  - /_next/static/chunks/*.js (per-route JS)              │
│  - /images/*.avif, *.webp, *.jpg (optimized)             │
│  - /sitemap.xml                                          │
│  - /robots.txt                                           │
│                                                          │
│  Total Size: ~150-300MB (500+ pages)                     │
└─────────────────────────────────────────────────────────┘
```

**Technologies:**
- Next.js 15.5 (static export)
- React 19.2 (Server Components)
- Tailwind CSS v4.0
- Sharp ^0.34.4 (image optimization)
- Beasties ^0.1.0 (critical CSS extraction)

**Performance:**
- Duration: 5-10 minutes (500 pages)
- Memory Usage: 4-8GB peak
- API Calls: 0 (reads from JSON files)

**Configuration:**
```javascript
// next.config.js
module.exports = {
  output: 'export', // Static export mode
  images: { unoptimized: true }, // Use Sharp instead
  experimental: {
    webpackMemoryOptimizations: true,
  },
}
```

---

### Step 6: Netlify Deployment

```
┌─────────────────────────────────────────────────────────┐
│  NETLIFY DEPLOYMENT PROCESS                              │
│                                                          │
│  1. Upload /out directory to Netlify CDN                 │
│     - Atomic deployment (all or nothing)                 │
│     - Upload to staging first                            │
│                                                          │
│  2. Cache Invalidation                                   │
│     - Invalidate old cached files                        │
│     - Prepare for new version serving                    │
│                                                          │
│  3. Deploy to Edge (Global CDN)                          │
│     - Distribute to 190+ edge locations                  │
│     - US, EU, Asia, AU, South America                    │
│     - <50ms latency globally                             │
│                                                          │
│  4. Activate New Version                                 │
│     - Atomic swap (zero downtime)                        │
│     - Rollback capability (previous version preserved)   │
│                                                          │
│  5. Generate Deploy URL                                  │
│     - Production: https://bathsrus.com                   │
│     - Preview: https://deploy-preview-123--site.netlify.app │
└─────────────────────────────────────────────────────────┘
                        ↓
              [Build Complete Notification]
                        ↓
┌─────────────────────────────────────────────────────────┐
│  NETLIFY CDN (Production)                                │
│                                                          │
│  Global Edge Locations: 190+                             │
│  - Static files served from nearest edge                 │
│  - Automatic HTTPS (Let's Encrypt)                       │
│  - HTTP/2 enabled                                        │
│  - Brotli compression enabled                            │
│  - Smart CDN (stale-while-revalidate)                    │
│                                                          │
│  Headers Configuration (netlify.toml):                   │
│  - Cache-Control for static assets (1 year)              │
│  - Cache-Control for HTML (revalidate)                   │
│  - Security headers (CSP, X-Frame-Options, etc.)         │
└─────────────────────────────────────────────────────────┘
```

**Technologies:**
- Netlify CDN (190+ global edge locations)
- Let's Encrypt (automatic HTTPS)
- Brotli compression
- HTTP/2

**Performance:**
- Duration: 1-2 minutes (upload + cache invalidation)
- Total Build Time: ~6-12 minutes (end-to-end)

**Configuration:**
```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "out"

[[headers]]
  for = "/_next/static/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "*.html"
  [headers.values]
    Cache-Control = "public, max-age=0, must-revalidate"
```

---

## Phase 3: Runtime (User Interaction)

**Location:** User's Browser
**Trigger:** User clicks Google Ads
**Frequency:** Every page view

### Step 7: User Arrives from Google Ads

```
┌─────────────────────────────────────────────────────────┐
│  GOOGLE ADS CLICK                                        │
│                                                          │
│  Ad Click URL:                                           │
│  https://bathsrus.com/bathroom-remodeling/charlotte?    │
│    utm_source=google&                                    │
│    utm_medium=cpc&                                       │
│    utm_campaign=remodel-charlotte&                       │
│    utm_term=bathroom+remodeling+charlotte&               │
│    utm_content=ad-variant-a&                             │
│    gclid=EAIaIQobChMI...                                 │
└─────────────────────────────────────────────────────────┘
                        ↓
              [DNS Resolution + CDN Routing]
                        ↓
┌─────────────────────────────────────────────────────────┐
│  NETLIFY EDGE (Nearest to User)                          │
│                                                          │
│  Request: GET /bathroom-remodeling/charlotte/            │
│  Response: index.html (pre-rendered)                     │
│                                                          │
│  Performance:                                            │
│  - TTFB: <50ms (CDN edge)                                │
│  - HTML Size: ~15-25KB (gzipped with Brotli)             │
└─────────────────────────────────────────────────────────┘
                        ↓
              [Browser Receives HTML]
                        ↓
┌─────────────────────────────────────────────────────────┐
│  HTML CONTENT (Critical Rendering Path)                  │
│                                                          │
│  <head>                                                  │
│    <style> /* Inline critical CSS (5-10KB) */ </style>  │
│    <link rel="preload" as="font" ... />                 │
│    <link rel="preload" as="image" ... /> (LCP image)    │
│  </head>                                                 │
│  <body>                                                  │
│    <!-- Above-the-fold HTML rendered -->                 │
│    <picture>                                             │
│      <source srcset="hero.avif" type="image/avif" />    │
│      <source srcset="hero.webp" type="image/webp" />    │
│      <img src="hero.jpg" /> <!-- LCP element -->        │
│    </picture>                                            │
│    <!-- 3-Stage Form (hydrated) -->                      │
│    <!-- Below-fold content (lazy loaded) -->             │
│  </body>                                                 │
└─────────────────────────────────────────────────────────┘
```

**Performance Targets:**
- **TTFB:** <50ms (CDN edge)
- **FCP:** <1.0s (critical CSS inline)
- **LCP:** 0.8-2.0s (target: <2.5s for Google Ads Quality Score)

---

### Step 8: Client-Side Hydration

```
┌─────────────────────────────────────────────────────────┐
│  REACT 19.2 HYDRATION                                    │
│                                                          │
│  1. Load JavaScript Bundle (code-split per route)        │
│     - Main bundle: ~50-100KB (gzipped)                   │
│     - Route-specific: ~20-40KB (gzipped)                 │
│                                                          │
│  2. Hydrate Interactive Components                       │
│     - ThreeStageForm (client component)                  │
│     - LazySection wrappers (Intersection Observer)       │
│                                                          │
│  3. Initialize Client-Side State                         │
│     - localStorage for form persistence                  │
│     - sessionStorage for UTM parameters                  │
│     - Page load time tracking                            │
└─────────────────────────────────────────────────────────┘
                        ↓
              [Interactive Components Ready]
                        ↓
┌─────────────────────────────────────────────────────────┐
│  CLIENT-SIDE TRACKING INITIALIZATION                     │
│                                                          │
│  1. Capture UTM Parameters                               │
│     - Read from URL query string                         │
│     - Store in sessionStorage                            │
│     - Persist across form stages                         │
│                                                          │
│  2. Capture Session Data                                 │
│     - referrer: document.referrer                        │
│     - page_url: window.location.href                     │
│     - landing_page_url: sessionStorage                   │
│     - gclid + timestamp                                  │
│                                                          │
│  3. Capture Device Data                                  │
│     - device_type: mobile/tablet/desktop                 │
│     - browser: navigator.userAgentData                   │
│     - viewport_width: window.innerWidth                  │
└─────────────────────────────────────────────────────────┘
```

**Technologies:**
- React 19.2 (client-side hydration)
- Next.js 15.5 (client router)
- localStorage API
- sessionStorage API

**Performance:**
- **TTI:** <3.5s (target)
- **FID:** <100ms

---

### Step 9: Third-Party Scripts (Deferred - Post-LCP)

```
┌─────────────────────────────────────────────────────────┐
│  DEFERRED SCRIPT LOADING (strategy="lazyOnload")         │
│                                                          │
│  Trigger: After LCP (Largest Contentful Paint)           │
│  Method: Next.js Script component with lazyOnload        │
└─────────────────────────────────────────────────────────┘
                        ↓
        ┌───────────────┴───────────────┬─────────────────┐
        ↓                               ↓                 ↓
┌──────────────────┐       ┌──────────────────┐   ┌──────────────────┐
│ Google Tag       │       │ CallRail Dynamic │   │ reCAPTCHA v3     │
│ Manager (GTM)    │       │ Number Insertion │   │ (Invisible)      │
│                  │       │                  │   │                  │
│ - Loads GTM      │       │ - Swaps phone    │   │ - Loads in       │
│   container      │       │   numbers with   │   │   background     │
│ - Initializes    │       │   tracking nums  │   │ - Ready for      │
│   dataLayer      │       │ - Tracks calls   │   │   form submit    │
│ - Loads GA4      │       │   from landing   │   │                  │
│   via GTM        │       │   pages          │   │                  │
│                  │       │                  │   │                  │
│ Size: ~60-80KB   │       │ Size: ~40-60KB   │   │ Size: ~20-30KB   │
└──────────────────┘       └──────────────────┘   └──────────────────┘
        │                               │                 │
        └───────────────┬───────────────┴─────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│  TRACKING READY (Total: ~120-170KB deferred)             │
│                                                          │
│  Impact on LCP: NONE (loaded after LCP)                  │
│  Impact on TTI: Minimal (non-blocking)                   │
└─────────────────────────────────────────────────────────┘
```

**Technologies:**
- Google Tag Manager (GTM)
- Google Analytics 4 (GA4) via GTM
- CallRail (dynamic number insertion)
- reCAPTCHA v3 (invisible)

**Implementation:**
```tsx
// src/app/layout.tsx
<Script
  id="gtm"
  strategy="lazyOnload" // Load AFTER LCP
  src={`https://www.googletagmanager.com/gtm.js?id=${process.env.NEXT_PUBLIC_GTM_ID}`}
/>

<Script
  src={`https://cdn.callrail.com/companies/${process.env.NEXT_PUBLIC_CALLRAIL_COMPANY_ID}/.../swap.js`}
  strategy="lazyOnload"
/>

<Script
  src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
  strategy="lazyOnload"
/>
```

**Performance Impact:**
- Scripts load **after** LCP (no impact on Core Web Vitals)
- Total deferred size: ~120-170KB (gzipped)

---

### Step 10: User Fills 3-Stage Form

```
┌─────────────────────────────────────────────────────────┐
│  STAGE 1: Name + Phone                                   │
│                                                          │
│  User Actions:                                           │
│  1. User clicks into form (triggers GTM event)           │
│     → GTM Event: form_start                              │
│                                                          │
│  2. User enters name and phone                           │
│  3. Click "Continue" button                              │
│                                                          │
│  Client-Side Logic:                                      │
│  - Validate phone format (US: xxx-xxx-xxxx)              │
│  - Save to localStorage (persistence)                    │
│  - Transition to Stage 2                                 │
│     → GTM Event: form_stage_2                            │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│  STAGE 2: Service + Location                             │
│                                                          │
│  User Actions:                                           │
│  1. Select service from dropdown                         │
│  2. Enter ZIP code                                       │
│  3. Click "Continue" button                              │
│                                                          │
│  Client-Side Logic:                                      │
│  - Validate ZIP code format (5 digits)                   │
│  - Save to localStorage (persistence)                    │
│  - Transition to Stage 3                                 │
│     → GTM Event: form_stage_3                            │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│  STAGE 3: Details + Submit                               │
│                                                          │
│  User Actions:                                           │
│  1. Enter project details (optional)                     │
│  2. Enter email (optional)                               │
│  3. Click "Get Free Quote" button                        │
│                                                          │
│  Client-Side Logic:                                      │
│  1. Generate reCAPTCHA v3 token                          │
│     - window.grecaptcha.execute()                        │
│     - Returns token (invisible to user)                  │
│                                                          │
│  2. Build form payload (see Step 11)                     │
│                                                          │
│  3. Calculate timing metrics                             │
│     - time_on_page: Date.now() - pageLoadTime            │
│     - form_duration: Date.now() - formStartTime          │
│                                                          │
│  4. Submit to Make.com webhook                           │
└─────────────────────────────────────────────────────────┘
```

**Technologies:**
- React 19.2 (client component)
- localStorage API (form persistence)
- reCAPTCHA v3 API (token generation)
- GTM dataLayer (event tracking)

**GTM Events Tracked:**
- `form_start` - User begins Stage 1
- `form_stage_2` - User advances to Stage 2
- `form_stage_3` - User advances to Stage 3
- `form_submit` - Form submitted (see Step 11)
- `form_error` - Form submission failed

---

### Step 11: Form Submission to Make.com

```
┌─────────────────────────────────────────────────────────┐
│  CLIENT-SIDE: Build Form Payload                         │
│                                                          │
│  const payload = {                                       │
│    // Lead Data                                          │
│    fullName: formData.name,                              │
│    phoneNumber: formData.phone,                          │
│    email: formData.email || '',                          │
│    zipCode: formData.location,                           │
│    jobType: formData.service,                            │
│    howDidYouHear: 'Online Form',                         │
│    commentsOrQuestions: formData.details || '',          │
│                                                          │
│    // UTM Parameters (from sessionStorage)               │
│    utm_source: sessionStorage.getItem('utm_source'),     │
│    utm_medium: sessionStorage.getItem('utm_medium'),     │
│    utm_campaign: sessionStorage.getItem('utm_campaign'), │
│    utm_term: sessionStorage.getItem('utm_term'),         │
│    utm_content: sessionStorage.getItem('utm_content'),   │
│                                                          │
│    // Click IDs                                          │
│    gclid: sessionStorage.getItem('gclid'),               │
│    gclid_timestamp: sessionStorage.getItem('gclid_ts'),  │
│    fbclid: sessionStorage.getItem('fbclid'),             │
│                                                          │
│    // Session Data                                       │
│    client_id: gtag('get', 'client_id'),                  │
│    session_id: gtag('get', 'session_id'),                │
│    landing_page_url: sessionStorage.getItem('landing'), │
│    page_url: window.location.href,                       │
│    referrer: document.referrer,                          │
│                                                          │
│    // Timing Metrics                                     │
│    time_on_page: 120, // seconds                         │
│    form_duration: 70, // seconds                         │
│    form_start_time: formStartTime,                       │
│    form_submit_time: Date.now(),                         │
│                                                          │
│    // Device Data                                        │
│    device_type: 'mobile',                                │
│    browser: 'Chrome',                                    │
│    viewport_width: 375,                                  │
│                                                          │
│    // Anti-Spam                                          │
│    recaptcha_token: recaptchaToken, // Generated         │
│                                                          │
│    // Metadata                                           │
│    user_agent: navigator.userAgent,                      │
│    timestamp: new Date().toISOString(),                  │
│    form_version: '3-stage-v1'                            │
│  }                                                       │
└─────────────────────────────────────────────────────────┘
                        ↓
              [fetch() POST to Make.com Webhook]
                        ↓
┌─────────────────────────────────────────────────────────┐
│  MAKE.COM WEBHOOK (External Service)                     │
│                                                          │
│  URL: process.env.NEXT_PUBLIC_MAKE_WEBHOOK_URL          │
│  Method: POST                                            │
│  Content-Type: application/json                          │
│                                                          │
│  Make.com Workflow (10 Steps - NOT our concern):         │
│  1. Receive webhook payload                              │
│  2. Verify reCAPTCHA (score >= 0.5)                      │
│  3. Calculate lead quality score                         │
│  4. Enrich data (Airtable client config lookup)          │
│  5. Map to Salesforce Lead object                        │
│  6. OAuth 2 authenticate with Salesforce                 │
│  7. Create Salesforce lead (POST to SF API)              │
│  8. Send notifications (email, Slack, Airtable backup)   │
│  9. Return response to landing page                      │
│  10. Error handling & retry logic                        │
│                                                          │
│  Response Format:                                        │
│  Success: { "success": true, "lead_id": "00Q..." }       │
│  Error: { "success": false, "error": "...", "msg": "..." }│
└─────────────────────────────────────────────────────────┘
                        ↓
              [Response Received]
                        ↓
┌─────────────────────────────────────────────────────────┐
│  CLIENT-SIDE: Handle Response                            │
│                                                          │
│  SUCCESS RESPONSE:                                       │
│  1. Show success message to user                         │
│     "Thank you! We'll contact you within 24 hours."      │
│                                                          │
│  2. Fire GTM conversion event                            │
│     dataLayer.push({                                     │
│       event: 'form_submit',                              │
│       lead_id: response.lead_id                          │
│     })                                                   │
│                                                          │
│  3. Clear localStorage form state                        │
│                                                          │
│  ERROR RESPONSE:                                         │
│  1. Show error message (user-friendly)                   │
│     - spam_detected: "Please try again or call us"       │
│     - salesforce_error: "Call us at 555-123-4567"        │
│     - duplicate_lead: "We already have your info!"       │
│                                                          │
│  2. Fire GTM error event                                 │
│     dataLayer.push({                                     │
│       event: 'form_error',                               │
│       error_type: response.error                         │
│     })                                                   │
│                                                          │
│  3. Keep form data in localStorage (allow retry)         │
│                                                          │
│  4. Provide phone number fallback                        │
└─────────────────────────────────────────────────────────┘
```

**Technologies:**
- Fetch API (browser native)
- Make.com webhook
- GTM dataLayer
- localStorage API

**Performance:**
- Request time: 500-1500ms (Make.com processing)
- User sees spinner during submission

---

## Technology Integration Summary

### Critical Path (LCP <2.5s):
1. ✅ **CDN (Netlify)** - TTFB <50ms
2. ✅ **Critical CSS (Beasties)** - Inline 5-10KB
3. ✅ **Self-hosted Fonts** - Preloaded WOFF2
4. ✅ **Image Optimization (Sharp)** - AVIF/WebP/JPEG
5. ✅ **Lazy Loading** - Below-fold content deferred
6. ✅ **Third-Party Scripts** - Deferred until post-LCP

### Build Optimization:
1. ✅ **Next.js 15.5** - Static export with `output: 'export'`
2. ✅ **Tailwind v4.0** - 5x faster builds, 100x faster incremental
3. ✅ **Sharp** - 15-20% faster AVIF encoding
4. ✅ **Beasties** - Critical CSS extraction
5. ✅ **Pre-Build JSON** - No API calls during Netlify build

### Conversion Tracking:
1. ✅ **GTM** - Tag management (deferred)
2. ✅ **GA4** - Analytics via GTM
3. ✅ **CallRail** - Phone tracking (deferred)
4. ✅ **Make.com** - Form submission → Salesforce
5. ✅ **reCAPTCHA v3** - Spam prevention (invisible)

---

## Missing Technologies / Gaps Identified

### 🔍 Potential Additions to Consider:

#### 1. **Netlify Plugins** (Build Optimization)

**Recommended:**
- ✅ **@netlify/plugin-lighthouse** - Automated Lighthouse scoring on deploy
- ✅ **netlify-plugin-cache** - Cache node_modules between builds (faster builds)
- ⚠️ **netlify-plugin-sitemap** - Auto-generate sitemap.xml (MAYBE - Next.js can do this)

**Configuration (`netlify.toml`):**
```toml
[[plugins]]
  package = "@netlify/plugin-lighthouse"
  [plugins.inputs]
    output_path = "reports/lighthouse.html"

[[plugins]]
  package = "netlify-plugin-cache"
  [plugins.inputs.paths]
    - "node_modules"
    - ".next/cache"
```

**Decision Needed:** Should we add Netlify plugins?

---

#### 2. **Error Monitoring** (Runtime)

**Identified Gap:** No runtime error tracking for client-side errors

**Options:**
- **Sentry** - Error tracking, performance monitoring ($26/mo for 50K errors)
- **LogRocket** - Session replay + error tracking ($99/mo)
- **Bugsnag** - Error monitoring ($49/mo)
- **Rollbar** - Error tracking ($25/mo)

**Recommendation:** Add Sentry (free tier: 5K errors/month might be sufficient for pilot)

**Decision Needed:** Add error monitoring or defer to Epic 1?

---

#### 3. **Performance Monitoring** (Real User Monitoring - RUM)

**Identified Gap:** No real-world Core Web Vitals tracking

**Options:**
- **Google PageSpeed Insights API** - Free, but manual
- **Vercel Speed Insights** - $10/mo (requires Vercel hosting - NOT applicable)
- **Cloudflare Web Analytics** - Free (privacy-focused)
- **GA4 Web Vitals** - Free (via GTM custom event)

**Recommendation:** Implement GA4 Web Vitals tracking via GTM (free, already using GA4)

**Implementation:**
```javascript
// src/lib/webVitals.ts
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals'

function sendToGTM(metric) {
  dataLayer.push({
    event: 'web-vitals',
    metric_name: metric.name,
    metric_value: metric.value,
    metric_id: metric.id,
  })
}

getCLS(sendToGTM)
getFID(sendToGTM)
getFCP(sendToGTM)
getLCP(sendToGTM)
getTTFB(sendToGTM)
```

**Decision Needed:** Implement now or defer?

---

#### 4. **A/B Testing** (Conversion Optimization)

**Identified Gap:** No A/B testing infrastructure for form optimization

**Options:**
- **Google Optimize** - DEPRECATED (shut down Sept 2023)
- **Netlify Edge Functions** - A/B testing at edge (requires serverless - conflicts with "no serverless" constraint)
- **GTM with Client-Side Split** - Use GTM to randomize variants (free, but flicker risk)
- **Optimizely** - Enterprise A/B testing ($50K+/year - overkill)
- **VWO** - A/B testing ($199/mo - mid-tier)

**Recommendation:** Defer to Epic 2 (not critical for MVP)

**Decision Needed:** Defer or implement basic GTM-based A/B testing?

---

#### 5. **Form Analytics** (Conversion Funnel)

**Current State:** GTM tracks form stages, but no drop-off analysis

**Options:**
- **Hotjar** - Heatmaps + form analytics ($39/mo)
- **Microsoft Clarity** - Free heatmaps + session replay (privacy-focused)
- **GA4 Enhanced Events** - Custom form field tracking (free, via GTM)

**Recommendation:** Add Microsoft Clarity (free, no privacy concerns)

**Configuration:**
```tsx
// src/app/layout.tsx
<Script
  id="clarity"
  strategy="lazyOnload"
  dangerouslySetInnerHTML={{
    __html: `
      (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
      })(window, document, "clarity", "script", "${process.env.NEXT_PUBLIC_CLARITY_ID}");
    `
  }}
/>
```

**Decision Needed:** Add Microsoft Clarity now or defer?

---

#### 6. **Build Notifications** (DevOps)

**Identified Gap:** No notification when builds fail or succeed

**Options:**
- **Netlify Build Notifications** - Built-in (email, Slack webhook)
- **GitHub Actions Notifications** - If using GHA for pre-build

**Recommendation:** Enable Netlify Slack notifications (built-in, free)

**Configuration (Netlify UI):**
- Settings → Build & Deploy → Deploy Notifications
- Add Slack webhook URL

**Decision Needed:** Set up now or defer?

---

## Final Technology Stack Summary

### ✅ Confirmed Technologies (No Gaps):

**Pre-Build:**
- Airtable SDK ^0.12.2
- Anthropic SDK ^0.65.0 (Claude Sonnet 4.5)
- Node.js scripts
- Git + GitHub

**Build:**
- Next.js 15.5 (static export)
- React 19.2
- TypeScript 5.9
- Tailwind CSS v4.0
- Sharp ^0.34.4
- Beasties ^0.1.0
- Netlify Build Agent

**Runtime:**
- Netlify CDN (190+ edge locations)
- GTM + GA4 (deferred)
- CallRail (deferred)
- reCAPTCHA v3 (deferred)
- Make.com webhook
- Salesforce (via Make.com)

### ⚠️ Decisions Needed (Missing/Optional):

1. **Netlify Plugins** - Add Lighthouse + Cache plugins?
2. **Error Monitoring** - Add Sentry or defer?
3. **Performance Monitoring** - Implement GA4 Web Vitals tracking?
4. **Form Analytics** - Add Microsoft Clarity (free)?
5. **Build Notifications** - Enable Netlify Slack notifications?
6. **A/B Testing** - Defer to Epic 2?

---

## Next Steps

1. **Review this flow diagram** with team/stakeholders
2. **Make decisions on optional technologies** (items 1-6 above)
3. **Update architecture.md** with final technology choices
4. **Create ADRs** for any new technology additions
5. **Proceed to Data Models section** of architecture document

---

**Document Status:** DRAFT - Awaiting Review
**Last Updated:** 2025-01-09
**Next Review:** After stakeholder feedback
