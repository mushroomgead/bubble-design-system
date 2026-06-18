# ADR-0002: Styled library, not headless primitives

## Status

Accepted

## Date

2026-05-13

## Context

A design-system library can ship in roughly two shapes: a **headless**
primitives library (à la Radix UI / Base UI / Headless UI) that provides
accessibility, keyboard handling, and state but no default visual styling, or
a **styled** library that ships an opinionated default look alongside that
behavior.

This project models the workflow "a designer hands over a visual spec → a
frontend dev encodes it into a component library." The design-token sheet and
the resulting visual language (colors, shadows, radii, the Bubble identity —
see [ADR-0006](0006-bubble-rebrand-soft-tone.md)) are the actual deliverable
of that workflow, not an optional skin on top of something else.

## Decision

Ship `@bubble-design-system/ui` as a **styled** library: every component has
a default visual appearance driven by `tokens.css`, and that appearance is
part of the product.

## Alternatives Considered

### Headless-only (Radix UI / Base UI / Headless UI pattern)

- Pros: maximum flexibility for downstream consumers to apply their own design
  system on top
- Cons: serves a different goal — it's infrastructure _for_ other design
  systems, not a design system itself
- Rejected: it would discard the actual deliverable (the token spec and visual
  language) and turn the library into a thin re-export of Base UI

## Consequences

- `tokens.css` and the Bubble visual identity are first-class product
  surfaces, not "just a demo theme."
- "Styled" describes the CSS layer only — internally, every component still
  wraps a headless Base UI primitive for accessibility, keyboard handling, and
  state (see the component-authoring rules in `CLAUDE.md`).
- Consumers are not locked in: they can override via `className` and the
  `data-*` token axes (see [ADR-0005](0005-adopt-spec-token-names.md) and
  [ADR-0007](0007-hand-authored-css-no-tailwind.md)) — "styled" does not mean
  "unconfigurable."

## Related

- `PROGRESS.md` §3.1
