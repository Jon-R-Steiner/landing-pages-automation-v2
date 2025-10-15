<!-- Powered by BMAD™ Core -->

# Document Airtable Script Task

## Purpose

Create comprehensive documentation for an existing or newly created Airtable script following standardized format.

## Instructions

When this task is executed, follow these steps:

### 1. Verify Script Exists

Ask the user for the script file path or script name.

If documenting an existing script:
- Read the script file to understand its functionality
- Extract operations, configuration, error handling

If documenting a new script just created:
- Use information from recent implementation

### 2. Execute Document Creation

Run the `create-doc.md` task with the `airtable-script-doc-tmpl.yaml` template.

This will guide you through creating complete documentation with sections for:
- Overview and purpose
- Airtable base/table information
- Operations performed
- Configuration requirements
- Usage instructions
- Error handling
- Testing approach
- Maintenance notes

### 3. Load Reference Patterns

While creating the documentation, reference:
- `docs/api-reference/airtable/reference/patterns.md` for standard patterns
- The actual script code for accurate technical details

### 4. Placement

Save the generated documentation to:
- `scripts/airtable/{{script-name}}.README.md`

Or if creating general script documentation:
- `scripts/airtable/README.md` (overview of all scripts)

### 5. Update Index

If `scripts/airtable/README.md` exists as an index:
- Add link to this script's documentation
- Update the scripts inventory list

## Completion Criteria

- [ ] Script functionality fully documented
- [ ] Configuration requirements clear
- [ ] Usage instructions tested and accurate
- [ ] Error handling scenarios documented
- [ ] Testing approach explained
- [ ] Documentation saved in correct location
