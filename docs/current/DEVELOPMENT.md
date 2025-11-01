# Development Guide

## Quick Start

### Prerequisites

- **Bun** >= 1.0
- **Docker** and **Docker Compose**
- **Sui CLI** (for local Sui network)
- **Node.js** >= 18 (for compatibility)

### Installation

```bash
# Install dependencies
bun install

# Setup development environment
task setup
```

## Running the Stack

### Option 1: Full Docker Stack (Linux/AMD64)

For Linux or AMD64 systems, you can run everything in Docker:

```bash
task dev:full
```

This starts:
- Sui local network (port 9000)
- Faucet (port 9123)
- PostgreSQL (port 5432)
- Redis (port 6379)
- API server (port 3001)
- Web frontend (port 3000)

### Option 2: Hybrid Stack (Apple Silicon Recommended)

Due to CPU architecture incompatibilities, Apple Silicon users should run Sui natively:

#### 1. Start Local Sui Network

```bash
# Using the provided script (recommended)
./scripts/start-sui-local.sh

# Or manually
sui start --with-faucet --epoch-duration-ms 60000
```

The script will:
- Check if Sui CLI is installed (offers to install if missing)
- Check if a network is already running
- Optionally clean up old network state
- Start Sui with faucet on ports 9000 (RPC) and 9123 (faucet)

#### 2. Start Backend Services

In a separate terminal:

```bash
# Start PostgreSQL and Redis
docker compose -f docker/docker-compose.yml up postgres redis -d

# Or run all services except Sui
docker compose -f docker/docker-compose.yml up api web postgres redis -d
```

#### 3. Run Development Servers

```bash
# API (if not using Docker)
task dev:api

# Web (if not using Docker)
task dev:web
```

## Development Workflow

### Move Contract Development

```bash
# Build all Move packages
task move:build

# Run Move tests
task move:test

# Deploy to local network
task move:deploy

# Watch for changes and rebuild
task move:watch
```

### TypeScript Development

```bash
# Build all TypeScript packages
task build:ts

# Run tests
task test

# Type check
task test:types

# Lint
task test:lint
```

### Full Development Mode

Start everything in watch mode:

```bash
# Terminal 1: Sui Network
./scripts/start-sui-local.sh

# Terminal 2: Backend services
docker compose -f docker/docker-compose.yml up postgres redis -d

# Terminal 3: API with hot reload
task dev:api

# Terminal 4: Web with hot reload
task dev:web

# Terminal 5: Move contracts with watch
task move:watch
```

## Project Structure

```
bun-move/
├── apps/
│   ├── api/              # Backend API (Elysia + Bun)
│   │   ├── src/
│   │   │   ├── index.ts  # Main server
│   │   │   ├── routes/   # API routes
│   │   │   └── services/ # Business logic
│   │   └── Dockerfile
│   └── web/              # Frontend (Next.js)
│       ├── src/
│       │   └── app/      # App router pages
│       └── Dockerfile
├── packages/
│   ├── core/             # Core types and utilities
│   ├── sdk/              # TortoiseOS SDK
│   ├── hooks/            # React hooks for Sui
│   ├── components/       # UI components (Radix)
│   ├── burner-wallet/    # Dev wallet
│   ├── ai-integration/   # AI features (Walrus, Nautilus)
│   └── move/             # Move contracts
│       ├── core/         # Governance, version
│       ├── amm/          # AMM DEX
│       ├── vault/        # Yield vaults
│       └── ...           # Other TortoiseOS products
├── tooling/
│   └── tasks/            # Taskfile definitions
├── scripts/              # Helper scripts
└── docker/               # Docker configurations
```

## Working with Move Contracts

### Creating a New Contract

```bash
# Create new Move package
mkdir -p packages/move/my-module
cd packages/move/my-module
sui move new my-module
```

### Contract Structure

```move
module tortoise_core::my_module {
    use sui::object::{Self, UID};
    use sui::tx_context::TxContext;

    /// One-time witness for module initialization
    public struct MY_MODULE has drop {}

    /// Main object
    public struct MyObject has key {
        id: UID,
        // fields
    }

    /// Initialize module
    fun init(_witness: MY_MODULE, ctx: &mut TxContext) {
        // Setup
    }

    /// Public functions
    public fun create_object(ctx: &mut TxContext): MyObject {
        MyObject {
            id: object::new(ctx),
        }
    }
}
```

### Testing Move Contracts

```bash
# Run tests for specific package
cd packages/move/core
sui move test

# Run with coverage
sui move test --coverage

# Run specific test
sui move test test_function_name
```

## Working with TypeScript SDK

### Adding a New Hook

```typescript
// packages/hooks/src/useMyFeature.ts
import { useQuery } from "@tanstack/react-query";
import { useSuiClient } from "@mysten/dapp-kit";
import { useTortoiseContract } from "./useTortoiseContract";

export function useMyFeature(objectId: string) {
  const client = useSuiClient();
  const contract = useTortoiseContract("my-module");

  return useQuery({
    queryKey: ["my-feature", objectId],
    queryFn: async () => {
      // Fetch data from chain
      const result = await client.getObject({
        id: objectId,
        options: { showContent: true },
      });
      return result;
    },
    enabled: !!objectId,
  });
}
```

