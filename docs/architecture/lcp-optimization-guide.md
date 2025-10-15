---
created: 2025-10-08
agent: architect
purpose: Research LCP optimization strategies for Next.js static sites with third-party analytics
audience: Dev team, architects
status: complete
related-to: epic-0-phase-0.2, epic-4
original-location: .ai/scratch/lcp-optimization-research.md
---

# LCP <2.5s Optimization Research for Next.js Static Sites
## Comprehensive Research Report

**Date**: 2025-10-08
**Priority**: CRITICAL - Required for Google Ads Quality Score
**Target**: LCP <2.5 seconds with GTM, CallRail, and GA4

---

## Executive Summary

Achieving LCP <2.5s on Next.js static sites with third-party analytics scripts is achievable through a strategic combination of:
1. **Critical CSS extraction and inlining** (0.3-0.8s improvement)
2. **Aggressive third-party script deferral** (0.5-1.2s improvement)
3. **Self-hosted font optimization** (0.2-0.6s improvement)
4. **Strategic lazy loading** (0.3-0.7s improvement)
5. **Image optimization without next/image** (0.4-1.0s improvement)

Real-world case studies demonstrate LCP improvements from 15.5s → 4.5s (mobile) and 4.1s → 2.1s (desktop) on Next.js e-commerce sites.

---

## 1. Critical CSS Extraction

### Evidence-Based Strategy

**Impact**: 0.3-0.8s LCP improvement
**Complexity**: Medium
**Compatibility**: ✅ Static export compatible

### Recommended Tools (2024)

#### Option A: Critters/Beasties (Recommended)
```bash
npm install --save-dev beasties
```

**Why Critters/Beasties**:
- ✅ No headless browser (fast build times)
- ✅ Inlines critical CSS automatically
- ✅ Lazy-loads non-critical CSS
- ✅ Works with Tailwind CSS
- ⚠️ Original Google Chrome Labs version archived - use danielroe/beasties fork

**Next.js 15 Integration**:
```javascript
// next.config.js
const Critters = require('beasties');

module.exports = {
  output: 'export',
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.plugins.push(
        new Critters({
          preload: 'swap',
          // Inline critical CSS for initial viewport
          inlineThreshold: 0,
          // Minimize inlined CSS
          minimumExternalSize: 0,
          // Preload non-critical CSS
          preloadFonts: true,
        })
      );
    }
    return config;
  },
};
```

#### Option B: Critical (Addy Osmani)
```bash
npm install --save-dev critical
```

**Build-time script**:
```javascript
// scripts/extract-critical.js
const critical = require('critical');
const glob = require('glob');
const path = require('path');

async function extractCritical() {
  const htmlFiles = glob.sync('out/**/*.html');

  for (const file of htmlFiles) {
    await critical.generate({
      inline: true,
      base: 'out/',
      src: path.relative('out', file),
      target: {
        html: file,
      },
      width: 1300,
      height: 900,
      // Target mobile viewports too
      dimensions: [
        { width: 375, height: 667 },
        { width: 1300, height: 900 }
      ]
    });
  }
}

extractCritical();
```

**package.json**:
```json
{
  "scripts": {
    "build": "next build",
    "postbuild": "node scripts/extract-critical.js"
  }
}
```

### Tailwind CSS Optimization

**Automatic purging** (built-in):
```javascript
// tailwind.config.js
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  // Tailwind v4+ handles minimization automatically
};
```

**Additional optimization**:
```javascript
// postcss.config.js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    ...(process.env.NODE_ENV === 'production' ? { cssnano: {} } : {})
  }
};
```

### Inline vs External Critical CSS

**Evidence-based recommendation**: Inline for critical path, external for rest

```typescript
// app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Inline critical CSS (extracted by Critters) */}
        <style dangerouslySetInnerHTML={{
          __html: criticalCSS // Generated at build time
        }} />

        {/* Preload full stylesheet */}
        <link
          rel="preload"
          href="/styles/main.css"
          as="style"
          onLoad="this.onload=null;this.rel='stylesheet'"
        />
        <noscript>
          <link rel="stylesheet" href="/styles/main.css" />
        </noscript>
      </head>
      <body>{children}</body>
    </html>
  );
}
```

