# Tech Stack

> **Purpose**: This document consolidates all technology choices and versions for the dev agent to reference on every story. It combines frontend, build-time, and infrastructure technologies from the sharded architecture documents.

---

## Frontend Technologies

### Next.js 15 (App Router)

**Version:** `^15.5.0`

**Purpose:** Static site generation framework, React Server Components, file-based routing

**Key Features:**
- Static export mode (`output: 'export'`)
- App Router with React Server Components
- File-based routing
- Built-in performance optimizations

**Configuration (`next.config.js`):**
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Static export mode (NO serverless functions at runtime)

  // Disable features not supported in static export
  images: {
    unoptimized: true, // next/image doesn't work with output: 'export'
  },

  // Memory optimization for large static builds
  experimental: {
    webpackMemoryOptimizations: true,
  },

  // SEO optimization
  trailingSlash: true,

  // Disable source maps in production (smaller bundle)
  productionBrowserSourceMaps: false,
}

module.exports = nextConfig
```

**Breaking Changes from Next.js 14:**
- ✅ `params` is now async (must `await params` in page components)
- ✅ `searchParams` NOT supported in static export
- ✅ Caching no longer default (must explicitly use `export const dynamic = 'force-static'`)

**Migration Pattern:**
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

---

### React 19

**Version:** `^19.2.0`

**Purpose:** UI library, component composition, client-side interactivity

**Key Features:**
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

---

### TypeScript

**Version:** `^5.9.0`

**Purpose:** Type safety, IDE autocomplete, runtime error prevention

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

**Version:** `^4.0.0`

**Purpose:** Utility-first CSS framework, design system, responsive design

**Key Improvements:**
- ✅ **5x faster full builds, 100x faster incremental builds**
- ✅ Built on modern CSS features (cascade layers, `@property`, `color-mix()`)
- ✅ **Zero configuration required** - automatic content detection
- ✅ **CSS-first configuration** - no more JavaScript config file

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
```

**⚠️ Breaking Changes from v3:**
- **Browser Support:** Safari 16.4+, Chrome 111+, Firefox 128+ (drops older browsers)
- **CSS-first Configuration:** JavaScript config replaced with CSS `@theme`
- **New Import Syntax:** `@import "tailwindcss"` instead of `@tailwind` directives
- **Automatic Content Detection:** No manual `content` paths configuration

**Plugins:**
```bash
npm install @tailwindcss/forms@next @tailwindcss/typography@next
```

```css
/* In globals.css */
@import "tailwindcss";
@plugin "@tailwindcss/forms";
@plugin "@tailwindcss/typography";
```

---

### React Hook Form + Zod

**Version:** `react-hook-form` ^7.48.0, `zod` ^3.22.0, `@hookform/resolvers` ^3.3.0

**Purpose:** Form state management, validation, and submission for 3-stage progressive disclosure form

**Why React Hook Form + Zod:**
- ✅ **Best TypeScript support** - Zod provides schema-based validation with automatic type inference
- ✅ **Excellent performance** - Uncontrolled components minimize re-renders (critical for LCP <2.5s)
- ✅ **Schema reusability** - Zod schemas can be shared across frontend/backend
- ✅ **Modern & future-proof** - Active development, React 19 compatible
- ✅ **Battle-tested** - Used by Vercel, Stripe, and many high-traffic production sites
- ✅ **Free and open source** - MIT license, no costs

**Bundle Size:** ~21KB gzipped (acceptable for benefits provided)

**Installation:**
```bash
npm install react-hook-form zod @hookform/resolvers
```

**Key Features:**
- Multi-step form state management (3 stages)
- Per-step validation with Zod schemas
- Type-safe form data with TypeScript inference
- localStorage persistence for partially completed forms
- GTM dataLayer integration for conversion tracking
- Accessibility built-in (ARIA labels, keyboard navigation)

**Usage Example:**
```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

// Define schema
const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().regex(/^\(\d{3}\) \d{3}-\d{4}$/, 'Invalid phone format'),
})

// Infer TypeScript type from schema
type FormData = z.infer<typeof formSchema>

// Use in component
const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
  resolver: zodResolver(formSchema),
  mode: 'onBlur',
})
```

