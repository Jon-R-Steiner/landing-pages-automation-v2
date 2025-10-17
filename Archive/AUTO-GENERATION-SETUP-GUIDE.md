# Airtable Auto-Generation Automations - Complete Setup Guide

**Purpose:** Automatically create Pages records when keywords, locations, or offers are added

**Status:** Ready to implement

**Time Required:** ~1.5 hours total

---

## 📋 Overview

This guide implements 3 Airtable automations that auto-generate Pages records:

1. **Automation 9:** New Keyword Added → Create Pages for all Locations
2. **Automation 10:** New Location Added → Create Pages for all Services × Keywords
3. **Automation 11:** New Offer Added → Create Offer-Specific Pages

**Architecture:** Keyword-Specific Pages (1 page per Service × Location × Keyword)

---

## ⚠️ CRITICAL: Prerequisites

### Before You Start

- [ ] **Read this entire guide first** - Don't skip ahead
- [ ] **Backup your Airtable base** - Export all tables as CSV
- [ ] **Test with dummy data** - Create test Service/Location/Offer first
- [ ] **Understand the impact** - These automations can create 100+ pages quickly

### Required Schema Changes

**MUST DO FIRST - Add Target Keyword Field:**

1. Open your Airtable base
2. Go to **Pages** table
3. Click **"+"** to add new field (or click field header dropdown → Insert field)
4. **Field Name:** `Target Keyword`
5. **Field Type:** Single line text
6. **Description:** "Specific keyword this page targets (from Service.Primary Keywords)"
7. Click **"Create field"**
8. **Position:** Move near SEO fields (after Service Name)

**MUST DO SECOND - Update Unique Key Formula:**

1. Find your **"Unique Key"** field in Pages table
2. Click field header → **"Customize field type"**
3. **Current Formula:** Likely something like `{Service Slug} & "-" & {Location Slug}`
4. **New Formula:**
   ```
   {Service Slug} & "-" & {Location Slug} & "-" & LOWER(SUBSTITUTE({Target Keyword}, " ", "-"))
   ```
5. Click **"Save"**
6. Verify: Should now show values like `bathroom-remodeling-austin-bathtub-installation`

**OPTIONAL - Update URL Slug Formula:**

1. Find your **"URL Slug"** or **"Page URL"** field
2. Update formula to:
   ```
   "/" & {Service Slug} & "/" & {Location Slug} & "/" & LOWER(SUBSTITUTE({Target Keyword}, " ", "-"))
   ```
3. Result: `/bathroom-remodeling/austin/bathtub-installation`

---

## 🎯 Automation 9: New Keyword → Create Pages

### When This Runs

- Trigger: When `Services.Primary Keywords` field is **updated**
- Behavior: Creates 1 Page per existing Location for each new keyword
- Example: Add "bathtub installation" keyword → Creates 10 pages (if you have 10 locations)

### Setup Steps (15 minutes)

#### Step 1: Create Automation

1. Open your Airtable base
2. Click **"Automations"** button (top-right toolbar, lightning bolt icon)
3. Click **"Create automation"** (blue button)
4. **Name:** `Create Pages When Keyword Added`
5. **Description:** `Auto-generates Pages when Service.Primary Keywords is updated`

#### Step 2: Configure Trigger

1. Click **"Choose a trigger"**
2. Select **"When record updated"**
3. **Table:** Select **"Services"**
4. **Field:** Select **"Primary Keywords"**
5. **When to run:** Select **"Each time record meets conditions"** (default)
6. Click **"Add condition"**
   - **Field:** Primary Keywords
   - **Operator:** is not empty
7. Click **"Done"**

#### Step 3: Add Script Action

1. Click **"+ Add action"**
2. Select **"Run script"**
3. **Delete the default script** (Cmd/Ctrl+A → Delete)
4. **Open:** `scripts/Airtable/automation-9-new-keyword.js` in your code editor
5. **Copy** the entire script
6. **Paste** into the Airtable script editor

