# Runtime Error Handling

## Form Submission Errors

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

## Error Boundaries (React)

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
