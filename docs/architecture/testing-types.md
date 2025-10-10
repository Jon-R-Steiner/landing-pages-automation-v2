# Testing Types

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

**Rules:**
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

## 3. Formatting (Prettier)

**Auto-format on save:**
```bash
npm run format
```

**Config:**
```javascript
// .prettierrc
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5"
}
```

## 4. Lighthouse (Performance & Accessibility)

**Automated on every deploy:**
- Performance score ≥90
- Accessibility score ≥90
- Best practices score ≥90
- SEO score ≥90

**LCP target:** <2.5s (enforced)

**If thresholds not met:** Build aborts, no deploy

## 5. Manual Testing (MVP Approach)

**Pre-Deploy Checklist:**
- [ ] Visual review (3 sample pages)
- [ ] Mobile responsiveness (iPhone, Android)
- [ ] Form submission works (test lead in Salesforce)
- [ ] Phone number displays (CallRail swap working)
- [ ] GTM + GA4 tracking fires
- [ ] Accessibility: Keyboard navigation, screen reader
- [ ] Content quality: No AI hallucinations, TCPA compliance

## 6. E2E Testing (Playwright - Future)

**When implemented (Phase 2):**
```typescript
// tests/e2e/form-submission.spec.ts
import { test, expect } from '@playwright/test'

test('three-stage form submission', async ({ page }) => {
  await page.goto('/bathroom-remodeling/charlotte')

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
