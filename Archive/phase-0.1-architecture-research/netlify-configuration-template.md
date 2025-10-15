# ADR-011: Netlify Deployment Configuration

**Status:** Approved
**Date:** 2025-10-10
**Decision Makers:** Architecture Team, DevOps Team
**Stakeholders:** Development Team, Marketing Team

---

## Context and Problem Statement

Netlify deployment configuration is scattered across multiple architecture documents (build plugins, performance optimization, security, etc.). We need a **single, consolidated `netlify.toml` template** that includes:

1. **Build settings** (command, publish directory, Node.js version)
2. **Build plugins** (Lighthouse quality gates, cache optimization)
3. **Cache headers** (static assets, HTML, images)
4. **Security headers** (XSS protection, frame options, content type)
5. **Redirects** (trailing slashes, www canonicalization)
6. **Environment variables** (build-time configuration)

**Key Requirements:**
- Static export compatibility (`output: 'export'` in Next.js)
- Performance quality gates (Lighthouse: Performance ≥90, Accessibility ≥95)
- Build optimization (cache `node_modules`, `.next/cache`)
- CDN cache headers (1 year for assets, revalidate HTML)
- Security headers (WCAG compliance, XSS protection)

---

## Decision Drivers

1. **Build Performance:** 6-8 min builds → 3-4 min with caching (50% reduction)
2. **Quality Gates:** Prevent performance regression (LCP <2.5s, Google Ads Quality Score)
3. **CDN Optimization:** Long cache for static assets, short cache for HTML
4. **Security Compliance:** OWASP security headers, XSS protection
5. **SEO Canonicalization:** Redirect trailing slashes, enforce non-www (or www)
6. **Developer Experience:** Single file configuration, easy to maintain

---

## Decision Outcome

**Selected: Consolidated `netlify.toml` with Build Plugins, Cache Headers, and Security**

**Rationale:**
1. ✅ **Single source of truth** - All Netlify configuration in one file
2. ✅ **Quality gates** - Lighthouse plugin prevents deploying slow pages
3. ✅ **Build optimization** - Cache plugin reduces build time by 50%
4. ✅ **Performance** - Aggressive cache headers for static assets
5. ✅ **Security** - OWASP-recommended security headers
6. ✅ **SEO** - Canonical URL enforcement via redirects

---

## Complete netlify.toml Template

### Production-Ready Configuration

