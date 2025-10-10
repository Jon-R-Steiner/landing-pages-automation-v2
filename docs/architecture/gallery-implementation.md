# ADR-034: Before/After Gallery Component

**Status:** Approved
**Date:** 2025-10-10
**Decision Makers:** Architecture Team, UX Team
**Stakeholders:** Development Team, Marketing Team

---

## Context and Problem Statement

The Before/After Gallery showcases transformation results (bathroom remodels) with visual comparisons. We need to decide the implementation approach that balances:

1. **User experience:** Interactive vs static presentation
2. **Performance:** Image optimization (<600KB total per page)
3. **Accessibility:** Keyboard navigation, screen reader support
4. **Mobile optimization:** 60%+ traffic, touch-friendly
5. **SEO:** Image discoverability and indexing

**Key Requirements:**
- Display 3-6 before/after image pairs per page
- Lazy loading (below fold, not LCP-blocking)
- AVIF/WebP/JPEG formats (Sharp-optimized at build time)
- Keyboard and touch accessible
- Total size <600KB for all gallery images

---

## Decision Drivers

1. **Performance:** LCP <2.5s, lazy load below-fold images
2. **Bundle size:** Minimize JavaScript (<50KB for gallery)
3. **Accessibility:** WCAG 2.1 AA compliance (keyboard nav, ARIA labels)
4. **Mobile-first:** Touch-optimized, 60%+ traffic
5. **SEO:** Images indexed by Google, proper alt text
6. **Conversion impact:** Visual proof increases trust and leads
7. **Developer experience:** Simple to add/update images

---

## Considered Options

### Option 1: Interactive Slider (react-compare-image)

**Library:** https://github.com/junkboy0315/react-compare-image

**Implementation:** Draggable slider to reveal before/after

**Example:**
```tsx
import ReactCompareImage from 'react-compare-image'

<ReactCompareImage
  leftImage="/before.jpg"
  rightImage="/after.jpg"
  sliderLineColor="#0ea5e9"
/>
```

**Pros:**
- ✅ Engaging UX (interactive slider)
- ✅ Single view shows both images
- ✅ Popular library (1.4k+ stars)
- ✅ Touch and mouse support

**Cons:**
- ❌ **13KB bundle** (gzipped) - adds to JS budget
- ❌ Client-side only (requires `'use client'`)
- ❌ Potential CLS if not carefully implemented
- ❌ Accessibility concerns (custom slider widget)
- ❌ More complex

**Bundle Impact:** ~13KB per slider (×3-6 images = 39-78KB total)

---

### Option 2: Static Grid (Side-by-Side)

**Implementation:** CSS Grid with before/after images side-by-side

**Example:**
```tsx
<div className="gallery-grid">
  <figure>
    <img src="/before-1.avif" alt="Bathroom before remodel" loading="lazy" />
    <figcaption>Before</figcaption>
  </figure>
  <figure>
    <img src="/after-1.avif" alt="Bathroom after remodel" loading="lazy" />
    <figcaption>After</figcaption>
  </figure>
</div>
```

**Pros:**
- ✅ **Zero JavaScript** - pure HTML/CSS
- ✅ Server Component (no client bundle)
- ✅ SEO-friendly (static HTML, crawlable)
- ✅ Perfect accessibility (standard img elements)
- ✅ Simple implementation
- ✅ Lazy loading built-in (`loading="lazy"`)

**Cons:**
- ⚠️ Less engaging (no interaction)
- ⚠️ Takes more screen space (2 images side-by-side)
- ⚠️ On mobile: stacked (before above, after below)

**Bundle Impact:** 0KB JavaScript

---

### Option 3: Hybrid (Static + Optional Modal Slider)

**Implementation:** Static grid by default, click to open modal with interactive slider

**Example:**
```tsx
// Static gallery
<button onClick={() => openModal(imageIndex)}>
  <img src="/before-1.avif" alt="Before" loading="lazy" />
  <img src="/after-1.avif" alt="After" loading="lazy" />
</button>

// Modal with slider (lazy loaded)
{isModalOpen && (
  <Modal>
    <ReactCompareImage leftImage={before} rightImage={after} />
  </Modal>
)}
```

