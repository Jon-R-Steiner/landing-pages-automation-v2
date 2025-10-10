# Landing Pages Automation v2

A scalable, AI-powered landing page generation system built with Next.js 15, producing 500+ high-converting static landing pages with dynamic content management through Airtable.

---

## 🚀 Project Overview

This project automates the creation and deployment of service-based landing pages (e.g., "Bathroom Remodeling in Austin, TX") with:

- **Static generation** for optimal performance (LCP < 2.0s target)
- **AI-generated content** (Trust Bars, FAQs, Gallery captions) via Claude API
- **Airtable-driven workflow** for marketing team content management
- **Progressive 3-stage forms** with localStorage persistence
- **Automated deployment** via GitHub Actions and Netlify CDN

**Architecture:** Airtable → Netlify Functions (AI generation) → GitHub Actions (export) → Netlify Build (static site)

---

## 📚 Documentation

Our documentation is organized semantically for easy navigation:

- **[docs/architecture/](docs/architecture/)** - Technical implementation details (78 files)
  - Key files: [Coding Standards](docs/architecture/coding-standards.md), [Tech Stack](docs/architecture/tech-stack.md), [Source Tree](docs/architecture/source-tree.md)
- **[docs/workflows/](docs/workflows/)** - Operational processes (Airtable → Production workflow)
- **[docs/integrations/](docs/integrations/)** - External system integration strategies (Salesforce, Make.com)
- **[docs/diagrams/](docs/diagrams/)** - Visual system overviews and architecture diagrams

👉 **New to the project?** Start with **[docs/README.md](docs/README.md)** for a complete navigation guide.

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 15.5** (App Router, static export)
- **React 19.2** (Server Components + Client Components)
- **TypeScript 5.9** (strict mode)
- **Tailwind CSS v4.0** (utility-first styling)

### Build-Time
- **Sharp** (image optimization: AVIF, WebP, JPEG)
- **Beasties** (critical CSS extraction)

### Infrastructure
- **Netlify CDN** (static hosting, global edge distribution)
- **Netlify Functions** (serverless AI generation)
- **Airtable** (content management, approval workflow)
- **Claude API** (AI content generation)
- **Make.com** (form → Salesforce automation)
- **GitHub Actions** (CI/CD, Airtable export)

### Third-Party Services
- Google Tag Manager (GTM)
- CallRail (phone tracking)
- Google Analytics 4 (GA4)

See [docs/architecture/tech-stack.md](docs/architecture/tech-stack.md) for complete details.

---

## 🏗️ Project Structure

```
landing-pages-automation-v2/
├── docs/                     # Documentation (architecture, workflows, integrations)
├── src/
│   ├── app/                  # Next.js 15 App Router pages
│   │   ├── [service]/[location]/  # Dynamic landing pages (500+)
│   │   └── layout.tsx        # Root layout
│   ├── components/           # React components (TrustBar, ThreeStageForm, etc.)
│   ├── lib/                  # Utilities, API clients
│   ├── styles/               # Global styles (Tailwind CSS v4)
│   └── types/                # TypeScript type definitions
├── public/                   # Static assets (images, fonts)
├── scripts/                  # Build scripts (Airtable export, image optimization)
├── tests/                    # Unit, integration, E2E tests (Playwright)
├── .bmad-core/               # BMad framework (tasks, templates, agents)
└── .claude/                  # Claude Code configuration
```

See [docs/architecture/source-tree.md](docs/architecture/source-tree.md) for detailed structure.

---

## 🚦 Quick Start

### Prerequisites
- **Node.js 20+** (required for Tailwind CSS v4)
- **npm** (package manager)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd landing-pages-automation-v2

# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your API keys (Airtable, Claude, Make.com)

# Run development server
npm run dev
```

Visit `http://localhost:3000` to see the site.

### Environment Variables

Required environment variables:
- `AIRTABLE_API_KEY` - Airtable API key
- `AIRTABLE_BASE_ID` - Airtable base ID
- `CLAUDE_API_KEY` - Claude API key (for AI generation)
- `MAKE_WEBHOOK_URL` - Make.com webhook URL (for form submissions)
- `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` - reCAPTCHA site key
- `RECAPTCHA_SECRET_KEY` - reCAPTCHA secret key

See [docs/architecture/environment-variables.md](docs/architecture/environment-variables.md) for complete list.

---

## 🔧 Development

### Key Commands

```bash
# Development
npm run dev                 # Start dev server (Next.js 15)

# Building
npm run build              # Build static site (output: out/)
npm run export             # Export Airtable data to content.json

# Testing
npm run test               # Run unit tests
npm run test:e2e           # Run E2E tests (Playwright)
npm run lint               # Lint code (ESLint)

# Image Optimization
npm run optimize-images    # Generate AVIF, WebP, JPEG variants
```

### Coding Standards

