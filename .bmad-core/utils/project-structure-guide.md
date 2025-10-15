# Project Documentation Structure Guide

**Purpose:** Recommended patterns for organizing project documentation to work seamlessly with BMad Method

**Last Updated:** 2025-10-14

---

## Philosophy: Separation of Concerns

BMad Method separates documentation into distinct categories based on when and how it's loaded:

| Category | Location | When Loaded | Purpose |
|----------|----------|-------------|---------|
| **BMad Framework** | `.bmad-core/` | On agent activation | Framework itself, agent definitions, tasks |
| **Always-Loaded** | Listed in `devLoadAlwaysFiles` | On dev agent activation | Essential standards for ALL development tasks |
| **API Reference** | `docs/api-reference/{tech}/` | On demand | Deep tech-specific knowledge |
| **Project Docs** | `docs/architecture/`, `docs/stories/` | Per task/story | Project-specific context |

---

## Recommended Structure

### 1. Always-Loaded Essentials

**Location:** Configured in `.bmad-core/core-config.yaml` under `devLoadAlwaysFiles`

**Example:**
```yaml
devLoadAlwaysFiles:
  - docs/architecture/coding-standards.md
  - docs/architecture/tech-stack.md
  - docs/architecture/source-tree.md
```

**What belongs here:**
- Coding standards and conventions
- Project-wide tech stack overview
- Source tree/folder structure
- Critical architectural principles

**Size guideline:** Keep minimal (3-5 files max) to preserve dev agent context

---

### 2. API Reference (On-Demand Context)

**Location:** `docs/api-reference/{technology}/`

**Structure:**
```
docs/api-reference/
├── README.md (context map - lists all available contexts)
│
├── {technology}/
│   ├── README.md (tech-specific guide & index)
│   ├── reference/
│   │   ├── fundamentals.md
│   │   ├── patterns.md
│   │   ├── best-practices.md
│   │   └── api-reference.md
│   └── examples/
│       ├── README.md (examples index)
│       ├── snippets/
│       ├── complete/
│       └── found/
```

**Available technologies (examples):**
- `airtable/` - Airtable API, scripting, patterns
- `netlify/` - Functions, edge functions, deployment
- `nextjs/` - App Router, Server Components, React 19
- `tailwind/` - Tailwind v4, utilities, patterns

**Loading pattern:**
```
@dev *load-context airtable
```
or
```
@dev load docs/api-reference/netlify/ for this task
```

**What belongs here:**
- Technology-specific APIs
- Framework-specific patterns
- Deep technical references
- Code examples and snippets
- Best practices for specific tech

**Key principle:** NOT loaded by default. Load explicitly when working with that technology.

---

### 3. Project Architecture

**Location:** `docs/architecture/`

**Typical files:**
- `tech-stack.md` - High-level stack overview (always-loaded)
- `coding-standards.md` - Project coding conventions (always-loaded)
- `source-tree.md` - Folder structure explanation (always-loaded)
- Technology-specific deep dives (NOT always-loaded)

**Pattern:**
- Essentials → Always-loaded
- Deep technical → Load per task

---

### 4. Stories and Requirements

**Location:** `docs/stories/`, `docs/prd/`

**Loaded:** Per story/task by dev agent

**What belongs here:**
- User stories
- Story acceptance criteria
- Epic definitions
- Product requirements

---

### 5. Project Workflows (Operational)

**Location:** `docs/workflows/`

**Important Distinction:** Project-specific operational workflows, NOT BMad framework agent workflows (`.bmad-core/workflows/`)

**Structure:**
```
docs/workflows/
├── README.md (master index)
│
├── build/                    # ONE-TIME SETUP
│   ├── README.md
│   └── (setup documentation)
│
└── ongoing/                  # OPERATIONAL (ACTIVE)
    ├── README.md
    └── (operational workflows)
```

**Lifecycle-Based Organization:**

**`workflows/build/`** - One-Time Setup
- Automation configuration (Airtable, GitHub Actions, etc.)
- Initial deployment setup
- System integration configuration
- ⚠️ **Archive after production launch**

**`workflows/ongoing/`** - Continuous Operations
- Content creation workflows
- Build and deployment procedures
- Form submission handling
- Approval-to-live processes
- ✅ **Continuously maintained**

**What belongs here:**
- Step-by-step operational procedures
- Team coordination guides
- Cross-functional workflows
- Business process documentation

**What does NOT belong here:**
- BMad agent workflows (those go in `.bmad-core/workflows/`)
- Technical implementation details (those go in `docs/architecture/`)
- API integrations (those go in `docs/integrations/`)

**Key Principle:** Separate build-time setup documentation from ongoing operational procedures to clearly define what to archive vs maintain long-term.

---

## Migration Guide

