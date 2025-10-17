# Airtable Schema Update: Add Geolocation Fields

**Document Type:** Build Workflow - Airtable Schema Change
**Last Updated:** 2025-10-17
**Purpose:** Add Latitude and Longitude fields to Branch Locations table for AI Max/PMax optimization
**Impact:** Required for production builds after implementing structured data

---

## Overview

This document provides step-by-step instructions for adding **Latitude** and **Longitude** fields to the **Branch Locations** table in Airtable.

These fields are **CRITICAL** for:
- LocalBusiness Schema.org structured data
- AI Max/PMax optimization signals
- Preventing AI hallucination of business locations

**⚠️ IMPORTANT:** These coordinates MUST be manually entered from Google Maps. They cannot be calculated or derived to prevent AI hallucination.

---

## Prerequisites

- Access to Airtable Base: "Landing Pages Content Management" (Base ID: `appATvatPtaoJ8MmS`)
- Admin permissions to modify table schema
- Access to Google Maps for coordinate lookup

---

## Part 1: Add Latitude Field

### Step 1: Open Branch Locations Table

1. Log in to Airtable
2. Open the base: **Landing Pages Content Management**
3. Navigate to the **Branch Locations** table

### Step 2: Add Latitude Field

1. Click the **+** button to add a new field (at the end of existing fields)
2. Configure the field:
   - **Field name:** `Latitude`
   - **Field type:** Number
   - **Number format:** Decimal
   - **Precision:** 6 decimal places

3. Click **Create field**

### Step 3: Add Field Description

1. Click the field name dropdown → **Customize field**
2. In the **Description** field, add:

```
Latitude coordinate from Google Maps (not calculated).

Required for LocalBusiness Schema.org structured data and AI Max/PMax optimization.

Range: -90 to 90
Example: Cleveland, OH = 41.499320

How to get this value:
1. Go to Google Maps
2. Search for the branch address
3. Right-click on the location marker
4. Click "What's here?"
5. Copy the FIRST number (latitude)
```

4. Click **Save**

### Step 4: Set Field Position (Optional)

1. Drag the **Latitude** field to position it in the **LOCATION** section
2. Recommended position: After "Zip Code" field

---

## Part 2: Add Longitude Field

### Step 1: Add Longitude Field

1. Click the **+** button to add another new field
2. Configure the field:
   - **Field name:** `Longitude`
   - **Field type:** Number
   - **Number format:** Decimal
   - **Precision:** 6 decimal places

3. Click **Create field**

### Step 2: Add Field Description

1. Click the field name dropdown → **Customize field**
2. In the **Description** field, add:

```
Longitude coordinate from Google Maps (not calculated).

Required for LocalBusiness Schema.org structured data and AI Max/PMax optimization.

Range: -180 to 180
Example: Cleveland, OH = -81.694400

How to get this value:
1. Go to Google Maps
2. Search for the branch address
3. Right-click on the location marker
4. Click "What's here?"
5. Copy the SECOND number (longitude)
```

3. Click **Save**

### Step 3: Set Field Position (Optional)

1. Drag the **Longitude** field to position it right after the **Latitude** field

---

## Part 3: Populate Coordinates for Existing Branches

**⚠️ CRITICAL:** All existing branches MUST have coordinates added before production build.

### For Each Branch Record:

#### Step 1: Get Address from Airtable

1. Open the branch record
2. Note the full address from the **Street Address**, **City**, **State**, and **Zip Code** fields

#### Step 2: Look Up Coordinates in Google Maps

