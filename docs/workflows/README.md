# Workflows Directory

**Purpose:** Project-specific operational workflows for Landing Pages Automation v2

**Category:** Operational Process Documentation

**Last Updated:** 2025-10-14

---

## 🎯 Important Distinction

This directory contains **project-specific operational workflows**, NOT BMad framework agent workflows.

| Type | Location | Purpose |
|------|----------|---------|
| **Framework Workflows** | `.bmad-core/workflows/` | YAML files defining agent sequences (greenfield, brownfield) |
| **Project Workflows** | `docs/workflows/` (here) | Markdown files describing business processes |

---

## 📂 Directory Structure

```
docs/workflows/
├── README.md (this file)
│
├── build/                              # ONE-TIME SETUP
│   ├── README.md                       # Build phase guide
│   └── airtable-setup/                 # Airtable automation configuration
│       └── (automation setup guides)
│
└── ongoing/                            # OPERATIONAL (ACTIVE)
    ├── README.md                       # Ongoing operations guide
    ├── content-creation-workflow.md    # Airtable → AI generation
    ├── build-deployment-workflow.md    # GitHub Actions → Netlify
    ├── form-submission-workflow.md     # User → Make.com → Salesforce
    ├── deployment-workflow.md          # Deployment procedures
    └── approval-to-live/               # Marketing → Production flow
        └── (7-step process documentation)
```

---

## 🔄 Lifecycle-Based Organization

### `build/` - One-Time Setup Documentation

⚠️ **Archive after production launch** to `Archive/build-phase-docs/`

**Purpose:**
- Initial system configuration
- Airtable automation setup
- GitHub Actions configuration
- Netlify deployment setup
- Integration configuration

**When to Use:**
- ✅ During Phase 0 (build/setup phase)
- ❌ After production launch

**See:** [build/README.md](build/README.md) for complete details

---

### `ongoing/` - Operational Workflows

✅ **Active after production launch** - Continuously maintained

**Purpose:**
- Day-to-day operational procedures
- Content creation and management
- Build and deployment processes
- Form submission handling
- Marketing workflows

**When to Use:**
- ❌ During Phase 0 (reference only)
- ✅ After production launch (primary reference)

**See:** [ongoing/README.md](ongoing/README.md) for complete details

---

## 👥 Who Uses This

### Marketing Team
- **Primary:** `ongoing/content-creation-workflow.md`
- **Secondary:** `ongoing/approval-to-live/`
- **When:** Daily content operations

### Development Team
- **Primary:** `ongoing/build-deployment-workflow.md`
- **Secondary:** `ongoing/deployment-workflow.md`
- **When:** Deployments, troubleshooting

### Support Team
- **Primary:** All `ongoing/` workflows
- **Secondary:** Error handling docs
- **When:** User issues, system problems

---

## 🤖 Agent Discovery & Loading

**How BMad Agents Learn About These Workflows:**

**Auto-Loaded (Discovery):**
- ✅ `docs/architecture/source-tree.md` (lines 300-320) mentions workflows location
- ✅ Agents become **aware** workflows exist without loading full content
- ✅ Keeps agent context lean and efficient

**On-Demand Loading (Implementation):**
- 📄 Load `docs/workflows/README.md` to understand structure
- 📄 Load specific workflow files when implementing related features
- 📄 Reference during story implementation involving workflows

**When Agents Should Load This Directory:**

| Agent | When to Load | Why |
|-------|--------------|-----|
| **Dev** | Implementing workflow-related stories | Need process details for accurate implementation |
| **Dev** | Working with Airtable automations | Build workflows document automation setup |
| **Architect** | Designing system integrations | Existing workflows inform architecture decisions |
| **SM** | Creating workflow enhancement stories | Understanding current process helps story creation |
| **QA** | Testing workflow features | Process validation requires workflow knowledge |

**Load Pattern:**
```text
1. Agent auto-loads source-tree.md (discovers workflows exist)
2. Agent sees task involves workflow implementation
3. Agent loads docs/workflows/README.md (understands structure)
4. Agent loads specific workflow file (gets implementation details)
```

---

## 🎓 BMad Context Pattern

This follows the BMad separation principle:

**Framework Level:**
- `.bmad-core/workflows/` = Universal agent orchestration (greenfield-fullstack.yaml, etc.)
- Used by: BMad Orchestrator to coordinate agents

**Project Level:**
- `docs/workflows/` = Project-specific business processes (content workflow, deployment, etc.)
- Used by: Operational teams (marketing, dev, support)

**Analogy:**
Just as `docs/api-reference/` and `docs/components/` separate technology context:
- `.bmad-core/workflows/` = How agents work together
- `docs/workflows/` = How the business operates

---

## 🚀 Quick Links

| Workflow | Location | Purpose |
|----------|----------|---------|
| **Content Creation** | [ongoing/content-creation-workflow.md](ongoing/content-creation-workflow.md) | Airtable → AI generation |
| **Build & Deploy** | [ongoing/build-deployment-workflow.md](ongoing/build-deployment-workflow.md) | GitHub Actions → Netlify |
| **Form Submission** | [ongoing/form-submission-workflow.md](ongoing/form-submission-workflow.md) | User → Salesforce |
| **Approval to Live** | [ongoing/approval-to-live/](ongoing/approval-to-live/) | Marketing → Production |
| **Airtable Setup** | [build/airtable-setup/](build/airtable-setup/) | One-time automation config |

---

## 📋 Documentation Standards

All workflow documentation includes:
- **Purpose:** What the workflow does
- **When to Use:** Lifecycle phase guidance
- **Step-by-Step:** Detailed process instructions
- **Team Roles:** Who does what
- **Related Docs:** Cross-references

---

## 🔗 Related Documentation

**For Architecture:**
- [docs/architecture/](../architecture/) - Technical implementation details
- [docs/architecture/source-tree.md](../architecture/source-tree.md) - Project structure

**For Integrations:**
- [docs/integrations/](../integrations/) - Third-party service integration

**For Technology Context:**
- [docs/api-reference/](../api-reference/) - Technology-specific references (Airtable, Netlify, etc.)

**For BMad Framework:**
- [.bmad-core/workflows/](.bmad-core/workflows/) - Agent orchestration workflows

---

## 💡 Key Principles

1. **Lifecycle Awareness:** Separate build-time from operational documentation
2. **Clear Archival Strategy:** Know what to archive after production
3. **Team-Specific:** Document processes for specific operational teams
4. **Continuously Maintained:** `ongoing/` stays current with operational reality
5. **Distinct from Framework:** Project workflows ≠ BMad agent workflows

---

**Last Updated:** 2025-10-14
**Project:** Landing Pages Automation v2
**Status:** Active Documentation
