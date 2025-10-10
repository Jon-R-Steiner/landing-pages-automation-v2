# Architecture Principles

## 1. **Static-First Generation**

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

## 2. **App Router Structure**

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

## 3. **Server vs Client Components**

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

## 4. **Data Flow**

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

## 5. **Performance Optimization**

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

## 6. **Styling Approach**

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

## 7. **Accessibility (WCAG 2.1 AA)**

**Built-in accessibility features:**
- ✅ Semantic HTML (`<header>`, `<nav>`, `<main>`, `<footer>`)
- ✅ ARIA labels on interactive elements
- ✅ Keyboard navigation (tab order, focus styles)
- ✅ Color contrast ratio >4.5:1 (automated checking)
- ✅ Alt text on all images (AI-generated with context)
- ✅ Form validation with error messages
