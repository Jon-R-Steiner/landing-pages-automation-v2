# Epic 0 Phase 0.1: Architecture Research & ADR Task List

**Owner:** ARCHITECT
**Duration:** 5-8 days (expanded from 1-2 days)
**Total ADRs:** 30-35 (20 original + 10-15 new from SCP-001)
**Prerequisites:** PRD v2.1, front-end-spec.md, SCP-001 review complete

---

## Task Organization

ADRs are organized into 5 groups:
- **Group A:** Original PRD ADRs (20 items) - Repository, Next.js, Netlify, Airtable, Styling, Testing
- **Group B:** NEW - Tracking & Analytics (4 items) - GTM, CallRail, GA4, conversion tracking
- **Group C:** NEW - Form Optimization (4 items) - 3-stage forms, submission backend, library selection
- **Group D:** NEW - Performance Optimization (4 items) - Quality Score priority, mobile, scripts
- **Group E:** NEW - Conversion Components (3 items) - Trust Bar, Gallery, FAQ, phone CTAs

**Interaction Model for "ARCHITECT TO RECOMMEND" Items:**
1. Research 2-3 viable options
2. Present comparison table with pros/cons to user
3. User selects preferred approach
4. Deep-dive research on selected solution + document alternatives
5. Create ADR with implementation guide + comparison table

---

## GROUP A: Original PRD ADRs (20 items)

*These are from the original PRD Epic 0 Phase 0.1 - no changes needed*

### Repository & Project Structure (4 items)

**ADR-001: Monorepo vs Flat Structure Decision**
- Research: Test Netlify compatibility with monorepo vs flat structure
- Decision criteria: Build process complexity, deployment simplicity, team coordination
- Contingency: Document flattening approach if monorepo causes issues
- **Deliverable:** ADR with selected structure + migration plan if needed

**ADR-002: Directory Organization Standards**
- Research: Next.js 15 App Router recommended structure
- Standards: `/app`, `/components`, `/lib`, `/public`, `/docs`, `/scripts`
- **Deliverable:** ADR with directory structure diagram + naming conventions

**ADR-003: Package Manager Selection**
- Research: npm vs yarn vs pnpm for Next.js 15
- Decision criteria: Lock file reliability, installation speed, workspace support
- **Deliverable:** ADR with selected package manager + rationale

**ADR-004: Node.js Version Specification**
- Research: Next.js 15 minimum requirements, LTS recommendations
- Decision: Node version to use (18.x LTS vs 20.x LTS)
- **Deliverable:** ADR with version selection + .nvmrc file template

---

### Next.js 15 Configuration (6 items)

**ADR-005: App Router Data Fetching Patterns for Static Export**
- Research: `fetch` with cache options, `generateStaticParams()` patterns
- Edge cases: Dynamic routes, data revalidation in static context
- **Deliverable:** ADR with data fetching patterns + code examples

**ADR-006: generateStaticParams() Usage for Dynamic Routes**
- Research: How to pre-render `/[service]/[location]` routes
- Implementation: Fetch all service/location combinations from Airtable at build time
- **Deliverable:** ADR with implementation pattern + example code

**ADR-007: Server Component vs Client Component Boundaries**
- Research: When to use "use client" directive for forms, interactive elements
- Decision criteria: Interactivity needs, bundle size impact, hydration requirements
- **Deliverable:** ADR with component classification guidelines + examples

**ADR-008: Metadata API for SEO**
- Research: Dynamic metadata generation (title, description) per page
- Implementation: `generateMetadata()` function for dynamic routes
- **Deliverable:** ADR with metadata generation pattern + OG tag handling

**ADR-009: Static Export Configuration**
- Research: `next.config.js` settings for `output: 'export'`
- Limitations: No Server Actions, no Incremental Static Regeneration
- **Deliverable:** ADR with complete next.config.js template

**ADR-010: Image Optimization Strategy**
- Research: Next.js Image component vs static images in export mode
- Decision criteria: Build complexity, performance impact, CDN optimization
- **Deliverable:** ADR with image handling strategy (likely static WebP + CDN)

---

### Netlify Deployment (3 items)

**ADR-011: netlify.toml Configuration**
- Research: Build command (`npm run build`), publish directory (`out`), base directory
- Edge cases: Monorepo base directory handling
- **Deliverable:** ADR with complete netlify.toml template

**ADR-012: Plugin Requirements Assessment**
- Research: @netlify/plugin-nextjs compatibility with Next.js 15 static export
- Decision: Use plugin vs native runtime
- **Deliverable:** ADR with plugin decision + configuration if needed

