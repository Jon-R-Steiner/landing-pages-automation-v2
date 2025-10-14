# Overview: The Complete Flow

> **Note:** This workflow focuses on the **Export & Deployment** process.
> Content creation and AI generation happen **before** approval in Airtable.
> See `docs/architecture/1-content-creation-workflow.md` for AI generation details.

```
AIRTABLE (Content Management)
  ↓
  [Content already created with AI-generated fields]
  ↓
Step 1: Marketing reviews + approves (Status → "Approved")
  ↓
Step 2: Airtable automation triggers GitHub Actions webhook
  ↓
Step 3: GitHub Actions Export
  - Fetches approved pages from Airtable
  - Generates content.json
  - Git commit + push to main
  ↓
Step 4: Netlify Build & Deploy
  - Next.js static export (500+ pages)
  - CDN deployment
  ↓
✅ LIVE (Page accessible at production URL)
```

**Timeline:** Approval → Live in ~8 minutes (export 45s + build 2min + deploy 30s)

---
