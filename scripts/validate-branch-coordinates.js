#!/usr/bin/env node

/**
 * Validate Branch Coordinates
 *
 * This script validates that all Branch Locations in Airtable have
 * Latitude and Longitude coordinates before allowing a production build.
 *
 * CRITICAL: This prevents AI hallucination by ensuring all geographic
 * data comes from manually entered Airtable fields (from Google Maps).
 *
 * Usage:
 *   node scripts/validate-branch-coordinates.js
 *
 * Exit codes:
 *   0 - All branches have valid coordinates
 *   1 - One or more branches missing coordinates (build should fail)
 */

const fs = require('fs')
const path = require('path')

// ============================================
// Configuration
// ============================================

const CONTENT_JSON_PATH = path.join(__dirname, '..', 'content.json')

// Valid coordinate ranges
const LATITUDE_MIN = -90
const LATITUDE_MAX = 90
const LONGITUDE_MIN = -180
const LONGITUDE_MAX = 180

// ============================================
// Main Validation Logic
// ============================================

function main() {
  console.log('='.repeat(60))
  console.log('🌍 Validating Branch Location Coordinates')
  console.log('='.repeat(60))
  console.log('')

  // Check if content.json exists
  if (!fs.existsSync(CONTENT_JSON_PATH)) {
    console.error('❌ ERROR: content.json not found')
    console.error(`   Expected path: ${CONTENT_JSON_PATH}`)
    console.error('')
    console.error('   Please run the Airtable export script first:')
    console.error('   npm run export:airtable')
    process.exit(1)
  }

  // Load content.json
  let contentData
  try {
    const fileContent = fs.readFileSync(CONTENT_JSON_PATH, 'utf8')
    contentData = JSON.parse(fileContent)
  } catch (error) {
    console.error('❌ ERROR: Failed to parse content.json')
    console.error(`   ${error.message}`)
    process.exit(1)
  }

  // Check if branches array exists
  if (!contentData.branches || !Array.isArray(contentData.branches)) {
    console.error('❌ ERROR: content.json does not contain "branches" array')
    console.error('')
    console.error('   Please ensure the Airtable export includes Branch Locations.')
    process.exit(1)
  }

  const branches = contentData.branches
  console.log(`📍 Found ${branches.length} branch location(s) to validate\n`)

  // Validate each branch
  const errors = []
  const warnings = []

  branches.forEach((branch, index) => {
    const branchName = branch.branchName || `Branch ${index + 1}`
    const branchId = branch.branchId || 'Unknown ID'
    const latitude = branch.latitude
    const longitude = branch.longitude

    console.log(`Checking: ${branchName} (ID: ${branchId})`)

    // Check if latitude exists
    if (latitude === undefined || latitude === null) {
      errors.push({
        branch: branchName,
        branchId,
        issue: 'Missing Latitude',
        details: 'Latitude field is not set in Airtable Branch Locations table',
      })
      console.log(`   ❌ Missing Latitude`)
    } else {
      // Validate latitude range
      if (typeof latitude !== 'number') {
        errors.push({
          branch: branchName,
          branchId,
          issue: 'Invalid Latitude Type',
          details: `Latitude must be a number, got: ${typeof latitude}`,
        })
        console.log(`   ❌ Invalid Latitude Type: ${typeof latitude}`)
      } else if (latitude < LATITUDE_MIN || latitude > LATITUDE_MAX) {
        errors.push({
          branch: branchName,
          branchId,
          issue: 'Invalid Latitude Range',
          details: `Latitude ${latitude} is outside valid range (${LATITUDE_MIN} to ${LATITUDE_MAX})`,
        })
        console.log(`   ❌ Invalid Latitude: ${latitude} (must be -90 to 90)`)
      } else {
        console.log(`   ✅ Latitude: ${latitude}`)
      }
    }

    // Check if longitude exists
    if (longitude === undefined || longitude === null) {
      errors.push({
        branch: branchName,
        branchId,
        issue: 'Missing Longitude',
        details: 'Longitude field is not set in Airtable Branch Locations table',
      })
      console.log(`   ❌ Missing Longitude`)
    } else {
      // Validate longitude range
      if (typeof longitude !== 'number') {
        errors.push({
          branch: branchName,
          branchId,
          issue: 'Invalid Longitude Type',
          details: `Longitude must be a number, got: ${typeof longitude}`,
        })
        console.log(`   ❌ Invalid Longitude Type: ${typeof longitude}`)
      } else if (longitude < LONGITUDE_MIN || longitude > LONGITUDE_MAX) {
        errors.push({
          branch: branchName,
          branchId,
          issue: 'Invalid Longitude Range',
          details: `Longitude ${longitude} is outside valid range (${LONGITUDE_MIN} to ${LONGITUDE_MAX})`,
        })
        console.log(`   ❌ Invalid Longitude: ${longitude} (must be -180 to 180)`)
      } else {
        console.log(`   ✅ Longitude: ${longitude}`)
      }
    }

    // Check for suspicious coordinates
    if (
      latitude !== undefined &&
      latitude !== null &&
      longitude !== undefined &&
      longitude !== null &&
      typeof latitude === 'number' &&
      typeof longitude === 'number'
    ) {
      // Check for (0, 0) - Null Island (likely placeholder)
      if (latitude === 0 && longitude === 0) {
        warnings.push({
          branch: branchName,
          branchId,
          issue: 'Suspicious Coordinates',
          details:
            'Coordinates are (0, 0) which is in the ocean off Africa. ' +
            'This is likely a placeholder. Please verify in Airtable.',
        })
        console.log(`   ⚠️  Warning: Coordinates are (0, 0) - likely placeholder`)
      }

      // Check for whole numbers (unusual for precise coordinates)
      if (Number.isInteger(latitude) && Number.isInteger(longitude)) {
        warnings.push({
          branch: branchName,
          branchId,
          issue: 'Whole Number Coordinates',
          details:
            'Both latitude and longitude are whole numbers, which is unusual. ' +
            'Please verify these are real coordinates from Google Maps.',
        })
        console.log(`   ⚠️  Warning: Both coordinates are whole numbers (unusual)`)
      }
    }

    console.log('') // Empty line between branches
  })

  // ============================================
  // Report Results
  // ============================================

  console.log('='.repeat(60))
  console.log('📊 Validation Results')
  console.log('='.repeat(60))
  console.log('')

  if (errors.length === 0 && warnings.length === 0) {
    console.log('✅ SUCCESS: All branches have valid coordinates!')
    console.log(`   ${branches.length} branch(es) validated successfully`)
    console.log('')
    console.log('Build can proceed safely.')
    process.exit(0)
  }

  // Display errors
  if (errors.length > 0) {
    console.log(`❌ ERRORS: ${errors.length} issue(s) found\n`)

    errors.forEach((error, index) => {
      console.log(`${index + 1}. ${error.branch} (ID: ${error.branchId})`)
      console.log(`   Issue: ${error.issue}`)
      console.log(`   Details: ${error.details}`)
      console.log('')
    })

    console.log('='.repeat(60))
    console.log('🚨 BUILD CANNOT CONTINUE')
    console.log('='.repeat(60))
    console.log('')
    console.log('To fix these errors:')
    console.log('')
    console.log('1. Open your Airtable Base: Landing Pages Content Management')
    console.log('2. Go to the "Branch Locations" table')
    console.log('3. For each branch with errors:')
    console.log('   a. Go to Google Maps')
    console.log('   b. Search for the branch address')
    console.log('   c. Right-click on the location marker')
    console.log('   d. Click "What\'s here?"')
    console.log('   e. Copy the coordinates (e.g., 41.499320, -81.694400)')
    console.log('   f. Paste Latitude (first number) into the Latitude field')
    console.log('   g. Paste Longitude (second number) into the Longitude field')
    console.log('')
    console.log('4. Re-export content.json:')
    console.log('   npm run export:airtable')
    console.log('')
    console.log('5. Re-run this validation:')
    console.log('   npm run validate:coordinates')
    console.log('')
    console.log('⚠️  CRITICAL: These coordinates MUST be manually entered from')
    console.log('   Google Maps to prevent AI hallucination of business locations.')
    console.log('')

    process.exit(1)
  }

  // Display warnings (non-fatal)
  if (warnings.length > 0) {
    console.log(`⚠️  WARNINGS: ${warnings.length} warning(s) found\n`)

    warnings.forEach((warning, index) => {
      console.log(`${index + 1}. ${warning.branch} (ID: ${warning.branchId})`)
      console.log(`   Issue: ${warning.issue}`)
      console.log(`   Details: ${warning.details}`)
      console.log('')
    })

    console.log('='.repeat(60))
    console.log('⚠️  BUILD CAN CONTINUE (WITH WARNINGS)')
    console.log('='.repeat(60))
    console.log('')
    console.log('Please review the warnings above and verify the coordinates')
    console.log('in Airtable are correct.')
    console.log('')

    // Exit with success (warnings don't block build)
    process.exit(0)
  }
}

// ============================================
// Run Script
// ============================================

main()
