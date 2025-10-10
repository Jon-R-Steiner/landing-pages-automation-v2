# Local Development Setup

## 1. Prerequisites

**Required Software:**
```bash
Node.js: v20.x or later (LTS recommended)
npm: v10.x or later (comes with Node.js)
Git: v2.x or later
```

**Recommended Tools:**
- VS Code with extensions:
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense
  - TypeScript and JavaScript Language Features

## 2. Initial Setup

**Clone and Install:**
```bash
# Clone repository
git clone https://github.com/your-org/landing-pages-automation-v2.git
cd landing-pages-automation-v2

# Install dependencies
npm install

# Copy environment template
cp .env.local.example .env.local

# Edit .env.local with your API keys
# (See Environment Variables section for required keys)
```

**Environment Variables:**
```bash
# .env.local (required for local development)
AIRTABLE_API_KEY=patXXXXXXXXXXXXXX
AIRTABLE_BASE_ID=appXXXXXXXXXXXXXX
ANTHROPIC_API_KEY=sk-ant-XXXXXXXXXXXXXXXX
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6LcXXXXXXXXXXXXX
NEXT_PUBLIC_MAKE_WEBHOOK_URL=https://hook.us1.make.com/XXXXXXXX
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
```

## 3. Run Development Server

```bash
# Start Next.js development server
npm run dev

# Server runs at http://localhost:3000
# Hot reload enabled (changes reflect immediately)
```

## 4. Build and Test

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Run tests (when implemented)
npm test

# Build production bundle
npm run build

# Preview production build locally
npm run start
```
