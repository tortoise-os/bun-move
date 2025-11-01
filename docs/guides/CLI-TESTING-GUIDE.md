# CLI Testing Guide

Quick guide for testing the `create-bun-move` CLI locally before publishing.

## 🧪 Local Testing Methods

### Method 1: Direct Execution (Fastest)

```bash
# Build the CLI
cd packages/create-bun-move
bun run build

# Test it directly
bun run dist/index.js --help

# Create a test project
mkdir -p /tmp/test-cli && cd /tmp/test-cli
/path/to/bun-move/packages/create-bun-move/dist/index.js my-test-app
```

### Method 2: Using npm link (Most Realistic)

```bash
# In the create-bun-move directory
cd packages/create-bun-move
bun run build
npm link

# Now test it globally
cd /tmp
create-bun-move my-test-project

# Verify it works
cd my-test-project
cat package.json
tree -L 2  # View structure

# Cleanup
npm unlink -g create-bun-move
```

### Method 3: Using bunx (Recommended)

```bash
# Build the CLI
cd packages/create-bun-move
bun run build

# Test with bunx
cd /tmp
bunx /path/to/bun-move/packages/create-bun-move my-project

# Or create a tarball first
cd packages/create-bun-move
npm pack
# This creates create-bun-move-0.1.0.tgz

# Test the tarball
cd /tmp  
bunx /path/to/create-bun-move-0.1.0.tgz my-project
```

## 📋 Test Checklist

Test each scenario:

- [ ] **Help command**: `--help` shows usage
- [ ] **Version command**: `--version` shows version
- [ ] **Interactive mode**: No arguments, prompts user
- [ ] **With project name**: `create-bun-move my-app`
- [ ] **Minimal template**: `-t minimal`
- [ ] **No Docker**: `--no-docker`
- [ ] **No Sui**: `--no-sui`
- [ ] **All options**: `create-bun-move test -t minimal --no-sui --no-docker`

## 🔍 Verification Steps

After creating a project, verify:

```bash
cd my-test-project

# Check structure
ls -la
tree -L 2

# Check package.json
cat package.json

# Check README
cat README.md

# Try to install (if you want full test)
bun install

# Verify build works  
bun run build
```

## 🧹 Cleanup

```bash
# Remove test projects
rm -rf /tmp/test-cli
rm -rf /tmp/my-*

# Unlink if you used npm link
npm unlink -g create-bun-move

# Remove tarballs
rm -f packages/create-bun-move/*.tgz
```

## 🐛 Common Issues During Testing

### Issue: "command not found"
**Solution**: Make sure the file is executable:
```bash
chmod +x packages/create-bun-move/dist/index.js
```

### Issue: "Cannot find module"  
**Solution**: Rebuild the CLI:
```bash
cd packages/create-bun-move
rm -rf dist
bun run build
```

### Issue: Prompts not showing
**Solution**: Run in interactive terminal, not piped:
```bash
# ❌ Won't work
echo "" | create-bun-move

# ✅ Works
create-bun-move
```

## 📊 Test Matrix

| Test Case | Template | Docker | Sui | Expected Result |
|-----------|----------|--------|-----|-----------------|
| Full default | full | ✅ | ✅ | All features |
| Minimal | minimal | ❌ | ✅ | Web + Move |
| Web only | full | ❌ | ❌ | Web + API |
| Minimal no Sui | minimal | ❌ | ❌ | Web only |

## ✅ Pre-Publish Checklist

Before running `./publish.sh`:

- [ ] All local tests pass
- [ ] CLI help text is correct
- [ ] Generated projects build successfully
- [ ] README is up to date
- [ ] Version bumped in package.json
- [ ] CHANGELOG updated
- [ ] Logged into npm (`npm whoami`)
- [ ] Git committed and tagged

## 🚀 Publishing

Once all tests pass:

```bash
# Publish to npm
./publish.sh

# Test the published version
bunx create-bun-move@latest final-test

# Verify on npm
open https://www.npmjs.com/package/create-bun-move
```

---

**Happy Testing! 🐢**
