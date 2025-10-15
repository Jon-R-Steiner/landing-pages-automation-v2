# API Reference - Context Loading Guide

**Purpose:** Task-specific technical reference documentation for dev agent

**Philosophy:** Load context ON DEMAND when working on specific technology areas. This keeps the dev agent lean while providing deep technical knowledge when needed.

---

## 🎯 How to Use This

### For Dev Agent Tasks

**Load specific technology context:**
```
@dev load docs/api-reference/airtable/ and [task instruction]
@dev load docs/api-reference/netlify/ and [task instruction]
```

**Load multiple contexts if needed:**
```
@dev load docs/api-reference/airtable/ and docs/api-reference/netlify/ for [task]
```

### What NOT to Do

❌ **Don't add these to `devLoadAlwaysFiles`** - that defeats the "lean dev agent" principle
✅ **Do load explicitly** when working on technology-specific tasks

---

## 📚 Available Technology Contexts

### Airtable (`docs/api-reference/airtable/`)

**Load when:**
- Writing automation scripts
- Working with Airtable API
- Creating database integrations

**Contains:**
- Scripting fundamentals, patterns, best practices
- Field types and data structures
- Complete working examples
- Production script patterns

**Quick Start:** See [airtable/README.md](./airtable/README.md)

---

### Netlify (`docs/api-reference/netlify/`)

**Load when:**
- Creating serverless functions
- Configuring edge functions
- Setting up deployments
- Working with Netlify APIs

**Contains:**
- Functions API reference
- Edge runtime patterns
- Deployment configuration
- Complete examples

**Quick Start:** See [netlify/README.md](./netlify/README.md)

---

### Next.js (`docs/api-reference/nextjs/`)

**Load when:**
- Working with App Router features
- Implementing Server Components
- Advanced data fetching patterns
- Performance optimization

**Contains:**
- Next.js 15 features
- Routing patterns
- Server/Client component patterns
- React 19 integration

**Quick Start:** See [nextjs/README.md](./nextjs/README.md)

---

### Tailwind CSS (`docs/api-reference/tailwind/`)

**Load when:**
- Complex styling implementations
- Tailwind v4 features
- Custom configurations
- Design system integration

**Contains:**
- Tailwind v4 features
- Utility patterns
- Custom class creation
- Migration guides

**Quick Start:** See [tailwind/README.md](./tailwind/README.md)

---

## 🔍 Structure Pattern

Each technology folder follows this structure:

```
{technology}/
├── README.md           # Tech-specific guide & index
├── reference/          # API documentation & guides
│   ├── fundamentals.md
│   ├── patterns.md
│   └── best-practices.md
└── examples/           # Code examples
    ├── README.md       # Examples index
    ├── snippets/       # Small reusable patterns
    ├── complete/       # Full working examples
    └── found/          # Curated third-party examples
```

---

## 🎓 BMad Philosophy: Context on Demand

This structure implements the BMad principle of **"Dev agents must be lean"**:

1. **Always-loaded context** (via `devLoadAlwaysFiles`):
   - Coding standards
   - Tech stack overview
   - Source tree structure

2. **Task-specific context** (this folder):
   - Load explicitly when needed
   - Deep technical knowledge
   - Complete with examples

3. **Result:**
   - Dev agent stays focused
   - Maximum context available when needed
   - User (CEO) directs what context is needed

---

## 📊 Quick Reference

| Technology | Primary Use Case | Load Command |
|------------|-----------------|--------------|
| Airtable | Automation scripts, database | `load docs/api-reference/airtable/` |
| Netlify | Functions, deployment | `load docs/api-reference/netlify/` |
| Next.js | App Router, Server Components | `load docs/api-reference/nextjs/` |
| Tailwind | Advanced styling, v4 features | `load docs/api-reference/tailwind/` |

---

## 🚀 Workflow Example

```
User: I need to create an Airtable automation that matches records
      and then deploys via Netlify function

Dev: @dev load docs/api-reference/airtable/ and
     docs/api-reference/netlify/ and implement the automation
```

The dev agent now has:
- ✅ Always-loaded essentials (coding standards, tech stack)
- ✅ Airtable scripting knowledge (API, patterns, examples)
- ✅ Netlify functions knowledge (API, deployment, examples)
- ✅ Lean context for maximum code implementation space

---

## 💡 Contributing

When adding new technology contexts:

1. **Create folder structure:**
   ```bash
   mkdir -p docs/api-reference/{tech}/reference
   mkdir -p docs/api-reference/{tech}/examples/{snippets,complete,found}
   ```

2. **Create README files:**
   - `{tech}/README.md` - Tech-specific guide
   - `{tech}/examples/README.md` - Examples index

3. **Add reference documentation:**
   - Fundamentals, patterns, best practices
   - API references
   - Migration guides

4. **Curate examples:**
   - Extract from production code
   - Save useful found examples
   - Document sources with metadata

5. **Update this file:**
   - Add to "Available Technology Contexts" section
   - Add to Quick Reference table

---

**Last Updated:** 2025-10-14
**Project:** Landing Pages Automation v2
