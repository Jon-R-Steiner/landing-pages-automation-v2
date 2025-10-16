import type { FAQItem } from '@/types/content-data'

interface FAQAccordionProps {
  items: FAQItem[]
}

/**
 * FAQAccordion Component
 *
 * Displays FAQs in an accessible accordion format using native HTML5 <details>/<summary>.
 * Zero JavaScript implementation with Schema.org structured data for SEO.
 *
 * Features:
 * - Native <details>/<summary> (zero JS, perfect accessibility)
 * - Schema.org FAQPage microdata markup
 * - Keyboard navigation (Enter/Space/Tab/Arrow keys)
 * - Smooth CSS animations
 * - Responsive design (mobile/tablet/desktop)
 * - WCAG 2.1 AA compliant
 *
 * @param items - Array of FAQ items from content.json
 * @returns FAQ accordion section or null if no valid FAQs
 */
export default function FAQAccordion({ items }: FAQAccordionProps) {
  // Data validation: filter out invalid FAQs
  const validFAQs = items.filter(
    (faq) =>
      faq.question &&
      faq.question.trim() !== '' &&
      faq.answer &&
      faq.answer.trim() !== ''
  )

  // Return null if no valid FAQs (graceful degradation)
  if (validFAQs.length === 0) {
    return null
  }

  return (
    <section
      className="py-12 px-4 max-w-4xl mx-auto"
      aria-labelledby="faq-heading"
      itemScope
      itemType="https://schema.org/FAQPage"
    >
      <h2
        id="faq-heading"
        className="text-3xl font-bold text-center mb-8 text-gray-900"
      >
        Frequently Asked Questions
      </h2>

      <div className="space-y-4">
        {validFAQs.map((item, index) => (
          <details
            key={index}
            className="group border border-gray-300 rounded-lg bg-white hover:shadow-md transition-shadow open:border-blue-500"
            itemScope
            itemProp="mainEntity"
            itemType="https://schema.org/Question"
          >
            <summary
              className="flex items-center justify-between gap-4 px-5 py-4 font-semibold text-lg cursor-pointer select-none list-none focus:outline-blue-500 focus:outline-2 focus:outline-offset-2 hover:text-blue-600 text-gray-900"
              itemProp="name"
            >
              <span>{item.question}</span>
              <svg
                className="flex-shrink-0 w-6 h-6 text-blue-500 transition-transform group-open:rotate-180"
                aria-hidden="true"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </summary>

            <div
              className="px-5 pb-5 pt-2 text-base leading-7 text-gray-600"
              itemScope
              itemProp="acceptedAnswer"
              itemType="https://schema.org/Answer"
            >
              <div itemProp="text">{item.answer}</div>
            </div>
          </details>
        ))}
      </div>
    </section>
  )
}
