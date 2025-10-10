# STEP 3: AI Content Generation (Parallel Processing)

## Fetch Page Data + Guardrails

```javascript
async function fetchPageData(pageId) {
  // Fetch page record with all lookups
  const pageRecord = await airtableBase('Pages').find(pageId)

  const service = pageRecord.get('Service')
  const location = pageRecord.get('Location')
  const clientName = pageRecord.get('Client Name')[0]
  const specialInstructions = pageRecord.get('Special Instructions') || ''

  // Fetch branch metadata (from matched branch)
  const branchCity = pageRecord.get('Branch City')
  const branchState = pageRecord.get('Branch State')
  const branchPhone = pageRecord.get('Branch Phone')
  const branchAddress = pageRecord.get('Branch Address')

  // Fetch client data
  const clientRecord = await airtableBase('Clients').find(clientName)
  const clientDomain = clientRecord.get('Domain')
  const primaryPhone = clientRecord.get('Primary Phone')

  // Fetch available CTAs (active, matching service type)
  const ctaRecords = await airtableBase('CTAs')
    .select({
      filterByFormula: `AND(
        {Active} = TRUE(),
        OR(
          FIND("${service}", {Service Types}) > 0,
          FIND("all", {Service Types}) > 0
        )
      )`,
      sort: [{ field: 'Priority', direction: 'asc' }]
    })
    .all()

  const availableCTAs = ctaRecords.map(r => ({
    id: r.id,
    text: r.get('CTA Text'),
    type: r.get('CTA Type'),
    priority: r.get('Priority'),
    notes: r.get('Notes')
  }))

  // Fetch available hero images
  const imageRecords = await airtableBase('Hero Images Library')
    .select({
      filterByFormula: `AND(
        {Active} = TRUE(),
        {Service} = "${service}",
        OR({Location} = "${location}", {Location} = "")
      )`
    })
    .all()

  const availableImages = imageRecords.map(r => ({
    id: r.id,
    filename: r.get('Filename'),
    cloudinaryUrl: r.get('Cloudinary URL'),
    altTextTemplate: r.get('Alt Text Template')
  }))

  return {
    pageId,
    service,
    location: location || 'service area',
    clientName,
    clientDomain,
    specialInstructions,
    branchCity,
    branchState,
    branchPhone,
    branchAddress,
    primaryPhone,
    availableCTAs,
    availableImages
  }
}
```

## Parallel AI Generation

```javascript
async function generateAllContent(pageData) {
  const {
    service,
    location,
    clientName,
    branchCity,
    branchState,
    branchPhone,
    branchAddress,
    specialInstructions,
    availableCTAs,
    availableImages
  } = pageData

  console.log(`🤖 Starting parallel AI generation for ${service}/${location}...`)

  // Build prompts for each content type
  const prompts = {
    hero: buildHeroPrompt(pageData),
    trustBars: buildTrustBarsPrompt(pageData),
    faqs: buildFAQsPrompt(pageData),
    galleryCaptions: buildGalleryPrompt(pageData)
  }

  // Call Claude API in parallel (all 4 requests simultaneously)
  const startTime = Date.now()

  const [heroResult, trustBarsResult, faqsResult, galleryResult] = await Promise.all([
    callClaudeAPI(prompts.hero, 1024),
    callClaudeAPI(prompts.trustBars, 512),
    callClaudeAPI(prompts.faqs, 2048),
    callClaudeAPI(prompts.galleryCaptions, 512)
  ])

  const duration = (Date.now() - startTime) / 1000

  console.log(`✅ All AI content generated in ${duration.toFixed(2)}s`)

  // Parse responses
  const hero = JSON.parse(heroResult.content[0].text)
  const trustBars = JSON.parse(trustBarsResult.content[0].text)
  const faqs = JSON.parse(faqsResult.content[0].text)
  const gallery = JSON.parse(galleryResult.content[0].text)

  // Calculate total tokens
  const totalTokens = [heroResult, trustBarsResult, faqsResult, galleryResult]
    .reduce((sum, r) => sum + r.usage.input_tokens + r.usage.output_tokens, 0)

  return {
    seoTitle: hero.seoTitle,
    seoDescription: hero.seoDescription,
    h1Headline: hero.h1Headline,
    heroSubheadline: hero.heroSubheadline,
    selectedCtaId: hero.selectedCtaId,
    ctaReasoning: hero.ctaReasoning,
    selectedHeroImageId: hero.selectedHeroImageId,
    trustBars: trustBars.signals,
    faqs: faqs.questions,
    galleryCaptions: gallery.captions,
    totalTokens,
    generationDuration: duration,
    model: heroResult.model
  }
}
```

