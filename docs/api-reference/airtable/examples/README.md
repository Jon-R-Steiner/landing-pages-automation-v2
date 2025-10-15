# Airtable Examples Index

**Purpose:** Curated code examples for Airtable automation development
**Last Updated:** 2025-10-14
**For:** Landing Pages Automation v2 Project

---

## 📁 Directory Structure

```
examples/
├── README.md (this file)     # Index and navigation
├── snippets/                 # Small reusable patterns (5-20 lines)
├── complete/                 # Full working examples (50-200 lines)
└── found/                    # Curated third-party examples
    ├── official-airtable/    # From Airtable documentation
    └── community/            # From forums, blogs, Stack Overflow
```

---

## 🎯 How to Use Examples

### Loading for Dev Context

**Full Airtable context (includes examples):**
```
@dev load docs/api-reference/airtable/ and [task]
```

**Reference specific example:**
```
@dev use the pattern from docs/api-reference/airtable/examples/complete/[example].js
```

### Finding the Right Example

1. **Browse by use case** (sections below)
2. **Check snippets/** for small reusable patterns
3. **Check complete/** for full implementations
4. **Check found/** for third-party examples

---

## 📚 Available Examples

### Snippets (Small Reusable Patterns)

> **Coming Soon** - Will include:
> - Query patterns (find, filter, sort)
> - Update patterns (conditional, batch)
> - Validation patterns
> - Error handling patterns

**How to add:** Create `.js` files in `snippets/` with:
- Single focused pattern (5-20 lines)
- Clear comments explaining usage
- Extracted from larger examples

---

### Complete Examples (Full Working Scripts)

> **Coming Soon** - Will include:
> - Record matching/linking automation
> - Conditional update (self-healing pattern)
> - Batch processing with progress tracking
> - Field validation with enrichment

**How to add:** Create `.js` files in `complete/` with:
- Full script structure (input, logic, output)
- Complete error handling
- Production-ready patterns
- 50-200 lines typical

**Example header format:**
```javascript
/**
 * Example: [Name]
 *
 * Purpose: [What it does]
 * Use Case: [When to use this]
 *
 * Key Features:
 * - [Feature 1]
 * - [Feature 2]
 *
 * Related Patterns:
 * - See reference/patterns.md - [Pattern Name]
 */
```

---

### Found Examples (Third-Party)

> **Coming Soon** - Will include examples from:
> - Official Airtable documentation
> - Community forums
> - Stack Overflow solutions
> - Blog posts and tutorials

**How to add:** Create `.js` files in `found/[source]/` with:

**Required metadata header:**
```javascript
/**
 * Example: [Name]
 *
 * Source: [Official Airtable / Community / etc.]
 * URL: [Full URL to original]
 * Date Found: YYYY-MM-DD
 * Author: [If known]
 *
 * Modified: [What we changed, if anything]
 *
 * Purpose: [Why we saved this]
 * Use Case: [When to reference this]
 */

// ... example code ...
```

---

## 🔍 Examples by Use Case

### Record Matching & Linking

**Goal:** Find and link related records based on field values

**Snippets:**
> Coming soon - query patterns

**Complete:**
> Coming soon - full matching automation

**Related Patterns:**
- [reference/patterns.md - Find Record by Field Value](../reference/patterns.md)
- [reference/patterns.md - Compare Linked Records](../reference/patterns.md)

---

### Batch Operations

**Goal:** Process large numbers of records efficiently

**Snippets:**
> Coming soon - batch loop patterns

**Complete:**
> Coming soon - batch update with progress

**Related Patterns:**
- [reference/patterns.md - Process in Batches of 50](../reference/patterns.md)
- [reference/best-practices.md - Performance Optimization](../reference/best-practices.md)

---

### Validation & Data Quality

**Goal:** Validate fields and ensure data integrity

**Snippets:**
> Coming soon - validation patterns

**Complete:**
> Coming soon - field validation + enrichment

**Related Patterns:**
- [reference/patterns.md - Required Field Validation](../reference/patterns.md)
- [reference/best-practices.md - Early Returns](../reference/best-practices.md)

---

### Self-Healing Automations

**Goal:** Only update when values don't match (efficiency + safety)

**Snippets:**
> Coming soon - comparison patterns

**Complete:**
> Coming soon - self-healing automation

**Related Patterns:**
- [reference/patterns.md - Conditional Update](../reference/patterns.md)
- [reference/best-practices.md - Data Safety](../reference/best-practices.md)

---

## 🛠️ Contributing Examples

### From Production Code

When we write good automation scripts:

1. **Extract reusable pattern** → `snippets/`
2. **Save full script** → `complete/`
3. **Add header comments** explaining the pattern
4. **Update this index** with new example

### From External Sources

When we find useful examples online:

1. **Save to** `found/[source]/`
2. **Add complete metadata header** (source, URL, date)
3. **Note any modifications** we made
4. **Update this index** with use case

### Quality Standards

All examples should:
- ✅ Follow our [best practices](../reference/best-practices.md)
- ✅ Include error handling
- ✅ Have clear comments
- ✅ Be tested and working
- ✅ Include metadata/attribution

---

## 📊 Example Template

### For Snippets

```javascript
/**
 * Pattern: [Pattern Name]
 *
 * Purpose: [What this does]
 * Use Case: [When to use]
 */

// Your focused code pattern here (5-20 lines)
```

### For Complete Examples

```javascript
/**
 * Example: [Example Name]
 *
 * Purpose: [What this automation does]
 * Trigger: [When it runs]
 *
 * Key Features:
 * - [Feature 1]
 * - [Feature 2]
 *
 * Related Patterns:
 * - reference/patterns.md - [Pattern Name]
 *
 * Use Case: [When to use/adapt this example]
 */

// === INPUT ===
let config = input.config();
// ...

// === MAIN LOGIC ===
try {
  // Full implementation

} catch (error) {
  // Error handling
}

// === OUTPUT ===
```

### For Found Examples

```javascript
/**
 * Example: [Example Name]
 *
 * Source: [Official Airtable / Community / Stack Overflow / etc.]
 * URL: https://...
 * Date Found: YYYY-MM-DD
 * Author: [Name if known]
 * License: [If applicable]
 *
 * Modified: [None / Added error handling / etc.]
 *
 * Purpose: [Why we saved this]
 * Use Case: [When to reference this]
 *
 * Notes:
 * - [Important note 1]
 * - [Important note 2]
 */

// Original or modified code here
```

---

## 🔗 Related Resources

### In This Project

**Reference Documentation:**
- [← Airtable Index](../README.md)
- [Fundamentals](../reference/fundamentals.md)
- [Patterns](../reference/patterns.md)
- [Best Practices](../reference/best-practices.md)

**Production Scripts:**
> Located in project root (will link when moved to examples)

### External

**Official Examples:**
- [Airtable Scripting Examples](https://airtable.com/developers/scripting/examples)

**Community:**
- [Airtable Community Forum](https://community.airtable.com/)

---

## 📈 Growth Plan

As we build more automations, this folder will grow:

**Phase 1 (Current):**
- Structure and templates in place
- Ready for examples

**Phase 2 (As We Build):**
- Extract patterns from production code
- Add to snippets/ and complete/
- Document use cases

**Phase 3 (Ongoing):**
- Curate useful external examples
- Refine patterns based on experience
- Build comprehensive example library

---

**Navigation:**
- [← Back to Airtable Index](../README.md)
- [← Back to API Reference](../../README.md)

---

**Ready to add examples!** Follow the templates above when contributing.
