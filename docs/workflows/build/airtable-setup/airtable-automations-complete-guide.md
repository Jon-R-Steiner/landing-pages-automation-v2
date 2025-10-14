# Airtable Automations - Complete Setup Guide

**Purpose**: Step-by-step checklist for implementing ALL Airtable automations
**Version**: 1.0
**Phase**: 0.3b - 0.4
**Date**: 2025-10-11

---

## 📋 Master Progress Tracker

Track your overall progress across all automations:

- [x] **Automation 0**: Set Default Values (CRITICAL) ✅ **TESTED & WORKING**
- [ ] **Automation 3**: Export on Approval (CRITICAL)
- [ ] **Automation 4**: Clear Matched Branch When Location Removed
- [ ] **Automation 6**: Set Publish Metadata on Approval
- [ ] **Automation 2**: Trigger AI Generation (FUTURE - Phase 0.4)
- [ ] **Automation 5**: Validate Before AI Processing (FUTURE)
- [ ] **Automation 7**: Warn About Expired Offers (FUTURE)

**Current Status**: 1 of 7 automations complete

---

## 🎯 Implementation Priority Order

Work through automations in this order:

### Phase 0.3b (NOW - Critical for Production)
1. **Automation 0** - Set Default Values ← **START HERE**
2. **Automation 3** - Export on Approval ← **DO SECOND**

### Phase 0.3c (Soon - Quality of Life)
3. **Automation 6** - Set Publish Metadata on Approval
4. **Automation 4** - Clear Matched Branch When Location Removed

### Phase 0.4 (Later - Advanced Features)
5. **Automation 2** - Trigger AI Generation (requires Netlify Function)
6. **Automation 5** - Validate Before AI Processing

### Phase 1.0+ (Future - Nice to Have)
7. **Automation 7** - Warn About Expired Offers (scheduled automation)

---

## ✅ Prerequisites Checklist

Before starting ANY automation, verify you have:

### Airtable Access
- [ ] Admin access to Airtable base: `appATvatPtaoJ8MmS`
- [ ] Permissions to create automations
- [ ] Permissions to edit table schemas

### Test Data
- [ ] At least 1 Client record exists
- [ ] At least 1 Service record exists
- [ ] At least 1 Location record exists
- [ ] At least 1 Branch Location record exists
- [ ] At least 1 Service Area record exists (linking Branch → Location)
- [ ] At least 2-3 test Pages records (for testing)

### External Tools (for specific automations)
- [ ] GitHub Personal Access Token (for Automation 3 only)
- [ ] GitHub repository exists: `Jon-R-Steiner/landing-pages-automation-v2`

### Documentation Access
- [ ] Airtable schema reference: `Archive/airtable-schema-phase1.md`
- [ ] This guide: `docs/workflows/build/airtable-setup/airtable-automations-complete-guide.md`

---

## 🔴 Automation 0: Set Default Values on New Page

**Priority**: 🔴 CRITICAL - DO THIS FIRST
**Status**: ⚠️ Not Started | 🔄 In Progress | ✅ Complete
**Time**: ~5 minutes
**Dependencies**: None
**Phase**: 0.3b

### Why This Matters

**Problem**: When marketers create new Pages records, critical fields like Status don't have default values. This creates confusion:
- What state is this page in?
- Why isn't Status set to Draft?
- Do I need to manually set Published = false?

**Solution**: Automation sets sensible defaults the moment a record is created.

**What Gets Set**:
- `Status` → "Draft"
- `Published` → (unchecked)
- `Priority` → "Medium"

---

### Implementation Checklist

#### Setup: Create Automation (2 minutes)
- [ ] Open Airtable base: `appATvatPtaoJ8MmS`
- [ ] Click **"Automations"** button (top-right toolbar, lightning bolt icon)
- [ ] Click **"Create automation"** (blue button)
- [ ] **Name**: `Set Default Values on New Page`
- [ ] **Description** (optional): `Auto-sets Status=Draft, Published=false, Priority=Medium when page created`

#### Configure Trigger (1 minute)
- [ ] Click **"Choose a trigger"**
- [ ] Select **"When record created"**
- [ ] **Table**: Select **"Pages"**
- [ ] **Screenshot checkpoint**: Should show "When a record is created in Pages"
- [ ] Click **"Done"**

