# Technology Constraints

**Locked Decisions (from PRD v2.1):**
- ✅ Next.js 15 App Router (static export mode)
- ✅ Netlify CDN hosting (static-only for runtime; Netlify Functions for backend workflows)
- ✅ Airtable for data storage and approval workflow
- ✅ Claude API (Anthropic) for AI content generation via Netlify Functions
- ✅ GTM + CallRail + GA4 for conversion tracking
- ✅ Make.com for form submission → Salesforce integration
- ✅ 3-stage progressive forms (Name/Phone → Service/Location → Details/Submit)

**Open Decisions (to be finalized in ADRs):**
- Styling approach (Tailwind CSS, CSS Modules, or styled-components)
- Testing framework (Jest + React Testing Library, Vitest, or Playwright)
- Form library (React Hook Form, Formik, or native)
- Image optimization strategy (next/image replacement for static export)
- Font loading strategy (self-hosted vs Google Fonts CDN)
