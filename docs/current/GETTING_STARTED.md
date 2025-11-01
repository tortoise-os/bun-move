# Getting Started with TortoiseOS

Complete guide to set up and develop with bun-move.

## Prerequisites

### Required

- **Bun** >= 1.1.0 - [Install Bun](https://bun.sh)
  ```bash
  curl -fsSL https://bun.sh/install | bash
  ```

### Optional (but recommended)

- **Sui CLI** - [Install Guide](https://docs.sui.io/build/install)
  ```bash
  # macOS
  brew install sui

  # Linux/WSL
  cargo install --locked --git https://github.com/MystenLabs/sui.git --branch mainnet sui
  ```

- **Docker** - [Install Docker](https://docker.com)

- **Task** - [Install Task](https://taskfile.dev)
  ```bash
  brew install go-task  # macOS
  ```

## Quick Start

### 1. Create New Project

```bash
bunx create-bun-move my-tortoise-dapp
```

Follow the interactive prompts to select:
- Project type (full-stack, backend-only, move-only)
- TortoiseOS products to include

### 2. Configure Environment

```bash
cd my-tortoise-dapp
cp .env.example .env
```

Edit `.env`:
```bash
# Basic configuration
SUI_NETWORK=localnet
WEB_PORT=3000
API_PORT=3001
SUI_LOCAL_PORT=9000

# For AI features (optional)
WALRUS_ENDPOINT=https://walrus-testnet.mystenlabs.com
NAUTILUS_TEE_ENDPOINT=your-endpoint
```

### 3. Install Dependencies

```bash
task setup
# or
bun install
```

### 4. Start Development Stack

**Option A: Full Stack (Docker)**
```bash
task dev:full
```

This starts:
- Sui local network (port 9000)
- API backend (port 3001)
- Web frontend (port 3000)
- PostgreSQL database
- Redis cache

**Option B: Individual Services**
```bash
# Terminal 1: Sui node
task dev:sui

# Terminal 2: API
task dev:api

# Terminal 3: Web
task dev:web
```

### 5. Access Your dApp

- **Frontend**: http://localhost:3000
- **API**: http://localhost:3001
- **API Docs**: http://localhost:3001/swagger
- **Sui RPC**: http://localhost:9000

## Development Workflow

### 1. Build Move Contracts

```bash
# Build all packages
task move:build

# Build specific package
cd packages/move/amm
sui move build
```

### 2. Test Move Contracts

```bash
# Test all
task move:test

# Test specific package
cd packages/move/amm
sui move test
```

### 3. Deploy Contracts

```bash
# Deploy to local network
task deploy:localnet

# Deploy to devnet
task deploy:devnet
```

After deployment, TypeScript types are auto-generated in `packages/move/deployedContracts.ts`.

### 4. Develop Frontend

Edit `apps/web/src/app/page.tsx`:

```typescript
import { useCurrentAccount, useSuiClient } from "@mysten/dapp-kit";

export default function MyComponent() {
  const account = useCurrentAccount();
  const client = useSuiClient();

  // Your dApp logic
}
```

### 5. Develop API

Edit `apps/api/src/routes/`:

```typescript
import { Elysia } from "elysia";

export const myRoutes = new Elysia({ prefix: "/my-feature" })
  .get("/", () => ({ message: "Hello TortoiseOS" }))
  .post("/", async ({ body }) => {
    // Your API logic
  });
```

## Project Structure Walkthrough

```
my-tortoise-dapp/
├── apps/
│   ├── api/              # Backend API
│   │   ├── src/
│   │   │   ├── index.ts      # Main entry point
│   │   │   ├── config.ts     # Configuration
│   │   │   └── routes/       # API routes
│   │   └── Dockerfile
│   └── web/              # Frontend
│       ├── src/
│       │   └── app/          # Next.js app router
│       ├── next.config.mjs
│       └── Dockerfile
├── packages/
│   ├── move/             # Smart contracts
│   │   ├── core/             # Shared modules
│   │   ├── amm/              # AMM contract
│   │   └── .../              # Other products
│   ├── core/             # Utilities
│   ├── sdk/              # Sui SDK wrapper
│   └── ai-integration/   # AI/TEE tools
└── tooling/tasks/        # Task automation
```

## Common Tasks

### Adding a New Move Module

```bash
# Create module directory
mkdir -p packages/move/my-module/sources

# Create Move.toml
cat > packages/move/my-module/Move.toml <<EOF
[package]
name = "MyModule"
version = "0.1.0"
edition = "2024.beta"

[dependencies]
Sui = { git = "https://github.com/MystenLabs/sui.git", subdir = "crates/sui-framework/packages/sui-framework", rev = "framework/mainnet" }

[addresses]
my_module = "0x0"
EOF

# Create module
cat > packages/move/my-module/sources/my_module.move <<EOF
module my_module::my_module {
    use sui::object::{Self, UID};
    use sui::tx_context::TxContext;

    public struct MyObject has key {
        id: UID,
    }

    fun init(ctx: &mut TxContext) {
        // Initialization logic
    }
}
EOF
```

### Calling Contracts from Frontend

```typescript
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { useSignAndExecuteTransactionBlock } from "@mysten/dapp-kit";

function MyComponent() {
  const { mutate: signAndExecute } = useSignAndExecuteTransactionBlock();

  const handleSwap = async () => {
    const tx = new TransactionBlock();

    tx.moveCall({
      target: `${packageId}::pool::swap_a_to_b`,
      arguments: [
        tx.object(poolId),
        tx.pure(amountIn),
      ],
      typeArguments: [coinTypeA, coinTypeB],
    });

    signAndExecute({
      transactionBlock: tx,
    }, {
      onSuccess: (result) => {
        console.log("Swap successful:", result.digest);
      },
    });
  };

  return <button onClick={handleSwap}>Swap</button>;
}
```

### Adding AI Integration

```typescript
import { createWalrusClient } from "@bun-move/ai-integration";

// Store model weights
const walrus = createWalrusClient({
  endpoint: process.env.WALRUS_ENDPOINT!,
});

const weights = new Uint8Array([/* ... */]);
const hash = await walrus.storeModelWeights("my-model-v1", weights);

// Use in Move contract
// Reference hash in AIModel struct
```

## Debugging

### Move Contracts

```bash
# Verbose test output
sui move test --verbose

# Test specific function
sui move test test_my_function

# Print values
module my_module::debug {
    use std::debug;

    public fun my_function() {
        debug::print(&b"Debug message");
    }
}
```

### API

```bash
# Set log level
export LOG_LEVEL=debug
task dev:api

# View logs
task dev:logs-api
```

### Frontend

Next.js dev mode includes:
- Hot reload
- Error overlay
- React DevTools support

## Testing

### Unit Tests

```bash
# Move tests
task move:test

# TypeScript tests
bun test
```

### E2E Tests

```bash
# Start test environment
task dev:full-detached

# Run E2E tests
bun test tests/e2e

# Stop environment
task dev:stop
```

## Deployment

### To Devnet

```bash
# Configure Sui client
sui client new-env --alias devnet --rpc https://fullnode.devnet.sui.io
sui client switch --env devnet

# Fund account from faucet
sui client faucet

# Deploy
task deploy:devnet
```

### To Testnet

```bash
sui client switch --env testnet
task deploy:testnet
```

### To Mainnet

```bash
# CAUTION: Production deployment
sui client switch --env mainnet

# Verify configuration
sui client active-env
sui client active-address

# Deploy
task deploy:mainnet
```

## Next Steps

- Read [Architecture Documentation](./ARCHITECTURE.md)
- Explore [Move Examples](../packages/move/)
- Check [API Reference](./API.md)
- Join [Community Discord](#)

## Troubleshooting

### Bun not found

```bash
curl -fsSL https://bun.sh/install | bash
source ~/.bashrc  # or ~/.zshrc
```

### Sui CLI errors

```bash
# Reinstall Sui
cargo install --locked --git https://github.com/MystenLabs/sui.git --branch mainnet sui --force
```

### Docker issues

```bash
# Reset Docker state
task dev:stop
task clean:docker
docker system prune -a
```

### Port conflicts

Edit `.env`:
```bash
WEB_PORT=3100  # Change from 3000
API_PORT=3101  # Change from 3001
```

## Support

- **Issues**: [GitHub Issues](https://github.com/your-org/bun-move/issues)
- **Discord**: [Join Community](#)
- **Docs**: [Full Documentation](https://docs.tortoise-os.io)