**ADR-013: Environment Variable Management**
- Research: Build-time env vars (AIRTABLE_API_KEY, etc.), security best practices
- Implementation: `.env.local` vs Netlify UI, secret handling
- **Deliverable:** ADR with env var strategy + secret management guidelines

---

### Airtable Integration (2 items)

**ADR-014: API Client Library Selection**
- Research: Official Airtable.js vs custom fetch implementation
- Decision criteria: TypeScript support, error handling, rate limit management
- **Deliverable:** ADR with client library selection + initialization pattern

**ADR-015: Build-Time Data Fetching Implementation**
- Research: How to fetch Airtable data during Next.js build (not runtime)
- Pattern: Use in `generateStaticParams()` and page components
- **Deliverable:** ADR with data fetching patterns + caching strategy

---

### Styling & Assets (2 items)

**ADR-016: Tailwind CSS Configuration**
- Research: Design tokens for brand customization (colors, fonts, spacing)
- Configuration: `tailwind.config.js` with dynamic color injection
- **Deliverable:** ADR with Tailwind config template + brand customization approach

**ADR-017: Font Loading Strategy**
- Research: Local fonts vs Google Fonts for Next.js 15
- Decision criteria: Performance impact on LCP, GDPR compliance, reliability
- **Deliverable:** ADR with font loading strategy (likely local with next/font)

---

### Testing & Validation (3 items)

**ADR-018: Accessibility Testing Tools**
- Research: axe-core vs Lighthouse CI for automated WCAG validation
- Implementation: How to run in CI/CD or manual validation
- **Deliverable:** ADR with accessibility testing approach + tool selection

**ADR-019: HTML Validation Approach**
- Research: W3C validator integration (API or manual)
- Usage: Spot-check vs full validation during multi-tier testing
- **Deliverable:** ADR with HTML validation strategy

**ADR-020: Performance Monitoring Strategy**
- Research: Lighthouse CI, WebPageTest, real user monitoring options
- Decision: Automated vs manual, frequency, thresholds
- **Deliverable:** ADR with performance monitoring approach

---

## GROUP B: NEW - Tracking & Analytics (4 items)

*These are NEW from SCP-001 for paid traffic conversion tracking*

### ADR-021: GTM Container Setup for Next.js Static Export

**Research Focus:**
- GTM container initialization in static HTML (head injection)
- Environment-specific container IDs (dev vs staging vs prod)
- Build-time vs runtime script injection approach
- Performance impact on LCP (async/defer strategies)

**Reference Examples:**
- Find 3+ Next.js + GTM implementations on GitHub
- Study GTM + static site patterns (Gatsby, Hugo examples)

**Edge Cases:**
- How to handle GTM in development (avoid tracking dev traffic)
- Preview deployments (separate GTM container or filtered?)

**Deliverable:**
- ADR with GTM initialization pattern
- Code example: GTM script in layout.tsx or custom _document
- Environment variable strategy (NEXT_PUBLIC_GTM_ID)
- Performance checklist (async loading, defer non-critical tags)

---

### ADR-022: GTM dataLayer Event Architecture

**Research Focus:**
- dataLayer initialization pattern for Next.js
- Event naming conventions (form_start, form_step_2, phone_click, etc.)
- Event schema structure (consistent parameter naming)
- Conversion event mapping (form_submit → Google Ads conversion)

**Reference Examples:**
- Google Analytics 4 recommended events documentation
- Google Ads conversion tracking event requirements
- E-commerce tracking patterns (adapt for lead generation)

**Event Catalog to Define:**
```javascript
// Form Events
dataLayer.push({ event: 'form_start', form_name: 'contact', page_url: '/...' })
dataLayer.push({ event: 'form_step_2', form_name: 'contact', step: 2 })
dataLayer.push({ event: 'form_step_3', form_name: 'contact', step: 3 })
dataLayer.push({ event: 'form_submit', form_name: 'contact', lead_value: 'estimated' })

// Phone Events
dataLayer.push({ event: 'phone_click', phone_number: '555-1234', location: 'hero' })
dataLayer.push({ event: 'phone_click', phone_number: '555-1234', location: 'sticky_header' })

// Engagement Events
dataLayer.push({ event: 'scroll_depth', percent: 25 })
dataLayer.push({ event: 'scroll_depth', percent: 50 })
dataLayer.push({ event: 'scroll_depth', percent: 75 })
```

