# Project Brief: Landing Pages Automation

---

## Executive Summary

**Landing Pages Automation** is an AI-driven autonomous development system designed to produce 500+ high-converting, SEO-optimized landing pages per week for home services contractors through intelligent multi-agent coordination.

**Problem:** Manual software development workflows cannot scale to handle high-volume content generation. Creating 500 pages/week would require 250 hours of manual work—impossible for a solo developer with 40 hours available. Even with AI assistance, coordination overhead (context switching, error recovery, agent handoffs) consumes 50%+ of productive time.

**Target Market:** Solo developers and small agencies serving home services contractors (bathroom remodeling, HVAC, roofing) who need local SEO dominance through geographic and service-specific landing pages.

**Key Value Proposition:** Autonomous multi-agent coordination enabling superhuman development leverage—one developer achieves what previously required teams through intelligent agent orchestration with minimal human intervention.

**Immediate Focus:** This brief defines the foundational infrastructure (specialized agents, living documentation, integrations, session configuration) required to enable autonomous execution toward the 500 pages/week vision.

---

## Problem Statement

### Current State and Pain Points

**Home services contractors need massive local SEO presence but manual landing page creation doesn't scale.**

**Market Reality:**
- **Client need:** 100+ location-specific pages (e.g., "Bathroom Remodeling in [City]")
- **Service combinations:** 5-10 services × 20+ locations = 200+ unique pages needed
- **Quality requirements:** High-converting copy, SEO-optimized, TCPA-compliant, brand-consistent
- **Timeline expectations:** Weekly content updates to maintain SEO momentum

**Current Manual Approach:**
- Research keyword/location: 15 minutes
- Write converting copy: 45 minutes
- Design and optimize: 30 minutes
- SEO metadata and validation: 20 minutes
- Deploy and test: 10 minutes
- **Total: 2 hours per page**

**The scaling problem:**
- Single contractor client needs 200 pages minimum
- At 2hrs/page manual = 400 hours of work
- At $75/hr copywriting rate = $30,000 per client
- **Outcome:** Pricing makes it unaffordable for most contractors; manual approach serves only enterprise clients

**Pain points for developers/agencies:**
- Cannot serve high-volume clients profitably at manual rates
- Quality inconsistency across hundreds of pages
- Content updates require massive rework
- Compliance risks (TCPA, accessibility) when scaling manually

### Impact of the Problem

**For Your Business:**
- Opportunity: Large market of contractors needing local SEO
- Constraint: Manual/semi-manual approaches don't achieve target economics
- Goal: 500 pages/week capability enables serving 10-20 contractor clients simultaneously
- Economics: Automation makes service affordable ($2-5k vs $30k) = larger addressable market

**For Contractors (Your Customers):**
- Lost revenue from not ranking in local search
- Competitors with better SEO presence capture leads
- Cannot afford traditional agency pricing for comprehensive coverage
- DIY approaches produce low-quality, non-converting pages

### Why Existing Solutions Fall Short

**Manual Copywriting Agencies:**
- Cost: $100-200/page makes comprehensive coverage unaffordable
- Speed: Weeks-to-months turnaround for large page sets
- Consistency: Quality varies across writers
- **Fails at:** Scaling to hundreds of pages economically

**DIY Page Builders/Templates:**
- Output: Generic, low-quality content that doesn't convert
- SEO: Poor optimization, duplicate content penalties
- Compliance: No TCPA or accessibility considerations
- **Fails at:** Quality that drives actual business results

**Existing AI Content Tools:**
- Lack context about brand voice, service specifics, local nuances
- Require heavy manual editing and prompt engineering per page
- No deployment automation or workflow orchestration
- **Fails at:** True end-to-end automation with quality control

**None provide complete solution: high-quality AI content generation + workflow orchestration + automated deployment at scale.**

### Urgency and Importance

**Why build this now:**

**Market Timing:**
- AI content generation capabilities (Claude, GPT-4) now produce genuinely high-quality output
- Home services market increasingly competitive on local SEO
- Contractors recognize need but solutions remain expensive/inadequate

**Technical Capability:**
- Claude's long-context windows enable sophisticated brand voice understanding
- Airtable + Make.com provide workflow orchestration infrastructure
- Astro/Netlify enable performant, SEO-optimized static deployment

**Competitive Advantage:**
- First-mover advantage in "AI-native agency" positioning
- Proof of concept demonstrates capability for broader markets (legal, medical, real estate)
- Reusable infrastructure for future vertical expansions

---

## Proposed Solution

### Core Concept and Approach

**A build-time content generation system that front-loads all logic and automation, producing static HTML deployed to CDN with zero runtime dependencies.**

**Architectural Principle: "Generate Once, Deploy Everywhere"**
- Content generation: Orchestrated via Airtable + Make.com triggering Claude API
- Site generation: Next.js static export (`output: 'export'`) at build time
- Deployment: Pure static files to Netlify CDN
- No serverless functions, no runtime logic, no deployment-time complexity

**System Architecture:**

**1. Content Orchestration Layer** (Airtable + Make.com)

**Airtable:**
- **Source of truth:** Client configs, page requests, generated content, status tracking
- **Trigger role:** Simple webhook trigger to Make.com when records ready for processing
- **Status management:** Track content through workflow (Pending → Generating → Ready for Review → Approved → Deployed)

**Make.com:**
- **Primary orchestration engine:** Handles complex API workflows beyond Airtable's 30-second timeout limit
- **Parallel processing:** Generate multiple pages concurrently (vs. sequential in Airtable)
- **Error handling:** Sophisticated retries, partial batch success, rate limiting
- **Claude API integration:** Native HTTP modules for reliable external API calls

**Why Make.com is necessary** (based on research):
- Airtable automation script timeout: 30 seconds (too short for Claude batch generation)
- Airtable fetch limit: 50 requests per script (insufficient for 100-page batches)
- Airtable fetch is synchronous/blocking (prevents parallel processing)
- Make.com scenarios: 40+ minute runtime, unlimited HTTP requests, parallel execution
- Better error handling for production-scale API orchestration

**2. Content Generation Layer** (Claude API via Make.com)
- **Triggered by:** Make.com scenario when Airtable records enter "Pending" status
- **Batch processing:** 50-100 pages per Make.com scenario run
- **Parallel execution:** Multiple Claude API calls in parallel (where rate limits allow)
- **Content storage:** Generated content written back to Airtable with validation status
- **Error handling:** Failed generations flagged for manual review, successful ones continue

**3. Build Layer** (Next.js Static Export)
- **Build trigger:** Netlify webhook from Airtable/Make.com when content batch approved
- **Build process:**
  - Fetch all "Approved" content from Airtable API via REST
  - Generate static pages using Next.js `getStaticProps` → `output: 'export'`
  - Estimated build time: 10-15 minutes for 500 pages
- **Output:** Pure HTML/CSS/JS static files (no server components, no ISR)
- **Tailwind CSS:** Pre-built conversion-optimized component templates

