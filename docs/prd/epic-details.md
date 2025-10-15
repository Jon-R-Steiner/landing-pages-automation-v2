# Epic Details

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
