# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Required reading

`PROGRESS.md` at the repo root is the source of truth for project state, decision history (with rationale), the next-step task list, and verification commands. Read it before doing anything non-trivial. Update it after any decision or change you'd want a future Claude session to know about.

## Commands

All commands run from the repo root. The package manager is `pnpm@10.33.0` (Node >= 20).

```bash
pnpm install                          # install all workspaces

pnpm -C packages/ui typecheck         # tsc --noEmit on the lib
pnpm -C packages/ui build             # tsup → dist/ (ESM + CJS + .d.ts/.d.cts), then build-css.mjs flattens
                                      # src/tokens.css + src/base.css + src/components/*.css into dist/styles.css
pnpm -C packages/ui dev               # tsup --watch
pnpm -C packages/ui clean             # rm -rf dist

pnpm -C apps/docs typecheck
pnpm -C apps/docs dev                 # Next.js 16 Turbopack on :3000
pnpm -C apps/docs build               # next build

pnpm lint                              # eslint . in each workspace (flat config, ESLint 9)
pnpm -C packages/ui lint
pnpm -C apps/docs lint

pnpm format                           # prettier --write . (whole repo)
pnpm format:check                     # prettier --check .
```

There is no test runner configured yet. Typecheck, lint, and format are the static gates.

### Formatting & linting

- **Prettier** (`.prettierrc.json` at root) is the formatting source of truth for the whole repo.
- **ESLint 9 flat config**, one `eslint.config.mjs` per workspace (flat-config resolution is cwd-based, so each workspace needs its own):
  - `packages/ui/eslint.config.mjs` — `@eslint/js` + `typescript-eslint` recommended + `eslint-plugin-react`/`react-hooks`, with `@typescript-eslint/no-empty-object-type` set to `allowInterfaces: "with-single-extends"` (covers the `interface FooProps extends BaseProps {}` re-export pattern below).
  - `apps/docs/eslint.config.mjs` — just `eslint-config-next`'s flat array (already bundles react/react-hooks/jsx-a11y/import/@next rules) + `eslint-config-prettier`. Don't add `@eslint/js` recommended here — its `no-undef` false-positives on TS ambient globals like `React.ReactNode`.
- **`.claude/hooks/format-and-lint.mjs`** runs as a `PostToolUse` hook (configured in `.claude/settings.json`) on every Edit/MultiEdit/Write: Prettier `--write`s the touched file, then (for JS/TS files under `packages/ui` or `apps/docs`) runs ESLint `--fix` with cwd set to that workspace. If ESLint still reports errors after `--fix`, it exits 2 so the error is fed back into the conversation.

When booting the docs dev server, free the port first per the user's global rule:
`lsof -ti :3000 | xargs kill -9 2>/dev/null; true`

## Architecture

This is a pnpm-workspaces monorepo for a token-driven React design system. Two workspaces:

- `packages/ui` — the published lib `@bubble-design-system/ui` (Base UI + hand-authored CSS + stable BEM class names)
- `apps/docs` — Next.js 16 + MDX gallery that consumes `@bubble-design-system/ui` via `workspace:*`

### The three layers, and how they connect

1. **`packages/ui/src/tokens.css`** — design-token sheet. Defines `:root` primitives plus `[data-theme]`, `[data-tone]`, `[data-gray]`, `[data-brand]`, `[data-radius]`, `[data-density]`, `[data-font]` overrides. `[data-tone]` (vivid · pastel · soft) is the Bubble-introduced axis; soft is the signature look (gray page, white floating pills, layered shadows with inset white highlight, pill controls via `--ctrl-radius`). This is the product — token names are part of the design spec.

2. **`packages/ui/src/components/*.css` + `src/base.css`** — one CSS file per component, plus a small `base.css` reset. Each component CSS file owns a stable BEM block: `.pds-btn`, `.pds-btn--primary`, `.pds-btn--md`, `.pds-card__header`, etc. Rules read tokens directly via `var(--color-bg-brand)`, `var(--control-h-md)`. The build step (`scripts/build-css.mjs`) concatenates tokens.css + base.css + every component CSS into a single shipped `dist/styles.css` — no PostCSS dependency, no consumer toolchain required. Runtime theme switching is preserved end-to-end: every rule references `var(--…)` at use site, so toggling `data-theme` / `data-tone` / `data-brand` / `data-radius` / `data-density` / `data-font` re-skins descendants with no rebuild.

