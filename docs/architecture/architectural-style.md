# Architectural Style

**Jamstack Architecture** (JavaScript + APIs + Markup)

```
Build Time (Next.js 15 Static Export)
  ↓ Fetch data from Airtable (or JSON export)
  ↓ Generate AI content via Claude API
  ↓ Build 500+ static HTML pages
  ↓ Deploy to Netlify CDN

Runtime (User visits page)
  ↓ Static HTML served from CDN
  ↓ Client-side JavaScript hydrates
  ↓ GTM, CallRail, GA4 scripts load (deferred)
  ↓ User fills 3-stage form
  ↓ Form submits to Make.com webhook
  ↓ Make.com → Salesforce lead creation
```
