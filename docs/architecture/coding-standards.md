# Coding Standards

> **Purpose**: This document consolidates all coding standards for the dev agent to reference on every story. It combines TypeScript, React, styling, and code quality standards from the sharded architecture documents.

---

## TypeScript Standards

### 1. Strict Mode Enabled

**tsconfig.json:**
```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

**What this means:**
- ❌ No `any` types (use `unknown` if type is truly unknown)
- ❌ No implicit `undefined` returns
- ✅ All variables must have explicit or inferable types
- ✅ Null and undefined checks required

### 2. Type Definitions

**Prefer Interfaces for Objects:**
```typescript
// ✅ Good
interface PageData {
  pageId: string
  service: string
  location: string
  seo: {
    title: string
    description: string
  }
}

// ❌ Avoid (unless you need union types or primitives)
type PageData = {
  pageId: string
  service: string
}
```

**Use Type for Unions and Utilities:**
```typescript
// ✅ Good
type Status = 'draft' | 'processing' | 'approved' | 'published'
type ReadonlyPageData = Readonly<PageData>
```

### 3. No `any` Type

**❌ Never use `any`:**
```typescript
// ❌ BAD
function processData(data: any) {
  return data.value
}
```

**✅ Use `unknown` and type guards:**
```typescript
// ✅ GOOD
function processData(data: unknown) {
  if (typeof data === 'object' && data !== null && 'value' in data) {
    return (data as { value: string }).value
  }
  throw new Error('Invalid data format')
}
```

**✅ Or create proper types:**
```typescript
// ✅ BEST
interface DataWithValue {
  value: string
}

function processData(data: DataWithValue) {
  return data.value
}
```

### 4. Const Assertions

**Use `as const` for literal types:**
```typescript
// ✅ Good
const STATUSES = ['draft', 'approved', 'published'] as const
type Status = typeof STATUSES[number] // 'draft' | 'approved' | 'published'

// ❌ Avoid
const STATUSES = ['draft', 'approved', 'published'] // string[]
```

---

## React Standards

### 1. Server Components by Default

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

### 2. Component File Structure

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

### 3. Props Interface

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

### 4. Hooks Rules

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

---

## Code Style

### 1. Use Early Returns

```typescript
// ✅ Good (early return)
function validateEmail(email: string): string | null {
  if (!email) {
    return 'Email is required'
  }

  if (!email.includes('@')) {
    return 'Invalid email format'
  }

  return null // Valid
}

// ❌ Avoid (nested ifs)
function validateEmail(email: string): string | null {
  if (email) {
    if (email.includes('@')) {
      return null
    } else {
      return 'Invalid email format'
    }
  } else {
    return 'Email is required'
  }
}
```

### 2. Destructure Props

```typescript
// ✅ Good
function TrustBar({ signals, className }: TrustBarProps) {
  return <div className={className}>...</div>
}

// ❌ Avoid
function TrustBar(props: TrustBarProps) {
  return <div className={props.className}>...</div>
}
```

### 3. Use Template Literals

```typescript
// ✅ Good
const greeting = `Hello, ${name}!`
const url = `https://bathsrus.com/${service}/${location}`

// ❌ Avoid
const greeting = 'Hello, ' + name + '!'
```

### 4. Prefer `const` Over `let`

```typescript
// ✅ Good
const pages = await getApprovedPages()
const totalPages = pages.length

// ❌ Avoid (unless value actually changes)
let pages = await getApprovedPages()
let totalPages = pages.length
```

---

## Naming Conventions

### Variables and Functions

```typescript
// ✅ camelCase for variables and functions
const pageData = await getPageData()
const userEmail = form.email

function calculateTotal(items: Item[]) {
  return items.reduce((sum, item) => sum + item.price, 0)
}
```

### Constants

```typescript
// ✅ UPPER_SNAKE_CASE for true constants
const API_BASE_URL = 'https://api.airtable.com/v0'
const MAX_RETRIES = 3
const DEFAULT_TIMEOUT = 5000

// ✅ PascalCase for config objects
const ApiConfig = {
  baseUrl: 'https://api.airtable.com/v0',
  timeout: 5000,
} as const
```

### Components

```typescript
// ✅ PascalCase for components
function TrustBar() { ... }
function ThreeStageForm() { ... }
function Hero() { ... }
```

### Types and Interfaces

```typescript
// ✅ PascalCase for types and interfaces
interface PageData { ... }
type Status = 'draft' | 'approved'
interface FormValues { ... }
```

---

## Tailwind CSS Standards

### 1. Class Organization

**Order classes by category:**
```tsx
// ✅ Good (organized by layout, spacing, typography, colors, effects)
<div className="
  flex flex-col items-center
  p-6 mx-auto max-w-7xl
  text-lg font-semibold text-gray-900
  bg-white rounded-lg shadow-lg
  hover:shadow-xl transition-shadow
">
```

### 2. Use `clsx` for Conditional Classes

```tsx
import clsx from 'clsx'

// ✅ Good
<button
  className={clsx(
    'px-4 py-2 rounded-lg font-semibold',
    variant === 'primary' && 'bg-blue-600 text-white',
    variant === 'secondary' && 'bg-gray-200 text-gray-900',
    disabled && 'opacity-50 cursor-not-allowed'
  )}
>
```

### 3. Extract Repeated Patterns to Components

```tsx
// ❌ Bad (repeated classes everywhere)
<button className="px-4 py-2 bg-blue-600 text-white rounded-lg">Submit</button>
<button className="px-4 py-2 bg-blue-600 text-white rounded-lg">Save</button>

// ✅ Good (component with variants)
<Button variant="primary">Submit</Button>
<Button variant="primary">Save</Button>
```

---

## Import Order

**Organized imports:**
```typescript
// 1. React and Next.js imports
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

// 2. Third-party libraries
import { Dialog } from '@headlessui/react'
import clsx from 'clsx'

// 3. Internal imports (absolute paths with @/ alias)
import { TrustBar } from '@/components/TrustBar'
import { getPageData } from '@/lib/airtable'
import type { PageData } from '@/types/page.types'

// 4. Relative imports
import { helper } from './utils'

// 5. CSS imports (last)
import styles from './Component.module.css'
```

---

## Related Documents

For additional context, see:
- [TypeScript Standards](./typescript-standards.md) - Full TypeScript configuration
- [React Standards](./react-standards.md) - Complete React patterns
- [Code Style](./code-style.md) - Detailed style guidelines
- [Naming Conventions](./naming-conventions.md) - Comprehensive naming rules
- [Tailwind CSS Standards](./tailwind-css-standards.md) - Full Tailwind patterns
