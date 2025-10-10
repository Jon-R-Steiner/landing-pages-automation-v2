# ADR-027 Implementation Guide: React Hook Form + Zod

**Related ADR:** forms-library-selection.md
**Status:** Ready for Implementation
**Last Updated:** 2025-10-10

---

## Table of Contents

1. [Installation](#installation)
2. [Project Setup](#project-setup)
3. [Zod Schema Definition](#zod-schema-definition)
4. [Form Component Implementation](#form-component-implementation)
5. [localStorage Persistence](#localstorage-persistence)
6. [GTM DataLayer Integration](#gtm-datalayer-integration)
7. [Accessibility Implementation](#accessibility-implementation)
8. [Styling with Tailwind CSS](#styling-with-tailwind-css)
9. [Testing](#testing)
10. [Troubleshooting](#troubleshooting)

---

## Installation

### Step 1: Install Dependencies

```bash
npm install react-hook-form zod @hookform/resolvers
```

**Versions:**
- `react-hook-form` ^7.48.0
- `zod` ^3.22.0
- `@hookform/resolvers` ^3.3.0

**Total Bundle Impact:** ~21KB gzipped

### Step 2: Verify Installation

```bash
npm list react-hook-form zod @hookform/resolvers
```

Expected output:
```
landing-pages-automation-v2@1.0.0
├── react-hook-form@7.48.0
├── zod@3.22.0
└── @hookform/resolvers@3.3.0
```

---

## Project Setup

### Directory Structure

```
src/
├── components/
│   └── ThreeStageForm/
│       ├── index.tsx                # Main form component
│       ├── schemas.ts               # Zod validation schemas
│       ├── types.ts                 # TypeScript types
│       ├── useFormPersistence.ts    # localStorage hook
│       └── ThreeStageForm.test.tsx  # Tests
├── lib/
│   └── analytics.ts                 # GTM dataLayer utilities
└── types/
    └── form.ts                      # Shared form types
```

---

## Zod Schema Definition

### File: `src/components/ThreeStageForm/schemas.ts`

```typescript
import { z } from 'zod'

/**
 * Stage 1: Primary Conversion (Name + Phone)
 *
 * Critical fields for initial lead capture
 */
export const stage1Schema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes'),

  phone: z
    .string()
    .regex(
      /^\(\d{3}\) \d{3}-\d{4}$/,
      'Phone must be in format (555) 123-4567'
    )
    .refine(
      (val) => {
        // Optional: Validate area code is not all zeros
        const areaCode = val.slice(1, 4)
        return areaCode !== '000'
      },
      { message: 'Invalid area code' }
    ),
})

/**
 * Stage 2: Qualification (Service + Location)
 *
 * Gather project details for lead scoring
 */
export const stage2Schema = z.object({
  service: z.enum(
    [
      'bathroom-remodel',
      'walk-in-shower',
      'tub-to-shower',
      'shower-remodel',
      'accessibility-modifications',
      'other',
    ],
    {
      errorMap: () => ({ message: 'Please select a service type' }),
    }
  ),

  location: z
    .string()
    .min(2, 'Location is required')
    .max(100, 'Location must be less than 100 characters'),
})

/**
 * Stage 3: Details (Project Details + Contact Time)
 *
 * Final information for sales team follow-up
 */
export const stage3Schema = z.object({
  details: z
    .string()
    .min(10, 'Please provide at least 10 characters')
    .max(1000, 'Details must be less than 1000 characters'),

  contactTime: z.enum(['morning', 'afternoon', 'evening', 'anytime'], {
    errorMap: () => ({ message: 'Please select a preferred contact time' }),
  }),
})

/**
 * Combined schema for full form validation
 *
 * Used for final submission and type inference
 */
export const fullFormSchema = stage1Schema
  .merge(stage2Schema)
  .merge(stage3Schema)

/**
 * TypeScript type inferred from full schema
 *
 * Use this type throughout the application for type safety
 */
export type FormData = z.infer<typeof fullFormSchema>

/**
 * Individual stage types for partial validation
 */
export type Stage1Data = z.infer<typeof stage1Schema>
export type Stage2Data = z.infer<typeof stage2Schema>
export type Stage3Data = z.infer<typeof stage3Schema>
```

---

## Form Component Implementation

### File: `src/components/ThreeStageForm/index.tsx`

```typescript
'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { fullFormSchema, type FormData } from './schemas'
import { useFormPersistence } from './useFormPersistence'
import { trackFormEvent } from '@/lib/analytics'

export function ThreeStageForm() {
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    getValues,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(fullFormSchema),
    mode: 'onBlur',
    defaultValues: {
      name: '',
      phone: '',
      service: undefined,
      location: '',
      details: '',
      contactTime: undefined,
    },
  })

  // Load saved form state from localStorage on mount
  const { loadFormState, saveFormState, clearFormState } = useFormPersistence()

  useEffect(() => {
    const savedState = loadFormState()
    if (savedState) {
      // Restore form data
      Object.entries(savedState.data).forEach(([key, value]) => {
        setValue(key as keyof FormData, value)
      })
      // Restore step
      setStep(savedState.step)
    }
  }, [loadFormState, setValue])

  /**
   * Validate current stage and advance to next step
   */
  const nextStep = async () => {
    const fieldsToValidate =
      step === 1
        ? (['name', 'phone'] as const)
        : (['service', 'location'] as const)

    const isValid = await trigger(fieldsToValidate)

    if (isValid) {
      const nextStepNum = step + 1
      setStep(nextStepNum)

      // Track progression in GTM
      trackFormEvent({
        event: step === 1 ? 'form_start' : `form_stage_${nextStepNum}`,
        form_name: 'contact',
        form_step: nextStepNum,
      })

      // Save to localStorage
      saveFormState({
        step: nextStepNum,
        data: getValues(),
      })
    }
  }

  /**
   * Go back to previous step
   */
  const previousStep = () => {
    setStep(step - 1)
  }

  /**
   * Submit form to Make.com webhook
   */
  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_MAKE_WEBHOOK_URL!,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...data,
            // Add metadata
            submitted_at: new Date().toISOString(),
            source: 'landing_page',
            page_url: window.location.href,
          }),
        }
      )

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      // Success
      trackFormEvent({
        event: 'form_submit',
        form_name: 'contact',
        lead_value: 'estimated',
      })

      // Clear localStorage
      clearFormState()

      // Redirect to thank you page or show success message
      window.location.href = '/thank-you'
    } catch (error) {
      console.error('Form submission error:', error)

      setSubmitError(
        'There was an error submitting your form. Please try again or call us directly.'
      )

      trackFormEvent({
        event: 'form_error',
        form_name: 'contact',
        error_message: error instanceof Error ? error.message : 'Unknown error',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div className="text-sm font-medium text-gray-700">
            Step {step} of 3
          </div>
          <div className="text-sm text-gray-500">
            {step === 1 && 'Contact Info'}
            {step === 2 && 'Project Details'}
            {step === 3 && 'Final Details'}
          </div>
        </div>
        <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300 ease-in-out"
            style={{ width: `${(step / 3) * 100}%` }}
            role="progressbar"
            aria-valuenow={step}
            aria-valuemin={1}
            aria-valuemax={3}
            aria-label={`Form progress: step ${step} of 3`}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Stage 1: Name + Phone */}
        {step === 1 && (
          <div className="space-y-4" role="group" aria-labelledby="stage1-title">
            <h2 id="stage1-title" className="text-2xl font-bold text-gray-900">
              Get Your Free Quote
            </h2>

            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                type="text"
                autoComplete="name"
                {...register('name')}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                aria-invalid={errors.name ? 'true' : 'false'}
                aria-describedby={errors.name ? 'name-error' : undefined}
              />
              {errors.name && (
                <p
                  id="name-error"
                  className="mt-1 text-sm text-red-600"
                  role="alert"
                >
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                id="phone"
                type="tel"
                autoComplete="tel"
                placeholder="(555) 123-4567"
                {...register('phone')}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary ${
                  errors.phone ? 'border-red-500' : 'border-gray-300'
                }`}
                aria-invalid={errors.phone ? 'true' : 'false'}
                aria-describedby={errors.phone ? 'phone-error' : undefined}
              />
              {errors.phone && (
                <p
                  id="phone-error"
                  className="mt-1 text-sm text-red-600"
                  role="alert"
                >
                  {errors.phone.message}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={nextStep}
              className="w-full py-3 px-6 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Continue to Step 2 →
            </button>
          </div>
        )}

        {/* Stage 2: Service + Location */}
        {step === 2 && (
          <div className="space-y-4" role="group" aria-labelledby="stage2-title">
            <h2 id="stage2-title" className="text-2xl font-bold text-gray-900">
              Tell Us About Your Project
            </h2>

            <div>
              <label
                htmlFor="service"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Service Type <span className="text-red-500">*</span>
              </label>
              <select
                id="service"
                {...register('service')}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary ${
                  errors.service ? 'border-red-500' : 'border-gray-300'
                }`}
                aria-invalid={errors.service ? 'true' : 'false'}
                aria-describedby={errors.service ? 'service-error' : undefined}
              >
                <option value="">Select a service</option>
                <option value="bathroom-remodel">Full Bathroom Remodel</option>
                <option value="walk-in-shower">Walk-in Shower Installation</option>
                <option value="tub-to-shower">Tub to Shower Conversion</option>
                <option value="shower-remodel">Shower Remodel</option>
                <option value="accessibility-modifications">
                  Accessibility Modifications
                </option>
                <option value="other">Other</option>
              </select>
              {errors.service && (
                <p
                  id="service-error"
                  className="mt-1 text-sm text-red-600"
                  role="alert"
                >
                  {errors.service.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                City or Zip Code <span className="text-red-500">*</span>
              </label>
              <input
                id="location"
                type="text"
                autoComplete="address-level2"
                placeholder="Chicago, IL or 60601"
                {...register('location')}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary ${
                  errors.location ? 'border-red-500' : 'border-gray-300'
                }`}
                aria-invalid={errors.location ? 'true' : 'false'}
                aria-describedby={errors.location ? 'location-error' : undefined}
              />
              {errors.location && (
                <p
                  id="location-error"
                  className="mt-1 text-sm text-red-600"
                  role="alert"
                >
                  {errors.location.message}
                </p>
              )}
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={previousStep}
                className="flex-1 py-3 px-6 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="flex-1 py-3 px-6 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Continue to Step 3 →
              </button>
            </div>
          </div>
        )}

        {/* Stage 3: Details + Contact Time */}
        {step === 3 && (
          <div className="space-y-4" role="group" aria-labelledby="stage3-title">
            <h2 id="stage3-title" className="text-2xl font-bold text-gray-900">
              Final Details
            </h2>

            <div>
              <label
                htmlFor="details"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Project Details <span className="text-red-500">*</span>
              </label>
              <textarea
                id="details"
                rows={4}
                placeholder="Tell us about your project, timeline, and any specific requirements..."
                {...register('details')}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary ${
                  errors.details ? 'border-red-500' : 'border-gray-300'
                }`}
                aria-invalid={errors.details ? 'true' : 'false'}
                aria-describedby={errors.details ? 'details-error' : undefined}
              />
              {errors.details && (
                <p
                  id="details-error"
                  className="mt-1 text-sm text-red-600"
                  role="alert"
                >
                  {errors.details.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="contactTime"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Preferred Contact Time <span className="text-red-500">*</span>
              </label>
              <select
                id="contactTime"
                {...register('contactTime')}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary ${
                  errors.contactTime ? 'border-red-500' : 'border-gray-300'
                }`}
                aria-invalid={errors.contactTime ? 'true' : 'false'}
                aria-describedby={
                  errors.contactTime ? 'contactTime-error' : undefined
                }
              >
                <option value="">Select a time</option>
                <option value="morning">Morning (8am - 12pm)</option>
                <option value="afternoon">Afternoon (12pm - 5pm)</option>
                <option value="evening">Evening (5pm - 8pm)</option>
                <option value="anytime">Anytime</option>
              </select>
              {errors.contactTime && (
                <p
                  id="contactTime-error"
                  className="mt-1 text-sm text-red-600"
                  role="alert"
                >
                  {errors.contactTime.message}
                </p>
              )}
            </div>

            {submitError && (
              <div
                className="p-4 bg-red-50 border border-red-200 rounded-lg"
                role="alert"
              >
                <p className="text-sm text-red-800">{submitError}</p>
              </div>
            )}

            <div className="flex gap-4">
              <button
                type="button"
                onClick={previousStep}
                disabled={isSubmitting}
                className="flex-1 py-3 px-6 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ← Back
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-3 px-6 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Get Your Free Quote'}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}
```

---

## localStorage Persistence

### File: `src/components/ThreeStageForm/useFormPersistence.ts`

```typescript
import { useCallback } from 'react'
import type { FormData } from './schemas'

const STORAGE_KEY = 'leadFormState'
const EXPIRATION_HOURS = 24

interface SavedFormState {
  step: number
  data: Partial<FormData>
  timestamp: number
  expiresAt: number
}

export function useFormPersistence() {
  /**
   * Load saved form state from localStorage
   * Returns null if expired or not found
   */
  const loadFormState = useCallback((): SavedFormState | null => {
    if (typeof window === 'undefined') return null

    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (!saved) return null

      const parsed: SavedFormState = JSON.parse(saved)

      // Check if expired
      if (parsed.expiresAt < Date.now()) {
        localStorage.removeItem(STORAGE_KEY)
        return null
      }

      return parsed
    } catch (error) {
      console.error('Error loading form state:', error)
      return null
    }
  }, [])

  /**
   * Save form state to localStorage
   */
  const saveFormState = useCallback(
    (state: { step: number; data: Partial<FormData> }) => {
      if (typeof window === 'undefined') return

      try {
        const formState: SavedFormState = {
          step: state.step,
          data: state.data,
          timestamp: Date.now(),
          expiresAt: Date.now() + EXPIRATION_HOURS * 60 * 60 * 1000,
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(formState))
      } catch (error) {
        console.error('Error saving form state:', error)
      }
    },
    []
  )

  /**
   * Clear saved form state from localStorage
   */
  const clearFormState = useCallback(() => {
    if (typeof window === 'undefined') return

    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (error) {
      console.error('Error clearing form state:', error)
    }
  }, [])

  return {
    loadFormState,
    saveFormState,
    clearFormState,
  }
}
```

---

## GTM DataLayer Integration

### File: `src/lib/analytics.ts`

```typescript
/**
 * GTM dataLayer event tracking utilities
 */

interface FormEvent {
  event: string
  form_name: string
  form_step?: number
  lead_value?: string
  error_message?: string
}

/**
 * Push form event to GTM dataLayer
 */
export function trackFormEvent(eventData: FormEvent): void {
  if (typeof window === 'undefined') return

  // Ensure dataLayer exists
  window.dataLayer = window.dataLayer || []

  // Push event
  window.dataLayer.push(eventData)

  // Log in development
  if (process.env.NODE_ENV === 'development') {
    console.log('[GTM Event]', eventData)
  }
}

/**
 * Track phone click event
 */
export function trackPhoneClick(
  phoneNumber: string,
  location: 'hero' | 'sticky' | 'footer'
): void {
  trackFormEvent({
    event: 'phone_click',
    form_name: 'contact',
    // @ts-expect-error - adding phone-specific fields
    phone_number: phoneNumber,
    click_location: location,
  })
}

/**
 * Extend Window interface for TypeScript
 */
declare global {
  interface Window {
    dataLayer: any[]
  }
}
```

---

## Accessibility Implementation

The form component above includes comprehensive accessibility features:

### ✅ Implemented Features

1. **ARIA Labels and Descriptions**
   - `aria-labelledby` for section headings
   - `aria-describedby` for error messages
   - `aria-invalid` for validation states

2. **Keyboard Navigation**
   - All interactive elements are keyboard accessible
   - Tab order follows visual order
   - Focus states visible with Tailwind `focus:ring-2`

3. **Screen Reader Announcements**
   - Error messages with `role="alert"`
   - Progress bar with `role="progressbar"` and `aria-valuenow`

4. **Form Semantics**
   - Proper `<label>` elements with `htmlFor`
   - Required fields marked with `*` and `aria-required`
   - Grouped sections with `role="group"`

5. **Focus Management**
   - Focus stays within current step
   - Focus moves to first field on step change (optional enhancement)

### Optional Enhancement: Focus Management on Step Change

```typescript
// Add to ThreeStageForm component
useEffect(() => {
  // Focus first input when step changes
  const firstInput = document.querySelector<HTMLInputElement>(
    `#${step === 1 ? 'name' : step === 2 ? 'service' : 'details'}`
  )
  firstInput?.focus()
}, [step])
```

---

## Styling with Tailwind CSS

The form uses Tailwind CSS utility classes. Key patterns:

### Primary Button

```css
bg-primary text-white font-semibold rounded-lg
hover:bg-primary-dark transition-colors
focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary
```

### Input Fields

```css
w-full px-4 py-3 border rounded-lg
focus:ring-2 focus:ring-primary focus:border-primary
```

### Error States

```css
border-red-500  /* For invalid inputs */
text-red-600    /* For error messages */
bg-red-50       /* For error containers */
```

### Custom Tailwind Colors (if needed)

Add to `tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#0ea5e9',
        'primary-dark': '#0284c7',
      },
    },
  },
}
```

Or with Tailwind v4 in `globals.css`:

```css
@theme {
  --color-primary: #0ea5e9;
  --color-primary-dark: #0284c7;
}
```

---

## Testing

### Unit Tests with React Testing Library

**File:** `src/components/ThreeStageForm/ThreeStageForm.test.tsx`

```typescript
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThreeStageForm } from './index'

describe('ThreeStageForm', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
  })

  it('renders stage 1 on initial load', () => {
    render(<ThreeStageForm />)

    expect(screen.getByText('Get Your Free Quote')).toBeInTheDocument()
    expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Phone Number/i)).toBeInTheDocument()
  })

  it('validates stage 1 fields before advancing', async () => {
    const user = userEvent.setup()
    render(<ThreeStageForm />)

    const continueButton = screen.getByText('Continue to Step 2 →')
    await user.click(continueButton)

    // Should show validation errors
    await waitFor(() => {
      expect(screen.getByText(/Name must be at least 2 characters/i)).toBeInTheDocument()
    })
  })

  it('advances to stage 2 with valid stage 1 data', async () => {
    const user = userEvent.setup()
    render(<ThreeStageForm />)

    // Fill stage 1
    await user.type(screen.getByLabelText(/Full Name/i), 'John Doe')
    await user.type(screen.getByLabelText(/Phone Number/i), '(555) 123-4567')

    // Continue to stage 2
    await user.click(screen.getByText('Continue to Step 2 →'))

    // Should show stage 2
    await waitFor(() => {
      expect(screen.getByText('Tell Us About Your Project')).toBeInTheDocument()
    })
  })

  it('saves form state to localStorage on step change', async () => {
    const user = userEvent.setup()
    render(<ThreeStageForm />)

    await user.type(screen.getByLabelText(/Full Name/i), 'John Doe')
    await user.type(screen.getByLabelText(/Phone Number/i), '(555) 123-4567')
    await user.click(screen.getByText('Continue to Step 2 →'))

    await waitFor(() => {
      const saved = localStorage.getItem('leadFormState')
      expect(saved).toBeTruthy()

      const parsed = JSON.parse(saved!)
      expect(parsed.step).toBe(2)
      expect(parsed.data.name).toBe('John Doe')
    })
  })

  it('loads saved form state on mount', () => {
    // Set saved state
    localStorage.setItem('leadFormState', JSON.stringify({
      step: 2,
      data: { name: 'Jane Doe', phone: '(555) 987-6543' },
      timestamp: Date.now(),
      expiresAt: Date.now() + 24 * 60 * 60 * 1000,
    }))

    render(<ThreeStageForm />)

    // Should restore to stage 2
    expect(screen.getByText('Tell Us About Your Project')).toBeInTheDocument()
  })
})
```

### Integration Tests

Test full form submission flow:

```typescript
it('submits form successfully', async () => {
  const user = userEvent.setup()

  // Mock fetch
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      status: 200,
    } as Response)
  )

  render(<ThreeStageForm />)

  // Stage 1
  await user.type(screen.getByLabelText(/Full Name/i), 'John Doe')
  await user.type(screen.getByLabelText(/Phone Number/i), '(555) 123-4567')
  await user.click(screen.getByText('Continue to Step 2 →'))

  // Stage 2
  await user.selectOptions(screen.getByLabelText(/Service Type/i), 'bathroom-remodel')
  await user.type(screen.getByLabelText(/City or Zip Code/i), 'Chicago, IL')
  await user.click(screen.getByText('Continue to Step 3 →'))

  // Stage 3
  await user.type(screen.getByLabelText(/Project Details/i), 'Need a full bathroom remodel with walk-in shower')
  await user.selectOptions(screen.getByLabelText(/Preferred Contact Time/i), 'morning')
  await user.click(screen.getByText('Get Your Free Quote'))

  // Should submit to Make.com
  await waitFor(() => {
    expect(global.fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        method: 'POST',
        body: expect.stringContaining('John Doe'),
      })
    )
  })
})
```

---

## Troubleshooting

### Common Issues

#### 1. **TypeScript Error: "Property 'dataLayer' does not exist on type 'Window'"**

**Solution:** Add type declaration in `src/lib/analytics.ts`:

```typescript
declare global {
  interface Window {
    dataLayer: any[]
  }
}
```

#### 2. **Form Not Validating on Blur**

**Solution:** Ensure `mode: 'onBlur'` is set in `useForm()`:

```typescript
const { register, ... } = useForm<FormData>({
  resolver: zodResolver(fullFormSchema),
  mode: 'onBlur', // <-- Important
})
```

#### 3. **localStorage Not Persisting Between Sessions**

**Solution:** Check expiration logic in `useFormPersistence.ts`. Default is 24 hours. Increase if needed:

```typescript
const EXPIRATION_HOURS = 48 // 2 days
```

#### 4. **Zod Validation Not Working**

**Solution:** Verify `@hookform/resolvers` is installed and zodResolver is imported:

```bash
npm install @hookform/resolvers
```

```typescript
import { zodResolver } from '@hookform/resolvers/zod'
```

#### 5. **GTM Events Not Firing**

**Solution:** Check that GTM is loaded and dataLayer exists:

```typescript
// In browser console
window.dataLayer
```

If `undefined`, verify GTM script is in `layout.tsx`.

---

## Next Steps

1. ✅ Install dependencies: `npm install react-hook-form zod @hookform/resolvers`
2. ✅ Create component files in `src/components/ThreeStageForm/`
3. ✅ Copy schemas from this guide to `schemas.ts`
4. ✅ Copy main component to `index.tsx`
5. ✅ Copy localStorage hook to `useFormPersistence.ts`
6. ✅ Copy analytics utilities to `src/lib/analytics.ts`
7. ✅ Add ThreeStageForm to landing page layout
8. ✅ Test locally with form submission
9. ✅ Verify GTM events in Tag Assistant
10. ✅ Run accessibility audit with axe DevTools

---

## Additional Resources

**React Hook Form Documentation:**
- https://react-hook-form.com/get-started
- https://react-hook-form.com/advanced-usage#SmartFormComponent

**Zod Documentation:**
- https://zod.dev/
- https://zod.dev/?id=primitives
- https://zod.dev/?id=objects

**Testing:**
- https://testing-library.com/docs/react-testing-library/intro/
- https://github.com/testing-library/user-event

**Accessibility:**
- https://www.w3.org/WAI/WCAG21/quickref/
- https://webaim.org/resources/contrastchecker/

---

**END OF IMPLEMENTATION GUIDE**
