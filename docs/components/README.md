# Component Implementation Guides

**Purpose:** Complete implementation guides, ADRs, and patterns for complex UI components

**Category:** On-Demand Context (load when building specific components)

**Last Updated:** 2025-10-14

---

## 🎯 When to Load This Context

Load component guides when:
- Building or modifying specific UI components
- Need detailed implementation patterns
- Reviewing architectural decisions for components
- Understanding component-specific best practices

**DO NOT add to `devLoadAlwaysFiles`** - These are loaded on-demand to keep dev agent lean.

---

## 🎨 Design Context & Principles

When implementing UI components for **paid traffic landing pages**, start with design context:

### Recommended Workflow

1. **Load design principles** - Get core UX/UI context for paid landing pages
   ```
   @dev load docs/design-principles.md
   ```
   - Core design principles (Quality Score First, CRO, Message Match)
   - 10-section page structure overview
   - Success metrics and usability goals
   - Mobile-first requirements
   - ~3-4k tokens (lightweight bridge document)

2. **Load component implementation guide** - Get technical HOW
   ```
   @dev load docs/components/trust-bar-implementation.md
   ```
   - React component patterns and code examples
   - Accessibility implementation
   - Testing strategies
   - Performance optimization

3. **Reference full specification as needed** - If component guide lacks detail
   ```
   @dev load docs/front-end-spec.md (section X.X)
   ```
   - Complete UX/UI specification (58,804 tokens)
   - Detailed content requirements per section
   - User flows and interaction patterns
   - Visual design specifications

### Design Context vs Implementation Guides

| Document | Purpose | Token Size | When to Load |
|----------|---------|------------|-------------|
| **design-principles.md** | Design WHY - Principles, metrics, structure | ~3-4k | All UI component work |
| **Component guides** (this dir) | Technical HOW - Code patterns, tests | Varies | Building specific components |
| **front-end-spec.md** | Complete specification | 58k | When component guide lacks detail |

### Important Note

**Design principles are UI-specific context** - only load for paid traffic landing page UI work:
- ✅ Load when: Building hero sections, CTAs, trust bars, galleries, forms, mobile layouts
- ❌ Don't load for: Build scripts, Airtable automations, API integrations, non-UI work

---

## 📚 Available Implementation Guides

### Forms
- **forms-library-selection.md** - ADR for React Hook Form + Zod choice
- **forms-implementation-guide.md** - Complete 3-stage form implementation (1100+ lines)
  - React Hook Form integration
  - Zod validation schemas
  - localStorage persistence
  - GTM dataLayer tracking
  - Accessibility implementation
  - Full test suite examples

### UI Components
- **trust-bar-implementation.md** - ADR-033: Sticky trust bar pattern
  - CSS `position: sticky` implementation
  - CLS prevention strategies
  - Mobile optimization
  - Accessibility and performance

- **gallery-implementation.md** - AI-generated gallery component patterns
- **faq-accordion-implementation.md** - Accessible FAQ component guide

### Quality & Optimization
- **html-validation-strategy.md** - HTML validation approach
- **mobile-optimization-checklist.md** - Mobile-first optimization patterns

---

## 💡 How to Use

### Load Specific Component Guide

```
@dev load docs/components/forms-implementation-guide.md for building contact form
@dev load docs/components/trust-bar-implementation.md for implementing trust bar
```

### Load Entire Component Context

```
@dev load docs/components/ for component implementation work
```

### Load Multiple Contexts (if needed)

```
@dev load docs/components/ and docs/api-reference/nextjs/ for component work
```

---

## 🏗️ Component Guide Structure

Each guide typically includes:

1. **Overview & Context** - What and why
2. **ADR (if applicable)** - Architectural decisions and rationale
3. **Implementation Details** - Step-by-step code examples
4. **Patterns & Best Practices** - Component-specific patterns
5. **Accessibility** - WCAG 2.1 AA compliance
6. **Testing** - Unit, integration, E2E test examples
7. **Troubleshooting** - Common issues and solutions
8. **Related Decisions** - Links to other relevant ADRs

---

## 🎓 BMad Philosophy: Context on Demand

This directory implements BMad's **"Lean Dev Agent"** principle:

### ✅ Correct Pattern
- **Always-loaded** = Core essentials (coding standards, tech stack, source tree)
- **On-demand components** = `docs/components/{component}/` (this directory)
- **On-demand tech** = `docs/api-reference/{tech}/`
- **Per-task** = Stories and requirements

### ❌ Anti-Pattern
- Adding 1000+ line component guides to `devLoadAlwaysFiles`
- Loading all component guides on every dev session
- Mixing component-specific details with general architecture

---

## 🔍 Related Documentation

| Category | Location | When to Load |
|----------|----------|-------------|
| **Core Essentials** | `devLoadAlwaysFiles` (config) | Always loaded |
| **General Architecture** | `docs/architecture/` | Per story/task |
| **Component Guides** | `docs/components/` (here) | Building components |
| **Technology Context** | `docs/api-reference/{tech}/` | Tech-specific work |
| **Requirements** | `docs/stories/`, `docs/prd/` | Per story |

---

## 📝 Agent Roles & Usage

### UX Expert
- Uses for design patterns and decisions
- Reviews ADRs for UI/UX choices
- References accessibility implementations

### Architect
- Uses for architectural decisions (ADRs)
- Reviews technical implementations
- Ensures pattern consistency

### Dev
- Uses when implementing specific components
- Follows implementation guides step-by-step
- References examples and troubleshooting

---

## 🚀 Example Workflow

```
User: I need to implement the contact form

Dev: Let me load the forms implementation guide for this work.
     @dev load docs/components/forms-implementation-guide.md

     ✅ Loaded complete React Hook Form + Zod guide
     ✅ Includes schemas, validation, persistence, testing

     Starting implementation based on the guide...
```

---

## 💬 Contributing New Component Guides

When adding new component guides:

1. **Follow existing structure** - See forms-implementation-guide.md as reference
2. **Include complete examples** - Code snippets with full context
3. **Document decisions** - ADR format for architectural choices
4. **Add accessibility** - WCAG 2.1 AA requirements
5. **Provide tests** - Unit and integration test examples
6. **Update this README** - Add to Available Guides list

---

## 🔗 Quick Links

- [Project Structure Guide](../.bmad-core/utils/project-structure-guide.md)
- [API Reference Context Map](../api-reference/README.md)
- [Architecture Documentation](../architecture/)
- [Source Tree](../architecture/source-tree.md)

---

**Last Updated:** 2025-10-14
**Project:** Landing Pages Automation v2
