# Epic 2: Component Development System

**Epic Number:** 2
**Status:** READY TO START
**Owner:** Dev Agent
**Duration Estimate:** 16-24 hours (2-3 days)
**Dependencies:** Epic 0 (Foundation & Infrastructure) ✅ + Epic 1 (Airtable Schema) ✅
**Start Date:** TBD
**Completion Date:** TBD

---

## Epic Overview

Build a complete component development system with 6 production-ready React components that integrate with the enhanced content.json data structure. All components must support dynamic branding, responsive design across 3 breakpoints, and meet WCAG 2.1 AA accessibility standards.

This epic transforms the minimal deployment baseline (Phase 0.2) into a full-featured landing page system capable of serving production traffic with professional UI/UX quality.

---

## Epic Objectives

1. **Build 6 React Components:**
   - HeroSection: Above-the-fold hero with CTA, branding, and hero image
   - TrustBar: Trust signals (years in business, reviews, awards, guarantees)
   - BenefitsGrid: Service benefits in responsive grid layout
   - ProcessTimeline: Visual process steps with icons and descriptions
   - TestimonialsGrid: Customer testimonials with ratings and photos
   - FAQAccordion: Expandable FAQ section with schema.org markup

2. **Dynamic Branding Integration:**
   - CSS custom properties for client-specific colors
   - Dynamic logo rendering from content.json
   - Flexible typography system
   - Brand-consistent visual hierarchy

3. **Responsive Design:**
   - Mobile-first approach (320px minimum)
   - Breakpoints: 320px (mobile), 768px (tablet), 1440px (desktop)
   - Touch-friendly interactions (44×44px minimum tap targets)
   - Optimized for Core Web Vitals (LCP, CLS, INP)

4. **Accessibility Compliance:**
   - WCAG 2.1 AA standards
   - Semantic HTML structure
   - ARIA labels and roles where needed
   - Keyboard navigation support
   - Screen reader compatibility

5. **Production Deployment:**
   - Deploy first complete page with all 6 components
   - Validate performance (LCP <2.5s, CLS <0.1)
   - Cross-browser testing (Chrome, Firefox, Safari, Edge)
   - Mobile device testing (iOS Safari, Chrome Android)

---

## Dependencies and Prerequisites

### ✅ Epic 0: Foundation & Infrastructure (COMPLETE)
- Next.js 15 App Router with static export
- TypeScript strict mode (0 errors)
- Tailwind CSS v4 CSS-first configuration
- Dynamic route generation via generateStaticParams()
- Netlify deployment pipeline
- Core Web Vitals baseline (LCP 179ms, CLS 0.00)

### ✅ Epic 1: Airtable Schema & Data Management (COMPLETE)
- 12-table Airtable schema with relationships
- 3-table fetch strategy (Pages, Testimonials, Branch Staff)
- 40+ lookup fields mapped from related tables
- Enhanced TypeScript type system (content-data.ts, airtable-schema.ts)
- Working export script (scripts/export-airtable-to-json.ts)
- Enhanced content.json with component data contracts

### 📋 Ready State Checklist:
- [x] Export script produces valid content.json
- [x] TypeScript types defined (src/types/content-data.ts)
- [x] Component data contracts documented (docs/components/component-data-contracts.md)
- [x] Responsive design guidelines established (docs/architecture/mobile-optimization-checklist.md)
- [x] Performance targets defined (LCP <2.5s, CLS <0.1)
- [x] Accessibility standards identified (WCAG 2.1 AA)

---

## Story Breakdown

### Story 2.1: HeroSection Component Implementation
**Priority:** HIGH (above-the-fold, highest visibility)
**Estimated Duration:** 3-4 hours
**Acceptance Criteria:**
- Hero section renders with dynamic branding (colors, logo, typography)
- Responsive across 3 breakpoints (320px, 768px, 1440px)
- CTA button meets accessibility standards (44×44px touch target, ARIA labels)
- Hero image supports AVIF/WebP/JPEG with Next.js Image component
- Service headline and subheadline render from content.json
- LCP optimization (preload hero image, above-fold critical CSS)

