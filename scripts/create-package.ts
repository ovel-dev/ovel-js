#!/usr/bin/env bun
/**
 * Create a new package in the monorepo
 * Usage: bun run new <package-name>
 */

import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'fs';
import { join } from 'path';

const ROOT = join(import.meta.dir, '..');
const PACKAGES_DIR = join(ROOT, 'packages');

function createPackage(name: string) {
  // Validate name
  if (!name || !/^[a-z][a-z0-9-]*$/.test(name)) {
    console.error('❌ Invalid package name. Use lowercase letters, numbers, and hyphens.');
    console.error('   Example: bun run new my-package');
    process.exit(1);
  }

  const packageDir = join(PACKAGES_DIR, name);
  const srcDir = join(packageDir, 'src');

  // Check if already exists
  if (existsSync(packageDir)) {
    console.error(`❌ Package "${name}" already exists at ${packageDir}`);
    process.exit(1);
  }

  console.log(`\n📦 Creating @ovel/${name}...\n`);

  // Create directories
  mkdirSync(srcDir, { recursive: true });

  // package.json
  const packageJson = {
    name: `@ovel/${name}`,
    version: '0.0.1',
    type: 'module',
    main: './src/index.ts',
    module: './src/index.ts',
    types: './src/index.ts',
    exports: {
      '.': {
        import: './src/index.ts',
        types: './src/index.ts',
      },
    },
    scripts: {
      build: 'tsc --build',
      dev: 'tsc --build --watch',
      test: 'bun test',
      'test:watch': 'bun test --watch',
    },
    files: ['src', 'dist'],
  };
  writeFileSync(
    join(packageDir, 'package.json'),
    JSON.stringify(packageJson, null, 2) + '\n'
  );
  console.log('  ✓ package.json');

  // tsconfig.json
  const tsconfig = {
    extends: '../../tsconfig.base.json',
    compilerOptions: {
      composite: true,
      rootDir: 'src',
      outDir: 'dist',
      declaration: true,
      declarationMap: true,
    },
    include: ['src'],
  };
  writeFileSync(
    join(packageDir, 'tsconfig.json'),
    JSON.stringify(tsconfig, null, 2) + '\n'
  );
  console.log('  ✓ tsconfig.json');

  // src/index.ts
  writeFileSync(
    join(srcDir, 'index.ts'),
    `/**\n * @ovel/${name}\n */\n\nexport {};\n`
  );
  console.log('  ✓ src/index.ts');

  // Update root tsconfig.json references
  const rootTsconfigPath = join(ROOT, 'tsconfig.json');
  const rootTsconfig = JSON.parse(readFileSync(rootTsconfigPath, 'utf-8'));

  const newRef = { path: `packages/${name}` };
  if (!rootTsconfig.references) {
    rootTsconfig.references = [];
  }

  const alreadyExists = rootTsconfig.references.some(
    (ref: { path: string }) => ref.path === newRef.path
  );

  if (!alreadyExists) {
    rootTsconfig.references.push(newRef);
    writeFileSync(rootTsconfigPath, JSON.stringify(rootTsconfig, null, 2) + '\n');
    console.log('  ✓ Updated root tsconfig.json');
  }

  console.log(`\n✅ Package @ovel/${name} created!\n`);
  console.log('Next steps:');
  console.log(`  1. cd packages/${name}`);
  console.log('  2. Add dependencies if needed');
  console.log('  3. Run "bun install" from root\n');
}

// Main
const packageName = process.argv[2];

if (!packageName) {
  console.log('Usage: bun run new <package-name>');
  console.log('Example: bun run new my-package');
  process.exit(1);
}

createPackage(packageName);
