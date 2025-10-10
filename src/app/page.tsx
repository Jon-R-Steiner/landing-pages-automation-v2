import Hero from '@/components/Hero'

export default function HomePage() {
  return (
    <main>
      <Hero
        title="Welcome to Landing Pages Automation v2"
        description="Phase 0.2 Deployment Baseline - Next.js 15 + Tailwind CSS v4"
      />
      <section className="max-w-4xl mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold mb-6">Deployment Baseline Features</h2>
        <ul className="space-y-4 text-lg">
          <li>✅ Next.js 15 App Router with static export</li>
          <li>✅ TypeScript strict mode enabled</li>
          <li>✅ Tailwind CSS v4 with CSS-first configuration</li>
          <li>✅ Dynamic routes via generateStaticParams()</li>
          <li>✅ Deployed to Netlify CDN</li>
          <li>✅ Core Web Vitals optimized (LCP &lt;2.5s)</li>
        </ul>
      </section>
    </main>
  )
}
