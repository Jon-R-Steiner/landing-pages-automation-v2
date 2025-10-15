# Technical Assumptions

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
