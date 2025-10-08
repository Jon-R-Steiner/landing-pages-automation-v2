# Landing Pages Automation Product Requirements Document (PRD)

---

## Goals and Background Context

### Goals

#### System Capability Goals (MVP)
- **Content Quality:** Generate SEO-optimized, TCPA-compliant landing pages with 90%+ human approval rate without manual editing
- **System Reliability:** Achieve 95%+ successful builds with zero runtime deployment failures through deterministic build-time generation
- **Throughput Validation:** Successfully process multi-tier validation batches (10-20, 50-100, 250-500 pages) demonstrating production-scale capability
- **Automation Efficiency:** Enable 100-page batch generation in <15 minutes (content generation) + <5 minutes (build/deploy)

#### End-User Success Goals (Pilot Client)
- **SEO Performance:** Deployed pages achieve 90+ Lighthouse SEO scores and pass Core Web Vitals (LCP <2.5s, FID <100ms, CLS <0.1)
- **Organic Traffic Growth:** Contractor client reports 50%+ increase in organic search traffic within 90 days post-deployment
- **Ranking Success:** Pages rank top-10 for 70%+ of target location/service keyword combinations within 6 months
- **Lead Generation Impact:** Contractor reduces overall cost-per-lead by 20%+ through increased organic search conversion

#### Business Enablement Goals (Post-MVP)
- **Agency Capacity Scaling:** Reduce project delivery time from 10-15 hours to 2-3 hours (setup + oversight), enabling service to 20-30 clients annually vs. current 8-10 manual capacity
- **Market Differentiation:** Establish "AI-powered local SEO" as competitive offering with proof-of-concept case study from pilot client
- **Recurring Revenue Model:** Convert 50%+ of project clients to monthly retainer for ongoing page generation within 6 months of service launch

### Background Context

**The Problem:**

Home services contractors (bathroom remodeling, HVAC, roofing, plumbing) compete on local SEO, requiring 100-200+ location-specific and service-specific landing pages to rank for "[service] in [city]" searches across their service areas. Traditional manual copywriting ($100-200/page × 200 pages = $30,000) prices comprehensive coverage out of reach for mid-market contractors. DIY page builders produce generic content that doesn't convert. Existing AI content tools require heavy manual editing and lack deployment automation. The market needs high-quality AI content generation combined with end-to-end workflow orchestration at affordable economics.

**Who This Serves:**

*Primary Users:* Solo web developers and small agencies (1-3 person teams) currently serving local service businesses who are constrained by manual content creation bottlenecks. They can handle 8-10 client projects annually but want to scale to 20-30 without hiring.

*End Clients:* Mid-market home services contractors ($500k-$5M revenue) who invest $1-5k/month in digital marketing, understand SEO value, and need comprehensive local coverage but cannot afford traditional agency pricing.

**Why Now:**

AI content generation capabilities (Claude 3.5 Sonnet, GPT-4) crossed the quality threshold in 2024-2025 where generated content competes with human-written copy for SEO ranking and conversion. Long-context windows enable brand voice consistency across hundreds of pages. Combined with modern static site generation (Next.js) and workflow orchestration platforms (Make.com, Airtable), end-to-end automation is now technically and economically viable.

**Our Approach:**

This system automates landing page generation at scale through a multi-stage pipeline: content orchestration → AI generation → static site building → CDN deployment. By validating capability through multi-tier testing (10-20 pages → 50-100 pages → 250-500 pages), we de-risk scaling assumptions before committing to pilot client delivery. The MVP focuses exclusively on proving the core capability works reliably at production scale before building ancillary features.

### Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2025-01-07 | 1.0 | Initial PRD creation from approved Project Brief | John (PM) |

---

## Requirements

### Functional Requirements

**Content Generation:**
- **FR1:** System shall generate landing page content using AI with client brand guidelines, service types, and location data
- **FR2:** System shall store client configurations and page requests in structured database
- **FR3:** System shall track page status through workflow states (Pending → Generating → Ready for Review → Approved → Deployed)

**Quality & Approval:**
- **FR4:** System shall validate generated content for minimum word count and required compliance keywords (TCPA)
- **FR5:** System shall provide human approval interface for batch review of generated content

