# ARCHITECT Handoff Document
## Landing Pages Automation Project

**Date:** 2025-01-08
**Project:** Landing Pages Automation v2
**PM:** John (Jon Steiner)
**Status:** Ready for ARCHITECT Phase

---

## ⚠️ IMPORTANT UPDATE - PRD v2.1 CHANGES

**This document was originally written for PRD v2.0 (SEO/organic focus).**

**PRD has been updated to v2.1 (Google Ads Performance Max paid traffic focus).**

**Key Changes You Need to Know:**
- **ADR Count:** 30-35 total (20 original from this doc + **15 NEW** from paid traffic requirements)
- **Research Items:** ~75 total (~60 original + 15 new)
- **Timeline:** 6-9 days (unchanged, but more dense workload)

**Critical New Requirements:**
- ✅ **GTM (Google Tag Manager)** - MANDATORY for conversion tracking
- ✅ **CallRail** - MANDATORY for call tracking (no alternatives, research integration only)
- ⚠️ **3-Stage Progressive Forms** - Replace simple forms (backend & library: ARCHITECT TO RECOMMEND)
- ⚠️ **Quality Score Performance Priority** - LCP <2.5s is CRITICAL (affects Google Ads CPC costs)
- ⚠️ **Mobile-First** - 60%+ of traffic is mobile (not minority)
- ⚠️ **Conversion Components** - Trust Bar (sticky), Before/After Gallery, FAQ Accordion

**MUST READ Documents:**
1. **`Epic-0-Phase-0.1-ADR-Task-List.md`** - Complete 35-ADR breakdown with detailed instructions
2. **`SCP-001-Paid-Traffic-Alignment.md`** - Full change analysis and rationale
3. **`prd.md` (v2.1)** - Updated PRD with 15 new requirements (FR14-FR27, NFR10-NFR12)
4. **`front-end-spec.md`** - Source of truth for UI/UX specifications

**Bottom Line:** Everything in this document is still valid. You just have 15 additional ADRs to create for paid traffic conversion tracking, 3-stage forms, and performance optimization. See Epic-0-Phase-0.1-ADR-Task-List.md for complete details.

---

## Executive Summary

You are receiving this project to set up the technical foundation and conduct comprehensive architecture research before development begins. This project uses a **Big Bang Research Strategy** - all architectural decisions must be made upfront with documented ADRs before any development starts.

**Why Big Bang Approach:** Lessons learned from previous deployment failure (Next.js + Netlify issues). We need comprehensive planning upfront to avoid building on broken assumptions.

**Your Timeline:** 6-9 days total
- Infrastructure setup: 0.5-1 day
- Architecture research: 5-8 days

---

## Critical Context: Previous Deployment Failure

**What Happened:** Previous attempt with Next.js 15 + Netlify failed catastrophically due to:
- Monorepo path resolution issues with Netlify
- Serverless function runtime failures (500 errors on all routes)
- Lack of upfront research and reference implementations
- Building complexity before proving deployment works

**Lessons Learned:**
- ✅ Deploy "Hello World" FIRST before adding any features
- ✅ Research latest docs and find working examples before implementing
- ✅ Test deployment baseline before building on top
- ✅ Use build-time static generation (NO serverless functions)
- ✅ Incremental complexity with deployment checkpoints

**See:** `docs/post-mortem.md` for full details (if available)

---

## Your Responsibilities

### Phase 0: Pre-Epic Infrastructure Setup (0.5-1 day)

**You must complete BEFORE starting architecture research:**

#### Task 1: Create Fresh GitHub Repository
- **Create NEW repository** (clean slate, no BMAD folders from current repo)
- **Repository name:** Propose name (e.g., `landing-pages-automation` or `local-seo-page-generator`)
- **Visibility:** Private
- **Initialize with:** README or basic scaffold
- **Collaborators:**
  - Jon Steiner (Admin access)
  - Developer TBD (Write access when assigned)
