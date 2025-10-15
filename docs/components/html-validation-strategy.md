# ADR-019: HTML Validation Strategy

**Status:** Approved
**Date:** 2025-10-10
**Decision Makers:** Architecture Team
**Stakeholders:** Development Team, QA Team

---

## Context and Problem Statement

Next.js 15 with static export generates HTML files for 500+ service/location pages. We need a validation strategy to ensure:
- HTML is valid and well-formed (W3C standards)
- Accessibility attributes are correctly implemented (ARIA, semantic HTML)
- SEO metadata is complete and correctly formatted
- No broken links or missing resources
- Consistent structure across all generated pages

**Key Challenge:** Manually validating 500+ pages is impractical. We need an automated, scalable approach with quality gates.

---

## Decision Drivers

1. **Scale:** 500+ pages require automation
2. **Build-time validation:** Catch errors before deployment
3. **Developer experience:** Fast feedback, clear error messages
4. **CI/CD integration:** Block deployment if validation fails
5. **Accessibility compliance:** WCAG 2.1 AA standards
6. **SEO requirements:** Valid metadata, Open Graph tags, structured data
7. **Cost:** Prefer free/open-source tools

---

## Considered Options

### Option 1: W3C Validator (Manual Spot-Checking)
- **Tool:** https://validator.w3.org/
- **Approach:** Manually validate 5-10 sample pages per deployment
- **Pros:** Free, authoritative, comprehensive error reporting
- **Cons:** Manual, slow, doesn't scale to 500 pages, no automation

### Option 2: HTML Validate (CLI Tool)
- **Tool:** https://html-validate.org/
- **Approach:** Automated validation in CI/CD pipeline
- **Pros:** Fast, configurable, integrates with CI/CD, supports custom rules
- **Cons:** Not as comprehensive as W3C validator

### Option 3: Nu HTML Checker (W3C CLI)
- **Tool:** https://github.com/validator/validator
- **Approach:** W3C validator as command-line tool
- **Pros:** Official W3C validator, can run locally/CI/CD
- **Cons:** Java dependency, slower than html-validate

### Option 4: Hybrid Approach (Recommended)
- **Tools:** html-validate (CI/CD) + W3C validator (spot-check)
- **Approach:** Automated validation in pipeline, manual spot-checks for critical pages
- **Pros:** Speed + accuracy, scalable, catches 95%+ of issues
- **Cons:** Requires two tools

---

## Decision Outcome

**Selected: Option 4 - Hybrid Approach**

**Rationale:**
- ✅ **Automated validation** catches structural errors at scale (html-validate)
- ✅ **Manual spot-checks** validate critical pages with authoritative W3C validator
- ✅ **Fast CI/CD integration** provides quick feedback to developers
- ✅ **Quality gates** prevent deployment of invalid HTML
- ✅ **Cost-effective** - both tools are free and open-source

---

## Implementation Details

### Phase 1: Automated Validation (html-validate)

