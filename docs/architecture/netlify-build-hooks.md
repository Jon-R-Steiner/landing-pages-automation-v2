# Netlify Build Hooks

## Overview

Build Hooks provide unique webhook URLs that trigger Netlify deployments via HTTP POST requests. They enable automated publishing workflows without manual intervention.

**Use Cases:**
1. **Airtable Content Updates** → Auto-deploy (real-time publishing)
2. **Scheduled AI Content Refresh** → Nightly regeneration
3. **Emergency Rollback** → One-click restore to previous deploy

**Security Model:** Build Hook URLs are obscure (non-guessable) but contain no authentication. Do not advertise publicly.

---

## 1. Airtable Content Update → Auto-Deploy

**Trigger:** When client approves content in Airtable (Status = "Approved")

**Workflow:** Airtable Automation → POST to Build Hook → Netlify Rebuild → Deploy

### Setup (Step-by-Step)

**Step 1: Create Build Hook in Netlify**

```
Netlify UI:
  1. Navigate to: Site settings → Build & deploy → Continuous deployment
  2. Scroll to: Build hooks
  3. Click: Add build hook
  4. Configure:
     - Build hook name: "Airtable Content Update"
     - Branch to build: main
  5. Save → Copy generated URL:
     https://api.netlify.com/build_hooks/abc123xyz456
```

**Step 2: Configure Airtable Automation**

```
Airtable UI:
  1. Navigate to: Automations (in your base)
  2. Create automation:
     Name: "Deploy to Netlify on Approval"
  3. Configure trigger:
     - Trigger: "When record matches conditions"
     - Table: Pages
     - Conditions: Status = "Approved"
  4. Add action:
     - Action: "Send a request to a URL"
     - Method: POST
     - URL: https://api.netlify.com/build_hooks/abc123xyz456
     - Body (JSON):
       {
         "trigger_title": "Content approved in Airtable",
         "trigger_branch": "main"
       }
  5. Test automation → Verify Netlify deploy triggered
  6. Turn on automation
```

**Step 3: Test End-to-End**

```
1. Update content in Airtable (Pages table)
2. Change Status to "Approved"
3. Wait 30 seconds (Airtable automation delay)
4. Check Netlify Deploys page:
   - New deploy should appear
   - Triggered by: "Content approved in Airtable"
5. Wait 6-8 minutes for build to complete
6. Verify updated content is live
```

### Workflow Diagram

```
┌─────────────────────────────────────────────┐
│  AIRTABLE (Content Management)              │
│  - Client edits page content                │
│  - Client sets Status = "Approved"          │
└─────────────────────────────────────────────┘
                ↓ (Automation trigger)
┌─────────────────────────────────────────────┐
│  AIRTABLE AUTOMATION                        │
│  - Detect: Status changed to "Approved"     │
│  - Action: POST to Netlify Build Hook       │
│    Body: { "trigger_title": "Content..." }  │
└─────────────────────────────────────────────┘
                ↓ (HTTP POST)
┌─────────────────────────────────────────────┐
│  NETLIFY BUILD HOOK                         │
│  - Receive POST request                     │
│  - Trigger build from main branch           │
│  - Display trigger info in deploy log       │
└─────────────────────────────────────────────┘
                ↓ (Build process)
┌─────────────────────────────────────────────┐
│  NETLIFY BUILD                              │
│  1. Export Airtable content → JSON          │
│  2. Generate AI content (Claude API)        │
│  3. next build (static export)              │
│  4. Lighthouse quality gate                 │
│  5. Deploy to CDN                           │
│  Duration: 6-8 minutes                      │
└─────────────────────────────────────────────┘
                ↓
┌─────────────────────────────────────────────┐
│  NETLIFY CDN (Production)                   │
│  - Updated content live                     │
│  - Client receives email notification       │
└─────────────────────────────────────────────┘
```

**Benefits:**
- ✅ Real-time publishing (content approved → live in 6-8 minutes)
- ✅ Non-technical workflow (clients manage content, deploys happen automatically)
- ✅ Audit trail (Netlify deploy log shows who/what triggered deploy)
- ✅ No manual intervention required

**Estimated Frequency:** 5-20 deploys/day (content updates by clients)

---

## 2. Scheduled AI Content Refresh → Nightly Build

**Trigger:** Daily at 2:00 AM UTC (regenerate AI content for freshness)

**Workflow:** GitHub Actions Scheduled Job → POST to Build Hook → Netlify Rebuild

### Setup (GitHub Actions)

**Step 1: Create Build Hook in Netlify**

```
Netlify UI:
  - Build hook name: "Nightly AI Content Refresh"
  - Branch to build: main
  - Copy URL: https://api.netlify.com/build_hooks/def789ghi012
```

**Step 2: Create GitHub Actions Workflow**

```yaml
# .github/workflows/nightly-rebuild.yml

name: Nightly AI Content Refresh

on:
  schedule:
    # Run at 2:00 AM UTC daily (9:00 PM EST)
    - cron: '0 2 * * *'

  # Allow manual trigger for testing
  workflow_dispatch:

jobs:
  trigger-netlify-rebuild:
    runs-on: ubuntu-latest

    steps:
      - name: Trigger Netlify Build Hook
        run: |
          curl -X POST -d '{"trigger_title": "Nightly AI content refresh", "trigger_branch": "main"}' \
            -H "Content-Type: application/json" \
            https://api.netlify.com/build_hooks/${{ secrets.NETLIFY_BUILD_HOOK_NIGHTLY }}

      - name: Log Success
        run: echo "Netlify rebuild triggered successfully at $(date)"
```

**Step 3: Add Secret to GitHub**

