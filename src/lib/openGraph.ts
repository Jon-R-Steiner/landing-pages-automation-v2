/**
 * Open Graph and Twitter Card Metadata Generation
 *
 * Functions to generate Open Graph metadata for social sharing optimization
 * and Google Ads AI Max/PMax campaigns.
 *
 * Open Graph Protocol: https://ogp.me/
 * Twitter Cards: https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards
 *
 * CRITICAL: All metadata MUST come from Airtable (no generated content)
 */

import type { OpenGraphMetadata } from '@/types/structured-data'

/**
 * Generate Open Graph and Twitter Card metadata
 *
 * Creates complete Open Graph metadata tags for social sharing
 * and Twitter Card previews. All data comes from Airtable.
 *
 * @param seoTitle - SEO Title from Pages.SEO Title (50-60 characters)
 * @param seoDescription - SEO Description from Pages.SEO Description (150-160 characters)
 * @param canonicalUrl - Canonical URL of the page
 * @param heroImageUrl - Hero Image URL (optional, recommended 1200x630px)
 * @param clientName - Client Name for og:site_name
 * @returns OpenGraphMetadata object with all meta tags
 */
export function generateOpenGraphMetadata({
  seoTitle,
  seoDescription,
  canonicalUrl,
  heroImageUrl,
  clientName,
}: {
  seoTitle: string
  seoDescription: string
  canonicalUrl: string
  heroImageUrl?: string
  clientName: string
}): OpenGraphMetadata {
  // Validation: Ensure required fields present
  if (!seoTitle || !seoDescription || !canonicalUrl || !clientName) {
    throw new Error(
      'Missing required fields for Open Graph metadata. ' +
        'All fields must come from Airtable Pages table (no placeholders).'
    )
  }

  // Validation: Warn if SEO title too long (Twitter truncates at 70 chars)
  if (seoTitle.length > 70) {
    console.warn(
      `SEO Title is ${seoTitle.length} characters (exceeds Twitter's 70 char limit). ` +
        `Title will be truncated in Twitter previews: "${seoTitle}"`
    )
  }

  // Validation: Warn if SEO description too long (Twitter truncates at 200 chars)
  if (seoDescription.length > 200) {
    console.warn(
      `SEO Description is ${seoDescription.length} characters (exceeds Twitter's 200 char limit). ` +
        `Description will be truncated in Twitter previews.`
    )
  }

  return {
    // Open Graph Protocol
    'og:title': seoTitle,
    'og:description': seoDescription,
    'og:url': canonicalUrl,
    'og:type': 'website',
    'og:image': heroImageUrl,
    'og:image:width': heroImageUrl ? '1200' : undefined,
    'og:image:height': heroImageUrl ? '630' : undefined,
    'og:locale': 'en_US',
    'og:site_name': clientName,

    // Twitter Card
    'twitter:card': 'summary_large_image',
    'twitter:title': seoTitle,
    'twitter:description': seoDescription,
    'twitter:image': heroImageUrl,
  }
}

/**
 * Convert OpenGraphMetadata object to HTML meta tags
 *
 * Utility function to convert the metadata object into HTML meta tag strings.
 * Useful for server-side rendering or static site generation.
 *
 * @param metadata - OpenGraphMetadata object
 * @returns Array of HTML meta tag strings
 */
export function openGraphToMetaTags(metadata: OpenGraphMetadata): string[] {
  const tags: string[] = []

  // Iterate over all metadata properties
  Object.entries(metadata).forEach(([property, content]) => {
    // Skip undefined values
    if (content === undefined) return

    // Determine if this is Open Graph or Twitter
    const attribute = property.startsWith('og:') ? 'property' : 'name'

    // Create meta tag
    tags.push(`<meta ${attribute}="${property}" content="${escapeHtml(content)}" />`)
  })

  return tags
}

/**
 * Validate hero image dimensions for social sharing
 *
 * Checks if hero image meets recommended dimensions for Open Graph and Twitter Cards.
 * Recommended: 1200x630px (1.91:1 ratio)
 * Minimum: 600x315px
 *
 * @param imageUrl - Hero Image URL
 * @returns Validation warnings (empty array if all good)
 */
export async function validateHeroImageDimensions(
  imageUrl: string
): Promise<string[]> {
  const warnings: string[] = []

  // NOTE: This is a placeholder for actual image dimension checking
  // In a real implementation, you would:
  // 1. Fetch the image
  // 2. Check dimensions using an image library
  // 3. Return warnings if dimensions are suboptimal

  // For now, just warn if URL is missing
  if (!imageUrl) {
    warnings.push(
      'No hero image URL provided. Social sharing previews will not have an image. ' +
        'For best results, add a hero image (recommended: 1200x630px).'
    )
  }

  return warnings
}

/**
 * Escape HTML special characters in content
 *
 * Prevents XSS attacks by escaping special HTML characters in meta tag content.
 *
 * @param text - Text to escape
 * @returns Escaped text safe for HTML
 */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  }

  return text.replace(/[&<>"']/g, (char) => map[char] || char)
}

/**
 * Generate structured data script tag for embedding in HTML
 *
 * Converts a structured data object (Service Schema, LocalBusiness Schema, etc.)
 * into an HTML script tag string for embedding in the page <head>.
 *
 * @param structuredData - Structured data object (ServiceSchema, LocalBusinessSchema, etc.)
 * @returns HTML script tag string with JSON-LD
 */
export function structuredDataToScriptTag(
  structuredData: Record<string, unknown>
): string {
  // Serialize to JSON with 2-space indentation for readability
  const jsonLD = JSON.stringify(structuredData, null, 2)

  // Create script tag
  return `<script type="application/ld+json">\n${jsonLD}\n</script>`
}