**Deliverable:**
- ADR with dataLayer event architecture
- Complete event catalog (all events to track)
- Code examples for each event type
- GTM tag configuration guide (how to map events to GA4/Google Ads)

---

### ADR-023: CallRail Integration for Next.js Static Sites (MANDATORY)

**Research Focus (Integration Only - No Alternatives):**
- CallRail dynamic number insertion script placement
- Build-time vs runtime number assignment strategy
- Page-level vs campaign-level tracking approach
- Performance impact mitigation (async loading, script optimization)

**CallRail Implementation Patterns:**
1. **Global Script Approach:**
   - Load CallRail swap.js globally in layout
   - Single tracking number pool per client
   - Swap numbers based on UTM parameters

2. **Page-Level Assignment:**
   - Assign unique CallRail number per page at build time
   - Store CallRail number ID in Airtable
   - Display static number (no runtime swap)

3. **Hybrid Approach:**
   - Base number per page (static)
   - Dynamic swap for campaign tracking (runtime)

**Performance Considerations:**
- CallRail script impact on LCP (<2.5s target)
- Async/defer loading strategies
- Fallback to static number if script fails

**Integration Points:**
- GTM dataLayer event on phone click (track which CallRail number clicked)
- Airtable schema: store CallRail number ID per page
- Build process: fetch CallRail number assignments (if static approach)

**Deliverable:**
- ADR with CallRail integration pattern (recommend ONE approach)
- Pros/cons of each approach (Global vs Page-Level vs Hybrid)
- Code example: CallRail script integration
- Performance impact analysis + mitigation strategies
- Airtable schema updates needed (CallRail number ID fields)

---

### ADR-024: GA4 Event Tracking Configuration

**Research Focus:**
- GA4 enhanced measurement settings
- Custom event tracking setup (via GTM)
- Conversion funnel configuration (form stages, phone clicks)
- Event parameter schema (consistent naming)

**GA4 Setup Requirements:**
- Property creation (one per client or shared?)
- Enhanced measurement (automatic page views, scrolls, outbound clicks)
- Custom events configuration (form events, phone clicks)
- Conversion marking (form_submit, phone_click as conversions)

**Integration with GTM:**
- How GTM sends events to GA4 (GA4 Configuration tag + Event tags)
- Event parameter mapping (dataLayer → GA4 event parameters)

**Reporting & Analysis:**
- Conversion funnel reports (form_start → form_step_2 → form_step_3 → form_submit)
- Phone click analysis (hero vs sticky vs mid-page CTA performance)
- User journey analysis (scroll depth, time on page, engagement)

**Deliverable:**
- ADR with GA4 configuration approach
- GA4 property setup checklist
- Event tracking configuration guide (GTM tag setup)
- Recommended reports/dashboards for conversion analysis

---

## GROUP C: NEW - Form Optimization (4 items)

*These are NEW from SCP-001 for 3-stage progressive disclosure forms*

### ADR-025: 3-Stage Progressive Form Implementation Strategy

**Research Focus:**
- Progressive disclosure UX best practices
- Form state management patterns (multi-step forms)
- Visual progress indicators (1 of 3 → 2 of 3 → 3 of 3)
- Validation strategy (per-step vs on-submit)

**Form Stage Design:**
```
Stage 1 (Primary Conversion):
- Name (required)
- Phone (required, formatted)
- [Continue to Step 2] button

Stage 2 (Qualification):
- Service Type (dropdown or radio: Bathroom Remodel, Walk-in Shower, etc.)
- Location (autocomplete or dropdown: city/zip)
- [Back] [Continue to Step 3] buttons

Stage 3 (Details):
- Project Details (textarea: describe your project)
- Preferred Contact Time (dropdown: Morning, Afternoon, Evening, Anytime)
- [Back] [Submit] buttons
```

**State Management Approaches:**
1. **URL-based state** (query params: ?step=2)
2. **Component state** (useState with step tracking)
3. **Form library state** (depends on library chosen in ADR-027)

**Validation Patterns:**
- Client-side validation (inline, on blur, on submit)
- Error messaging (per-field vs form-level)
- Accessibility (ARIA live regions for errors)

**Deliverable:**
- ADR with 3-stage form implementation strategy
- UX flow diagram (stage transitions)
- State management recommendation
- Validation pattern guidelines
- Accessibility requirements checklist

---

### ADR-026: Form Submission Backend Comparison (ARCHITECT TO RECOMMEND)

**Options to Research & Compare:**

