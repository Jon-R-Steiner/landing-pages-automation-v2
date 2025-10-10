# Quality Gates

## Pre-Commit Checks

**Git hooks (husky + lint-staged):**
```json
// package.json
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md}": ["prettier --write"]
  }
}
```

**Runs automatically on `git commit`:**
1. Lint staged files
2. Format staged files
3. If errors: Abort commit

## Pre-Deploy Checks

**Netlify Build:**
1. Type checking (`tsc --noEmit`)
2. Linting (`eslint`)
3. Build (`next build`)
4. Lighthouse quality gate
5. If all pass: Deploy to CDN

## Manual QA (MVP)

**Before merging PR:**
- [ ] Deploy preview link works
- [ ] Visual review (Desktop + Mobile)
- [ ] Lighthouse report reviewed
- [ ] No console errors in browser
- [ ] Content quality spot-checked
