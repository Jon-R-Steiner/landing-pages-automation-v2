# ADR-031: Mobile Performance Optimization (60%+ Traffic Target)

**Status:** Approved
**Date:** 2025-10-10
**Decision Makers:** Architecture Team, UX Team, Performance Team
**Stakeholders:** Development Team, Marketing Team, QA Team

---

## Context and Problem Statement

**Mobile traffic accounts for 60%+ of total site traffic** for home services landing pages. Mobile optimization is CRITICAL for:
- **Conversion rate:** Mobile users are decision-makers (call now, submit form)
- **Google Ads Quality Score:** Mobile performance directly impacts ad costs
- **Core Web Vitals:** Mobile-first indexing prioritizes mobile performance
- **User experience:** Slow mobile sites lose 53% of users (Google data)

We need a comprehensive mobile optimization strategy covering:
1. **Touch target sizing** (≥44px minimum)
2. **Input type optimization** (type="tel", autocomplete)
3. **3G/4G testing methodology** (slow network simulation)
4. **Responsive breakpoints** (320px, 375px, 414px, 768px)
5. **Mobile-first design principles**
6. **Performance targets** (LCP <2.5s on 3G)

---

## Decision Drivers

1. **Traffic Distribution:** 60%+ mobile, 40%- desktop
2. **Conversion Impact:** Mobile users have high intent (ready to call/submit)
3. **Performance Requirements:** LCP <2.5s on 3G (Google Ads Quality Score)
4. **Google Mobile-First Indexing:** Mobile version is primary for SEO
5. **Accessibility:** WCAG 2.1 AA touch target requirements (44×44px minimum)
6. **Browser Support:** Safari iOS 16.4+, Chrome Android 111+, Firefox Android 128+
7. **Network Conditions:** Assume 3G/4G (not 5G) for testing

---

## Decision Outcome

**Selected: Mobile-First Design with Comprehensive Optimization Checklist**

**Rationale:**
1. ✅ **Mobile-first approach** ensures best experience for majority (60%+) of users
2. ✅ **Performance-first** design prioritizes LCP <2.5s on 3G networks
3. ✅ **Touch-optimized** UI with ≥44px touch targets
4. ✅ **Network-resilient** with 3G/4G testing methodology
5. ✅ **Accessibility-compliant** with WCAG 2.1 AA standards

---

## Mobile Optimization Checklist

### Phase 1: Touch Target Sizing (WCAG 2.1 AA)

#### Minimum Touch Target Requirements

**WCAG 2.1 AA Standard:**
- ✅ Minimum touch target size: **44×44px** (iOS Human Interface Guidelines)
- ✅ Recommended size: **48×48px** (Android Material Design)
- ✅ Spacing between targets: **8px minimum** (prevents mis-taps)

**Critical Elements to Check:**

**1. Form Inputs**
```css
/* Minimum touch target for form inputs */
input[type="text"],
input[type="tel"],
input[type="email"],
textarea,
select {
  min-height: 44px; /* iOS minimum */
  padding: 0.75rem 1rem; /* ~12px top/bottom + 16px left/right */
  font-size: 16px; /* Prevents iOS zoom */
}

@media (min-width: 768px) {
  input[type="text"],
  input[type="tel"],
  input[type="email"],
  textarea,
  select {
    min-height: 48px; /* Tablet/desktop can be larger */
  }
}
```

**2. Buttons (Primary CTA)**
```css
/* Minimum touch target for buttons */
button,
.btn {
  min-height: 44px; /* iOS minimum */
  min-width: 44px; /* For icon-only buttons */
  padding: 0.75rem 1.5rem; /* ~12px top/bottom + 24px left/right */
  font-size: 16px; /* Prevents iOS zoom */
}

/* Primary CTA should be larger for emphasis */
.btn-primary {
  min-height: 48px;
  padding: 1rem 2rem; /* ~16px top/bottom + 32px left/right */
  font-size: 1.125rem; /* 18px */
}
```

