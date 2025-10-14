# Automation 1: Edge Cases & Error Scenarios

**Purpose:** Comprehensive analysis of edge cases, user errors, and how the automation handles them

**Related:** airtable-automation-setup-guide.md

---

## Overview

The "Auto-Match Branch to Page" automation handles most scenarios gracefully, but there are edge cases where user error or incomplete data can cause issues. This document catalogs all known edge cases and provides solutions.

---

## Edge Case Categories

1. **Missing Data** - Required fields not filled
2. **Wrong Order** - Data created in unexpected sequence
3. **National Pages** - Pages without locations
4. **Inactive Records** - Branches or Service Areas marked inactive
5. **Multiple Matches** - Multiple branches serve same location
6. **Data Deletion** - User removes required fields after automation runs

---

## 1. Missing Data Edge Cases

### Edge Case 1.1: Page Created WITHOUT Location ID

**Scenario:**
```
Page created:
  Client Name: Baths R Us ✅
  Service ID: Bathroom Remodeling ✅
  Location ID: [EMPTY] ❌
  Status: Draft
```

**Current Behavior:**
- ❌ Automation does NOT fire (trigger condition: Location ID is not empty)
- Page has no Matched Branch
- Lookup fields (Branch Phone, Branch Email, etc.) are all empty

**Problem:** National/service pages (e.g., About Us, Contact, Services) need a Matched Branch too!

**Workaround:**
1. **Option A:** Manually set Matched Branch for national pages
2. **Option B:** Create a second automation for pages WITHOUT locations:
   ```yaml
   Trigger: Page created OR Client Name updated
   Conditions:
     - Client Name is not empty
     - Location ID IS empty
     - Matched Branch IS empty

   Action:
     - Find first active branch for this client
     - Set as Matched Branch
   ```

**Recommendation:** Add Option B as a second automation (see "Automation 1b" section below)

---

### Edge Case 1.2: No Branch Locations Exist for Client

**Scenario:**
```
Page created:
  Client Name: New Client Co ✅
  Location ID: Columbus ✅

Branch Locations table: [EMPTY for this client]
```

**Current Behavior:**
- ✅ Automation fires
- ✅ Finds no Service Area match (expected)
- ✅ Looks for client's default branch
- ❌ Finds NOTHING (no branches exist)
- ❌ Page.Matched Branch remains empty
- ❌ Automation completes with no error (silent failure)

**Problem:** No visual indication to user that branch is missing!

**Solutions:**
1. **Best:** Require at least 1 active branch before allowing page creation (Airtable form validation)
2. **Good:** Add "Missing Branch" note to page if no branch found
3. **Acceptable:** User notices empty lookup fields and fixes manually

**Updated Automation Logic (Recommended):**
```yaml
Step 6b (Otherwise branch):
  1. Find records (Branch Locations where Client = this client)
  2. Conditional:
     - If found: Set Matched Branch + add warning note
     - If NOT found:
       - Add note: "❌ ERROR: No branches exist for {Client Name}. Create a branch first!"
       - DO NOT set Matched Branch (leave empty as visual indicator)
```

---

### Edge Case 1.3: No Service Areas Defined Yet

**Scenario:**
```
Client: Baths R Us
Branch Locations: Medina Office (active) ✅
Service Areas: [EMPTY] ❌

Page created:
  Client: Baths R Us
  Location: Strongsville
```

**Current Behavior:**
- ✅ Automation fires
- ❌ Finds no Service Area (Service Areas table is empty)
- ✅ Falls back to client's default branch (Medina Office)
- ✅ Adds warning note: "⚠️ No branch found for Strongsville, using default: Medina Office"

**Assessment:** ✅ This works as expected! The fallback logic handles this gracefully.

**User Action Needed:**
1. Create Service Area records (Branch ↔ Location mappings)
2. Re-trigger automation by editing Location ID field

---

## 2. Wrong Order Edge Cases

### Edge Case 2.1: Client Name Added AFTER Location ID

