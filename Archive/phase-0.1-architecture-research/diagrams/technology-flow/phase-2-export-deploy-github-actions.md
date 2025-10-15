# Phase 2: Export & Deploy (GitHub Actions)

**Location:** GitHub Actions CI
**Trigger:** Airtable Status → "Approved" (webhook to GitHub API)
**Frequency:** On-demand (approval-driven)

## Step 4: Airtable Triggers GitHub Actions

```
┌─────────────────────────────────────────────────────────┐
│  AIRTABLE AUTOMATION: Trigger Export on Approval        │
│                                                          │
│  Trigger: Status = "Approved"                           │
│  Action: Send webhook POST to GitHub API                │
│                                                          │
│  Webhook URL:                                            │
│  https://api.github.com/repos/{owner}/{repo}/dispatches  │
│                                                          │
│  Headers:                                                │
│  - Authorization: Bearer {GITHUB_PAT}                   │
│  - Accept: application/vnd.github.v3+json               │
│                                                          │
│  Payload:                                                │
│  {                                                       │
│    "event_type": "airtable_export",                     │
│    "client_payload": {                                   │
│      "trigger": "page_approved",                         │
│      "page_id": "recXXXXXXXXX",                         │
│      "service": "bathroom-remodeling",                   │
│      "location": "strongsville"                          │
│    }                                                     │
│  }                                                       │
└─────────────────────────────────────────────────────────┘
                        ↓
              [GitHub Actions Workflow Triggered]
```

**Technologies:**
- Airtable Automations (webhook sender)
- GitHub API (repository_dispatch)
- GitHub Personal Access Token (PAT)

**Performance:**
- Duration: 1-2 seconds (webhook delivery)

---

## Step 5: GitHub Actions Export & Commit

```
┌─────────────────────────────────────────────────────────┐
│  GITHUB ACTIONS: .github/workflows/export-and-deploy.yml│
│                                                          │
│  Trigger: repository_dispatch (airtable_export)         │
│                                                          │
│  Steps:                                                  │
│  1. Checkout repository                                  │
│  2. Setup Node.js 20                                     │
│  3. npm ci (install dependencies)                        │
│  4. npm run export (scripts/export-airtable-to-json.js)  │
│  5. npm run validate-content (validation script)         │
│  6. git commit content.json                              │
│  7. git push origin main                                 │
└─────────────────────────────────────────────────────────┘
                        ↓
        [Script: scripts/export-airtable-to-json.js]
                        ↓
┌─────────────────────────────────────────────────────────┐
│  AIRTABLE API: Fetch Approved Pages                      │
│                                                          │
│  Query:                                                  │
│  - Table: Pages                                          │
│  - Filter: Status = "Approved"                          │
│  - Fields: All content fields + lookups                 │
│  - Sort: Client Name (asc)                              │
│                                                          │
│  Also Fetch:                                             │
│  - Clients table (active clients only)                  │
│                                                          │
│  Rate Limiting: 5 req/sec (handled by SDK)              │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│  OUTPUT: content.json (Single File)                      │
│                                                          │
│  {                                                       │
│    "clients": [                                          │
│      {                                                   │
│        "clientId": "recXXX",                             │
│        "clientName": "Baths R Us",                      │
│        "domain": "bathsrus.com",                        │
│        "branding": { colors, fonts, logo },             │
│        "tracking": { gtmId, callrail, recaptcha },      │
│        ...                                               │
│      }                                                   │
│    ],                                                    │
│    "pages": [                                            │
│      {                                                   │
│        "pageId": "recYYY",                               │
│        "service": "bathroom-remodeling",                 │
│        "location": "strongsville",                       │
│        "seo": { title, description },                    │
│        "hero": { h1, subheadline, cta, image },         │
│        "trustBars": [...],                               │
│        "faqs": [...],                                    │
│        "galleryCaptions": [...],                         │
│        "branchMetadata": { city, phone, address }       │
│      }                                                   │
│    ],                                                    │
│    "exportMetadata": {                                   │
│      "exportDate": "2025-01-09T10:30:00Z",              │
│      "totalPages": 523,                                  │
│      "totalClients": 3                                   │
│    }                                                     │
│  }                                                       │
│                                                          │
│  Size: ~500KB for 500 pages                             │
│  Location: /content.json (project root)                 │
│  Contains: ALL content including AI-generated fields    │
└─────────────────────────────────────────────────────────┘
                        ↓
              [Git Commit & Push to main]
                        ↓
┌─────────────────────────────────────────────────────────┐
│  GITHUB REPOSITORY (Remote)                              │
│                                                          │
│  Updated File:                                           │
│  - content.json (single file with all data)             │
│                                                          │
│  Triggers: Netlify auto-deploy webhook                  │
└─────────────────────────────────────────────────────────┘
                        ↓
              [Netlify Detects Push → Triggers Build]
```

**Technologies:**
- GitHub Actions (CI/CD)
- Airtable SDK ^0.12.2 (export script)
- Node.js 20 (GitHub Actions runner)
- Git (version control)

**Performance:**
- Duration: 45-90 seconds total
  - npm ci: 5-10 seconds (cached)
  - Export: 20-40 seconds (API calls)
  - Commit + Push: 5-10 seconds

---