1. Go to [Google Maps](https://www.google.com/maps)
2. Search for the branch address
3. Verify the location marker is correct
4. **Right-click** on the location marker
5. Click **"What's here?"**
6. Google will show coordinates like: `41.499320, -81.694400`
   - First number = **Latitude** (41.499320)
   - Second number = **Longitude** (-81.694400)

#### Step 3: Enter Coordinates in Airtable

1. Return to the Airtable branch record
2. Enter the **first number** in the **Latitude** field: `41.499320`
3. Enter the **second number** in the **Longitude** field: `-81.694400`
4. Click outside the field to save

#### Step 4: Verify Coordinates

**Visual Check:**
- Latitude should be between -90 and 90
- Longitude should be between -180 and 180
- For US locations:
  - Latitude is typically between 25 and 50
  - Longitude is typically between -125 and -65 (negative numbers)

**Verification:**
- Copy the coordinates (e.g., `41.499320, -81.694400`)
- Paste into Google Maps search
- Confirm it shows the correct branch location

---

## Part 4: Example Coordinates

### Sample Branches (for reference)

| Branch Name | Address | Latitude | Longitude |
|-------------|---------|----------|-----------|
| Cleveland Office | 5005 Rockside Rd, Independence, OH 44131 | 41.382850 | -81.647900 |
| Akron Office | 1235 Main St, Akron, OH 44311 | 41.077710 | -81.518880 |
| Columbus Office | 4200 E 5th Ave, Columbus, OH 43219 | 39.979530 | -82.959720 |

---

## Part 5: Validation

After adding coordinates to all branches, validate the data:

### Automated Validation (Developer Task)

Run the coordinate validation script:

```bash
# Export updated content from Airtable
npm run export:airtable

# Validate all branches have coordinates
node scripts/validate-branch-coordinates.js
```

**Expected Output:**
```
✅ SUCCESS: All branches have valid coordinates!
   5 branch(es) validated successfully

Build can proceed safely.
```

If validation fails, review the error messages and fix the coordinates in Airtable.

---

## Part 6: Common Issues and Solutions

### Issue 1: Coordinates are (0, 0)

**Problem:** Coordinates show as 0 latitude, 0 longitude
**Cause:** Field was left empty or set to zero
**Solution:** Follow Part 3 to get real coordinates from Google Maps

---

### Issue 2: Coordinates are whole numbers

**Problem:** Latitude is 41 (not 41.499320)
**Cause:** Precision not set correctly, or user entered rounded number
**Solution:**
1. Check field type is set to **Decimal with 6 places**
2. Re-enter coordinates from Google Maps (don't round)

---

### Issue 3: Negative longitude is positive

**Problem:** US longitude shows as positive (e.g., 81.694400 instead of -81.694400)
**Cause:** User forgot the negative sign
**Solution:** US longitudes are ALWAYS negative. Re-enter with minus sign.

---

### Issue 4: Build fails with "Missing latitude/longitude"

**Problem:** Build validation script fails
**Cause:** One or more branches don't have coordinates
**Solution:**
1. Check which branch(es) are missing coordinates (see error output)
2. Add coordinates following Part 3
3. Re-export: `npm run export:airtable`
4. Re-validate: `node scripts/validate-branch-coordinates.js`

---

## Part 7: Testing

After adding coordinates to all branches:

1. ✅ Run coordinate validation script (see Part 5)
2. ✅ Export Airtable data: `npm run export:airtable`
3. ✅ Check `content.json` has `latitude` and `longitude` fields for all branches
4. ✅ Run TypeScript validation: `npm run type-check`
5. ✅ Run build: `npm run build`
6. ✅ Test sample page has LocalBusiness Schema with geo coordinates

---

## Part 8: Schema Documentation Update

After completing the Airtable changes, update the schema documentation:

### Update File: `Archive/airtable-schema-phase1.md`

Add the following to the **Branch Locations** table field definitions (after Zip Code):

```markdown
#### Latitude (Number - 6 decimals)
- **Type:** Number (Decimal, 6 places)
- **Purpose:** Latitude coordinate from Google Maps for LocalBusiness Schema.org structured data
- **Range:** -90 to 90
- **Example:** 41.499320 (Cleveland, OH)
- **Required:** Yes (for production builds)
- **Source:** Manual entry from Google Maps (NOT calculated)

#### Longitude (Number - 6 decimals)
- **Type:** Number (Decimal, 6 places)
- **Purpose:** Longitude coordinate from Google Maps for LocalBusiness Schema.org structured data
- **Range:** -180 to 180
- **Example:** -81.694400 (Cleveland, OH)
- **Required:** Yes (for production builds)
- **Source:** Manual entry from Google Maps (NOT calculated)
```

---

## Part 9: TypeScript Schema Update

The TypeScript interface has already been updated in:

**File:** `src/types/airtable-schema.ts`

**Interface:** `AirtableBranchLocationRecord`

**Fields Added:**
```typescript
// === GEOLOCATION (AI MAX/PMAX OPTIMIZATION) ===
Latitude?: number // Google Maps latitude coordinate (-90 to 90) - Required for LocalBusiness Schema
Longitude?: number // Google Maps longitude coordinate (-180 to 180) - Required for LocalBusiness Schema
```

No further action needed for TypeScript types.

---

## Summary Checklist

Before marking this task complete:

- [ ] Added **Latitude** field to Branch Locations table (Number, 6 decimals)
- [ ] Added **Longitude** field to Branch Locations table (Number, 6 decimals)
- [ ] Added field descriptions with instructions
- [ ] Populated coordinates for **ALL** existing branch records
- [ ] Verified coordinates in Google Maps (correct locations)
- [ ] Ran coordinate validation script (all branches pass)
- [ ] Exported updated Airtable data to `content.json`
- [ ] Updated schema documentation
- [ ] Confirmed TypeScript types are up to date
- [ ] Tested build process (no coordinate errors)

---

## Questions?

If you encounter any issues during this process:

1. **Schema Questions:** Contact the Project Architect
2. **Airtable Access Issues:** Contact the Airtable Admin
3. **Google Maps Issues:** Use [Google Maps](https://www.google.com/maps) desktop version
4. **Build Validation Issues:** Contact the Developer team

---

**Document Owner:** Development Team
**Review Frequency:** As needed (one-time schema change)
**Related Documents:**
- `Archive/airtable-schema-phase1.md` - Complete schema reference
- `docs/architecture/data-models.md` - Data model overview
- `scripts/validate-branch-coordinates.js` - Validation script
