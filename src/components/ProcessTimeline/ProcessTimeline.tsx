import type { ProcessStep } from '@/types/content-data'

interface ProcessTimelineProps {
  steps: ProcessStep[]
}

/**
 * ProcessTimeline Component
 *
 * Displays a service process as a visual timeline with steps.
 * - Mobile (<768px): Vertical timeline with left-aligned indicators
 * - Desktop (≥768px): Horizontal timeline with top-aligned indicators
 *
 * Features:
 * - Supports 3-7 steps dynamically
 * - Graceful handling of malformed AI-generated content
 * - Semantic HTML with ARIA labels for accessibility
 * - Server Component (zero client-side JavaScript)
 */
export default function ProcessTimeline({ steps }: ProcessTimelineProps) {
  // Validate and filter steps
  const validSteps = steps.filter(
    (step) =>
      step.stepNumber &&
      step.title &&
      step.description &&
      typeof step.stepNumber === 'number' &&
      step.stepNumber >= 1 &&
      step.stepNumber <= 7
  )

  // Return null if no valid steps
  if (validSteps.length === 0) {
    return null
  }

  // Sort by stepNumber (ensure correct order)
  const sortedSteps = validSteps.sort((a, b) => a.stepNumber - b.stepNumber)

  // Limit to maximum 7 steps per AC
  const displaySteps = sortedSteps.slice(0, 7)

  return (
    <section aria-label="Service process timeline" className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title (visually hidden but present for screen readers) */}
        <h2 className="sr-only">Service Process</h2>

        {/* Mobile: Vertical Timeline */}
        <ol className="flex flex-col space-y-8 md:hidden">
          {displaySteps.map((step, index) => (
            <li key={index} className="flex items-start gap-4 relative">
              {/* Vertical connector line (not on last step) */}
              {index < displaySteps.length - 1 && (
                <div className="absolute left-5 top-10 bottom-0 w-0.5 bg-gray-300" />
              )}

              {/* Step number indicator */}
              <div
                className="flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-full font-bold text-lg shrink-0 relative z-10"
                aria-label={`Step ${step.stepNumber}`}
              >
                {step.stepNumber}
              </div>

              {/* Step content */}
              <div className="flex-1 pt-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-base text-gray-700 mb-1">
                  {step.description}
                </p>
                {step.timeline && (
                  <span className="text-sm text-gray-500">{step.timeline}</span>
                )}
              </div>
            </li>
          ))}
        </ol>

        {/* Desktop: Horizontal Timeline */}
        <ol className="hidden md:flex flex-row items-start justify-between gap-8">
          {displaySteps.map((step, index) => (
            <li
              key={index}
              className="flex flex-col items-center flex-1 relative"
            >
              {/* Horizontal connector line (not on last step) */}
              {index < displaySteps.length - 1 && (
                <div className="absolute left-1/2 top-5 w-full h-0.5 bg-gray-300" />
              )}

              {/* Step number indicator */}
              <div
                className="flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-full font-bold text-xl mb-4 relative z-10"
                aria-label={`Step ${step.stepNumber}`}
              >
                {step.stepNumber}
              </div>

              {/* Step content */}
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-base text-gray-700 mb-1">
                  {step.description}
                </p>
                {step.timeline && (
                  <span className="text-sm text-gray-500">{step.timeline}</span>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
