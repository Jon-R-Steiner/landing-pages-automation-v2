# STEP 7: Netlify Auto-Deploy

## Netlify Configuration

```toml
# netlify.toml

[build]
  command = "npm run build"
  publish = "out"

[build.environment]
  NODE_VERSION = "20"

# Netlify automatically watches GitHub main branch
# No build hooks needed - deploys on every git push
```

## Next.js Build Process

```json
// package.json

{
  "scripts": {
    "export": "node scripts/export-airtable-to-json.js",
    "validate-content": "node scripts/validate-content.js",
    "build": "next build && next export"
  }
}
```

## Next.js Static Export

```javascript
// next.config.js

module.exports = {
  output: 'export',
  images: {
    unoptimized: true, // Required for static export
    domains: ['res.cloudinary.com']
  }
}
```

---
