# ADR-0005: Adopt the design spec's token names verbatim

## Status

Accepted

## Date

2026-05-14

## Context

On 2026-05-13, Layer-2 semantic tokens were given flattened, shadcn-idiom
names (`--color-surface`, `--color-content`, `--color-line`) to avoid
verbose-looking utilities such as `bg-bg-primary`.

The next day, the user provided a complete, hand-designed `tokens.css` (558
lines) covering multi-gray, multi-brand, light/dark themes, radius/density/
font axes, and typography/spacing/shadow/motion scales — using the original
spec's naming convention: `--color-bg-primary`, `--color-text-on-brand`,
`--color-border-focus`, etc.

Per [ADR-0002](0002-styled-library-not-headless.md), the design tokens _are_
the product. A translation layer between the spec's names and the code's names
would mean the two drift out of lockstep.

## Decision

Use the user-authored `tokens.css` verbatim, adopting its naming convention —
`--color-bg-*` / `--color-text-*` / `--color-border-*` — as the canonical
token names in code. This reverses the 2026-05-13 flattened-name decision.

## Alternatives Considered

### Keep the flattened shadcn-style names, map the spec onto them

- Pros: utilities read less "redundant" (`bg-surface` vs. `bg-bg-brand`)
- Cons: breaks 1:1 fidelity between the design spec and the code; any future
  Figma-sync or token-documentation tooling would need a translation table;
  the tokens (the actual product) would diverge from their source of truth
- Rejected: the ergonomic concern is real but subordinate to source-of-truth
  fidelity — and fades once the convention ("the second prefix is the token
  category") is internalized

## Consequences

- Names like `bg-bg-brand`, `text-text-on-brand`, `border-border-focus` look
  redundant at first glance, but `tokens.css` is now a direct, lossless mirror
  of the design spec — any tooling that reads the spec can treat `tokens.css`
  as canonical with no translation step.
- This fidelity-first principle governs all later token additions, including
  the `data-tone` axis introduced in
  [ADR-0006](0006-bubble-rebrand-soft-tone.md) — new tokens are added under
  the same naming scheme rather than shortened.

## Related

- `PROGRESS.md` §3.8 (the reversed decision), §3.9 (this decision)
