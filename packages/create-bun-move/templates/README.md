# TortoiseOS Project Templates

This directory contains templates for creating new TortoiseOS projects with built-in package naming validation.

## Templates

### `default/`
Foundation/monorepo template for `@tortoise-os` scoped packages.
- Pre-configured validation scripts
- Git hooks for package name enforcement
- GitHub Actions workflows
- Complete documentation

### `product/`
Product repository template for product-scoped packages (`@carapace`, `@hatch`, etc.).
- All validation tooling from default template
- Product-specific naming rules
- Documentation tailored for product development

## What's Included in Templates

### Validation Scripts (`scripts/`)
- `validate-package-names.ts` - Validates all package names
- `create-package.ts` - Interactive package creation wizard
- `setup-git-hooks.sh` - Installs git hooks for validation

### GitHub Actions (`.github/workflows/`)
- `validate-package-names.yml` - CI validation on PRs

### Documentation (`docs/`)
- `PACKAGE_STRUCTURE_FINAL.md` - Complete naming rules
- `PACKAGE_NAMING_ENFORCEMENT.md` - Enforcement details
- `QUICK_START_NAMING.md` - Quick reference guide

## Usage

These templates are automatically used by `create-bun-move`:

```bash
# Create a foundation project
bunx @tortoise-os/create-bun-move my-project

# Create a product project
bunx @tortoise-os/create-bun-move my-product --template product
```

## Template Customization

When a new project is created, the template files are copied and customized:
- Package names are updated
- Project-specific configuration is added
- Git hooks are automatically installed

##Maintenance

When updating validation rules:
1. Update `../../scripts/` in bun-move root
2. Run: `npm run sync-templates` to copy to templates
3. Test with a new project creation

---

**Part of TortoiseOS naming convention enforcement system**
