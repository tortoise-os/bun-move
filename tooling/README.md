# Tooling

Clean architecture for bun-move tooling and automation scripts.

## Structure

```
tooling/
├── tasks/              # Taskfile task definitions (grouped by domain)
│   ├── setup.yml       # Installation and setup tasks
│   ├── dev.yml         # Development tasks
│   ├── build.yml       # Build tasks
│   ├── test.yml        # Testing tasks
│   ├── move.yml        # Move contract tasks
│   ├── deploy.yml      # Deployment tasks
│   ├── clean.yml       # Cleanup tasks
│   ├── packages.yml    # Package management tasks
│   ├── docs.yml        # Documentation tasks
│   ├── publishing.yml  # Publishing tasks
│   ├── hooks.yml       # Git hooks tasks
│   └── sui.yml         # Sui blockchain tasks
│
├── packages/           # Package management scripts
│   ├── create-package.ts
│   └── validate-names.ts
│
├── docs/               # Documentation scripts
│   └── organize-docs.sh
│
├── publishing/         # Publishing scripts
│   ├── publish-setup.sh
│   └── setup-product-publishing.sh
│
├── hooks/              # Git hooks
│   └── install-hooks.sh
│
├── sui/                # Sui blockchain scripts
│   └── start-local.sh
│
└── templates/          # Template management
    └── sync-templates.sh
```

## Usage

All tooling is accessed via the Taskfile task runner:

```bash
# List all available tasks
task --list-all

# Package management
task packages:create        # Create new package
task packages:validate      # Validate package names

# Documentation
task docs:organize          # Organize documentation
task docs:stats            # Show doc statistics

# Publishing
task publishing:setup       # Setup publishing
task publishing:dry-run     # Test publishing

# Git hooks
task hooks:install          # Install git hooks
task hooks:test            # Test git hooks

# Sui blockchain
task sui:local:start       # Start local Sui network
task sui:client:status     # Check Sui client status
```

## Clean Architecture Principles

1. **Domain Separation**: Scripts are organized by domain (packages, docs, publishing, etc.)
2. **Task-based Interface**: All operations exposed via Taskfile tasks
3. **Self-documenting**: Each task has a clear description
4. **Composability**: Tasks can call other tasks
5. **Environment-aware**: Uses .env files for configuration

## Adding New Tooling

### 1. Create the Script

Place your script in the appropriate domain directory:

```bash
# Example: New deployment script
tooling/deployment/deploy-to-testnet.ts
```

### 2. Create Task Definition

Create or update the corresponding task file:

```yaml
# tooling/tasks/deployment.yml
version: '3'

tasks:
  testnet:
    desc: Deploy to testnet
    dir: "{{.USER_WORKING_DIR}}/tooling/deployment"
    cmds:
      - bun run deploy-to-testnet.ts
```

### 3. Include in Main Taskfile

Add the include to the main Taskfile.yml:

```yaml
includes:
  deployment: ./tooling/tasks/deployment.yml
```

### 4. Document Usage

Update this README with usage examples.

## Benefits

- **Discoverability**: `task --list-all` shows all available operations
- **Consistency**: Same interface across all monorepos
- **Maintainability**: Clear separation of concerns
- **Portability**: Scripts are self-contained in tooling/
- **Documentation**: Task descriptions serve as inline docs

## Migration from scripts/

Old pattern:
```bash
./scripts/validate-package-names.ts
./scripts/organize-docs.sh
```

New pattern:
```bash
task packages:validate
task docs:organize
```

Benefits:
- Easier to discover commands
- Consistent interface
- Better documentation
- Composable workflows
- Environment handling

---

**Maintained by**: TortoiseOS Team
**Last Updated**: 2025-11-01
