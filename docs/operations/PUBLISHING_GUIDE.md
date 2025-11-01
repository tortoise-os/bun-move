# TortoiseOS Package Publishing Guide

This guide explains how to publish packages from the TortoiseOS ecosystem to npm and GitHub Package Registry.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Publishing to npmjs.com](#publishing-to-npmjscom)
3. [Publishing to GitHub Package Registry](#publishing-to-github-package-registry)
4. [Versioning Strategy](#versioning-strategy)
5. [Automated Publishing](#automated-publishing)
6. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Tools
```bash
# Install bun (if not already installed)
curl -fsSL https://bun.sh/install | bash

# Verify installation
bun --version
```

### npm Account Setup
```bash
# Login to npm
npm login

# Verify authentication
npm whoami

# Create access token (for CI/CD)
# Visit: https://www.npmjs.com/settings/<username>/tokens
```

### GitHub Package Registry Setup
```bash
# Create a Personal Access Token (PAT) with packages:write scope
# Visit: https://github.com/settings/tokens

# Login to GitHub Package Registry
npm login --scope=@tortoise-os --registry=https://npm.pkg.github.com

# Add to .npmrc (for CI/CD)
echo "@tortoise-os:registry=https://npm.pkg.github.com" >> ~/.npmrc
```

---

## Publishing to npmjs.com

### One-Time Setup Per Package

1. **Ensure package.json is properly configured:**
```json
{
  "name": "@tortoise-os/package-name",
  "version": "0.1.0",
  "publishConfig": {
    "access": "public",
    "registry": "https://registry.npmjs.org/"
  }
}
```

2. **Add required metadata:**
```json
{
  "repository": {
    "type": "git",
    "url": "https://github.com/tortoise-os/bun-move.git",
    "directory": "packages/package-name"
  },
  "homepage": "https://github.com/tortoise-os/bun-move/tree/main/packages/package-name",
  "bugs": {
    "url": "https://github.com/tortoise-os/bun-move/issues"
  },
  "keywords": ["sui", "move", "defi", "tortoise-os"],
  "license": "MIT"
}
```

### Publishing Process

#### Manual Publishing

```bash
# Navigate to package directory
cd packages/package-name

# Build if needed
bun run build

# Run tests
bun test

# Dry run (see what would be published)
npm publish --dry-run

# Publish to npm
npm publish --access public

# Verify publication
npm view @tortoise-os/package-name
```

#### Using Changesets (Recommended)

```bash
# From repository root
cd bun-move

# Create a changeset
bun changeset

# Follow prompts to:
# 1. Select packages that changed
# 2. Choose bump type (major/minor/patch)
# 3. Write summary of changes

# Version packages (updates package.json and CHANGELOG.md)
bun run version

# Review changes in git
git diff

# Commit version changes
git add .
git commit -m "chore: version packages"

# Publish all changed packages
bun run release
```

---

## Publishing to GitHub Package Registry

### Setup .npmrc in Package Directory

Create `.npmrc` in package root:
```
@tortoise-os:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

### Update package.json

```json
{
  "name": "@tortoise-os/package-name",
  "publishConfig": {
    "registry": "https://npm.pkg.github.com"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/tortoise-os/bun-move.git"
  }
}
```

### Publishing

```bash
# Set environment variable
export GITHUB_TOKEN=<your-personal-access-token>

# Publish
npm publish

# Verify
npm view @tortoise-os/package-name --registry=https://npm.pkg.github.com
```

---

## Versioning Strategy

### Semantic Versioning (Recommended)

```
MAJOR.MINOR.PATCH

MAJOR: Breaking changes
MINOR: New features (backward compatible)
PATCH: Bug fixes (backward compatible)
```

#### Examples:
- `0.1.0` → `0.1.1`: Bug fix
- `0.1.0` → `0.2.0`: New feature
- `0.1.0` → `1.0.0`: Breaking change / Stable release

### Version Bumping

```bash
# Patch (0.1.0 → 0.1.1)
npm version patch

# Minor (0.1.0 → 0.2.0)
npm version minor

# Major (0.1.0 → 1.0.0)
npm version major

# Pre-release (0.1.0 → 0.1.1-beta.0)
npm version prerelease --preid=beta
```

---

## Automated Publishing

### GitHub Actions Workflow

Create `.github/workflows/publish.yml`:

```yaml
name: Publish Packages

on:
  push:
    branches:
      - main
    paths:
      - 'packages/**'
      - '.changeset/**'

jobs:
  publish:
    runs-on: ubuntu-latest
    permissions:
      contents: write
      packages: write
      id-token: write

    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - uses: oven-sh/setup-bun@v1
        with:
          bun-version: latest

      - name: Install dependencies
        run: bun install

      - name: Build packages
        run: bun run build

      - name: Run tests
        run: bun test

      - name: Create Release Pull Request or Publish
        id: changesets
        uses: changesets/action@v1
        with:
          publish: bun run release
          version: bun run version
          commit: "chore: version packages"
          title: "chore: version packages"
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

### Setup Secrets

1. Go to GitHub repository settings
2. Navigate to Secrets and variables → Actions
3. Add secrets:
   - `NPM_TOKEN`: npm access token
   - `GITHUB_TOKEN`: Automatically provided

---

## Publishing Checklist

### Before First Publish
- [ ] Package name is available on npm
- [ ] package.json has all required fields
- [ ] README.md exists and is comprehensive
- [ ] LICENSE file exists
- [ ] Tests are passing
- [ ] Build succeeds
- [ ] No sensitive data in package

### Before Each Publish
- [ ] Version number updated
- [ ] CHANGELOG.md updated
- [ ] All tests passing
- [ ] Documentation updated
- [ ] Dependencies are up to date
- [ ] Build artifacts are clean

### After Publish
- [ ] Verify package on npm: `npm view @tortoise-os/package-name`
- [ ] Test installation: `npm install @tortoise-os/package-name`
- [ ] Check package contents: `npm pack --dry-run`
- [ ] Update dependent packages
- [ ] Announce release (if major)

---

## Package Publishing Order

Due to dependencies, publish in this order:

### Phase 1: Foundation (No Dependencies)
1. `@tortoise-os/core`
2. `@tortoise-os/move`

### Phase 2: Foundation Tools (Depends on Phase 1)
3. `@tortoise-os/ui`
4. `@tortoise-os/move-deployer`

### Phase 3: Product SDKs
5. `@carapace/sdk`
6. `@carapace/strategy-sdk` (depends on @carapace/sdk)

### Phase 4: Advanced Products
7. `@hatch/core`
8. `@hatch/strategy-sdk`

---

## Common Commands Reference

```bash
# Check what files will be published
npm pack --dry-run

# View package info
npm view @tortoise-os/package-name

# View all versions
npm view @tortoise-os/package-name versions

# Unpublish a version (within 72 hours)
npm unpublish @tortoise-os/package-name@1.0.0

# Deprecate a version
npm deprecate @tortoise-os/package-name@1.0.0 "Use version 2.0.0"

# Add collaborator
npm owner add username @tortoise-os/package-name

# Check package health
npm audit

# Update dependencies
bun update

# Link for local development
bun link
cd ../other-package
bun link @tortoise-os/package-name
```

---

## Troubleshooting

### Error: 403 Forbidden
**Cause:** Not authenticated or no permission
**Solution:**
```bash
npm login
npm whoami
```

### Error: Package name already exists
**Cause:** Package name taken
**Solution:** Choose different name or use scoped package

### Error: Version already published
**Cause:** Trying to publish same version twice
**Solution:**
```bash
npm version patch
npm publish
```

### Error: Missing README
**Cause:** npm requires README for new packages
**Solution:** Add `README.md` file

### Private package published as public
**Cause:** Missing publishConfig
**Solution:** Add to package.json:
```json
{
  "publishConfig": {
    "access": "restricted"
  }
}
```

### Workspace dependencies not resolved
**Cause:** Using `workspace:*` in published package
**Solution:** Use specific versions before publishing

---

## Best Practices

1. **Always test locally first:**
   ```bash
   npm pack
   cd /tmp
   tar -xzf /path/to/package.tgz
   cd package
   bun test
   ```

2. **Use semantic versioning consistently**

3. **Keep dependencies minimal**

4. **Document breaking changes clearly**

5. **Use .npmignore to exclude unnecessary files:**
   ```
   # .npmignore
   *.test.ts
   *.spec.ts
   .github/
   .vscode/
   node_modules/
   src/__tests__/
   coverage/
   .env*
   ```

6. **Verify published contents:**
   ```bash
   npm pack --dry-run
   ```

7. **Tag releases in git:**
   ```bash
   git tag -a v1.0.0 -m "Release v1.0.0"
   git push --tags
   ```

---

## Resources

- [npm Publishing Guide](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry)
- [GitHub Packages Documentation](https://docs.github.com/en/packages)
- [Changesets Documentation](https://github.com/changesets/changesets)
- [Semantic Versioning](https://semver.org/)
- [npm CLI Documentation](https://docs.npmjs.com/cli)

---

**Last Updated:** 2025-11-01
