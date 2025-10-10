# ADR-035: FAQ Accordion Component Implementation

**Status:** Approved
**Date:** 2025-10-10
**Decision Makers:** Architecture Team, UX Team
**Stakeholders:** Development Team, Marketing Team, SEO Team

---

## Context and Problem Statement

FAQ sections are critical for:
- **SEO:** Target long-tail keywords and featured snippets
- **Conversion:** Answer objections and build trust
- **User Experience:** Provide quick access to common questions

We need to decide on an implementation approach that balances:
1. **SEO optimization:** Content must be crawlable and indexable
2. **Performance:** Minimal JavaScript, fast LCP (<2.5s target)
3. **Accessibility:** WCAG 2.1 AA compliance (keyboard nav, screen readers)
4. **User Experience:** Smooth expand/collapse, mobile-friendly
5. **Maintainability:** Simple to add/edit FAQ content

**Key Requirements:**
- Expand/collapse functionality for each FAQ item
- SEO-friendly (Google can crawl collapsed content)
- Accessible (keyboard navigation, ARIA attributes)
- Mobile-optimized (60%+ of traffic)
- Performant (minimal JavaScript)
- Support 8-12 FAQ items per page

---

## Decision Drivers

1. **SEO Impact:** FAQ content must be in DOM (not lazy-loaded) for Google indexing
2. **Featured Snippets:** Proper schema markup increases chance of featured snippet
3. **Performance:** Zero or minimal JavaScript (LCP <2.5s target)
4. **Accessibility:** WCAG 2.1 AA compliance required
5. **Browser Support:** Safari 16.4+, Chrome 111+, Firefox 128+
6. **Developer Experience:** Simple implementation, easy content updates
7. **Mobile-First:** Touch-friendly, works on small screens

---

## Considered Options

### Option 1: Native `<details>/<summary>` Element (Recommended)

**Implementation:** HTML5 native disclosure widget

**Pros:**
- ✅ **Zero JavaScript** - Pure HTML/CSS solution
- ✅ **Perfect SEO** - All content in DOM, fully crawlable
- ✅ **Excellent accessibility** - Built-in ARIA, keyboard support
- ✅ **Universal browser support** - 97%+ global support
- ✅ **Performant** - No runtime cost, instant interaction
- ✅ **Mobile-optimized** - Native touch support
- ✅ **Simple maintenance** - Just HTML, no complex state

**Cons:**
- ⚠️ Limited animation control (CSS-only animations)
- ⚠️ Styling requires some CSS workarounds
- ⚠️ Can't prevent closing when clicking open item (minor UX issue)

**Browser Support:**
- Safari: 6+ (iOS 6+)
- Chrome: 12+
- Firefox: 49+
- Edge: 79+

**Result:** ✅ **Perfect for our target browsers**

---

### Option 2: Headless UI Disclosure Component

**Implementation:** React component with full accessibility

**Pros:**
- ✅ Full animation control
- ✅ Guaranteed accessibility (Headless UI)
- ✅ Customizable behavior
- ✅ React ecosystem integration

**Cons:**
- ❌ Requires ~5KB JavaScript
- ❌ More complex implementation
- ❌ Additional dependency
- ❌ Runtime performance cost
- ⚠️ SEO: Content in DOM but client-side rendered

**Bundle Size:** ~5KB (minified + gzipped)

---

### Option 3: Custom JavaScript Accordion

**Implementation:** Custom React component with state management

**Pros:**
- ✅ Full control over behavior
- ✅ Custom animations
- ✅ Can implement "accordion mode" (one open at a time)

**Cons:**
- ❌ Requires custom JavaScript (~3-8KB)
- ❌ Must implement accessibility manually (high risk of errors)
- ❌ More complex to maintain
- ❌ Performance cost
- ❌ Reinventing the wheel

---

### Option 4: No Accordion (Fully Expanded)

**Implementation:** All FAQs visible, no collapse functionality

**Pros:**
- ✅ Perfect SEO (all content visible)
- ✅ Zero JavaScript
- ✅ Simplest implementation

**Cons:**
- ❌ Poor UX (too much content at once)
- ❌ Long page scroll (especially mobile)
- ❌ Doesn't meet "accordion" requirement
- ❌ Reduced conversion impact (overwhelming)

---

