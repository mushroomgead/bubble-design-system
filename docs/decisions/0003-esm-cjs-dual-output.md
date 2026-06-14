# ADR-0003: ESM + CJS dual output with per-format type declarations

## Status

Accepted

## Date

2026-05-13

## Context

`@bubble-design-system/ui` is a published npm package. Consumers may be on
ESM (`"type": "module"`, `moduleResolution: "bundler"` or `"NodeNext"`) or CJS
(`require`). Under strict `"moduleResolution": "NodeNext"`, a single set of
type declarations shared between formats produces "ESM types used in a CJS
context" errors.

## Decision

Build with `tsup` to emit both:

- `dist/index.js` (ESM) with `dist/index.d.ts`
- `dist/index.cjs` (CJS) with `dist/index.d.cts`

and wire `package.json`'s `exports` field with conditional `import`/`require`
entries, each pointing at its own `types` declaration file.

## Alternatives Considered

### ESM-only output

- Pros: simpler build, smaller `dist/`
- Cons: breaks for any consumer still on CJS (older Next.js/CRA setups, etc.)
- Rejected: too narrow for a published library aimed at broad consumption

### Single shared `.d.ts` for both formats

- Pros: less build configuration
- Cons: fails under strict `"moduleResolution": "NodeNext"`, which is the
  modern, recommended TS consumer configuration
- Rejected: would push the compatibility problem onto consumers using the
  "correct" config

## Consequences

- `dist/` contains two JS bundles and two sets of type declarations; `tsup`
  generates all of this automatically from one `tsup.config.ts`, so the
  ongoing cost is near zero.
- The verification checklist in `PROGRESS.md` §7 explicitly resolves both
  `require()` and `import` paths for `styles.css`/`tokens.css` to confirm the
  `exports` field is wired correctly for both formats.

## Related

- `PROGRESS.md` §3.6