---

## 2. Third-Party Script Loading (CRITICAL)

### Impact Analysis

**GTM Container Impact**: +1000ms (average)
**Each third-party script**: +34ms slowdown
**CallRail Impact**: Minimal when async (<100ms)

### Strategy: Defer ALL Analytics Until After LCP

#### Option A: Next.js Script Component (Recommended)

```typescript
// app/layout.tsx
import Script from 'next/script';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}

        {/* GTM - Load AFTER page interactive */}
        <Script
          id="gtm-script"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-XXXXXX');
            `
          }}
        />

        {/* CallRail - Load AFTER page interactive */}
        <Script
          id="callrail-script"
          strategy="lazyOnload"
          src="//cdn.callrail.com/companies/XXXXXX/YYYYYY/12/swap.js"
        />

        {/* GA4 via GTM - already deferred by GTM */}
      </body>
    </html>
  );
}
```

**Script Loading Strategies**:
- `beforeInteractive`: ❌ DO NOT USE (blocks LCP)
- `afterInteractive`: ⚠️ Use only for critical functionality
- `lazyOnload`: ✅ USE THIS for all analytics (loads during browser idle)

**Performance results**: LCP improves by ~1s with correct strategy

#### Option B: Split Container Strategy

**Evidence**: Recommended by Analytics Mania

1. **Container A** (Critical): GA4, essential conversion tracking
   - Load: `afterInteractive` (still delays LCP but minimally)

2. **Container B** (Non-essential): Heatmaps, session recording, etc.
   - Load: `lazyOnload` (no LCP impact)

```typescript
<Script
  id="gtm-critical"
  strategy="afterInteractive"
  src="https://www.googletagmanager.com/gtm.js?id=GTM-CRITICAL"
/>

<Script
  id="gtm-deferred"
  strategy="lazyOnload"
  src="https://www.googletagmanager.com/gtm.js?id=GTM-DEFERRED"
/>
```

#### Option C: Partytown (Advanced)

**What**: Offloads third-party scripts to Web Worker
**Impact**: Lighthouse scores 70 → 99 in case studies
**Complexity**: High (compatibility issues possible)

```bash
npm install @builder.io/partytown
```

```typescript
// app/layout.tsx
import { Partytown } from '@builder.io/partytown/react';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <Partytown
          debug={false}
          forward={['dataLayer.push']}
        />
      </head>
      <body>
        {children}

        {/* GTM via Partytown */}
        <Script
          type="text/partytown"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.type='text/partytown';
              j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
              f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-XXXXXX');
            `
          }}
        />
      </body>
    </html>
  );
}
```

**Partytown Configuration**:
```javascript
// next.config.js
module.exports = {
  output: 'export',
  // Copy Partytown files to static folder
  async rewrites() {
    return [
      {
        source: '~partytown/:path*',
        destination: '/node_modules/@builder.io/partytown/lib/:path*'
      }
    ];
  }
};
```

**⚠️ Warnings**:
- Not all scripts work in Web Workers
- GTM tag chaining can be complex
- Test thoroughly before production

### CallRail Optimization

**Official guidance**: Load before closing `</body>` tag with async

```html
<script async src="//cdn.callrail.com/companies/XXXXXX/YYYYYY/12/swap.js"></script>
```

**Better approach** (Next.js):
```typescript
<Script
  id="callrail"
  strategy="lazyOnload"
  src="//cdn.callrail.com/companies/XXXXXX/YYYYYY/12/swap.js"
/>
```

**Impact**: <100ms when properly deferred

---

## 3. Font Loading Optimization

### Impact: 0.2-0.6s LCP improvement

### Self-Hosted vs Google Fonts

**Winner**: Self-hosted with next/font

