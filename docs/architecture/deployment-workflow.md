# Deployment Workflow

## Automatic Deployment (Main Branch)

```
Developer merges PR to main
  ↓
GitHub triggers Netlify webhook
  ↓
Netlify Build starts
  1. npm install (with caching)
  2. npm run build (Next.js static export)
  3. Lighthouse plugin checks LCP <2.5s
  4. If pass: Deploy to CDN
  5. If fail: Abort deploy, notify team
  ↓
Production site updated (atomic deploy)
  - New pages live immediately
  - Old pages remain until deploy completes
  - Zero downtime
```

## Manual Deployment (Netlify UI)

**When to use:**
- Emergency rollback (revert to previous deploy)
- Testing a specific commit without merging

**Steps:**
```
1. Log into Netlify Dashboard
2. Select site (landing-pages-automation-v2)
3. Navigate to Deploys tab
4. Options:
   - "Trigger deploy" - Manual rebuild from main
   - "Deploy preview" - Deploy from any branch
   - "Publish deploy" - Rollback to previous successful deploy
```
