# Environment Variables

This document provides comprehensive documentation for all environment variables used in the Landing Pages Automation v2 project.

## Setup Instructions

1. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Replace placeholder values with your actual credentials
3. Never commit `.env.local` to version control (already in `.gitignore`)

---

## Required Variables

### Airtable Configuration

**`AIRTABLE_API_KEY`**
- **Purpose:** Authenticates API requests to Airtable
- **Type:** Server-side only (build-time)
- **Where to get:** [Airtable Personal Access Tokens](https://airtable.com/create/tokens)
- **Example:** `keyXXXXXXXXXXXXXX`
- **Security:** Never expose to client-side code

**`AIRTABLE_BASE_ID`**
- **Purpose:** Identifies the specific Airtable base containing landing page content
- **Type:** Server-side only (build-time)
- **Where to get:** Find in Airtable URL (`https://airtable.com/appXXXXXXXXXXXXXX/...`)
- **Example:** `appXXXXXXXXXXXXXX`
- **Security:** Can be considered semi-public but keep private as best practice

---

### Netlify Deployment

**`NETLIFY_AUTH_TOKEN`**
- **Purpose:** Authenticates Netlify API requests for deployment and configuration
- **Type:** Server-side only (CI/CD, local deployment)
- **Where to get:** [Netlify Personal Access Tokens](https://app.netlify.com/user/applications#personal-access-tokens)
- **Example:** `nfp_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`
- **Security:** Highly sensitive - grants full account access. Never expose to client.
- **Used by:** Netlify CLI, GitHub Actions, MCP server integration

---

### AI Content Generation

**`ANTHROPIC_API_KEY`**
- **Purpose:** Authenticates requests to Claude API for AI-generated content (Trust Bars, FAQs, Gallery captions)
- **Type:** Server-side only (build-time, Netlify Functions)
- **Where to get:** [Anthropic Console](https://console.anthropic.com/)
- **Example:** `sk-ant-xxxxxxxxxxxxx`
- **Security:** Never expose to client-side code
- **Usage:** Netlify Functions during content generation phase

---

### Form Submission

**`NEXT_PUBLIC_MAKE_WEBHOOK_URL`**
- **Purpose:** Webhook URL for submitting form data to Make.com (which routes to Salesforce)
- **Type:** Client-side (exposed to browser)
- **Where to get:** Create webhook in [Make.com](https://www.make.com/)
- **Example:** `https://hook.us1.make.com/xxxxx`
- **Security:** Public but obscure. Protected by reCAPTCHA server-side validation to prevent abuse.
- **Note:** Prefixed with `NEXT_PUBLIC_` because forms submit directly from client to Make.com

---

### reCAPTCHA (Spam Protection)

**`NEXT_PUBLIC_RECAPTCHA_SITE_KEY`**
- **Purpose:** Client-side reCAPTCHA site key for spam protection
- **Type:** Client-side (exposed to browser)
- **Where to get:** [Google reCAPTCHA Admin](https://www.google.com/recaptcha/admin)
- **Example:** `6LcXXXXXXXXXXXXXXXXXXXXXXXXXX`
- **Security:** Intended for public use

**`RECAPTCHA_SECRET_KEY`**
- **Purpose:** Server-side reCAPTCHA validation
- **Type:** Server-side only
- **Where to get:** [Google reCAPTCHA Admin](https://www.google.com/recaptcha/admin) (same project as site key)
- **Example:** `6LcYYYYYYYYYYYYYYYYYYYYYYYYYY`
- **Security:** Highly sensitive - never expose to client

---

### Analytics & Tracking

**`NEXT_PUBLIC_GTM_ID`**
- **Purpose:** Google Tag Manager container ID
- **Type:** Client-side (exposed to browser)
- **Where to get:** [Google Tag Manager](https://tagmanager.google.com/)
- **Example:** `GTM-XXXXXXX`
- **Security:** Intended for public use

**`NEXT_PUBLIC_GA4_MEASUREMENT_ID`**
- **Purpose:** Google Analytics 4 measurement ID
- **Type:** Client-side (exposed to browser)
- **Where to get:** [Google Analytics](https://analytics.google.com/)
- **Example:** `G-XXXXXXXXXX`
- **Security:** Intended for public use

**`NEXT_PUBLIC_CALLRAIL_COMPANY_ID`**
- **Purpose:** CallRail company identifier for phone tracking
- **Type:** Client-side (exposed to browser)
- **Where to get:** [CallRail Dashboard](https://app.callrail.com/)
- **Example:** `123456789`
- **Security:** Intended for public use

**`NEXT_PUBLIC_CALLRAIL_SCRIPT_ID`**
- **Purpose:** CallRail script identifier for dynamic number insertion
- **Type:** Client-side (exposed to browser)
- **Where to get:** [CallRail Dashboard](https://app.callrail.com/)
- **Example:** `987654321`
- **Security:** Intended for public use

---

## Environment-Specific Configuration

### Development (`.env.local`)
- All variables listed above
- Used by `npm run dev`
- Never commit to version control

### Production (Netlify)
- Configure all variables in Netlify Dashboard: Site Settings → Environment Variables
- Variables without `NEXT_PUBLIC_` prefix are only available during build
- Variables with `NEXT_PUBLIC_` prefix are embedded in client-side JavaScript bundle

### CI/CD (GitHub Actions)
- Required variables:
  - `NETLIFY_AUTH_TOKEN` (GitHub Secrets)
  - `AIRTABLE_API_KEY` (GitHub Secrets)
  - `AIRTABLE_BASE_ID` (GitHub Secrets or Variables)
- Configure in: Repository Settings → Secrets and Variables → Actions

---

## Security Best Practices

### Client-Side Exposure (`NEXT_PUBLIC_*` prefix)

**What it means:**
- Variables with `NEXT_PUBLIC_` prefix are embedded in the client-side JavaScript bundle
- Anyone can view these values by inspecting the browser's source code
- Only use for values that are safe to expose publicly

**Safe for public exposure:**
- Analytics IDs (GTM, GA4)
- Public API keys (reCAPTCHA site key, CallRail IDs)
- Webhook URLs (when protected by additional validation like reCAPTCHA)

**Never expose:**
- API secret keys (Airtable, Anthropic, Netlify)
- Server-side validation secrets (reCAPTCHA secret key)
- Authentication tokens

### Build-Time Only (no `NEXT_PUBLIC_` prefix)

**What it means:**
- Variables are only available during the build process
- Never embedded in client-side code
- Used by server-side code, build scripts, and Netlify Functions

**Variables in this category:**
- `AIRTABLE_API_KEY` - Used at build time to fetch content
- `ANTHROPIC_API_KEY` - Used by Netlify Functions
- `NETLIFY_AUTH_TOKEN` - Used by deployment tools
- `RECAPTCHA_SECRET_KEY` - Used for server-side validation

---

## Troubleshooting

### Variable not available at runtime
**Problem:** Variable works in development but not in production

**Solution:**
- If needed in browser: Add `NEXT_PUBLIC_` prefix and rebuild
- If needed in Netlify Functions: Ensure it's configured in Netlify Dashboard without `NEXT_PUBLIC_` prefix

### Variable not updating after change
**Problem:** Changed variable value but no effect

**Solution:**
1. Restart development server (`npm run dev`)
2. Clear Next.js cache: `rm -rf .next`
3. Rebuild: `npm run build`

### Missing variable error
**Problem:** Build fails with "Missing environment variable" error

**Solution:**
- Check `.env.local` exists and has all required variables
- Check Netlify Dashboard has all production variables configured
- Check GitHub Secrets for CI/CD variables

---

## Quick Reference

```bash
# .env.local (Complete Example)
# Copy .env.local.example and replace values

# Airtable Configuration
AIRTABLE_API_KEY=keyXXXXXXXXXXXXXX
AIRTABLE_BASE_ID=appXXXXXXXXXXXXXX

# Netlify Deployment
NETLIFY_AUTH_TOKEN=nfp_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# AI Content Generation
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxx

# Form Submission
NEXT_PUBLIC_MAKE_WEBHOOK_URL=https://hook.us1.make.com/xxxxx

# reCAPTCHA (Spam Protection)
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6LcXXXXXXXXXXXXXXXXXXXXXXXXXX
RECAPTCHA_SECRET_KEY=your-recaptcha-secret-key-here

# Analytics & Tracking
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
NEXT_PUBLIC_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_CALLRAIL_COMPANY_ID=123456789
NEXT_PUBLIC_CALLRAIL_SCRIPT_ID=987654321
```

---

**Last Updated:** 2025-01-14
