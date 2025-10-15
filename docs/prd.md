# Landing Pages Automation Product Requirements Document (PRD)

---

## Goals and Background Context

### Goals

#### System Capability Goals (MVP)
- **Content Quality:** Generate conversion-optimized, TCPA-compliant landing pages with message match to ad copy, achieving 90%+ human approval rate without manual editing
- **System Reliability:** Achieve 95%+ successful builds with zero runtime deployment failures through deterministic build-time generation
- **Throughput Validation:** Successfully process multi-tier validation batches (10-20, 50-100, 250-500 pages) demonstrating production-scale capability
- **Automation Efficiency:** Enable 100-page batch generation in <15 minutes (content generation) + <5 minutes (build/deploy)

#### End-User Success Goals (Pilot Client)
- **Conversion Performance:** Achieve 5-10% conversion rate (paid visitors → leads) within 30 days of deployment
- **Quality Score:** Maintain Google Ads Quality Score of 7-10 across landing pages, reducing cost-per-click (CPC)
- **Cost Per Lead:** Reduce CPL to <$50 through optimized landing page conversion performance
- **Page Performance:** Pass Core Web Vitals (LCP <2.5s, FID <100ms, CLS <0.1) - CRITICAL for Quality Score and ad costs
- **Message Match:** Achieve <50% bounce rate indicating strong ad-to-page headline alignment

#### Business Enablement Goals (Post-MVP)
- **Agency Capacity Scaling:** Reduce project delivery time from 10-15 hours to 2-3 hours (setup + oversight), enabling service to 20-30 clients annually vs. current 8-10 manual capacity
- **Market Differentiation:** Establish "AI-powered paid traffic optimization" as competitive offering with proof-of-concept case study from pilot client
- **Recurring Revenue Model:** Convert 50%+ of project clients to monthly retainer for ongoing page generation and optimization within 6 months of service launch

### Background Context

**The Problem:**

Home services contractors (bathroom remodeling, HVAC, roofing, plumbing) compete on paid search (Google Ads Performance Max), requiring 100-200+ location-specific and service-specific landing pages optimized for converting paid traffic from "[service] in [city]" ad campaigns. These pages must achieve high Quality Scores (7-10) to reduce cost-per-click and maximize ROI, while maintaining 5-10% conversion rates to generate leads profitably. Traditional manual copywriting ($100-200/page × 200 pages = $30,000) prices comprehensive coverage out of reach for mid-market contractors. DIY page builders produce generic content that doesn't convert. Existing AI content tools require heavy manual editing and lack deployment automation. The market needs high-quality AI content generation combined with end-to-end workflow orchestration at affordable economics.

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
| 2025-01-08 | 2.0 | Added Epic List, Epic Details (0-6), Development Workflow Standards, and ARCHITECT handoff plan. Incorporated lessons from previous deployment post-mortem. Finalized all sections for ARCHITECT handoff. | John (PM) |
| 2025-01-08 | 2.1 | **MAJOR UPDATE:** Aligned PRD with paid traffic requirements per front-end-spec.md. Changed from SEO/organic focus to Google Ads Performance Max paid traffic optimization. Updated Goals (conversion rate, Quality Score, CPL vs rankings/traffic), added 15 new requirements (FR14-FR27, NFR10-NFR12) for message match, conversion tracking, 3-stage forms, GTM/CallRail integration. Updated UI section structure (10-section vertical scroll), data flow (ad copy inputs), form handling (3-stage progressive), and tech stack (tracking technologies). See SCP-001 for complete analysis. Timeline updated: 18-28 days (was 14-22 days). | John (PM) |
| 2025-10-15 | 3.0 | **EPIC REORGANIZATION:** Declared Phase 0 COMPLETE at Phase 0.4. Reorganized Epic structure to align with BMad methodology: Epic 2 (Component Development - NEW), Epic 3 (Scale Testing - NEW), Epic 4 (Form Submission - RENAMED from Epic 2), Epic 5-8 (RENUMBERED). Reason: Phase 0 had grown beyond foundation work to include feature development. New structure enables proper story creation and tracking. No functional changes, organizational clarity only. | Sarah (PO) |

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

**Message Match & Conversion:**
- **FR14:** System shall generate landing page headlines aligned with ad headline input to ensure message match (critical for Quality Score and bounce rate reduction)
- **FR15:** System shall implement phone-primary conversion design with large, clickable phone numbers (tap-to-call) as primary CTA above fold
- **FR16:** System shall implement single-page, no-navigation layout to eliminate exit paths and maintain focus on conversion goal
- **FR17:** System shall generate 3-stage progressive disclosure forms (Stage 1: Name/Phone, Stage 2: Service/Location, Stage 3: Details/Submit) with visual progress indicators

**Tracking & Analytics:**
- **FR18:** System shall integrate Google Tag Manager (GTM) for conversion tracking and third-party script management
- **FR19:** System shall implement dataLayer events for conversion tracking (form_start, form_step_2, form_step_3, form_submit, phone_click, scroll_depth)
- **FR20:** System shall support CallRail integration for dynamic phone number insertion and call tracking per page/campaign
- **FR21:** System shall track conversion events and send to Google Ads via GTM (form submissions, phone clicks) for campaign optimization

**Quality Score Optimization:**
- **FR22:** System shall optimize pages for Google Ads Quality Score factors (mobile usability, page speed <2.5s LCP, content relevance to target keyword, message match between ad and landing page)

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

**Performance & Conversion:**
- **NFR10:** System shall achieve Google Ads Quality Score proxy metrics (mobile usability score >90, page speed <2.5s LCP, content relevance to target keyword >80% match)
- **NFR11:** System shall support 60%+ mobile traffic with optimized mobile conversion paths (thumb-friendly tap targets, minimal form friction, fast load times on 3G/4G)
- **NFR12:** System shall achieve 5-10% conversion rate target in pilot client validation (measured by leads ÷ paid visitors)

### User Interface Requirements (Landing Pages)

**Note:** Detailed UX/UI design is defined in `front-end-spec.md` (source of truth). This section captures core UI requirements for generated landing pages.

**FR23:** Generated landing pages shall use responsive single-page layout with mobile-first design approach

**FR24:** Landing pages shall follow this conversion-optimized vertical scroll structure (single-page, no navigation menu):
1. **Hero Section** - Message-matched headline, phone CTA (primary), trust signals (license, rating, years), hero image
2. **Trust Bar** - Sticky on scroll showing license number, review rating, phone number (persistent conversion path)
3. **Service Description** - Brief explanation of services (Quality Score relevance - "what do you do?")
4. **Before/After Gallery** - 6-8 visual proof examples with location-specific captions (builds trust through results)
5. **Why Choose Us / Benefits** - 3-5 key differentiators (licensed, fixed-price quotes, years in business, guarantees)
6. **Social Proof / Testimonials** - 5 customer testimonials with ratings, locations, photos/avatars
7. **Process Overview** - 4-5 step timeline (consultation → design → installation → completion) to reduce anxiety
8. **FAQ Section** - 5-8 common questions/objections addressed (accordion format)
9. **Final CTA Section** - Last conversion opportunity before exit (phone + form)
10. **Footer** - Privacy policy, TCPA compliance, minimal links (no distractions from conversion)

**FR16:** Branding elements shall be configurable per client via Airtable:
- Brand colors (primary, secondary, CTA accent colors)
- Logo image URL
- Typography preferences (optional, defaults to system font)
- Brand voice guidelines for content generation

**FR17:** Landing page templates shall use Tailwind CSS with customizable color tokens for brand color injection without layout redesign

**FR25:** Landing pages shall implement NO navigation menu (header contains only logo + phone number) to eliminate exit paths and maintain single conversion focus

**FR26:** Landing pages shall implement 3-stage progressive form with:
- Stage 1: Name + Phone (minimal friction - primary conversion capture)
- Stage 2: Service Type + Location (contextual qualification)
- Stage 3: Project Details + Preferred Contact Time (full lead qualification)
- Visual progress indicator (1 of 3 → 2 of 3 → 3 of 3)
- Form state persistence via localStorage (reduce abandonment)

**FR27:** Landing pages shall display phone number prominently in multiple locations:
- Hero section (large, above fold, tap-to-call enabled)
- Sticky trust bar (persistent on scroll)
- Mid-page CTAs (after Service, Benefits, Testimonials sections)
- Final CTA section (before footer)

**Design Reference:** `front-end-spec.md` provides detailed UX/UI specifications, component requirements, and conversion-optimized design patterns for paid traffic landing pages.

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
- **Framework:** Next.js 15.5.0 with App Router and static export (`output: 'export'`)
- **UI Library:** React 19.2.0 and React DOM 19.2.0
- **Styling:** Tailwind CSS 4.0.0 with @tailwindcss/postcss for utility-first responsive design
- **Hosting:** Netlify (free tier initially, Pro tier if needed for build minutes/bandwidth)
- **Runtime:** Node.js v22+ (required for Netlify MCP support)

**Tracking & Conversion:**
- **Tag Management:** Google Tag Manager (GTM) - manages all third-party scripts (analytics, conversion pixels, call tracking)
- **Call Tracking:** CallRail (MANDATORY - no research needed) - dynamic phone number insertion for campaign-level tracking
- **Analytics:** Google Analytics 4 (GA4) - enhanced event tracking for conversion funnel analysis
- **Conversion Tracking:** Google Ads conversion pixels managed via GTM (form submissions, phone clicks)
- **Form Submission:** ARCHITECT TO RECOMMEND (Formspree Pro vs Netlify Forms vs custom webhook)
- **Form Library:** ARCHITECT TO RECOMMEND (React Hook Form vs Formik vs custom state management)

**Development:**
- **Version Control:** Git + GitHub
- **Development Environment:** VS Code or Cursor with BMAD integration
- **Local Development:** Mock data fixtures (JSON) for Next.js development without Airtable dependency
- **Placeholder Images:** Placehold.co (Phase 0.5 development only)
  - Service: https://placehold.co
  - Format: WebP only (per front-end-spec.md requirement)
  - Standard dimensions:
    - Hero images: 800x533px (desktop), 600x400px (tablet), responsive (mobile)
    - Testimonial avatars: 150x150px (square)
    - Before/After gallery: 800x600px (landscape)
    - Trust bar logos: 120x40px (small landscape)
  - API usage: `https://placehold.co/{width}x{height}.webp`
  - Example: `https://placehold.co/800x533.webp?text=Hero+Image`
  - Max file size target: 100KB per image
  - Note: Temporary for development - will be replaced with real images from content.json