**3. Links in Text**
```css
/* Links need adequate spacing */
a {
  min-height: 44px;
  display: inline-block;
  padding: 0.5rem 0; /* Add vertical padding for touch area */
}

/* Navigation links */
nav a {
  min-height: 44px;
  padding: 0.75rem 1rem;
  display: block; /* Full width touch target */
}
```

**4. Icon Buttons (Close, Menu, etc.)**
```css
/* Icon-only buttons (hamburger menu, close button) */
.icon-button {
  width: 44px;
  height: 44px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-button svg {
  width: 24px; /* Icon can be smaller, button provides touch area */
  height: 24px;
}
```

**5. Checkbox and Radio Buttons**
```css
/* Custom checkbox/radio with larger touch area */
input[type="checkbox"],
input[type="radio"] {
  width: 24px; /* Visual size */
  height: 24px;
  margin: 10px; /* Creates 44px total touch area (24px + 20px margin) */
  cursor: pointer;
}

/* Alternative: Custom styled with larger hit area */
.custom-checkbox {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 44px;
}

.custom-checkbox input {
  position: absolute;
  opacity: 0;
  width: 44px;
  height: 44px;
  cursor: pointer;
}

.custom-checkbox .checkmark {
  position: absolute;
  top: 10px;
  left: 10px;
  width: 24px;
  height: 24px;
  border: 2px solid #ccc;
}
```

#### Testing Touch Targets

**Chrome DevTools Method:**
1. Open DevTools → Settings → Experiments
2. Enable "Show touch/mouse target size"
3. Inspect elements → Verify ≥44×44px

**Manual Testing:**
1. Test on real devices (iPhone, Android)
2. Attempt to tap each interactive element
3. Verify no mis-taps or accidental clicks

**Automated Testing:**
```typescript
// Playwright test for touch target sizing
import { test, expect } from '@playwright/test'

test('Touch targets are at least 44x44px', async ({ page }) => {
  await page.goto('http://localhost:3000')

  // Get all interactive elements
  const buttons = await page.locator('button, a, input, select, textarea').all()

  for (const button of buttons) {
    const box = await button.boundingBox()
    if (box) {
      expect(box.width).toBeGreaterThanOrEqual(44)
      expect(box.height).toBeGreaterThanOrEqual(44)
    }
  }
})
```

---

### Phase 2: Input Type Optimization

#### HTML5 Input Types for Mobile

**1. Phone Number Input**
```html
<!-- ✅ CORRECT: Shows numeric keypad on mobile -->
<input
  type="tel"
  name="phone"
  id="phone"
  placeholder="(555) 123-4567"
  autocomplete="tel"
  required
/>
```

**2. Email Input**
```html
<!-- ✅ CORRECT: Shows email keyboard (@, .com shortcuts) -->
<input
  type="email"
  name="email"
  id="email"
  placeholder="you@example.com"
  autocomplete="email"
  required
/>
```

**3. Text Input with Autocomplete**
```html
<!-- ✅ CORRECT: Enables browser autofill -->
<input
  type="text"
  name="first-name"
  id="first-name"
  placeholder="First Name"
  autocomplete="given-name"
  required
/>

<input
  type="text"
  name="last-name"
  id="last-name"
  placeholder="Last Name"
  autocomplete="family-name"
  required
/>
```

**4. Address Input**
```html
<!-- ✅ CORRECT: Enables address autofill -->
<input
  type="text"
  name="street-address"
  id="street-address"
  placeholder="Street Address"
  autocomplete="street-address"
/>

<input
  type="text"
  name="city"
  id="city"
  placeholder="City"
  autocomplete="address-level2"
/>

<input
  type="text"
  name="state"
  id="state"
  placeholder="State"
  autocomplete="address-level1"
/>

<input
  type="text"
  name="zip"
  id="zip"
  placeholder="ZIP Code"
  autocomplete="postal-code"
  inputmode="numeric"
/>
```

**5. Prevent iOS Zoom on Focus**
```css
/* Font size ≥16px prevents iOS auto-zoom */
input,
select,
textarea {
  font-size: 16px; /* CRITICAL: Prevents iOS zoom */
}

/* If you need smaller text visually, scale up input and down container */
@media (max-width: 767px) {
  input,
  select,
  textarea {
    font-size: 16px; /* Never go below 16px on mobile */
  }
}
```

