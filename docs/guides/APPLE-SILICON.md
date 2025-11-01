# 🍎 Apple Silicon Development Guide

## TL;DR

The Sui Docker image doesn't work on Apple Silicon (ARM64). Use the provided script to run Sui natively instead:

```bash
./scripts/start-sui-local.sh
```

## Why This Happens

The official `mysten/sui-tools` Docker image is built for AMD64 architecture. When running on Apple Silicon (ARM64) through Docker's Rosetta emulation, the Sui binaries fail with an "Illegal instruction" error.

This is a known limitation of the Sui toolchain's Docker distribution.

## Solution: Native Sui Installation

### Automatic Installation (Recommended)

Use our helper script that handles everything:

```bash
./scripts/start-sui-local.sh
```

The script will:
1. ✅ Check if Sui CLI is installed
2. ✅ Offer to install it if missing (via Cargo)
3. ✅ Detect port conflicts and offer to resolve them
4. ✅ Optionally clean old network state
5. ✅ Start Sui with faucet on correct ports

### Manual Installation

If you prefer to install manually:

```bash
# Install Rust (if not already installed)
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Install Sui CLI
cargo install --locked --git https://github.com/MystenLabs/sui.git --branch testnet sui

# Verify installation
sui --version

# Initialize Sui
sui client

# Start local network
sui start --with-faucet --epoch-duration-ms 60000
```

## Development Setup

### Option 1: Hybrid Docker + Native Sui (Recommended)

This gives you the best of both worlds:

```bash
# Terminal 1: Start Sui natively
./scripts/start-sui-local.sh

# Terminal 2: Start other services in Docker
docker compose -f docker/docker-compose.yml up api web postgres redis -d
```

**Ports:**
- Sui RPC: `http://localhost:9000`
- Faucet: `http://localhost:9123`
- API: `http://localhost:3001`
- Web: `http://localhost:3000`
- Postgres: `localhost:5432`
- Redis: `localhost:6379`

### Option 2: Fully Native (For Advanced Users)

Run everything natively without Docker:

```bash
# Terminal 1: Sui
sui start --with-faucet --epoch-duration-ms 60000

# Terminal 2: Postgres (Docker still easiest)
docker run -d -p 5432:5432 \
  -e POSTGRES_USER=tortoise \
  -e POSTGRES_PASSWORD=tortoise_dev \
  -e POSTGRES_DB=tortoise_os \
  postgres:16-alpine

# Terminal 3: Redis (Docker still easiest)
docker run -d -p 6379:6379 redis:7-alpine

# Terminal 4: API
cd apps/api
bun run dev

# Terminal 5: Web
cd apps/web
bun run dev
```

## Environment Variables

Update your `.env` to point to native Sui:

```bash
# Sui Network (pointing to native installation)
SUI_RPC_URL=http://localhost:9000
SUI_NETWORK=localnet
SUI_FAUCET_URL=http://localhost:9123

# Other services (can still use Docker)
DATABASE_URL=postgresql://tortoise:tortoise_dev@localhost:5432/tortoise_os
REDIS_URL=redis://localhost:6379

# API
API_PORT=3001
NODE_ENV=development

# Web
NEXT_PUBLIC_SUI_NETWORK=localnet
NEXT_PUBLIC_SUI_RPC_URL=http://localhost:9000
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Troubleshooting

### "sui: command not found"

**Solution:** Make sure Cargo's bin directory is in your PATH:

```bash
echo 'export PATH="$HOME/.cargo/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

### Port 9000 Already in Use

**Solution:** The script handles this automatically, or manually:

```bash
# Find what's using the port
lsof -ti:9000

# Kill it
lsof -ti:9000 | xargs kill -9
```

### Sui Network Crashes or Hangs

**Solution:** Clean up and restart:

```bash
# Stop Sui (Ctrl+C in the terminal)

# Remove old config
rm -rf ~/.sui/sui_config

# Start fresh
./scripts/start-sui-local.sh
```

### Docker Containers Can't Connect to Sui

**Problem:** Docker containers trying to connect to `localhost:9000` can't reach Sui running natively.

**Solution:** Update docker-compose.yml to use host networking or `host.docker.internal`:

```yaml
# In docker-compose.yml
services:
  api:
    environment:
      # Use host.docker.internal on Mac
      - SUI_RPC_URL=http://host.docker.internal:9000
```

Or run API/Web natively too:

```bash
# Don't run in Docker
task dev:api
task dev:web
```

## Performance Comparison

| Setup | Pros | Cons |
|-------|------|------|
| **Hybrid (Recommended)** | ✅ Easy setup<br>✅ Isolated services<br>✅ Fast Sui performance | ⚠️ Multiple terminals<br>⚠️ Extra RAM for Docker |
| **Fully Docker** | ✅ One command<br>✅ Perfect isolation | ❌ **Doesn't work on Apple Silicon** |
| **Fully Native** | ✅ Best performance<br>✅ Less RAM usage | ⚠️ More setup<br>⚠️ System-wide installs |

## Building Docker Images on Apple Silicon

If you're building Docker images for deployment:

```bash
# Build multi-platform images
docker buildx build --platform linux/amd64,linux/arm64 \
  -t your-registry/tortoise-api:latest \
  -f apps/api/Dockerfile .

docker buildx build --platform linux/amd64,linux/arm64 \
  -t your-registry/tortoise-web:latest \
  -f apps/web/Dockerfile .
```

Note: The web and API images build fine on Apple Silicon. Only Sui has the limitation.

## CI/CD Considerations

If you're setting up CI/CD on GitHub Actions or similar:

```yaml
# .github/workflows/test.yml
jobs:
  test:
    runs-on: ubuntu-latest  # Use AMD64 runners
    services:
      sui-node:
        image: mysten/sui-tools:testnet
        ports:
          - 9000:9000
          - 9123:5003
```

Ubuntu runners are AMD64, so Docker works fine there.

## Alternative: Use Sui Devnet

Instead of running a local network, you can develop against Sui Devnet:

```bash
# .env
SUI_NETWORK=devnet
SUI_RPC_URL=https://fullnode.devnet.sui.io:443

# Get test tokens
sui client faucet
```

**Pros:**
- No local Sui installation needed
- Always up to date
- Public faucet available

**Cons:**
- Slower than local
- Depends on internet connection
- Shared network state

## Future Updates

The Sui team is working on ARM64 support. Monitor these resources:

- [Sui GitHub Issues](https://github.com/MystenLabs/sui/issues)
- [Sui Discord](https://discord.gg/sui)

Once ARM64 Docker images are available, you'll be able to use:

```bash
task dev:full  # Just works!
```

## Getting Help

If you encounter issues:

1. 📖 Check the [Development Guide](./DEVELOPMENT.md)
2. 🐛 [Open an issue](https://github.com/your-org/bun-move/issues)
3. 💬 Ask in [Discord](#)
4. 🔍 Search [Sui Forums](https://forums.sui.io)

---

Built with ❤️ for the Sui ecosystem on 🍎 Apple Silicon
