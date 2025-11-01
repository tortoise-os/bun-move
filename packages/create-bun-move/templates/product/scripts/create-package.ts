#!/usr/bin/env bun
/**
 * Interactive Package Creation Wizard
 *
 * Guides developers through creating new packages with validated names
 * that follow TortoiseOS naming conventions.
 *
 * Usage:
 *   bun scripts/create-package.ts
 */

import { mkdir, writeFile } from 'fs/promises';
import { resolve, join } from 'path';
import { existsSync } from 'fs';

// ============================================================================
// Configuration
// ============================================================================

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

const SCOPES = {
  '@tortoise-os': 'Foundation packages (shared across all products)',
  '@carapace': 'Carapace product packages (AMM/DEX)',
  '@hatch': 'Hatch product packages (Trading strategies)',
  '@turtle-net': 'Turtle-net product packages',
};

// ============================================================================
// Interactive Prompts
// ============================================================================

async function prompt(question: string): Promise<string> {
  process.stdout.write(question);

  for await (const line of console) {
    return line.trim();
  }

  return '';
}

async function confirm(question: string): Promise<boolean> {
  const answer = await prompt(`${question} (y/n): `);
  return answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes';
}

async function select(question: string, options: string[]): Promise<number> {
  console.log(question);
  options.forEach((opt, i) => console.log(`  ${i + 1}. ${opt}`));

  while (true) {
    const answer = await prompt('Enter number: ');
    const num = parseInt(answer);
    if (num >= 1 && num <= options.length) {
      return num - 1;
    }
    console.log('Invalid selection. Please try again.');
  }
}

// ============================================================================
// Validation
// ============================================================================

