<!-- Powered by BMAD™ Core -->

# New Airtable Script Task

## Purpose

Create a new Airtable script following project-specific patterns, conventions, and architecture.

## Instructions

When this task is executed, follow these steps:

### 1. Initial Context Loading

**Load the overview document:**
- `docs/Dev Docs/Airtable/Scripting/README.md`

This README provides:
- Documentation structure and what each file contains
- Quick reference to patterns and best practices
- Links to all detailed docs
- Common use cases mapped to specific patterns

### 2. Understand Requirements

Ask the user:
1. What does this script need to accomplish?
2. Which Airtable base/table is it for?
3. What data transformations are needed?
4. Should it follow existing script patterns? (e.g., existing scripts in `scripts/` folder)
5. Is this script part of a documented workflow? If yes, which one?
6. Should this script be referenced in any architecture documentation?

**Note:** Save answers to questions 5-6 for use in Step 8 (Documentation)

### 3. Intelligent Context Loading

Based on the requirements from Step 2, determine which detailed documentation to load.

**Decision Logic:**

**Load `01-airtable-scripting-fundamentals.md` if:**
- User mentions unfamiliar Airtable concepts
- Script needs field type handling (linked records, arrays, etc.)
- Questions about async/await patterns
- Need to understand Airtable API basics
- Working with input.config() or output.set()

**Load `02-airtable-scripting-patterns.md` if:**
- Need to find/lookup records (Pattern 1-4)
- Need to update records conditionally (Pattern 5-7)
- Processing many records (>50) - batch patterns (Pattern 8-9)
- Need validation logic (Pattern 10-11)
- Need to compare or match records (Pattern 12-13)
- Need error handling examples (Pattern 14-16)

**Load `03-airtable-scripting-best-practices.md` if:**
- Building a complex script (organization guidance)
- Need performance optimization
- Script will run frequently (efficiency matters)
- Need testing/debugging strategies
- Security or data safety concerns

**Load `docs/workflows/airtable-to-production/README.md` if:**
- Script relates to production workflow
- Need to understand how script fits into larger system

**Load `docs/architecture/tech-stack.md` if:**
- Need project-wide standards
- Unsure about Node.js version, testing frameworks, etc.

**Examples:**

*User says: "Create a script that finds a matching branch record and updates a page"*
→ Load: `02-airtable-scripting-patterns.md` (Pattern 1: Find by field, Pattern 5: Conditional update)

*User says: "Create a script to process 200 pages and enrich them with data"*
→ Load: `02-airtable-scripting-patterns.md` (Pattern 8: Batch processing, Pattern 6: Multi-field update)

*User says: "Create a validation script for required fields"*
→ Load: `02-airtable-scripting-patterns.md` (Pattern 10: Required field validation, Pattern 16: Input validation)

*User says: "Create a complex multi-stage automation with fallbacks"*
→ Load: `03-airtable-scripting-best-practices.md` (Organization), `02-airtable-scripting-patterns.md` (Pattern 14: Graceful degradation)

**Note:** You can load multiple docs if needed, but be selective. The README already gave you the overview.

### 4. Verify Context Sufficiency

After loading documentation in Step 3, assess whether you have enough information:

**Self-Assessment Questions:**
- Do I understand how to accomplish the user's requirements?
- Do I have code examples for the key operations?
- Am I clear on error handling and edge cases?
- Do I know the file structure and naming conventions?

**If you identify gaps, load additional documentation:**

**Gap: Don't understand Airtable field types or API basics**
→ Load: `docs/Dev Docs/Airtable/Scripting/01-airtable-scripting-fundamentals.md`

**Gap: Need better organization for complex script**
→ Load: `docs/Dev Docs/Airtable/Scripting/03-airtable-scripting-best-practices.md`

**Gap: Unclear about specific pattern mentioned in README**
→ Re-read relevant section of README or load the detailed doc

**Gap: Need to understand project workflow integration**
→ Load: `docs/workflows/airtable-to-production/README.md`

**If no gaps exist:**
→ Proceed to Step 5

