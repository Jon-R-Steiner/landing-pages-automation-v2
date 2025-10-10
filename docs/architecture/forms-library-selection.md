# ADR-027: Multi-Step Form Library Comparison

**Status:** ✅ APPROVED - React Hook Form + Zod
**Decision Date:** 2025-10-10
**Decision Maker:** Product Owner (Jon)
**Context:** 3-stage progressive disclosure form for lead generation

---

## ✅ DECISION APPROVED

**Selected:** **React Hook Form + Zod**

**User Selection Date:** 2025-10-10

**Rationale for Selection:**
- Best TypeScript support with Zod schema validation
- Excellent performance (uncontrolled components)
- Modern, future-proof solution
- 21KB bundle size is acceptable for the benefits
- Free and open source (MIT license)

**Implementation:** See `forms-implementation-guide.md` for complete implementation details.

---

## Decision Required

Select the form library/approach for implementing the 3-stage progressive disclosure form:

**Stage 1:** Name + Phone (primary conversion)
**Stage 2:** Service Type + Location (qualification)
**Stage 3:** Project Details + Contact Time (details)

**Requirements:**
- ✅ Multi-step state management (3 stages)
- ✅ Per-step validation (client-side)
- ✅ Type safety (TypeScript)
- ✅ localStorage persistence (resume partially completed forms)
- ✅ GTM dataLayer integration (track form_start, form_stage_2, form_stage_3, form_submit)
- ✅ Submit to Make.com webhook (POST with JSON payload)
- ✅ Performance: Minimal bundle size impact (LCP <2.5s target)
- ✅ Accessibility: ARIA labels, keyboard navigation, error announcements

---

## Option 1: React Hook Form + Zod

### Overview

**React Hook Form** is a lightweight, performant form library with uncontrolled components (minimal re-renders).
**Zod** provides TypeScript-first schema validation.

### Bundle Size
- React Hook Form: **~9KB gzipped**
- Zod: **~12KB gzipped**
- **Total: ~21KB**

### Pros
- ✅ **Excellent performance** - Uncontrolled components (fewer re-renders)
- ✅ **TypeScript-first** - Best TypeScript support in the ecosystem
- ✅ **Schema validation with Zod** - Type-safe validation, reusable schemas
- ✅ **Lightweight** - Smallest bundle size among mature libraries
- ✅ **Modern API** - Hooks-based, React 19 compatible
- ✅ **Good documentation** - Clear multi-step form examples
- ✅ **Active maintenance** - 38K+ GitHub stars, frequent updates

### Cons
- ❌ **Less opinionated** - More manual setup for multi-step forms
- ❌ **Learning curve** - More complex API than simpler alternatives
- ❌ **Zod dependency** - Adds 12KB (though excellent type safety)

### Code Example: 3-Stage Form