**Evidence**:
- Eliminates external DNS lookup
- No CORS preflight requests
- Fonts cached as static assets
- Works with static export

### Implementation

#### Step 1: Download Fonts

```bash
# Use google-webfonts-helper or download manually
# https://gwfh.mranftl.com/fonts
```

#### Step 2: Configure next/font

```typescript
// app/fonts.ts
import localFont from 'next/font/local';

export const inter = localFont({
  src: [
    {
      path: '../public/fonts/Inter-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/Inter-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-inter',
  display: 'swap', // Prevents invisible text
  preload: true, // Preload for LCP
});
```

#### Step 3: Apply Fonts

```typescript
// app/layout.tsx
import { inter } from './fonts';

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
```

### Font Format Recommendations

**Use WOFF2 only** (2024 standard):
- ✅ Best compression (30% smaller than WOFF)
- ✅ Universal browser support (98%+)
- ✅ Faster loading = better LCP
- ❌ Skip WOFF, TTF, OTF (unnecessary)

### Preload Strategy

**⚠️ Critical Decision**: Preload vs Performance

**Evidence**:
- Preloading removes double paint
- BUT can delay FCP/LCP if fonts are large
- Only preload fonts used in LCP element

```typescript
// Only if hero text is LCP element
export const heroFont = localFont({
  src: '../public/fonts/Hero-Bold.woff2',
  display: 'swap',
  preload: true, // ✅ Preload because it's in LCP
});

// Don't preload body fonts
export const bodyFont = localFont({
  src: '../public/fonts/Body-Regular.woff2',
  display: 'swap',
  preload: false, // ❌ Not in LCP, don't preload
});
```

### Variable Fonts vs Multiple Weights

**Recommendation**: Use variable fonts if using 3+ weights

```typescript
export const interVariable = localFont({
  src: '../public/fonts/Inter-Variable.woff2',
  weight: '100 900', // Entire weight range
  display: 'swap',
  preload: true,
});
```

**Benefits**:
- Single file for all weights
- Smaller total size than multiple files
- Better LCP when hero uses multiple weights

---

## 4. Below-Fold Content Lazy Loading

### Impact: 0.3-0.7s LCP improvement

### Strategy: Intersection Observer + React.lazy()

#### Option A: react-intersection-observer (Recommended)

```bash
npm install react-intersection-observer
```

**Usage**:
```typescript
'use client';

import { useInView } from 'react-intersection-observer';
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <div>Loading...</div>,
});

export function BelowFoldSection() {
  const { ref, inView } = useInView({
    triggerOnce: true, // Only load once
    threshold: 0.1, // 10% visible triggers load
    rootMargin: '200px', // Start loading 200px before visible
  });

  return (
    <div ref={ref}>
      {inView ? <HeavyComponent /> : <div style={{ height: '500px' }} />}
    </div>
  );
}
```

#### Option B: Native Intersection Observer

```typescript
'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

const LazySection = dynamic(() => import('./LazySection'));

export function BelowFoldContent() {
  const [shouldLoad, setShouldLoad] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref}>
      {shouldLoad ? <LazySection /> : null}
    </div>
  );
}
```

### Component-Level Code Splitting

```typescript
// Next.js 15 App Router automatic code splitting
import dynamic from 'next/dynamic';

// Lazy load components not in viewport
const Testimonials = dynamic(() => import('./Testimonials'), {
  loading: () => <div>Loading testimonials...</div>,
});

const Footer = dynamic(() => import('./Footer'), {
  loading: () => null, // No loader for footer
});

export default function Page() {
  return (
    <>
      <Hero /> {/* Loaded immediately - in LCP */}
      <Features /> {/* Loaded immediately - above fold */}
      <Testimonials /> {/* Lazy loaded */}
      <Footer /> {/* Lazy loaded */}
    </>
  );
}
```

### Best Practices

1. **Only lazy load below-fold content**
   - ❌ Don't lazy load LCP element
   - ✅ Lazy load testimonials, footer, etc.

