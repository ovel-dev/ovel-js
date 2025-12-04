# ovel-js

A TypeScript monorepo powered by Bun.

## Structure

```
ovel-js/
├── packages/
│   ├── core/          # @ovel/core - Core functionality
│   └── utils/         # @ovel/utils - Shared utilities
├── tsconfig.base.json # Shared TypeScript config
├── tsconfig.json      # Root config with project references
└── package.json       # Workspace configuration
```

## Getting Started

```bash
bun install
```

## Scripts

| Command | Description |
|---------|-------------|
| `bun run build` | Build all packages |
| `bun run dev` | Watch mode for all packages |
| `bun run test` | Run tests in all packages |
| `bun run typecheck` | Type check all packages |
| `bun run lint` | Lint all packages |
| `bun run lint:fix` | Fix lint issues |
| `bun run format` | Format code with Prettier |
| `bun run clean` | Clean build artifacts |

## Adding a New Package

```bash
bun run new <package-name>
```

This will:
- Create `packages/<name>/` with `package.json`, `tsconfig.json`, `src/index.ts`
- Add reference to root `tsconfig.json`

## Package Dependencies

Use `workspace:*` for internal dependencies:

```json
{
  "dependencies": {
    "@ovel/utils": "workspace:*"
  }
}
```

## Versioning & Publishing

This project uses [Changesets](https://github.com/changesets/changesets) for version management.

```bash
bun run changeset      # Create a changeset
bun run version        # Update versions
bun run release        # Build and publish
```