**Tool:** `html-validate` (https://html-validate.org/)

**Installation:**
```bash
npm install --save-dev html-validate
```

**Configuration File:** `.htmlvalidate.json`
```json
{
  "extends": ["html-validate:recommended"],
  "rules": {
    "close-order": "error",
    "void-style": "error",
    "no-trailing-whitespace": "off",
    "require-sri": "off",
    "no-inline-style": "warn",
    "element-required-attributes": "error",
    "element-permitted-content": "error",
    "attr-quotes": ["error", { "style": "double" }],
    "doctype-style": ["error", "html5"],
    "wcag/h30": "error",
    "wcag/h32": "error",
    "wcag/h36": "error",
    "wcag/h37": "error",
    "wcag/h63": "error",
    "wcag/h67": "error",
    "wcag/h71": "error"
  },
  "elements": [
    "html5"
  ]
}
```

**npm Script:** `package.json`
```json
{
  "scripts": {
    "validate:html": "html-validate 'out/**/*.html'",
    "validate:html:sample": "html-validate 'out/**/bathroom-remodel/chicago.html' 'out/**/walk-in-shower/new-york.html'"
  }
}
```

**CI/CD Integration (GitHub Actions):**
```yaml
# .github/workflows/validate-html.yml
name: HTML Validation

on:
  pull_request:
    branches: [main, master]
  push:
    branches: [main, master]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build Next.js static export
        run: npm run build

      - name: Validate HTML
        run: npm run validate:html
```

**Quality Gate:**
- ❌ **FAIL build** if any `error` level violations found
- ⚠️ **WARN** for `warn` level violations (doesn't block deployment)
- ✅ **PASS** if all files pass validation

---

### Phase 2: Manual Spot-Check (W3C Validator)

**Tool:** W3C Markup Validation Service (https://validator.w3.org/)

**Frequency:** Weekly or before major releases

**Sample Pages to Validate:**
1. **Homepage:** `/` (if exists)
2. **High-traffic page:** `/bathroom-remodel/chicago`
3. **Different service:** `/walk-in-shower/new-york`
4. **Different service:** `/tub-to-shower/los-angeles`
5. **Accessibility page:** `/accessibility-modifications/miami`

**Validation Checklist:**
- [ ] No HTML errors reported
- [ ] No accessibility warnings
- [ ] All images have `alt` attributes
- [ ] Heading hierarchy is correct (no skipped levels)
- [ ] Form labels are properly associated
- [ ] ARIA attributes are valid
- [ ] Meta tags are present and correct
- [ ] Open Graph tags are valid
- [ ] Structured data (JSON-LD) is valid

**Process:**
1. Open live page in browser
2. Right-click → View Page Source (or Ctrl+U)
3. Copy HTML source
4. Paste into https://validator.w3.org/#validate-by-input
5. Click "Check"
6. Review errors and warnings
7. Document any recurring issues in GitHub Issues

---

### Phase 3: Accessibility Validation (Axe DevTools)

**Tool:** Axe DevTools Chrome Extension (https://www.deque.com/axe/devtools/)

**Frequency:** Per PR (manual) + Weekly automated scan

**Automated Scan (Playwright + Axe):**
```bash
npm install --save-dev @axe-core/playwright
```

**Test Script:** `tests/accessibility.spec.ts`
```typescript
import { test, expect } from '@playwright/test'
import { injectAxe, checkA11y } from 'axe-playwright'

test('Homepage accessibility', async ({ page }) => {
  await page.goto('http://localhost:3000')
  await injectAxe(page)
  await checkA11y(page, null, {
    detailedReport: true,
    detailedReportOptions: {
      html: true,
    },
  })
})

test('Service page accessibility', async ({ page }) => {
  await page.goto('http://localhost:3000/bathroom-remodel/chicago')
  await injectAxe(page)
  await checkA11y(page)
})
```

**Run Tests:**
```bash
npm run test:a11y
```

---

## Validation Rules

### Critical Errors (Block Deployment)

These errors MUST be fixed before deployment:

1. **Missing DOCTYPE**
   - ❌ No `<!DOCTYPE html>`
   - ✅ Valid HTML5 doctype present

2. **Unclosed Tags**
   - ❌ `<div>Content` (missing `</div>`)
   - ✅ All tags properly closed

3. **Invalid Nesting**
   - ❌ `<p><div>Invalid</div></p>` (block inside inline)
   - ✅ Correct element hierarchy

4. **Missing Required Attributes**
   - ❌ `<img src="...">` (missing `alt`)
   - ✅ `<img src="..." alt="Description">`

5. **Duplicate IDs**
   - ❌ Two elements with `id="form-name"`
   - ✅ Unique IDs across page

6. **Invalid ARIA**
   - ❌ `aria-invalid="yes"` (should be `true` or `false`)
   - ✅ Valid ARIA attribute values

7. **Broken Form Labels**
   - ❌ `<label>Name</label><input id="name">` (no association)
   - ✅ `<label for="name">Name</label><input id="name">`

---

### Warnings (Fix Recommended, Don't Block)

These issues should be addressed but don't block deployment:

1. **Missing `lang` attribute**
   - ⚠️ `<html>` (no language specified)
   - ✅ `<html lang="en">`

2. **Empty Headings**
   - ⚠️ `<h2></h2>` or `<h2> </h2>`
   - ✅ `<h2>Section Title</h2>`

3. **Inline Styles**
   - ⚠️ `<div style="color: red;">` (prefer classes)
   - ✅ `<div class="text-red-600">`

4. **Non-descriptive Links**
   - ⚠️ `<a href="...">Click here</a>`
   - ✅ `<a href="...">Read more about bathroom remodeling</a>`

---

## Common Next.js Static Export Issues

### Issue 1: Client-Side Hydration Mismatch

**Problem:** Server-rendered HTML doesn't match client-side React
**Example:**
```html
<!-- Server renders: -->
<div>Loading...</div>

<!-- Client expects: -->
<div>Content loaded</div>
```

**Solution:**
```typescript
// Use useEffect for client-only content
const [mounted, setMounted] = useState(false)

useEffect(() => {
  setMounted(true)
}, [])

if (!mounted) {
  return <div>Loading...</div>
}
```

---

### Issue 2: Next.js Image Component in Static Export

**Problem:** `<Image />` component generates invalid HTML with `output: 'export'`

**Solution:** Use `<img>` or `<picture>` instead
```tsx
// ❌ Don't use with static export
<Image src="/hero.jpg" width={1200} height={675} />

// ✅ Use standard img or picture
<picture>
  <source srcSet="/hero.avif" type="image/avif" />
  <source srcSet="/hero.webp" type="image/webp" />
  <img src="/hero.jpg" alt="Hero image" />
</picture>
```

---

### Issue 3: Missing Metadata

**Problem:** `generateMetadata()` not called for all pages

**Solution:** Ensure all dynamic pages export `generateMetadata()`
```typescript
// app/[service]/[location]/page.tsx
export async function generateMetadata({ params }) {
  const { service, location } = await params

  return {
    title: `${service} in ${location} | Company Name`,
    description: `Professional ${service} services in ${location}...`,
    openGraph: {
      title: `${service} in ${location}`,
      description: `...`,
      url: `https://example.com/${service}/${location}`,
    },
  }
}
```

---

## Testing Protocol

### Pre-Deployment Checklist

Before every production deployment:

1. ✅ **Run automated validation**
   ```bash
   npm run build
   npm run validate:html
   ```
   - Expected: 0 errors, <10 warnings

2. ✅ **Spot-check 5 pages** with W3C validator
   - Homepage + 4 service pages (different services/locations)

3. ✅ **Accessibility scan** with Axe DevTools
   - Run on 3 sample pages
   - Expected: 0 critical violations

4. ✅ **Lighthouse CI** (automated in Netlify build)
   - Performance: ≥90
   - Accessibility: ≥95
   - Best Practices: ≥90
   - SEO: ≥95

---

## Success Metrics

**Validation Coverage:**
- ✅ 100% of pages validated with html-validate
- ✅ 5+ pages manually validated with W3C per release
- ✅ 3+ pages accessibility scanned per release

**Quality Targets:**
- ✅ 0 critical HTML errors in production
- ✅ <10 warnings per 500 pages
- ✅ 100% pass rate for W3C spot-checks
- ✅ 0 accessibility violations (critical/serious)

**Build Performance:**
- ✅ HTML validation completes in <30 seconds (500 pages)
- ✅ CI/CD pipeline completes in <10 minutes total

---

## Consequences

### Positive

✅ **Early error detection** - Catch HTML errors before deployment
✅ **Automated quality gates** - Prevent invalid HTML from reaching production
✅ **Accessibility compliance** - WCAG 2.1 AA validation built-in
✅ **SEO optimization** - Valid metadata and semantic HTML
✅ **Developer confidence** - Fast feedback loop
✅ **Scalable** - Handles 500+ pages efficiently

### Negative

⚠️ **Additional build time** - ~30 seconds for validation
⚠️ **Initial setup effort** - Configure html-validate rules
⚠️ **Maintenance** - Update rules as HTML/accessibility standards evolve
⚠️ **False positives** - May need to tune rules to reduce warnings

---

## Alternatives Considered

### Alternative 1: No Formal Validation
- **Rejected:** High risk of deploying invalid HTML
- **Risk:** SEO penalties, accessibility violations, browser compatibility issues

### Alternative 2: W3C Validator Only (Manual)
- **Rejected:** Doesn't scale to 500 pages
- **Risk:** Human error, slow feedback

### Alternative 3: Custom Validation Script
- **Rejected:** Reinventing the wheel, maintenance burden
- **Risk:** Incomplete coverage, bugs in custom code

---

## Implementation Plan

### Phase 1: Foundation (Week 1)
- [x] Install html-validate
- [x] Create `.htmlvalidate.json` configuration
- [x] Add validation scripts to `package.json`
- [ ] Test on local build

### Phase 2: CI/CD Integration (Week 1)
- [ ] Create GitHub Actions workflow
- [ ] Test on pull request
- [ ] Configure quality gates

### Phase 3: Manual Processes (Week 2)
- [ ] Document W3C validation process
- [ ] Create spot-check checklist
- [ ] Train team on validation workflow

### Phase 4: Accessibility (Week 2)
- [ ] Install Axe DevTools extension
- [ ] Install @axe-core/playwright
- [ ] Create accessibility test suite
- [ ] Run baseline accessibility scan

---

## Related Decisions

- **ADR-020:** Performance Monitoring Strategy (Lighthouse CI)
- **ADR-018:** Accessibility Testing Tools (Axe DevTools)
- **ADR-009:** Static Export Configuration (Next.js HTML generation)

---

## References

### Documentation
- W3C Markup Validation: https://validator.w3.org/
- html-validate: https://html-validate.org/
- Axe DevTools: https://www.deque.com/axe/devtools/
- WCAG 2.1 Guidelines: https://www.w3.org/WAI/WCAG21/quickref/
- Next.js Metadata API: https://nextjs.org/docs/app/building-your-application/optimizing/metadata

### Tools
- html-validate CLI: https://html-validate.org/usage/cli.html
- Nu HTML Checker (W3C CLI): https://github.com/validator/validator
- @axe-core/playwright: https://github.com/dequelabs/axe-core-npm/tree/develop/packages/playwright

---

**END OF ADR-019**