```typescript
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'

// Zod schemas for each stage
const stage1Schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().regex(/^\(\d{3}\) \d{3}-\d{4}$/, 'Invalid phone format'),
})

const stage2Schema = z.object({
  service: z.enum(['bathroom-remodel', 'walk-in-shower', 'tub-to-shower']),
  location: z.string().min(2, 'Location is required'),
})

const stage3Schema = z.object({
  details: z.string().min(10, 'Please provide at least 10 characters'),
  contactTime: z.enum(['morning', 'afternoon', 'evening', 'anytime']),
})

// Combined schema for final submission
const fullFormSchema = stage1Schema.merge(stage2Schema).merge(stage3Schema)

type FormData = z.infer<typeof fullFormSchema>

export function ThreeStageForm() {
  const [step, setStep] = useState(1)

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    getValues,
  } = useForm<FormData>({
    resolver: zodResolver(fullFormSchema),
    mode: 'onBlur',
  })

  // Validate current stage before advancing
  const nextStep = async () => {
    const isValid = await trigger(
      step === 1 ? ['name', 'phone'] : ['service', 'location']
    )
    if (isValid) {
      setStep(step + 1)

      // GTM tracking
      window.dataLayer?.push({
        event: step === 1 ? 'form_start' : `form_stage_${step + 1}`,
        form_name: 'contact',
      })

      // Save to localStorage
      localStorage.setItem('leadFormState', JSON.stringify({
        step: step + 1,
        data: getValues(),
        timestamp: Date.now(),
      }))
    }
  }

  const onSubmit = async (data: FormData) => {
    try {
      // Submit to Make.com webhook
      const response = await fetch(process.env.NEXT_PUBLIC_MAKE_WEBHOOK_URL!, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        window.dataLayer?.push({ event: 'form_submit', form_name: 'contact' })
        localStorage.removeItem('leadFormState')
      }
    } catch (error) {
      window.dataLayer?.push({ event: 'form_error', form_name: 'contact' })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {step === 1 && (
        <>
          <div>
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              {...register('name')}
              aria-invalid={errors.name ? 'true' : 'false'}
            />
            {errors.name && <p className="text-red-600">{errors.name.message}</p>}
          </div>

          <div>
            <label htmlFor="phone">Phone</label>
            <input
              id="phone"
              type="tel"
              {...register('phone')}
              aria-invalid={errors.phone ? 'true' : 'false'}
            />
            {errors.phone && <p className="text-red-600">{errors.phone.message}</p>}
          </div>

          <button type="button" onClick={nextStep}>
            Continue to Step 2
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <div>
            <label htmlFor="service">Service Type</label>
            <select id="service" {...register('service')}>
              <option value="bathroom-remodel">Bathroom Remodel</option>
              <option value="walk-in-shower">Walk-in Shower</option>
              <option value="tub-to-shower">Tub to Shower</option>
            </select>
            {errors.service && <p className="text-red-600">{errors.service.message}</p>}
          </div>

          <div>
            <label htmlFor="location">Location</label>
            <input id="location" type="text" {...register('location')} />
            {errors.location && <p className="text-red-600">{errors.location.message}</p>}
          </div>

          <button type="button" onClick={() => setStep(1)}>Back</button>
          <button type="button" onClick={nextStep}>Continue to Step 3</button>
        </>
      )}

      {step === 3 && (
        <>
          <div>
            <label htmlFor="details">Project Details</label>
            <textarea id="details" {...register('details')} />
            {errors.details && <p className="text-red-600">{errors.details.message}</p>}
          </div>

          <div>
            <label htmlFor="contactTime">Preferred Contact Time</label>
            <select id="contactTime" {...register('contactTime')}>
              <option value="morning">Morning</option>
              <option value="afternoon">Afternoon</option>
              <option value="evening">Evening</option>
              <option value="anytime">Anytime</option>
            </select>
          </div>

          <button type="button" onClick={() => setStep(2)}>Back</button>
          <button type="submit">Submit</button>
        </>
      )}
    </form>
  )
}
```

### Evaluation for This Project

| Criteria | Score | Notes |
|----------|-------|-------|
| **Bundle Size** | 9/10 | 21KB total (excellent) |
| **TypeScript Support** | 10/10 | Best-in-class with Zod |
| **Multi-Step Support** | 8/10 | Good, but manual setup |
| **Validation** | 10/10 | Schema-based, type-safe |
| **Developer Experience** | 8/10 | Modern, but learning curve |
| **Performance** | 10/10 | Uncontrolled = minimal re-renders |
| **Accessibility** | 9/10 | Good ARIA support with manual setup |
| **Maintenance** | 10/10 | Active, large community |
| **TOTAL** | **74/80** | **92.5%** |

---

## Option 2: Formik + Yup

### Overview

**Formik** is the most mature React form library with built-in multi-step support.
**Yup** provides schema-based validation (similar to Zod but older).

### Bundle Size
- Formik: **~13KB gzipped**
- Yup: **~12KB gzipped**
- **Total: ~25KB**

### Pros
- ✅ **Mature & battle-tested** - Used by Meta, Airbnb, etc.
- ✅ **Built-in multi-step patterns** - Wizard component examples
- ✅ **Excellent documentation** - Many real-world examples
- ✅ **Large community** - 33K+ GitHub stars, extensive tutorials
- ✅ **Less manual setup** - More opinionated (faster implementation)

### Cons
- ❌ **Larger bundle** - 25KB (4KB more than React Hook Form)
- ❌ **Controlled components** - More re-renders (slower performance)
- ❌ **Slower updates** - Less active than React Hook Form
- ❌ **TypeScript support** - Good but not as tight as React Hook Form + Zod

### Code Example: 3-Stage Form

