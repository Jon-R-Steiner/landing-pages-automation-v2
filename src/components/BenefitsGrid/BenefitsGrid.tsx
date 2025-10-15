import type { BenefitItem } from '@/types/content-data'

// ============================================
// Icon Components (Inline SVG)
// ============================================

interface IconProps {
  className?: string
  'aria-hidden'?: boolean
}

function CheckCircleIcon({ className = '', 'aria-hidden': ariaHidden = true }: IconProps) {
  return (
    <svg
      className={className}
      aria-hidden={ariaHidden}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
        clipRule="evenodd"
      />
    </svg>
  )
}

function ShieldIcon({ className = '', 'aria-hidden': ariaHidden = true }: IconProps) {
  return (
    <svg
      className={className}
      aria-hidden={ariaHidden}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 00.374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 00-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08zm3.094 8.016a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
        clipRule="evenodd"
      />
    </svg>
  )
}

function StarIcon({ className = '', 'aria-hidden': ariaHidden = true }: IconProps) {
  return (
    <svg
      className={className}
      aria-hidden={ariaHidden}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
        clipRule="evenodd"
      />
    </svg>
  )
}

function LightningIcon({ className = '', 'aria-hidden': ariaHidden = true }: IconProps) {
  return (
    <svg
      className={className}
      aria-hidden={ariaHidden}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M14.615 1.595a.75.75 0 01.359.852L12.982 9.75h7.268a.75.75 0 01.548 1.262l-10.5 11.25a.75.75 0 01-1.272-.71l1.992-7.302H3.75a.75.75 0 01-.548-1.262l10.5-11.25a.75.75 0 01.913-.143z"
        clipRule="evenodd"
      />
    </svg>
  )
}

function ClockIcon({ className = '', 'aria-hidden': ariaHidden = true }: IconProps) {
  return (
    <svg
      className={className}
      aria-hidden={ariaHidden}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z"
        clipRule="evenodd"
      />
    </svg>
  )
}

function ThumbUpIcon({ className = '', 'aria-hidden': ariaHidden = true }: IconProps) {
  return (
    <svg
      className={className}
      aria-hidden={ariaHidden}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M7.493 18.75c-.425 0-.82-.236-.975-.632A7.48 7.48 0 016 15.375c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75 2.25 2.25 0 012.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23h-.777zM2.331 10.727a11.969 11.969 0 00-.831 4.398 12 12 0 00.52 3.507c.26.85 1.084 1.368 1.973 1.368H4.9c.445 0 .72-.498.523-.898a8.963 8.963 0 01-.924-3.977c0-1.708.476-3.305 1.302-4.666.245-.403-.028-.959-.5-.959H4.25c-.832 0-1.612.453-1.918 1.227z" />
    </svg>
  )
}

// ============================================
// Icon Selection Logic
// ============================================

function getIconForBenefit(iconName?: string): React.ReactNode {
  const iconClasses = 'w-8 h-8 text-blue-600 flex-shrink-0'

  switch (iconName) {
    case 'check-circle':
      return <CheckCircleIcon className={iconClasses} />
    case 'shield':
      return <ShieldIcon className={iconClasses} />
    case 'star':
      return <StarIcon className={iconClasses} />
    case 'lightning':
      return <LightningIcon className={iconClasses} />
    case 'clock':
      return <ClockIcon className={iconClasses} />
    case 'thumb-up':
      return <ThumbUpIcon className={iconClasses} />
    default:
      // Default fallback icon
      return <CheckCircleIcon className={iconClasses} />
  }
}

// ============================================
// BenefitsGrid Component
// ============================================

interface BenefitsGridProps {
  benefits: BenefitItem[]
}

export default function BenefitsGrid({ benefits }: BenefitsGridProps) {
  // Filter out empty/invalid benefits (AC 4: Graceful content handling)
  const validBenefits = benefits.filter(
    (benefit) => benefit.title && benefit.description
  )

  // Return null if no valid benefits (AC 4)
  if (validBenefits.length === 0) {
    return null
  }

  // Support 3-9 benefits per page (AC 2)
  const displayBenefits = validBenefits.slice(0, 9)

  return (
    <section
      aria-label="Service benefits"
      className="max-w-7xl mx-auto px-4 py-16 md:py-24"
    >
      {/* Hidden heading for screen readers (AC 7: Accessibility) */}
      <h2 className="sr-only">Service Benefits</h2>

      {/* Responsive Grid (AC 1, 5: Responsive layout + Visual hierarchy) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
        {displayBenefits.map((benefit, index) => (
          <article
            key={index}
            className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
          >
            {/* Icon (AC 3, 4: Icon + graceful missing icon handling) */}
            <div className="mb-4">
              {getIconForBenefit(benefit.icon)}
            </div>

            {/* Headline (AC 3, 5, 6: Headline + Typography + Visual hierarchy) */}
            <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2">
              {benefit.title}
            </h3>

            {/* Description (AC 3, 5, 6: Description + Typography + Visual hierarchy) */}
            <p className="text-base text-gray-700 leading-relaxed">
              {benefit.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  )
}
