# 2. Build & Deployment Workflow

**Flow:** Approval → Export → Build → Deploy

```
STEP 1: Status → "Approved" triggers Airtable automation
  ↓
STEP 2: Airtable automation POSTs to GitHub Actions webhook
  ↓
STEP 3: GitHub Actions runs export script
  - Fetches all approved pages from Airtable API
  - Transforms to content.json format
  - Commits to Git (triggers Netlify auto-deploy)
  ↓
STEP 4: Netlify Build
  - Runs Next.js 15 static export
  - Lighthouse quality gate (LCP <2.5s, accessibility >90)
  - Cache plugin optimizes build speed
  - Generates 500+ static HTML pages
  ↓
STEP 5: CDN Deployment
  - Pages deployed to Netlify CDN
  - Cache headers set (1 year for assets, revalidate HTML)
  - Site live with atomic deploy (no partial updates)
```

**Key Features:**
- ✅ Atomic deploys (all-or-nothing, no partial updates)
- ✅ Automatic rollback on quality gate failure
- ✅ Build caching (50% faster incremental builds)
- ✅ Zero-downtime deploys
