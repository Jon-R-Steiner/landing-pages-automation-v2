# Airtable Automation Script: Smart Branch Matching

**Script File:** `scripts/Airtable/airtable-automation-match-branch.js`
**Version:** 1.0
**Last Updated:** 2025-10-11
**Status:** ✅ Production Ready

---

## Overview

This automation script intelligently matches Pages to the correct Branch Location based on geographic Service Areas. It features self-healing logic that automatically corrects mismatches and prevents unnecessary updates.

### Key Benefits

- **🔄 Self-Healing:** Automatically detects and fixes incorrect branch assignments
- **⚡ Efficient:** Only updates when necessary (prevents infinite automation loops)
- **🎯 Smart Fallback:** Uses Service Areas first, falls back to client default branch
- **📋 Actionable Errors:** Provides clear error messages with troubleshooting steps
- **🔍 Comprehensive Logging:** Detailed console output for debugging

---

## How It Works

### Trigger
**When:** A record in the **Pages** table is updated
**Conditions:** Any field change (script validates internally)

### Logic Flow

```
1. INPUT VALIDATION
   ├─ Check recordId exists
   └─ Check required fields (Client Name, Location ID)

2. LOOKUP CORRECT BRANCH
   ├─ Priority 1: Match via Service Areas (location-based)
   └─ Priority 2: Use client's default branch (alphabetically first)

3. COMPARE
   ├─ Get current Matched Branch
   ├─ Compare with correct branch
   └─ Determine if update needed

4. UPDATE (if needed)
   ├─ Set Matched Branch field
   ├─ Add warning note (if using fallback)
   └─ Set output variables for next automation step
```

### Matching Logic

#### Priority 1: Service Area Match
- Looks up Service Areas table for active entry matching the Page's Location ID
- Uses the Branch ID from the matching Service Area
- **Example:** Page for "Cleveland" → Service Area for "Cleveland" → "Cleveland Office"

