# Documentation Navigation Guide

Welcome to the Landing Pages Automation v2 documentation! This guide helps you quickly find the information you need in our semantically organized documentation structure.

---

## 📚 Documentation Philosophy

Our documentation is organized **by purpose, not by file type**. Instead of one monolithic architecture document, we've sharded content into focused, navigable sections:

- **Why semantic organization?** Easier to find specific information, better for AI agent context loading, and clearer separation of concerns
- **Why sharding?** Large documents become overwhelming; smaller, focused files are faster to read and easier to maintain
- **Result:** 100+ focused documents organized by what you're trying to accomplish

---

## 🗺️ Quick Navigation Map

### When to Use Each Documentation Section

| Section | Purpose | You Should Look Here If... |
|---------|---------|----------------------------|
| **[architecture/](architecture/)** | Technical implementation details for developers | You're implementing a feature, need coding standards, tech stack info, or architecture decisions |
| **[workflows/](workflows/)** | Operational processes and procedures | You need to understand how content flows from Airtable to production, or cross-team coordination |
| **[integrations/](integrations/)** | Third-party service integration strategies | You're integrating with Salesforce, Make.com, or other external systems |
| **[diagrams/](diagrams/)** | Visual system overviews and flow charts | You want a high-level visual understanding of the system architecture |

---

## 🔍 How to Find Information

### Decision Tree: "I Need to Know..."

**"How should I write code?"**
→ Start with: [`architecture/coding-standards.md`](architecture/coding-standards.md)
- TypeScript, React, styling, and code quality standards
- Dev agent loads this automatically on every story

**"What technologies are we using?"**
→ Start with: [`architecture/tech-stack.md`](architecture/tech-stack.md)
- Complete list of frontend, build-time, and infrastructure technologies
- Versions, configuration examples, and migration patterns
- Dev agent loads this automatically on every story

**"Where do files go in this project?"**
→ Start with: [`architecture/source-tree.md`](architecture/source-tree.md)
- Complete repository structure and file organization
- Path aliases, import patterns, and naming conventions
- Dev agent loads this automatically on every story

**"How does the system work end-to-end?"**
→ Start with: [`diagrams/technology-flow/`](diagrams/technology-flow/)
- Visual overview of the 4-phase workflow (Airtable → Netlify Functions → GitHub Actions → Netlify Build)
- Then read: [`workflows/airtable-to-production/`](workflows/airtable-to-production/)

**"How do I integrate with Salesforce?"**
→ Start with: [`integrations/salesforce-integration-strategy.md`](integrations/salesforce-integration-strategy.md)
- OAuth 2 authentication via Make.com
- API integration patterns

**"What are the performance targets?"**
→ See: [`architecture/performance-optimization.md`](architecture/performance-optimization.md) and [`architecture/performance-monitoring.md`](architecture/performance-monitoring.md)

**"How do I handle errors?"**
→ See: [`architecture/error-handling-principles.md`](architecture/error-handling-principles.md), [`architecture/runtime-error-handling.md`](architecture/runtime-error-handling.md), and [`architecture/build-time-error-handling.md`](architecture/build-time-error-handling.md)

**"What testing approach should I use?"**
→ Start with: [`architecture/testing-philosophy.md`](architecture/testing-philosophy.md)
- Then: [`architecture/testing-types.md`](architecture/testing-types.md)

**"How do we deploy?"**
→ See: [`architecture/deployment-workflow.md`](architecture/deployment-workflow.md) and [`workflows/airtable-to-production/`](workflows/airtable-to-production/)

---

## 🎯 Common Developer Scenarios

### Scenario 1: "I'm new to the project"

**Start Here (in order):**
1. [`architecture/project-context.md`](architecture/project-context.md) - Understand the project background
2. [`architecture/technical-summary.md`](architecture/technical-summary.md) - Get high-level technical overview
3. [`architecture/source-tree.md`](architecture/source-tree.md) - Understand project structure
4. [`architecture/coding-standards.md`](architecture/coding-standards.md) - Learn coding conventions
5. [`architecture/local-development-setup.md`](architecture/local-development-setup.md) - Set up your environment

### Scenario 2: "I'm implementing a new component"

**Check These:**
1. [`architecture/coding-standards.md`](architecture/coding-standards.md) - Follow React/TypeScript standards
2. [`architecture/component-structure.md`](architecture/component-structure.md) - Component organization patterns
3. [`architecture/tailwind-css-standards.md`](architecture/tailwind-css-standards.md) - Styling conventions
4. [`architecture/testing-types.md`](architecture/testing-types.md) - Write appropriate tests

