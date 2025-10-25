# 🐢 bun-move

**AI-Native DeFi Operating System on Sui** - Monorepo template for building TortoiseOS dApps with Move, Bun, and AI integration.

Inspired by [bun-eth](https://github.com/Bun-Eth-Community/bun-eth), adapted for Sui Move development.

## Features

- **🚀 Bun-Native**: No transpilation, instant execution
- **🔗 Sui Move Integration**: Full Move smart contract development
- **🤖 AI-Ready**: Built-in Walrus + Nautilus TEE support
- **🔐 awesome-seal Ready**: Security & privacy patterns integrated
- **⚡ Hot Reload**: Move contracts auto-generate TypeScript types
- **🐳 Docker Compose**: Complete local development stack
- **📦 Monorepo**: Shared packages, unified tooling
- **🔧 Task Automation**: Comprehensive task runner via Taskfile

## Quick Start

```bash
# Create new project
bunx create-bun-move my-tortoise-dapp

# Setup
cd my-tortoise-dapp
cp .env.example .env
task setup

# Start development
task dev:full

# Access
# - Web: http://localhost:3000
# - API: http://localhost:3001
# - Sui Node: http://localhost:9000
```

> **📱 Apple Silicon Users**: Due to CPU architecture limitations, run Sui natively instead of in Docker:
> ```bash
> ./scripts/start-sui-local.sh  # Start Sui locally
> docker compose -f docker/docker-compose.yml up api web postgres redis -d
> ```
> See [Development Guide](./docs/DEVELOPMENT.md) for detailed instructions.

## Project Structure

```
bun-move/
├── apps/
│   ├── api/              # Elysia backend
│   └── web/              # Next.js frontend
├── packages/
│   ├── move/             # Sui Move smart contracts
│   │   ├── core/         # Core modules + governance
│   │   ├── amm/          # TortoiseSwap (AMM)
│   │   ├── vault/        # TortoiseVault (Auto-compounder)
│   │   ├── stablecoin/   # TortoiseUSD (NFT-backed stablecoin)
│   │   ├── arb/          # TortoiseArb (Arbitrage bot)
│   │   ├── bridge/       # TortoiseBridgeX (Cross-chain)
│   │   ├── rwa/          # RWA Vault
│   │   ├── btcfi/        # BTCfi Aggregator
│   │   ├── privacy/      # Privacy Vault
│   │   ├── prediction/   # Prediction Market
│   │   └── orderbook/    # Orderbook Launcher
│   ├── core/             # Shared utilities
│   ├── sdk/              # TypeScript SDK
│   ├── ai-integration/   # Walrus + Nautilus TEE
│   ├── move-deployer/    # Hot reload system
│   └── create-bun-move/  # CLI scaffolder
├── tooling/tasks/        # Task automation
├── docker/               # Docker Compose
└── docs/                 # Documentation
```

## TortoiseOS Products

10 AI-powered DeFi products on Sui:

| Product | Description | AI Integration | Phase |
|---------|-------------|----------------|-------|
| **TortoiseSwap** | AMM with adaptive fees | ML volatility model | 1 |
| **TortoiseVault** | Auto-compounding yields | RL optimizer in TEE | 1 |
| **TortoiseUSD** | NFT-backed stablecoin | Vision + NLP valuation | 2 |
| **TortoiseArb** | Arbitrage & MEV bot | GNN signal generator | 2 |
| **TortoiseBridgeX** | Cross-chain router | Multi-agent LangChain | 3 |
| **RWA Vault** | Real-world asset tokenization | LLM fraud detection | 3 |
| **BTCfi Aggregator** | Bitcoin yield on Sui | LSTM correlation forecast | 3 |
| **Privacy Vault** | Private yields | Homomorphic encryption | 4 |
| **Prediction Market** | AI-resolved markets | Ensemble oracles | 4 |
| **Orderbook Launcher** | CLOB deployment | Prophet liquidity forecast | 4 |

## Development

### Prerequisites

- [Bun](https://bun.sh) >= 1.1.0
- [Sui CLI](https://docs.sui.io/build/install) (optional, for local builds)
- [Docker](https://docker.com) (optional, for full stack)
- [Task](https://taskfile.dev) (optional, recommended)

### Available Commands

```bash
# Setup
task setup                 # Install dependencies
task setup:sui             # Install Sui CLI

# Development
task dev:full              # Start full stack (Docker)
task dev:api               # Start API only
task dev:web               # Start web only
task dev:sui               # Start Sui node only

# Move Contracts
task move:build            # Build all Move packages
task move:test             # Run Move tests
task move:deploy           # Deploy to configured network

# Testing
task test:all              # Run all tests
task test:move             # Run Move tests
task test:ts               # Run TypeScript tests

# Deployment
task deploy:localnet       # Deploy to local Sui
task deploy:devnet         # Deploy to devnet
task deploy:testnet        # Deploy to testnet

# Cleanup
task clean:all             # Clean all artifacts
task clean:move            # Clean Move builds
task clean:docker          # Remove Docker containers
```

## Architecture

### Hot Reload System

1. **Deploy contracts**: `task move:deploy`
2. **Auto-generate types**: Move deployer scans packages
3. **TypeScript types**: Creates `deployedContracts.ts`
4. **Frontend refresh**: Next.js hot reload

### AI Integration

```typescript
import { createWalrusClient, createNautilusClient } from "@bun-move/ai-integration";

// Store model weights on Walrus
const walrus = createWalrusClient({ endpoint: WALRUS_ENDPOINT });
const hash = await walrus.storeModelWeights("model-v1", weights);

// Execute in TEE
const nautilus = createNautilusClient({ endpoint: NAUTILUS_ENDPOINT });
const { result, attestation } = await nautilus.executeInTEE(hash, input);
```

### Sui SDK Usage

```typescript
import { createClient } from "@bun-move/sdk";

const client = createClient("localnet");
const balance = await client.getBalance(address);
```

## Configuration

### Environment Variables

```bash
# Network
SUI_NETWORK=localnet
SUI_RPC_URL=http://localhost:9000

# Ports
WEB_PORT=3000
API_PORT=3001
SUI_LOCAL_PORT=9000

# AI Integration
WALRUS_ENDPOINT=https://walrus-testnet.mystenlabs.com
WALRUS_BUCKET_ID=your-bucket-id
NAUTILUS_TEE_ENDPOINT=your-tee-endpoint
NAUTILUS_API_KEY=your-api-key

# Deployment
DEPLOYER_PRIVATE_KEY=your-private-key
```

## Deployment Guide

### 1. Local Deployment

```bash
# Start local Sui node
task dev:sui

# Deploy contracts
task deploy:localnet

# Verify
sui client objects
```

### 2. Devnet/Testnet

```bash
# Configure network
export SUI_NETWORK=devnet

# Deploy
task deploy:devnet

# Verify on explorer
# https://suiexplorer.com/?network=devnet
```

### 3. Mainnet

```bash
# PRODUCTION - use with caution
task deploy:mainnet
```

## AI Model Integration

### Supported AI Types

1. **ML Models**: Volatility prediction, fee optimization
2. **RL Agents**: Yield strategy optimization
3. **GNN**: Graph analysis for arbitrage
4. **LSTM**: Time-series forecasting
5. **LLM**: Document analysis, fraud detection
6. **Prophet**: Liquidity forecasting

### TEE Workflow

```
Train Model → Store on Walrus → Deploy to TEE → On-chain Verification
```

## Governance

**$LAB Token**: Governance token for AI model updates

```move
// Vote on model updates
public entry fun vote_on_model(
    proposal: &mut Proposal,
    lab_tokens: Coin<LAB>,
    vote: bool
)
```

## Testing

```bash
# Move tests
sui move test

# TypeScript tests
bun test

# E2E tests
bun test tests/e2e
```

## Docker

```bash
# Start full stack (Linux/AMD64)
docker compose -f docker/docker-compose.yml up

# Start without Sui (Apple Silicon)
docker compose -f docker/docker-compose.yml up api web postgres redis

# Services:
# - sui-node: Sui local network (AMD64 only)
# - api: Elysia backend
# - web: Next.js frontend
# - postgres: State management
# - redis: Caching
```

> **⚠️ Apple Silicon Note**: The Sui Docker image doesn't support ARM64. Use `./scripts/start-sui-local.sh` to run Sui natively.

## Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/my-feature`
3. Commit changes: `git commit -m "feat: my feature"`
4. Push: `git push origin feature/my-feature`
5. Open Pull Request

## Roadmap

- [x] Phase 0: Foundation (Weeks 0-4)
- [ ] Phase 1: Core Stack - AMM + Vault (Months 1-3)
- [ ] Phase 2: Collateral - Stablecoin + Arb (Months 4-6)
- [ ] Phase 3: Cross-Chain - Bridge + RWA + BTCfi (Months 7-9)
- [ ] Phase 4: Privacy + Markets (Months 10-12)

## Security & Privacy

**awesome-seal Integration**: This project includes comprehensive recommendations for integrating the [awesome-seal](https://github.com/MystenLabs/awesome-seal) ecosystem to enhance security and privacy.

**See [AWESOME_SEAL_EVALUATION.md](./AWESOME_SEAL_EVALUATION.md) for:**
- 🔒 Encrypted storage with Seal SDK (saves 1-2 weeks)
- 🛡️ Nautilus TEE integration patterns (saves 2-3 weeks)
- 🎯 Token-gated access control (saves 1 week)
- 🔐 Decryptable Move Enum for privacy (saves 1 week)
- **Total time savings: 6-12 weeks across development lifecycle**

### Quick Start with awesome-seal

```bash
# Create shared Seal integration package
mkdir -p packages/seal-integration
cd packages/seal-integration
bun add @seal/rust-sdk @seal/access-control

# Add to Move packages
# See AWESOME_SEAL_EVALUATION.md for Move.toml configuration
```

## Resources

- [Sui Documentation](https://docs.sui.io)
- [Move Language](https://move-language.github.io/move/)
- [Bun Documentation](https://bun.sh/docs)
- [Walrus Storage](https://docs.walrus.site)
- [Nautilus TEE](https://nautilus.sui.io)
- [awesome-seal Ecosystem](https://github.com/MystenLabs/awesome-seal)

## License

MIT License - see [LICENSE](LICENSE) for details

## Support

- GitHub Issues: Report bugs and feature requests
- Discord: [Join our community](#)
- Twitter: [@TortoiseOS](#)

---

**Built with ❤️ for the Sui ecosystem**

🐢 **TortoiseOS** - Slow and steady wins the DeFi race
