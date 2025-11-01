# TortoiseOS Package Catalog & Publishing Strategy

**Date:** 2025-11-01
**Status:** Planning
**Purpose:** Catalog all packages across the TortoiseOS ecosystem and plan their publishing strategy

---

## Architecture Overview

```
tortoise-os/
├── bun-move/          # Root monorepo with shared foundation packages
├── carapace/          # Product: AMM DEX
├── hatch/             # Product: Advanced DeFi strategies (flash loans, arbitrage)
└── turtle-net/        # Product: Network/Infrastructure
```

## Package Publishing Strategy

### Registry Distribution
- **Public Packages (npmjs.com):** Open-source, reusable libraries
- **Private Packages (GitHub Registry):** Closed-source, proprietary features

### Naming Conventions
- Foundation packages: `@tortoise-os/*`
- Product-specific packages: `@<product>/*` (e.g., `@carapace/*`, `@hatch/*`)

---

## 1. BUN-MOVE Packages (Foundation)

> **Role:** Root monorepo providing shared infrastructure and utilities

### 1.1 @tortoise-os/move
- **Current Version:** 0.2.0
- **Description:** Sui Move smart contracts for TortoiseOS
- **Type:** Move contract deployments
- **Dependencies:** None (Move contracts)
- **Status:** ✅ Already configured for public publishing
- **Publish To:** npmjs.com (public)
- **Reusability:** HIGH - Core Move contracts used across all products
- **Priority:** 🔴 HIGH

**Publishing Notes:**
- Contains deployed contract metadata
- Hot reload system integration
- Should be published first as foundation

---

### 1.2 @tortoise-os/core
- **Current Version:** 0.2.0
- **Description:** Core utilities and types for TortoiseOS
- **Type:** TypeScript utilities
- **Dependencies:** None
- **Status:** ✅ Already configured for public publishing
- **Publish To:** npmjs.com (public)
- **Reusability:** HIGH - Used by all products
- **Priority:** 🔴 HIGH

**Publishing Notes:**
- Foundation utilities
- Type definitions
- Common helpers
- Publish early in dependency chain

---

### 1.3 @tortoise-os/ui
- **Current Version:** 0.2.0
- **Description:** Magic UI components for TortoiseOS
- **Type:** React component library
- **Dependencies:**
  - react ^18.0.0
  - framer-motion ^11.0.0
  - tailwind utilities
- **Status:** ✅ Already configured for public publishing
- **Publish To:** npmjs.com (public)
- **Reusability:** HIGH - Shared UI across all products
- **Priority:** 🟡 MEDIUM

**Publishing Notes:**
- Reusable React components
- Magic UI integration
- Tailwind-based styling
- Can be used by carapace, hatch, turtle-net

---

### 1.4 @tortoise-os/move-deployer
- **Current Version:** 0.2.0
- **Description:** Hot reload system for Move contracts with TypeScript generation
- **Type:** CLI tool / Development utility
- **Dependencies:**
  - @tortoise-os/core (workspace:*)
- **Status:** ✅ Already configured for public publishing
- **Publish To:** npmjs.com (public)
- **Reusability:** HIGH - Developer tooling
- **Priority:** 🟡 MEDIUM

**Publishing Notes:**
- CLI binary included
- Development tool
- Useful for all Move developers

---

### 1.5 @tortoise-os/sdk
- **Status:** ⚠️ NOT FOUND in file system
- **Expected:** Base SDK for Sui integration
- **Action Required:** Verify if exists or should be created

---

### 1.6 @tortoise-os/hooks
- **Status:** ⚠️ Directory exists but no package.json found
- **Action Required:** Create package.json if this should be published

---

### 1.7 @tortoise-os/components
- **Status:** ⚠️ Directory exists but no package.json found
- **Action Required:** Create package.json if this should be published

---

### 1.8 @tortoise-os/burner-wallet
- **Status:** ⚠️ Directory exists but no package.json found
- **Type:** Wallet integration utility
- **Publish To:** TBD - Likely public
- **Action Required:** Create package.json

---

### 1.9 @tortoise-os/ai-integration
- **Status:** ⚠️ Directory exists but no package.json found
- **Type:** AI features integration
- **Publish To:** TBD - Potentially private (proprietary)
- **Action Required:** Create package.json and determine if public/private

---

### 1.10 @tortoise-os/terrapin
- **Status:** ⚠️ Directory exists but no package.json found
- **Action Required:** Identify purpose and create package.json