**Build & Deployment:**
- **FR6:** System shall fetch approved content from database and generate static HTML/CSS/JS files at build time
- **FR7:** System shall trigger builds when content batches are approved
- **FR8:** System shall deploy static files to CDN with atomic deployment and rollback capability

**SEO & Compliance:**
- **FR9:** System shall generate SEO metadata (title tags, meta descriptions) for each page
- **FR10:** System shall include TCPA-compliant language in all content containing contact information
- **FR11:** System shall structure HTML using semantic elements for search engine optimization
- **FR12:** System shall generate pages meeting WCAG 2.1 AA accessibility standards (semantic structure, alt text, proper heading hierarchy)
- **FR13:** System shall support mobile-responsive design across device breakpoints (mobile, tablet, desktop)

### Non-Functional Requirements

**Performance:**
- **NFR1:** System shall process multi-tier validation batches (10-20, 50-100, 250-500 pages) with linear or sub-linear scaling
- **NFR2:** Generated pages shall achieve Core Web Vitals targets (LCP <2.5s, FID <100ms, CLS <0.1)
- **NFR3:** Generated pages shall achieve 90+ Lighthouse scores for Performance, Accessibility, Best Practices, and SEO

**Reliability:**
- **NFR4:** System shall achieve 95%+ successful build rate
- **NFR5:** System shall achieve 90%+ content approval rate without manual editing

**Scalability:**
- **NFR6:** System shall support storage and processing of 5,000+ page records without performance degradation

**Compatibility:**
- **NFR7:** Generated pages shall render correctly on Chrome, Firefox, Safari, Edge (last 2 versions)
- **NFR8:** Generated pages shall function correctly on iOS Safari and Android Chrome (last 2 versions)
- **NFR9:** Generated pages shall be responsive across breakpoints (320px mobile, 768px tablet, 1024px+ desktop)

### User Interface Requirements (Landing Pages)

**Note:** Detailed UX/UI design will be handled by UX Expert agent. This section captures core UI requirements for generated landing pages.

**FR14:** Generated landing pages shall use responsive single-page layout with mobile-first design approach

**FR15:** Landing pages shall include the following sections in order:
- Hero section (location-specific headline, primary CTA, hero image)
- Service description section (service explanation for this location)
- Benefits/differentiators section (why choose this contractor)
- Social proof section (testimonials, certifications, affiliations)
- Contact section (form and phone number with prominent display)
- Footer (legal disclaimers for TCPA compliance, licensing info, service areas)

**FR16:** Branding elements shall be configurable per client via Airtable:
- Brand colors (primary, secondary, CTA accent colors)
- Logo image URL
- Typography preferences (optional, defaults to system font)
- Brand voice guidelines for content generation

**FR17:** Landing page templates shall use Tailwind CSS with customizable color tokens for brand color injection without layout redesign

**Design Reference:** UX Expert will provide detailed mockups and component specifications based on conversion-optimized landing page best practices for home services contractors.

**Admin Interface:** Airtable native UI will be used for client configuration, content approval workflow, and status tracking (no custom admin dashboard required for MVP).

---

## Technical Assumptions

### Repository Structure

**Monorepo**

Single repository containing all project components:
- Airtable configuration documentation and schema definitions
- Make.com scenario templates and setup guides
- Next.js application (landing page generator)
- Documentation (this PRD, architecture docs, runbooks)
- Utility scripts (test data generation, quality validation)

**Rationale:** Project components are tightly coupled (schema changes cascade through Make.com → Next.js). Monorepo ensures version synchronization and simplifies coordination. No need for polyrepo complexity with single developer.

### Service Architecture

**Build-Time Static Generation (No Runtime Services)**

All content generation and processing happens BEFORE deployment:
- **Content Generation:** Make.com orchestrates Claude API calls, stores results in Airtable
- **Site Building:** Next.js static export (`output: 'export'`) generates pure HTML/CSS/JS at build time
- **Deployment:** Static files deployed to Netlify CDN with zero runtime dependencies

**No serverless functions, no API routes, no server-side rendering, no incremental static regeneration**

**Rationale:** Lessons learned from failed previous attempt with Netlify Functions (cold starts, timeouts, debugging complexity). Build-time generation is deterministic, testable, and eliminates entire class of runtime failures.

### Testing Requirements

**Automated Validation + Manual Spot-Checking (MVP)**

