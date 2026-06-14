# ADR-0001: Monorepo with pnpm workspaces

## Status

Accepted

## Date

2026-05-13

## Context

The project needs a published library (`@bubble-design-system/ui`) and a
docs/playground app that consumes it. The docs app (Next.js, MDX, etc.) has a
completely different dependency surface than the library, and the library
must stay free of docs-only dependencies.

## Decision

Structure the project as a pnpm-workspaces monorepo with two workspaces:

- `packages/ui` — the published library
- `apps/docs` — a Next.js + MDX app that consumes the library via
  `workspace:*`

## Alternatives Considered

### Single repo / single package

- Pros: simplest possible setup, no workspace tooling
- Cons: docs/playground dependencies (Next.js, MDX, Storybook, etc.) would
  bleed into the published package's dependency tree, or require careful
  manual devDependency discipline that's easy to get wrong
- Rejected: every comparable real design system (Radix, Mantine, shadcn,
  Polaris, Chakra) uses a monorepo for exactly this reason

### Separate repos for the library and the docs app

- Pros: hard separation, no risk of cross-contamination
- Cons: no `workspace:*` linking — every docs change against an in-progress
  library change would require publishing or `npm link`-style workarounds
- Rejected: too much friction for iterating on the library and its docs
  together

## Consequences

- `apps/docs` depends on `@bubble-design-system/ui` via `workspace:*`, so the
  docs app always exercises the latest local library code with no publish
  step.
- Each workspace gets its own tooling config where tools resolve per-directory
  (e.g. ESLint flat config — see
  [ADR-0008](0008-prettier-eslint-static-gates.md)).
- Open question (tracked in `PROGRESS.md` §10): whether to add Turborepo for
  build caching once there's more than one package in `packages/`.

## Related

- `PROGRESS.md` §3.2
