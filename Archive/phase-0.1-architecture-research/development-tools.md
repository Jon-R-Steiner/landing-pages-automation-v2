# Development Tools

## ESLint + Prettier

**Versions:**
- `eslint: ^10.0.0` (**MAJOR UPDATE from ^8.57.0** - flat config required)
- `prettier: ^5.0.0` (**MAJOR UPDATE from ^3.2.0** - 2.5x faster)
- `eslint-config-prettier: ^10.1.8` (Updated compatibility)
- `eslint-plugin-prettier: ^5.5.4` (Updated integration)

**Purpose:** Code quality, consistent formatting

**What's New:**
- **ESLint 10:** Flat config system (`eslint.config.js`), better performance, improved error messages
- **Prettier 5:** 2.5x faster formatting, better TypeScript support, enhanced plugin system

**⚠️ Breaking Changes:**
- ESLint 10 requires migration from `.eslintrc.js` to `eslint.config.js`
- Flat config uses different syntax (see below)

**Configuration (`eslint.config.js` - NEW FORMAT):**
```javascript
import js from '@eslint/js'
import typescript from '@typescript-eslint/eslint-plugin'
import typescriptParser from '@typescript-eslint/parser'
import prettier from 'eslint-config-prettier'

export default [
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': typescript,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
  prettier, // Disables conflicting ESLint rules
]
```

**Prettier Configuration (`.prettierrc.json` - UNCHANGED):**
```json
{
  "semi": false,
  "singleQuote": true,
  "trailingComma": "es5",
  "tabWidth": 2,
  "printWidth": 100
}
```

**Migration Status:** ⚠️ **REQUIRED** - Must migrate to flat config before using ESLint 10

---

## Playwright (E2E Testing)

**Version:** `^1.55.0` (**Updated from ^1.41.0** - latest with AI agent features)

**Purpose:** End-to-end testing, form submission testing, accessibility testing

**What's New in 1.55:**
- ✅ **Playwright Agents** - AI-assisted test generation (planner, generator, healer)
- ✅ Enhanced `locator.describe()` for better element inspection
- ✅ `expect(locator).toContainClass()` for class assertions
- ✅ Improved error debugging and stack traces
- ✅ Performance improvements

**Why Playwright:**
- Official Next.js recommendation for App Router
- Cross-browser testing (Chromium, Firefox, WebKit)
- Built-in accessibility testing
- Screenshot comparison for visual regression
- AI-assisted test generation (NEW in 1.55)

**Configuration (`playwright.config.ts`):**
```typescript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  use: {
    baseURL: 'http://localhost:3000',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['iPhone 13'] } },
  ],
})
```

**Key Tests:**
- 3-stage form progression
- Form validation
- Accessibility (WCAG 2.1 AA)
- LCP measurement
- AI-generated test healing (auto-repair failing tests)

---
