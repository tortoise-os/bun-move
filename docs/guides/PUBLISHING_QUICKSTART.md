# Publishing Quick Start Guide

This is a quick reference for publishing packages. For detailed information, see [PUBLISHING_GUIDE.md](./PUBLISHING_GUIDE.md).

## 🚀 First Time Setup

### 1. Run the Setup Script
```bash
cd bun-move
./scripts/publish-setup.sh
```

This will:
- Check if you're logged into npm
- Verify package names are available
- Test the publishing workflow
- Guide you through GitHub secrets setup

### 2. Login to npm
```bash
npm login
```

### 3. Set up GitHub Secrets
Go to your repository settings and add:
- `NPM_TOKEN`: Your npm access token (get from https://www.npmjs.com/settings/tokens)

---

## 📦 Publishing Methods

### Method 1: Manual Publishing (Quick & Simple)

**Best for:** Single package updates, testing

```bash
# Navigate to package
cd packages/sdk

# Test the publish (dry run)
npm publish --dry-run

# Publish to npm
npm publish --access public
```

### Method 2: Using Changesets (Recommended)

**Best for:** Multiple packages, version management, changelogs

```bash
# 1. Create a changeset
bun changeset
# Follow prompts to select packages and bump type

# 2. Version packages (updates package.json and CHANGELOG.md)
bun run version

# 3. Review changes
git diff

# 4. Commit changes
git add .
git commit -m "chore: version packages"

# 5. Publish all changed packages
bun run release
```

### Method 3: GitHub Actions (Automated)

**Best for:** CI/CD, team workflows

#### Option A: Automatic (on push to main)
```bash
git add .
git commit -m "feat: add new feature"
git push origin main
# Workflow runs automatically if packages/ or .changeset/ changed
```

#### Option B: Manual Trigger
1. Go to Actions tab in GitHub
2. Select "Publish Packages" workflow
3. Click "Run workflow"
4. Select branch and click "Run workflow"

---

## 🎯 Common Workflows

### Publishing a Single Package

```bash
# Make changes to package
cd packages/core
# ... edit files ...

# Run tests
bun test

# Bump version
npm version patch  # or minor, major

# Publish
npm publish --access public
```

### Publishing Multiple Related Packages

```bash
# From repo root
bun changeset

# Select packages that changed
# Choose version bump (patch/minor/major)
# Write summary

bun run version  # Updates package.json files
bun run release  # Publishes all packages
```

### Creating a Pre-release

```bash
cd packages/sdk

# Create pre-release version
npm version prerelease --preid=beta
# Example: 0.2.0 → 0.2.1-beta.0

# Publish with beta tag
npm publish --tag beta --access public

# Install pre-release
# npm install @tortoise-os/sdk@beta
```

---

## ✅ Pre-Publish Checklist

Before publishing, ensure:

- [ ] All tests pass: `bun test`
- [ ] Build succeeds: `bun run build`
- [ ] Version bumped appropriately
- [ ] CHANGELOG updated (if using changesets)
- [ ] README is up to date
- [ ] No sensitive data in package
- [ ] Dependencies are correct
- [ ] Dry run successful: `npm publish --dry-run`

---

## 🔍 Verification

After publishing:

```bash
# Check package on npm
npm view @tortoise-os/package-name

# Test installation
cd /tmp
npm install @tortoise-os/package-name

# Check package contents
npm pack --dry-run
```

---

## 📊 Publishing Order

Due to dependencies, publish in this order:

1. **@tortoise-os/core** (no dependencies)
2. **@tortoise-os/move** (no dependencies)
3. **@tortoise-os/ui** (external deps only)
4. **@tortoise-os/sdk** (depends on core)
5. **@tortoise-os/hooks** (depends on core, move)
6. **@tortoise-os/move-deployer** (depends on core)

For Carapace:
1. **@carapace/sdk** (external deps)
2. **@carapace/strategy-sdk** (depends on @carapace/sdk)

---

## 🐛 Troubleshooting

### Error: 403 Forbidden
```bash
# Not logged in
npm login

# Check authentication
npm whoami
```

### Error: Package already exists
```bash
# Version already published - bump version
npm version patch
npm publish
```

### Error: workspace:* dependencies
```bash
# Before publishing, replace workspace:* with actual versions
# This is handled automatically by changesets
```

### Dry run fails
```bash
# Check what will be published
npm pack --dry-run

# Common issues:
# - Missing files in "files" field
# - Build artifacts not generated
# - Tests failing
```

---

## 📚 Quick Reference

### npm Commands
```bash
npm whoami                    # Check logged in user
npm version patch/minor/major # Bump version
npm publish --dry-run         # Test publish
npm publish --access public   # Publish package
npm view <package>            # View published package
npm unpublish <pkg>@<ver>     # Unpublish (within 72h)
```

### Changesets Commands
```bash
bun changeset                 # Create changeset
bun run version               # Apply changesets
bun run release               # Publish packages
```

### Package Commands
```bash
cd packages/<name>            # Navigate to package
bun test                      # Run tests
bun run build                 # Build package
npm pack --dry-run            # Check files
```

---

## 🎬 Example: Publishing @carapace/sdk

```bash
# 1. Navigate to carapace monorepo
cd carapace

# 2. Make sure tests pass
cd packages/sdk
bun test

# 3. Build if needed
bun run build

# 4. Bump version
npm version minor  # 0.1.0 → 0.2.0

# 5. Dry run
npm publish --dry-run

# 6. Publish
npm publish --access public

# 7. Verify
npm view @carapace/sdk

# 8. Test install
cd /tmp
npm install @carapace/sdk
```

---

## 🔗 Resources

- [Full Publishing Guide](./PUBLISHING_GUIDE.md)
- [Package Catalog](./PACKAGE_CATALOG.md)
- [Changesets Documentation](https://github.com/changesets/changesets)
- [npm Publishing Guide](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry)

---

**Need Help?**
- Check [PUBLISHING_GUIDE.md](./PUBLISHING_GUIDE.md) for detailed instructions
- Review [PACKAGE_CATALOG.md](./PACKAGE_CATALOG.md) for package info
- Open an issue on GitHub

**Last Updated:** 2025-11-01
