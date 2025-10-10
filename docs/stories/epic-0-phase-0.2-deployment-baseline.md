# Story: Epic 0 Phase 0.2 - Deployment Baseline ("Hello World" Proof)

---

## Story Metadata

**Story ID:** EPIC-0-PHASE-0.2
**Epic:** Epic 0 - Foundation & Infrastructure
**Phase:** Phase 0.2 - Deployment Baseline
**Owner:** Developer Agent
**Architect Review Required:** Yes (Winston - Architect)
**Estimated Effort:** 6-10 hours (1-2 days)
**Priority:** Critical (Blocks all subsequent development)
**Status:** Ready for Development

**Netlify Configuration:**
- **Project URL:** https://landing-pages-automation-v2.netlify.app
- **Project ID:** f9c8e0d6-235a-4aa5-b98c-9f21ee840831
- **Status:** Connected and configured (awaiting code)

---

## User Story

**As a** development team,
**I want** a minimal Next.js 15 application deployed to Netlify with validated architecture,
**So that** we can prove our tech stack decisions and establish a solid foundation for 500+ landing pages.

---

## Context & Background

### What Is This Story?

This is the **first development story** in the project. Phase 0.1 (Architecture Research & ADRs) is complete with 30-35 ADRs documented. This story validates those architectural decisions with a working deployment.

### What "Hello World" Means for This Project

This is NOT a simple `console.log()` demo. This is a **production-ready deployment baseline** that proves:

- ✅ Next.js 15 App Router with static export works
- ✅ TypeScript strict mode compiles without errors
- ✅ Tailwind CSS v4 applies styles correctly
- ✅ Dynamic routes generate static pages via `generateStaticParams()`
- ✅ Netlify deployment succeeds with target performance metrics
- ✅ Core Web Vitals meet Quality Score requirements (LCP <2.5s)
- ✅ Mobile-responsive design works (320px → 1440px)

### Why This Story Matters

**Validation:** Proves 10+ architecture decisions (ADR-001, ADR-003, ADR-004, ADR-005, ADR-006, ADR-009, ADR-011, ADR-016, ADR-020, ADR-031)

**Risk Reduction:** Catches configuration issues early (before building 500+ pages)

**Foundation:** Establishes patterns for all future development

---

## Technical Requirements

### Architecture Decisions Being Validated

| ADR | Decision | How This Story Validates It |
|-----|----------|------------------------------|
| **ADR-001** | Flat repository (not monorepo) | Simple Next.js project structure |
| **ADR-003** | npm package manager | `package-lock.json` committed |
| **ADR-004** | Node.js v22+ | `.nvmrc` file + Netlify build |
| **ADR-005** | Static data fetching patterns | `generateStaticParams()` implementation |
| **ADR-006** | `generateStaticParams()` for dynamic routes | `[service]/[location]` route works |
| **ADR-009** | Static export configuration | `output: 'export'` in `next.config.js` |
| **ADR-011** | `netlify.toml` configuration | Successful Netlify deployment |
| **ADR-016** | Tailwind CSS v4 | Styling compiles and applies |
| **ADR-020** | Performance monitoring | Lighthouse CI validation |
| **ADR-031** | Mobile optimization | Responsive design + 3G testing |

### Technology Stack (from `tech-stack.md`)

**Frontend:**
- Next.js 15.5.0+ (App Router, static export)
- React 19.2.0+
- TypeScript 5.9.0+ (strict mode)
- Tailwind CSS 4.0.0+ (CSS-first configuration)

**Build Tools:**
- Node.js v22+ (required for Netlify MCP; supports Tailwind CSS v4)
- npm (package manager)

**Deployment:**
- Netlify CDN (static hosting)
- GitHub integration (auto-deploy on push)

---

## Implementation Tasks

### Task 1: Initialize Next.js 15 Project (1-2 hours)

**Objective:** Create project foundation with all dependencies

**Files to Create:**

#### 1.1 `package.json`
```json
{
  "name": "landing-pages-automation-v2",
  "version": "0.2.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "next": "^15.5.0",
    "react": "^19.2.0",
    "react-dom": "^19.2.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "typescript": "^5.9.0",
    "tailwindcss": "^4.0.0",
    "@tailwindcss/postcss": "^4.0.0",
    "postcss": "^8.4.0",
    "eslint": "^8.0.0",
    "eslint-config-next": "^15.5.0"
  },
  "engines": {
    "node": ">=22.0.0"
  }
}
```

