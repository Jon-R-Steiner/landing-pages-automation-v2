/**
 * Date Utility Helpers
 *
 * Build-time date utilities for dynamic content generation.
 * These functions run during the Next.js build process, not at runtime.
 *
 * Usage: AI Max/PMax promo dates that update monthly via GitHub Actions
 */

/**
 * Get the last day of the current month formatted as "MMM DD"
 *
 * Examples:
 * - January → "Jan 31"
 * - February (non-leap year) → "Feb 28"
 * - February (leap year) → "Feb 29"
 * - December → "Dec 31"
 *
 * @returns Formatted string like "Jan 31" or "Feb 28"
 *
 * Note: This runs at build time. To keep dates current, rebuild the site
 * monthly using the GitHub Actions workflow (runs 1st of each month at 2am).
 */
export function getEndOfMonthFormatted(): string {
  // Get current date at build time
  const now = new Date()

  // Get the last day of current month
  // Set date to 1st of next month, then subtract 1 day
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)

  // Format as "MMM DD"
  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ]

  const monthName = monthNames[lastDay.getMonth()]
  const day = lastDay.getDate()

  return `${monthName} ${day}`
}

/**
 * Get the current month and year formatted as "MMMM YYYY"
 *
 * Examples:
 * - January 2025 → "January 2025"
 * - December 2024 → "December 2024"
 *
 * @returns Formatted string like "January 2025"
 */
export function getCurrentMonthYear(): string {
  const now = new Date()

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]

  const monthName = monthNames[now.getMonth()]
  const year = now.getFullYear()

  return `${monthName} ${year}`
}

/**
 * Check if the build date is stale (more than 35 days old)
 *
 * This can be used to warn if the site hasn't been rebuilt in over a month,
 * meaning the promo dates may be outdated.
 *
 * @param buildDate - The date the site was built (from export metadata)
 * @returns true if build is more than 35 days old
 */
export function isBuildDateStale(buildDate: string): boolean {
  const build = new Date(buildDate)
  const now = new Date()
  const daysDiff = Math.floor((now.getTime() - build.getTime()) / (1000 * 60 * 60 * 24))

  return daysDiff > 35
}
