---
created: 2025-01-08
agent: pm
purpose: Document requirements pivot from SEO/organic to Google Ads Performance Max paid traffic optimization
audience: PM, architects, dev team, stakeholders
status: approved
triage-status: archived
related-to: prd-v2.1
decision-status: implemented
implementation-date: 2025-01-08
original-location: .ai/scratch/SCP-001-Paid-Traffic-Alignment.md
---

# SPRINT CHANGE PROPOSAL
## Landing Pages Automation v2 - PRD Alignment to Paid Traffic Requirements

**Date:** 2025-01-08
**Change ID:** SCP-001
**Severity:** HIGH (Pre-Development Discovery)
**Status:** APPROVED FOR IMPLEMENTATION

---

## Executive Summary

**Issue Identified:** PRD was written for SEO/organic landing pages, but frontend specification defines Google Ads Performance Max paid traffic landing pages. This represents a fundamental requirements misalignment.

**Impact:** Goals, success metrics, functional requirements, and validation criteria require significant updates. Affects Epics 1, 4, and 6 substantially; Epics 0, 2, 3, and 5 moderately.

**Recommended Path:** Direct Adjustment/Integration - Update PRD requirements and modify epic stories. No rollback needed (caught pre-development).

**Timeline Impact:** +4-6 days (18-28 days total vs original 14-22 days estimate)

**Risk Level:** 🟡 MODERATE - Mitigated by Epic 0 architecture research expansion

**Effort Required:** 2-3 hours PRD updates + expanded Epic 0 research + Epic 4 component additions

---

## 1. Analysis Summary

### 1.1 Triggering Issue

**Source:** Review of `front-end-spec.md` revealed fundamental requirements mismatch

**Core Problem:**
- **PRD Assumption:** SEO/organic search landing pages (rankings, traffic, keyword optimization)
- **Actual Requirement:** Google Ads Performance Max paid traffic landing pages (conversion rate, Quality Score, cost per lead)

**Discovery Timing:** Pre-Epic 0 (before any code written) ✅ MINIMAL WASTE

### 1.2 Epic Impact Assessment

| Epic | Impact | Modifications Required |
|------|--------|------------------------|
| Epic 0 | 🟡 MODERATE | Add 10-15 ADR items (GTM, CallRail, 3-stage forms, conversion tracking) |
| Epic 1 | 🔴 HIGH | Change content strategy (conversion vs SEO), add message match validation, 800-1200 word target |
| Epic 2 | 🟡 MODERATE | Add 5-7 schema fields (ad_headline, tracking URLs, conversion goals) |
| Epic 3 | 🟢 LOW | Pass additional data fields through Make.com pipeline |
| Epic 4 | 🔴 HIGH | Add components (Trust Bar, Gallery, FAQ, 3-stage form), elevate performance priority |
| Epic 5 | 🟢 LOW | Add GTM integration (replace direct pixel injection) |
| Epic 6 | 🔴 HIGH | Replace SEO validation with paid traffic KPIs (conversion rate, Quality Score proxies) |

### 1.3 Artifact Conflicts

**PRD Sections Requiring Updates:**
1. Goals (Lines 8-24) - Complete rewrite of success metrics
2. Background Context (Lines 26-44) - Clarify paid traffic focus
3. Functional Requirements (Lines 56-122) - Add 12 new requirements
4. Non-Functional Requirements (Lines 81-97) - Add 3 new NFRs
5. UI Requirements (Lines 99-122) - Update section structure, add 3 new FRs
6. Technical Assumptions - Data Flow (Lines 199-217) - Add ad copy inputs
7. Technical Assumptions - Forms (Lines 220-222) - Replace with 3-stage form strategy
8. Technical Assumptions - Tech Stack (Lines 171-180) - Add tracking technologies

**Frontend Spec Status:** ✅ Source of truth - integrate requirements into PRD

---

## 2. Technology Stack Decisions Summary

**MANDATORY (No Research Needed):**
- ✅ **CallRail** - Call tracking solution (user-specified)

**ARCHITECT TO RECOMMEND (Research & Compare):**
- ⚠️ **Form Submission Backend** - Formspree Pro vs Netlify Forms vs Custom Webhook
  - Evaluation criteria: GTM integration, cost, reliability, spam protection
  - Architect presents 2-3 options → User selects → Architect researches in depth

- ⚠️ **Multi-Step Form Library** - React Hook Form vs Formik vs Custom State Management
  - Evaluation criteria: Bundle size, DX, validation features, performance
  - Architect presents 2-3 options → User selects → Architect researches in depth

**PRE-APPROVED (No Research Needed):**
- ✅ Google Tag Manager (GTM) - Tag management
- ✅ Google Analytics 4 (GA4) - Analytics
- ✅ Google Ads Conversion Pixels - Conversion tracking (via GTM)

