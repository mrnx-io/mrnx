---
description: Create a conventional commit with AI-generated message and push to remote
---

# Git Commit

Create a well-structured commit with an AI-generated conventional commit message.

## Steps

### 1. Check for Changes

```bash
git status
```

### 2. Analyze Changes

```bash
git diff
git diff --cached
```

### 3. Determine Commit Type

| Type | When to Use |
|------|-------------|
| `feat` | New components, pages, features |
| `fix` | Bug fixes |
| `docs` | Documentation |
| `refactor` | Code restructuring |
| `style` | CSS, formatting |
| `test` | Test additions |
| `chore` | Config, dependencies |

### 4. Commit Format

```
type(scope): concise summary

- Key change 1
- Key change 2

🤖 Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>
```

### 5. Stage and Commit

```bash
git add -A
git commit -m "type(scope): summary..."
```

### 6. Push

```bash
git push
```
