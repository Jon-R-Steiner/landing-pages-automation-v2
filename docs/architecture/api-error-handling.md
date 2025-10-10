# API Error Handling

## Airtable API Errors

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

## Claude API Errors

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