**Pros:**
- ✅ Best of both: SEO + interactivity
- ✅ JavaScript loaded only when clicked (code-splitting)
- ✅ Static gallery loads fast (no JS)
- ✅ Interactive comparison available on demand

**Cons:**
- ⚠️ More complex implementation
- ⚠️ Requires modal component
- ⚠️ JavaScript bundle loaded on first interaction

**Bundle Impact:** 0KB initial, ~15KB on modal open (code-split)

---

### Option 4: CSS-Only Slider (Hover Effect)

**Implementation:** Pure CSS slider using `clip-path` or overflow

**Example:**
```css
.before-after {
  position: relative;
}

.before-after:hover .after {
  clip-path: inset(0 0 0 50%);
}
```

**Pros:**
- ✅ Zero JavaScript
- ✅ Interactive (hover reveals)
- ✅ Lightweight

**Cons:**
- ❌ Hover doesn't work on mobile (60%+ traffic)
- ❌ Not accessible (no keyboard support)
- ❌ Poor UX (unintentional triggers)

**Bundle Impact:** 0KB JavaScript

---

## Decision Outcome

**Selected: Option 2 - Static Grid (Side-by-Side) with Responsive Layout**

**Rationale:**
1. ✅ **Zero JavaScript:** Best performance, no bundle impact
2. ✅ **SEO-optimized:** Static HTML, crawlable images
3. ✅ **Perfect accessibility:** Standard `<img>` elements, no custom widgets
4. ✅ **Lazy loading:** Native `loading="lazy"` attribute
5. ✅ **Mobile-optimized:** Stacks vertically on mobile, side-by-side on desktop
6. ✅ **Simple maintenance:** Easy to add/update images via Airtable

**Desktop Layout:**
- Grid: 2 columns (before | after)
- 3-6 image pairs in vertical rows

**Mobile Layout:**
- Stack: Before above, After below
- Full-width images for better visibility

---

## Implementation Details

### Component Structure

```tsx
// src/components/Gallery/index.tsx
interface GalleryImage {
  id: string
  beforeUrl: string
  beforeAlt: string
  afterUrl: string
  afterAlt: string
  caption?: string
}

interface GalleryProps {
  images: GalleryImage[]
}

export function BeforeAfterGallery({ images }: GalleryProps) {
  return (
    <section className="gallery-section" aria-labelledby="gallery-heading">
      <h2 id="gallery-heading" className="gallery-title">
        Before & After Gallery
      </h2>

      <div className="gallery-grid">
        {images.map((image) => (
          <div key={image.id} className="gallery-pair">
            {/* Before Image */}
            <figure className="gallery-image">
              <picture>
                <source
                  srcSet={image.beforeUrl.replace('.jpg', '.avif')}
                  type="image/avif"
                />
                <source
                  srcSet={image.beforeUrl.replace('.jpg', '.webp')}
                  type="image/webp"
                />
                <img
                  src={image.beforeUrl}
                  alt={image.beforeAlt}
                  loading="lazy"
                  width={600}
                  height={400}
                  className="gallery-img"
                />
              </picture>
              <figcaption className="gallery-caption">Before</figcaption>
            </figure>

            {/* After Image */}
            <figure className="gallery-image">
              <picture>
                <source
                  srcSet={image.afterUrl.replace('.jpg', '.avif')}
                  type="image/avif"
                />
                <source
                  srcSet={image.afterUrl.replace('.jpg', '.webp')}
                  type="image/webp"
                />
                <img
                  src={image.afterUrl}
                  alt={image.afterAlt}
                  loading="lazy"
                  width={600}
                  height={400}
                  className="gallery-img"
                />
              </picture>
              <figcaption className="gallery-caption">After</figcaption>
            </figure>

            {/* Optional caption */}
            {image.caption && (
              <p className="gallery-pair-caption">{image.caption}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
```

---

### CSS Implementation (Tailwind v4)

