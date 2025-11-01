# Quick Start Guide

Fast reference for common tasks in TortoiseOS.

## 🚀 Development

```bash
# Install dependencies
bun install

# Start web app
bun run dev:web

# Start API
bun run dev

# Run all tests
bun test

# Run E2E tests
cd apps/web && bun run test:e2e

# Build everything
bun run build
```

## 🧪 Testing CLI Locally

```bash
# Build CLI
cd packages/create-bun-move
bun run build

# Test it
bun run dist/index.js my-test-app

# Or use npm link
npm link
create-bun-move my-test-project
npm unlink -g create-bun-move
```

## 📤 Publishing to npm

```bash
# One-time setup
npm login

# Automated publish
./publish.sh

# Manual publish
cd packages/core && npm publish --access public
cd packages/sdk && npm publish --access public
cd packages/ui && npm publish --access public
cd packages/create-bun-move && npm publish --access public
```

## 🐛 Troubleshooting

```bash
# Kill port 3000
lsof -ti:3000 | xargs kill -9

# Rebuild everything
bun install
bun run build

# Clean and reinstall
rm -rf node_modules bun.lockb
bun install

# Check Docker
docker compose ps
docker compose logs
```

## 📦 Package Locations

- CLI: `packages/create-bun-move`
- UI: `packages/ui`
- Core: `packages/core`
- SDK: `packages/sdk`
- Web: `apps/web`
- API: `apps/api`

## 🔗 Important Links

- [Full Status](./PROJECT-STATUS.md)
- [Publishing Guide](./PUBLISHING.md)
- [CLI Testing](./CLI-TESTING-GUIDE.md)

## ⚡ Quick Commands

```bash
# Test CLI help
cd packages/create-bun-move && bun run dist/index.js --help

# View npm login
npm whoami

# Check package versions
npm view create-bun-move
npm view @bun-move/ui

# Test published CLI
bunx create-bun-move@latest test-project
```

---

**Need more details?** Check [PROJECT-STATUS.md](./PROJECT-STATUS.md) for the complete guide.
