# ADR-033: Sticky Trust Bar Implementation

**Status:** Approved
**Date:** 2025-10-10
**Decision Makers:** Architecture Team, UX Team
**Stakeholders:** Development Team, Marketing Team

---

## Design Context

**Before implementing, load design principles for paid traffic landing pages:**

- **Design Principles Document**: [docs/design-principles.md](../design-principles.md)
  - Core principles: Quality Score First, CRO, Message Match, Phone-Primary, Trust Through Specificity
  - Success metrics and usability goals
  - 10-section page structure overview

- **Related Front-End Spec Section**: [front-end-spec.md - Section 2: Trust Bar](../front-end-spec.md#section-2-trust-bar-sticky-on-scroll---optional)
  - Content requirements and layout examples
  - Mobile vs desktop behavior specifications
  - Integration with overall page structure

**Why Trust Bar Matters for Paid Traffic:**
- **Quality Score**: Trust signals (licensing, reviews, years) affect Google Ads Quality Score
- **Conversion Rate**: Persistent credibility visibility increases lead conversion
- **Message Match**: Reinforces ad promises (licensed, insured, experienced)
- **Mobile-First**: 60%+ traffic is mobile - trust bar must not block content

---

## Context and Problem Statement

The Trust Bar is a critical conversion element displaying social proof (reviews, certifications, guarantees) that should remain visible as users scroll. We need to decide:

1. **Positioning approach:** CSS `position: sticky` vs `position: fixed`
2. **Layout strategy:** How to prevent Cumulative Layout Shift (CLS)
3. **Responsive behavior:** Desktop vs mobile visibility and placement
4. **Performance:** Minimize impact on LCP (<2.5s target)

**Key Requirements:**
- Always visible during scroll (sticky behavior)
- No CLS impact (must not cause layout shifts)
- Mobile-optimized (60%+ of traffic is mobile)
- Accessible (keyboard navigation, screen readers)
- Performant (minimal JavaScript, CSS-only if possible)

---

## Decision Drivers

1. **CLS Prevention:** Trust Bar must NOT cause layout shift (CLS <0.1 target)
2. **Mobile performance:** 60%+ traffic is mobile, must optimize for mobile-first
3. **Conversion impact:** Trust Bar should remain visible without being intrusive
4. **Browser support:** Safari 16.4+, Chrome 111+, Firefox 128+ (Tailwind v4 support)
5. **Accessibility:** WCAG 2.1 AA compliance (keyboard nav, ARIA labels)
6. **Developer experience:** Simple implementation, minimal JavaScript

---

## Considered Options

### Option 1: CSS `position: sticky` (Top)
**Implementation:** Trust Bar at top of page, sticks to top edge on scroll

**Pros:**
- ✅ Native CSS, no JavaScript required
- ✅ Excellent browser support
- ✅ No CLS if properly implemented (reserve space on load)
- ✅ Performant (GPU-accelerated)

**Cons:**
- ⚠️ Can block content on mobile (reduces visible area)
- ⚠️ Requires space reservation to prevent CLS
- ⚠️ May conflict with mobile browser chrome (address bar)

**CLS Mitigation:**
```css
/* Reserve exact height on load */
.trust-bar-container {
  min-height: 60px; /* Desktop */
}

@media (max-width: 768px) {
  .trust-bar-container {
    min-height: 80px; /* Mobile (taller for wrap) */
  }
}
```

---

### Option 2: CSS `position: sticky` (Bottom)
**Implementation:** Trust Bar at bottom of page, sticks to bottom edge on scroll

**Pros:**
- ✅ Native CSS, no JavaScript required
- ✅ Doesn't block primary content on mobile
- ✅ Good for call-to-action visibility
- ✅ No CLS (always at bottom, no layout shift)

**Cons:**
- ⚠️ Less conventional placement (users expect top)
- ⚠️ May conflict with mobile browser UI
- ⚠️ Harder to notice initially (below fold)

---

### Option 3: CSS `position: fixed` with Scroll Detection
**Implementation:** Fixed position, show/hide based on scroll direction (JavaScript)

**Pros:**
- ✅ Can auto-hide on scroll down, show on scroll up
- ✅ Reduces screen real estate usage
- ✅ Modern UX pattern (like mobile navigation)

**Cons:**
- ❌ Requires JavaScript (performance impact)
- ❌ More complex implementation
- ❌ Potential CLS if not carefully implemented
- ❌ Accessibility concerns (unexpected hiding)

---

### Option 4: Non-Sticky (Static Placement)
**Implementation:** Trust Bar appears only at top, doesn't follow scroll

**Pros:**
- ✅ Zero CLS risk
- ✅ Simplest implementation
- ✅ No performance impact

**Cons:**
- ❌ Not visible after user scrolls (defeats purpose)
- ❌ Reduces conversion impact
- ❌ Doesn't meet requirement for "always visible"

---

## Decision Outcome

**Selected: Option 1 - CSS `position: sticky` (Top) with Responsive Adjustments**

**Rationale:**
1. ✅ **Zero JavaScript:** Pure CSS solution, best performance
2. ✅ **Excellent browser support:** Supported by all target browsers
3. ✅ **CLS prevention:** Reserve exact height on page load
4. ✅ **Mobile-optimized:** Collapses to single line on mobile, expands on desktop
5. ✅ **Accessibility:** Standard implementation, screen reader friendly

**Desktop Implementation:**
- Full-width bar at top
- Single row with 4-5 trust indicators (reviews, certifications, guarantees)
- Height: 60px (fixed)

**Mobile Implementation:**
- Full-width bar at top
- Wraps to 2 rows OR shows top 3 indicators only
- Height: 80px (allows wrapping) OR 60px (single line, hide extras)

---

## Implementation Details

### HTML Structure

```tsx
// src/components/TrustBar/index.tsx
'use client' // Only if using dynamic content

export function TrustBar() {
  return (
    <div className="trust-bar-container">
      <div className="trust-bar">
        {/* Trust Indicator 1: Star Rating */}
        <div className="trust-indicator" aria-label="Customer rating">
          <svg className="star-icon" aria-hidden="true">
            {/* Star SVG */}
          </svg>
          <span className="trust-text">4.9/5 Stars</span>
          <span className="trust-subtext">(2,847 reviews)</span>
        </div>

        {/* Trust Indicator 2: BBB Accredited */}
        <div className="trust-indicator" aria-label="Better Business Bureau accredited">
          <svg className="bbb-icon" aria-hidden="true">
            {/* BBB logo SVG */}
          </svg>
          <span className="trust-text">BBB A+ Rated</span>
        </div>

        {/* Trust Indicator 3: Years in Business */}
        <div className="trust-indicator" aria-label="Years in business">
          <svg className="calendar-icon" aria-hidden="true">
            {/* Calendar SVG */}
          </svg>
          <span className="trust-text">25+ Years</span>
          <span className="trust-subtext">in business</span>
        </div>

        {/* Trust Indicator 4: Warranty */}
        <div className="trust-indicator" aria-label="Lifetime warranty">
          <svg className="shield-icon" aria-hidden="true">
            {/* Shield SVG */}
          </svg>
          <span className="trust-text">Lifetime Warranty</span>
        </div>

        {/* Trust Indicator 5: Free Quotes */}
        <div className="trust-indicator hidden md:flex" aria-label="Free quotes">
          <svg className="tag-icon" aria-hidden="true">
            {/* Tag SVG */}
          </svg>
          <span className="trust-text">Free Quotes</span>
        </div>
      </div>
    </div>
  )
}
```

---

### CSS Implementation (Tailwind v4)

```css
/* globals.css */

/* Container reserves space to prevent CLS */
.trust-bar-container {
  min-height: 60px; /* Desktop height */
  width: 100%;
}

@media (max-width: 768px) {
  .trust-bar-container {
    min-height: 80px; /* Mobile height (allows wrapping) */
  }
}

/* Sticky bar */
.trust-bar {
  position: sticky;
  top: 0;
  z-index: 40; /* Below modals (50), above content (10) */

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;

  width: 100%;
  padding: 0.75rem 1rem;

  background-color: var(--color-primary);
  color: white;

  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Trust indicators */
.trust-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.trust-text {
  font-weight: 600;
  font-size: 0.875rem;
}

.trust-subtext {
  font-size: 0.75rem;
  opacity: 0.9;
}

/* Icons */
.star-icon,
.bbb-icon,
.calendar-icon,
.shield-icon,
.tag-icon {
  width: 1.5rem;
  height: 1.5rem;
  flex-shrink: 0;
}

/* Mobile adjustments */
@media (max-width: 768px) {
  .trust-bar {
    gap: 1rem;
    justify-content: space-around;
    padding: 0.5rem 0.75rem;
  }

  .trust-indicator {
    gap: 0.25rem;
  }

  .trust-text {
    font-size: 0.75rem;
  }

  .trust-subtext {
    display: none; /* Hide subtext on mobile to save space */
  }
}
```

---

### Alternative: Tailwind Utility Classes

```tsx
// Using Tailwind utilities instead of custom CSS
export function TrustBar() {
  return (
    <div className="min-h-[60px] md:min-h-[60px] w-full">
      <div className="sticky top-0 z-40 flex items-center justify-center gap-4 md:gap-8 flex-wrap w-full px-4 py-3 bg-primary text-white shadow-md">

        <div className="flex items-center gap-2" aria-label="Customer rating">
          <StarIcon className="w-6 h-6 flex-shrink-0" aria-hidden="true" />
          <span className="font-semibold text-sm md:text-base">4.9/5 Stars</span>
          <span className="text-xs opacity-90 hidden md:inline">(2,847 reviews)</span>
        </div>

        <div className="flex items-center gap-2" aria-label="BBB accredited">
          <BBBIcon className="w-6 h-6 flex-shrink-0" aria-hidden="true" />
          <span className="font-semibold text-sm md:text-base">BBB A+</span>
        </div>

        <div className="flex items-center gap-2" aria-label="Years in business">
          <CalendarIcon className="w-6 h-6 flex-shrink-0" aria-hidden="true" />
          <span className="font-semibold text-sm md:text-base">25+ Years</span>
          <span className="text-xs opacity-90 hidden md:inline">in business</span>
        </div>

        <div className="flex items-center gap-2" aria-label="Lifetime warranty">
          <ShieldIcon className="w-6 h-6 flex-shrink-0" aria-hidden="true" />
          <span className="font-semibold text-sm md:text-base">Lifetime Warranty</span>
        </div>

        <div className="hidden md:flex items-center gap-2" aria-label="Free quotes">
          <TagIcon className="w-6 h-6 flex-shrink-0" aria-hidden="true" />
          <span className="font-semibold text-sm md:text-base">Free Quotes</span>
        </div>
      </div>
    </div>
  )
}
```

---

## CLS Prevention Strategy

### Critical: Reserve Exact Height on Load

**Problem:** Trust Bar appears during page load, causing content to shift down (CLS violation)

**Solution:** Reserve exact height with container `min-height`

**Desktop:**
```css
.trust-bar-container {
  min-height: 60px; /* Match exact Trust Bar height */
}
```

**Mobile:**
```css
@media (max-width: 768px) {
  .trust-bar-container {
    min-height: 80px; /* Taller for wrapping or multi-line */
  }
}
```

**Result:** Content below Trust Bar starts at correct position, no shift when bar loads

---

### Measure Actual Height

**Testing Protocol:**
1. Build static export: `npm run build`
2. Serve locally: `npx serve out`
3. Open DevTools → Elements
4. Measure `.trust-bar` actual height on desktop (e.g., 60px)
5. Measure `.trust-bar` actual height on mobile (e.g., 80px)
6. Update `.trust-bar-container` min-height to match exactly

**Verification:**
```javascript
// Run in browser console
const bar = document.querySelector('.trust-bar')
console.log('Actual height:', bar.offsetHeight + 'px')
```

---

## Accessibility Implementation

### ARIA Labels

Each trust indicator has descriptive `aria-label`:

```tsx
<div className="trust-indicator" aria-label="Customer rating: 4.9 out of 5 stars based on 2,847 reviews">
  {/* Content */}
</div>
```

### Icon Hiding

Icons are decorative, hide from screen readers:

```tsx
<svg aria-hidden="true">
  {/* Icon SVG */}
</svg>
```

### Semantic HTML

Use semantic elements where appropriate:

```tsx
<nav aria-label="Trust indicators" className="trust-bar">
  {/* Trust indicators */}
</nav>
```

### Keyboard Navigation

Trust Bar is informational (no interactive elements), so no keyboard navigation needed. If adding links:

```tsx
<a
  href="/reviews"
  className="trust-indicator"
  aria-label="Read 2,847 customer reviews"
>
  {/* Content */}
</a>
```

Ensure:
- ✅ Visible focus indicator (`focus:ring-2`)
- ✅ Keyboard accessible (Tab key)
- ✅ Descriptive link text

---

## Performance Considerations

### LCP Impact

**Risk:** Trust Bar loads above fold, could delay LCP if slow

**Mitigation:**
1. **Inline SVG icons** (no external requests)
2. **No images** (use SVG or icon fonts)
3. **Minimal CSS** (~1KB)
4. **No JavaScript** (Server Component)

**Expected Impact:** <50ms (negligible)

---

### CSS Layer Order

Use Tailwind v4 cascade layers to ensure proper stacking:

```css
/* Ensure Trust Bar styles load in correct order */
@layer components {
  .trust-bar {
    /* Trust Bar styles */
  }
}
```

---

## Mobile-Specific Optimizations

### Option A: Single Line (Hide Extras)

Show only top 3-4 indicators on mobile:

```tsx
<div className="hidden md:flex">
  {/* 5th indicator only on desktop */}
</div>
```

**Pros:**
- ✅ Minimal height (60px)
- ✅ Less visual clutter

**Cons:**
- ⚠️ Hides some trust indicators

---

### Option B: Multi-Line (Wrap)

Allow indicators to wrap to 2 rows:

```tsx
<div className="flex flex-wrap">
  {/* All indicators visible, wraps on mobile */}
</div>
```

**Pros:**
- ✅ All indicators visible
- ✅ No hidden content

**Cons:**
- ⚠️ Taller height (80-100px)
- ⚠️ Takes more screen real estate

---

### Recommended: Option A (Hide Extras)

For mobile performance and minimal screen space usage.

---

## Testing Checklist

### Functional Testing

- [ ] Trust Bar sticks to top on scroll
- [ ] No content shift on page load (CLS check)
- [ ] All indicators visible on desktop
- [ ] Top 3-4 indicators visible on mobile
- [ ] Icons render correctly (SVG)
- [ ] Text is readable (contrast ratio ≥4.5:1)

### Responsive Testing

**Desktop (≥1024px):**
- [ ] All 5 indicators visible
- [ ] Single row layout
- [ ] Height exactly 60px

**Tablet (768px-1023px):**
- [ ] 4-5 indicators visible
- [ ] Single row or minimal wrap
- [ ] Height 60-80px

**Mobile (<768px):**
- [ ] 3-4 indicators visible
- [ ] Compact layout
- [ ] Height ≤80px

### Performance Testing

- [ ] Lighthouse CLS score: <0.1
- [ ] Lighthouse LCP: <2.5s (Trust Bar not blocking)
- [ ] No layout shift in WebPageTest
- [ ] First render: Trust Bar appears immediately

### Accessibility Testing

- [ ] Axe DevTools: 0 violations
- [ ] Screen reader announces all indicators
- [ ] Icons hidden from screen readers (`aria-hidden="true"`)
- [ ] Descriptive `aria-label` on each indicator
- [ ] Color contrast: ≥4.5:1 (white text on primary color)

---

## Consequences

### Positive

✅ **Zero JavaScript:** Pure CSS implementation, best performance
✅ **No CLS:** Proper space reservation prevents layout shift
✅ **Mobile-optimized:** Responsive design adapts to screen size
✅ **Accessible:** WCAG 2.1 AA compliant
✅ **Performant:** Minimal impact on LCP (<50ms)
✅ **Maintainable:** Simple CSS, easy to update trust indicators

### Negative

⚠️ **Screen space:** Takes 60-80px of vertical space (acceptable tradeoff)
⚠️ **Mobile visibility:** Some indicators hidden on mobile (by design)
⚠️ **Fixed height:** Must remeasure if content changes

---

## Alternatives Considered

### Alternative 1: Dismissible Trust Bar

Allow users to close/hide Trust Bar:

**Pros:**
- ✅ User control
- ✅ Regains screen space if dismissed

**Cons:**
- ❌ Requires JavaScript (state management)
- ❌ localStorage needed (remember dismissed state)
- ❌ Reduces conversion impact (hidden = not working)

**Decision:** Rejected - Conversion impact outweighs UX benefit

---

### Alternative 2: Scroll-Triggered Trust Bar

Show Trust Bar only after user scrolls past hero:

**Pros:**
- ✅ Doesn't block hero content
- ✅ Appears when user engaged

**Cons:**
- ❌ Requires JavaScript (scroll detection)
- ❌ More complex implementation
- ❌ Potential CLS when appearing

**Decision:** Rejected - Complexity not worth benefit

---

## Related Decisions

- **ADR-029:** Critical CSS Extraction (Trust Bar CSS should be inlined)
- **ADR-031:** Mobile Performance Optimization (60%+ traffic mobile-first)
- **ADR-032:** Core Web Vitals (CLS <0.1 target)

---

## References

### Documentation
- CSS Sticky Positioning: https://developer.mozilla.org/en-US/docs/Web/CSS/position
- Cumulative Layout Shift: https://web.dev/cls/
- WCAG 2.1 Color Contrast: https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html

### Tools
- Lighthouse CI: Performance and accessibility testing
- Axe DevTools: Accessibility validation
- WebPageTest: CLS measurement

---

**END OF ADR-033**
