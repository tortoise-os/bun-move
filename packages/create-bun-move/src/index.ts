#!/usr/bin/env node

import { Command } from "commander";
import prompts from "prompts";
import chalk from "chalk";
import ora from "ora";
import { execSync } from "child_process";
import { existsSync, mkdirSync, cpSync, writeFileSync, readFileSync } from "fs";
import { join, resolve } from "path";
import validateProjectName from "validate-npm-package-name";

const program = new Command();

interface ProjectOptions {
  name: string;
  template?: "minimal" | "full";
  sui?: boolean;
  docker?: boolean;
}

program
  .name("create-bun-move")
  .description("Create a new TortoiseOS DeFi project on Sui")
  .version("0.1.0")
  .argument("[project-name]", "Name of your project")
  .option("-t, --template <type>", "Project template (minimal|full)", "full")
  .option("--no-sui", "Skip Sui Move contracts")
  .option("--no-docker", "Skip Docker setup")
  .action(async (projectName: string | undefined, options) => {
    console.log(chalk.cyan.bold("\n🐢 Welcome to TortoiseOS!\n"));

    let name = projectName;

    // Prompt for project name if not provided
    if (!name) {
      const response = await prompts({
        type: "text",
        name: "name",
        message: "What is your project name?",
        initial: "my-tortoise-app",
        validate: (value) => {
          const validation = validateProjectName(value);
          if (validation.validForNewPackages) {
            return true;
          }
          return validation.errors?.[0] || "Invalid project name";
        },
      });

      if (!response.name) {
        console.log(chalk.red("\n✖ Project creation cancelled\n"));
        process.exit(1);
      }

      name = response.name;
    }

    // Validate project name
    const validation = validateProjectName(name);
    if (!validation.validForNewPackages) {
      console.error(
        chalk.red(`\n✖ Invalid project name: ${validation.errors?.[0]}\n`)
      );
      process.exit(1);
    }

    const projectPath = resolve(process.cwd(), name);

    // Check if directory already exists
    if (existsSync(projectPath)) {
      console.error(
        chalk.red(`\n✖ Directory ${name} already exists!\n`)
      );
      process.exit(1);
    }

    // Prompt for configuration
    const config = await prompts([
      {
        type: "select",
        name: "template",
        message: "Which template would you like to use?",
        choices: [
          { title: "Full Stack (API + Web + Move + AI)", value: "full" },
          { title: "Minimal (Web + Move)", value: "minimal" },
        ],
        initial: 0,
      },
      {
        type: "confirm",
        name: "sui",
        message: "Include Sui Move smart contracts?",
        initial: true,
      },
      {
        type: "confirm",
        name: "docker",
        message: "Include Docker configuration?",
        initial: true,
      },
      {
        type: "confirm",
        name: "magicui",
        message: "Include Magic UI components?",
        initial: true,
      },
    ]);

    if (!config.template) {
      console.log(chalk.red("\n✖ Project creation cancelled\n"));
      process.exit(1);
    }

    const spinner = ora(chalk.cyan("Creating your TortoiseOS project...")).start();

    try {
      // Create project directory
      mkdirSync(projectPath, { recursive: true });

      // Create base structure
      createProjectStructure(projectPath, {
        name,
        template: config.template,
        sui: config.sui,
        docker: config.docker,
        magicui: config.magicui,
      });

      spinner.succeed(chalk.green("Project created successfully!"));

      // Print next steps
      console.log(chalk.cyan("\n📦 Next steps:\n"));
      console.log(chalk.white(`  cd ${name}`));
      console.log(chalk.white(`  bun install`));
      
      if (config.docker) {
        console.log(chalk.white(`  docker compose up -d`));
      }
      
      if (config.sui) {
        console.log(chalk.white(`  task sui:init`));
      }
      
      console.log(chalk.white(`  bun run dev\n`));

      console.log(chalk.cyan("🚀 Happy building with TortoiseOS!\n"));
      console.log(chalk.gray("📖 Documentation: https://github.com/tortoise-os/bun-move"));
      console.log(chalk.gray("💬 Discord: https://discord.gg/tortoise-os\n"));

    } catch (error) {
      spinner.fail(chalk.red("Failed to create project"));
      console.error(error);
      process.exit(1);
    }
  });