### Story 2.2: TrustBar Component Implementation
**Priority:** HIGH (conversion optimization)
**Estimated Duration:** 2-3 hours
**Acceptance Criteria:**
- 4 trust signals render horizontally (desktop) / 2×2 grid (mobile)
- Dynamic data from content.json (years, reviews, awards, guarantees)
- Icons support both built-in and custom SVGs
- Accessible labels for screen readers
- Responsive typography and spacing

### Story 2.3: BenefitsGrid Component Implementation
**Priority:** MEDIUM (service value proposition)
**Estimated Duration:** 2-3 hours
**Acceptance Criteria:**
- Benefits render in responsive grid (1 col mobile, 2 col tablet, 3 col desktop)
- Support for 3-9 benefits per page
- Icon + headline + description layout
- Graceful handling of missing AI-generated content
- Visual hierarchy with proper spacing

### Story 2.4: ProcessTimeline Component Implementation
**Priority:** MEDIUM (conversion path clarity)
**Estimated Duration:** 3-4 hours
**Acceptance Criteria:**
- Process steps render as vertical timeline (mobile) / horizontal (desktop)
- Step numbers, icons, titles, descriptions from content.json
- Support for 3-7 steps per page
- Visual connectors between steps
- AI-generated content parsing (JSON array)

### Story 2.5: TestimonialsGrid Component Implementation
**Priority:** MEDIUM (social proof)
**Estimated Duration:** 2-3 hours
**Acceptance Criteria:**
- Top 5 testimonials render in responsive grid (1 col mobile, 2 col tablet, 3 col desktop)
- Star rating display (1-5 stars)
- Customer name, photo (if available), date
- Testimonial text with character limit (150-200 words)
- Fallback for missing photos

### Story 2.6: FAQAccordion Component Implementation
**Priority:** MEDIUM (SEO and user assistance)
**Estimated Duration:** 3-4 hours
**Acceptance Criteria:**
- FAQs render as expandable accordion
- Schema.org FAQPage markup for SEO
- Keyboard navigation (Enter/Space to toggle, Arrow keys to navigate)
- Smooth expand/collapse animation
- AI-generated FAQ parsing (JSON array)
- Accessible ARIA attributes (aria-expanded, aria-controls)

### Story 2.7: Page Layout Integration & Responsive Validation
**Priority:** HIGH (final integration and QA)
**Estimated Duration:** 4-6 hours
**Acceptance Criteria:**
- All 6 components integrated into [service]/[location]/page.tsx
- Responsive design validated across 3 breakpoints
- Cross-browser testing (Chrome, Firefox, Safari, Edge)
- Mobile device testing (iOS Safari, Chrome Android)
- Core Web Vitals validation (LCP <2.5s, CLS <0.1)
- HTML validation (W3C validator)
- Accessibility validation (axe DevTools, WAVE)
- First complete page deployed to production

---

## Success Criteria

### Functional Requirements:
- ✅ All 6 components render correctly with content.json data
- ✅ Dynamic branding works (colors, logos, typography)
- ✅ No TypeScript errors in strict mode
- ✅ No console errors or warnings

### Performance Requirements:
- ✅ LCP <2.5s (target: match Phase 0.2 baseline of 179ms)
- ✅ CLS <0.1 (target: maintain perfect 0.00 score)
- ✅ TTFB <800ms (target: match Phase 0.2 baseline of 32ms)
- ✅ First Load JS ≤102 kB (no regression from Phase 0.2)

### Responsive Design Requirements:
- ✅ 320px mobile: Single column, touch-friendly, readable typography
- ✅ 768px tablet: 2-column grids, optimized spacing
- ✅ 1440px desktop: 3-column grids, full visual hierarchy
- ✅ No horizontal scroll at any breakpoint
- ✅ Touch targets ≥44×44px (iOS guidelines)

### Accessibility Requirements:
- ✅ WCAG 2.1 AA compliance (axe DevTools 0 violations)
- ✅ Semantic HTML (header, main, section, article, footer)
- ✅ ARIA labels where needed (buttons, accordions, images)
- ✅ Keyboard navigation support (Tab, Enter, Space, Arrow keys)
- ✅ Screen reader compatibility (NVDA, JAWS, VoiceOver)
- ✅ Color contrast ratios ≥4.5:1 (text), ≥3:1 (UI components)

### Deployment Requirements:
- ✅ First complete page deployed to production
- ✅ Netlify build successful (0 errors)
- ✅ All routes accessible (no 404s)
- ✅ Cross-browser testing passed (4 browsers)
- ✅ Mobile device testing passed (2 platforms)

