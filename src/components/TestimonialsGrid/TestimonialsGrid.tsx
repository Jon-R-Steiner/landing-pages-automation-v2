import type { TestimonialItem } from '@/types/content-data'

interface TestimonialsGridProps {
  testimonials: TestimonialItem[]
}

/**
 * TestimonialsGrid Component
 *
 * Displays customer testimonials in a responsive grid layout with ratings,
 * customer information, and social proof elements.
 *
 * Responsive Layout:
 * - Mobile (<768px): 1 column
 * - Tablet (≥768px): 2 columns
 * - Desktop (≥1440px): 3 columns
 *
 * Features:
 * - Star rating display (1-5 stars)
 * - Customer photos with fallback avatars
 * - Text truncation (200 words max)
 * - WCAG 2.1 AA accessible
 * - Server Component (zero client JS)
 */
export default function TestimonialsGrid({ testimonials }: TestimonialsGridProps) {
  // Validate and filter testimonials for required fields
  const validTestimonials = testimonials.filter(
    (t) =>
      t.customerName &&
      t.rating &&
      typeof t.rating === 'number' &&
      t.rating >= 1 &&
      t.rating <= 5 &&
      t.reviewText &&
      t.reviewText.trim() !== ''
  )

  // Show either 3 or 6 testimonials based on availability
  // If we have 6+, show 6; if we have 3-5, show 3; if fewer than 3, show none
  let displayTestimonials: TestimonialItem[] = []

  if (validTestimonials.length >= 6) {
    displayTestimonials = validTestimonials.slice(0, 6)
  } else if (validTestimonials.length >= 3) {
    displayTestimonials = validTestimonials.slice(0, 3)
  } else {
    return null // Need at least 3 testimonials to display
  }

  return (
    <section aria-label="Customer testimonials" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          What Our Customers Say
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {displayTestimonials.map((testimonial, index) => (
            <article
              key={index}
              className="bg-white p-6 rounded-lg shadow-md flex flex-col gap-4"
            >
              {/* Header: Photo + Name + Location */}
              <div className="flex items-start gap-3">
                {/* Customer Photo or Fallback */}
                {testimonial.photoUrl && testimonial.photoUrl.trim() !== '' ? (
                  <img
                    src={testimonial.photoUrl}
                    alt={`${testimonial.customerName} photo`}
                    className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-lg flex-shrink-0">
                    {getInitials(testimonial.customerName)}
                  </div>
                )}

                {/* Customer Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg text-gray-900 truncate">
                    {testimonial.customerName}
                  </h3>
                  <p className="text-sm text-gray-600 truncate">
                    {testimonial.city}, {testimonial.state}
                  </p>
                </div>
              </div>

              {/* Star Rating */}
              <div
                className="flex items-center gap-1"
                aria-label={`Rating: ${testimonial.rating} out of 5 stars`}
              >
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={i < testimonial.rating ? 'text-yellow-500' : 'text-gray-300'}
                    aria-hidden="true"
                  >
                    {i < testimonial.rating ? '★' : '☆'}
                  </span>
                ))}
              </div>

              {/* Review Title (if available) */}
              {testimonial.reviewTitle && testimonial.reviewTitle.trim() !== '' && (
                <h4 className="font-medium text-gray-900">
                  {testimonial.reviewTitle}
                </h4>
              )}

              {/* Review Text (truncated to 200 words) */}
              <p className="text-gray-700 leading-relaxed">
                {truncateText(testimonial.reviewText, 200)}
              </p>

              {/* Footer: Date + Source */}
              <div className="flex items-center justify-between text-sm text-gray-500 mt-auto pt-2 border-t border-gray-200">
                <span>{formatDate(testimonial.reviewDate)}</span>
                <span>{testimonial.source}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

/**
 * Get customer initials from full name
 * @param name - Customer full name
 * @returns Uppercase initials (e.g., "John Doe" → "JD")
 */
function getInitials(name: string): string {
  const parts = name.trim().split(' ')
  const first = parts[0]?.[0] || ''
  const last = parts[parts.length - 1]?.[0] || ''
  return (first + last).toUpperCase()
}

/**
 * Truncate text to maximum word count
 * @param text - Review text to truncate
 * @param maxWords - Maximum number of words (default: 200)
 * @returns Truncated text with ellipsis if needed
 */
function truncateText(text: string, maxWords: number): string {
  const words = text.trim().split(/\s+/)
  if (words.length <= maxWords) {
    return text
  }
  return words.slice(0, maxWords).join(' ') + '...'
}

/**
 * Format ISO date string to readable format
 * @param isoDate - ISO date string (e.g., "2025-01-15T00:00:00.000Z")
 * @returns Formatted date (e.g., "Jan 15, 2025")
 */
function formatDate(isoDate: string): string {
  try {
    const date = new Date(isoDate)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return 'Date unavailable'
  }
}