#### 1.2 `.nvmrc`
```
22
```

#### 1.3 `tsconfig.json`
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

#### 1.4 `postcss.config.mjs`
```javascript
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}
```

#### 1.5 `.gitignore`
```
# dependencies
/node_modules
/.pnp
.pnp.*

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local
.env

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts

# netlify
.netlify
```

**Validation:**
```bash
npm install
npm run dev
# Should start dev server on http://localhost:3000 (even if no pages yet)
```

**Success Criteria:**
- [ ] All dependencies install without errors
- [ ] TypeScript compilation succeeds
- [ ] Dev server starts successfully

---

### Task 2: Configure Static Export (1 hour)

**Objective:** Configure Next.js for static export and Netlify deployment

**Files to Create:**

#### 2.1 `next.config.js`
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // CRITICAL: Static export mode (no serverless functions at runtime)
  output: 'export',

  // Disable features not supported in static export
  images: {
    unoptimized: true, // next/image doesn't work with output: 'export'
  },

  // Memory optimization for large static builds (future: 500+ pages)
  experimental: {
    webpackMemoryOptimizations: true,
  },

  // SEO optimization: trailing slashes for clean URLs
  trailingSlash: true,

  // Disable source maps in production (smaller bundle)
  productionBrowserSourceMaps: false,
}

module.exports = nextConfig
```

#### 2.2 `netlify.toml`
```toml
[build]
  command = "npm run build"
  publish = "out"

[build.environment]
  NODE_VERSION = "22"
  NPM_FLAGS = "--legacy-peer-deps"

# Redirect rules (optional for future)
[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

# Cache optimization
[[headers]]
  for = "/out/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

**Validation:**
```bash
npm run build
# Should create out/ directory with index.html
ls -la out/
```

**Success Criteria:**
- [ ] `out/` directory created
- [ ] `out/index.html` exists
- [ ] No build errors

---

### Task 3: Create Minimal App Structure (2-3 hours)

**Objective:** Build minimal Next.js app with dynamic routes

**Directory Structure to Create:**
```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── [service]/
│       └── [location]/
│           └── page.tsx
├── components/
│   └── Hero/
│       ├── Hero.tsx
│       └── index.ts
├── styles/
│   └── globals.css
└── types/
    └── page.types.ts
```

**Files to Create:**

#### 3.1 `src/types/page.types.ts`
```typescript
export interface PageData {
  service: string
  location: string
  title: string
  description: string
}

export interface PageParams {
  service: string
  location: string
}
```

#### 3.2 `src/styles/globals.css`
```css
/* Import Tailwind CSS v4 */
@import "tailwindcss";

/* CSS-first theme configuration (replaces tailwind.config.js) */
@theme {
  /* Custom brand colors */
  --color-primary: #0ea5e9;
  --color-secondary: #8b5cf6;

  /* Typography */
  --font-sans: system-ui, -apple-system, sans-serif;
}

/* Base styles */
body {
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

#### 3.3 `src/app/layout.tsx`
```typescript
import type { Metadata } from 'next'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: 'Landing Pages Automation v2',
  description: 'Deployment baseline for Next.js 15 + Tailwind CSS v4',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-gray-900">
        {children}
      </body>
    </html>
  )
}
```

#### 3.4 `src/components/Hero/Hero.tsx`
```typescript
interface HeroProps {
  title: string
  description: string
}

export default function Hero({ title, description }: HeroProps) {
  return (
    <div className="bg-gradient-to-r from-primary to-secondary py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          {title}
        </h1>
        <p className="text-xl text-white/90 mb-8">
          {description}
        </p>
        <a
          href="#contact"
          className="inline-block bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
        >
          Get Started
        </a>
      </div>
    </div>
  )
}
```

#### 3.5 `src/components/Hero/index.ts`
```typescript
export { default } from './Hero'
```

#### 3.6 `src/app/page.tsx`
```typescript
import Hero from '@/components/Hero'

