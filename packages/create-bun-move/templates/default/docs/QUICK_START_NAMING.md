# Quick Start: Package Naming Enforcement

**TL;DR:** We have automated tools to ensure naming conventions are followed.

---

## For Developers: Creating a New Package

### Option 1: Use the Wizard (Recommended) ✨

```bash
bun scripts/create-package.ts
```

The wizard will:
- ✅ Guide you through naming
- ✅ Validate in real-time
- ✅ Create proper structure
- ✅ Generate tests and README

### Option 2: Manual Creation

1. Create package following naming rules
2. Validate:
   ```bash
   bun scripts/validate-package-names.ts --check packages/your-package/package.json
   ```

---

## Setup (One-Time)

### Install Git Hooks

```bash
cd bun-move
bun scripts/setup-git-hooks.sh
```

This installs validation hooks that run automatically when you commit.

---

## Naming Rules (Quick Reference)

### ✅ DO

**Foundation (@tortoise-os/*):**
```
@tortoise-os/oracle
@tortoise-os/math
@tortoise-os/testing
```

**Products (@carapace/*, @hatch/*):**
```
@carapace/pool-sdk         ← Specific feature
@carapace/strategy-sdk     ← Specific feature
@carapace/carapace-ui      ← Product-prefixed
@hatch/trading-sdk         ← Specific feature
```

### ❌ DON'T

```
@carapace/core            ← Too generic
@hatch/sdk                ← Too generic
@carapace/ui              ← Missing product prefix
```

---

## Validation Happens Automatically

1. **When you commit** - Pre-commit hook validates
2. **When you create PR** - CI validates
3. **Before publishing** - Pre-publish check validates

---

## Commands

```bash
# Create new package (interactive)
bun scripts/create-package.ts

# Validate all packages
bun scripts/validate-package-names.ts

# Validate specific package
bun scripts/validate-package-names.ts --check path/to/package.json

# Install git hooks
bun scripts/setup-git-hooks.sh
```

---

## Full Documentation

- **Naming Rules:** [`PACKAGE_STRUCTURE_FINAL.md`](./PACKAGE_STRUCTURE_FINAL.md)
- **Enforcement Details:** [`PACKAGE_NAMING_ENFORCEMENT.md`](./PACKAGE_NAMING_ENFORCEMENT.md)
- **Consolidation Summary:** [`PACKAGE_CONSOLIDATION_COMPLETE.md`](./PACKAGE_CONSOLIDATION_COMPLETE.md)

---

**Questions?** See the full docs above or ask the team!