#### Complete Autocomplete Attributes Reference

| Field | `autocomplete` Value |
|-------|---------------------|
| First Name | `given-name` |
| Last Name | `family-name` |
| Full Name | `name` |
| Email | `email` |
| Phone | `tel` |
| Street Address | `street-address` |
| City | `address-level2` |
| State/Province | `address-level1` |
| ZIP/Postal Code | `postal-code` |
| Country | `country` |

**Why This Matters:**
- ✅ **Faster form completion:** Autofill reduces typing by 80%+
- ✅ **Better UX:** Correct keyboard reduces errors
- ✅ **Higher conversion:** Easier forms = more submissions

---

### Phase 3: 3G/4G Testing Methodology

#### Network Throttling Configuration

**Chrome DevTools Network Throttling:**

1. **Open DevTools** → Network tab
2. **Select Throttling Preset:**
   - **Slow 3G:** 400kbps down, 400kbps up, 2000ms latency
   - **Fast 3G:** 1.6Mbps down, 750kbps up, 562.5ms latency
   - **Slow 4G:** 4Mbps down, 3Mbps up, 170ms latency
   - **Fast 4G:** 10Mbps down, 5Mbps up, 85ms latency

**Recommended Testing Profile: Slow 4G**
- Download: 4Mbps (most common mobile)
- Upload: 3Mbps
- Latency: 170ms
- **Why:** Represents median mobile network (US average)

---

#### Lighthouse CI with Mobile Network Simulation

**Install Lighthouse CI:**
```bash
npm install --save-dev @lhci/cli
```

**Configuration:** `.lighthouserc.json`
```json
{
  "ci": {
    "collect": {
      "startServerCommand": "npm run start",
      "url": ["http://localhost:3000"],
      "settings": {
        "preset": "desktop",
        "throttling": {
          "rttMs": 40,
          "throughputKbps": 10240,
          "cpuSlowdownMultiplier": 1
        }
      }
    },
    "upload": {
      "target": "temporary-public-storage"
    },
    "assert": {
      "preset": "lighthouse:recommended",
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.9 }],
        "categories:accessibility": ["error", { "minScore": 0.95 }],
        "categories:seo": ["error", { "minScore": 0.95 }],
        "first-contentful-paint": ["warn", { "maxNumericValue": 2000 }],
        "largest-contentful-paint": ["error", { "maxNumericValue": 2500 }],
        "cumulative-layout-shift": ["error", { "maxNumericValue": 0.1 }]
      }
    }
  }
}
```

**Mobile-Specific Configuration:**
```json
{
  "ci": {
    "collect": {
      "settings": {
        "preset": "mobile",
        "formFactor": "mobile",
        "throttling": {
          "rttMs": 170,
          "throughputKbps": 4000,
          "requestLatencyMs": 170,
          "downloadThroughputKbps": 4000,
          "uploadThroughputKbps": 3000,
          "cpuSlowdownMultiplier": 4
        },
        "screenEmulation": {
          "mobile": true,
          "width": 375,
          "height": 667,
          "deviceScaleFactor": 2
        }
      }
    }
  }
}
```

**Run Lighthouse CI:**
```bash
# Mobile performance test
npm run lhci -- --preset=mobile

# Compare desktop vs mobile
npm run lhci -- --preset=desktop
npm run lhci -- --preset=mobile
```

---

#### WebPageTest Mobile Testing

**WebPageTest Configuration:**

1. **URL:** https://www.webpagetest.org/
2. **Test Settings:**
   - **Location:** Choose mobile location (e.g., "Dulles, VA - Moto G4 - 3G")
   - **Browser:** Chrome Mobile
   - **Connection:** 3G or 4G
   - **Number of Tests:** 3 (median result)
   - **Capture Video:** Yes
   - **Keep Test Private:** No (unless sensitive)

3. **Analyze Results:**
   - **LCP:** Target <2.5s on 3G
   - **Speed Index:** Target <3.0s on 3G
   - **Time to Interactive:** Target <5.0s on 3G
   - **First Byte:** Target <600ms on 3G
   - **Fully Loaded:** Target <8.0s on 3G