### Scenario 3: "I need to understand how data flows"

**Read These (in order):**
1. [`diagrams/technology-flow/`](diagrams/technology-flow/) - Visual overview
2. [`workflows/airtable-to-production/`](workflows/airtable-to-production/) - Detailed workflow
3. [`architecture/data-models.md`](architecture/data-models.md) - Data structure
4. [`architecture/external-services-apis.md`](architecture/external-services-apis.md) - External integrations

### Scenario 4: "I'm debugging a build failure"

**Check These:**
1. [`architecture/build-monitoring.md`](architecture/build-monitoring.md) - Build monitoring approach
2. [`architecture/build-time-error-handling.md`](architecture/build-time-error-handling.md) - Common build errors
3. [`architecture/netlify-build-plugins.md`](architecture/netlify-build-plugins.md) - Build plugin configuration
4. [`architecture/environment-variables.md`](architecture/environment-variables.md) - Check env vars

### Scenario 5: "I need to add a third-party integration"

**Review:**
1. [`integrations/`](integrations/) - Existing integration examples
2. [`architecture/external-apis.md`](architecture/external-apis.md) - API integration patterns
3. [`architecture/security.md`](architecture/security.md) - Security considerations

---

## 🤖 Key Documents for AI Dev Agents

The BMad Dev agent automatically loads these three files on every story for consistent development:

1. **[`architecture/coding-standards.md`](architecture/coding-standards.md)** - All coding conventions (TypeScript, React, styling)
2. **[`architecture/tech-stack.md`](architecture/tech-stack.md)** - Complete technology stack with versions
3. **[`architecture/source-tree.md`](architecture/source-tree.md)** - Repository structure and file organization

These three documents are referenced in `.bmad-core/core-config.yaml` under `devLoadAlwaysFiles`.

---

## 📂 Documentation Sections Detailed

### `architecture/` - Technical Reference (78 files)

**Contents organized by category:**

**Foundation & Context:**
- `project-context.md` - Project background and goals
- `technical-summary.md` - High-level technical overview
- `architecture-principles.md` - Core architectural principles
- `success-criteria.md` - Definition of success

**Technology Stack:**
- `tech-stack.md` - **[DEV AGENT LOADS]** Complete technology overview
- `frontend-technologies.md` - Next.js 15, React 19, TypeScript, Tailwind v4
- `build-time-technologies.md` - Sharp, Beasties, build tools
- `platform-and-infrastructure-choice.md` - Netlify, Airtable, architecture

**Code Standards:**
- `coding-standards.md` - **[DEV AGENT LOADS]** All coding conventions
- `typescript-standards.md` - TypeScript-specific standards
- `react-standards.md` - React-specific patterns
- `tailwind-css-standards.md` - Tailwind CSS patterns
- `naming-conventions.md` - Naming rules
- `code-style.md` - General code style

**Project Structure:**
- `source-tree.md` - **[DEV AGENT LOADS]** Repository structure
- `repository-structure.md` - Detailed structure breakdown
- `file-organization.md` - File organization patterns
- `component-structure.md` - Component organization

**Development Practices:**
- `development-best-practices.md` - Best practices guide
- `code-review-guidelines.md` - Code review process
- `git-workflow.md` - Git branching and commit standards
- `local-development-setup.md` - Local dev environment setup

**Testing & Quality:**
- `testing-philosophy.md` - Testing approach and principles
- `testing-types.md` - Unit, integration, E2E testing
- `quality-gates.md` - Quality gate definitions

**Error Handling & Monitoring:**
- `error-handling-principles.md` - Error handling strategy
- `runtime-error-handling.md` - Runtime error patterns
- `build-time-error-handling.md` - Build error handling
- `logging-and-monitoring.md` - Logging approach
- `build-monitoring.md` - Build monitoring strategy

**Performance:**
- `performance-optimization.md` - Optimization strategies
- `performance-monitoring.md` - Performance tracking

**Workflows:**
- `1-content-creation-workflow.md` - Phase 1: Content creation
- `2-build-deployment-workflow.md` - Phase 2: Build and deploy
- `3-form-submission-workflow.md` - Phase 3: Form handling
- `deployment-workflow.md` - Deployment process

**Infrastructure & APIs:**
- `external-services-apis.md` - Third-party services
- `external-apis.md` - API integration patterns
- `netlify-build-plugins.md` - Netlify build configuration
- `netlify-build-hooks.md` - Netlify webhooks
- `when-do-we-use-netlify-functions.md` - Serverless usage (AI generation)
- `why-not-use-netlify-functions-for-form-processing.md` - Architecture decision

