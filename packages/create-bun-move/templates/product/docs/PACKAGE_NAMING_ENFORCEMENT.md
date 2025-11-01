# Package Naming Convention Enforcement

**Date:** 2025-11-01
**Status:** ✅ ACTIVE

---

## Overview

This document describes the **automated enforcement mechanisms** that ensure all packages in the TortoiseOS ecosystem follow our naming conventions.

**Why automated enforcement?**
- ✅ Prevents duplicates before they're created
- ✅ Catches naming violations early (during development)
- ✅ Provides clear feedback to developers
- ✅ Maintains consistency across the ecosystem
- ✅ No manual reviews needed for package names

---

## Enforcement Layers

We have **5 layers** of enforcement to catch naming violations:

```
┌──────────────────────────────────────────────────┐
│ 1. Interactive Package Creation Wizard          │ ← Guides developers
│    (bun scripts/create-package.ts)              │
├──────────────────────────────────────────────────┤
│ 2. Pre-commit Git Hook                          │ ← Validates before commit
│    (validates package.json changes)             │
├──────────────────────────────────────────────────┤
│ 3. CI/CD Validation (GitHub Actions)            │ ← Validates on PR
│    (runs on pull requests)                      │
├──────────────────────────────────────────────────┤
│ 4. Manual Validation Script                     │ ← Can be run anytime
│    (bun scripts/validate-package-names.ts)      │
├──────────────────────────────────────────────────┤
│ 5. Publishing Pre-flight Check                  │ ← Final check before publish
│    (runs before npm publish)                    │
└──────────────────────────────────────────────────┘
```

---

## Layer 1: Interactive Package Creation Wizard

**Purpose:** Guide developers to create properly named packages from the start

**Usage:**
```bash
bun scripts/create-package.ts
```

**Features:**
- ✅ Interactive prompts for scope and name
- ✅ Real-time validation with clear error messages
- ✅ Suggestions for better names
- ✅ Warns about potentially confusing names
- ✅ Creates complete package structure with tests

**Example Session:**
```
╔════════════════════════════════════════════════════════════╗
║  TortoiseOS Package Creation Wizard                       ║
╚════════════════════════════════════════════════════════════╝

📦 Step 1: Select package scope

Which scope is this package for?
  1. @tortoise-os - Foundation packages (shared across all products)
  2. @carapace - Carapace product packages (AMM/DEX)
  3. @hatch - Hatch product packages (Trading strategies)
  4. @turtle-net - Turtle-net product packages

Enter number: 2

✓ Selected scope: @carapace

📝 Step 2: Enter package name

Product packages should use specific, descriptive names:
  ✓ Good: pool-sdk, flash-sdk, carapace-ui, strategy-sdk
  ✗ Bad: core, sdk, ui, utils (too generic)

Enter package name (lowercase with hyphens): core

❌ Invalid package name:

  • "core" is too generic for product packages. Use a specific name like "core-feature" or "product-core"

Enter package name (lowercase with hyphens): pool-sdk

✓ Package name: @carapace/pool-sdk

📄 Step 3: Package description

Enter a brief description: Pool operations SDK for Carapace AMM

✨ Package created successfully!
```

---

## Layer 2: Pre-commit Git Hook

**Purpose:** Catch naming violations before they enter version control

**Installation:**
```bash
bun scripts/setup-git-hooks.sh
```

This installs git hooks in:
- `bun-move/.git/hooks/pre-commit`
- `carapace/.git/hooks/pre-commit`
- `hatch/.git/hooks/pre-commit`
- `turtle-net/.git/hooks/pre-commit`

**How it works:**
1. When you `git commit`, the hook runs automatically
2. It detects changed `package.json` files
3. Validates each changed package name
4. **Blocks the commit** if validation fails
5. Provides clear error messages

**Example:**
```bash
$ git add packages/core/package.json
$ git commit -m "Add core package"

🔍 Validating package names...

❌ Package name validation failed!

  @carapace/core
  Location: packages/core/package.json
  Issue: Package name "@carapace/core" uses forbidden base name "core".
         Product packages should use specific names like "@carapace/product-core or feature-core"

Please fix the package naming issues above before committing.

See docs/PACKAGE_STRUCTURE_FINAL.md for naming conventions.
```

**Bypass (not recommended):**
```bash
git commit --no-verify
```

---

## Layer 3: CI/CD Validation (GitHub Actions)

**Purpose:** Validate all packages on pull requests

**Location:** `.github/workflows/validate-package-names.yml`

**Triggers:**
- Pull requests that modify `package.json` files
- Pushes to `main` branch (protection)
- Manual workflow dispatch

**Features:**
- ✅ Runs validation on all packages in the ecosystem
- ✅ Automatically comments on PRs with errors
- ✅ Blocks merge if validation fails
- ✅ Clear documentation links in comments