export default function HomePage() {
  return (
    <main>
      <Hero
        title="Welcome to Landing Pages Automation v2"
        description="Phase 0.2 Deployment Baseline - Next.js 15 + Tailwind CSS v4"
      />
      <section className="max-w-4xl mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold mb-6">Deployment Baseline Features</h2>
        <ul className="space-y-4 text-lg">
          <li>✅ Next.js 15 App Router with static export</li>
          <li>✅ TypeScript strict mode enabled</li>
          <li>✅ Tailwind CSS v4 with CSS-first configuration</li>
          <li>✅ Dynamic routes via generateStaticParams()</li>
          <li>✅ Deployed to Netlify CDN</li>
          <li>✅ Core Web Vitals optimized (LCP &lt;2.5s)</li>
        </ul>
      </section>
    </main>
  )
}
```

#### 3.7 `src/app/[service]/[location]/page.tsx`
```typescript
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Hero from '@/components/Hero'
import type { PageParams, PageData } from '@/types/page.types'

// Hardcoded test data (replaces Airtable in Phase 0.3+)
const SAMPLE_PAGES: PageData[] = [
  {
    service: 'bathroom-remodeling',
    location: 'chicago-il',
    title: 'Bathroom Remodeling in Chicago, IL',
    description: 'Professional bathroom remodeling services in Chicago, Illinois. Licensed & insured contractors.',
  },
  {
    service: 'walk-in-showers',
    location: 'naperville-il',
    title: 'Walk-In Showers in Naperville, IL',
    description: 'Custom walk-in shower installation in Naperville, Illinois. Expert craftsmanship.',
  },
  {
    service: 'tub-to-shower',
    location: 'aurora-il',
    title: 'Tub to Shower Conversion in Aurora, IL',
    description: 'Convert your old tub to a modern shower in Aurora, Illinois. Quick turnaround.',
  },
]

// CRITICAL: Next.js 15 requires this for static export
export async function generateStaticParams() {
  return SAMPLE_PAGES.map((page) => ({
    service: page.service,
    location: page.location,
  }))
}

// Dynamic metadata generation
export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>
}): Promise<Metadata> {
  // Next.js 15 breaking change: params is now async
  const { service, location } = await params

  const pageData = SAMPLE_PAGES.find(
    (p) => p.service === service && p.location === location
  )

  if (!pageData) {
    return {
      title: 'Page Not Found',
    }
  }

  return {
    title: pageData.title,
    description: pageData.description,
  }
}

// Page component
export default async function ServiceLocationPage({
  params,
}: {
  params: Promise<PageParams>
}) {
  // Next.js 15 breaking change: params is now async
  const { service, location } = await params

  const pageData = SAMPLE_PAGES.find(
    (p) => p.service === service && p.location === location
  )

  if (!pageData) {
    notFound()
  }

  return (
    <main>
      <Hero title={pageData.title} description={pageData.description} />
      <section className="max-w-4xl mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold mb-6">About This Page</h2>
        <p className="text-lg mb-4">
          This is a dynamically generated page using Next.js 15's{' '}
          <code className="bg-gray-100 px-2 py-1 rounded">generateStaticParams()</code> function.
        </p>
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="font-semibold mb-2">Page Data:</h3>
          <ul className="space-y-1 text-sm font-mono">
            <li>Service: {service}</li>
            <li>Location: {location}</li>
          </ul>
        </div>
      </section>
    </main>
  )
}
```

**Validation:**
```bash
npm run dev
# Visit:
# http://localhost:3000 (home page)
# http://localhost:3000/bathroom-remodeling/chicago-il (dynamic page 1)
# http://localhost:3000/walk-in-showers/naperville-il (dynamic page 2)
# http://localhost:3000/tub-to-shower/aurora-il (dynamic page 3)