#### Option 1: Formspree Pro
**Pros:**
- Easy integration (POST to endpoint)
- Built-in spam protection (hCaptcha, Akismet)
- Webhook support (can send to GTM dataLayer)
- Email notifications + API access
- CSV export for lead management

**Cons:**
- Cost: $10-40/month depending on submissions
- Third-party dependency
- Limited customization

**GTM Integration:**
- Can trigger dataLayer event on successful submission via webhook
- Or use AJAX submission with response handling

**Evaluation Questions:**
- Cost per 100/500/1000 submissions per month?
- Webhook latency (form submit → GTM event)?
- Spam filtering effectiveness?
- Data export options?

---

#### Option 2: Netlify Forms
**Pros:**
- Native Netlify integration (no external service)
- Simple HTML forms (form attribute on <form>)
- Built-in spam filtering (Akisma)
- Notifications (email, Slack, webhooks)
- Free tier (100 submissions/month)

**Cons:**
- Requires Netlify Functions for GTM dataLayer integration (more complex)
- Limited to 100 submissions/month on free tier
- Harder to customize submission handling

**GTM Integration:**
- Need Netlify Function to intercept submission and push to dataLayer
- OR client-side AJAX submission to Netlify endpoint + manual dataLayer push

**Evaluation Questions:**
- Cost scaling (100 → 500 → 1000 submissions)?
- GTM integration complexity (need Functions?)?
- Form detection reliability (HTML forms in React)?
- Spam filtering quality?

---

#### Option 3: Custom Webhook Endpoint
**Pros:**
- Full control over submission handling
- Can directly push to GTM dataLayer client-side
- No third-party costs (just hosting)
- Custom validation, spam filtering, routing

**Cons:**
- More development work
- Need to host webhook endpoint (Netlify Functions, Vercel Functions, or external)
- Responsible for spam protection implementation
- Responsible for email notifications (SendGrid, etc.)

**GTM Integration:**
- Full control: submit → webhook → success → dataLayer.push()

**Evaluation Questions:**
- Development time estimate?
- Hosting costs (Functions invocations)?
- Spam protection strategy (reCAPTCHA, honeypot, rate limiting)?
- Email notification setup complexity?

---

**Deliverable:**
- ADR with comparison table (Formspree vs Netlify vs Custom)
- Evaluation criteria: GTM integration ease, cost, spam protection, customization
- **PRESENT TO USER** for selection
- **AFTER SELECTION:** Deep-dive on selected solution with implementation guide

---

### ADR-027: Multi-Step Form Library Comparison (ARCHITECT TO RECOMMEND)

**Options to Research & Compare:**

#### Option 1: React Hook Form
**Pros:**
- Lightweight (~9KB gzipped)
- Excellent TypeScript support
- Built-in validation (schema-based with Zod or Yup)
- Uncontrolled components (better performance)
- Good multi-step form examples in docs

**Cons:**
- Less opinionated (more manual setup)
- Steeper learning curve for complex forms

**Multi-Step Implementation:**
- Use `useForm()` with step-based field registration
- Conditional rendering based on step state
- Persist data between steps (combine all steps in one form submission)

**Bundle Size Impact:**
- React Hook Form: ~9KB
- + Zod (if used for validation): ~12KB
- Total: ~21KB (acceptable)

---

#### Option 2: Formik
**Pros:**
- Mature, widely adopted library
- Excellent documentation and community support
- Built-in multi-step form patterns
- Wizard component for step progression

**Cons:**
- Larger bundle size (~13KB gzipped)
- Controlled components (more re-renders)
- Slower performance for complex forms

**Multi-Step Implementation:**
- Use Formik Wizard or manual step management
- `<Formik>` wrapper with nested step components
- Built-in validation with Yup schema

**Bundle Size Impact:**
- Formik: ~13KB
- + Yup (if used): ~12KB
- Total: ~25KB (still acceptable, but larger)

---

#### Option 3: Custom State Management
**Pros:**
- Minimal bundle size (just useState/useReducer)
- Full control over validation and flow
- No library learning curve
- Tailored exactly to needs (3 stages, specific fields)

**Cons:**
- More development time
- Need to implement validation manually
- Less tested (vs battle-tested libraries)
- Reinventing the wheel

**Implementation:**
```typescript
const [step, setStep] = useState(1)
const [formData, setFormData] = useState({
  name: '', phone: '', service: '', location: '', details: '', contactTime: ''
})

const validateStep1 = () => { /* name, phone validation */ }
const validateStep2 = () => { /* service, location validation */ }
const submitForm = () => { /* final validation + submission */ }
```

