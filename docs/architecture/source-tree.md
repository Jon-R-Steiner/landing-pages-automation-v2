# Source Tree

> **Purpose**: This document consolidates the repository structure and file organization for the dev agent to reference on every story. It combines repository layout and organization patterns from the sharded architecture documents.

---

## Repository Approach

**Approach:** **FLAT** (Standard Next.js 15 project, NOT monorepo)

**Decision Rationale:**
- ✅ Previous deployment failed with monorepo + Netlify Functions
- ✅ Single Next.js app with no backend API we write (all external services)
- ✅ No need for Nx, Turborepo, or Lerna complexity
- ✅ Simpler CI/CD, debugging, onboarding, and dependency management
- ✅ Faster builds (no monorepo orchestration overhead)

---

## Project Root Structure

```
landing-pages-automation-v2/
├── .bmad-core/                      # BMAD framework (tasks, templates, agents)
│   ├── tasks/
│   ├── templates/
│   └── data/
├── .claude/                         # Claude Code configuration
├── docs/                            # Architecture, PRD, ADRs, specs
│   ├── architecture/                # Sharded architecture documents (78 files)
│   ├── workflows/                   # Operational workflows
│   ├── integrations/                # Integration strategies
│   ├── diagrams/                    # Visual overviews
│   ├── prd/                         # Sharded PRD sections
│   ├── stories/                     # User stories for development
│   └── qa/                          # QA results and gates
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
│   │   ├── globals.css              # Base styles + Tailwind CSS v4 import
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

---

## Netlify Build Requirements

### What Netlify NEEDS (for build):

- ✅ `src/` - Source code (Next.js 15 App Router pages and components)
- ✅ `public/` - Static assets (images, fonts, favicons)
- ✅ `scripts/` - Build scripts (if called during Netlify build commands)
- ✅ `package.json` - Dependencies and build scripts
- ✅ `next.config.js` - Next.js configuration
- ✅ `tsconfig.json` - TypeScript compiler configuration
- ✅ `tailwind.config.js` - Tailwind CSS configuration (if using Tailwind)
- ✅ `content.json` - Pre-exported Airtable data including AI-generated content (committed to Git)

### What Netlify DOESN'T NEED (development/documentation only):

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

## Key Directories Explained

### `src/app/` - Next.js 15 App Router pages and layouts

- Dynamic routes: `[service]/[location]/page.tsx` generates 500+ pages
- Static metadata via `generateMetadata()` for SEO
- Uses `export const dynamic = 'force-static'` (required for static export)

### `src/components/` - Reusable React components

**Component Structure (one component per directory):**

```
src/components/TrustBar/
├── TrustBar.tsx          # Component implementation
├── TrustBar.test.tsx     # Unit tests
└── index.ts              # Barrel export
```

**Key Components:**
- `ThreeStageForm/` - Progressive form with localStorage persistence
- `TrustBar/`, `Gallery/`, `FAQ/` - AI-generated conversion components
- `LazySection/` - Intersection Observer wrapper for below-fold lazy loading

### `src/lib/` - Utilities and API clients

- `airtable.ts` - Airtable SDK (build-time data fetching)
- `claude.ts` - Claude API client (build-time AI generation)
- `makeWebhook.ts` - Form submission utilities
- `imageLoader.ts` - Custom image optimization loader

### `src/types/` - TypeScript type definitions

**File naming:**
- `*.types.ts` for type-only files
- Co-located with usage when possible

```typescript
// src/types/airtable.types.ts
export interface PageData {
  pageId: string
  service: string
  location: string
  // ...
}
```

### `scripts/` - Build-time automation

- `export-airtable-to-json.js` - Export Airtable to JSON (eliminates API dependency during build)
- `optimize-images.js` - Sharp-based image optimization (AVIF, WebP, JPEG)
- `extract-critical-css.js` - Critical CSS extraction per page

### `tests/` - All test files (unit, integration, E2E)

- Separate from source code for clarity
- Playwright for E2E testing (preferred for Next.js 15)
- Run in GitHub Actions CI, NOT during Netlify build

---

## File Organization Patterns

### Component Files

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

### Import Organization

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

---

## Path Aliases

**TypeScript path mapping (`tsconfig.json`):**

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

**Usage:**
```typescript
// ✅ Good (absolute import with alias)
import { TrustBar } from '@/components/TrustBar'
import { getPageData } from '@/lib/airtable'

// ❌ Avoid (deep relative imports)
import { TrustBar } from '../../../components/TrustBar'
```

---

## Environment Variables

### Local Development (`.env.local`):

```bash
# Airtable
AIRTABLE_API_KEY=keyXXXXXX
AIRTABLE_BASE_ID=appXXXXXX

# Claude API
CLAUDE_API_KEY=sk-ant-XXXXXX

# Make.com
MAKE_WEBHOOK_URL=https://hook.eu1.make.com/XXXXXX

# reCAPTCHA
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=XXXXXX
RECAPTCHA_SECRET_KEY=XXXXXX
```

### Production (`.env.production`):

- Managed via Netlify environment variables UI
- Same keys as local, production values
- `NEXT_PUBLIC_*` variables exposed to client-side code

---

## Documentation Organization

### `docs/architecture/` - Technical reference (78 sharded files)

**Semantic organization:**
- Project context and principles
- Technology decisions and standards
- Workflows and processes
- Error handling and monitoring
- Testing and quality gates

### `docs/workflows/` - Operational workflows

- Step-by-step process documentation
- Cross-team coordination guides

### `docs/integrations/` - Integration strategies

- Third-party service integration guides
- API documentation and patterns

### `docs/diagrams/` - Visual overviews

- System architecture diagrams
- Workflow visualizations
- Technology flow charts

---

## Related Documents

For additional context, see:
- [Repository Structure](./repository-structure.md) - Complete project structure details
- [File Organization](./file-organization.md) - File organization patterns
- [Component Structure](./component-structure.md) - Component organization standards
