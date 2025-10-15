export default function HomePage() {
  return (
    <main>
      <section className="bg-gradient-to-r from-sky-500 to-purple-500 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Welcome to Landing Pages Automation v2
          </h1>
          <p className="text-xl text-white/90 mb-8">
            Phase 0.2 Deployment Baseline - Next.js 15 + Tailwind CSS v4
          </p>
        </div>
      </section>

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
