# Build-Time Technologies

## Sharp (Image Optimization)

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

## Beasties (Critical CSS Extraction)

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
