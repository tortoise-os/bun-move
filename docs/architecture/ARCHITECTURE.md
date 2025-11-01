# TortoiseOS Architecture

## Overview

TortoiseOS is an AI-Native DeFi Operating System built on Sui, following a modular monorepo architecture inspired by bun-eth.

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        User Interface                        │
│                    (Next.js + dApp Kit)                     │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                      API Layer (Elysia)                      │
│  Health │ Sui RPC │ AI Integration │ Contract Interaction  │
└─────────────────────┬───────────────────────────────────────┘
                      │
        ┌─────────────┼─────────────┐
        │             │             │
┌───────▼──────┐ ┌───▼────┐ ┌─────▼──────────┐
│  Sui Move    │ │ Walrus │ │  Nautilus TEE  │
│  Contracts   │ │Storage │ │   AI Agents    │
└──────────────┘ └────────┘ └────────────────┘
```

## Monorepo Structure

### Apps Layer

**API (`apps/api`)**
- Elysia-based backend
- Sui RPC proxy
- AI/TEE integration endpoints
- State management

**Web (`apps/web`)**
- Next.js 14 with App Router
- Sui dApp Kit integration
- Radix UI components
- Real-time updates

### Packages Layer

**Move Contracts (`packages/move/*`)**
- **core**: Governance, version management
- **amm**: TortoiseSwap - AI-powered AMM
- **vault**: TortoiseVault - RL yield optimizer
- **stablecoin**: TortoiseUSD - NFT collateral
- **arb**: TortoiseArb - GNN arbitrage
- **bridge**: TortoiseBridgeX - Multi-agent routing
- **rwa**: Real-world asset tokenization
- **btcfi**: Bitcoin yield aggregator
- **privacy**: Homomorphic encryption vault
- **prediction**: AI oracle prediction market
- **orderbook**: Prophet-based CLOB launcher

**Core (`packages/core`)**
- Logger utility
- Constants (networks, endpoints)
- Type definitions
- Common utilities

**SDK (`packages/sdk`)**
- Sui client wrapper
- Contract interaction helpers
- Type-safe transaction building

**AI Integration (`packages/ai-integration`)**
- Walrus storage client
- Nautilus TEE client
- Model management
- Attestation verification

**Move Deployer (`packages/move-deployer`)**
- Hot reload system
- TypeScript type generation
- Deployment tracking

**Create Tool (`packages/create-bun-move`)**
- CLI scaffolder
- Template cloning via degit
- Project customization

## Data Flow

### Contract Deployment Flow

```
1. Developer: sui move build
2. Move Deployer: Scan packages/move/
3. Extract: Package IDs, module names, ABIs
4. Generate: packages/move/deployedContracts.ts
5. Next.js: Hot reload with new types
6. Frontend: Type-safe contract calls
```

### AI Inference Flow

```
1. Train Model (off-chain)
2. Store Weights → Walrus (hash: 0xabc...)
3. Deploy Agent → Nautilus TEE
4. Execute Inference → TEE (with attestation)
5. Verify Signature → On-chain
6. Apply Result → Smart contract update
```

### Transaction Flow

```
User → dApp Kit → SDK → Transaction Builder → Sui RPC → Blockchain
                                                    ↓
                                              Event Emitted
                                                    ↓
                                         API Webhook / Poller
                                                    ↓
                                           Update Frontend
```

## AI Integration Architecture

### Model Storage (Walrus)

```typescript
// Store model weights
const hash = await walrus.storeModelWeights(modelId, weights);

// Reference in Move contract
public struct AIModel {
    walrus_hash: vector<u8>,  // 0xabc...
    version: u64,
    approved: bool
}
```

### TEE Execution (Nautilus)

```typescript
// Execute in secure enclave
const { result, attestation } = await nautilus.executeInTEE(
  modelHash,
  inputData
);

// Verify on-chain
public entry fun verify_tee_result(
    attestation: TEEAttestation,
    result: vector<u8>
) {
    // Verify signature matches expected public key
    assert!(verify_signature(attestation), EINVALID_TEE);
    // Apply result
}
```

### AI Model Types

| Type | Use Case | Storage | Execution |
|------|----------|---------|-----------|
| **ML** | Fee optimization | Walrus | TEE |
| **RL** | Yield strategies | Walrus | TEE |
| **GNN** | Arbitrage detection | Walrus | TEE |
| **LSTM** | Price forecasting | Walrus | TEE |
| **LLM** | Document analysis | Walrus | TEE |
| **Prophet** | Liquidity prediction | Walrus | TEE |

## Security Architecture

### Multi-Layer Security

1. **Smart Contract Layer**
   - Move Prover verification
   - Object capability model
   - No reentrancy by design

2. **AI Layer**
   - TEE attestation
   - Model weight hashing
   - ZK proofs for privacy

3. **API Layer**
   - Rate limiting (Redis)
   - Authentication
   - Input validation

4. **Infrastructure Layer**
   - Non-custodial design
   - Environment isolation
   - Secrets management

### Governance Security

```move
public struct Proposal {
    id: UID,
    model_hash: vector<u8>,
    votes_for: u64,
    votes_against: u64,
    threshold: u64,
    executed: bool
}

// Only $LAB holders can vote
public entry fun vote(
    proposal: &mut Proposal,
    lab_tokens: Coin<LAB>,
    vote: bool
)
```

## Scalability

### Sui Parallel Execution

Move contracts designed for parallel transaction execution:

```move
// Each user has their own Position object
public struct Position has key, store {
    id: UID,
    owner: address,
    amount: u64
}

// Parallel transactions on different Positions
// No shared object contention
```

### Caching Strategy

```
Redis Cache → API → Sui RPC
  ↓
Balance, Object State, Event History
  ↓
TTL: 5s for balances, 60s for static data
```

### AI Model Optimization

- **Quantization**: Reduce model size for TEE
- **Batching**: Aggregate inference requests
- **Caching**: Cache frequent predictions

## Development Workflow

```
1. Code Move Contract → packages/move/amm/sources/
2. Write Tests → sui move test
3. Deploy Local → task deploy:localnet
4. Auto-Generate Types → move-deployer
5. Update Frontend → apps/web/src/
6. Test E2E → bun test tests/e2e
7. Deploy Testnet → task deploy:testnet
8. Audit → External security review
9. Deploy Mainnet → task deploy:mainnet
```

## Deployment Architecture

### Local Development

```
Docker Compose:
  - sui-node (local Sui network)
  - api (Elysia backend)
  - web (Next.js dev server)
  - postgres (state DB)
  - redis (cache)
```

### Production

```
Vercel (Frontend) → Cloudflare (CDN)
       ↓
AWS ECS (API) → RDS (Postgres) → ElastiCache (Redis)
       ↓
Sui Mainnet RPC
       ↓
Walrus Storage / Nautilus TEE
```

## Monitoring & Observability

### Metrics

- Transaction success rate
- AI inference latency
- TEE attestation failures
- Gas consumption
- User activity

### Logging

```typescript
import { createLogger } from "@bun-move/core";

const logger = createLogger("AMM");
logger.info("Swap executed", { pool, amountIn, amountOut });
```

### Alerts

- Contract upgrade proposals
- Abnormal gas spikes
- TEE attestation failures
- High slippage events

## Future Architecture

### Phase 2+

- **Sharding**: Multiple pool instances
- **Cross-Chain**: Bridge to other chains
- **L2 Integration**: Sui-native rollups
- **Advanced AI**: Federated learning across TEEs

## References

- [Sui Architecture](https://docs.sui.io/learn/sui-architecture)
- [Move Language Design](https://move-language.github.io/move/)
- [Walrus Technical Whitepaper](https://docs.walrus.site)
- [Nautilus TEE Documentation](https://nautilus.sui.io)