---

### 1.11 @tortoise-os/create-bun-move
- **Status:** ⚠️ Directory exists but no package.json found
- **Type:** Project scaffolding tool
- **Publish To:** npmjs.com (public) - likely a CLI tool
- **Action Required:** Create package.json

---

## 2. CARAPACE Packages (AMM DEX Product)

> **Role:** Automated Market Maker / Decentralized Exchange

### 2.1 @carapace/sdk
- **Current Version:** 0.1.0
- **Description:** TypeScript SDK for Carapace DeFi on Sui
- **Type:** Product SDK
- **Dependencies:**
  - @mysten/sui ^1.14.0
- **Status:** 🔧 Needs publishing configuration
- **Publish To:** npmjs.com (public) - Core DeFi SDK
- **Reusability:** MEDIUM - Carapace-specific but useful for integrators
- **Priority:** 🔴 HIGH

**Publishing Notes:**
- Pool management
- Swap functionality
- Liquidity operations
- Event parsing
- **Add:** repository, homepage, publishConfig fields

---

### 2.2 @carapace/strategy-sdk
- **Current Version:** 0.1.0
- **Description:** Advanced strategy SDK - Flash Loans, Arbitrage, Leverage
- **Type:** Advanced DeFi utilities
- **Dependencies:**
  - @mysten/sui ^1.14.0
  - @carapace/sdk workspace:*
- **Status:** 🔧 Needs publishing configuration
- **Publish To:** npmjs.com (public) - Advanced DeFi strategies
- **Reusability:** HIGH - Flash loan patterns useful across DeFi
- **Priority:** 🔴 HIGH

**Publishing Notes:**
- Flash loan client
- Transaction builders
- Arbitrage utilities
- Strategy execution
- **Add:** repository, homepage, publishConfig fields
- **Must publish @carapace/sdk first**

---

### 2.3 @carapace/core
- **Current Version:** 0.1.0
- **Description:** Core utilities for Carapace
- **Type:** Internal utilities
- **Dependencies:**
  - @mysten/sui.js ^0.54.1
- **Status:** 🔧 Needs publishing configuration
- **Publish To:** npmjs.com (public) OR keep workspace-only
- **Reusability:** LOW - Carapace-specific
- **Priority:** 🟢 LOW

**Publishing Notes:**
- Evaluate if needed externally
- May keep as workspace dependency only
- Consider merging into @carapace/sdk

---

### 2.4 @carapace/ui
- **Current Version:** 0.1.0
- **Description:** UI component library for Carapace apps
- **Type:** React components
- **Dependencies:** React ecosystem
- **Status:** 🔧 Needs publishing configuration
- **Publish To:** npmjs.com (public) OR keep private
- **Reusability:** LOW - Carapace UI-specific
- **Priority:** 🟢 LOW

**Publishing Notes:**
- Product-specific UI
- Consider keeping private/workspace-only
- Alternative: Use @tortoise-os/ui instead

---

## 3. HATCH Packages (Advanced DeFi Strategies)

> **Role:** Flash loans, arbitrage, and advanced trading strategies

### 3.1 @hatch/strategy-sdk
- **Current Version:** 0.1.0
- **Description:** Strategy SDK for flash loans and arbitrage
- **Type:** DeFi strategy library
- **Dependencies:**
  - @mysten/sui.js ^0.54.1
  - @hatch/core workspace:*
- **Status:** 🔧 Needs publishing configuration
- **Publish To:** DECISION REQUIRED
  - **Option A:** npmjs.com (public) - Share with community
  - **Option B:** GitHub Registry (private) - Proprietary strategies
- **Reusability:** HIGH - Advanced DeFi patterns
- **Priority:** 🟡 MEDIUM

**Publishing Notes:**
- Contains flash loan implementations
- Arbitrage strategies
- **Decision needed:** Public vs proprietary
- May have overlap with @carapace/strategy-sdk - consider consolidation

---

### 3.2 @hatch/core
- **Status:** ⚠️ Mentioned in dependencies but no details found
- **Action Required:** Document this package

---

### 3.3 @hatch/ui
- **Status:** ⚠️ Directory exists but needs documentation
- **Action Required:** Document and plan publishing

---

### 3.4 @hatch/sdk
- **Status:** ⚠️ Directory exists but needs documentation
- **Action Required:** Document and plan publishing

---

## 4. TURTLE-NET Packages

