# 2. Build & Deployment Workflow

**Flow:** Approval → Export → Build → Deploy

**Implementation Status:**
- ✅ **Phase 1:** Manual trigger via GitHub Actions (IMPLEMENTED)
- 🔄 **Phase 2:** Airtable webhook automation (FUTURE)

---

## Current Implementation (Phase 1)

### Manual Workflow Trigger

**Location:** `.github/workflows/airtable-export.yml`

**Complete Documentation:** [.github/workflows/README.md](../../../.github/workflows/README.md)

```
STEP 1: Marketing approves page in Airtable
  - Set Status → "Approved" in Airtable
  ↓
STEP 2: Developer triggers GitHub Action manually
  - Go to: GitHub → Actions → "Export Airtable to content.json"
  - Click "Run workflow" on master branch
  ↓
STEP 3: GitHub Actions runs export script
  - Fetches all approved pages from Airtable API
  - Transforms to content.json format
  - Validates required fields (Service, Location, SEO Title, Description)
  - Commits to Git if content changed
  ↓
STEP 4: Git commit triggers Netlify auto-deploy
  - Push to master branch detected
  ↓
STEP 5: Netlify Build
  - Runs Next.js 15 static export
  - Reads from committed content.json
  - Generates static HTML pages via generateStaticParams()
  - Build time: ~2-5 seconds for 10-50 pages
  ↓
STEP 6: CDN Deployment
  - Pages deployed to Netlify CDN (global edge network)
  - Cache headers set (1 year for assets, revalidate HTML)
  - Site live with atomic deploy (no partial updates)
  - Zero-downtime deployment
```

### Required Setup

**GitHub Secrets** (Settings → Secrets and variables → Actions):
- `AIRTABLE_API_KEY` - Personal access token from Airtable
- `AIRTABLE_BASE_ID` - Base ID (e.g., `appATvatPtaoJ8MmS`)

**See:** [.github/workflows/README.md](../../../.github/workflows/README.md#required-github-secrets) for setup instructions

---

## Future Enhancement (Phase 2)

### Automated Webhook Trigger

**Status:** Planned - Not yet implemented

```
STEP 1: Status → "Approved" triggers Airtable automation
  ↓
STEP 2: Airtable automation POSTs to GitHub Actions webhook
  - Uses repository_dispatch event
  - Event type: "airtable-approved"
  ↓
STEP 3-6: (Same as Phase 1 manual flow)
```

**Implementation Requirements:**
1. Configure Airtable automation webhook
2. Set up GitHub webhook URL
3. Add webhook signature verification (security)
4. Test end-to-end automation

---

## Key Features

- ✅ **Atomic deploys** (all-or-nothing, no partial updates)
- ✅ **Build validation** (TypeScript errors block deployment)
- ✅ **Git history** (content.json tracked in version control)
- ✅ **Rollback support** (revert git commit to rollback content)
- ✅ **Zero-downtime deploys** (Netlify atomic deployment)
- ✅ **Error handling** (validation errors prevent bad data)

---

## Troubleshooting

**See:** [.github/workflows/README.md](../../../.github/workflows/README.md#troubleshooting)

Common issues:
- Workflow fails: Check GitHub Secrets configuration
- No pages generated: Verify Airtable "Approved" view has records
- Build fails: Check TypeScript/Next.js errors in Netlify logs

---

## Related Documentation

- **Workflow file:** `.github/workflows/airtable-export.yml`
- **Workflow README:** [.github/workflows/README.md](../../../.github/workflows/README.md)
- **Export script:** `scripts/export-airtable-to-json.ts`
- **Complete flow:** [approval-to-live/overview-the-complete-flow.md](approval-to-live/overview-the-complete-flow.md)
