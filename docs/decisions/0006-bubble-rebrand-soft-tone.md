# ADR-0006: Bubble rebrand — soft-tone floating-pill identity and the `data-tone` axis

## Status

Accepted

## Date

2026-06-03

## Context

The library's original ("Plain") visual identity was a flat, shadcn-like
look. An Anthropic-bundled design handoff (a "bubble-design-system" project
from claude.ai/design) introduced a new identity: a soft-gray page with
white, pill-shaped floating surfaces (layered shadows with an inset white
top-highlight), a teal `#00CEC8` brand color, and a pink → magenta → violet
gradient blob mark.

Separately, on 2026-05-16, `Textarea` and `Card` had been dropped from the MVP
component list — `Card` on the grounds that it could be expressed with
utility classes plus density tokens, `Textarea` on the grounds that it could
fold into `Input` as a `multiline` variant.

## Decision

Adopt the Bubble identity as the new canonical default
(`tone=soft · brand=teal · gray=slate · radius=default · density=default ·
light`, font axis settled later), and introduce a net-new `data-tone` token
axis with three values:

- `soft` — the new default/signature look: pill controls via
  `--ctrl-radius: 9999px`, layered shadows with an inset white top-highlight,
  gray page (`--color-bg-page`), white floating surfaces
- `vivid` — the previous flat "Plain" look, single-layer shadows
- `pastel` — warm, desaturated, off-white surfaces

All three are wired through the existing token-switching mechanism so they
re-skin live with no rebuild, alongside `data-theme`/`data-gray`/`data-brand`/
`data-radius`/`data-density`/`data-font`.

As part of this, **reinstate `Card` and `Textarea`**, reversing the 2026-05-16
removal — the soft-pill `Card` is the literal embodiment of the new identity.
Also add `StatusPill`, `Segmented`, and layout primitives (`Container`,
`Grid`, `Grid.Col`).

## Alternatives Considered

### Treat Bubble as an optional alternate theme, keep "Plain" as the identity

- Pros: no rebrand, smaller change
- Cons: the soft-pill look isn't just a different color palette — it needs
  pill radii, a layered-shadow recipe, a gradient mark, and a dedicated page
  background, none of which fit cleanly into the existing `data-brand` axis
- Rejected: under-delivers the spec; the look needed its own token axis
  (`data-tone`), not a `data-brand` value

### Reuse the design bundle's component code directly

- Pros: less re-implementation work
- Cons: the bundle is vanilla JSX + plain CSS classes with no Base UI, no
  Tailwind, no `cn()` — adopting it as-is would violate
  [ADR-0002](0002-styled-library-not-headless.md)'s "styled, but built on
  headless primitives" stance and the existing component-authoring
  conventions
- Rejected: only the visual spec and component _shapes_ transfer; components
  are re-derived through the existing Base UI + `cn()` + BEM-CSS pattern

### Adopt the bundle's centralized icon module (10 icons)

- Rejected: components keep their existing inline SVGs; consumers bring their
  own icons (e.g. Lucide, which matches the stroke weight and rounded caps)

## Consequences

- `data-tone` becomes a permanent fourth visual axis, wired the same way as
  the others — switching it re-skins the gallery live with no rebuild.
- Package-level rebrand: new npm scope, `apps/docs` renamed, and the
  localStorage key for persisted theme state bumped so existing visitors don't
  load stale state under the old key.
- `Card` (compound: `Header`/`Title`/`Description`/`Action`/`Body`/`Footer`)
  and `Textarea` are back in the component set.
- Only `Button` needed direct visual edits for the new identity — every other
  existing component re-skinned automatically through the token cascade,
  validating the token-driven approach from
  [ADR-0005](0005-adopt-spec-token-names.md).
- Remaining user-driven follow-up (not done automatically): deprecate the old
  npm package name in favor of the new one.

## Related

- `PROGRESS.md` §3.11 (the reversed decision), §3.12 (this decision)
