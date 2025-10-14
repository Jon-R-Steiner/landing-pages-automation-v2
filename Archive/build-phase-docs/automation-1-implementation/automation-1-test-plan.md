# Automation 1: Testing Plan & Results

**Script:** `scripts/airtable-automation-match-branch.js`
**Purpose:** Validate smart branch matching with self-healing logic
**Date:** 2025-10-11

---

## Test Setup

### Test Data Created

```yaml
Test Page:
  Record ID: recVK6x9l5Z338Oup
  Client Name: Baths R Us (recuPFeBdOxy3dfy8)
  Location ID: Strongsville (recyYqSY9kg5mop6c)
  Matched Branch: Medina Office (recwnIouipZM9yJLp)

Branch Location:
  Record ID: recwnIouipZM9yJLp
  Branch Name: Medina Office
  Client Name: Baths R Us
  Active: TRUE

Service Area:
  Record ID: rec61ya0tjNVyxdxY
  Branch ID: Medina Office (recwnIouipZM9yJLp)
  Location ID: Strongsville (recyYqSY9kg5mop6c)
  Active: TRUE
```

---

## Test Scenarios

### Test 1: Already Correct (No Update Needed) ✅ EXPECTED

**Setup:**
- Page has: Matched Branch = Medina Office
- Service Area says: Strongsville → Medina Office

**Expected Result:**
```javascript
{
  result: "no_change",
  message: "Matched Branch already correct"
}
```

**Why Important:** Tests efficiency - script should skip when already correct

---

### Test 2: Matched Branch Empty (Initial Match)

**Setup:**
1. Clear Matched Branch on test page
2. Trigger automation

**Expected Result:**
```javascript
{
  result: "updated",
  message: "Matched Branch set to Medina Office",
  matchSource: "service_area"
}
```

**Verification:**
- [ ] Matched Branch now = Medina Office
- [ ] No warning note added (Service Area found)

---

### Test 3: Self-Healing (Wrong Branch Assigned)

**Setup:**
1. Create second branch: "Hilliard Office" for same client
2. Manually set page's Matched Branch = Hilliard Office (wrong!)
3. Trigger automation

**Expected Result:**
```javascript
{
  result: "updated",
  message: "Matched Branch set to Medina Office",
  matchSource: "service_area"
}
```

**Why Important:** Tests self-healing - auto-corrects mismatches

---

### Test 4: No Service Area (Fallback to Default Branch)

**Setup:**
1. Mark Service Area as Active = FALSE
2. Clear Matched Branch on test page
3. Trigger automation

**Expected Result:**
```javascript
{
  result: "updated",
  message: "Matched Branch set to Medina Office",
  matchSource: "default_branch"
}
```

