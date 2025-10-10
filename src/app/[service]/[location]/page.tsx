import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Hero from '@/components/Hero'
import type { PageParams, PageData } from '@/types/page.types'

// Hardcoded test data (replaces Airtable in Phase 0.3+)
const SAMPLE_PAGES: PageData[] = [
  {
    service: 'bathroom-remodeling',
    location: 'chicago-il',
    title: 'Bathroom Remodeling in Chicago, IL',
    description: 'Professional bathroom remodeling services in Chicago, Illinois. Licensed & insured contractors.',
  },
  {
    service: 'walk-in-showers',
    location: 'naperville-il',
    title: 'Walk-In Showers in Naperville, IL',
    description: 'Custom walk-in shower installation in Naperville, Illinois. Expert craftsmanship.',
  },
  {
    service: 'tub-to-shower',
    location: 'aurora-il',
    title: 'Tub to Shower Conversion in Aurora, IL',
    description: 'Convert your old tub to a modern shower in Aurora, Illinois. Quick turnaround.',
  },
]

// CRITICAL: Next.js 15 requires this for static export
export async function generateStaticParams() {
  return SAMPLE_PAGES.map((page) => ({
    service: page.service,
    location: page.location,
  }))
}

// Dynamic metadata generation
export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>
}): Promise<Metadata> {
  // Next.js 15 breaking change: params is now async
  const { service, location } = await params

  const pageData = SAMPLE_PAGES.find(
    (p) => p.service === service && p.location === location
  )

  if (!pageData) {
    return {
      title: 'Page Not Found',
    }
  }

  return {
    title: pageData.title,
    description: pageData.description,
  }
}

// Page component
export default async function ServiceLocationPage({
  params,
}: {
  params: Promise<PageParams>
}) {
  // Next.js 15 breaking change: params is now async
  const { service, location } = await params

  const pageData = SAMPLE_PAGES.find(
    (p) => p.service === service && p.location === location
  )

  if (!pageData) {
    notFound()
  }

  return (
    <main>
      <Hero title={pageData.title} description={pageData.description} />
      <section className="max-w-4xl mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold mb-6">About This Page</h2>
        <p className="text-lg mb-4">
          This is a dynamically generated page using Next.js 15's{' '}
          <code className="bg-gray-100 px-2 py-1 rounded">generateStaticParams()</code> function.
        </p>
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="font-semibold mb-2">Page Data:</h3>
          <ul className="space-y-1 text-sm font-mono">
            <li>Service: {service}</li>
            <li>Location: {location}</li>
          </ul>
        </div>
      </section>
    </main>
  )
}
