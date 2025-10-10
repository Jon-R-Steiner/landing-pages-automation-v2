# Key Architectural Decisions (from Elicitation Analysis)

## Critical Risks Mitigated:

1. **Next.js 15 Static Export Compatibility**
   - **Risk:** Next.js 15 is new, limited real-world examples with static export
   - **Mitigation:** Epic 0.1 includes reference implementation deployment + testing
   - **Fallback:** Downgrade to Next.js 14 if issues found (requires ADR)

2. **Performance Target: LCP <2.5s**
   - **Risk:** GTM + CallRail + GA4 scripts (~120-190KB) threaten LCP target
   - **Mitigation:** Defer ALL third-party scripts until after LCP, inline critical CSS per-page, lazy load below-fold content

3. **Airtable API Rate Limits**
   - **Risk:** 5 req/sec limit could cause build failures
   - **Mitigation:** Export Airtable data to JSON file, commit to repo, build reads from local file (no API calls during build)

4. **CallRail Dynamic Number Insertion**
   - **Risk:** Static sites have no runtime server to coordinate dynamic numbers
   - **Mitigation:** Research 3 approaches in ADR-023, test extensively in Epic 0.2

## Best Practices Applied:

1. **Flat Repository Structure** (not monorepo)
   - Lesson from previous failure
   - Single Next.js 15 App Router project
   - No Nx, Turborepo, or Lerna complexity

2. **Component Caching Strategy**
   - Cache AI-generated content sections (Trust Bar, Gallery, FAQ)
   - 3-5x faster builds
   - Deterministic builds (same input = same output)

3. **Build-Time Optimization**
   - Export Airtable data to JSON (10x faster builds, no API dependency)
   - Per-page critical CSS extraction
   - Lazy load all below-fold content
   - Defer third-party scripts until after LCP

4. **Conversion Tracking Integration**
   - GTM for tag management
   - CallRail for phone tracking
   - GA4 for analytics and funnel tracking
   - All scripts deferred to preserve LCP <2.5s

## Optimization Priorities:

1. **Performance First:** LCP <2.5s is non-negotiable (Google Ads Quality Score)
2. **Build Speed:** Component caching + JSON export = 3-10x faster builds
3. **Maintainability:** Flat structure, clear separation of concerns
4. **Scalability:** Support 500+ pages per client, multiple clients
5. **Cost Efficiency:** Static hosting on Netlify (no serverless function costs)