```toml
# ============================================================================
# Netlify Deployment Configuration for Next.js 15 Static Export
# ============================================================================
# Project: Landing Pages Automation v2
# Framework: Next.js 15 with App Router
# Output: Static export (500+ pre-rendered pages)
# Deployment: Netlify CDN (190+ edge locations)
# ============================================================================

# ===== BUILD SETTINGS =====

[build]
  # Build command (runs in CI/CD)
  command = "npm run build"

  # Publish directory (Next.js static export output)
  publish = "out"

  # Node.js version (must match local development)
  [build.environment]
    NODE_VERSION = "20.18.0"

    # Build-time environment variables (optional)
    # AIRTABLE_API_KEY loaded from Netlify UI (encrypted)
    # CLAUDE_API_KEY loaded from Netlify UI (encrypted)

# ===== BUILD PLUGINS =====

# ---------------------------------------------------------------------------
# Plugin 1: Lighthouse - Performance & Accessibility Quality Gate
# ---------------------------------------------------------------------------
# Runs automated audits on every deploy to prevent performance regression.
# CRITICAL for Google Ads Quality Score (LCP <2.5s = lower CPC).
#
# Installation:
#   npm install --save-dev @netlify/plugin-lighthouse
#
# Build Time Impact: +1-2 minutes per deploy
# ROI: Prevents deploying slow pages that waste Google Ads budget
# ---------------------------------------------------------------------------

[[plugins]]
package = "@netlify/plugin-lighthouse"

  [plugins.inputs]
  # Audit categories to test
  audits = ["performance", "accessibility", "seo", "best-practices"]

  # Minimum scores required to pass deployment
  # Build FAILS if any score drops below these thresholds
  [plugins.inputs.thresholds]
    performance = 90      # LCP <2.5s, FCP <1.0s, TTI <3.5s
    accessibility = 95    # WCAG 2.1 AA compliance (legal requirement)
    seo = 90              # Meta tags, structured data, mobile-friendly
    best-practices = 90   # Security headers, HTTPS, no console errors

  # Fail deployment if thresholds not met (STRICT MODE)
  fail_deploy_on_score_thresholds = true

  # Save HTML reports for stakeholder review
  output_path = "reports/lighthouse.html"

  # Test 3-5 high-value landing pages per deploy
  # Rotate these URLs periodically to test different page types
  urls = [
    "/bathroom-remodel/chicago",        # High-traffic service/location
    "/walk-in-shower/new-york",         # Different service type
    "/tub-to-shower-conversion/los-angeles" # Long URL test
  ]

# ---------------------------------------------------------------------------
# Plugin 2: Cache - Build Speed Optimization
# ---------------------------------------------------------------------------
# Caches node_modules and Next.js build artifacts between builds.
# Reduces build time by ~50% (6 min → 3 min for content updates).
#
# Installation:
#   npm install --save-dev netlify-plugin-cache
#
# Cache Invalidation:
#   - Automatic when package.json changes
#   - Manual via Netlify UI: "Clear cache and retry deploy"
# ---------------------------------------------------------------------------

[[plugins]]
package = "netlify-plugin-cache"

  [plugins.inputs]
  # Directories to cache between builds
  paths = [
    "node_modules",      # npm dependencies (~500MB, 15+ packages)
    ".next/cache",       # Next.js incremental build cache
    ".cache"             # General build cache
  ]

# ===== CACHE HEADERS (CDN OPTIMIZATION) =====

# ---------------------------------------------------------------------------
# Static Assets (JavaScript, CSS, Fonts) - Long Cache
# ---------------------------------------------------------------------------
# Next.js adds content hash to filenames (e.g., main-abc123.js)
# Files never change → safe to cache for 1 year (immutable)
# ---------------------------------------------------------------------------

[[headers]]
  for = "/_next/static/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
    # max-age=31536000 = 1 year (in seconds)
    # immutable = browser won't revalidate (performance boost)

# ---------------------------------------------------------------------------
# Images - Long Cache
# ---------------------------------------------------------------------------
# Optimized images (AVIF, WebP, JPEG) generated at build time
# Content hash in filename → safe to cache for 1 year
# ---------------------------------------------------------------------------

[[headers]]
  for = "/images/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

# ---------------------------------------------------------------------------
# Fonts - Long Cache
# ---------------------------------------------------------------------------
# WOFF2 fonts (Inter, system fonts)
# Font files rarely change → cache for 1 year
# ---------------------------------------------------------------------------

[[headers]]
  for = "/fonts/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

# ---------------------------------------------------------------------------
# HTML Pages - Short Cache (Revalidate on Every Request)
# ---------------------------------------------------------------------------
# Service/location pages generated from Airtable (dynamic content)
# Must revalidate to show latest offers, pricing, phone numbers
# ---------------------------------------------------------------------------

[[headers]]
  for = "/*.html"
  [headers.values]
    Cache-Control = "public, max-age=0, must-revalidate"
    # max-age=0 = always revalidate with server
    # must-revalidate = don't serve stale content

# ---------------------------------------------------------------------------
# Root HTML (index.html) - Short Cache
# ---------------------------------------------------------------------------

[[headers]]
  for = "/"
  [headers.values]
    Cache-Control = "public, max-age=0, must-revalidate"

# ===== SECURITY HEADERS (OWASP RECOMMENDED) =====

# ---------------------------------------------------------------------------
# Security Headers for All Pages
# ---------------------------------------------------------------------------
# Protects against XSS, clickjacking, MIME sniffing, etc.
# WCAG compliance requirement + legal protection
# ---------------------------------------------------------------------------

[[headers]]
  for = "/*"
  [headers.values]
    # Prevent clickjacking (don't allow site in iframe)
    X-Frame-Options = "DENY"

    # Prevent MIME type sniffing (security)
    X-Content-Type-Options = "nosniff"

    # Referrer policy (privacy + analytics)
    Referrer-Policy = "strict-origin-when-cross-origin"

    # Permissions policy (disable unused browser features)
    Permissions-Policy = "geolocation=(), microphone=(), camera=(), payment=()"

    # XSS protection (older browsers)
    X-XSS-Protection = "1; mode=block"

    # Content Security Policy (CSP) - Optional, add if needed
    # Content-Security-Policy = "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://cdn.callrail.com; style-src 'self' 'unsafe-inline';"

# ===== REDIRECTS (SEO CANONICALIZATION) =====

# ---------------------------------------------------------------------------
# Redirect: www → non-www (or vice versa)
# ---------------------------------------------------------------------------
# IMPORTANT: Update this to match your domain preference
# Option 1: www → non-www (current config)
# Option 2: non-www → www (swap from/to below)
#
# Why: Google treats www and non-www as separate sites (SEO issue)
# Solution: Redirect one to the other (choose preferred domain)
# ---------------------------------------------------------------------------

[[redirects]]
  from = "https://www.example.com/*"
  to = "https://example.com/:splat"
  status = 301  # Permanent redirect (SEO-friendly)
  force = true  # Override existing redirects

# ---------------------------------------------------------------------------
# Redirect: Remove Trailing Slashes
# ---------------------------------------------------------------------------
# /services/ → /services (canonical URL)
# Why: Avoid duplicate content (SEO), consistent URLs
# ---------------------------------------------------------------------------

[[redirects]]
  from = "/*/"
  to = "/:splat"
  status = 301
  force = false  # Don't override manual redirects

# ---------------------------------------------------------------------------
# 404 Error Page (Optional)
# ---------------------------------------------------------------------------
# Uncomment if you have a custom 404 page
# [[redirects]]
#   from = "/*"
#   to = "/404.html"
#   status = 404

# ===== ENVIRONMENT VARIABLES (OPTIONAL) =====

# ---------------------------------------------------------------------------
# Build-Time Environment Variables
# ---------------------------------------------------------------------------
# Sensitive values (API keys) should be set in Netlify UI:
# Site Settings → Build & Deploy → Environment Variables
#
# Example:
# - AIRTABLE_API_KEY = "keyXXXXXXXXXXXXXX" (encrypted)
# - CLAUDE_API_KEY = "sk-XXXXXXXXXXXXXXXXXX" (encrypted)
# - NEXT_PUBLIC_GA_ID = "G-XXXXXXXXXX" (public, safe to expose)
#
# Reference in code:
#   const apiKey = process.env.AIRTABLE_API_KEY
# ---------------------------------------------------------------------------

# [build.environment]
#   NEXT_PUBLIC_SITE_URL = "https://example.com"
#   NEXT_PUBLIC_GA_ID = "G-XXXXXXXXXX"

# ===== FUNCTIONS (NOT USED) =====

# ---------------------------------------------------------------------------
# Netlify Functions - DISABLED
# ---------------------------------------------------------------------------
# This project uses static-only architecture (no serverless functions).
# Form submission handled by Make.com webhook.
# API calls (Airtable, Claude) happen at build-time only.
#
# If you need to add Functions later, uncomment:
# [functions]
#   directory = "netlify/functions"
# ---------------------------------------------------------------------------

# ===== DEPLOY CONTEXTS (OPTIONAL) =====

# ---------------------------------------------------------------------------
# Production Deploys (main branch)
# ---------------------------------------------------------------------------

[context.production]
  # Use production environment variables
  # command = "npm run build"
  # publish = "out"

# ---------------------------------------------------------------------------
# Deploy Previews (Pull Requests)
# ---------------------------------------------------------------------------

[context.deploy-preview]
  # Optional: Use different command for previews
  # command = "npm run build:preview"

  # Skip Lighthouse on previews (faster builds)
  # [[context.deploy-preview.plugins]]
  #   package = "@netlify/plugin-lighthouse"
  #   enabled = false

# ---------------------------------------------------------------------------
# Branch Deploys (staging, dev)
# ---------------------------------------------------------------------------

[context.branch-deploy]
  # Optional: Use staging environment variables
  # command = "npm run build:staging"

# ===== ADDITIONAL CONFIGURATION =====

# ---------------------------------------------------------------------------
# Custom Headers for Specific Files (Optional)
# ---------------------------------------------------------------------------

# Example: Prevent caching of specific files
# [[headers]]
#   for = "/config.json"
#   [headers.values]
#     Cache-Control = "no-cache, no-store, must-revalidate"

# ---------------------------------------------------------------------------
# Additional Redirects (Optional)
# ---------------------------------------------------------------------------

# Example: Redirect old URLs to new URLs (SEO migration)
# [[redirects]]
#   from = "/old-page"
#   to = "/new-page"
#   status = 301

# Example: Redirect multiple old URLs
# [[redirects]]
#   from = "/bathroom-remodeling"
#   to = "/bathroom-remodel"
#   status = 301

# ============================================================================
# END OF CONFIGURATION
# ============================================================================
```

