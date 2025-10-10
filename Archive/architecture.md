# Landing Pages Automation v2 - Fullstack Architecture Document

**Project:** Landing Pages Automation v2
**Version:** 1.0
**Date:** 2025-01-08
**Author:** Winston (Architect)
**Status:** DRAFT - In Progress

---

## Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2025-01-08 | 1.0 | Initial architecture document created | Winston |

---

## Table of Contents

1. [Introduction](#introduction)
2. [High Level Architecture](#high-level-architecture)
3. [Tech Stack](#tech-stack)
4. [Data Models](#data-models)
5. [External APIs](#external-apis)
6. [Components](#components)
7. [Core Workflows](#core-workflows)
8. [Frontend Architecture](#frontend-architecture)
9. [Development Workflow](#development-workflow)
10. [Coding Standards](#coding-standards)
11. [Error Handling Strategy](#error-handling-strategy)
12. [Monitoring and Observability](#monitoring-and-observability)
13. [Security & Performance](#security--performance)
14. [Testing Strategy](#testing-strategy)

---

# Introduction

This document outlines the complete fullstack architecture for **Landing Pages Automation v2**, a Jamstack-based system for generating high-performance, conversion-optimized landing pages for home service contractors targeting paid traffic (Google Ads Performance Max).

This unified approach combines frontend and backend architectural concerns into a single source of truth for AI-driven development, ensuring consistency across the entire technology stack.

## Project Context

**Primary Goal:** Generate static landing pages optimized for Google Ads Quality Score (LCP <2.5s critical) with conversion tracking via GTM, CallRail, and GA4.

**Key Constraint:** **NO serverless functions for runtime/user-facing operations** - Previous deployment failed with monorepo + Netlify Functions. This architecture uses static-only CDN for all user-facing pages. However, **serverless functions ARE used for backend workflows** (AI content generation via Airtable webhooks) that occur BEFORE publishing.

**Target Scale:** 500+ landing pages per client, with support for multiple clients.

## Starter Template or Existing Project

**Status:** Greenfield project (no starter template)

**Repository Approach:** Standard Next.js 15 project structure (FLAT, not monorepo)

**Rationale:**
- Previous monorepo + Netlify Functions deployment failed
- Single Next.js app with no backend API we write (external services only)
- Industry best practice: monorepos are overkill for single-app projects
- Simpler deployment, debugging, and maintenance

## Architectural Style

**Jamstack Architecture** (JavaScript + APIs + Markup)

```
Build Time (Next.js 15 Static Export)
  ↓ Fetch data from Airtable (or JSON export)
  ↓ Generate AI content via Claude API
  ↓ Build 500+ static HTML pages
  ↓ Deploy to Netlify CDN

Runtime (User visits page)
  ↓ Static HTML served from CDN
  ↓ Client-side JavaScript hydrates
  ↓ GTM, CallRail, GA4 scripts load (deferred)
  ↓ User fills 3-stage form
  ↓ Form submits to Make.com webhook
  ↓ Make.com → Salesforce lead creation
```

## Key Architectural Decisions (from Elicitation Analysis)

### Critical Risks Mitigated:

1. **Next.js 15 Static Export Compatibility**
   - **Risk:** Next.js 15 is new, limited real-world examples with static export
   - **Mitigation:** Epic 0.1 includes reference implementation deployment + testing
   - **Fallback:** Downgrade to Next.js 14 if issues found (requires ADR)

2. **Performance Target: LCP <2.5s**
   - **Risk:** GTM + CallRail + GA4 scripts (~120-190KB) threaten LCP target
   - **Mitigation:** Defer ALL third-party scripts until after LCP, inline critical CSS per-page, lazy load below-fold content

3. **Airtable API Rate Limits**
   - **Risk:** 5 req/sec limit could cause build failures
   - **Mitigation:** Export Airtable data to JSON file, commit to repo, build reads from local file (no API calls during build)

4. **CallRail Dynamic Number Insertion**
   - **Risk:** Static sites have no runtime server to coordinate dynamic numbers
   - **Mitigation:** Research 3 approaches in ADR-023, test extensively in Epic 0.2

### Best Practices Applied:

1. **Flat Repository Structure** (not monorepo)
   - Lesson from previous failure
   - Single Next.js 15 App Router project
   - No Nx, Turborepo, or Lerna complexity

2. **Component Caching Strategy**
   - Cache AI-generated content sections (Trust Bar, Gallery, FAQ)
   - 3-5x faster builds
   - Deterministic builds (same input = same output)

3. **Build-Time Optimization**
   - Export Airtable data to JSON (10x faster builds, no API dependency)
   - Per-page critical CSS extraction
   - Lazy load all below-fold content
   - Defer third-party scripts until after LCP

4. **Conversion Tracking Integration**
   - GTM for tag management
   - CallRail for phone tracking
   - GA4 for analytics and funnel tracking
   - All scripts deferred to preserve LCP <2.5s

### Optimization Priorities:

1. **Performance First:** LCP <2.5s is non-negotiable (Google Ads Quality Score)
2. **Build Speed:** Component caching + JSON export = 3-10x faster builds
3. **Maintainability:** Flat structure, clear separation of concerns
4. **Scalability:** Support 500+ pages per client, multiple clients
5. **Cost Efficiency:** Static hosting on Netlify (no serverless function costs)

## Technology Constraints

**Locked Decisions (from PRD v2.1):**
- ✅ Next.js 15 App Router (static export mode)
- ✅ Netlify CDN hosting (static-only for runtime; Netlify Functions for backend workflows)
- ✅ Airtable for data storage and approval workflow
- ✅ Claude API (Anthropic) for AI content generation via Netlify Functions
- ✅ GTM + CallRail + GA4 for conversion tracking
- ✅ Make.com for form submission → Salesforce integration
- ✅ 3-stage progressive forms (Name/Phone → Service/Location → Details/Submit)

**Open Decisions (to be finalized in ADRs):**
- Styling approach (Tailwind CSS, CSS Modules, or styled-components)
- Testing framework (Jest + React Testing Library, Vitest, or Playwright)
- Form library (React Hook Form, Formik, or native)
- Image optimization strategy (next/image replacement for static export)
- Font loading strategy (self-hosted vs Google Fonts CDN)

## ADR Structure (40 Total)

**Group A: Foundation (20 ADRs)** - Repository, Next.js, Netlify, Airtable, styling, testing
**Group B: Conversion Tracking (4 ADRs)** - GTM, CallRail, GA4, conversion events
**Group C: Forms & Submissions (4 ADRs)** - 3-stage forms, Make.com integration, validation
**Group D: Performance (4 ADRs)** - LCP optimization, image handling, font loading, script deferral
**Group E: Conversion Components (3 ADRs)** - Trust Bar, Gallery, FAQ AI generation
**Group F: Risk Mitigation (5 ADRs)** - Next.js version, JSON export, build budget, contingency plans

## Success Criteria

**Performance Targets:**
- LCP <2.5s (95th percentile)
- FID <100ms
- CLS <0.1
- Time to Interactive <3.5s

**Build Targets:**
- Build time for 500 pages: <10 minutes (with caching)
- Netlify free tier compatibility: 300 build minutes/month
- Zero build failures due to API rate limits

**Conversion Targets:**
- Form abandonment rate <40%
- GTM conversion event accuracy: 100%
- CallRail call tracking: 100% of dynamic numbers load correctly
- GA4 funnel tracking: Complete 3-stage form progression

**Quality Targets:**
- Zero accessibility violations (WCAG 2.1 AA)
- Lighthouse score: 95+ (Performance, Accessibility, Best Practices, SEO)
- Cross-browser compatibility: Chrome, Safari, Firefox, Edge (last 2 versions)
- Mobile-first design: 60%+ traffic from mobile

---

# High Level Architecture

## Technical Summary

Landing Pages Automation v2 is a **Jamstack application** built with **Next.js 15 App Router in static export mode** (`output: 'export'`), deployed to **Netlify CDN** for global edge distribution. The system uses an **Airtable-centric workflow** where Marketing creates pages in Airtable, triggers AI content generation via **Netlify Functions** (serverless) that call **Claude API** to generate Hero, Trust Bar, Gallery, and FAQ content and write it back to Airtable for review and approval. Once approved, **GitHub Actions** exports all content (including AI-generated) to a single `content.json` file, which Next.js uses at build time to generate 500+ static pages. At runtime, static pages load instantly from CDN (<50ms globally), achieving **LCP <2.5s** through critical CSS inlining, self-hosted fonts (WOFF2), build-time image optimization (AVIF/WebP), and deferred third-party scripts (`strategy="lazyOnload"`). Client-side hydration enables interactive **3-stage progressive forms** that submit to **Make.com webhooks** for **Salesforce lead creation** via OAuth 2. Conversion tracking is handled by **GTM, CallRail, and GA4** with all scripts loaded post-LCP to preserve sub-2.5s targets critical for Google Ads Quality Score.

This architecture achieves PRD goals through **performance** (static CDN + aggressive optimization = 0.8-2.0s LCP), **scalability** (proven Next.js 15 static export handles 5000+ pages), **maintainability** (flat structure, clear separation of concerns), and **cost efficiency** (~$20-30/month total, leveraging free tiers: Netlify 100GB bandwidth, 300 build mins/mo, Netlify Functions 125K requests/mo for backend workflows).

## Platform and Infrastructure Choice

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

## Repository Structure

**Approach:** **FLAT** (Standard Next.js 15 project, NOT monorepo)

**Decision Rationale:**
- ✅ Previous deployment failed with monorepo + Netlify Functions
- ✅ Single Next.js app with no backend API we write (all external services)
- ✅ No need for Nx, Turborepo, or Lerna complexity
- ✅ Simpler CI/CD, debugging, onboarding, and dependency management
- ✅ Faster builds (no monorepo orchestration overhead)

**Project Root Structure:**

```
landing-pages-automation-v2/
├── .bmad-core/                      # BMAD framework (tasks, templates, agents)
│   ├── tasks/
│   ├── templates/
│   └── data/
├── .claude/                         # Claude Code configuration
├── docs/                            # Architecture, PRD, ADRs, specs
│   ├── architecture.md              # This document
│   ├── prd.md                       # Product Requirements Document v2.1
│   ├── front-end-spec.md            # UI/UX specifications
│   ├── salesforce-integration-strategy.md
│   └── ADRs/                        # 40 Architecture Decision Records
│       ├── Group-A-Foundation/      # 20 ADRs
│       ├── Group-B-Conversion/      # 4 ADRs
│       ├── Group-C-Forms/           # 4 ADRs
│       ├── Group-D-Performance/     # 4 ADRs
│       ├── Group-E-Components/      # 3 ADRs
│       └── Group-F-Risk/            # 5 ADRs
├── public/                          # Static assets (images, fonts, favicons)
│   ├── images/                      # Optimized images (AVIF, WebP, JPEG)
│   ├── fonts/                       # Self-hosted WOFF2 fonts
│   └── favicon.ico
├── src/                             # Source code (Next.js App Router)
│   ├── app/                         # Next.js 15 App Router pages
│   │   ├── layout.tsx               # Root layout (GTM, fonts, critical CSS)
│   │   ├── page.tsx                 # Home page
│   │   ├── [service]/[location]/   # Dynamic landing pages (500+)
│   │   │   └── page.tsx             # generateStaticParams + generateMetadata
│   │   ├── about/page.tsx           # Static pages
│   │   ├── contact/page.tsx
│   │   └── sitemap.ts               # Dynamic sitemap generation
│   ├── components/                  # Reusable React components
│   │   ├── ThreeStageForm/          # Progressive form (3 stages)
│   │   │   ├── Stage1.tsx           # Name + Phone
│   │   │   ├── Stage2.tsx           # Service + Location
│   │   │   ├── Stage3.tsx           # Details + Submit
│   │   │   └── index.tsx            # Main form controller
│   │   ├── TrustBar/                # AI-generated trust signals
│   │   ├── Gallery/                 # AI-generated project gallery
│   │   ├── FAQ/                     # AI-generated FAQs
│   │   ├── Hero/                    # Hero section
│   │   ├── CTA/                     # Call-to-action sections
│   │   ├── Footer/                  # Footer with schema.org markup
│   │   └── LazySection/             # Intersection Observer wrapper
│   ├── lib/                         # Utilities, API clients, helpers
│   │   ├── airtable.ts              # Airtable SDK wrapper (build-time only)
│   │   ├── claude.ts                # Claude API client (build-time)
│   │   ├── makeWebhook.ts           # Make.com webhook utilities
│   │   ├── seo.ts                   # Metadata generation helpers
│   │   ├── imageLoader.ts           # Custom image loader
│   │   └── analytics.ts             # GTM, GA4 utilities
│   ├── styles/                      # Global styles
│   │   ├── globals.css              # Base styles
│   │   └── critical.css             # Critical CSS (auto-generated)
│   └── types/                       # TypeScript type definitions
│       ├── airtable.ts              # Airtable schema types
│       ├── page.ts                  # Page data types
│       └── form.ts                  # Form data types
├── scripts/                         # Build scripts
│   ├── export-airtable-to-json.js   # Airtable → JSON export
│   ├── optimize-images.js           # Sharp-based image optimization
│   ├── extract-critical-css.js      # Critical CSS extraction
│   └── generate-sitemap.js          # Sitemap.xml generation
├── tests/                           # All test files
│   ├── unit/                        # Unit tests (components, utilities)
│   ├── integration/                 # API integration tests
│   └── e2e/                         # End-to-end tests (Playwright)
├── .env.local                       # Environment variables (local dev)
├── .env.production                  # Production environment variables
├── .gitignore
├── next.config.js                   # Next.js configuration
├── package.json
├── tsconfig.json
├── tailwind.config.js               # Tailwind CSS configuration (if used)
└── README.md
```

**Netlify Build Requirements:**

**What Netlify NEEDS (for build):**
- ✅ `src/` - Source code (Next.js 15 App Router pages and components)
- ✅ `public/` - Static assets (images, fonts, favicons)
- ✅ `scripts/` - Build scripts (if called during Netlify build commands)
- ✅ `package.json` - Dependencies and build scripts
- ✅ `next.config.js` - Next.js configuration
- ✅ `tsconfig.json` - TypeScript compiler configuration
- ✅ `tailwind.config.js` - Tailwind CSS configuration (if using Tailwind)
- ✅ `content.json` - Pre-exported Airtable data including AI-generated content (committed to Git)

**What Netlify DOESN'T NEED (development/documentation only):**
- ❌ `.bmad-core/` - BMAD framework (tasks, templates, agents) - development/planning only
- ❌ `.claude/` - Claude Code configuration - development only
- ❌ `docs/` - Architecture, PRD, ADRs, specs - documentation only
- ❌ `tests/` - Test files (run in CI, not Netlify build)

**Note:**
- Netlify clones the entire repository but only uses necessary folders for the build.
- Development/documentation folders (`.bmad-core/`, `.claude/`, `docs/`) are **ignored during build** (no impact on build time or bundle size).
- These folders are valuable for **development, planning, and team collaboration**, so we keep them in Git.
- Tests run in **GitHub Actions CI** (on PR), not during Netlify build (faster builds).

---

**Key Directories Explained:**

**`src/app/`** - Next.js 15 App Router pages and layouts
- Dynamic routes: `[service]/[location]/page.tsx` generates 500+ pages
- Static metadata via `generateMetadata()` for SEO
- Uses `export const dynamic = 'force-static'` (required for static export)

**`src/components/`** - Reusable React components
- `ThreeStageForm/` - Progressive form with localStorage persistence
- `TrustBar/`, `Gallery/`, `FAQ/` - AI-generated conversion components
- `LazySection/` - Intersection Observer wrapper for below-fold lazy loading

**`src/lib/`** - Utilities and API clients
- `airtable.ts` - Airtable SDK (build-time data fetching)
- `claude.ts` - Claude API client (build-time AI generation)
- `makeWebhook.ts` - Form submission utilities
- `imageLoader.ts` - Custom image optimization loader

**`scripts/`** - Build-time automation
- `export-airtable-to-json.js` - Export Airtable to JSON (eliminates API dependency during build)
- `optimize-images.js` - Sharp-based image optimization (AVIF, WebP, JPEG)
- `extract-critical-css.js` - Critical CSS extraction per page

**`tests/`** - All test files (unit, integration, E2E)
- Separate from source code for clarity
- Playwright for E2E testing (preferred for Next.js 15)
- Run in GitHub Actions CI, NOT during Netlify build

---

# Tech Stack

## Overview

This section documents all technology choices with specific versions, configurations, and rationale for selection. Each technology is locked with version constraints to ensure build reproducibility and predictable behavior.

## Frontend Technologies

### Next.js 15 (App Router)

**Version:** `^15.5.0` (**Updated from 15.0.0** - allows minor updates for bug fixes)

**Purpose:** Static site generation framework, React Server Components, file-based routing

**What's New in 15.5:**
- Performance improvements for static export builds
- Bug fixes for async params handling
- Enhanced Turbopack stability
- React 19.2 compatibility improvements

**Configuration (`next.config.js`):**
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Static export mode (NO serverless functions)

  // Disable features not supported in static export
  images: {
    unoptimized: true, // next/image doesn't work with output: 'export'
  },

  // Memory optimization for large static builds
  experimental: {
    webpackMemoryOptimizations: true,
  },

  // Optional: Multi-client support (if needed)
  // basePath: process.env.CLIENT_BASE_PATH || '',

  // SEO optimization
  trailingSlash: true, // Ensures consistent URLs (e.g., /service/location/ not /service/location)

  // Disable source maps in production (smaller bundle)
  productionBrowserSourceMaps: false,
}

module.exports = nextConfig
```

**Breaking Changes from Next.js 14:**
- ✅ `params` is now async (must `await params` in page components)
- ✅ `searchParams` NOT supported in static export (must use path-based routing)
- ✅ Caching no longer default (must explicitly use `export const dynamic = 'force-static'`)
- ✅ GET Route Handlers not cached by default

**Migration Strategy:**
```typescript
// ❌ OLD (Next.js 14)
export default function Page({ params }) {
  const { service, location } = params
}

// ✅ NEW (Next.js 15)
export default async function Page({ params }) {
  const { service, location } = await params
}
```

**Alternatives Considered:**
- **Gatsby:** Rejected - GraphQL complexity, smaller community, slower builds
- **Astro:** Rejected - Less mature, limited React ecosystem integration
- **Next.js 14:** Considered fallback if Next.js 15 issues found in Epic 0.1

**Validation Status:** ✅ Community testing shows 5000+ pages successfully built with static export

---

### React 19

**Version:** `^19.2.0` (**Updated from 19.0.0** - latest stable with improvements)

**Purpose:** UI library, component composition, client-side interactivity

**What's New in 19.2:**
- Improved Server Components stability
- Performance optimizations for static generation
- Enhanced error boundaries and debugging
- Bug fixes for async transitions

**Key Features Used:**
- React Server Components (RSC) for static generation
- Client Components for forms and interactive elements
- Suspense boundaries for lazy loading
- Error boundaries for graceful error handling
- New hooks: `useActionState`, `useFormStatus`, `useOptimistic`

**Configuration:**
```typescript
// Mark interactive components as client components
'use client'

export function ThreeStageForm() {
  // Client-side state, form logic, localStorage
}
```

**Why React 19.2:**
- Next.js 15.5 ships with React 19.2 by default
- Server Components improve static generation performance
- Suspense/lazy loading critical for LCP optimization
- Latest stability improvements and bug fixes

---

### TypeScript

**Version:** `^5.9.0` (**Updated from ^5.3.0** - latest stable with new features)

**Purpose:** Type safety, IDE autocomplete, runtime error prevention

**What's New in 5.9:**
- Performance improvements for large codebases
- Enhanced type inference
- Better error messages
- Improved module resolution

**Configuration (`tsconfig.json`):**
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

**Type Safety Enforcement:**
- `strict: true` - All strict checks enabled
- No `any` types without explicit justification
- All external API responses typed (Airtable, Claude, Make.com)

---

### Tailwind CSS v4.0

**Version:** `^4.0.0` (**UPGRADED from v3.4** - major performance gains)

**Purpose:** Utility-first CSS framework, design system, responsive design

**What's New in v4.0:**
- ✅ **5x faster full builds, 100x faster incremental builds**
- ✅ Built on modern CSS features (cascade layers, `@property`, `color-mix()`)
- ✅ **Zero configuration required** - automatic content detection
- ✅ **CSS-first configuration** - no more JavaScript config file
- ✅ Simplified installation (fewer dependencies)
- ✅ First-party Vite plugin with tight integration

**Rationale:**
- ✅ Utility-first = faster development
- ✅ Native CSS purging = smaller bundles (critical for LCP)
- ✅ Consistent design system with minimal custom CSS
- ✅ Build-time CSS generation (no runtime overhead)
- ✅ Performance improvements critical for 500+ page builds

**⚠️ Breaking Changes from v3:**
- **Browser Support:** Safari 16.4+, Chrome 111+, Firefox 128+ (drops older browsers)
- **No CSS Preprocessors:** Not designed for Sass/Less/Stylus
- **CSS-first Configuration:** JavaScript config replaced with CSS `@theme`
- **New Import Syntax:** `@import "tailwindcss"` instead of `@tailwind` directives
- **Automatic Content Detection:** No manual `content` paths configuration

**Installation:**
```bash
npm install tailwindcss@4 @tailwindcss/postcss
```

**PostCSS Configuration (`postcss.config.mjs`):**
```javascript
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}
```

**CSS Configuration (`src/styles/globals.css`):**
```css
/* Import Tailwind CSS v4 */
@import "tailwindcss";

/* CSS-first theme configuration (replaces tailwind.config.js) */
@theme {
  /* Custom brand colors per client */
  --color-primary: #0ea5e9;
  --color-secondary: #8b5cf6;

  /* Custom font family */
  --font-sans: 'Inter', system-ui, sans-serif;
}

/* Custom utilities (if needed) */
@utility tab-2 {
  tab-size: 2;
}
```

**Next.js 15 Integration (`src/app/layout.tsx`):**
```tsx
import './globals.css' // Imports Tailwind CSS v4

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

**Plugins (Updated for v4):**
```bash
npm install @tailwindcss/forms@next @tailwindcss/typography@next
```

```css
/* In globals.css */
@import "tailwindcss";
@plugin "@tailwindcss/forms";
@plugin "@tailwindcss/typography";
```

**Critical CSS Strategy (with Beasties):**
- Extract critical CSS per page (inline in `<head>`)
- Defer full Tailwind CSS until after LCP
- v4's smaller output (~30% reduction) improves LCP naturally

**Migration from v3.4 to v4.0 (For Existing Projects Only):**
```bash
# Automated migration tool (Node.js 20+ required)
# ⚠️ NOT NEEDED for this greenfield project - install v4 directly
npx @tailwindcss/upgrade@next
```

**For This Greenfield Project:**
Since we're starting fresh, **no migration needed**. Just install Tailwind v4.0 directly with the configuration examples above.

**Setup Checklist (Greenfield Project):**
- [ ] Install `tailwindcss@4 @tailwindcss/postcss postcss`
- [ ] Install plugins: `@tailwindcss/forms@next @tailwindcss/typography@next`
- [ ] Create `postcss.config.mjs` with `@tailwindcss/postcss`
- [ ] Create `src/styles/globals.css` with `@import "tailwindcss"`
- [ ] Add `@theme` configuration in `globals.css`
- [ ] Import `globals.css` in `src/app/layout.tsx`
- [ ] Verify browser compatibility targets (Safari 16.4+, Chrome 111+, Firefox 128+)

**Browser Compatibility Warning:**
- ⚠️ Drops support for browsers older than Safari 16.4, Chrome 111, Firefox 128
- ✅ Modern browsers only (2023+)
- ✅ Acceptable for paid traffic landing pages (high-quality audience)

**Alternatives Considered:**
- **CSS Modules:** More verbose, no utility classes, harder to maintain design system
- **styled-components:** Runtime CSS-in-JS overhead (bad for LCP)
- **Vanilla CSS:** No design system, naming conflicts, harder to scale
- **Tailwind v3:** Slower builds, more configuration, considered but v4 performance wins

---

## Build-Time Technologies

### Sharp (Image Optimization)

**Version:** `^0.34.4` (**Updated from ^0.33.0** - latest performance improvements)

**Purpose:** Build-time image optimization (AVIF, WebP, JPEG), resize, compress

**What's New in 0.34:**
- Faster AVIF encoding (15-20% performance improvement)
- Enhanced WebP compression
- Updated libvips library
- Better memory management for large batches

**Why Sharp:**
- Next.js Image component doesn't work with `output: 'export'`
- Sharp is the fastest Node.js image processing library
- Supports modern formats (AVIF, WebP) for LCP optimization

**Implementation (`scripts/optimize-images.js`):**
```javascript
const sharp = require('sharp')
const fs = require('fs/promises')
const path = require('path')

async function optimizeImage(inputPath, outputDir) {
  const filename = path.basename(inputPath, path.extname(inputPath))

  // Generate AVIF (smallest, best compression)
  await sharp(inputPath)
    .avif({ quality: 80 })
    .toFile(path.join(outputDir, `${filename}.avif`))

  // Generate WebP (fallback for Safari < 14)
  await sharp(inputPath)
    .webp({ quality: 85 })
    .toFile(path.join(outputDir, `${filename}.webp`))

  // Generate JPEG (fallback for old browsers)
  await sharp(inputPath)
    .jpeg({ quality: 85, progressive: true })
    .toFile(path.join(outputDir, `${filename}.jpg`))
}

// Run during build: npm run optimize-images
```

**Output Structure:**
```
public/images/
├── hero-background.avif    # 120KB (best)
├── hero-background.webp    # 180KB (fallback)
└── hero-background.jpg     # 350KB (legacy)
```

**Usage in Components:**
```tsx
<picture>
  <source srcSet="/images/hero-background.avif" type="image/avif" />
  <source srcSet="/images/hero-background.webp" type="image/webp" />
  <img src="/images/hero-background.jpg" alt="Hero background" />
</picture>
```

---

### Beasties (Critical CSS Extraction)

**Version:** `^0.1.0` (**REPLACED Critters** - actively maintained fork)

**Purpose:** Extract and inline critical CSS per page for LCP optimization

**Why Beasties (not Critters):**
- ✅ Critters is **ARCHIVED** by GoogleChromeLabs (no longer maintained)
- ✅ Beasties is the actively maintained fork by Nuxt team
- ✅ Drop-in replacement with same API
- ✅ Continued bug fixes and performance improvements

**Migration from Critters:**
- **Before:** `npm install critters`
- **After:** `npm install beasties`
- API is identical, just replace package name

**Features:**
- Automatically detects above-the-fold CSS
- Inlines critical CSS in `<head>`
- Defers non-critical CSS loading
- Integrates with Next.js build pipeline
- Faster than headless browser approaches

**Configuration (via Next.js plugin):**
```javascript
// next.config.js
const withBeasties = require('beasties')

module.exports = withBeasties({
  beasties: {
    preload: 'swap', // Preload non-critical CSS
    inlineFonts: true, // Inline critical font CSS
  },
  // ... other Next.js config
})
```

**Impact:**
- Estimated LCP improvement: 0.3-0.8s
- Above-the-fold CSS: ~5-10KB (inlined)
- Below-the-fold CSS: ~50-100KB (deferred)

**Migration Status:** ✅ **CRITICAL** - Must replace Critters before implementation

---

## External Services & APIs

### Airtable SDK

**Version:** `^0.12.2` (**Updated from ^0.12.0** - latest available, but stale)

**Purpose:** Fetch content from Airtable during pre-build phase

**Usage:** Build-time ONLY (NOT runtime)

**⚠️ Note:** Package last updated 2 years ago (2023). Consider MCP server alternative (see below).

**Configuration:**
```javascript
// src/lib/airtable.ts
import Airtable from 'airtable'

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY })
  .base(process.env.AIRTABLE_BASE_ID)

export async function fetchAllPages() {
  const records = await base('Pages')
    .select({ view: 'Approved' })
    .all()

  return records.map(record => ({
    service: record.get('Service'),
    location: record.get('Location'),
    // ... other fields
  }))
}

// Called in scripts/export-airtable-to-json.js (pre-build)
```

**Rate Limits:**
- 5 requests/second per base
- Mitigation: Export to JSON, commit to Git

---

### Airtable REST API (Direct Integration)

**API Version:** v0 (stable)

**Purpose:** Direct API integration for build-time data export and record management

**Why REST API:**
- ✅ Reliable and well-documented
- ✅ Works with any programming language
- ✅ No additional dependencies or MCP servers required
- ✅ Production-ready with official support
- ✅ Fine-grained control over data operations

**Authentication:** Personal Access Token (PAT) or API Key

**Base Configuration:**
```bash
# Environment Variables (.env.local)
AIRTABLE_API_KEY=patR2szOO0tU7ZsP2.your_token_here
AIRTABLE_BASE_ID=appATvatPtaoJ8MmS
```

**Key Endpoints:**

1. **List Records:**
   ```
   GET https://api.airtable.com/v0/{baseId}/{tableName}
   ```

2. **Get Record:**
   ```
   GET https://api.airtable.com/v0/{baseId}/{tableName}/{recordId}
   ```

3. **Create Records:**
   ```
   POST https://api.airtable.com/v0/{baseId}/{tableName}
   ```

4. **Update Records:**
   ```
   PATCH https://api.airtable.com/v0/{baseId}/{tableName}
   ```

**Usage Example (Node.js with Airtable SDK):**
```javascript
// Using the official Airtable.js SDK (recommended)
import Airtable from 'airtable'

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY })
  .base(process.env.AIRTABLE_BASE_ID)

// Fetch approved pages
const records = await base('Pages')
  .select({
    view: 'Approved',
    filterByFormula: 'AND({Status} = "Approved", {Published} = TRUE())',
    fields: ['Service ID', 'Location ID', 'SEO Title', 'H1 Headline']
  })
  .all()
```

**Usage Example (Direct REST API with fetch):**
```javascript
// Direct API call without SDK
const response = await fetch(
  `https://api.airtable.com/v0/${baseId}/Pages`,
  {
    headers: {
      'Authorization': `Bearer ${process.env.AIRTABLE_API_KEY}`,
      'Content-Type': 'application/json'
    }
  }
)
const data = await response.json()
```

**Rate Limits:**
- 5 requests/second per base
- Mitigation: Batch operations, export to JSON for build-time use

**Required Scopes (for Personal Access Tokens):**
- `data.records:read` - Read records (required)
- `data.records:write` - Create/update records (required for automation)
- `schema.bases:read` - Read schema (optional, for validation)

**Use Cases:**
- Pre-build: Export approved pages to JSON
- Development: Create test records, validate data
- Automation: Update page status, trigger workflows
- Integration: Connect with GitHub Actions, Netlify build hooks

**Decision:** Use REST API with official Airtable SDK for all operations. No MCP server required.

---

### Anthropic Claude API

**Version:** SDK `^0.65.0` (**CRITICAL UPDATE from ^0.20.0** - Claude 4 support)

**API Model:** `claude-sonnet-4-5-20250929` (**Latest Claude Sonnet 4.5**)

**Purpose:** Generate AI content (Trust Bar, Gallery, FAQ) during pre-build

**Usage:** Build-time ONLY (NOT runtime)

**What's New in SDK 0.65:**
- ✅ Claude 4 model family support (Sonnet 4.5, Opus 4.0, Opus 4.1)
- ✅ Improved streaming performance
- ✅ Enhanced tool integration with Zod schema support
- ✅ Better error handling and retry logic
- ✅ TypeScript improvements

**Why Claude Sonnet 4.5:**
- Faster than previous models (better for batch generation)
- Improved instruction following
- Better structured output generation
- Cost-effective for high-volume content generation

**Configuration:**
```javascript
// src/lib/claude.ts
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function generateTrustBar(service: string, location: string) {
  const message = await client.messages.create({
    model: 'claude-sonnet-4-5-20250929', // Updated model
    max_tokens: 1024,
    messages: [{
      role: 'user',
      content: `Generate 5 trust signals for ${service} in ${location}...`
    }]
  })

  return message.content[0].text
}

// Called in scripts/generate-ai-content.js (pre-build)
```

**Cost Estimation (Claude Sonnet 4.5):**
- 500 pages × 3 sections = 1500 API calls
- ~2K tokens per call @ $0.003/1K input + $0.015/1K output
- Estimated: $0.75-1.50 per build (depends on output length)

**Migration Status:** ✅ **CRITICAL** - SDK 0.20 lacks Claude 4 model support

---

### Make.com Webhook

**Version:** N/A (REST API)

**Purpose:** Form submission → Salesforce lead creation

**Usage:** Runtime (client-side POST from form)

**Configuration:**
```javascript
// src/lib/makeWebhook.ts
export async function submitFormToMake(payload: FormData) {
  const response = await fetch(process.env.NEXT_PUBLIC_MAKE_WEBHOOK_URL!, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error('Form submission failed')
  }

  return response.json()
}
```

**Payload:** See `docs/salesforce-integration-strategy.md` for full parameter list

---

## Analytics & Tracking

### Google Tag Manager (GTM)

**Version:** N/A (Script tag)

**Purpose:** Tag management, conversion tracking, third-party script orchestration

**Implementation (`src/app/layout.tsx`):**
```tsx
import Script from 'next/script'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* GTM - Deferred to preserve LCP */}
        <Script
          id="gtm"
          strategy="lazyOnload" // Load AFTER LCP
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GTM_ID}');
            `
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
```

**Key Events Tracked:**
- `form_start` - User begins Stage 1
- `form_stage_2` - User advances to Stage 2
- `form_stage_3` - User advances to Stage 3
- `form_submit` - Form submitted successfully
- `form_error` - Form submission failed

---

### CallRail Dynamic Number Insertion

**Version:** N/A (Script tag)

**Purpose:** Track phone calls from landing pages with dynamic number swapping

**Implementation:**
```tsx
<Script
  src={`https://cdn.callrail.com/companies/${process.env.NEXT_PUBLIC_CALLRAIL_COMPANY_ID}/` +
       `${process.env.NEXT_PUBLIC_CALLRAIL_SCRIPT_ID}/12/swap.js`}
  strategy="lazyOnload" // Load AFTER LCP
/>
```

**Note:** Static sites + dynamic numbers = complex. See ADR-023 for implementation strategy.

---

### Google Analytics 4 (GA4)

**Version:** N/A (gtag.js via GTM)

**Purpose:** Page views, user behavior, conversion funnel tracking

**Implementation:** Managed via GTM (no direct script tag)

**Key Metrics Tracked:**
- Page views (service, location combinations)
- Form funnel (3-stage progression)
- Conversion events (form submissions)
- User demographics (age, location, device)

---

## Development Tools

### ESLint + Prettier

**Versions:**
- `eslint: ^10.0.0` (**MAJOR UPDATE from ^8.57.0** - flat config required)
- `prettier: ^5.0.0` (**MAJOR UPDATE from ^3.2.0** - 2.5x faster)
- `eslint-config-prettier: ^10.1.8` (Updated compatibility)
- `eslint-plugin-prettier: ^5.5.4` (Updated integration)

**Purpose:** Code quality, consistent formatting

**What's New:**
- **ESLint 10:** Flat config system (`eslint.config.js`), better performance, improved error messages
- **Prettier 5:** 2.5x faster formatting, better TypeScript support, enhanced plugin system

**⚠️ Breaking Changes:**
- ESLint 10 requires migration from `.eslintrc.js` to `eslint.config.js`
- Flat config uses different syntax (see below)

**Configuration (`eslint.config.js` - NEW FORMAT):**
```javascript
import js from '@eslint/js'
import typescript from '@typescript-eslint/eslint-plugin'
import typescriptParser from '@typescript-eslint/parser'
import prettier from 'eslint-config-prettier'

export default [
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': typescript,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
  prettier, // Disables conflicting ESLint rules
]
```

**Prettier Configuration (`.prettierrc.json` - UNCHANGED):**
```json
{
  "semi": false,
  "singleQuote": true,
  "trailingComma": "es5",
  "tabWidth": 2,
  "printWidth": 100
}
```

**Migration Status:** ⚠️ **REQUIRED** - Must migrate to flat config before using ESLint 10

---

### Playwright (E2E Testing)

**Version:** `^1.55.0` (**Updated from ^1.41.0** - latest with AI agent features)

**Purpose:** End-to-end testing, form submission testing, accessibility testing

**What's New in 1.55:**
- ✅ **Playwright Agents** - AI-assisted test generation (planner, generator, healer)
- ✅ Enhanced `locator.describe()` for better element inspection
- ✅ `expect(locator).toContainClass()` for class assertions
- ✅ Improved error debugging and stack traces
- ✅ Performance improvements

**Why Playwright:**
- Official Next.js recommendation for App Router
- Cross-browser testing (Chromium, Firefox, WebKit)
- Built-in accessibility testing
- Screenshot comparison for visual regression
- AI-assisted test generation (NEW in 1.55)

**Configuration (`playwright.config.ts`):**
```typescript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  use: {
    baseURL: 'http://localhost:3000',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['iPhone 13'] } },
  ],
})
```

**Key Tests:**
- 3-stage form progression
- Form validation
- Accessibility (WCAG 2.1 AA)
- LCP measurement
- AI-generated test healing (auto-repair failing tests)

---

## Environment Variables

**Required Variables:**

```bash
# .env.local (Development)
AIRTABLE_API_KEY=keyXXXXXXXXXXXXXX
AIRTABLE_BASE_ID=appXXXXXXXXXXXXXX
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxx
NEXT_PUBLIC_MAKE_WEBHOOK_URL=https://hook.us1.make.com/xxxxx
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6LcXXXXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
NEXT_PUBLIC_CALLRAIL_COMPANY_ID=123456789
NEXT_PUBLIC_CALLRAIL_SCRIPT_ID=987654321
NEXT_PUBLIC_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
```

**Security Notes:**
- `NEXT_PUBLIC_*` variables are exposed to client-side code (safe for public keys)
- Airtable/Anthropic keys are build-time only (never exposed to client)
- Make.com webhook URL is obscure (not guessable), verified via reCAPTCHA server-side

---

## Technology Decision Summary

| Category | Technology | Old Version | **New Version** | Update Type | Rationale |
|----------|-----------|-------------|----------------|-------------|-----------|
| **Framework** | Next.js 15 | 15.0.0 | **^15.5.0** | ⚠️ Minor | Bug fixes, React 19.2 compatibility |
| **UI Library** | React | 19.0.0 | **^19.2.0** | ⚠️ Minor | Stability improvements, bug fixes |
| **Language** | TypeScript | ^5.3.0 | **^5.9.0** | ⚠️ Minor | Performance, better type inference |
| **Styling** | Tailwind CSS | ^3.4.0 | **^4.0.0** | 🚨 Major | 5x faster builds, modern CSS only |
| **Images** | Sharp | ^0.33.0 | **^0.34.4** | ⚠️ Minor | 15-20% faster AVIF encoding |
| **Critical CSS** | Critters | ^0.0.20 | **Beasties ^0.1.0** | 🚨 Replace | Critters archived, Beasties maintained |
| **Content Source** | Airtable SDK | ^0.12.0 | **^0.12.2** | ⚠️ Patch | Latest available (stale package) |
| **AI Content** | Claude API | ^0.20.0 | **^0.65.0** | 🚨 Major | Claude 4 support (CRITICAL) |
| **Forms** | Make.com | N/A | N/A | ✅ Keep | Runtime form submission → Salesforce |
| **Analytics** | GTM + GA4 | N/A | N/A | ✅ Keep | Conversion tracking, deferred loading |
| **Phone Tracking** | CallRail | N/A | N/A | ✅ Keep | Dynamic number insertion |
| **Testing** | Playwright | ^1.41.0 | **^1.55.0** | ⚠️ Minor | AI agents, test healing |
| **Linting** | ESLint | ^8.57.0 | **^10.0.0** | 🚨 Major | Flat config (breaking change) |
| **Formatting** | Prettier | ^3.2.0 | **^5.0.0** | 🚨 Major | 2.5x faster, better TS support |

**Legend:**
- ✅ Keep = No update needed
- ⚠️ Minor/Patch = Safe update, backward compatible
- 🚨 Major = Breaking changes, requires migration
- ➕ Add = New tool/service

---

## Migration Priority

### 🚨 Critical (Before Implementation):
1. **Anthropic SDK ^0.20.0 → ^0.65.0** - Claude 4 model support required
2. **Critters → Beasties** - Original package deprecated/archived
3. **Tailwind CSS v3.4 → v4.0** - 5x faster builds (breaking changes)

### ⚠️ High Priority (Before Production):
4. **ESLint 8 → 10** - Migrate to flat config (`eslint.config.js`)
5. **Prettier 3 → 5** - 2.5x performance improvement
6. **Next.js 15.0 → 15.5** - Bug fixes and stability
7. **React 19.0 → 19.2** - Latest improvements

### ✅ Medium Priority (Recommended):
8. **TypeScript 5.3 → 5.9** - Better performance and type inference
9. **Sharp 0.33 → 0.34** - Faster image optimization
10. **Playwright 1.41 → 1.55** - AI test generation features
11. **Airtable SDK 0.12.0 → 0.12.2** - Latest patch

---

## Updated package.json Dependencies

```json
{
  "dependencies": {
    "next": "^15.5.0",
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "sharp": "^0.34.4",
    "tailwindcss": "^4.0.0",
    "@tailwindcss/postcss": "^4.0.0",
    "@tailwindcss/forms": "next",
    "@tailwindcss/typography": "next",
    "airtable": "^0.12.2",
    "@anthropic-ai/sdk": "^0.65.0"
  },
  "devDependencies": {
    "typescript": "^5.9.0",
    "@playwright/test": "^1.55.0",
    "eslint": "^10.0.0",
    "prettier": "^5.0.0",
    "eslint-config-prettier": "^10.1.8",
    "eslint-plugin-prettier": "^5.5.4",
    "beasties": "^0.1.0",
    "@typescript-eslint/eslint-plugin": "^8.0.0",
    "@typescript-eslint/parser": "^8.0.0",
    "postcss": "^8.4.0"
  }
}
```

**Note:** Tailwind CSS v4.0 plugins use `@next` tag for compatibility.

---

## Data Models

### Overview

The system uses three distinct data storage strategies:

1. **Airtable (Source of Truth)** - Content management and client configuration
2. **Static JSON (Build-Time)** - Pre-exported content for Next.js builds
3. **Make.com + Salesforce (Runtime)** - Lead capture and CRM integration

**Data Flow:** Airtable → JSON Export → Next.js Build → Static HTML → User Interaction → Make.com → Salesforce

---

### 1. Airtable Data Model

> **⚠️ IMPORTANT - BACKEND SCHEMA STATUS:**
>
> **✅ AIRTABLE BACKEND IS COMPLETE AND PRODUCTION-READY**
>
> The Airtable base structure with all 12 tables, relationships, rollup fields, and automations has been **fully built and tested**.
>
> **🔒 Schema is LOCKED:**
> - Dev should **NOT modify the schema** (add/remove/change tables or fields) without explicit approval from Owner and Architect
> - Dev should **ONLY use the Airtable API** to create, read, and update records within the existing structure
> - Any schema changes require coordination with the Owner and Architect to ensure system integrity
>
> **📖 Full Schema Reference:** See `Archive/airtable-schema-phase1.md` for complete field definitions, relationships, automations, and examples.

**Base Name:** `Landing Pages Content Management`

**Base ID:** `appATvatPtaoJ8MmS`

**Purpose:** Central content repository managed by non-technical stakeholders

**Schema Status:** Phase 1 MVP - Production Ready (12 tables, 3,000 page capacity)

**Tables:** 12 core tables organized into 3 categories

#### Table Structure Overview

**FOUNDATION TABLES** (6 tables)
1. **Clients** - Business information, branding, tracking IDs, contact info
2. **Services** - Service definitions with keyword grouping for SEO
3. **Locations** - Validated city master data with demographics
4. **Branch Locations** - Physical office locations with timezone support
5. **Service Areas** - Junction table (which branches serve which cities)
6. **Branch Staff** - Team member profiles for AI personalization

**CORE CONTENT TABLE** (1 table)
7. **Pages** - Landing page content and workflow management (50+ fields including auto-matched branch data, AI-generated content, SEO metadata)

**CONTENT LIBRARIES** (3 tables)
8. **CTAs** - Call-to-action library for AI selection
9. **Hero Images Library** - Image asset management with categorization
10. **Testimonials** - Customer reviews with service/branch targeting

**MARKETING TABLES** (2 tables)
11. **Offers** - Promotional campaigns with targeting rules
12. **Campaigns** - Marketing campaign tracking and UTM management

**Key Features:**
- ✅ Auto-number primary keys on all tables
- ✅ Linked records for relationships (Foreign Keys)
- ✅ 14 rollup fields for aggregated counts and metadata
- ✅ Formula fields for URL generation, slugs, and computed values
- ✅ 3 automations ready: Auto-Match Branch, Trigger AI Generation, Export on Approval
- ✅ Multiple views per table for different workflows

**For detailed field specifications, relationships, example records, and automation logic, see:**
📄 `Archive/airtable-schema-phase1.md` (Complete 1,700+ line schema specification)

#### Detailed Table Specifications

The complete field-by-field specifications for all 12 tables are documented in the archived schema file. This includes:

- Complete field lists with types, required/optional flags, and examples
- Formula field definitions (URL slugs, unique keys, computed values)
- Lookup and rollup field configurations
- Relationship mappings between tables
- View configurations for each table
- Example records for reference
- Automation logic specifications

**See:** `Archive/airtable-schema-phase1.md` for full details on:
- Foundation Tables (Clients, Services, Locations, Branch Locations, Service Areas, Branch Staff)
- Core Content Table (Pages with 50+ fields)
- Content Libraries (CTAs, Hero Images Library, Testimonials)
- Marketing Tables (Offers, Campaigns)

---

### 2. Static JSON Data Model

**Generated by:** `scripts/export-airtable-to-json.js`

**Location:** `/content.json` (project root, gitignored)

**Purpose:** Pre-exported content consumed by Next.js at build time (no runtime API calls)

#### Schema: `content.json`

```json
{
  "clients": [
    {
      "clientId": 42,
      "clientName": "Baths R Us",
      "domain": "https://bathsrus.com",
      "branding": {
        "primaryColor": "#0ea5e9",
        "secondaryColor": "#8b5cf6",
        "logoUrl": "https://res.cloudinary.com/client-logo.png",
        "googleFonts": "Inter"
      },
      "contact": {
        "phone": "(704) 555-1234",
        "email": "info@bathsrus.com"
      },
      "tracking": {
        "gtmId": "GTM-XXXXXXX",
        "callrailSwapTarget": "CR-123456",
        "recaptchaSiteKey": "6Lc...",
        "salesforceCampaignId": "7012A000000ABCD"
      },
      "webhooks": {
        "makeWebhookUrl": "https://hook.us1.make.com/abc123"
      }
    }
  ],
  "pages": [
    {
      "pageId": 1234,
      "service": "bathroom-remodeling",
      "location": "charlotte",
      "clientName": "Baths R Us",
      "seo": {
        "title": "Bathroom Remodeling Charlotte NC | Baths R Us",
        "description": "Top-rated bathroom remodeling in Charlotte...",
        "canonical": "https://bathsrus.com/bathroom-remodeling/charlotte"
      },
      "hero": {
        "h1": "Transform Your Bathroom in Charlotte",
        "subheadline": "Licensed, insured, and trusted by 500+ homeowners",
        "ctaText": "Get Free Quote",
        "ctaUrl": null,
        "imageUrl": "https://res.cloudinary.com/hero-image.jpg"
      },
      "contentBlocks": [
        {
          "blockId": 789,
          "blockType": "Feature",
          "heading": "Licensed & Insured",
          "bodyText": "Fully licensed contractors with $2M insurance",
          "iconName": "shield-check",
          "imageUrl": null,
          "order": 1,
          "aiGenerated": true
        }
      ],
      "metadata": {
        "createdDate": "2025-01-08T10:00:00Z",
        "lastModified": "2025-01-09T14:30:00Z"
      }
    }
  ],
  "exportMetadata": {
    "exportDate": "2025-01-09T15:00:00Z",
    "totalPages": 500,
    "totalClients": 25,
    "exportDurationMs": 12340
  }
}
```

**Size Estimate:** ~500KB for 500 pages (1KB per page average)

---

### 3. Form Submission Data Model

**Transmitted via:** AJAX POST to Make.com webhook

**Destination:** Make.com → Salesforce Lead object

**Protocol:** JSON over HTTPS

#### Schema: Form Payload (Client → Make.com)

```json
{
  "leadData": {
    "fullName": "Victoria Smith",
    "phoneNumber": "46654767492",
    "email": "victoria@gmail.com",
    "zipCode": "28202",
    "jobType": "Full bathroom remodel",
    "howDidYouHear": "Online Search",
    "commentsOrQuestions": "Interested in walk-in shower conversion"
  },
  "utm": {
    "source": "google",
    "medium": "cpc",
    "campaign": "remodel-charlotte",
    "term": "bathroom remodeling charlotte",
    "content": "ad-variant-a"
  },
  "clickIds": {
    "gclid": "EAIaIQobChMI...",
    "gclidTimestamp": 1704729600000,
    "fbclid": null
  },
  "session": {
    "clientId": "GA1.1.123456789.1704729600",
    "sessionId": "1704729600",
    "landingPageUrl": "https://bathsrus.com/bathroom-remodeling/charlotte",
    "pageUrl": "https://bathsrus.com/bathroom-remodeling/charlotte",
    "referrer": "https://www.google.com/"
  },
  "timing": {
    "formStartTime": 1704729650000,
    "formSubmitTime": 1704729720000,
    "timeOnPage": 120,
    "formDuration": 70
  },
  "device": {
    "deviceType": "mobile",
    "browser": "Chrome",
    "viewportWidth": 375,
    "userAgent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0...)"
  },
  "antiSpam": {
    "recaptchaToken": "03AGdBq27X..."
  },
  "metadata": {
    "timestamp": "2025-01-08T15:30:00Z",
    "formVersion": "3-stage-v1",
    "__amp_source_origin": "https://bathsrus.com"
  }
}
```

**See Also:** `docs/salesforce-integration-strategy.md` for complete field mapping and Make.com workflow documentation.

---

### 4. Salesforce Data Model

**Object:** `Lead` (standard Salesforce object)

**Mapped Fields (30+ custom fields):**

| Salesforce Field | Form Source | Type | Notes |
|------------------|-------------|------|-------|
| `FirstName` | `leadData.fullName` (parsed) | Text | Split from full name |
| `LastName` | `leadData.fullName` (parsed) | Text | Split from full name |
| `Phone` | `leadData.phoneNumber` | Phone | Formatted in Make.com |
| `Email` | `leadData.email` | Email | Optional (email stage) |
| `PostalCode` | `leadData.zipCode` | Text | 5-digit US zip |
| `LeadSource` | `utm.source` | Picklist | `google \| facebook \| bing` |
| `Description` | `leadData.commentsOrQuestions` | Long Text | User notes |
| `Campaign__c` | `utm.campaign` | Custom Text | Campaign name |
| `Ad_Group__c` | `utm.content` | Custom Text | Ad variant |
| `Keyword__c` | `utm.term` | Custom Text | Search term |
| `GCLID__c` | `clickIds.gclid` | Custom Text | Google Click ID |
| `Landing_Page__c` | `session.landingPageUrl` | Custom URL | First page in session |
| `Form_Duration__c` | `timing.formDuration` | Custom Number | Seconds to complete form |
| `Time_On_Page__c` | `timing.timeOnPage` | Custom Number | Engagement metric |
| `Device_Type__c` | `device.deviceType` | Custom Picklist | `mobile \| tablet \| desktop` |
| `Lead_Quality_Score__c` | (Calculated in Make.com) | Custom Number | 0-100 score |
| `reCAPTCHA_Score__c` | (Verified in Make.com) | Custom Number | 0.0-1.0 spam score |

**Assignment Rules:** Triggered by Make.com after Lead creation (based on `PostalCode`, `LeadSource`, `Lead_Quality_Score__c`)

---

### Data Validation Rules

#### Airtable Validation (Manual Enforcement)

- **Service slug:** Lowercase, hyphens only, matches URL structure
- **Location slug:** Lowercase, hyphens only, matches URL structure
- **SEO Title:** 50-60 characters (Google SERP limit)
- **SEO Description:** 150-160 characters (Google SERP limit)
- **Phone Number:** Valid US format `(XXX) XXX-XXXX`
- **Email:** Valid email format
- **URL Fields:** Must start with `https://`
- **Hex Colors:** Must start with `#` and be 6-character hex

#### Client-Side Form Validation (React Hook Form + Zod)

```typescript
// src/lib/form-schema.ts
import { z } from 'zod'

export const formSchema = z.object({
  fullName: z.string()
    .min(2, 'Name must be at least 2 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters'),

  phoneNumber: z.string()
    .regex(/^\d{10,11}$/, 'Phone must be 10-11 digits'),

  email: z.string()
    .email('Invalid email format')
    .optional()
    .or(z.literal('')),

  zipCode: z.string()
    .regex(/^\d{5}$/, 'ZIP code must be 5 digits'),

  jobType: z.string()
    .min(1, 'Please select a service'),

  howDidYouHear: z.string()
    .min(1, 'Please select an option'),

  commentsOrQuestions: z.string()
    .max(500, 'Comments must be under 500 characters')
    .optional()
})
```

#### Server-Side Validation (Make.com Scenario)

- **reCAPTCHA Verification:** Score must be ≥ 0.5 (reject if < 0.5)
- **Lead Quality Score:** Calculate based on timing, device, engagement (0-100)
- **Duplicate Detection:** Check Salesforce for existing Lead with same email/phone (within 30 days)
- **Rate Limiting:** Max 10 submissions per IP per hour (anti-spam)

---

### Data Flow Summary

```
┌─────────────────────────────────────────────────────────┐
│  1. AIRTABLE (Source of Truth)                          │
│     - Content managed by stakeholders                   │
│     - Client branding configuration                     │
│     - AI content generation queue                       │
└─────────────────────────────────────────────────────────┘
                        ↓
              [Export Script: Nightly/On-Demand]
                        ↓
┌─────────────────────────────────────────────────────────┐
│  2. STATIC JSON (Build-Time Data)                       │
│     - content.json (500KB for 500 pages)                │
│     - No runtime API calls to Airtable                  │
│     - Consumed by Next.js getStaticPaths/Props          │
└─────────────────────────────────────────────────────────┘
                        ↓
              [Next.js Static Build]
                        ↓
┌─────────────────────────────────────────────────────────┐
│  3. STATIC HTML (Netlify CDN)                           │
│     - 500 pre-rendered pages                            │
│     - Zero runtime dependencies                         │
│     - Form client-side JS hydration                     │
└─────────────────────────────────────────────────────────┘
                        ↓
              [User Form Submission]
                        ↓
┌─────────────────────────────────────────────────────────┐
│  4. MAKE.COM WEBHOOK (Integration Layer)                │
│     - reCAPTCHA verification                            │
│     - Lead quality scoring                              │
│     - Field mapping to Salesforce                       │
└─────────────────────────────────────────────────────────┘
                        ↓
              [Salesforce API via OAuth 2]
                        ↓
┌─────────────────────────────────────────────────────────┐
│  5. SALESFORCE (CRM)                                    │
│     - Lead object with 30+ custom fields               │
│     - Assignment rules (territory-based)                │
│     - Automated notifications to sales reps             │
└─────────────────────────────────────────────────────────┘
```

---

## External APIs

### Overview

The system integrates with 5 external APIs across two distinct phases:

1. **Build-Time APIs** (Pre-deployment) - Content generation and export
2. **Runtime APIs** (Post-deployment) - Form submission and tracking

**Security Model:** API keys stored in environment variables, never exposed to client-side code (except public keys like reCAPTCHA site key, GTM ID)

---

### 1. Airtable API

**Phase:** Build-Time (Pre-deployment)

**Purpose:** Export approved content from Airtable base to static JSON

**Authentication:** API Key (Bearer token)

**Rate Limits:** 5 requests/second per base

**Endpoint:** `https://api.airtable.com/v0/{baseId}/{tableName}`

#### Configuration

```javascript
// src/lib/airtable.ts
import Airtable from 'airtable'

const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY
}).base(process.env.AIRTABLE_BASE_ID)

export async function fetchApprovedPages() {
  const records = await base('Pages')
    .select({
      view: 'Approved',
      fields: ['Service', 'Location', 'SEO Title', 'SEO Description', 'H1 Headline', 'Hero Subheadline', 'CTA Text', 'Hero Image URL', 'Client Name'],
      pageSize: 100
    })
    .all()

  return records.map(record => ({
    pageId: record.id,
    service: record.get('Service'),
    location: record.get('Location'),
    seo: {
      title: record.get('SEO Title'),
      description: record.get('SEO Description')
    },
    hero: {
      h1: record.get('H1 Headline'),
      subheadline: record.get('Hero Subheadline'),
      ctaText: record.get('CTA Text'),
      imageUrl: record.get('Hero Image URL')
    },
    clientName: record.get('Client Name')[0] // Linked record
  }))
}
```

#### Error Handling

```javascript
try {
  const pages = await fetchApprovedPages()
} catch (error) {
  if (error.statusCode === 429) {
    // Rate limit exceeded - wait and retry
    await sleep(1000)
    return fetchApprovedPages()
  } else if (error.statusCode === 401) {
    // Invalid API key
    throw new Error('Airtable API key is invalid')
  } else {
    // Other errors
    throw error
  }
}
```

#### Environment Variables

```bash
# .env.local
AIRTABLE_API_KEY=keyXXXXXXXXXXXXXX
AIRTABLE_BASE_ID=appXXXXXXXXXXXXXX
```

**Security:** API key is server-side only, never committed to Git (gitignored via `.env.local`)

---

### 2. Anthropic Claude API

**Phase:** Build-Time (Pre-deployment)

**Purpose:** Generate AI content (trust signals, features, FAQs) for landing pages

**Authentication:** API Key (x-api-key header)

**Rate Limits:** 50 requests/minute (Tier 1), 4000 requests/minute (Tier 4)

**Model:** `claude-sonnet-4-5-20250929` (Claude Sonnet 4.5)

**Endpoint:** `https://api.anthropic.com/v1/messages`

#### Configuration

```typescript
// src/lib/claude.ts
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function generateTrustSignals(
  service: string,
  location: string,
  clientName: string
): Promise<string[]> {
  const message = await client.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 1024,
    system: 'You are a marketing expert specializing in home services. Generate trust signals that are specific, credible, and localized.',
    messages: [{
      role: 'user',
      content: `Generate 5 trust signals for a ${service} company called "${clientName}" in ${location}.

      Requirements:
      - Each signal must be 8-12 words
      - Must be specific (no generic claims)
      - Must be credible (realistic numbers)
      - Must be localized to ${location}

      Return ONLY a JSON array of strings, no other text.

      Example: ["Licensed & insured with $2M coverage in NC", "500+ bathroom remodels completed in Charlotte area"]`
    }]
  })

  const responseText = message.content[0].text
  return JSON.parse(responseText) // Parse JSON array
}
```

#### Parallel Processing (Batch API)

```typescript
// Process 100 pages in parallel (batches of 10)
export async function generateAllTrustSignals(pages: Page[]) {
  const batchSize = 10
  const results = []

  for (let i = 0; i < pages.length; i += batchSize) {
    const batch = pages.slice(i, i + batchSize)
    const promises = batch.map(page =>
      generateTrustSignals(page.service, page.location, page.clientName)
    )

    const batchResults = await Promise.all(promises)
    results.push(...batchResults)

    // Rate limit protection: wait 1 second between batches
    if (i + batchSize < pages.length) {
      await sleep(1000)
    }
  }

  return results
}
```

#### Error Handling

```typescript
try {
  const trustSignals = await generateTrustSignals(service, location, clientName)
} catch (error) {
  if (error.status === 429) {
    // Rate limit exceeded - exponential backoff
    await sleep(2000)
    return generateTrustSignals(service, location, clientName)
  } else if (error.status === 401) {
    // Invalid API key
    throw new Error('Anthropic API key is invalid')
  } else if (error.status === 500) {
    // Server error - retry once
    await sleep(1000)
    return generateTrustSignals(service, location, clientName)
  } else {
    // Other errors - log and use fallback content
    console.error('Claude API error:', error)
    return getFallbackTrustSignals(service, location)
  }
}
```

#### Environment Variables

```bash
# .env.local
ANTHROPIC_API_KEY=sk-ant-XXXXXXXXXXXXXXXXXXXXXXXX
```

**Cost Estimate:** ~$0.003 per page (500 pages = ~$1.50 per full regeneration)

**Security:** API key is server-side only, never committed to Git

---

### 3. Google reCAPTCHA v3 API

**Phase:** Runtime (Client-side token generation, Server-side verification)

**Purpose:** Prevent spam form submissions

**Authentication:** Site Key (public), Secret Key (server-side verification)

**Endpoint (Verification):** `https://www.google.com/recaptcha/api/siteverify`

#### Client-Side Implementation

```typescript
// src/components/form/ContactForm.tsx
'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'

export default function ContactForm() {
  const [recaptchaLoaded, setRecaptchaLoaded] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Generate reCAPTCHA token
    const token = await window.grecaptcha.execute(
      process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
      { action: 'submit_lead_form' }
    )

    // Include token in form payload
    const payload = {
      ...formData,
      antiSpam: { recaptchaToken: token }
    }

    // POST to Make.com webhook
    const response = await fetch(makeWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
  }

  return (
    <>
      <Script
        src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
        strategy="lazyOnload"
        onLoad={() => setRecaptchaLoaded(true)}
      />
      <form onSubmit={handleSubmit}>
        {/* Form fields */}
      </form>
    </>
  )
}
```

#### Server-Side Verification (Make.com Scenario)

**Make.com HTTP Module:**

```
POST https://www.google.com/recaptcha/api/siteverify
Content-Type: application/x-www-form-urlencoded

secret={{RECAPTCHA_SECRET_KEY}}
&response={{recaptchaToken}}
&remoteip={{userIP}}
```

**Response:**

```json
{
  "success": true,
  "score": 0.9,
  "action": "submit_lead_form",
  "challenge_ts": "2025-01-08T15:30:00Z",
  "hostname": "bathsrus.com"
}
```

**Filtering Rule (Make.com):**
```
IF score < 0.5 THEN
  Return error: "spam_detected"
  Log to Airtable "Failed Submissions" table
  Do NOT create Salesforce Lead
END IF
```

#### Environment Variables

```bash
# .env.local (Client-side - public)
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6LcXXXXXXXXXXXXXXXXXXXXXXXXXXX

# Make.com Environment Variables (Server-side - secret)
RECAPTCHA_SECRET_KEY=6LcXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

**Security:** Site key is public (exposed in HTML), Secret key is server-side only (stored in Make.com)

---

### 4. Make.com Webhook API

**Phase:** Runtime (Form submission intermediary)

**Purpose:** Receive form submissions, verify reCAPTCHA, map to Salesforce, create Lead

**Authentication:** Obscure webhook URL (no API key required)

**Endpoint:** `https://hook.us1.make.com/{unique-webhook-id}`

#### Client-Side POST Request

```typescript
// src/components/form/ContactForm.tsx
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()

  const payload = {
    leadData: { fullName, phoneNumber, email, zipCode, jobType, howDidYouHear, commentsOrQuestions },
    utm: { source, medium, campaign, term, content },
    clickIds: { gclid, gclidTimestamp, fbclid },
    session: { clientId, sessionId, landingPageUrl, pageUrl, referrer },
    timing: { formStartTime, formSubmitTime, timeOnPage, formDuration },
    device: { deviceType, browser, viewportWidth, userAgent },
    antiSpam: { recaptchaToken },
    metadata: { timestamp, formVersion, __amp_source_origin }
  }

  try {
    const response = await fetch(process.env.NEXT_PUBLIC_MAKE_WEBHOOK_URL!, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    const result = await response.json()

    if (result.success) {
      // Show success message
      setFormState('success')
      // Fire GTM conversion event
      window.dataLayer.push({ event: 'form_submit', leadId: result.lead_id })
    } else {
      // Show error message
      setFormState('error')
      setErrorMessage(result.message || 'Submission failed. Please try again.')
    }
  } catch (error) {
    // Network error
    setFormState('error')
    setErrorMessage('Connection error. Please try again or call us directly.')
  }
}
```

#### Make.com Scenario (10-Step Workflow)

**See:** `docs/salesforce-integration-strategy.md` for complete workflow documentation.

**Summary:**
1. **Webhook Received** - Parse JSON payload
2. **Verify reCAPTCHA** - POST to Google API, filter score < 0.5
3. **Calculate Lead Quality Score** - Use timing, device, engagement signals (0-100)
4. **Enrich Data** - Lookup client config from Airtable
5. **Map to Salesforce** - Transform to Salesforce Lead object (30+ fields)
6. **Authenticate** - OAuth 2 with Salesforce (handled by Make.com connection)
7. **Create Lead** - POST to Salesforce API
8. **Send Notifications** - Email, Slack, Airtable backup
9. **Return Response** - Success/error JSON to landing page
10. **Error Handling** - Retry logic, failed leads backup to Airtable

#### Response Format

**Success:**
```json
{
  "success": true,
  "lead_id": "00Q5e000001AbCdEFG",
  "message": "Thank you! We'll contact you within 24 hours."
}
```

**Error (Spam Detected):**
```json
{
  "success": false,
  "error": "spam_detected",
  "message": "We couldn't verify your submission. Please try again or call us directly."
}
```

**Error (Salesforce API Failure):**
```json
{
  "success": false,
  "error": "salesforce_error",
  "message": "We're experiencing technical difficulties. Please call us at (704) 555-1234."
}
```

#### Environment Variables

```bash
# .env.local (Client-side - public, obscure URL is security measure)
NEXT_PUBLIC_MAKE_WEBHOOK_URL=https://hook.us1.make.com/abc123xyz456
```

**Security:** Webhook URL is obscure (not guessable), rate-limited by Make.com, reCAPTCHA verification prevents spam

---

### 5. Salesforce API

**Phase:** Runtime (Make.com → Salesforce integration)

**Purpose:** Create Lead records in Salesforce CRM

**Authentication:** OAuth 2.0 (handled by Make.com Salesforce connection)

**Endpoint:** `https://[instance].salesforce.com/services/data/v60.0/sobjects/Lead`

#### Make.com Salesforce Module Configuration

**Connection Type:** OAuth 2.0 (production Salesforce org)

**API Version:** v60.0 (Spring '25)

**Operation:** Create Lead

**Field Mapping:**

```json
{
  "FirstName": "{{parseFullName.firstName}}",
  "LastName": "{{parseFullName.lastName}}",
  "Phone": "{{formatPhoneNumber.formatted}}",
  "Email": "{{webhook.leadData.email}}",
  "PostalCode": "{{webhook.leadData.zipCode}}",
  "LeadSource": "{{webhook.utm.source}}",
  "Description": "{{webhook.leadData.commentsOrQuestions}}",
  "Campaign__c": "{{webhook.utm.campaign}}",
  "Ad_Group__c": "{{webhook.utm.content}}",
  "Keyword__c": "{{webhook.utm.term}}",
  "GCLID__c": "{{webhook.clickIds.gclid}}",
  "Landing_Page__c": "{{webhook.session.landingPageUrl}}",
  "Form_Duration__c": "{{webhook.timing.formDuration}}",
  "Time_On_Page__c": "{{webhook.timing.timeOnPage}}",
  "Device_Type__c": "{{webhook.device.deviceType}}",
  "Lead_Quality_Score__c": "{{calculateLeadScore.score}}",
  "reCAPTCHA_Score__c": "{{verifyRecaptcha.score}}"
}
```

**Assignment Rules:** Triggered by default Salesforce assignment rules after Lead creation

#### Error Handling (Make.com)

**Duplicate Lead Detection:**
```
IF Salesforce returns "DUPLICATE_VALUE" error THEN
  Search for existing Lead by Email or Phone
  IF Lead found AND created < 30 days ago THEN
    Return success response (don't create duplicate)
  ELSE
    Override duplicate rule and create Lead
  END IF
END IF
```

**API Failure Retry Logic:**
```
TRY
  Create Salesforce Lead
CATCH error
  IF error = "timeout" OR error = "server_error" THEN
    Wait 2 seconds
    Retry (max 3 attempts)
  ELSE
    Log error to Airtable "Failed Submissions" table
    Send Slack alert to #dev-alerts channel
    Return error response to user
  END IF
END TRY
```

#### Environment Variables (Make.com)

**Salesforce OAuth Connection:**
- **Client ID:** (Configured in Make.com Salesforce connection)
- **Client Secret:** (Configured in Make.com Salesforce connection)
- **Instance URL:** `https://customorg.my.salesforce.com`
- **API Version:** `v60.0`

**Security:** OAuth 2 credentials stored securely in Make.com, never exposed to client-side code

---

### API Security Summary

| API | Authentication | Key Storage | Exposure | Rate Limiting |
|-----|----------------|-------------|----------|---------------|
| Airtable API | API Key (Bearer) | `.env.local` (server) | Server-side only | 5 req/sec per base |
| Claude API | API Key (x-api-key) | `.env.local` (server) | Server-side only | 50 req/min (Tier 1) |
| reCAPTCHA (Client) | Site Key (public) | `.env.local` (client) | **Public** (exposed in HTML) | N/A |
| reCAPTCHA (Server) | Secret Key | Make.com env vars | Server-side only | 1000 req/sec |
| Make.com Webhook | Obscure URL | `.env.local` (client) | **Public** (obscure URL) | 10 req/min per IP |
| Salesforce API | OAuth 2.0 | Make.com connection | Server-side only | 15000 req/24hr |

**Critical Security Rules:**
1. ✅ NEVER commit `.env.local` to Git (in `.gitignore`)
2. ✅ NEVER expose `ANTHROPIC_API_KEY`, `AIRTABLE_API_KEY`, or `RECAPTCHA_SECRET_KEY` to client-side
3. ✅ ONLY public keys (`NEXT_PUBLIC_*`) allowed in client-side code
4. ✅ Make.com webhook URL is public but obscure (not guessable)
5. ✅ reCAPTCHA verification MUST happen server-side (Make.com), never trust client-side scores

---

# Components

> **📖 Complete Component Specifications:**
> See **`docs/front-end-spec.md`** for comprehensive component documentation (198KB, 100+ pages)

## Overview

This project uses a component-based architecture with React 19 and Next.js 15. Components are organized into reusable, conversion-optimized modules that work consistently across all generated landing pages.

## Component Structure

The component library is fully documented in `docs/front-end-spec.md` and includes:

### **Conversion Components**
- **ThreeStageForm** - Progressive disclosure form (Stage 1: Contact info, Stage 2: Project details, Stage 3: Timeline/budget)
- **TrustBar** - Dynamic trust signals with icons (licensing, insurance, years in business, reviews)
- **Gallery** - Before/after image slider with lightbox and captions
- **FAQ** - Accordion-style frequently asked questions with structured data
- **Testimonials** - Customer review cards with ratings and location attribution

### **Layout Components**
- **Header** - Navigation with phone number (CallRail dynamic insertion), logo, CTA button
- **Footer** - Links, contact info, schema.org LocalBusiness markup
- **Hero** - Above-fold section with H1, subheadline, CTA, hero image

### **UI Primitives**
- **Button** - Primary, secondary, and urgency variants
- **Input** - Form fields with validation states
- **Modal** - Accessible dialog for lightbox and confirmations

## Component Library Strategy

**Source:** Hybrid approach combining:
- **Headless UI** (`@headlessui/react`) - Unstyled, accessible React components (Dialog, Disclosure, Transition)
- **Tailwind CSS v4** - Utility-first styling system
- **Custom Components** - Built for conversion optimization (not generic UI kit)

**Installation:**
```bash
npm install @headlessui/react
```

**Key Features:**
- ✅ **Server Components by default** - All components are React Server Components unless marked with `'use client'`
- ✅ **Accessibility built-in** - WCAG 2.1 AA compliant (ARIA labels, keyboard navigation, focus management)
- ✅ **Performance-optimized** - Minimal JavaScript, CSS purging, lazy loading for below-fold content
- ✅ **Mobile-first** - All components responsive and touch-optimized for 60%+ mobile traffic

## Component Documentation Location

**Full specifications in `docs/front-end-spec.md` include:**
- Component API (props, variants, states)
- Usage examples with code samples
- Accessibility guidelines
- Design tokens and spacing
- Mobile responsiveness patterns
- Integration with Tailwind CSS v4
- Performance optimization patterns

**For detailed component specifications, API documentation, and implementation examples:**
👉 See **`docs/front-end-spec.md`** (Sections 4.5-5.0)

---

# Core Workflows

> **📖 Complete Workflow Documentation:**
> See **`docs/airtable-to-production-workflow.md`** for end-to-end workflow specifications

## Overview

The system orchestrates three primary workflows that automate the journey from content creation to live pages:

## 1. Content Creation Workflow

**Flow:** Airtable → AI Service → Approval → Production

```
STEP 1: Marketing creates draft page in Airtable
  ↓ (minimal input: client, service, location, special instructions)
STEP 2: Status → "AI Processing" triggers AI Service webhook
  ↓
STEP 3: AI Service (Claude API) generates all content in parallel
  - SEO Title & Meta Description
  - H1 Headline & Hero Subheadline
  - Trust Bar signals (5 items)
  - FAQs (5 Q&A pairs)
  - CTA selection + reasoning
  - Hero image selection from library
  ↓
STEP 4: AI writes content back to Airtable record
  ↓
STEP 5: Marketing reviews + approves (Status → "Approved")
```

**Key Features:**
- ✅ Parallel generation (all content types generated simultaneously)
- ✅ Automatic rollup data (branch info, client branding pulled from relationships)
- ✅ AI selection reasoning stored (CTA choice, image choice documented)
- ✅ Version control ready (original AI content saved for rollback)

## 2. Build & Deployment Workflow

**Flow:** Approval → Export → Build → Deploy

```
STEP 1: Status → "Approved" triggers Airtable automation
  ↓
STEP 2: Airtable automation POSTs to GitHub Actions webhook
  ↓
STEP 3: GitHub Actions runs export script
  - Fetches all approved pages from Airtable API
  - Transforms to content.json format
  - Commits to Git (triggers Netlify auto-deploy)
  ↓
STEP 4: Netlify Build
  - Runs Next.js 15 static export
  - Lighthouse quality gate (LCP <2.5s, accessibility >90)
  - Cache plugin optimizes build speed
  - Generates 500+ static HTML pages
  ↓
STEP 5: CDN Deployment
  - Pages deployed to Netlify CDN
  - Cache headers set (1 year for assets, revalidate HTML)
  - Site live with atomic deploy (no partial updates)
```

**Key Features:**
- ✅ Atomic deploys (all-or-nothing, no partial updates)
- ✅ Automatic rollback on quality gate failure
- ✅ Build caching (50% faster incremental builds)
- ✅ Zero-downtime deploys

## 3. Form Submission Workflow

**Flow:** User → Make.com → Salesforce → Notifications

```
STEP 1: User completes 3-stage form
  ↓
STEP 2: Client-side POST to Make.com webhook
  ↓
STEP 3: Make.com Scenario (10 steps)
  1. Receive webhook payload
  2. Verify reCAPTCHA token (server-side)
  3. Validate required fields
  4. Look up client config in Airtable
  5. Map form fields to Salesforce Lead object
  6. Check for duplicate lead (email/phone)
  7. Create or update Salesforce Lead
  8. Tag with campaign ID and UTM parameters
  9. Send confirmation email to user
  10. Notify sales team (Slack/email)
  ↓
STEP 4: Salesforce Assignment Rules
  - Territory-based lead routing
  - Auto-assign to sales rep
  - Trigger follow-up task creation
```

**Key Features:**
- ✅ Server-side reCAPTCHA validation (score threshold >0.5)
- ✅ Duplicate lead prevention
- ✅ Multi-client support (Airtable lookup determines Salesforce org)
- ✅ UTM parameter preservation (campaign attribution)

## Workflow Documentation

**For complete step-by-step workflows with Airtable field mappings, AI prompts, GitHub Actions YAML, and Make.com scenario configurations:**
👉 See **`docs/airtable-to-production-workflow.md`**

**Additional workflow diagrams:**
👉 See **`docs/technology-flow-diagram.md`** for visual flow diagrams

---

# Frontend Architecture

> **📖 Detailed Frontend Specifications:**
> See **`docs/front-end-spec.md`** for comprehensive UI/UX specifications and design system

## Overview

The frontend is built on **Next.js 15 (App Router)** with **React 19** and **Tailwind CSS v4**, optimized for Google Ads Quality Score and conversion rate optimization.

## Architecture Principles

### 1. **Static-First Generation**

**Approach:** Pre-render all pages at build time (Static Site Generation)

```typescript
// app/[service]/[location]/page.tsx
export async function generateStaticParams() {
  // Generate paths for all approved pages
  const pages = await getApprovedPages() // Reads from content.json

  return pages.map((page) => ({
    service: page.serviceSlug,
    location: page.locationSlug,
  }))
}

export default async function Page({ params }) {
  const { service, location } = await params // Next.js 15 async params
  const pageData = await getPageData(service, location)

  return <LandingPage data={pageData} />
}
```

**Benefits:**
- ✅ LCP <2.5s (pre-rendered HTML, no data fetching)
- ✅ SEO-friendly (crawlers get full HTML immediately)
- ✅ CDN-cacheable (pages cached globally for instant delivery)
- ✅ Zero runtime API calls (no Airtable/Claude API calls on page load)

### 2. **App Router Structure**

```
app/
├── layout.tsx                    # Root layout (fonts, GTM, analytics)
├── [service]/[location]/         # Dynamic route for landing pages
│   ├── page.tsx                  # Page component
│   └── layout.tsx                # Optional nested layout
├── globals.css                   # Tailwind v4 imports
└── not-found.tsx                 # 404 page
```

**Key Features:**
- ✅ File-based routing (no manual route configuration)
- ✅ Nested layouts (shared header/footer)
- ✅ React Server Components by default
- ✅ Client Components only where needed (`'use client'` directive)

### 3. **Server vs Client Components**

**Server Components (default):**
- Layout, Header, Footer (static HTML, no interactivity)
- LandingPage wrapper (data fetching, SSG)
- Trust Bar, Testimonials (static content display)

**Client Components (`'use client'`):**
- ThreeStageForm (form state, validation, submission)
- Gallery (image slider, lightbox)
- FAQ (accordion expand/collapse)
- Any component using `useState`, `useEffect`, `onClick`

**Why this matters:**
- ✅ Reduces JavaScript bundle size (Server Components send zero JS)
- ✅ Improves LCP (less JS to parse and execute)
- ✅ Better SEO (search engines see full content immediately)

### 4. **Data Flow**

```
Build Time:
  content.json (Git) → getPageData() → React Server Component → Static HTML

Runtime (User Visit):
  Static HTML (CDN) → Client-side hydration → Interactive form/gallery
```

**No Runtime API Calls:**
- ❌ No Airtable API calls on page load
- ❌ No Claude API calls on page load
- ✅ All data baked into static HTML at build time
- ✅ Forms POST directly to Make.com webhook

### 5. **Performance Optimization**

**LCP Optimization (<2.5s target):**
- ✅ Inline critical CSS (Beasties plugin)
- ✅ Defer third-party scripts (GTM, CallRail, GA4 load after LCP)
- ✅ Hero image preload (`<link rel="preload">`)
- ✅ Font optimization (next/font with display=swap)
- ✅ Tailwind CSS purging (only used classes included)

**JavaScript Optimization:**
- ✅ Code splitting (dynamic imports for below-fold components)
- ✅ Tree shaking (unused code removed)
- ✅ Minification (Next.js production build)

**Image Optimization:**
- ✅ Next.js Image component (`next/image`)
- ✅ Sharp for build-time optimization (AVIF/WebP generation)
- ✅ Responsive images (srcset with multiple sizes)
- ✅ Lazy loading (images below fold load on scroll)

### 6. **Styling Approach**

**Tailwind CSS v4.0** (utility-first CSS framework)

```css
/* globals.css */
@import "tailwindcss";

@theme {
  --color-primary: #0ea5e9;
  --color-secondary: #8b5cf6;
  --font-sans: 'Inter', system-ui, sans-serif;
}
```

**Why Tailwind:**
- ✅ 5x faster builds (v4 performance improvements)
- ✅ Minimal CSS bundle (only used utilities included)
- ✅ Consistent design system (spacing, colors, typography)
- ✅ No CSS-in-JS runtime overhead

### 7. **Accessibility (WCAG 2.1 AA)**

**Built-in accessibility features:**
- ✅ Semantic HTML (`<header>`, `<nav>`, `<main>`, `<footer>`)
- ✅ ARIA labels on interactive elements
- ✅ Keyboard navigation (tab order, focus styles)
- ✅ Color contrast ratio >4.5:1 (automated checking)
- ✅ Alt text on all images (AI-generated with context)
- ✅ Form validation with error messages

## Frontend Documentation

**For complete frontend specifications including:**
- UI/UX design principles
- Component library details
- Design tokens and spacing system
- Mobile responsiveness patterns
- Conversion optimization strategies
- Accessibility guidelines

👉 See **`docs/front-end-spec.md`** (Sections 1-5)

---

## Netlify Build Plugins

### Overview

Netlify Build Plugins extend the build process with automated quality gates, performance optimization, and workflow automation. They execute during the build lifecycle (onPreBuild, onBuild, onPostBuild) without adding runtime complexity to the static site.

**Philosophy Alignment:** Plugins run at build-time only, maintaining the static-only architecture (no serverless functions in production).

**Recommended Plugins:**
1. **Lighthouse Plugin** - Performance & accessibility quality gates (CRITICAL)
2. **Cache Plugin** - Build speed optimization (HIGH PRIORITY)

---

### 1. Lighthouse Plugin (Quality Gate)

**Package:** `@netlify/plugin-lighthouse`

**Purpose:** Automated performance, accessibility, SEO, and best practices testing on every deploy. Prevents performance regression that would increase Google Ads costs.

**Why Critical for This Project:**
- **Google Ads Quality Score:** LCP <2.5s target directly impacts CPC (cost-per-click)
- **Performance Regression Prevention:** Catches slow pages before they reach production
- **Accessibility Compliance:** Automated WCAG AA testing (legal protection)
- **Stakeholder Reporting:** Visual reports for non-technical clients

#### Configuration

```toml
# netlify.toml

[[plugins]]
package = "@netlify/plugin-lighthouse"

  [plugins.inputs]
  # Test mobile performance (Google Ads default device)
  audits = ["performance", "accessibility", "seo", "best-practices"]

  # Quality thresholds (build fails if scores drop below)
  [plugins.inputs.thresholds]
    performance = 90      # LCP <2.5s requirement
    accessibility = 90    # WCAG AA compliance
    seo = 85             # Meta tags, structured data
    best-practices = 85  # Security headers, HTTPS

  # Fail deployment if thresholds not met
  fail_deploy_on_score_thresholds = true

  # Save reports for stakeholder review
  output_path = "reports/lighthouse.html"

  # Test high-value landing pages
  urls = [
    "/bathroom-remodeling/charlotte",
    "/kitchen-remodeling/raleigh",
    "/hvac-repair/durham"
  ]
```

#### Performance Thresholds Explained

| Audit | Threshold | Business Impact | Penalty if Failed |
|-------|-----------|-----------------|-------------------|
| **Performance (90)** | LCP <2.5s, FCP <1.0s, TTI <3.5s | Google Ads Quality Score | Higher CPC, lower ad rank |
| **Accessibility (90)** | WCAG AA compliance | Legal compliance, user experience | ADA lawsuits, lost conversions |
| **SEO (85)** | Meta tags, structured data, mobile | Organic search ranking | Lower organic traffic |
| **Best Practices (85)** | HTTPS, security headers, console errors | Security, user trust | Browser warnings, lower trust |

#### Lighthouse Execution Flow

```
Build Process:
  1. npm run build (Next.js static export)
  2. Lighthouse Plugin (onPostBuild event)
     ↓
     a. Spin up local server (serve ./out directory)
     b. Run Lighthouse audits (Chromium headless)
     c. Calculate scores (Performance, Accessibility, SEO, Best Practices)
     d. Compare scores to thresholds
     ↓
  3a. IF all scores ≥ thresholds:
      - Generate HTML report → reports/lighthouse.html
      - Continue deployment → Netlify CDN
      - Display scores in Netlify UI (Pro plan)

  3b. IF any score < threshold:
      - FAIL BUILD (prevent deployment)
      - Display failing scores in build log
      - Send Slack notification (optional)
      - Developer must fix before retry
```

#### Cost Analysis

**Lighthouse Build Time Overhead:**
- Additional build time: +1-2 minutes per deploy
- Total build time: 6 min → 7-8 min (with Lighthouse)

**Cost-Benefit:**
- **Cost:** +1-2 min build time (marginal)
- **Benefit:** Prevents deploying slow pages that waste Google Ads budget
- **ROI Example:**
  - Slow page (LCP 4s) → Quality Score 3/10 → CPC $8
  - Fast page (LCP 2.2s) → Quality Score 8/10 → CPC $4
  - Savings: $4 per click × 1000 clicks/month = **$4,000/month saved**

**Verdict:** Critical quality gate, ROI is massive

---

### 2. Cache Plugin (Build Optimization)

**Package:** `netlify-plugin-cache`

**Purpose:** Cache `node_modules` and Next.js build artifacts between builds to reduce build time by 50%.

**Why Useful:**
- **Faster Builds:** 6 min → 3-4 min (50% reduction)
- **Lower Costs:** Fewer build minutes consumed on Netlify
- **Faster Iterations:** Content updates deploy quicker (better UX for clients)

#### Configuration

```toml
# netlify.toml (add after Lighthouse plugin)

[[plugins]]
package = "netlify-plugin-cache"

  [plugins.inputs]
  # Cache these directories between builds
  paths = [
    "node_modules",      # npm dependencies (15+ packages)
    ".next/cache",       # Next.js build cache
    ".cache"             # General cache directory
  ]
```

#### Cache Execution Flow

```
First Build (No Cache):
  1. npm install (4-5 min) - Download all packages
  2. next build (2-3 min) - Full static export
  Total: 6-8 minutes

Subsequent Builds (With Cache):
  1. Restore node_modules from cache (30 sec)
  2. npm install (30 sec) - Only install new/updated packages
  3. next build (1-2 min) - Incremental build using .next/cache
  Total: 3-4 minutes

Cache Invalidation:
  - Automatic when package.json changes
  - Manual via Netlify UI: "Clear cache and retry deploy"
```

#### Performance Metrics

| Build Type | Without Cache | With Cache | Savings |
|------------|---------------|------------|---------|
| **Clean Build** (package.json changed) | 6-8 min | 6-8 min | 0% (cache invalidated) |
| **Content Update** (Airtable change) | 6-8 min | 3-4 min | 50% |
| **Code Change** (minor component edit) | 6-8 min | 3-4 min | 50% |

**Expected Build Distribution:**
- 10% clean builds (package updates)
- 90% cached builds (content/code updates)

**Average Build Time:**
- Without cache: 6-8 min average
- With cache: (0.1 × 7 min) + (0.9 × 3.5 min) = **3.85 min average**

---

### 3. Why NOT Use Other Plugins

#### ❌ Essential Next.js Plugin

**Status:** DEPRECATED (auto-installed by Netlify, should be removed)

**Reason:** Next.js Runtime v5 (2024+) auto-handles Next.js optimization. Manual plugin installation is no longer needed and can cause conflicts.

**Action:** If `@netlify/plugin-nextjs` exists in `package.json`, remove it:

```json
// package.json - REMOVE THIS:
"devDependencies": {
  "@netlify/plugin-nextjs": "^5.0.0"  // ❌ Delete this line
}
```

---

#### ❌ Image Optimization Plugin

**Status:** NOT NEEDED

**Reason:**
- Next.js 15 + Sharp already handles image optimization at build time
- Images are hosted on Cloudinary (external CDN, not Netlify)
- Netlify Image CDN requires serverless functions (breaks static-only architecture)

---

#### ❌ A11y (Accessibility) Plugin

**Status:** Redundant (Lighthouse covers this)

**Reason:** Lighthouse plugin already tests accessibility with WCAG AA compliance. Separate a11y plugin would duplicate testing.

---

### Complete netlify.toml Configuration

```toml
# netlify.toml - Complete Build Configuration

# ===== BUILD SETTINGS =====

[build]
  command = "npm run build"
  publish = "out"

  # Node.js version (matches local development)
  [build.environment]
    NODE_VERSION = "20.18.0"

# ===== BUILD PLUGINS =====

# 1. Lighthouse - Performance & Accessibility Quality Gate
[[plugins]]
package = "@netlify/plugin-lighthouse"

  [plugins.inputs]
  audits = ["performance", "accessibility", "seo", "best-practices"]

  [plugins.inputs.thresholds]
    performance = 90
    accessibility = 90
    seo = 85
    best-practices = 85

  fail_deploy_on_score_thresholds = true
  output_path = "reports/lighthouse.html"

  # Test 3 high-value pages per deploy
  urls = [
    "/bathroom-remodeling/charlotte",
    "/kitchen-remodeling/raleigh",
    "/hvac-repair/durham"
  ]

# 2. Cache - Build Speed Optimization
[[plugins]]
package = "netlify-plugin-cache"

  [plugins.inputs]
  paths = ["node_modules", ".next/cache", ".cache"]

# ===== HEADERS =====

# Cache static assets aggressively (1 year)
[[headers]]
  for = "/_next/static/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

# Cache images (1 year)
[[headers]]
  for = "/images/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

# Revalidate HTML on every request (dynamic content)
[[headers]]
  for = "*.html"
  [headers.values]
    Cache-Control = "public, max-age=0, must-revalidate"

# Security headers (all pages)
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "geolocation=(), microphone=(), camera=()"
    X-XSS-Protection = "1; mode=block"

# ===== REDIRECTS =====

# Redirect trailing slashes (SEO canonicalization)
[[redirects]]
  from = "/*/"
  to = "/:splat"
  status = 301
  force = true

# Redirect www to non-www (or vice versa)
[[redirects]]
  from = "https://www.bathsrus.com/*"
  to = "https://bathsrus.com/:splat"
  status = 301
  force = true
```

---

## Netlify Build Hooks

### Overview

Build Hooks provide unique webhook URLs that trigger Netlify deployments via HTTP POST requests. They enable automated publishing workflows without manual intervention.

**Use Cases:**
1. **Airtable Content Updates** → Auto-deploy (real-time publishing)
2. **Scheduled AI Content Refresh** → Nightly regeneration
3. **Emergency Rollback** → One-click restore to previous deploy

**Security Model:** Build Hook URLs are obscure (non-guessable) but contain no authentication. Do not advertise publicly.

---

### 1. Airtable Content Update → Auto-Deploy

**Trigger:** When client approves content in Airtable (Status = "Approved")

**Workflow:** Airtable Automation → POST to Build Hook → Netlify Rebuild → Deploy

#### Setup (Step-by-Step)

**Step 1: Create Build Hook in Netlify**

```
Netlify UI:
  1. Navigate to: Site settings → Build & deploy → Continuous deployment
  2. Scroll to: Build hooks
  3. Click: Add build hook
  4. Configure:
     - Build hook name: "Airtable Content Update"
     - Branch to build: main
  5. Save → Copy generated URL:
     https://api.netlify.com/build_hooks/abc123xyz456
```

**Step 2: Configure Airtable Automation**

```
Airtable UI:
  1. Navigate to: Automations (in your base)
  2. Create automation:
     Name: "Deploy to Netlify on Approval"
  3. Configure trigger:
     - Trigger: "When record matches conditions"
     - Table: Pages
     - Conditions: Status = "Approved"
  4. Add action:
     - Action: "Send a request to a URL"
     - Method: POST
     - URL: https://api.netlify.com/build_hooks/abc123xyz456
     - Body (JSON):
       {
         "trigger_title": "Content approved in Airtable",
         "trigger_branch": "main"
       }
  5. Test automation → Verify Netlify deploy triggered
  6. Turn on automation
```

**Step 3: Test End-to-End**

```
1. Update content in Airtable (Pages table)
2. Change Status to "Approved"
3. Wait 30 seconds (Airtable automation delay)
4. Check Netlify Deploys page:
   - New deploy should appear
   - Triggered by: "Content approved in Airtable"
5. Wait 6-8 minutes for build to complete
6. Verify updated content is live
```

#### Workflow Diagram

```
┌─────────────────────────────────────────────┐
│  AIRTABLE (Content Management)              │
│  - Client edits page content                │
│  - Client sets Status = "Approved"          │
└─────────────────────────────────────────────┘
                ↓ (Automation trigger)
┌─────────────────────────────────────────────┐
│  AIRTABLE AUTOMATION                        │
│  - Detect: Status changed to "Approved"     │
│  - Action: POST to Netlify Build Hook       │
│    Body: { "trigger_title": "Content..." }  │
└─────────────────────────────────────────────┘
                ↓ (HTTP POST)
┌─────────────────────────────────────────────┐
│  NETLIFY BUILD HOOK                         │
│  - Receive POST request                     │
│  - Trigger build from main branch           │
│  - Display trigger info in deploy log       │
└─────────────────────────────────────────────┘
                ↓ (Build process)
┌─────────────────────────────────────────────┐
│  NETLIFY BUILD                              │
│  1. Export Airtable content → JSON          │
│  2. Generate AI content (Claude API)        │
│  3. next build (static export)              │
│  4. Lighthouse quality gate                 │
│  5. Deploy to CDN                           │
│  Duration: 6-8 minutes                      │
└─────────────────────────────────────────────┘
                ↓
┌─────────────────────────────────────────────┐
│  NETLIFY CDN (Production)                   │
│  - Updated content live                     │
│  - Client receives email notification       │
└─────────────────────────────────────────────┘
```

**Benefits:**
- ✅ Real-time publishing (content approved → live in 6-8 minutes)
- ✅ Non-technical workflow (clients manage content, deploys happen automatically)
- ✅ Audit trail (Netlify deploy log shows who/what triggered deploy)
- ✅ No manual intervention required

**Estimated Frequency:** 5-20 deploys/day (content updates by clients)

---

### 2. Scheduled AI Content Refresh → Nightly Build

**Trigger:** Daily at 2:00 AM UTC (regenerate AI content for freshness)

**Workflow:** GitHub Actions Scheduled Job → POST to Build Hook → Netlify Rebuild

#### Setup (GitHub Actions)

**Step 1: Create Build Hook in Netlify**

```
Netlify UI:
  - Build hook name: "Nightly AI Content Refresh"
  - Branch to build: main
  - Copy URL: https://api.netlify.com/build_hooks/def789ghi012
```

**Step 2: Create GitHub Actions Workflow**

```yaml
# .github/workflows/nightly-rebuild.yml

name: Nightly AI Content Refresh

on:
  schedule:
    # Run at 2:00 AM UTC daily (9:00 PM EST)
    - cron: '0 2 * * *'

  # Allow manual trigger for testing
  workflow_dispatch:

jobs:
  trigger-netlify-rebuild:
    runs-on: ubuntu-latest

    steps:
      - name: Trigger Netlify Build Hook
        run: |
          curl -X POST -d '{"trigger_title": "Nightly AI content refresh", "trigger_branch": "main"}' \
            -H "Content-Type: application/json" \
            https://api.netlify.com/build_hooks/${{ secrets.NETLIFY_BUILD_HOOK_NIGHTLY }}

      - name: Log Success
        run: echo "Netlify rebuild triggered successfully at $(date)"
```

**Step 3: Add Secret to GitHub**

```
GitHub Repository:
  1. Navigate to: Settings → Secrets and variables → Actions
  2. Click: New repository secret
  3. Name: NETLIFY_BUILD_HOOK_NIGHTLY
  4. Value: def789ghi012 (just the ID, not full URL)
  5. Save
```

**Step 4: Test Workflow**

```
GitHub Actions:
  1. Navigate to: Actions tab
  2. Select: "Nightly AI Content Refresh"
  3. Click: "Run workflow" (manual trigger)
  4. Verify: Netlify deploy triggered
```

**Benefits:**
- ✅ Fresh AI content daily (trust signals, FAQs stay current)
- ✅ SEO freshness signal (Google sees updated content = higher rankings)
- ✅ Zero manual work (set and forget)
- ✅ Audit trail (GitHub Actions logs + Netlify deploy logs)

**Alternative: Make.com Scheduled Trigger**

```
Make.com Scenario:
  Trigger: Schedule (Daily at 2:00 AM)
  Action: HTTP Request
    - Method: POST
    - URL: https://api.netlify.com/build_hooks/def789ghi012
    - Body: { "trigger_title": "Nightly AI refresh" }
```

---

### 3. Emergency Rollback → Restore Previous Deploy

**Trigger:** Production deploy fails, need to rollback immediately

**Workflow:** Manual POST to Build Hook → Netlify deploys previous commit

#### Setup

**Step 1: Create Build Hook in Netlify**

```
Netlify UI:
  - Build hook name: "Emergency Rollback"
  - Branch to build: main~1 (previous commit notation)
  - Copy URL: https://api.netlify.com/build_hooks/jkl345mno678
```

**Step 2: Save Hook URL in Team Documentation**

```markdown
# Emergency Procedures

## Rollback Production Deploy

If a deploy breaks production:

1. **Immediate rollback** (restores previous working version):
   ```bash
   curl -X POST https://api.netlify.com/build_hooks/jkl345mno678
   ```

2. **Verify rollback**:
   - Check Netlify Deploys page
   - Deploy should show: "Triggered by: Emergency Rollback"
   - Wait 6-8 minutes for rollback to complete

3. **Investigate failure**:
   - Review failed deploy logs
   - Check Lighthouse report (if quality gate failed)
   - Fix issue before re-deploying

4. **Alternative** (Netlify UI):
   - Navigate to: Deploys
   - Find last successful deploy
   - Click: "Publish deploy" (instant rollback, no rebuild)
```

**Benefits:**
- ✅ Disaster recovery (bad deploy? One-click rollback)
- ✅ Business continuity (minimize downtime for high-value ad traffic)
- ✅ Faster than Git revert + push (6-8 min vs. 10-15 min)

**Expected Usage:** 1-2 times per year (rare, only for critical failures)

---

### Build Hook Security Best Practices

**1. URL Obscurity (Not Authentication)**

Build Hook URLs are obscure but not authenticated. Anyone with the URL can trigger a deploy.

```
# ✅ GOOD: Store in environment variables
NETLIFY_BUILD_HOOK_AIRTABLE=abc123xyz456
NETLIFY_BUILD_HOOK_NIGHTLY=def789ghi012

# ❌ BAD: Commit to Git
# netlify-hooks.txt (public repository)
```

**2. Rate Limiting**

Netlify rate-limits build hooks to prevent abuse:
- **Limit:** 10 requests per minute per webhook
- **Exceeded:** Returns HTTP 429 (Too Many Requests)
- **Mitigation:** Add delay between bulk triggers

**3. Audit Trail**

All build hook triggers are logged:
- **Netlify UI:** Deploys page shows "Triggered by: [trigger_title]"
- **Netlify API:** Deploy metadata includes `trigger_metadata`
- **Monitoring:** Set up Slack/email notifications for unexpected triggers

---

### Build Hook Cost Analysis

**Netlify Build Minutes:**

| Trigger Source | Frequency | Build Time | Monthly Minutes |
|----------------|-----------|------------|-----------------|
| **Airtable Content Update** | 5-20/day | 6-8 min | 900-4,800 min |
| **Nightly AI Refresh** | 1/day | 6-8 min | 180-240 min |
| **Emergency Rollback** | 1-2/year | 6-8 min | 1-2 min |
| **Manual Deploys** | 5-10/month | 6-8 min | 30-80 min |
| **Total Estimated** | - | - | **1,110-5,122 min/mo** |

**Netlify Pricing Tiers:**

| Plan | Build Minutes/mo | Cost/mo | Sufficient for Project? |
|------|------------------|---------|-------------------------|
| **Free** | 300 | $0 | ❌ No (need 1,110-5,122 min) |
| **Pro** | 1,000 | $19 | ⚠️ Maybe (low content churn) |
| **Business** | 2,500 | $99 | ✅ Yes (recommended) |

**Recommendation:**
- **Start with Pro ($19/mo):** If content updates are moderate (5-10/day)
- **Upgrade to Business ($99/mo):** If content updates are frequent (15-20/day) or multiple clients

**Cost Optimization:**
- Cache plugin reduces build time 50% (1,110 min → 555 min average)
- This could fit within Pro tier with careful monitoring

---

### Build Hook Integration Summary

| Hook Name | Trigger | Frequency | Purpose | Priority |
|-----------|---------|-----------|---------|----------|
| **Airtable Content Update** | Content approval | 5-20/day | Real-time publishing | 🚨 Critical |
| **Nightly AI Refresh** | Scheduled (2 AM) | 1/day | Fresh AI content | ⚠️ High |
| **Emergency Rollback** | Manual (on failure) | Rare | Disaster recovery | ⚠️ High |

---

## When DO We Use Netlify Functions

### Decision: Use Netlify Functions for AI Content Generation

**Use Case:** Backend workflow automation (Airtable webhook → AI generation → write back to Airtable)

**Decision:** ✅ DO use Netlify Functions for AI content generation

**Architecture:**

```
Airtable Automation (Status="AI Processing")
  ↓
  POST webhook to Netlify Function
  ↓
netlify/functions/generate-ai-content.js (Serverless)
  ↓
  1. Fetch page data from Airtable
  2. Call Claude API (4 parallel requests)
  3. Write AI-generated content back to Airtable fields
  4. Update Status → "Ready for Review"
  ↓
Marketing reviews AI content in Airtable
  ↓
Marketing approves → Status="Approved"
  ↓
Triggers GitHub Actions export & deploy
```

**Rationale:**

#### 1. Backend Workflow (Not User-Facing)

**Key Distinction:**
- ❌ **Runtime serverless** (user-facing, page load) - NOT USED (static CDN only)
- ✅ **Backend serverless** (pre-publish workflows) - USED for AI generation

This function runs BEFORE publishing, not during user page loads. It's part of the content creation workflow, not the runtime architecture.

#### 2. Marketing Approval Workflow

**Problem:**
- Marketing needs to review/edit AI-generated content before publishing
- Cannot run AI during build (no review opportunity)

**Solution:**
- AI generates content when Marketing triggers it (on-demand)
- AI writes back to Airtable
- Marketing reviews in Airtable interface
- Only approved content gets exported to production

**Cold Start Trade-Off:**
- Cold start: 3-10s (acceptable for Marketing workflow)
- Marketing waits 18-40s total for AI generation
- This is FASTER than waiting for full build cycle (6-12 minutes)

#### 3. Cost Efficiency

**Netlify Functions (Serverless):**
- Free tier: 125K requests/month, 100 hours runtime/month
- Estimated usage: 100-500 AI generations/month
- Cost: **$0/month** (well within free tier)

**Alternative: Always-On Server (Railway/Render):**
- Cost: $5-7/month (always running)
- Overkill for infrequent AI generation requests

**Cost Savings:** $5-7/month saved vs always-on server

#### 4. Simple Deployment

**Same Repository:**
```
landing-pages-automation-v2/
├── app/                        # Next.js App Router (static pages)
├── netlify/functions/          # Serverless backend (AI generation)
│   └── generate-ai-content.js
├── netlify.toml                # Deploy config for both
└── content.json                # Single source of truth
```

**No Separate Backend:**
- No Railway/Render account needed
- No separate deployment pipeline
- Same environment variables (Netlify console)
- Single Git repository

#### 5. Airtable Write-Back Pattern

**Workflow:**
1. Marketing creates page in Airtable → Status: "Draft"
2. Marketing triggers AI → Status: "AI Processing"
3. Airtable webhook → Netlify Function
4. Function writes AI content to Airtable fields:
   - SEO Title, H1, Subheadline
   - Trust Bar (5 fields)
   - FAQs (JSON)
   - Gallery Captions (JSON)
5. Function updates Status → "Ready for Review"
6. Marketing reviews/edits in Airtable
7. Marketing approves → Status: "Approved"
8. Airtable webhook → GitHub Actions export
9. GitHub Actions exports content.json (includes AI content)
10. Git push → Netlify build

**Key Benefit:** Single source of truth (Airtable) for all content, including AI-generated.

#### 6. Serverless Architecture Alignment

**Clarification:**

The "NO serverless functions" constraint applies to **runtime/user-facing operations**, NOT backend workflows.

| Operation Type | Use Serverless? | Rationale |
|----------------|-----------------|-----------|
| **User page loads** | ❌ NO | Static CDN for performance (LCP <2.5s) |
| **Form submissions** | ❌ NO | Make.com handles (OAuth abstraction, visual workflow) |
| **AI content generation** | ✅ YES | Backend workflow (pre-publish), cost-effective, Marketing approval |
| **GitHub Actions** | ✅ YES | CI/CD automation (export Airtable to JSON) |

**Summary:** Serverless is appropriate for backend automation, not user-facing pages.

---

## Why NOT Use Netlify Functions for Form Processing

### Decision: Keep Make.com for Form Submissions

**Evaluated Alternative:** Replace Make.com with Netlify Serverless Functions for form processing

**Decision:** ❌ Do NOT replace Make.com with Netlify Functions

**Rationale:**

#### 1. Architecture Philosophy Alignment

**Current (Static-Only):**
```
Netlify CDN (Pure Static HTML/CSS/JS)
  ↓ (AJAX POST to external service)
Make.com (External webhook)
  ↓
Salesforce
```

**Alternative (Serverless):**
```
Netlify CDN + Functions (Serverless runtime required)
  ↓ (Function invocation)
Netlify Function (submit-lead.ts)
  ↓
Salesforce
```

**Problem:** PRD explicitly states "Static-only architecture (no serverless functions)". Netlify Functions would contradict this core principle.

---

#### 2. OAuth 2 Complexity

**Make.com:**
- ✅ OAuth 2 connection managed visually (set once, auto-refresh forever)
- ✅ No token storage required
- ✅ No refresh token logic needed

**Netlify Functions:**
- ❌ Manual OAuth 2 implementation (100+ lines of code)
- ❌ Requires database for token storage (Netlify Blobs or Upstash Redis)
- ❌ Manual refresh token flow (error-prone)
- ❌ Token expiration handling (complex edge cases)

**Example Complexity:**

```typescript
// Manual OAuth 2 token management (NOT RECOMMENDED)
async function getSalesforceAccessToken() {
  // 1. Retrieve stored token from database
  let token = await netlifyBlobs.get('sf_access_token')

  // 2. Check if expired
  if (isTokenExpired(token)) {
    // 3. Refresh token flow
    const response = await fetch('https://login.salesforce.com/services/oauth2/token', {
      method: 'POST',
      body: `grant_type=refresh_token&client_id=${SF_CLIENT_ID}&client_secret=${SF_CLIENT_SECRET}&refresh_token=${SF_REFRESH_TOKEN}`
    })

    const data = await response.json()

    // 4. Store new token
    await netlifyBlobs.set('sf_access_token', data.access_token)
    token = data.access_token
  }

  return token
}

// Make.com: Zero lines of code (managed automatically)
```

---

#### 3. Multi-Client Scalability

**Make.com:**
- ✅ Airtable lookup per webhook (visual configuration)
- ✅ Non-technical stakeholders can add new clients
- ✅ Client-specific Salesforce orgs supported (multiple OAuth connections)

**Netlify Functions:**
- ❌ Hard-coded client mapping OR database required
- ❌ Developer needed for every new client
- ❌ Complex multi-tenant OAuth management

---

#### 4. Non-Technical Management

**Make.com:**
- ✅ Visual workflow editor (stakeholders can modify logic)
- ✅ Drag-and-drop field mapping
- ✅ Visual error handling (retry routes, fallback actions)
- ✅ Built-in integrations (Slack, email, Airtable backup)

**Netlify Functions:**
- ❌ Every workflow change requires developer + code deployment
- ❌ Field mapping hard-coded in JavaScript
- ❌ Custom error handling code
- ❌ Manual integration code for each service

---

#### 5. Cost Comparison (at scale)

**Make.com:**
- 1,000 leads/mo: $9/mo (Core plan, 10K operations)
- 2,000 leads/mo: $16/mo (Pro plan, 40K operations)
- 5,000 leads/mo: $29/mo (Teams plan, 100K operations)

**Netlify Functions:**
- Free tier: 125K invocations/month (sufficient for most scenarios)
- BUT: Still need Netlify Pro ($19/mo) for build minutes
- AND: Need external database (Netlify Blobs or Upstash Redis $10-20/mo)

**Total Cost Comparison:**
- Make.com: $9-29/mo (all-in-one)
- Netlify Functions: $19-39/mo (Pro + database)

**Verdict:** Costs are comparable, but Make.com provides far more value (visual management, OAuth abstraction, integrations)

---

#### 6. Development Time

**Make.com:**
- Already designed, approved (ADR-026), and documented
- Zero additional development time

**Netlify Functions:**
- Estimated: 20-40 hours development
- Testing: 10-20 hours (OAuth flows, error cases)
- Documentation: 5-10 hours
- Total: **35-70 hours developer time**

**Opportunity Cost:** $3,500-$7,000 (at $100/hr developer rate)

---

### When Netlify Functions WOULD Be Appropriate

**Future Use Cases (Epic 2+):**

1. **Edge Personalization** (A/B Testing)
   ```typescript
   // netlify/edge-functions/ab-test.ts
   export default async (request: Request, context: Context) => {
     const variant = Math.random() < 0.5 ? 'a' : 'b'
     context.cookies.set('ab_variant', variant)

     if (variant === 'b') {
       return context.rewrite('/variant-b')
     }

     return context.next()
   }
   ```

2. **Geo-Targeting** (Auto-redirect to local pages)
   ```typescript
   // netlify/edge-functions/geo-redirect.ts
   export default async (request: Request) => {
     const city = request.headers.get('x-nf-geo-city')
     return Response.redirect(`/bathroom-remodeling/${city.toLowerCase()}`)
   }
   ```

3. **Dynamic Pricing** (Personalized quotes)
   ```typescript
   // netlify/functions/calculate-quote.ts
   export async function handler(event) {
     const { zipCode, service } = JSON.parse(event.body)
     const pricing = await calculateRegionalPricing(zipCode, service)
     return { statusCode: 200, body: JSON.stringify(pricing) }
   }
   ```

**Status:** All deferred to future epics (not in MVP scope)

---

### Decision Summary

| Aspect | Make.com | Netlify Functions | Winner |
|--------|----------|-------------------|--------|
| **Architecture Alignment** | Static-only ✅ | Requires serverless ❌ | Make.com |
| **OAuth 2 Management** | Auto-managed ✅ | Manual + database ❌ | Make.com |
| **Non-Technical Usability** | Visual workflows ✅ | Code changes only ❌ | Make.com |
| **Multi-Client Scalability** | Airtable lookup ✅ | Hard-coded/DB ❌ | Make.com |
| **Development Time** | 0 hours (done) ✅ | 35-70 hours ❌ | Make.com |
| **Total Cost (2K leads/mo)** | $16/mo | $19-39/mo | Make.com |

**Final Recommendation:** ✅ **Keep Make.com for form submissions**, use Netlify Plugins + Build Hooks for build-time automation only.

---

# Development Workflow

## Overview

This section defines the development workflow, Git branching strategy, local development setup, and deployment procedures for the Landing Pages Automation v2 project.

## Local Development Setup

### 1. Prerequisites

**Required Software:**
```bash
Node.js: v20.x or later (LTS recommended)
npm: v10.x or later (comes with Node.js)
Git: v2.x or later
```

**Recommended Tools:**
- VS Code with extensions:
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense
  - TypeScript and JavaScript Language Features

### 2. Initial Setup

**Clone and Install:**
```bash
# Clone repository
git clone https://github.com/your-org/landing-pages-automation-v2.git
cd landing-pages-automation-v2

# Install dependencies
npm install

# Copy environment template
cp .env.local.example .env.local

# Edit .env.local with your API keys
# (See Environment Variables section for required keys)
```

**Environment Variables:**
```bash
# .env.local (required for local development)
AIRTABLE_API_KEY=patXXXXXXXXXXXXXX
AIRTABLE_BASE_ID=appXXXXXXXXXXXXXX
ANTHROPIC_API_KEY=sk-ant-XXXXXXXXXXXXXXXX
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6LcXXXXXXXXXXXXX
NEXT_PUBLIC_MAKE_WEBHOOK_URL=https://hook.us1.make.com/XXXXXXXX
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
```

### 3. Run Development Server

```bash
# Start Next.js development server
npm run dev

# Server runs at http://localhost:3000
# Hot reload enabled (changes reflect immediately)
```

### 4. Build and Test

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Run tests (when implemented)
npm test

# Build production bundle
npm run build

# Preview production build locally
npm run start
```

## Git Workflow

### Branch Strategy

**Main Branches:**
- `main` - Production-ready code, deploys to Netlify automatically
- `develop` - Integration branch for feature development (optional)

**Feature Branches:**
```bash
# Feature branch naming convention
feature/short-description

# Examples:
feature/three-stage-form
feature/trust-bar-component
feature/airtable-export-script
```

**Bugfix Branches:**
```bash
# Bugfix branch naming convention
bugfix/issue-description

# Examples:
bugfix/form-validation-error
bugfix/lcp-optimization
```

**Hotfix Branches:**
```bash
# Hotfix branch naming convention (for production emergencies)
hotfix/critical-issue

# Example:
hotfix/api-key-exposure
```

### Feature Development Workflow

**Step 1: Create Feature Branch**
```bash
# Ensure main is up to date
git checkout main
git pull origin main

# Create and switch to feature branch
git checkout -b feature/trust-bar-component
```

**Step 2: Develop and Commit**
```bash
# Make changes, test locally

# Stage changes
git add .

# Commit with descriptive message
git commit -m "Add TrustBar component with icon support

- Create TrustBar component with dynamic icons
- Add Heroicons integration
- Implement responsive grid layout
- Add accessibility labels for screen readers

Relates to #42"
```

**Commit Message Format:**
```
<type>: <subject>

<body>

<footer>
```

**Types:**
- `feat:` - New feature
- `fix:` - Bug fix
- `refactor:` - Code refactoring (no functional change)
- `style:` - Formatting, whitespace changes
- `docs:` - Documentation updates
- `test:` - Test additions or updates
- `chore:` - Build process, dependencies, tooling

**Step 3: Push and Create Pull Request**
```bash
# Push feature branch to remote
git push origin feature/trust-bar-component

# Create Pull Request on GitHub
# - Add description of changes
# - Reference related issues
# - Request review from team
```

### Pull Request Process

**PR Template:**
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tested locally
- [ ] Lighthouse score checked (LCP <2.5s)
- [ ] Accessibility tested (keyboard navigation, screen reader)
- [ ] Mobile tested (responsive design)

## Screenshots (if UI changes)
[Add screenshots]

## Related Issues
Closes #42
```

**Review Checklist:**
- ✅ Code follows TypeScript and React best practices
- ✅ No `console.log` or debugging code left in
- ✅ Environment variables properly configured (no hardcoded secrets)
- ✅ Components use Server Components by default (Client Components only when needed)
- ✅ Tailwind CSS classes used (no inline styles)
- ✅ Accessibility: semantic HTML, ARIA labels, keyboard navigation
- ✅ Performance: LCP target met, images optimized
- ✅ Tests pass (when implemented)

### Merging Strategy

**Option A: Squash and Merge (Recommended for Feature Branches)**
- Combines all commits into single commit on main
- Cleaner Git history
- Easier to revert if needed

**Option B: Merge Commit (For Major Features with Meaningful History)**
- Preserves all commits
- Useful for complex features with multiple logical steps

**After Merge:**
```bash
# Delete local feature branch
git branch -d feature/trust-bar-component

# Delete remote feature branch (usually automatic on GitHub)
git push origin --delete feature/trust-bar-component

# Update local main
git checkout main
git pull origin main
```

## Deployment Workflow

### Automatic Deployment (Main Branch)

```
Developer merges PR to main
  ↓
GitHub triggers Netlify webhook
  ↓
Netlify Build starts
  1. npm install (with caching)
  2. npm run build (Next.js static export)
  3. Lighthouse plugin checks LCP <2.5s
  4. If pass: Deploy to CDN
  5. If fail: Abort deploy, notify team
  ↓
Production site updated (atomic deploy)
  - New pages live immediately
  - Old pages remain until deploy completes
  - Zero downtime
```

### Manual Deployment (Netlify UI)

**When to use:**
- Emergency rollback (revert to previous deploy)
- Testing a specific commit without merging

**Steps:**
```
1. Log into Netlify Dashboard
2. Select site (landing-pages-automation-v2)
3. Navigate to Deploys tab
4. Options:
   - "Trigger deploy" - Manual rebuild from main
   - "Deploy preview" - Deploy from any branch
   - "Publish deploy" - Rollback to previous successful deploy
```

## Code Review Guidelines

### Reviewer Responsibilities

**What to Check:**
1. **Functionality** - Does it work as intended?
2. **Code Quality** - Is it readable, maintainable, efficient?
3. **Best Practices** - Follows project standards and patterns?
4. **Security** - No exposed secrets, proper input validation?
5. **Performance** - No performance regressions?
6. **Accessibility** - WCAG 2.1 AA compliant?
7. **Tests** - Are tests included (when applicable)?

**Review Feedback Format:**
- ✅ **Approve** - Looks good, ready to merge
- 💬 **Comment** - Suggestions for improvement (not blocking)
- ⚠️ **Request Changes** - Issues must be fixed before merge

**Example Comments:**
```
💡 Suggestion: Consider extracting this logic into a helper function for reusability

⚠️ Issue: This hardcodes the API key - should use environment variable

✅ Looks good: Nice use of Server Components to reduce JS bundle
```

### Author Responsibilities

**Before Requesting Review:**
- ✅ Self-review code (catch obvious issues)
- ✅ Run linter and fix all issues
- ✅ Test locally (including edge cases)
- ✅ Check Lighthouse score (LCP <2.5s)
- ✅ Write clear PR description

**During Review:**
- ✅ Respond to comments promptly
- ✅ Ask clarifying questions if feedback unclear
- ✅ Push fixes to same branch (no new PR needed)
- ✅ Re-request review after addressing feedback

## Development Best Practices

### 1. Keep PRs Small

**Recommended Size:**
- 200-400 lines of code (max)
- Single logical change (one feature/bug fix)
- Easy to review in 15-30 minutes

**If PR is too large:**
- Break into multiple smaller PRs
- Create parent tracking issue
- Link related PRs together

### 2. Write Descriptive Commits

**Good Commit:**
```
feat: Add TrustBar component with dynamic icons

- Implement responsive grid layout (2 col mobile, 5 col desktop)
- Add Heroicons integration for trust signal icons
- Include ARIA labels for screen reader accessibility
- Add props interface with TypeScript

Relates to #42
```

**Bad Commit:**
```
fix stuff
```

### 3. Test Before Committing

**Pre-Commit Checklist:**
```bash
# 1. Type check
npm run type-check

# 2. Lint
npm run lint

# 3. Format
npm run format

# 4. Build (catch build errors early)
npm run build

# 5. Visual check in browser
npm run dev  # Test the changes
```

### 4. Use Feature Flags (For Large Features)

**When building major features over multiple PRs:**
```typescript
// src/lib/feature-flags.ts
export const FEATURES = {
  THREE_STAGE_FORM: process.env.NEXT_PUBLIC_ENABLE_THREE_STAGE_FORM === 'true',
  NEW_GALLERY: process.env.NEXT_PUBLIC_ENABLE_NEW_GALLERY === 'true',
}

// Usage in component
import { FEATURES } from '@/lib/feature-flags'

export default function ContactSection() {
  if (FEATURES.THREE_STAGE_FORM) {
    return <ThreeStageForm />
  }
  return <LegacyForm />
}
```

**Benefits:**
- ✅ Ship code to production without activating
- ✅ Test in production environment (behind flag)
- ✅ Easy rollback (toggle flag off)
- ✅ Gradual rollout possible

---

# Coding Standards

## Overview

This section defines coding conventions, naming patterns, file organization, and best practices for TypeScript, React, and Next.js development.

## TypeScript Standards

### 1. Strict Mode Enabled

**tsconfig.json:**
```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

**What this means:**
- ❌ No `any` types (use `unknown` if type is truly unknown)
- ❌ No implicit `undefined` returns
- ✅ All variables must have explicit or inferable types
- ✅ Null and undefined checks required

### 2. Type Definitions

**Prefer Interfaces for Objects:**
```typescript
// ✅ Good
interface PageData {
  pageId: string
  service: string
  location: string
  seo: {
    title: string
    description: string
  }
}

// ❌ Avoid (unless you need union types or primitives)
type PageData = {
  pageId: string
  service: string
}
```

**Use Type for Unions and Utilities:**
```typescript
// ✅ Good
type Status = 'draft' | 'processing' | 'approved' | 'published'
type ReadonlyPageData = Readonly<PageData>
```

### 3. No `any` Type

**❌ Never use `any`:**
```typescript
// ❌ BAD
function processData(data: any) {
  return data.value
}
```

**✅ Use `unknown` and type guards:**
```typescript
// ✅ GOOD
function processData(data: unknown) {
  if (typeof data === 'object' && data !== null && 'value' in data) {
    return (data as { value: string }).value
  }
  throw new Error('Invalid data format')
}
```

**✅ Or create proper types:**
```typescript
// ✅ BEST
interface DataWithValue {
  value: string
}

function processData(data: DataWithValue) {
  return data.value
}
```

### 4. Const Assertions

**Use `as const` for literal types:**
```typescript
// ✅ Good
const STATUSES = ['draft', 'approved', 'published'] as const
type Status = typeof STATUSES[number] // 'draft' | 'approved' | 'published'

// ❌ Avoid
const STATUSES = ['draft', 'approved', 'published'] // string[]
```

## React Standards

### 1. Server Components by Default

**❌ Don't add 'use client' unless needed:**
```typescript
// ✅ Good (Server Component by default)
export default function TrustBar({ signals }: { signals: string[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {signals.map((signal, i) => (
        <div key={i}>{signal}</div>
      ))}
    </div>
  )
}
```

**✅ Only use 'use client' for interactivity:**
```typescript
// ✅ Good (Client Component when needed)
'use client'

import { useState } from 'react'

export default function ThreeStageForm() {
  const [stage, setStage] = useState(1)

  return <form>...</form>
}
```

### 2. Component File Structure

**One component per file:**
```typescript
// ✅ Good
// src/components/TrustBar/TrustBar.tsx
export default function TrustBar() { ... }

// src/components/TrustBar/index.ts
export { default } from './TrustBar'
```

**File naming:**
- Component files: `PascalCase.tsx` (e.g., `TrustBar.tsx`)
- Utility files: `camelCase.ts` (e.g., `formatDate.ts`)
- Type files: `camelCase.types.ts` (e.g., `airtable.types.ts`)

### 3. Props Interface

**Define props interface explicitly:**
```typescript
// ✅ Good
interface TrustBarProps {
  signals: string[]
  className?: string
  variant?: 'default' | 'compact'
}

export default function TrustBar({ signals, className, variant = 'default' }: TrustBarProps) {
  return <div className={className}>...</div>
}
```

**Use React.FC sparingly (prefer explicit typing):**
```typescript
// ❌ Avoid
const TrustBar: React.FC<TrustBarProps> = ({ signals }) => { ... }

// ✅ Prefer
export default function TrustBar({ signals }: TrustBarProps) { ... }
```

### 4. Hooks Rules

**Only call hooks at top level:**
```typescript
// ✅ Good
export default function Form() {
  const [value, setValue] = useState('')
  const [error, setError] = useState<string | null>(null)

  // ...
}

// ❌ Bad
export default function Form() {
  if (someCondition) {
    const [value, setValue] = useState('') // ❌ Conditional hook
  }
}
```

**Custom hooks must start with `use`:**
```typescript
// ✅ Good
function useFormValidation(value: string) {
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (value.length < 3) {
      setError('Too short')
    } else {
      setError(null)
    }
  }, [value])

  return error
}
```

## File Organization

### Project Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── [service]/[location]/    # Dynamic routes
│   ├── layout.tsx               # Root layout
│   └── globals.css              # Global styles
├── components/                   # React components
│   ├── TrustBar/
│   │   ├── TrustBar.tsx
│   │   ├── TrustBar.test.tsx
│   │   └── index.ts
│   ├── ThreeStageForm/
│   └── Gallery/
├── lib/                          # Utilities and helpers
│   ├── airtable.ts              # Airtable SDK wrapper
│   ├── claude.ts                # Claude API wrapper
│   └── utils.ts                 # Generic utilities
├── types/                        # TypeScript type definitions
│   ├── airtable.types.ts
│   ├── page.types.ts
│   └── index.ts
└── styles/                       # Additional styles (if needed)
```

### Import Order

**Organized imports:**
```typescript
// 1. React and Next.js imports
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

// 2. Third-party libraries
import { Dialog } from '@headlessui/react'
import clsx from 'clsx'

// 3. Internal imports (absolute paths with @/ alias)
import { TrustBar } from '@/components/TrustBar'
import { getPageData } from '@/lib/airtable'
import type { PageData } from '@/types/page.types'

// 4. Relative imports
import { helper } from './utils'

// 5. CSS imports (last)
import styles from './Component.module.css'
```

## Naming Conventions

### Variables and Functions

```typescript
// ✅ camelCase for variables and functions
const pageData = await getPageData()
const userEmail = form.email

function calculateTotal(items: Item[]) {
  return items.reduce((sum, item) => sum + item.price, 0)
}
```

### Constants

```typescript
// ✅ UPPER_SNAKE_CASE for true constants
const API_BASE_URL = 'https://api.airtable.com/v0'
const MAX_RETRIES = 3
const DEFAULT_TIMEOUT = 5000

// ✅ PascalCase for config objects
const ApiConfig = {
  baseUrl: 'https://api.airtable.com/v0',
  timeout: 5000,
} as const
```

### Components

```typescript
// ✅ PascalCase for components
function TrustBar() { ... }
function ThreeStageForm() { ... }
function Hero() { ... }
```

### Types and Interfaces

```typescript
// ✅ PascalCase for types and interfaces
interface PageData { ... }
type Status = 'draft' | 'approved'
interface FormValues { ... }
```

## Code Style

### 1. Use Early Returns

```typescript
// ✅ Good (early return)
function validateEmail(email: string): string | null {
  if (!email) {
    return 'Email is required'
  }

  if (!email.includes('@')) {
    return 'Invalid email format'
  }

  return null // Valid
}

// ❌ Avoid (nested ifs)
function validateEmail(email: string): string | null {
  if (email) {
    if (email.includes('@')) {
      return null
    } else {
      return 'Invalid email format'
    }
  } else {
    return 'Email is required'
  }
}
```

### 2. Destructure Props

```typescript
// ✅ Good
function TrustBar({ signals, className }: TrustBarProps) {
  return <div className={className}>...</div>
}

// ❌ Avoid
function TrustBar(props: TrustBarProps) {
  return <div className={props.className}>...</div>
}
```

### 3. Use Template Literals

```typescript
// ✅ Good
const greeting = `Hello, ${name}!`
const url = `https://bathsrus.com/${service}/${location}`

// ❌ Avoid
const greeting = 'Hello, ' + name + '!'
```

### 4. Prefer `const` Over `let`

```typescript
// ✅ Good
const pages = await getApprovedPages()
const totalPages = pages.length

// ❌ Avoid (unless value actually changes)
let pages = await getApprovedPages()
let totalPages = pages.length
```

## Tailwind CSS Standards

### 1. Class Organization

**Order classes by category:**
```tsx
// ✅ Good (organized by layout, spacing, typography, colors, effects)
<div className="
  flex flex-col items-center
  p-6 mx-auto max-w-7xl
  text-lg font-semibold text-gray-900
  bg-white rounded-lg shadow-lg
  hover:shadow-xl transition-shadow
">
```

### 2. Use `clsx` for Conditional Classes

```tsx
import clsx from 'clsx'

// ✅ Good
<button
  className={clsx(
    'px-4 py-2 rounded-lg font-semibold',
    variant === 'primary' && 'bg-blue-600 text-white',
    variant === 'secondary' && 'bg-gray-200 text-gray-900',
    disabled && 'opacity-50 cursor-not-allowed'
  )}
>
```

### 3. Extract Repeated Patterns to Components

```tsx
// ❌ Bad (repeated classes everywhere)
<button className="px-4 py-2 bg-blue-600 text-white rounded-lg">Submit</button>
<button className="px-4 py-2 bg-blue-600 text-white rounded-lg">Save</button>

// ✅ Good (component with variants)
<Button variant="primary">Submit</Button>
<Button variant="primary">Save</Button>
```

## Comments and Documentation

### 1. JSDoc for Public APIs

```typescript
/**
 * Fetches approved pages from Airtable
 *
 * @param {string} view - Airtable view name (default: 'Approved')
 * @returns {Promise<PageData[]>} Array of page data objects
 * @throws {Error} If Airtable API call fails
 *
 * @example
 * const pages = await getApprovedPages('Approved')
 */
export async function getApprovedPages(view = 'Approved'): Promise<PageData[]> {
  // ...
}
```

### 2. Inline Comments for Complex Logic

```typescript
// ✅ Good (explains WHY, not WHAT)
// Delay between batches to respect Claude API rate limit (50 req/min)
await sleep(1200)

// ❌ Bad (obvious, doesn't add value)
// Increment counter
counter++
```

### 3. TODO Comments

```typescript
// TODO(username): Add error retry logic for 429 rate limit errors
// TODO: Optimize image loading with next/image priority prop
// FIXME: Form validation breaks on empty phone number
```

---

# Error Handling Strategy

## Overview

This section defines error handling patterns across the application stack, including API errors, build-time errors, runtime errors, and user-facing error messages.

## Error Handling Principles

### 1. Fail Fast

**Catch errors early in the pipeline:**
- Build-time validation (TypeScript, ESLint)
- API errors (Airtable, Claude) should fail build
- Lighthouse quality gate prevents bad deploys

### 2. Graceful Degradation

**When appropriate, degrade gracefully:**
- Missing hero image → Use placeholder
- API timeout → Retry with exponential backoff
- Third-party script failure → Log error, continue page load

### 3. User-Friendly Messages

**Never expose technical errors to users:**
```typescript
// ❌ Bad
catch (error) {
  alert(error.message) // "TypeError: Cannot read property 'value' of undefined"
}

// ✅ Good
catch (error) {
  console.error('Form submission error:', error)
  setErrorMessage('We couldn't submit your request. Please try again or call us at (555) 123-4567.')
}
```

## API Error Handling

### Airtable API Errors

**Common errors and handling:**
```typescript
// src/lib/airtable.ts
import Airtable from 'airtable'

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY })
  .base(process.env.AIRTABLE_BASE_ID!)

export async function fetchApprovedPages(): Promise<PageData[]> {
  try {
    const records = await base('Pages')
      .select({ view: 'Approved' })
      .all()

    return records.map(transformRecord)

  } catch (error) {
    // Type guard for Airtable errors
    if (error instanceof Error) {
      // Rate limit (429)
      if ('statusCode' in error && error.statusCode === 429) {
        console.warn('Airtable rate limit hit, retrying in 1s...')
        await sleep(1000)
        return fetchApprovedPages() // Retry once
      }

      // Invalid API key (401)
      if ('statusCode' in error && error.statusCode === 401) {
        throw new Error('Airtable API key is invalid. Check AIRTABLE_API_KEY in .env.local')
      }

      // Network errors
      if (error.message.includes('ENOTFOUND') || error.message.includes('ETIMEDOUT')) {
        throw new Error('Cannot connect to Airtable. Check your internet connection.')
      }
    }

    // Unknown error
    console.error('Airtable API error:', error)
    throw new Error('Failed to fetch pages from Airtable')
  }
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
```

### Claude API Errors

**Retry logic with exponential backoff:**
```typescript
// src/lib/claude.ts
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function generateContent(
  prompt: string,
  maxRetries = 3
): Promise<string> {
  let lastError: Error | null = null

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const message = await client.messages.create({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 2048,
        messages: [{ role: 'user', content: prompt }]
      })

      return message.content[0].text

    } catch (error) {
      lastError = error as Error

      // Rate limit (429) - wait and retry
      if ('status' in error && error.status === 429) {
        const waitTime = Math.pow(2, attempt) * 1000 // Exponential backoff
        console.warn(`Claude API rate limit (attempt ${attempt}/${maxRetries}), waiting ${waitTime}ms...`)
        await sleep(waitTime)
        continue
      }

      // Invalid API key (401) - don't retry
      if ('status' in error && error.status === 401) {
        throw new Error('Claude API key is invalid. Check ANTHROPIC_API_KEY in .env.local')
      }

      // Server error (500-599) - retry
      if ('status' in error && error.status >= 500) {
        console.warn(`Claude API server error (attempt ${attempt}/${maxRetries})`)
        await sleep(2000)
        continue
      }

      // Other errors - fail immediately
      throw error
    }
  }

  throw new Error(`Claude API failed after ${maxRetries} retries: ${lastError?.message}`)
}
```

## Build-Time Error Handling

### Export Script Errors

**Validation before export:**
```typescript
// scripts/export-airtable-to-json.ts
async function exportPages() {
  try {
    console.log('Fetching pages from Airtable...')
    const pages = await fetchApprovedPages()

    // Validation
    if (pages.length === 0) {
      throw new Error('No approved pages found in Airtable')
    }

    // Check required fields
    const invalidPages = pages.filter(p =>
      !p.seoTitle || !p.h1Headline || !p.heroImage
    )

    if (invalidPages.length > 0) {
      throw new Error(
        `${invalidPages.length} pages missing required fields:\n` +
        invalidPages.map(p => `- ${p.pageId}: ${p.service}/${p.location}`).join('\n')
      )
    }

    // Write to file
    const json = JSON.stringify({ pages }, null, 2)
    await fs.promises.writeFile('content.json', json, 'utf-8')

    console.log(`✅ Exported ${pages.length} pages to content.json`)

  } catch (error) {
    console.error('❌ Export failed:', error.message)
    process.exit(1) // Fail the build
  }
}
```

### Lighthouse Quality Gate Errors

**Netlify plugin catches performance issues:**
```yaml
# netlify.toml
[[plugins]]
package = "@netlify/plugin-lighthouse"

  [plugins.inputs.thresholds]
    performance = 90
    accessibility = 90
    best-practices = 90
    seo = 90

  [plugins.inputs.audit_urls]
    "/" = ["mobile", "desktop"]
    "/bathroom-remodeling/charlotte" = ["mobile"]
```

**When Lighthouse fails:**
1. Build aborts (no deploy)
2. Netlify shows error in build log
3. Developer fixes performance issue
4. Re-run build

## Runtime Error Handling

### Form Submission Errors

**Client-side validation + server-side verification:**
```typescript
'use client'

import { useState } from 'react'

export default function ThreeStageForm() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const response = await fetch(process.env.NEXT_PUBLIC_MAKE_WEBHOOK_URL!, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      // Success
      router.push('/thank-you')

    } catch (error) {
      console.error('Form submission error:', error)
      setError(
        'We couldn\'t submit your request. Please try again or call us directly at ' +
        clientPhone
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Form fields */}

      <button
        type="submit"
        disabled={loading}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg disabled:opacity-50"
      >
        {loading ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  )
}
```

### Error Boundaries (React)

**Catch rendering errors:**
```typescript
// src/app/error.tsx (Next.js App Router error boundary)
'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  console.error('Page error:', error)

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
        <p className="text-gray-600 mb-6">
          We're sorry, but something unexpected happened. Please try refreshing the page.
        </p>
        <button
          onClick={reset}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    </div>
  )
}
```

## Logging and Monitoring

### Console Logging Standards

**Development vs Production:**
```typescript
// Development: Verbose logging
if (process.env.NODE_ENV === 'development') {
  console.log('Fetching page data:', { service, location })
}