2. **Use appropriate thresholds**
   ```typescript
   {
     threshold: 0.1, // 10% visible
     rootMargin: '200px', // Load 200px early
   }
   ```

3. **Prevent layout shift**
   ```typescript
   // Reserve space before loading
   <div style={{ minHeight: '500px' }}>
     {inView ? <HeavyComponent /> : null}
   </div>
   ```

---

## 5. Image Optimization (Without next/image)

### Impact: 0.4-1.0s LCP improvement

### Challenge: Static Export + No next/image

**Problem**: `next/image` doesn't work with `output: 'export'`
**Solution**: Manual responsive images + build-time optimization

### Build-Time Optimization Tools

#### Option A: sharp (Node.js)

```bash
npm install --save-dev sharp
```

**Build script**:
```javascript
// scripts/optimize-images.js
const sharp = require('sharp');
const glob = require('glob');
const path = require('path');
const fs = require('fs').promises;

const SIZES = [640, 750, 828, 1080, 1200, 1920];
const FORMATS = ['avif', 'webp', 'jpeg'];

async function optimizeImages() {
  const images = glob.sync('public/images/**/*.{jpg,jpeg,png}');

  for (const image of images) {
    const filename = path.basename(image, path.extname(image));
    const dir = path.dirname(image);
    const outputDir = dir.replace('public/', 'public/optimized/');

    await fs.mkdir(outputDir, { recursive: true });

    // Generate responsive sizes for each format
    for (const size of SIZES) {
      for (const format of FORMATS) {
        await sharp(image)
          .resize(size, null, { withoutEnlargement: true })
          [format]({ quality: 80 })
          .toFile(`${outputDir}/${filename}-${size}w.${format}`);
      }
    }
  }

  console.log('✅ Images optimized');
}

optimizeImages();
```

**package.json**:
```json
{
  "scripts": {
    "build": "npm run optimize-images && next build",
    "optimize-images": "node scripts/optimize-images.js"
  }
}
```

#### Option B: TinyPNG/ShortPixel (External Services)

**TinyPNG API**:
```javascript
const tinify = require('tinify');
tinify.key = process.env.TINYPNG_API_KEY;

async function compressImage(source) {
  const optimized = await tinify.fromFile(source);
  await optimized.toFile(source.replace('.png', '-optimized.png'));
}
```

### Responsive Image Component

```typescript
// components/ResponsiveImage.tsx
interface ResponsiveImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
}

export function ResponsiveImage({
  src,
  alt,
  width,
  height,
  priority = false
}: ResponsiveImageProps) {
  const filename = src.replace(/\.[^/.]+$/, '');

  return (
    <picture>
      {/* AVIF - Best compression */}
      <source
        type="image/avif"
        srcSet={`
          ${filename}-640w.avif 640w,
          ${filename}-750w.avif 750w,
          ${filename}-828w.avif 828w,
          ${filename}-1080w.avif 1080w,
          ${filename}-1200w.avif 1200w,
          ${filename}-1920w.avif 1920w
        `}
        sizes="(max-width: 640px) 640px, (max-width: 1200px) 1200px, 1920px"
      />

      {/* WebP - Fallback */}
      <source
        type="image/webp"
        srcSet={`
          ${filename}-640w.webp 640w,
          ${filename}-750w.webp 750w,
          ${filename}-828w.webp 828w,
          ${filename}-1080w.webp 1080w,
          ${filename}-1200w.webp 1200w,
          ${filename}-1920w.webp 1920w
        `}
        sizes="(max-width: 640px) 640px, (max-width: 1200px) 1200px, 1920px"
      />

      {/* JPEG - Final fallback */}
      <img
        src={`${filename}-1080w.jpeg`}
        srcSet={`
          ${filename}-640w.jpeg 640w,
          ${filename}-750w.jpeg 750w,
          ${filename}-828w.jpeg 828w,
          ${filename}-1080w.jpeg 1080w,
          ${filename}-1200w.jpeg 1200w,
          ${filename}-1920w.jpeg 1920w
        `}
        sizes="(max-width: 640px) 640px, (max-width: 1200px) 1200px, 1920px"
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        style={{ width: '100%', height: 'auto' }}
      />
    </picture>
  );
}
```