#### Add Update Action (3 minutes)
- [ ] Click **"+ Add action"**
- [ ] Select **"Update record"**
- [ ] **Table**: Pages (should auto-select)
- [ ] **Record ID**: Click field → Select **"Record ID"** from "[Pages] When record created" dropdown
- [ ] Click **"Add field"** → Select **"Status"**
  - [ ] Set value to **"Draft"**
- [ ] Click **"Add field"** → Select **"Published"**
  - [ ] Set value to **(unchecked)**
- [ ] Click **"Add field"** → Select **"Priority"**
  - [ ] Set value to **"Medium"**
- [ ] **Screenshot checkpoint**: Should show 3 fields being updated
- [ ] Click **"Done"**

#### Test Automation (3 minutes)
- [ ] Click **"Test"** button (top-right of automation)
- [ ] **Airtable will ask**: "Select a test record"
- [ ] **Select any existing Pages record** (this is just for the test, won't actually update it)
- [ ] Click **"Run test"**
- [ ] **Check automation log**:
  - [ ] Should show: "✓ Record updated successfully"
  - [ ] Should show: `Status: Draft`, `Published: false`, `Priority: Medium`

#### Live Test: Create New Record (2 minutes)
- [ ] Open **Pages** table in new tab
- [ ] Click **"+"** to create new record
- [ ] Fill ONLY these required fields:
  - [ ] **Client Name**: Select any client
  - [ ] **Service ID**: Select any service
  - [ ] **Location ID**: Select any location
- [ ] **Leave Status, Published, Priority BLANK**
- [ ] Save the record
- [ ] **Verify automation worked**:
  - [ ] `Status` should now show **"Draft"** (auto-populated!)
  - [ ] `Published` should be **(unchecked)** (auto-set!)
  - [ ] `Priority` should show **"Medium"** (auto-set!)
- [ ] **Success!** Delete the test record

#### Activate Automation (30 seconds)
- [ ] Return to automation tab
- [ ] Click **"Turn on"** toggle (top-right, should turn green)
- [ ] **Status** should show: **"Active"**
- [ ] **Verify**: Top of automation shows green dot + "Active"

#### Final Verification (1 minute)
- [ ] Create another new Pages record with minimal fields
- [ ] Verify defaults are automatically set
- [ ] Automation is working in production!
- [ ] ✅ **Mark Automation 0 as COMPLETE** in Master Progress Tracker

---

### Troubleshooting Automation 0

**Problem**: Status not being set to Draft

**Check**:
1. Is automation turned ON? (green toggle)
2. Did you select "Status" field correctly in action?
3. Did you set the value to "Draft" (exact spelling)?
4. Look at automation run history (click automation name → History tab)

**Solution**: Edit automation → Re-add Status field → Save → Test again

---

**Problem**: Test fails with "Field not found"

**Solution**:
1. Verify field names match exactly:
   - "Status" (not "status")
   - "Published" (not "Publish")
   - "Priority" (not "priority")
2. Field names are case-sensitive!

---

**Problem**: Existing records don't have defaults

**Why**: Automation only runs on NEW records (created after activation)

**Solution**: If you need to backfill existing records:
1. Open Airtable Scripting app
2. Run this script:
```javascript
let pagesTable = base.getTable("Pages");
let pages = await pagesTable.selectRecordsAsync();

for (let page of pages.records) {
  let updates = {};

  if (!page.getCellValue("Status")) {
    updates["Status"] = "Draft";
  }
  if (page.getCellValue("Published") === null) {
    updates["Published"] = false;
  }
  if (!page.getCellValue("Priority")) {
    updates["Priority"] = "Medium";
  }

  if (Object.keys(updates).length > 0) {
    await pagesTable.updateRecordAsync(page.id, updates);
    console.log(`Updated page ${page.id}`);
  }
}
console.log("Done!");
```

---

## 🔴 Automation 3: Export on Approval (GitHub Webhook)

**Priority**: 🔴 CRITICAL - DO AFTER AUTOMATION 0
**Status**: ⚠️ Not Started | 🔄 In Progress | ✅ Complete
**Time**: ~15 minutes
**Dependencies**: Automation 0 must be complete
**Phase**: 0.3b

### Why This Matters

**What It Does**: When a marketer approves a page (Status → "Approved"), this automation triggers GitHub Actions to export all approved pages to `content.json` and rebuild the site.

**This is the heart of your "Approval → Live" workflow!**

**Flow**:
```
Marketer sets Status = "Approved"
  ↓
Airtable Automation sends webhook to GitHub
  ↓
GitHub Actions runs export script
  ↓
content.json updated + committed
  ↓
Netlify auto-deploys
  ↓
Page goes LIVE! ✅
```

---

### Implementation Checklist

#### Prerequisites: Create GitHub Personal Access Token (5 minutes)

**⚠️ IMPORTANT**: Do this FIRST, you'll need the token in Step 4

- [ ] Open new browser tab
- [ ] Go to: https://github.com/settings/tokens
- [ ] Click **"Generate new token (classic)"**
- [ ] **Note**: `Airtable Export Automation`
- [ ] **Expiration**: 90 days (or "No expiration" if you prefer)
- [ ] **Scopes**: Check **ONLY** these:
  - [ ] ✅ `repo` (Full control of private repositories)
- [ ] Click **"Generate token"** (green button at bottom)
- [ ] **CRITICAL**: Copy the token IMMEDIATELY
  - [ ] Format: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
  - [ ] **You won't see it again!**
- [ ] **Store token safely**:
  - [ ] Paste into password manager (1Password, LastPass, etc.)
  - [ ] OR paste into secure note (DO NOT commit to Git!)
  - [ ] Label it: "Airtable Export Automation - GitHub PAT"

---

#### Setup: Create Automation (2 minutes)
- [ ] Return to Airtable base: `appATvatPtaoJ8MmS`
- [ ] Click **"Automations"** button (top-right toolbar)
- [ ] Click **"Create automation"**
- [ ] **Name**: `Trigger GitHub Actions on Approval`
- [ ] **Description** (optional): `Sends webhook to GitHub when page approved, triggers export workflow`

#### Configure Trigger (2 minutes)
- [ ] Click **"Choose a trigger"**
- [ ] Select **"When record matches conditions"**
- [ ] **Table**: Select **"Pages"**
- [ ] **Conditions**: Click **"Add condition"**
  - [ ] Condition 1: `Status` **is** `Approved`
  - [ ] Condition 2: `SEO Title` **is not empty**
  - [ ] Condition 3: `H1 Headline` **is not empty**
- [ ] **When to trigger**: Select **"When condition is newly met"** (NOT "Each time")
  - [ ] This ensures it only fires when Status CHANGES to Approved
- [ ] **Screenshot checkpoint**: Should show 3 conditions + "When condition is newly met"
- [ ] Click **"Done"**

#### Add Webhook Action (7 minutes)
- [ ] Click **"+ Add action"**
- [ ] Select **"Send webhook"**
- [ ] **Method**: Select **POST** from dropdown
- [ ] **URL**: Paste this (replace `Jon-R-Steiner` with your GitHub username if different):
  ```
  https://api.github.com/repos/Jon-R-Steiner/landing-pages-automation-v2/dispatches
  ```

#### Add Headers (3 minutes)
- [ ] Click **"Add header"** (you'll add 3 headers total)

**Header 1: Authorization**
- [ ] **Name**: `Authorization`
- [ ] **Value**: `Bearer ghp_YOUR_TOKEN_HERE`
  - [ ] ⚠️ Replace `ghp_YOUR_TOKEN_HERE` with your ACTUAL token from Prerequisites
  - [ ] ⚠️ Must include "Bearer " before the token!
  - [ ] Example: `Bearer ghp_abc123xyz789`

**Header 2: Accept**
- [ ] Click **"Add header"** again
- [ ] **Name**: `Accept`
- [ ] **Value**: `application/vnd.github.v3+json`

**Header 3: Content-Type**
- [ ] Click **"Add header"** again
- [ ] **Name**: `Content-Type`
- [ ] **Value**: `application/json`

- [ ] **Screenshot checkpoint**: Should show 3 headers configured

#### Add Body (3 minutes)
- [ ] **Body type**: Select **"JSON"** from dropdown
- [ ] **JSON Body**: Click in the text area
- [ ] **Paste this JSON**:
  ```json
  {
    "event_type": "airtable_export",
    "client_payload": {
      "trigger": "page_approved",
      "page_id": "",
      "service": "",
      "location": "",
      "timestamp": ""
    }
  }
  ```

**Now add dynamic fields** (replace empty strings with Airtable fields):

- [ ] Click in the JSON where it says `"page_id": ""`
- [ ] Delete the empty quotes `""`
- [ ] Click **"+"** button (appears on hover)
- [ ] Select **"Record ID"** from [Pages] When record matches conditions
- [ ] Should now show: `"page_id": [Record ID]` (in blue)

- [ ] Click in the JSON where it says `"service": ""`
- [ ] Delete the empty quotes
- [ ] Click **"+"** → Select **"Service"** (or "Service ID" field)

- [ ] Click in the JSON where it says `"location": ""`
- [ ] Delete the empty quotes
- [ ] Click **"+"** → Select **"Location"** (or "Location ID" field)

- [ ] Click in the JSON where it says `"timestamp": ""`
- [ ] Delete the empty quotes
- [ ] Click **"+"** → Select **"Last Modified"** (or "Last Modified Time")

- [ ] **Screenshot checkpoint**: All 4 fields should show Airtable field references (in blue)
- [ ] Click **"Done"**

#### Test Automation (5 minutes)
- [ ] Click **"Test"** button (top-right)
- [ ] **Select a test record**:
  - [ ] Must have: Status = "Approved"
  - [ ] Must have: SEO Title filled
  - [ ] Must have: H1 Headline filled
  - [ ] If you don't have one, create it now or temporarily set an existing page to Approved
- [ ] Click **"Run test"**
- [ ] **Check webhook response**:
  - [ ] ✅ **Success (200 OK)**: GitHub Actions workflow exists! Perfect!
  - [ ] ⚠️ **404 Not Found**: GitHub Actions workflow doesn't exist YET (expected in Phase 0.3b)
  - [ ] ❌ **401 Unauthorized**: Check your GitHub PAT token is correct in Authorization header
  - [ ] ❌ **403 Forbidden**: Check GitHub repository Actions are enabled

**Expected Result**: 404 error is OKAY for now (GitHub Actions workflow will be created in Phase 0.3b). Any other error needs fixing.

#### Activate Automation (30 seconds)
- [ ] Click **"Turn on"** toggle (top-right)
- [ ] Status should show: **"Active"**
- [ ] Green dot appears next to automation name

#### Final Verification (1 minute)
- [ ] Automation appears in automations list as "Active"
- [ ] ✅ **Mark Automation 3 as COMPLETE** in Master Progress Tracker

**Note**: Full end-to-end testing will happen after GitHub Actions workflow is created in Phase 0.3b.

---

### Troubleshooting Automation 3

**Problem**: 401 Unauthorized

**Check**:
1. Is GitHub PAT correct? (starts with `ghp_`)
2. Did you include `Bearer ` before the token?
3. Has the token expired? (check https://github.com/settings/tokens)
4. Does token have `repo` scope?

**Solution**: Generate new token → Update Authorization header → Test again

---

**Problem**: 404 Not Found

**Is this expected?**
- YES if GitHub Actions workflow doesn't exist yet (Phase 0.3b)
- NO if you already created `.github/workflows/airtable-export.yml`

**Solution**: This will resolve once GitHub Actions workflow is created. For now, this is okay.

---

**Problem**: Webhook triggers multiple times for same approval

**Check**:
1. Is trigger set to "When condition is newly met"? (not "Each time")
2. Are you re-saving the approved page? (each save re-triggers)

**Solution**: Change trigger to "When condition is newly met"

---

**Problem**: Dynamic fields not showing in JSON body

**Solution**:
1. Make sure you clicked the **"+"** button (not manually typing)
2. Fields must come from the trigger (Pages table)
3. Re-add the dynamic fields one by one

---

## 🟡 Automation 6: Set Publish Metadata on Approval

**Priority**: 🟡 RECOMMENDED - Quality of Life
**Status**: ⚠️ Not Started | 🔄 In Progress | ✅ Complete
**Time**: ~3 minutes
**Dependencies**: Automation 0, Automation 3
**Phase**: 0.3c

### Why This Matters

**What It Does**: Automatically sets approval metadata when Status changes to "Approved".

**Fields Set**:
- `Approval Date` → Current date/time
- `Approved By` → Current user

**Benefits**:
- Track when pages were approved
- Track who approved them
- Useful for auditing and workflow analysis

---

### Implementation Checklist

#### Setup: Create Automation (1 minute)
- [ ] Open Airtable base: `appATvatPtaoJ8MmS`
- [ ] Click **"Automations"** button
- [ ] Click **"Create automation"**
- [ ] **Name**: `Set Publish Metadata on Approval`

#### Configure Trigger (1 minute)
- [ ] Click **"Choose a trigger"**
- [ ] Select **"When record matches conditions"**
- [ ] **Table**: Select **"Pages"**
- [ ] **Conditions**: Click **"Add condition"**
  - [ ] Condition 1: `Status` **is** `Approved`
- [ ] **When to trigger**: Select **"When condition is newly met"**
- [ ] Click **"Done"**

#### Add Update Action (2 minutes)
- [ ] Click **"+ Add action"**
- [ ] Select **"Update record"**
- [ ] **Table**: Pages
- [ ] **Record ID**: Select **"Record ID"** from trigger
- [ ] Click **"Add field"** → Select **"Approval Date"**
  - [ ] Set value to: Click **"+"** → Select **"Now"** (current timestamp)
- [ ] Click **"Add field"** → Select **"Approved By"**
  - [ ] Set value to: Click **"+"** → Select **"Current User"**
- [ ] Click **"Done"**

#### Test (1 minute)
- [ ] Click **"Test"** button
- [ ] Select a test page with Status = "Approved"
- [ ] Click **"Run test"**
- [ ] Verify log shows both fields updated

#### Activate (30 seconds)
- [ ] Click **"Turn on"** toggle
- [ ] Status: **"Active"**
- [ ] ✅ **Mark Automation 6 as COMPLETE**

---

### Troubleshooting Automation 6

**Problem**: Approval Date not being set

**Check**:
1. Does "Approval Date" field exist in Pages table?
2. Is it a Date/DateTime field type?
3. Did you select "Now" (not manual date entry)?

---

**Problem**: Approved By showing wrong user

**Why**: Airtable uses the user who triggered the automation (the person who changed Status to Approved)

**This is correct behavior** - it tracks who approved it, not who created the automation.

---

## 🟢 Automation 4: Clear Matched Branch When Location Removed

**Priority**: 🟢 USEFUL - Data Consistency
**Status**: ⚠️ Not Started | 🔄 In Progress | ✅ Complete
**Time**: ~3 minutes
**Dependencies**: Automation 0
**Phase**: 0.3c

### Why This Matters

**Problem**: If a user removes the Location ID from a page after it's been created, the Matched Branch becomes orphaned (branch assigned but no location to match it to).

**Solution**: Automatically clear Matched Branch when Location ID is removed.

**When This Happens**:
- User accidentally clears Location ID
- User converts location-based page to national page
- User changes page structure

---

### Implementation Checklist

#### Setup: Create Automation (1 minute)
- [ ] Open Airtable base: `appATvatPtaoJ8MmS`
- [ ] Click **"Automations"** button
- [ ] Click **"Create automation"**
- [ ] **Name**: `Clear Branch When Location Removed`

#### Configure Trigger (2 minutes)
- [ ] Click **"Choose a trigger"**
- [ ] Select **"When record matches conditions"**
- [ ] **Table**: Select **"Pages"**
- [ ] **Conditions**: Click **"Add condition"**
  - [ ] Condition 1: `Location ID` **IS empty**
  - [ ] Condition 2: `Matched Branch` **is NOT empty**
- [ ] **When to trigger**: Select **"Each time record meets conditions"**
  - [ ] Note: We use "Each time" here because we want to catch whenever this state occurs
- [ ] Click **"Done"**

#### Add Update Action (2 minutes)
- [ ] Click **"+ Add action"**
- [ ] Select **"Update record"**
- [ ] **Table**: Pages
- [ ] **Record ID**: Select **"Record ID"** from trigger
- [ ] Click **"Add field"** → Select **"Matched Branch"**
  - [ ] **Clear the field**: Don't set any value (leave blank/empty)
  - [ ] Some Airtable versions: Select "Clear field" option
- [ ] Click **"Add field"** → Select **"Notes"**
  - [ ] **Action**: Select "Append" (not "Replace")
  - [ ] **Value**: `ℹ️ Matched Branch cleared (no location set)`
- [ ] Click **"Done"**

#### Test (2 minutes)
- [ ] Create a test page WITH Location ID (automation 1 will set Matched Branch)
- [ ] Wait for Matched Branch to populate
- [ ] Now REMOVE the Location ID (clear the field)
- [ ] Verify Matched Branch automatically clears
- [ ] Verify Notes field shows info message

#### Activate (30 seconds)
- [ ] Click **"Turn on"** toggle
- [ ] Status: **"Active"**
- [ ] ✅ **Mark Automation 4 as COMPLETE**

---

### Troubleshooting Automation 4

**Problem**: Matched Branch not clearing

**Check**:
1. Are both conditions true? (Location empty AND Branch not empty)
2. Is trigger set to "Each time" (not "Newly met")?
3. Did you leave Matched Branch field blank in the update action?

---

## 🔮 Automation 2: Trigger AI Generation (FUTURE - Phase 0.4)

**Priority**: 🔮 FUTURE - Phase 0.4
**Status**: ⚠️ Not Implemented Yet
**Time**: ~10 minutes (once Netlify Function is ready)
**Dependencies**: Netlify Function must be deployed first
**Phase**: 0.4

### Why This Matters

**What It Does**: When marketer changes Status to "AI Processing", this automation triggers a Netlify Function that calls Claude API to generate all page content.

**AI Generates**:
- SEO Title & Meta Description
- H1 Headline & Hero Subheadline
- Trust Bar signals (5 items)
- FAQs (5 Q&A pairs)
- CTA selection + reasoning
- Hero image selection from library
- Gallery captions

**Flow**:
```
Marketer sets Status = "AI Processing"
  ↓
Airtable Automation sends webhook to Netlify Function
  ↓
Netlify Function calls Claude API with page context
  ↓
AI generates all content
  ↓
Netlify Function writes content back to Airtable via API
  ↓
Status automatically changes to "Ready for Review"
```

---

### Implementation Checklist (DO NOT IMPLEMENT YET)

#### Prerequisites (Netlify Function must exist first)
- [ ] Netlify Function deployed: `netlify/functions/generate-page-content.js`
- [ ] Claude API key configured in Netlify environment variables
- [ ] Airtable API key configured in Netlify environment variables
- [ ] Function tested independently

#### Setup: Create Automation
- [ ] Open Airtable base: `appATvatPtaoJ8MmS`
- [ ] Click **"Automations"** button
- [ ] Click **"Create automation"**
- [ ] **Name**: `Trigger AI Content Generation`

#### Configure Trigger
- [ ] Click **"Choose a trigger"**
- [ ] Select **"When record matches conditions"**
- [ ] **Table**: Select **"Pages"**
- [ ] **Conditions**: Click **"Add condition"**
  - [ ] Condition 1: `Status` **is** `AI Processing`
  - [ ] Condition 2: `Service ID` **is not empty**
  - [ ] Condition 3: `Client Name` **is not empty**
  - [ ] Condition 4: `Matched Branch` **is not empty**
- [ ] **When to trigger**: Select **"When condition is newly met"**
- [ ] Click **"Done"**

#### Add Webhook Action
- [ ] Click **"+ Add action"**
- [ ] Select **"Send webhook"**
- [ ] **Method**: POST
- [ ] **URL**: `https://your-site.netlify.app/.netlify/functions/generate-page-content`
  - [ ] Replace with your actual Netlify domain

#### Add Headers
- [ ] Click **"Add header"**
- [ ] **Name**: `Content-Type`
- [ ] **Value**: `application/json`

- [ ] Click **"Add header"**
- [ ] **Name**: `Authorization`
- [ ] **Value**: `Bearer YOUR_WEBHOOK_SECRET`
  - [ ] Replace with secret key (to prevent unauthorized calls)

#### Add Body
- [ ] **Body type**: JSON
- [ ] **JSON Body**:
  ```json
  {
    "pageId": "",
    "serviceId": "",
    "locationId": "",
    "clientId": "",
    "branchId": "",
    "offerId": "",
    "specialInstructions": ""
  }
  ```
- [ ] Add dynamic fields for each empty string (same process as Automation 3)

#### Test
- [ ] Click **"Test"** button
- [ ] Select test page with Status = "AI Processing"
- [ ] Click **"Run test"**
- [ ] Check webhook response (should be 200 OK)
- [ ] Verify AI content was written back to Airtable

#### Activate
- [ ] Click **"Turn on"** toggle
- [ ] Status: **"Active"**
- [ ] ✅ **Mark Automation 2 as COMPLETE**

---

### Troubleshooting Automation 2

**This automation is not yet implemented** - troubleshooting will be added in Phase 0.4.

---

## 🔮 Automation 5: Validate Before AI Processing (FUTURE)

**Priority**: 🔮 FUTURE - Phase 0.4
**Status**: ⚠️ Not Implemented Yet
**Time**: ~5 minutes
**Dependencies**: Automation 2 must exist
**Phase**: 0.4

### Why This Matters

**What It Does**: Validates that all required fields are filled before allowing AI processing. Prevents wasting AI tokens on incomplete records.

**Validates**:
- Client Name is set
- Service ID is set
- Location ID is set (unless national page)
- Matched Branch is set

**If validation fails**:
- Status reverts to "Draft"
- Notes field shows what's missing

---

### Implementation Checklist (DO NOT IMPLEMENT YET)

#### Setup: Create Automation
- [ ] Open Airtable base: `appATvatPtaoJ8MmS`
- [ ] Click **"Automations"** button
- [ ] Click **"Create automation"**
- [ ] **Name**: `Validate Before AI Processing`

#### Configure Trigger
- [ ] Click **"Choose a trigger"**
- [ ] Select **"When record matches conditions"**
- [ ] **Table**: Select **"Pages"**
- [ ] **Conditions**:
  - [ ] Condition 1: `Status` **is** `AI Processing`
- [ ] **When to trigger**: Select **"When condition is newly met"**
- [ ] Click **"Done"**

#### Add Conditional Logic
- [ ] Click **"+ Add action"**
- [ ] Select **"Conditional action group"**
- [ ] **Condition**: Build complex condition checking if ANY required field is empty

#### If Invalid: Revert Status
- [ ] Inside "If" branch: Add "Update record"
- [ ] Set Status back to "Draft"
- [ ] Add error message to Notes

#### Activate
- [ ] Click **"Turn on"** toggle
- [ ] Status: **"Active"**
- [ ] ✅ **Mark Automation 5 as COMPLETE**

---

## 🔮 Automation 7: Warn About Expired Offers (FUTURE)

**Priority**: 🔮 FUTURE - Phase 1.0+
**Status**: ⚠️ Not Implemented Yet
**Time**: ~10 minutes
**Dependencies**: None
**Phase**: 1.0+

### Why This Matters

**What It Does**: Scheduled automation that runs daily, finds pages with expired offers, and adds warning to Notes field.

**Runs**: Daily at 6:00 AM
**Checks**: Pages where Offer.End Date < TODAY() and Status = "Published"
**Action**: Adds note: "⚠️ Associated offer expired on [date]"

---

### Implementation Checklist (DO NOT IMPLEMENT YET)

**Note**: Airtable scheduled automations have limitations. This may require a different approach (external cron job, Zapier, Make.com).

#### Setup: Create Automation
- [ ] Open Airtable base: `appATvatPtaoJ8MmS`
- [ ] Click **"Automations"** button
- [ ] Click **"Create automation"**
- [ ] **Name**: `Warn About Expired Offers`

#### Configure Trigger
- [ ] Click **"Choose a trigger"**
- [ ] Select **"At a scheduled time"**
- [ ] **Frequency**: Daily
- [ ] **Time**: 6:00 AM
- [ ] **Timezone**: Select your timezone
- [ ] Click **"Done"**

#### Add Find Records Action
- [ ] Click **"+ Add action"**
- [ ] Select **"Find records"**
- [ ] **Table**: Pages
- [ ] **Conditions**:
  - [ ] Offer.End Date < TODAY()
  - [ ] Status = "Published"
  - [ ] Active = TRUE
- [ ] Click **"Done"**

#### Add Repeating Action
- [ ] Click **"+ Add action"**
- [ ] Select **"Repeating action"**
- [ ] **For each**: Found record
- [ ] **Action**: Update record
- [ ] **Add to Notes**: Warning message

#### Activate
- [ ] Click **"Turn on"** toggle
- [ ] Status: **"Active"**
- [ ] ✅ **Mark Automation 7 as COMPLETE**

---

## 📊 Master Implementation Checklist

Use this to track overall progress:

### Phase 0.3b (Critical - Do Now)
- [ ] Automation 0: Set Default Values → ✅ COMPLETE
- [ ] Automation 3: Export on Approval → ✅ COMPLETE
- [ ] Test both automations with real records
- [ ] Verify end-to-end workflow (Draft → Approved → Webhook fires)

### Phase 0.3c (Quality of Life - Soon)
- [ ] Automation 6: Set Publish Metadata → ✅ COMPLETE
- [ ] Automation 4: Clear Matched Branch → ✅ COMPLETE
- [ ] Test data consistency improvements

### Phase 0.4 (Advanced Features - Later)
- [ ] Netlify Function deployed for AI generation
- [ ] Automation 2: Trigger AI Generation → ✅ COMPLETE
- [ ] Automation 5: Validate Before AI → ✅ COMPLETE
- [ ] Test AI generation workflow

### Phase 1.0+ (Future)
- [ ] Automation 7: Warn About Expired Offers → ✅ COMPLETE
- [ ] Evaluate need for additional automations

---

## 🔧 Common Issues Across All Automations

### Automation Not Firing

**Check**:
1. Is automation turned ON? (green toggle)
2. Do conditions match? (test with real record that meets conditions)
3. Check automation run history (click automation → History tab)
4. Are field names spelled exactly right? (case-sensitive!)

---

### Field Not Found Errors

**Solution**:
1. Verify field exists in table
2. Check exact spelling (case-sensitive)
3. Re-select field from dropdown (don't manually type)

---

### Webhook Failures

**Check**:
1. Is URL correct?
2. Are headers formatted properly?
3. Is JSON body valid?
4. Check external service (GitHub, Netlify) is accessible

---

### Automation Runs But Doesn't Update

**Check**:
1. Did you click "Done" after configuring action?
2. Is Record ID correctly linked to trigger?
3. Check field permissions (can automation edit this field?)

---

## 📚 Additional Resources

### Airtable Schema Reference
- **File**: `Archive/airtable-schema-phase1.md`
- **Contents**: Complete field definitions for all 12 tables
- **Pages Table**: Lines 711-880 (all fields, formulas, relationships)

### Automation Documentation
- **Automation 1**: Already implemented (Auto-Match Branch)
- **Script Reference**: `scripts/Airtable/airtable-automation-match-branch.js`

### External Dependencies
- **GitHub Actions Workflow**: `.github/workflows/airtable-export.yml` (Phase 0.3b)
- **Netlify Function**: `netlify/functions/generate-page-content.js` (Phase 0.4)

---

## ✅ Success Criteria

You'll know your automations are working when:

### Automation 0 Success
- [ ] New pages automatically have Status = "Draft"
- [ ] Published field starts unchecked
- [ ] Priority defaults to "Medium"
- [ ] No manual intervention needed

### Automation 3 Success
- [ ] Changing Status to "Approved" triggers webhook
- [ ] GitHub receives webhook (check Actions tab)
- [ ] Export workflow runs (Phase 0.3b)
- [ ] Netlify deploys updated site

### All Automations Success
- [ ] Workflow is seamless (Draft → AI Processing → Review → Approved → Live)
- [ ] No manual field-setting required
- [ ] Data consistency maintained
- [ ] Marketers can focus on content, not mechanics

---

**Guide Version**: 1.0
**Author**: Winston (Architect)
**Date**: 2025-10-11
**Phase**: 0.3b - 0.4
**Last Updated**: 2025-10-11
