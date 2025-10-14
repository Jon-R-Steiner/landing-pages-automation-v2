# Step 1: Marketing Review & Approval

## Status Workflow

> **Note:** AI content generation happens **before** this workflow.
> Content is already populated in Airtable when marketing starts their review.

```yaml
Status: Ready for Review (AI already completed)
  ↓ (Marketing manager reviews AI-generated content)
Action: Edit any AI-generated fields if needed (optional)
  ↓ (Manager approves)
Status: Approved
  ↓ (Triggers Step 2: Airtable automation)
```

## What Marketing Reviews

```yaml
Airtable View: "Ready for Review"

Sarah (Marketing Manager) sees:
  ┌──────────────────────────────────────────────┐
  │ Page: bathroom-remodeling/strongsville       │
  │ Status: Ready for Review                     │
  │                                              │
  │ AI-GENERATED CONTENT:                        │
  │ SEO Title: Bathroom Remodeling Strongsville  │
  │           OH | Baths R Us                    │
  │ H1: Transform Your Strongsville Bathroom     │
  │     in Just 2 Weeks                          │
  │ Subheadline: Licensed, insured, and trusted  │
  │             by 500+ homeowners...            │
  │ CTA: Get Free Quote (#contact-form)          │
  │ Hero Image: bathroom-strongsville-01.jpg     │
  │                                              │
  │ Trust Bars:                                  │
  │ • Licensed & Insured in Ohio Since 2010      │
  │ • 4.9★ Rating - 850+ Verified Reviews        │
  │ • Serving Medina County for 15+ Years        │
  │ • Lifetime Craftsmanship Warranty            │
  │ • 0% Financing - 24 Months Available         │
  │                                              │
  │ [View FAQs] [View Gallery Captions]          │
  └──────────────────────────────────────────────┘

Sarah's Actions:
  1. Reviews content quality
  2. OPTIONAL: Edits H1 to "Transform Your Bathroom in Strongsville in 2-3 Weeks"
  3. Approves: Changes Status → "Approved"
```

---