**4. Deployment Layer** (Netlify)
- **Static file hosting only:** No functions, no edge logic, no runtime complexity
- **Atomic deploys:** All-or-nothing deployment with instant rollback capability
- **Build limits validated:** Netlify supports builds up to 30 minutes (500 pages well within limits)
- **Status webhook:** Deployment complete → webhook back to Airtable updates status

**The Pipeline:**
```
Airtable: New page request records created (batch of 100)
  ↓
Airtable Automation: Trigger Make.com webhook
  ↓
Make.com Scenario:
  - Fetch pending records from Airtable
  - For each page: Call Claude API (parallel where possible)
  - Handle errors, retries, rate limiting
  - Write generated content back to Airtable
  - Update status to "Ready for Review"
  ↓
Human: Approve content batch in Airtable (automated validation + spot check)
  ↓
Airtable/Make.com: Trigger Netlify build webhook (when batch approved)
  ↓
Next.js Build:
  - Fetch all "Approved" content from Airtable API
  - Generate static pages at build time
  - Output static files
  ↓
Netlify: Deploy static files to CDN
  ↓
Netlify Webhook: Update Airtable deployment status
```

**MVP Build Cadence:**
- **Content generation:** Daily batches of 100 pages (Monday-Friday)
- **Deployment:** Weekly builds on Friday (500 pages/week target)
- **Approval workflow:** Automated validation (word count, required sections, TCPA keywords) + human spot-check before build

### Key Differentiators from Existing Solutions

**1. Build-Time Generation (Lesson from Failed Attempt)**
- **Previous failure:** Netlify Functions for runtime content generation
  - Cold start delays, timeout errors, inconsistent performance
  - Complex debugging when pages failed to generate at deploy time
  - Runtime failures meant broken production deployments
- **New approach:** All generation happens before deployment
  - Deterministic builds: Same Airtable data = identical output
  - Test builds locally before production
  - Deployment is just static file upload (bulletproof)

**2. Separation of Concerns**
- **Previous failure:** Build logic mixed with content logic created deployment brittleness
- **New approach:** Clear boundaries
  - Content creation (Make.com + Claude) fully decoupled from site building (Next.js)
  - Can regenerate content without rebuilding site
  - Can rebuild site without regenerating content
  - Each layer testable independently

