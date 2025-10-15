# 3. Form Submission Workflow

**Flow:** User → Make.com → Salesforce → Notifications

**Implementation Phase:** Phase 0.6 (Planned)

```
STEP 1: User completes 3-stage form
  ↓
STEP 2: Client-side POST to Make.com webhook
  ↓
STEP 3: Make.com Scenario (10 steps)
  1. Receive webhook payload
  2. Verify reCAPTCHA token (server-side)
  3. Validate required fields
  4. Look up client config in Airtable
  5. Map form fields to Salesforce Lead object
  6. Check for duplicate lead (email/phone)
  7. Create or update Salesforce Lead
  8. Tag with campaign ID and UTM parameters
  9. Send confirmation email to user
  10. Notify sales team (Slack/email)
  ↓
STEP 4: Salesforce Assignment Rules
  - Territory-based lead routing
  - Auto-assign to sales rep
  - Trigger follow-up task creation
```

**Key Features:**
- ✅ Server-side reCAPTCHA validation (score threshold >0.5)
- ✅ Duplicate lead prevention
- ✅ Multi-client support (Airtable lookup determines Salesforce org)
- ✅ UTM parameter preservation (campaign attribution)

---

## Technical Implementation Details

**For developers implementing this workflow:**

See the complete technical specification: **[docs/integrations/salesforce-integration-strategy.md](../../integrations/salesforce-integration-strategy.md)**

The integration document provides:
- Complete parameter specifications (30+ fields)
- Production-ready code examples
- Error handling patterns
- Cost analysis
- Environment configuration
- Implementation checklist

**Separation of Concerns:**
- **This document** (workflow) = Operational process for marketing/ops teams
- **Integration doc** (technical) = Implementation guide for developers