- **Visual Testing Tools:** Playwright MCP (available during component development)
  - Purpose: Real-time visual validation of component changes during Phase 0.5
  - Dev workflow:
    1. Make component changes locally
    2. Start dev server (`npm run dev`)
    3. Use Playwright MCP to navigate to page (`browser_navigate`)
    4. Take snapshots to view layout (`browser_snapshot`)
    5. Test responsive design with `browser_resize` (320px, 768px, 1440px)
    6. Validate accessibility and visual rendering
    7. Take screenshots for documentation (`browser_take_screenshot`)
  - Key MCP commands available:
    - `browser_navigate`: Load page in browser
    - `browser_snapshot`: Capture accessibility tree (better than screenshot for layout)
    - `browser_resize`: Test responsive breakpoints
    - `browser_take_screenshot`: Visual documentation
    - `browser_console_messages`: Check for errors
  - When to use:
    - After implementing each component (HeroSection, TrustBar, etc.)
    - When testing responsive design across breakpoints
    - To validate component rendering before committing
    - To catch visual regressions during development
  - Note: Playwright MCP already configured in local environment (9 MCP servers active)

**Critical Dependency Order (Phase 1 - Static Export Architecture):**

The system MUST be built in this specific order to ensure downstream dependencies are satisfied:

1. **Airtable Schema Design** - 12-table schema (COMPLETE) defines data structure for all downstream systems
2. **Export Script Development** - `scripts/export-airtable-to-json.ts` transforms Airtable data to content.json format
3. **Next.js Template Development** - Consumes content.json structure at build time (no runtime Airtable API calls)
4. **Netlify Deployment Integration** - Static site deployment to CDN
5. **Form Implementation** - 3-stage progressive disclosure forms with client-side validation
6. **Make.com + Salesforce Integration** - Form submission handling and lead creation

**Phase 2 Dependency Order (AI Content Generation - DEFERRED):**

When AI content generation is implemented in Phase 2, the following dependencies will apply:

1. **Claude Prompt Engineering** - Defines AI output structure
2. **Make.com Content Generation Scenario** - Orchestrates Claude API calls and stores results in Airtable
3. **Airtable Schema Updates** - Add fields for AI-generated content, message match scores, and workflow states

**WARNING:** Changes to Airtable schema may require updates to export script, content.json structure, and Next.js templates. Changes to content.json structure require corresponding Next.js template updates. Version control and documentation of dependencies is critical.

**Data Flow:**

```
Airtable (12-table schema): Content management and client configuration
  - Clients, Services, Locations, Branch Locations, Service Areas, Branch Staff
  - Pages (landing page content and workflow management)
  - CTAs, Hero Images, Testimonials (content libraries)
  - Offers, Campaigns (marketing data)
  ↓
Export Script (scripts/export-airtable-to-json.ts): On-demand or scheduled export
  - Fetch data from all 12 Airtable tables
  - Transform and map fields to content.json schema
  - Generate export metadata (timestamp, record counts)
  ↓
Static JSON (content.json): Build-time data source
  - Clients data (branding, contact, tracking IDs)
  - Pages data (SEO metadata, hero, content blocks)
  - Content libraries (CTAs, images, testimonials)
  - ~500KB for 500 pages
  ↓
Next.js Build (Static Export): Generate static HTML/CSS/JS at build time
  - Consume content.json (no runtime Airtable API calls)
  - Apply client branding (colors, logos, fonts)
  - Generate SEO metadata (titles, descriptions, canonical URLs)
  - Output: Static HTML files
  ↓
Netlify CDN: Deploy static files
  - 500 pre-rendered pages
  - Zero runtime dependencies
  - Core Web Vitals optimized (LCP <2.5s, CLS <0.1)
  ↓
User Interaction: Form submissions at runtime
  - 3-stage progressive disclosure forms
  - Client-side validation (React Hook Form + Zod)
  - GTM event tracking (form_start, form_step_2, form_step_3, form_submit)
  ↓
Make.com Webhook: Form submission handling
  - reCAPTCHA verification (score ≥ 0.5)
  - Lead quality scoring (0-100)
  - Field mapping to Salesforce
  ↓
Salesforce CRM: Lead creation and assignment
  - Lead object with 30+ custom fields
  - Territory-based assignment rules
  - Automated notifications to sales reps
```

**Note:** AI content generation (Claude API integration via Make.com) is DEFERRED to Phase 2. Current implementation uses static export workflow with manually managed content in Airtable.

**Form Handling:**

- **Phase 1 (Epic 0 Phase 0.6):** Custom 3-stage progressive disclosure form with GTM event tracking
  - **Form Strategy:**
    - Stage 1: Name + Phone (minimal friction - primary conversion)
    - Stage 2: Service Type + Zip Code (contextual qualification)
    - Stage 3: Project Details + Preferred Contact Time (full qualification)
  - **Form Library:** React Hook Form + Zod (selected - provides type-safe validation with minimal bundle size)
  - **Submission Backend:** Make.com webhook integration with Salesforce Lead creation
  - **CRM Integration:** Salesforce Lead object with 30+ custom fields (implemented in Phase 1)
  - **Tracking:** GTM dataLayer events at each stage (form_start, form_step_2, form_step_3, form_submit)
  - **State Persistence:** localStorage to reduce abandonment on partially completed forms
  - **Spam Protection:** reCAPTCHA v3 (invisible, score-based validation ≥ 0.5)
- **Phase 2 (Future):** Additional CRM integrations (HubSpot, other platforms) for multi-client support

**API Rate Limits & Quotas:**

**Phase 1 (Current Implementation):**
- **Airtable API:** 5 requests/second per base (used by export script and build-time data fetching)
- **Make.com:** Operations quota varies by tier (10,000/month Core, 40,000/month Pro) - used for form submission webhooks
- **Netlify:** 300 build minutes/month free tier, 25,000/month Pro tier
- **Salesforce API:** Standard API limits apply (form submission via Make.com)

**Phase 2 (AI Content Generation - when implemented):**
- **Claude API:** 50 requests/minute (Tier 1), batch sizes adjusted accordingly
- **Make.com:** Additional operations quota for content generation scenarios

**Cost Assumptions:**

**Phase 1 (Current Implementation - No AI Generation):**
- **Monthly operational costs:** ~$30-50 (Airtable Team + Make.com Core for form submissions + Netlify hosting)
- **Per-page cost:** ~$0.00 (content manually managed in Airtable, no API generation costs)
- **Pilot client project fee:** $2-5k validates business model and covers 6+ months operational costs

**Phase 2 (With AI Content Generation - Future):**
- **Target cost per page:** <$0.15 (Claude API + infrastructure)
- **Monthly operational costs:** ~$50-100 (Airtable + Make.com + Claude API usage + Netlify)
- **Higher Make.com tier:** May need Pro tier (40,000 operations/month) for content generation at scale

**Browser Support:**

Modern browsers only (Chrome, Firefox, Safari, Edge - last 2 versions). No IE11, no legacy polyfills.

**Performance Targets:**

**Phase 1 (Current Implementation):**
- **Export time:** <5 minutes for 100 pages (Airtable → content.json via export script)
- **Build time:** <5 minutes for 100 pages, <15 minutes for 500 pages (Next.js static export)
- **Page load:** Core Web Vitals targets (LCP <2.5s, FID <100ms, CLS <0.1)
- **Current achievement:** LCP 179ms, CLS 0.00 (exceptional performance on Phase 0.2 deployment)

**Phase 2 (AI Content Generation - Future):**
- **Generation time:** <15 minutes for 100-page batch (Make.com + Claude API)
- **End-to-end workflow:** Content generation + build + deploy <30 minutes for 100 pages

### Development Workflow Standards

**Research-First Development Pattern**

Before implementing ANY feature or configuration, developers MUST follow this workflow:

**Step 1: Understand the Task**
- Read epic/story requirements completely
- Identify core technologies involved (e.g., "Next.js 15 App Router + Netlify static export")

**Step 2: Research Latest Documentation**
- Find official documentation for latest version (e.g., Next.js 15 docs, not Next.js 14)
- Review release notes for recent changes
- Identify deprecated patterns to avoid

**Step 3: Research Common Issues**
- Search for known problems: "[Technology] + [Feature] + common issues"
- Check GitHub issues related to the task
- Review community forums (Stack Overflow, Reddit, Discord) for real-world problems
- Filter for recent discussions (last 3-6 months)

**Step 4: Find Working Examples**
- Search GitHub for 3+ repositories using the same tech stack
- Clone at least 1 example and verify it runs/deploys
- Study configuration files (next.config.js, netlify.toml, etc.)
- Document reference URLs for future use

