# Platform and Infrastructure Choice

**Selected Platform:** Netlify CDN

**Rationale:**
- PRD constraint: "NO serverless functions for runtime" - Static CDN hosting for user-facing pages, with Netlify Functions for backend workflows (AI generation)
- Static CDN architecture for all user-facing pages
- Next.js 15 static export validated: **community testing shows 5000+ pages successfully built**
- Netlify advantages: Global CDN, automatic HTTPS, branch previews, build caching, generous free tier

**Key Infrastructure Services:**

| Service | Purpose | Cost | SLA |
|---------|---------|------|-----|
| **Netlify CDN** | Static file hosting, global edge distribution | Free tier: 100GB bandwidth/mo | 99.9% uptime |
| **Netlify Build** | CI/CD pipeline (`next build && next export`) | Free tier: 300 build mins/mo | N/A |
| **Airtable** | Content storage, approval workflow | Free tier: 1200 records/base | 99.9% API uptime |
| **Claude API** | AI content generation (Trust Bar, Gallery, FAQ) | ~$0.50-1.00 per 500 pages | 99.9% uptime |
| **Make.com** | Workflow automation (forms → Salesforce) | Free tier: 1000 ops/mo | 99.9% uptime |
| **Salesforce** | CRM, lead management (via Make.com OAuth 2) | Client-provided | 99.9% uptime |
| **GTM** | Tag management, conversion tracking | Free | 99.9% uptime |
| **CallRail** | Dynamic phone tracking | Client-provided | 99.9% uptime |
| **GA4** | Analytics, funnel tracking | Free | 99.9% uptime |

**Deployment Regions:**
- **Primary:** Netlify Global CDN (automatic edge distribution to 190+ locations)
- **Build:** Netlify US-East region (default)
- **Data Sources:** Airtable US, Claude API US-East

**Estimated Costs (per client/month):**
- Airtable: $20/mo (Team plan required for automations/webhooks)
- Netlify: $0 (free tier sufficient - 100GB bandwidth, 300 build mins/mo)
- Netlify Functions: $0 (free tier - AI generation well within 125K requests, 100 hrs/mo)
- Claude API: $0.50-1.00 (500 pages × 4 AI sections × ~2K tokens @ $0.003/1K)
- Make.com: $0-9/mo (Free tier: 1000 ops/mo, Core tier: $9/mo if >1000 form submissions)
- GitHub Actions: $0 (free tier - 2000 mins/mo)
- **Total:** ~$20-30/month per client (depending on Make.com tier)

**Infrastructure Diagram:**

