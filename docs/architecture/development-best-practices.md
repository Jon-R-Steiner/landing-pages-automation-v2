# Development Best Practices

## 1. Keep PRs Small

**Recommended Size:**
- 200-400 lines of code (max)
- Single logical change (one feature/bug fix)
- Easy to review in 15-30 minutes

**If PR is too large:**
- Break into multiple smaller PRs
- Create parent tracking issue
- Link related PRs together

## 2. Write Descriptive Commits

**Good Commit:**
```
feat: Add TrustBar component with dynamic icons

- Implement responsive grid layout (2 col mobile, 5 col desktop)
- Add Heroicons integration for trust signal icons
- Include ARIA labels for screen reader accessibility
- Add props interface with TypeScript

Relates to #42
```

**Bad Commit:**
```
fix stuff
```

## 3. Test Before Committing

**Pre-Commit Checklist:**
```bash
# 1. Type check
npm run type-check

# 2. Lint
npm run lint

# 3. Format
npm run format

# 4. Build (catch build errors early)
npm run build

# 5. Visual check in browser
npm run dev  # Test the changes
```

## 4. Use Feature Flags (For Large Features)

**When building major features over multiple PRs:**
```typescript
// src/lib/feature-flags.ts
export const FEATURES = {
  THREE_STAGE_FORM: process.env.NEXT_PUBLIC_ENABLE_THREE_STAGE_FORM === 'true',
  NEW_GALLERY: process.env.NEXT_PUBLIC_ENABLE_NEW_GALLERY === 'true',
}

// Usage in component
import { FEATURES } from '@/lib/feature-flags'

export default function ContactSection() {
  if (FEATURES.THREE_STAGE_FORM) {
    return <ThreeStageForm />
  }
  return <LegacyForm />
}
```

**Benefits:**
- ✅ Ship code to production without activating
- ✅ Test in production environment (behind flag)
- ✅ Easy rollback (toggle flag off)
- ✅ Gradual rollout possible

---
