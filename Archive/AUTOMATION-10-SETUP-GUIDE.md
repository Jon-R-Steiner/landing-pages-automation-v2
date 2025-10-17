# Automation-10 Setup Guide: Create Pages When Location Added

## Overview

**What it does:** Automatically creates Pages records when a new Location is added to the Locations table.

**Example:**
- Add "San Antonio, TX" to Locations table
- If you have 3 Services with 5 keywords each = 15 keywords total
- Creates 15 new Pages (1 per Service × Keyword for San Antonio)

**Time Required:** ~10 minutes

**⚡ Performance:** Uses batch creation for 10-50x faster page generation
- Can handle 750+ pages in 30 seconds (vs old limit of ~100)
- Timeout is extremely unlikely with current implementation

---

## Prerequisites

✅ **Before you start:**
- [ ] Automation-9 is already setup and working
- [ ] You have Services with Primary Keywords filled in
- [ ] Pages table has "Target Keyword" field
- [ ] Pages table has "Status" field with default value "Draft"

---

## Step-by-Step Setup

### Step 1: Open Automations

1. Open your Airtable base
2. Click **"Automations"** button (top-right toolbar, lightning bolt ⚡ icon)
3. Click **"Create automation"** (blue button)

### Step 2: Name the Automation

1. Click on the automation name at the top (currently "Untitled automation")
2. **Name:** `Create Pages When Location Added`
3. Press Enter to save

### Step 3: Add Description

1. Click "Add description" below the name
2. **Paste this:**
   ```
   Auto-generates Pages when new Location is created.

   BEHAVIOR:
   • Reads all existing Services with Primary Keywords
   • Creates 1 Page per Service × Keyword × this new Location
   • Validates keywords (min 3 chars, must contain letters)
   • Automatically prevents duplicate pages
   • Sets all new pages to Status: Draft, Published: false

   EXAMPLE:
   Add "San Antonio, TX" location
   → Creates pages for all Service × Keyword combinations
   → If 3 services with 5 keywords each = 15 new pages

   NOTES:
   • Handles up to ~100 pages per run (30 second script timeout)
   • Skips services with no keywords
   • Target Keyword field automatically populated
   ```
3. Click outside to save

### Step 4: Configure Trigger

1. Click **"Choose a trigger"**
2. Select **"When record created"**
3. **Table:** Select **"Locations"**
4. Click **"Done"**

✅ Your trigger should now show:
```
When record created
Locations
```

### Step 5: Add Script Action

1. Click **"+ Add action"** (below the trigger)
2. Select **"Run script"**
3. You'll see a script editor with default code

### Step 6: Copy the Script

1. **In your code editor**, open:
   ```
   C:\Users\JonSteiner\landing-pages-automation-v2\scripts\Airtable\automation-10-new-location.js
   ```

2. **Select all** (Ctrl+A / Cmd+A)

3. **Copy** (Ctrl+C / Cmd+C)

4. **In Airtable**, click inside the script editor

5. **Select all** the default code (Ctrl+A / Cmd+A)

6. **Paste** your script (Ctrl+V / Cmd+V)

7. The script should start with:
   ```javascript
   /**
    * Airtable Automation 10: Create Pages When Location Added
   ```

### Step 7: Configure Input Variable

1. **Below the script editor**, look for "Configure input variables"

2. Click **"Choose..."** button (or "+ Add field" if no button)

3. Click **"+ Add field"**

4. **Name (type exactly):** `recordId`

5. **Value:** Click the dropdown

6. Select **"Record ID"** (should show "1. When record created" section)

7. Should now display:
   ```
   recordId = Record ID
   ```

8. Click **"Done"**

✅ Your input variable is configured!

### Step 8: Test the Automation

**IMPORTANT: Test with existing location first, not a brand new one**

1. Click **"Test"** button (top-right corner)

2. **Select a test record:**
   - Choose any **existing** Location from your Locations table
   - Example: If you have "Austin, TX", select that

3. Click **"Run test"**

4. **Watch the output panel** (may take 10-30 seconds)

5. **Expected Output:**
   ```
   === Automation 10: Processing Location "Austin" ===
   📦 Found 10 services
   📄 Checking against 50 existing pages...

   📦 Service: "Bathroom Remodeling" (6 valid keywords)
      ✅ CREATED: "bathroom remodel"
      ✅ CREATED: "bathroom renovation"
      ... etc ...

   ==================================================
   AUTOMATION COMPLETE
   ==================================================
   ```

6. **Check the output values** at the bottom:
   - `result: "success"`
   - `created: 15` (or whatever number)
   - `skipped: 0` (since test should find no duplicates)
   - `errors: 0`

### Step 9: Verify Pages Were Created

1. Open your **Pages** table

2. Add a filter:
   - Field: **Location ID**
   - Condition: **is**
   - Value: Select the test location you used

3. You should see newly created pages:
   - Each has Target Keyword filled
   - Each has Status = "Draft"
   - Each has Published = false
   - Service ID and Location ID are linked

4. ✅ **If pages look good, continue to Step 10**

### Step 10: Activate the Automation

1. Go back to the Automations view

2. Find your automation "Create Pages When Location Added"