```
┌──────────────────────────────────────────────────────────────────┐
│          PHASE 1: AIRTABLE WORKFLOW (Marketing + AI)             │
│  (Airtable + Netlify Functions - serverless backend)            │
└──────────────────────────────────────────────────────────────────┘
                              ↓
              ┌──────────────────────────────────┐
              │  1. Marketing Creates Draft      │
              │     - Page setup in Airtable     │
              │     - Status: "Draft"            │
              └──────────────────────────────────┘
                              ↓
              ┌──────────────────────────────────┐
              │  2. Marketing Triggers AI        │
              │     - Update Status field        │
              │     - Status: "AI Processing"    │
              └──────────────────────────────────┘
                              ↓
              ┌──────────────────────────────────┐
              │  3. Airtable Webhook Fires       │
              │     - Trigger: Status changed    │
              │     - POST to Netlify Function   │
              │     - Endpoint: .netlify/        │
              │       functions/generate-ai      │
              └──────────────────────────────────┘
                              ↓
              ┌──────────────────────────────────┐
              │  4. Netlify Function (Serverless)│
              │     - Cold start: 3-10s          │
              │     - Fetch page data from       │
              │       Airtable                   │
              │     - Call Claude API (parallel):│
              │       * Hero + Trust Bars        │
              │       * Gallery Captions         │
              │       * FAQs                     │
              │     - Write back to Airtable     │
              │       (all AI-generated fields)  │
              │     - Update Status:             │
              │       "Ready for Review"         │
              │     - Total time: 18-40s         │
              └──────────────────────────────────┘
                              ↓
              ┌──────────────────────────────────┐
              │  5. Marketing Reviews & Approves │
              │     - Edit AI content if needed  │
              │     - Status: "Approved"         │
              └──────────────────────────────────┘
                              ↓
                    **Triggers GitHub Actions**

┌──────────────────────────────────────────────────────────────────┐
│          PHASE 2: EXPORT & DEPLOY (GitHub Actions)               │
│  (CI/CD automation triggered by Airtable approval)               │
└──────────────────────────────────────────────────────────────────┘
                              ↓
              ┌──────────────────────────────────┐
              │  1. Airtable Webhook Fires       │
              │     - Trigger: Status="Approved" │
              │     - POST to GitHub Actions     │
              │     - repository_dispatch event  │
              └──────────────────────────────────┘
                              ↓
              ┌──────────────────────────────────┐
              │  2. GitHub Actions Workflow      │
              │     - Export from Airtable       │
              │     - Fetch ALL approved pages   │
              │     - AI content already in      │
              │       Airtable (no separate AI   │
              │       generation needed)         │
              │     - Save to content.json       │
              │       (single file)              │
              └──────────────────────────────────┘
                              ↓
              ┌──────────────────────────────────┐
              │  3. Commit to Git                │
              │     - content.json (single file) │
              │     - Git push → main branch     │
              └──────────────────────────────────┘
                              ↓
                     **Triggers Netlify Build**

┌──────────────────────────────────────────────────────────────────┐
│             PHASE 3: BUILD PHASE (Netlify Build)                 │
│  (Static site generation - NO serverless at runtime)             │
└──────────────────────────────────────────────────────────────────┘
                              ↓
    Git Push → Netlify Webhook → Netlify Build Starts
                              ↓
              ┌──────────────────────────────────┐
              │  1. Read content.json from Git   │
              │     - Single JSON file           │
              │     - Contains ALL content       │
              │       (including AI-generated)   │
              │     - NO Airtable API calls      │
              │     - NO Claude API calls        │
              └──────────────────────────────────┘
                              ↓
              ┌──────────────────────────────────┐
              │  2. next build (App Router)      │
              │     - generateStaticParams()     │
              │       → 500+ routes              │
              │     - generateMetadata()         │
              │       → SEO meta tags            │
              │     - Build static HTML/CSS/JS   │
              │     - Reads from content.json    │
              └──────────────────────────────────┘
                              ↓
              ┌──────────────────────────────────┐
              │  3. Post-Build Optimization      │
              │     - Extract critical CSS       │
              │     - Optimize images (Sharp)    │
              │     - Generate sitemap.xml       │
              └──────────────────────────────────┘
                              ↓
              ┌──────────────────────────────────┐
              │  4. Deploy to Netlify CDN        │
              │     - Upload static files        │
              │     - Invalidate cache           │
              │     - Publish to edge (global)   │
              └──────────────────────────────────┘
                              ↓
                  **Build Complete (5-10 mins)**

┌──────────────────────────────────────────────────────────────────┐
│                         RUNTIME                                  │
│  (User Browser → Netlify Edge → Static Files)                   │
└──────────────────────────────────────────────────────────────────┘
                              ↓
        User (Google Ads click) → Netlify CDN
                              ↓
              ┌──────────────────────────────────┐
              │  1. Serve Static HTML            │
              │     - LCP: 0.8-2.0s (target)     │
              │     - Critical CSS inline        │
              │     - Fonts preloaded (WOFF2)    │
              │     - LCP image optimized        │
              └──────────────────────────────────┘
                              ↓
              ┌──────────────────────────────────┐
              │  2. Client-Side Hydration        │
              │     - React 19 hydrates          │
              │     - 3-Stage Form interactive   │
              │     - localStorage persistence   │
              └──────────────────────────────────┘
                              ↓
              ┌──────────────────────────────────┐
              │  3. Third-Party Scripts Load     │
              │     (DEFERRED - after LCP)       │
              │     - GTM (strategy: lazyOnload) │
              │     - CallRail (lazy)            │
              │     - GA4 (lazy)                 │
              └──────────────────────────────────┘
                              ↓
              ┌──────────────────────────────────┐
              │  4. User Interaction             │
              │     - Fills 3-stage form         │
              │     - reCAPTCHA v3 token gen     │
              │     - POST to Make.com webhook   │
              └──────────────────────────────────┘
                              ↓
        ┌──────────────────────────────────────────┐
        │         Make.com Workflow (10 steps)     │
        ├──────────────────────────────────────────┤
        │  1. Webhook received                     │
        │  2. Verify reCAPTCHA (score >= 0.5)      │
        │  3. Calculate lead quality score         │
        │  4. Enrich data (Airtable lookup)        │
        │  5. Map to Salesforce Lead object        │
        │  6. OAuth 2 authenticate                 │
        │  7. Create Salesforce lead               │
        │  8. Send notifications (email, Slack)    │
        │  9. Return response to form              │
        │  10. Error handling & retry              │
        └──────────────────────────────────────────┘
                              ↓
              ┌──────────────────────────────────┐
              │  5. Form Success/Error Handling  │
              │     - Show success message       │
              │     - Fire GTM conversion event  │
              │     - Clear localStorage         │
              └──────────────────────────────────┘
```

**Performance Estimates (500 pages):**

**Phase 1: AI Generation (per page, on-demand via Netlify Function):**
- **Netlify Function Cold Start:** 3-10s (first request, then warm)
- **Claude API Calls:** 4 parallel requests (Hero, Trust Bars, FAQs, Gallery)
- **Airtable Write-Back:** ~2-5s (update AI-generated fields)
- **Total per page:** 18-40s (Marketing waits for this before review)
- **Marketing Review:** Variable (manual approval workflow)

**Phase 2: Export & Deploy (GitHub Actions, triggered by approval):**
- **Airtable Export:** 1-2 minutes (fetch all approved content → content.json)
- **Git Commit & Push:** 30-60 seconds (content.json only)
- **GitHub Actions Total:** ~2-3 minutes

**Phase 3: Netlify Build (every deployment):**
- **Build Time:** 5-10 minutes (Next.js 15 static generation, reads from content.json)
- **Memory Usage:** 4-8GB peak (Next.js 15 with `webpackMemoryOptimizations`)
- **Airtable API Calls:** 0 (reads from committed content.json)
- **Claude API Calls:** 0 (AI content already in content.json from Airtable)
- **CDN Deploy Time:** 1-2 minutes (Netlify upload + cache invalidation)
- **Netlify Build Total:** ~6-12 minutes

**Key Benefits:**
- AI generation happens BEFORE Marketing review (not during build)
- Netlify builds are FAST (6-12 mins) because no external API calls
- Marketing can review and edit AI content before publishing
- Single source of truth: content.json contains ALL content (including AI-generated)

**Runtime Performance Targets:**
- **LCP:** 0.8-2.0s (mobile), 0.6-1.5s (desktop)
- **FID:** <100ms
- **CLS:** <0.1
- **Time to Interactive:** <3.5s
- **Global CDN Latency:** <50ms (edge locations worldwide)