**Data & Components:**
- `data-models.md` - Data structure definitions
- `component-library-strategy.md` - Component library approach
- `component-documentation-location.md` - Where to document components

**Security & Operations:**
- `security.md` - Security considerations
- `environment-variables.md` - Environment variable management
- `analytics-tracking.md` - Analytics implementation

**Reference:**
- `table-of-contents.md` - Complete architecture TOC
- `index.md` - Architecture index
- `change-log.md` - Architecture change history

---

### `workflows/` - Operational Processes

**Airtable to Production Workflow:**
- Complete 4-phase workflow from content creation to deployment
- Marketing team operations
- AI generation via Netlify Functions
- GitHub Actions automation
- Netlify build and deploy

**Contents:**
- Step-by-step process documentation
- Cross-team coordination guides
- Operational procedures

---

### `integrations/` - Integration Strategies

**Salesforce Integration:**
- OAuth 2 authentication strategy
- Make.com middleware approach
- Lead management workflow
- API integration patterns

**Contents:**
- Third-party service integration guides
- API documentation
- Authentication strategies
- Data mapping patterns

---

### `diagrams/` - Visual Overviews

**Technology Flow Diagram:**
- Visual representation of 4-phase workflow
- System architecture overview
- Data flow visualization
- Component interaction diagrams

**Contents:**
- System architecture diagrams
- Workflow visualizations
- Technology flow charts
- Infrastructure diagrams

---

## 💡 Tips for Effective Documentation Search

### Use Your IDE's Search Features

**VS Code / Claude Code:**
- `Ctrl/Cmd + Shift + F` - Search across all files
- `Ctrl/Cmd + P` then type `docs/` - Quick file navigation
- Use specific terms like "error handling", "TypeScript", "deployment"

**Example Searches:**
- "Next.js 15" → Find all references to Next.js configuration
- "Airtable API" → Find Airtable integration details
- "LCP optimization" → Find performance optimization strategies

### Follow the Breadcrumbs

Many documents include "Related Documents" sections at the bottom that link to related topics. Follow these to explore connected information.

### Check Multiple Related Files

Related topics may be split across multiple focused files. For example:
- **Error handling** → See `error-handling-principles.md`, `runtime-error-handling.md`, `build-time-error-handling.md`
- **Performance** → See `performance-optimization.md`, `performance-monitoring.md`
- **Testing** → See `testing-philosophy.md`, `testing-types.md`

---

## 🔗 External Resources

**BMad Framework Documentation:**
- `.bmad-core/` - BMad tasks, templates, and agent definitions
- See BMad knowledge base for agent usage and workflows

**Project Management:**
- `docs/prd/` - Product Requirements Document (sharded)
- `docs/stories/` - User stories for development
- `docs/qa/` - QA results and quality gates

---

## 📝 Contributing to Documentation

When updating documentation:

1. **Keep files focused** - Each file should cover one specific topic
2. **Update related documents** - If you change architecture, update dependent docs
3. **Add cross-references** - Link to related documents in "Related Documents" sections
4. **Follow semantic organization** - Place documents in the appropriate folder (architecture/workflows/integrations/diagrams)
5. **Update this guide** - If you add major new sections, update this README

---

## 🚀 Quick Links for Developers

**Most Frequently Accessed:**
- [Coding Standards](architecture/coding-standards.md) ⭐
- [Tech Stack](architecture/tech-stack.md) ⭐
- [Source Tree](architecture/source-tree.md) ⭐
- [Project Context](architecture/project-context.md)
- [Technical Summary](architecture/technical-summary.md)
- [Local Development Setup](architecture/local-development-setup.md)

**Workflow Reference:**
- [Airtable to Production Workflow](workflows/airtable-to-production/)
- [Technology Flow Diagram](diagrams/technology-flow/)
- [Deployment Workflow](architecture/deployment-workflow.md)

**Integration Guides:**
- [Salesforce Integration](integrations/salesforce-integration-strategy.md)
- [External Services & APIs](architecture/external-services-apis.md)

---

## ❓ Still Can't Find What You Need?

1. **Search the entire docs/ folder** using your IDE's global search
2. **Check the Architecture Table of Contents** - [`architecture/table-of-contents.md`](architecture/table-of-contents.md)
3. **Ask the team** - Someone may know where specific information lives
4. **Consider if it needs to be documented** - If you can't find it, maybe it should be added!

---

**Last Updated:** 2025-01-10
**Maintained By:** Architecture & Development Team
