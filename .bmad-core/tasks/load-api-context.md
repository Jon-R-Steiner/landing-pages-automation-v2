<!-- Powered by BMAD™ Core -->

# Load API Context Task

## Purpose

Load technology-specific reference documentation from `docs/api-reference/{tech}/` to provide deep technical context for implementation tasks.

## When to Use

Use this task when:
- Working with specific technologies beyond always-loaded essentials
- Need deep API/framework knowledge for implementation
- Require examples, patterns, and best practices for a technology
- Building features that involve Airtable, Netlify, Next.js, Tailwind, or other specialized tech

**Do NOT use this task for:**
- Always-loaded essentials (coding standards, tech stack, source tree) - these are in `devLoadAlwaysFiles`
- General project context - use story files and architecture docs

## Instructions

When this task is executed, follow these steps:

### 1. Determine Technology

**If user provided technology parameter:**
- Use the specified technology (e.g., `airtable`, `netlify`, `nextjs`, `tailwind`)

**If no parameter provided:**
- Ask user: "Which technology context do you need to load?"
- List available contexts: `airtable`, `netlify`, `nextjs`, `tailwind`, or other

### 2. Verify Context Exists

Check if the technology context folder exists:

```bash
ls docs/api-reference/{technology}/
```

**If folder exists:**
- Proceed to Step 3

**If folder does NOT exist:**
- Inform user: "No API reference documentation found for {technology}"
- Ask if they want to:
  a) Load a different technology context
  b) Continue without loading context
  c) Create the documentation structure first

### 3. Load README

Load the technology-specific README:

```
docs/api-reference/{technology}/README.md
```

This README provides:
- Overview of when to use this context
- What's included in reference/ and examples/
- Quick start guide
- Common use cases
- Related external resources

### 4. Assess Requirements

Based on the README and your current task, determine which additional docs to load:

**Load selectively based on needs:**

**If need fundamentals/API basics:**
→ Load: `docs/api-reference/{technology}/reference/fundamentals.md`
→ Load: `docs/api-reference/{technology}/reference/api-reference.md`

**If need common patterns:**
→ Load: `docs/api-reference/{technology}/reference/patterns.md`

**If need best practices:**
→ Load: `docs/api-reference/{technology}/reference/best-practices.md`

**If need examples:**
→ Load: `docs/api-reference/{technology}/examples/README.md`
→ Optionally: Load specific example files from snippets/ or complete/

**Important:** Don't load everything indiscriminately. Load what you need based on your task.

### 5. Confirm Context Loaded

Inform user what was loaded:

**Example output:**
```
✅ Loaded Airtable API Context

Loaded files:
- docs/api-reference/airtable/README.md
- docs/api-reference/airtable/reference/patterns.md
- docs/api-reference/airtable/reference/best-practices.md

Available for reference:
- Scripting patterns (record lookup, updates, batch processing)
- Best practices (organization, performance, error handling)
- Script template and examples index

Ready to implement Airtable-specific tasks.
```

### 6. Ready for Implementation

You now have technology-specific context loaded and can:
- Reference API patterns and methods
- Use code examples as templates
- Follow technology-specific best practices
- Access technical details beyond general coding standards

## Usage Examples

### Example 1: Loading Airtable Context

```
User: *load-context airtable
Dev: [Loads airtable context per steps above]
     ✅ Airtable API context loaded and ready
User: Now create automation script for matching branch records
Dev: [Implements using loaded context]
```

### Example 2: Loading Multiple Contexts

```
User: I need to create a Netlify function that integrates with Airtable
Dev: I'll load both contexts...
     [Loads docs/api-reference/airtable/]
     [Loads docs/api-reference/netlify/]
     ✅ Both contexts loaded
User: Great, now implement the integration
Dev: [Implements using both loaded contexts]
```

### Example 3: Context Already Loaded

```
User: *load-context nextjs
Dev: [Checks if already loaded this session]
     Note: Next.js context was already loaded earlier in this conversation.
     Would you like me to refresh it or proceed with current context?
```

## Available Technology Contexts

Contexts available in your project (check `docs/api-reference/` for full list):

- **airtable** - Airtable scripting API, patterns, examples
- **netlify** - Netlify functions, edge functions, deployment
- **nextjs** - Next.js App Router, Server Components, React 19
- **tailwind** - Tailwind v4 features, utilities, patterns

## Context Scope

**This provides ON-DEMAND context, distinct from:**

| Type | Location | When Loaded | Purpose |
|------|----------|-------------|---------|
| **Always-Loaded** | devLoadAlwaysFiles | On dev agent activation | Essential standards for ALL tasks |
| **API Reference** | docs/api-reference/{tech}/ | On demand via this task | Deep tech-specific knowledge |
| **Story Context** | docs/stories/ | Per story | Task-specific requirements |

## Blocking Conditions

HALT for:
- Technology folder doesn't exist and user wants to proceed
- Unclear which technology to load
- Unable to read documentation files

## Completion Criteria

- [ ] Technology specified or selected
- [ ] Context folder verified to exist
- [ ] README loaded
- [ ] Additional relevant docs loaded based on needs
- [ ] User informed what was loaded
- [ ] Ready to proceed with tech-specific implementation

## Notes

**Benefits of this approach:**
- ✅ Keeps dev agent lean (no always-loaded tech docs)
- ✅ Provides deep context when needed
- ✅ Works for ANY technology in your stack
- ✅ Scalable as you add new technologies
- ✅ User controls what context is loaded

**Pattern:**
- General essentials = devLoadAlwaysFiles (always)
- Tech-specific knowledge = load-api-context (on demand)
- Task requirements = story files (per task)