**WebPageTest API Integration (Optional):**
```javascript
// scripts/test-mobile-performance.js
const WebPageTest = require('webpagetest')
const wpt = new WebPageTest('www.webpagetest.org', process.env.WPT_API_KEY)

wpt.runTest(
  'https://example.com',
  {
    location: 'Dulles_MotoG4:Moto G4 - Chrome',
    connectivity: '3G',
    runs: 3,
    firstViewOnly: false,
    video: true,
  },
  (err, result) => {
    if (err) return console.error(err)
    console.log('Test Results:', result.data.summary)
  }
)
```

---

#### Real Device Testing

**Minimum Test Devices:**

1. **iPhone (iOS):**
   - iPhone SE (3rd gen) - Small screen, older hardware
   - iPhone 14 Pro - Modern flagship

2. **Android:**
   - Samsung Galaxy A53 - Mid-range (most common)
   - Google Pixel 7 - Stock Android, modern

**BrowserStack Mobile Testing:**

```yaml
# .browserstack.yml
browsers:
  - device: "iPhone SE"
    os: "iOS"
    osVersion: "16"
    browser: "Safari"

  - device: "Samsung Galaxy S21"
    os: "Android"
    osVersion: "11.0"
    browser: "Chrome"

  - device: "Google Pixel 7"
    os: "Android"
    osVersion: "13.0"
    browser: "Chrome"
```

**Testing Checklist (Real Devices):**
- [ ] Page loads in <3 seconds on 3G
- [ ] All touch targets ≥44px (no mis-taps)
- [ ] Keyboard opens correctly for input types
- [ ] Autofill works for forms
- [ ] No horizontal scrolling
- [ ] Images load correctly (lazy loading works)
- [ ] CTA buttons are thumb-reachable (bottom 1/3 of screen)

---

### Phase 4: Responsive Breakpoints

#### Standard Breakpoints (Mobile-First)

**Tailwind CSS Default Breakpoints:**
```css
/* Mobile-first breakpoints */
/* Default: 0-639px (mobile) */

/* sm: 640px+ (large phones, small tablets) */
@media (min-width: 640px) {
  /* Styles */
}

/* md: 768px+ (tablets) */
@media (min-width: 768px) {
  /* Styles */
}

/* lg: 1024px+ (laptops, desktops) */
@media (min-width: 1024px) {
  /* Styles */
}

/* xl: 1280px+ (large desktops) */
@media (min-width: 1280px) {
  /* Styles */
}

/* 2xl: 1536px+ (extra large desktops) */
@media (min-width: 1536px) {
  /* Styles */
}
```

---

#### Project-Specific Breakpoints

**Custom Breakpoints for Home Services Landing Pages:**

1. **Mobile Small (320px-374px):** iPhone SE, small Androids
2. **Mobile Medium (375px-413px):** iPhone 14, Pixel 7
3. **Mobile Large (414px-767px):** iPhone 14 Pro Max, large Androids
4. **Tablet (768px-1023px):** iPad, Android tablets
5. **Desktop (1024px+):** Laptops, desktops

**Tailwind Config Customization:**
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    screens: {
      'xs': '320px',  // Small phones
      'sm': '375px',  // Medium phones (iPhone 14)
      'md': '414px',  // Large phones (iPhone 14 Pro Max)
      'lg': '768px',  // Tablets
      'xl': '1024px', // Laptops
      '2xl': '1280px', // Large desktops
    },
  },
}
```

**CSS Custom Media Queries (Alternative):**
```css
/* Define custom breakpoints */
@custom-media --mobile-small (min-width: 320px);
@custom-media --mobile-medium (min-width: 375px);
@custom-media --mobile-large (min-width: 414px);
@custom-media --tablet (min-width: 768px);
@custom-media --desktop (min-width: 1024px);