### LCP Image Preloading

**CRITICAL**: Preload LCP image with correct format

```typescript
// app/layout.tsx or page.tsx
export default function Page() {
  return (
    <>
      <head>
        {/* Preload LCP image */}
        <link
          rel="preload"
          as="image"
          href="/optimized/hero-1920w.avif"
          type="image/avif"
          imageSrcSet="/optimized/hero-640w.avif 640w, /optimized/hero-1200w.avif 1200w, /optimized/hero-1920w.avif 1920w"
          imageSizes="100vw"
          fetchPriority="high"
        />
      </head>

      <ResponsiveImage
        src="/images/hero.jpg"
        alt="Hero"
        width={1920}
        height={1080}
        priority={true}
      />
    </>
  );
}
```

### Format Recommendations (2024)

1. **AVIF**: 30% better compression than WebP
2. **WebP**: Fallback (98% browser support)
3. **JPEG**: Final fallback (100% support)

**Skip PNG** unless transparency required.

---

## 6. Real-World Benchmarks & Case Studies

### Case Study 1: Next.js E-Commerce Site

**Source**: Medium - "Stop the Wait: A Developer's Guide to Smashing LCP in Next.js"

**Results**:
- **Mobile**: 15.5s → 4.5s (62% improvement)
- **Desktop**: 4.1s → 2.1s (49% improvement)
- **Image payload**: Reduced by 75%
- **Speed Index**: Improved by 24%

**Techniques**:
- Image optimization with next/image (self-hosted alternative needed)
- Preloading LCP images
- Static Site Generation (SSG)

### Case Study 2: Partytown Implementation

**Source**: DebugBear - "Partytown: Optimize Third Party Scripts with Web Workers"

**Results**:
- **Lighthouse Score**: 70 → 99
- **Main Thread Blocking**: Eliminated "Minimize main-thread work" warning
- **Third-Party Impact**: Eliminated "Reduce impact of third-party code" warning

**Techniques**:
- Offloaded GTM to Web Worker
- Maintained full analytics functionality

### Case Study 3: Critical CSS Extraction

**Source**: Focus Reactive - "Critical CSS with NextJS"

**Results**:
- **LCP Improvement**: 0.5-0.8s
- **FCP Improvement**: 0.4s → 0.9s (with proper implementation)

**Techniques**:
- Automated critical CSS extraction with Critters
- Inline critical CSS, lazy-load rest

### Case Study 4: Font Optimization

**Source**: Core Web Vitals - "Self host Google fonts"

**Results**:
- **Request Reduction**: Eliminated external DNS lookup
- **LCP Improvement**: 0.3-0.5s
- **CLS Improvement**: Better layout stability

**Techniques**:
- Self-hosted WOFF2 fonts
- Font preloading for LCP elements
- `font-display: swap`

---

## 7. Measurement & Monitoring

### Chrome DevTools (2024 Updates)

**New Performance Panel Features**:
- Real-time Core Web Vitals monitoring
- Local metrics view (LCP, CLS, INP)
- Third-party badge highlighting
- Field data comparison

**Usage**:
1. Open DevTools → Performance panel
2. Enable "Show third party badges" (Cmd/Ctrl + Shift + P)
3. Record page load
4. Analyze "Network" section for third-party impact

### web-vitals Library

```bash
npm install web-vitals
```

**Implementation**:
```typescript
// app/layout.tsx
'use client';

import { useEffect } from 'react';
import { onLCP, onFID, onCLS } from 'web-vitals';

export function WebVitals() {
  useEffect(() => {
    onLCP(console.log);
    onFID(console.log);
    onCLS(console.log);
  }, []);

  return null;
}
```

