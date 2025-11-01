#!/usr/bin/env bash
set -euo pipefail

# TortoiseOS Package Publishing Setup Script
# This script helps set up the publishing system for the first time

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

print_warning() {
    echo -e "${COLOR_YELLOW}⚠${COLOR_RESET} $1"
}

print_info() {
    echo -e "${COLOR_BLUE}ℹ${COLOR_RESET} $1"
}

check_npm_login() {
    if npm whoami &>/dev/null; then
        print_success "Logged in to npm as $(npm whoami)"
        return 0
    else
        print_error "Not logged in to npm"
        return 1
    fi
}

check_bun() {
    if command -v bun &>/dev/null; then
        print_success "Bun is installed: $(bun --version)"
        return 0
    else
        print_error "Bun is not installed"
        return 1
    fi
}

check_package_availability() {
    local package_name=$1
    if npm view "$package_name" &>/dev/null; then
        print_warning "Package '$package_name' already exists on npm"
        return 1
    else
        print_success "Package name '$package_name' is available"
        return 0
    fi
}

setup_npm() {
    print_header "npm Setup"

    if check_npm_login; then
        echo ""
        read -p "Do you want to switch npm accounts? (y/N): " switch_account
        if [[ $switch_account == "y" || $switch_account == "Y" ]]; then
            npm login
        fi
    else
        print_info "Please log in to npm..."
        npm login
    fi

    echo ""
}

check_packages() {
    print_header "Checking Package Names"

    local packages=(
        "@tortoise-os/core"
        "@tortoise-os/move"
        "@tortoise-os/ui"
        "@tortoise-os/sdk"
        "@tortoise-os/hooks"
        "@tortoise-os/move-deployer"
    )

    echo ""
    for pkg in "${packages[@]}"; do
        check_package_availability "$pkg" || true
    done
    echo ""
}

setup_github_secrets() {
    print_header "GitHub Secrets Setup"

    print_info "To enable automated publishing, you need to set up GitHub secrets:"
    echo ""
    echo "1. Go to: https://github.com/tortoise-os/bun-move/settings/secrets/actions"
    echo "2. Add the following secrets:"
    echo "   - NPM_TOKEN: Your npm access token"
    echo ""
    echo "To create an npm token:"
    echo "1. Go to: https://www.npmjs.com/settings/<your-username>/tokens"
    echo "2. Click 'Generate New Token' → 'Classic Token'"
    echo "3. Select 'Automation' type"
    echo "4. Copy the token and add it to GitHub secrets"
    echo ""

    read -p "Press Enter when done or Ctrl+C to skip..."
}

test_publish() {
    print_header "Test Publish (Dry Run)"

    echo ""
    print_info "Running a dry-run publish to check for issues..."
    echo ""

    cd "$(dirname "$0")/.."

    # Test with @tortoise-os/core as it has no dependencies
    if [ -d "packages/core" ]; then
        cd packages/core
        print_info "Testing @tortoise-os/core..."

        if npm publish --dry-run; then
            print_success "Dry run successful for @tortoise-os/core"
        else
            print_error "Dry run failed for @tortoise-os/core"
            return 1
        fi

        cd ../..
    fi

    echo ""
}

show_next_steps() {
    print_header "Next Steps"

    echo ""
    echo "🎯 To publish packages:"
    echo ""
    echo "Option 1: Manual Publishing"
    echo "  cd packages/<package-name>"
    echo "  npm publish --access public"
    echo ""
    echo "Option 2: Using Changesets"
    echo "  bun changeset              # Create a changeset"
    echo "  bun run version            # Version packages"
    echo "  bun run release            # Build and publish"
    echo ""
    echo "Option 3: GitHub Actions"
    echo "  - Push to main branch"
    echo "  - Or use workflow_dispatch"
    echo ""

    print_info "See docs/PUBLISHING_GUIDE.md for detailed instructions"
    echo ""
}

main() {
    clear

    print_header "TortoiseOS Package Publishing Setup"
    echo ""
    print_info "This script will help you set up package publishing for TortoiseOS"
    echo ""

    # Check prerequisites
    print_header "Checking Prerequisites"
    echo ""

    if ! check_bun; then
        print_error "Please install Bun first: https://bun.sh"
        exit 1
    fi

    echo ""

    # Setup npm
    setup_npm

    # Check package availability
    check_packages

    # Test publish
    test_publish

    # GitHub setup
    setup_github_secrets

    # Show next steps
    show_next_steps

    print_success "Setup complete!"
    echo ""
}

main "$@"