**Verification:**
- [ ] Matched Branch = Medina Office (client's first active branch)
- [ ] Notes field contains: "⚠️ No service area found for Strongsville, using default branch: Medina Office"

---

### Test 5: No Location ID (Skip)

**Setup:**
1. Clear Location ID on test page
2. Trigger automation

**Expected Result:**
```javascript
{
  result: "skipped",
  message: "Location ID is empty"
}
```

**Verification:**
- [ ] Matched Branch unchanged
- [ ] No update performed

---

### Test 6: No Client Name (Skip)

**Setup:**
1. Clear Client Name on test page
2. Trigger automation

**Expected Result:**
```javascript
{
  result: "skipped",
  message: "Client Name is required"
}
```

---

### Test 7: No Branches Exist (Error)

**Setup:**
1. Mark all Branch Locations as Active = FALSE
2. Clear Matched Branch on test page
3. Trigger automation

**Expected Result:**
```javascript
{
  result: "error",
  message: "No branches exist for client"
}
```

**Verification:**
- [ ] Notes field contains: "❌ ERROR: No active branches exist for this client! Create a branch in Branch Locations table first."
- [ ] Matched Branch remains empty

---

### Test 8: Location Changed (Re-match)

**Setup:**
1. Create Service Area: Hilliard Office → Columbus
2. Change page's Location ID from Strongsville → Columbus
3. Trigger automation

**Expected Result:**
```javascript
{
  result: "updated",
  message: "Matched Branch set to Hilliard Office",
  matchSource: "service_area"
}
```

**Why Important:** Tests dynamic re-matching when location changes

---

### Test 9: Multiple Service Areas (Alphabetical Selection)

**Setup:**
1. Create Service Area: Hilliard Office → Strongsville (Active)
2. Already exists: Medina Office → Strongsville (Active)
3. Clear Matched Branch
4. Trigger automation

**Expected Result:**
```javascript
{
  result: "updated",
  message: "Matched Branch set to Hilliard Office",  // Alphabetically first
  matchSource: "service_area"
}
```

**Note:** Script uses `.find()` which returns first match. With alphabetical sort, Hilliard comes before Medina.

---

## Automation Setup in Airtable

### Step 1: Create Automation

```yaml
Name: Auto-Match Branch to Page (Smart)
Table: Pages

Trigger:
  Type: When record updated
  Conditions: None (script handles filtering)
```

### Step 2: Add Run Script Action

```yaml
Action: Run script
Script: [Paste contents of airtable-automation-match-branch.js]
```

### Step 3: Configure Inputs

```yaml
Script Inputs:
  recordId: [Trigger] Record ID
```

### Step 4: Test Mode

```yaml
Test with: recVK6x9l5Z338Oup (bathroom-remodeling/strongsville)
Expected: "no_change" result (already correct)
```

---

## Test Results

### Test 1: Already Correct ✅

**Ran:** [Date/Time]
**Result:**
```
[Paste automation log output here]
```

**Status:** PASS / FAIL
**Notes:**

---

### Test 2: Initial Match

**Ran:** [Date/Time]
**Result:**
```
[Paste automation log output here]
```

**Status:** PASS / FAIL
**Notes:**

---

### Test 3: Self-Healing

**Ran:** [Date/Time]
**Result:**
```
[Paste automation log output here]
```

**Status:** PASS / FAIL
**Notes:**

---

### Test 4: Fallback to Default

**Ran:** [Date/Time]
**Result:**
```
[Paste automation log output here]
```

**Status:** PASS / FAIL
**Notes:**

---

### Test 5-9: [Continue for each test]

---

## Performance Analysis

```yaml
Test Runs: [Total count]
Updates Performed: [Count where result = "updated"]
Skipped (Already Correct): [Count where result = "no_change"]
Skipped (Missing Data): [Count where result = "skipped"]
Errors: [Count where result = "error"]

Efficiency Rate: [Skipped / Total] %
```

**Key Metric:** Efficiency rate should be HIGH in production (most pages already correct)

---

## Known Limitations

1. **Multiple Service Areas:** Uses first alphabetical match, not closest branch
2. **No Distance Calculation:** Doesn't consider geographic proximity
3. **No Priority Field:** All Service Areas treated equally
4. **Manual Re-trigger Needed:** When new Service Areas added (can use bulk script)

---

## Recommendations

### For Production:

1. **Add logging to Matched Branch field history** - Track when/why branch changed
2. **Create Automation 1b** - Handle national pages (no Location ID)
3. **Add Automation 1c** - Clear Matched Branch when Location removed
4. **Create bulk re-trigger script** - For when Service Areas added after pages

### For Future Enhancement:

1. **Add Priority field to Service Areas** - Control which branch wins when multiple exist
2. **Add distance calculation** - Choose closest branch geographically
3. **Add notification** - Alert when multiple branches serve same location
4. **Add validation** - Prevent deactivating branch with active pages

---

## Next Steps

- [ ] Test all 9 scenarios in Airtable
- [ ] Document actual results above
- [ ] Fix any issues discovered
- [ ] Update `airtable-automation-setup-guide.md` with tested script
- [ ] Create Automation 1b for national pages
- [ ] Move to Automation 3 (Export on Approval)

---

**Document Version:** 1.0
**Author:** Winston (Architect) + Claude (Dev)
**Phase:** 0.3a - Automation Testing
