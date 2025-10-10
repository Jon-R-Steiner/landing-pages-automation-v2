# Overview: The Complete Flow

```
AIRTABLE (Content Management)
  ↓
STEP 1: Marketing creates draft page (minimal manual input)
  ↓
STEP 2: Status → "AI Processing" triggers AI Service
  ↓
AI SERVICE (Claude API - Parallel Generation)
  ↓
STEP 3: AI generates all content + writes back to Airtable
  ↓
STEP 4: Marketing reviews + approves (Status → "Approved")
  ↓
STEP 5: Airtable automation triggers GitHub Actions
  ↓
GITHUB ACTIONS (Export Script)
  ↓
STEP 6: Export Airtable → content.json → Git commit
  ↓
GITHUB PUSH (triggers Netlify auto-deploy)
  ↓
NETLIFY BUILD (Next.js static export)
  ↓
CDN DEPLOYMENT (Page goes live)
```

---
