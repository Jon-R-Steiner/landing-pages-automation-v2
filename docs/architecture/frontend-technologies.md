# Frontend Technologies

## Next.js 15 (App Router)

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

## React 19

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

## TypeScript

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

## Tailwind CSS v4.0

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
