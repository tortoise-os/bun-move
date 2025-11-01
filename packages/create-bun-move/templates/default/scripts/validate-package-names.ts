#!/usr/bin/env bun
/**
 * Package Name Validation Script
 *
 * Validates package names across the TortoiseOS ecosystem to prevent duplicates
 * and enforce naming conventions.
 *
 * Usage:
 *   bun scripts/validate-package-names.ts
 *   bun scripts/validate-package-names.ts --check /path/to/package.json
 */

import { resolve } from 'path';
import { readFileSync, existsSync } from 'fs';
import { glob } from 'glob';

// ============================================================================
// Configuration
// ============================================================================

const REPO_ROOTS = [
  resolve(__dirname, '../../bun-move'),
  resolve(__dirname, '../../carapace'),
  resolve(__dirname, '../../hatch'),
  resolve(__dirname, '../../turtle-net'),
];

// Forbidden base names (too generic)
const FORBIDDEN_BASE_NAMES = [
  'core',
  'sdk',
  'ui',
  'utils',
  'helpers',
  'common',
  'shared',
  'lib',
  'tools',
];

// Allowed foundation scopes
const FOUNDATION_SCOPES = ['@tortoise-os'];

// Product scopes
const PRODUCT_SCOPES = ['@carapace', '@hatch', '@turtle-net'];

// ============================================================================
// Types
// ============================================================================

interface PackageInfo {
  name: string;
  path: string;
  scope: string;
  baseName: string;
  version: string;
}

interface ValidationError {
  type: 'duplicate' | 'forbidden' | 'invalid-format' | 'scope-mismatch';
  message: string;
  package: PackageInfo;
  conflictsWith?: PackageInfo;
}

// ============================================================================
// Validation Rules
// ============================================================================

class PackageValidator {
  private packages: Map<string, PackageInfo[]> = new Map();
  private errors: ValidationError[] = new Array();

  /**
   * Add a package to the validator
   */
  addPackage(info: PackageInfo): void {
    const existing = this.packages.get(info.name) || [];
    existing.push(info);
    this.packages.set(info.name, existing);
  }

  /**
   * Validate all packages
   */
  validate(): ValidationError[] {
    this.errors = [];

    for (const [name, instances] of this.packages.entries()) {
      // Check for duplicates
      if (instances.length > 1) {
        for (const instance of instances) {
          this.errors.push({
            type: 'duplicate',
            message: `Duplicate package name "${name}" found in ${instances.length} locations`,
            package: instance,
            conflictsWith: instances.find(p => p.path !== instance.path),
          });
        }
      }

      // Validate each instance
      for (const instance of instances) {
        this.validatePackage(instance);
      }
    }

    return this.errors;
  }

  /**
   * Validate a single package
   */
  private validatePackage(pkg: PackageInfo): void {
    // Rule 1: Check if base name is forbidden for product packages
    if (PRODUCT_SCOPES.includes(pkg.scope)) {
      if (FORBIDDEN_BASE_NAMES.includes(pkg.baseName)) {
        // Exception: Allow "sdk" if it's THE main product SDK (no other sdk packages)
        const isSdkException = pkg.baseName === 'sdk' && this.isMainProductSdk(pkg);

        if (!isSdkException) {
          this.errors.push({
            type: 'forbidden',
            message: `Package name "${pkg.name}" uses forbidden base name "${pkg.baseName}". ` +
                     `Product packages should use specific names like "${pkg.scope}/${this.suggestAlternative(pkg.baseName)}"`,
            package: pkg,
          });
        }
      }
    }

    // Rule 2: Check scope matches repository
    const expectedScope = this.getExpectedScope(pkg.path);
    if (expectedScope && pkg.scope !== expectedScope) {
      this.errors.push({
        type: 'scope-mismatch',
        message: `Package "${pkg.name}" has scope "${pkg.scope}" but is in "${expectedScope}" repository`,
        package: pkg,
      });
    }

    // Rule 3: Check for valid format
    if (!this.isValidPackageName(pkg.name)) {
      this.errors.push({
        type: 'invalid-format',
        message: `Package name "${pkg.name}" has invalid format. Must be @scope/name with lowercase and hyphens only`,
        package: pkg,
      });
    }
  }

