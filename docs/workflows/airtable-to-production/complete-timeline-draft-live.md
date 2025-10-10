# Complete Timeline: Draft → Live

```yaml
T+0:00   Marketing: Create draft in Airtable
           - Service: bathroom-remodeling
           - Location: strongsville
           - Client: Baths R Us
           - Status: Draft

T+0:05   Airtable Automation: Auto-matches Medina Office branch

T+0:10   Marketing: Reviews auto-populated data, triggers AI
           - Status: Draft → "AI Processing"

T+0:11   Airtable Automation: Webhook POST to AI Service

T+0:12   AI Service: Fetches guardrails
           - Available CTAs (3 options)
           - Available hero images (5 options)
           - Branch metadata (Medina Office)

T+0:15   Claude API: Parallel generation (4 simultaneous calls)
           ├─ Hero content (SEO, H1, subheadline, CTA selection) [10s]
           ├─ Trust bars [8s]
           ├─ FAQs [15s] ← longest
           └─ Gallery captions [10s]

T+0:30   AI Service: All content generated (15s total - limited by FAQs)

T+0:31   AI Service: Writes all results to Airtable

T+0:32   AI Service: Updates Status → "Ready for Review"

--- HUMAN REVIEW PAUSE ---

T+5:00   Marketing: Reviews AI-generated content
T+5:30   Marketing: Edits H1 headline (optional)
T+6:00   Marketing: Approves → Status: "Approved"

T+6:01   Airtable Automation: Webhook POST to GitHub Actions

T+6:02   GitHub Actions: Workflow starts
T+6:10   GitHub: npm ci (install dependencies - 8s)
T+6:30   GitHub: npm run export (fetch Airtable data - 20s)
T+6:35   GitHub: npm run validate-content (5s)
T+6:40   GitHub: git commit content.json (5s)
T+6:45   GitHub: git push origin main (5s)

T+6:46   Netlify: Detects git push → Auto-triggers build

T+6:47   Netlify: npm ci (cached - 5s)
T+6:52   Netlify: npm run build (Next.js static export - 90s)
T+8:22   Netlify: Deploy to CDN (30s)

T+8:52   ✅ LIVE - Page deployed
         https://bathsrus.com/bathroom-remodeling/strongsville

Total Time:
  - AI Generation: 30 seconds
  - Human Review: ~5 minutes (variable)
  - Export + Deploy: ~2.5 minutes

Total: ~8 minutes from approval to live
```

---
