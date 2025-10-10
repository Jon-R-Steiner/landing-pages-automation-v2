# Git Workflow

## Branch Strategy

**Main Branches:**
- `main` - Production-ready code, deploys to Netlify automatically
- `develop` - Integration branch for feature development (optional)

**Feature Branches:**
```bash
# Feature branch naming convention
feature/short-description

# Examples:
feature/three-stage-form
feature/trust-bar-component
feature/airtable-export-script
```

**Bugfix Branches:**
```bash
# Bugfix branch naming convention
bugfix/issue-description

# Examples:
bugfix/form-validation-error
bugfix/lcp-optimization
```

**Hotfix Branches:**
```bash
# Hotfix branch naming convention (for production emergencies)
hotfix/critical-issue

# Example:
hotfix/api-key-exposure
```

## Feature Development Workflow

**Step 1: Create Feature Branch**
```bash
# Ensure main is up to date
git checkout main
git pull origin main

# Create and switch to feature branch
git checkout -b feature/trust-bar-component
```

**Step 2: Develop and Commit**
```bash
# Make changes, test locally

# Stage changes
git add .

# Commit with descriptive message
git commit -m "Add TrustBar component with icon support

- Create TrustBar component with dynamic icons
- Add Heroicons integration
- Implement responsive grid layout
- Add accessibility labels for screen readers

Relates to #42"
```

**Commit Message Format:**
```
<type>: <subject>

<body>

<footer>
```

**Types:**
- `feat:` - New feature
- `fix:` - Bug fix
- `refactor:` - Code refactoring (no functional change)
- `style:` - Formatting, whitespace changes
- `docs:` - Documentation updates
- `test:` - Test additions or updates
- `chore:` - Build process, dependencies, tooling

**Step 3: Push and Create Pull Request**
```bash
# Push feature branch to remote
git push origin feature/trust-bar-component

# Create Pull Request on GitHub
# - Add description of changes
# - Reference related issues
# - Request review from team
```

## Pull Request Process

**PR Template:**
```markdown
# Description
Brief description of changes

# Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

# Testing
- [ ] Tested locally
- [ ] Lighthouse score checked (LCP <2.5s)
- [ ] Accessibility tested (keyboard navigation, screen reader)
- [ ] Mobile tested (responsive design)

# Screenshots (if UI changes)
[Add screenshots]

# Related Issues
Closes #42
```

**Review Checklist:**
- ✅ Code follows TypeScript and React best practices
- ✅ No `console.log` or debugging code left in
- ✅ Environment variables properly configured (no hardcoded secrets)
- ✅ Components use Server Components by default (Client Components only when needed)
- ✅ Tailwind CSS classes used (no inline styles)
- ✅ Accessibility: semantic HTML, ARIA labels, keyboard navigation
- ✅ Performance: LCP target met, images optimized
- ✅ Tests pass (when implemented)

## Merging Strategy

**Option A: Squash and Merge (Recommended for Feature Branches)**
- Combines all commits into single commit on main
- Cleaner Git history
- Easier to revert if needed

**Option B: Merge Commit (For Major Features with Meaningful History)**
- Preserves all commits
- Useful for complex features with multiple logical steps

**After Merge:**
```bash
# Delete local feature branch
git branch -d feature/trust-bar-component

# Delete remote feature branch (usually automatic on GitHub)
git push origin --delete feature/trust-bar-component

# Update local main
git checkout main
git pull origin main
```