## Decision Outcome

**Selected: Option 1 - Native `<details>/<summary>` Element**

**Rationale:**
1. ✅ **Zero JavaScript:** Best performance, instant LCP
2. ✅ **Perfect SEO:** All content in DOM, Google indexes collapsed content
3. ✅ **Built-in Accessibility:** Native ARIA, keyboard navigation, screen reader support
4. ✅ **Universal Support:** 97%+ browser support, works on all target browsers
5. ✅ **Mobile-Optimized:** Native touch support, no JavaScript needed
6. ✅ **Simple Maintenance:** Pure HTML, easy for content team to update

**Trade-off Accepted:**
- ⚠️ Limited animation control (CSS-only) - **Acceptable** for performance gain
- ⚠️ Styling requires CSS workarounds - **Manageable** with modern CSS

---

## Implementation Details

### HTML Structure

```tsx
// src/components/FAQ/index.tsx
export function FAQ({ items }: FAQProps) {
  return (
    <section className="faq-section py-12 px-4 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-8">
        Frequently Asked Questions
      </h2>

      <div className="faq-list space-y-4">
        {items.map((item) => (
          <details
            key={item.id}
            className="faq-item group"
            itemScope
            itemProp="mainEntity"
            itemType="https://schema.org/Question"
          >
            <summary
              className="faq-question"
              itemProp="name"
            >
              <span className="question-text">{item.question}</span>
              <svg
                className="chevron"
                aria-hidden="true"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </summary>

            <div
              className="faq-answer"
              itemScope
              itemProp="acceptedAnswer"
              itemType="https://schema.org/Answer"
            >
              <div itemProp="text">
                {item.answer}
              </div>
            </div>
          </details>
        ))}
      </div>
    </section>
  )
}
```

**Type Definition:**
```typescript
// src/components/FAQ/types.ts
export interface FAQItem {
  id: string
  question: string
  answer: string | React.ReactNode
}

export interface FAQProps {
  items: FAQItem[]
}
```

---

### CSS Implementation (Tailwind v4)

```css
/* globals.css */

/* FAQ Section */
.faq-section {
  max-width: 56rem; /* 896px */
  margin: 0 auto;
}

/* FAQ Item */
.faq-item {
  border: 1px solid var(--color-border, #e5e7eb);
  border-radius: 0.5rem;
  background-color: white;
  transition: box-shadow 0.2s ease;
}

.faq-item:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.faq-item[open] {
  border-color: var(--color-primary, #0066cc);
}

/* FAQ Question (Summary) */
.faq-question {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;

  padding: 1rem 1.25rem;

  font-weight: 600;
  font-size: 1.125rem;
  line-height: 1.5;

  cursor: pointer;
  user-select: none;

  list-style: none; /* Remove default marker */
}

/* Remove default marker (cross-browser) */
.faq-question::-webkit-details-marker {
  display: none;
}

.faq-question::marker {
  display: none;
}

/* Focus state (accessibility) */
.faq-question:focus {
  outline: 2px solid var(--color-primary, #0066cc);
  outline-offset: 2px;
}

/* Hover state */
.faq-question:hover {
  color: var(--color-primary, #0066cc);
}

/* Chevron Icon */
.chevron {
  flex-shrink: 0;
  width: 1.5rem;
  height: 1.5rem;
  transition: transform 0.2s ease;
  color: var(--color-primary, #0066cc);
}

/* Rotate chevron when open */
.faq-item[open] .chevron {
  transform: rotate(180deg);
}

/* FAQ Answer */
.faq-answer {
  padding: 0 1.25rem 1.25rem 1.25rem;

  font-size: 1rem;
  line-height: 1.75;
  color: var(--color-text-secondary, #4b5563);

  /* Animation on open */
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-0.5rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Mobile Adjustments */
@media (max-width: 768px) {
  .faq-question {
    font-size: 1rem;
    padding: 0.875rem 1rem;
  }

  .faq-answer {
    font-size: 0.9375rem;
    padding: 0 1rem 1rem 1rem;
  }

  .chevron {
    width: 1.25rem;
    height: 1.25rem;
  }
}
```

---

### Alternative: Tailwind Utility Classes

