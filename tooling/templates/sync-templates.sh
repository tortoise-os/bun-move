#!/usr/bin/env bash
set -euo pipefail

# Sync validation scripts and docs to create-bun-move templates
# Run this after updating validation scripts or documentation

COLOR_RESET='\033[0m'
COLOR_GREEN='\033[0;32m'
COLOR_BLUE='\033[0;34m'

print_success() {
    echo -e "${COLOR_GREEN}✓${COLOR_RESET} $1"
}

print_info() {
    echo -e "${COLOR_BLUE}ℹ${COLOR_RESET} $1"
}

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
TEMPLATE_DIR="${ROOT_DIR}/packages/create-bun-move/templates"

echo ""
echo "🔄 Syncing validation system to templates..."
echo ""

# Files to sync
SCRIPTS=(
    "validate-package-names.ts"
    "create-package.ts"
    "setup-git-hooks.sh"
)

WORKFLOWS=(
    "validate-package-names.yml"
)

DOCS=(
    "PACKAGE_STRUCTURE_FINAL.md"
    "PACKAGE_NAMING_ENFORCEMENT.md"
    "QUICK_START_NAMING.md"
)

# Sync to both templates
for template in "default" "product"; do
    print_info "Syncing to ${template} template..."

    # Sync scripts
    for script in "${SCRIPTS[@]}"; do
        cp "${SCRIPT_DIR}/${script}" "${TEMPLATE_DIR}/${template}/scripts/"
        print_success "  scripts/${script}"
    done

    # Sync workflows
    for workflow in "${WORKFLOWS[@]}"; do
        cp "${ROOT_DIR}/.github/workflows/${workflow}" "${TEMPLATE_DIR}/${template}/.github/workflows/"
        print_success "  .github/workflows/${workflow}"
    done

    # Sync docs
    for doc in "${DOCS[@]}"; do
        cp "${ROOT_DIR}/docs/${doc}" "${TEMPLATE_DIR}/${template}/docs/"
        print_success "  docs/${doc}"
    done

    echo ""
done

print_success "Template sync complete!"
echo ""
echo "Next steps:"
echo "  1. Test template generation: bun run packages/create-bun-move/src/index.ts test-project"
echo "  2. Rebuild package: cd packages/create-bun-move && bun run build"
echo "  3. Publish if needed: npm publish"
echo ""
