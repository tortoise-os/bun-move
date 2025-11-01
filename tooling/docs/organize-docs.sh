#!/usr/bin/env bash
set -euo pipefail

# Organize Documentation Script
# Organizes existing documentation into structured folders

COLOR_RESET='\033[0m'
COLOR_GREEN='\033[0;32m'
COLOR_BLUE='\033[0;34m'
COLOR_YELLOW='\033[1;33m'

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

print_move() {
    echo -e "${COLOR_YELLOW}→${COLOR_RESET} $1"
}

DOCS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../docs" && pwd)"

print_header "Organizing bun-move Documentation"
echo ""

# Ensure structure exists
mkdir -p "${DOCS_DIR}"/{current,archive,guides,architecture,operations,roadmaps}

print_info "Documentation directory: ${DOCS_DIR}"
echo ""

# CURRENT - Active, up-to-date documentation
print_header "Moving CURRENT documentation"
mv "${DOCS_DIR}/GETTING_STARTED.md" "${DOCS_DIR}/current/" 2>/dev/null && print_move "GETTING_STARTED.md → current/" || true
mv "${DOCS_DIR}/DEVELOPMENT.md" "${DOCS_DIR}/current/" 2>/dev/null && print_move "DEVELOPMENT.md → current/" || true
mv "${DOCS_DIR}/PROJECT-STATUS.md" "${DOCS_DIR}/current/" 2>/dev/null && print_move "PROJECT-STATUS.md → current/" || true
mv "${DOCS_DIR}/PACKAGE_STRUCTURE_FINAL.md" "${DOCS_DIR}/current/" 2>/dev/null && print_move "PACKAGE_STRUCTURE_FINAL.md → current/" || true
mv "${DOCS_DIR}/TEMPLATES_AND_VALIDATION.md" "${DOCS_DIR}/current/" 2>/dev/null && print_move "TEMPLATES_AND_VALIDATION.md → current/" || true
echo ""

# GUIDES - How-to guides and tutorials
print_header "Moving GUIDES"
mv "${DOCS_DIR}/QUICK-START.md" "${DOCS_DIR}/guides/" 2>/dev/null && print_move "QUICK-START.md → guides/" || true
mv "${DOCS_DIR}/QUICK_START_NAMING.md" "${DOCS_DIR}/guides/" 2>/dev/null && print_move "QUICK_START_NAMING.md → guides/" || true
mv "${DOCS_DIR}/PUBLISHING_QUICKSTART.md" "${DOCS_DIR}/guides/" 2>/dev/null && print_move "PUBLISHING_QUICKSTART.md → guides/" || true
mv "${DOCS_DIR}/E2E-TESTING-GUIDE.md" "${DOCS_DIR}/guides/" 2>/dev/null && print_move "E2E-TESTING-GUIDE.md → guides/" || true
mv "${DOCS_DIR}/CLI-TESTING-GUIDE.md" "${DOCS_DIR}/guides/" 2>/dev/null && print_move "CLI-TESTING-GUIDE.md → guides/" || true
mv "${DOCS_DIR}/APPLE-SILICON.md" "${DOCS_DIR}/guides/" 2>/dev/null && print_move "APPLE-SILICON.md → guides/" || true
echo ""

# ARCHITECTURE - Architecture Decision Records
print_header "Moving ARCHITECTURE documentation"
mv "${DOCS_DIR}/ARCHITECTURE.md" "${DOCS_DIR}/architecture/" 2>/dev/null && print_move "ARCHITECTURE.md → architecture/" || true
mv "${DOCS_DIR}/ECOSYSTEM_SUMMARY.md" "${DOCS_DIR}/architecture/" 2>/dev/null && print_move "ECOSYSTEM_SUMMARY.md → architecture/" || true
echo ""

# OPERATIONS - Operational guides (deployment, publishing, monitoring)
print_header "Moving OPERATIONS documentation"
mv "${DOCS_DIR}/PUBLISHING_GUIDE.md" "${DOCS_DIR}/operations/" 2>/dev/null && print_move "PUBLISHING_GUIDE.md → operations/" || true
mv "${DOCS_DIR}/PUBLISHING.md" "${DOCS_DIR}/operations/" 2>/dev/null && print_move "PUBLISHING.md → operations/" || true
mv "${DOCS_DIR}/PACKAGE_NAMING_ENFORCEMENT.md" "${DOCS_DIR}/operations/" 2>/dev/null && print_move "PACKAGE_NAMING_ENFORCEMENT.md → operations/" || true
echo ""

