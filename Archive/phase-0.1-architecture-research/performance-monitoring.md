# Performance Monitoring

## Core Web Vitals Tracking

**Web Vitals API:**
```typescript
// src/lib/web-vitals.ts
export function reportWebVitals(metric: any) {
  if (metric.label === 'web-vital') {
    // Send to GA4
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: 'web_vitals',
        event_category: 'Web Vitals',
        event_action: metric.name,
        event_value: Math.round(metric.value),
        event_label: metric.id
      })
    }

    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[Web Vitals]', metric.name, Math.round(metric.value))
    }
  }
}
```

```tsx
// src/app/layout.tsx
import { reportWebVitals } from '@/lib/web-vitals'

export { reportWebVitals } // Next.js automatically calls this
```

**Metrics tracked:**
- **LCP (Largest Contentful Paint)** - Target: <2.5s
- **FID (First Input Delay)** - Target: <100ms
- **CLS (Cumulative Layout Shift)** - Target: <0.1
- **TTFB (Time to First Byte)** - Target: <800ms

## Lighthouse CI (Build-Time Monitoring)

**Automated performance checks:**
```yaml
# netlify.toml
[[plugins]]
package = "@netlify/plugin-lighthouse"

  [plugins.inputs.thresholds]
    performance = 90
    accessibility = 90
    best-practices = 90
    seo = 90
```

**Lighthouse reports stored in:**
- Netlify build logs
- Optional: Upload to Lighthouse CI server for historical tracking