**Step 5: Think Through Implementation**
- Plan the code approach before writing
- Identify dependencies (what needs to exist first?)
- Predict failure points (where might this break?)
- Prepare rollback strategy (how to undo if it doesn't work?)

**Step 6: Implement Incrementally**
- Start with simplest possible implementation
- Test immediately before adding complexity
- For deployment tasks, deploy "Hello World" before adding features
- Document any deviations from examples/documentation

**Rationale:** Lessons learned from previous deployment failures (see project post-mortem). This workflow prevents building on incorrect assumptions and catches integration issues early. Particularly critical for Next.js 15 + Netlify integration where community knowledge is still emerging.

**Example Application:** When deploying first page to Netlify (Epic 4.2), developer must research Next.js 15 static export documentation, search for "Next.js 15 Netlify issues 2025", find 3 working GitHub examples, clone and test one example, then implement incrementally starting with single static page before adding data fetching.

See Epic 0 deliverables for detailed Research-First workflow guide with step-by-step examples.

---

## Epic List

This project is organized into 8 epics (Epic 0-8) following a strict dependency order based on technical architecture and lessons learned from previous deployment failures. Each epic includes deployment validation checkpoints to ensure incremental progress and early issue detection.

**EPIC REORGANIZATION (v3.0):** Epic 0 declared COMPLETE at Phase 0.4. Remaining foundation work (component development, scale testing, forms) reorganized into dedicated Epics 2-4 to align with BMad story-based development methodology.

### Epic 0: Foundation & Infrastructure
**Owner:** Architect (research), Development team (implementation)
**Dependencies:** None (foundational)
**Duration Estimate:** 8-10 days (4 phases: 0.1-0.4)
**Status:** ✅ COMPLETE

Establish project infrastructure, prove deployment pipeline works, and integrate Airtable export workflow. Foundation work complete - ready for feature epic development.

**Key Deliverables:**
- ✅ Architecture Decision Records (ADRs) for all technical choices (30-35 ADRs, 78 files)
- ✅ Working production deployment to Netlify with exceptional performance (LCP 179ms, CLS 0.00)
- ✅ Repository structure with Airtable export workflow (content.json)
- ✅ Development standards documentation including Research-First workflow
- ✅ Enhanced export infrastructure (3-table fetch strategy, 40+ lookup fields)
- ✅ Complete type system and data contracts for component development

**Deployment Checkpoints:**
- ✅ Phase 0.1: Architecture research complete (30-35 ADRs)
- ✅ Phase 0.2: Production deployment live (3 test pages, Core Web Vitals validated)
- ✅ Phase 0.3: Airtable integration complete (10 pages generated from content.json)
- ✅ Phase 0.4: Content enhancement complete (enhanced export script, component data contracts)

---

### Epic 1: Airtable Schema & Data Management
**Owner:** Development team
**Dependencies:** None (foundational data infrastructure)
**Duration Estimate:** N/A (COMPLETE)
**Status:** ✅ COMPLETE

Design and implement Airtable database schema (12 tables) for managing client configurations, pages, content libraries, and marketing campaigns. The schema serves as the source of truth for all content and is production-ready.

**Key Deliverables:**
- ✅ 12-table Airtable schema (Clients, Services, Locations, Branch Locations, Service Areas, Branch Staff, Pages, CTAs, Hero Images, Testimonials, Offers, Campaigns)
- ✅ 14 rollup fields for aggregated data
- ✅ Formula fields for URL generation and computed values
- ✅ 3 automations (Auto-Match Branch, Trigger AI Generation, Export on Approval)
- ✅ Multiple views per table for workflow management
- ✅ Complete schema documentation

**Validation Checkpoint:** ✅ Schema complete, tested, and production-ready (LOCKED - no modifications without Owner/Architect approval)

---

### Epic 2: Component Development System (NEW)
**Owner:** Dev Agent
**Dependencies:** Epic 0 + Epic 1 complete
**Duration Estimate:** 16-24 hours (2-3 days)
**Status:** READY TO START

Build 6 React components with dynamic branding, responsive design, and accessibility compliance. First feature epic implementing production-quality UI components.

**Stories:**
1. Story 2.1: HeroSection Component Implementation
2. Story 2.2: TrustBar Component Implementation
3. Story 2.3: BenefitsGrid Component Implementation
4. Story 2.4: ProcessTimeline Component Implementation
5. Story 2.5: TestimonialsGrid Component Implementation
6. Story 2.6: FAQAccordion Component Implementation
7. Story 2.7: Page Layout Integration & Responsive Validation

**Key Deliverables:**
- 6 React components (HeroSection, TrustBar, BenefitsGrid, ProcessTimeline, TestimonialsGrid, FAQAccordion)
- Dynamic branding with CSS custom properties
- Responsive design (320px, 768px, 1440px breakpoints)
- WCAG 2.1 AA accessibility compliance
- First complete page deployed to production

**Success Criteria:**
- All 6 components functional and tested
- Dynamic branding working (colors, logos, fonts)
- Responsive design validated across breakpoints
- WCAG 2.1 AA compliance verified
- First complete page deployed

---

### Epic 3: Scale Testing & Performance Validation (NEW)
**Owner:** Dev Agent + QA Agent
**Dependencies:** Epic 2 complete
**Duration Estimate:** 1-2 days
**Status:** Pending Epic 2 complete

Deploy 50-100 pages with full component system to validate performance, measure Core Web Vitals, and identify optimization opportunities.

**Stories:**
1. Story 3.1: Test Data Generation (50-100 pages)
2. Story 3.2: Export & Build Performance Testing
3. Story 3.3: Deployment Validation & Cross-Browser Testing
4. Story 3.4: Performance Benchmarking (Core Web Vitals, Lighthouse)
5. Story 3.5: Quality Assurance (HTML, Accessibility, SEO)

**Key Deliverables:**
- 50-100 pages deployed successfully
- Build time measured (<5 minutes for 100 pages)
- Core Web Vitals validated (LCP <2.5s, CLS <0.1)
- Lighthouse scores measured (>90 all categories)
- Performance baseline documented

**Success Criteria:**
- 50-100 pages deploy successfully
- Build time <5 minutes for 100 pages
- Core Web Vitals targets met
- Lighthouse scores >90
- No accessibility or HTML validation failures

---

### Epic 4: Form Submission Integration (RENAMED from old Epic 2)
**Owner:** Dev Agent
**Dependencies:** Epic 3 complete
**Duration Estimate:** 3-4 days
**Status:** Pending Epic 3 complete

Implement 3-stage progressive disclosure forms with Make.com webhook integration, Salesforce lead creation, reCAPTCHA spam protection, and comprehensive tracking.

**Stories:**
1. Story 4.1: 3-Stage Form Component (UI + validation)
2. Story 4.2: GTM & Analytics Integration
3. Story 4.3: Make.com Webhook Configuration
4. Story 4.4: Salesforce Lead Creation & Field Mapping
5. Story 4.5: End-to-End Testing & Documentation

**Key Deliverables:**
- 3-stage progressive form component (Stage 1: Name/Phone, Stage 2: Service/Zip, Stage 3: Details/Submit)
- React Hook Form + Zod validation
- Google Tag Manager (GTM) dataLayer event tracking (form_start, form_step_2, form_step_3, form_submit)
- Make.com webhook integration with reCAPTCHA verification
- Salesforce Lead creation with 30+ custom fields
- Complete documentation for form implementation, Make.com scenario, and Salesforce field mapping

**Success Criteria:**
- Forms deployed on all pages
- GTM events fire correctly
- Salesforce Leads created with all fields populated
- reCAPTCHA integration functional
- 10+ test submissions verified

---

### Epic 5: Landing Page Generation (RENUMBERED from old Epic 4)
**Owner:** Development team
**Dependencies:** Epic 0 (deployment baseline) + Epic 1 (schema) complete
**Duration Estimate:** 5-7 days (some work completed in Epic 2)
**Status:** Partially Complete (basic generation working)

Build Next.js templates that fetch approved content from Airtable at build time and generate static landing pages with responsive design. **Note:** Basic page generation already working from Epic 0. This epic focuses on advanced features and optimization.

**Four Phases:**
1. ✅ Single static page proof with mock data (COMPLETE in Epic 0.2)
2. ✅ Airtable integration with build-time data fetching (COMPLETE in Epic 0.3-0.4)
3. 🔄 Full template system (accessibility, responsiveness, brand customization) - Partially complete in Epic 2
4. ⏳ Performance optimization (Core Web Vitals, Lighthouse scoring) - Pending

**Key Deliverables:**
- ✅ Responsive landing page templates (basic sections implemented in Epic 2)
- ✅ Build-time Airtable data fetching (content.json workflow)
- ✅ Brand color/logo customization system (implemented in Epic 2)
- 🔄 WCAG 2.1 AA accessibility compliance (to be validated)
- ⏳ 90+ Lighthouse scores (to be optimized)

**Deployment Checkpoints:**
- ✅ Phase 5.1: 1 static page deploys (COMPLETE)
- ✅ Phase 5.2: 10 pages from Airtable deploy (COMPLETE)
- 🔄 Phase 5.3: 50 pages deploy with accessibility validation (Epic 3)
- ⏳ Phase 5.4: 100 pages deploy meeting performance targets (Epic 3)

---

### Epic 6: Build & Deployment Pipeline (RENUMBERED from old Epic 5)
**Owner:** Development team
**Dependencies:** Epic 5 complete
**Duration Estimate:** 1-2 days
**Status:** Partially Complete (basic deployment working)

Establish build triggering, deployment to Netlify CDN, and status tracking workflow. Manual triggers for MVP (automation deferred to Phase 2).

**Key Deliverables:**
- ✅ Netlify build configuration (COMPLETE in Epic 0.2)
- 🔄 Deployment runbook with troubleshooting guide (basic version exists)
- ⏳ Rollback procedures documented
- ⏳ Build success validation checklist

**Deployment Checkpoint:** ⏳ 10-page batch deploys end-to-end via manual trigger

---

### Epic 7: Multi-Tier Validation System (RENUMBERED from old Epic 6, reduced scope)
**Owner:** Development team + QA/Review
**Dependencies:** ALL epics 1-6 complete
**Duration Estimate:** 2-3 days (reduced from 3-5 days)
**Status:** Pending Epic 6 complete

Execute systematic validation testing at increasing scale to prove production capability before pilot client delivery. **Scope Reduced:** Tier 1-2 validation already completed in Epic 3. This epic focuses on Tier 3 (250-500 pages) only.

**Validation Tier:**
- ✅ Tier 1 (10-20 pages): COMPLETE in Epic 0.3-0.4
- ✅ Tier 2 (50-100 pages): COMPLETE in Epic 3
- ⏳ Tier 3 (250-500 pages): Prove production-scale capability

**Key Deliverables:**
- ✅ Automated validation tools (implemented in Epic 3)
- ✅ Test data generation scripts (implemented in Epic 3)
- ⏳ Tier 3 validation report
- ⏳ Final performance baseline documentation
- ⏳ Go/No-Go decision for pilot client

**Deployment Checkpoint:**
- ⏳ Tier 3: 500 pages deployed meeting all performance targets

**Final Gate:** ✅ Tier 3 validation passes → System ready for pilot client delivery

---

### Epic 8: AI Content Generation System (DEFERRED from old Epic 3)
**Owner:** Development team
**Dependencies:** Epic 0 complete, Epic 1 complete (Airtable schema)
**Duration Estimate:** 4-6 days (when implemented in Phase 2)
**Status:** 🔄 DEFERRED TO PHASE 2

Design and implement AI-powered content generation system using Claude API to create SEO-optimized, TCPA-compliant landing page content at scale. This epic has been deferred to Phase 2 to prioritize static site generation, component development, and form submission capability in Phase 1.

**Key Deliverables (Phase 2):**
- Master prompt template for Claude API (variable placeholders for client, service, location, brand voice)
- Output schema definition (JSON contract for Airtable storage and Next.js consumption)
- Make.com content generation scenario (fetch pending pages → call Claude API → store results → update status)
- Quality validation checks (word count, TCPA compliance, metadata completeness, keyword density)
- Batch processing with rate limit handling (50 req/min for Claude API)
- Error handling and retry logic
- Multi-tier validation (10 pages → 50 pages → 100 pages)

**Rationale for Deferral:** Business priorities shifted to deliver working static site with forms first (Epics 0-4) before adding AI content generation. This allows earlier validation of conversion capability and simpler initial implementation.

---

## Epic Dependency Flow

```
Epic 0 (Foundation & Infrastructure) - COMPLETE ✅
  ↓
Epic 1 (Airtable Schema) - COMPLETE ✅
  ↓
Epic 2 (Component Development) - READY TO START 🟢
  ↓
Epic 3 (Scale Testing) - Pending Epic 2
  ↓
Epic 4 (Form Submission) - Pending Epic 3
  ↓
Epic 5 (Landing Page Generation) - Partially Complete (advanced features pending)
  ↓
Epic 6 (Build & Deploy Pipeline) - Partially Complete (documentation pending)
  ↓
Epic 7 (Multi-Tier Validation - Tier 3 only) - Pending Epic 6
  ↓
READY FOR PILOT CLIENT

Epic 8 (AI Content Generation) - DEFERRED TO PHASE 2
```

**Total Estimated Duration:** 18-28 days (Epic 0-7, sequential execution)

**Current Progress:** Epic 0-1 COMPLETE (~8-10 days delivered), Epic 2-4 remaining (~6-9 days), Epic 5-7 refinement (~4-9 days)

**Parallelization Opportunities:** Epic 5-6 refinement can overlap with Epic 2-3 development

---

## Epic Details

### Epic 0: Foundation & Deployment Baseline

**Summary:** Establish project infrastructure and prove deployment pipeline works before building features.

**Requirements Covered:** Infrastructure prerequisites (enables all functional requirements)

**Dependencies:** None (this is the foundation)

---

#### Phase 0.1: Architecture Research & Decision Making

**Owner:** ARCHITECT

**Duration:** 1-2 days

**Research Questions & Deliverables:**

**Repository & Project Structure:**
- ⚠️ Monorepo vs flat structure decision (test Netlify compatibility with both)
- ⚠️ Directory organization standards
- ⚠️ Package manager selection (npm, yarn, pnpm)
- ⚠️ Node.js version specification

**Next.js 15 Configuration:**
- ⚠️ App Router data fetching patterns for static export
- ⚠️ `generateStaticParams()` usage for dynamic routes
- ⚠️ Server Component vs Client Component boundaries
- ⚠️ Metadata API for SEO (title, description generation)
- ⚠️ Static export configuration (`output: 'export'` in next.config.js)
- ⚠️ Image optimization strategy (Next.js Image vs static images)

**Netlify Deployment:**
- ⚠️ `netlify.toml` configuration (build command, publish directory, base directory)
- ⚠️ Plugin requirements (@netlify/plugin-nextjs vs native runtime)
- ⚠️ Environment variable management
- ⚠️ Build optimization settings

**Airtable Integration:**
- ⚠️ API client library selection
- ⚠️ Build-time data fetching implementation
- ⚠️ Data caching strategy during builds
- ⚠️ Rate limit handling approach

**Styling & Assets:**
- ⚠️ Tailwind CSS configuration (design tokens, brand customization)
- ⚠️ Font loading strategy (local vs Google Fonts)
- ⚠️ CSS purging/minification for production

**Form Handling:**
- ⚠️ Form submission solution (Formspree vs Netlify Forms vs other)
- ⚠️ Client-side validation approach
- ⚠️ Spam protection strategy

**Testing & Validation:**
- ⚠️ Accessibility testing tools (axe-core, Lighthouse CI)
- ⚠️ HTML validation approach (W3C validator)
- ⚠️ Performance monitoring strategy

**Reference Implementation Study:**
- Find 3+ working Next.js 15 + Netlify + Static Export projects on GitHub
- Clone and deploy at least 1 to verify understanding
- Document configuration patterns observed
- Identify common pitfalls and solutions

**Deliverables:**
- Comprehensive Architecture Decision Records (ADRs) for all decisions above
- Reference implementation URLs with working deployments
- Configuration file templates (next.config.js, netlify.toml, tailwind.config.js)
- Data flow diagrams
- Risk assessment with mitigation plans

**Success Criteria:**
- ✅ All ADRs documented with rationale
- ✅ At least 1 reference implementation successfully deployed
- ✅ PM reviews and approves all architectural decisions
- ✅ Contingency plans documented for high-risk decisions

---

#### Phase 0.2: Deployment Baseline ("Hello World" Proof)

**Owner:** Development team

**Duration:** 1-2 days

**Prerequisites:** Phase 0.1 complete (ADRs approved)

**Deliverables:**

1. **Minimal Next.js 15 Application:**
   - Single page with "Hello World" content
   - Static export configuration per ADRs
   - Tailwind CSS basic setup
   - No data fetching, no dynamic routes (absolute minimum)

2. **Netlify Deployment:**
   - Deploy "Hello World" to Netlify
   - Verify build succeeds without errors
   - Verify deployed site accessible via Netlify URL
   - Test for 500 errors, console errors, build failures

3. **Documentation:**
   - Deployment runbook (step-by-step deployment process)
   - Troubleshooting guide (common issues encountered)
   - Rollback procedure (how to revert failed deployments)

**Success Criteria:**
- ✅ Static site deploys successfully to Netlify
- ✅ No 500 errors on any routes
- ✅ Build completes in <2 minutes
- ✅ Lighthouse Performance score >90 (simple page should score high)
- ✅ Deployment runbook tested and validated

**Deployment Checkpoint:** ✅ "Hello World" deployment successful → Proceed to Phase 0.3

---

#### Phase 0.3: Project Scaffolding

**Owner:** Development team

**Duration:** 1 day

**Prerequisites:** Phase 0.2 complete (deployment proven)

**Deliverables:**

1. **Repository Structure:**
   - Directory organization per ADRs
   - `/docs` - Documentation (PRD, ADRs, runbooks)
   - `/scripts` - Utility scripts (test data generation, validation)
   - `/app` or `/pages` - Next.js application (per ADRs)
   - `/public` - Static assets
   - Configuration files (package.json, next.config.js, tailwind.config.js, netlify.toml)

2. **Mock Data System:**
   - JSON fixtures for local development
   - Mock client configurations
   - Mock page content (matches Epic 1 schema when finalized)
   - Data loading utilities for Next.js development without Airtable

3. **Development Standards Documentation:**
   - **Research-First Workflow Guide:**
     - Step-by-step process with examples
     - Template for documenting research findings
     - Example: "Deploying to Netlify" walkthrough
   - **Code Review Checklist:**
     - Accessibility requirements
     - Performance targets
     - SEO compliance
   - **Testing Standards:**
     - Validation requirements (HTML, Lighthouse, WCPA)
   - **Git Workflow:**
     - Branch naming conventions
     - Commit message standards
     - PR review process

4. **Development Tooling:**
   - ESLint + Prettier configuration
   - VS Code / Cursor recommended extensions
   - Git hooks (pre-commit linting)

**Success Criteria:**
- ✅ Developers can clone repository and run locally
- ✅ Mock data fixtures load correctly in Next.js
- ✅ All documentation completed and reviewed
- ✅ Development standards documented

---

#### Phase 0.4: Content Enhancement

**Owner:** Development team

**Duration:** 2-3 days

**Prerequisites:** Phase 0.3 complete (Airtable integration working, 10 pages deployed)

**Summary:** Enhance content.json data model to include richer page content, client branding, and metadata fields needed for production-quality landing pages.

**Deliverables:**

1. **Enhanced Export Script (`scripts/export-airtable-to-json.ts`):**
   - Expand to fetch data from all relevant Airtable tables (Clients, Services, Locations, Pages, CTAs, Testimonials, Hero Images)
   - Implement comprehensive field mapping from 12-table Airtable schema to content.json structure
   - Add error handling and data validation during export
   - Generate export metadata (timestamp, record counts, duration)
   - Support incremental exports (only approved pages)

2. **Enhanced content.json Schema:**
   - Client branding data (colors, logos, fonts, contact info, tracking IDs)
   - Rich page content (hero section, service descriptions, benefits, testimonials, FAQs)
   - SEO metadata (titles, descriptions, canonical URLs, structured data)
   - Branch-specific data (matched branch location, staff, service areas)
   - Content library data (CTAs, hero images, testimonials)
   - Marketing data (offers, campaigns, UTM parameters)

3. **Updated Next.js Templates:**
   - Consume enhanced content.json structure
   - Render complete page sections (hero, trust bar, service description, benefits, testimonials, FAQ, CTA)
   - Implement brand customization (colors, logos, fonts from client data)
   - Add SEO metadata generation (title tags, meta descriptions, canonical URLs)
   - Support dynamic content blocks (features, benefits, process steps)

4. **Data Model Documentation:**
   - Document complete content.json schema with TypeScript types
   - Create data flow diagram (Airtable 12 tables → content.json → Next.js pages)
   - Document field mappings between Airtable and content.json
   - Add examples of complete page data objects

**Success Criteria:**
- ✅ Export script successfully fetches data from all 12 Airtable tables
- ✅ content.json includes complete client branding and page content
- ✅ 10-20 pages deploy with enhanced content (no more mock data)
- ✅ Pages render with client-specific branding (colors, logos)
- ✅ SEO metadata present on all pages (title, description, canonical)
- ✅ No build errors or data validation failures

**Deployment Checkpoint:** ✅ 20 pages deployed with enhanced content and branding → Proceed to Phase 0.5

---

#### Phase 0.5: Scale Testing

**Owner:** Development team + QA

**Duration:** 1-2 days

**Prerequisites:** Phase 0.4 complete (enhanced content working with 20 pages)

**Summary:** Validate system performance and reliability at production scale by deploying 50-100 pages and measuring key performance metrics.

**Deliverables:**

1. **Test Data Generation:**
   - Create 50-100 page records in Airtable (diverse service/location combinations)
   - Generate realistic client configurations (multiple clients with different branding)
   - Populate content library tables (CTAs, hero images, testimonials)
   - Ensure data quality and variety for comprehensive testing

2. **Export and Build Performance Testing:**
   - Run export script with 50-100 pages and measure duration
   - Trigger Next.js build and measure build time
   - Monitor resource usage (memory, CPU, build minutes)
   - Identify performance bottlenecks (export vs build vs deploy)

3. **Deployment Validation:**
   - Deploy 50-100 pages to Netlify production
   - Verify all pages render correctly (spot-check 20% random sample)
   - Test cross-browser compatibility (Chrome, Firefox, Safari, Edge)
   - Validate mobile responsiveness across device breakpoints

4. **Performance Benchmarking:**
   - Run Lighthouse audits on 10 random pages
   - Measure Core Web Vitals (LCP, FID, CLS) on sample pages
   - Document performance metrics and identify any degradation
   - Compare against Phase 0.2/0.3 baseline metrics

5. **Quality Assurance:**
   - HTML validation on sample pages (W3C validator)
   - Accessibility testing (axe-core, WCAG 2.1 AA compliance)
   - SEO metadata validation (all required fields present)
   - Content quality spot-check (formatting, readability, brand consistency)

**Metrics to Track:**
- Export time for 100 pages (target: <5 minutes)
- Build time for 100 pages (target: <5 minutes)
- Deployment time to Netlify (target: <2 minutes)
- Total workflow time (export + build + deploy)
- Core Web Vitals scores (LCP <2.5s, FID <100ms, CLS <0.1)
- Lighthouse scores (Performance, Accessibility, Best Practices, SEO all >90)
- Page bundle size (target: <200KB per page)

**Success Criteria:**
- ✅ 50-100 pages export successfully without errors
- ✅ Build completes in <5 minutes for 100 pages
- ✅ All pages deploy successfully (100% success rate)
- ✅ Core Web Vitals targets met on sampled pages
- ✅ Lighthouse scores >90 on all categories (sample 10 pages)
- ✅ No accessibility or HTML validation failures
- ✅ Performance metrics documented as baseline

**Deployment Checkpoint:** ✅ 100 pages deployed meeting all performance targets → Proceed to Phase 0.6

---

#### Phase 0.6: Form Implementation

**Owner:** Development team

**Duration:** 3-4 days

**Prerequisites:** Phase 0.5 complete (scale testing validated with 100 pages)

**Summary:** Implement 3-stage progressive disclosure forms with Make.com webhook integration, Salesforce lead creation, reCAPTCHA spam protection, and comprehensive tracking.

**Deliverables:**

1. **3-Stage Progressive Form Component:**
   - **Stage 1:** Name + Phone (minimal friction, primary conversion)
     - Input validation (name: 2+ chars, phone: 10-11 digits)
     - Error messaging and real-time validation
     - "Continue" button to advance to Stage 2
   - **Stage 2:** Service Type + Zip Code (contextual qualification)
     - Service dropdown (populated from page context)
     - Zip code validation (5-digit US zip)
     - "Continue" button to advance to Stage 3
   - **Stage 3:** Project Details + Preferred Contact Time (full qualification)
     - "How did you hear about us?" dropdown
     - Comments/questions textarea (optional, 500 char max)
     - Preferred contact time selection
     - reCAPTCHA v3 integration (invisible, score-based)
     - "Submit" button for final submission
   - Visual progress indicator (1 of 3 → 2 of 3 → 3 of 3)
   - Form state persistence via localStorage (reduce abandonment)
   - Responsive design (mobile-optimized, thumb-friendly tap targets)

2. **Form Validation and Error Handling:**
   - Client-side validation using Zod schema (per data-models.md)
   - React Hook Form integration for state management
   - Real-time validation feedback
   - Error messages for each field
   - Prevent submission if validation fails
   - Loading states during submission

3. **Tracking and Analytics Integration:**
   - Google Tag Manager (GTM) container integration
   - dataLayer event tracking:
     - `form_start` - User begins filling form (Stage 1 first interaction)
     - `form_step_2` - User advances to Stage 2
     - `form_step_3` - User advances to Stage 3
     - `form_submit` - Final form submission
     - `form_error` - Validation errors or submission failures
   - UTM parameter capture and persistence (source, medium, campaign, term, content)
   - Click ID tracking (gclid for Google Ads, fbclid for Facebook)
   - Session data capture (landing page, referrer, client ID)
   - Device and timing data (viewport, browser, time on page, form duration)

4. **Make.com Webhook Integration:**
   - Create Make.com scenario for form submission handling
   - Webhook endpoint receives form data via POST
   - reCAPTCHA token verification (score ≥ 0.5 required)
   - Lead quality score calculation (0-100 based on engagement metrics)
   - Data transformation for Salesforce Lead object
   - Error handling and retry logic

5. **Salesforce Lead Creation:**
   - Map form fields to Salesforce Lead object (30+ fields per data-models.md)
   - Custom fields: Campaign, Ad Group, Keyword, GCLID, Landing Page, Form Duration, Time on Page, Device Type, Lead Quality Score, reCAPTCHA Score
   - Standard fields: FirstName, LastName, Phone, Email, PostalCode, LeadSource, Description
   - Trigger Salesforce assignment rules (territory-based routing)
   - Handle duplicate detection (check for existing leads with same email/phone)

6. **Form Submission Workflow Testing:**
   - End-to-end testing (form fill → webhook → Salesforce)
   - Validation testing (all field types, error states)
   - reCAPTCHA integration testing (verify score validation)
   - GTM event tracking verification (all dataLayer events fire correctly)
   - Salesforce lead verification (all fields populated correctly)
   - Error handling testing (API failures, network issues, timeout)

7. **Documentation:**
   - Form implementation guide (component usage, customization)
   - Make.com scenario documentation (webhook URL, configuration)
   - Salesforce field mapping reference (form → Lead object)
   - GTM tracking specification (all events and data points)
   - Troubleshooting guide (common issues and solutions)

**Success Criteria:**
- ✅ 3-stage form implemented and deployed on all pages
- ✅ Form validation works correctly (client-side and server-side)
- ✅ GTM events fire correctly at each stage (verified in GTM debugger)
- ✅ Form submissions successfully create Salesforce Leads with all fields populated
- ✅ reCAPTCHA integration functional (spam submissions blocked)
- ✅ Mobile-optimized form works on iOS and Android devices
- ✅ Form state persists across page reloads (localStorage working)
- ✅ End-to-end testing complete (10+ test submissions verified in Salesforce)
- ✅ Error handling tested (graceful failures, user-friendly error messages)
- ✅ Documentation complete for all integrations

**Deployment Checkpoint:** ✅ Forms deployed and tested on production site → Epic 0 Complete

---

### Epic 1: AI Content Generation System

**Summary:** Design and validate Claude prompts for generating SEO-optimized, TCPA-compliant landing page content at scale.

**Requirements Covered:** FR1, FR4, FR9, FR10, NFR5

**Dependencies:** Epic 0 complete

**Duration:** 2-3 days

---

**Key Deliverables:**

**1. Master Prompt Template:**
- Template with variable placeholders: `{CLIENT_NAME}`, `{SERVICE_TYPE}`, `{LOCATION}`, `{BRAND_VOICE}`
- Instructions for SEO optimization (keyword density, heading structure)
- TCPA compliance enforcement (required disclaimers, consent language)
- Content structure specification (hero headline, service description, benefits, etc.)
- Tone and style guidelines
- Word count targets (minimum 800 words per page)

**2. Output Schema Definition (JSON):**

This schema becomes the contract for Epic 2 (Airtable fields) and Epic 4 (Next.js data consumption):

```json
{
  "page_metadata": {
    "title": "SEO-optimized title tag (60 chars max)",
    "meta_description": "SEO meta description (160 chars max)",
    "canonical_url": "/service/location",
    "keywords": ["keyword1", "keyword2", "keyword3"]
  },
  "hero": {
    "headline": "Location-specific headline",
    "subheadline": "Supporting text",
    "cta_text": "Primary call-to-action",
    "cta_url": "/contact or phone number"
  },
  "service_description": {
    "heading": "Service explanation heading",
    "body": "Service description paragraphs (HTML allowed)",
    "key_points": ["point 1", "point 2", "point 3"]
  },
  "benefits": {
    "heading": "Why choose us heading",
    "benefits_list": [
      {"title": "Benefit 1", "description": "Detail"},
      {"title": "Benefit 2", "description": "Detail"}
    ]
  },
  "social_proof": {
    "testimonial_text": "Sample testimonial",
    "certifications": ["License #", "Certification name"],
    "service_area": "Cities/regions served"
  },
  "contact": {
    "phone": "555-555-5555",
    "email": "contact@example.com",
    "form_heading": "Get a free quote"
  },
  "footer": {
    "tcpa_disclaimer": "Required TCPA compliance text",
    "privacy_policy_url": "/privacy",
    "service_areas": ["City1", "City2"]
  }
}
```

**3. Quality Validation Checks (Automated):**
- Word count validator (minimum 800 words)
- TCPA keyword detector (searches for required compliance terms)
- Metadata completeness checker (title, description, keywords present)
- HTML validation (if HTML included in content)
- Keyword density checker (target keywords appear appropriately)

**4. Testing & Validation:**
- Generate 10 test pages with diverse service/location combinations
- Human evaluation using quality rubric:
  - Content relevance and accuracy (0-10 score)
  - SEO optimization quality (keyword usage, structure)
  - TCPA compliance (all required disclaimers present)
  - Brand voice consistency
  - Conversion-focused messaging
- Iterate on prompts until 90%+ average quality score achieved
- Document edge cases and prompt refinement process

**Success Criteria:**
- ✅ 10 test pages generated with 90%+ quality approval
- ✅ All pages pass automated TCPA compliance checks
- ✅ Output schema documented and approved
- ✅ Prompt template produces consistent structure across variations
- ✅ Schema documented for Epic 2 and Epic 4 teams

**Validation Checkpoint:** ✅ Quality targets met → Freeze schema and hand off to Epic 2

---

### Epic 2: Data Schema & Storage

**Summary:** Design Airtable database schema to store client configurations, page requests, generated content, and workflow states.

**Requirements Covered:** FR2, FR3, FR5

**Dependencies:** Epic 1 complete (output schema finalized)

**Duration:** 1-2 days

---

**ARCHITECT Research Items:**
- ⚠️ Table structure: Single table vs normalized (Clients + Pages tables)
- ⚠️ Field types (Long text vs Rich text for content)
- ⚠️ Indexing strategy for lookups
- ⚠️ Airtable automation capabilities assessment

---

**Key Deliverables:**

**1. Airtable Base Structure:**

**Clients Table:**
- Client Name (Single line text)
- Business Type (Single select: HVAC, Plumbing, Roofing, etc.)
- Brand Colors (JSON: `{"primary": "#hex", "secondary": "#hex", "cta": "#hex"}`)
- Logo URL (URL field)
- Brand Voice Guidelines (Long text)
- Service Offerings (Multiple select: Service types offered)
- Service Areas (Multiple select: Cities/regions covered)
- Contact Info (Phone, Email, Address)
- Status (Single select: Active, Inactive)

**Pages Table:**
- Page ID (Auto-number or Formula)
- Client (Link to Clients table)
- Service Type (Single line text, from Clients.Service Offerings)
- Location (Single line text, from Clients.Service Areas)
- URL Slug (Formula: `/service-type/location`)
- Status (Single select: Pending, Generating, Ready for Review, Approved, Deployed, Failed)
- Generated Content (Long text, stores JSON from Epic 1 schema)
- Generated Date (Date field)
- Approved By (Single line text)
- Approved Date (Date field)
- Deployed Date (Date field)
- Quality Score (Number, optional for tracking)
- Notes (Long text, for reviewer comments)

**2. Workflow State Machine:**

```
Pending → (Make.com triggers) → Generating
Generating → (Claude API completes) → Ready for Review
Ready for Review → (Human approves) → Approved
Ready for Review → (Human rejects) → Failed or Pending (for regeneration)
Approved → (Netlify build completes) → Deployed
```

**3. Human Approval Interface (Airtable Native UI):**
- **View: "Ready for Review"** - Filtered to show pages in "Ready for Review" status
- **View: "Approved - Pending Deploy"** - Pages approved but not yet deployed
- **View: "Deployed"** - Successfully deployed pages
- Batch status update capability (select multiple, change status to "Approved")
- Form view for detailed review (display full content, quality scoring)

**4. Sample Test Data:**
- 1 test client configuration (sample contractor)
- 10-20 page records covering diverse service/location combinations
- Sample generated content (from Epic 1 testing)

**Success Criteria:**
- ✅ Schema matches Epic 1 output structure exactly (JSON fits in Generated Content field)
- ✅ Workflow states function correctly
- ✅ Human reviewer can approve/reject pages in Airtable UI
- ✅ Sample data loads successfully
- ✅ Schema documented for Epic 3 (Make.com) and Epic 4 (Next.js)

**Validation Checkpoint:** ✅ Test data validated → Schema locked for Epic 3 and Epic 4

---

### Epic 3: Workflow Orchestration

**Summary:** Build Make.com scenarios to orchestrate content generation: fetch pending pages → call Claude API → store results → update status.

**Requirements Covered:** Orchestration between Airtable and Claude API (enables FR1-FR3)

**Dependencies:** Epic 1 + Epic 2 complete

**Duration:** 2-3 days

---

**ARCHITECT Research Items:**
- ⚠️ Make.com tier requirements (operations quota for 500 pages)
- ⚠️ Batch processing patterns (parallel vs sequential API calls)
- ⚠️ Error handling and retry logic best practices
- ⚠️ Rate limiting strategies for Claude API (50 req/min)

---

**Key Deliverables:**

**1. Make.com Scenario: Content Generation**

**Trigger:** Manual trigger or scheduled polling (every 1 hour, check for Pending pages)

**Workflow Steps:**
1. **Fetch Pending Pages from Airtable:**
   - Filter: Status = "Pending"
   - Limit: Configurable batch size (10-50 pages per run)
   - Retrieve: Page ID, Client data, Service Type, Location

2. **Update Status to "Generating":**
   - Batch update all fetched pages to "Generating" status
   - Prevents duplicate processing

3. **For Each Page (Iterator):**
   - Build prompt from template (Epic 1) with client/service/location data
   - Call Claude API with constructed prompt
   - Rate limit handling: Sleep 1.2 seconds between calls (50/min = 1 call per 1.2s)
   - Parse Claude response (JSON extraction)

4. **Store Content in Airtable:**
   - Update Pages table: Generated Content field = Claude JSON response
   - Update Status = "Ready for Review"
   - Update Generated Date = Now()

5. **Error Handling:**
   - If Claude API fails: Update Status = "Failed", Notes = Error message
   - Retry logic: 2 retries with exponential backoff
   - Notification on persistent failures

**2. Testing & Validation:**
- **Single Page Test:** Process 1 page end-to-end, verify all fields populated correctly
- **10-Page Batch Test:** Process 10 pages, verify rate limiting works, no failures
- **Error Scenario Test:** Simulate API failure, verify error handling works
- **Performance Test:** Measure time for 10-page batch (target <12 minutes for 10 pages = ~1.2 min/page)

**Success Criteria:**
- ✅ Single page processed successfully end-to-end
- ✅ 10-page batch completes without errors
- ✅ Content stored in Airtable matches Epic 1 schema
- ✅ Error handling tested (API failures, rate limits)
- ✅ Processing time <15 minutes for 100-page batch (calculated from 10-page test)

**Validation Checkpoint:** ✅ 10-page batch successful → Ready for Epic 4 integration

---

### Epic 4: Landing Page Generation

**Summary:** Build Next.js templates that fetch approved content from Airtable at build time and generate static landing pages.

**Requirements Covered:** FR6, FR11-FR17, NFR2, NFR3, NFR7-NFR9

**Dependencies:** Epic 0 (deployment baseline) + Epic 2 (schema) complete

**Duration:** 5-7 days

**BLOCKED UNTIL:** Epic 0 Phase 0.1 ARCHITECT research complete

---

**ARCHITECT Research Items (37 total):**

*(All 37 items previously documented - see earlier in conversation for full list)*

**Key categories:**
- Next.js 15 App Router static export (10 items)
- Styling & assets (6 items)
- Data fetching architecture (6 items)
- Routing & URL structure (5 items)
- Form handling (5 items)
- Accessibility & performance (5 items)

---

**Phase 4.1: Single Static Page Proof**

**Duration:** 1-2 days

**Deliverables:**
- Single landing page template with hardcoded mock data
- All sections implemented: Hero, Service Description, Benefits, Social Proof, Contact, Footer
- Responsive layout with Tailwind CSS (mobile, tablet, desktop breakpoints)
- Basic SEO meta tags (title, description)
- Deploy to Netlify

**Success Criteria:**
- ✅ Single page deploys successfully
- ✅ Page renders correctly across all target browsers
- ✅ Responsive at all breakpoints (320px, 768px, 1024px+)
- ✅ Lighthouse scores: Performance >90, Accessibility >90, Best Practices >90, SEO >90

**Deployment Checkpoint:** ✅ 1 page deployed with Lighthouse 90+ → Proceed to Phase 4.2

---

**Phase 4.2: Airtable Integration**

**Duration:** 2 days

**Deliverables:**
- Build-time data fetching from Airtable API
- Fetch all pages with Status = "Approved"
- Generate pages from Airtable data (no mock data)
- Dynamic routing: `/[service]/[location]` URL structure
- `generateStaticParams()` implementation for all service/location combinations

**Success Criteria:**
- ✅ 10 pages generated from Airtable data
- ✅ All pages deploy successfully
- ✅ URLs match expected structure (`/plumbing/chicago`, etc.)
- ✅ No build errors or warnings
- ✅ Build time <2 minutes for 10 pages

**Deployment Checkpoint:** ✅ 10 pages from Airtable deployed → Proceed to Phase 4.3

---

**Phase 4.3: Full Template System**

**Duration:** 2 days

**Deliverables:**
- Brand color injection via Tailwind CSS config (read from Airtable Client data)
- Logo image integration
- Configurable CTA buttons (text, URL, styling)
- WCAG 2.1 AA accessibility compliance:
  - Semantic HTML (header, nav, main, section, footer)
  - ARIA labels where needed
  - Alt text for all images
  - Proper heading hierarchy (H1 → H2 → H3)
  - Color contrast ratios 4.5:1 minimum
- Form integration (solution per ARCHITECT research)
- Mobile/tablet/desktop responsive design

**Success Criteria:**
- ✅ Brand colors customizable without code changes
- ✅ Pages pass WCAG 2.1 AA validation (axe-core or similar)
- ✅ Forms functional (test submission)
- ✅ 50 pages deploy successfully
- ✅ Lighthouse Accessibility score >95

**Deployment Checkpoint:** ✅ 50 pages deployed, accessibility validated → Proceed to Phase 4.4

---

**Phase 4.4: Performance Optimization**

**Duration:** 1-2 days

**Deliverables:**
- Image optimization (per ARCHITECT research)
- CSS/JS bundle optimization
- Critical CSS extraction/inlining
- Font optimization
- Core Web Vitals validation on deployed pages:
  - LCP (Largest Contentful Paint) <2.5s
  - FID (First Input Delay) <100ms
  - CLS (Cumulative Layout Shift) <0.1

**Success Criteria:**
- ✅ 100 pages deploy successfully
- ✅ Build time <5 minutes for 100 pages
- ✅ Core Web Vitals targets met on sampled pages (test 10 random pages)
- ✅ Lighthouse Performance score >90
- ✅ Page bundle size <200KB (HTML + CSS + JS)

**Final Deployment Checkpoint:** ✅ 100 pages deployed meeting all targets → Epic 4 Complete

---

### Epic 5: Build & Deployment Pipeline

**Summary:** Establish build triggering, deployment to Netlify CDN, and status tracking workflow.

**Requirements Covered:** FR7, FR8

**Dependencies:** Epic 4 complete

**Duration:** 1-2 days

---

**ARCHITECT Research Items:**
- ⚠️ Build hook URL generation and security
- ⚠️ Manual vs automated trigger strategy for MVP
- ⚠️ Build monitoring and notification approach
- ⚠️ Rollback procedure implementation
- ⚠️ Environment variable security best practices

---

**Key Deliverables:**

**1. Manual Build Pipeline (MVP):**
- Netlify build hook created and documented
- Manual trigger process documented:
  1. Review approved pages in Airtable
  2. Trigger Netlify build via webhook URL or UI
  3. Monitor build progress in Netlify dashboard
  4. Verify deployment success
  5. Update Airtable page statuses to "Deployed" (manual)

**2. Deployment Runbook:**
- **Pre-Deployment Checklist:**
  - [ ] All pages in batch have Status = "Approved"
  - [ ] Content spot-checked for quality
  - [ ] Previous deployment successful (if applicable)
  - [ ] No pending build in Netlify queue
- **Deployment Steps:**
  - Step 1: Trigger build (webhook or UI)
  - Step 2: Monitor build logs for errors
  - Step 3: Verify build completes successfully
  - Step 4: Test deployed site (smoke tests)
  - Step 5: Update Airtable statuses
- **Post-Deployment Verification:**
  - [ ] Random sample of 5 pages render correctly
  - [ ] No 500 errors or console errors
  - [ ] Forms functional
  - [ ] Lighthouse score spot-check
- **Rollback Procedure:**
  - Access Netlify dashboard
  - Navigate to "Deploys" tab
  - Select previous successful deployment
  - Click "Publish deploy" to rollback
  - Document rollback reason in notes

**3. Troubleshooting Guide:**
- **Build Failures:**
  - Check build logs for specific error
  - Common issues: Missing env vars, Airtable API errors, Next.js build errors
  - Solutions for each common issue
- **500 Errors on Deployed Pages:**
  - Not expected with static export, but if encountered:
  - Check Netlify function logs (if accidentally using functions)
  - Verify all pages built correctly (check `out/` directory in build logs)
- **Performance Issues:**
  - Run Lighthouse on multiple pages
  - Identify common bottlenecks (images, fonts, CSS)
  - Apply optimizations from Epic 4.4

**4. Monitoring & Alerts:**
- Netlify email notifications for build failures
- Manual deployment success validation (no automation for MVP)

**Success Criteria:**
- ✅ Manual build triggered successfully
- ✅ Deployment runbook tested with 10-page batch
- ✅ Rollback procedure tested and verified
- ✅ Troubleshooting guide documents solutions to common issues
- ✅ Build time <5 minutes for 100 pages (per NFR target)

**Deployment Checkpoint:** ✅ 10-page batch deploys end-to-end via manual process → Epic 5 Complete

**Deferred to Phase 2 (Post-MVP):**
- Automated build triggers from Airtable (webhook on status change to "Approved")
- Automated status synchronization (Netlify → Airtable on deploy success)
- CI/CD pipeline integration
- Automated testing in deployment pipeline

---

### Epic 6: Multi-Tier Validation System

**Summary:** Execute systematic validation testing at increasing scale to prove production capability before pilot client delivery.

**Requirements Covered:** NFR1, NFR4, NFR5, System Capability Goals

**Dependencies:** ALL Epics 1-5 complete

**Duration:** 3-5 days

**⚠️ Cannot start until Epics 1-5 complete**

---

**ARCHITECT Research Items:**
- ⚠️ Automated validation tools (Lighthouse CLI, HTML validator, TCPA checker)
- ⚠️ Test data generation approach
- ⚠️ Performance benchmarking methodology
- ⚠️ Bottleneck identification tools
- ⚠️ Validation report format

---

**Tier 1 Validation: 10-20 Pages**

**Goal:** Prove end-to-end workflow functions correctly

**Duration:** 1 day

**Activities:**
1. Generate test client configuration in Airtable
2. Create 10-20 page requests (diverse service/location combinations)
3. Run Make.com content generation (Epic 3)
4. Human review and approval in Airtable (Epic 2)
5. Trigger build and deploy (Epic 5)
6. Quality validation:
   - **Manual:** Spot-check 100% of pages for content quality (all 10-20 pages)
   - **Automated:** TCPA compliance check (all pages)
   - **Automated:** Word count validation (all pages)
   - **Automated:** Lighthouse scoring (sample 5 pages)
   - **Automated:** HTML validation (sample 5 pages)
   - **Manual:** Cross-browser visual testing (sample 3 pages)

**Metrics to Track:**
- Content approval rate (target 90%+)
- Build success rate (target 95%+)
- Average Lighthouse scores
- Time: Content generation + build + deploy
- Issues found and categorized

**Success Criteria:**
- ✅ 90%+ pages approved without manual editing
- ✅ Build completes successfully (95%+ success rate)
- ✅ All pages deploy and render correctly
- ✅ Lighthouse scores 90+ on sampled pages
- ✅ No TCPA compliance failures
- ✅ Total time <30 minutes (generation + build + deploy)

**Failure Response:** If any criteria fail, iterate on prompts/templates/configuration. Do NOT proceed to Tier 2 until Tier 1 passes.

---

**Tier 2 Validation: 50-100 Pages**

**Goal:** Validate scaling behavior and identify bottlenecks

**Duration:** 1-2 days

**Activities:**
1. Generate 50-100 page requests in Airtable
2. Run Make.com batch processing (monitor API rate limits)
3. Track generation time and batch processing behavior
4. Human batch review (spot-check 20% random sample = 10-20 pages)
5. Trigger build and monitor build time scaling
6. Quality validation:
   - **Automated:** TCPA + word count checks (all pages)
   - **Automated:** Lighthouse scoring (sample 10 pages)
   - **Manual:** Content quality spot-check (20% random sample)
   - **Performance:** Measure build time, compare to Tier 1

**Metrics to Track:**
- Generation time per page (individual and total batch)
- Build time scaling (linear? sub-linear?)
- API quota consumption (Claude, Airtable, Make.com operations)
- Netlify build minutes used
- Content approval rate (maintain 90%+)
- Build success rate (maintain 95%+)

**Success Criteria:**
- ✅ Content generation scales linearly (2x pages ≤ 2x time)
- ✅ Build time <15 minutes for 100 pages
- ✅ 95%+ successful build rate (no failed page generation)
- ✅ 90%+ approval rate maintained
- ✅ No API rate limit issues or failures
- ✅ Lighthouse scores remain 90+ on samples
- ✅ No new issues compared to Tier 1

**Bottleneck Analysis:**
- Identify slowest step (generation vs build vs deploy)
- Measure API wait times (rate limiting impact)
- Assess resource usage (build minutes, operations quota)

**Failure Response:** Identify bottlenecks, optimize (batch sizes, caching, build config), re-test Tier 2. Do NOT proceed to Tier 3 until scaling validated.

---

**Tier 3 Validation: 250-500 Pages**

**Goal:** Prove production-scale capability before pilot client

**Duration:** 1-2 days

**Activities:**
1. Generate 250-500 page requests (production-scale batch)
2. Execute full workflow end-to-end (Epic 1-5)
3. Monitor system behavior at scale
4. Validate quality metrics hold at scale
5. Performance validation:
   - **Automated:** All compliance checks (TCPA, word count, HTML validation)
   - **Automated:** Lighthouse scoring (sample 20 pages)
   - **Manual:** Content quality spot-check (10% = 25-50 pages)
   - **Performance:** Core Web Vitals validation on random sample

**Metrics to Track:**
- Total workflow time (generation → build → deploy)
- Build time for 500 pages
- Resource consumption (API quotas, build minutes)
- Quality metrics (approval rate, Lighthouse scores, Web Vitals)
- System failures or errors encountered

**Success Criteria:**
- ✅ Build completes in <20 minutes for 500 pages (target: <15 min from PRD)
- ✅ 95%+ build success rate maintained
- ✅ 90%+ approval rate maintained
- ✅ No system failures or errors
- ✅ Performance targets met (Core Web Vitals: LCP <2.5s, FID <100ms, CLS <0.1)
- ✅ Lighthouse scores 90+ on random sample
- ✅ All automated validations pass

**Go/No-Go Decision Point:**

**GO:** All Tier 3 success criteria met → System ready for pilot client delivery

**NO-GO:** Any criteria failed → Identify root cause, resolve issues, repeat Tier 3 validation

---

**Epic 6 Additional Deliverables:**

**1. Test Data Generation Scripts:**
- Client configuration generator (realistic contractor data)
- Page request batch generator (service/location combinations)
- Data cleanup/reset utilities (clear test data between tiers)

**2. Automated Validation Tools:**
- TCPA keyword checker script (searches for required compliance terms)
- Word count validator (minimum 800 words)
- Lighthouse scoring automation (CLI script to test multiple pages)
- HTML validation integration (W3C validator API)

**3. Validation Reports:**
- **Tier 1 Report:** Quality metrics, issues found, time metrics, pass/fail status
- **Tier 2 Report:** Scaling analysis, bottleneck identification, resource usage, pass/fail
- **Tier 3 Report:** Production readiness assessment, final quality metrics, go/no-go recommendation

**4. Performance Baseline Documentation:**
- Generation time per page (average across all tiers)
- Build time scaling curve (10 → 100 → 500 pages)
- Resource usage (API quotas consumed, build minutes used)
- Quality metrics baseline (approval rates, Lighthouse scores, Web Vitals)

**Final Success Criteria:**
- ✅ All three tiers pass validation criteria
- ✅ Performance targets met at 500-page scale
- ✅ No blocking issues identified
- ✅ System validated as ready for pilot client delivery
- ✅ Validation reports document production readiness

**Final Gate:** ✅ Epic 6 Complete → **READY FOR PILOT CLIENT**

---

## Checklist Results Report

_[To be completed]_

---

## Next Steps

### Immediate Actions (ARCHITECT - Pre-Epic 0)

**Timeline:** 0.5-1 day

**Project Infrastructure Setup:**

**Task 1: Create Fresh GitHub Repository**
- Create NEW repository (clean start, no legacy BMAD folders from current repo)
- Repository name: To be proposed by Architect (e.g., `landing-pages-automation` or `local-seo-page-generator`)
- Set to Private initially
- Initialize with README or basic scaffold
- Add collaborators:
  - Jon Steiner (Admin access)
  - Developer (Write access when assigned)
- Document repo URL in handoff document

**Task 2: Create Netlify Site**
- Use Jon's Netlify account (credentials provided separately)
- Create new Netlify site for this project
- Connect GitHub repository to Netlify site
- Configure initial build settings (placeholders, will be refined in Epic 0.2):
  - Build command: `npm run build` (placeholder)
  - Publish directory: `out` (Next.js static export default)
  - Base directory: TBD by Architect (depends on monorepo decision)
- Document critical information:
  - Netlify Project ID: `[To be filled by Architect]`
  - Netlify site URL: `[To be filled by Architect]`
  - Build hook URL: `[To be filled by Architect - store securely]`
- Add Jon as site collaborator/admin if needed

**Task 3: Verify GitHub ↔ Netlify Connection**
- Push initial test commit to GitHub (e.g., README or basic HTML file)
- Trigger test deployment to Netlify (auto-deploy on push or manual trigger)
- Verify build succeeds (even if just static HTML)
- Verify deployed site is accessible via Netlify URL
- Test for any errors (build failures, 500 errors, path issues)
- **GATE:** Connection verified and deployment successful → Proceed to Epic 0.1 Research

**Task 4: Developer Handoff Documentation**
Create handoff document with:
- GitHub repository URL
- GitHub access instructions (how to clone, branch strategy)
- Netlify Project ID
- Netlify site URL
- Netlify build hook URL (secure storage)
- Environment variables list (if any at this stage)
- Access credentials documentation (where stored, how to access)

**Deliverables:**
- ✅ Fresh GitHub repository created and accessible
- ✅ Netlify site created and connected to GitHub
- ✅ Test deployment successful
- ✅ All credentials and IDs documented
- ✅ Developer onboarding doc ready

**Prerequisites for Jon to Provide:**
- Netlify account credentials OR add Architect as team member
- Confirmation of desired repository name (or let Architect propose)
- Any organizational/naming preferences

---

### Epic 0-7 Execution (ARCHITECT + Development Team)

**✅ Epic 0 COMPLETE: Foundation & Infrastructure**
- **Phase 0.1:** ✅ COMPLETE - Architecture research and ADR creation (30-35 ADRs, 78 files)
- **Phase 0.2:** ✅ COMPLETE - Deployment baseline (LCP 179ms, 3 test pages)
- **Phase 0.3:** ✅ COMPLETE - Airtable integration (10 pages from content.json)
- **Phase 0.4:** ✅ COMPLETE - Content enhancement (3-table fetch, 40+ lookups, component data contracts)
- **Status:** ✅ FOUNDATION COMPLETE - Ready for feature epic development
- **Gate:** ✅ All architecture validated in production

**✅ Epic 1 COMPLETE: Airtable Schema & Data Management**
- **Status:** ✅ COMPLETE - Production-ready and LOCKED
- **Delivered:** 12-table schema (3,000 page capacity) with relationships, rollup fields, automations
- **Schema:** Clients, Services, Locations, Branch Locations, Service Areas, Branch Staff, Pages, CTAs, Hero Images, Testimonials, Offers, Campaigns
- **Gate:** ✅ Schema locked for production use

**🟢 Epic 2 READY TO START: Component Development System (NEW)**
- **Status:** 🟢 AUTHORIZED TO PROCEED
- **Duration:** 16-24 hours (2-3 days)
- **Lead:** Dev Agent
- **Stories:** 7 stories (HeroSection → FAQAccordion → Page Layout Integration)
- **Dependencies:** Epic 0 + Epic 1 complete ✅
- **Deliverables:** 6 React components, dynamic branding, responsive design, WCAG 2.1 AA compliance
- **Next Action:** Create Story 2.1 (HeroSection Component Implementation)

**⏸️ Epic 3 PENDING: Scale Testing & Performance Validation (NEW)**
- **Status:** Pending Epic 2 complete
- **Duration:** 1-2 days
- **Stories:** 5 stories (Test Data → Performance Benchmarking → QA)
- **Dependencies:** Epic 2 complete
- **Deliverables:** 50-100 pages deployed, Core Web Vitals validated, performance baseline documented

**⏸️ Epic 4 PENDING: Form Submission Integration (RENAMED from old Epic 2)**
- **Status:** Pending Epic 3 complete
- **Duration:** 3-4 days
- **Stories:** 5 stories (Form UI → GTM → Make.com → Salesforce → Testing)
- **Dependencies:** Epic 3 complete
- **Deliverables:** 3-stage forms, Make.com webhook, Salesforce integration, GTM tracking

**⏸️ Epic 5-7 PENDING: Advanced Features & Validation (RENUMBERED)**
- **Epic 5:** Landing Page Generation - Partially Complete (advanced features pending)
- **Epic 6:** Build & Deployment Pipeline - Partially Complete (documentation pending)
- **Epic 7:** Multi-Tier Validation (Tier 3 only, 2-3 days) - Pending Epic 6 complete
- **Dependencies:** Epic 4 complete for Epic 5, sequential thereafter

**🔄 Epic 8 DEFERRED: AI Content Generation System (Phase 2)**
- **Status:** 🔄 DEFERRED TO PHASE 2 (Post-MVP)
- **Rationale:** Phase 1 prioritizes component development + forms to validate conversion capability before adding AI complexity
- **When Implemented:** 4-6 days (Claude API integration, prompt engineering, quality validation)
- **See:** Phase 2 Roadmap section for complete AI Content Generation System details

**Total Estimated Duration:** 18-28 days (Epic 0-7, sequential execution)

**Current Progress:**
- ✅ Epic 0-1 COMPLETE (~8-10 days delivered)
- 🟢 Epic 2-4 READY (~6-9 days remaining)
- ⏸️ Epic 5-7 refinement (~4-9 days remaining)

**Immediate Next Action:** Create Story 2.1 (HeroSection Component Implementation) to begin Epic 2

---

### Post-Epic 6: Pilot Client Delivery

**Prerequisites:**
- ✅ Epic 6 complete with all validation tiers passed
- ✅ Go decision from Tier 3 validation
- ✅ System proven at 500-page scale

**Pilot Client Onboarding:**
1. Client selection and agreement
2. Brand guidelines and service area collection
3. Client configuration in Airtable
4. Page request generation (100-200 pages typical)
5. Content generation and approval
6. Deployment to client domain (or subdomain)
7. Performance monitoring and iteration

**Success Metrics (from PRD Goals):**
- SEO Performance: 90+ Lighthouse SEO scores, Core Web Vitals passing
- Organic Traffic Growth: 50%+ increase within 90 days
- Ranking Success: Top-10 for 70%+ keywords within 6 months
- Lead Generation: 20%+ cost-per-lead reduction

---

### Phase 2 Roadmap (Post-MVP)

**Major Features (Deferred from Phase 1):**

**AI Content Generation System (Epic 3 - DEFERRED):**
- Master prompt template for Claude API with variable placeholders (client, service, location, brand voice)
- Make.com content generation scenario (fetch pending pages → call Claude API → store results → update status)
- Output schema definition (JSON contract for Airtable storage and Next.js consumption)
- Quality validation checks (word count, TCPA compliance, metadata completeness, keyword density)
- Batch processing with rate limit handling (50 requests/minute for Claude API)
- Error handling and retry logic
- Multi-tier validation (10 pages → 50 pages → 100 pages)
- Message match validation (ad headline alignment scoring)

**Automation & Integration Enhancements:**
- Automated build triggers (Airtable webhook → Netlify on status change to "Approved")
- Automated status synchronization (Netlify → Airtable on deploy success)
- CI/CD pipeline integration (GitHub Actions for testing and deployment)
- Automated testing in deployment pipeline (Lighthouse CI, HTML validation, accessibility checks)
- Additional CRM integrations (HubSpot, other platforms for multi-client support)
- Traditional test suites (unit tests, integration tests, E2E tests)

**Platform & Operational Features:**
- Multi-client management features (client-specific dashboards, permission management)
- Analytics and reporting dashboard (conversion tracking, page performance, lead attribution)
- Content version control and approval workflow enhancements
- A/B testing capability (Page Variants table from airtable-data-model-v2-FUTURE.md)

**Rationale:** Phase 1 prioritizes delivery of working static site with forms and Salesforce integration to validate conversion capability before adding AI content generation complexity.

---

### Key Decision Points & Gates

**Gate 1: Infrastructure Ready** (Pre-Epic 0)
- GitHub + Netlify connected and tested
- Decision: Proceed to Epic 0.1 research

**Gate 2: Architecture Approved** (Post-Epic 0.1)
- All ADRs reviewed by PM
- Decision: Proceed to development with approved architecture

**Gate 3: Deployment Baseline Proven** (Post-Epic 0.2)
- "Hello World" deploys successfully
- Decision: Proceed to project scaffolding

**Gate 4: Content Schema Locked** (Post-Epic 1)
- Output schema finalized and approved
- Decision: Epic 2 and Epic 4 can use schema as contract

**Gate 5: Airtable Schema Locked** (Post-Epic 2)
- Schema validated against Epic 1 output
- Decision: Epic 3 and Epic 4 integration can proceed

**Gate 6: End-to-End Workflow Validated** (Post-Epic 5)
- 10-page batch deploys successfully end-to-end
- Decision: Proceed to multi-tier validation

**Gate 7: Production Readiness** (Post-Epic 6 Tier 3)
- All validation criteria met at 500-page scale
- Decision: GO/NO-GO for pilot client delivery

---

### ARCHITECT Handoff Package

When handing off to Architect, provide:

**Documents:**
- This PRD (complete requirements and epic specifications)
- Project Brief (background and business context)
- Post-Mortem from previous deployment attempt (lessons learned)

**Access:**
- Netlify account credentials or team membership
- GitHub organization access (if applicable)

**Context:**
- Previous Next.js + Netlify deployment failures (post-mortem details)
- Rationale for build-time static generation (no serverless functions)
- Big Bang research strategy preference (all 60 items upfront)

**Expected Deliverables from Architect:**
- Fresh GitHub repository (clean, no BMAD folders)
- Netlify site connected and test deployment successful
- Comprehensive ADRs for all 60 research items
- Reference implementation URLs and analysis
- Configuration file templates
- Developer handoff document

**Timeline:**
- Infrastructure setup: 0.5-1 day
- Big Bang research: 5-8 days
- Total Architect phase: ~6-9 days before development starts

---

### Communication & Coordination

**Architect ↔ PM:**
- Daily check-ins during research phase (optional)
- ADR review session when research complete
- Approval required before development handoff

**Architect ↔ Developer:**
- Comprehensive handoff document (all ADRs, config templates, runbooks)
- Office hours during Epic 0-4 for clarification questions
- Escalation path for architectural issues discovered during development

**PM ↔ Developer:**
- Epic completion reviews (validate success criteria met)
- Gate approvals at key decision points
- Pilot client coordination when ready

---

### Risk Management

**High-Risk Items:**
- Next.js 15 + Netlify compatibility (mitigated by Epic 0 research + reference implementations)
- Monorepo vs flat structure decision (mitigated by testing both, contingency for flattening)
- API rate limits at scale (mitigated by Epic 6 multi-tier validation)
- Content quality at scale (mitigated by Epic 1 validation + Epic 6 approval rate tracking)

**Mitigation Strategies:**
- Research-First development workflow (prevent assumption-based failures)
- Incremental deployment checkpoints (catch issues early)
- Validation gates at epic boundaries (no proceeding until success criteria met)
- Rollback procedures documented (quick recovery from failures)

---

### Success Criteria for PRD Completion

This PRD is considered complete and ready for execution when:
- ✅ All sections filled in (Goals, Requirements, Technical Assumptions, Epics, Next Steps)
- ✅ All ARCHITECT research items documented
- ✅ All epic success criteria defined
- ✅ All deployment checkpoints specified
- ✅ PM reviewed and approved
- ✅ Handed off to ARCHITECT for infrastructure setup and research

**PRD Status:** ✅ COMPLETE - Ready for ARCHITECT handoff

**Next Action:** Hand off to ARCHITECT for GitHub/Netlify setup and Epic 0.1 research