**Example PR Comment:**
```markdown
## ❌ Package Name Validation Failed

Your PR contains package names that violate our naming conventions.

### Naming Rules

**Foundation Packages (@tortoise-os/*):**
- ✅ Use generic, reusable names
- ✅ Examples: `@tortoise-os/core`, `@tortoise-os/sdk`, `@tortoise-os/ui`

**Product Packages (@carapace/*, @hatch/*):**
- ✅ Use specific, descriptive names
- ✅ Examples: `@carapace/pool-sdk`, `@hatch/strategy-sdk`, `@carapace/carapace-ui`
- ❌ Forbidden: `@product/core`, `@product/sdk`, `@product/ui` (too generic)

### How to Fix

1. Review the validation errors in the workflow logs above
2. Rename packages to follow conventions
3. Update all imports in your code
4. Push your changes

See our package naming guide: [PACKAGE_STRUCTURE_FINAL.md](../docs/PACKAGE_STRUCTURE_FINAL.md)
```

---

## Layer 4: Manual Validation Script

**Purpose:** Run validation anytime, see all packages at once

**Usage:**
```bash
# Validate all packages in ecosystem
bun scripts/validate-package-names.ts

# Validate a specific package.json
bun scripts/validate-package-names.ts --check path/to/package.json
```

**Output:**
```
🔍 Scanning for packages across TortoiseOS ecosystem...

Found 15 packages

Validation Summary:
  Total packages: 15
  Duplicate names: 0
  Forbidden names: 0
  Invalid format: 0
  Scope mismatches: 0
  Total errors: 0

✅ All package names are valid!
```

**With Errors:**
```
❌ Package name validation failed:

🔴 Duplicate Package Names:

  Package: @carapace/sdk
  Locations:
    - /path/to/carapace/packages/sdk/package.json
    - /path/to/hatch/packages/sdk/package.json

🔴 Forbidden Package Names:

  @carapace/core
  Location: /path/to/carapace/packages/core/package.json
  Issue: Package name "@carapace/core" uses forbidden base name "core".
         Product packages should use specific names like "@carapace/product-core or feature-core"
```

---

## Layer 5: Publishing Pre-flight Check

**Purpose:** Final validation before packages are published to npm

**Integration:** Add to `package.json`:
```json
{
  "scripts": {
    "prepublishOnly": "bun ../../../bun-move/scripts/validate-package-names.ts --check package.json"
  }
}
```

**How it works:**
1. Runs automatically before `npm publish`
2. Validates the package being published
3. **Blocks publication** if validation fails
4. Prevents bad package names from reaching npm

---

## Validation Rules

### Rule 1: No Duplicates

**Check:** Scan all repositories for packages with the same name

**Error:**
```
Duplicate package name "@carapace/sdk" found in 2 locations
```

**Fix:** Rename one of the packages to be more specific

---

### Rule 2: No Forbidden Base Names (Products Only)

**Forbidden names for product packages:**
- `core` (use `@tortoise-os/core` or `product-core`)
- `sdk` (use specific name like `pool-sdk`, or THE main `sdk`)
- `ui` (use `@tortoise-os/ui` or `product-ui`)
- `utils` (use `@tortoise-os/core`)
- `helpers` (use `@tortoise-os/core`)
- `common` (use `@tortoise-os/core`)
- `shared` (use `@tortoise-os/core`)
- `lib` (use specific name)
- `tools` (use specific name)

**Exception:** `sdk` is allowed if it's THE main product SDK:
- ✅ `@carapace/sdk` (main AMM SDK) + `@carapace/strategy-sdk` (feature-specific) = OK
- ❌ `@hatch/sdk` (too generic, use `@hatch/trading-sdk` or similar)

**Error:**
```
Package name "@carapace/core" uses forbidden base name "core".
Product packages should use specific names like "@carapace/product-core or feature-core"
```

**Fix:** Rename to be more specific:
- `@carapace/core` → `@carapace/amm-core` or use `@tortoise-os/core`
- `@hatch/utils` → `@hatch/trading-utils` or use `@tortoise-os/core`

---

### Rule 3: Valid Package Name Format

**Requirements:**
- Must start with `@`
- Must have scope and name: `@scope/name`
- Lowercase only
- Hyphens allowed, no underscores
- Must match: `/^@[a-z][a-z0-9-]*\/[a-z][a-z0-9-]*$/`

**Valid:**
- ✅ `@tortoise-os/core`
- ✅ `@carapace/pool-sdk`
- ✅ `@hatch/strategy-sdk`

**Invalid:**
- ❌ `@Carapace/SDK` (uppercase)
- ❌ `@carapace/pool_sdk` (underscore)
- ❌ `carapace-sdk` (not scoped)
- ❌ `@carapace` (no package name)

**Error:**
```
Package name "@Carapace/SDK" has invalid format.
Must be @scope/name with lowercase and hyphens only
```

**Fix:** Convert to lowercase with hyphens

---

### Rule 4: Scope Matches Repository

**Check:** Package scope must match the repository it's in

**Expected scopes:**
- `bun-move/` → `@tortoise-os`
- `carapace/` → `@carapace`
- `hatch/` → `@hatch`
- `turtle-net/` → `@turtle-net`

**Error:**
```
Package "@hatch/pool-sdk" has scope "@hatch" but is in "@carapace" repository
```

**Fix:** Either:
1. Move package to correct repository, OR
2. Change scope to match repository