#### Step 4: Configure Input Variable

1. Click **"Choose..."** button under script editor
2. Click **"+ Add field"**
3. **Name (type exactly):** `recordId`
4. **Value:** Click dropdown → Select **"Record ID"** (from Services trigger)
5. Should show: `recordId` = [Services] Record ID
6. Click **"Done"**

#### Step 5: Test Automation

1. Click **"Test"** button (top-right of automation)
2. **Select a test record:** Choose any Service with Primary Keywords filled
3. Click **"Run test"**
4. **Check the output:**
   - Should show: Created X pages, Skipped Y duplicates
   - Check automation log for details
   - Verify pages were created in Pages table

#### Step 6: Activate Automation

1. Click **"Turn on"** toggle (top-right, should turn green)
2. Status should show: **"Active"**
3. Green dot appears next to automation name
4. ✅ **Automation 9 is live!**

---

## 🗺️ Automation 10: New Location → Create Pages

### When This Runs

- Trigger: When record **created** in Locations table
- Behavior: Creates 1 Page per Service × Keyword combination
- Example: Add "San Antonio TX" → Creates 15 pages (if you have 3 services with 5 keywords each)

### Setup Steps (15 minutes)

#### Step 1: Create Automation

1. Still in **Automations** view
2. Click **"Create automation"**
3. **Name:** `Create Pages When Location Added`
4. **Description:** `Auto-generates Pages when new Location is created`

#### Step 2: Configure Trigger

1. Click **"Choose a trigger"**
2. Select **"When record created"**
3. **Table:** Select **"Locations"**
4. Click **"Done"**

#### Step 3: Add Script Action

1. Click **"+ Add action"**
2. Select **"Run script"**
3. **Delete default script**
4. **Open:** `scripts/Airtable/automation-10-new-location.js`
5. **Copy & Paste** the entire script

#### Step 4: Configure Input Variable

1. Click **"Choose..."** under script editor
2. Click **"+ Add field"**
3. **Name:** `recordId`
4. **Value:** Select **"Record ID"** (from Locations trigger)
5. Should show: `recordId` = [Locations] Record ID
6. Click **"Done"**

#### Step 5: Test Automation

1. Click **"Test"** button
2. **Select a test record:** Choose any existing Location
3. Click **"Run test"**
4. **Check the output:**
   - Should show: Created X pages for this location
   - Verify pages were created

#### Step 6: Activate Automation

1. Click **"Turn on"** toggle
2. Status: **"Active"** with green dot
3. ✅ **Automation 10 is live!**

---

## 🎁 Automation 11: New Offer → Create Offer Pages

### When This Runs

- Trigger: When record **created** in Offers table
- Behavior: Creates NEW pages for all Service × Location × Keyword combinations, linked to Offer
- Example: Add "Spring Sale" → Creates 150 pages (if you have 15 keywords × 10 locations)

⚠️ **WARNING:** This creates A LOT of pages! Test with small data set first.

### Setup Steps (15 minutes)

#### Step 1: Create Automation

1. Click **"Create automation"**
2. **Name:** `Create Offer Pages When Offer Added`
3. **Description:** `Auto-generates offer-specific Pages when new Offer is created`

#### Step 2: Configure Trigger

1. Click **"Choose a trigger"**
2. Select **"When record created"**
3. **Table:** Select **"Offers"**
4. Click **"Done"**

#### Step 3: Add Script Action

1. Click **"+ Add action"**
2. Select **"Run script"**
3. **Delete default script**
4. **Open:** `scripts/Airtable/automation-11-new-offer.js`
5. **Copy & Paste** the entire script

#### Step 4: Configure Input Variable

1. Click **"Choose..."** under script editor
2. Click **"+ Add field"**
3. **Name:** `recordId`
4. **Value:** Select **"Record ID"** (from Offers trigger)
5. Should show: `recordId` = [Offers] Record ID
6. Click **"Done"**

