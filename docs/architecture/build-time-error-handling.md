# Build-Time Error Handling

## Export Script Errors

**Validation before export:**
```typescript
// scripts/export-airtable-to-json.ts
async function exportPages() {
  try {
    console.log('Fetching pages from Airtable...')
    const pages = await fetchApprovedPages()

    // Validation
    if (pages.length === 0) {
      throw new Error('No approved pages found in Airtable')
    }

    // Check required fields
    const invalidPages = pages.filter(p =>
      !p.seoTitle || !p.h1Headline || !p.heroImage
    )

    if (invalidPages.length > 0) {
      throw new Error(
        `${invalidPages.length} pages missing required fields:\n` +
        invalidPages.map(p => `- ${p.pageId}: ${p.service}/${p.location}`).join('\n')
      )
    }

    // Write to file
    const json = JSON.stringify({ pages }, null, 2)
    await fs.promises.writeFile('content.json', json, 'utf-8')

    console.log(`✅ Exported ${pages.length} pages to content.json`)

  } catch (error) {
    console.error('❌ Export failed:', error.message)
    process.exit(1) // Fail the build
  }
}
```

## Lighthouse Quality Gate Errors

**Netlify plugin catches performance issues:**
```yaml
# netlify.toml
[[plugins]]
package = "@netlify/plugin-lighthouse"

  [plugins.inputs.thresholds]
    performance = 90
    accessibility = 90
    best-practices = 90
    seo = 90

  [plugins.inputs.audit_urls]
    "/" = ["mobile", "desktop"]
    "/bathroom-remodeling/charlotte" = ["mobile"]
```

**When Lighthouse fails:**
1. Build aborts (no deploy)
2. Netlify shows error in build log
3. Developer fixes performance issue
4. Re-run build