- **Document:** Repository URL in your handoff doc

**Important:** This must be a FRESH repository without any legacy code or BMAD framework files.

#### Task 2: Create Netlify Site
- **Account:** Use Jon's Netlify account
  - Jon will provide credentials OR add you as team member
- **Create:** New Netlify site for this project
- **Connect:** Link to GitHub repository from Task 1
- **Initial Build Settings (Placeholders):**
  - Build command: `npm run build`
  - Publish directory: `out` (Next.js static export default)
  - Base directory: TBD by you (depends on monorepo decision)
- **Document These Critical IDs:**
  - Netlify Project ID: `_____________`
  - Netlify site URL: `_____________`
  - Build hook URL: `_____________ (SECURE)`

#### Task 3: Verify GitHub ↔ Netlify Connection
- **Push test commit** to GitHub (README or basic HTML)
- **Trigger deployment** (auto or manual)
- **Verify build succeeds** (even if just static HTML)
- **Verify site accessible** via Netlify URL
- **Test for errors:**
  - Build failures
  - 500 errors on routes
  - Path resolution issues
  - Any console errors

**GATE:** ✅ Test deployment successful → Proceed to Epic 0.1 Research

#### Task 4: Developer Handoff Documentation
Create document containing:
- GitHub repo URL and clone instructions
- Netlify Project ID, site URL, build hook URL
- Environment variables (if any at this stage)
- Access credentials (how to access, where stored)
- Branch strategy and PR process

---

### Phase 1: Epic 0.1 Architecture Research (5-8 days)

**Approach:** Big Bang Research - All ~60 architectural decisions upfront

**Deliverable:** Comprehensive ADRs (Architecture Decision Records) for ALL technical choices

---

## Research Areas & Questions (~60 Items)

### 1. Repository & Project Structure

**Questions to Answer:**
- ⚠️ **Monorepo vs Flat Structure:** Test BOTH with Netlify, document which works
  - Previous attempt: Monorepo path resolution failed
  - Contingency: Be ready to flatten if monorepo breaks
  - Test deployment with both structures before deciding
- ⚠️ **Directory organization:** Standard Next.js structure or custom?
- ⚠️ **Package manager:** npm, yarn, or pnpm? (consider Netlify compatibility)
- ⚠️ **Node.js version:** Specify for Netlify builds

**ADR Required:** Repository structure with rationale, risks, rollback plan

---

### 2. Next.js 15 Configuration (CRITICAL - 10+ items)

**Core Challenge:** Next.js 15 + App Router + Static Export + Netlify integration

**Questions to Answer:**
- ⚠️ **Static Export Configuration:**
  - How to configure `output: 'export'` in next.config.js
  - What limitations does static export impose?
  - How to verify export works correctly?

- ⚠️ **App Router Data Fetching:**
  - `getStaticProps` doesn't exist in App Router - what's the replacement?
  - How to fetch data at BUILD TIME (not runtime)?
  - Server Component data fetching patterns for static export
  - Can we use `fetch()` in Server Components for build-time data?

- ⚠️ **Dynamic Routes:**
  - How to use `generateStaticParams()` for `/[service]/[location]` routes
  - How to generate all possible paths at build time
  - Error handling for missing paths

- ⚠️ **Server vs Client Components:**
  - What needs `'use client'` directive?
  - Where are the boundaries?
  - How does this affect static export?

- ⚠️ **Metadata API:**
  - How to generate dynamic SEO metadata (title, description) per page
  - Static export compatibility with Metadata API

- ⚠️ **Image Optimization:**
  - Does Next.js Image component work with static export?
  - If not, what's the alternative? (static images, third-party optimizer?)

**Research Method:**
1. Read official Next.js 15 documentation (NOT Next.js 14)
2. Search for "Next.js 15 static export Netlify" issues
3. Find 3+ GitHub repos using Next.js 15 + static export + Netlify
4. Clone and deploy at least 1 to verify understanding
5. Document configuration patterns that work