### Creating UI Components

```typescript
// packages/components/src/MyComponent.tsx
import { Card, Flex, Heading, Text } from "@radix-ui/themes";
import { useMyFeature } from "@bun-move/hooks";

export function MyComponent({ objectId }: { objectId: string }) {
  const { data, isLoading } = useMyFeature(objectId);

  if (isLoading) return <Text>Loading...</Text>;

  return (
    <Card>
      <Flex direction="column" gap="3">
        <Heading size="5">My Feature</Heading>
        <Text>{JSON.stringify(data)}</Text>
      </Flex>
    </Card>
  );
}
```

## Environment Variables

Create a `.env` file in the root:

```bash
# Sui Network
SUI_RPC_URL=http://localhost:9000
SUI_NETWORK=localnet

# API
API_PORT=3001
NODE_ENV=development

# Database
DATABASE_URL=postgresql://tortoise:tortoise_dev@localhost:5432/tortoise_os

# Redis
REDIS_URL=redis://localhost:6379

# Web
NEXT_PUBLIC_SUI_NETWORK=localnet
NEXT_PUBLIC_SUI_RPC_URL=http://localhost:9000
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Testing

### Unit Tests

```bash
# Run all tests
task test

# Watch mode
bun test --watch

# Specific package
cd packages/sdk
bun test
```

### Integration Tests

```bash
# API integration tests
cd apps/api
bun test

# Requires running Sui network and database
```

### E2E Tests

```bash
# Web E2E tests (Playwright)
cd apps/web
bun test:e2e
```

## Common Issues

### Sui Network Won't Start

**Problem:** Port 9000 already in use

**Solution:**
```bash
# Find and kill process
lsof -ti:9000 | xargs kill -9

# Or use the script which handles this
./scripts/start-sui-local.sh
```

### Docker Build Fails

**Problem:** TypeScript errors during Next.js build

**Solution:**
```bash
# Clean and rebuild
docker compose -f docker/docker-compose.yml down -v
docker compose -f docker/docker-compose.yml build --no-cache
```

### Move Compilation Errors

**Problem:** "Package not found" errors

**Solution:**
```bash
# Clean Move build cache
find packages/move -name "build" -type d -exec rm -rf {} +

# Rebuild
task move:build
```

### Port Conflicts

**Problem:** Services fail to start due to port conflicts

**Solution:**
```bash
# Check what's using the ports
lsof -i :3000  # Web
lsof -i :3001  # API
lsof -i :9000  # Sui
lsof -i :5432  # Postgres
lsof -i :6379  # Redis

# Kill processes or use different ports in .env
```

## Performance Tips

### Bun Optimization

```bash
# Use bun's built-in SQLite for faster tests
# Already configured in bunfig.toml

# Parallel test execution
bun test --concurrent
```

### Docker Optimization

```bash
# Use BuildKit for faster builds
export DOCKER_BUILDKIT=1

# Prune unused images
docker system prune -a
```

### Move Optimization

```bash
# Build in release mode for production
sui move build --release

# Skip tests during development
sui move build --skip-fetch-latest-git-deps
```

## Deployment

### Deploy Move Contracts

```bash
# Deploy to testnet
task move:deploy network=testnet

# Deploy to mainnet (requires confirmation)
task move:deploy network=mainnet
```

### Deploy Backend

```bash
# Build production images
docker compose -f docker/docker-compose.prod.yml build

# Push to registry
docker push your-registry/tortoise-api:latest
docker push your-registry/tortoise-web:latest
```

## AI Integration

### Walrus Storage

```bash
# Configure Walrus endpoint
export WALRUS_URL=https://walrus-testnet.mystenlabs.com

# Use in code
import { WalrusClient } from "@bun-move/ai-integration";

const walrus = new WalrusClient();
await walrus.store(data);
```

### Nautilus TEE

```bash
# Configure Nautilus
export NAUTILUS_URL=https://nautilus.mystenlabs.com

# Use for confidential computing
import { NautilusClient } from "@bun-move/ai-integration";

const nautilus = new NautilusClient();
await nautilus.execute(privateData);
```

## Contributing

### Code Style

- **TypeScript**: ESLint + Prettier (configured)
- **Move**: Follow [Sui Move style guide](https://docs.sui.io/build/move)
- **Commits**: Use conventional commits

### Pull Request Process

1. Create feature branch from `main`
2. Make changes with tests
3. Run `task test` and `task test:lint`
4. Submit PR with description
5. Wait for CI to pass
6. Request review

## Resources

- [Sui Documentation](https://docs.sui.io)
- [Bun Documentation](https://bun.sh/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Radix UI Documentation](https://www.radix-ui.com/themes/docs)
- [TortoiseOS Roadmap](./ROADMAP.md)
