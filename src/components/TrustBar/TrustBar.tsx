import type { TrustBarData, BrandingData } from '@/types/content-data'

interface TrustBarProps {
  trustBar: TrustBarData
  branding: BrandingData
}

// ============================================
// Inline SVG Icons
// ============================================

function StarIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  )
}

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
    </svg>
  )
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
    </svg>
  )
}

function TagIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58.55 0 1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41 0-.55-.23-1.06-.59-1.42zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7z" />
    </svg>
  )
}

function CheckmarkIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
    </svg>
  )
}

function BBBIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
    </svg>
  )
}

// ============================================
// Icon Selection Logic
// ============================================

function getIconForSignal(signal: string): React.ReactNode {
  const lowerSignal = signal.toLowerCase()

  if (lowerSignal.includes('star') || lowerSignal.includes('rating') || lowerSignal.includes('review')) {
    return <StarIcon className="w-6 h-6 flex-shrink-0" />
  }
  if (lowerSignal.includes('year') || lowerSignal.includes('experience')) {
    return <CalendarIcon className="w-6 h-6 flex-shrink-0" />
  }
  if (lowerSignal.includes('bbb') || lowerSignal.includes('accredited')) {
    return <BBBIcon className="w-6 h-6 flex-shrink-0" />
  }
  if (lowerSignal.includes('warranty') || lowerSignal.includes('guarantee')) {
    return <ShieldIcon className="w-6 h-6 flex-shrink-0" />
  }
  if (lowerSignal.includes('free') || lowerSignal.includes('quote')) {
    return <TagIcon className="w-6 h-6 flex-shrink-0" />
  }

  // Default fallback
  return <CheckmarkIcon className="w-6 h-6 flex-shrink-0" />
}

// ============================================
// Utility: Extract main text and subtext
// ============================================

function parseSignalText(signal: string): { main: string; sub?: string } {
  // Check for common patterns like "4.9/5 Stars (2,847 reviews)"
  const match = signal.match(/^([^(]+)(\(.+\))?$/)
  if (match) {
    return {
      main: match[1]?.trim() || signal,
      sub: match[2]?.replace(/[()]/g, '').trim(),
    }
  }
  return { main: signal }
}

// ============================================
// Main TrustBar Component
// ============================================

/**
 * TrustBar Component
 *
 * Sticky trust signals bar with:
 * - Sticky positioning (top: 0, z-index: 40)
 * - Dynamic branding (client primary color background)
 * - Responsive layout (horizontal desktop, wrap/hide mobile)
 * - Inline SVG icons (pattern-matched to signal text)
 * - Accessibility (ARIA labels, semantic HTML, color contrast)
 * - CLS prevention (reserved height: 60px desktop, 80px mobile)
 *
 * Performance targets: No CLS, <50ms LCP impact
 */
export default function TrustBar({ trustBar, branding }: TrustBarProps) {
  // Filter out empty signals
  const validSignals = trustBar.signals.filter(Boolean)

  // No signals to display
  if (validSignals.length === 0) {
    return null
  }

  return (
    // CLS Prevention: Reserve exact height
    <div className="min-h-[80px] md:min-h-[60px] w-full">
      {/* Sticky Trust Bar */}
      <nav
        aria-label="Trust indicators"
        className="sticky top-0 z-40 flex items-center justify-center gap-4 md:gap-8 flex-wrap w-full px-4 py-3 text-white shadow-md"
        style={{ backgroundColor: branding.primaryColor }}
      >
        {validSignals.map((signal, index) => {
          const { main, sub } = parseSignalText(signal)
          const icon = getIconForSignal(signal)

          // Hide 5th signal on mobile if more than 4 signals
          const hideOnMobile = validSignals.length > 4 && index === 4

          return (
            <div
              key={index}
              className={`flex items-center gap-2 ${hideOnMobile ? 'hidden md:flex' : 'flex'}`}
              aria-label={signal}
            >
              {/* Icon */}
              {icon}

              {/* Text */}
              <div className="flex flex-col">
                <span className="font-semibold text-xs md:text-sm">
                  {main}
                </span>
                {sub && (
                  <span className="text-xs opacity-90 hidden md:inline">
                    {sub}
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </nav>
    </div>
  )
}