---

## 3. Updated Project Timeline

**Original Estimate:** 14-22 days
**Updated Estimate:** 18-28 days
**Delta:** +4-6 days (+20-30%)

**Time Additions Breakdown:**
- Epic 0 Phase 0.1: +2-3 days (expanded research: 10-15 new ADRs)
- Epic 4 Phase 4.3: +1-2 days (new components: Trust Bar, Gallery, FAQ, 3-stage form)
- Epic 4 Phase 4.4: +0.5-1 day (additional conversion tracking validation)
- Epic 6: +0.5 day (updated validation criteria and tooling)

**Epic Duration Updates:**

| Epic | Original | Updated | Delta |
|------|----------|---------|-------|
| Epic 0 | 3-5 days | 5-8 days | +2-3 days |
| Epic 1 | 2-3 days | 2-3 days | No change |
| Epic 2 | 1-2 days | 1-2 days | No change |
| Epic 3 | 2-3 days | 2-3 days | No change |
| Epic 4 | 5-7 days | 6-9 days | +1-2 days |
| Epic 5 | 1-2 days | 1-2 days | No change |
| Epic 6 | 3-5 days | 3.5-5.5 days | +0.5 day |
| **TOTAL** | **14-22 days** | **18-28 days** | **+4-6 days** |

---

## 4. Risk Assessment & Mitigation

### Moderate Risks

**Risk 1: 3-Stage Form UX Complexity**
- **Impact:** Form abandonment if UX is poor
- **Mitigation:** Epic 0 research on progressive disclosure best practices, form library selection for optimal DX
- **Contingency:** Fallback to 2-stage or single-stage form if testing shows high abandonment

**Risk 2: CallRail Integration Complexity**
- **Impact:** Dynamic number insertion may conflict with static site generation
- **Mitigation:** Epic 0 research on CallRail + Next.js static site patterns, test in Phase 4.1 early
- **Contingency:** Static number assignment per page (less dynamic, but functional)

**Risk 3: GTM + Static Site Performance**
- **Impact:** Third-party scripts may slow LCP below <2.5s target
- **Mitigation:** Epic 0 research on async/defer strategies, lazy load GTM after critical content
- **Contingency:** Defer non-critical tracking scripts to post-conversion events

### Low Risks

**Risk 4: Message Match Validation Accuracy**
- **Impact:** AI may incorrectly score headline similarity
- **Mitigation:** Manual spot-checking in Epic 1 testing, adjust threshold if needed
- **Contingency:** Lower threshold to 70% or make validation warning-only

**Risk 5: Form Library Bundle Size**
- **Impact:** Large form library may increase bundle size and slow LCP
- **Mitigation:** Architect evaluates bundle size as primary criteria in comparison
- **Contingency:** Custom state management if all libraries too large

---

## 5. Approval & Sign-Off

**Prepared By:** John (PM Agent)
**Date:** 2025-01-08
**Approval Status:** ✅ APPROVED
**Approved By:** User
**Approval Date:** 2025-01-08

---

## Appendices

### Appendix A: Validation Metrics Comparison

| Metric | SEO Landing Pages (OLD) | Paid Traffic Landing Pages (NEW) |
|--------|-------------------------|-----------------------------------|
| **Primary Goal** | Rank in search results | Convert paid visitors to leads |
| **Success Metric 1** | Top-10 rankings for 70%+ keywords | 5-10% conversion rate |
| **Success Metric 2** | 50%+ organic traffic growth | Quality Score 7-10 |
| **Success Metric 3** | 90+ SEO score | Cost Per Lead <$50 |
| **Content Length** | 1500-2500 words | 800-1200 words |
| **Performance Priority** | Important | CRITICAL (affects ad costs) |
| **Mobile Traffic** | 40-50% typical | 60%+ of paid traffic |
| **Conversion Focus** | Secondary (after traffic) | PRIMARY goal |
| **Message Match** | Not tracked | Critical for Quality Score |

### Appendix B: ADR Research Interaction Model

**Process for "ARCHITECT TO RECOMMEND" Items:**

1. Architect researches 2-3 viable options
2. Present comparison table with pros/cons (GTM integration, cost, DX, performance, etc.)
3. User selects preferred approach
4. Architect deep-dives on selected solution + documents alternatives
5. ADR created with implementation guide + comparison table

**Example - Form Submission Backend:**
- Step 1: Research Formspree Pro, Netlify Forms, Custom Webhook
- Step 2: Present comparison (GTM integration, cost $X/month, reliability uptime %)
- Step 3: User selects "Netlify Forms"
- Step 4: Deep-dive on Netlify Forms implementation
- Step 5: ADR with Netlify Forms guide + alternatives documented

---

**END OF SPRINT CHANGE PROPOSAL**