```css
/* globals.css */

.gallery-section {
  padding: 3rem 1rem;
  max-width: 1200px;
  margin: 0 auto;
}

.gallery-title {
  font-size: 2rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 2rem;
  color: var(--color-gray-900);
}

.gallery-grid {
  display: grid;
  gap: 2rem;
  grid-template-columns: 1fr;
}

@media (min-width: 768px) {
  .gallery-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 3rem;
  }
}

/* Each before/after pair */
.gallery-pair {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  border-radius: 0.5rem;
  overflow: hidden;
}

@media (min-width: 640px) {
  .gallery-pair {
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }
}

.gallery-image {
  position: relative;
  margin: 0;
}

.gallery-img {
  width: 100%;
  height: auto;
  display: block;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.gallery-caption {
  position: absolute;
  bottom: 0.5rem;
  left: 0.5rem;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  font-weight: 600;
}

.gallery-pair-caption {
  grid-column: 1 / -1;
  text-align: center;
  font-size: 0.875rem;
  color: var(--color-gray-600);
  margin-top: 0.5rem;
}
```

---

### Alternative: Tailwind Utility Classes

```tsx
export function BeforeAfterGallery({ images }: GalleryProps) {
  return (
    <section className="py-12 px-4 max-w-6xl mx-auto" aria-labelledby="gallery-heading">
      <h2 id="gallery-heading" className="text-3xl font-bold text-center mb-8 text-gray-900">
        Before & After Gallery
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {images.map((image) => (
          <div key={image.id} className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-lg overflow-hidden">
            {/* Before */}
            <figure className="relative m-0">
              <picture>
                <source srcSet={image.beforeUrl.replace('.jpg', '.avif')} type="image/avif" />
                <source srcSet={image.beforeUrl.replace('.jpg', '.webp')} type="image/webp" />
                <img
                  src={image.beforeUrl}
                  alt={image.beforeAlt}
                  loading="lazy"
                  width={600}
                  height={400}
                  className="w-full h-auto block rounded-lg shadow-md"
                />
              </picture>
              <figcaption className="absolute bottom-2 left-2 bg-black/70 text-white px-3 py-1 rounded text-sm font-semibold">
                Before
              </figcaption>
            </figure>

            {/* After */}
            <figure className="relative m-0">
              <picture>
                <source srcSet={image.afterUrl.replace('.jpg', '.avif')} type="image/avif" />
                <source srcSet={image.afterUrl.replace('.jpg', '.webp')} type="image/webp" />
                <img
                  src={image.afterUrl}
                  alt={image.afterAlt}
                  loading="lazy"
                  width={600}
                  height={400}
                  className="w-full h-auto block rounded-lg shadow-md"
                />
              </picture>
              <figcaption className="absolute bottom-2 left-2 bg-black/70 text-white px-3 py-1 rounded text-sm font-semibold">
                After
              </figcaption>
            </figure>

            {image.caption && (
              <p className="col-span-full text-center text-sm text-gray-600 mt-2">
                {image.caption}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
```

---

## Image Optimization Strategy

### Build-Time Optimization (Sharp)

**Script:** `scripts/optimize-gallery-images.js`

```javascript
const sharp = require('sharp')
const fs = require('fs')
const path = require('path')

async function optimizeGalleryImage(inputPath, outputDir) {
  const filename = path.basename(inputPath, path.extname(inputPath))

  // Generate AVIF (smallest, ~50KB)
  await sharp(inputPath)
    .resize(600, 400, {
      fit: 'cover',
      position: 'center',
    })
    .avif({ quality: 80 })
    .toFile(path.join(outputDir, `${filename}.avif`))

  // Generate WebP (fallback, ~80KB)
  await sharp(inputPath)
    .resize(600, 400, { fit: 'cover', position: 'center' })
    .webp({ quality: 85 })
    .toFile(path.join(outputDir, `${filename}.webp`))

  // Generate JPEG (legacy, ~120KB)
  await sharp(inputPath)
    .resize(600, 400, { fit: 'cover', position: 'center' })
    .jpeg({ quality: 85, progressive: true })
    .toFile(path.join(outputDir, `${filename}.jpg`))

  console.log(`✅ Optimized: ${filename}`)
}

// Process all gallery images
const inputDir = 'source-images/gallery'
const outputDir = 'public/images/gallery'

fs.readdirSync(inputDir).forEach((file) => {
  if (/\.(jpg|jpeg|png)$/i.test(file)) {
    optimizeGalleryImage(path.join(inputDir, file), outputDir)
  }
})
```