**ADR Required:** Next.js 15 configuration with working examples

---

### 3. Netlify Deployment Configuration (CRITICAL)

**Questions to Answer:**
- ⚠️ **netlify.toml Configuration:**
  - Build command (standard or custom?)
  - Publish directory (confirm `out/` for static export)
  - Base directory (if monorepo)
  - Environment variables configuration
  - Node version specification

- ⚠️ **Plugin Requirements:**
  - Do we need `@netlify/plugin-nextjs`?
  - Native runtime vs plugin - which for Next.js 15 + static export?
  - Previous attempt: Plugin caused issues with monorepo

- ⚠️ **Build Optimization:**
  - Caching strategies
  - Build time targets (<15 min for 500 pages)
  - Incremental builds (possible with static export?)

- ⚠️ **Environment Variables:**
  - How to configure in Netlify UI
  - Scope settings (build vs functions - we have NO functions)
  - Security best practices

**Research Method:**
1. Read Netlify Next.js 15 deployment docs
2. Find working Next.js 15 + Netlify examples
3. Compare their netlify.toml configurations
4. Test different configurations with your test deployment
5. Document what works and what fails

**ADR Required:** Netlify configuration with tested netlify.toml template

---

### 4. Airtable Integration (Build-Time)

**Core Challenge:** Fetch data from Airtable during build, not runtime

**Questions to Answer:**
- ⚠️ **API Client Library:**
  - Official Airtable.js vs alternatives?
  - Compatible with Next.js build-time fetching?

