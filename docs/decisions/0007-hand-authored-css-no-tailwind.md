# ADR-0007: Single hand-authored CSS bundle, no Tailwind dependency

## Status

Accepted

## Date

2026-06-04

## Context

The library originally followed a shadcn-style architecture established on
2026-05-13 and extended on 2026-05-14:

- Components built on Base UI (headless primitives, per
  [ADR-0002](0002-styled-library-not-headless.md))
- Styled with Tailwind v4 utility classes
- Design tokens wired into Tailwind via `@theme inline {}`, so `data-*`
  attribute switching (per [ADR-0005](0005-adopt-spec-token-names.md) and
  [ADR-0006](0006-bubble-rebrand-soft-tone.md)) worked without a rebuild
- `cn()` = `clsx` + `tailwind-merge`, with consumers overriding styling via
  `className` + Tailwind utility precedence

This required every consumer app to install and configure
`tailwindcss >= 4.0`, import the library's preset, and add a Tailwind
`@source` directive so Tailwind would scan the library's bundled JS for
utility classes — a substantial install/configuration burden for a UI
library, and it exposed the library to future Tailwind major-version churn
(the v3 → v4 migration had already been non-trivial).

## Decision

Remove Tailwind v4 and `tailwind-merge` from both `packages/ui` and
`apps/docs`. The library ships a single flat `dist/styles.css` — design
tokens + a minimal reset (`base.css`) + every component's hand-authored CSS,
keyed by stable BEM class names (`.pds-btn`, `.pds-btn--primary`,
`.pds-card__header`, …) — produced by a zero-dependency
`scripts/build-css.mjs` that concatenates `tokens.css` + `base.css` + each
`src/components/*.css` (alphabetically). Consumers do a single
`@import "@bubble-design-system/ui/styles.css"`, with no PostCSS or Tailwind
configuration. `cn()` shrinks to a thin `clsx`-only wrapper. The `./preset.css`
export is renamed to `./styles.css` (a breaking change, hence the `0.2.0`
version bump).

## Alternatives Considered

### Keep Tailwind v4 + `@theme inline {}` (the original architecture)

- Pros: familiar utility-class authoring workflow; `tailwind-merge` gave
  predictable override resolution
- Cons: every consumer needs Tailwind installed, configured, and pointed at
  the library's source via `@source`; `tailwind-merge` (~15 KB minified) was
  the heaviest runtime dependency; future Tailwind majors would block library
  releases
- Rejected: the peer-dependency and cross-package config burden was judged too
  heavy for a UI library

### Author with Tailwind internally, pre-compile to static CSS for consumers

- Pros: consumers wouldn't need Tailwind; authoring stays utility-class-based
- Cons: still leaves the authoring workflow (and thus the project) exposed to
  future Tailwind major-version churn — only half the dependency is removed
- Rejected: removing the dependency end-to-end was preferred over removing it
  only for consumers

## Consequences

- **Override model changes.** Consumers override component styling with a
  plain CSS rule against a class like `.pds-btn--primary` (specificity 0,1,0,
  deterministic) instead of stringing Tailwind utilities through
  `tailwind-merge`. Ad-hoc variant composition via utility strings at the
  use-site is no longer possible.
- **Token-driven runtime theming is preserved.** `tokens.css` is unchanged;
  every component CSS rule reads `var(--color-bg-brand)` etc. at use-site, so
  all `data-*` axis switching (including `data-tone` from
  [ADR-0006](0006-bubble-rebrand-soft-tone.md)) keeps working with zero
  regression.
- Net code volume increased — roughly 233 Tailwind utility strings became
  ~1300 lines of hand-authored CSS across 21+ files — in exchange for an
  explicit, greppable cascade and zero consumer build dependency.
- `sideEffects` in `package.json` changed from `false` to
  `["./dist/styles.css", "./dist/tokens.css"]` so bundlers tree-shake the JS
  but retain the CSS when imported.
- All later component additions (Popover, DataTable, CommandPalette, Chat)
  follow this CSS-file-per-component, `var(--…)`-only convention, including a
  "no `[data-tone="soft"]` overrides" rule: shadow-only elevation and
  `--ctrl-radius` are already tone-aware via the
  [ADR-0006](0006-bubble-rebrand-soft-tone.md) token axis, so components don't
  need per-tone CSS branches.

## Related

- `PROGRESS.md` §3.3, §3.4, §3.5, §3.10 (the superseded Tailwind-based
  decisions), §3.13 (this decision)
