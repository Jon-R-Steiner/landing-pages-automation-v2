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

**Attempt 2: Add Linux binary as explicit dependency** ❌ FAILED
**Aligned with Netlify Recommendation**: "Ensure all JavaScript dependencies are correctly listed in package.json"

1. ✅ Added `lightningcss-linux-x64-gnu@1.30.1` to dependencies (not optional)
2. ✅ Ran npm install --force to update package-lock.json
3. ✅ Verified local build still works
4. ✅ Deployed (commit 203c75d)
5. ❌ Still failed - same error "Cannot find module '../lightningcss.linux-x64-gnu.node'"

**User Action**: Disabled Netlify plugins (Lighthouse & Chromium) to simplify troubleshooting

**Attempt 3: Remove --legacy-peer-deps flag** ❌ FAILED
**Hypothesis**: The `--legacy-peer-deps` npm flag may interfere with optional dependency resolution

1. ✅ Removed `NPM_FLAGS = "--legacy-peer-deps"` from netlify.toml
2. ✅ Updated scratch documentation with this attempt
3. ✅ Ran npm install (expected EBADPLATFORM error on Windows)
4. ✅ Verified local build still works (compiled successfully in 1138ms)
5. ✅ Deployed (commit 6a1f753)
6. ❌ Still failed - same error "Cannot find module '../lightningcss.linux-x64-gnu.node'"

**Deploy Details**:
- Deploy ID: 68efceca1340600008a186ba
- Commit: 6a1f753
- State: error
- Error: "Failed during stage 'building site': Build script returned non-zero exit code: 2"
- Build Time: ~28 seconds (16:41:46 - 16:42:14 UTC)

**Critical Discovery**: Attempt 4 only modified netlify.toml - **package.json/package-lock.json unchanged**. Netlify likely reused cached node_modules from Attempt 3!

**Attempt 5: Add postinstall script + cache bust** ❌ FAILED
**Strategy**: Multi-pronged approach to force Linux binary installation AND invalidate Netlify cache

1. ✅ Added postinstall script to force lightningcss-linux-x64-gnu installation
   ```json
   "postinstall": "npm install --no-save --force lightningcss-linux-x64-gnu@1.30.1 2>/dev/null || echo 'lightningcss binary install skipped (expected on Windows)'"
   ```
2. ✅ Added `_comment` field to package.json to trigger Netlify cache invalidation
3. ✅ Removed lightningcss-linux-x64-gnu from dependencies (rely on postinstall only)
4. ✅ Ran npm install - postinstall script executed successfully
5. ✅ Verified local build still works (compiled successfully in 1086ms)
6. ✅ Deployed (commit 1a9c1c8)
7. ❌ Still failed - same error "Cannot find module '../lightningcss.linux-x64-gnu.node'"

**Deploy Details**:
- Deploy ID: 68efd18ad160830008b14eee
- Commit: 1a9c1c8
- State: error
- Error: "Failed during stage 'building site': Build script returned non-zero exit code: 2"
- Build Time: ~56 seconds (16:53:30 - 16:54:26 UTC)

**User Action**: Manually triggered "Clear Cache and Deploy" in Netlify dashboard - still failed

**Attempt 6: Add platform-specific binaries to optionalDependencies** ⏳ IN PROGRESS
**Strategy**: Use optionalDependencies for reliable platform-specific binary installation (recommended by lightningcss GitHub issues)

1. ✅ Added optionalDependencies to package.json:
   ```json
   "optionalDependencies": {
     "@tailwindcss/oxide-linux-x64-gnu": "^4.1.14",
     "lightningcss-linux-x64-gnu": "1.30.1"
   }
   ```
2. ✅ Removed postinstall script (no longer needed)
3. ✅ Updated cache bust comment in package.json
4. ✅ Ran npm install - completed successfully
5. ✅ Verified local build still works (compiled successfully in 1096ms)
6. ⏳ Commit and push (will be 6th attempt)
7. ⏳ Monitor Netlify build logs
8. ⏳ Run Lighthouse on deployed page if successful
9. ⏳ Document performance metrics