# ARCHIVE - Historical/deprecated docs with timestamps
print_header "Moving ARCHIVE (historical) documentation"
TODAY=$(date +%Y-%m-%d)

# Add timestamp prefix and move
if [ -f "${DOCS_DIR}/PACKAGE_CONSOLIDATION_COMPLETE.md" ]; then
    mv "${DOCS_DIR}/PACKAGE_CONSOLIDATION_COMPLETE.md" "${DOCS_DIR}/archive/${TODAY}_PACKAGE_CONSOLIDATION_COMPLETE.md" 2>/dev/null
    print_move "PACKAGE_CONSOLIDATION_COMPLETE.md → archive/${TODAY}_PACKAGE_CONSOLIDATION_COMPLETE.md"
fi

if [ -f "${DOCS_DIR}/PACKAGE_CATALOG.md" ]; then
    mv "${DOCS_DIR}/PACKAGE_CATALOG.md" "${DOCS_DIR}/archive/${TODAY}_PACKAGE_CATALOG.md" 2>/dev/null
    print_move "PACKAGE_CATALOG.md → archive/${TODAY}_PACKAGE_CATALOG.md"
fi

if [ -f "${DOCS_DIR}/IMPLEMENTATION_COMPLETE.md" ]; then
    mv "${DOCS_DIR}/IMPLEMENTATION_COMPLETE.md" "${DOCS_DIR}/archive/${TODAY}_IMPLEMENTATION_COMPLETE.md" 2>/dev/null
    print_move "IMPLEMENTATION_COMPLETE.md → archive/${TODAY}_IMPLEMENTATION_COMPLETE.md"
fi

if [ -f "${DOCS_DIR}/VERIFICATION_AND_STRATEGY.md" ]; then
    mv "${DOCS_DIR}/VERIFICATION_AND_STRATEGY.md" "${DOCS_DIR}/archive/${TODAY}_VERIFICATION_AND_STRATEGY.md" 2>/dev/null
    print_move "VERIFICATION_AND_STRATEGY.md → archive/${TODAY}_VERIFICATION_AND_STRATEGY.md"
fi

if [ -f "${DOCS_DIR}/ANSWER_TO_VERIFICATION.md" ]; then
    mv "${DOCS_DIR}/ANSWER_TO_VERIFICATION.md" "${DOCS_DIR}/archive/${TODAY}_ANSWER_TO_VERIFICATION.md" 2>/dev/null
    print_move "ANSWER_TO_VERIFICATION.md → archive/${TODAY}_ANSWER_TO_VERIFICATION.md"
fi

echo ""

# Create .gitkeep in empty directories
print_header "Creating placeholders for empty directories"
touch "${DOCS_DIR}/roadmaps/.gitkeep"
print_success "Created roadmaps/.gitkeep"
echo ""

# List what's left in root
print_header "Remaining files in docs root"
ls -1 "${DOCS_DIR}"/*.md 2>/dev/null | xargs -n1 basename || echo "None"
echo ""

print_success "Documentation organization complete!"
echo ""
echo "Structure:"
echo "  ${DOCS_DIR}/"
echo "  ├── INDEX.md (stays in root)"
echo "  ├── README.md (stays in root)"
echo "  ├── current/          $(ls ${DOCS_DIR}/current/*.md 2>/dev/null | wc -l | tr -d ' ') files"
echo "  ├── guides/           $(ls ${DOCS_DIR}/guides/*.md 2>/dev/null | wc -l | tr -d ' ') files"
echo "  ├── architecture/     $(ls ${DOCS_DIR}/architecture/*.md 2>/dev/null | wc -l | tr -d ' ') files"
echo "  ├── operations/       $(ls ${DOCS_DIR}/operations/*.md 2>/dev/null | wc -l | tr -d ' ') files"
echo "  ├── archive/          $(ls ${DOCS_DIR}/archive/*.md 2>/dev/null | wc -l | tr -d ' ') files"
echo "  └── roadmaps/         $(ls ${DOCS_DIR}/roadmaps/*.md 2>/dev/null | wc -l | tr -d ' ') files"
echo ""
