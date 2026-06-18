# ADR-0004: TypeScript 6 with `ignoreDeprecations: "6.0"`

## Status

Accepted — revisit when tooling catches up (see Consequences)

## Date

2026-05-13

## Context

`tsup`'s type-bundling step (`rollup-plugin-dts`) relies on the `baseUrl`
compiler option for type resolution. TypeScript 6 deprecated `baseUrl` and, by
default, surfaces that as a build-blocking deprecation diagnostic with no
narrower opt-out than the blanket `ignoreDeprecations` flag.

## Decision

Stay on TypeScript 6 and add `ignoreDeprecations: "6.0"` to
`tsconfig.base.json` to suppress the `baseUrl` deprecation diagnostic, rather
than downgrading the TypeScript version.

## Alternatives Considered

### Downgrade to TypeScript 5.x

- Pros: avoids the deprecation entirely, no suppression flag needed
- Cons: moves the whole project off the current major version — and its
  language/lib improvements — to work around a single tool's lag
- Rejected: `ignoreDeprecations` is the officially-provided migration escape
  hatch for exactly this kind of "dependency hasn't caught up yet" situation

## Consequences

- One extra compiler flag in `tsconfig.base.json`; no functional impact on
  emitted code today.
- Tracked as an open item in `PROGRESS.md` §10: remove
  `ignoreDeprecations: "6.0"` once `tsup`/`rollup-plugin-dts` stop relying on
  `baseUrl`. At that point this ADR becomes moot (the flag is simply deleted)
  rather than reversed — the underlying decision ("stay on TS 6, don't
  downgrade") doesn't change.

## Related

- `PROGRESS.md` §3.7