---

## Configuration Sections Explained

### 1. Build Settings

**Purpose:** Define how Netlify builds the site

```toml
[build]
  command = "npm run build"  # Runs Next.js static export
  publish = "out"            # Output directory for static files
```

**Key Points:**
- `command`: Must match `package.json` build script
- `publish`: Must match `next.config.js` output directory (`out/` for static export)
- `NODE_VERSION`: Prevents version mismatch between local and CI/CD

---

### 2. Build Plugins

#### Lighthouse Plugin (Quality Gate)

**Purpose:** Automated performance testing on every deploy

**Thresholds:**
- Performance ≥90 (LCP <2.5s, FCP <1.0s)
- Accessibility ≥95 (WCAG 2.1 AA compliance)
- SEO ≥90 (meta tags, structured data)
- Best Practices ≥90 (security headers, HTTPS)

**Failure Mode:**
- If any score < threshold → **Deploy FAILS**
- Developer must fix issues before redeploying

**Cost-Benefit:**
- Cost: +1-2 min build time
- Benefit: Prevents deploying slow pages that waste Google Ads budget

---

#### Cache Plugin (Build Optimization)

**Purpose:** Cache dependencies between builds

**Cached Directories:**
- `node_modules/` (~500MB, 15+ packages)
- `.next/cache/` (Next.js incremental build cache)