**Bundle Size Impact:**
- ~0KB (native React)
- Manual validation code: ~2-3KB

---

**Deliverable:**
- ADR with comparison table (React Hook Form vs Formik vs Custom)
- Evaluation criteria: Bundle size, DX, validation features, multi-step support
- Code examples for 3-stage form with each option
- **PRESENT TO USER** for selection
- **AFTER SELECTION:** Deep-dive on selected solution with implementation guide

---

### ADR-028: Form State Persistence Strategy

**Research Focus:**
- localStorage usage for partially completed forms
- Data privacy considerations (PII in localStorage)
- Expiration strategy (how long to store?)
- Cross-session form recovery UX

**Implementation Pattern:**
```javascript
// Save form data on each step completion
const saveFormState = (stepData) => {
  const formState = {
    step: currentStep,
    data: stepData,
    timestamp: Date.now(),
    expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
  }
  localStorage.setItem('leadFormState', JSON.stringify(formState))
}

// Load form state on component mount
useEffect(() => {
  const savedState = localStorage.getItem('leadFormState')
  if (savedState) {
    const parsed = JSON.parse(savedState)
    if (parsed.expiresAt > Date.now()) {
      // Restore form state
      setFormData(parsed.data)
      setStep(parsed.step)
    } else {
      // Expired, clear
      localStorage.removeItem('leadFormState')
    }
  }
}, [])
```

**Privacy Considerations:**
- PII in localStorage (name, phone) - acceptable risk?
- Clear on successful submission
- Clear on expiration (24-48 hours)
- User control (option to clear form state)

**UX for Form Recovery:**
- Show message: "We saved your progress. Would you like to continue where you left off?"
- [Continue] [Start Over] buttons

**Deliverable:**
- ADR with localStorage persistence strategy
- Privacy considerations and mitigation
- Expiration policy recommendation
- Code example for save/load/clear operations

---

## GROUP D: NEW - Performance Optimization (4 items)

*These are NEW from SCP-001 - Quality Score priority, mobile-first*

### ADR-029: Critical CSS Extraction for <2.5s LCP (Quality Score Priority)

**Research Focus:**
- Critical CSS extraction methods (inline vs defer)
- Tool comparison: Critters vs Critical vs manual extraction
- Next.js 15 built-in optimization features
- Impact on LCP (Largest Contentful Paint)

**Methods to Compare:**

#### Option 1: Inline Critical CSS (Build-Time)
- Extract above-fold CSS at build time
- Inline in `<head>` with `<style>` tag
- Defer non-critical CSS with `<link rel="preload">`
- Tools: Critters (built into Next.js), Critical package

**Pros:** Fastest initial render, no render-blocking CSS
**Cons:** Larger HTML size, more complex build process

---

#### Option 2: Defer All CSS (Runtime Loading)
- Load all CSS with `<link rel="preload" as="style">`
- JavaScript-based CSS loading after LCP
- Simpler build, smaller HTML

**Pros:** Simpler implementation, smaller HTML
**Cons:** Flash of unstyled content (FOUC) risk, slower LCP

---

#### Option 3: Tailwind JIT with Purging (Hybrid)
- Tailwind CSS automatically purges unused styles
- Use Next.js built-in CSS optimization
- Inline critical Tailwind utilities, defer custom CSS

**Pros:** Automatic optimization, minimal manual work
**Cons:** Less control over critical/non-critical split

---

**LCP Target Analysis:**
- Measure baseline LCP with different approaches
- Target: <2.5s on mobile 3G/4G (CRITICAL for Quality Score)
- Test with Lighthouse CI, WebPageTest

**Deliverable:**
- ADR with critical CSS strategy recommendation
- Performance comparison (LCP benchmarks)
- Implementation guide (build script or tool configuration)
- Monitoring approach (ensure LCP stays <2.5s)

---

### ADR-030: Third-Party Script Optimization (GTM, CallRail, GA4)

**Research Focus:**
- Async vs defer vs module loading for third-party scripts
- Script loading sequence (what loads first?)
- Impact on LCP, FID, CLS
- Lazy loading non-critical scripts (after user interaction)

**Script Priority:**
```
CRITICAL (Load ASAP):
- GTM container (manages all other scripts)
- CallRail swap.js (if dynamic number insertion)

NON-CRITICAL (Defer):
- GA4 analytics (can load after LCP)
- Google Ads conversion pixel (triggers on conversion, not page load)
- Heatmap/session recording tools (if used in future)
```

**Loading Strategies:**

