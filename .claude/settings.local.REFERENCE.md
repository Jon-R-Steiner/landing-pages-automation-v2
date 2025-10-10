# Claude Code Permissions Reference

This document explains the permissions configured in `settings.local.json` for this project.

## ✅ Auto-Approved Commands (No Permission Prompts)

### Core Tools
- `mcp__sequential-thinking__sequentialthinking` - Complex problem-solving
- `WebSearch` - Search the web for current information

### Documentation Access
- `WebFetch` for Next.js, Netlify, Airtable, Anthropic Claude, React, Tailwind, GitHub, npm docs

### BMAD Framework
- All `/bmad-*` and `/BMad:*` slash commands for project automation

### File Reading
- Full read access to project directory: `C:\Users\JonSteiner\landing-pages-automation-v2\**`
- Claude config directories
- Temp directories

### Git Operations (Standard Workflow)
- `git status`, `git diff`, `git log` - Inspection
- `git branch`, `git checkout` - Branch management
- `git add`, `git commit`, `git push` - Standard commits
- `git pull`, `git fetch`, `git stash` - Syncing
- `git show`, `git remote` - Information

### Node/npm Commands
- `npm install`, `npm ci` - Dependency installation
- `npm run *` - Running scripts (dev, build, test, etc.)
- `npm test`, `npm start` - Common commands
- `npm audit`, `npm outdated`, `npm list` - Maintenance
- `npx *` - Running packages

### Next.js Commands
- `next build` - Production build
- `next dev` - Development server
- `next start` - Start production server
- `next lint` - Linting
- `next info` - System info

### Netlify CLI
- `netlify *` - All Netlify CLI commands (deploy, dev, functions, etc.)

### Testing Frameworks
- `jest`, `vitest`, `playwright` - Test runners
- `test:*` - Custom test scripts

### Code Quality
- `eslint` - Linting
- `prettier` - Formatting
- `tsc` - TypeScript compiler

### Safe File Operations
- `ls`, `pwd`, `cd`, `mkdir`, `touch` - Navigation
- `cp`, `mv` - Copying/moving files
- **Safe deletions only:**
  - `rm -rf node_modules` - Clean dependencies
  - `rm -rf .next`, `rm -rf out`, `rm -rf dist`, `rm -rf build` - Clean build directories
  - `rm -f *.log` - Clean log files
  - `rm -rf coverage` - Clean test coverage

### Text Processing
- `cat`, `head`, `tail` - View files
- `grep`, `find` - Search
- `echo`, `sed`, `awk`, `wc`, `sort`, `uniq` - Processing

### System Information
- `which`, `where`, `whereis` - Find commands
- `env`, `printenv` - Environment variables
- `node --version`, `npm --version`, `git --version` - Version checks

### Python (for build scripts)
- `python`, `python3` - Run Python scripts
- `pip`, `pip3` - Package management

### Network/API Testing
- `curl`, `wget` - HTTP requests

### Claude CLI
- `claude --version`, `claude mcp`, `claude config` - Claude CLI management

### Airtable MCP (All Read/Write Operations)
- `list_bases`, `list_tables`, `describe_table` - Schema inspection
- `list_records`, `search_records`, `get_record` - Reading data
- `create_record`, `update_records` - Writing data
- `create_table`, `update_table` - Schema management
- `create_field`, `update_field` - Field management

## ❌ Explicitly Denied Commands (Always Require Approval)

### Destructive File Operations
- `rm -rf /*` - Delete entire filesystem
- `rm -rf ~/*` - Delete home directory
- `rm -rf C:/*` - Delete C: drive

### System Operations
- `format` - Format drives
- `shutdown`, `reboot` - System restart

### Dangerous Git Operations
- `git reset --hard` - Lose uncommitted changes
- `git push --force`, `git push -f` - Overwrite remote history

### Production Operations
- `npm publish` - Publish to npm registry

### Dangerous Airtable Operations
- `mcp__airtable__delete_records` - Delete Airtable records (ask first)

## 🤔 Ask for Confirmation (Empty - Add as Needed)

Currently no commands require explicit confirmation beyond the deny list. You can add patterns here if you want specific operations to prompt for approval.

## Usage Tips

1. **Most common dev tasks are auto-approved** - build, test, commit, etc.
2. **Destructive operations require approval** - keeps your data safe
3. **Add patterns as needed** - If you find yourself approving the same command repeatedly, add it to the allow list
4. **Remove patterns if concerned** - Move from allow to ask or deny if you want more control

## Example: Adding a New Permission

To allow a new command pattern, add it to the `allow` array in `settings.local.json`:

```json
{
  "permissions": {
    "allow": [
      "Bash(your-new-command*)"
    ]
  }
}
```

Pattern matching:
- `*` matches any characters
- `Bash(npm *)` allows all npm commands
- `Bash(git status*)` allows `git status`, `git status --short`, etc.