**Performance:**
- First build: 6-8 minutes (no cache)
- Subsequent builds: 3-4 minutes (50% faster)

---

### 3. Cache Headers (CDN Optimization)

| Resource Type | Cache Duration | Rationale |
|--------------|----------------|-----------|
| **Static Assets** (`/_next/static/*`) | 1 year (immutable) | Content hash in filename, never changes |
| **Images** (`/images/*`) | 1 year (immutable) | Optimized at build time, content hash |
| **Fonts** (`/fonts/*`) | 1 year (immutable) | Rarely change |
| **HTML** (`/*.html`) | 0 seconds (revalidate) | Dynamic content from Airtable |

**Why This Matters:**
- Long cache → Faster page loads (assets served from CDN edge)
- Short HTML cache → Always show latest offers, pricing, phone numbers

---

### 4. Security Headers

**OWASP-Recommended Headers:**

```toml
X-Frame-Options = "DENY"                    # Prevent clickjacking
X-Content-Type-Options = "nosniff"          # Prevent MIME sniffing
Referrer-Policy = "strict-origin-when-cross-origin" # Privacy + analytics
Permissions-Policy = "geolocation=(), ..."  # Disable unused features
X-XSS-Protection = "1; mode=block"          # XSS protection (legacy)
```

**Why This Matters:**
- Legal compliance (WCAG 2.1 AA, ADA)
- Security (prevent XSS, clickjacking)
- User trust (no browser warnings)

---

### 5. Redirects (SEO Canonicalization)

**www → non-www (or vice versa):**
```toml
from = "https://www.example.com/*"
to = "https://example.com/:splat"
status = 301  # Permanent redirect
```

**Remove trailing slashes:**
```toml
from = "/*/"
to = "/:splat"
status = 301
```

**Why This Matters:**
- SEO: Google treats www and non-www as separate sites
- Solution: Redirect to canonical URL
- Consistency: All URLs follow same pattern

---

## Installation Instructions

### 1. Create netlify.toml File

```bash
# In project root directory
touch netlify.toml

# Copy the complete template from above into netlify.toml
```

---

### 2. Install Build Plugins

```bash
# Install Lighthouse plugin
npm install --save-dev @netlify/plugin-lighthouse

# Install Cache plugin
npm install --save-dev netlify-plugin-cache
```

