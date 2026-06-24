# Bubble Design System

> A neutral, composable, token-driven UI foundation built on [Base UI](https://base-ui.com/), shipped as a single plain CSS file — no Tailwind, no PostCSS, no build step required in consumer apps.

[![npm version](https://img.shields.io/npm/v/@bubble-design-system/ui)](https://www.npmjs.com/package/@bubble-design-system/ui)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](packages/ui/LICENSE)

Bubble's signature is the **soft tone with a teal brand**: a soft-gray page on which white pill-shaped surfaces float via layered shadows and an inset white top-highlight, accented by teal (`#00CEC8`) and a pink→magenta→violet gradient blob mark. Every visual decision — theme, tone, color, gray family, radius, density, typography, motion — is driven by CSS custom properties, so toggling a single `data-*` attribute on `<html>` re-skins the whole app live, with no rebuild.

This is a **portfolio + learning piece**, architecturally inspired by shadcn/ui: [`@base-ui/react`](https://base-ui.com/) provides accessible headless primitives, and Bubble ships the styling on top as one hand-authored stylesheet.

---

## What's in this repo

A pnpm-workspaces monorepo with two packages:

| Package                      | What it is                                                                                                                                                                                                                              |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`packages/ui`](packages/ui) | **`@bubble-design-system/ui`** — the published library: 25 components, the design-token sheet, and the build pipeline that produces `dist/styles.css`. See [`packages/ui/README.md`](packages/ui/README.md) for the full component API. |
| [`apps/docs`](apps/docs)     | `@bubble-design-system/docs` — a Next.js 16 + MDX gallery that consumes the library via `workspace:*` and exercises every component, plus a live theme switcher (ThemeBar) for all seven `data-*` axes.                                 |

## Quick start (using the library)

```bash
npm install @bubble-design-system/ui react react-dom @base-ui/react
```

```tsx
import "@bubble-design-system/ui/styles.css";
import { Button } from "@bubble-design-system/ui";

export default function App() {
  return <Button variant="primary">Hello, Bubble</Button>;
}
```

Full installation, theming, and component docs live in [`packages/ui/README.md`](packages/ui/README.md).

## Local development (this monorepo)

Package manager is `pnpm@10.33.0` (Node ≥ 20).

```bash
pnpm install                          # install all workspaces

# Library
pnpm -C packages/ui typecheck         # tsc --noEmit
pnpm -C packages/ui build             # tsup → dist/, then build-css.mjs flattens dist/styles.css
pnpm -C packages/ui dev               # tsup --watch
pnpm -C packages/ui lint

# Docs app
pnpm -C apps/docs dev                 # Next.js 16 Turbopack on :3000
pnpm -C apps/docs build
pnpm -C apps/docs typecheck

# Whole repo
pnpm format                           # prettier --write .
pnpm format:check
pnpm lint
```

There is no test runner configured yet — typecheck, lint, and format are the static gates.

## Releasing

Release steps for `@bubble-design-system/ui`. Run everything from the repo root.

### 1. Bump the version

Edit `packages/ui/package.json` and update `"version"` following semver:

- **patch** (1.2.2 → 1.2.3) — bug fixes, no API changes
- **minor** (1.2.2 → 1.3.0) — new components or features, no breaking changes
- **major** (1.2.2 → 2.0.0) — breaking API changes

### 2. Run static checks

```bash
pnpm -C packages/ui typecheck
pnpm -C packages/ui build
pnpm -C packages/ui lint
pnpm -C apps/docs typecheck
pnpm format:check
```

### 3. Publish to npm

```bash
pnpm -C packages/ui npm-publish
```

Uses an npm Automation token (configured in `~/.npmrc`) to bypass the OTP prompt.

### 4. Commit and push

```bash
git add packages/ui/package.json
git commit -m "chore(ui): bump to vX.Y.Z"
git push origin main
```

### 5. Tag the release

Tags use the format `vMAJOR.MINOR.PATCH` (annotated).

```bash
git tag -a vX.Y.Z -m "vX.Y.Z: short summary of what changed"
git push origin vX.Y.Z
```

### 6. Create a GitHub Release

```bash
gh release create vX.Y.Z --title "vX.Y.Z" --notes "Short description of changes." --latest
```

## Documentation

- [`packages/ui/README.md`](packages/ui/README.md) — installation, runtime theming, the full component reference, and design tokens.
- [`PROGRESS.md`](PROGRESS.md) — project status, architecture decisions with rationale, and the verification checklist. Start here to understand _why_ things are built the way they are.

## License

MIT — see [`packages/ui/LICENSE`](packages/ui/LICENSE).
