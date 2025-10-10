# Netlify Build Plugins

## Overview

Netlify Build Plugins extend the build process with automated quality gates, performance optimization, and workflow automation. They execute during the build lifecycle (onPreBuild, onBuild, onPostBuild) without adding runtime complexity to the static site.

**Philosophy Alignment:** Plugins run at build-time only, maintaining the static-only architecture (no serverless functions in production).

**Recommended Plugins:**
1. **Lighthouse Plugin** - Performance & accessibility quality gates (CRITICAL)
2. **Cache Plugin** - Build speed optimization (HIGH PRIORITY)

---

## 1. Lighthouse Plugin (Quality Gate)

**Package:** `@netlify/plugin-lighthouse`

**Purpose:** Automated performance, accessibility, SEO, and best practices testing on every deploy. Prevents performance regression that would increase Google Ads costs.

**Why Critical for This Project:**
- **Google Ads Quality Score:** LCP <2.5s target directly impacts CPC (cost-per-click)
- **Performance Regression Prevention:** Catches slow pages before they reach production
- **Accessibility Compliance:** Automated WCAG AA testing (legal protection)
- **Stakeholder Reporting:** Visual reports for non-technical clients

### Configuration

```toml
# netlify.toml

[[plugins]]
package = "@netlify/plugin-lighthouse"

  [plugins.inputs]
  # Test mobile performance (Google Ads default device)
  audits = ["performance", "accessibility", "seo", "best-practices"]

  # Quality thresholds (build fails if scores drop below)
  [plugins.inputs.thresholds]
    performance = 90      # LCP <2.5s requirement
    accessibility = 90    # WCAG AA compliance
    seo = 85             # Meta tags, structured data
    best-practices = 85  # Security headers, HTTPS

  # Fail deployment if thresholds not met
  fail_deploy_on_score_thresholds = true

  # Save reports for stakeholder review
  output_path = "reports/lighthouse.html"

  # Test high-value landing pages
  urls = [
    "/bathroom-remodeling/charlotte",
    "/kitchen-remodeling/raleigh",
    "/hvac-repair/durham"
  ]
```

### Performance Thresholds Explained

| Audit | Threshold | Business Impact | Penalty if Failed |
|-------|-----------|-----------------|-------------------|
| **Performance (90)** | LCP <2.5s, FCP <1.0s, TTI <3.5s | Google Ads Quality Score | Higher CPC, lower ad rank |
| **Accessibility (90)** | WCAG AA compliance | Legal compliance, user experience | ADA lawsuits, lost conversions |
| **SEO (85)** | Meta tags, structured data, mobile | Organic search ranking | Lower organic traffic |
| **Best Practices (85)** | HTTPS, security headers, console errors | Security, user trust | Browser warnings, lower trust |

### Lighthouse Execution Flow

```
Build Process:
  1. npm run build (Next.js static export)
  2. Lighthouse Plugin (onPostBuild event)
     ↓
     a. Spin up local server (serve ./out directory)
     b. Run Lighthouse audits (Chromium headless)
     c. Calculate scores (Performance, Accessibility, SEO, Best Practices)
     d. Compare scores to thresholds
     ↓
  3a. IF all scores ≥ thresholds:
      - Generate HTML report → reports/lighthouse.html
      - Continue deployment → Netlify CDN
      - Display scores in Netlify UI (Pro plan)

  3b. IF any score < threshold:
      - FAIL BUILD (prevent deployment)
      - Display failing scores in build log
      - Send Slack notification (optional)
      - Developer must fix before retry
```

### Cost Analysis

**Lighthouse Build Time Overhead:**
- Additional build time: +1-2 minutes per deploy
- Total build time: 6 min → 7-8 min (with Lighthouse)

**Cost-Benefit:**
- **Cost:** +1-2 min build time (marginal)
- **Benefit:** Prevents deploying slow pages that waste Google Ads budget
- **ROI Example:**
  - Slow page (LCP 4s) → Quality Score 3/10 → CPC $8
  - Fast page (LCP 2.2s) → Quality Score 8/10 → CPC $4
  - Savings: $4 per click × 1000 clicks/month = **$4,000/month saved**

**Verdict:** Critical quality gate, ROI is massive

---

## 2. Cache Plugin (Build Optimization)

**Package:** `netlify-plugin-cache`

**Purpose:** Cache `node_modules` and Next.js build artifacts between builds to reduce build time by 50%.

**Why Useful:**
- **Faster Builds:** 6 min → 3-4 min (50% reduction)
- **Lower Costs:** Fewer build minutes consumed on Netlify
- **Faster Iterations:** Content updates deploy quicker (better UX for clients)

### Configuration