- ⚠️ **Build-Time Data Fetching:**
  - Where in Next.js App Router to fetch Airtable data?
  - Server Component data fetching pattern
  - Caching strategy (don't hit Airtable API on every build for unchanged data)

- ⚠️ **Rate Limit Handling:**
  - Airtable API: 5 requests/second
  - How to handle when generating 500 pages?
  - Batching or sequential fetching?

- ⚠️ **Error Handling:**
  - What if Airtable data is malformed?
  - What if API call fails during build?
  - Fallback strategies

**ADR Required:** Airtable integration pattern with code examples

---

### 5. Styling & Assets

**Questions to Answer:**
- ⚠️ **Tailwind CSS Configuration:**
  - Standard setup or custom?
  - How to inject brand colors dynamically (from Airtable client data)?
  - Design token system for customization

- ⚠️ **Font Loading:**
  - Local fonts vs Google Fonts?
  - Performance implications
  - Static export compatibility

- ⚠️ **CSS Optimization:**
  - Purging unused styles
  - Minification strategy
  - Critical CSS extraction

- ⚠️ **Image Hosting:**
  - Images from Airtable URLs (client logos, hero images)
  - Or bundle with Next.js?
  - Optimization approach

**ADR Required:** Styling and asset strategy

---

### 6. Form Handling (CRITICAL DECISION)

**Core Requirement:** Landing pages need contact forms

**Options to Evaluate:**
1. **Formspree:** Free tier (50 submissions/month per form)
2. **Netlify Forms:** Native integration, but has costs
3. **Other:** Alternatives?

**Questions to Answer:**
- ⚠️ **Solution Selection:**
  - Which form solution for MVP?
  - Cost implications
  - Setup complexity
  - TCPA compliance considerations (consent checkboxes)

- ⚠️ **Client-Side Validation:**
  - JavaScript validation approach
  - Accessibility requirements

- ⚠️ **Spam Protection:**
  - reCAPTCHA vs honeypot vs other?
  - Static export compatibility

**ADR Required:** Form handling solution with implementation plan

---

### 7. Routing & URL Structure

**Questions to Answer:**
- ⚠️ **Dynamic Route Pattern:**
  - `/[service]/[location]` vs `/[slug]` vs other?
  - SEO implications

- ⚠️ **Static Path Generation:**
  - How to generate all service/location combinations?
  - How many paths is too many? (we expect 100-500)

- ⚠️ **404 Handling:**
  - Custom 404 page for static export?
  - What happens for non-existent paths?

- ⚠️ **Sitemap Generation:**
  - Static vs dynamic?
  - Build-time generation?

- ⚠️ **Canonical URLs:**
  - How to set per page?
  - Absolute vs relative?

**ADR Required:** URL structure and routing strategy

---

### 8. Accessibility & Performance

**Questions to Answer:**
- ⚠️ **Accessibility Testing:**
  - What tools? (axe-core, Lighthouse CI, other?)
  - Integration with build process or manual?
  - WCAG 2.1 AA compliance validation approach

- ⚠️ **Performance Monitoring:**
  - Lighthouse scoring automation (CLI vs CI service)
  - Core Web Vitals measurement strategy
  - Bundle size tracking

- ⚠️ **HTML Validation:**
  - W3C validator integration?
  - Automated or manual checks?

- ⚠️ **Critical CSS:**
  - Extraction and inlining approach?
  - Tools or manual?

- ⚠️ **JavaScript Bundle Optimization:**
  - Code splitting strategy
  - Tree shaking verification
  - Target bundle size (<200KB per page)

**ADR Required:** Quality assurance and performance strategy

---

### 9. Testing & Validation Tools

**Questions to Answer:**
- ⚠️ **Automated Validation Tools:**
  - TCPA keyword checker (search for required compliance terms)
  - Word count validator
  - Lighthouse CLI setup
  - HTML validator integration

- ⚠️ **Test Data Generation:**
  - How to generate realistic test data?
  - Scripts or manual?

- ⚠️ **Performance Benchmarking:**
  - How to measure build time scaling?
  - How to track resource usage?

**ADR Required:** Testing and validation tooling

---

### 10. Build System & Deployment Pipeline

**Questions to Answer:**
- ⚠️ **Build Triggers:**
  - Manual for MVP (webhook URL)
  - Future automation (Airtable → Netlify)

- ⚠️ **Build Monitoring:**
  - Success/failure notifications
  - Log access and review

- ⚠️ **Rollback Procedures:**
  - How to revert failed deployments?
  - Documentation requirements

- ⚠️ **Environment-Specific Configs:**
  - Dev vs production builds
  - Configuration management

**ADR Required:** Build and deployment pipeline design

---

## Reference Implementation Study (MANDATORY)

**You MUST:**

1. **Find 3+ Working Examples:**
   - Search GitHub for: "Next.js 15 static export Netlify"
   - Filter for repos with recent commits (2024-2025)
   - Verify they actually use static export (`output: 'export'`)

2. **Clone and Deploy at Least 1:**
   - Clone the repository
   - Run `npm install` and `npm run build` locally
   - Deploy to your test Netlify site
   - Verify deployment succeeds
   - Study their configuration files:
     - `next.config.js`
     - `netlify.toml`
     - `tailwind.config.js`
     - Package.json dependencies

3. **Document Patterns:**
   - What configurations do successful projects use?
   - What common pitfalls do they avoid?
   - What dependencies are required?

4. **Compare and Contrast:**
   - How do the 3+ examples differ?
   - Which approach is most appropriate for our use case?
   - What risks do we need to mitigate?

**Deliverable:** Reference implementation analysis document with URLs and key findings

---

## Deliverables from Architecture Research

### 1. Comprehensive ADR Document

**Format:**
```markdown
# ADR-001: Repository Structure

## Status
Accepted

## Context
[Why this decision is needed, what problem it solves]

## Decision
[What we decided to do]
- Monorepo vs Flat: [Decision with rationale]
- Directory structure: [Specific organization]

## Consequences
**Positive:**
- [Benefits of this approach]

**Negative:**
- [Drawbacks or risks]

**Risks:**
- [What could go wrong]

**Mitigation:**
- [How we'll handle risks]

## Alternatives Considered
- Alternative 1: [Why rejected]
- Alternative 2: [Why rejected]

## Implementation Notes
- [Specific configuration details]
- [Code examples if applicable]

## Rollback Plan
- [How to undo this decision if it fails]
```

**Create ADRs for ALL Research Areas Above**

**ADR Count:** 30-35 total
- 20 ADRs from research areas in this document
- 15 NEW ADRs from paid traffic requirements (see Epic-0-Phase-0.1-ADR-Task-List.md for Groups B-E)

---

### 2. Configuration File Templates

**Provide working templates for:**

**next.config.js:**
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // ... your researched configuration
}