**Send to Analytics**:
```typescript
function sendToGoogleAnalytics({ name, delta, id }) {
  // Assumes gtag.js is loaded
  gtag('event', name, {
    event_category: 'Web Vitals',
    value: Math.round(name === 'CLS' ? delta * 1000 : delta),
    event_label: id,
    non_interaction: true,
  });
}

onLCP(sendToGoogleAnalytics);
```

### Lighthouse CI

```bash
npm install --save-dev @lhci/cli
```

**Configuration**:
```javascript
// lighthouserc.js
module.exports = {
  ci: {
    collect: {
      staticDistDir: './out',
      url: [
        'http://localhost/index.html',
        'http://localhost/about.html',
      ],
      numberOfRuns: 3,
    },
    assert: {
      preset: 'lighthouse:recommended',
      assertions: {
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
      },
    },
  },
};
```

**package.json**:
```json
{
  "scripts": {
    "lighthouse": "lhci autorun"
  }
}
```

---

## 8. Implementation Roadmap (Prioritized by Impact)

### Phase 1: High Impact (Week 1)

**Priority**: Achieve 70-80% of LCP improvement

1. **Defer All Analytics Scripts** (0.5-1.2s improvement)
   - Implement `strategy="lazyOnload"` for GTM, CallRail, GA4
   - **Effort**: 2 hours
   - **Risk**: Low (analytics still fires, just later)

2. **Optimize LCP Image** (0.4-1.0s improvement)
   - Convert to AVIF/WebP with fallbacks
   - Implement preloading with `fetchPriority="high"`
   - **Effort**: 4 hours
   - **Risk**: Low (progressive enhancement)

3. **Self-Host Fonts** (0.2-0.6s improvement)
   - Download WOFF2 fonts
   - Configure next/font with `localFont`
   - **Effort**: 3 hours
   - **Risk**: Low

### Phase 2: Medium Impact (Week 2)

**Priority**: Fine-tuning and additional improvements

4. **Critical CSS Extraction** (0.3-0.8s improvement)
   - Implement Critters/Beasties
   - Test across all pages
   - **Effort**: 6 hours
   - **Risk**: Medium (potential styling issues)

5. **Below-Fold Lazy Loading** (0.3-0.7s improvement)
   - Implement Intersection Observer
   - Lazy load testimonials, footer, etc.
   - **Effort**: 4 hours
   - **Risk**: Low

### Phase 3: Advanced Optimization (Week 3-4)

**Priority**: Reach <2.5s consistently

6. **Partytown Integration** (Optional - if needed)
   - Offload scripts to Web Worker
   - **Effort**: 8 hours
   - **Risk**: High (compatibility issues)

7. **Automated Image Optimization**
   - Build script with sharp
   - Generate responsive sizes
   - **Effort**: 6 hours
   - **Risk**: Low

### Testing Gates

After each phase:
1. ✅ Run Lighthouse (mobile + desktop)
2. ✅ Test on real devices
3. ✅ Verify analytics still working
4. ✅ Check CLS hasn't increased
5. ✅ Validate in PageSpeed Insights

---

## 9. Potential Conflicts with Jamstack Architecture

### ✅ Compatible Techniques

- ✅ Critical CSS extraction (works with static HTML)
- ✅ Script deferral (client-side loading)
- ✅ Self-hosted fonts (static assets)
- ✅ Lazy loading (client-side JS)
- ✅ Responsive images (static HTML)

### ⚠️ Requires Consideration

- ⚠️ Partytown: Requires serving library files from CDN or static directory
  - **Solution**: Copy Partytown files to `public/~partytown/`

- ⚠️ Build-time image optimization: Increases build time
  - **Solution**: Cache optimized images, only process new/changed

### ❌ Not Compatible

- ❌ `next/image` with automatic optimization
  - **Workaround**: Use build-time sharp optimization + manual srcset

---

## 10. Code Examples for Next.js 15 App Router

### Complete Layout Example

