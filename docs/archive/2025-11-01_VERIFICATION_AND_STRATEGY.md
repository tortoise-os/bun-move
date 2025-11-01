# Publishing System Verification & Duplicate Prevention Strategy

**Date:** 2025-11-01
**Status:** VERIFIED WITH ISSUES IDENTIFIED

---

## ✅ VERIFICATION RESULTS

### 1. Can Each Repository Publish Packages Right Now?

#### ✅ **Carapace** - YES (READY)
- ✅ GitHub Actions workflow exists (`.github/workflows/publish-packages.yml`)
- ✅ Packages have `publishConfig` in package.json
- ✅ Dry run successful
- ✅ No blockers

**Status: CAN PUBLISH NOW**

#### ❌ **Hatch** - NO (NEEDS SETUP)
- ❌ No GitHub Actions workflow
- ❌ No changesets configuration
- ❌ No publish scripts in package.json
- ⚠️ Packages need publishConfig updates

**Status: CANNOT PUBLISH (needs setup)**

#### ❌ **Turtle-net** - NO (NEEDS SETUP)
- ❌ No GitHub Actions workflow
- ❌ No changesets configuration
- ❌ No package.json at root
- ⚠️ Package structure unclear

**Status: CANNOT PUBLISH (needs setup)**

---

### 2. Is Publishing Capability Part of bun-move Template?

#### ❌ **NO - Template Does Not Exist**

Current state:
- `@tortoise-os/create-bun-move` exists as a package
- ❌ No `templates/` directory found
- ❌ No template files for new projects
- ❌ Publishing system not included in scaffolding

**Status: TEMPLATE NEEDS TO BE CREATED**

---

### 3. Duplicate Packages Identified

#### 🚨 **4 DUPLICATE PACKAGES FOUND**

| Package Name | bun-move | carapace | hatch | Issue |
|--------------|----------|----------|-------|-------|
| **core** | ✅ | ✅ | ✅ | 3 versions |
| **sdk** | ✅ | ✅ | ✅ | 3 versions |
| **ui** | ✅ | ✅ | ✅ | 3 versions |
| **strategy-sdk** | ❌ | ✅ | ✅ | 2 versions |

#### Analysis of Duplicates:

**`core` packages:**
- `@tortoise-os/core` - Foundation utilities
- `@carapace/core` - Carapace-specific utilities
- `@hatch/core` - Hatch-specific utilities

**`sdk` packages:**
- `@tortoise-os/sdk` - General Sui/Move SDK
- `@carapace/sdk` - AMM/DEX SDK
- `@hatch/sdk` - Strategy SDK

**`ui` packages:**
- `@tortoise-os/ui` - Shared UI components
- `@carapace/ui` - Carapace UI
- `@hatch/ui` - Hatch UI

**`strategy-sdk` packages:**
- `@carapace/strategy-sdk` - Flash loans & arbitrage
- `@hatch/strategy-sdk` - Advanced strategies

---

## 🎯 DUPLICATE PREVENTION STRATEGY

### Problem Statement

Having packages with identical names across different scopes creates:
1. **Confusion** - Which SDK/core/UI should I use?
2. **Maintenance burden** - Same functionality in multiple places
3. **Version drift** - Packages diverge over time
4. **Import errors** - Easy to import wrong package

### Solution: Clear Package Hierarchy

```
Foundation (@tortoise-os/*)
    ↓ depends on
Product Packages (@carapace/*, @hatch/*)
```

### Package Naming Convention

#### ✅ **ALLOWED Package Names**

**Foundation (bun-move):**
- `@tortoise-os/core` - Core utilities (strings, numbers, etc.)
- `@tortoise-os/sui-sdk` - General Sui blockchain utilities
- `@tortoise-os/ui` - Base UI components (buttons, inputs, etc.)
- `@tortoise-os/move` - Move contract utilities
- `@tortoise-os/hooks` - Base React hooks

**Product-Specific (carapace, hatch):**
- `@carapace/amm-sdk` - AMM-specific functionality
- `@carapace/pool-sdk` - Pool operations
- `@carapace/flash-sdk` - Flash loan specific
- `@carapace/ui-amm` - AMM-specific UI
- `@hatch/arbitrage-sdk` - Arbitrage strategies
- `@hatch/leverage-sdk` - Leverage operations
- `@hatch/ui-trading` - Trading UI

#### ❌ **FORBIDDEN Duplicate Names**

**DON'T create:**
- `@<scope>/sdk` (too generic - be specific!)
- `@<scope>/core` (use foundation or be specific)
- `@<scope>/ui` (use foundation or be specific like `ui-<product>`)
- `@<scope>/utils` (use core or be specific)

---

## 🔧 IMMEDIATE ACTION REQUIRED

### 1. Rename Duplicate Packages

#### Current → Proposed

**Carapace:**
- `@carapace/sdk` → ✅ Keep (specific enough - AMM SDK)
- `@carapace/core` → `@carapace/amm-core` or remove (merge into sdk)
- `@carapace/ui` → `@carapace/ui-amm` or remove (use `@tortoise-os/ui`)
- `@carapace/strategy-sdk` → ✅ Keep (flash loan specific)

**Hatch:**
- `@hatch/sdk` → `@hatch/strategy-sdk` or `@hatch/trading-sdk`
- `@hatch/core` → `@hatch/strategy-core` or remove
- `@hatch/ui` → `@hatch/ui-trading` or remove
- `@hatch/strategy-sdk` → ✅ Keep

