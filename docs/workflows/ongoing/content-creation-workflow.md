# 1. Content Creation Workflow

**Flow:** Airtable → AI Service → Approval → Production

```
STEP 1: Marketing creates draft page in Airtable
  ↓ (minimal input: client, service, location, special instructions)
STEP 2: Status → "AI Processing" triggers AI Service webhook
  ↓
STEP 3: AI Service (Claude API) generates all content in parallel
  - SEO Title & Meta Description
  - H1 Headline & Hero Subheadline
  - Trust Bar signals (5 items)
  - FAQs (5 Q&A pairs)
  - CTA selection + reasoning
  - Hero image selection from library
  ↓
STEP 4: AI writes content back to Airtable record
  ↓
STEP 5: Marketing reviews + approves (Status → "Approved")
```

**Key Features:**
- ✅ Parallel generation (all content types generated simultaneously)
- ✅ Automatic rollup data (branch info, client branding pulled from relationships)
- ✅ AI selection reasoning stored (CTA choice, image choice documented)
- ✅ Version control ready (original AI content saved for rollback)
