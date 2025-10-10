# React Standards

## 1. Server Components by Default

**❌ Don't add 'use client' unless needed:**
```typescript
// ✅ Good (Server Component by default)
export default function TrustBar({ signals }: { signals: string[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {signals.map((signal, i) => (
        <div key={i}>{signal}</div>
      ))}
    </div>
  )
}
```

**✅ Only use 'use client' for interactivity:**
```typescript
// ✅ Good (Client Component when needed)
'use client'

import { useState } from 'react'

export default function ThreeStageForm() {
  const [stage, setStage] = useState(1)

  return <form>...</form>
}
```

## 2. Component File Structure

**One component per file:**
```typescript
// ✅ Good
// src/components/TrustBar/TrustBar.tsx
export default function TrustBar() { ... }

// src/components/TrustBar/index.ts
export { default } from './TrustBar'
```

**File naming:**
- Component files: `PascalCase.tsx` (e.g., `TrustBar.tsx`)
- Utility files: `camelCase.ts` (e.g., `formatDate.ts`)
- Type files: `camelCase.types.ts` (e.g., `airtable.types.ts`)

## 3. Props Interface

**Define props interface explicitly:**
```typescript
// ✅ Good
interface TrustBarProps {
  signals: string[]
  className?: string
  variant?: 'default' | 'compact'
}

export default function TrustBar({ signals, className, variant = 'default' }: TrustBarProps) {
  return <div className={className}>...</div>
}
```

**Use React.FC sparingly (prefer explicit typing):**
```typescript
// ❌ Avoid
const TrustBar: React.FC<TrustBarProps> = ({ signals }) => { ... }

// ✅ Prefer
export default function TrustBar({ signals }: TrustBarProps) { ... }
```

## 4. Hooks Rules

**Only call hooks at top level:**
```typescript
// ✅ Good
export default function Form() {
  const [value, setValue] = useState('')
  const [error, setError] = useState<string | null>(null)

  // ...
}

// ❌ Bad
export default function Form() {
  if (someCondition) {
    const [value, setValue] = useState('') // ❌ Conditional hook
  }
}
```

**Custom hooks must start with `use`:**
```typescript
// ✅ Good
function useFormValidation(value: string) {
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (value.length < 3) {
      setError('Too short')
    } else {
      setError(null)
    }
  }, [value])

  return error
}
```
