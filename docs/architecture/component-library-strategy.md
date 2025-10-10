# Component Library Strategy

**Source:** Hybrid approach combining:
- **Headless UI** (`@headlessui/react`) - Unstyled, accessible React components (Dialog, Disclosure, Transition)
- **Tailwind CSS v4** - Utility-first styling system
- **Custom Components** - Built for conversion optimization (not generic UI kit)

**Installation:**
```bash
npm install @headlessui/react
```

**Key Features:**
- ✅ **Server Components by default** - All components are React Server Components unless marked with `'use client'`
- ✅ **Accessibility built-in** - WCAG 2.1 AA compliant (ARIA labels, keyboard navigation, focus management)
- ✅ **Performance-optimized** - Minimal JavaScript, CSS purging, lazy loading for below-fold content
- ✅ **Mobile-first** - All components responsive and touch-optimized for 60%+ mobile traffic
