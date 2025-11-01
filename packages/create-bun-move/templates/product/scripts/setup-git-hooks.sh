#!/usr/bin/env bash
set -euo pipefail

# Setup Git Hooks for TortoiseOS Package Name Validation
# This script installs git hooks to validate package names before commits

COLOR_RESET='\033[0m'
COLOR_GREEN='\033[0;32m'
COLOR_YELLOW='\033[1;33m'
COLOR_BLUE='\033[0;34m'

print_header() {
    echo -e "${COLOR_BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${COLOR_RESET}"
    echo -e "${COLOR_BLUE}  $1${COLOR_RESET}"
    echo -e "${COLOR_BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${COLOR_RESET}"
}

print_success() {
    echo -e "${COLOR_GREEN}✓${COLOR_RESET} $1"
}

print_info() {
    echo -e "${COLOR_BLUE}ℹ${COLOR_RESET} $1"
}

# Get the script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

# Repos to setup
REPOS=(
    "${REPO_ROOT}"
    "${REPO_ROOT}/../carapace"
    "${REPO_ROOT}/../hatch"
    "${REPO_ROOT}/../turtle-net"
)

# Pre-commit hook content
read -r -d '' PRE_COMMIT_HOOK << 'EOF' || true
#!/usr/bin/env bash
# TortoiseOS Package Name Validation Hook
# This hook validates package.json names before allowing commits

# Get changed package.json files
CHANGED_PACKAGES=$(git diff --cached --name-only --diff-filter=ACM | grep 'package.json$' || true)

if [ -z "$CHANGED_PACKAGES" ]; then
    exit 0
fi

echo "🔍 Validating package names..."

# Find bun-move directory
CURRENT_DIR=$(pwd)
BUN_MOVE_DIR=""

# Try to find bun-move
if [ -f "./scripts/validate-package-names.ts" ]; then
    BUN_MOVE_DIR="."
elif [ -f "../bun-move/scripts/validate-package-names.ts" ]; then
    BUN_MOVE_DIR="../bun-move"
elif [ -f "../../bun-move/scripts/validate-package-names.ts" ]; then
    BUN_MOVE_DIR="../../bun-move"
else
    echo "⚠️  Warning: Could not find bun-move validation script"
    echo "   Skipping package name validation"
    exit 0
fi

# Validate each changed package.json
HAS_ERROR=0
for PACKAGE in $CHANGED_PACKAGES; do
    if [ -f "$PACKAGE" ]; then
        if ! bun "${BUN_MOVE_DIR}/scripts/validate-package-names.ts" --check "$PACKAGE" 2>&1; then
            HAS_ERROR=1
        fi
    fi
done

if [ $HAS_ERROR -eq 1 ]; then
    echo ""
    echo "❌ Package name validation failed!"
    echo "   Please fix the package naming issues above before committing."
    echo ""
    echo "   See docs/PACKAGE_STRUCTURE_FINAL.md for naming conventions."
    echo ""
    exit 1
fi

echo "✅ All package names are valid"
exit 0
EOF

# Install hook for a repository
install_hook() {
    local repo=$1
    local repo_name=$(basename "$repo")

    if [ ! -d "$repo/.git" ]; then
        print_info "Skipping $repo_name (not a git repository)"
        return
    fi

    local hook_file="$repo/.git/hooks/pre-commit"
    local backup_file="$repo/.git/hooks/pre-commit.backup"

    # Backup existing hook if it exists
    if [ -f "$hook_file" ]; then
        if ! grep -q "TortoiseOS Package Name Validation" "$hook_file"; then
            cp "$hook_file" "$backup_file"
            print_info "Backed up existing pre-commit hook to pre-commit.backup"
        fi
    fi

    # Install new hook
    echo "$PRE_COMMIT_HOOK" > "$hook_file"
    chmod +x "$hook_file"

    print_success "Installed pre-commit hook in $repo_name"
}

# Main
main() {
    print_header "Installing TortoiseOS Package Name Validation Hooks"
    echo ""

    for repo in "${REPOS[@]}"; do
        if [ -d "$repo" ]; then
            install_hook "$repo"
        fi
    done

    echo ""
    print_header "Installation Complete"
    echo ""
    echo "The following repositories now have package name validation:"
    for repo in "${REPOS[@]}"; do
        if [ -d "$repo/.git" ]; then
            echo "  ✓ $(basename "$repo")"
        fi
    done
    echo ""
    echo "When you commit changes to package.json files, they will be"
    echo "automatically validated against the naming conventions."
    echo ""
    print_info "To bypass validation (not recommended): git commit --no-verify"
}

main "$@"
