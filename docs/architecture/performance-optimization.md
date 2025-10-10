# Performance Optimization

## LCP Optimization (Target: <2.5s)

**Critical strategies:**
1. **Inline critical CSS** (Beasties plugin)
2. **Preload hero image** (`<link rel="preload">`)
3. **Defer third-party scripts** (GTM, CallRail load after LCP)
4. **Font optimization** (next/font with `display=swap`)
5. **Server Components** (reduce client-side JS)

**Hero image preload:**
```tsx
// app/[service]/[location]/page.tsx
export default async function Page({ params }) {
  const { heroImageUrl } = await getPageData(params)

  return (
    <>
      <link rel="preload" as="image" href={heroImageUrl} />
      <Hero imageUrl={heroImageUrl} />
    </>
  )
}
```

## JavaScript Optimization

**Bundle size targets:**
- First Load JS: <100KB (gzipped)
- Route-level JS: <50KB per page

**Strategies:**
- ✅ Server Components by default (zero JS)
- ✅ Dynamic imports for below-fold components
- ✅ Tree shaking (unused code removed)
- ✅ Code splitting (automatic in Next.js)

**Example dynamic import:**
```tsx
import dynamic from 'next/dynamic'

// Load Gallery only when needed (below fold)
const Gallery = dynamic(() => import('@/components/Gallery'), {
  loading: () => <div>Loading gallery...</div>,
})
```

## Image Optimization

**Next.js Image component:**
```tsx
import Image from 'next/image'

<Image
  src={heroImageUrl}
  alt={heroImageAlt}
  width={1200}
  height={675}
  priority // Preload (above fold)
  quality={85}
/>
```

**Benefits:**
- ✅ Automatic AVIF/WebP generation
- ✅ Responsive images (srcset)
- ✅ Lazy loading (below fold)
- ✅ Blur placeholder (LQIP)

## Caching Strategy

**Cache headers (Netlify):**
```toml
# netlify.toml
[[headers]]
  for = "/images/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/_next/static/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.html"
  [headers.values]
    Cache-Control = "public, max-age=0, must-revalidate"
```

**Strategy:**
- Static assets: 1 year cache (immutable)
- HTML pages: Revalidate on every request
- API responses: No cache (build-time only)

## Build Performance

**Netlify Cache Plugin:**
```toml
# netlify.toml
[[plugins]]
package = "netlify-plugin-cache"

  [plugins.inputs]
    paths = ["node_modules", ".next/cache"]
```

**Results:**
- First build: ~10 min
- Cached builds: ~5 min (50% faster)

---