```typescript
// app/layout.tsx
import { Inter } from 'next/font/local';
import Script from 'next/script';
import './globals.css';

const inter = Inter({
  src: '../public/fonts/Inter-Variable.woff2',
  variable: '--font-inter',
  display: 'swap',
  preload: true,
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/* Preconnect to required origins */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://cdn.callrail.com" />

        {/* Preload LCP image */}
        <link
          rel="preload"
          as="image"
          href="/optimized/hero-1920w.avif"
          type="image/avif"
          imageSrcSet="/optimized/hero-640w.avif 640w, /optimized/hero-1200w.avif 1200w, /optimized/hero-1920w.avif 1920w"
          imageSizes="100vw"
          fetchPriority="high"
        />
      </head>

      <body>
        {children}

        {/* GTM - Deferred */}
        <Script
          id="gtm"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-XXXXXX');
            `
          }}
        />

        {/* CallRail - Deferred */}
        <Script
          id="callrail"
          strategy="lazyOnload"
          src="//cdn.callrail.com/companies/XXXXXX/YYYYYY/12/swap.js"
        />

        {/* GTM NoScript Fallback */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXX"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
      </body>
    </html>
  );
}
```

### Complete Page Example

```typescript
// app/page.tsx
import { ResponsiveImage } from '@/components/ResponsiveImage';
import dynamic from 'next/dynamic';

// Lazy load below-fold components
const Testimonials = dynamic(() => import('@/components/Testimonials'));
const Footer = dynamic(() => import('@/components/Footer'));

export default function HomePage() {
  return (
    <main>
      {/* Above-fold content - loads immediately */}
      <section className="hero">
        <ResponsiveImage
          src="/images/hero.jpg"
          alt="Hero image"
          width={1920}
          height={1080}
          priority={true}
        />
        <h1>Welcome</h1>
        <p>Compelling value proposition</p>
      </section>

      {/* Still above fold - loads immediately */}
      <section className="features">
        <h2>Features</h2>
        {/* Feature content */}
      </section>

      {/* Below fold - lazy loaded */}
      <Testimonials />
      <Footer />
    </main>
  );
}
```

### Responsive Image Component (Full Implementation)

```typescript
// components/ResponsiveImage.tsx
interface ResponsiveImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
  className?: string;
}

export function ResponsiveImage({
  src,
  alt,
  width,
  height,
  priority = false,
  className = ''
}: ResponsiveImageProps) {
  // Extract filename without extension
  const filename = src.replace(/\.[^/.]+$/, '');
  const dir = '/optimized';

  // Generate srcset for different sizes
  const sizes = [640, 750, 828, 1080, 1200, 1920];

  const generateSrcSet = (format: string) => {
    return sizes
      .map(size => `${dir}${filename}-${size}w.${format} ${size}w`)
      .join(', ');
  };

  return (
    <picture>
      {/* AVIF - Best compression (30% better than WebP) */}
      <source
        type="image/avif"
        srcSet={generateSrcSet('avif')}
        sizes="(max-width: 640px) 640px, (max-width: 1200px) 1200px, 1920px"
      />

      {/* WebP - Fallback for older browsers */}
      <source
        type="image/webp"
        srcSet={generateSrcSet('webp')}
        sizes="(max-width: 640px) 640px, (max-width: 1200px) 1200px, 1920px"
      />

      {/* JPEG - Final fallback */}
      <img
        src={`${dir}${filename}-1080w.jpeg`}
        srcSet={generateSrcSet('jpeg')}
        sizes="(max-width: 640px) 640px, (max-width: 1200px) 1200px, 1920px"
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        fetchPriority={priority ? 'high' : 'auto'}
        className={className}
        style={{ width: '100%', height: 'auto' }}
      />
    </picture>
  );
}
```

---

## 11. Risk Mitigation

### Analytics Tracking Integrity

**Risk**: Deferring scripts might miss early interactions

**Mitigation**:
```typescript
// Buffer early dataLayer pushes
<Script
  id="datalayer-buffer"
  strategy="beforeInteractive"
  dangerouslySetInnerHTML={{
    __html: `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
    `
  }}
