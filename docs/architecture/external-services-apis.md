# External Services & APIs

## Airtable SDK

**Version:** `^0.12.2` (**Updated from ^0.12.0** - latest available, but stale)

**Purpose:** Fetch content from Airtable during pre-build phase

**Usage:** Build-time ONLY (NOT runtime)

**⚠️ Note:** Package last updated 2 years ago (2023). Consider MCP server alternative (see below).

**Configuration:**
```javascript
// src/lib/airtable.ts
import Airtable from 'airtable'

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY })
  .base(process.env.AIRTABLE_BASE_ID)

export async function fetchAllPages() {
  const records = await base('Pages')
    .select({ view: 'Approved' })
    .all()

  return records.map(record => ({
    service: record.get('Service'),
    location: record.get('Location'),
    // ... other fields
  }))
}

// Called in scripts/export-airtable-to-json.js (pre-build)
```

**Rate Limits:**
- 5 requests/second per base
- Mitigation: Export to JSON, commit to Git

---

## Airtable REST API (Direct Integration)

**API Version:** v0 (stable)

**Purpose:** Direct API integration for build-time data export and record management

**Why REST API:**
- ✅ Reliable and well-documented
- ✅ Works with any programming language
- ✅ No additional dependencies or MCP servers required
- ✅ Production-ready with official support
- ✅ Fine-grained control over data operations

**Authentication:** Personal Access Token (PAT) or API Key

**Base Configuration:**
```bash
# Environment Variables (.env.local)
AIRTABLE_API_KEY=patR2szOO0tU7ZsP2.your_token_here
AIRTABLE_BASE_ID=appATvatPtaoJ8MmS
```

**Key Endpoints:**

1. **List Records:**
   ```
   GET https://api.airtable.com/v0/{baseId}/{tableName}
   ```

2. **Get Record:**
   ```
   GET https://api.airtable.com/v0/{baseId}/{tableName}/{recordId}
   ```

3. **Create Records:**
   ```
   POST https://api.airtable.com/v0/{baseId}/{tableName}
   ```

4. **Update Records:**
   ```
   PATCH https://api.airtable.com/v0/{baseId}/{tableName}
   ```

**Usage Example (Node.js with Airtable SDK):**
```javascript
// Using the official Airtable.js SDK (recommended)
import Airtable from 'airtable'

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY })
  .base(process.env.AIRTABLE_BASE_ID)

// Fetch approved pages
const records = await base('Pages')
  .select({
    view: 'Approved',
    filterByFormula: 'AND({Status} = "Approved", {Published} = TRUE())',
    fields: ['Service ID', 'Location ID', 'SEO Title', 'H1 Headline']
  })
  .all()
```

**Usage Example (Direct REST API with fetch):**
```javascript
// Direct API call without SDK
const response = await fetch(
  `https://api.airtable.com/v0/${baseId}/Pages`,
  {
    headers: {
      'Authorization': `Bearer ${process.env.AIRTABLE_API_KEY}`,
      'Content-Type': 'application/json'
    }
  }
)
const data = await response.json()
```

**Rate Limits:**
- 5 requests/second per base
- Mitigation: Batch operations, export to JSON for build-time use

**Required Scopes (for Personal Access Tokens):**
- `data.records:read` - Read records (required)
- `data.records:write` - Create/update records (required for automation)
- `schema.bases:read` - Read schema (optional, for validation)

**Use Cases:**
- Pre-build: Export approved pages to JSON
- Development: Create test records, validate data
- Automation: Update page status, trigger workflows
- Integration: Connect with GitHub Actions, Netlify build hooks

**Decision:** Use REST API with official Airtable SDK for all operations. No MCP server required.

---

## Anthropic Claude API

**Version:** SDK `^0.65.0` (**CRITICAL UPDATE from ^0.20.0** - Claude 4 support)

**API Model:** `claude-sonnet-4-5-20250929` (**Latest Claude Sonnet 4.5**)

**Purpose:** Generate AI content (Trust Bar, Gallery, FAQ) during pre-build

**Usage:** Build-time ONLY (NOT runtime)

**What's New in SDK 0.65:**
- ✅ Claude 4 model family support (Sonnet 4.5, Opus 4.0, Opus 4.1)
- ✅ Improved streaming performance
- ✅ Enhanced tool integration with Zod schema support
- ✅ Better error handling and retry logic
- ✅ TypeScript improvements

**Why Claude Sonnet 4.5:**
- Faster than previous models (better for batch generation)
- Improved instruction following
- Better structured output generation
- Cost-effective for high-volume content generation

**Configuration:**
```javascript
// src/lib/claude.ts
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function generateTrustBar(service: string, location: string) {
  const message = await client.messages.create({
    model: 'claude-sonnet-4-5-20250929', // Updated model
    max_tokens: 1024,
    messages: [{
      role: 'user',
      content: `Generate 5 trust signals for ${service} in ${location}...`
    }]
  })

  return message.content[0].text
}

// Called in scripts/generate-ai-content.js (pre-build)
```

**Cost Estimation (Claude Sonnet 4.5):**
- 500 pages × 3 sections = 1500 API calls
- ~2K tokens per call @ $0.003/1K input + $0.015/1K output
- Estimated: $0.75-1.50 per build (depends on output length)

**Migration Status:** ✅ **CRITICAL** - SDK 0.20 lacks Claude 4 model support

---

## Make.com Webhook

**Version:** N/A (REST API)

**Purpose:** Form submission → Salesforce lead creation

**Usage:** Runtime (client-side POST from form)

**Configuration:**
```javascript
// src/lib/makeWebhook.ts
export async function submitFormToMake(payload: FormData) {
  const response = await fetch(process.env.NEXT_PUBLIC_MAKE_WEBHOOK_URL!, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error('Form submission failed')
  }

  return response.json()
}
```

**Payload:** See `docs/integrations/salesforce-integration-strategy.md` for full parameter list

---