**Update `package.json`:**
```json
{
  "devDependencies": {
    "@netlify/plugin-lighthouse": "^6.0.0",
    "netlify-plugin-cache": "^1.0.3"
  }
}
```

---

### 3. Configure Environment Variables (Netlify UI)

**Sensitive Keys (DO NOT commit to Git):**

1. Go to Netlify Dashboard → Site Settings → Environment Variables
2. Add the following:

| Key | Value | Scope |
|-----|-------|-------|
| `AIRTABLE_API_KEY` | `keyXXXXXXXXXXXXXX` | Build-time only |
| `CLAUDE_API_KEY` | `sk-XXXXXXXXXXXXXXXXXX` | Build-time only |
| `NODE_VERSION` | `20.18.0` | Build-time only |

**Public Keys (safe to commit):**
```toml
[build.environment]
  NEXT_PUBLIC_SITE_URL = "https://example.com"
  NEXT_PUBLIC_GA_ID = "G-XXXXXXXXXX"
```

---

### 4. Customize Domain Redirects

**Update the www redirect to match your domain:**

```toml
# Change this line:
from = "https://www.example.com/*"

# To your actual domain:
from = "https://www.bathsrus.com/*"
```

**Choose preferred domain:**
- **Option 1 (Recommended):** www → non-www (cleaner URLs)
- **Option 2:** non-www → www (traditional enterprise preference)

---

### 5. Customize Lighthouse Test URLs

**Update test URLs to match your high-traffic pages:**

```toml
urls = [
  "/bathroom-remodel/chicago",        # Top service in top location
  "/walk-in-shower/new-york",         # Different service type
  "/tub-to-shower-conversion/los-angeles" # Long URL test
]
```

**Selection Strategy:**
- Test 3-5 pages per deploy (balance speed vs coverage)
- Rotate URLs periodically to test different page types
- Include high-traffic pages (Chicago, New York, Los Angeles)
- Include different services (bathroom remodel, shower, tub conversion)

---

## Testing the Configuration

### 1. Local Testing (Before Commit)

```bash
# Validate netlify.toml syntax
npm install -g netlify-cli
netlify deploy --dry-run

# Build locally to verify configuration
npm run build

# Expected output:
# ✓ Build completed successfully
# ✓ Static export: out/
```

---

### 2. Deploy Preview (Pull Request)

```bash
# Create feature branch
git checkout -b feature/netlify-config

# Add netlify.toml
git add netlify.toml
git commit -m "Add Netlify configuration with plugins and headers"

# Push to GitHub
git push origin feature/netlify-config

# Create pull request → Netlify auto-deploys preview
```

**Verify Preview:**
- Check Netlify deploy log for Lighthouse scores
- Verify cache headers: `curl -I https://preview-url.netlify.app/`
- Test redirects: `curl -I https://www.preview-url.netlify.app/`

---

### 3. Production Deploy

```bash
# Merge to main branch
git checkout main
git merge feature/netlify-config

# Push to production
git push origin main

# Netlify auto-deploys to production
```

**Verify Production:**
- Check Lighthouse report: `reports/lighthouse.html`
- Verify performance scores: Performance ≥90, Accessibility ≥95
- Test cache headers: `curl -I https://example.com/_next/static/`
- Test redirects: `curl -I https://www.example.com/`

---

## Troubleshooting

### Issue 1: Build Fails with "Lighthouse score below threshold"

**Error:**
```
Lighthouse Plugin: Performance score 85 is below threshold 90
Build failed
```

**Solution:**
1. Check Lighthouse report: `reports/lighthouse.html`
2. Identify failing metrics (LCP, FCP, TTI)
3. Fix performance issues (defer scripts, optimize images)
4. Retry deploy

**Quick Fix (Temporary):**
```toml
# Lower threshold temporarily
[plugins.inputs.thresholds]
  performance = 85  # Lower from 90 to 85
```

---

### Issue 2: Cache Plugin Not Working

**Symptoms:**
- Build time still 6-8 minutes
- No "Restoring cache" message in build log