**Scenario:**
```
Step 1: User creates page
  Client Name: [EMPTY]
  Location ID: Strongsville ✅

Step 2: User adds Client Name
  Client Name: Baths R Us ✅
```

**Behavior:**
- Step 1: Automation does NOT fire (both conditions must be true)
- Step 2: ✅ Automation fires when Client Name is added
- Result: ✅ Matched Branch is set correctly

**Assessment:** ✅ Works correctly! Trigger = "Each time record meets conditions"

---

### Edge Case 2.2: Location Changed After Page Creation

**Scenario:**
```
Step 1: Page created
  Location: Strongsville
  Matched Branch: Medina Office (auto-set)

Step 2: User changes location
  Location: Columbus (different branch territory)
```

**Behavior:**
- ✅ Automation fires again (Location ID changed)
- ✅ Finds new Service Area for Columbus
- ✅ Updates Matched Branch to new branch
- ✅ Lookup fields automatically update (phone, email, etc.)

**Assessment:** ✅ Perfect! This is the self-healing behavior we want.

---

### Edge Case 2.3: Service Areas Created AFTER Pages

**Scenario:**
```
Day 1:
  - Pages created for Strongsville (50 pages)
  - No Service Areas exist yet
  - All pages fall back to default branch (with warning notes)

Day 2:
  - User creates Service Area: Medina Office → Strongsville
  - Pages still have old Matched Branch (default)
```

**Behavior:**
- ❌ Automation does NOT automatically re-run for existing pages
- Reason: No fields changed on the Pages records

**Solutions:**
1. **Manual re-trigger:** User edits Location ID field on each page (tedious for 50 pages!)
2. **Bulk update script:** Use Airtable script to touch all pages (recommended)
3. **Accept it:** Old pages keep default branch until next time they're edited

**Bulk Re-Trigger Script:**
```javascript
// Run this script in Airtable Scripting app
let pagesTable = base.getTable("Pages");
let pages = await pagesTable.selectRecordsAsync();

for (let page of pages.records) {
  let location = page.getCellValue("Location ID");
  if (location) {
    // Touch the record by setting Location to itself
    await pagesTable.updateRecordAsync(page.id, {
      "Location ID": location
    });
    console.log(`Re-triggered automation for page ${page.id}`);
  }
}
```

---

## 3. National Pages (No Location) Edge Cases

### Edge Case 3.1: About Us / Contact Pages

**Scenario:**
```
Pages without locations:
  - /about-us
  - /contact
  - /services
  - /team

These pages STILL need:
  - Branch Phone (for contact info)
  - Branch Email (for contact form)
  - Branch Address (for footer)
```

**Current Behavior:**
- ❌ Automation does NOT fire (Location ID is empty)
- ❌ Matched Branch remains empty
- ❌ No contact info available

**Solution: Create Automation 1b (National Pages)**

```yaml
Name: Auto-Match Branch for National Pages
Trigger: Page record matches conditions
Conditions:
  - Client Name is not empty
  - Location ID IS empty
  - Matched Branch IS empty
When: Each time record meets conditions

Actions:
  1. Find records (Branch Locations)
     Table: Branch Locations
     Conditions:
       - Client Name = [Trigger] Client Name
       - Active = checked
     Limit: 1
     Sort: Branch Name (ascending)

  2. Update record (Pages)
     Record ID: [Trigger] Record ID
     Fields:
       - Matched Branch: [Find records] Branch ID
       - Notes: Append "✅ National page - using default branch: {Branch Name}"
```

**Why Separate Automation?**
- Can't have "Location ID is empty" AND "Location ID is not empty" in same trigger
- Needs different logic (no Service Area lookup needed)

---

## 4. Inactive Records Edge Cases

### Edge Case 4.1: Branch Marked Inactive AFTER Pages Created

**Scenario:**
```
Day 1:
  - Medina Office (active) ✅
  - 100 pages use Medina Office as Matched Branch

Day 2:
  - Medina Office marked Active = FALSE (office closed)
  - 100 pages still have Matched Branch = Medina Office
```

