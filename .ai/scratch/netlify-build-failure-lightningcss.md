# Netlify Build Failure: Missing lightningcss Binary

**Date**: 2025-10-15
**Context**: Story 2.1 QA Fixes - PERF-001 Performance Measurement
**Issue**: Netlify deployment failing with exit code 2
**Status**: Root cause identified, fix in progress

---

## Problem Statement

Netlify build fails with error:
```
Failed during stage 'building site': Build script returned non-zero exit code: 2
Cannot find module '../lightningcss.linux-x64-gnu.node'
```

**Impact**: Cannot deploy HeroSection component to production, blocking performance measurement (PERF-001 QA fix).

---

## Root Cause Analysis

### Evidence Collected

1. **Local Build (Windows)**: ✅ **SUCCESS**
   ```
   npm run build
   ✓ Compiled successfully in 1173ms
   ✓ Generating static pages (5/5)
   ```
   - Uses `lightningcss.win32-x64-msvc.node` binary
   - All pages generate correctly

2. **Netlify Build (Linux)**: ❌ **FAILURE**
   - Requires `lightningcss.linux-x64-gnu.node` binary
   - Binary not installed during Netlify build process
   - Build fails with module not found error

3. **Dependency Chain**:
   ```
   @tailwindcss/postcss@4.1.14 (devDependencies)
   └── @tailwindcss/node@4.1.14
       └── lightningcss@1.30.1
           └── lightningcss-linux-x64-gnu (optional dependency)
   ```

4. **Platform-Specific Binaries**:
   - Local (Windows): `node_modules/lightningcss-win32-x64-msvc/`
   - Netlify (Linux): Needs `node_modules/lightningcss-linux-x64-gnu/` ❌ MISSING

### Why This Happens

**Critical Configuration Error**: Tailwind CSS v4 packages are in `devDependencies`

From `package.json`:
```json
{
  "devDependencies": {
    "@tailwindcss/postcss": "^4.0.0",
    "tailwindcss": "^4.0.0",
    "postcss": "^8.4.0"
  }
}
```

**Problem with devDependencies**:
1. Next.js build process (`npm run build`) requires Tailwind CSS at build time
2. Netlify may skip or optimize installation of devDependencies
3. Optional platform-specific dependencies (like `lightningcss-linux-x64-gnu`) may not install correctly
4. Result: Linux binary missing during Netlify build

### Why Local Build Works

- Windows binary (`lightningcss-win32-x64-msvc`) installs correctly locally
- `npm install` on Windows properly resolves optional dependencies for win32 platform
- Local build uses installed Windows binary successfully

---

## Solution

### Fix: Move CSS Build Dependencies to Production Dependencies

**Rationale**: These packages are required for `next build`, making them true dependencies, not dev-only packages.

### Changes Required

**package.json modifications**:
```json
{
  "dependencies": {
    "airtable": "^0.12.2",
    "next": "^15.5.0",
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "@tailwindcss/postcss": "^4.0.0",  // MOVED FROM devDependencies
    "tailwindcss": "^4.0.0",            // MOVED FROM devDependencies
    "postcss": "^8.4.0"                 // MOVED FROM devDependencies
  },
  "devDependencies": {
    "@dotenvx/dotenvx": "^1.51.0",
    "@types/node": "^20.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "dotenv": "^17.2.3",
    "eslint": "^8.0.0",
    "eslint-config-next": "^15.5.0",
    "tsx": "^4.20.6",
    "typescript": "^5.9.0"
    // Removed: @tailwindcss/postcss, tailwindcss, postcss
  }
}
```

### Implementation Steps

**Attempt 1: Move CSS packages to dependencies** ❌ FAILED
1. ✅ Moved @tailwindcss/postcss, tailwindcss, postcss to dependencies
2. ✅ Ran npm install
3. ✅ Verified local build works
4. ✅ Deployed (commit 5e8c5e3)
5. ❌ Still failed - same error "Cannot find module '../lightningcss.linux-x64-gnu.node'"

**Root Cause**: lightningcss-linux-x64-gnu is an **optional dependency** - not guaranteed to install in all environments

**Attempt 2: Add Linux binary as explicit dependency** ⏳ IN PROGRESS
**Aligned with Netlify Recommendation**: "Ensure all JavaScript dependencies are correctly listed in package.json"

1. ⏳ Add `lightningcss-linux-x64-gnu@1.30.1` to dependencies (not optional)
2. ⏳ Run npm install to update package-lock.json
3. ⏳ Verify local build still works
4. ⏳ Deploy (commit will be 3rd attempt)
5. ⏳ Monitor Netlify build logs
6. ⏳ Run Lighthouse on deployed page
7. ⏳ Document performance metrics

---

## Expected Outcome

### After Fix Applied

✅ Netlify build process will:
1. Install all production dependencies including CSS packages
2. Properly resolve `lightningcss@1.30.1` and its optional dependencies
3. Install `lightningcss-linux-x64-gnu` binary for Linux platform
4. Successfully complete `npm run build`
5. Deploy static site to CDN

### QA Fixes Completion

- ✅ **QUAL-001**: ESLint configured (already complete)
- ⏳ **PERF-001**: Performance measurement (unblocked after this fix)
- ℹ️ **TEST-001**: Automated tests (acknowledged, deferred to Phase 2)

---

## References

### Related Files
- `package.json` - Dependency configuration
- `package-lock.json` - Dependency lock file
- `docs/stories/2.1.HeroSection-Component.md` - Story with QA fixes status
- `docs/qa/gates/2.1-herosection-component.yml` - QA gate decision

### Netlify Build
- Site ID: `f9c8e0d6-235a-4aa5-b98c-9f21ee840831`
- Failed Deploy ID: `68efc7fc8db83000085f1f5c`
- Commit: `7b26c77402ed04af12775a319cb733d556311779`
- Dashboard: https://app.netlify.com/projects/landing-pages-automation-v2

### Documentation
- [Tailwind CSS v4 Beta](https://tailwindcss.com/docs/v4-beta)
- [lightningcss on npm](https://www.npmjs.com/package/lightningcss)
- [Next.js Output File Tracing](https://nextjs.org/docs/app/api-reference/config/next-config-js/output)

---

## Notes

- This issue is common when migrating to Tailwind CSS v4 (currently in beta)
- Tailwind v4 uses PostCSS architecture with native CSS tooling (lightningcss)
- Platform-specific binaries require correct npm installation context
- devDependencies vs dependencies matters for build-time tools in CI/CD

**Lesson Learned**: Packages required for production builds should be in `dependencies`, even if they're traditionally considered "dev tools" (CSS processors, compilers, etc.).