module.exports = nextConfig
```

**netlify.toml:**
```toml
[build]
  command = "npm run build"
  publish = "out"
  # ... your researched configuration
```

**tailwind.config.js:**
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  // ... your researched configuration including brand token strategy
}
```

**package.json dependencies:**
- List all required dependencies with versions
- Justify any non-standard dependencies

---

### 3. Data Flow Diagrams

Create visual diagrams showing:
- Build-time data flow (Airtable → Next.js → Static HTML)
- Deployment workflow (Git push → Netlify build → CDN)
- Content generation flow (Airtable → Make.com → Claude API → Airtable → Next.js)

---

### 4. Risk Assessment Document

**Format:**
| Risk | Probability | Impact | Mitigation | Rollback Plan |
|------|-------------|--------|------------|---------------|
| Monorepo path issues | Medium | High | Test both structures, have flat fallback | Flatten structure |
| Next.js 15 compatibility | Medium | Critical | Reference implementations, test early | Downgrade to 14 |
| Build time >15 min | Low | Medium | Caching, optimization | Accept slower builds for MVP |

---

### 5. Developer Handoff Document

**Must Include:**
- All ADRs summarized
- Quick start guide (clone → install → run locally → deploy)
- Configuration file locations and purposes
- Environment variables required
- Common troubleshooting issues
- Research-First workflow guide (6-step process from PRD)
- Links to reference implementations
- Your contact info for questions during Epic 0-4

---

## What Jon (PM) Will Provide You

**Documents:**
1. **PRD (Product Requirements Document):** `docs/prd.md`
   - Full requirements, epic specifications, success criteria
   - All functional and non-functional requirements
   - Technical assumptions and constraints

2. **Project Brief:** `docs/project-brief.md` (if exists)
   - Business context and goals
   - Target users and market

3. **Post-Mortem:** Previous deployment failure lessons
   - What went wrong with Next.js + Netlify
   - Why we're using build-time static generation
   - Why Research-First approach is mandatory

**Access:**
- **Netlify:** Credentials or team membership
- **GitHub:** Organization access (if applicable)

**Preferences:**
- Repository naming preferences (or let you propose)
- Any organizational standards

---

## Success Criteria for Your Phase

### Infrastructure Setup (Task 1-4):
- ✅ Fresh GitHub repository created (no BMAD folders)
- ✅ Netlify site created and connected to GitHub
- ✅ Test deployment successful (even if just README)
- ✅ All IDs documented (Project ID, site URL, build hook)
- ✅ Developer handoff doc created

### Architecture Research (Epic 0.1):
- ✅ All ~75 research items addressed (~60 original + 15 new from paid traffic requirements)
- ✅ 30-35 ADRs created with rationale (20 from this doc + 15 from Epic-0-Phase-0.1-ADR-Task-List.md)
- ✅ At least 1 reference implementation deployed and studied
- ✅ Configuration templates created and tested
- ✅ Risk assessment completed
- ✅ Technology recommendations presented for form backend & library (user selection required)
- ✅ PM (Jon) reviews and approves all ADRs

**GATE:** ✅ PM approval of ADRs → Development can begin

---

## Timeline & Milestones