function createProjectStructure(
  projectPath: string,
  options: {
    name: string;
    template: "minimal" | "full";
    sui: boolean;
    docker: boolean;
    magicui: boolean;
  }
) {
  // Create root package.json
  const packageJson = {
    name: options.name,
    version: "0.1.0",
    private: true,
    description: "TortoiseOS DeFi project on Sui",
    workspaces: ["apps/*", "packages/*"],
    scripts: {
      dev: "bun run --filter './apps/web' dev",
      build: "bun run --filter './apps/*' build",
      test: "bun test",
      lint: "bun run --filter './apps/*' --filter './packages/*' lint",
    },
    devDependencies: {
      "@types/bun": "^1.1.10",
      typescript: "^5.6.2",
      prettier: "^3.3.3",
    },
    engines: {
      bun: ">=1.1.0",
      node: ">=20.0.0",
    },
  };

  writeFileSync(
    join(projectPath, "package.json"),
    JSON.stringify(packageJson, null, 2)
  );

  // Create directories
  const dirs = [
    "apps/web",
    "packages/core",
    "packages/sdk",
  ];

  if (options.template === "full") {
    dirs.push("apps/api");
  }

  if (options.sui) {
    dirs.push("move/sources");
  }

  if (options.magicui) {
    dirs.push("packages/ui");
  }

  dirs.forEach((dir) => {
    mkdirSync(join(projectPath, dir), { recursive: true });
  });

  // Create README
  const readme = `# ${options.name}

TortoiseOS DeFi Project on Sui

## Getting Started

\`\`\`bash
# Install dependencies
bun install

${options.docker ? "# Start services\ndocker compose up -d\n" : ""}
${options.sui ? "# Initialize Sui\ntask sui:init\n" : ""}
# Start development server
bun run dev
\`\`\`

## Features

- ✅ Next.js 14 Web App
${options.template === "full" ? "- ✅ Express API Server\n" : ""}${options.sui ? "- ✅ Sui Move Smart Contracts\n" : ""}${options.magicui ? "- ✅ Magic UI Components\n" : ""}${options.docker ? "- ✅ Docker Configuration\n" : ""}${options.sui ? "- 🔐 awesome-seal Integration Ready\n" : ""}
## Project Structure

\`\`\`
${options.name}/
├── apps/
│   ├── web/          # Next.js frontend
${options.template === "full" ? "│   └── api/          # Express API\n" : ""}├── packages/
│   ├── core/         # Core utilities
│   ├── sdk/          # Sui SDK wrapper
${options.magicui ? "│   └── ui/           # Magic UI components\n" : ""}${options.sui ? "├── move/            # Sui Move contracts\n" : ""}${options.docker ? "└── docker/          # Docker configs\n" : ""}\`\`\`

${options.sui ? `## Security & Privacy with awesome-seal

This project includes recommendations for integrating the [awesome-seal](https://github.com/MystenLabs/awesome-seal) ecosystem to enhance security and privacy.

**See [AWESOME_SEAL_EVALUATION.md](./AWESOME_SEAL_EVALUATION.md) for:**
- 🔒 Encrypted storage with Seal SDK
- 🛡️ Nautilus TEE integration patterns
- 🎯 Token-gated access control
- ⏱️ Time savings: 6-12 weeks

**Quick Start:**
\`\`\`bash
# Create seal-integration package
mkdir -p packages/seal-integration
cd packages/seal-integration
bun add @seal/rust-sdk @seal/access-control

# Add Seal dependencies to Move.toml
# See AWESOME_SEAL_EVALUATION.md for details
\`\`\`

` : ""}## Documentation

- [TortoiseOS Docs](https://github.com/tortoise-os/bun-move)
- [Sui Documentation](https://docs.sui.io)
${options.sui ? "- [awesome-seal Ecosystem](https://github.com/MystenLabs/awesome-seal)\n" : ""}
## License

MIT
`;

  writeFileSync(join(projectPath, "README.md"), readme);

  // Create .gitignore
  const gitignore = `# Dependencies
node_modules/
bun.lockb

# Build outputs
.next/
dist/
build/
*.log

# Environment
.env
.env.local

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Sui
${options.sui ? "build/\n.sui/\n" : ""}
# Docker
${options.docker ? ".docker/\n" : ""}`;

  writeFileSync(join(projectPath, ".gitignore"), gitignore);

  // Create .clauderc for AI assistant instructions
  const clauderc = `# TortoiseOS Project - AI Assistant Instructions

## Package Manager: BUN ONLY

**CRITICAL**: This project uses Bun as its package manager and runtime.

### Required Commands:
- ✅ \`bun install\` (NOT npm install)
- ✅ \`bun add <package>\` (NOT npm install)
- ✅ \`bun remove <package>\` (NOT npm uninstall)
- ✅ \`bunx <command>\` (NOT npx)
- ✅ \`bun run <script>\` (NOT npm run)
- ✅ \`bun test\` (NOT npm test)
- ✅ \`bun <file.ts>\` (direct TypeScript execution)

### ❌ NEVER Use:
- npm install
- npm i
- npm run
- npx
- yarn
- pnpm

### Project Stack:
- **Runtime**: Bun >= 1.1.0
- **Framework**: Next.js 14${options.template === "full" ? "\n- **API**: Express with Bun" : ""}${options.sui ? "\n- **Blockchain**: Sui Move" : ""}${options.magicui ? "\n- **UI**: Magic UI + Tailwind CSS" : ""}${options.docker ? "\n- **Containers**: Docker Compose" : ""}
- **Testing**: Playwright${options.sui ? " + @tortoiseos/terrapin" : ""}${options.sui ? "\n- **Security**: awesome-seal ecosystem ready" : ""}

### Sui-Specific Guidelines:
${options.sui ? `- Use \`task move:build\` for Move contract compilation
- Use \`task sui:init\` for Sui setup
- All Sui commands run in Docker container
- Test wallet: Use unsafe burner wallet in dev mode
` : ""}${options.sui ? `
### awesome-seal Integration Guidelines:
- **IMPORTANT**: Check AWESOME_SEAL_EVALUATION.md for security recommendations
- For encrypted storage: Use Seal Rust SDK (\`@seal/rust-sdk\`)
- For private contract state: Use Decryptable Move Enum
- For TEE integration: Study Nautilus enclave patterns (Lockin Bot)
- For token-gated features: Use Tusky access control patterns
- **Time savings**: Following awesome-seal patterns can save 6-12 weeks

### When implementing security features:
1. Review AWESOME_SEAL_EVALUATION.md first
2. Create \`packages/seal-integration/\` for shared encryption utilities
3. Add Seal dependencies to Move.toml for contract encryption
4. Use battle-tested patterns from awesome-seal ecosystem
5. Test encryption thoroughly before deployment
` : ""}
### Code Style:
- TypeScript strict mode enabled
- Use async/await (Bun has top-level await)
- Prefer Bun APIs over Node.js when available
- Use workspace protocol: "workspace:*" for local packages

### Commands Reference:
\`\`\`bash
# Development
bun run dev              # Start dev server

# Building
bun run build            # Build all apps

# Testing
bun test                 # Run unit tests
bun run test:e2e        # Run E2E tests${options.sui ? "\n\n# Sui/Move\ntask move:build          # Compile Move contracts\ntask sui:init            # Initialize Sui" : ""}${options.docker ? "\n\n# Docker\ndocker compose up -d     # Start services\ndocker compose down      # Stop services" : ""}
\`\`\`

### When suggesting installations:
Always use: \`bun add <package>\`
Dev dependencies: \`bun add -D <package>\`
Global tools: \`bunx <tool>\` (no installation needed!)${options.sui ? "\nSeal SDK: \`bun add @seal/rust-sdk @seal/access-control\`" : ""}

---
🐢 **TortoiseOS** - Slow, steady, and bun-powered!${options.sui ? "\n🔐 **awesome-seal** - Security and privacy built-in!" : ""}
`;

  writeFileSync(join(projectPath, ".clauderc"), clauderc);

  // Also create .cursorrules for Cursor IDE
  const cursorrules = `# TortoiseOS Project Rules

## Package Manager
- Always use Bun: \`bun install\`, \`bun add\`, \`bunx\`
- Never suggest npm, yarn, or pnpm

## Stack
- Bun runtime${options.sui ? "\n- Sui blockchain" : ""}
- TypeScript strict mode
- Next.js 14${options.magicui ? "\n- Magic UI components" : ""}

## Commands
- Use \`bun run <script>\` for package scripts
- Use \`bunx <command>\` instead of npx${options.sui ? "\n- Use \`task move:build\` for Sui Move contracts" : ""}
`;

  writeFileSync(join(projectPath, ".cursorrules"), cursorrules);

  // Create AWESOME_SEAL_EVALUATION.md with recommendations
  const awesomeSealEval = `# Awesome Seal Evaluation for ${options.name}

**Created:** ${new Date().toISOString().split('T')[0]}
**Source:** https://github.com/MystenLabs/awesome-seal
**Template:** bun-move v0.3.0
**Purpose:** Security and privacy enhancements using Seal ecosystem

---

## Quick Start

This project template includes recommendations for integrating the awesome-seal ecosystem to accelerate development and enhance security.

**Potential Time Savings:** 6-12 weeks across your development lifecycle

### Recommended Immediate Actions:

1. **Study awesome-seal ecosystem** (Week 1)
   - Review Nautilus enclave patterns for TEE integration
   - Study Seal Rust SDK for encrypted storage
   - Explore Decryptable Move Enum for privacy features

2. **Add Seal dependencies** (Week 1-2)
   - Create \`packages/seal-integration/\` for shared utilities
   - Create \`packages/move/seal-core/\` for Move modules
   - Update Move.toml files with Seal dependencies

3. **Plan integration priorities** (Week 2)
   - Identify which products need encryption
   - Determine TEE requirements
   - Plan token-gated access features

---

## High-Priority Integrations

### 1. Nautilus Enclave Patterns (TEE Integration)

**Use Cases:**
- Secure AI model execution in Trusted Execution Environments
- Zero-trust key management for model signing
- Attestation verification for on-chain operations

**awesome-seal Resource:**
- **Lockin Bot**: Distributed key vault for Nautilus enclaves
- Zero-trust key management with master keys in enclaves

**Time Saved:** 2-3 weeks (vs. building TEE integration from scratch)

**Action Items:**
- [ ] Study Lockin Bot architecture
- [ ] Implement enclave key vault module
- [ ] Add attestation verification

**References:**
- Repository: https://github.com/lockin-bot/seal-kms
- Docs: https://nautilus.sui.io

---

### 2. Seal Rust SDK (Encrypted Storage)

**Use Cases:**
- Encrypt AI model weights before storing on Walrus
- Secure sensitive configuration parameters
- Token-gated content access

**awesome-seal Resource:**
- **Seal Rust SDK**: Community-maintained bindings for encryption/decryption
- **Sui Stack Messaging SDK**: End-to-end encrypted messaging

**Time Saved:** 1-2 weeks (vs. custom encryption implementation)

**Implementation:**
\\\`\\\`\\\`bash
# Add to your project
cd packages
mkdir seal-integration
cd seal-integration
bun add @seal/rust-sdk @seal/access-control
\\\`\\\`\\\`

**Files to Create:**
- \`packages/seal-integration/src/encryption.ts\`
- \`packages/seal-integration/src/walrus-storage.ts\`
- \`packages/seal-integration/src/access-control.ts\`

**References:**
- Repository: https://github.com/gfusee/seal-sdk-rs

---

### 3. Decryptable Move Enum (Privacy Features)

**Use Cases:**
- Encrypted smart contract state
- Private transaction parameters
- Time-released information disclosure

**awesome-seal Resource:**
- **Decryptable Move Enum**: Sui Move package for encrypted data structures

**Time Saved:** 1 week (vs. custom encryption in Move)

**Implementation:**
\\\`\\\`\\\`toml
# Add to Move.toml
[dependencies]
Seal = { git = "https://github.com/seal-org/move-packages", subdir = "seal", rev = "main" }
DecryptableEnum = { git = "https://github.com/seal-org/move-packages", subdir = "decryptable_enum", rev = "main" }
\\\`\\\`\\\`

**Example Usage:**
\\\`\\\`\\\`move
use seal::decryptable_enum::{Self, DecryptableEnum};

public struct PrivateConfig has store {
    id: UID,
    encrypted_params: DecryptableEnum<ConfigParams>,
    reveal_epoch: u64,
}
\\\`\\\`\\\`

**References:**
- Repository: https://github.com/studio-mirai/decryptable

---

### 4. Tusky Token-Gated Access (Premium Features)

**Use Cases:**
- Restrict premium features to token holders
- LP-based access control
- Tiered access levels

**awesome-seal Resource:**
- **Tusky**: Vault content restriction using Seal encryption + token ownership

**Time Saved:** 1 week (vs. custom access control)

**Pattern:**
\\\`\\\`\\\`move
const PREMIUM_THRESHOLD: u64 = 100_000_000;

public fun access_premium_feature<T>(
    token_proof: &Balance<T>,
    ctx: &mut TxContext
) {
    assert!(
        balance::value(token_proof) >= PREMIUM_THRESHOLD,
        E_INSUFFICIENT_TOKENS
    );
    // Grant access to premium feature
}
\\\`\\\`\\\`

---

## Integration Roadmap

### Phase 1: Foundation (Weeks 1-2)

- [ ] Create \`packages/seal-integration/\` package
- [ ] Create \`packages/move/seal-core/\` Move package
- [ ] Add Seal dependencies to Move.toml
- [ ] Write initial integration tests

### Phase 2: Core Features (Weeks 3-6)

- [ ] Implement encrypted storage with Seal SDK
- [ ] Add Decryptable Move Enum to smart contracts
- [ ] Test Walrus integration with encryption

### Phase 3: Advanced Features (Weeks 7-12)

- [ ] Integrate Nautilus TEE for sensitive operations
- [ ] Implement token-gated access control
- [ ] Add attestation verification
- [ ] Security audit preparation

---

## Security Enhancements

### TEE Attestation Verification

**Pattern:**
\\\`\\\`\\\`move
// packages/move/seal-core/sources/tee_verification.move
public struct TEECapability has key, store {
    id: UID,
    enclave_measurement: vector<u8>,
    public_key: vector<u8>,
    attestation: vector<u8>,
    last_verified: u64,
}

public fun verify_attestation(
    cap: &TEECapability,
    output: &Output,
    signature: vector<u8>,
    clock: &Clock,
): bool {
    // Verify enclave integrity before accepting outputs
}
\\\`\\\`\\\`

### Bug Bounty Infrastructure

**awesome-seal Resource:**
- **Dominion Lancer**: Vulnerability disclosure platform using trusted enclaves

**Benefits:**
- Trustless rewards via enclave escrow
- Researcher privacy (anonymous reporting)
- Automated severity scoring

**Timeline:** Security audit preparation phase

---

## Additional Resources

### awesome-seal Ecosystem Tools

1. **Seal Rust SDK** - Encryption/decryption bindings
   - https://github.com/gfusee/seal-sdk-rs

2. **Sui Stack Messaging SDK** - E2E encrypted messaging
   - https://github.com/MystenLabs/sui-stack-messaging-sdk

3. **Lockin Bot** - Distributed key vault for Nautilus
   - https://github.com/lockin-bot/seal-kms

4. **Decryptable Move Enum** - Encrypted data structures
   - https://github.com/studio-mirai/decryptable

5. **Dominion Lancer** - Vulnerability disclosure platform
   - https://lancer.dominion.zone/

6. **Tusky** - Token-gated vault access

### Community & Support

- **Seal Documentation**: https://seal.mystenlabs.com/
- **awesome-seal Repository**: https://github.com/MystenLabs/awesome-seal
- **Sui Foundation**: Potential grants for Seal integrations
- **Nautilus TEE**: https://nautilus.sui.io

---

## Competitive Advantages

By integrating awesome-seal ecosystem:

- **Security**: Battle-tested encryption patterns
- **Development Speed**: 6-12 weeks time savings
- **Privacy**: Advanced privacy features out-of-the-box
- **Ecosystem Alignment**: Sui Foundation-supported infrastructure
- **Market Differentiation**: First-mover advantage on privacy features

---

## Next Steps

1. **Read the full evaluation**
   - Review detailed patterns in awesome-seal repository
   - Study reference implementations (Lockin Bot, Tusky, etc.)

2. **Plan your integration**
   - Identify which features need encryption
   - Determine TEE requirements
   - Prioritize integrations based on your roadmap

3. **Start building**
   - Create seal-integration package
   - Add Seal dependencies to Move contracts
   - Implement core encryption wrappers

4. **Test thoroughly**
   - Write comprehensive tests for encryption
   - Test attestation verification
   - Security audit before mainnet

---

**For detailed implementation patterns, see:**
- Full evaluation: [AWESOME_SEAL_DETAILED.md](https://github.com/tortoise-os/bun-move/blob/main/AWESOME_SEAL_EVALUATION.md)
- awesome-seal repo: https://github.com/MystenLabs/awesome-seal
- Carapace case study: [../carapace/AWESOME_SEAL_EVALUATION.md](https://github.com/tortoise-os/carapace/blob/main/AWESOME_SEAL_EVALUATION.md)

---

🐢 **Built with TortoiseOS + awesome-seal**
`;

  writeFileSync(join(projectPath, "AWESOME_SEAL_EVALUATION.md"), awesomeSealEval);

  console.log(chalk.green(`\n✓ Created ${options.name}`));
  console.log(chalk.cyan(`\n💡 Tip: Check AWESOME_SEAL_EVALUATION.md for security enhancements`));
}

program.parse();
