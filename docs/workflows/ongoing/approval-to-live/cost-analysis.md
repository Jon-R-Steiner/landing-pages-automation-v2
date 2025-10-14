# Cost Analysis

## AI Generation Costs (Claude API)

```yaml
Per Page Generation:
  - Hero content: ~800 tokens ($0.0024)
  - Trust bars: ~400 tokens ($0.0012)
  - FAQs: ~1200 tokens ($0.0036)
  - Gallery: ~400 tokens ($0.0012)

Total per page: ~2800 tokens = $0.0084 per page

Batch Generation (500 pages):
  - Total tokens: 1,400,000
  - Cost: $4.20

Monthly (100 new pages/month):
  - Cost: $0.84/month
```

## Infrastructure Costs

```yaml
AI Service Hosting (Netlify Functions):
  - $0/month (free tier - serverless)
  - Limits: 125K requests/month, 100 hours runtime/month
  - Usage: ~100-500 requests/month (well within free tier)

GitHub Actions:
  - Free tier: 2000 minutes/month
  - Usage: ~2 minutes per export
  - Capacity: 1000 exports/month (way more than needed)

Netlify (Main Site):
  - Free tier: 300 build minutes/month
  - Usage: ~1.5 minutes per build
  - Capacity: 200 builds/month

Airtable:
  - Team Plan: $20/month (5 users)
  - Records: Unlimited

Total Monthly Cost: ~$20/month
  - Covers unlimited AI generation (free serverless)
  - Unlimited builds/deploys (free tiers)
  - Team collaboration (Airtable Team plan)

Cost Savings vs Always-On Server: $5-7/month saved
```

---