#### Step 5: Test Automation (IMPORTANT!)

**⚠️ Before testing, ensure you have SMALL data set:**
- 1-2 Services with 2-3 keywords each
- 2-3 Locations
- Expected: 6-18 pages created (test range)

1. Click **"Test"** button
2. **Select test record:** Choose any Offer
3. Click **"Run test"**
4. **Watch the log:** May take 10-30 seconds
5. **Verify:** Check Pages table for new offer pages

#### Step 6: Activate or Disable

**Option A: Activate (Recommended for MVP)**
1. Click **"Turn on"** toggle
2. ✅ **Automation 11 is live!**

**Option B: Keep Disabled (Alternative approach)**
- If you prefer manually linking offers to existing pages
- Leave automation OFF
- Manually update Pages.Offer ID field when needed

---

## ✅ Validation & Testing

### Test Scenario 1: New Keyword

**Setup:**
1. Open Services table
2. Find test service (e.g., "Test Service")
3. Current keywords: `"keyword1, keyword2"`

**Test:**
1. Add new keyword: `", keyword3"` (append to existing)
2. Save the record
3. **Expected Result:**
   - Automation 9 fires automatically
   - Creates N pages (1 per existing location)
   - Status = "Draft", Target Keyword = "keyword3"

**Verify:**
1. Go to Pages table
2. Filter: Target Keyword = "keyword3"
3. Should see newly created pages
4. Check: Service, Location, Status all correct

### Test Scenario 2: New Location

**Setup:**
1. Prepare: Have 2+ Services with keywords defined
2. Calculate expected: Count total keywords across all services

**Test:**
1. Create new Location: "Test City, ST"
2. Save the record
3. **Expected Result:**
   - Automation 10 fires automatically
   - Creates M pages (1 per service × keyword)

**Verify:**
1. Go to Pages table
2. Filter: City = "Test City"
3. Should see pages for all service × keyword combinations
4. Check duplicate detection worked (no duplicates)

### Test Scenario 3: New Offer

**Setup:**
1. Ensure SMALL data set (2-3 services, 2-3 keywords each, 2-3 locations)
2. Calculate expected: Keywords × Locations = Total pages

**Test:**
1. Create new Offer: "Test Sale 20% Off"
2. Save the record
3. **Expected Result:**
   - Automation 11 fires (may take 10-30 seconds)
   - Creates X pages (service × location × keyword)
   - All pages linked to offer

**Verify:**
1. Go to Pages table
2. Filter: Offer Name = "Test Sale 20% Off"
3. Should see all offer-specific pages
4. Check: Priority = "High"

---

## 🔧 Troubleshooting

### Automation Not Firing

**Check:**
1. Is automation turned ON? (green toggle)
2. Did you save the trigger record?
3. Check automation run history: Click automation → "History" tab
4. Look for errors in history log

**Solution:**
- Manually re-trigger by editing the record again
- Check automation conditions are met
- Verify input variables are configured correctly

### "recordId is not defined" Error

**Problem:** Input variable not configured or wrong name

**Solution:**
1. Edit automation
2. Click script action
3. Check input variable name exactly matches script: `recordId`
4. Verify value is set to "Record ID" from trigger

### Script Timeout (30 seconds)

**Problem:** Creating too many pages at once (100+)

**Solution:**
- Automation 11 may timeout on large data sets
- Test with smaller batch first
- Consider creating pages in phases (split services into batches)
- Or keep Automation 11 disabled and manually link offers

### Duplicate Pages Created

**Problem:** Duplicate detection not working

**Check:**
1. Does "Target Keyword" field exist in Pages table?
2. Are existing pages populated with Target Keyword?
3. Did you update Unique Key formula?

**Solution:**
- Backfill existing pages with Target Keywords
- Or delete existing pages and let automations recreate them
- Verify Unique Key formula is correct

### Pages Created But Missing Data

**Problem:** Linked records or fields not populated

