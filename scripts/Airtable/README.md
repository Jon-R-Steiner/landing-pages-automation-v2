# Airtable Automation Scripts

**Purpose:** This directory contains JavaScript automation scripts designed to run inside Airtable's scripting environment, not Node.js build scripts.

**Last Updated:** 2025-10-14

---

## 🎯 What Are These Scripts?

These are **Airtable UI automation scripts** that:
- Run **inside Airtable's automation environment** (server-side, within Airtable)
- Use the **Airtable Scripting API** (not Node.js Airtable SDK)
- Are **manually copied** into Airtable automation UI by developers
- Are **triggered by Airtable events** (record updates, button clicks, schedules)

**NOT Node.js build scripts** - For Node.js build scripts, see the root `scripts/` folder.

---

## 📚 Script Inventory

| Script | Status | Purpose | Documentation |
|--------|--------|---------|---------------|
| `airtable-automation-match-branch.js` | ✅ Production | Smart branch matching with self-healing logic | [README](./airtable-automation-match-branch.README.md) |

---

## 🛠️ Creating New Scripts

### Using BMad Dev Agent

**Command:** `*new-airtable-script`

**What it does:**
1. Loads Airtable scripting documentation and patterns
2. Guides you through requirements gathering
3. Creates properly structured script in this directory
4. Follows project coding standards
5. Implements error handling and logging

**Prerequisites:**
- Activate dev agent: `/agent dev`
- Have Airtable base/table structure documented
- Understand the automation trigger and requirements

**Example:**
```bash
/agent dev
*new-airtable-script
# Follow prompts to create your script
```

---

## 📖 Documenting Scripts

### Using BMad Dev Agent

**Command:** `*document-airtable-script`

**What it does:**
1. Creates comprehensive documentation following standardized template
2. Documents configuration, usage, error handling, testing
3. Saves as `[script-name].README.md` in this directory

**Example:**
```bash
/agent dev
*document-airtable-script
# Provide script name when prompted
```

---

## 📁 File Structure

Each automation script follows this pattern:

```
scripts/Airtable/
├── airtable-automation-match-branch.js       # The script
├── airtable-automation-match-branch.README.md # Documentation
├── [next-script].js
├── [next-script].README.md
└── README.md                                  # This file
```

**Naming Convention:** `airtable-automation-[descriptive-name].js`

---

## 🔄 Deployment Workflow

1. **Create Script:**
   - Use `*new-airtable-script` command
   - Script created in `scripts/Airtable/[name].js`

2. **Test Locally:**
   - Review script code
   - Verify logic and error handling

3. **Copy to Airtable:**
   - Open Airtable automation
   - Create "Run script" action
   - Copy/paste script code from file
   - Configure input variables

4. **Configure:**
   - Set input variables (recordId, etc.)
   - Configure trigger conditions
   - Test with sample records

5. **Document:**
   - Use `*document-airtable-script` command
   - Creates `[script-name].README.md`
   - Update this inventory

6. **Commit to Git:**
   - Both `.js` and `.README.md` files
   - Keeps version history

---

## 📋 Script Standards

All scripts in this directory follow these standards:

### Code Structure
```javascript
/**
 * Airtable Automation Script: [Script Name]
 *
 * Purpose: [What this script does]
 * Trigger: [When it runs]
 *
 * Logic:
 * 1. [Step 1]
 * 2. [Step 2]
 * 3. [Step 3]
 */

// === INPUT ===
let config = input.config();
// Extract input variables

// === VALIDATION ===
// Validate inputs and required fields

// === MAIN LOGIC ===
// Core script functionality

// === OUTPUT ===
output.set('result', result);
output.set('message', message);
```

### Error Handling
- ✅ Comprehensive input validation
- ✅ Graceful error handling with clear messages
- ✅ Detailed console logging for debugging
- ✅ Output variables for downstream automation steps

### Documentation
- ✅ Purpose and trigger clearly stated
- ✅ Input/output variables documented
- ✅ Test scenarios provided
- ✅ Troubleshooting guide included

---

## 🧪 Testing Best Practices

Before deploying to production:

1. **Test with Sample Records:**
   - Create test records in Airtable
   - Manually trigger automation
   - Review console output

2. **Verify Edge Cases:**
   - Empty fields
   - Missing linked records
   - Invalid input types
   - Rate limit scenarios

3. **Monitor First Runs:**
   - Watch automation run history
   - Check for errors or unexpected behavior
   - Validate output variables

---

## 📚 Reference Documentation

### Airtable Scripting API
- **Fundamentals:** `docs/api-reference/airtable/reference/fundamentals.md`
- **Patterns:** `docs/api-reference/airtable/reference/patterns.md`
- **Best Practices:** `docs/api-reference/airtable/reference/best-practices.md`

### Project Documentation
- **Architecture:** `docs/architecture/source-tree.md` (scripts section)
- **Workflows:** `docs/workflows/airtable-to-production/`

---

## ⚠️ Important Notes

### Distinction from Build Scripts
- **Build Scripts** (`scripts/` root): Run by Node.js/npm during CI/CD build
- **Airtable Scripts** (`scripts/Airtable/`): Run by Airtable UI, manually deployed

### Not Part of Build Process
- These scripts are **NOT** called by `package.json` scripts
- These scripts are **NOT** run during Netlify builds
- These scripts are **NOT** imported by application code

### Version Control
- **DO** commit `.js` files to Git (source code)
- **DO** commit `.README.md` files to Git (documentation)
- **DO** keep scripts in sync with Airtable UI (manual deployment)

---

## 🤝 Support

**Questions or Issues?**
1. Check individual script documentation (`.README.md` files)
2. Review Airtable scripting reference docs
3. Use BMad dev agent for creating/documenting scripts
4. Contact project maintainer

---

**Maintained by:** Dev Agent (James) via BMad Core
**Framework:** BMad Method
**Last Review:** 2025-10-14
