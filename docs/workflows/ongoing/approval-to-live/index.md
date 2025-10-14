# Approval to Live Workflow

> **⚠️ IMPORTANT - WORKFLOW SCOPE:**
>
> This workflow documentation covers **ONLY** the **Export & Deployment** process (Approval → Live).
>
> **Content creation and AI generation** are handled **separately** before approval.
> See `docs/workflows/ongoing/content-creation-workflow.md` for AI generation details.
>
> **Airtable Backend Status:** ✅ Complete (12 tables, production-ready)
> See `docs/architecture/data-models.md` and `Archive/airtable-schema-phase1.md` for full schema.

## Table of Contents

- [Airtable → Production Workflow](#table-of-contents)
  - [Overview: The Complete Flow](./overview-the-complete-flow.md) - Export & deployment process
  - [Step 1: Marketing Review & Approval](./1-marketing-review-approval.md)
    - [Status Workflow](./1-marketing-review-approval.md#status-workflow)
    - [What Marketing Reviews](./1-marketing-review-approval.md#what-marketing-reviews)
  - [Step 2: Airtable Automation Trigger](./2-airtable-automation-trigger.md)
    - [Airtable Automation Configuration](./2-airtable-automation-trigger.md#airtable-automation-configuration)
  - [Step 3: GitHub Actions Export](./3-github-actions-export.md)
    - [Workflow File](./3-github-actions-export.md#workflow-file)
    - [Export Script](./3-github-actions-export.md#export-script)
  - [Step 4: Netlify Build & Deploy](./4-netlify-build-deploy.md)
    - [Netlify Configuration](./4-netlify-build-deploy.md#netlify-configuration)
    - [Next.js Build Process](./4-netlify-build-deploy.md#nextjs-build-process)
    - [Next.js Static Export](./4-netlify-build-deploy.md#nextjs-static-export)
  - [Complete Timeline: Approval → Live](./complete-timeline-draft-live.md)
  - [Cost Analysis](./cost-analysis.md)
    - [Infrastructure Costs](./cost-analysis.md#infrastructure-costs)
  - [Error Handling & Monitoring](./error-handling-monitoring.md)
    - [Airtable Status on Failure](./error-handling-monitoring.md#airtable-status-on-failure)
    - [Monitoring Dashboard](./error-handling-monitoring.md#monitoring-dashboard)
  - [Next Steps](./next-steps.md)

---

## Related Documentation

**Before This Workflow:**
- Content Creation → See [`docs/workflows/ongoing/content-creation-workflow.md`](../content-creation-workflow.md)
- AI generation happens before approval

**After This Workflow:**
- Pages are live on production
- Forms submit to Salesforce → See [`docs/workflows/ongoing/form-submission-workflow.md`](../form-submission-workflow.md)

**Setup Documentation (One-Time):**
- Airtable automation setup → See [`docs/workflows/build/airtable-setup/`](../../build/airtable-setup/)
- Archive after production launch
