# Step 3: GitHub Actions Export Workflow

## Workflow File

```yaml
# .github/workflows/export-and-deploy.yml

name: Export Airtable & Deploy

on:
  repository_dispatch:
    types: [airtable_export]
  workflow_dispatch: # Manual trigger option in GitHub UI

jobs:
  export-airtable:
    name: Export Airtable to JSON
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Export Airtable to JSON
        env:
          AIRTABLE_API_KEY: ${{ secrets.AIRTABLE_API_KEY }}
          AIRTABLE_BASE_ID: ${{ secrets.AIRTABLE_BASE_ID }}
        run: npm run export

      - name: Validate content.json
        run: npm run validate-content

      - name: Commit content.json
        run: |
          git config user.name "GitHub Actions Bot"
          git config user.email "actions@github.com"
          git add content.json

          # Only commit if there are changes
          if git diff --staged --quiet; then
            echo "No changes to commit"
          else
            git commit -m "Update content.json from Airtable export

            Triggered by: ${{ github.event.client_payload.trigger }}
            Page: ${{ github.event.client_payload.service }}/${{ github.event.client_payload.location }}
            Timestamp: ${{ github.event.client_payload.timestamp }}

            🤖 Automated export via GitHub Actions"

            git push origin main
          fi
```

## Export Script

```javascript
// scripts/export-airtable-to-json.js

import Airtable from 'airtable'
import fs from 'fs/promises'

const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY
}).base(process.env.AIRTABLE_BASE_ID)

console.log('🔗 Connecting to Airtable...')

async function exportAirtableData() {
  const startTime = Date.now()

  // Fetch all tables in parallel
  const [clients, pages] = await Promise.all([
    fetchClients(),
    fetchApprovedPages()
  ])

  // Build output structure
  const outputData = {
    clients,
    pages,
    exportMetadata: {
      exportDate: new Date().toISOString(),
      totalPages: pages.length,
      totalClients: clients.length,
      exportDurationMs: Date.now() - startTime
    }
  }

  // Write to file
  await fs.writeFile(
    './content.json',
    JSON.stringify(outputData, null, 2),
    'utf-8'
  )

  const fileSize = (JSON.stringify(outputData).length / 1024).toFixed(2)

  console.log(`\n✅ Export complete!`)
  console.log(`📁 File: content.json`)
  console.log(`📊 Size: ${fileSize} KB`)
  console.log(`📄 Pages: ${pages.length}`)
  console.log(`👥 Clients: ${clients.length}`)
  console.log(`⏱️  Duration: ${((Date.now() - startTime) / 1000).toFixed(2)}s`)
}

async function fetchClients() {
  console.log('👥 Fetching Clients...')

  const records = await base('Clients')
    .select({
      filterByFormula: '{Active} = TRUE()',
      fields: [
        'Client Name', 'Domain', 'Primary Color', 'Secondary Color',
        'Logo URL', 'Google Fonts', 'Primary Phone', 'Primary Email',
        'GTM Container ID', 'CallRail Swap Target',
        'Make.com Webhook URL', 'reCAPTCHA Site Key',
        'Salesforce Campaign ID'
      ]
    })
    .all()

  console.log(`   ✓ Fetched ${records.length} clients`)

  return records.map(record => ({
    clientId: record.id,
    clientName: record.get('Client Name'),
    domain: record.get('Domain'),
    branding: {
      primaryColor: record.get('Primary Color'),
      secondaryColor: record.get('Secondary Color'),
      logoUrl: record.get('Logo URL'),
      googleFonts: record.get('Google Fonts') || 'Inter'
    },
    contact: {
      phone: record.get('Primary Phone'),
      email: record.get('Primary Email')
    },
    tracking: {
      gtmId: record.get('GTM Container ID'),
      callrailSwapTarget: record.get('CallRail Swap Target'),
      recaptchaSiteKey: record.get('reCAPTCHA Site Key'),
      salesforceCampaignId: record.get('Salesforce Campaign ID')
    },
    webhooks: {
      makeWebhookUrl: record.get('Make.com Webhook URL')
    }
  }))
}

async function fetchApprovedPages() {
  console.log('📄 Fetching Approved Pages...')

  const records = await base('Pages')
    .select({
      filterByFormula: '{Status} = "Approved"',
      fields: [
        'Service', 'Location', 'Client Name', 'Page URL',
        'SEO Title', 'SEO Description',
        'H1 Headline', 'Hero Subheadline',
        'CTA Text', 'CTA Action Type', 'CTA Action Value',
        'Hero Image URL', 'Hero Image Alt Text',
        'Trust Bar 1', 'Trust Bar 2', 'Trust Bar 3', 'Trust Bar 4', 'Trust Bar 5',
        'FAQs', 'Gallery Captions',
        'Branch City', 'Branch State', 'Branch Phone', 'Branch Address', 'Branch Email',
        'Last Modified'
      ],
      sort: [{ field: 'Client Name', direction: 'asc' }]
    })
    .all()

  console.log(`   ✓ Fetched ${records.length} approved pages`)

  return records.map(record => ({
    pageId: record.id,
    service: record.get('Service'),
    location: record.get('Location') || null,
    clientName: record.get('Client Name')[0],
    url: record.get('Page URL'),
    seo: {
      title: record.get('SEO Title'),
      description: record.get('SEO Description')
    },
    hero: {
      h1: record.get('H1 Headline'),
      subheadline: record.get('Hero Subheadline'),
      cta: {
        text: record.get('CTA Text'),
        actionType: record.get('CTA Action Type'),
        actionValue: record.get('CTA Action Value')
      },
      imageUrl: record.get('Hero Image URL'),
      imageAlt: record.get('Hero Image Alt Text')
    },
    trustBars: [
      record.get('Trust Bar 1'),
      record.get('Trust Bar 2'),
      record.get('Trust Bar 3'),
      record.get('Trust Bar 4'),
      record.get('Trust Bar 5')
    ].filter(Boolean),
    faqs: JSON.parse(record.get('FAQs') || '[]'),
    galleryCaptions: JSON.parse(record.get('Gallery Captions') || '[]'),
    branchMetadata: {
      city: record.get('Branch City'),
      state: record.get('Branch State'),
      phone: record.get('Branch Phone'),
      address: record.get('Branch Address'),
      email: record.get('Branch Email')
    },
    lastModified: record.get('Last Modified')
  }))
}

// Execute
exportAirtableData().catch(error => {
  console.error('❌ Export failed:', error)
  process.exit(1)
})
```

---