```tsx
// Using Tailwind utilities instead of custom CSS
export function FAQ({ items }: FAQProps) {
  return (
    <section className="py-12 px-4 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-8">
        Frequently Asked Questions
      </h2>

      <div className="space-y-4">
        {items.map((item) => (
          <details
            key={item.id}
            className="border border-gray-300 rounded-lg bg-white hover:shadow-md transition-shadow open:border-primary group"
            itemScope
            itemProp="mainEntity"
            itemType="https://schema.org/Question"
          >
            <summary
              className="flex items-center justify-between gap-4 px-5 py-4 font-semibold text-lg cursor-pointer select-none list-none focus:outline-primary focus:outline-2 focus:outline-offset-2 hover:text-primary"
              itemProp="name"
            >
              <span>{item.question}</span>
              <svg
                className="flex-shrink-0 w-6 h-6 text-primary transition-transform group-open:rotate-180"
                aria-hidden="true"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </summary>

            <div
              className="px-5 pb-5 text-base leading-7 text-gray-600 animate-fadeIn"
              itemScope
              itemProp="acceptedAnswer"
              itemType="https://schema.org/Answer"
            >
              <div itemProp="text">
                {item.answer}
              </div>
            </div>
          </details>
        ))}
      </div>
    </section>
  )
}
```

**Add fadeIn animation to Tailwind config:**
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(-0.5rem)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.2s ease',
      },
    },
  },
}
```

---

## SEO Optimization

### Structured Data (Schema.org)

The implementation includes `FAQPage` structured data markup using microdata:

```html
<!-- Automatically generated by itemScope/itemProp attributes -->
<section itemScope itemType="https://schema.org/FAQPage">
  <div itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
    <summary itemProp="name">What is the cost of bathroom remodeling?</summary>
    <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
      <div itemProp="text">The cost varies...</div>
    </div>
  </div>
