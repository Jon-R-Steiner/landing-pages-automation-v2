# Repository Structure

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
