# Error Handling & Monitoring

## AI Service Error Handling

```javascript
// Retry logic for Claude API

async function callClaudeAPIWithRetry(prompt, maxTokens, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await callClaudeAPI(prompt, maxTokens)
    } catch (error) {
      if (error.status === 429) {
        // Rate limit - wait and retry
        const waitTime = Math.pow(2, attempt) * 1000
        console.warn(`⚠️  Rate limit hit, retrying in ${waitTime}ms...`)
        await new Promise(resolve => setTimeout(resolve, waitTime))
      } else if (error.status >= 500 && attempt < retries) {
        // Server error - retry
        console.warn(`⚠️  Server error, retrying (${attempt}/${retries})...`)
        await new Promise(resolve => setTimeout(resolve, 2000))
      } else {
        // Unrecoverable error or max retries
        throw error
      }
    }
  }
}
```

## Airtable Status on Failure

```javascript
// Update Airtable if AI generation fails

try {
  const aiContent = await generateAllContent(pageData)
  await updateAirtablePage(pageId, aiContent)
  await airtableBase('Pages').update(pageId, { Status: 'Ready for Review' })

} catch (error) {
  console.error('AI generation failed:', error)

  // Update Airtable with error status
  await airtableBase('Pages').update(pageId, {
    Status: 'AI Failed',
    'Special Instructions': `ERROR: ${error.message}\n\n${pageData.specialInstructions || ''}`
  })

  throw error
}
```

## Monitoring Dashboard

```yaml
Recommended: Sentry or LogTail

Metrics to track:
  - AI generation success rate
  - Average generation time
  - Token usage per page
  - Export success rate
  - Build success rate
  - Average time to live

Alerts:
  - AI generation failure (Slack notification)
  - Export failure (Email notification)
  - Build failure (Slack notification)
  - High token usage (Budget warning)
```

---