**Output Structure:**
```
public/images/gallery/
├── before-1.avif    # 50KB
├── before-1.webp    # 80KB
├── before-1.jpg     # 120KB
├── after-1.avif     # 50KB
├── after-1.webp     # 80KB
└── after-1.jpg      # 120KB
```

**Total Size (6 image pairs):**
- AVIF (best): 12 images × 50KB = 600KB ✅
- WebP (fallback): 12 images × 80KB = 960KB (acceptable)
- JPEG (legacy): 12 images × 120KB = 1.44MB (still acceptable for below-fold)

---

### Lazy Loading Strategy

**Native Lazy Loading:**
```tsx
<img
  src="/gallery/after-1.jpg"
  alt="..."
  loading="lazy" // Browser handles lazy loading
  width={600}
  height={400}
/>
```

**Benefits:**
- ✅ Zero JavaScript
- ✅ Browser-optimized (loads when in viewport + margin)
- ✅ Works in all modern browsers (Safari 16.4+, Chrome 111+, Firefox 128+)

**Fallback:** Browsers without `loading="lazy"` support load all images (acceptable)

---

## Accessibility Implementation

### Semantic HTML

Use `<figure>` and `<figcaption>` for proper semantics:

```tsx
<figure>
  <img src="..." alt="..." />
  <figcaption>Before</figcaption>
</figure>
```

---

### Descriptive Alt Text

**Good Alt Text:**
```tsx
<img
  src="/before-1.jpg"
  alt="Small outdated bathroom with old fixtures and cracked tiles before remodel"
  loading="lazy"
/>

<img
  src="/after-1.jpg"
  alt="Modern spacious bathroom with walk-in shower, new tiles, and contemporary fixtures after remodel"
  loading="lazy"
/>
```

**Bad Alt Text (avoid):**
```tsx
<img src="/before-1.jpg" alt="Before" /> ❌
<img src="/after-1.jpg" alt="After" /> ❌
```

---

### ARIA Labels

Section has descriptive heading:

```tsx
<section aria-labelledby="gallery-heading">
  <h2 id="gallery-heading">Before & After Gallery</h2>
  {/* Gallery content */}
</section>
```

---

### Keyboard Navigation

No interactive elements (static images), so no keyboard navigation needed.

If adding clickable images (modal):
```tsx
<button
  type="button"
  onClick={() => openModal(index)}
  className="gallery-button"
  aria-label={`View larger before and after images of ${image.caption}`}
>
  <img src="..." alt="..." />
</button>
```

Ensure:
- ✅ Visible focus indicator
- ✅ Descriptive `aria-label`
- ✅ Keyboard accessible (Enter/Space to activate)

---

## SEO Optimization

### Image Sitemaps

Add gallery images to sitemap:

```xml
<!-- public/sitemap-images.xml -->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>https://example.com/bathroom-remodel/chicago</loc>
    <image:image>
      <image:loc>https://example.com/images/gallery/before-1.jpg</image:loc>
      <image:caption>Bathroom before remodel - outdated fixtures</image:caption>
    </image:image>
    <image:image>
      <image:loc>https://example.com/images/gallery/after-1.jpg</image:loc>
      <image:caption>Bathroom after remodel - modern walk-in shower</image:caption>
    </image:image>
  </url>
</urlset>
```

---

### Structured Data (Schema.org)

Add ImageGallery structured data:

```tsx
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "ImageGallery",
  "name": "Bathroom Remodel Before & After Gallery",
  "description": "See our bathroom remodeling transformations in Chicago",
  "image": [
    {
      "@type": "ImageObject",
      "contentUrl": "https://example.com/images/gallery/after-1.jpg",
      "caption": "Modern bathroom remodel with walk-in shower"
    },
    {
      "@type": "ImageObject",
      "contentUrl": "https://example.com/images/gallery/after-2.jpg",
      "caption": "Contemporary bathroom renovation with new fixtures"
    }
  ]
}
</script>
```

---

## Performance Testing

### Lighthouse Targets

- ✅ **LCP:** Gallery below fold, doesn't impact LCP
- ✅ **CLS:** Width/height attributes prevent layout shift
- ✅ **Performance Score:** ≥90
- ✅ **Accessibility Score:** ≥95

---

### Image Size Validation