#### Priority 2: Default Branch Fallback
- If no Service Area exists, finds first active branch for the client (alphabetically)
- Adds warning note to Page record
- **Example:** No Service Area for "Akron" → Uses "Cleveland Office" (client's first branch)

#### Error Handling
- If no active branches exist for client → Error note added, automation fails gracefully

---

## Input Variables

The automation must be configured with the following input variable:

| Name | Type | Value | Required |
|------|------|-------|----------|
| `recordId` | String | `[Trigger] Record ID` | ✅ Yes |

### Configuration Steps:
1. Edit automation
2. Go to "Run script" action
3. Click "+ Add input variable"
4. Name: `recordId`
5. Value: Select "Record ID" from trigger dropdown

---

## Output Variables

The script sets these output variables for use in subsequent automation steps:

| Variable | Type | Values | Description |
|----------|------|--------|-------------|
| `result` | String | `"updated"`, `"no_change"`, `"skipped"`, `"error"` | Overall result status |
| `message` | String | Descriptive text | Human-readable result message |
| `matchSource` | String | `"service_area"`, `"default_branch"` | How the branch was matched (only on success) |

### Usage in Next Action:
```
Conditional Logic:
- If [Run script] result equals "updated" → Send notification
- If [Run script] result equals "error" → Alert admin
```

---

## Field Requirements

### Required Fields (Pages Table)
- ✅ **Client Name** (Linked Record) - Must be populated
- ✅ **Location ID** (Linked Record) - Must be populated for local pages
- ✅ **Matched Branch** (Linked Record) - Updated by script

### Optional Fields (Pages Table)
- **Notes** (Long Text) - Script adds warnings/errors here

### Related Tables
- **Service Areas** - Active service area definitions (Branch + Location mapping)
- **Branch Locations** - Active branch records for each client

---

## Test Scenarios

### ✅ Test 1: Happy Path (Service Area Match)
**Setup:**
- Page with Client + Location
- Service Area exists for that Location + Client

**Expected Result:**
- Matched Branch set correctly
- Output: `result: "updated"` or `"no_change"` (if already correct)
- Console: "✅ Found Service Area match: [Branch Name]"

---

### ✅ Test 2: Fallback to Default Branch
**Setup:**
- Page with Client + Location
- NO Service Area for that Location

**Expected Result:**
- Matched Branch set to client's first alphabetical branch
- Warning note added to Notes field
- Output: `result: "updated"`, `matchSource: "default_branch"`
- Console: "⚠️ Using default branch: [Branch Name]"

---

### ✅ Test 3: Already Correct (No Update)
**Setup:**
- Page with correct Matched Branch already set

**Expected Result:**
- No update performed (efficiency!)
- Output: `result: "no_change"`
- Console: "⏭️ NO UPDATE NEEDED: Matched Branch is already correct"

---

### ✅ Test 4: Empty Matched Branch (Needs Update)
**Setup:**
- Page with no Matched Branch set

**Expected Result:**
- Matched Branch populated
- Output: `result: "updated"`
- Console: "✅ UPDATE NEEDED: Matched Branch is empty"

---

### ✅ Test 5: Wrong Matched Branch (Auto-Fix)
**Setup:**
- Page with incorrect Matched Branch

**Expected Result:**
- Matched Branch corrected
- Output: `result: "updated"`
- Console: "✅ UPDATE NEEDED: Matched Branch is incorrect"

---

### ✅ Test 6: Validation Skip (Empty Location)
**Setup:**
- Page with empty Location ID

**Expected Result:**
- No update performed
- Output: `result: "skipped"`, `message: "Location ID is empty"`
- Console: "⏭️ SKIP: Location ID is empty"

---

### ✅ Test 7: Error (No Branches Exist)
**Setup:**
- Client with NO active branches in Branch Locations table

**Expected Result:**
- Error note added to Page Notes field
- Output: `result: "error"`, `message: "No branches exist for client"`
- Console: "❌ ERROR: No active branches exist for this client!"

---

## Console Output Example

### Successful Update (Service Area Match)
```
=== Branch Matching Script Started ===
Record ID: recVK6x9l5Z338Oup

--- Current Page State ---
Client: Baths R Us
Location: Cleveland
Current Matched Branch: (empty)

--- Looking up correct branch ---
✅ Found Service Area match: Cleveland Office

--- Comparison ---
Current Branch ID: (none)
Correct Branch ID: recABC123

✅ UPDATE NEEDED: Matched Branch is empty

--- Updating Page ---
✅ UPDATED: Matched Branch set to Cleveland Office

=== Branch Matching Script Complete ===
```

### No Update Needed
```
=== Branch Matching Script Started ===
Record ID: recVK6x9l5Z338Oup

--- Current Page State ---
Client: Baths R Us
Location: Cleveland
Current Matched Branch: Cleveland Office

--- Looking up correct branch ---
✅ Found Service Area match: Cleveland Office

--- Comparison ---
Current Branch ID: recABC123
Correct Branch ID: recABC123

⏭️ NO UPDATE NEEDED: Matched Branch is already correct

⏭️ SKIPPED: No update needed

=== Branch Matching Script Complete ===
```

### Fallback to Default Branch
```
=== Branch Matching Script Started ===
Record ID: recVK6x9l5Z338Oup

--- Current Page State ---
Client: Baths R Us
Location: Akron
Current Matched Branch: (empty)

--- Looking up correct branch ---
⚠️ No Service Area found, looking for default branch...
⚠️ Using default branch: Cleveland Office

--- Comparison ---
Current Branch ID: (none)
Correct Branch ID: recABC123

✅ UPDATE NEEDED: Matched Branch is empty

--- Updating Page ---
✅ UPDATED: Matched Branch set to Cleveland Office
   Added warning to Notes field

=== Branch Matching Script Complete ===
```

---

## Error Handling

### Input Validation Error
**Cause:** Missing `recordId` input variable

**Console Output:**
```
❌ ERROR: recordId input variable not provided
📋 ACTION REQUIRED:
   1. Edit this automation
   2. Go to 'Run script' action
   3. Click '+ Add input variable'
   4. Variable name: recordId
   5. Value: Select 'Record ID' from trigger
```

**Resolution:** Follow the instructions to configure input variable

---

### No Branches Error
**Cause:** Client has no active branches in Branch Locations table

**Console Output:**
```
❌ ERROR: No active branches exist for this client!
```

**Result:**
- Error note added to Page Notes field
- Output: `result: "error"`

**Resolution:** Create at least one active branch for the client in Branch Locations table

---

## Performance

### Execution Time
- **Typical:** 2-5 seconds
- **Maximum:** <30 seconds (well under 120s timeout)

### Optimization Features
- Fetches only needed fields (not entire records)
- Early returns for validation (skips unnecessary processing)
- Conditional updates (only when branch changes)
- Parallel table fetching (when possible)

---

## Best Practices

### ✅ Do's
- ✅ Ensure Service Areas are kept up-to-date
- ✅ Monitor automation run history for errors
- ✅ Test with sample records before production
- ✅ Keep at least one active branch per client

### ❌ Don'ts
- ❌ Don't manually trigger on ALL records at once (rate limits)
- ❌ Don't delete branches that have matched pages
- ❌ Don't modify script without testing
- ❌ Don't remove input variable configuration

---

## Troubleshooting

### Issue: Script fails with "recordId is undefined"
**Cause:** Input variable not configured
**Fix:** Add `recordId` input variable (see Input Variables section)

### Issue: Script always uses default branch
**Cause:** Service Areas table missing entries
**Fix:** Add Service Area records for each Location + Branch combination

### Issue: Script updates every time (infinite loop)
**Cause:** Branch comparison logic failing
**Fix:** Check that Matched Branch field is linked to correct table

### Issue: Timeout error
**Cause:** Too many records or complex queries
**Fix:** Reduce number of fields fetched, optimize Service Areas table

---

## Maintenance

### When to Update Script

1. **New field requirements** - If additional fields need to be updated
2. **Logic changes** - If matching rules change
3. **Performance issues** - If execution time increases
4. **Bug fixes** - If edge cases discovered

### Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-10-11 | Initial production release |

---

## Related Documentation

- [Airtable Scripting Fundamentals](./01-airtable-scripting-fundamentals.md)
- [Common Scripting Patterns](./02-airtable-scripting-patterns.md)
- [Best Practices](./03-airtable-scripting-best-practices.md)
- [Script Source Code](../../../scripts/Airtable/airtable-automation-match-branch.js)

---

## Support

**Questions or Issues?**
1. Check automation run history logs
2. Review this documentation
3. Test with sample records
4. Contact automation administrator

---

**Status:** ✅ Production Ready
**Last Test:** 2025-10-11 - All scenarios passed
