# Alerting Strategy

## Alert Levels

**1. Critical (Page owner immediately):**
- Site down (5+ min outage)
- Build failing (3+ consecutive failures)
- Form submissions failing (100% error rate)
- LCP exceeds 5s (2x target)

**2. Warning (Team channel, review within 24hr):**
- Build time >15 min (performance regression)
- LCP between 2.5s-5s (approaching threshold)
- Form submission error rate >5%
- Lighthouse score drops below 85

**3. Info (Log only, weekly review):**
- Build succeeded with warnings
- Lighthouse score drops 5-10 points
- CDN cache hit rate <90%

## Alert Channels

**Primary:** Email notifications
**Secondary:** Slack integration (optional)

**Example Slack alert:**
```
🚨 Critical: Site Down
URL: https://bathsrus.com
Status: 503 Service Unavailable
Duration: 6 minutes
Action: Investigate immediately
```
