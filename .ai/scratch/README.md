# Scratch Documentation Staging Area

**Purpose:** Central staging location for agent-created ad-hoc documentation that doesn't fit standard BMad templates.

**Last Updated:** 2025-10-14

---

## 🎯 When to Use Scratch

**Agents should create files in `.ai/scratch/` when:**

✅ **YES - Use Scratch:**
- Creating research documentation (e.g., technology explorations, optimization research)
- Drafting specifications that don't match story/PRD/architecture templates
- Creating briefing documents for stakeholders
- Exploring implementation approaches
- Documenting experiments or investigations
- Creating ad-hoc process documentation
- Brainstorming technical approaches

❌ **NO - Use Standard Locations:**
- User stories → `docs/stories/`
- Architecture documentation → `docs/architecture/`
- PRD content → `docs/prd.md`
- API reference → `docs/api-reference/`
- Component guides → `docs/components/`
- Operational workflows → `docs/workflows/`

---

## 📁 File Naming Convention

**Format:** `YYYY-MM-DD-{agent}-{topic}.md`

**Examples:**
- `2025-10-14-architect-lcp-optimization-research.md`
- `2025-10-14-pm-paid-traffic-alignment-spec.md`
- `2025-10-14-dev-airtable-export-exploration.md`
- `2025-10-14-analyst-competitive-analysis-brief.md`

**Rules:**
- Always include date (YYYY-MM-DD format)
- Always include agent name (architect, pm, dev, analyst, etc.)
- Use kebab-case for topic
- Always use `.md` extension

---

## 📋 Required Metadata Header

**Every scratch document MUST start with this YAML frontmatter:**

```yaml
---
created: YYYY-MM-DD
agent: {agent-name}
purpose: {brief description of why this doc was created}
audience: {who should read this}
status: draft
triage-status: pending
related-to: {epic/story/issue if applicable}
---
```

**Example:**

```yaml
---
created: 2025-10-14
agent: architect
purpose: Research LCP optimization strategies for landing pages
audience: Dev team, PM
status: draft
triage-status: pending
related-to: epic-1
---
```

---

## 🔄 Triage Status Lifecycle

**pending** → **reviewed** → **promoted** | **archived** | **integrated**

| Status | Meaning | Next Action |
|--------|---------|-------------|
| **pending** | New document, not yet reviewed | User reviews document |
| **reviewed** | User has assessed value | Decide: promote, archive, or integrate |
| **promoted** | Moved to appropriate docs/ location | Update triage log |
| **archived** | Valuable for history, moved to Archive/ | Update triage log |
| **integrated** | Pattern promoted to BMad core | Update BMad framework |
| **discarded** | Not valuable, can be deleted | Remove file |

---

## 🎓 Review & Triage Workflow

### For Users (Manual Review):

1. **Scan Scratch Directory**
   ```bash
   ls -la .ai/scratch/
   ```

2. **Review Each Document**
   - Read metadata header
   - Assess value and applicability
   - Decide on appropriate action

3. **Take Action**
   - **Keep in docs/**: Move to appropriate `docs/` subdirectory
   - **Archive**: Move to `Archive/scratch-YYYY-MM-DD/`
   - **Promote to BMad**: Consider if pattern should be in BMad core
   - **Discard**: Delete if not valuable

4. **Update Triage Log**
   - Record decision in `_triage-status.md`
   - Keep history of what was promoted/archived

### For Orchestrator Agent (Automated Review):

Run the task: `*review-scratch` (`.bmad-core/tasks/review-scratch-docs.md`)

---

## 🚀 BMad Integration Pathway

**If scratch docs reveal recurring patterns, promote to BMad core:**

### Pattern Recognition Examples:

| Scratch Pattern | BMad Integration |
|-----------------|------------------|
| **Research Documentation** | Create `research-doc-tmpl.yaml` template |
| **Specification Briefs** | Create `spec-brief-tmpl.yaml` template |
| **Exploration Documents** | Create `technical-exploration-tmpl.yaml` |
| **Stakeholder Briefings** | Create `stakeholder-brief-tmpl.yaml` |

### Integration Steps:

1. **Identify Pattern**
   - Multiple similar scratch docs created
   - Clear structure emerges
   - Repeatable use case

2. **Create BMad Template**
   - File: `.bmad-core/templates/{pattern}-tmpl.yaml`
   - Define sections and metadata
   - Document when to use

3. **Create Task (if workflow exists)**
   - File: `.bmad-core/tasks/create-{pattern}.md`
   - Define step-by-step process
   - Link to template

4. **Update Agent Dependencies**
   - Add template to relevant agent's `dependencies.templates`
   - Add task to relevant agent's `dependencies.tasks`
   - Document in agent's commands

5. **Test & Iterate**
   - Use new template/task
   - Refine based on usage
   - Document lessons learned

---

## 📊 Current Scratch Documents

**To Review:**
- Check `_triage-status.md` for documents awaiting review

**Recently Promoted:**
- See Archive/promoted-patterns/ for history

---

## 🔗 Related Documentation

- [Triage Status Log](./_triage-status.md) - Track review decisions
- [BMad Templates](../../.bmad-core/templates/) - Standard document templates
- [BMad Tasks](../../.bmad-core/tasks/) - Reusable workflows
- [Source Tree](../../docs/architecture/source-tree.md) - Project structure

---

## 💡 Best Practices

1. **Always include metadata header** - Makes triage easier
2. **Be specific in filenames** - Clear topic helps with review
3. **Link to related work** - Reference epic/story if applicable
4. **Review regularly** - Don't let scratch accumulate indefinitely
5. **Promote patterns** - If you create 3+ similar docs, it's a pattern
6. **Clean as you go** - Archive or integrate docs after projects complete

---

## 🎯 Success Metrics

- ✅ No ad-hoc docs scattered in `docs/` folder
- ✅ Clear review process for all scratch docs
- ✅ Valuable patterns promoted to BMad core
- ✅ Documentation remains organized and discoverable

---

**Questions?** Review `.bmad-core/tasks/review-scratch-docs.md` for detailed triage workflow.
