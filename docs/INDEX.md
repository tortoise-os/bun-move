# TortoiseOS bun-move Documentation Index

**Last Updated**: 2025-11-01
**Repository**: bun-move
**Purpose**: Foundation framework for TortoiseOS DeFi projects on Sui blockchain

---

## 📖 Documentation Structure

This repository uses a structured documentation approach with:
- **Timestamps** for versioning
- **Clear deprecation** markers
- **Organized by type** (architecture, guides, operations, etc.)
- **Package-specific docs** in package directories

---

## 📂 Directory Organization

### Root Documentation (`/docs`)
```
docs/
├── INDEX.md          # This file - documentation index
├── README.md         # Documentation overview
├── current/          # Active, current documentation
├── archive/          # Historical/deprecated docs (timestamped)
├── guides/           # How-to guides and tutorials
├── architecture/     # Architecture Decision Records (ADRs)
├── operations/       # Operational guides (deployment, monitoring)
└── roadmaps/         # Product roadmaps and planning
```

### Package Documentation
Each package has its own `/docs` or README:
```
packages/[package]/
├── README.md         # Package documentation
└── CHANGELOG.md      # Version history
```

---

## 📚 Current Documentation

### Getting Started
| Document | Location | Description | Status |
|----------|----------|-------------|--------|
| [GETTING_STARTED.md](./current/GETTING_STARTED.md) | current/ | Quick start guide for new developers | ✅ CURRENT |
| [QUICK-START.md](./guides/QUICK-START.md) | guides/ | Fast setup instructions | ✅ CURRENT |
| [DEVELOPMENT.md](./current/DEVELOPMENT.md) | current/ | Development environment setup | ✅ CURRENT |
| [PROJECT-STATUS.md](./current/PROJECT-STATUS.md) | current/ | Current project status | ✅ CURRENT |

### Architecture
| Document | Location | Description | Status |
|----------|----------|-------------|--------|
| [ARCHITECTURE.md](./architecture/ARCHITECTURE.md) | architecture/ | System architecture overview | ✅ CURRENT |
| [ECOSYSTEM_SUMMARY.md](./architecture/ECOSYSTEM_SUMMARY.md) | architecture/ | TortoiseOS ecosystem architecture | ✅ CURRENT |

### Package Management
| Document | Location | Description | Status |
|----------|----------|-------------|--------|
| [PACKAGE_STRUCTURE_FINAL.md](./current/PACKAGE_STRUCTURE_FINAL.md) | current/ | Package naming and organization rules | ✅ CURRENT |
| [PACKAGE_NAMING_ENFORCEMENT.md](./operations/PACKAGE_NAMING_ENFORCEMENT.md) | operations/ | Automated enforcement system | ✅ CURRENT |
| [QUICK_START_NAMING.md](./guides/QUICK_START_NAMING.md) | guides/ | Quick reference for package naming | ✅ CURRENT |

### Publishing
| Document | Location | Description | Status |
|----------|----------|-------------|--------|
| [PUBLISHING_GUIDE.md](./operations/PUBLISHING_GUIDE.md) | operations/ | Comprehensive publishing guide | ✅ CURRENT |
| [PUBLISHING_QUICKSTART.md](./guides/PUBLISHING_QUICKSTART.md) | guides/ | Quick publishing reference | ✅ CURRENT |
| [PUBLISHING.md](./operations/PUBLISHING.md) | operations/ | Publishing operations | ✅ CURRENT |

### Testing
| Document | Location | Description | Status |
|----------|----------|-------------|--------|
| [E2E-TESTING-GUIDE.md](./guides/E2E-TESTING-GUIDE.md) | guides/ | End-to-end testing guide | ✅ CURRENT |
| [CLI-TESTING-GUIDE.md](./guides/CLI-TESTING-GUIDE.md) | guides/ | CLI testing guide | ✅ CURRENT |

### Templates & Tooling
| Document | Location | Description | Status |
|----------|----------|-------------|--------|
| [TEMPLATES_AND_VALIDATION.md](./current/TEMPLATES_AND_VALIDATION.md) | current/ | Template system and validation | ✅ CURRENT |