#### Option 1: Defer All Third-Party Scripts
```html
<script src="https://www.googletagmanager.com/gtm.js?id=GTM-XXXX" defer></script>
```
**Pros:** Doesn't block LCP
**Cons:** Conversion tracking may miss early interactions

---

#### Option 2: Async GTM, Defer Everything Else
```html
<script src="https://www.googletagmanager.com/gtm.js?id=GTM-XXXX" async></script>
```
**Pros:** GTM loads ASAP, manages other scripts intelligently
**Cons:** Slightly slower LCP than defer

---

#### Option 3: Lazy Load After User Interaction
- Load GTM only after first user interaction (scroll, click)
- Ensures LCP not affected by third-party scripts
- Use Intersection Observer or event listeners

**Pros:** Best LCP performance
**Cons:** May miss some early conversion events (less likely for forms)

---

**Performance Testing:**
- Measure LCP impact of each strategy (Lighthouse, WebPageTest)
- Test conversion tracking reliability (does late loading miss events?)
- Balance performance vs tracking completeness

**Deliverable:**
- ADR with third-party script loading strategy
- Script loading sequence documentation
- Performance impact analysis (LCP benchmarks)
- Fallback strategy (if scripts fail to load)

---

### ADR-031: Mobile Performance Optimization (60%+ Traffic Target)

**Research Focus:**
- Mobile-first development approach
- 3G/4G simulation testing
- Touch target sizing (44px minimum for thumb-friendly)
- Viewport optimization for mobile devices

**Mobile Optimization Checklist:**

#### 1. Touch Targets
- All CTAs (buttons, phone numbers, form fields) ≥44px × 44px
- Adequate spacing between interactive elements (8px minimum)
- Large tap areas for primary conversion actions

#### 2. Form UX (Mobile-Specific)
- Input type optimization (`type="tel"` for phone, `type="email"`, etc.)
- Autocomplete attributes (`autocomplete="name"`, `autocomplete="tel"`)
- Large, easy-to-tap form fields (minimum 44px height)
- Minimize typing (dropdowns/selects where possible)

#### 3. Performance on 3G/4G
- Test LCP on throttled 3G (should still be <2.5s if possible, <3.5s acceptable)
- Image optimization critical (WebP, lazy loading, proper sizing)
- Minimize JavaScript bundle size (code splitting, tree shaking)

#### 4. Viewport & Responsive Design
- Breakpoints: 320px (small mobile), 375px (iPhone), 414px (large mobile), 768px (tablet)
- Fluid typography (clamp() or responsive font sizes)
- Stack all sections vertically on mobile (no side-by-side layouts)

#### 5. Testing Methodology
- Chrome DevTools mobile emulation
- Real device testing (iOS Safari, Android Chrome)
- 3G throttling in DevTools Network panel

**Deliverable:**
- ADR with mobile optimization strategy
- Mobile-first design checklist
- Touch target sizing guidelines
- 3G/4G performance benchmarks
- Testing protocol for mobile validation

---

### ADR-032: Core Web Vitals Monitoring & Optimization

**Research Focus:**
- Core Web Vitals targets (LCP <2.5s, FID <100ms, CLS <0.1)
- Real user monitoring (RUM) vs lab testing (Lighthouse)
- Continuous monitoring approach (post-deployment)

**Core Web Vitals Breakdown:**

#### 1. LCP (Largest Contentful Paint) - <2.5s
**What:** Time until largest content element renders
**Typically:** Hero image or headline text
**Optimization:**
- Optimize hero image (WebP, proper sizing, preload)
- Inline critical CSS for above-fold content
- Fast server response (CDN for static files)
- Minimize render-blocking resources

---

#### 2. FID (First Input Delay) - <100ms
**What:** Time from first user interaction to browser response
**Typically:** Clicking CTA button, focusing form field
**Optimization:**
- Minimize main thread JavaScript execution
- Defer non-critical scripts
- Use web workers for heavy computation (unlikely needed)
- Optimize event handlers (debounce/throttle if needed)

---

#### 3. CLS (Cumulative Layout Shift) - <0.1
**What:** Unexpected layout shifts during page load
**Causes:** Images without dimensions, web fonts loading, ads/embeds
**Optimization:**
- Set explicit width/height on images
- Reserve space for dynamic content (forms, embeds)
- Use `font-display: swap` carefully (may cause shift)
- Avoid injecting content above existing content

---

**Monitoring Strategy:**

