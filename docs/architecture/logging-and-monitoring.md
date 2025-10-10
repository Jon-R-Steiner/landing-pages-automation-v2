# Logging and Monitoring

## Console Logging Standards

**Development vs Production:**
```typescript
// Development: Verbose logging
if (process.env.NODE_ENV === 'development') {
  console.log('Fetching page data:', { service, location })
}

// Production: Error logging only
console.error('Critical error:', error)
console.warn('Non-critical warning:', warning)

// ❌ Never in production
console.log('Debug info:', data) // Remove before committing
```

## Error Tracking (Future)

**When ready to add error tracking:**
```typescript
// Example: Sentry integration (not implemented in MVP)
import * as Sentry from '@sentry/nextjs'

try {
  await fetchApprovedPages()
} catch (error) {
  Sentry.captureException(error, {
    tags: { function: 'fetchApprovedPages' },
    extra: { baseId: process.env.AIRTABLE_BASE_ID }
  })
  throw error
}
```