// Production: Error logging only
console.error('Critical error:', error)
console.warn('Non-critical warning:', warning)

// ❌ Never in production
console.log('Debug info:', data) // Remove before committing
```

### Error Tracking (Future)

**When ready to add error tracking:**
```typescript
// Example: Sentry integration (not implemented in MVP)
import * as Sentry from '@sentry/nextjs'

try {
  await fetchApprovedPages()
} catch (error) {
  Sentry.captureException(error, {
    tags: { function: 'fetchApprovedPages' },
    extra: { baseId: process.env.AIRTABLE_BASE_ID }
  })
  throw error
}
```

## Error Recovery Strategies

### 1. Retry with Exponential Backoff

**For transient failures (rate limits, network issues):**
```typescript
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  initialDelay = 1000
): Promise<T> {
  let lastError: Error | null = null

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error as Error

      if (attempt < maxRetries) {
        const delay = initialDelay * Math.pow(2, attempt - 1)
        console.warn(`Retry attempt ${attempt}/${maxRetries} after ${delay}ms`)
        await sleep(delay)
      }
    }
  }

  throw lastError
}

// Usage
const pages = await retryWithBackoff(() => fetchApprovedPages())
```

### 2. Circuit Breaker (Advanced)

**For protecting against cascading failures:**
```typescript
// Not implemented in MVP, but pattern for future
class CircuitBreaker {
  private failures = 0
  private readonly threshold = 5
  private state: 'closed' | 'open' | 'half-open' = 'closed'

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'open') {
      throw new Error('Circuit breaker is open')
    }

    try {
      const result = await fn()
      this.onSuccess()
      return result
    } catch (error) {
      this.onFailure()
      throw error
    }
  }

  private onSuccess() {
    this.failures = 0
    this.state = 'closed'
  }

  private onFailure() {
    this.failures++
    if (this.failures >= this.threshold) {
      this.state = 'open'
      setTimeout(() => this.state = 'half-open', 60000) // 1 min timeout
    }
  }
}
```

---

# Monitoring and Observability

## Overview

This section defines monitoring, logging, alerting, and observability strategies for production systems.

## Analytics and Tracking

### Google Tag Manager (GTM)

**Purpose:** Centralized tag management for conversion tracking

**Setup:**
```tsx
// src/app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID

  return (
    <html lang="en">
      <head>
        {/* GTM Script */}
        {gtmId && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','${gtmId}');
              `
            }}
          />
        )}
      </head>
      <body>
        {/* GTM noscript */}
        {gtmId && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        )}
        {children}
      </body>
    </html>
  )
}
```

**Events tracked:**
- Page views (automatic)
- Form submissions (3-stage form progress)
- Phone clicks (CallRail integration)
- CTA button clicks
- Scroll depth (engagement metric)

### Google Analytics 4 (GA4)

**Metrics to track:**
- **Traffic:** Sessions, users, page views by source/medium
- **Engagement:** Bounce rate, time on page, scroll depth
- **Conversions:** Form submissions, phone calls (via CallRail)
- **Quality Score Proxies:** LCP, CLS, FID (via Web Vitals)

**Custom Events:**
```typescript
// Send custom event to GA4 (via GTM dataLayer)
declare global {
  interface Window {
    dataLayer: any[]
  }
}

export function trackFormSubmission(stage: number) {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: 'form_progress',
      form_stage: stage,
      form_name: 'three_stage_contact'
    })
  }
}

export function trackCTAClick(ctaText: string, location: string) {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: 'cta_click',
      cta_text: ctaText,
      cta_location: location
    })
  }
}
```

### CallRail Integration

**Dynamic number insertion:**
- CallRail swaps phone numbers based on ad source
- Tracks which ads drive phone calls
- Attribution preserved in GTM → GA4

**Setup:**
```tsx
// src/components/Header.tsx
export function Header({ clientPhone }: { clientPhone: string }) {
  return (
    <header>
      <a
        href={`tel:${clientPhone}`}
        className="callrail-phone-number" // CallRail targets this class
        data-callrail-swap={clientPhone}
      >
        {clientPhone}
      </a>
    </header>
  )
}
```

## Performance Monitoring

### Core Web Vitals Tracking

**Web Vitals API:**
```typescript
// src/lib/web-vitals.ts
export function reportWebVitals(metric: any) {
  if (metric.label === 'web-vital') {
    // Send to GA4
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: 'web_vitals',
        event_category: 'Web Vitals',
        event_action: metric.name,
        event_value: Math.round(metric.value),
        event_label: metric.id
      })
    }

    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[Web Vitals]', metric.name, Math.round(metric.value))
    }
  }
}
```

```tsx
// src/app/layout.tsx
import { reportWebVitals } from '@/lib/web-vitals'

export { reportWebVitals } // Next.js automatically calls this
```

**Metrics tracked:**
- **LCP (Largest Contentful Paint)** - Target: <2.5s
- **FID (First Input Delay)** - Target: <100ms
- **CLS (Cumulative Layout Shift)** - Target: <0.1
- **TTFB (Time to First Byte)** - Target: <800ms

### Lighthouse CI (Build-Time Monitoring)

**Automated performance checks:**
```yaml
# netlify.toml
[[plugins]]
package = "@netlify/plugin-lighthouse"

  [plugins.inputs.thresholds]
    performance = 90
    accessibility = 90
    best-practices = 90
    seo = 90
```

**Lighthouse reports stored in:**
- Netlify build logs
- Optional: Upload to Lighthouse CI server for historical tracking

## Build Monitoring

### Netlify Build Notifications

**Setup Slack/Email notifications:**
```
Netlify Dashboard → Site Settings → Build & Deploy → Deploy Notifications

Add notifications for:
- Deploy started
- Deploy succeeded
- Deploy failed
- Deploy rolled back
```

**Notification includes:**
- Build log URL
- Commit that triggered deploy
- Build duration
- Lighthouse scores (if failed quality gate)

### Build Time Tracking

**Monitor build performance:**
- Track build duration over time
- Alert if build time exceeds threshold (>15 min)
- Investigate slow builds (check cache hit rate)

**Metrics to track:**
- Total build time
- npm install time
- next build time
- Lighthouse plugin time

## Error Monitoring (Future Enhancement)

### Sentry Integration (Not in MVP)

**When ready to add:**
```bash
npm install @sentry/nextjs
```

```typescript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
})
```

**Benefits:**
- Real-time error tracking
- Stack traces and context
- Performance monitoring (APM)
- Release tracking
- User session replays

## Health Checks

### Uptime Monitoring

**Tools (choose one):**
- **UptimeRobot** (free, simple)
- **Pingdom** (paid, advanced features)
- **StatusCake** (free tier available)

**Setup:**
```
Monitor URL: https://bathsrus.com
Check interval: 5 minutes
Alert on: 2 consecutive failures
Notification: Email + Slack
```

### Synthetic Monitoring

**Periodic checks:**
- Home page loads successfully
- Form submission works
- Phone number displays correctly (CallRail)
- GTM + GA4 firing correctly

## Alerting Strategy

### Alert Levels

**1. Critical (Page owner immediately):**
- Site down (5+ min outage)
- Build failing (3+ consecutive failures)
- Form submissions failing (100% error rate)
- LCP exceeds 5s (2x target)

**2. Warning (Team channel, review within 24hr):**
- Build time >15 min (performance regression)
- LCP between 2.5s-5s (approaching threshold)
- Form submission error rate >5%
- Lighthouse score drops below 85

**3. Info (Log only, weekly review):**
- Build succeeded with warnings
- Lighthouse score drops 5-10 points
- CDN cache hit rate <90%

### Alert Channels

**Primary:** Email notifications
**Secondary:** Slack integration (optional)

**Example Slack alert:**
```
🚨 Critical: Site Down
URL: https://bathsrus.com
Status: 503 Service Unavailable
Duration: 6 minutes
Action: Investigate immediately
```

## Dashboards

### Netlify Dashboard

**Built-in metrics:**
- Deploy history and status
- Build logs
- Bandwidth usage
- CDN cache hit rate
- Form submissions (if using Netlify Forms)

### Google Analytics Dashboard

**Custom dashboard for:**
- Traffic by source/medium
- Conversion rate by landing page
- Top performing services/locations
- Bounce rate and engagement
- Core Web Vitals distribution

### Make.com Monitoring

**Monitor scenarios:**
- Execution count (form submissions)
- Error rate
- Average execution time
- Operations consumed

**Alert on:**
- Scenario disabled
- Error rate >10%
- Operations limit approaching (90% of plan)

---

# Security & Performance

## Overview

This section consolidates security best practices and performance optimization strategies.

## Security

### Environment Variables

**Never commit secrets to Git:**
```bash
# .gitignore (ensure these are present)
.env.local
.env*.local
*.pem
*.key
```

**Required environment variables:**
```bash
# Build-time (server-side only)
AIRTABLE_API_KEY=patXXXXXXXXXXXXXX
AIRTABLE_BASE_ID=appXXXXXXXXXXXXXX
ANTHROPIC_API_KEY=sk-ant-XXXXXXXXXXXXXXXX

# Runtime (client-side - public)
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6LcXXXXXXXXXXXXX
NEXT_PUBLIC_MAKE_WEBHOOK_URL=https://hook.us1.make.com/XXXXXXXX
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
```

**Rules:**
- ✅ Server-side secrets: NO `NEXT_PUBLIC_` prefix
- ✅ Client-side values: MUST have `NEXT_PUBLIC_` prefix
- ✅ Obscure webhook URLs acceptable (not guessable)
- ❌ NEVER expose API keys to client-side

### API Key Security

**Airtable API:**
- Store in `.env.local` (gitignored)
- Use build-time only (no runtime access)
- Rotate periodically (every 90 days)

**Claude API:**
- Store in `.env.local` (gitignored)
- Use build-time only
- Monitor usage (prevent overages)

**reCAPTCHA:**
- Site key: Public (safe to expose)
- Secret key: Stored in Make.com (never in Git)
- Verify server-side (Make.com scenario)

### Content Security

**Headers (Netlify):**
```toml
# netlify.toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "geolocation=(), microphone=(), camera=()"
```

### Form Security

**Client-side validation + Server-side verification:**
- Client: Basic validation (required fields, email format)
- Server (Make.com): reCAPTCHA verification, TCPA compliance check

**Rate limiting:**
- Make.com: Built-in rate limiting per IP
- Honeypot field: Catch bots (hidden field)

## Performance Optimization

### LCP Optimization (Target: <2.5s)

**Critical strategies:**
1. **Inline critical CSS** (Beasties plugin)
2. **Preload hero image** (`<link rel="preload">`)
3. **Defer third-party scripts** (GTM, CallRail load after LCP)
4. **Font optimization** (next/font with `display=swap`)
5. **Server Components** (reduce client-side JS)

**Hero image preload:**
```tsx
// app/[service]/[location]/page.tsx
export default async function Page({ params }) {
  const { heroImageUrl } = await getPageData(params)

  return (
    <>
      <link rel="preload" as="image" href={heroImageUrl} />
      <Hero imageUrl={heroImageUrl} />
    </>
  )
}
```

### JavaScript Optimization

**Bundle size targets:**
- First Load JS: <100KB (gzipped)
- Route-level JS: <50KB per page

**Strategies:**
- ✅ Server Components by default (zero JS)
- ✅ Dynamic imports for below-fold components
- ✅ Tree shaking (unused code removed)
- ✅ Code splitting (automatic in Next.js)

**Example dynamic import:**
```tsx
import dynamic from 'next/dynamic'

// Load Gallery only when needed (below fold)
const Gallery = dynamic(() => import('@/components/Gallery'), {
  loading: () => <div>Loading gallery...</div>,
})
```

### Image Optimization

**Next.js Image component:**
```tsx
import Image from 'next/image'

<Image
  src={heroImageUrl}
  alt={heroImageAlt}
  width={1200}
  height={675}
  priority // Preload (above fold)
  quality={85}
/>
```

**Benefits:**
- ✅ Automatic AVIF/WebP generation
- ✅ Responsive images (srcset)
- ✅ Lazy loading (below fold)
- ✅ Blur placeholder (LQIP)

### Caching Strategy

**Cache headers (Netlify):**
```toml
# netlify.toml
[[headers]]
  for = "/images/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/_next/static/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.html"
  [headers.values]
    Cache-Control = "public, max-age=0, must-revalidate"
```

**Strategy:**
- Static assets: 1 year cache (immutable)
- HTML pages: Revalidate on every request
- API responses: No cache (build-time only)

### Build Performance

**Netlify Cache Plugin:**
```toml
# netlify.toml
[[plugins]]
package = "netlify-plugin-cache"

  [plugins.inputs]
    paths = ["node_modules", ".next/cache"]
```

**Results:**
- First build: ~10 min
- Cached builds: ~5 min (50% faster)

---

# Testing Strategy

## Overview

This section expands on testing approaches, tools, and coverage expectations.

## Testing Philosophy

**MVP Testing Approach:**
- ✅ Automated quality checks (Lighthouse, type checking, linting)
- ✅ Manual spot-checks (content quality, visual review)
- ⚠️ Unit/integration tests deferred to Phase 2 (not in MVP scope)

**Rationale:**
- Focus is on content quality and system capability validation
- Traditional test suites deferred until patterns stabilize
- Manual testing appropriate for MVP iteration speed

## Testing Types

### 1. Type Checking (TypeScript)

**Run on every commit:**
```bash
npm run type-check
```

**What it catches:**
- Type mismatches
- Missing properties
- Incorrect function signatures
- Null/undefined errors

**Coverage: 100% (strict mode enabled)**

### 2. Linting (ESLint)

**Run on every commit:**
```bash
npm run lint
```

**What it catches:**
- Code style violations
- React anti-patterns
- Accessibility issues (jsx-a11y rules)
- Unused variables
- Missing dependencies in hooks

**Rules:**
```javascript
// .eslintrc.js
module.exports = {
  extends: [
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended',
    'prettier'
  ],
  rules: {
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-unused-vars': 'error',
    'react-hooks/exhaustive-deps': 'error'
  }
}
```

### 3. Formatting (Prettier)

**Auto-format on save:**
```bash
npm run format
```

**Config:**
```javascript
// .prettierrc
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5"
}
```

### 4. Lighthouse (Performance & Accessibility)

**Automated on every deploy:**
- Performance score ≥90
- Accessibility score ≥90
- Best practices score ≥90
- SEO score ≥90

**LCP target:** <2.5s (enforced)

**If thresholds not met:** Build aborts, no deploy

### 5. Manual Testing (MVP Approach)

**Pre-Deploy Checklist:**
- [ ] Visual review (3 sample pages)
- [ ] Mobile responsiveness (iPhone, Android)
- [ ] Form submission works (test lead in Salesforce)
- [ ] Phone number displays (CallRail swap working)
- [ ] GTM + GA4 tracking fires
- [ ] Accessibility: Keyboard navigation, screen reader
- [ ] Content quality: No AI hallucinations, TCPA compliance

### 6. E2E Testing (Playwright - Future)

**When implemented (Phase 2):**
```typescript
// tests/e2e/form-submission.spec.ts
import { test, expect } from '@playwright/test'

test('three-stage form submission', async ({ page }) => {
  await page.goto('/bathroom-remodeling/charlotte')

  // Stage 1: Contact info
  await page.fill('[name="name"]', 'John Doe')
  await page.fill('[name="email"]', 'john@example.com')
  await page.fill('[name="phone"]', '555-123-4567')
  await page.click('button:has-text("Next")')

  // Stage 2: Project details
  await page.selectOption('[name="projectType"]', 'full-remodel')
  await page.click('button:has-text("Next")')

  // Stage 3: Timeline
  await page.selectOption('[name="timeline"]', '1-3-months')
  await page.click('button:has-text("Submit")')

  // Verify success
  await expect(page).toHaveURL('/thank-you')
})
```

**Coverage targets (Phase 2):**
- Critical user paths: 100%
- All components: 80%
- Utilities: 70%

## Quality Gates

### Pre-Commit Checks

**Git hooks (husky + lint-staged):**
```json
// package.json
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md}": ["prettier --write"]
  }
}
```

**Runs automatically on `git commit`:**
1. Lint staged files
2. Format staged files
3. If errors: Abort commit

### Pre-Deploy Checks

**Netlify Build:**
1. Type checking (`tsc --noEmit`)
2. Linting (`eslint`)
3. Build (`next build`)
4. Lighthouse quality gate
5. If all pass: Deploy to CDN

### Manual QA (MVP)

**Before merging PR:**
- [ ] Deploy preview link works
- [ ] Visual review (Desktop + Mobile)
- [ ] Lighthouse report reviewed
- [ ] No console errors in browser
- [ ] Content quality spot-checked

## Test Data

### Sample Pages for Testing

**Minimum test set:**
- 3 services × 3 locations = 9 pages
- 1 page with offer
- 1 page with testimonials
- 1 page with before/after gallery

**Test data location:**
```
Airtable → "Test Pages" view
- Status: "Approved"
- Tagged: "Test Data"
```

### Test Leads (Form Submissions)

**Salesforce test records:**
- Use test email domain (@example.com)
- Tag with "Test Lead" campaign
- Delete after testing

---

**End of Architecture Document**