**3. Make.com for Complex Orchestration**
- **Research finding:** Airtable automations insufficient for production-scale API workflows
- **Make.com advantages:**
  - No timeout limits (vs. Airtable's 30 seconds)
  - Parallel processing capabilities
  - Production-grade error handling and retries
  - Native integrations with both Airtable and Claude

**4. Quality Through Context**
- Claude's long-context windows ingest complete brand guidelines
- Maintains voice consistency across hundreds of pages
- Learns from examples rather than generic templates

**5. Compliance-First Design**
- TCPA requirements built into content generation prompts
- WCAG accessibility standards enforced in Next.js templates
- Automated validation in approval workflow
- Legal compliance automated, not afterthought

**6. Production-Ready Performance**
- Next.js static export delivers sub-second page loads
- SEO-optimized from infrastructure level (not just content)
- Scalable to thousands of pages without performance degradation

### Why This Solution Will Succeed

**Leverages lessons from failed attempt:**
- **Front-load all logic:** No runtime complexity, all generation at build time
- **Simple deployment:** Static files only, no serverless debugging nightmares
- **Clear boundaries:** Airtable (data) → Make.com (orchestration) → Next.js (build) → Netlify (host)
- **Research-validated:** Make.com necessity confirmed through Airtable automation limitations research

**Addresses root causes:**
- **Economics:** AI generation at $0.02-0.10/page vs. $100-200/page manual
- **Speed:** 500 pages/week capability with daily 100-page batches
- **Quality:** Consistent brand voice, automated compliance validation
- **Reliability:** Deterministic builds eliminate runtime failures

**Technical validation:**
- Next.js static export: proven, mature capability
- Airtable API: stable, well-documented
- Make.com: production-grade orchestration platform
- Claude API: handles batch processing effectively
- Netlify static hosting: bulletproof simple

**Market validation:**
- Home services contractors proven to invest in SEO
- Existing demand for localized landing pages
- Price point ($2-5k per client) accessible to mid-market contractors
- Replicable model across industries (legal, medical, real estate)

### High-Level Vision for the Product

**Immediate (MVP):** Automated landing page generation system producing 500+ SEO-optimized, TCPA-compliant pages/week with build-time generation, Make.com orchestration, and static deployment.

**Near-term (6-12 months):**
- Self-service interface for contractor configuration in Airtable
- Performance analytics integration to track conversion rates
- A/B testing via multiple page variants
- Content update workflows (regenerate specific pages, not full site)

**Long-term (1-2 years):**
- Multi-industry templates (legal, medical, real estate)
- Full content marketing platform (blogs, service pages, case studies)
- White-label offering for agencies serving contractor clients
- AI-native agency positioning: "What used to require a team, now runs automatically"

---

## Target Users

### Primary User Segment: Solo Developer / Small Agency Owner

**Profile:**
- **Role:** Freelance web developer or 1-3 person digital agency
- **Current business:** Builds websites and provides digital marketing for local service businesses
- **Technical skill:** Comfortable with modern web technologies (Next.js, APIs, deployment platforms)
- **Business model:** Project-based fees ($2k-10k per website) + potential monthly retainers

**Current Behaviors and Workflows:**
- Manually builds custom landing pages or uses page builders (Webflow, WordPress)
- Spends 10-15 hours per client website
- Can handle 2-4 client projects simultaneously
- Limited by personal time availability for content creation and page building
- Often outsources copywriting ($100-500 per project) or does basic SEO copy themselves

**Specific Needs and Pain Points:**
- **Scaling constraint:** Cannot serve more than 8-10 clients/year with current manual approach
- **Content bottleneck:** Copywriting is expensive to outsource or time-consuming to DIY
- **Client expectations:** Contractors want comprehensive local SEO coverage (100+ pages) but balk at appropriate pricing
- **Revenue ceiling:** Project fees limited by hours available, not value delivered
- **Competitive pressure:** Larger agencies with teams can deliver faster and cheaper at scale

**Goals They're Trying to Achieve:**
- **Increase revenue without hiring:** Serve 20-30 clients/year (vs. current 8-10) as solo operator
- **Offer premium service:** Comprehensive landing page coverage (100-500 pages) as high-value offering
- **Improve margins:** Reduce time per project from 10-15 hours to 2-3 hours (setup + oversight)
- **Recurring revenue:** Monthly content updates and new page generation as retainer service
- **Competitive positioning:** Offer capabilities previously only available from large agencies

**Why This System Solves Their Problems:**
- Automates the most time-consuming parts (content generation, page building)
- Enables offering 200-500 page packages profitably (previously impossible solo)
- Shifts role from "doer" to "orchestrator" (setup systems, oversee quality, manage clients)
- Creates recurring revenue opportunity (monthly batches of new pages)
- Provides competitive differentiation ("AI-powered agency capabilities")

### Secondary User Segment: Home Services Contractor (End Client)

**Profile:**
- **Business type:** Local home services (bathroom remodeling, HVAC, roofing, plumbing)
- **Service area:** Single metro area or region (10-30 cities/towns)
- **Business size:** $500k-$5M annual revenue, 5-20 employees
- **Marketing sophistication:** Understands SEO value but not technical implementation

**Current Behaviors and Workflows:**
- Invests $1k-5k/month in Google Ads and SEO
- Works with freelancer or small agency for website/marketing
- Focused on lead generation and phone calls from local search
- Tracks leads by source (organic search, paid ads, referrals)
- Makes decisions based on ROI and cost-per-lead metrics

**Specific Needs and Pain Points:**
- **SEO competition:** Competitors with better local search presence capture leads first
- **Geographic coverage:** Serves 20+ cities but website only ranks for 2-3
- **Service-specific pages:** Offers 5-10 services but generic pages don't rank or convert
- **Budget constraints:** $30k for comprehensive landing pages (200+ pages) isn't realistic
- **Content updates:** Wants to add new service areas regularly but current agency charges $500-1000/page

**Goals They're Trying to Achieve:**
- **Rank in local search:** Show up for "[service] in [city]" searches across entire service area
- **Increase lead volume:** Convert more organic visitors to phone calls and form submissions
- **Reduce ad spend:** Organic ranking reduces dependency on expensive Google Ads
- **Professional presence:** High-quality, branded pages that build trust and credibility
- **Measurable ROI:** Track which pages/locations generate most leads

**Why This System Solves Their Problems:**
- Affordable comprehensive coverage ($2-5k vs. $30k traditional pricing)
- All service/location combinations covered (200-500 unique, high-quality pages)
- Professional, branded content (not generic templates)
- Fast turnaround (weeks vs. months for traditional agencies)
- Ongoing updates feasible (monthly new pages at sustainable cost)

**Relationship Between User Segments:**
- Primary user (developer/agency) is the customer who purchases/implements the system
- Secondary user (contractor) is the end client who benefits from the landing pages
- System success requires serving both: developer needs profitable business model, contractor needs ROI from pages

---

## Goals & Success Metrics

### Business Objectives

- **Revenue scaling:** Enable serving 20-30 contractor clients/year (vs. current 8-10 manual capacity) as solo developer/agency
- **Margin improvement:** Reduce delivery time from 10-15 hours/project to 2-3 hours (setup + oversight), improving margins by 70-80%
- **Market positioning:** Establish "AI-powered local SEO" service offering as competitive differentiator in crowded web dev market
- **Recurring revenue:** Convert 50% of project clients to monthly retainer (ongoing page generation and updates) within 6 months
- **Proof of concept completion:** Successfully deliver 500-page package to first pilot client within 8 weeks of MVP completion

### User Success Metrics

- **Content generation throughput:** Achieve 500 pages/week generation capacity (100 pages/day M-F)
- **Content quality:** 90%+ of generated content approved without manual editing (human spot-check only)
- **Build reliability:** 95%+ successful builds with zero runtime deployment failures
- **System uptime:** Make.com + Airtable + Netlify pipeline maintains 99%+ availability
- **End client satisfaction:** Pilot client reports measurable increase in organic search traffic within 90 days

### Key Performance Indicators (KPIs)

**System Performance:**
- **Pages generated per week:** Target 500, minimum acceptable 300
- **Average generation time:** < 2 minutes per page (Claude API + validation + storage)
- **Build time for 500 pages:** 10-15 minutes (Next.js static export)
- **Content approval rate:** 90%+ pages approved on first generation

**Business Impact:**
- **Time per client project:** Reduce from 15 hours to 3 hours (80% reduction)
- **Clients served per year:** Increase from 8-10 to 20-30 (200-300% growth)
- **Project profitability:** Increase margin from $60/hr to $200/hr effective rate
- **Client retention:** 50%+ convert to monthly retainer within 6 months

**Technical Reliability:**
- **Failed builds:** < 5% of build attempts
- **Content generation errors:** < 10% of pages require retry
- **Deployment rollbacks:** < 2% of deployments
- **Manual intervention rate:** < 5% of pages require human editing

**End Client Results (Tracked for Pilot):**
- **Organic search traffic:** 50%+ increase within 90 days
- **Keyword rankings:** Rank top 10 for 70%+ of target location/service combinations within 6 months
- **Lead volume:** 25%+ increase in form submissions + phone calls from organic search
- **Cost per lead:** Reduce overall marketing cost per lead by 20%+ (due to reduced Google Ads dependency)

---

## MVP Scope

### Core Features (Must Have)

**1. Airtable Content Management System**
- **Description:** Central database for client configurations, page requests, generated content, and status tracking
- **Rationale:** Single source of truth for all content and workflow state; enables non-technical content approval workflow
- **Required fields:** Client ID, brand guidelines, service types, locations, page status (Pending/Generating/Ready/Approved/Deployed), generated content, metadata

**2. Make.com Orchestration Scenarios**
- **Description:** Automated workflows for Claude API integration, batch processing, error handling, and Airtable updates
- **Rationale:** Research validated that Airtable native automations insufficient for production-scale Claude API workflows (30sec timeout, 50 fetch limit)
- **Must include:** Trigger from Airtable webhook, fetch pending records, parallel Claude API calls (batch sizes: 10-20, then 50-100, then 250-500 in phases), error handling with retries, write content back to Airtable, status updates

**3. Claude API Content Generation**
- **Description:** AI-powered landing page content generation with brand voice, location specificity, SEO optimization, and TCPA compliance
- **Rationale:** Core value proposition—high-quality content at scale that manual copywriting cannot match economically
- **Must include:** Brand voice learning from examples, location/service variable injection, SEO metadata generation, TCPA compliance validation in prompts, consistent output format for Next.js consumption

**4. Next.js Static Site Generator**
- **Description:** Build-time page generation fetching approved content from Airtable and outputting static HTML/CSS/JS
- **Rationale:** Lessons learned—runtime logic failed; build-time generation is deterministic, testable, bulletproof deployment
- **Must include:** Airtable API integration for content fetch, `getStaticProps` for each page type, `output: 'export'` configuration, Tailwind CSS responsive templates, SEO-optimized HTML structure

**5. Netlify Static Hosting & Deployment**
- **Description:** CDN hosting for static files with webhook-triggered builds and deployment status reporting
- **Rationale:** Simple, reliable static hosting avoids all serverless complexity from failed previous attempt
- **Must include:** Netlify build configuration, webhook endpoint for build triggers, atomic deployments, rollback capability, deployment status webhook back to Airtable

**6. Content Approval Workflow**
- **Description:** Human-in-the-loop validation before deployment with automated quality checks + manual spot-checking
- **Rationale:** 500 pages/week impossible with line-by-line editing; automated validation + spot-checks balance quality and throughput
- **Must include:** Automated validation rules (word count min/max, required sections present, TCPA keywords present), Airtable interface for batch approval, flag individual pages for manual review

### Out of Scope for MVP

- **No self-service contractor interface** - Developer/agency manually configures Airtable for clients (self-service is Phase 2)
- **No analytics integration** - Tracking scripts in pages OK, but no dashboard/reporting of performance (Phase 2)
- **No A/B testing** - Single page variant per location/service combination (Phase 2 enhancement)
- **No content update workflows** - MVP is initial page generation only; updating existing pages is Phase 2
- **No multi-industry templates** - Home services only for MVP; legal/medical/real estate templates are Phase 2+
- **No white-label branding** - System is for single developer/agency use, not resale platform (long-term vision)
- **No advanced SEO features** - Basic metadata only; schema markup, internal linking optimization are Phase 2
- **No form integration beyond basic HTML** - Contact forms use simple HTML or third-party embed (Formspree, Google Forms); custom form handling is Phase 2

### MVP Success Criteria (Multi-Tier Testing Approach)

**The MVP follows a phased validation approach to ensure production readiness at 500 pages/week scale:**

#### Phase 1: Technical Validation (10-20 Pages)

**Objective:** Prove end-to-end pipeline functionality

**Success Criteria:**
- ✅ Can create 10-20 page requests in Airtable
- ✅ Make.com scenario successfully generates content for all via Claude API
- ✅ Content stored back in Airtable with "Ready for Review" status
- ✅ Manual approval updates status to "Approved"
- ✅ Netlify build triggered, fetches approved content, generates static site
- ✅ Deployment completes successfully, all pages live and accessible
- ✅ Generated content passes TCPA compliance checks
- ✅ Brand voice consistency validated across sample
- ✅ Mobile-responsive design renders correctly
- ✅ Core Web Vitals pass (LCP, FID, CLS)

**Performance Targets:**
- 10-20 page batch generates in < 5 minutes (Make.com scenario)
- Build completes in < 2 minutes (Next.js static export)
- < 10% content generation errors requiring retry
- 90%+ content approval rate without manual editing

#### Phase 2: Batch Validation (50-100 Pages)

**Objective:** Validate batch processing efficiency and quality consistency

**Success Criteria:**
- ✅ 50-100 page batch processes successfully through full pipeline
- ✅ Make.com handles larger batch size without timeout or failure
- ✅ Build time scales acceptably (linear or sub-linear, not exponential)
- ✅ Content quality remains consistent across entire batch
- ✅ Brand voice doesn't drift between early and late pages in batch
- ✅ No degradation in approval rates compared to Phase 1

**Performance Targets:**
- 50-100 page batch generates in < 15 minutes (Make.com scenario)
- Build completes in < 5 minutes for 100 pages (validates scaling trajectory)
- < 10% content generation errors requiring retry
- 90%+ content approval rate maintained

**Learning Objectives:**
- Identify any quality drift at mid-scale
- Measure actual vs. extrapolated build times
- Discover any batch processing issues

#### Phase 3: Scale Validation (250-500 Pages)

**Objective:** Validate production-scale performance and discover operational limits

**Success Criteria:**
- ✅ 250-500 page batch processes successfully through full pipeline
- ✅ Make.com operations quota sufficient for production volume
- ✅ Airtable API handles 500-record fetch/update operations efficiently
- ✅ Claude API rate limits and quotas accommodate weekly volume
- ✅ Netlify build completes within timeout limits (< 30 minutes)
- ✅ Content quality and brand voice consistency maintained at full scale
- ✅ Operational costs validated (API usage, Make.com operations, Netlify bandwidth)

**Performance Targets:**
- 250-500 page batch generates in < 45 minutes (Make.com scenario)
- Build completes in 10-15 minutes for 500 pages (Next.js static export)
- < 10% content generation errors requiring retry
- 90%+ content approval rate maintained at scale

**Learning Objectives:**
- Discover any non-linear performance degradation
- Identify service quota limits before pilot
- Validate operational cost assumptions at production volume
- Prove 500 pages/week capability is real, not extrapolated

#### Phase 4: Pilot Client Ready

**Success Criteria:**
- ✅ All three validation phases (10-20, 50-100, 250-500 pages) completed successfully
- ✅ Performance targets met at each scale tier
- ✅ Operational costs and quota limits documented
- ✅ Known issues and workarounds documented
- ✅ Rollback procedures tested and documented

**Documentation Complete:**
- Setup guide for Airtable base configuration
- Make.com scenario templates documented
- Next.js project README with build/deploy instructions
- Claude prompt engineering guide for brand voice tuning
- Troubleshooting guide for common error scenarios
- Scaling characteristics documented (build times, costs, quotas at each tier)

**Pilot Client Preparation:**
- First client identified and onboarded
- Brand guidelines collected and formatted for Claude
- Service/location combinations defined (target 200-500 pages)
- Airtable base configured with client data
- Phased delivery timeline established (not all pages at once—validate incrementally)

### Rationale for Multi-Tier Approach

**Why three phases instead of single test:**

1. **De-risks scaling assumptions** - 10-20 page test alone doesn't validate 500-page claims; each tier discovers different failure modes
2. **Identifies non-linear performance issues** - Build times, quality drift, API limits may not appear until higher scale
3. **Validates economic model** - Operational costs at 500 pages determine actual profitability
4. **Builds confidence for pilot** - Client commitment requires proof system works at their scale, not toy scale
5. **Allows early pivots** - If Phase 2 reveals fundamental issues, cheaper to fix before investing in Phase 3

**Each phase answers different questions:**
- **Phase 1:** Does it work at all?
- **Phase 2:** Does it work efficiently in batches?
- **Phase 3:** Does it work at production scale?

---

## Post-MVP Vision

### Phase 2 Features (3-6 Months Post-MVP)

**Self-Service Client Configuration**
- Airtable-based interface allowing contractors to directly input brand guidelines, services, and locations
- Automated onboarding workflow with templates and examples
- Reduces developer/agency setup time from 2-3 hours to 30 minutes

**Content Update Workflows**
- Regenerate specific pages without full site rebuild
- Incremental updates for service descriptions, pricing changes, promotions
- Version history and rollback for content changes

**Basic Analytics Integration**
- Track organic traffic, form submissions, phone calls by page
- Simple dashboard showing top-performing location/service combinations
- Cost-per-lead calculations to demonstrate ROI to contractor clients

**Advanced SEO Features**
- Schema markup generation (LocalBusiness, Service, Review schemas)
- Internal linking optimization between related pages
- Automated XML sitemap generation and submission

### Long-Term Vision (1-2 Years)

**Multi-Industry Templates**
- Legal services (personal injury, family law, estate planning by location)
- Medical practices (dentistry, chiropractic, urgent care by location)
- Real estate (agents serving multiple neighborhoods/property types)
- Each vertical with industry-specific compliance (HIPAA for medical, Bar Association rules for legal)

**Full Content Marketing Platform**
- Blog post generation on service-related topics with local angle
- Service detail pages beyond landing pages (process explanations, FAQs)
- Case studies and testimonials formatted for SEO and conversion
- Content calendar and publishing automation

**A/B Testing & Optimization Engine**
- Multiple headline/CTA variants per page
- Automatic traffic splitting and statistical significance testing
- Claude-powered optimization recommendations based on performance data
- Continuous improvement loop: generate → test → analyze → regenerate

**White-Label Agency Platform**
- Multi-tenant architecture for agencies serving multiple contractor clients
- Client-specific branding and white-label reporting
- Subscription/billing integration for recurring revenue model
- API for integration with agency CRMs and project management tools

### Expansion Opportunities

**Geographic Expansion**
- International markets with localized content (Canada, UK, Australia initially)
- Multi-language support with Claude's translation capabilities
- Regional compliance variations (GDPR, CCPA, etc.)

**Vertical Integration Opportunities**
- Lead tracking and attribution integration (CallRail, Google Analytics)
- CRM integration for contractor lead management (HubSpot, Salesforce)
- Advertising platform integration (Google Ads, Facebook Ads location extensions)
- Review aggregation and testimonial management

**Technology Evolution**
- Dynamic content personalization based on user location/behavior
- Voice search optimization for "near me" queries
- AI-powered chat widgets for instant lead qualification
- Predictive analytics for contractor market expansion recommendations

---

## Technical Considerations

### Platform Requirements

**Development Environment:**
- **Primary IDE:** VS Code or Cursor with Claude Code / BMAD integration
- **Version Control:** Git with GitHub repository
- **Package Management:** npm for Next.js and Node.js dependencies
- **Development OS:** Cross-platform (Windows, macOS, Linux compatible)
- **Local Development Setup:**
  - Mock data mode for Next.js (JSON fixtures, no Airtable dependency during development)
  - Claude prompt testing workflow (separate test API key, prompt playground access)
  - Make.com scenario testing (local trigger simulation before production deployment)

**Deployment Platforms:**
- **Static Hosting:** Netlify (primary), Vercel (alternative if needed)
- **Build Environment:** Node.js 18+ for Next.js static export
- **CDN:** Netlify's global CDN for static asset delivery
- **Staging Environment:** Netlify branch deploys for preview (separate URL per build before production)

**Browser/Device Support:**
- **Desktop Browsers:** Chrome, Firefox, Safari, Edge (last 2 versions)
- **Mobile Browsers:** iOS Safari, Android Chrome (last 2 versions)
- **Responsive Breakpoints:** Mobile (320px+), Tablet (768px+), Desktop (1024px+)
- **Accessibility:** WCAG 2.1 AA compliance minimum

**Performance Requirements:**
- **Core Web Vitals:** LCP < 2.5s, FID < 100ms, CLS < 0.1
- **Lighthouse Score:** 90+ for Performance, Accessibility, Best Practices, SEO
- **Page Weight:** < 500KB total (HTML + CSS + JS + images per page)
- **Time to Interactive:** < 3 seconds on 3G connection

### Technology Preferences

**Frontend Stack:**
- **Framework:** Next.js 14+ with App Router and Static Export (`output: 'export'`)
- **Styling:** Tailwind CSS 3+ for utility-first responsive design
- **Components:** React 18+ functional components with hooks
- **Typography:** Inter or similar modern sans-serif web font
- **Icons:** Heroicons or Lucide React for consistent iconography

**Build & Deployment:**
- **Build Tool:** Next.js built-in bundler (Turbopack when stable, Webpack currently)
- **CSS Processing:** PostCSS with Tailwind CSS and autoprefixer
- **Asset Optimization:** Next.js Image component for automatic optimization (converted to static for export)
- **Environment Variables:** `.env.local` for development, Netlify environment variables for production

**Content & Workflow Orchestration:**
- **Database:** Airtable as primary content database
  - Plan: Team or Business tier (required for API access and automations)
  - API: Airtable REST API via official SDK or direct HTTP calls
- **Automation Platform:** Make.com for workflow orchestration
  - Plan: Core or Pro tier (required for sufficient operations quota)
  - Modules: Airtable, HTTP (for Claude API), Tools (iterators, routers, error handlers)
- **AI Content Generation:** Anthropic Claude API
  - Model: Claude 3.5 Sonnet (balance of quality and cost)
  - API Tier: Standard (pay-as-you-go), potentially Scale if volume demands

**Development Tools:**
- **BMAD Framework:** For agent-driven development workflow
  - Agents: PM, Architect, Dev, QA for structured development
  - Living documentation: Architecture and implementation docs
- **TypeScript:** Preferred for type safety (optional for MVP, recommended for Phase 2+)
- **ESLint + Prettier:** Code quality and formatting consistency
- **Testing:** Playwright for E2E testing (Phase 2), automated validation checks for MVP

### Architecture Considerations

**Repository Structure:**
```
landing-pages-automation/
├── airtable-config/          # Airtable base schema and setup docs
│   ├── schema.md             # Field definitions and relationships
│   ├── sample-data.csv       # Example records for testing
│   └── test-data-generator.js # Synthetic test data creation script
├── make-scenarios/           # Make.com scenario templates
│   ├── content-generation.json
│   ├── deployment-trigger.json
│   └── testing-guide.md      # Local testing procedures
├── next-app/                 # Next.js application
│   ├── pages/                # Static pages (home, about, contact)
│   ├── templates/            # Landing page templates
│   ├── components/           # Reusable React components
│   ├── styles/               # Tailwind configuration and global styles
│   ├── lib/                  # Utility functions and API clients
│   │   ├── airtable.js       # Airtable API integration
│   │   └── mock-data.js      # Local development mock data
│   ├── public/               # Static assets (images, fonts)
│   ├── next.config.js        # Next.js configuration (output: 'export')
│   └── fixtures/             # JSON mock data for local development
├── docs/                     # Project documentation
│   ├── brief.md              # This document
│   ├── architecture.md       # Technical architecture (BMAD agent output)
│   ├── prd.md                # Product requirements (BMAD agent output)
│   └── local-dev-setup.md    # Development environment configuration
└── scripts/                  # Utility scripts
    ├── test-build.js         # Local build testing script
    ├── validate-quality.js   # Automated quality checks
    └── check-links.js        # Link validation utility
```

**Service Architecture:**
- **Stateless Architecture:** All pages are static, no server-side runtime dependencies
- **Data Flow:** Airtable (source) → Make.com (orchestration) → Claude API (generation) → Airtable (storage) → Next.js (build) → Netlify (host)
- **No Backend Services:** Intentionally serverless-free to avoid previous failure modes
- **Content Delivery:** Pure static files served via CDN with edge caching

**Critical Dependency Order:**

The system must be built and validated in this specific order to ensure each layer can consume the layer below:

1. **Claude Prompt Engineering** - Defines output structure for all downstream systems
2. **Airtable Schema Design** - Must match Claude output format AND Next.js input requirements
3. **Make.com Scenario Configuration** - Transforms Claude output into Airtable records
4. **Next.js Template Development** - Consumes Airtable data structure
5. **Netlify Deployment Integration** - Final integration point

**Critical:** Changes to Claude prompts may require cascading updates to Airtable schema, Make.com scenarios, and Next.js templates. Version control and documentation of dependencies is essential.

**Integration Requirements:**

**Airtable Integration:**
- REST API for fetching approved content during Next.js build
- Webhook endpoints for triggering Make.com scenarios
- Field mapping between Airtable schema and Next.js page props
- Caching strategy: Store last successful fetch locally as fallback if API unavailable during build

**Make.com Integration:**
- HTTP webhooks for Airtable triggers
- Claude API calls via HTTP Request module with timeout configuration (60s recommended)
- Airtable API calls via native Airtable module
- Error handling: Retry with exponential backoff (3 attempts max), flag for manual intervention
- Netlify build webhook trigger from Make.com

**Claude API Integration:**
- Authentication via API key (stored in Make.com secure fields)
- Prompt templates for brand voice, location/service injection
- Response parsing and validation before Airtable storage
- Rate limiting awareness: 50 requests/minute tier 1, adjust batch size accordingly
- Quota management: Monitor monthly usage, alert at 80% threshold

**Netlify Integration:**
- Build hooks for deployment triggers
- Environment variables for API keys and configuration
- Deploy notifications webhook back to Airtable (recommended for status tracking)
- Build timeout handling: If 500 pages exceed 30min limit, auto-reduce batch size (500 → 250 → 100)

**Form Integration (MVP Requirement):**
- **Form Backend:** Formspree free tier (50 submissions/month per form)
  - Upgrade to Pro ($10/month) if pilot client exceeds quota
  - Alternative: Google Forms embed for initial pilot validation
- **Phase 2:** Direct CRM integration (HubSpot, Salesforce via webhook)
- **Implementation:** HTML forms with POST to Formspree endpoint, client-side validation

**Testing Strategy:**

**Automated Quality Checks (Required for MVP):**
- **HTML Validation:** W3C validator integration for markup correctness
- **Link Checker:** Validate all internal and external links (no 404s)
- **Image Validation:** Ensure all images load, proper alt text present for accessibility
- **Compliance Checker:** Automated scan for TCPA keywords, required legal sections
- **Performance Validation:** Lighthouse CI on sample pages (10% of batch minimum)

**Test Data Strategy:**
- **Synthetic Data Generator:** Script creates realistic contractor profiles
  - Target: 500 test records covering edge cases (long business names, special characters, accented names, etc.)
  - Includes varied service/location combinations for comprehensive coverage
- **Data Isolation:** Test data in separate Airtable base or clearly marked test records
- **Regression Testing:** Baseline quality measurements for comparison when prompts change

**Quality Regression Process:**
1. Generate 50-page baseline with current prompts
2. Document quality scores (approval rate, compliance pass rate, manual review feedback)
3. When prompts updated, regenerate same 50 pages
4. Compare quality metrics against baseline
5. Approve prompt changes only if metrics maintained or improved

**Fallback Strategies:**

**Service Unavailability:**
- **Airtable API down during build:** Use cached content from previous successful fetch (stored in `next-app/.cache/`)
- **Make.com scenario failure:** Retry with exponential backoff, flag for manual intervention after 3 attempts
- **Claude API quota exhaustion:** Queue overflow pages for next day's batch, alert operator
- **Netlify build timeout:** Automatic batch size reduction (500 → 250 → 100 pages per deploy)

**Data Integrity:**
- **Circular dependency mitigation:** Netlify build failures don't block Airtable updates (use try/catch in webhook handler)
- **Partial batch failure:** Deploy successful pages, flag failed pages for regeneration (no all-or-nothing)
- **Schema migration safety:** Validate Airtable field changes don't break Make.com or Next.js before deploying

**Security/Compliance:**

**API Key Management:**
- Anthropic API key: Stored in Make.com (never in code or public repos)
- Airtable API key: Stored in Netlify environment variables for builds
- No keys committed to version control (`.env.local` in `.gitignore`)
- Key rotation procedure documented for security incidents

**TCPA Compliance:**
- Phone numbers must include opt-in language for contact
- Forms must have explicit consent checkboxes
- Contact information disclosure statements on all pages
- Prompt engineering includes TCPA validation rules
- Automated compliance checker validates presence of required elements

**Data Privacy:**
- No user data collection beyond form submissions (handled by third-party or contractor CRM)
- No cookies or tracking beyond basic analytics (Google Analytics or equivalent)
- Privacy policy template provided for contractor customization
- GDPR/CCPA considerations documented for Phase 2 geographic expansion

**Content Security:**
- All external links use `rel="noopener noreferrer"` for security
- Forms use HTTPS for submission (Netlify provides SSL by default)
- No user-generated content (XSS not a concern)
- Content Security Policy headers configured in Netlify

---

## Constraints & Assumptions

### Constraints

**Budget:**
- **Development costs:** No external costs for MVP (uses existing Claude Code subscription, personal API keys)
- **Service subscriptions:**
  - Airtable Team tier: ~$20/user/month (required for API access)
  - Make.com Core tier: ~$9-29/month depending on operations volume
  - Anthropic Claude API: ~$10-50 for MVP testing (500 test pages @ $0.02-0.10/page)
  - Netlify free tier sufficient for MVP, Pro tier ($19/month) if bandwidth/build minutes exceed limits
- **Total monthly recurring:** ~$50-100/month for MVP operations
- **Pilot client investment:** $2-5k project fee validates business model (covers 6 months operational costs)

**Timeline:**
- **MVP Development:** 4-6 weeks from brief completion to Phase 1 validation (10-20 pages)
- **Multi-tier validation:** Additional 2-3 weeks for Phase 2 (50-100 pages) and Phase 3 (250-500 pages)
- **Pilot client delivery:** 8 weeks from MVP completion to 500-page deployment
- **Total timeline:** 14-17 weeks (3.5-4 months) from brief to pilot completion

**Resources:**
- **Solo developer:** You (using BMAD methodology with AI agents for leverage)
- **AI assistance:** Claude Code, BMAD agents (PM, Architect, Dev, QA)
- **Existing assets:** BMAD framework, MCP integrations, SuperClaude customizations
- **No hiring planned:** System designed for solo operation at scale

**Technical:**
- **Must use existing tech stack:** Next.js, Tailwind CSS, Netlify (proven, known technologies)
- **Cannot use serverless functions:** Lessons learned from previous failure
- **Must maintain BMAD compatibility:** Agent workflows must follow BMAD patterns
- **Build-time only:** All logic front-loaded, no runtime complexity permitted
- **API rate limits:** Claude API 50 req/min (Tier 1), Airtable 5 req/sec, Make.com operations quota
- **Browser support:** Modern browsers only (last 2 versions), no IE11 or legacy support

### Key Assumptions

**About Technology Stack:**
- **Next.js static export scales linearly:** Build time for 500 pages remains < 15 minutes
- **Make.com Core tier sufficient:** Operations quota accommodates weekly 500-page batches
- **Airtable Team tier sufficient:** API rate limits and storage capacity adequate for MVP and pilot
- **Claude 3.5 Sonnet is optimal model:** Balance of cost ($3/MTok input, $15/MTok output) and quality adequate

**About Content Quality:**
- **90% approval rate achievable:** With well-tuned prompts, 9 out of 10 generated pages acceptable without editing
- **Brand voice consistency:** Claude can maintain consistent voice across 500 pages with proper prompt engineering
- **TCPA compliance automatable:** Prompt rules can reliably include required legal language
- **Local SEO optimization:** AI-generated content ranks competitively with human-written content for local search

**About Market & Users:**
- **Solo devs/agencies exist and are findable:** Target primary user segment is accessible via developer communities, LinkedIn, etc.
- **$2-5k pricing is acceptable:** Mid-market contractors will pay this for 200-500 page packages
- **Contractors value SEO ROI:** End clients understand local search ranking drives leads
- **Pilot client is securable:** At least one contractor willing to be first customer within timeline

**About Development Process:**
- **BMAD methodology sufficient:** Agent-driven development enables solo dev to build complex system
- **Multi-tier testing finds issues:** Phased validation (10-20, 50-100, 250-500) catches scaling problems before pilot
- **Documentation-as-code works:** Living docs drive implementation and capture learnings
- **4-6 week MVP timeline realistic:** With focused scope and AI assistance, achievable for experienced developer

**About Operations & Maintenance:**
- **System is low-maintenance:** Once built, requires minimal ongoing intervention (weekly batch reviews, monthly prompt tuning)
- **Errors are recoverable:** Fallback strategies and retry logic handle transient failures gracefully
- **Costs scale predictably:** API usage and service tier upgrades scale linearly with client volume
- **Quality doesn't degrade:** Prompt engineering learnings compound, improving output over time

**About Competitive Positioning:**
- **No direct competitors exist:** AI-native local SEO page generation at this scale is novel offering
- **Entry barriers protect position:** Technical complexity and prompt engineering expertise create moat
- **Market timing is right:** AI content quality crossed threshold in 2024-2025 for production use
- **First-mover advantage matters:** Early adoption establishes methodology and reputation before competitors catch up

---

## Risks & Open Questions

### Key Risks

**1. Content Quality Inconsistency at Scale**
- **Risk:** Claude maintains quality for first 100 pages but degrades on pages 400-500
- **Description:** AI-generated content may suffer from repetition, generic phrasing, or brand voice drift when generating large volumes
- **Impact:** HIGH - Destroys 90% approval rate assumption, makes 500 pages/week economically unfeasible
- **Mitigation:** Multi-tier testing (Phase 2-3) specifically validates quality consistency; baseline quality measurements enable regression detection

**2. Build Performance Non-Linear Scaling**
- **Risk:** Next.js build time exceeds Netlify 30-minute timeout at 500 pages
- **Description:** Static site generation may encounter memory pressure, filesystem overhead, or other bottlenecks at production scale
- **Impact:** HIGH - Cannot deploy 500-page batches, limits system to 250 pages/week maximum
- **Mitigation:** Phase 3 explicit validation with 500-page test; fallback to batch deployments (250 pages × 2 builds)

**3. Make.com Operations Quota Insufficient**
- **Risk:** Core tier operations quota exceeded, scenario halts mid-batch
- **Description:** 500 pages × 3 operations (fetch, Claude call, write) = 1,500 ops/batch; with retries/testing could exceed 10K/month quota
- **Impact:** MEDIUM - Requires Pro tier upgrade ($99/month vs $29/month Core), affects operational cost assumptions
- **Mitigation:** Operations tracking in Phase 2-3; budget for Pro tier in pricing model

**4. Pilot Client Acquisition Failure**
- **Risk:** No contractor willing to be first customer despite value proposition
- **Description:** "AI-generated content" stigma, risk aversion, or pricing sensitivity prevents pilot signups
- **Impact:** HIGH - System built with no customer, cannot validate business model or ROI claims
- **Mitigation:** Secure pilot client BEFORE MVP development (LOI + deposit); use own/friend's business as test case; offer 50% discount + guarantee

**5. Google AI Content Penalties**
- **Risk:** Search engine downranks AI-generated pages, SEO value proposition fails
- **Description:** Google algorithm updates could detect AI patterns and penalize rankings
- **Impact:** CRITICAL - Entire value proposition collapses if pages don't rank
- **Mitigation:** Test SEO performance on own site before selling to clients; "AI-assisted, human-reviewed" positioning; focus on technical SEO excellence

### Open Questions

**Pricing & Business Model:**
1. Should pricing be per-page ($10-20/page) or package-based ($2-5k for 200-500 pages)?
2. Is monthly retainer model viable for ongoing content generation, or one-time project only?
3. What's optimal discount for pilot client (50%? Free with testimonial rights?)?
4. Should we target contractors directly or sell B2B to agencies who resell to contractors?

**Technical Architecture:**
5. Is Make.com truly necessary or could Airtable automations + GitHub Actions replace it?
6. Should we prototype Claude prompt engineering BEFORE Airtable schema design to validate dependency order?
7. What's fallback if Netlify build times prove problematic (Vercel? Self-hosted?)?
8. Can we use Next.js App Router with static export or must stick to Pages Router?

**Content & Quality:**
9. How much human editing is acceptable before economics break (5%? 10%? 20% of pages)?
10. Should we A/B test AI vs. human-written pages early to validate quality perception?
11. What's minimum viable brand voice consistency (pages feel "similar enough" vs. identical tone)?
12. Are there service types or locations where AI content fails (luxury services? Complex technical services?)?

**Market & Go-to-Market:**
13. What's best channel for reaching target solo devs/agencies (Reddit? LinkedIn? Dev communities?)?
14. Should we build in public / document journey for marketing leverage?
15. Is there existing demand we can tap (agencies already looking for this solution) or must we create demand?
16. What's our response if competitor launches similar solution during MVP development?

### Areas Needing Further Research

**Make.com Deep Dive:**
- Scenario complexity limits and best practices
- Local testing/debugging workflows
- Error handling patterns for production reliability
- Cost optimization strategies (reduce operations count)

**SEO & Content Performance:**
- Current state of Google's AI content detection (2025 algorithms)
- Case studies of AI-generated content ranking performance
- Best practices for "AI-assisted" content that ranks well
- TCPA compliance examples from legal/contractor industries

**Competitive Landscape:**
- Existing solutions in local SEO landing page generation space
- AI content generation tools contractors currently use
- Agency service offerings and pricing for comparable deliverables
- White-label platforms serving similar markets

**Airtable at Scale:**
- Performance characteristics with 5000+ records
- API rate limit behaviors under production load
- Best practices for schema design supporting complex workflows
- Backup/export strategies for business continuity

---

## Appendices

### A. Research Summary

**Source:** Brainstorming session results and strategic analysis conducted prior to brief creation

**Key Findings:**
- Multi-tier testing approach (10-20, 50-100, 250-500 pages) necessary to validate scaling assumptions
- Make.com required for production orchestration due to Airtable automation limitations (30-second timeout, 50 fetch limit, synchronous execution)
- Build-time generation essential based on lessons learned from previous runtime deployment failures
- Form integration (Formspree) required for MVP, not Phase 2 enhancement

**Research Conducted:**
- Airtable automation capabilities: Validated 30-second script timeout, 50 fetch request limit, synchronous execution constraints
- Make.com vs. Airtable native automations: Confirmed Make.com necessary for 40+ minute scenarios, parallel processing, production-grade error handling
- Claude API integration options: Validated direct HTTP integration via Make.com, rate limiting (50 req/min Tier 1), cost modeling ($3/$15 per MTok)

**Strategic Insights:**
- Business problem is landing page generation at scale for contractors, NOT methodology validation (BMAD is development approach, not product)
- Solo developer + AI agents enable team-level output with proper tooling and methodology
- Compliance-first positioning (TCPA, WCAG) is competitive differentiator most solutions ignore

### B. Stakeholder Input

**Primary Stakeholder:** You (solo developer, business owner, system architect)

**Key Requirements Captured:**
- Must avoid serverless functions based on previous deployment failures
- Must use Next.js static export with build-time generation only
- Must validate scaling assumptions through multi-tier testing before pilot
- Must maintain BMAD methodology compatibility for agent-driven development

**Lessons Learned from Previous Attempts:**
- Runtime logic in Netlify Functions caused cold start delays, timeout errors, debugging complexity
- Mixed build/content logic created deployment brittleness
- Insufficient testing at scale led to production failures

### C. References

**Key Documents:**
- Brainstorming session results (prior context for this brief)
- BMAD framework documentation (.bmad-core/core-config.yaml, agent definitions)
- Airtable automation research (web search results on capabilities and limitations)
- Make.com integration research (validation of orchestration requirements)

**Technical Resources:**
- Next.js Static Export documentation: https://nextjs.org/docs/app/building-your-application/deploying/static-exports
- Airtable API documentation: https://airtable.com/developers/web/api/introduction
- Make.com documentation: https://www.make.com/en/help/
- Anthropic Claude API documentation: https://docs.anthropic.com/

**Compliance & Legal:**
- TCPA (Telephone Consumer Protection Act) requirements for contractor marketing
- WCAG 2.1 AA accessibility standards
- Google's stance on AI-generated content (search quality guidelines)

---

## Next Steps

### Immediate Actions (Post-Brief Completion)

**1. Secure Pilot Client (Priority: CRITICAL)**
- **Owner:** You (business development)
- **Timeline:** Within 2 weeks of brief completion
- **Action:** Reach out to 10 contractor contacts, present value proposition, secure LOI + deposit from 1 client
- **Success Criteria:** Signed letter of intent with target page count (200-500), service/location requirements, timeline (8 weeks from MVP completion)
- **Fallback:** Use own business or friend's business as pilot test case if no contractor commits

**2. Validate Critical Assumptions Early (Priority: HIGH)**
- **Owner:** You (technical validation)
- **Timeline:** Week 1 of MVP development
- **Actions:**
  - Test Claude prompt with 10 sample pages, measure cost per page and quality
  - Prototype Make.com scenario with single page workflow
  - Test Next.js build with 20 mock pages, measure build time
- **Success Criteria:** Cost < $0.15/page, Make.com scenario works, build time < 1 minute for 20 pages

**3. Hand Off to PM Agent for PRD Creation (Priority: HIGH)**
- **Owner:** BMAD PM Agent
- **Timeline:** Immediately after brief approval
- **Action:** PM agent reviews this brief thoroughly, creates comprehensive PRD following BMAD template structure
- **Input:** This brief provides complete context for PRD creation
- **Output:** docs/prd.md with detailed requirements, epics, user stories for MVP development

**4. Architecture Design Session (Priority: HIGH)**
- **Owner:** BMAD Architect Agent
- **Timeline:** After PRD completion (parallel with PM work possible)
- **Action:** Design technical architecture following critical dependency order (Claude prompts → Airtable schema → Make.com → Next.js → Netlify)
- **Output:** docs/architecture.md with system design, component specifications, integration patterns

**5. Development Kickoff (Priority: MEDIUM)**
- **Owner:** BMAD Dev Agent
- **Timeline:** After PRD + Architecture complete
- **Prerequisites:** Brief approved, pilot client secured, PRD/Architecture docs ready
- **Approach:** Follow BMAD SM → Dev cycle for story-by-story implementation
- **Validation Gates:** Phase 1 (10-20 pages), Phase 2 (50-100 pages), Phase 3 (250-500 pages) before pilot

### Sequencing & Dependencies

```
Week 1-2: Secure pilot client + Validate critical assumptions (parallel)
Week 2-3: PM creates PRD + Architect designs system (parallel)
Week 4-9: MVP Development (BMAD Dev agent, story-by-story)
  ├─ Phase 1: 10-20 page validation (Week 4-5)
  ├─ Phase 2: 50-100 page validation (Week 6-7)
  └─ Phase 3: 250-500 page validation (Week 8-9)
Week 10-17: Pilot client delivery (8 weeks)
```

### Handoff Notes

**For PM Agent:**
This brief provides the complete foundation for Landing Pages Automation PRD creation. Key focus areas:
- Translate multi-tier testing approach (Phase 1-2-3) into epic structure
- Detail Airtable schema requirements driven by Claude output format
- Specify Make.com scenario requirements with error handling and fallback strategies
- Define acceptance criteria aligned with success metrics in Goals section

**For Architect Agent:**
Critical architectural requirements from this brief:
- **Dependency order:** Claude prompts → Airtable schema → Make.com → Next.js → Netlify (validate this order in design)
- **Build-time only:** No serverless functions, all logic front-loaded
- **Fallback strategies:** Document failover approaches for each integration point
- **Testing infrastructure:** Automated quality checks (HTML validation, link checking, compliance scanning)

**For Dev Agent:**
Implementation priorities from this brief:
- Start with Claude prompt engineering and content structure definition (drives all downstream dependencies)
- Use mock data for Next.js development (enable parallel work streams)
- Follow multi-tier validation gates (don't skip Phase 1-2-3 testing)
- Implement automated quality checks as MVP requirement, not Phase 2

---

**Document Status:** COMPLETE
**Version:** 1.0
**Date:** 2025-01-07
**Next Review:** After MVP Phase 1 completion (update with learnings)