### Platform-Specific
| Document | Location | Description | Status |
|----------|----------|-------------|--------|
| [APPLE-SILICON.md](./guides/APPLE-SILICON.md) | guides/ | Apple Silicon setup guide | ✅ CURRENT |

---

## 🗄️ Archived Documentation

Historical documentation in `/docs/archive/` (timestamped):

| Date | Document | Reason |
|------|----------|--------|
| 2025-11-01 | [PACKAGE_CONSOLIDATION_COMPLETE.md](./archive/2025-11-01_PACKAGE_CONSOLIDATION_COMPLETE.md) | Historical record of package consolidation |
| 2025-11-01 | [PACKAGE_CATALOG.md](./archive/2025-11-01_PACKAGE_CATALOG.md) | Replaced by structured package docs |
| 2025-11-01 | [IMPLEMENTATION_COMPLETE.md](./archive/2025-11-01_IMPLEMENTATION_COMPLETE.md) | Historical milestone document |
| 2025-11-01 | [VERIFICATION_AND_STRATEGY.md](./archive/2025-11-01_VERIFICATION_AND_STRATEGY.md) | Historical verification report |
| 2025-11-01 | [ANSWER_TO_VERIFICATION.md](./archive/2025-11-01_ANSWER_TO_VERIFICATION.md) | Historical verification Q&A |

---

## 📦 Package-Specific Documentation

### @tortoise-os/create-bun-move
- **README**: `packages/create-bun-move/README.md` - CLI usage and features
- **CHANGELOG**: `packages/create-bun-move/CHANGELOG.md` - Version history
- **Templates**: `packages/create-bun-move/templates/README.md` - Template docs

### @tortoise-os/core
- **README**: `packages/core/README.md` - Core utilities documentation

### @tortoise-os/sdk
- **README**: `packages/sdk/README.md` - SDK documentation

### @tortoise-os/ui
- **README**: `packages/ui/README.md` - UI components documentation

---

## 🏷️ Documentation Conventions

### Timestamps
All timestamped documentation uses format: `YYYY-MM-DD_FILENAME.md`

Example: `2025-11-01_PACKAGE_CONSOLIDATION_COMPLETE.md`

### Status Markers
- ✅ **CURRENT** - Active, up-to-date documentation
- ⚠️ **DEPRECATED** - No longer accurate, kept for history
- 🔄 **ARCHIVED** - Historical record, not for current use
- 📝 **DRAFT** - Work in progress

### Linking
Always use relative paths:
```markdown
[Architecture Guide](./architecture/ARCHITECTURE.md)
[Package Rules](./current/PACKAGE_STRUCTURE_FINAL.md)
```

---

## 🔍 Finding Documentation

### By Topic

**Getting Started**
- New developer? → [GETTING_STARTED.md](./current/GETTING_STARTED.md)
- Quick setup? → [QUICK-START.md](./guides/QUICK-START.md)
- Development environment? → [DEVELOPMENT.md](./current/DEVELOPMENT.md)

**Architecture**
- System design? → [ARCHITECTURE.md](./architecture/ARCHITECTURE.md)
- Ecosystem overview? → [ECOSYSTEM_SUMMARY.md](./architecture/ECOSYSTEM_SUMMARY.md)

**Package Management**
- Naming rules? → [PACKAGE_STRUCTURE_FINAL.md](./current/PACKAGE_STRUCTURE_FINAL.md)
- Quick reference? → [QUICK_START_NAMING.md](./guides/QUICK_START_NAMING.md)
- Enforcement? → [PACKAGE_NAMING_ENFORCEMENT.md](./operations/PACKAGE_NAMING_ENFORCEMENT.md)

**Publishing**
- Full guide? → [PUBLISHING_GUIDE.md](./operations/PUBLISHING_GUIDE.md)
- Quick reference? → [PUBLISHING_QUICKSTART.md](./guides/PUBLISHING_QUICKSTART.md)