#### Lab Testing (Pre-Deployment)
- Lighthouse CI in build pipeline (fail build if CWV targets not met)
- WebPageTest for detailed performance analysis
- Manual testing on sample pages

#### Real User Monitoring (Post-Deployment)
- GA4 Web Vitals tracking (built-in reports)
- Chrome User Experience Report (CrUX) data
- Field data from real users on real devices/networks

**Deliverable:**
- ADR with Core Web Vitals optimization strategy
- Lab testing approach (Lighthouse CI setup)
- Real user monitoring setup (GA4 Web Vitals)
- Performance budget (fail build if LCP >2.5s, CLS >0.1)
- Continuous monitoring dashboard recommendation

---

## GROUP E: NEW - Conversion Components (3 items)

*These are NEW from SCP-001 - Trust Bar, Gallery, FAQ, phone CTAs*

### ADR-033: Sticky Trust Bar Implementation

**Research Focus:**
- Sticky header performance (CSS position: sticky vs fixed)
- Mobile vs desktop behavior (condensed mobile, full desktop)
- Impact on CLS (Cumulative Layout Shift)
- Accessibility (ARIA landmarks, keyboard navigation)

**Trust Bar Requirements:**

**Desktop:**
```
[Licensed & Insured IL #123456] [15 Years] [⭐ 4.9 (127 Reviews)] [📞 Call Now]
```

**Mobile (Condensed):**
```
[📞 (555) 123-4567]
```

**Implementation Options:**

#### Option 1: CSS position: sticky
```css
.trust-bar {
  position: sticky;
  top: 0;
  z-index: 50;
}
```
**Pros:** Better performance, native browser behavior
**Cons:** Doesn't stick on iOS Safari older versions

---

#### Option 2: CSS position: fixed + JavaScript
- Use Intersection Observer to toggle fixed positioning
- Only make sticky after scrolling past hero section
- Better control over when it appears

**Pros:** Cross-browser compatibility, conditional stickiness
**Cons:** Slightly more complex, JavaScript required

---

**CLS Mitigation:**
- Reserve space for sticky element (`padding-top` on body or next sibling)
- Ensure trust bar has fixed height (no layout shifts when sticky)
- Test on mobile devices for layout stability

**Performance Considerations:**
- Trust bar should not affect LCP (appears after hero loads)
- Minimize JavaScript for sticky behavior (prefer CSS)
- Ensure phone number is tap-friendly (large tap target on mobile)

**Deliverable:**
- ADR with sticky trust bar implementation approach
- Desktop vs mobile responsive behavior
- CLS mitigation strategy
- Accessibility checklist (ARIA, keyboard nav)
- Code example (CSS + optional JavaScript)

---

### ADR-034: Before/After Gallery Component

**Research Focus:**
- Image slider libraries (if interactive) vs static grid
- Lazy loading implementation (Intersection Observer)
- Performance impact (total gallery weight <600KB target)
- Accessibility (alt text, keyboard navigation)

**Gallery Options:**

#### Option 1: Interactive Slider (Before/After Reveal)
- Use library: react-compare-image, react-image-comparison
- User drags slider to reveal before/after
- Engaging UX, higher interaction

**Pros:** Interactive, visually engaging
**Cons:** Larger bundle size, more complex, accessibility harder

---

#### Option 2: Static Grid (Before | After Side-by-Side)
```
[Before] [After]   [Before] [After]
[Before] [After]   [Before] [After]
```
- Simple layout, no library needed
- Easy to implement, better performance
- Clear visual comparison

**Pros:** Lightweight, fast, accessible
**Cons:** Less engaging, no interactivity

---

#### Option 3: Hybrid (Static with Optional Modal Slider)
- Static grid on initial view
- Click image to open modal with interactive slider
- Best of both: performance + engagement for interested users

**Pros:** Fast initial load, interactive for engaged users
**Cons:** More complex implementation

---

**Image Optimization:**
- WebP format (fallback to JPEG if needed)
- Lazy load all images (except first 2 above fold)
- Proper sizing (max 800px width, ~100KB each)
- Total gallery weight target: <600KB (6-8 images)

**Accessibility:**
- Alt text: "Before: Outdated bathroom with pink tile, After: Modern walk-in shower"
- Keyboard navigation (if slider used)
- Screen reader announcements for before/after comparison

**Deliverable:**
- ADR with gallery implementation approach (recommend ONE)
- Image optimization strategy (format, sizing, lazy loading)
- Performance analysis (bundle size, LCP impact)
- Accessibility implementation guide
- Code example or library recommendation

---

### ADR-035: FAQ Accordion Component