**Day 1 (0.5-1 day):**
- Create GitHub repository
- Create Netlify site
- Connect and verify deployment
- Document credentials

**Days 2-3 (2 days):**
- Next.js 15 + Netlify research (most critical)
- Find and deploy reference implementations
- ADRs for core architecture

**Days 4-5 (2 days):**
- Airtable integration research
- Styling and form handling research
- Additional ADRs

**Days 6-7 (2 days):**
- Performance and quality tooling research
- Risk assessment
- Configuration templates

**Day 8 (1 day):**
- Developer handoff document
- ADR review preparation
- Final documentation cleanup

**Day 9 (0.5 day):**
- Present ADRs to PM for approval
- Address any questions or concerns

**Total: 6-9 days → Hand off to Development Team**

---

## Communication & Support

### With PM (Jon):
- **Check-ins:** Optional daily standups during research
- **Questions:** Escalate blockers or unclear requirements immediately
- **ADR Review:** Schedule when research complete (Day 8-9)
- **Approval Required:** Cannot hand off to development without PM approval

### With Developer (Future):
- **Handoff Session:** Present all ADRs and configuration
- **Office Hours:** Be available during Epic 0-4 for architecture questions
- **Escalation:** If development discovers architectural issues, you'll be consulted

---

## Critical Warnings

🚨 **DO NOT:**
- Assume Next.js 14 patterns work in Next.js 15
- Skip reference implementation study
- Use serverless functions (build-time static ONLY)
- Build features before proving deployment works
- Make architectural decisions without ADRs

✅ **DO:**
- Test everything with actual deployments
- Document ALL decisions with rationale
- Find and study working examples
- Plan for rollback scenarios
- Follow Research-First workflow

---

## Key Principles (from PRD)

1. **Evidence > Assumptions:** Test, don't guess
2. **Simplicity First:** Prove simplest approach works before adding complexity
3. **Deploy Early:** "Hello World" on Day 1, features later
4. **Incremental Validation:** Small steps with verification gates
5. **Documentation Required:** All decisions must be documented

---

## Questions or Concerns?

**Contact PM (Jon):**
- Clarify requirements
- Discuss architectural trade-offs
- Request additional context
- Propose alternative approaches

**Don't hesitate to:**
- Challenge assumptions in the PRD
- Propose better solutions
- Identify risks early
- Ask for more time if research uncovers complexity

---

## Next Steps After Your Phase

Once you complete and PM approves:

1. **Hand off to Development Team:**
   - Your ADRs become their blueprint
   - Your configuration templates become starting point
   - Your reference implementations guide their work

2. **Epic 0 Phase 0.2-0.3:** Development team executes based on your research
   - Deploy "Hello World" using your configuration
   - Build project scaffolding per your structure

3. **Epic 1-6:** Development continues with architecture locked in
   - If issues arise, they escalate to you
   - ADRs may need updates based on discoveries

---

## Appendix: Research Resources

### Official Documentation
- Next.js 15: https://nextjs.org/docs
- Netlify Next.js: https://docs.netlify.com/frameworks/next-js/
- Airtable API: https://airtable.com/developers/web/api/introduction
- Tailwind CSS: https://tailwindcss.com/docs

### Search Queries to Start With
- "Next.js 15 static export"
- "Next.js 15 App Router static generation"
- "Next.js 15 Netlify deployment"
- "generateStaticParams Next.js 15"
- "Next.js 15 build time data fetching"

### GitHub Search Examples
- `next.js 15 output export netlify`
- `nextjs app router static export`
- Filter by: Updated recently (2024-2025)

### Community Resources
- Next.js Discord
- Netlify Community Forums
- Stack Overflow (filter by date: last 6 months)

---

**Good luck with the architecture research! This foundation is critical to project success.**

**Questions? Contact PM (Jon) immediately.**

---

**Document Version:** 1.0
**Created:** 2025-01-08
**Author:** John (PM)
**Status:** Ready for ARCHITECT