**Alternatives Considered:**
- ❌ **Formik + Yup** - 25KB bundle (4KB larger), controlled components (worse performance)
- ❌ **Custom State Management** - 2-3KB bundle but manual validation is error-prone, no schema validation

**Decision Rationale:** React Hook Form + Zod selected for superior TypeScript support, performance, and maintainability. The 21KB bundle size is acceptable given the benefits of schema-based validation and type safety.

**Reference:** See `forms-library-selection.md` and `forms-implementation-guide.md` for complete implementation details.

---

## Build-Time Technologies

### Sharp (Image Optimization)

**Version:** `^0.34.4`

**Purpose:** Build-time image optimization (AVIF, WebP, JPEG), resize, compress

**Why Sharp:**
- Next.js Image component doesn't work with `output: 'export'`
- Sharp is the fastest Node.js image processing library
- Supports modern formats (AVIF, WebP) for LCP optimization

**Implementation (`scripts/optimize-images.js`):**
```javascript
const sharp = require('sharp')

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

**Version:** `^0.1.0` (**REPLACED Critters**)

**Purpose:** Extract and inline critical CSS per page for LCP optimization

**Why Beasties (not Critters):**
- ✅ Critters is **ARCHIVED** by GoogleChromeLabs (no longer maintained)
- ✅ Beasties is the actively maintained fork by Nuxt team
- ✅ Drop-in replacement with same API

**Features:**
- Automatically detects above-the-fold CSS
- Inlines critical CSS in `<head>`
- Defers non-critical CSS loading
- Integrates with Next.js build pipeline

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

---

## Platform & Infrastructure

### Netlify CDN

**Purpose:** Static file hosting, global edge distribution

**Key Features:**
- Global CDN (190+ edge locations)
- Automatic HTTPS
- Branch previews
- Build caching
- Generous free tier (100GB bandwidth/mo)

**Deployment:**
- **Build Command:** `npm run build` (Next.js 15 static export)
- **Publish Directory:** `out/` (Next.js static export output)
- **Build Time:** 5-10 minutes (500 pages)

---

### Airtable

**Purpose:** Content storage, approval workflow

**Key Features:**
- Content management for 500+ pages
- Approval workflow (Draft → AI Processing → Review → Approved)
- Build-time data export (no runtime API calls)

**Integration:**
- **Build-Time:** Export to `content.json` via GitHub Actions
- **Runtime:** NO API calls (reads from `content.json`)

---

### Claude API

**Purpose:** AI content generation (Trust Bar, Gallery, FAQ)

**Integration:**
- **Build-Time:** Netlify Functions generate AI content in Airtable
- **Runtime:** NO API calls (content pre-generated in Airtable)

**Cost:** ~$0.50-1.00 per 500 pages

---

### Make.com

**Purpose:** Form submission workflow automation (forms → Salesforce)

**Integration:**
- **Runtime:** Form POST to Make.com webhook
- **Workflow:** 10-step process (validation, enrichment, Salesforce, notifications)

**Cost:** Free tier (1000 ops/mo), $9/mo for Core tier

---

### Salesforce

**Purpose:** CRM, lead management

**Integration:**
- **Via Make.com:** OAuth 2 authentication
- **No Direct Integration:** All communication through Make.com

---

### Third-Party Services

**GTM (Google Tag Manager):**
- Tag management, conversion tracking
- Free, 99.9% uptime

**CallRail:**
- Dynamic phone tracking
- Client-provided

**GA4 (Google Analytics 4):**
- Analytics, funnel tracking
- Free, 99.9% uptime

---

## Development Tools

**Node.js:** v22+ (required for Netlify MCP; supports Tailwind CSS v4)

**Package Manager:** npm (default)

**IDE:** VS Code recommended with extensions:
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript and JavaScript Language Features

**Testing:** Playwright (E2E testing for Next.js 15)

**CI/CD:** GitHub Actions (export Airtable, commit `content.json`, trigger Netlify build)

---

## Related Documents

For additional context, see:
- [Frontend Technologies](./frontend-technologies.md) - Detailed frontend technology decisions
- [Build-Time Technologies](./build-time-technologies.md) - Complete build-time tooling
- [Platform and Infrastructure Choice](./platform-and-infrastructure-choice.md) - Infrastructure architecture and workflow
- [External Services APIs](./external-services-apis.md) - Third-party integrations
