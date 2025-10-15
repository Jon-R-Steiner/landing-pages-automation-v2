# Testing

Complete testing strategy for the landing pages automation system.

---

## Testing Philosophy

**Current MVP Approach:**
- ✅ Automated quality checks (Lighthouse, type checking, linting)
- ✅ Manual spot-checks (content quality, visual review)
- ⚠️ Unit/integration tests deferred to Phase 2 (not in MVP scope)

**Rationale:**
- Focus is on content quality and system capability validation
- Traditional test suites deferred until patterns stabilize
- Manual testing appropriate for MVP iteration speed
- Automated quality gates catch critical issues

---

## 1. Type Checking (TypeScript)

**Run on every commit:**
```bash
npm run type-check
```

**What it catches:**
- Type mismatches
- Missing properties
- Incorrect function signatures
- Null/undefined errors

**Coverage: 100% (strict mode enabled)**

**Configuration:**
```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

---

## 2. Linting (ESLint)

**Run on every commit:**
```bash
npm run lint
```

**What it catches:**
- Code style violations
- React anti-patterns
- Accessibility issues (jsx-a11y rules)
- Unused variables
- Missing dependencies in hooks

**Configuration:**
```javascript
// .eslintrc.js
module.exports = {
  extends: [
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended',
    'prettier'
  ],
  rules: {
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-unused-vars': 'error',
    'react-hooks/exhaustive-deps': 'error'
  }
}
```

---

## 3. Formatting (Prettier)

**Auto-format on save:**
```bash
npm run format
```

**Configuration:**
```javascript
// .prettierrc
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5"
}
```

---

## 4. Lighthouse (Performance & Accessibility)

**Automated on every deploy:**
- Performance score ≥90
- Accessibility score ≥90
- Best practices score ≥90
- SEO score ≥90

**Core Web Vitals Targets:**
- LCP: <2.5s (enforced)
- FID: <100ms
- CLS: <0.1

**Configuration:**
```yaml
# netlify.toml
[[plugins]]
package = "@netlify/plugin-lighthouse"

  [plugins.inputs.thresholds]
    performance = 90
    accessibility = 90
    best-practices = 90
    seo = 90

  [plugins.inputs.audit_urls]
    "/" = ["mobile", "desktop"]
    "/bathroom-remodeling/chicago-il/" = ["mobile"]
```

**If thresholds not met:** Build aborts, no deploy

---

## 5. Manual Testing (Current Approach)

### Pre-Deploy Checklist

**Visual & Functionality:**
- [ ] Visual review (3 sample pages)
- [ ] Mobile responsiveness (iPhone, Android)
- [ ] Form submission works (test lead in Salesforce)
- [ ] Phone number displays (CallRail swap working)
- [ ] GTM + GA4 tracking fires

**Accessibility:**
- [ ] Keyboard navigation works
- [ ] Screen reader compatibility
- [ ] Color contrast passes WCAG AA
- [ ] Focus indicators visible

**Content Quality:**
- [ ] No AI hallucinations
- [ ] TCPA compliance (disclaimers present)
- [ ] Accurate service/location information
- [ ] Images load properly

**Performance:**
- [ ] LCP <2.5s on mobile
- [ ] No layout shifts (CLS = 0)
- [ ] Images optimized

---

## 6. E2E Testing (Playwright - Phase 2)

**When implemented (Phase 2):**
```typescript
// tests/e2e/form-submission.spec.ts
import { test, expect } from '@playwright/test'

test('three-stage form submission', async ({ page }) => {
  await page.goto('/bathroom-remodeling/charlotte-nc/')

  // Stage 1: Contact info
  await page.fill('[name="name"]', 'John Doe')
  await page.fill('[name="email"]', 'john@example.com')
  await page.fill('[name="phone"]', '555-123-4567')
  await page.click('button:has-text("Next")')

  // Stage 2: Project details
  await page.selectOption('[name="projectType"]', 'full-remodel')
  await page.click('button:has-text("Next")')

  // Stage 3: Timeline
  await page.selectOption('[name="timeline"]', '1-3-months')
  await page.click('button:has-text("Submit")')

  // Verify success
  await expect(page).toHaveURL('/thank-you')
})
```

**Coverage targets (Phase 2):**
- Critical user paths: 100%
- All components: 80%
- Utilities: 70%

---

## 7. Unit Testing (Vitest - Phase 2)

**When implemented (Phase 2):**
```typescript
// src/lib/__tests__/content-generator.test.ts
import { describe, it, expect } from 'vitest'
import { generateFAQSection } from '../content-generator'

describe('generateFAQSection', () => {
  it('generates FAQ items from service data', () => {
    const result = generateFAQSection({
      service: 'bathroom-remodeling',
      location: 'Charlotte, NC'
    })

    expect(result).toHaveLength(5)
    expect(result[0]).toHaveProperty('question')
    expect(result[0]).toHaveProperty('answer')
  })

  it('handles missing data gracefully', () => {
    const result = generateFAQSection({ service: '', location: '' })
    expect(result).toEqual([])
  })
})
```

---

## Test Pyramid (Phase 2 Target)

```
        /\
       /  \      E2E Tests (10%)
      /____\     - Critical user paths
     /      \
    / Integration \   Integration Tests (20%)
   /__________\   - Component interactions
  /            \
 /  Unit Tests  \ Unit Tests (70%)
/________________\ - Business logic
                   - Utility functions
```

**Current State (MVP):**
- 0% traditional tests
- 100% reliance on automated quality gates + manual testing

**Phase 2 Target:**
- 70% unit test coverage
- 20% integration test coverage
- 10% E2E test coverage

---

## Quality Gates

**Pre-Commit:**
1. TypeScript type check (must pass)
2. ESLint (must pass)
3. Prettier formatting (auto-fix)

**Pre-Deploy:**
1. Build succeeds (`npm run build`)
2. Type check passes
3. Lighthouse thresholds met
4. Manual QA checklist complete

**Post-Deploy:**
1. Smoke test (homepage loads)
2. Manual spot-check (3 random pages)
3. Monitor Core Web Vitals (first 24 hours)

---

## Future Enhancements

**Phase 2:**
- Add Vitest for unit testing
- Add Playwright for E2E testing
- Set up CI/CD test automation

**Phase 3:**
- Visual regression testing (Percy, Chromatic)
- Accessibility testing automation (axe-core)
- Load testing (k6, Artillery)
- A/B testing framework integration

---

## Related Documentation
- `error-handling.md` - Error handling patterns
- `performance.md` - Performance optimization
- `quality-gates.md` - Quality gate definitions
