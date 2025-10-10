# Code Style

## 1. Use Early Returns

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

## 2. Destructure Props

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

## 3. Use Template Literals

```typescript
// ✅ Good
const greeting = `Hello, ${name}!`
const url = `https://bathsrus.com/${service}/${location}`

// ❌ Avoid
const greeting = 'Hello, ' + name + '!'
```

## 4. Prefer `const` Over `let`

```typescript
// ✅ Good
const pages = await getApprovedPages()
const totalPages = pages.length

// ❌ Avoid (unless value actually changes)
let pages = await getApprovedPages()
let totalPages = pages.length
```