/* Usage */
@media (--mobile-medium) {
  .container {
    padding: 1rem;
  }
}
```

---

#### Responsive Layout Patterns

**1. Single Column → Multi-Column**
```tsx
// Mobile: Single column, Desktop: 2 columns
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <div>Column 1</div>
  <div>Column 2</div>
</div>
```

**2. Stacked → Side-by-Side**
```tsx
// Mobile: Stacked, Desktop: Side-by-side
<div className="flex flex-col md:flex-row gap-4">
  <div className="w-full md:w-1/2">Left</div>
  <div className="w-full md:w-1/2">Right</div>
</div>
```

**3. Full Width → Contained**
```tsx
// Mobile: Full width, Desktop: Max-width container
<div className="w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
  <div>Content</div>
</div>
```

**4. Hidden → Visible**
```tsx
// Mobile: Hidden, Desktop: Visible
<div className="hidden md:block">
  Desktop-only content
</div>

// Mobile: Visible, Desktop: Hidden
<div className="block md:hidden">
  Mobile-only content
</div>
```

---

#### Testing Responsive Layouts

**Chrome DevTools Device Emulation:**

**Common Device Presets:**
1. iPhone SE (375×667) - Small phone
2. iPhone 14 Pro (393×852) - Medium phone
3. iPhone 14 Pro Max (430×932) - Large phone
4. Pixel 7 (412×915) - Android medium
5. iPad Air (820×1180) - Tablet portrait
6. iPad Pro 12.9" (1024×1366) - Tablet landscape

**Testing Checklist (Each Breakpoint):**
- [ ] Layout adapts correctly (no broken columns)
- [ ] Text is readable (font sizes scale appropriately)
- [ ] Images scale correctly (no distortion)
- [ ] Buttons remain accessible (not cut off)
- [ ] Navigation works (hamburger menu on mobile)
- [ ] Forms fit screen (no horizontal scroll)

---

### Phase 5: Mobile-First Design Principles

#### Design Philosophy

**Start with Mobile, Enhance for Desktop:**

```css
/* ❌ WRONG: Desktop-first (requires overrides) */
.container {
  width: 1200px; /* Desktop default */
  padding: 2rem;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}

@media (max-width: 768px) {
  .container {
    width: 100%; /* Override */
    padding: 1rem; /* Override */
    grid-template-columns: 1fr; /* Override */
  }
}
```

```css
/* ✅ CORRECT: Mobile-first (progressive enhancement) */
.container {
  width: 100%; /* Mobile default */
  padding: 1rem;
  display: grid;
  grid-template-columns: 1fr; /* Single column */
}

@media (min-width: 768px) {
  .container {
    padding: 2rem; /* Enhance for tablet */
    grid-template-columns: repeat(2, 1fr); /* 2 columns */
  }
}