**Important:** This is your opportunity to ensure quality. Better to load one more document now than implement incorrectly.

### 5. Review Existing Scripts (Optional)

If user mentioned following existing patterns, review existing production scripts:

**Production Scripts Location:** `scripts/Airtable/`

**Available Production Scripts:**
- `airtable-automation-match-branch.js` - Smart branch matching with self-healing

**What to Look For:**
- File structure and organization
- Error handling patterns in practice
- Logging approach (console.log vs console.error)
- Input variable usage
- Output variable setting
- Comment style and documentation

**Note:** The README in `docs/Dev Docs/Airtable/Scripting/` references the production script and explains its patterns.

### 6. Implement Script

**File Output Requirements:**
- **Location:** `scripts/Airtable/` directory
- **Format:** JavaScript (`.js` file)
- **Naming Convention:** Use descriptive kebab-case (e.g., `match-branch-to-location.js`, `validate-page-fields.js`)
- **Full Path Example:** `scripts/Airtable/match-branch-to-location.js`

**Implementation Steps:**

Using the patterns and best practices from loaded documentation:
- Use script template from README (if applicable)
- Copy relevant patterns from loaded docs
- Follow coding standards (from devLoadAlwaysFiles)
- Create script file in `scripts/Airtable/` directory
- Write in JavaScript using Airtable Scripting API syntax
- Implement required functionality with proper error handling
- Include logging and debugging support
- Add configuration management

**Script Structure (use template from README):**
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
// ... (rest of template from README)
```

### 7. Testing & Validation

- Create test cases
- Validate against Airtable schema
- Test error scenarios
- Document usage and configuration

### 8. Documentation

Document the script you created:

**Option A: Create Inline Documentation (Recommended)**
Add comprehensive comments to the script file itself:
- Script header with purpose, trigger, and logic overview
- Inline comments explaining complex logic
- Configuration notes (what input variables are needed)
- Example usage in comments

**Option B: Create Script-Specific README (If Complex)**
If script is complex, create:
- `scripts/Airtable/[script-name].README.md`
- Document: Purpose, Configuration, Usage, Troubleshooting

**Option C: Update Project Documentation (If Applicable)**
Based on answers from Step 2 (questions 5-6):

**If user said script is part of a documented workflow:**
- Ask user for exact workflow file path (e.g., `docs/workflows/airtable-to-production/README.md`)
- Add script reference to that workflow document
- Document: Script name, purpose, when it runs in the workflow

**If user said to add architecture reference:**
- Ask user for exact architecture file path (e.g., `docs/architecture/airtable-integration.md`)
- Add script reference to that architecture document
- Document: Script name, technical details, integration points

**If user said "no" or "not sure" to both questions:**
- Skip Option C, proceed to minimum requirements

**Minimum Required:**
- Script header comment block (always required)
- Configuration notes (what input variables needed)
- Basic usage example in script comments

### 9. Final Verification

Before marking task complete, verify:

**File Location Check:**
```bash
# Verify file exists in correct location
ls scripts/Airtable/[your-script-name].js
```

**Checklist:**
- [ ] File physically exists at `scripts/Airtable/[name].js`
- [ ] File opens and contains valid JavaScript
- [ ] Filename matches kebab-case convention
- [ ] Script follows template structure from README

If any verification fails, correct before proceeding.

## Blocking Conditions

HALT for:
- Missing Airtable API credentials
- Unclear requirements
- Unknown base/table structure
- Missing dependencies

## Completion Criteria

- [ ] Script created in `scripts/Airtable/` directory
- [ ] File is JavaScript (`.js` extension)
- [ ] Filename uses kebab-case naming convention
- [ ] Script follows project coding standards
- [ ] Error handling implemented following patterns from docs
- [ ] Logging added (console.log for success, console.error for failures)
- [ ] Script header comment block includes purpose, trigger, and logic
- [ ] Configuration requirements documented in script comments
- [ ] Script tested (or test approach documented in comments)
- [ ] Final verification completed (Step 9 checklist passed)