## Hero Content Prompt

```javascript
function buildHeroPrompt(pageData) {
  const {
    service,
    location,
    clientName,
    branchCity,
    branchState,
    specialInstructions,
    availableCTAs,
    availableImages
  } = pageData

  return `Generate landing page hero content for a ${service.replace(/-/g, ' ')} page.

HARD FACTS (MUST USE EXACTLY - No creative freedom):
- Service: ${service.replace(/-/g, ' ')}
- Page Location: ${location}, ${branchState}
- Company: ${clientName}
- Local Branch Office: ${branchCity}, ${branchState}
- Special Requirements: ${specialInstructions || 'None'}

CREATIVE FREEDOM (Your expertise):
- SEO Title (50-60 characters): Include service + location + brand name
  Example: "Bathroom Remodeling Strongsville OH | Baths R Us"

- SEO Description (140-160 characters): Compelling, benefit-focused, local
  Example: "Transform your Strongsville bathroom in 2-3 weeks. Licensed, insured, and trusted by 500+ homeowners. Free quotes from our Medina office."

- H1 Headline (8-12 words): Benefit-driven, emotional hook
  Example: "Transform Your Strongsville Bathroom in Just 2 Weeks"

- Hero Subheadline (15-25 words): Credibility + specificity + local trust
  Example: "Licensed, insured, and trusted by 500+ homeowners across Medina County. Serving Strongsville from our nearby Medina office."

AVAILABLE CTAs (choose ONE that best matches your copy tone):
${availableCTAs.map((cta, i) => `${i + 1}. [ID: ${cta.id}] "${cta.text}" (${cta.type}, Priority ${cta.priority})
   Context: ${cta.notes || 'General use'}`).join('\n\n')}

AVAILABLE HERO IMAGES (choose ONE most relevant):
${availableImages.map((img, i) => `${i + 1}. [ID: ${img.id}] ${img.filename}`).join('\n')}

OUTPUT FORMAT (valid JSON only):
{
  "seoTitle": "...",
  "seoDescription": "...",
  "h1Headline": "...",
  "heroSubheadline": "...",
  "selectedCtaId": "recXXXXX",
  "ctaReasoning": "Brief explanation: why this CTA matches the copy tone and target audience",
  "selectedHeroImageId": "recYYYYY"
}`
}
```

## Trust Bars Prompt

```javascript
function buildTrustBarsPrompt(pageData) {
  const { service, location, branchCity, branchState, clientName } = pageData

  return `Generate 5 trust signals for a ${service.replace(/-/g, ' ')} company.

CONTEXT:
- Service: ${service.replace(/-/g, ' ')}
- Location: ${location}, ${branchState}
- Local Office: ${branchCity}, ${branchState}
- Company: ${clientName}

REQUIREMENTS:
- Each signal: 5-12 words maximum
- Must be specific and credible (realistic numbers)
- Must reference ${branchCity} area or ${branchState}
- NO generic claims ("best", "top-rated" without proof)
- Focus areas: licensing, insurance, years in business, reviews, warranties, financing

EXAMPLES (do NOT copy - create original):
- "Licensed & Insured in Ohio Since 2010"
- "4.9★ Rating - 850+ Verified Reviews"
- "Serving Medina County for 15+ Years"
- "Lifetime Craftsmanship Warranty Included"
- "0% Financing Available - 24 Months"

OUTPUT FORMAT (JSON array of 5 strings):
{
  "signals": [
    "Signal 1",
    "Signal 2",
    "Signal 3",
    "Signal 4",
    "Signal 5"
  ]
}`
}
```