### From Scattered Tech Docs

**Before:**
```
docs/
├── airtable-docs.md
├── nextjs-notes.md
├── random-examples/
└── coding-standards.md
```

**After:**
```
docs/
├── architecture/
│   └── coding-standards.md (always-loaded)
└── api-reference/
    ├── airtable/
    │   ├── README.md
    │   └── reference/
    └── nextjs/
        ├── README.md
        └── reference/
```

### From Always-Loaded Everything

**Problem:** Dev agent context filled with unused docs

**Before** (in `devLoadAlwaysFiles`):
```yaml
devLoadAlwaysFiles:
  - docs/coding-standards.md
  - docs/airtable-full-api.md ❌
  - docs/netlify-guide.md ❌
  - docs/nextjs-patterns.md ❌
```

**After:**
```yaml
devLoadAlwaysFiles:
  - docs/architecture/coding-standards.md ✅
  # API references NOT here - load on demand!
```

Move tech-specific docs to `docs/api-reference/{tech}/` and load with `*load-context` when needed.

---

## Benefits of This Structure

### For Dev Agent
✅ Lean context (only essentials always-loaded)
✅ Deep knowledge available on demand
✅ Faster, more focused responses

### For Your Project
✅ Organized, discoverable documentation
✅ Scales as tech stack grows
✅ Clear separation of concerns

### For Your Workflow
✅ Load what you need, when you need it
✅ No context wasted on unused tech docs
✅ Easy to extend for new technologies

---

## Adding New Technologies

**Step 1:** Create folder structure
```bash
mkdir -p docs/api-reference/{new-tech}/reference
mkdir -p docs/api-reference/{new-tech}/examples/{snippets,complete,found}
```

**Step 2:** Create README
```
docs/api-reference/{new-tech}/README.md
```
Include: when to load, what's included, quick start

**Step 3:** Add reference documentation
```
docs/api-reference/{new-tech}/reference/
```

**Step 4:** Add examples as you build
```
docs/api-reference/{new-tech}/examples/
```

**Step 5:** Update master context map
Add to `docs/api-reference/README.md`

**Done!** Load with `*load-context {new-tech}`

---

## BMad Integration

### Task Support

The `load-api-context.md` task automatically:
- Checks if context exists
- Loads README
- Intelligently loads additional docs based on needs
- Confirms what was loaded

### Dev Agent Awareness

Dev agent core principles include:
```yaml
- CONTEXT LOADING: devLoadAlwaysFiles provides always-loaded
  essentials. For technology-specific deep context, use
  *load-context command or manually load docs/api-reference/{tech}/
  on demand.
```

### Command Available

`*load-context {technology}` - One command to load any tech context

---

## Examples

### Example 1: Starting Airtable Work
```
User: I need to create an Airtable automation
Dev: *load-context airtable
     ✅ Airtable API context loaded
     Ready to implement with patterns and examples
User: Create script for matching branch records
Dev: [Implements using loaded Airtable patterns]
```

### Example 2: Multi-Tech Task
```
User: Build Netlify function that integrates with Airtable
Dev: Let me load both contexts...
     [Loads docs/api-reference/airtable/]
     [Loads docs/api-reference/netlify/]
     ✅ Both contexts available
User: Implement the integration
Dev: [Implements using both loaded contexts]
```

### Example 3: General Development
```
User: @dev implement story 3.2 (add contact form)
Dev: [Loads only devLoadAlwaysFiles]
     [No tech-specific context needed for basic React form]
     [Implements using coding standards and tech stack overview]
```

---

## Anti-Patterns to Avoid

### ❌ Don't: Put Everything in devLoadAlwaysFiles
**Problem:** Wastes dev agent context on unused docs

**Solution:** Only essentials in always-loaded; tech-specific docs on demand

### ❌ Don't: Mix BMad Framework with Project Docs
**Problem:** `.bmad-core/` should only contain BMad framework

**Solution:** Project docs go in `docs/`, BMad framework stays in `.bmad-core/`

### ❌ Don't: Create Tech-Specific Dev Tasks
**Problem:** Need new task for each technology (not scalable)

**Solution:** Use generic `load-api-context.md` task for ALL technologies

### ❌ Don't: Load API Context for Every Task
**Problem:** Unnecessary context loading

**Solution:** Only load when actually working with that specific technology

---

## Summary

**The Pattern:**
1. **Always-loaded** = Core essentials (coding standards, source tree)
2. **On-demand** = Technology-specific deep dives (API reference)
3. **Per-task** = Story requirements and task context

**The Command:**
```
*load-context {technology}
```

**The Result:**
Lean, focused dev agent with access to deep knowledge when needed.

---

**Questions?** Review `docs/api-reference/README.md` for context map or examine existing `airtable/` structure as reference implementation.
