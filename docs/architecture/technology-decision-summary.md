# Technology Decision Summary

| Category | Technology | Old Version | **New Version** | Update Type | Rationale |
|----------|-----------|-------------|----------------|-------------|-----------|
| **Framework** | Next.js 15 | 15.0.0 | **^15.5.0** | ⚠️ Minor | Bug fixes, React 19.2 compatibility |
| **UI Library** | React | 19.0.0 | **^19.2.0** | ⚠️ Minor | Stability improvements, bug fixes |
| **Language** | TypeScript | ^5.3.0 | **^5.9.0** | ⚠️ Minor | Performance, better type inference |
| **Styling** | Tailwind CSS | ^3.4.0 | **^4.0.0** | 🚨 Major | 5x faster builds, modern CSS only |
| **Images** | Sharp | ^0.33.0 | **^0.34.4** | ⚠️ Minor | 15-20% faster AVIF encoding |
| **Critical CSS** | Critters | ^0.0.20 | **Beasties ^0.1.0** | 🚨 Replace | Critters archived, Beasties maintained |
| **Content Source** | Airtable SDK | ^0.12.0 | **^0.12.2** | ⚠️ Patch | Latest available (stale package) |
| **AI Content** | Claude API | ^0.20.0 | **^0.65.0** | 🚨 Major | Claude 4 support (CRITICAL) |
| **Forms** | Make.com | N/A | N/A | ✅ Keep | Runtime form submission → Salesforce |
| **Analytics** | GTM + GA4 | N/A | N/A | ✅ Keep | Conversion tracking, deferred loading |
| **Phone Tracking** | CallRail | N/A | N/A | ✅ Keep | Dynamic number insertion |
| **Testing** | Playwright | ^1.41.0 | **^1.55.0** | ⚠️ Minor | AI agents, test healing |
| **Linting** | ESLint | ^8.57.0 | **^10.0.0** | 🚨 Major | Flat config (breaking change) |
| **Formatting** | Prettier | ^3.2.0 | **^5.0.0** | 🚨 Major | 2.5x faster, better TS support |

**Legend:**
- ✅ Keep = No update needed
- ⚠️ Minor/Patch = Safe update, backward compatible
- 🚨 Major = Breaking changes, requires migration
- ➕ Add = New tool/service

---
