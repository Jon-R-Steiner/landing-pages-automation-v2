# Integration Strategies

**Purpose:** Technical specifications and implementation guides for third-party service integrations.

**Last Updated:** 2025-10-14

---

## Overview

This directory contains detailed integration strategies for external services used in the Landing Pages Automation v2 project. Each integration document provides:

- Architecture decisions and rationale
- Complete technical specifications
- Implementation code examples
- Error handling patterns
- Cost analysis
- Testing strategies

---

## Integration Documents

### Salesforce Integration

**File:** [`salesforce-integration-strategy.md`](salesforce-integration-strategy.md)

**Purpose:** Form submission → Make.com → Salesforce lead creation workflow

**Key Features:**
- Static-only architecture (no serverless functions)
- Make.com middleware for OAuth 2 and reCAPTCHA verification
- Complete parameter specification (30+ fields)
- Lead quality scoring
- Multi-client support via Airtable lookup

**Status:** APPROVED - Ready for Phase 0.6 implementation

**Related Documentation:**
- Operational workflow: [`docs/workflows/ongoing/form-submission-workflow.md`](../workflows/ongoing/form-submission-workflow.md)
- Form implementation guide: [`docs/components/forms-implementation-guide.md`](../components/forms-implementation-guide.md)

---

## Document Structure

Each integration document follows this structure:

1. **Executive Summary** - Architecture decision and rationale
2. **Architecture Flow** - Visual diagram of data flow
3. **Responsibilities** - What each layer does/doesn't do
4. **Parameter Specifications** - Complete field mappings
5. **Implementation Guide** - Production-ready code examples
6. **Error Handling** - Success/error response patterns
7. **Cost Analysis** - Pricing tiers and operation costs
8. **Environment Configuration** - .env variables and Netlify config
9. **Implementation Checklist** - Step-by-step deployment guide

---

## Integration vs Workflow Documentation

**Key Distinction:**

| Type | Location | Purpose | Audience |
|------|----------|---------|----------|
| **Integration Strategy** | `docs/integrations/` | Technical implementation specs with code | Developers, Dev agents |
| **Operational Workflow** | `docs/workflows/` | Business process documentation | Marketing, Ops, Support teams |

**Example:**
- **Integration:** `docs/integrations/salesforce-integration-strategy.md` (454 lines, technical spec)
- **Workflow:** `docs/workflows/ongoing/form-submission-workflow.md` (33 lines, process overview)

Both are maintained and complementary, serving different purposes.

---

## When to Create Integration Documents

Create a new integration document when:

✅ Integrating a third-party service (API, webhook, OAuth)
✅ Complex authentication/authorization required
✅ Multiple configuration options or parameters
✅ Error handling strategies need documentation
✅ Cost implications should be analyzed
✅ Future developers need implementation guidance

---

## Future Integrations

**Planned integrations (not yet documented):**

- **Google Tag Manager (GTM)** - Analytics and conversion tracking
- **CallRail** - Dynamic number insertion and call tracking
- **Make.com** - Webhook automation platform (partial documentation in Salesforce doc)
- **Claude API** - AI content generation (build-time only)

**When implemented, create integration docs following the Salesforce pattern.**

---

## Agent Discovery Pattern

### How BMad Agents Find These Documents

**Auto-Discovery:**
- Dev agent loads `docs/architecture/source-tree.md` on every story
- Source-tree lists `docs/integrations/` directory
- Agent becomes aware integrations exist

**On-Demand Loading:**
- Story mentions "Salesforce integration" → Dev agent loads this doc
- User runs `*load-context` → Can reference specific integrations
- Architect agent references during design decisions

**Loading Strategy:**
```
DISCOVERY (Lightweight):
├── source-tree.md lists directory location
├── README.md (this file) provides index
└── Agents know where to find integration specs

LOADING (On-Demand):
├── Load when story requires integration work
├── Load when user explicitly references
└── NOT auto-loaded (keeps context lean)
```

---

## Related Documentation

**For Architecture Decisions:**
- [docs/architecture/external-services-apis.md](../architecture/external-services-apis.md) - External API patterns
- [docs/architecture/security.md](../architecture/security.md) - Security considerations
- [docs/architecture/environment-variables.md](../architecture/environment-variables.md) - Env var management

**For Operational Procedures:**
- [docs/workflows/ongoing/](../workflows/ongoing/) - Operational workflows
- [docs/workflows/ongoing/form-submission-workflow.md](../workflows/ongoing/form-submission-workflow.md) - Form submission process

**For Implementation:**
- [docs/components/](../components/) - Component implementation guides
- [docs/api-reference/](../api-reference/) - Technology-specific API context

---

## Contributing

When adding new integration documentation:

1. **Follow the Salesforce doc structure** - Proven pattern for integration specs
2. **Include code examples** - Production-ready, copy-paste code
3. **Document all parameters** - Complete field specifications
4. **Analyze costs** - Pricing tiers and operation calculations
5. **Add to this README** - Update the integration list above
6. **Cross-reference** - Link to related workflow and component docs

---

**Maintained By:** Architecture & Development Team
**Project:** Landing Pages Automation v2
