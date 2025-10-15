# Error Handling

Comprehensive error handling strategy for the landing pages automation system.

---

## Core Principles

### 1. Fail Fast
**Catch errors early in the pipeline:**
- Build-time validation (TypeScript, ESLint)
- API errors (Airtable, Claude) should fail build
- Lighthouse quality gate prevents bad deploys

### 2. Graceful Degradation
**When appropriate, degrade gracefully:**
- Missing hero image → Use placeholder
- API timeout → Retry with exponential backoff
- Third-party script failure → Log error, continue page load

### 3. User-Friendly Messages
**Never expose technical errors to users:**
```typescript
// ❌ Bad
catch (error) {
  alert(error.message) // "TypeError: Cannot read property 'value' of undefined"
}

// ✅ Good
catch (error) {
  console.error('Form submission error:', error)
  setErrorMessage('We couldn\'t submit your request. Please try again or call us at (555) 123-4567.')
}
```

---

## Build-Time Error Handling

### Export Script Errors
**Validation before export:**
```typescript
// scripts/export-airtable-to-json.ts
async function exportPages() {
  try {
    console.log('Fetching pages from Airtable...')
    const pages = await fetchApprovedPages()

    // Validation
    if (pages.length === 0) {
      throw new Error('No approved pages found in Airtable')
    }

    // Check required fields
    const invalidPages = pages.filter(p =>
      !p.seoTitle || !p.h1Headline || !p.heroImage
    )

    if (invalidPages.length > 0) {
      throw new Error(
        `${invalidPages.length} pages missing required fields:\n` +
        invalidPages.map(p => `- ${p.pageId}: ${p.service}/${p.location}`).join('\n')
      )
    }

    // Write to file
    const json = JSON.stringify({ pages }, null, 2)
    await fs.promises.writeFile('content.json', json, 'utf-8')

    console.log(`✅ Exported ${pages.length} pages to content.json`)

  } catch (error) {
    console.error('❌ Export failed:', error.message)
    process.exit(1) // Fail the build
  }
}
```

### Lighthouse Quality Gate Errors
**Netlify plugin catches performance issues:**
```yaml
# netlify.toml
[[plugins]]
package = "@netlify/plugin-lighthouse"

  [plugins.inputs.thresholds]
    performance = 90
    accessibility = 90
    best-practices = 90
    seo = 90

  [plugins.inputs.audit_urls]
    "/" = ["mobile", "desktop"]
    "/bathroom-remodeling/charlotte" = ["mobile"]
```

**When Lighthouse fails:**
1. Build aborts (no deploy)
2. Netlify shows error in build log
3. Developer fixes performance issue
4. Re-run build

---

## Runtime Error Handling

### Form Submission Errors
**Client-side validation + server-side verification:**
```typescript
'use client'

import { useState } from 'react'

export default function ThreeStageForm() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const response = await fetch(process.env.NEXT_PUBLIC_MAKE_WEBHOOK_URL!, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      // Success
      router.push('/thank-you')

    } catch (error) {
      console.error('Form submission error:', error)
      setError(
        'We couldn\'t submit your request. Please try again or call us directly at ' +
        clientPhone
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Form fields */}

      <button
        type="submit"
        disabled={loading}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg disabled:opacity-50"
      >
        {loading ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  )
}
```

### Error Boundaries (React)
**Catch rendering errors:**
```typescript
// src/app/error.tsx (Next.js App Router error boundary)
'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  console.error('Page error:', error)

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
        <p className="text-gray-600 mb-6">
          We're sorry, but something unexpected happened. Please try refreshing the page.
        </p>
        <button
          onClick={reset}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    </div>
  )
}
```

---

## API Error Handling