```toml
# netlify.toml (add after Lighthouse plugin)

[[plugins]]
package = "netlify-plugin-cache"

  [plugins.inputs]
  # Cache these directories between builds
  paths = [
    "node_modules",      # npm dependencies (15+ packages)
    ".next/cache",       # Next.js build cache
    ".cache"             # General cache directory
  ]
```

### Cache Execution Flow

```
First Build (No Cache):
  1. npm install (4-5 min) - Download all packages
  2. next build (2-3 min) - Full static export
  Total: 6-8 minutes

Subsequent Builds (With Cache):
  1. Restore node_modules from cache (30 sec)
  2. npm install (30 sec) - Only install new/updated packages
  3. next build (1-2 min) - Incremental build using .next/cache
  Total: 3-4 minutes

Cache Invalidation:
  - Automatic when package.json changes
  - Manual via Netlify UI: "Clear cache and retry deploy"
```

### Performance Metrics

| Build Type | Without Cache | With Cache | Savings |
|------------|---------------|------------|---------|
| **Clean Build** (package.json changed) | 6-8 min | 6-8 min | 0% (cache invalidated) |
| **Content Update** (Airtable change) | 6-8 min | 3-4 min | 50% |
| **Code Change** (minor component edit) | 6-8 min | 3-4 min | 50% |

**Expected Build Distribution:**
- 10% clean builds (package updates)
- 90% cached builds (content/code updates)

**Average Build Time:**
- Without cache: 6-8 min average
- With cache: (0.1 × 7 min) + (0.9 × 3.5 min) = **3.85 min average**

---

## 3. Why NOT Use Other Plugins

### ❌ Essential Next.js Plugin

**Status:** DEPRECATED (auto-installed by Netlify, should be removed)

**Reason:** Next.js Runtime v5 (2024+) auto-handles Next.js optimization. Manual plugin installation is no longer needed and can cause conflicts.

**Action:** If `@netlify/plugin-nextjs` exists in `package.json`, remove it:

```json
// package.json - REMOVE THIS:
"devDependencies": {
  "@netlify/plugin-nextjs": "^5.0.0"  // ❌ Delete this line
}
```

---

### ❌ Image Optimization Plugin

**Status:** NOT NEEDED

**Reason:**
- Next.js 15 + Sharp already handles image optimization at build time
- Images are hosted on Cloudinary (external CDN, not Netlify)
- Netlify Image CDN requires serverless functions (breaks static-only architecture)

---

### ❌ A11y (Accessibility) Plugin

**Status:** Redundant (Lighthouse covers this)

**Reason:** Lighthouse plugin already tests accessibility with WCAG AA compliance. Separate a11y plugin would duplicate testing.

---

## Complete netlify.toml Configuration

```toml
# netlify.toml - Complete Build Configuration

# ===== BUILD SETTINGS =====

[build]
  command = "npm run build"
  publish = "out"

  # Node.js version (matches local development)
  [build.environment]
    NODE_VERSION = "20.18.0"

# ===== BUILD PLUGINS =====

# 1. Lighthouse - Performance & Accessibility Quality Gate
[[plugins]]
package = "@netlify/plugin-lighthouse"

  [plugins.inputs]
  audits = ["performance", "accessibility", "seo", "best-practices"]

  [plugins.inputs.thresholds]
    performance = 90
    accessibility = 90
    seo = 85
    best-practices = 85

  fail_deploy_on_score_thresholds = true
  output_path = "reports/lighthouse.html"

  # Test 3 high-value pages per deploy
  urls = [
    "/bathroom-remodeling/charlotte",
    "/kitchen-remodeling/raleigh",
    "/hvac-repair/durham"
  ]

# 2. Cache - Build Speed Optimization
[[plugins]]
package = "netlify-plugin-cache"

  [plugins.inputs]
  paths = ["node_modules", ".next/cache", ".cache"]

# ===== HEADERS =====

# Cache static assets aggressively (1 year)
[[headers]]
  for = "/_next/static/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

# Cache images (1 year)
[[headers]]
  for = "/images/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

# Revalidate HTML on every request (dynamic content)
[[headers]]
  for = "*.html"
  [headers.values]
    Cache-Control = "public, max-age=0, must-revalidate"

# Security headers (all pages)
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "geolocation=(), microphone=(), camera=()"
    X-XSS-Protection = "1; mode=block"

# ===== REDIRECTS =====

# Redirect trailing slashes (SEO canonicalization)
[[redirects]]
  from = "/*/"
  to = "/:splat"
  status = 301
  force = true

# Redirect www to non-www (or vice versa)
[[redirects]]
  from = "https://www.bathsrus.com/*"
  to = "https://bathsrus.com/:splat"
  status = 301
  force = true
```

---
