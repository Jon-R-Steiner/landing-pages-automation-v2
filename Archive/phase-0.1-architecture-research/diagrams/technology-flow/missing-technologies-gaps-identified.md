# Missing Technologies / Gaps Identified

## 🔍 Potential Additions to Consider:

### 1. **Netlify Plugins** (Build Optimization)

**Recommended:**
- ✅ **@netlify/plugin-lighthouse** - Automated Lighthouse scoring on deploy
- ✅ **netlify-plugin-cache** - Cache node_modules between builds (faster builds)
- ⚠️ **netlify-plugin-sitemap** - Auto-generate sitemap.xml (MAYBE - Next.js can do this)

**Configuration (`netlify.toml`):**
```toml
[[plugins]]
  package = "@netlify/plugin-lighthouse"
  [plugins.inputs]
    output_path = "reports/lighthouse.html"

[[plugins]]
  package = "netlify-plugin-cache"
  [plugins.inputs.paths]
    - "node_modules"
    - ".next/cache"
```

**Decision Needed:** Should we add Netlify plugins?

---

### 2. **Error Monitoring** (Runtime)

**Identified Gap:** No runtime error tracking for client-side errors

**Options:**
- **Sentry** - Error tracking, performance monitoring ($26/mo for 50K errors)
- **LogRocket** - Session replay + error tracking ($99/mo)
- **Bugsnag** - Error monitoring ($49/mo)
- **Rollbar** - Error tracking ($25/mo)

**Recommendation:** Add Sentry (free tier: 5K errors/month might be sufficient for pilot)

**Decision Needed:** Add error monitoring or defer to Epic 1?

---

### 3. **Performance Monitoring** (Real User Monitoring - RUM)

**Identified Gap:** No real-world Core Web Vitals tracking

**Options:**
- **Google PageSpeed Insights API** - Free, but manual
- **Vercel Speed Insights** - $10/mo (requires Vercel hosting - NOT applicable)
- **Cloudflare Web Analytics** - Free (privacy-focused)
- **GA4 Web Vitals** - Free (via GTM custom event)

**Recommendation:** Implement GA4 Web Vitals tracking via GTM (free, already using GA4)

**Implementation:**
```javascript
// src/lib/webVitals.ts
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals'

function sendToGTM(metric) {
  dataLayer.push({
    event: 'web-vitals',
    metric_name: metric.name,
    metric_value: metric.value,
    metric_id: metric.id,
  })
}

getCLS(sendToGTM)
getFID(sendToGTM)
getFCP(sendToGTM)
getLCP(sendToGTM)
getTTFB(sendToGTM)
```

**Decision Needed:** Implement now or defer?

---

### 4. **A/B Testing** (Conversion Optimization)

**Identified Gap:** No A/B testing infrastructure for form optimization

**Options:**
- **Google Optimize** - DEPRECATED (shut down Sept 2023)
- **Netlify Edge Functions** - A/B testing at edge (requires serverless - conflicts with "no serverless" constraint)
- **GTM with Client-Side Split** - Use GTM to randomize variants (free, but flicker risk)
- **Optimizely** - Enterprise A/B testing ($50K+/year - overkill)
- **VWO** - A/B testing ($199/mo - mid-tier)

**Recommendation:** Defer to Epic 2 (not critical for MVP)

**Decision Needed:** Defer or implement basic GTM-based A/B testing?

---

### 5. **Form Analytics** (Conversion Funnel)

**Current State:** GTM tracks form stages, but no drop-off analysis

**Options:**
- **Hotjar** - Heatmaps + form analytics ($39/mo)
- **Microsoft Clarity** - Free heatmaps + session replay (privacy-focused)
- **GA4 Enhanced Events** - Custom form field tracking (free, via GTM)

**Recommendation:** Add Microsoft Clarity (free, no privacy concerns)

**Configuration:**
```tsx
// src/app/layout.tsx
<Script
  id="clarity"
  strategy="lazyOnload"
  dangerouslySetInnerHTML={{
    __html: `
      (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
      })(window, document, "clarity", "script", "${process.env.NEXT_PUBLIC_CLARITY_ID}");
    `
  }}
/>
```

**Decision Needed:** Add Microsoft Clarity now or defer?

---

### 6. **Build Notifications** (DevOps)

**Identified Gap:** No notification when builds fail or succeed

**Options:**
- **Netlify Build Notifications** - Built-in (email, Slack webhook)
- **GitHub Actions Notifications** - If using GHA for pre-build

**Recommendation:** Enable Netlify Slack notifications (built-in, free)

**Configuration (Netlify UI):**
- Settings → Build & Deploy → Deploy Notifications
- Add Slack webhook URL

**Decision Needed:** Set up now or defer?

---