---

## Setup Instructions

### 1. Install Git Hooks (Recommended)

```bash
cd bun-move
bun scripts/setup-git-hooks.sh
```

This installs pre-commit hooks in all repositories.

### 2. Add to CI/CD

GitHub Actions workflow is already configured in:
```
bun-move/.github/workflows/validate-package-names.yml
```

Copy this to other repositories:
```bash
cp bun-move/.github/workflows/validate-package-names.yml carapace/.github/workflows/
cp bun-move/.github/workflows/validate-package-names.yml hatch/.github/workflows/
```

### 3. Add Pre-publish Check

In each package's `package.json`, add:
```json
{
  "scripts": {
    "prepublishOnly": "bun ../../scripts/validate-package-names.ts --check package.json"
  }
}
```

---

## Developer Workflow

### Creating a New Package (Recommended)

**Use the wizard:**
```bash
bun scripts/create-package.ts
```

The wizard will:
1. Guide you through naming
2. Validate in real-time
3. Create proper structure
4. Generate tests and docs

### Creating a Package Manually

1. Create `package.json` with proper name
2. Run validation:
   ```bash
   bun scripts/validate-package-names.ts --check packages/my-package/package.json
   ```
3. Fix any errors
4. Commit (pre-commit hook will validate)
5. Create PR (CI will validate)

### If Validation Fails

1. **Read the error message** - it tells you exactly what's wrong
2. **Check the naming guide** - `docs/PACKAGE_STRUCTURE_FINAL.md`
3. **Rename your package** - follow the suggestions
4. **Update imports** - find and replace old name
5. **Re-run validation** - ensure it passes

---

## Examples

### ✅ Good Package Names

**Foundation:**
```
@tortoise-os/core          ← Generic, reusable
@tortoise-os/oracle        ← Generic oracle utilities
@tortoise-os/math          ← Math utilities
@tortoise-os/ui            ← Base UI components
```

**Products:**
```
@carapace/sdk              ← Main AMM SDK (exception: it's THE SDK)
@carapace/strategy-sdk     ← Specific: flash loan strategies
@carapace/pool-sdk         ← Specific: pool operations
@carapace/carapace-ui      ← Product-prefixed UI
@hatch/trading-sdk         ← Specific: trading strategies
@hatch/leverage-sdk        ← Specific: leverage operations
```

### ❌ Bad Package Names

```
@carapace/core            ← Too generic, use @tortoise-os/core
@hatch/sdk                ← Too generic, be specific
@carapace/ui              ← Use @carapace/carapace-ui
@hatch/utils              ← Too generic, use @tortoise-os/core
@Carapace/SDK             ← Uppercase not allowed
@carapace/pool_sdk        ← Underscore not allowed
carapace-pool-sdk         ← Must be scoped
```

---

## Bypassing Validation (Emergency Only)

### Pre-commit Hook

```bash
git commit --no-verify
```

⚠️ **Warning:** Only use in emergencies. Your PR will still fail CI validation.

### CI Validation

Cannot be bypassed. Maintainers must approve override.

### Publishing Check

Remove `prepublishOnly` script temporarily.

⚠️ **Warning:** This may result in publishing packages with bad names to npm!

---

## Troubleshooting

### "Workspace dependency not found"

**Problem:** Git hook can't find validation script

**Fix:**
```bash
# Reinstall hooks
bun scripts/setup-git-hooks.sh
```

### "bun command not found" in Git Hook

**Problem:** Git hooks run in non-interactive shell, may not have PATH

**Fix:** Use absolute path to bun in hook, or ensure bun is in system PATH

### Validation Passes Locally but Fails in CI

**Problem:** Different versions of packages in different repos

**Solution:** Run validation from ecosystem root:
```bash
cd /path/to/tortoise-os
bun bun-move/scripts/validate-package-names.ts
```

---

## Maintenance

### Updating Validation Rules

Edit: `bun-move/scripts/validate-package-names.ts`

Update:
1. `FORBIDDEN_BASE_NAMES` array
2. Validation logic in `validatePackage()` method
3. Tests (add tests for new rules)

### Adding New Scopes

When adding a new product repository:

1. Add to `SCOPES` in `create-package.ts`
2. Add to `PRODUCT_SCOPES` in `validate-package-names.ts`
3. Add to `getExpectedScope()` method
4. Run setup script: `bun scripts/setup-git-hooks.sh`

---

## Summary

**How conventions are enforced:**

1. **Creation:** Interactive wizard prevents bad names from being created
2. **Development:** Pre-commit hooks catch issues before they enter git
3. **Review:** CI validates all PRs automatically
4. **Publishing:** Pre-publish checks prevent bad packages from reaching npm
5. **Anytime:** Manual validation script can be run at any time

**Result:**
- ✅ Zero duplicate packages
- ✅ Consistent naming across ecosystem
- ✅ Clear, self-documenting package names
- ✅ Easy to maintain and extend
- ✅ Automated, no manual reviews needed

---

**Last Updated:** 2025-11-01
**Status:** ✅ ACTIVE AND ENFORCED
