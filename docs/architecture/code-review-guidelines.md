# Code Review Guidelines

## Reviewer Responsibilities

**What to Check:**
1. **Functionality** - Does it work as intended?
2. **Code Quality** - Is it readable, maintainable, efficient?
3. **Best Practices** - Follows project standards and patterns?
4. **Security** - No exposed secrets, proper input validation?
5. **Performance** - No performance regressions?
6. **Accessibility** - WCAG 2.1 AA compliant?
7. **Tests** - Are tests included (when applicable)?

**Review Feedback Format:**
- ✅ **Approve** - Looks good, ready to merge
- 💬 **Comment** - Suggestions for improvement (not blocking)
- ⚠️ **Request Changes** - Issues must be fixed before merge

**Example Comments:**
```
💡 Suggestion: Consider extracting this logic into a helper function for reusability

⚠️ Issue: This hardcodes the API key - should use environment variable

✅ Looks good: Nice use of Server Components to reduce JS bundle
```

## Author Responsibilities

**Before Requesting Review:**
- ✅ Self-review code (catch obvious issues)
- ✅ Run linter and fix all issues
- ✅ Test locally (including edge cases)
- ✅ Check Lighthouse score (LCP <2.5s)
- ✅ Write clear PR description

**During Review:**
- ✅ Respond to comments promptly
- ✅ Ask clarifying questions if feedback unclear
- ✅ Push fixes to same branch (no new PR needed)
- ✅ Re-request review after addressing feedback
