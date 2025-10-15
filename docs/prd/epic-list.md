# Epic List

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