  /**
   * Check if this is the main product SDK (allows @carapace/sdk as the primary SDK)
   */
  private isMainProductSdk(pkg: PackageInfo): boolean {
    // Count how many SDK packages exist in the same scope
    const scopeSdks = Array.from(this.packages.values())
      .flat()
      .filter(p => p.scope === pkg.scope && p.baseName.endsWith('sdk'));

    // Allow "sdk" only if it's the only SDK, or if there are feature-specific SDKs
    // (e.g., @carapace/sdk is OK if there's also @carapace/strategy-sdk)
    return scopeSdks.length <= 2;
  }

  /**
   * Suggest an alternative name for forbidden base names
   */
  private suggestAlternative(baseName: string): string {
    const suggestions: Record<string, string> = {
      'core': 'product-core or feature-core',
      'sdk': 'feature-sdk (e.g., pool-sdk, flash-sdk)',
      'ui': 'product-ui (e.g., carapace-ui)',
      'utils': 'specific-utils (or use @tortoise-os/core)',
      'helpers': 'specific-helpers (or use @tortoise-os/core)',
    };
    return suggestions[baseName] || `${baseName}-specific`;
  }

  /**
   * Get expected scope based on file path
   */
  private getExpectedScope(path: string): string | null {
    if (path.includes('/bun-move/')) return '@tortoise-os';
    if (path.includes('/carapace/')) return '@carapace';
    if (path.includes('/hatch/')) return '@hatch';
    if (path.includes('/turtle-net/')) return '@turtle-net';
    return null;
  }

  /**
   * Check if package name is valid
   */
  private isValidPackageName(name: string): boolean {
    // Must be scoped
    if (!name.startsWith('@')) return false;

    // Must have scope and name
    const parts = name.split('/');
    if (parts.length !== 2) return false;

    // Must be lowercase with hyphens only
    const [scope, baseName] = parts;
    const validPattern = /^@[a-z][a-z0-9-]*\/[a-z][a-z0-9-]*$/;
    return validPattern.test(name);
  }

  /**
   * Get summary of validation results
   */
  getSummary(): string {
    const total = this.packages.size;
    const duplicates = new Set(
      this.errors.filter(e => e.type === 'duplicate').map(e => e.package.name)
    ).size;
    const forbidden = this.errors.filter(e => e.type === 'forbidden').length;
    const invalid = this.errors.filter(e => e.type === 'invalid-format').length;
    const scopeMismatch = this.errors.filter(e => e.type === 'scope-mismatch').length;

    return `
Validation Summary:
  Total packages: ${total}
  Duplicate names: ${duplicates}
  Forbidden names: ${forbidden}
  Invalid format: ${invalid}
  Scope mismatches: ${scopeMismatch}
  Total errors: ${this.errors.length}
`;
  }
}

// ============================================================================
// Package Discovery
// ============================================================================

/**
 * Find all package.json files in the ecosystem
 */
async function findPackages(): Promise<PackageInfo[]> {
  const packages: PackageInfo[] = [];

  for (const root of REPO_ROOTS) {
    if (!existsSync(root)) {
      console.warn(`⚠️  Repository not found: ${root}`);
      continue;
    }

    const pattern = `${root}/packages/*/package.json`;
    const files = await glob(pattern);

    for (const file of files) {
      try {
        const content = readFileSync(file, 'utf-8');
        const json = JSON.parse(content);

        if (json.name) {
          const [scope, baseName] = json.name.split('/');
          packages.push({
            name: json.name,
            path: file,
            scope,
            baseName,
            version: json.version || '0.0.0',
          });
        }
      } catch (error) {
        console.error(`❌ Error reading ${file}:`, error);
      }
    }
  }

  return packages;
}

/**
 * Check a single package.json file
 */
