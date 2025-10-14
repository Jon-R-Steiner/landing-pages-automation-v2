# Build Phase Documentation

**Purpose:** One-time setup documentation for initial system configuration

⚠️ **IMPORTANT:** These documents are used **during the build/setup phase only** and should be **archived after production launch**.

---

## What's In This Folder

This folder contains all documentation related to **one-time setup activities** that happen during the initial build phase:

- Airtable automation configuration
- GitHub Actions workflow setup
- Netlify deployment configuration
- Initial data migrations
- System integration setup

---

## When to Use This Documentation

**During Build Phase (Phases 0.1 - 0.5):**
- ✅ Setting up Airtable automations
- ✅ Configuring GitHub Actions
- ✅ Deploying to Netlify for first time
- ✅ Establishing CI/CD pipelines
- ✅ Initial system testing

**After Production Launch:**
- ❌ These docs are no longer actively used
- 📦 **Move to `Archive/build-phase-docs/`** for historical reference
- ✅ Refer to `docs/workflows/ongoing/` for operational workflows

---

## Folder Structure

```
build/
├── README.md (this file)
├── airtable-setup/              # Airtable automation setup
│   └── airtable-automations-complete-guide.md  # Complete guide for all 7+ automations
├── github-actions-setup/        # GitHub Actions configuration (future)
└── netlify-setup/               # Netlify deployment setup (future)
```

**Archived Documentation:**
- Automation 1 (Branch Matching): `Archive/build-phase-docs/automation-1-implementation/` - Complete and in production
- Automation 3 (Export on Approval): `Archive/build-phase-docs/automation-3-implementation/` - Superseded by comprehensive guide

---

## Lifecycle

### Phase 0 (Build): ACTIVE
- Documents are actively used for setup
- Updated as configuration evolves
- Reference for troubleshooting initial setup

### Phase 1 (Production Launch): ARCHIVE
- Move entire `build/` folder to `Archive/build-phase-docs/`
- Keep for historical reference and troubleshooting
- No longer part of active documentation

### Ongoing: REFER TO `ongoing/`
- Operational workflows in `docs/workflows/ongoing/`
- Day-to-day process documentation
- Continuously maintained and updated

---

## Related Documentation

**For Ongoing Operations:**
- [`docs/workflows/ongoing/`](../ongoing/) - Operational workflows (content creation, deployment, form processing)

**For Architecture:**
- [`docs/architecture/`](../../architecture/) - Technical implementation details

**For Integrations:**
- [`docs/integrations/`](../../integrations/) - Third-party service integrations

---

**Last Updated:** 2025-10-11
**Archive After:** Production Launch (Phase 1.0)
