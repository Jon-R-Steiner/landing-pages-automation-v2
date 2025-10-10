# Environment Variables

**Required Variables:**

```bash
# .env.local (Development)
AIRTABLE_API_KEY=keyXXXXXXXXXXXXXX
AIRTABLE_BASE_ID=appXXXXXXXXXXXXXX
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxx
NEXT_PUBLIC_MAKE_WEBHOOK_URL=https://hook.us1.make.com/xxxxx
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6LcXXXXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
NEXT_PUBLIC_CALLRAIL_COMPANY_ID=123456789
NEXT_PUBLIC_CALLRAIL_SCRIPT_ID=987654321
NEXT_PUBLIC_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
```

**Security Notes:**
- `NEXT_PUBLIC_*` variables are exposed to client-side code (safe for public keys)
- Airtable/Anthropic keys are build-time only (never exposed to client)
- Make.com webhook URL is obscure (not guessable), verified via reCAPTCHA server-side

---