```
GitHub Repository:
  1. Navigate to: Settings → Secrets and variables → Actions
  2. Click: New repository secret
  3. Name: NETLIFY_BUILD_HOOK_NIGHTLY
  4. Value: def789ghi012 (just the ID, not full URL)
  5. Save
```

**Step 4: Test Workflow**

```
GitHub Actions:
  1. Navigate to: Actions tab
  2. Select: "Nightly AI Content Refresh"
  3. Click: "Run workflow" (manual trigger)
  4. Verify: Netlify deploy triggered
```

**Benefits:**
- ✅ Fresh AI content daily (trust signals, FAQs stay current)
- ✅ SEO freshness signal (Google sees updated content = higher rankings)
- ✅ Zero manual work (set and forget)
- ✅ Audit trail (GitHub Actions logs + Netlify deploy logs)

**Alternative: Make.com Scheduled Trigger**

```
Make.com Scenario:
  Trigger: Schedule (Daily at 2:00 AM)
  Action: HTTP Request
    - Method: POST
    - URL: https://api.netlify.com/build_hooks/def789ghi012
    - Body: { "trigger_title": "Nightly AI refresh" }
```

---

## 3. Emergency Rollback → Restore Previous Deploy

**Trigger:** Production deploy fails, need to rollback immediately

**Workflow:** Manual POST to Build Hook → Netlify deploys previous commit

### Setup

**Step 1: Create Build Hook in Netlify**

```
Netlify UI:
  - Build hook name: "Emergency Rollback"
  - Branch to build: main~1 (previous commit notation)
  - Copy URL: https://api.netlify.com/build_hooks/jkl345mno678
```

**Step 2: Save Hook URL in Team Documentation**

```markdown
# Emergency Procedures

# Rollback Production Deploy

If a deploy breaks production:

1. **Immediate rollback** (restores previous working version):
   ```bash
   curl -X POST https://api.netlify.com/build_hooks/jkl345mno678
   ```

2. **Verify rollback**:
   - Check Netlify Deploys page
   - Deploy should show: "Triggered by: Emergency Rollback"
   - Wait 6-8 minutes for rollback to complete

3. **Investigate failure**:
   - Review failed deploy logs
   - Check Lighthouse report (if quality gate failed)
   - Fix issue before re-deploying

4. **Alternative** (Netlify UI):
   - Navigate to: Deploys
   - Find last successful deploy
   - Click: "Publish deploy" (instant rollback, no rebuild)
```

**Benefits:**
- ✅ Disaster recovery (bad deploy? One-click rollback)
- ✅ Business continuity (minimize downtime for high-value ad traffic)
- ✅ Faster than Git revert + push (6-8 min vs. 10-15 min)

**Expected Usage:** 1-2 times per year (rare, only for critical failures)

---

## Build Hook Security Best Practices

**1. URL Obscurity (Not Authentication)**

Build Hook URLs are obscure but not authenticated. Anyone with the URL can trigger a deploy.

```
# ✅ GOOD: Store in environment variables
NETLIFY_BUILD_HOOK_AIRTABLE=abc123xyz456
NETLIFY_BUILD_HOOK_NIGHTLY=def789ghi012

# ❌ BAD: Commit to Git
# netlify-hooks.txt (public repository)
```

**2. Rate Limiting**

Netlify rate-limits build hooks to prevent abuse:
- **Limit:** 10 requests per minute per webhook
- **Exceeded:** Returns HTTP 429 (Too Many Requests)
- **Mitigation:** Add delay between bulk triggers

**3. Audit Trail**

All build hook triggers are logged:
- **Netlify UI:** Deploys page shows "Triggered by: [trigger_title]"
- **Netlify API:** Deploy metadata includes `trigger_metadata`
- **Monitoring:** Set up Slack/email notifications for unexpected triggers

---

## Build Hook Cost Analysis

**Netlify Build Minutes:**

| Trigger Source | Frequency | Build Time | Monthly Minutes |
|----------------|-----------|------------|-----------------|
| **Airtable Content Update** | 5-20/day | 6-8 min | 900-4,800 min |
| **Nightly AI Refresh** | 1/day | 6-8 min | 180-240 min |
| **Emergency Rollback** | 1-2/year | 6-8 min | 1-2 min |
| **Manual Deploys** | 5-10/month | 6-8 min | 30-80 min |
| **Total Estimated** | - | - | **1,110-5,122 min/mo** |

**Netlify Pricing Tiers:**

| Plan | Build Minutes/mo | Cost/mo | Sufficient for Project? |
|------|------------------|---------|-------------------------|
| **Free** | 300 | $0 | ❌ No (need 1,110-5,122 min) |
| **Pro** | 1,000 | $19 | ⚠️ Maybe (low content churn) |
| **Business** | 2,500 | $99 | ✅ Yes (recommended) |

**Recommendation:**
- **Start with Pro ($19/mo):** If content updates are moderate (5-10/day)
- **Upgrade to Business ($99/mo):** If content updates are frequent (15-20/day) or multiple clients

**Cost Optimization:**
- Cache plugin reduces build time 50% (1,110 min → 555 min average)
- This could fit within Pro tier with careful monitoring

---

## Build Hook Integration Summary

| Hook Name | Trigger | Frequency | Purpose | Priority |
|-----------|---------|-----------|---------|----------|
| **Airtable Content Update** | Content approval | 5-20/day | Real-time publishing | 🚨 Critical |
| **Nightly AI Refresh** | Scheduled (2 AM) | 1/day | Fresh AI content | ⚠️ High |
| **Emergency Rollback** | Manual (on failure) | Rare | Disaster recovery | ⚠️ High |

---