3. **Components** (e.g. `src/components/Button.tsx`) — each one is a thin wrapper around a Base UI primitive that emits stable BEM class names via `cn()`. The pattern:
   - `forwardRef<HTMLElement, Props>` matching Base UI's ref shape
   - `Omit<BaseProps, "className">` then re-add `className?: string` to narrow it from Base UI's union type
   - variant/size are discriminated string enums with sensible defaults
   - `cn("pds-btn", `pds-btn--${variant}`, `pds-btn--${size}`, className)` — user `className` last so it wins via CSS class-name ordering inside the attribute
   - All hover/focus/disabled/data-state behaviour lives in the component's CSS file, not the JSX

4. **`apps/docs/app/globals.css`** — `@import "@bubble-design-system/ui/styles.css"` plus a small set of `docs-*` helper classes (page chrome, ThemeBar styles, layout grids, token-row styles). The docs app is internal-only — it never reaches consumers. `app/layout.tsx` sets all seven `data-*` attributes on `<html>` (theme · tone · gray · brand · radius · density · font) — canonical Bubble defaults are `light · soft · slate · teal · default · default · roboto`.

### Component-authoring rules

- **Content via `children`, not props.** Don't add `label` / `text` / `title` props to keep components composable. Exceptions are semantically-distinct slots (e.g. Toast's title + description).
- **Spread `...props`** so consumers get every native HTML attribute for free.
- **Pass `ref`** through Base UI's primitive.
- **`className` is always the last `cn()` argument** so user overrides come after the library's defaults in the resulting className string.
- **BEM naming**: block = `pds-<component>` (kebab-case), element = `pds-<component>__<element>`, modifier = `pds-<component>--<modifier>`. Each component's CSS file is the source of truth for its class set.
- **Tokens are referenced directly** in CSS: `background-color: var(--color-bg-brand)`, `height: var(--control-h-md)`. Never hard-code values.
- Components are exported from `src/index.ts` along with their `Props` type.

### Build / packaging shape

- `tsup` emits ESM (`dist/index.js`) + CJS (`dist/index.cjs`) + per-format types (`.d.ts` / `.d.cts`). The `exports` field in `packages/ui/package.json` uses conditional `import`/`require` with per-format `types` so strict NodeNext consumers resolve correctly.
- `scripts/build-css.mjs` concatenates `src/tokens.css` + `src/base.css` + each `src/components/*.css` file (alphabetical) into a single `dist/styles.css`. It also re-emits `dist/tokens.css` for consumers who only want the tokens without the component rules.
- Exposed sub-paths: `@bubble-design-system/ui/styles.css` (recommended) and `@bubble-design-system/ui/tokens.css`.
- `sideEffects: ["./dist/styles.css", "./dist/tokens.css"]` so the JS tree-shakes but the CSS isn't dropped if consumers import it.
- `peerDependencies` are react / react-dom / @base-ui/react. `clsx` is the only runtime dep.

### Stack-specific gotchas

- **TypeScript 6** with `ignoreDeprecations: "6.0"` in `tsconfig.base.json` — required because tsup's `rollup-plugin-dts` still uses the deprecated `baseUrl`. Don't remove the flag until that toolchain catches up.
- **`@base-ui/react@^1.5.0`** — the package was renamed from `@base-ui-components/react` (deprecated) to `@base-ui/react` at the 1.0 stable release (2025-12-11). Import paths use the new scope: `@base-ui/react/<primitive>`.
- **No CSS build dependency in consumers.** `dist/styles.css` is a flat, plain-CSS file. Consumers don't need PostCSS, Tailwind, or any preprocessor — `import "@bubble-design-system/ui/styles.css"` (or `@import` from another CSS file) is the only setup. This is the load-bearing simplification vs. the previous Tailwind-based shape (`@bubble-design-system/ui/preset.css`, which required Tailwind v4 as a peerDep).
- **`box-sizing: border-box`** is set globally in `base.css` because component CSS assumes it. If a consumer's reset undoes it, layout will drift.

## Verification

After any non-trivial change, run the full sequence in `PROGRESS.md` §7 — it covers typecheck, build, dist-file presence, package-export resolution, docs typecheck, and a manual browser check that toggling `data-theme` / `data-brand` / `data-radius` / `data-density` re-skins the gallery live. Runtime token switching is the load-bearing behaviour; it stays working as long as no rule hard-codes a value instead of `var(--…)`.
