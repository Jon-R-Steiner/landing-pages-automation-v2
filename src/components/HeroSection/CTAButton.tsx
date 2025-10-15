'use client'

import type { CTAAction } from '@/types/content-data'

/**
 * CTAButton Component
 *
 * Reusable call-to-action button with:
 * - Multiple action types (phone, form scroll, external link)
 * - Accessible 44×44px minimum touch target
 * - ARIA labels for screen readers
 * - Dynamic branding colors
 * - Primary and secondary variants
 */
interface CTAButtonProps {
  cta: CTAAction
  variant: 'primary' | 'secondary'
}

export default function CTAButton({ cta, variant }: CTAButtonProps) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    switch (cta.actionType) {
      case 'phone':
        window.location.href = `tel:${cta.actionValue}`
        break
      case 'form':
        e.preventDefault()
        document.querySelector('#contact-form')?.scrollIntoView({
          behavior: 'smooth',
        })
        break
      case 'link':
        window.location.href = cta.actionValue
        break
    }
  }

  const baseClasses =
    'min-h-[44px] min-w-[44px] px-6 py-3 rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-offset-2'

  const variantClasses =
    variant === 'primary'
      ? 'text-white hover:opacity-90 focus:ring-[var(--brand-primary)]'
      : 'border-2 hover:opacity-90 focus:ring-[var(--brand-secondary)]'

  const variantStyles: React.CSSProperties =
    variant === 'primary'
      ? {
          backgroundColor: 'var(--brand-primary)',
        }
      : {
          borderColor: 'var(--brand-primary)',
          color: 'var(--brand-primary)',
        }

  // Generate accessible aria-label based on action type
  const ariaLabel = `${cta.text}${
    cta.actionType === 'phone' ? ` - Call ${cta.actionValue}` : ''
  }`

  return (
    <button
      onClick={handleClick}
      className={`${baseClasses} ${variantClasses}`}
      style={variantStyles}
      aria-label={ariaLabel}
      type="button"
    >
      {cta.text}
    </button>
  )
}