/>

// GTM loads later, processes buffered events
<Script
  id="gtm"
  strategy="lazyOnload"
  src="https://www.googletagmanager.com/gtm.js?id=GTM-XXXXXX"
/>
```

### Layout Shift from Lazy Loading

**Risk**: CLS increases when components load

**Mitigation**:
```typescript
// Reserve space before loading
<div style={{ minHeight: '500px' }}>
  {inView ? <HeavyComponent /> : null}
</div>
```

### Font Loading Flash

**Risk**: FOUT (Flash of Unstyled Text)

**Mitigation**:
```typescript
// Use font-display: swap + CSS fallback
const inter = localFont({
  src: './Inter-Variable.woff2',
  display: 'swap', // Show fallback immediately
  fallback: ['system-ui', 'arial'],
});
```

---

## 12. Success Metrics

### Target Benchmarks

**Primary Goal**: LCP <2.5s (75th percentile)

| Metric | Target | Acceptable | Poor |
|--------|--------|------------|------|
| **LCP** | <2.5s | 2.5-4.0s | >4.0s |
| **FID/INP** | <100ms | 100-300ms | >300ms |
| **CLS** | <0.1 | 0.1-0.25 | >0.25 |
| **FCP** | <1.8s | 1.8-3.0s | >3.0s |
| **TTFB** | <0.8s | 0.8-1.8s | >1.8s |

### Testing Checklist

- [ ] Lighthouse (Mobile): Score >90
- [ ] Lighthouse (Desktop): Score >95
- [ ] PageSpeed Insights (Field Data): "Good" LCP
- [ ] Real device testing: iPhone, Android
- [ ] Chrome DevTools Performance: No long tasks >50ms
- [ ] GTM Tag Assistant: All tags firing correctly
- [ ] CallRail test call: Dynamic number swap working
- [ ] GA4 events: Tracking properly

---

## 13. Additional Resources

### Official Documentation
- [Next.js Performance Optimization](https://nextjs.org/docs/app/building-your-application/optimizing)
- [Chrome Web Vitals](https://web.dev/articles/vitals)
- [Lighthouse Performance Scoring](https://developer.chrome.com/docs/lighthouse/performance/performance-scoring)

### Tools
- [WebPageTest](https://www.webpagetest.org/) - Real-world performance testing
- [DebugBear](https://www.debugbear.com/) - Core Web Vitals monitoring
- [PageSpeed Insights](https://pagespeed.web.dev/) - Google's official tool
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci) - Automated testing

### Libraries
- [web-vitals](https://github.com/GoogleChrome/web-vitals) - Measure Core Web Vitals
- [react-intersection-observer](https://github.com/thebuilder/react-intersection-observer) - Lazy loading
- [Partytown](https://partytown.builder.io/) - Web Worker scripts
- [sharp](https://sharp.pixelplumbing.com/) - Image optimization

---

## 14. Conclusion

Achieving LCP <2.5s on Next.js static sites with GTM, CallRail, and GA4 is **achievable** through a systematic approach:

### Critical Success Factors

1. **Defer ALL analytics scripts** - Use `lazyOnload` strategy (biggest impact)
2. **Optimize LCP image** - AVIF/WebP with preload and fetchPriority
3. **Self-host fonts** - Use next/font with WOFF2 format
4. **Extract critical CSS** - Inline above-fold styles
5. **Lazy load below-fold** - Intersection Observer + dynamic imports

### Expected Timeline

- **Week 1**: High-impact changes (70-80% improvement)
- **Week 2**: Medium-impact optimizations (85-90% target achieved)
- **Week 3-4**: Fine-tuning and advanced techniques (consistent <2.5s)

### Next Steps

1. Implement Phase 1 optimizations (analytics deferral + image optimization)
2. Measure impact with Lighthouse
3. Iterate based on real device testing
4. Implement remaining phases as needed
5. Set up continuous monitoring

**Expected Result**: LCP reduction from ~4-5s → <2.5s across all devices and page types.
