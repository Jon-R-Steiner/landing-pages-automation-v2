# Outdated Workflow Documentation

**Date Archived:** 2025-10-11
**Reason:** Documentation restructuring to reflect actual implementation

## Files Archived

### 1. `step-1-airtable-schema-manual-input.md`
**Why Archived:**
- Described 5-table schema (actual implementation has 12 tables)
- Airtable backend is already complete and production-ready
- Current schema documented in `docs/architecture/data-models.md` and `Archive/airtable-schema-phase1.md`

**Actual State:**
- ✅ Airtable Base: `appATvatPtaoJ8MmS` (complete)
- ✅ 12 tables fully built with relationships, rollups, and automations
- ✅ Schema locked - no changes without approval

---

### 2. `step-2-ai-service-architecture.md`
**Why Archived:**
- Described AI Service (Netlify Functions) triggering during export workflow
- Actual architecture: AI content generation happens **before** approval, not during export

**Actual State:**
- Content is **already generated and stored in Airtable** before marketing approval
- Export workflow only extracts approved content to JSON
- AI generation is out of scope for Phase 0.3 (Export Integration)

**Current Documentation:**
- See `docs/architecture/1-content-creation-workflow.md` for AI generation process

---

### 3. `step-3-ai-content-generation-parallel-processing.md`
**Why Archived:**
- Detailed AI generation prompts and parallel processing logic
- Not part of the export/deployment workflow
- Content generation is a separate upstream process

**Actual State:**
- AI-generated fields are already populated in Airtable Pages table
- Export script only reads these pre-generated fields

**Current Documentation:**
- See `docs/architecture/1-content-creation-workflow.md` for when/how AI runs

---

## What Replaced These Files

**Current Workflow Documentation:**
- `docs/workflows/airtable-to-production/` - Updated to reflect export-only scope
- `docs/architecture/1-content-creation-workflow.md` - AI generation process
- `docs/architecture/2-build-deployment-workflow.md` - Export & deployment process
- `docs/architecture/data-models.md` - Complete 12-table schema

**Key Changes:**
1. Workflow now starts at "Approval" (not "Draft creation")
2. AI Service steps removed from export workflow
3. Schema references updated to actual 12-table implementation

---

## If You Need This Information

**For Airtable Schema:**
- **Current spec:** `docs/architecture/data-models.md`
- **Full schema:** `Archive/airtable-schema-phase1.md` (1,700+ lines)
- **Base ID:** `appATvatPtaoJ8MmS`

**For AI Generation:**
- **Workflow:** `docs/architecture/1-content-creation-workflow.md`
- **Note:** AI generation implementation is deferred (future phase)

**For Export Workflow:**
- **Current:** `docs/workflows/airtable-to-production/index.md`
- **Process:** Approval → GitHub Actions → Export → Build → Deploy

---

**Archived By:** Winston (Architect)
**Context:** Phase 0.3 planning - clarifying actual vs. documented architecture
