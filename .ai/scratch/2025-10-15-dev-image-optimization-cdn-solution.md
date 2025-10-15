# <!-- Powered by BMAD™ Core -->

---
created: 2025-10-15
agent: dev
purpose: Document image optimization limitation in static export mode and propose CDN solution
audience: Dev team, Architect
status: draft
triage-status: pending
related-to: story-2.1
---

# Image Optimization Issue: Static Export vs Next.js Image Optimization

## Issue Summary

**Problem:** Story 2.1 (HeroSection Component) requires automatic AVIF/WebP image format conversion and Next.js Image optimization, but our current architecture uses static export mode which does not support these features.

**Impact:**
- No automatic image format conversion (AVIF/WebP)
- No automatic srcset generation for responsive images
- Manual image optimization required for all images
- Potential performance degradation without proper optimization

**Current Workaround:** Using manual image optimization (Option A) for Story 2.1 to unblock development.

**Recommended Long-Term Solution:** Implement external image CDN (Option C - detailed below).

---

## Current Architecture Constraint

### next.config.js Configuration

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // CRITICAL: Static export mode (no serverless functions at runtime)
  output: 'export',

  // Disable features not supported in static export
  images: {
    unoptimized: true, // next/image doesn't work with output: 'export'
  },
}
```

### Why Static Export Mode?

From Phase 0.2 architecture decisions:
- **Deployment Target:** Netlify static hosting (no serverless functions)
- **Scale:** 500+ landing pages generated at build time
- **Cost Optimization:** Static files are cheaper than serverless rendering
- **Performance:** Pre-rendered HTML served from CDN

### What Works in Static Export

✅ **Next.js Image component** - Works with limitations:
- `priority` prop (preload for LCP optimization) ✅
- Responsive sizing with explicit width/height ✅
- Layout modes (`fill`, `responsive`, `intrinsic`) ✅
- Alt text, loading strategies ✅

❌ **Image Optimization Features** - NOT available:
- Automatic AVIF/WebP conversion ❌
- Automatic srcset generation ❌
- Quality optimization ❌
- On-demand image resizing ❌

---

## Story 2.1 Requirements vs Reality

### Original Acceptance Criteria

**AC 4:** "Hero image supports AVIF/WebP/JPEG with Next.js Image component"

**AC 6:** "LCP optimization (preload hero image, above-fold critical CSS)"

### Dev Notes Expectation

```javascript
// Story 2.1 Dev Notes (next.config.js example)
module.exports = {
  images: {
    formats: ['image/avif', 'image/webp'],  // ❌ NOT supported in static export
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
}
```

### Reality Check

This configuration **only works** with:
- Server-side rendering (SSR) mode
- Incremental Static Regeneration (ISR) mode
- Netlify Next.js adapter with serverless image optimization

It **does NOT work** with `output: 'export'`.

---

## Option A: Manual Image Optimization (Current Workaround)

**Status:** Implementing for Story 2.1 to unblock development.

### Approach

1. **Pre-optimize images** before placing in `public/images/`
2. **Use build script** or manual tools (Sharp, Squoosh, ImageOptim)
3. **Store multiple formats** manually:
   ```
   public/images/hero/
   ├── hero-bathroom.avif
   ├── hero-bathroom.webp
   ├── hero-bathroom.jpg
   ```
4. **Use `<picture>` element** or manual format selection:
   ```tsx
   <picture>
     <source srcSet="/images/hero/hero-bathroom.avif" type="image/avif" />
     <source srcSet="/images/hero/hero-bathroom.webp" type="image/webp" />
     <img src="/images/hero/hero-bathroom.jpg" alt="..." />
   </picture>
   ```

### Pros
- ✅ No architecture change required
- ✅ Works with static export immediately
- ✅ Full control over image quality/size
- ✅ Unblocks Story 2.1 development

### Cons
- ❌ Manual workflow for every image
- ❌ No automatic responsive sizing (srcset)
- ❌ Larger repository size (storing multiple formats)
- ❌ Scales poorly to 500+ pages × 6-8 gallery images each
- ❌ Error-prone (forgetting to optimize images)

---

## Option C: External Image CDN (Recommended Long-Term Solution)

**Status:** Proposed for future implementation (Epic 2 or Epic 3).

### Solution Overview

Use **Netlify Image CDN** or **Cloudinary** to handle automatic image optimization while maintaining static export mode.

### How It Works

1. **Upload images** to CDN (Netlify Image CDN, Cloudinary, imgix)
2. **Configure Next.js** with custom image loader
3. **CDN handles** automatic format conversion, resizing, optimization
4. **Static site** references CDN URLs at build time

### Implementation: Netlify Image CDN

#### Step 1: Enable Netlify Image CDN

Netlify Image CDN is included with all Netlify plans (no extra cost).

**Features:**
- Automatic AVIF/WebP conversion
- Responsive image resizing
- On-the-fly transformations
- Global CDN distribution

#### Step 2: Update next.config.js

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Keep static export mode

  images: {
    loader: 'custom',
    loaderFile: './lib/netlify-image-loader.ts',
  },
}

module.exports = nextConfig
```

#### Step 3: Create Custom Image Loader

**File:** `lib/netlify-image-loader.ts`

```typescript
export default function netlifyImageLoader({
  src,
  width,
  quality,
}: {
  src: string
  width: number
  quality?: number
}) {
  // Netlify Image CDN URL format
  // https://docs.netlify.com/image-cdn/overview/

  const params = [
    `w=${width}`,
    quality ? `q=${quality}` : 'q=75',
    'fit=cover',
  ].join('&')

  // Transform: https://example.netlify.app/.netlify/images?url=/hero.jpg&w=800&q=75
  return `/.netlify/images?url=${encodeURIComponent(src)}&${params}`
}
```

#### Step 4: Use Next.js Image Component

```tsx
import Image from 'next/image'

export default function HeroSection({ hero, branding }: HeroSectionProps) {
  return (
    <section>
      <Image
        src={hero.imageUrl} // e.g., "/images/hero/bathroom-remodel.jpg"
        alt={hero.imageAlt}
        width={1200}
        height={800}
        priority // Preload for LCP optimization
        sizes="(max-width: 768px) 100vw, (max-width: 1440px) 50vw, 1200px"
      />
    </section>
  )
}
```

**What happens:**
1. Build time: Next.js generates HTML with Netlify Image CDN URLs
2. Browser request: `/.netlify/images?url=/hero.jpg&w=800&q=75`
3. Netlify CDN: Automatically converts to AVIF/WebP based on browser support
4. Cached: Subsequent requests served from CDN cache

#### Step 5: Store Images in Static Site

Images can be stored in:
- `public/images/` (bundled with static site)
- External URL (if `hero.imageUrl` is absolute URL from Airtable)

### Alternative: Cloudinary

#### Configuration

```typescript
// lib/cloudinary-image-loader.ts
export default function cloudinaryLoader({
  src,
  width,
  quality,
}: {
  src: string
  width: number
  quality?: number
}) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

  // Cloudinary transformation URL
  return `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_${quality || 75},w_${width}/${src}`
}
```

**Benefits:**
- More advanced transformations (blur placeholders, AI cropping)
- Larger free tier (25GB/month vs Netlify's bandwidth limits)
- Dedicated image management UI

**Tradeoffs:**
- Extra service dependency (not included with Netlify)
- Must upload images to Cloudinary first (extra workflow step)

---

## Recommended Implementation Plan

### Phase 1: Story 2.1 (Current)
- ✅ Use **Option A** (manual optimization) to unblock development
- ✅ Implement HeroSection with `next/image` + priority prop
- ✅ Manually optimize 1-2 test hero images (AVIF/WebP)
- ✅ Document limitation in story completion notes

### Phase 2: Epic 2 or Early Epic 3
- 🔲 Implement **Netlify Image CDN** (Option C)
- 🔲 Create custom image loader (`lib/netlify-image-loader.ts`)
- 🔲 Update `next.config.js` with loader configuration
- 🔲 Test with existing hero images
- 🔲 Update documentation (architecture ADR)

### Phase 3: Scale (500+ Pages)
- 🔲 Migrate all manually-optimized images to CDN workflow
- 🔲 Automate image upload to CDN in Airtable export script
- 🔲 Update component library to use CDN by default

---

## Performance Impact Analysis

### Manual Optimization (Option A)

**Hero Image Example:**
- Original: `hero-bathroom.jpg` (2.4 MB, 3000×2000px)
- Manually optimized:
  - `hero-bathroom.avif` (180 KB) - 93% smaller
  - `hero-bathroom.webp` (240 KB) - 90% smaller
  - `hero-bathroom.jpg` (420 KB, quality 85) - 82% smaller

**LCP Target:** <500ms (Phase 0.2 baseline: 179ms)
- Assumes AVIF served on modern browsers
- Risk: Forgetting to optimize → 2.4 MB download → LCP >3s → failed Quality Score

### Netlify Image CDN (Option C)

**Automatic Optimization:**
- Browser requests: `/.netlify/images?url=/hero.jpg&w=1200&q=75`
- Netlify serves:
  - Chrome/Edge: AVIF format (~180 KB)
  - Safari: WebP format (~240 KB)
  - Old browsers: Optimized JPEG (~420 KB)
- **Benefit:** Zero manual work, consistent optimization

**Srcset Generation:**
```html
<img
  srcset="
    /.netlify/images?url=/hero.jpg&w=640&q=75 640w,
    /.netlify/images?url=/hero.jpg&w=1200&q=75 1200w,
    /.netlify/images?url=/hero.jpg&w=1920&q=75 1920w
  "
  sizes="(max-width: 768px) 100vw, 50vw"
/>
```
- Mobile (640px): Downloads 120 KB instead of 420 KB
- **Saves bandwidth**, improves LCP on mobile

---

## Risks & Considerations

### Netlify Image CDN Limitations

1. **Bandwidth Limits:**
   - Free tier: 100 GB/month
   - Pro tier: 400 GB/month
   - Estimated usage (500 pages × 8 images × 200 KB × 100 visitors/month):
     - ~80 GB/month (within free tier initially)

2. **Build Time:**
   - Static export still fast (no server rendering)
   - CDN transformations happen at request time (not build time)

3. **Vendor Lock-in:**
   - Solution is Netlify-specific
   - Migration: Switch to Cloudinary loader (minimal code change)

### Cloudinary Alternative

- **More portable** (works with any hosting)
- **Better for multi-environment** (dev, staging, prod)
- **Richer feature set** (AI transformations, video support)
- **Cost:** Free tier 25 GB/month, then $89/month

---

## Decision Required

**Immediate (Story 2.1):**
- ✅ Proceed with **Option A** (manual optimization) - APPROVED

**Future (Epic 2 or 3):**
- 🔲 Approve **Netlify Image CDN** implementation (Option C)
- 🔲 OR: Approve **Cloudinary** if multi-platform needed
- 🔲 Assign to story/epic for implementation

---

## References

- **Story 2.1:** `docs/stories/2.1.HeroSection-Component.md`
- **Next.js Static Export Docs:** https://nextjs.org/docs/app/building-your-application/deploying/static-exports
- **Netlify Image CDN Docs:** https://docs.netlify.com/image-cdn/overview/
- **Next.js Custom Image Loader:** https://nextjs.org/docs/app/api-reference/components/image#loader

---

## Change Log

| Date | Author | Change |
|------|--------|--------|
| 2025-10-15 | James (Dev) | Initial document created during Story 2.1 pre-implementation review |

---

**Status:** Draft - awaiting triage and approval for Option C implementation timeline.