function validatePackageName(scope: string, baseName: string): {
  valid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check if base name is lowercase with hyphens only
  if (!/^[a-z][a-z0-9-]*$/.test(baseName)) {
    errors.push('Package name must be lowercase with hyphens only (e.g., my-package)');
  }

  // Check for forbidden names in product packages
  if (scope !== '@tortoise-os') {
    if (FORBIDDEN_BASE_NAMES.includes(baseName)) {
      errors.push(
        `"${baseName}" is too generic for product packages. ` +
        `Use a specific name like "${baseName}-feature" or "product-${baseName}"`
      );
    }

    // Warn if it's just "sdk" without specificity
    if (baseName === 'sdk') {
      warnings.push(
        'Consider using a more specific name like "pool-sdk", "flash-sdk", or "strategy-sdk"'
      );
    }
  }

  // Check if name ends with redundant scope
  const scopeName = scope.replace('@', '').replace('/', '');
  if (baseName.startsWith(scopeName)) {
    warnings.push(
      `Package name "${baseName}" starts with "${scopeName}". ` +
      `This is redundant in "${scope}/${baseName}"`
    );
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

// ============================================================================
// Package Template Generation
// ============================================================================

function generatePackageJson(
  scope: string,
  baseName: string,
  description: string,
  isFoundation: boolean
): string {
  const name = `${scope}/${baseName}`;
  const repository = isFoundation ? 'bun-move' : scope.replace('@', '');

  return JSON.stringify({
    name,
    version: '0.1.0',
    description,
    main: './src/index.ts',
    types: './src/index.ts',
    type: 'module',
    exports: {
      '.': {
        bun: './src/index.ts',
        import: './src/index.ts',
        types: './src/index.ts',
      },
    },
    scripts: {
      build: 'tsc',
      dev: 'tsc --watch',
      typecheck: 'tsc --noEmit',
      test: 'bun test',
    },
    dependencies: {},
    devDependencies: {
      '@types/bun': 'latest',
      typescript: '^5.6.2',
    },
    keywords: [
      'tortoise-os',
      scope.replace('@', ''),
      baseName,
    ],
    author: 'TortoiseOS Team',
    license: 'MIT',
    repository: {
      type: 'git',
      url: `https://github.com/tortoise-os/${repository}.git`,
      directory: `packages/${baseName}`,
    },
    homepage: `https://github.com/tortoise-os/${repository}/tree/main/packages/${baseName}`,
    bugs: {
      url: `https://github.com/tortoise-os/${repository}/issues`,
    },
    publishConfig: {
      access: 'public',
      registry: 'https://registry.npmjs.org/',
    },
  }, null, 2);
}

function generateIndexTs(name: string, description: string): string {
  return `/**
 * ${name}
 * ${description}
 */

// Export your package functionality here
export * from './lib';
`;
}

function generateLibTs(): string {
  return `/**
 * Package implementation
 */

export function example(): string {
  return 'Hello from your new package!';
}
`;
}

function generateTestFile(packageName: string): string {
  return `import { describe, test, expect } from 'bun:test';
import { example } from './lib';

describe('${packageName}', () => {
  test('example function', () => {
    expect(example()).toBe('Hello from your new package!');
  });
});
`;
}

function generateReadme(name: string, description: string): string {
  return `# ${name}

${description}

## Installation

\`\`\`bash
bun add ${name}
\`\`\`

## Usage

\`\`\`typescript
import { example } from '${name}';

const result = example();
console.log(result);
\`\`\`

## API

### \`example()\`

Example function that returns a greeting.

## Development

\`\`\`bash
# Install dependencies
bun install

# Run tests
bun test

# Build
bun run build

# Type check
bun run typecheck
\`\`\`

## License

MIT
`;
}

function generateTsConfig(): string {
  return JSON.stringify({
    extends: '../../tsconfig.json',
    compilerOptions: {
      outDir: './dist',
      rootDir: './src',
    },
    include: ['src/**/*'],
    exclude: ['node_modules', 'dist', '**/*.test.ts'],
  }, null, 2);
}

// ============================================================================
// Package Creation
// ============================================================================

async function createPackageStructure(
  packageDir: string,
  name: string,
  description: string
): Promise<void> {
  // Create directories
  await mkdir(join(packageDir, 'src'), { recursive: true });

  // Create files
  await writeFile(
    join(packageDir, 'package.json'),
    generatePackageJson(
      name.split('/')[0],
      name.split('/')[1],
      description,
      name.startsWith('@tortoise-os')
    )
  );

  await writeFile(join(packageDir, 'src/index.ts'), generateIndexTs(name, description));
  await writeFile(join(packageDir, 'src/lib.ts'), generateLibTs());
  await writeFile(join(packageDir, 'src/lib.test.ts'), generateTestFile(name));
  await writeFile(join(packageDir, 'README.md'), generateReadme(name, description));
  await writeFile(join(packageDir, 'tsconfig.json'), generateTsConfig());
}

// ============================================================================
// Main Wizard
// ============================================================================

async function main() {
  console.log('');
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║  TortoiseOS Package Creation Wizard                       ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  console.log('');

  // Step 1: Select scope
  console.log('📦 Step 1: Select package scope\n');
  const scopeIndex = await select(
    'Which scope is this package for?',
    Object.entries(SCOPES).map(([scope, desc]) => `${scope} - ${desc}`)
  );
  const scope = Object.keys(SCOPES)[scopeIndex];
  const isFoundation = scope === '@tortoise-os';

  console.log(`\n✓ Selected scope: ${scope}\n`);

  // Step 2: Enter package name
  console.log('📝 Step 2: Enter package name\n');

  if (isFoundation) {
    console.log('Foundation packages should use generic, reusable names:');
    console.log('  ✓ Good: oracle, math, testing, hooks');
    console.log('  ✗ Bad: carapace-oracle, amm-math\n');
  } else {
    console.log('Product packages should use specific, descriptive names:');
    console.log('  ✓ Good: pool-sdk, flash-sdk, carapace-ui, strategy-sdk');
    console.log(`  ✗ Bad: core, sdk, ui, utils (too generic)\n`);
  }

  let baseName: string;
  let validation: ReturnType<typeof validatePackageName>;

  while (true) {
    baseName = await prompt('Enter package name (lowercase with hyphens): ');
    validation = validatePackageName(scope, baseName);

    // Show errors
    if (validation.errors.length > 0) {
      console.log('\n❌ Invalid package name:\n');
      validation.errors.forEach(err => console.log(`  • ${err}`));
      console.log('');
      continue;
    }

    // Show warnings
    if (validation.warnings.length > 0) {
      console.log('\n⚠️  Warnings:\n');
      validation.warnings.forEach(warn => console.log(`  • ${warn}`));
      console.log('');

      const proceed = await confirm('Continue anyway?');
      if (!proceed) continue;
    }

    break;
  }

  const packageName = `${scope}/${baseName}`;
  console.log(`\n✓ Package name: ${packageName}\n`);

  // Step 3: Enter description
  console.log('📄 Step 3: Package description\n');
  const description = await prompt('Enter a brief description: ');
  console.log('');

  // Step 4: Select location
  console.log('📁 Step 4: Select package location\n');

  const repoRoot = resolve(__dirname, isFoundation ? '..' : `../../${scope.replace('@', '')}`);
  const packagesDir = join(repoRoot, 'packages');
  const packageDir = join(packagesDir, baseName);

  console.log(`Package will be created at:`);
  console.log(`  ${packageDir}\n`);

  if (existsSync(packageDir)) {
    console.log(`❌ Error: Directory already exists: ${packageDir}`);
    process.exit(1);
  }

  // Step 5: Confirm and create
  console.log('✨ Step 5: Review and create\n');
  console.log(`Package Name: ${packageName}`);
  console.log(`Description:  ${description}`);
  console.log(`Location:     ${packageDir}`);
  console.log('');

  const confirmed = await confirm('Create this package?');
  if (!confirmed) {
    console.log('\n❌ Cancelled');
    process.exit(0);
  }

  // Create package
  console.log('\n📦 Creating package...\n');

  try {
    await createPackageStructure(packageDir, packageName, description);

    console.log('✅ Package created successfully!\n');
    console.log('Next steps:\n');
    console.log(`  1. cd ${packageDir}`);
    console.log('  2. bun install');
    console.log('  3. bun test');
    console.log('  4. Start building your package!\n');
    console.log(`📝 Don't forget to add your package to the workspace if needed.`);
    console.log('');

  } catch (error) {
    console.log(`\n❌ Error creating package: ${error}`);
    process.exit(1);
  }
}

main().catch(console.error);