**Test Script:**
```bash
# Check gallery image sizes
du -sh public/images/gallery/*.avif | awk '{sum+=$1} END {print "Total AVIF:", sum, "KB"}'
du -sh public/images/gallery/*.webp | awk '{sum+=$1} END {print "Total WebP:", sum, "KB"}'
du -sh public/images/gallery/*.jpg | awk '{sum+=$1} END {print "Total JPEG:", sum, "KB"}'
```

**Expected Output:**
```
Total AVIF: 600 KB  ✅
Total WebP: 960 KB  ✅
Total JPEG: 1440 KB ✅
```

---

## Testing Checklist

### Functional Testing

- [ ] All images load correctly
- [ ] Before/After labels visible
- [ ] Lazy loading works (images load on scroll)
- [ ] AVIF loads in supported browsers
- [ ] WebP fallback works
- [ ] JPEG fallback works

### Responsive Testing

**Desktop (≥1024px):**
- [ ] 2-column grid (2 galleries side-by-side)
- [ ] Each gallery: before | after (side-by-side)

**Tablet (768px-1023px):**
- [ ] 2-column grid OR single column
- [ ] Each gallery: before | after (side-by-side)

**Mobile (<768px):**
- [ ] Single column
- [ ] Each gallery: before above, after below (stacked)

### Performance Testing

- [ ] Lighthouse Performance: ≥90
- [ ] Total gallery size: <600KB (AVIF)
- [ ] Lazy loading verified (images load only when in viewport)
- [ ] No CLS (width/height attributes set)

### Accessibility Testing

- [ ] Axe DevTools: 0 violations
- [ ] Screen reader announces all images
- [ ] Alt text descriptive (not just "before"/"after")
- [ ] Figure/figcaption semantics correct
- [ ] Image contrast: N/A (photos)

---

## Consequences

### Positive

✅ **Zero JavaScript:** Best performance, no client bundle
✅ **SEO-optimized:** Static HTML, crawlable images
✅ **Perfect accessibility:** Standard HTML elements
✅ **Lazy loading:** Native browser support
✅ **Mobile-optimized:** Responsive grid, stacks on mobile
✅ **Easy maintenance:** Simple to add/update via Airtable

### Negative

⚠️ **Less engaging:** No interactive slider (acceptable tradeoff)
⚠️ **More screen space:** 2 images side-by-side (expected)
⚠️ **Image optimization required:** Must run Sharp build script (automated)

---

## Future Enhancements (Optional)

### Enhancement 1: Lightbox Modal (Code-Split)

Add clickable images that open lightbox:

```tsx
import dynamic from 'next/dynamic'

const Lightbox = dynamic(() => import('@/components/Lightbox'), {
  ssr: false,
})

// Click image to enlarge
<button onClick={() => openLightbox(index)}>
  <img src="..." alt="..." loading="lazy" />
</button>
```

**Bundle Impact:** ~10-15KB (code-split, loaded on demand)

---

### Enhancement 2: Image Comparison Slider (Progressive Enhancement)

Add interactive slider for users who want it:

```tsx
// Static by default
<div className="gallery-pair">
  <img src="/before.jpg" alt="Before" loading="lazy" />
  <img src="/after.jpg" alt="After" loading="lazy" />
</div>

// Optional interactive slider (loaded on click)
<button onClick={() => enableSlider(index)}>
  Compare Interactively →
</button>
```

**Bundle Impact:** 0KB initial, ~13KB on interaction

---

## Related Decisions

- **ADR-010:** Image Optimization Strategy (Sharp for build-time optimization)
- **ADR-029:** Critical CSS Extraction (Gallery CSS should be deferred)
- **ADR-031:** Mobile Performance Optimization (60%+ traffic mobile-first)
- **ADR-032:** Core Web Vitals (CLS prevention with width/height attributes)

---

## References

### Documentation
- Native Lazy Loading: https://web.dev/browser-level-image-lazy-loading/
- Sharp Image Processing: https://sharp.pixelplumbing.com/
- Image SEO Best Practices: https://developers.google.com/search/docs/appearance/google-images
- Schema.org ImageGallery: https://schema.org/ImageGallery

### Tools
- Sharp: Build-time image optimization
- Lighthouse CI: Performance validation
- Axe DevTools: Accessibility validation

---

**END OF ADR-034**