</section>
```

**Why This Matters:**
- ✅ Google can display rich results (FAQ rich snippets)
- ✅ Increases click-through rate from search results
- ✅ Featured snippet eligibility
- ✅ Voice search optimization

---

### Alternative: JSON-LD Structured Data

If you prefer centralized structured data:

```tsx
// src/components/FAQ/index.tsx
export function FAQ({ items }: FAQProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: typeof item.answer === 'string' ? item.answer : '', // Extract text
      },
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <section className="faq-section">
        {/* FAQ markup */}
      </section>
    </>
  )
}
```

**Recommendation:** Use **microdata** (inline attributes) for simplicity and guaranteed sync between markup and structured data.

---

## Accessibility Implementation

### Built-in Accessibility Features

Native `<details>/<summary>` provides:

1. **ARIA Attributes (Automatic):**
   - `role="group"` on `<details>`
   - `aria-expanded="true|false"` on `<summary>` (managed by browser)
   - `role="button"` on `<summary>`

2. **Keyboard Navigation (Automatic):**
   - `Enter` or `Space` to toggle
   - `Tab` to navigate between items
   - Focus indicator managed by browser

3. **Screen Reader Support (Automatic):**
   - Announces expanded/collapsed state
   - Reads question and answer content
   - No custom ARIA needed

---

### Manual Accessibility Enhancements

**Focus Indicator:**
```css
.faq-question:focus {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
```

**Hide Decorative Icon:**
```tsx
<svg aria-hidden="true">
  {/* Chevron icon */}
</svg>
```

**Semantic HTML:**
```tsx
<section aria-labelledby="faq-heading">
  <h2 id="faq-heading">Frequently Asked Questions</h2>
  {/* FAQ items */}
</section>
```

---

## Testing Checklist

### Functional Testing

- [ ] Click question to expand answer
- [ ] Click question again to collapse answer
- [ ] Multiple FAQs can be open simultaneously
- [ ] Chevron icon rotates on expand/collapse
- [ ] Smooth animation when expanding/collapsing
- [ ] No layout shift (CLS check)

### Responsive Testing

**Desktop (≥1024px):**
- [ ] FAQ items display at full width (max-width: 56rem)
- [ ] Text is readable (font-size: 1.125rem question, 1rem answer)
- [ ] Hover states work correctly

**Mobile (<768px):**
- [ ] FAQ items fit screen width
- [ ] Touch targets are ≥44×44px
- [ ] Text is readable (smaller font sizes)
- [ ] Chevron visible and functional

### Accessibility Testing

- [ ] Keyboard navigation works (`Tab`, `Enter`, `Space`)
- [ ] Focus indicator visible on `<summary>`
- [ ] Screen reader announces expanded/collapsed state
- [ ] ARIA attributes present (inspect DevTools)
- [ ] Color contrast ≥4.5:1 (text on background)
- [ ] Axe DevTools: 0 violations

**Screen Reader Testing:**
- [ ] VoiceOver (macOS/iOS): Announces "button, collapsed/expanded"
- [ ] NVDA (Windows): Reads question and state correctly
- [ ] JAWS (Windows): Navigates FAQ items correctly

### SEO Testing

- [ ] Structured data validates (Google Rich Results Test)
- [ ] All FAQ content in DOM (view page source)
- [ ] Google Search Console: No structured data errors
- [ ] FAQ rich snippet appears in search results (if eligible)

**Validation Tool:**
https://search.google.com/test/rich-results

### Performance Testing

- [ ] Lighthouse Performance: ≥90
- [ ] LCP <2.5s (FAQ section doesn't block)
- [ ] No JavaScript in network tab (zero-JS implementation)
- [ ] First render: All FAQs visible (collapsed)

---

## Usage Example

### Basic FAQ Component

```tsx
// app/[service]/[location]/page.tsx
import { FAQ } from '@/components/FAQ'

export default function ServicePage() {
  const faqItems = [
    {
      id: 'cost',
      question: 'How much does bathroom remodeling cost?',
      answer: 'The cost of bathroom remodeling varies based on size, materials, and scope. On average, a full bathroom remodel costs $10,000-$25,000.',
    },
    {
      id: 'timeline',
      question: 'How long does a bathroom remodel take?',
      answer: 'Most bathroom remodels take 2-4 weeks, depending on the scope of work. We provide a detailed timeline during your free consultation.',
    },
    {
      id: 'warranty',
      question: 'Do you offer a warranty?',
      answer: 'Yes! We offer a lifetime warranty on all installations and manufacturer warranties on products.',
    },
    {
      id: 'financing',
      question: 'Do you offer financing options?',
      answer: 'Yes, we offer flexible financing options with approved credit. Ask about our current promotions during your consultation.',
    },
  ]

  return (
    <main>
      {/* Other page sections */}

      <FAQ items={faqItems} />

      {/* Call-to-action section */}
    </main>
  )
}
```

---

### FAQ with Rich Content

```tsx
const faqItems = [
  {
    id: 'process',
    question: 'What is your remodeling process?',
    answer: (
      <ol className="list-decimal list-inside space-y-2">
        <li><strong>Free Consultation:</strong> We visit your home and discuss your vision</li>
        <li><strong>Design & Quote:</strong> Receive a detailed design and transparent quote</li>
        <li><strong>Installation:</strong> Expert installation by certified professionals</li>
        <li><strong>Final Walkthrough:</strong> Ensure you're 100% satisfied</li>
      </ol>
    ),
  },
  {
    id: 'services',
    question: 'What services do you offer?',
    answer: (
      <ul className="list-disc list-inside space-y-1">
        <li>Full bathroom remodeling</li>
        <li>Walk-in shower installations</li>
        <li>Tub-to-shower conversions</li>
        <li>Accessibility modifications</li>
        <li>Vanity and countertop installations</li>
      </ul>
    ),
  },
]
```

---

## Performance Considerations

### Zero JavaScript Impact

**Benefits:**
- ✅ No bundle size increase (0KB added)
- ✅ No runtime cost (instant interaction)
- ✅ No layout shift risk
- ✅ Perfect LCP score (no blocking)

**Expected Performance:**
- **LCP:** <2.5s (FAQ doesn't impact)
- **CLS:** 0 (no layout shift)
- **TTI:** Instant (no hydration)
- **TBT:** 0ms (no JavaScript)

---

### Content Size Optimization

**Recommendations:**
- 8-12 FAQ items per page (optimal balance)
- 50-150 words per answer (concise but complete)
- Total FAQ section: <2KB HTML (compressed)

**Why This Matters:**
- Faster page load
- Better mobile experience
- Higher engagement (users read more FAQs)

---

## Mobile-Specific Optimizations

### Touch Target Size

Ensure `<summary>` is ≥44×44px for touch accessibility:

```css
.faq-question {
  min-height: 44px; /* iOS minimum touch target */
  padding: 0.875rem 1rem; /* ~14px top/bottom = 56px total */
}
```

### Font Size Adjustments

```css
@media (max-width: 768px) {
  .faq-question {
    font-size: 1rem; /* 16px - prevents iOS zoom */
  }

  .faq-answer {
    font-size: 0.9375rem; /* 15px */
  }
}
```

**Why:** Font sizes <16px can trigger iOS zoom on focus.

---

### Reduced Animation on Mobile

```css
@media (prefers-reduced-motion: reduce) {
  .faq-answer {
    animation: none;
  }

  .chevron {
    transition: none;
  }
}
```

---

## Browser Support and Fallbacks

### Native Support

- **Safari:** 6+ (iOS 6+) ✅
- **Chrome:** 12+ ✅
- **Firefox:** 49+ ✅
- **Edge:** 79+ ✅

**Coverage:** 97%+ global browser support

---

### Fallback for Ancient Browsers (<1%)

If you need to support IE11 or older browsers, add this polyfill:

```tsx
// app/layout.tsx (conditional load)
<script
  dangerouslySetInnerHTML={{
    __html: `
      if (!('open' in document.createElement('details'))) {
        var script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/details-polyfill@1.2.0/index.min.js';
        document.head.appendChild(script);
      }
    `,
  }}
/>
```

**Recommendation:** Skip the polyfill. 97%+ support is sufficient, and IE11 is no longer supported by Microsoft.

---

## Consequences

### Positive

✅ **Zero JavaScript:** Best-in-class performance, instant LCP
✅ **Perfect SEO:** All content in DOM, structured data support, featured snippet eligible
✅ **Built-in Accessibility:** Native ARIA, keyboard navigation, screen reader support
✅ **Universal Support:** 97%+ browser compatibility
✅ **Mobile-Optimized:** Native touch support, no JavaScript needed
✅ **Simple Maintenance:** Pure HTML, easy for content team
✅ **Conversion Optimized:** Expands to show objection-handling content

### Negative

⚠️ **Limited Animation Control:** CSS-only animations (acceptable trade-off)
⚠️ **Styling Complexity:** Requires CSS workarounds for custom styling (manageable)
⚠️ **No "Accordion Mode":** Can't force "only one open at a time" without JavaScript (minor UX preference)

---

## Alternatives Considered

### Alternative 1: Headless UI Disclosure

**Why Rejected:**
- Adds ~5KB JavaScript for minimal benefit
- Native `<details>` provides same accessibility
- Performance cost not justified

**When to Use:**
- Need custom "accordion mode" (one open at a time)
- Need complex animations (spring physics)
- Already using Headless UI for other components

---

### Alternative 2: Custom JavaScript Accordion

**Why Rejected:**
- High risk of accessibility errors
- Adds 3-8KB JavaScript
- Reinvents browser-native functionality

**When to Use:**
- Never (for this project)

---

### Alternative 3: All Expanded (No Accordion)

**Why Rejected:**
- Poor UX (overwhelming amount of content)
- Long scroll on mobile
- Doesn't meet "accordion" requirement

**When to Use:**
- Very short FAQs (3-4 items with brief answers)
- Print-friendly page version

---

## Related Decisions

- **ADR-033:** Sticky Trust Bar Implementation (conversion optimization)
- **ADR-034:** Before/After Gallery Component (conversion optimization)
- **ADR-031:** Mobile Performance Optimization (60%+ mobile traffic)
- **ADR-020:** Performance Monitoring (LCP <2.5s target)
- **ADR-018:** Accessibility Testing Tools (WCAG 2.1 AA compliance)

---

## References

### Documentation
- MDN `<details>` Element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details
- Google FAQ Rich Results: https://developers.google.com/search/docs/appearance/structured-data/faqpage
- Schema.org FAQPage: https://schema.org/FAQPage
- WCAG 2.1 Disclosure Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/

### Tools
- Google Rich Results Test: https://search.google.com/test/rich-results
- Schema Markup Validator: https://validator.schema.org/
- Axe DevTools: https://www.deque.com/axe/devtools/

### Browser Support
- Can I Use `<details>`: https://caniuse.com/details

---

**END OF ADR-035**