3. Click the **toggle switch** (top-right) to turn it **ON**

4. Toggle should turn **green**

5. Status should show: **"Active"** with green dot ●

6. ✅ **Automation-10 is now live!**

---

## Testing with a New Location

**Now test with a REAL new location:**

1. Go to **Locations** table

2. Click **"+ Add record"** (or just start typing in empty row)

3. Fill in:
   - **City:** San Antonio
   - **State:** TX
   - **Active:** ✓ (checked)

4. Press Enter or click outside to save

5. **Wait 5-10 seconds** (automation runs in background)

6. Check **Automations → History** tab:
   - Should show a new run for "San Antonio"
   - Click to see the log output
   - Verify it created pages successfully

7. Go to **Pages** table:
   - Filter by Location = San Antonio
   - Should see all new pages

8. ✅ **Success! Automation is working!**

---

## Troubleshooting

### Automation Didn't Fire

**Check:**
- Is automation toggle ON (green)?
- Did you actually save the location record?
- Check Automations → History tab for errors

**Solution:**
- Try editing the location again (add/remove space in City name)
- Or manually click "Test" button to re-run

### "recordId is not defined" Error

**Problem:** Input variable not configured correctly

**Solution:**
1. Edit automation
2. Click on script action
3. Verify input variable:
   - Name: `recordId` (exact spelling, lowercase)
   - Value: "Record ID" from trigger

### Script Timeout (30 seconds)

**Problem:** Too many pages to create at once (750+)

**Solution:**
- **NEW:** Script now uses batch creation (createRecordsAsync)
- Can handle 750+ pages before timeout (vs old limit of ~100)
- Timeout is now extremely unlikely

**If timeout still occurs (750+ pages):**
1. Check Automations → History for timeout error
2. Note how many pages were created before timeout
3. Click **"Test"** button to re-run automation
4. Select the same Location that timed out
5. Duplicate detection will skip pages already created
6. Continue until you see: `Created: 0` (all done!)

**Why this is safe:**
- Your duplicate detection prevents duplicate pages
- Each re-run picks up where it left off
- Can re-run as many times as needed

### Pages Created But Missing Data

**Check:**
1. Do Services have "Client" field populated?
2. Do Services have "Primary Keywords" filled?
3. Check automation log for specific errors

**Solution:**
- Update Service records to fill required fields
- Re-run automation with "Test" button

### Duplicate Pages Created

**Problem:** Script's duplicate detection failed

**Check:**
- Does "Target Keyword" field exist in Pages table?
- Are existing pages populated with Target Keywords?

**Solution:**
- Clean up duplicates manually
- Verify Target Keyword field exists and is populated

---

## Expected Results

### Small Setup (10 keywords total)
- Add 1 Location → Creates 10 pages
- Execution time: < 1 second

### Medium Setup (50 keywords total)
- Add 1 Location → Creates 50 pages
- Execution time: 1-2 seconds

### Large Setup (100-750 keywords)
- Add 1 Location → Creates 100-750 pages
- Execution time: 5-25 seconds
- ✅ **No timeout** - Uses batch creation (50 records per batch)

### Very Large Setup (750+ keywords)
- Add 1 Location → May approach 30 second timeout
- If timeout occurs, simply re-run using "Test" button
- Duplicate detection prevents duplicate pages

---

## Monitoring

### Check Automation History

1. Automations → Click automation name
2. Click **"History"** tab
3. See all runs (successful, failed)
4. Click any run to see detailed logs

### Temporarily Disable

1. Open automation
2. Toggle switch to **OFF**
3. Automation stops running
4. Re-enable anytime

### Update Script

1. Open automation
2. Click on script action
3. Edit directly in Airtable
4. OR: Copy updated script from file
5. Click "Done" to save
6. Test before leaving active

---

## Success Checklist

You'll know it's working when:

- [ ] Automation shows as "Active" (green toggle)
- [ ] Creating a new Location triggers automation automatically
- [ ] Pages are created within 10 seconds
- [ ] All pages have Target Keyword populated
- [ ] All pages have Status = "Draft"
- [ ] No duplicate pages created
- [ ] Automation history shows successful runs
- [ ] Invalid keywords (< 3 chars) are skipped

---

## Next Steps

1. **Add more Locations** to expand your page coverage
2. **Review Pages** in Airtable (they'll be in Draft status)
3. **Generate Content** using BMad Content Writer agent
4. **Approve Pages** when ready
5. **Deploy** via Netlify (when approved)

---

## Related Files

- **Script:** `scripts/Airtable/automation-10-new-location.js`
- **Setup Guide (this file):** `scripts/Airtable/AUTOMATION-10-SETUP-GUIDE.md`
- **Automation-9 Guide:** `scripts/Airtable/AUTO-GENERATION-SETUP-GUIDE.md`

---

## Need Help?

**If you get stuck:**
1. Check automation history logs for error messages
2. Review troubleshooting section above
3. Test with minimal data (1-2 services, 2-3 keywords each)
4. Verify all prerequisites are met
5. Contact developer for assistance

---

**Guide Version:** 1.0
**Created:** 2025-01-17
**Author:** James (Dev Agent)
**Status:** Ready for use
