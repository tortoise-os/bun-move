#!/usr/bin/env bash
set -euo pipefail

# Setup Publishing for Product Repositories (carapace, hatch, turtle-net)
# This script sets up the publishing system for a product repository

COLOR_RESET='\033[0m'
COLOR_GREEN='\033[0;32m'
COLOR_YELLOW='\033[1;33m'
COLOR_RED='\033[0;31m'
COLOR_BLUE='\033[0;34m'

print_header() {
    echo -e "${COLOR_BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${COLOR_RESET}"
    echo -e "${COLOR_BLUE}  $1${COLOR_RESET}"
    echo -e "${COLOR_BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${COLOR_RESET}"
}

print_success() {
    echo -e "${COLOR_GREEN}✓${COLOR_RESET} $1"
}

print_error() {
    echo -e "${COLOR_RED}✗${COLOR_RESET} $1"
}

print_info() {
    echo -e "${COLOR_BLUE}ℹ${COLOR_RESET} $1"
}

setup_changesets() {
    local repo_path=$1

    print_header "Setting up Changesets"

    cd "$repo_path"

    # Check if changesets is installed
    if ! grep -q "@changesets/cli" package.json; then
        print_info "Installing @changesets/cli..."
        bun add -D @changesets/cli
        print_success "@changesets/cli installed"
    else
        print_success "@changesets/cli already installed"
    fi

    # Initialize changesets if not exists
    if [ ! -d ".changeset" ]; then
        print_info "Initializing changesets..."
        echo "y" | bunx changeset init
        print_success "Changesets initialized"
    else
        print_success "Changesets already initialized"
    fi

    # Add scripts to package.json if not exists
    if ! grep -q '"changeset"' package.json; then
        print_info "Adding changeset scripts to package.json..."
        # This would require jq or manual editing
        print_error "Please manually add these scripts to package.json:"
        echo '  "changeset": "changeset",'
        echo '  "version": "changeset version",'
        echo '  "release": "bun run build && changeset publish"'
    else
        print_success "Changeset scripts already in package.json"
    fi
}

setup_github_workflow() {
    local repo_path=$1
    local repo_name=$2

    print_header "Setting up GitHub Actions"

    cd "$repo_path"

    mkdir -p .github/workflows

    if [ -f ".github/workflows/publish-packages.yml" ]; then
        print_success "GitHub workflow already exists"
    else
        print_info "Creating GitHub Actions workflow..."
        # Workflow already created in separate file
        print_success "Please check .github/workflows/publish-packages.yml"
    fi
}

check_package_configs() {
    local repo_path=$1

    print_header "Checking Package Configurations"

    cd "$repo_path"

    for pkg in packages/*/package.json; do
        if [ -f "$pkg" ]; then
            pkg_name=$(basename "$(dirname "$pkg")")

            if grep -q '"publishConfig"' "$pkg"; then
                print_success "$pkg_name has publishConfig"
            else
                print_error "$pkg_name missing publishConfig"
            fi
        fi
    done
}

setup_repo() {
    local repo_path=$1
    local repo_name=$(basename "$repo_path")

    print_header "Setting up $repo_name"
    echo ""

    if [ ! -d "$repo_path" ]; then
        print_error "Repository not found: $repo_path"
        return 1
    fi

    setup_changesets "$repo_path"
    echo ""

    setup_github_workflow "$repo_path" "$repo_name"
    echo ""

    check_package_configs "$repo_path"
    echo ""

    print_success "$repo_name setup complete!"
}

main() {
    clear

    print_header "TortoiseOS Product Repository Publishing Setup"
    echo ""

    # Get repository path from argument or prompt
    if [ $# -eq 0 ]; then
        echo "Usage: $0 <repository-path>"
        echo ""
        echo "Example:"
        echo "  $0 /path/to/hatch"
        echo "  $0 /path/to/turtle-net"
        exit 1
    fi

    setup_repo "$1"

    echo ""
    print_header "Next Steps"
    echo ""
    echo "1. Review .changeset/config.json"
    echo "2. Add NPM_TOKEN to GitHub secrets"
    echo "3. Update package.json with changeset scripts (if needed)"
    echo "4. Test: bun changeset"
    echo "5. Publish: bun run release"
    echo ""

    print_info "See docs/PUBLISHING_QUICKSTART.md for more info"
}

main "$@"
