# Error Recovery Strategies

## 1. Retry with Exponential Backoff

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

## 2. Circuit Breaker (Advanced)

**For protecting against cascading failures:**
```typescript
// Not implemented in MVP, but pattern for future
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
