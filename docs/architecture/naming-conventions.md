# Naming Conventions

## Variables and Functions

```typescript
// ✅ camelCase for variables and functions
const pageData = await getPageData()
const userEmail = form.email

function calculateTotal(items: Item[]) {
  return items.reduce((sum, item) => sum + item.price, 0)
}
```

## Constants

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

## Components

```typescript
// ✅ PascalCase for components
function TrustBar() { ... }
function ThreeStageForm() { ... }
function Hero() { ... }
```

## Types and Interfaces

```typescript
// ✅ PascalCase for types and interfaces
interface PageData { ... }
type Status = 'draft' | 'approved'
interface FormValues { ... }
```
