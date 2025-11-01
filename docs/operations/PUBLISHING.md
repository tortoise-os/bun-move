# Publishing Guide

This guide explains how to publish TortoiseOS packages to npm and test the CLI locally.

## 📦 Packages Available for Publishing

### 1. `create-bun-move` - Project Scaffolding CLI
The CLI tool for creating new TortoiseOS projects.

**Location**: `packages/create-bun-move`

### 2. `@bun-move/core` - Core Utilities
Core utilities and types for TortoiseOS.

**Location**: `packages/core`

### 3. `@bun-move/sdk` - Sui SDK Wrapper  
Wrapper around Sui SDK with TortoiseOS-specific functionality.

**Location**: `packages/sdk`

### 4. `@bun-move/ui` - Magic UI Components
UI component library with Magic UI animations.

**Location**: `packages/ui`

### 5. `@bun-move/sui-playwright` - Sui Testing Utilities
Playwright testing utilities for Sui blockchain dApps.

**Location**: `packages/sui-playwright`

---

## 🧪 Testing CLI Locally

### Method 1: Direct Execution
```bash
# Build the CLI
cd packages/create-bun-move
bun run build

# Test it directly
bun run dist/index.js my-test-project

# Or with options
bun run dist/index.js my-app -t minimal --no-docker
```

### Method 2: Using npm link
```bash
# In the create-bun-move directory
cd packages/create-bun-move
bun run build
npm link

# Now you can use it globally
create-bun-move my-test-project

# Unlink when done
npm unlink -g create-bun-move
```

### Method 3: Using bunx (Recommended)
```bash
# Build first
cd packages/create-bun-move
bun run build

# Create a test in temp directory
mkdir -p /tmp/test-tortoise
cd /tmp/test-tortoise
bunx /path/to/bun-move/packages/create-bun-move my-project
```

---

## 📤 Publishing to npm

### Prerequisites

1. **Create an npm account**:
   - Go to https://www.npmjs.com/signup
   - Create your account

2. **Login to npm CLI**:
   ```bash
   npm login
   # Enter your username, password, and email
   ```

3. **Verify login**:
   ```bash
   npm whoami
   ```

4. **Configure 2FA (Recommended)**:
   - Enable 2FA in npm settings
   - Use "Authorization only" mode for publishing

### Step-by-Step Publishing

#### 1. Prepare Packages

```bash
# Navigate to monorepo root
cd /path/to/bun-move

# Update versions (choose one approach)
# Option A: Manual - edit each package.json
# Option B: Use npm version
cd packages/create-bun-move
npm version patch  # or minor, or major

cd ../core
npm version patch

cd ../sdk  
npm version patch

cd ../ui
npm version patch
```

#### 2. Build All Packages

```bash
# From monorepo root
bun run build

# Or build individually
cd packages/create-bun-move && bun run build
cd packages/core && bun run build
cd packages/sdk && bun run build  
cd packages/ui && bun run build
```

#### 3. Publish Packages

**IMPORTANT**: Publish in dependency order!

```bash
# 1. First, publish core utilities (no dependencies)
cd packages/core
npm publish --access public

# 2. Then, publish SDK (depends on core)
cd ../sdk
npm publish --access public

# 3. Then, publish UI (standalone)
cd ../ui
npm publish --access public

# 4. Finally, publish CLI (depends on all)
cd ../create-bun-move
npm publish --access public
```

#### 4. Verify Publication

```bash
# Check on npm
npm view create-bun-move
npm view @bun-move/core
npm view @bun-move/sdk
npm view @bun-move/ui

# Test installation
mkdir test-install && cd test-install
bunx create-bun-move my-test-app
```

---

## 🔄 Publishing Workflow Script

Create a helper script for automated publishing:

