# STEP 2: AI Service Architecture

## AI Service Hosting

**Recommended: Netlify Functions (Serverless)**

```yaml
Service Type: Serverless Function
Hosting: Netlify Functions (FREE - included with Netlify account)
Endpoint: https://yourdomain.netlify.app/.netlify/functions/generate-ai-content

Why Netlify Functions:
  - Zero cost (free tier covers this usage)
  - Zero maintenance (auto-scales, no servers to manage)
  - Deploy alongside Next.js site (same repo)
  - AI generation happens BEFORE build (webhook-triggered)

Trade-off:
  - Cold start adds 3-10s on first request
  - Total response time: 18-40s (vs 15-30s always-on)
  - Acceptable for Marketing approval workflow

Repository: Same repo as Next.js site (netlify/functions/)
```

## AI Service Setup

**Option 1: Separate Netlify Site for Functions (Recommended)**

```yaml
Why separate site:
  - AI function doesn't need to redeploy when content changes
  - Faster CI/CD (main site only rebuilds on content changes)
  - Cleaner separation of concerns

Setup:
  1. Create new Netlify site: "landing-pages-ai-service"
  2. Connect to same GitHub repo
  3. Configure build:
     - Base directory: (leave blank)
     - Build command: (leave blank)
     - Publish directory: netlify/functions
  4. Set environment variables in Netlify UI
```

**File Structure:**
```
landing-pages-automation-v2/
├── netlify/
│   └── functions/
│       ├── generate-ai-content.js      # Main function
│       └── shared/
│           ├── airtable-client.js      # Shared Airtable logic
│           ├── claude-client.js        # Shared Claude API logic
│           └── prompts.js              # AI prompt templates
├── src/                                # Next.js app
├── scripts/                            # Export scripts
└── netlify.toml                        # Netlify config
```

**Function Code:**
```javascript
// netlify/functions/generate-ai-content.js

import Anthropic from '@anthropic-ai/sdk'
import Airtable from 'airtable'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
})

const airtableBase = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY
}).base(process.env.AIRTABLE_BASE_ID)

// Netlify Function handler
export async function handler(event, context) {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    }
  }

  try {
    const { pageId } = JSON.parse(event.body)

    // Step 1: Fetch page data + guardrails
    const pageData = await fetchPageData(pageId)

    // Step 2: Generate all content in parallel
    const aiContent = await generateAllContent(pageData)

    // Step 3: Write back to Airtable
    await updateAirtablePage(pageId, aiContent)

    // Step 4: Update status
    await airtableBase('Pages').update(pageId, {
      'Status': 'Ready for Review'
    })

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        pageId,
        tokensUsed: aiContent.totalTokens
      })
    }

  } catch (error) {
    console.error('AI generation failed:', error)

    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    }
  }
}
```

**Airtable Automation Configuration:**
```yaml
Automation Name: "Trigger AI Generation"

Trigger:
  When: Record matches conditions
  Conditions:
    - Status = "AI Processing"
    - Table: Pages

Actions:
  1. Send Webhook
     Method: POST
     URL: https://landing-pages-ai-service.netlify.app/.netlify/functions/generate-ai-content
     Headers:
       Content-Type: application/json
     Body:
       {
         "pageId": "{Page ID}"
       }
```

---