**Rationale**:
- **Recommended Solution**: Multiple GitHub issues (parcel-bundler/lightningcss #567, #279, #913) recommend optionalDependencies
- npm treats optionalDependencies differently than regular dependencies
- Allowed to fail on incompatible platforms (Windows) without breaking build
- When platform matches (Linux x64 GNU), they install reliably
- Netlify uses Ubuntu (glibc), not Alpine (musl), so linux-x64-gnu variant is correct
- `@tailwindcss/oxide-linux-x64-gnu`: Tailwind v4's compiled Rust binary (also needs Linux variant)

---

## Summary: 5 Failed Deployment Attempts

| Attempt | Strategy | Commit | Result |
|---------|----------|--------|--------|
| 1 | Initial QA fixes (ESLint config) | 7b26c77 | ❌ Failed |
| 2 | Moved CSS packages to dependencies | 5e8c5e3 | ❌ Failed |
| 3 | Added Linux binary as explicit dependency | 203c75d | ❌ Failed |
| 4 | Removed --legacy-peer-deps flag | 6a1f753 | ❌ Failed |
| 5 | Postinstall script + cache bust | 1a9c1c8 | ❌ Failed |

**Consistent Error**: `Cannot find module '../lightningcss.linux-x64-gnu.node'`

**Pattern**: All configuration-based approaches have failed. This suggests a deeper incompatibility between Tailwind CSS v4 (which uses lightningcss) and Netlify's build environment.

---

## Remaining Options

### Option A: Manual "Clear Cache and Deploy" in Netlify Dashboard 🔧 QUICK TRY
**Effort**: 5 minutes
**Risk**: Low
**Process**:
1. Open Netlify dashboard → Deploys tab
2. Click "Trigger deploy" → "Clear cache and deploy site"
3. Forces complete cache invalidation (more aggressive than package.json changes)
4. May resolve if there's a stubborn cache issue

### Option B: Pre-Build Locally and Deploy `out/` Directory 🛠️ IMMEDIATE WORKAROUND
**Effort**: 15 minutes
**Risk**: Low
**Downside**: Loses continuous deployment automation
**Process**:
1. Run `npm run build` locally (Windows)
2. Configure Netlify to serve pre-built `out/` directory
3. Manually upload builds when needed
4. **Advantage**: Bypasses Netlify build process entirely

### Option C: Research Tailwind CSS v4 + Next.js 15 + Netlify Specific Configuration 📚 RESEARCH
**Effort**: 30-60 minutes
**Risk**: Medium
**Process**:
1. Search GitHub issues for tailwindcss/tailwindcss + "Netlify" + "lightningcss"
2. Search Netlify community forums for similar problems
3. Check if there's a Next.js 15 specific configuration needed
4. Look for alternative PostCSS configuration that works on Netlify

### Option D: Contact Netlify Support 🆘 ESCALATE
**Effort**: Create support ticket (30 minutes)
**Risk**: Unknown
**Wait Time**: 24-48 hours for response
**Process**:
1. Provide all 5 deployment logs
2. Explain lightningcss binary installation issue
3. Ask if there's a known issue with Tailwind v4 + Netlify
4. Request engineering team input

### Option E: Try Netlify CLI Local Build Simulation 🧪 DIAGNOSTIC
**Effort**: 20 minutes
**Risk**: Low
**Purpose**: Understand if the issue is Netlify-specific or npm/platform-specific
**Process**:
1. Install Netlify CLI: `npm install -g netlify-cli`
2. Run `netlify build` locally to simulate Netlify's build environment
3. See if error reproduces locally with Netlify's build process

### Option F: Downgrade to Tailwind CSS v3 ⚠️ LAST RESORT (USER REJECTED)
**Effort**: 2-3 hours (refactoring required)
**Risk**: High (breaks existing work)
**Note**: User explicitly said "do not do this" earlier

---

## Recommended Next Steps

**Immediate Action (5 min)**: Try Option A - Manual "Clear Cache and Deploy"

**If Option A Fails**:
- Consider Option C (Research) to see if others have solved this
- Or Option B (Pre-build workaround) to unblock PERF-001 QA testing immediately

**If Time Allows**: Option E (CLI simulation) for diagnostic insights

**User Decision Required**: Which path to pursue?

---

## Analysis After 4 Failed Attempts (For Reference)

### Pattern Recognition

All 4 deployment attempts failed with the **same error**:
```
Cannot find module '../lightningcss.linux-x64-gnu.node'
```

This suggests the issue is **NOT** related to:
- devDependencies vs dependencies placement ❌
- Explicit dependency declaration ❌
- npm flags (--legacy-peer-deps) ❌

### Likely Root Cause

**Tailwind CSS v4 (Beta) + Netlify Incompatibility**

The lightningcss package has platform-specific **optional dependencies**:
- `lightningcss-linux-x64-gnu` for Linux
- `lightningcss-win32-x64-msvc` for Windows
- Other platform variants

**Problem**: Optional dependencies may not install correctly on Netlify's build environment even when:
1. Listed in package.json dependencies
2. Added explicitly as dependencies
3. npm install runs without special flags

**Evidence**:
- Local Windows build: ✅ Works perfectly
- Netlify Linux build: ❌ Consistently fails
- Same error across all configuration attempts

### Potential Solutions

**Option 1: Use Netlify Build Plugin for PostCSS** 🔍 INVESTIGATE
- Check if Netlify has a build plugin that handles PostCSS/Tailwind v4 differently
- May provide better control over dependency installation

**Option 2: Pre-build Approach** 🛠️ WORKAROUND
- Build locally on Windows
- Upload `out/` directory directly to Netlify
- Bypass Netlify's build process entirely
- **Downside**: Loses continuous deployment automation

**Option 3: Use `postinstall` Script** 🔧 TRY NEXT
- Add postinstall script to explicitly install Linux binary
- Force npm to download platform-specific package
```json
"scripts": {
  "postinstall": "npm install --no-save lightningcss-linux-x64-gnu || true"
}
```

**Option 4: Investigate Tailwind v4 Beta Netlify Support** 📚 RESEARCH
- Search Tailwind CSS v4 beta documentation for Netlify deployment guides
- Check Tailwind CSS GitHub issues for similar problems
- Tailwind v4 is in beta - may have known deployment issues

**Option 5: Contact Netlify Support** 🆘 ESCALATE
- This may be a platform-specific issue requiring Netlify engineering input
- Provide deploy logs and configuration details

**Option 6: Downgrade to Tailwind CSS v3** ⚠️ USER REJECTED
- User explicitly said: "do not do this Fallback: Downgrade to Tailwind CSS v3"
- This would resolve the issue but requires significant refactoring
- Deferred unless all other options exhausted

### Recommended Next Step

**Try Option 3**: Add postinstall script to force Linux binary installation

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