npm run build
# Should generate:
# out/index.html
# out/bathroom-remodeling/chicago-il/index.html
# out/walk-in-showers/naperville-il/index.html
# out/tub-to-shower/aurora-il/index.html
```

**Success Criteria:**
- [ ] Dev server shows all pages correctly
- [ ] Tailwind CSS styles apply
- [ ] TypeScript compiles without errors
- [ ] Build generates 4 HTML files (1 home + 3 dynamic)
- [ ] No console errors or warnings

---

### Task 4: Deploy to Netlify (1-2 hours)

**Objective:** Deploy to Netlify and verify production deployment

**Steps:**

#### 4.1 Netlify Already Configured ✅

**Good news!** Netlify is already set up and ready:
- **Project URL:** https://landing-pages-automation-v2.netlify.app
- **GitHub repo:** Connected to `Jon-R-Steiner/landing-pages-automation-v2`
- **Branch:** master
- **Build command:** `npm run build`
- **Publish directory:** `out`
- **Auto-deploy:** Enabled

#### 4.2 Push Code to Trigger Deployment
1. Commit all source code (Tasks 1-3)
2. Push to GitHub master branch
3. Netlify will automatically detect push and start build
4. Monitor build at: https://app.netlify.com/sites/landing-pages-automation-v2/deploys

#### 4.3 Monitor Build Progress
- Wait 5-10 minutes for build
- Watch build logs for errors
- Verify successful deployment

**Validation:**
```bash
# After successful deployment, test all routes:
curl https://landing-pages-automation-v2.netlify.app/
curl https://landing-pages-automation-v2.netlify.app/bathroom-remodeling/chicago-il/
curl https://landing-pages-automation-v2.netlify.app/walk-in-showers/naperville-il/
curl https://landing-pages-automation-v2.netlify.app/tub-to-shower/aurora-il/

# All should return 200 OK with HTML content
```

**Success Criteria:**
- [ ] Netlify build succeeds (green checkmark)
- [ ] Public URL accessible
- [ ] All 4 routes load correctly
- [ ] HTTPS auto-configured
- [ ] No 404 errors

---

### Task 5: Performance Validation (1 hour)

**Objective:** Validate Core Web Vitals and mobile responsiveness

**Steps:**

#### 5.1 Run Lighthouse CI
```bash
# Install Lighthouse CI
npm install -g @lhci/cli

# Run Lighthouse on production URL
lhci autorun --collect.url=https://landing-pages-automation-v2.netlify.app/

# Or use Chrome DevTools:
# 1. Open production URL in Chrome
# 2. F12 → Lighthouse tab
# 3. Generate report (Mobile + Desktop)
```

#### 5.2 Validate Core Web Vitals Targets

**Mobile (Primary):**
- [ ] LCP (Largest Contentful Paint): <2.5s ✅ TARGET
- [ ] FID (First Input Delay): <100ms ✅ TARGET
- [ ] CLS (Cumulative Layout Shift): <0.1 ✅ TARGET
- [ ] Performance Score: 90+ ✅ GOAL

**Desktop (Secondary):**
- [ ] LCP: <1.5s
- [ ] Performance Score: 95+

#### 5.3 Mobile Responsiveness Testing
```bash
# Test in Chrome DevTools Device Mode:
# 1. F12 → Toggle device toolbar (Ctrl+Shift+M)
# 2. Test at:
#    - 320px (iPhone SE)
#    - 375px (iPhone 12/13)
#    - 768px (iPad)
#    - 1440px (Desktop)
# 3. Verify:
#    - All content visible (no horizontal scroll)
#    - Text readable (minimum 16px)
#    - Tap targets ≥44px
```

#### 5.4 Document Performance Baseline
Create `docs/qa/phase-0.2-performance-baseline.md`:
```markdown
# Phase 0.2 Performance Baseline

**Date:** [YYYY-MM-DD]
**Deployment URL:** https://landing-pages-automation-v2.netlify.app/

## Lighthouse Scores (Mobile)
- Performance: XX/100
- Accessibility: XX/100
- Best Practices: XX/100
- SEO: XX/100

## Core Web Vitals
- LCP: X.Xs
- FID: XXms
- CLS: 0.XX

