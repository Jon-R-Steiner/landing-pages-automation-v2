# TypeScript Standards

## 1. Strict Mode Enabled

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

## 2. Type Definitions

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

## 3. No `any` Type

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

## 4. Const Assertions

**Use `as const` for literal types:**
```typescript
// ✅ Good
const STATUSES = ['draft', 'approved', 'published'] as const
type Status = typeof STATUSES[number] // 'draft' | 'approved' | 'published'

// ❌ Avoid
const STATUSES = ['draft', 'approved', 'published'] // string[]
```
