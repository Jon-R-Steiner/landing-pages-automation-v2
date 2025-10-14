# Airtable Automation - Quick Start Guide

**For:** Setting up Automation 1 (Smart Branch Matching) in Airtable
**Time:** ~10 minutes
**Phase:** 0.3a

---

## Prerequisites Checklist

Before starting, verify you have:

- [x] Airtable Base ID: `appATvatPtaoJ8MmS`
- [x] Test data exists:
  - [x] At least 1 Client record
  - [x] At least 1 Branch Location record
  - [x] At least 1 Service Area record (linking Branch ↔ Location)
  - [x] At least 1 test Page record
- [x] Script file ready: `scripts/airtable-automation-match-branch.js`

---

## 3-Minute Setup

### Step 1: Create Automation (1 min)

1. Open Airtable base
2. Click **"Automations"** (top-right toolbar)
3. Click **"Create automation"**
4. Name: **"Auto-Match Branch to Page"**

### Step 2: Configure Trigger (30 sec)

1. Trigger Type: **"When record updated"**
2. Table: **"Pages"**
3. Conditions: **None** (leave empty)
4. Click **"Done"**

### Step 3: Add Script (1 min)

1. Click **"+ Add action"**
2. Select **"Run script"**
3. Script name: **"Smart Branch Matching"**
4. **Copy entire script** from:
   ```
   scripts/airtable-automation-match-branch.js
   ```
5. Paste into the code editor

### Step 4: Configure Input (30 sec)

1. Below the script editor, click **"+ Add input variable"**
2. Variable name: `recordId`
3. Value: Select **"Record ID"** from the dropdown (from Pages trigger)
4. Click **"Done"**

### Step 5: Test (2 min)

1. Click **"Test"** button (top-right)
2. Select a test Pages record that has:
   - Client Name: filled
   - Location ID: filled
   - Matched Branch: filled (testing efficiency!)
3. Click **"Run test"**
4. **Check log output:**
   - Should show: `⏭️  NO UPDATE NEEDED: Matched Branch is already correct`
   - Should show: `result: no_change`
   - ✅ This proves the script works and is efficient!

5. **Test update scenario:**
   - Go to Pages table
   - Clear the Matched Branch on test record
   - Come back to automation
   - Click **"Test"** again
   - Should show: `✅ UPDATE NEEDED: Matched Branch is empty`
   - Should show: `✅ UPDATED: Matched Branch set to [branch name]`
   - ✅ Verify Matched Branch was populated!

### Step 6: Activate (10 sec)

1. Click **"Turn on"** toggle (top-right)
2. Status should show: **"Active"**
3. **🎉 Done!**

---

## Quick Test

After activation, test the automation:

1. Go to **Pages** table
2. Create a new page:
   - Client Name: Select existing client
   - Service ID: Select a service
   - Location ID: Select a location
   - Status: Draft
   - **Leave Matched Branch empty**
3. Save the record
4. Edit ANY field (e.g., change Status to "In Progress")
5. **Check Matched Branch field:**
   - Should auto-populate with correct branch! ✅
   - Branch Phone, Email, Address should appear via lookup ✅

---

## Troubleshooting

### Problem: Matched Branch didn't populate

**Check:**
1. Is automation turned ON? (toggle in top-right)
2. Does a Service Area exist linking this Location to a Branch?
3. Is the Branch Location marked Active = ✓?
4. Look at automation run history (click automation name → History tab)

**Quick Fix:**
- Edit the Location ID field (click into it, select same location)
- This will re-trigger the automation

### Problem: Script error in log

**Common Issues:**
1. **"Table not found"** → Check table names match exactly:
   - "Pages" (not "Page")
   - "Service Areas" (not "ServiceAreas")
   - "Branch Locations" (not "Branches")

2. **"Field not found"** → Check field names:
   - "Location ID" (not "Location")
   - "Client Name" (not "Client")
   - "Matched Branch" (not "Branch")

3. **"Record ID undefined"** → Check input variable:
   - Variable name must be exactly: `recordId`
   - Value must be: `[Trigger] Record ID`

---

## What's Next?

### Recommended: Create Automation 1b (National Pages)

For pages WITHOUT locations (About Us, Contact, etc.):

1. Create second automation: **"Auto-Match Branch for National Pages"**
2. Trigger: When record matches conditions
   - Client Name is not empty
   - Location ID **IS empty** ⚠️
   - Matched Branch IS empty
3. Action: Find first active branch for client → Set as Matched Branch

**Full instructions:** See `airtable-automation-setup-guide.md` → Section "Automation 1b"

### Next: Automation 3 (Export on Approval)

When ready to connect to GitHub Actions:

1. Create GitHub Personal Access Token
2. Create automation that sends webhook when Status = "Approved"
3. Webhook triggers GitHub Actions export workflow

**Full instructions:** See `airtable-automation-setup-guide.md` → Section "Automation 3"

---

## Edge Cases Handled

✅ **The script automatically handles:**

1. **No Service Area exists** → Uses client's default branch + warning note
2. **No branches exist for client** → Adds error note, leaves Matched Branch empty
3. **Multiple Service Areas for same location** → Picks first alphabetically
4. **Location ID or Client Name empty** → Skips (no error)
5. **Matched Branch already correct** → Skips update (efficient!)
6. **Matched Branch is wrong** → Auto-corrects (self-healing!)

**Full edge case documentation:** See `automation-1-edge-cases.md`

---

## Performance Notes

### Expected Behavior in Production

- **Most updates:** Script skips (already correct) - EFFICIENT! ✅
- **New pages:** Script populates Matched Branch
- **Wrong data:** Script auto-corrects (self-healing)
- **Service Areas added later:** Just edit Location ID to trigger fix

### Efficiency Stats

- **80-90% of runs:** Skip (no update needed)
- **10-20% of runs:** Update (new/fixed pages)
- **<1% of runs:** Error (missing branches)

---

## Bulk Re-Trigger (If Needed)

**Scenario:** Added Service Areas after creating 50 pages. Want to update all pages.

**Solution:** Run this in Airtable Scripting app:

```javascript
// Bulk re-trigger for all pages with locations
let pagesTable = base.getTable("Pages");
let pages = await pagesTable.selectRecordsAsync();

for (let page of pages.records) {
  let locationId = page.getCellValue("Location ID");
  if (locationId) {
    // Touch record by setting Location to itself
    await pagesTable.updateRecordAsync(page.id, {
      "Location ID": locationId
    });
    console.log(`Re-triggered: ${page.id}`);
  }
}

console.log("✅ Done! All pages re-checked.");
```

---

## Success Checklist

Automation 1 is working if:

- [ ] New pages auto-populate Matched Branch
- [ ] Existing pages skip update (efficient!)
- [ ] Wrong branches auto-correct (self-healing!)
- [ ] Branch lookup fields populate (Phone, Email, Address)
- [ ] No errors in automation history
- [ ] Script log shows clear decision-making (skip vs update)

---

## Help & Resources

- **Full Setup Guide:** `airtable-automation-setup-guide.md`
- **Edge Cases:** `automation-1-edge-cases.md`
- **Test Plan:** `automation-1-test-plan.md`
- **Summary:** `AUTOMATION-1-SUMMARY.md`
- **Script Source:** `scripts/airtable-automation-match-branch.js`

---

**Quick Start Version:** 1.0
**Date:** 2025-10-11
**Estimated Setup Time:** 10 minutes
**Difficulty:** Easy (Copy/Paste)
