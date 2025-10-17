# Landing Pages Automation v2

A scalable, AI-powered landing page generation system built with Next.js 15, producing 500+ high-converting static landing pages with dynamic content management through Airtable.

---

## 🚀 Project Overview

This project automates the creation and deployment of service-based landing pages (e.g., "Bathroom Remodeling in Austin, TX") with:

- **Static generation** for optimal performance (LCP < 2.0s target)
- **AI-generated content** (FAQs, Benefits, SEO Meta, Hero Copy) via BMad Content Writer agent (MVP)
- **Airtable-driven workflow** for marketing team content management
- **Progressive 3-stage forms** with localStorage persistence
- **Automated deployment** via GitHub Actions and Netlify CDN

**Architecture (MVP):** Airtable → BMad Agent (AI generation) → GitHub Actions (export) → Netlify Build (static site)
**Future State:** Airtable → Netlify Functions (AI generation) → GitHub Actions (export) → Netlify Build (static site)

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
- **Airtable API** (content management, read/write operations)
- **BMad Content Writer Agent** (AI content generation - MVP)
- **Claude Code Subscription** (AI engine for BMad agent)
- **Make.com** (form → Salesforce automation)
- **GitHub Actions** (CI/CD, Airtable export)

**Future:** Netlify Functions + Claude API (automated AI generation)

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

Copy `.env.local.example` to `.env.local` and configure the following variables:

**Airtable Configuration:**
- `AIRTABLE_API_KEY` - Airtable API key for BMad agent (get from [Airtable tokens](https://airtable.com/create/tokens))
- `AIRTABLE_BASE_ID` - Airtable base ID (find in URL)

**Netlify Deployment:**
- `NETLIFY_AUTH_TOKEN` - Netlify authentication token for deployment and API access

**AI Content Generation (Future):**
- `ANTHROPIC_API_KEY` - Claude API key for automated generation (not needed for MVP BMad agent)

**Form Submission:**
- `NEXT_PUBLIC_MAKE_WEBHOOK_URL` - Make.com webhook URL (connects forms to Salesforce)

**reCAPTCHA (Spam Protection):**
- `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` - reCAPTCHA site key (client-side)
- `RECAPTCHA_SECRET_KEY` - reCAPTCHA secret key (server-side)

**Analytics & Tracking:**
- `NEXT_PUBLIC_GTM_ID` - Google Tag Manager ID
- `NEXT_PUBLIC_GA4_MEASUREMENT_ID` - Google Analytics 4 measurement ID
- `NEXT_PUBLIC_CALLRAIL_COMPANY_ID` - CallRail company ID (phone tracking)
- `NEXT_PUBLIC_CALLRAIL_SCRIPT_ID` - CallRail script ID

**Security Note:** Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser (safe for public keys only). All other variables are build-time only and never exposed to clients.

See [docs/architecture/environment-variables.md](docs/architecture/environment-variables.md) for detailed documentation.

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

### 1. **AI-Powered Content Generation (MVP)**
- FAQ sections, Benefits lists, SEO Meta, and Hero Copy generated by BMad Content Writer agent
- Manual trigger via Claude Code (`/BMad:agents:copywriter` + `*generate-full-page`)
- Marketing team reviews and approves before publishing
- Content stored in Airtable for easy management
- **Future:** Automated via Netlify Functions + Claude API

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

### For Content Updates (MVP Workflow)

1. Marketing updates Airtable
2. Marketing triggers request (status → "AI Processing")
3. Developer runs BMad Content Writer agent: `/BMad:agents:copywriter` → `*generate-full-page {record_id}`
4. Agent generates content and writes to Airtable
5. Marketing reviews and approves (status → "Approved")
6. Airtable webhook triggers GitHub Actions
7. GitHub Actions exports to `content.json` and commits
8. Netlify builds and deploys (6-12 mins)

**Future:** Step 3 will be automated via Netlify Functions (no manual trigger needed)

See [docs/workflows/ongoing/content-creation-workflow.md](docs/workflows/ongoing/content-creation-workflow.md) for complete workflow.

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