**Behavior:**
- ❌ Automation does NOT automatically fix existing pages
- ❌ Pages now show inactive branch data
- ❌ Lookup fields still work (showing inactive branch's phone/email)

**Problem:** Inactive branch data appears on live pages!

**Solutions:**
1. **Prevent inactivation:** Add validation - "Cannot deactivate branch with active pages"
2. **Cascade update:** When branch deactivated, trigger bulk update of all pages
3. **Export validation:** Export script filters out pages with inactive branches

**Recommendation:** Add warning to Branch Locations table:
```
⚠️ Before marking this branch inactive:
1. Check "Total Pages" field - how many pages use this branch?
2. If > 0, reassign those pages to a different branch first
3. Or update Service Areas to route new pages elsewhere
```

---

### Edge Case 4.2: Service Area Marked Inactive

**Scenario:**
```
Service Area (active → inactive):
  Branch: Medina Office
  Location: Strongsville
  Active: TRUE → FALSE

Existing pages:
  - 50 pages for Strongsville
  - All have Matched Branch = Medina Office
```

**Behavior:**
- ❌ Automation does NOT fix existing pages
- ✅ NEW pages for Strongsville will skip this Service Area (Active = false condition)
- ✅ NEW pages will fall back to default branch

**Assessment:** ✅ Partially works - new pages handled correctly, old pages unchanged

**User Action:** After deactivating Service Area, user should:
1. Create new Service Area (different branch for that location), OR
2. Bulk re-trigger automation on existing pages

---

## 5. Multiple Matches Edge Cases

### Edge Case 5.1: Multiple Branches Serve Same Location

**Scenario:**
```
Service Areas:
  1. Medina Office → Strongsville (active)
  2. Hilliard Office → Strongsville (active)

Page created:
  Location: Strongsville
```

**Current Behavior:**
- ✅ Automation fires
- ✅ Find Records returns BOTH Service Areas
- ✅ Takes first result (Limit: 1, Sort: Branch Name ascending)
- Result: Medina Office (alphabetically first)

**Is this correct?** Maybe not! What if Hilliard Office is closer?

**Solutions:**
1. **Accept alphabetical:** Simple, predictable
2. **Add priority field:** Service Areas get "Priority" number (1 = highest)
3. **Distance-based:** Calculate distance from location to branch (complex)
4. **Manual selection:** User picks branch when multiple exist

**Recommendation:** Add warning note when multiple branches found:
```yaml
Update Notes: "ℹ️ Multiple branches serve Strongsville. Auto-selected Medina Office (alphabetically first). Other options: Hilliard Office. To change, manually select Matched Branch."
```

---

## 6. Data Deletion Edge Cases

### Edge Case 6.1: User Clears Location ID After Automation Runs

**Scenario:**
```
Step 1: Page created
  Client: Baths R Us
  Location: Strongsville
  Matched Branch: Medina Office (auto-set)

Step 2: User accidentally clears Location ID
  Location: [EMPTY]
  Matched Branch: Medina Office (still set)
```

**Behavior:**
- ❌ Automation does NOT fire (Location ID is empty)
- ❌ Page now has Matched Branch but no location (orphaned data)
- Problem: URL Slug formula breaks! (depends on Location Slug)

**Should we clear Matched Branch when Location is removed?**

**Option A:** Leave it (current behavior)
- Pro: Preserves branch data if user re-adds location
- Con: Orphaned data is confusing

**Option B:** Clear Matched Branch when Location removed
- Pro: Clean data model
- Con: Requires additional automation

**Recommendation:** Add Automation 1c (Clear on Empty):
```yaml
Name: Clear Branch When Location Removed
Trigger: Page record matches conditions
Conditions:
  - Location ID IS empty
  - Matched Branch is NOT empty
When: Each time record meets conditions

Action:
  Update record (Pages)
    Record ID: [Trigger] Record ID
    Fields:
      - Matched Branch: [Clear field]
      - Notes: Append "ℹ️ Matched Branch cleared (no location set)"
```

---

### Edge Case 6.2: Branch Location Deleted (Hard Delete)

**Scenario:**
```
Day 1:
  - 100 pages have Matched Branch = Medina Office

Day 2:
  - User DELETES Medina Office record (hard delete)
```

**Behavior:**
- ❌ 100 pages now have broken link in Matched Branch field
- ❌ Lookup fields show #ERROR or empty
- ❌ Pages effectively have no branch data

**Prevention:** Airtable should prevent deleting records with linked records!

**If it happens:**
1. Restore Branch from Airtable trash (if within 7 days)
2. Create new Branch with same name
3. Bulk re-trigger automation on all affected pages

---

## 7. Recommended Additional Automations

### Automation 1b: National Pages (No Location)

Already described in Edge Case 3.1

---

### Automation 1c: Clear Branch When Location Removed

Already described in Edge Case 6.1

---

### Automation 1d: Warn When Branch Inactivated

```yaml
Name: Warn When Branch Has Active Pages
Trigger: Branch Locations record updated
Conditions:
  - Active changes from TRUE to FALSE
  - Total Pages > 0

Action:
  Update record (Branch Locations)
    Record ID: [Trigger] Record ID
    Fields:
      - Active: TRUE (revert the change)

  Send notification:
    "⚠️ Cannot deactivate {Branch Name} - {Total Pages} pages still use this branch. Reassign pages first!"
```

**Note:** This requires Airtable automations to support "revert field change" - may not be possible without scripting.

---

## 8. Testing Checklist

Use this checklist to validate the automation handles all edge cases:

### Basic Functionality
- [ ] Page with location → Finds matching Service Area
- [ ] Page with location → No Service Area → Uses default branch
- [ ] Page with location → Multiple Service Areas → Picks first alphabetically
- [ ] Location changed → Updates Matched Branch
- [ ] Client changed → Updates Matched Branch

### Missing Data
- [ ] Page without location → (Should fail with current setup - needs Automation 1b)
- [ ] No branches exist for client → Adds error note
- [ ] No service areas exist → Falls back to default branch

### Order Issues
- [ ] Client added after location → Automation fires when client added
- [ ] Service Areas created after pages → Manual re-trigger works
- [ ] Branch created after pages → Manual re-trigger works

### Inactive Records
- [ ] Branch marked inactive → Existing pages unchanged (document behavior)
- [ ] Service Area marked inactive → New pages skip it, old pages unchanged
- [ ] Create pages with inactive branch → Should NOT match (Active = true filter)

### Data Deletion
- [ ] Location cleared → Matched Branch remains (orphaned - document behavior)
- [ ] Branch deleted → Pages show broken links (prevent with validation)

### Multiple Matches
- [ ] Multiple Service Areas for same location → Picks first alphabetically
- [ ] Add note indicating other options available

---

## 9. User Education

**Key Points to Communicate:**

1. **Order Matters (But Not Critically):**
   - Automation is forgiving - you can add data in any order
   - Just re-trigger by editing Location ID field if needed

2. **Location Optional:**
   - Pages without locations (About Us, Contact) need special handling
   - Either manually set branch OR use Automation 1b

3. **Inactive = Hidden (Not Deleted):**
   - Marking branch inactive doesn't remove it from existing pages
   - Check "Total Pages" before inactivating
   - Consider reassigning pages first

4. **Alphabetical Selection:**
   - When multiple branches serve a location, first alphabetically is chosen
   - Manually change if needed

5. **Self-Healing:**
   - Automation re-runs when location changes
   - Add Service Areas later → just re-trigger automation
   - System is designed to be forgiving!

---

**Document Version:** 1.0
**Author:** Winston (Architect)
**Date:** 2025-10-11
**Phase:** 0.3a - Automation Edge Case Analysis
