# ADR-0008: Prettier + ESLint as static gates, enforced via a Claude Code hook

## Status

Accepted

## Date

2026-06-13

## Context

The repo had no formatter or linter — `tsc --noEmit` was the only static gate.
Hand-formatted CSS (`tokens.css`) had drifted (mixed hex case, manually-aligned
columns), and there was no automated check for unused imports, hook-rule
violations, or other lint issues.

## Decision

- Add **Prettier** as a single root config (`.prettierrc.json`), applied
  repo-wide via `pnpm format` / `pnpm format:check`.
- Add **ESLint 9 flat config**, with a separate `eslint.config.mjs` per
  workspace (`packages/ui`, `apps/docs`), because flat-config resolution is
  cwd-based rather than file-based — a single root config wouldn't resolve
  when ESLint is invoked from a workspace directory.
- Pin `eslint` and `@eslint/js` to `9.39.4` (not 10.x) for peer-dependency
  compatibility with `eslint-plugin-react` and `eslint-config-next`'s
  transitive dependencies.
- Wire both into `.claude/hooks/format-and-lint.mjs`, a `PostToolUse` hook
  (on `Edit | MultiEdit | Write`) that runs Prettier `--write` on the touched
  file and, for JS/TS files under `packages/ui` or `apps/docs`, runs
  `eslint --fix` with `cwd` set to that workspace. If lint errors remain after
  `--fix`, the hook exits 2 so the error is fed back into the conversation.

## Alternatives Considered

### Single shared root ESLint config

- Rejected: flat-config resolution is cwd-based — `eslint <file>` run from the
  repo root cannot find `packages/ui/eslint.config.mjs`, even though that
  directory has one. Each workspace needs its own config.

### ESLint 10.x

- Rejected for now: produces unmet-peer-dependency warnings —
  `eslint-plugin-react` caps at `^9.7`, and `eslint-config-next` transitively
  depends on packages capped at `^9`. Revisit once those plugins ship
  v10-compatible releases.

### Rewrite the `interface FooProps extends BaseProps {}` re-export pattern

- This pattern (used 8× across `Card.tsx` and `StatusPill.tsx`) trips
  `@typescript-eslint/no-empty-object-type` by default.
- Rejected: rewriting an established, working pattern was out of scope for a
  tooling change. Instead the rule is configured with
  `allowInterfaces: "with-single-extends"`.

### Manual `pnpm format` / `pnpm lint` discipline, no hook

- Rejected: relies on remembering to run it. The hook makes formatting and
  linting automatic and gives Claude blocking feedback in the same turn if
  lint errors remain after auto-fix.

## Consequences

- Every Edit/MultiEdit/Write Claude performs on a Prettier-supported file is
  auto-formatted; JS/TS files under `packages/ui`/`apps/docs` additionally get
  `eslint --fix` plus a check, with remaining errors surfaced as blocking
  feedback (exit 2).
- A one-time repo-wide reformat (`pnpm exec prettier --write .`) touched 42
  files, including an 854-line diff to `tokens.css` (hex lowercasing, removing
  hand-aligned columns) — a deliberate "clean baseline" choice rather than
  excluding files.
- `apps/docs/eslint.config.mjs` deliberately omits `@eslint/js`'s recommended
  config (it false-positives on TypeScript's ambient `React` namespace), and
  `react-hooks/set-state-in-effect` (new in `eslint-plugin-react-hooks` v7)
  required one documented suppression in `ThemeBar.tsx` for a legitimate
  SSR-sync pattern.

## Related

- `PROGRESS.md` §3.14
