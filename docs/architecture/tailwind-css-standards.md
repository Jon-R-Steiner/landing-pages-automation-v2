# Tailwind CSS Standards

## 1. Class Organization

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

## 2. Use `clsx` for Conditional Classes

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

## 3. Extract Repeated Patterns to Components

```tsx
// ❌ Bad (repeated classes everywhere)
<button className="px-4 py-2 bg-blue-600 text-white rounded-lg">Submit</button>
<button className="px-4 py-2 bg-blue-600 text-white rounded-lg">Save</button>

// ✅ Good (component with variants)
<Button variant="primary">Submit</Button>
<Button variant="primary">Save</Button>
```