> **Role:** Network/Infrastructure layer

### Status: 📋 NO PACKAGES CATALOGED YET
- **Action Required:** Investigate turtle-net structure
- **Priority:** 🟢 LOW (after carapace & hatch)

---

## Package Dependency Graph

```
Foundation Layer (bun-move):
@tortoise-os/move         (no deps)
@tortoise-os/core         (no deps)
@tortoise-os/ui           → react, framer-motion
@tortoise-os/move-deployer → @tortoise-os/core

Product Layer (carapace):
@carapace/sdk             → @mysten/sui
@carapace/strategy-sdk    → @carapace/sdk, @mysten/sui
@carapace/core            → @mysten/sui.js
@carapace/ui              → react

Product Layer (hatch):
@hatch/strategy-sdk       → @hatch/core, @mysten/sui.js
@hatch/core               → (needs documentation)
```

---

## Publishing Priority & Timeline

### Phase 1: Foundation (Week 1)
1. ✅ **@tortoise-os/core** - Base utilities
2. ✅ **@tortoise-os/move** - Contract deployments
3. 🔧 **@tortoise-os/ui** - Shared components
4. 🔧 **@tortoise-os/move-deployer** - Dev tools

### Phase 2: Carapace SDK (Week 2)
1. 🔧 **@carapace/sdk** - Core DeFi SDK
2. 🔧 **@carapace/strategy-sdk** - Advanced strategies

### Phase 3: Hatch & Integration (Week 3)
1. 🔧 **@hatch/strategy-sdk** - Strategy implementations
2. 🔧 Cross-package integration testing
3. 🔧 Documentation & examples

### Phase 4: Additional Packages (Week 4+)
1. 🔧 Complete missing package.json files
2. 🔧 Publish remaining utilities
3. 🔧 Turtle-net packages (TBD)

---

## Action Items

### Immediate (This Week)
- [ ] Create missing package.json files for bun-move packages
- [ ] Add publishConfig to all carapace packages
- [ ] Add publishConfig to all hatch packages
- [ ] Document @hatch/core purpose and dependencies
- [ ] Decide: @hatch/strategy-sdk public or private?
- [ ] Investigate turtle-net package structure

### Short Term (Next 2 Weeks)
- [ ] Set up GitHub Actions for automated publishing
- [ ] Create CONTRIBUTING.md for each package
- [ ] Set up semantic versioning with changesets
- [ ] Configure GitHub Package Registry for private packages
- [ ] Create package README files with usage examples

### Medium Term (Next Month)
- [ ] Publish foundation packages to npm
- [ ] Publish carapace SDKs to npm
- [ ] Set up automated dependency updates
- [ ] Create integration tests across packages
- [ ] Documentation website with API references

---

## Questions to Resolve

1. **@hatch/strategy-sdk:** Public or private?
   - Pros of public: Community contribution, wider adoption
   - Pros of private: Proprietary strategies, competitive advantage

2. **Package consolidation:** Should we merge similar packages?
   - @carapace/strategy-sdk vs @hatch/strategy-sdk
   - @carapace/core vs @tortoise-os/core
   - @carapace/ui vs @tortoise-os/ui

3. **Versioning strategy:** Semver or calver?
   - Recommend: Semver for libraries, calver for apps

4. **License:** MIT for all public packages?
   - Foundation: MIT ✅
   - Product SDKs: MIT or Apache 2.0?
   - Private packages: Proprietary

---

## Package Template

For creating new package.json files:

```json
{
  "name": "@scope/package-name",
  "version": "0.1.0",
  "description": "",
  "type": "module",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": {
    ".": {
      "bun": "./src/index.ts",
      "import": "./src/index.ts",
      "types": "./src/index.ts"
    }
  },
  "files": ["src", "README.md"],
  "scripts": {
    "build": "tsc",
    "test": "bun test",
    "typecheck": "tsc --noEmit"
  },
  "keywords": ["sui", "move", "defi", "tortoise-os"],
  "author": "TortoiseOS Team",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/tortoise-os/<repo>.git",
    "directory": "packages/<package>"
  },
  "homepage": "https://github.com/tortoise-os/<repo>/tree/main/packages/<package>",
  "bugs": {
    "url": "https://github.com/tortoise-os/<repo>/issues"
  },
  "publishConfig": {
    "access": "public"
  }
}
```

---

**Next Steps:** Review this catalog and make decisions on publishing strategy for each package.