**Research Focus:**
- Accordion implementation (native details/summary vs custom)
- SEO considerations (collapsed content visibility to search engines)
- Accessibility (ARIA expanded/collapsed states, keyboard navigation)
- Performance (minimal JavaScript, CSS-only if possible)

**FAQ Implementation Options:**

#### Option 1: Native HTML <details>/<summary>
```html
<details>
  <summary>How long does a bathroom remodel take?</summary>
  <p>Most bathroom remodels take 2-3 weeks from start to finish...</p>
</details>
```
**Pros:** Zero JavaScript, native accessibility, SEO-friendly
**Cons:** Limited styling control, browser inconsistencies

---

#### Option 2: Custom Accordion (React State)
- Use useState to manage open/closed state
- Custom styling with Tailwind CSS
- ARIA attributes for accessibility

**Pros:** Full styling control, consistent cross-browser
**Cons:** Requires JavaScript, more complex

---

#### Option 3: Headless UI Disclosure Component
- Use @headlessui/react Disclosure component
- Built-in accessibility, keyboard navigation
- Tailwind CSS for styling

**Pros:** Accessibility out of the box, good DX
**Cons:** Additional dependency (~5KB), slight bundle increase

---

**SEO Considerations:**
- Search engines can read collapsed content (both <details> and ARIA approaches)
- Use semantic HTML (heading + content structure)
- Include relevant keywords in questions and answers

**Accessibility Requirements:**
- ARIA expanded/collapsed states (aria-expanded="true/false")
- Keyboard navigation (Enter/Space to toggle)
- Focus management (keyboard focus visible)
- Screen reader announcements

**Content Structure:**
```
FAQ 1: How long does a bathroom remodel take?
Answer: Most bathroom remodels take 2-3 weeks from start to finish, depending on the scope of work...

FAQ 2: Do I need permits for bathroom remodeling?
Answer: In most cases, yes. We handle all permit applications for you...

FAQ 3: What is the average cost of a bathroom remodel?
Answer: Costs typically range from $8,000 to $25,000 depending on...

[5-8 total FAQs]
```

**Deliverable:**
- ADR with FAQ accordion implementation approach (recommend ONE)
- Accessibility checklist (ARIA, keyboard nav, screen readers)
- SEO considerations (semantic HTML, content structure)
- Code example (native details or custom component)

---

## Reference Implementation Study

**ARCHITECT MUST:**
1. Find 3+ working Next.js 15 + Netlify + Static Export projects on GitHub
2. Clone at least 1 example and verify it runs/deploys successfully
3. Study configuration files (next.config.js, netlify.toml, package.json)
4. Document reference URLs and key learnings in ADRs

**Suggested Search Queries:**
- "Next.js 15 static export Netlify"
- "Next.js App Router static site Netlify"
- "Next.js 15 generateStaticParams example"

---

## Final Deliverable Checklist

**For Each ADR:**
- [ ] Decision documented with rationale
- [ ] Alternative approaches considered (pros/cons)
- [ ] Reference URLs (documentation, GitHub examples)
- [ ] Code examples or configuration templates
- [ ] Implementation guidelines (step-by-step)
- [ ] Risk assessment (what could go wrong?)
- [ ] Contingency plan (fallback if selected approach fails)

**For "ARCHITECT TO RECOMMEND" ADRs (026, 027):**
- [ ] Research 2-3 viable options
- [ ] Create comparison table (evaluation criteria with scores)
- [ ] Present to user for selection
- [ ] After user selects: deep-dive research on selected solution
- [ ] Document alternatives in ADR (for future reference)

**Architecture Document Structure:**
```
docs/
  architecture/
    ADR-001-monorepo-decision.md
    ADR-002-directory-structure.md
    ...
    ADR-035-faq-accordion.md
    reference-implementations.md (GitHub examples studied)
    decisions-summary.md (quick reference of all decisions)
```

---

## Success Criteria

**Epic 0 Phase 0.1 Complete When:**
- [ ] All 30-35 ADRs documented (20 original + 10-15 new)
- [ ] Reference implementations studied (3+ found, 1 deployed)
- [ ] User selections received for ADR-026 (form backend) and ADR-027 (form library)
- [ ] Configuration templates created (next.config.js, netlify.toml, tailwind.config.js)
- [ ] PM reviews and approves all ADRs
- [ ] Handoff document prepared for development team

**Ready for Epic 0 Phase 0.2:** Deployment Baseline ("Hello World" Proof)

---

**END OF ADR TASK LIST**
