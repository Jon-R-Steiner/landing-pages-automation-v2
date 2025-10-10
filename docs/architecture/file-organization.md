# File Organization

## Project Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── [service]/[location]/    # Dynamic routes
│   ├── layout.tsx               # Root layout
│   └── globals.css              # Global styles
├── components/                   # React components
│   ├── TrustBar/
│   │   ├── TrustBar.tsx
│   │   ├── TrustBar.test.tsx
│   │   └── index.ts
│   ├── ThreeStageForm/
│   └── Gallery/
├── lib/                          # Utilities and helpers
│   ├── airtable.ts              # Airtable SDK wrapper
│   ├── claude.ts                # Claude API wrapper
│   └── utils.ts                 # Generic utilities
├── types/                        # TypeScript type definitions
│   ├── airtable.types.ts
│   ├── page.types.ts
│   └── index.ts
└── styles/                       # Additional styles (if needed)
```

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
