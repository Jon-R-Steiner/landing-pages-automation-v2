# Starter Template or Existing Project

**Status:** Greenfield project (no starter template)

**Repository Approach:** Standard Next.js 15 project structure (FLAT, not monorepo)

**Rationale:**
- Previous monorepo + Netlify Functions deployment failed
- Single Next.js app with no backend API we write (external services only)
- Industry best practice: monorepos are overkill for single-app projects
- Simpler deployment, debugging, and maintenance