We follow strict coding standards for consistency:
- **TypeScript**: Strict mode, no `any` types
- **React**: Server Components by default, Client Components only for interactivity
- **Styling**: Tailwind CSS v4 utility-first approach
- **Testing**: Unit tests for components, E2E tests for critical user flows

See [docs/architecture/coding-standards.md](docs/architecture/coding-standards.md) for complete standards.

---

## 📖 Key Features

### 1. **AI-Powered Content Generation**
- Trust Bars, FAQs, and Gallery captions generated by Claude API
- Marketing team reviews and approves before publishing
- Content stored in Airtable for easy management

### 2. **Static Site Generation**
- 500+ pages pre-rendered at build time
- No runtime database calls = blazing fast performance
- LCP target: < 2.0s on mobile, < 1.5s on desktop

### 3. **Progressive 3-Stage Form**
- Stage 1: Name + Phone
- Stage 2: Service + Location
- Stage 3: Details + Submit
- localStorage persistence across page refreshes

### 4. **Automated Deployment Workflow**
- Marketing creates content in Airtable → AI generates enhancement → Approval → GitHub Actions exports → Netlify builds → CDN deploys
- Full workflow: 6-12 minutes from approval to live

### 5. **Performance Optimized**
- Critical CSS inlined (Beasties)
- Images optimized (Sharp: AVIF, WebP, JPEG)
- Third-party scripts deferred (GTM, CallRail loaded after LCP)
- Static CDN delivery (Netlify global edge)

---

## 🔄 Development Workflow

### For New Features

1. **Create User Story** - Use BMad SM agent (`/BMad:agents:sm`)
2. **Implement Story** - Use BMad Dev agent (`/BMad:agents:dev`)
3. **QA Review** - Use BMad QA agent (`/BMad:agents:qa`)
4. **Deploy** - Merge to main → Netlify auto-deploys

See [docs/workflows/](docs/workflows/) for detailed workflows.

### For Content Updates

1. Marketing updates Airtable
2. Marketing triggers AI generation (status → "AI Processing")
3. Netlify Function generates AI content (18-40s)
4. Marketing reviews and approves (status → "Approved")
5. Airtable webhook triggers GitHub Actions
6. GitHub Actions exports to `content.json` and commits
7. Netlify builds and deploys (6-12 mins)

See [docs/workflows/airtable-to-production/](docs/workflows/airtable-to-production/) for complete workflow.

---

## 🧪 Testing

- **Unit Tests**: Jest + React Testing Library
- **E2E Tests**: Playwright
- **CI/CD**: GitHub Actions runs tests on every PR
- **Quality Gates**: Code review required, all tests must pass

See [docs/architecture/testing-philosophy.md](docs/architecture/testing-philosophy.md) for testing approach.

---

## 🚀 Deployment

### Production Deployment

**Automatic:**
- Merge to `main` branch → Netlify auto-deploys
- Build time: 6-12 minutes (500 pages)
- Deploy to: Netlify CDN (global edge distribution)

**Manual:**
```bash
npm run build    # Build static site
# Upload 'out/' directory to Netlify (or any static host)
```

See [docs/architecture/deployment-workflow.md](docs/architecture/deployment-workflow.md) for details.

---

## 🤝 Contributing

### Development Process

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Follow coding standards ([docs/architecture/coding-standards.md](docs/architecture/coding-standards.md))
4. Write tests for new functionality
5. Run linting and tests (`npm run lint && npm run test`)
6. Commit changes (`git commit -m 'feat: Add amazing feature'`)
7. Push to branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

### Code Review

- All PRs require review before merging
- Follow [docs/architecture/code-review-guidelines.md](docs/architecture/code-review-guidelines.md)
- Ensure all tests pass in CI/CD

---

## 📊 Project Status

**Current Version:** v2.0
**Build Status:** [![Netlify Status](https://api.netlify.com/api/v1/badges/your-badge-id/deploy-status)](https://app.netlify.com/sites/your-site-name/deploys)
**Production:** [Live Site URL]

---

## 📞 Support

**Documentation Issues:**
- Check [docs/README.md](docs/README.md) for navigation guide
- Search documentation using IDE global search (Ctrl/Cmd + Shift + F)

**Development Questions:**
- Review [docs/architecture/](docs/architecture/) for technical details
- Check [docs/workflows/](docs/workflows/) for process guidance

**BMad Framework:**
- See `.bmad-core/` for agent definitions and tasks
- Use `/BMad:agents:bmad-orchestrator` for multi-agent coordination

---

## 📄 License

[Your License Here]

---

## 🙏 Acknowledgments

Built with:
- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Airtable](https://airtable.com/) - Content management
- [Anthropic Claude](https://www.anthropic.com/) - AI content generation
- [Netlify](https://www.netlify.com/) - Hosting and deployment
- [BMad Method](https://github.com/bmad-method) - AI-driven development framework

---

**Last Updated:** 2025-01-10