@media (min-width: 1024px) {
  .container {
    max-width: 1200px; /* Enhance for desktop */
    margin: 0 auto;
    grid-template-columns: repeat(3, 1fr); /* 3 columns */
  }
}
```

---

#### Mobile-First Component Patterns

**1. Navigation (Hamburger → Horizontal)**

```tsx
// Mobile: Hamburger menu, Desktop: Horizontal nav
export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4">
        {/* Mobile: Hamburger button */}
        <button
          className="md:hidden p-2"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Desktop: Horizontal nav */}
        <ul className="hidden md:flex md:space-x-8">
          <li><a href="/services">Services</a></li>
          <li><a href="/about">About</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>

        {/* Mobile: Dropdown menu */}
        {isOpen && (
          <ul className="md:hidden mt-4 space-y-2">
            <li><a href="/services">Services</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        )}
      </div>
    </nav>
  )
}
```

**2. Hero Section (Stacked → Side-by-Side)**

```tsx
// Mobile: Image on top, text below
// Desktop: Image on right, text on left
export function Hero() {
  return (
    <section className="py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Text (mobile: top, desktop: left) */}
          <div className="w-full md:w-1/2">
            <h1 className="text-3xl md:text-5xl font-bold">
              Bathroom Remodeling Experts
            </h1>
            <p className="mt-4 text-lg">
              Transform your bathroom with our professional services.
            </p>
            <button className="mt-6 btn-primary">
              Get Free Quote
            </button>
          </div>

          {/* Image (mobile: bottom, desktop: right) */}
          <div className="w-full md:w-1/2">
            <img
              src="/hero.jpg"
              alt="Beautiful bathroom"
              className="w-full rounded-lg"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
```

**3. Form (Full Width → Centered)**

```tsx
// Mobile: Full width, Desktop: Centered with max-width
export function ContactForm() {
  return (
    <form className="w-full max-w-2xl mx-auto px-4">
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Name"
          className="w-full min-h-[44px] px-4 border rounded"
        />
        <input
          type="tel"
          placeholder="Phone"
          className="w-full min-h-[44px] px-4 border rounded"
        />
        <button className="w-full md:w-auto min-h-[48px] px-8 btn-primary">
          Submit
        </button>
      </div>
    </form>
  )
}
```

---

### Phase 6: Mobile Performance Targets

#### Core Web Vitals (Mobile-Specific)

**Lighthouse Mobile Preset Targets:**

| Metric | Target (Good) | Warning | Fail |
|--------|--------------|---------|------|
| **LCP** (Largest Contentful Paint) | <2.5s | 2.5-4.0s | >4.0s |
| **FID** (First Input Delay) | <100ms | 100-300ms | >300ms |
| **CLS** (Cumulative Layout Shift) | <0.1 | 0.1-0.25 | >0.25 |
| **FCP** (First Contentful Paint) | <1.8s | 1.8-3.0s | >3.0s |
| **Speed Index** | <3.4s | 3.4-5.8s | >5.8s |
| **TTI** (Time to Interactive) | <3.8s | 3.8-7.3s | >7.3s |
| **TBT** (Total Blocking Time) | <200ms | 200-600ms | >600ms |

**Mobile-Specific Considerations:**

1. **CPU Slowdown:** Lighthouse mobile uses 4x CPU slowdown (simulates slower mobile CPUs)
2. **Network Throttling:** Slow 4G (4Mbps down, 3Mbps up, 170ms latency)
3. **Viewport:** 375×667 (iPhone SE size)
4. **Device Scale Factor:** 2x (Retina display)

---

#### Page Weight Budgets (Mobile)

**Maximum Page Sizes (Mobile 3G):**

| Resource | Budget | Rationale |
|----------|--------|-----------|
| **HTML** | 50KB (uncompressed) | Fast FCP, immediate render |
| **CSS** | 150KB (uncompressed) | Critical CSS inlined, rest deferred |
| **JavaScript** | 200KB (uncompressed) | Minimal JS, defer non-critical |
| **Images** | 600KB total | Hero + gallery, lazy load below fold |
| **Fonts** | 100KB | 2 font families max (Regular + Bold) |
| **Total** | **1.1MB** (uncompressed) | Loads in <3s on 3G |

**Compressed (Gzip/Brotli):**
- HTML: ~15KB
- CSS: ~40KB
- JavaScript: ~60KB
- Images: ~300KB (AVIF/WebP)
- Fonts: ~50KB (WOFF2)
- **Total:** ~465KB (compressed)

---

#### Optimization Strategies

**1. Critical CSS Inline (First Paint <1.8s)**
```html
<!-- Inline critical CSS in <head> -->
<head>
  <style>
    /* Critical CSS (above-fold styles) */
    body { margin: 0; font-family: sans-serif; }
    .hero { padding: 2rem 1rem; background: #f0f0f0; }
    .btn-primary { background: #0066cc; color: white; padding: 1rem 2rem; }
  </style>

  <!-- Defer non-critical CSS -->
  <link rel="preload" href="/styles.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
  <noscript><link rel="stylesheet" href="/styles.css"></noscript>
</head>
```

**2. Image Lazy Loading (Reduce Initial Load)**
```html
<!-- Eager load hero image (above fold) -->
<img src="/hero.jpg" alt="Hero" loading="eager" fetchpriority="high" />

<!-- Lazy load below-fold images -->
<img src="/gallery-1.jpg" alt="Gallery" loading="lazy" />
<img src="/gallery-2.jpg" alt="Gallery" loading="lazy" />
```

**3. Defer Third-Party Scripts (Protect LCP)**
```tsx
// app/layout.tsx
<Script
  id="gtm"
  strategy="lazyOnload" // Load AFTER page interactive
  src="https://www.googletagmanager.com/gtm.js?id=GTM-XXXXXX"
/>

<Script
  id="callrail"
  strategy="lazyOnload" // Load AFTER page interactive
  src="//cdn.callrail.com/companies/XXXXXX/XXXXXX.js"
/>
```

**4. Font Display Swap (Prevent FOIT)**
```css
/* Use font-display: swap to prevent invisible text */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-display: swap; /* Show fallback font immediately */
  src: url('/fonts/inter-regular.woff2') format('woff2');
}
```

**5. Preload Critical Resources**
```html
<head>
  <!-- Preload hero image -->
  <link rel="preload" href="/hero.avif" as="image" type="image/avif" />

  <!-- Preload critical fonts -->
  <link rel="preload" href="/fonts/inter-regular.woff2" as="font" type="font/woff2" crossorigin />

  <!-- Preconnect to third-party domains -->
  <link rel="preconnect" href="https://www.googletagmanager.com" />
  <link rel="preconnect" href="https://cdn.callrail.com" />
</head>
```

---

### Phase 7: Mobile Testing Protocol

#### Pre-Deployment Checklist

**1. Lighthouse Mobile Audit**
```bash
# Run Lighthouse mobile audit
npm run lighthouse -- --preset=mobile --view

# Check scores
# Performance: ≥90
# Accessibility: ≥95
# Best Practices: ≥90
# SEO: ≥95
```

**2. Real Device Testing (Minimum)**
- [ ] iPhone SE (small screen, slower hardware)
- [ ] iPhone 14 Pro (modern iOS)
- [ ] Samsung Galaxy A53 (mid-range Android)
- [ ] Google Pixel 7 (stock Android)

**3. Network Throttling Tests**
- [ ] Slow 3G (400kbps) - Extreme case
- [ ] Fast 3G (1.6Mbps) - Common mobile
- [ ] Slow 4G (4Mbps) - **PRIMARY TEST**
- [ ] Fast 4G (10Mbps) - Best-case mobile

**4. Touch Target Verification**
- [ ] All buttons ≥44×44px
- [ ] All links ≥44×44px
- [ ] All form inputs ≥44px height
- [ ] No accidental taps (8px spacing between targets)

**5. Form Input Testing**
- [ ] Phone field shows numeric keypad (`type="tel"`)
- [ ] Email field shows email keyboard (`type="email"`)
- [ ] Autofill works (autocomplete attributes present)
- [ ] No iOS zoom (font-size ≥16px)

**6. Responsive Layout Testing**
- [ ] 320px (iPhone SE) - No horizontal scroll
- [ ] 375px (iPhone 14) - Layout correct
- [ ] 414px (iPhone 14 Pro Max) - Layout correct
- [ ] 768px (iPad) - Layout transitions correctly
- [ ] 1024px (Desktop) - Layout transitions correctly

**7. Performance Testing (Slow 4G)**
- [ ] LCP <2.5s
- [ ] FID <100ms
- [ ] CLS <0.1
- [ ] FCP <1.8s
- [ ] TTI <3.8s

---

#### Continuous Monitoring

**Lighthouse CI (GitHub Actions)**
```yaml
# .github/workflows/lighthouse-ci.yml
name: Lighthouse CI
on: [pull_request]
jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run build
      - run: npm run lhci -- --preset=mobile
```

**Real User Monitoring (RUM)**
```typescript
// app/layout.tsx
'use client'

import { useEffect } from 'react'
import { getCLS, getFID, getLCP } from 'web-vitals'

function sendToAnalytics(metric) {
  // Send to Google Analytics 4
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', metric.name, {
      value: Math.round(metric.value),
      event_category: 'Web Vitals',
      event_label: metric.id,
      non_interaction: true,
    })
  }
}