### Airtable API Errors
**Common errors and handling:**
```typescript
// src/lib/airtable.ts
import Airtable from 'airtable'

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY })
  .base(process.env.AIRTABLE_BASE_ID!)

export async function fetchApprovedPages(): Promise<PageData[]> {
  try {
    const records = await base('Pages')
      .select({ view: 'Approved' })
      .all()

    return records.map(transformRecord)

  } catch (error) {
    // Type guard for Airtable errors
    if (error instanceof Error) {
      // Rate limit (429)
      if ('statusCode' in error && error.statusCode === 429) {
        console.warn('Airtable rate limit hit, retrying in 1s...')
        await sleep(1000)
        return fetchApprovedPages() // Retry once
      }

      // Invalid API key (401)
      if ('statusCode' in error && error.statusCode === 401) {
        throw new Error('Airtable API key is invalid. Check AIRTABLE_API_KEY in .env.local')
      }

      // Network errors
      if (error.message.includes('ENOTFOUND') || error.message.includes('ETIMEDOUT')) {
        throw new Error('Cannot connect to Airtable. Check your internet connection.')
      }
    }

    // Unknown error
    console.error('Airtable API error:', error)
    throw new Error('Failed to fetch pages from Airtable')
  }
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
```

### Claude API Errors
**Retry logic with exponential backoff:**
```typescript
// src/lib/claude.ts
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function generateContent(
  prompt: string,
  maxRetries = 3
): Promise<string> {
  let lastError: Error | null = null

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const message = await client.messages.create({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 2048,
        messages: [{ role: 'user', content: prompt }]
      })

      return message.content[0].text

    } catch (error) {
      lastError = error as Error

      // Rate limit (429) - wait and retry
      if ('status' in error && error.status === 429) {
        const waitTime = Math.pow(2, attempt) * 1000 // Exponential backoff
        console.warn(`Claude API rate limit (attempt ${attempt}/${maxRetries}), waiting ${waitTime}ms...`)
        await sleep(waitTime)
        continue
      }

      // Invalid API key (401) - don't retry
      if ('status' in error && error.status === 401) {
        throw new Error('Claude API key is invalid. Check ANTHROPIC_API_KEY in .env.local')
      }

      // Server error (500-599) - retry
      if ('status' in error && error.status >= 500) {
        console.warn(`Claude API server error (attempt ${attempt}/${maxRetries})`)
        await sleep(2000)
        continue
      }

      // Other errors - fail immediately
      throw error
    }
  }

  throw new Error(`Claude API failed after ${maxRetries} retries: ${lastError?.message}`)
}
```

---

## Error Recovery Strategies

### 1. Retry with Exponential Backoff
**For transient failures (rate limits, network issues):**
```typescript
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  initialDelay = 1000
): Promise<T> {
  let lastError: Error | null = null

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error as Error

      if (attempt < maxRetries) {
        const delay = initialDelay * Math.pow(2, attempt - 1)
        console.warn(`Retry attempt ${attempt}/${maxRetries} after ${delay}ms`)
        await sleep(delay)
      }
    }
  }

  throw lastError
}

// Usage
const pages = await retryWithBackoff(() => fetchApprovedPages())
```

### 2. Circuit Breaker (Future Enhancement)
**For protecting against cascading failures:**
```typescript
// Not implemented in current version, but pattern for future consideration
class CircuitBreaker {
  private failures = 0
  private readonly threshold = 5
  private state: 'closed' | 'open' | 'half-open' = 'closed'

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'open') {
      throw new Error('Circuit breaker is open')
    }

    try {
      const result = await fn()
      this.onSuccess()
      return result
    } catch (error) {
      this.onFailure()
      throw error
    }
  }

  private onSuccess() {
    this.failures = 0
    this.state = 'closed'
  }

  private onFailure() {
    this.failures++
    if (this.failures >= this.threshold) {
      this.state = 'open'
      setTimeout(() => this.state = 'half-open', 60000) // 1 min timeout
    }
  }
}
```

---

## Error Monitoring

### Console Logging
**Structured logging for debugging:**
```typescript
// Development
console.error('API Error:', { endpoint, status, message: error.message })

// Production (future)
// Send to monitoring service (Sentry, LogRocket, etc.)
```

### Future Enhancements
- Error tracking service integration (Sentry)
- Performance monitoring (Vercel Analytics, New Relic)
- Real-time alerting for critical errors
- Error rate dashboards

---

## Related Documentation
- `monitoring.md` - Logging and monitoring strategy
- `performance.md` - Performance optimization
- `security.md` - Security considerations