**Check:**
1. Does Service have "Client Name" linked?
2. Does Service have "Primary Keywords" filled?
3. Check automation log for specific errors

**Solution:**
- Ensure all required fields are populated before triggering automation
- Update Service/Location data as needed

---

## 📊 Monitoring & Maintenance

### How to Check Automation History

1. Open Airtable → Automations
2. Click automation name
3. Click **"History"** tab
4. See list of all runs (successful, failed, skipped)
5. Click any run to see detailed log

### How to Temporarily Disable

1. Open automation
2. Click **"Turn off"** toggle (top-right)
3. Automation stops running (no pages created)
4. Re-enable anytime by toggling back ON

### How to Update Script

1. Open automation
2. Click script action
3. Edit script directly in Airtable
4. OR: Copy updated script from `scripts/Airtable/` folder
5. Click **"Done"** to save changes
6. Test again before leaving active

---

## 📈 Expected Results

### Small Data Set (10 pages)
- **Automation 9:** 1 keyword added → 10 pages (1 per location)
- **Automation 10:** 1 location added → 10 pages (10 keywords total across services)
- **Automation 11:** 1 offer added → 100 pages (10 keywords × 10 locations)

### Medium Data Set (50 pages)
- **Automation 9:** 5 keywords added → 50 pages (10 locations)
- **Automation 10:** 1 location added → 50 pages (50 keywords total)
- **Automation 11:** 1 offer added → 500 pages (50 keywords × 10 locations)

### Large Data Set (500 pages)
- **Automation 9:** 50 keywords added → 500 pages (10 locations)
- **Automation 10:** 10 locations added → 500 pages (50 keywords)
- **Automation 11:** 1 offer added → 5,000 pages (50 keywords × 100 locations) ⚠️

**⚠️ Note:** Automation 11 can create THOUSANDS of pages. Test carefully!

---

## ✅ Success Criteria

You'll know the automations are working correctly when:

- [ ] **Automation 9:** Adding keyword creates pages for all locations
- [ ] **Automation 10:** Adding location creates pages for all services × keywords
- [ ] **Automation 11:** Adding offer creates offer-specific pages (or disabled if not needed)
- [ ] No duplicate pages created (duplicate detection works)
- [ ] All new pages have Status = "Draft"
- [ ] All new pages have "Target Keyword" populated
- [ ] Automation history shows successful runs
- [ ] Pages match to branches via existing Automation 1

---

## 🚀 Next Steps After Setup

1. **Generate Content:**
   - Use BMad Content Writer agent to process Draft pages
   - Command: `/BMad:agents:copywriter` then `*generate-full-page {record_id}`

2. **Review & Approve:**
   - Marketing reviews generated content
   - Changes Status to "Approved"

3. **Deploy:**
   - Airtable Automation 3 triggers GitHub export
   - Netlify builds and deploys static site

4. **Monitor:**
   - Check automation history regularly
   - Verify pages are being created correctly
   - Adjust keywords/locations as needed

---

## 📚 Related Files

**Automation Scripts:**
- `scripts/Airtable/automation-9-new-keyword.js`
- `scripts/Airtable/automation-10-new-location.js`
- `scripts/Airtable/automation-11-new-offer.js`

**Documentation:**
- `docs/workflows/build/airtable-setup/airtable-automations-complete-guide.md` - Master automation guide
- `src/types/airtable-schema.ts` - TypeScript schema (updated with Target Keyword)

**Implementation Files:**
- `scripts/content-writer/` - Content generation scripts (unblocked by this work)

---

## 🆘 Getting Help

**If you get stuck:**
1. Check automation history logs for error messages
2. Review troubleshooting section above
3. Test with minimal data set (1 service, 1 keyword, 1 location)
4. Verify schema changes were applied correctly
5. Contact Winston (Architect) for assistance

---

**Guide Version:** 1.0
**Created:** 2025-01-16
**Author:** Winston (Architect)
**Status:** Ready for implementation
