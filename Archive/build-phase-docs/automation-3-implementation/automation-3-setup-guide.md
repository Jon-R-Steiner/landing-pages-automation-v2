# Automation 3: Export on Approval - Setup Guide

**Purpose:** Configure GitHub Actions webhook trigger for approved pages
**Status:** Ready for Implementation
**Phase:** 0.3b

---

## Overview

**What This Does:**
When a marketer approves a page (Status → "Approved"), this automation triggers GitHub Actions to export all approved pages to `content.json` and rebuild the site. This is the heart of the "Approval → Live" workflow!

**Timeline:** Approval → Live in ~8 minutes
- Webhook trigger: instant
- GitHub Actions export: ~45s
- Netlify build: ~2min
- Netlify deploy: ~30s

---

## Prerequisites

- ✅ Automation 1 (Branch Matching) implemented and working
- ✅ Test pages exist in Airtable with Status field
- ✅ GitHub repository exists: `Jon-R-Steiner/landing-pages-automation-v2`
- ⚠️ GitHub Actions workflow ready (will be created in Phase 0.3b)

---

## Step 1: Create GitHub Personal Access Token (PAT)

**Before setting up the automation, you need a GitHub token:**

1. Go to: https://github.com/settings/tokens
2. Click **"Generate new token (classic)"**
3. **Note:** `Airtable Export Automation`
4. **Expiration:** 90 days (or No expiration if you prefer)
5. **Scopes:** Check ONLY these:
   - ✅ `repo` (Full control of private repositories)
6. Click **"Generate token"**
7. **COPY THE TOKEN IMMEDIATELY** - You won't see it again!
   - Format: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
