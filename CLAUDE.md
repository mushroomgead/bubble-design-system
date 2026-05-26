# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Required reading

`PROGRESS.md` at the repo root is the source of truth for project state, decision history (with rationale), the next-step task list, and verification commands. Read it before doing anything non-trivial. Update it after any decision or change you'd want a future Claude session to know about.

## Commands

All commands run from the repo root. The package manager is `pnpm@10.33.0` (Node >= 20).

```bash
pnpm install                          # install all workspaces

pnpm -C packages/ui typecheck         # tsc --noEmit on the lib
pnpm -C packages/ui build             # tsup → dist/ (ESM + CJS + .d.ts/.d.cts), then cp preset.css + tokens.css
pnpm -C packages/ui dev               # tsup --watch
pnpm -C packages/ui clean             # rm -rf dist

pnpm -C apps/docs typecheck
pnpm -C apps/docs dev                 # Next.js 16 Turbopack on :3000
pnpm -C apps/docs build               # next build
```

There is no test runner configured yet, and no root-level lint script. Typecheck is the only static gate.

When booting the docs dev server, free the port first per the user's global rule:
`lsof -ti :3000 | xargs kill -9 2>/dev/null; true`

## Architecture

This is a pnpm-workspaces monorepo for a token-driven React design system. Two workspaces:

- `packages/ui` — the published lib `@plain-ds/ui` (Base UI + Tailwind v4 + `cn()` overrides)
- `apps/docs` — Next.js 16 + MDX gallery that consumes `@plain-ds/ui` via `workspace:*`

### The four layers, and how they connect

1. **`packages/ui/src/tokens.css`** — 558-line design-token sheet. Defines `:root` primitives plus `[data-theme]`, `[data-gray]`, `[data-brand]`, `[data-radius]`, `[data-density]`, `[data-font]` overrides. This is the product — token names are part of the design spec and round-trip 1:1 with code. Do not rename tokens to make Tailwind utilities prettier (see PROGRESS §3.9, which reversed an earlier flat-naming attempt).

2. **`packages/ui/src/preset.css`** — `@import "tailwindcss"; @import "./tokens.css";` then `@theme inline { ... }` mapping each token into Tailwind's namespace so utilities like `bg-bg-brand`, `text-text-on-brand`, `shadow-focus`, `duration-fast` exist. **`inline` is critical**: it makes Tailwind emit `var(--color-bg-brand)` at use-site instead of resolving to a literal at build time. That is what lets `document.documentElement.setAttribute("data-theme", "dark")` re-skin the app live without a rebuild. If you ever drop `inline`, runtime theme switching silently breaks.

3. **Components** (e.g. `src/components/Button.tsx`) — each one is a thin wrapper around a Base UI primitive, styled with Tailwind utilities composed via `cn()`. The pattern:
   - `forwardRef<HTMLElement, Props>` matching Base UI's ref shape
   - `Omit<BaseProps, "className">` then re-add `className?: string` to narrow it from Base UI's union type
   - variant/size are discriminated string enums with sensible defaults
   - `cn(baseClasses, variantClasses[variant], sizeClasses[size], className)` — user `className` last so `tailwind-merge` lets it win conflicts
   - Handle both `disabled:` and `data-[disabled]:` (Base UI uses the data-attr form)
   - Density-driven control sizing uses arbitrary values (`h-[var(--control-h-md)]`) because `--control-h-*` has no Tailwind namespace

4. **`apps/docs/app/globals.css`** — `@import "@plain-ds/ui/preset.css"` plus `@source "../../../packages/ui/src/**/*.{ts,tsx}"` so Tailwind scans the lib source during docs dev (no rebuild needed on lib edits). `app/layout.tsx` sets all six `data-*` attributes on `<html>` as the runtime token-switching root.

### Component-authoring rules

- **Content via `children`, not props.** Don't add `label` / `text` / `title` props to keep components composable. Exceptions are semantically-distinct slots (e.g. Toast's title + description).
- **Spread `...props`** so consumers get every native HTML attribute for free.
- **Pass `ref`** through Base UI's primitive.
- **`className` is always the last `cn()` argument** so user overrides win.
- Components are exported from `src/index.ts` along with their `Props` type.

### Build / packaging shape

- `tsup` emits ESM (`dist/index.js`) + CJS (`dist/index.cjs`) + per-format types (`.d.ts` / `.d.cts`). The `exports` field in `packages/ui/package.json` uses conditional `import`/`require` with per-format `types` so strict NodeNext consumers resolve correctly.
- `src/preset.css` and `src/tokens.css` are copied to `dist/` by the build script and exposed at the subpaths `@plain-ds/ui/preset.css` and `@plain-ds/ui/tokens.css`.
- `sideEffects: false`, `peerDependencies` for react / react-dom / tailwindcss / @base-ui/react. `clsx` + `tailwind-merge` are regular deps.

### Stack-specific gotchas

- **TypeScript 6** with `ignoreDeprecations: "6.0"` in `tsconfig.base.json` — required because tsup's `rollup-plugin-dts` still uses the deprecated `baseUrl`. Don't remove the flag until that toolchain catches up.
- **`@base-ui/react@^1.5.0`** — the package was renamed from `@base-ui-components/react` (deprecated) to `@base-ui/react` at the 1.0 stable release (2025-12-11). Import paths use the new scope: `@base-ui/react/<primitive>`.
- **Tailwind v4** is required in consumer apps; this is an accepted architectural cost (shadcn-style override pattern).
- **`--space-*` tokens are intentionally not registered** with Tailwind — the user's spacing scale is 0.25rem-aligned, so Tailwind's default `--spacing` multiplier already produces matching values.

## Verification

After any non-trivial change, run the full sequence in `PROGRESS.md` §7 — it covers typecheck, build, dist-file presence, package-export resolution, docs typecheck, and a manual browser check that toggling `data-theme` / `data-brand` / `data-radius` / `data-density` re-skins the gallery live. If live token switching stops working, the most likely cause is that `@theme inline` lost its `inline` modifier.