```typescript
'use client'

import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { useState } from 'react'

// Validation schemas
const stage1Schema = Yup.object({
  name: Yup.string().min(2, 'Name must be at least 2 characters').required(),
  phone: Yup.string().matches(/^\(\d{3}\) \d{3}-\d{4}$/, 'Invalid phone format').required(),
})

const stage2Schema = Yup.object({
  service: Yup.string().oneOf(['bathroom-remodel', 'walk-in-shower', 'tub-to-shower']).required(),
  location: Yup.string().min(2, 'Location is required').required(),
})

const stage3Schema = Yup.object({
  details: Yup.string().min(10, 'Please provide at least 10 characters').required(),
  contactTime: Yup.string().oneOf(['morning', 'afternoon', 'evening', 'anytime']).required(),
})

const validationSchemas = [stage1Schema, stage2Schema, stage3Schema]

export function ThreeStageForm() {
  const [step, setStep] = useState(0)

  const initialValues = {
    name: '',
    phone: '',
    service: '',
    location: '',
    details: '',
    contactTime: '',
  }

  const handleNext = (values: typeof initialValues) => {
    setStep(step + 1)

    // GTM tracking
    window.dataLayer?.push({
      event: step === 0 ? 'form_start' : `form_stage_${step + 2}`,
      form_name: 'contact',
    })

    // Save to localStorage
    localStorage.setItem('leadFormState', JSON.stringify({
      step: step + 1,
      data: values,
      timestamp: Date.now(),
    }))
  }

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_MAKE_WEBHOOK_URL!, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })

      if (response.ok) {
        window.dataLayer?.push({ event: 'form_submit', form_name: 'contact' })
        localStorage.removeItem('leadFormState')
      }
    } catch (error) {
      window.dataLayer?.push({ event: 'form_error', form_name: 'contact' })
    }
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchemas[step]}
      onSubmit={step === 2 ? handleSubmit : handleNext}
    >
      {({ isValid, isSubmitting }) => (
        <Form className="space-y-6">
          {step === 0 && (
            <>
              <div>
                <label htmlFor="name">Name</label>
                <Field id="name" name="name" type="text" />
                <ErrorMessage name="name" component="p" className="text-red-600" />
              </div>

              <div>
                <label htmlFor="phone">Phone</label>
                <Field id="phone" name="phone" type="tel" />
                <ErrorMessage name="phone" component="p" className="text-red-600" />
              </div>

              <button type="submit" disabled={!isValid}>
                Continue to Step 2
              </button>
            </>
          )}

          {step === 1 && (
            <>
              <div>
                <label htmlFor="service">Service Type</label>
                <Field as="select" id="service" name="service">
                  <option value="bathroom-remodel">Bathroom Remodel</option>
                  <option value="walk-in-shower">Walk-in Shower</option>
                  <option value="tub-to-shower">Tub to Shower</option>
                </Field>
                <ErrorMessage name="service" component="p" className="text-red-600" />
              </div>

              <div>
                <label htmlFor="location">Location</label>
                <Field id="location" name="location" type="text" />
                <ErrorMessage name="location" component="p" className="text-red-600" />
              </div>

              <button type="button" onClick={() => setStep(0)}>Back</button>
              <button type="submit" disabled={!isValid}>Continue to Step 3</button>
            </>
          )}

          {step === 2 && (
            <>
              <div>
                <label htmlFor="details">Project Details</label>
                <Field as="textarea" id="details" name="details" />
                <ErrorMessage name="details" component="p" className="text-red-600" />
              </div>

              <div>
                <label htmlFor="contactTime">Preferred Contact Time</label>
                <Field as="select" id="contactTime" name="contactTime">
                  <option value="morning">Morning</option>
                  <option value="afternoon">Afternoon</option>
                  <option value="evening">Evening</option>
                  <option value="anytime">Anytime</option>
                </Field>
              </div>

              <button type="button" onClick={() => setStep(1)}>Back</button>
              <button type="submit" disabled={isSubmitting}>Submit</button>
            </>
          )}
        </Form>
      )}
    </Formik>
  )
}
```

### Evaluation for This Project

| Criteria | Score | Notes |
|----------|-------|-------|
| **Bundle Size** | 8/10 | 25KB (4KB more than React Hook Form) |
| **TypeScript Support** | 7/10 | Good but not as tight as Zod |
| **Multi-Step Support** | 9/10 | Built-in patterns, easier setup |
| **Validation** | 9/10 | Schema-based with Yup |
| **Developer Experience** | 9/10 | More opinionated, faster to implement |
| **Performance** | 7/10 | Controlled components = more re-renders |
| **Accessibility** | 8/10 | Good ARIA support |
| **Maintenance** | 7/10 | Mature but slower updates |
| **TOTAL** | **64/80** | **80%** |

---

## Option 3: Custom State Management (useState + Manual Validation)

### Overview

Build the form from scratch using React's `useState` and manual validation logic.
No external libraries required.

### Bundle Size
- React Hook Form: **0KB** (native React)
- Manual validation code: **~2-3KB**
- **Total: ~2-3KB**

