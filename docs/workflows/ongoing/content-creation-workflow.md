# 1. Content Creation Workflow

**Flow:** Airtable → BMad Content Writer Agent → Approval → Production

```
STEP 1: Marketing creates draft page in Airtable
  ↓ (minimal input: client, service, location, special instructions)
STEP 2: Marketing changes Status → "AI Processing"
  ↓
STEP 3: Developer runs BMad Content Writer Agent
  ↓ Command: /BMad:agents:copywriter
  ↓ Then: *generate-full-page {record_id}
  ↓
STEP 4: Agent generates all content:
  - SEO Title & Meta Description
  - H1 Headline & Hero Subheadline
  - FAQs (5 Q&A pairs)
  - Benefits list (5-7 items)
  ↓
STEP 5: Agent writes content back to Airtable via API
  ↓ Status automatically → "Ready for Review"
  ↓
STEP 6: Marketing reviews + approves (Status → "Approved")
  ↓
STEP 7: Airtable webhook triggers GitHub Actions export
  ↓
STEP 8: Netlify builds and deploys static site
```

**Key Features:**
- ✅ Manual trigger via BMad agent (MVP approach, no API infrastructure)
- ✅ Automatic rollup data (branch info, client branding pulled from relationships)
- ✅ Interactive generation (developer can review before writing to Airtable)
- ✅ Version control ready (content stored in Airtable for rollback)

**MVP Note:**
- Uses Claude Code subscription through BMad agent
- No Netlify Functions or Claude API infrastructure needed
- Can be automated later by extracting agent prompts to serverless functions