**Testing**
- E2E tests? → [E2E-TESTING-GUIDE.md](./guides/E2E-TESTING-GUIDE.md)
- CLI tests? → [CLI-TESTING-GUIDE.md](./guides/CLI-TESTING-GUIDE.md)

**Templates**
- Template system? → [TEMPLATES_AND_VALIDATION.md](./current/TEMPLATES_AND_VALIDATION.md)

**Historical**
- Past decisions? → [/docs/archive/](./archive/)

### By Directory

- **`current/`** (5 files) - Active documentation for core concepts
- **`guides/`** (6 files) - Step-by-step how-to guides
- **`architecture/`** (2 files) - Architecture and design docs
- **`operations/`** (3 files) - Publishing, deployment, enforcement
- **`archive/`** (5 files) - Historical documents with timestamps
- **`roadmaps/`** (0 files) - Future planning (empty for now)

---

## 📝 Contributing Documentation

### Creating New Documentation

1. **Determine type** (guide, architecture, operations, roadmap)
2. **Place in appropriate directory**:
   - Current active docs → `/docs/current/`
   - How-to guides → `/docs/guides/`
   - Architecture → `/docs/architecture/`
   - Operations → `/docs/operations/`
   - Roadmaps → `/docs/roadmaps/`
3. **Add timestamp if appropriate** (for versioned content)
4. **Update this INDEX.md**
5. **Add status marker** (CURRENT, DRAFT, etc.)

### Deprecating Documentation

1. **Move to `/docs/archive/`** with timestamp prefix
2. **Add deprecation marker** to title (🔄 ARCHIVED)
3. **Update INDEX.md** to mark as archived
4. **Add link to replacement** document if applicable
5. **Update any documents** that link to the deprecated doc

### Updating Documentation

1. **Update the document**
2. **Update "Last Updated"** timestamp in document header
3. **If major changes**, consider creating new timestamped version
4. **Update INDEX.md** if file moved or renamed

---

## 🔗 Quick Links

### Essential Reading
- 📘 [Getting Started](./current/GETTING_STARTED.md)
- 📦 [Package Structure Rules](./current/PACKAGE_STRUCTURE_FINAL.md)
- ⚡ [Quick Start Naming](./guides/QUICK_START_NAMING.md)
- 🎯 [Project Status](./current/PROJECT-STATUS.md)

### For Contributors
- 💻 [Development Setup](./current/DEVELOPMENT.md)
- 🧪 [Testing Guides](./guides/)
- 📤 [Publishing Guide](./operations/PUBLISHING_GUIDE.md)

### For Maintainers
- 🏗️ [Architecture](./architecture/ARCHITECTURE.md)
- 🔒 [Package Naming Enforcement](./operations/PACKAGE_NAMING_ENFORCEMENT.md)
- 📋 [Template System](./current/TEMPLATES_AND_VALIDATION.md)

---

## 📧 Documentation Maintainers

For questions or suggestions about documentation:
- Create an issue with `[docs]` prefix
- Tag: `documentation`
- Repository: [tortoise-os/bun-move](https://github.com/tortoise-os/bun-move)

---

## 🚀 TortoiseOS Ecosystem

This is the **foundation repository**. For product-specific documentation:
- **Carapace** (AMM/DEX): `../carapace/docs/INDEX.md`
- **Hatch** (Trading): `../hatch/docs/INDEX.md`
- **Turtle-net** (Network): `../turtle-net/docs/INDEX.md`

---

## 📊 Documentation Statistics

- **Total Documents**: 21 files
- **Current/Active**: 11 files
- **Guides**: 6 files
- **Architecture**: 2 files
- **Operations**: 3 files
- **Archived**: 5 files
- **Last Organized**: 2025-11-01

---

**Navigation**: [Home](../README.md) | [Current](./current/) | [Guides](./guides/) | [Architecture](./architecture/) | [Operations](./operations/) | [Archive](./archive/)

**Last Updated**: 2025-11-01