**MVP Testing Approach:**
- **Automated quality checks:** Word count validation, TCPA keyword presence, HTML validation (W3C), Lighthouse scoring (sample pages)
- **Manual approval:** Human reviews batch in Airtable, spot-checks 10-20% of pages, approves or rejects batch
- **Multi-tier validation:** Phase 1 (10-20 pages), Phase 2 (50-100 pages), Phase 3 (250-500 pages) to validate scaling

**No unit tests, no integration tests, no E2E test suite for MVP**

**Rationale:** Testing focus is on content quality and system capability validation, not code coverage. Automated validation catches quality issues; manual spot-checks catch AI edge cases. Traditional test suites deferred to Phase 2.

### Additional Technical Assumptions

**Technology Stack:**

**Content & Workflow:**
- **Database:** Airtable (Team tier for API access and automations)
- **Orchestration:** Make.com (Core or Pro tier for operations quota)
- **AI Generation:** Anthropic Claude API (Claude 3.5 Sonnet model for cost/quality balance)

**Build & Deployment:**
- **Framework:** Next.js 14+ with App Router and static export (`output: 'export'`)
- **Styling:** Tailwind CSS 3+ for utility-first responsive design
- **Hosting:** Netlify (free tier initially, Pro tier if needed for build minutes/bandwidth)

**Development:**
- **Version Control:** Git + GitHub
- **Development Environment:** VS Code or Cursor with BMAD integration
- **Local Development:** Mock data fixtures (JSON) for Next.js development without Airtable dependency

**Critical Dependency Order:**

The system MUST be built in this specific order to ensure downstream dependencies are satisfied:

1. **Claude Prompt Engineering** - Defines output structure for all downstream systems
2. **Airtable Schema Design** - Must match Claude output format AND Next.js input requirements
3. **Make.com Scenario Configuration** - Transforms Claude output into Airtable records
4. **Next.js Template Development** - Consumes Airtable data structure
5. **Netlify Deployment Integration** - Final integration point

**WARNING:** Changes to Claude prompts may require cascading updates to Airtable schema, Make.com scenarios, and Next.js templates. Version control and documentation of dependencies is critical.

**Data Flow:**

```
Airtable: Page requests created (client config + location/service combinations)
  ↓
Make.com: Fetch pending pages → Call Claude API (parallel batches) → Store content in Airtable
  ↓
Airtable: Content stored with "Ready for Review" status
  ↓
Human: Manual approval in Airtable (update status to "Approved")
  ↓
Manual Trigger: Netlify build hook (webhook automation deferred to Phase 2)
  ↓
Next.js Build: Fetch approved content → Generate static pages → Export HTML/CSS/JS
  ↓
Netlify: Deploy static files to CDN
  ↓
Manual Update: Update Airtable status to "Deployed" (automation deferred to Phase 2)
```

**Form Handling:**

- **MVP Approach:** Formspree free tier (50 submissions/month per form) or Google Forms embed
- **Phase 2:** Direct CRM integration (HubSpot, Salesforce) via webhooks

**API Rate Limits & Quotas:**

- **Claude API:** 50 requests/minute (Tier 1), batch sizes adjusted accordingly
- **Airtable API:** 5 requests/second per base
- **Make.com:** Operations quota varies by tier (10,000/month Core, 40,000/month Pro)
- **Netlify:** 300 build minutes/month free tier, 25,000/month Pro tier

**Cost Assumptions:**

- **Target cost per page:** <$0.15 (AI generation + infrastructure)
- **Monthly operational costs (MVP):** ~$50-100 (Airtable Team + Make.com Core + API usage)
- **Pilot client project fee:** $2-5k validates business model and covers 6+ months operational costs

**Browser Support:**

Modern browsers only (Chrome, Firefox, Safari, Edge - last 2 versions). No IE11, no legacy polyfills.

**Performance Targets:**

- **Build time:** <15 minutes for 500 pages (Next.js static export)
- **Generation time:** <15 minutes for 100-page batch (Make.com + Claude API)
- **Page load:** Core Web Vitals targets (LCP <2.5s, FID <100ms, CLS <0.1)

---

## Epic List

_[To be completed]_

---

## Epic Details

_[To be completed]_

---

## Checklist Results Report

_[To be completed]_

---

## Next Steps

_[To be completed]_
