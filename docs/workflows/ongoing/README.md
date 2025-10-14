# Ongoing Operational Workflows

**Purpose:** Day-to-day operational workflows used continuously after production launch

✅ **IMPORTANT:** These documents describe **ongoing operational processes** that remain active **after production launch**.

---

## What's In This Folder

This folder contains all documentation for **continuous operational workflows**:

- Content creation and AI generation process
- Build and deployment workflows
- Form submission handling
- Approval-to-live publishing process
- Ongoing maintenance procedures

---

## When to Use This Documentation

**During Build Phase (Phases 0.1 - 0.5):**
- ✅ Understanding the target operational workflows
- ✅ Designing automation to support these workflows
- ✅ Planning team training

**After Production Launch (Phase 1.0+):**
- ✅ **PRIMARY REFERENCE** for day-to-day operations
- ✅ Marketing team uses for content workflows
- ✅ Dev team uses for deployment workflows
- ✅ Support team uses for troubleshooting
- ✅ Continuously updated as processes evolve

---

## Folder Structure

```
ongoing/
├── README.md (this file)
│
├── Core Workflows (moved from architecture/)
├── content-creation-workflow.md      # Airtable → AI generation
├── build-deployment-workflow.md      # Build and deploy process
├── form-submission-workflow.md       # Form → Salesforce flow
├── deployment-workflow.md            # Deployment procedures
│
└── Approval to Live Process
    └── approval-to-live/             # Approval → Production flow
        ├── overview.md
        ├── 1-marketing-review-approval.md
        ├── 2-airtable-automation-trigger.md
        ├── 3-github-actions-export.md
        ├── 4-netlify-build-deploy.md
        ├── complete-timeline.md
        ├── cost-analysis.md
        └── error-handling-monitoring.md
```

---

## Key Workflows

### 1. Content Creation Workflow
**File:** `content-creation-workflow.md`

**Flow:** Airtable → AI Service → Approval
- Marketing creates draft in Airtable
- AI generates content (SEO, headlines, FAQs, etc.)
- Marketing reviews and approves

### 2. Build & Deployment Workflow
**File:** `build-deployment-workflow.md`

**Flow:** Approval → GitHub Actions → Netlify
- Approved pages trigger export
- GitHub Actions builds static site
- Netlify deploys to CDN

### 3. Form Submission Workflow
**File:** `form-submission-workflow.md`

**Flow:** User submits → Make.com → Salesforce
- Progressive 3-stage form on landing page
- localStorage persistence
- Make.com processes and sends to Salesforce

### 4. Approval to Live Process
**Folder:** `approval-to-live/`

**Complete 4-step process:**
1. Marketing review & approval
2. Airtable automation trigger
3. GitHub Actions export
4. Netlify build & deploy

---

## Lifecycle

### Phase 0 (Build): REFERENCE
- Used to understand target workflows
- Guides automation design
- Planning documentation

### Phase 1 (Production Launch): ACTIVE
- **PRIMARY OPERATIONAL REFERENCE**
- Used daily by marketing team
- Used for deployments by dev team
- Continuously maintained

### Ongoing: EVOLVE
- Updated as processes improve
- New workflows added as features expand
- Always reflects current operational state

---

## Related Documentation

**For Initial Setup (Archive After Launch):**
- [`docs/workflows/build/`](../build/) - One-time setup documentation

**For Architecture:**
- [`docs/architecture/`](../../architecture/) - Technical implementation details

**For Integrations:**
- [`docs/integrations/`](../../integrations/) - Third-party service integrations

---

## Team Usage

### Marketing Team
- **Primary use:** Content creation workflow
- **Reference:** Approval-to-live process
- **When:** Daily content operations

### Development Team
- **Primary use:** Build & deployment workflow
- **Reference:** Error handling & monitoring
- **When:** Deployments, troubleshooting

### Support Team
- **Primary use:** All workflows for troubleshooting
- **Reference:** Error handling documentation
- **When:** User issues, system problems

---

**Last Updated:** 2025-10-11
**Maintained By:** Operations & Development Teams
**Status:** Active - Continuously Updated
