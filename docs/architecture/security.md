# Security

## Environment Variables

**Never commit secrets to Git:**
```bash
# .gitignore (ensure these are present)
.env.local
.env*.local
*.pem
*.key
```

**Required environment variables:**
```bash
# Build-time (server-side only)
AIRTABLE_API_KEY=patXXXXXXXXXXXXXX
AIRTABLE_BASE_ID=appXXXXXXXXXXXXXX
ANTHROPIC_API_KEY=sk-ant-XXXXXXXXXXXXXXXX

# Runtime (client-side - public)
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6LcXXXXXXXXXXXXX
NEXT_PUBLIC_MAKE_WEBHOOK_URL=https://hook.us1.make.com/XXXXXXXX
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
```

**Rules:**
- ✅ Server-side secrets: NO `NEXT_PUBLIC_` prefix
- ✅ Client-side values: MUST have `NEXT_PUBLIC_` prefix
- ✅ Obscure webhook URLs acceptable (not guessable)
- ❌ NEVER expose API keys to client-side

## API Key Security

**Airtable API:**
- Store in `.env.local` (gitignored)
- Use build-time only (no runtime access)
- Rotate periodically (every 90 days)

**Claude API:**
- Store in `.env.local` (gitignored)
- Use build-time only
- Monitor usage (prevent overages)

**reCAPTCHA:**
- Site key: Public (safe to expose)
- Secret key: Stored in Make.com (never in Git)
- Verify server-side (Make.com scenario)

## Content Security

**Headers (Netlify):**
```toml
# netlify.toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "geolocation=(), microphone=(), camera=()"
```

## Form Security

**Client-side validation + Server-side verification:**
- Client: Basic validation (required fields, email format)
- Server (Make.com): reCAPTCHA verification, TCPA compliance check

**Rate limiting:**
- Make.com: Built-in rate limiting per IP
- Honeypot field: Catch bots (hidden field)
