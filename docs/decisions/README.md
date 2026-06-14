# Architecture Decision Records

This directory holds ADRs for the significant, hard-to-reverse architectural
decisions behind `@bubble-design-system/ui` and `apps/docs` — the decisions
that are still in force today, with their context, the alternatives that were
considered, and their consequences.

## Index

| ADR                                              | Decision                                                 |
| ------------------------------------------------ | -------------------------------------------------------- |
| [0001](0001-monorepo-pnpm-workspaces.md)         | Monorepo with pnpm workspaces                            |
| [0002](0002-styled-library-not-headless.md)      | Styled library, not headless primitives                  |
| [0003](0003-esm-cjs-dual-output.md)              | ESM + CJS dual output with per-format type declarations  |
| [0004](0004-typescript-6-ignore-deprecations.md) | TypeScript 6 with `ignoreDeprecations: "6.0"`            |
| [0005](0005-adopt-spec-token-names.md)           | Adopt the design spec's token names verbatim             |
| [0006](0006-bubble-rebrand-soft-tone.md)         | Bubble rebrand — soft-tone identity and `data-tone` axis |
| [0007](0007-hand-authored-css-no-tailwind.md)    | Single hand-authored CSS bundle, no Tailwind dependency  |
| [0008](0008-prettier-eslint-static-gates.md)     | Prettier + ESLint static gates via a Claude Code hook    |

## Relationship to `PROGRESS.md`

`PROGRESS.md` §3 is the full chronological decision log — every decision made
on this project, in the order it was made, including ones that were later
reversed or superseded (it's the "how we got here" record).

This directory is a curated extract: one file per decision that is **still in
force**, each cross-linking back to its `PROGRESS.md` §3 entry (and vice
versa). Decisions that were reversed before they "stuck" (e.g. an early
token-naming choice that was reversed the next day) are folded into the
**Alternatives Considered** / context of the ADR that replaced them, rather
than getting their own file.

When making a new significant architectural decision:

1. Record it in `PROGRESS.md` §3 as usual (full narrative, with the date and
   why).
2. If it's the kind of decision that should stand on its own as a reference —
   choice of framework/dependency, data model, public API shape, anything
   expensive to reverse — also add an ADR here using
   [`template.md`](template.md), and cross-link both ways.

## Numbering and lifecycle

- Files are numbered sequentially, zero-padded to 4 digits:
  `NNNN-short-title.md`. Numbers are never reused.
- **Status** is one of:
  - `Proposed` — written but not yet acted on
  - `Accepted` — the decision is in effect
  - `Superseded by ADR-XXXX` — replaced by a later ADR (don't delete the old
    file; it's still useful history)
  - `Deprecated` — no longer relevant, but kept for history
