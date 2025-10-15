# Build Monitoring

## Netlify Build Notifications

**Setup Slack/Email notifications:**
```
Netlify Dashboard → Site Settings → Build & Deploy → Deploy Notifications

Add notifications for:
- Deploy started
- Deploy succeeded
- Deploy failed
- Deploy rolled back
```

**Notification includes:**
- Build log URL
- Commit that triggered deploy
- Build duration
- Lighthouse scores (if failed quality gate)

## Build Time Tracking

**Monitor build performance:**
- Track build duration over time
- Alert if build time exceeds threshold (>15 min)
- Investigate slow builds (check cache hit rate)

**Metrics to track:**
- Total build time
- npm install time
- next build time
- Lighthouse plugin time