---

## Technical Approach

### Component Architecture:
- **File Structure:** One component per directory (src/components/ComponentName/)
- **Naming Convention:** PascalCase for components, camelCase for utilities
- **TypeScript:** Strict mode, explicit types for all props
- **CSS:** Tailwind CSS v4 utility classes, minimal custom CSS
- **Exports:** Barrel exports (index.ts) for clean imports

### Data Integration:
- **Source:** content.json (pre-exported from Airtable)
- **Type Safety:** TypeScript interfaces from src/types/content-data.ts
- **Parsing:** AI-generated JSON arrays (FAQs, Benefits, Process Steps)
- **Fallbacks:** Graceful degradation for missing data

### Responsive Strategy:
- **Approach:** Mobile-first CSS (min-width media queries)
- **Breakpoints:** 320px (base), 768px (md:), 1440px (xl:)
- **Layout:** CSS Grid for main layouts, Flexbox for alignment
- **Images:** Next.js Image component with responsive sizes

### Performance Optimization:
- **Above-the-fold:** Critical CSS inline, preload hero image
- **Below-the-fold:** Lazy load components with Intersection Observer
- **Images:** AVIF/WebP/JPEG with srcset, lazy loading
- **JavaScript:** Code splitting, dynamic imports for heavy components

### Accessibility Implementation:
- **HTML:** Semantic elements (header, nav, main, section, article, footer)
- **ARIA:** Labels for interactive elements, roles where needed
- **Focus Management:** Visible focus states, logical tab order
- **Screen Readers:** Descriptive alt text, live regions for dynamic content

---

## Risk Assessment

### Low Risks:
- **TypeScript Integration:** Type system already in place (src/types/content-data.ts)
- **Performance Regression:** Baseline is 93% faster than target (LCP 179ms vs 2.5s)
- **Responsive Design:** Mobile-first strategy well-established in ADRs
- **Build Time:** Static generation scales linearly, no runtime dependencies

### Medium Risks:
- **Dynamic Branding Complexity:** CSS custom properties may need refinement
  - **Mitigation:** Start with simple color overrides, iterate based on testing
- **AI-Generated Content Parsing:** JSON parsing may fail for malformed data
  - **Mitigation:** Robust error handling, fallback content, validation in export script
- **Cross-Browser Compatibility:** Tailwind CSS v4 is beta (potential issues)
  - **Mitigation:** Test early in Story 2.1, document workarounds, fallback to v3 if needed

### High Risks:
- None identified. All dependencies are complete and validated.

---

## Related Documentation

### Architecture Documents:
- [Component Data Contracts](../components/component-data-contracts.md) - TypeScript interfaces and usage examples
- [Mobile Optimization Checklist](../architecture/mobile-optimization-checklist.md) - Responsive design guidelines
- [LCP Optimization Guide](../architecture/lcp-optimization-guide.md) - Performance optimization strategies
- [Testing Philosophy](../architecture/testing.md) - Testing approach and standards
- [Error Handling](../architecture/error-handling.md) - Error handling patterns

### Type Definitions:
- [src/types/content-data.ts](../../src/types/content-data.ts) - Content data types
- [src/types/airtable-schema.ts](../../src/types/airtable-schema.ts) - Airtable schema types

### Export Infrastructure:
- [scripts/export-airtable-to-json.ts](../../scripts/export-airtable-to-json.ts) - Export script implementation

### Workflows:
- [Build & Deployment Workflow](../workflows/ongoing/build-deployment-workflow.md) - CI/CD pipeline

### Quality Assurance:
- [Phase 0.2 Performance Baseline](../qa/phase-0.2-performance-baseline.md) - Current performance metrics
- [Phase 0.4 Validation Report](../qa/phase-0.4-validation-report.md) - Content.json structure validation

---

## Change Log

| Date | Version | Change | Author |
|------|---------|--------|--------|
| 2025-10-15 | 1.0 | Epic 2 created following epic reorganization (PRD v3.0). Extracted from Phase 0.5 to align with BMad story-based development methodology. | Sarah (PO) |

---

**Next Action:** Create Story 2.1 (HeroSection Component Implementation) to begin epic execution.
