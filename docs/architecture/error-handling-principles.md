# Error Handling Principles

## 1. Fail Fast

**Catch errors early in the pipeline:**
- Build-time validation (TypeScript, ESLint)
- API errors (Airtable, Claude) should fail build
- Lighthouse quality gate prevents bad deploys

## 2. Graceful Degradation

**When appropriate, degrade gracefully:**
- Missing hero image → Use placeholder
- API timeout → Retry with exponential backoff
- Third-party script failure → Log error, continue page load

## 3. User-Friendly Messages

**Never expose technical errors to users:**
```typescript
// ❌ Bad
catch (error) {
  alert(error.message) // "TypeError: Cannot read property 'value' of undefined"
}

// ✅ Good
catch (error) {
  console.error('Form submission error:', error)
  setErrorMessage('We couldn't submit your request. Please try again or call us at (555) 123-4567.')
}
```
