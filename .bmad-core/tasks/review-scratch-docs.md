# <!-- Powered by BMAD™ Core -->

# Review Scratch Documentation Task

## Purpose

Review and triage agent-created ad-hoc documentation in `.ai/scratch/` directory to determine appropriate disposition (promote, archive, integrate, or discard).

## Task Execution

### Step 1: Scan Scratch Directory

- List all files in `.ai/scratch/` (excluding README.md, .gitkeep, _triage-status.md)
- Read metadata header from each file
- Create list of pending documents for review

### Step 2: Review Each Document

For each scratch document:

**Load and Read:**
- Read full document content
- Extract metadata (created, agent, purpose, audience, status, related-to)
- Assess value and relevance

**Categorize:**
- **High Value**: Provides unique insights, reusable patterns, or important context
- **Medium Value**: Useful reference but not critical
- **Low Value**: Temporary or superseded content

### Step 3: Make Triage Decision

**Decision Tree:**

**Option A: Promote to docs/**
- **When**: Content fits existing `docs/` structure (architecture, workflows, components, etc.)
- **Action**:
  1. Determine appropriate `docs/` subdirectory
  2. Move file (or integrate content into existing file)
  3. Update `_triage-status.md` with "promoted" status
  4. Remove from scratch/

**Option B: Promote to BMad Core**
- **When**: Represents repeatable pattern usable across projects
- **Action**:
  1. Identify pattern type (template, task, checklist)
  2. Create corresponding BMad core file
  3. Update relevant agent dependencies
  4. Document in `_triage-status.md` as "integrated"
  5. Archive original to `Archive/promoted-patterns/`

**Option C: Archive**
- **When**: Valuable for history but not actively needed
- **Action**:
  1. Move to `Archive/scratch-YYYY-MM-DD/`
  2. Update `_triage-status.md` with archive reason
  3. Preserve for future reference

**Option D: Discard**
- **When**: No longer relevant, superseded, or low value
- **Action**:
  1. Document in `_triage-status.md` with discard reason
  2. Delete file

### Step 4: Pattern Recognition

**Look for recurring patterns:**
- Multiple similar documents from same agent
- Repeated document types (research, specs, briefs)
- Common structures or formats emerging

**If pattern identified:**
- Note in `_triage-status.md` "Review Notes" section
- Consider BMad integration (template/task creation)
- Discuss with user for feedback

### Step 5: Update Triage Log

Update `.ai/scratch/_triage-status.md`:
- Move documents from "Pending Review" to appropriate category
- Record decision rationale
- Note any patterns identified
- Document BMad integration candidates

### Step 6: Summary Report

Provide user with summary:
- **Documents Reviewed**: Count
- **Promoted to docs/**: List with destinations
- **Archived**: Count and reasons
- **Discarded**: Count and reasons
- **Patterns Identified**: Description
- **BMad Integration Recommendations**: If any

## Best Practices

1. **Regular Review**: Run this task monthly or when scratch/ has 5+ documents
2. **Context Matters**: Consider project phase when assessing value
3. **Ask User**: If unsure about disposition, ask for guidance
4. **Preserve History**: Archive over discard when uncertain
5. **Document Decisions**: Always update triage log with rationale

## Success Criteria

- ✅ All scratch documents reviewed and categorized
- ✅ Triage log updated with all decisions
- ✅ Valuable content promoted or archived
- ✅ Scratch directory contains only active pending docs
- ✅ Patterns identified and documented
