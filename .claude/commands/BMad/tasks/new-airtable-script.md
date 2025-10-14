<!-- Powered by BMAD™ Core -->

  # New Airtable Script Task

  ## Purpose

  Create a new Airtable script following project-specific patterns, conventions, and architecture.

  ## Instructions

  When this task is executed, follow these steps:

  ### 1. Load Project Context

  Load the following custom documentation:
  - `docs/workflows/airtable-to-production/README.md` (or your specific workflow doc)
  - `docs/architecture/airtable-integration-patterns.md` (if you have one)
  - Any other relevant context files

  ### 2. Understand Requirements

  Ask the user:
  1. What does this script need to accomplish?
  2. Which Airtable base/table is it for?
  3. What data transformations are needed?
  4. Should it follow existing script patterns? (e.g., existing scripts in `scripts/` folder)

  ### 3. Review Existing Patterns

  Search for existing Airtable scripts in the project:
  - Check `scripts/` directory
  - Identify common patterns (error handling, logging, API usage)
  - Note authentication methods used

  ### 4. Implement Script

  Following the project's coding standards (from devLoadAlwaysFiles):
  - Create script file in appropriate location
  - Implement required functionality
  - Add proper error handling
  - Include logging and debugging support
  - Add configuration management

  ### 5. Testing & Validation

  - Create test cases
  - Validate against Airtable schema
  - Test error scenarios
  - Document usage and configuration

  ### 6. Documentation

  Update relevant documentation:
  - Add script to scripts inventory/README
  - Document configuration requirements
  - Add usage examples

  ## Blocking Conditions

  HALT for:
  - Missing Airtable API credentials
  - Unclear requirements
  - Unknown base/table structure
  - Missing dependencies

  ## Completion Criteria

  - [ ] Script created and tested
  - [ ] Follows project coding standards
  - [ ] Error handling implemented
  - [ ] Documentation updated
  - [ ] Configuration documented