### Pros
- ✅ **Minimal bundle size** - No library overhead (~2-3KB)
- ✅ **Full control** - No library constraints or API learning
- ✅ **Tailored exactly to needs** - 3 stages, specific fields only
- ✅ **No dependencies** - Fewer moving parts to maintain
- ✅ **Fast implementation** - For simple forms like this

### Cons
- ❌ **More development time** - Build validation, error handling from scratch
- ❌ **Less tested** - Custom code vs battle-tested libraries
- ❌ **TypeScript validation** - Manual type guards (no schema validation)
- ❌ **Reinventing the wheel** - Form handling is a solved problem
- ❌ **Harder to maintain** - More custom code to debug
- ❌ **No schema reusability** - Validation tied to component

### Code Example: 3-Stage Form

```typescript
'use client'

import { useState, FormEvent, ChangeEvent } from 'react'

interface FormData {
  name: string
  phone: string
  service: string
  location: string
  details: string
  contactTime: string
}

interface FormErrors {
  name?: string
  phone?: string
  service?: string
  location?: string
  details?: string
  contactTime?: string
}

export function ThreeStageForm() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    service: '',
    location: '',
    details: '',
    contactTime: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})

  // Manual validation functions
  const validateStep1 = (): boolean => {
    const newErrors: FormErrors = {}

    if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters'
    }

    const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/
    if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Invalid phone format'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep2 = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.service) {
      newErrors.service = 'Service type is required'
    }

    if (formData.location.length < 2) {
      newErrors.location = 'Location is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep3 = (): boolean => {
    const newErrors: FormErrors = {}

    if (formData.details.length < 10) {
      newErrors.details = 'Please provide at least 10 characters'
    }

    if (!formData.contactTime) {
      newErrors.contactTime = 'Contact time is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const nextStep = () => {
    const isValid = step === 1 ? validateStep1() : validateStep2()

    if (isValid) {
      setStep(step + 1)

      // GTM tracking
      window.dataLayer?.push({
        event: step === 1 ? 'form_start' : `form_stage_${step + 1}`,
        form_name: 'contact',
      })

      // Save to localStorage
      localStorage.setItem('leadFormState', JSON.stringify({
        step: step + 1,
        data: formData,
        timestamp: Date.now(),
      }))
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!validateStep3()) return

    try {
      const response = await fetch(process.env.NEXT_PUBLIC_MAKE_WEBHOOK_URL!, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        window.dataLayer?.push({ event: 'form_submit', form_name: 'contact' })
        localStorage.removeItem('leadFormState')
      }
    } catch (error) {
      window.dataLayer?.push({ event: 'form_error', form_name: 'contact' })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {step === 1 && (
        <>
          <div>
            <label htmlFor="name">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              aria-invalid={errors.name ? 'true' : 'false'}
            />
            {errors.name && <p className="text-red-600">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="phone">Phone</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              aria-invalid={errors.phone ? 'true' : 'false'}
            />
            {errors.phone && <p className="text-red-600">{errors.phone}</p>}
          </div>

          <button type="button" onClick={nextStep}>
            Continue to Step 2
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <div>
            <label htmlFor="service">Service Type</label>
            <select
              id="service"
              name="service"
              value={formData.service}
              onChange={handleChange}
            >
              <option value="">Select a service</option>
              <option value="bathroom-remodel">Bathroom Remodel</option>
              <option value="walk-in-shower">Walk-in Shower</option>
              <option value="tub-to-shower">Tub to Shower</option>
            </select>
            {errors.service && <p className="text-red-600">{errors.service}</p>}
          </div>

          <div>
            <label htmlFor="location">Location</label>
            <input
              id="location"
              name="location"
              type="text"
              value={formData.location}
              onChange={handleChange}
            />
            {errors.location && <p className="text-red-600">{errors.location}</p>}
          </div>

          <button type="button" onClick={() => setStep(1)}>Back</button>
          <button type="button" onClick={nextStep}>Continue to Step 3</button>
        </>
      )}

      {step === 3 && (
        <>
          <div>
            <label htmlFor="details">Project Details</label>
            <textarea
              id="details"
              name="details"
              value={formData.details}
              onChange={handleChange}
            />
            {errors.details && <p className="text-red-600">{errors.details}</p>}
          </div>

          <div>
            <label htmlFor="contactTime">Preferred Contact Time</label>
            <select
              id="contactTime"
              name="contactTime"
              value={formData.contactTime}
              onChange={handleChange}
            >
              <option value="">Select a time</option>
              <option value="morning">Morning</option>
              <option value="afternoon">Afternoon</option>
              <option value="evening">Evening</option>
              <option value="anytime">Anytime</option>
            </select>
          </div>

          <button type="button" onClick={() => setStep(2)}>Back</button>
          <button type="submit">Submit</button>
        </>
      )}
    </form>
  )
}
```