```bash
#!/bin/bash
# publish.sh

set -e

echo "🔍 Checking npm login..."
npm whoami || (echo "❌ Not logged in. Run 'npm login' first." && exit 1)

echo "🏗️  Building all packages..."
bun run build

echo "📦 Publishing packages in order..."

# Core
echo "Publishing @bun-move/core..."
cd packages/core
npm publish --access public
cd ../..

# SDK
echo "Publishing @bun-move/sdk..."
cd packages/sdk
npm publish --access public
cd ../..

# UI
echo "Publishing @bun-move/ui..."
cd packages/ui
npm publish --access public
cd ../..

# CLI
echo "Publishing create-bun-move..."
cd packages/create-bun-move
npm publish --access public
cd ../..

echo "✅ All packages published successfully!"
echo ""
echo "🔗 View packages at:"
echo "   https://www.npmjs.com/package/create-bun-move"
echo "   https://www.npmjs.com/package/@bun-move/core"
echo "   https://www.npmjs.com/package/@bun-move/sdk"
echo "   https://www.npmjs.com/package/@bun-move/ui"
```

Make it executable:
```bash
chmod +x publish.sh
./publish.sh
```

---

## 🚨 Common Issues

### 1. Package Name Already Taken
**Error**: `403 Forbidden - PUT https://registry.npmjs.org/package-name`

**Solution**: Change package name in package.json or use scope:
```json
{
  "name": "@your-username/package-name"
}
```

### 2. Authentication Error
**Error**: `401 Unauthorized`

**Solution**: Re-login to npm:
```bash
npm logout
npm login
```

### 3. Version Already Published
**Error**: `403 You cannot publish over the previously published versions`

**Solution**: Bump version:
```bash
npm version patch
npm publish
```

### 4. Missing Build Files
**Error**: Package published but files missing

**Solution**: Check `files` field in package.json:
```json
{
  "files": [
    "dist",
    "templates",
    "README.md"
  ]
}
```

---

## 📊 Version Management

### Semantic Versioning

- **MAJOR** (1.0.0 → 2.0.0): Breaking changes
- **MINOR** (1.0.0 → 1.1.0): New features, backwards compatible
- **PATCH** (1.0.0 → 1.0.1): Bug fixes, backwards compatible

### Updating Versions

```bash
# Patch release (bug fixes)
npm version patch

# Minor release (new features)
npm version minor

# Major release (breaking changes)
npm version major

# With message
npm version patch -m "Fix CLI template generation"
```

---

## 🔐 Best Practices

1. **Always test locally** before publishing
2. **Use semantic versioning** consistently
3. **Update README** and documentation
4. **Tag releases** in Git:
   ```bash
   git tag -a v0.1.0 -m "Release v0.1.0"
   git push origin v0.1.0
   ```

5. **Create CHANGELOG** for each release
6. **Use npm pack** to preview:
   ```bash
   npm pack
   tar -xzf create-bun-move-0.1.0.tgz
   ls package/
   ```

7. **Test installation** after publishing:
   ```bash
   bunx create-bun-move@latest test-project
   ```

---

## 📝 Checklist Before Publishing

- [ ] All tests passing (`bun test`)
- [ ] Linting passes (`bun run lint`)
- [ ] Build successful (`bun run build`)
- [ ] Version updated in package.json
- [ ] CHANGELOG.md updated
- [ ] README.md up to date
- [ ] Logged into npm (`npm whoami`)
- [ ] Dependencies correct in package.json
- [ ] .npmignore configured correctly
- [ ] Tested locally with npm link or bunx
- [ ] Git committed and tagged

---

## 🎯 After Publishing

1. **Verify on npm**:
   - Visit package page: https://www.npmjs.com/package/create-bun-move
   - Check version, files, and README

2. **Test installation**:
   ```bash
   bunx create-bun-move@latest my-new-project
   ```

3. **Update documentation**:
   - Update main README.md
   - Update website/docs

4. **Announce**:
   - Social media
   - Discord/Slack
   - GitHub Discussions

---

## 📚 Resources

- [npm Publishing Documentation](https://docs.npmjs.com/cli/v10/commands/npm-publish)
- [Semantic Versioning](https://semver.org/)
- [npm Scopes](https://docs.npmjs.com/cli/v10/using-npm/scope)
- [npm Package Access](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry#package-access)

---

**Questions?** Open an issue or discussion on GitHub!
