# Project Context

**Primary Goal:** Generate static landing pages optimized for Google Ads Quality Score (LCP <2.5s critical) with conversion tracking via GTM, CallRail, and GA4.

**Key Constraint:** **NO serverless functions for runtime/user-facing operations** - Previous deployment failed with monorepo + Netlify Functions. This architecture uses static-only CDN for all user-facing pages. However, **serverless functions ARE used for backend workflows** (AI content generation via Airtable webhooks) that occur BEFORE publishing.

**Target Scale:** 500+ landing pages per client, with support for multiple clients.
