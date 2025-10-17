# Automation 11 & 11b Setup Guide

## Overview
Two separate automations that create offer-specific pages:
- **Automation 11**: Triggered when a NEW offer is created
- **Automation 11b**: Triggered when an EXISTING offer's targeting is updated

Both use the same filtering logic (Target Services, Target Locations, Target Branches).

---

## Automation 11: When Offer Created

### Step 1: Create Automation in Airtable
1. Open your Airtable base
2. Click "Automations" in the top toolbar
3. Click "+ Create automation"
4. Name: **"Create Offer Pages When Offer Added"**

### Step 2: Configure Trigger
1. Trigger type: **"When record created"**
2. Table: **Offers**
3. (No additional configuration needed)

### Step 3: Add Script Action
1. Click "+ Add action"
2. Action type: **"Run script"**
3. Copy the **entire contents** of `automation-11-new-offer.js`
4. Paste into the script editor

### Step 4: Configure Input Variables
1. Click "Add input variable"
2. Variable name: `recordId`
3. Value: Click dropdown → Select **"Record ID"** from the trigger

### Step 5: Test
1. Click "Test" button
2. Select a test offer (or create one)
3. Review the output:
   - Should show filtered services and locations
   - Should show estimated pages to create
   - Check for any warnings

### Step 6: Activate
1. If test looks good, toggle automation to "On"
2. Monitor first few runs to ensure it works as expected

---

## Automation 11b: When Offer Updated

### Step 1: Create Automation in Airtable
1. Open your Airtable base
2. Click "Automations" in the top toolbar
3. Click "+ Create automation"
4. Name: **"Create Offer Pages When Offer Updated"**

### Step 2: Configure Trigger
1. Trigger type: **"When record updated"**
2. Table: **Offers**
3. **Watch specific fields** (RECOMMENDED):
   - Target Services
   - Target Locations
   - Target Branches

   *(This prevents triggering when unrelated fields like "Discount Value" change)*

### Step 3: Add Script Action
1. Click "+ Add action"
2. Action type: **"Run script"**
3. Copy the **entire contents** of `automation-11b-offer-updated.js`
4. Paste into the script editor

### Step 4: Configure Input Variables
1. Click "Add input variable"
2. Variable name: `recordId`
3. Value: Click dropdown → Select **"Record ID"** from the trigger

### Step 5: Test
1. Create or select a test offer
2. Update one of the targeting fields (e.g., add a service to Target Services)
3. Click "Test" button
4. Review the output:
   - Should create pages for new targeting
   - Should skip existing pages (duplicates)

### Step 6: Activate
1. If test looks good, toggle automation to "On"
2. This automation is safe to leave active - it's additive only

---

## Targeting Logic (Both Automations)

### Target Services
- **Empty**: Applies to ALL services
- **Has values**: Applies ONLY to selected services

### Target Locations
- **Empty**: Applies to ALL locations
- **Has values**: Applies ONLY to selected locations

### Target Branches
- **Empty**: No additional filtering (uses Target Locations result)
- **Has values**: ONLY creates pages for locations served by those branches (via Service Areas table)

**Example**:
- Target Services: `[Bathroom Remodeling]`
- Target Locations: `[ALL]`
- Target Branches: `[Medina Office]`

**Result**: Creates pages for:
- Bathroom Remodeling service
- ONLY locations served by Medina Office (from Service Areas table)
- All keywords for that service

---

## Testing Checklist

### Test 1: Service-Specific Offer (Automation 11)
- [ ] Create offer targeting 1 specific service
- [ ] Leave Target Locations empty (ALL)
- [ ] Leave Target Branches empty
- [ ] Expected: Pages created for that service × all locations × all keywords
- [ ] Verify: Other services not included

### Test 2: Location-Specific Offer (Automation 11)
- [ ] Create offer targeting 1 specific location
- [ ] Leave Target Services empty (ALL)
- [ ] Leave Target Branches empty
- [ ] Expected: Pages created for all services × that location × all keywords
- [ ] Verify: Other locations not included

### Test 3: Branch-Specific Offer (Automation 11)
- [ ] Create offer targeting 1 specific branch
- [ ] Leave Target Services empty (ALL)
- [ ] Leave Target Locations empty (ALL)
- [ ] Expected: Pages created for all services × locations served by that branch × all keywords
- [ ] Verify: Check Service Areas table to confirm which locations should be included

### Test 4: Update Offer Targeting (Automation 11b)
- [ ] Create offer targeting [Service A]
- [ ] Wait for pages to be created
- [ ] Update offer to target [Service A, Service B]
- [ ] Expected: New pages created for Service B only
- [ ] Verify: Existing Service A pages NOT duplicated

### Test 5: Multiple Offers Same Target
- [ ] Create Offer 1 targeting Bathroom Remodeling
- [ ] Create Offer 2 also targeting Bathroom Remodeling
- [ ] Expected: 2 separate sets of pages with unique URLs
- [ ] Verify: URL includes offer slug (e.g., `/service/location/keyword/offer-slug`)

---

## Troubleshooting

### No Pages Created
**Check**:
1. Does offer have `Active = true`?
2. Do matching services have keywords in "Primary Keywords"?
3. Are there any locations in the Locations table?
4. Check automation logs for warnings

### Pages Created for Wrong Services/Locations
**Check**:
1. Is Target Services field set correctly? (Empty = ALL)
2. Is Target Locations field set correctly? (Empty = ALL)
3. If using Target Branches, check Service Areas table mapping

### Duplicate Pages Created
**Check**:
1. Duplicate detection is working (check script logs)
2. Verify Offer ID is included in unique key
3. May need to manually delete true duplicates

### Timeout (30 second limit)
**Solutions**:
1. Reduce targeting scope (fewer services or locations)
2. Split into multiple offers
3. Re-run automation - duplicate detection prevents re-creating existing pages

---

## Performance Notes

- **Batch size**: 50 records per API call
- **Capacity**: ~750 pages in 30 seconds
- **Estimated formula**: Keywords × Locations × Offers
- **Example**: 20 keywords × 10 locations × 1 offer = 200 pages (~5 seconds)

---

## Maintenance

### When to Disable Automation 11
- During bulk data imports (Services, Locations, Keywords)
- When making major schema changes
- Re-enable after data is stabilized

### When to Disable Automation 11b
- If you prefer manual control over offer expansion
- During offer cleanup/reorganization
- Can safely leave enabled - it's additive only

---

## Next Steps

After setting up both automations:
1. Test with small data set first
2. Create your first real offer
3. Monitor Pages table for created records
4. Verify URL Slug includes offer slug
5. Check that Published = false for review