**Solution:**
1. Verify plugin installed: `npm list netlify-plugin-cache`
2. Check `netlify.toml` syntax (correct indentation)
3. Clear cache manually: Netlify UI → Deploys → Clear cache and retry
4. Verify `node_modules/` exists before build

---

### Issue 3: Headers Not Applied

**Symptoms:**
- `curl -I https://example.com/` shows no custom headers
- Cache-Control missing

**Solution:**
1. Verify `netlify.toml` is in project root (NOT in subdirectory)
2. Check `[[headers]]` syntax (double brackets)
3. Verify `for` path matches actual file paths
4. Redeploy (headers only apply after successful deploy)

**Test Headers:**
```bash
# Test static assets
curl -I https://example.com/_next/static/chunks/main.js

# Expected:
# Cache-Control: public, max-age=31536000, immutable

# Test HTML
curl -I https://example.com/bathroom-remodel/chicago.html

# Expected:
# Cache-Control: public, max-age=0, must-revalidate
```

---

### Issue 4: Redirects Not Working

**Symptoms:**
- `https://www.example.com/` doesn't redirect to `https://example.com/`
- Trailing slashes not removed

**Solution:**
1. Update redirect URLs to match your actual domain
2. Verify `status = 301` (permanent redirect)
3. Check `force = true` for www redirect
4. Clear browser cache (redirects are cached)

**Test Redirects:**
```bash
# Test www redirect
curl -I https://www.example.com/

# Expected:
# HTTP/1.1 301 Moved Permanently
# Location: https://example.com/

# Test trailing slash removal
curl -I https://example.com/services/

# Expected:
# HTTP/1.1 301 Moved Permanently
# Location: https://example.com/services
```

---

## Maintenance

### Monthly Tasks

- [ ] Review Lighthouse reports (check for performance regression)
- [ ] Update test URLs in Lighthouse config (rotate high-traffic pages)
- [ ] Check cache hit rates in Netlify Analytics
- [ ] Review security headers (verify all pages protected)

### Quarterly Tasks

- [ ] Update Node.js version (match local development)
- [ ] Review cache durations (adjust based on content update frequency)
- [ ] Audit redirects (remove obsolete redirects)
- [ ] Update plugin versions (`npm update`)

### Yearly Tasks

- [ ] Review Netlify best practices (check for new features)
- [ ] Audit security headers (update based on OWASP guidelines)
- [ ] Re-evaluate performance thresholds (increase as site improves)

---

## Consequences

### Positive

✅ **Single source of truth** - All Netlify configuration in one file
✅ **Quality gates** - Lighthouse prevents deploying slow pages
✅ **Build optimization** - 50% faster builds with cache plugin
✅ **CDN performance** - Long cache for static assets, short for HTML
✅ **Security compliance** - OWASP headers prevent XSS, clickjacking
✅ **SEO canonicalization** - Redirect www, remove trailing slashes
✅ **Developer experience** - Easy to maintain, well-documented

### Negative

⚠️ **Build time overhead** - Lighthouse adds +1-2 min per deploy (acceptable)
⚠️ **Strict quality gates** - Deploy fails if scores drop (by design)
⚠️ **Cache invalidation** - HTML revalidate on every request (necessary for dynamic content)

---

## Related Decisions

- **ADR-009:** Static Export Configuration (Next.js)
- **ADR-012:** Plugin Requirements Assessment (Lighthouse, Cache)
- **ADR-020:** Performance Monitoring Strategy (Lighthouse CI)
- **ADR-029:** Critical CSS Extraction (performance optimization)
- **ADR-030:** Third-Party Script Optimization (defer GTM, CallRail)
- **ADR-032:** Core Web Vitals Monitoring (LCP <2.5s target)

---

## References

### Documentation
- Netlify Configuration: https://docs.netlify.com/configure-builds/file-based-configuration/
- Netlify Build Plugins: https://docs.netlify.com/integrations/build-plugins/
- Lighthouse CI: https://github.com/GoogleChrome/lighthouse-ci
- OWASP Security Headers: https://owasp.org/www-project-secure-headers/

### Tools
- Netlify CLI: https://docs.netlify.com/cli/get-started/
- Cache Header Validator: https://redbot.org/
- Security Header Scanner: https://securityheaders.com/

---

**END OF ADR-011**
