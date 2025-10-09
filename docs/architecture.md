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
8. [Database Schema](#database-schema)
9. [Frontend Architecture](#frontend-architecture)
10. [Backend Architecture](#backend-architecture)
11. [Unified Project Structure](#unified-project-structure)
12. [Development Workflow](#development-workflow)
13. [Deployment Architecture](#deployment-architecture)
14. [Security & Performance](#security--performance)
15. [Testing Strategy](#testing-strategy)
16. [Coding Standards](#coding-standards)
17. [Error Handling Strategy](#error-handling-strategy)
18. [Monitoring and Observability](#monitoring-and-observability)

---

# Introduction

This document outlines the complete fullstack architecture for **Landing Pages Automation v2**, a Jamstack-based system for generating high-performance, conversion-optimized landing pages for home service contractors targeting paid traffic (Google Ads Performance Max).

This unified approach combines frontend and backend architectural concerns into a single source of truth for AI-driven development, ensuring consistency across the entire technology stack.

## Project Context

**Primary Goal:** Generate static landing pages optimized for Google Ads Quality Score (LCP <2.5s critical) with conversion tracking via GTM, CallRail, and GA4.

**Key Constraint:** **NO serverless functions** - Previous deployment failed with monorepo + Netlify Functions. This architecture uses build-time static generation ONLY.

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
- ✅ Netlify CDN hosting (NO serverless functions)
- ✅ Airtable for data storage and approval workflow
- ✅ Claude API (Anthropic) for AI content generation
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

Landing Pages Automation v2 is a **Jamstack application** built with **Next.js 15 App Router in static export mode** (`output: 'export'`), deployed to **Netlify CDN** for global edge distribution. The system generates conversion-optimized landing pages at build time by fetching content from **Airtable** (exported to JSON) and enriching it with AI-generated content from **Claude API** (Trust Bar, Gallery, FAQ). At runtime, static pages load instantly from CDN (<50ms globally), achieving **LCP <2.5s** through critical CSS inlining, self-hosted fonts (WOFF2), build-time image optimization (AVIF/WebP), and deferred third-party scripts (`strategy="lazyOnload"`). Client-side hydration enables interactive **3-stage progressive forms** that submit to **Make.com webhooks** for **Salesforce lead creation** via OAuth 2. Conversion tracking is handled by **GTM, CallRail, and GA4** with all scripts loaded post-LCP to preserve sub-2.5s targets critical for Google Ads Quality Score.

This architecture achieves PRD goals through **performance** (static CDN + aggressive optimization = 0.8-2.0s LCP), **scalability** (proven Next.js 15 static export handles 5000+ pages), **maintainability** (flat structure, clear separation of concerns), and **cost efficiency** (no serverless functions, Netlify free tier: 100GB bandwidth, 300 build mins/month).

## Platform and Infrastructure Choice

**Selected Platform:** Netlify CDN

**Rationale:**
- PRD constraint: "NO serverless functions" (locked from previous deployment failure)
- Static CDN hosting is the ONLY viable architecture
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
- Netlify: $0 (free tier sufficient for pilot, $19/mo Pro if >100GB bandwidth)
- Claude API: $0.50-1.00 (500 pages × 3 AI sections × ~2K tokens @ $0.003/1K)
- Make.com: $9/mo (Core tier for >1000 form submissions/month)
- **Total:** ~$10-30/month per client

**Infrastructure Diagram:**

```
┌──────────────────────────────────────────────────────────────────┐
│                   PRE-BUILD (Local/CI)                           │
│  (Developer Machine or GitHub Actions)                           │
└──────────────────────────────────────────────────────────────────┘
                              ↓
              ┌──────────────────────────────────┐
              │  1. Export from Airtable         │
              │     - Fetch approved content     │
              │     - Save to content.json       │
              └──────────────────────────────────┘
                              ↓
              ┌──────────────────────────────────┐
              │  2. Call Claude API (parallel)   │
              │     - Generate Trust Bar         │
              │     - Generate Gallery           │
              │     - Generate FAQ               │
              │     - Save to ai-content.json    │
              │     (500 pages × 3 sections)     │
              └──────────────────────────────────┘
                              ↓
              ┌──────────────────────────────────┐
              │  3. Commit to Git                │
              │     - content.json               │
              │     - ai-content.json            │
              │     - Git push → main branch     │
              └──────────────────────────────────┘
                              ↓
                     **Triggers Netlify Build**

┌──────────────────────────────────────────────────────────────────┐
│                    NETLIFY BUILD TIME                            │
│  (Netlify Build Agent: 4-8GB RAM, 120-180s timeout per page)    │
└──────────────────────────────────────────────────────────────────┘
                              ↓
    Git Push → Netlify Webhook → Netlify Build Starts
                              ↓
              ┌──────────────────────────────────┐
              │  1. Read content.json from Git   │
              │     (NO Airtable API calls)      │
              └──────────────────────────────────┘
                              ↓
              ┌──────────────────────────────────┐
              │  2. Read ai-content.json         │
              │     (NO Claude API calls)        │
              └──────────────────────────────────┘
                              ↓
              ┌──────────────────────────────────┐
              │  3. next build (App Router)      │
              │     - generateStaticParams()     │
              │       → 500+ routes              │
              │     - generateMetadata()         │
              │       → SEO meta tags            │
              │     - Build static HTML/CSS/JS   │
              │     (Reads from JSON files)      │
              └──────────────────────────────────┘
                              ↓
              ┌──────────────────────────────────┐
              │  4. Post-Build Optimization      │
              │     - Extract critical CSS       │
              │     - Optimize images (Sharp)    │
              │     - Generate sitemap.xml       │
              └──────────────────────────────────┘
                              ↓
              ┌──────────────────────────────────┐
              │  5. Deploy to Netlify CDN        │
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

**Build Performance Estimates (500 pages):**

**Pre-Build (Local/CI - one time per content update):**
- **Airtable Export:** 1-2 minutes (fetch all approved content → content.json)
- **Claude API Calls:** 500 pages × 3 sections = 1500 calls (~5-10 mins with parallel batching, rate limits)
- **Git Commit & Push:** 30-60 seconds (content.json + ai-content.json)
- **Pre-Build Total:** ~7-13 minutes

**Netlify Build (every deployment):**
- **Build Time:** 5-10 minutes (Next.js 15 static generation, reads from JSON files)
- **Memory Usage:** 4-8GB peak (Next.js 15 with `webpackMemoryOptimizations`)
- **Airtable API Calls:** 0 (reads from committed content.json)
- **Claude API Calls:** 0 (reads from committed ai-content.json)
- **CDN Deploy Time:** 1-2 minutes (Netlify upload + cache invalidation)
- **Netlify Build Total:** ~6-12 minutes

**Key Benefit:** Netlify builds are FAST (6-12 mins) because no external API calls. Pre-build only runs when content changes.

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
- ✅ `content.json` - Pre-generated Airtable export (committed to Git)
- ✅ `ai-content.json` - Pre-generated Claude API content (committed to Git)

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

### Airtable MCP Server (Alternative/Enhancement)

**Version:** Multiple options available (domdomegg/airtable-mcp-server, felores/airtable-mcp, @loticdigital/airtable-mcp-server)

**Purpose:** Enable AI-assisted Airtable operations during development and pre-build scripting

**Why Consider MCP:**
- ✅ Natural language queries to Airtable during development
- ✅ Schema inspection and validation
- ✅ Automated data transformations
- ✅ AI-assisted content approval workflows
- ✅ Integration with Claude Code for development

**Recommended MCP Server:** `domdomegg/airtable-mcp-server` (most comprehensive coverage)

**Configuration (Claude Desktop):**
```json
{
  "mcpServers": {
    "airtable": {
      "command": "npx",
      "args": ["-y", "airtable-mcp-server"],
      "env": {
        "AIRTABLE_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

**Required Scopes:**
- `schema.bases:read` - Read base schemas
- `data.records:read` - Read records
- `schema.bases:write` (optional) - Modify schemas
- `data.records:write` (optional) - Write records

**Use Cases:**
- Development: Query Airtable data naturally during coding
- Pre-build: AI-assisted data validation and transformation
- Testing: Generate test data fixtures from Airtable
- Documentation: Auto-generate docs from Airtable schema

**Decision:** Use traditional SDK for production builds, MCP for development enhancement (optional)

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
| **Airtable MCP** | N/A | N/A | **airtable-mcp-server** | ➕ Add | Optional dev enhancement |
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

### 🔍 Low Priority (Future Consideration):
12. **Airtable MCP Server** - Optional development enhancement

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

**Base Name:** `Landing Pages Content Management`

**Purpose:** Central content repository managed by non-technical stakeholders

#### Table 1: `Pages`

**Purpose:** Define which landing pages should be generated

| Field Name | Type | Required | Description | Example |
|------------|------|----------|-------------|---------|
| `Page ID` | Auto Number | Yes | Unique identifier | `1234` |
| `Service` | Single Line Text | Yes | Service type (URL slug) | `bathroom-remodeling` |
| `Location` | Single Line Text | Yes | City name (URL slug) | `charlotte` |
| `Status` | Single Select | Yes | `Draft \| Approved \| Archived` | `Approved` |
| `Client Name` | Link to `Clients` | Yes | Link to client configuration | `Baths R Us` |
| `SEO Title` | Single Line Text | Yes | Meta title (50-60 chars) | `Bathroom Remodeling Charlotte NC \| Baths R Us` |
| `SEO Description` | Long Text | Yes | Meta description (150-160 chars) | `Top-rated bathroom remodeling in Charlotte...` |
| `H1 Headline` | Single Line Text | Yes | Page hero headline | `Transform Your Bathroom in Charlotte` |
| `Hero Subheadline` | Long Text | Yes | Supporting hero text | `Licensed, insured, and trusted by 500+ homeowners` |
| `CTA Text` | Single Line Text | Yes | Primary CTA button text | `Get Free Quote` |
| `CTA URL` | URL | No | External CTA destination (if any) | `https://example.com/quote` |
| `Hero Image URL` | URL | Yes | Cloudinary/external image URL | `https://res.cloudinary.com/...` |
| `Created Date` | Created Time | Auto | When record was created | `2025-01-08` |
| `Last Modified` | Last Modified | Auto | Last edit timestamp | `2025-01-09` |
| `Notes` | Long Text | No | Internal notes/comments | `Client requested emphasis on speed` |

**View: `Approved`** - Filtered to `Status = "Approved"` (only these pages are exported)

---

#### Table 2: `Clients`

**Purpose:** Store client-specific branding and configuration

| Field Name | Type | Required | Description | Example |
|------------|------|----------|-------------|---------|
| `Client ID` | Auto Number | Yes | Unique identifier | `42` |
| `Client Name` | Single Line Text | Yes | Business name | `Baths R Us` |
| `Domain` | URL | Yes | Production domain | `https://bathsrus.com` |
| `Primary Color` | Single Line Text | Yes | Brand color (hex) | `#0ea5e9` |
| `Secondary Color` | Single Line Text | Yes | Accent color (hex) | `#8b5cf6` |
| `Logo URL` | URL | Yes | Cloudinary logo URL | `https://res.cloudinary.com/client-logo.png` |
| `Phone Number` | Phone | Yes | Business phone | `(704) 555-1234` |
| `Email` | Email | Yes | Contact email | `info@bathsrus.com` |
| `Google Fonts` | Single Line Text | No | Font family to load | `Inter, Roboto` |
| `GTM Container ID` | Single Line Text | No | Google Tag Manager ID | `GTM-XXXXXXX` |
| `CallRail Swap Target` | Single Line Text | No | CallRail number swap script | `CR-123456` |
| `Make.com Webhook URL` | URL | Yes | Form submission endpoint | `https://hook.us1.make.com/abc123` |
| `reCAPTCHA Site Key` | Single Line Text | Yes | reCAPTCHA v3 public key | `6Lc...` |
| `Salesforce Campaign ID` | Single Line Text | No | Campaign tracking ID | `7012A000000ABCD` |
| `Active` | Checkbox | Yes | Client is active | `true` |
| `Pages` | Link to `Pages` | Auto | Linked pages | `[1234, 1235, ...]` |

---

#### Table 3: `Content Blocks`

**Purpose:** Reusable content sections (features, trust signals, FAQs)

| Field Name | Type | Required | Description | Example |
|------------|------|----------|-------------|---------|
| `Block ID` | Auto Number | Yes | Unique identifier | `789` |
| `Block Type` | Single Select | Yes | `Feature \| Trust Signal \| FAQ \| Testimonial` | `Feature` |
| `Page ID` | Link to `Pages` | Yes | Associated page | `1234` |
| `Heading` | Single Line Text | No | Block title | `Licensed & Insured` |
| `Body Text` | Long Text | Yes | Main content | `Fully licensed contractors with $2M insurance` |
| `Icon Name` | Single Line Text | No | Icon identifier (if any) | `shield-check` |
| `Image URL` | URL | No | Optional image | `https://res.cloudinary.com/...` |
| `Order` | Number | Yes | Display order (1, 2, 3...) | `1` |
| `AI Generated` | Checkbox | Auto | Was content generated by Claude? | `true` |
| `Generated Date` | Created Time | Auto | When AI content was created | `2025-01-08` |

---

#### Table 4: `AI Content Queue`

**Purpose:** Track which content blocks need AI generation or regeneration

| Field Name | Type | Required | Description | Example |
|------------|------|----------|-------------|---------|
| `Queue ID` | Auto Number | Yes | Unique identifier | `99` |
| `Page ID` | Link to `Pages` | Yes | Target page | `1234` |
| `Content Type` | Single Select | Yes | `Trust Signals \| Features \| FAQ \| Meta Description` | `Trust Signals` |
| `Status` | Single Select | Yes | `Pending \| Processing \| Complete \| Failed` | `Pending` |
| `Prompt Template` | Long Text | Yes | Claude API prompt | `Generate 5 trust signals for {service}...` |
| `Generated Content` | Long Text | No | Claude API response | `[JSON array of trust signals]` |
| `Token Count` | Number | No | API tokens used | `342` |
| `Error Message` | Long Text | No | If generation failed | `API rate limit exceeded` |
| `Created Date` | Created Time | Auto | When queued | `2025-01-08 10:30` |
| `Completed Date` | Last Modified | Auto | When processing finished | `2025-01-08 10:31` |

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

## Why NOT Use Netlify Functions

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