function checkSinglePackage(packagePath: string): ValidationError[] {
  try {
    const content = readFileSync(packagePath, 'utf-8');
    const json = JSON.parse(content);

    if (!json.name) {
      return [{
        type: 'invalid-format',
        message: 'Package must have a "name" field',
        package: {
          name: 'unknown',
          path: packagePath,
          scope: '',
          baseName: '',
          version: '0.0.0',
        },
      }];
    }

    const [scope, baseName] = json.name.split('/');
    const info: PackageInfo = {
      name: json.name,
      path: packagePath,
      scope,
      baseName,
      version: json.version || '0.0.0',
    };

    const validator = new PackageValidator();
    validator.addPackage(info);
    return validator.validate();
  } catch (error) {
    return [{
      type: 'invalid-format',
      message: `Failed to parse package.json: ${error}`,
      package: {
        name: 'unknown',
        path: packagePath,
        scope: '',
        baseName: '',
        version: '0.0.0',
      },
    }];
  }
}

// ============================================================================
// Reporting
// ============================================================================

/**
 * Print validation errors
 */
function printErrors(errors: ValidationError[]): void {
  if (errors.length === 0) {
    console.log('✅ All package names are valid!');
    return;
  }

  console.log('\n❌ Package name validation failed:\n');

  // Group by type
  const byType = errors.reduce((acc, error) => {
    const type = error.type;
    if (!acc[type]) acc[type] = [];
    acc[type].push(error);
    return acc;
  }, {} as Record<string, ValidationError[]>);

  // Print duplicates
  if (byType.duplicate) {
    console.log('🔴 Duplicate Package Names:');
    const seen = new Set<string>();
    for (const error of byType.duplicate) {
      if (seen.has(error.package.name)) continue;
      seen.add(error.package.name);

      console.log(`\n  Package: ${error.package.name}`);
      console.log(`  Locations:`);
      const duplicates = byType.duplicate.filter(e => e.package.name === error.package.name);
      for (const dup of duplicates) {
        console.log(`    - ${dup.package.path}`);
      }
    }
    console.log('');
  }

  // Print forbidden names
  if (byType.forbidden) {
    console.log('🔴 Forbidden Package Names:');
    for (const error of byType.forbidden) {
      console.log(`\n  ${error.package.name}`);
      console.log(`  Location: ${error.package.path}`);
      console.log(`  Issue: ${error.message}`);
    }
    console.log('');
  }

  // Print invalid format
  if (byType['invalid-format']) {
    console.log('🔴 Invalid Package Name Format:');
    for (const error of byType['invalid-format']) {
      console.log(`\n  ${error.package.name}`);
      console.log(`  Location: ${error.package.path}`);
      console.log(`  Issue: ${error.message}`);
    }
    console.log('');
  }

  // Print scope mismatches
  if (byType['scope-mismatch']) {
    console.log('🔴 Scope Mismatches:');
    for (const error of byType['scope-mismatch']) {
      console.log(`\n  ${error.package.name}`);
      console.log(`  Location: ${error.package.path}`);
      console.log(`  Issue: ${error.message}`);
    }
    console.log('');
  }
}

// ============================================================================
// Main
// ============================================================================

async function main() {
  const args = process.argv.slice(2);

  // Check single package if --check flag is provided
  if (args.includes('--check')) {
    const index = args.indexOf('--check');
    const packagePath = args[index + 1];

    if (!packagePath) {
      console.error('❌ Error: --check requires a path to package.json');
      process.exit(1);
    }

    console.log(`🔍 Validating package: ${packagePath}\n`);
    const errors = checkSinglePackage(packagePath);
    printErrors(errors);
    process.exit(errors.length > 0 ? 1 : 0);
  }

  // Validate all packages
  console.log('🔍 Scanning for packages across TortoiseOS ecosystem...\n');

  const packages = await findPackages();
  console.log(`Found ${packages.length} packages\n`);

  const validator = new PackageValidator();
  for (const pkg of packages) {
    validator.addPackage(pkg);
  }

  const errors = validator.validate();

  console.log(validator.getSummary());
  printErrors(errors);

  process.exit(errors.length > 0 ? 1 : 0);
}

main().catch(console.error);
