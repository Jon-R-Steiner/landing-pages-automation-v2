# Phase 3: Build Phase (Netlify - Static Site Generation)

**Location:** Netlify Build Agent (US-East)
**Trigger:** Git push to main branch (from GitHub Actions)
**Frequency:** Every approved page

## Step 6: Netlify Build Environment Setup

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

## Step 5: Next.js Static Build

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

## Step 6: Netlify Deployment

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
