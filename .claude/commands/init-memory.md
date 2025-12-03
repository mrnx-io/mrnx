---
description: Initialize or reinitialize the Memory Bank
---

# Initialize Memory Bank

First-time setup or refresh of the Memory Bank.

## Steps

### 1. Analyze Project

```bash
ls -la
find . -type f -name "*.tsx" | head -30
```

### 2. Create Structure

```bash
mkdir -p .claude/{memory-bank,agents,commands,skills}
```

### 3. Create Files

- brief.md
- product.md
- architecture.md
- tech.md
- context.md
- first-principles.md
- tasks.md

### 4. Create CLAUDE.md

Boot sequence file in project root.

### 5. Verify

```bash
ls -la .claude/memory-bank/
```