## FAQs Prompt

```javascript
function buildFAQsPrompt(pageData) {
  const { service, location, branchCity, branchState } = pageData

  return `Generate 6 frequently asked questions and answers for ${service.replace(/-/g, ' ')}.

CONTEXT:
- Service: ${service.replace(/-/g, ' ')}
- Location: ${location}, ${branchState}
- Local Office: ${branchCity}, ${branchState}

REQUIREMENTS:
Questions:
  - 8-15 words (natural language, how customers actually ask)
  - Specific to ${location} or ${branchState} when relevant

Answers:
  - 40-80 words
  - Informative and specific
  - Reference ${branchCity} office or ${branchState} regulations when applicable

Topics to cover:
  1. Pricing/cost estimates
  2. Project timeline
  3. Permits (${branchState} specific)
  4. Warranties/guarantees
  5. Materials/quality
  6. Process/how it works

OUTPUT FORMAT (JSON array):
{
  "questions": [
    {
      "question": "How long does a typical bathroom remodel take in Strongsville?",
      "answer": "Most bathroom remodels in the Strongsville area take 2-3 weeks from start to finish. This includes demolition, plumbing and electrical work, tile installation, and final fixtures. Our Medina office coordinates all permits with the Strongsville Building Department, which typically adds 3-5 days to the initial timeline."
    },
    ...
  ]
}`
}
```

## Gallery Captions Prompt

```javascript
function buildGalleryPrompt(pageData) {
  const { service, location } = pageData

  return `Generate 8 professional gallery captions for a ${service.replace(/-/g, ' ')} photo gallery.

CONTEXT:
- Service: ${service.replace(/-/g, ' ')}
- Location: ${location}

REQUIREMENTS:
- Each caption: 6-10 words
- Descriptive and specific (not generic)
- Focus: before/after transformations, process steps, materials, craftsmanship details
- Professional tone (informative, not salesy)

EXAMPLES (create original):
- "Custom subway tile with heated marble flooring"
- "Frameless glass shower with rainfall showerhead"
- "Before: Outdated 1980s bathroom vanity area"
- "After: Modern double-sink floating vanity install"

OUTPUT FORMAT (JSON array):
{
  "captions": [
    "Caption 1",
    "Caption 2",
    ...
  ]
}`
}
```

## Claude API Call Helper

```javascript
async function callClaudeAPI(prompt, maxTokens) {
  return await anthropic.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: maxTokens,
    system: 'You are a marketing expert specializing in home services. Always return valid JSON only. No explanatory text outside JSON.',
    messages: [{
      role: 'user',
      content: prompt
    }]
  })
}
```

## Write Results Back to Airtable

```javascript
async function updateAirtablePage(pageId, aiContent) {
  await airtableBase('Pages').update(pageId, {
    // Hero content
    'SEO Title': aiContent.seoTitle,
    'SEO Description': aiContent.seoDescription,
    'H1 Headline': aiContent.h1Headline,
    'Hero Subheadline': aiContent.heroSubheadline,

    // Selected elements
    'Selected CTA ID': [aiContent.selectedCtaId],
    'Selected Hero Image ID': [aiContent.selectedHeroImageId],
    'CTA Selection Reasoning': aiContent.ctaReasoning,

    // Trust bars
    'Trust Bar 1': aiContent.trustBars[0],
    'Trust Bar 2': aiContent.trustBars[1],
    'Trust Bar 3': aiContent.trustBars[2],
    'Trust Bar 4': aiContent.trustBars[3],
    'Trust Bar 5': aiContent.trustBars[4],

    // Structured content (stored as JSON strings)
    'FAQs': JSON.stringify(aiContent.faqs),
    'Gallery Captions': JSON.stringify(aiContent.galleryCaptions),

    // Metadata
    'AI Generation Timestamp': new Date().toISOString(),
    'AI Model Used': aiContent.model,
    'AI Tokens Used': aiContent.totalTokens
  })

  console.log(`✅ Updated Airtable page ${pageId} with AI content`)
}
```

---
