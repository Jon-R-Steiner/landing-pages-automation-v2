# Comments and Documentation

## 1. JSDoc for Public APIs

```typescript
/**
 * Fetches approved pages from Airtable
 *
 * @param {string} view - Airtable view name (default: 'Approved')
 * @returns {Promise<PageData[]>} Array of page data objects
 * @throws {Error} If Airtable API call fails
 *
 * @example
 * const pages = await getApprovedPages('Approved')
 */
export async function getApprovedPages(view = 'Approved'): Promise<PageData[]> {
  // ...
}
```

## 2. Inline Comments for Complex Logic

```typescript
// ✅ Good (explains WHY, not WHAT)
// Delay between batches to respect Claude API rate limit (50 req/min)
await sleep(1200)

// ❌ Bad (obvious, doesn't add value)
// Increment counter
counter++
```

## 3. TODO Comments

```typescript
// TODO(username): Add error retry logic for 429 rate limit errors
// TODO: Optimize image loading with next/image priority prop
// FIXME: Form validation breaks on empty phone number
```

---