## Notes
[Any issues or observations]
```

**Success Criteria:**
- [ ] All Core Web Vitals meet targets
- [ ] Lighthouse Performance Score ≥90
- [ ] Mobile-responsive at all breakpoints
- [ ] Performance baseline documented

---

## Acceptance Criteria

### Must Have (Blocking)
- [ ] **Project initialized:** `package.json` with all dependencies
- [ ] **TypeScript strict mode:** Compiles without errors
- [ ] **Tailwind CSS v4:** Styles apply correctly
- [ ] **Next.js static export:** `output: 'export'` configured
- [ ] **Dynamic routes:** 3 pages generated via `generateStaticParams()`
- [ ] **Netlify deployment:** Public URL accessible, all routes work
- [ ] **Core Web Vitals:** LCP <2.5s, FID <100ms, CLS <0.1
- [ ] **Mobile-responsive:** Works at 320px, 375px, 768px, 1440px
- [ ] **Performance Score:** Lighthouse ≥90 on mobile
- [ ] **No errors:** Console clean, build succeeds, no TypeScript errors

### Nice to Have (Non-Blocking)
- [ ] Lighthouse Performance Score ≥95
- [ ] Accessibility Score ≥95
- [ ] All routes pass HTML validation (W3C)
- [ ] GitHub Actions CI/CD configured (future)

---

## Architecture Validation Checklist

After completing this story, verify these architecture decisions:

- [ ] **ADR-001 (Flat Repo):** Netlify build is simple, no monorepo complexity
- [ ] **ADR-003 (npm):** `package-lock.json` reliable, no peer dependency issues
- [ ] **ADR-004 (Node v22):** Tailwind CSS v4 and Netlify MCP compatibility verified
- [ ] **ADR-005 (Static Data Fetching):** `generateStaticParams()` works as expected
- [ ] **ADR-006 (Dynamic Routes):** `[service]/[location]` routing works
- [ ] **ADR-007 (Server vs Client Components):** No "use client" needed yet (all Server Components)
- [ ] **ADR-009 (Static Export):** `output: 'export'` generates clean static HTML
- [ ] **ADR-011 (netlify.toml):** Build configuration correct, deployment succeeds
- [ ] **ADR-016 (Tailwind CSS v4):** CSS-first config works, styles apply
- [ ] **ADR-020 (Performance Monitoring):** Lighthouse CI provides baseline metrics
- [ ] **ADR-031 (Mobile Optimization):** Responsive design works on all devices

---

## Definition of Done

This story is complete when:

1. ✅ All 5 implementation tasks finished
2. ✅ All acceptance criteria met
3. ✅ Production deployment accessible at public Netlify URL
4. ✅ Performance baseline documented in `docs/qa/`
5. ✅ Architect review completed (Winston approves)
6. ✅ Code committed to `main` branch with clear commit message
7. ✅ README.md updated with deployment URL and instructions

---

## Key References

**Architecture Documents (Auto-Loaded by Dev Agent):**
- `docs/architecture/coding-standards.md` - All coding conventions
- `docs/architecture/tech-stack.md` - Complete technology stack
- `docs/architecture/source-tree.md` - Repository structure

**Additional Context:**
- `Archive/Epic-0-Phase-0.1-ADR-Task-List.md` - All ADRs from Phase 0.1
- `docs/architecture/frontend-technologies.md` - Next.js 15, React 19, TypeScript details
- `docs/architecture/performance-optimization.md` - Core Web Vitals targets
- `docs/architecture/mobile-optimization-checklist.md` - Mobile-first requirements

---

## Troubleshooting Guide

### Common Issues & Solutions

**Issue 1: Tailwind CSS v4 not compiling**
```bash
# Solution: Ensure postcss.config.mjs uses ES modules
# Check: import syntax in globals.css is @import "tailwindcss"
```

**Issue 2: `params` is not a function**
```typescript
// ❌ Wrong (Next.js 14 pattern)
const { service, location } = params

// ✅ Correct (Next.js 15 pattern)
const { service, location } = await params
```

**Issue 3: Netlify build fails with "Module not found"**
```bash
# Solution: Check tsconfig.json paths alias is correct
# Ensure all imports use @/* alias
```

**Issue 4: LCP >2.5s**
```css
/* Solution: Check hero image optimization */
/* Ensure critical CSS is inlined (future: Beasties) */
```

---

## Next Steps After Completion

Once this story is done and Architect-approved, the team will proceed to:

- **Phase 0.3:** Airtable Integration (export content.json, real data)
- **Phase 0.4:** AI Content Generation (Netlify Functions + Claude API)
- **Phase 0.5:** Form Implementation (3-stage progressive form)

---

**Story Created By:** Winston (Architect)
**Date:** 2025-10-10
**Version:** 1.0