8. Store it safely in password manager (you'll need it in Step 4)

---

## Step 2: Open Airtable Automations

1. Go to Airtable base: `appATvatPtaoJ8MmS`
2. Click **"Automations"** button in top-right toolbar
3. Click **"Create automation"**
4. Name it: **"Trigger GitHub Actions on Approval"**

---

## Step 3: Configure Trigger

1. **Trigger Type:** Select **"When record matches conditions"**
2. **Table:** Select **"Pages"**
3. **Conditions:** Click **"Add condition"**
   - Condition 1: `Status` **is** `Approved`
   - Condition 2: `SEO Title` **is not empty**
   - Condition 3: `H1 Headline` **is not empty**
4. **When to trigger:** Select **"When condition is newly met"**
   - This ensures it only fires when Status CHANGES to Approved (not every time)

**Screenshot checkpoint:** Your trigger should show:
```
When record matches conditions
Table: Pages
Conditions:
  - Status is Approved
  - SEO Title is not empty
  - H1 Headline is not empty
When: When condition is newly met
```

**Why these conditions?**
- `Status is Approved` → Only export approved pages
- `SEO Title is not empty` → Ensures page has minimum required content
- `H1 Headline is not empty` → Ensures page has minimum required content
- `When condition is newly met` → Prevents duplicate triggers on re-saves

---

## Step 4: Add Webhook Action

1. Click **"+ Add action"**
2. Select **"Send webhook"**
3. **Method:** POST
4. **URL:**
   ```
   https://api.github.com/repos/Jon-R-Steiner/landing-pages-automation-v2/dispatches
   ```
   *(Replace `Jon-R-Steiner` with your GitHub username if different)*

5. **Headers:** Click **"Add header"** (add these 3 headers):

   **Header 1:**
   - Name: `Authorization`
   - Value: `Bearer ghp_YOUR_TOKEN_HERE`
     *(Replace with the GitHub PAT you created in Step 1)*

   **Header 2:**
   - Name: `Accept`
   - Value: `application/vnd.github.v3+json`

   **Header 3:**
   - Name: `Content-Type`
   - Value: `application/json`

6. **Body:** Select **"JSON"** and paste this:
   ```json
   {
     "event_type": "airtable_export",
     "client_payload": {
       "trigger": "page_approved",
       "page_id": "{{[Trigger] Record ID}}",
       "service": "{{[Trigger] Service}}",
       "location": "{{[Trigger] Location}}",
       "timestamp": "{{[Trigger] Last Modified}}"
     }
   }
   ```

   **Dynamic Field Instructions:**
   - Click in the JSON body where it says `{{[Trigger] Record ID}}`
   - Delete the placeholder text
   - Click **"+"** button → Select **"Record ID"** from the Pages trigger
   - Repeat for Service, Location, and Last Modified fields

**What this does:** Sends a webhook to GitHub Actions API telling it "A page was approved, please export Airtable data."

---

## Step 5: Test Automation

**⚠️ IMPORTANT:** You can't fully test this until GitHub Actions workflow is set up. For now, we'll do a partial test.

1. Click **"Test"** button
2. Select a test Pages record with:
   - Status = "Approved"
   - SEO Title filled
   - H1 Headline filled
3. Click **"Run test"**
4. **Check for errors:**
   - If webhook fails with "404 Not Found" → That's OK! GitHub Actions workflow doesn't exist yet.
   - If webhook fails with "401 Unauthorized" → Check your PAT token in Authorization header
   - If webhook succeeds (200 OK) → Perfect! ✅

**Expected Result:** Webhook will fail with 404 until GitHub Actions workflow exists. That's expected and OK!

---

## Step 6: Turn On Automation

1. Click **"Turn on"** toggle in top-right
2. Status should show: **"Active"**

**Note:** This automation will start working properly once the GitHub Actions workflow is created in Phase 0.3b.

---

## Test Data Requirements

**Test Page for Automation 3:**
```
Client Name: Baths R Us (linked)
Service ID: Bathroom Remodeling (linked)
Location ID: Strongsville (linked)
Status: Approved ← REQUIRED
SEO Title: Bathroom Remodeling Strongsville OH | Baths R Us ← REQUIRED
H1 Headline: Transform Your Strongsville Bathroom ← REQUIRED
Matched Branch: Medina Office (linked) - auto-filled by Automation 1
Selected CTA ID: Get Free Quote (linked)
Selected Hero Image ID: bathroom-generic-hero-01.jpg (linked)
Trust Bar 1: Licensed & Insured in Ohio Since 2010
Trust Bar 2: 4.9★ Rating - 850+ Verified Reviews
Trust Bar 3: Serving Medina County for 15+ Years
Trust Bar 4: Lifetime Craftsmanship Warranty
Trust Bar 5: 0% Financing Available - 24 Months
```

---

## Testing Checklist

- [ ] GitHub Personal Access Token created and stored
- [ ] Webhook configured with correct URL and headers
- [ ] Test page exists with Status = Approved + SEO fields filled
- [ ] Test automation (expect 404 until GitHub Actions exists)
- [ ] Turn on automation
- [ ] Full test will happen in Phase 0.3b after GitHub Actions setup

---

## Troubleshooting

### Problem: Webhook returns 401 Unauthorized

**Solutions:**
1. Check GitHub PAT is correct in Authorization header
2. Verify PAT has `repo` scope enabled
3. Check PAT hasn't expired
4. Verify no extra spaces in Bearer token value

### Problem: Webhook returns 404 Not Found

**Solution:** This is EXPECTED right now. GitHub Actions workflow doesn't exist yet. Will work in Phase 0.3b.

### Problem: Webhook returns 403 Forbidden

**Solution:** Check GitHub repository settings - ensure Actions are enabled

### Problem: Automation triggers multiple times for same approval

**Solution:**
- Check trigger is set to "When condition is newly met" (not "Each time")
- Verify you're not re-saving approved pages (each save re-triggers)

---

## Next Steps

Once automation is configured:

1. ✅ **Automation is active** - Ready for GitHub Actions integration
2. ⏭️ **Phase 0.3b** - Dev creates GitHub Actions workflow
3. ⏭️ **Integration testing** - Approve test page, verify export works
4. ⏭️ **Production ready** - Approval → Live workflow complete

---

## Security Notes

**GitHub Personal Access Token:**
- ✅ Store securely in password manager
- ✅ Set expiration (90 days recommended)
- ✅ Use minimal permissions (only `repo` scope)
- ❌ Never commit to Git
- ❌ Never share publicly

**Airtable Access:**
- Automation runs with base permissions
- No external API key needed (runs within Airtable)
- GitHub receives only minimal page metadata (no sensitive data)

---

## Architecture Notes

**Webhook Flow:**
```
Airtable Automation (Status → Approved)
  ↓
GitHub Actions API (repository_dispatch event)
  ↓
GitHub Actions Workflow (.github/workflows/airtable-export.yml)
  ↓
Export Script (fetches from Airtable, generates content.json)
  ↓
Git Commit + Push
  ↓
Netlify Auto-Deploy (triggered by push to main)
  ↓
Live Site Updated ✅
```

**Why repository_dispatch?**
- Allows external services (Airtable) to trigger GitHub Actions
- Passes custom payload (page_id, service, location) for targeted exports
- More secure than GitHub webhooks (requires PAT with repo scope)
- Can be tested independently from Airtable

---

**Guide Version:** 1.0
**Author:** Winston (Architect)
**Date:** 2025-10-11
**Phase:** 0.3b - Export Automation Setup
