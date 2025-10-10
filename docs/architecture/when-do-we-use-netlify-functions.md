# When DO We Use Netlify Functions

## Decision: Use Netlify Functions for AI Content Generation

**Use Case:** Backend workflow automation (Airtable webhook → AI generation → write back to Airtable)

**Decision:** ✅ DO use Netlify Functions for AI content generation

**Architecture:**

```
Airtable Automation (Status="AI Processing")
  ↓
  POST webhook to Netlify Function
  ↓
netlify/functions/generate-ai-content.js (Serverless)
  ↓
  1. Fetch page data from Airtable
  2. Call Claude API (4 parallel requests)
  3. Write AI-generated content back to Airtable fields
  4. Update Status → "Ready for Review"
  ↓
Marketing reviews AI content in Airtable
  ↓
Marketing approves → Status="Approved"
  ↓
Triggers GitHub Actions export & deploy
```

**Rationale:**

### 1. Backend Workflow (Not User-Facing)

**Key Distinction:**
- ❌ **Runtime serverless** (user-facing, page load) - NOT USED (static CDN only)
- ✅ **Backend serverless** (pre-publish workflows) - USED for AI generation

This function runs BEFORE publishing, not during user page loads. It's part of the content creation workflow, not the runtime architecture.

### 2. Marketing Approval Workflow

**Problem:**
- Marketing needs to review/edit AI-generated content before publishing
- Cannot run AI during build (no review opportunity)

**Solution:**
- AI generates content when Marketing triggers it (on-demand)
- AI writes back to Airtable
- Marketing reviews in Airtable interface
- Only approved content gets exported to production

**Cold Start Trade-Off:**
- Cold start: 3-10s (acceptable for Marketing workflow)
- Marketing waits 18-40s total for AI generation
- This is FASTER than waiting for full build cycle (6-12 minutes)

### 3. Cost Efficiency

**Netlify Functions (Serverless):**
- Free tier: 125K requests/month, 100 hours runtime/month
- Estimated usage: 100-500 AI generations/month
- Cost: **$0/month** (well within free tier)

**Alternative: Always-On Server (Railway/Render):**
- Cost: $5-7/month (always running)
- Overkill for infrequent AI generation requests

**Cost Savings:** $5-7/month saved vs always-on server

### 4. Simple Deployment

**Same Repository:**
```
landing-pages-automation-v2/
├── app/                        # Next.js App Router (static pages)
├── netlify/functions/          # Serverless backend (AI generation)
│   └── generate-ai-content.js
├── netlify.toml                # Deploy config for both
└── content.json                # Single source of truth
```

**No Separate Backend:**
- No Railway/Render account needed
- No separate deployment pipeline
- Same environment variables (Netlify console)
- Single Git repository

### 5. Airtable Write-Back Pattern

**Workflow:**
1. Marketing creates page in Airtable → Status: "Draft"
2. Marketing triggers AI → Status: "AI Processing"
3. Airtable webhook → Netlify Function
4. Function writes AI content to Airtable fields:
   - SEO Title, H1, Subheadline
   - Trust Bar (5 fields)
   - FAQs (JSON)
   - Gallery Captions (JSON)
5. Function updates Status → "Ready for Review"
6. Marketing reviews/edits in Airtable
7. Marketing approves → Status: "Approved"
8. Airtable webhook → GitHub Actions export
9. GitHub Actions exports content.json (includes AI content)
10. Git push → Netlify build

**Key Benefit:** Single source of truth (Airtable) for all content, including AI-generated.

### 6. Serverless Architecture Alignment

**Clarification:**

The "NO serverless functions" constraint applies to **runtime/user-facing operations**, NOT backend workflows.

| Operation Type | Use Serverless? | Rationale |
|----------------|-----------------|-----------|
| **User page loads** | ❌ NO | Static CDN for performance (LCP <2.5s) |
| **Form submissions** | ❌ NO | Make.com handles (OAuth abstraction, visual workflow) |
| **AI content generation** | ✅ YES | Backend workflow (pre-publish), cost-effective, Marketing approval |
| **GitHub Actions** | ✅ YES | CI/CD automation (export Airtable to JSON) |

**Summary:** Serverless is appropriate for backend automation, not user-facing pages.

---