export default function RootLayout({ children }) {
  useEffect(() => {
    getCLS(sendToAnalytics)
    getFID(sendToAnalytics)
    getLCP(sendToAnalytics)
  }, [])

  return <html>{children}</html>
}
```

---

## Implementation Priority

### Phase 1: Foundation (Week 1)
- [x] Define responsive breakpoints (320px, 375px, 414px, 768px, 1024px)
- [ ] Set up mobile-first CSS architecture
- [ ] Implement touch target sizing (≥44px)
- [ ] Add input type optimization (type="tel", autocomplete)

### Phase 2: Performance (Week 1-2)
- [ ] Configure Lighthouse CI with mobile preset
- [ ] Set up page weight budgets (1.1MB uncompressed)
- [ ] Implement critical CSS extraction
- [ ] Add image lazy loading

### Phase 3: Testing (Week 2)
- [ ] Set up Chrome DevTools network throttling presets
- [ ] Configure BrowserStack for real device testing
- [ ] Create mobile testing checklist
- [ ] Run baseline Lighthouse mobile audit

### Phase 4: Monitoring (Week 2+)
- [ ] Integrate Web Vitals tracking to GA4
- [ ] Set up Lighthouse CI in GitHub Actions
- [ ] Create performance dashboard
- [ ] Schedule weekly mobile performance reviews

---

## Success Metrics

**Mobile Performance Targets (Lighthouse Mobile):**
- ✅ Performance Score: ≥90
- ✅ Accessibility Score: ≥95
- ✅ Best Practices Score: ≥90
- ✅ SEO Score: ≥95

**Core Web Vitals (Mobile, 75th Percentile):**
- ✅ LCP <2.5s on Slow 4G
- ✅ FID <100ms
- ✅ CLS <0.1

**Conversion Metrics:**
- ✅ Mobile conversion rate ≥desktop rate
- ✅ Mobile form completion rate ≥60%
- ✅ Mobile bounce rate <40%

---

## Consequences

### Positive

✅ **60%+ of traffic optimized** - Mobile-first approach serves majority users
✅ **Better conversion rates** - Touch-optimized UI reduces friction
✅ **Lower Google Ads costs** - High Quality Score from fast mobile performance
✅ **SEO benefits** - Mobile-first indexing prioritizes mobile performance
✅ **Accessibility compliance** - WCAG 2.1 AA touch target requirements met
✅ **Future-proof** - Mobile-first scales to new devices (foldables, tablets)

### Negative

⚠️ **Additional testing effort** - Must test on multiple devices and network conditions
⚠️ **Design constraints** - Touch targets and mobile-first may limit desktop design
⚠️ **Performance budget pressure** - 1.1MB budget requires strict optimization

---

## Related Decisions

- **ADR-032:** Core Web Vitals Monitoring (LCP <2.5s target)
- **ADR-029:** Critical CSS Extraction (mobile FCP <1.8s)
- **ADR-030:** Third-Party Script Optimization (defer GTM, CallRail)
- **ADR-033:** Sticky Trust Bar (mobile-responsive design)
- **ADR-034:** Before/After Gallery (mobile lazy loading)
- **ADR-035:** FAQ Accordion (mobile touch-friendly)

---

## References

### Documentation
- WCAG 2.1 Touch Target Size: https://www.w3.org/WAI/WCAG21/Understanding/target-size.html
- iOS Human Interface Guidelines: https://developer.apple.com/design/human-interface-guidelines/ios/visual-design/adaptivity-and-layout/
- Android Material Design: https://material.io/design/layout/responsive-layout-grid.html
- Google Mobile-First Indexing: https://developers.google.com/search/mobile-sites/mobile-first-indexing

### Tools
- Chrome DevTools Device Mode: https://developer.chrome.com/docs/devtools/device-mode/
- Lighthouse CI: https://github.com/GoogleChrome/lighthouse-ci
- WebPageTest Mobile: https://www.webpagetest.org/
- BrowserStack: https://www.browserstack.com/

### Performance
- Web Vitals: https://web.dev/vitals/
- Performance Budget Calculator: https://www.performancebudget.io/
- Mobile Performance Best Practices: https://web.dev/mobile/

---

**END OF ADR-031**