### Evaluation for This Project

| Criteria | Score | Notes |
|----------|-------|-------|
| **Bundle Size** | 10/10 | 2-3KB (smallest possible) |
| **TypeScript Support** | 6/10 | Manual type guards, no schema validation |
| **Multi-Step Support** | 7/10 | Works, but more manual setup |
| **Validation** | 6/10 | Manual validation, error-prone |
| **Developer Experience** | 6/10 | More code to write and maintain |
| **Performance** | 10/10 | Optimal (native React) |
| **Accessibility** | 7/10 | Manual ARIA setup |
| **Maintenance** | 6/10 | More custom code to debug |
| **TOTAL** | **58/80** | **72.5%** |

---

## Comparison Summary

| Criteria | React Hook Form + Zod | Formik + Yup | Custom (useState) |
|----------|------------------------|--------------|-------------------|
| **Bundle Size** | 21KB | 25KB | 2-3KB |
| **TypeScript Support** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Multi-Step Support** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Validation Quality** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Developer Experience** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Performance** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Accessibility** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Maintenance** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Overall Score** | **92.5%** | **80%** | **72.5%** |

---

## Architect's Recommendation

### 🏆 **RECOMMENDED: React Hook Form + Zod**

**Rationale:**

1. **Best TypeScript Support** - Zod schemas provide end-to-end type safety (form → validation → submission)
2. **Excellent Performance** - Uncontrolled components minimize re-renders (critical for LCP <2.5s)
3. **Schema Reusability** - Zod schemas can be reused for backend validation (if needed in future)
4. **Modern & Future-Proof** - Active development, React 19 compatible, large community
5. **Acceptable Bundle Size** - 21KB is a reasonable tradeoff for the benefits (still well within performance budget)
6. **Battle-Tested** - Used by Vercel, Stripe, and many high-traffic production sites

**Why Not Formik:**
- 4KB larger bundle (25KB vs 21KB)
- Controlled components = more re-renders (worse for performance)
- Slower updates and TypeScript support not as tight

**Why Not Custom:**
- 3-stage forms are complex enough to benefit from a library
- Manual validation is error-prone (phone regex, edge cases)
- Schema-based validation with Zod is superior for type safety
- Development time tradeoff not worth the 18KB savings

---

## Decision Time

**Please select one of the following options:**

**Option 1:** React Hook Form + Zod (Recommended)
- **Bundle:** 21KB
- **Best for:** Type safety, performance, modern React patterns
- **Effort:** Medium setup, excellent DX once configured

**Option 2:** Formik + Yup
- **Bundle:** 25KB
- **Best for:** Faster implementation, more opinionated patterns
- **Effort:** Easier setup, more examples available

**Option 3:** Custom State Management
- **Bundle:** 2-3KB
- **Best for:** Absolute minimal bundle size
- **Effort:** More development time, manual validation

---

**YOUR DECISION:**

Please reply with:
- **"1"** for React Hook Form + Zod
- **"2"** for Formik + Yup
- **"3"** for Custom State Management

Once you select, I will:
1. Document the decision in this ADR
2. Create implementation guide with complete code examples
3. Update architecture documentation
4. Prepare for Epic 0 Phase 0.2 (Deployment Baseline)

---

## Implementation Status

**Decision:** ✅ APPROVED
**Selected Solution:** React Hook Form + Zod
**Dependencies:**
- `react-hook-form` ^7.48.0 (~9KB gzipped)
- `zod` ^3.22.0 (~12KB gzipped)
- `@hookform/resolvers` ^3.3.0 (peer dependency for Zod integration)

**Total Bundle Impact:** ~21KB gzipped

**Next Steps:**
1. ✅ Install dependencies: `npm install react-hook-form zod @hookform/resolvers`
2. ✅ Create Zod schemas for form validation (see implementation guide)
3. ✅ Implement ThreeStageForm component with React Hook Form
4. ✅ Add GTM dataLayer tracking integration
5. ✅ Implement localStorage persistence
6. ✅ Add accessibility features (ARIA labels, keyboard navigation)
7. ✅ Test form validation, submission, and error handling

**Reference Implementation:** See `forms-implementation-guide.md`

---

**Status:** ✅ DECISION COMPLETE - READY FOR IMPLEMENTATION