### 2. Dependency Rules

```typescript
// ✅ ALLOWED
import { formatAmount } from '@tortoise-os/core'
import { createPool } from '@carapace/sdk'
import { FlashLoanClient } from '@carapace/strategy-sdk'

// ❌ FORBIDDEN (ambiguous)
import { utils } from '@carapace/core'  // Which core?
import { SDK } from '@hatch/sdk'        // Which SDK?
```

### 3. Package Purpose Matrix

| Package Type | Foundation (@tortoise-os) | Product (@carapace, @hatch) |
|--------------|---------------------------|----------------------------|
| **Core Utils** | ✅ @tortoise-os/core | ❌ Use foundation |
| **Blockchain** | ✅ @tortoise-os/sui-sdk | ✅ Specific: @carapace/amm-sdk |
| **UI Base** | ✅ @tortoise-os/ui | ❌ Use foundation |
| **UI Product** | ❌ Not foundation | ✅ @carapace/ui-amm |
| **Strategies** | ❌ Not foundation | ✅ @carapace/flash-sdk |

---

## 📋 SETUP HATCH & TURTLE-NET

### Setup Hatch for Publishing

```bash
cd /Users/decebaldobrica/Projects/blockchain/tortoise-os/hatch

# 1. Install changesets
bun add -D @changesets/cli

# 2. Initialize changesets
bunx changeset init

# 3. Add scripts to package.json
# "changeset": "changeset",
# "version": "changeset version",
# "release": "bun run build && changeset publish"

# 4. Create GitHub Actions workflow
mkdir -p .github/workflows
# Copy from carapace or use template below
```

### Setup Turtle-net for Publishing

```bash
cd /Users/decebaldobrica/Projects/blockchain/tortoise-os/turtle-net

# Similar to hatch setup above
```

---

## 🔒 PREVENTION MECHANISMS

### 1. Pre-Publish Check Script

Create `scripts/check-duplicates.sh`:

```bash
#!/usr/bin/env bash
# Check for duplicate package names across repos

REPOS=(
  "/path/to/bun-move"
  "/path/to/carapace"
  "/path/to/hatch"
  "/path/to/turtle-net"
)

duplicates=$(
  for repo in "${REPOS[@]}"; do
    find "$repo/packages" -maxdepth 1 -type d -exec basename {} \;
  done | sort | uniq -d
)

if [ -n "$duplicates" ]; then
  echo "❌ DUPLICATE PACKAGES FOUND:"
  echo "$duplicates"
  exit 1
fi

echo "✅ No duplicate packages"
```

### 2. Package Naming Linter

Add to package.json in each product repo:

```json
{
  "scripts": {
    "lint:names": "node scripts/lint-package-names.js"
  }
}
```

`scripts/lint-package-names.js`:
```javascript
// Check package names follow convention
const forbidden = ['sdk', 'core', 'ui', 'utils']
const scope = process.env.PACKAGE_SCOPE || '@carapace'

// Validate package names...
```

### 3. Documentation

Add to each product's README:

```markdown
## Package Naming Rules

- ❌ DON'T use generic names: `sdk`, `core`, `ui`
- ✅ DO use specific names: `amm-sdk`, `flash-sdk`, `ui-trading`
- Use `@tortoise-os/*` for shared utilities
- Use `@<product>/*` for product-specific code
```

### 4. Template Integration

When creating `create-bun-move` templates:

```typescript
// In template generator
const forbiddenNames = ['sdk', 'core', 'ui', 'utils']

function validatePackageName(name: string) {
  const baseName = name.split('/').pop()
  if (forbiddenNames.includes(baseName)) {
    throw new Error(
      `Package name "${baseName}" is too generic. ` +
      `Use specific names like "${baseName}-<feature>"`
    )
  }
}
```

---

## 📊 CURRENT STATUS SUMMARY

### ✅ Can Publish Now
- **bun-move**: YES
- **carapace**: YES
- **hatch**: NO (needs setup)
- **turtle-net**: NO (needs setup)

### ❌ Template System
- Does NOT exist yet
- Needs to be created
- Should include publishing setup

### 🚨 Duplicates
- 4 duplicate package names found
- Strategy created to prevent
- Renaming required before mass publishing

---

## 🎯 NEXT ACTIONS

### Priority 1: Fix Duplicates (Before Publishing)
1. [ ] Audit each duplicate package
2. [ ] Decide: rename, merge, or remove
3. [ ] Update imports in dependent code
4. [ ] Update documentation

### Priority 2: Setup Missing Repos
1. [ ] Setup hatch publishing system
2. [ ] Setup turtle-net publishing system
3. [ ] Add duplicate check script
4. [ ] Add naming linter

### Priority 3: Create Template
1. [ ] Design template structure
2. [ ] Include publishing setup
3. [ ] Include duplicate prevention
4. [ ] Test template generation

---

## 🔗 Related Documents

- [PACKAGE_CATALOG.md](./PACKAGE_CATALOG.md) - Package inventory
- [PUBLISHING_GUIDE.md](./PUBLISHING_GUIDE.md) - How to publish
- [IMPLEMENTATION_COMPLETE.md](./IMPLEMENTATION_COMPLETE.md) - Current status

---

**Last Updated:** 2025-11-01
**Status:** ⚠️ ACTION REQUIRED - Duplicates must be resolved before mass publishing
