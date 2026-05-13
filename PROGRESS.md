# Plain Design System — Progress

> Read this first when resuming work. It catches you up on every decision, what's done, what's next, and how to verify everything still works.

**Last updated:** 2026-05-13

---

## 1. What this project is

A neutral, minimal, token-driven design system built as a **portfolio + learning piece**. Architecturally inspired by shadcn/ui: **Base UI** provides headless primitives (a11y, keyboard, state), **Tailwind v4** provides styling, and users override defaults by passing `className` to any component. Goal: serve as a clean base layer that future projects can extend or rebrand.

---

## 2. Status

### Done
- [x] Monorepo skeleton (pnpm workspaces)
- [x] Root `package.json` + `pnpm-workspace.yaml` + `.gitignore`
- [x] `packages/ui/` scaffolded with library-style `package.json` (exports, peerDeps, sideEffects, files, publishConfig)
- [x] Shared `tsconfig.base.json` + package-level `tsconfig.json` extending it
- [x] tsup build pipeline — emits `dist/index.js` (ESM) + `dist/index.cjs` (CJS) + types per format (`.d.ts` / `.d.cts`)
- [x] `cn()` utility (clsx + tailwind-merge) — typechecked and built
- [x] Build verified end-to-end with `pnpm -C packages/ui build`
- [x] Per-format type resolution in `exports` field (modern conditional exports pattern)

### Todo (in order)
- [ ] Create `packages/ui/src/preset.css` with Tailwind v4 `@theme {}` containing the token spec (6 color families × 11 shades, spacing, radius, typography)
- [ ] Update `tsup.config.ts` to copy `preset.css` → `dist/preset.css` on build
- [ ] Verify `dist/preset.css` exists after build
- [ ] Write first component: **Button** (primary / secondary / destructive / ghost variants, sm / md / lg sizes)
- [ ] Scaffold `apps/docs` (Next.js or Storybook) to preview components live
- [ ] Continue MVP component list: Input, Textarea, Checkbox, Radio, Select, Card, Badge, Avatar, Divider
- [ ] Second batch: Modal, Toast, Tooltip, Tabs, Switch, Alert, Dropdown Menu, Skeleton

---

## 3. Architecture decisions (chronological, with the why)

### 3.1 Styled library, not headless
- **Decision:** ship a library that includes default styling (visual is part of the product), not pure headless primitives.
- **Why:** Workflow is "designer hands over a spec → frontend dev encodes it into code". The token spec (colors, principles, shades) is the *product*. Headless libs serve a different goal (infrastructure for *other* design systems).

### 3.2 Monorepo with pnpm workspaces
- **Decision:** structure as `packages/ui` + (future) `apps/docs`, managed by pnpm workspaces.
- **Why:** Every real design system (Radix, Mantine, shadcn, Polaris, Chakra) uses a monorepo because the library and its docs/playground need separate dependency surfaces. Single-repo would bleed Storybook/Next.js deps into the published lib.

### 3.3 shadcn-style (Base UI + Tailwind v4 + className override) — *pivoted*
- **Initial direction:** styled lib with Tailwind v4 used *internally* and a single compiled `styles.css` shipped to users.
- **Final direction:** shadcn pattern — components built on Base UI (headless primitives), styled with Tailwind classes, users override via `className` prop.
- **Why pivoted:** the original plan would have required a Tailwind prefix for collision avoidance and didn't reuse a headless layer. The shadcn pattern is more idiomatic in 2026, easier to override, and matches the user's stated desire for "user can pass custom class to override".
- **Trade-off accepted:** users **must** have Tailwind in their app. That's the cost of this architecture.

### 3.4 Tailwind v4 (not v3)
- **Decision:** Tailwind v4 with CSS-first `@theme {}` config.
- **Why:** v4 is stable since early 2025. CSS-first config means the existing token spec (already in CSS custom properties form) maps directly to `@theme` — no JS preset, no duplication of token values. Also: 5× faster builds, smaller output.

### 3.5 `cn()` utility = clsx + tailwind-merge
- **Decision:** every component uses `cn(...)` to compose its classes, with user-provided `className` last.
- **Why:** `tailwind-merge` resolves Tailwind class conflicts predictably (`cn("p-4", "p-8")` → `"p-8"`). Without it, both classes ship to the DOM and cascade order decides — fragile. With it, later args cleanly replace earlier ones, so user overrides via `className` always win.

### 3.6 ESM + CJS dual output, types per format
- **Decision:** ship both ESM and CJS, with `.d.ts` for ESM consumers and `.d.cts` for CJS consumers.
- **Why:** max consumer compatibility. The per-format types are required for strict `"moduleResolution": "NodeNext"` consumers — otherwise they'd see "ESM types in a CJS context" errors.

### 3.7 TypeScript 6 with `ignoreDeprecations: "6.0"`
- **Decision:** stay on TS 6, suppress the `baseUrl` deprecation warning via the official migration flag.
- **Why:** `tsup` (via `rollup-plugin-dts`) uses `baseUrl` internally for type resolution and hasn't been updated for TS 6 yet. The flag is exactly designed for this kind of tool lag. Downgrading TS was the alternative; chose to keep TS 6 and revisit when the toolchain catches up.

---

## 4. Stack & versions

| Tool | Version | Role |
|---|---|---|
| pnpm | 10.33.0 | Package manager + workspaces |
| Node | 25.9.0 (engines: `>=20`) | Runtime |
| TypeScript | 6.0.3 | Language (with `ignoreDeprecations: "6.0"`) |
| tsup | 8.5.1 | Library bundler (esbuild + rollup-plugin-dts) |
| Tailwind CSS | 4.3.0 | Styling — v4 with CSS-first `@theme` config |
| @base-ui-components/react | 1.0.0-rc.0 | Headless primitives (peer dep) |
| React / React DOM | 19.2.6 | Peer dep (`>=18.2`) |
| clsx | 2.1.1 | Class composition (regular dep) |
| tailwind-merge | 3.6.0 | Tailwind class conflict resolution (regular dep) |

**Note on Base UI rc.0:** npm flags it as deprecated, but it's still the latest published version — works fine. Bump when stable 1.0.0 ships.

---

## 5. Files map

```
plain-design-system/
├── package.json                    # workspace root — private: true, pnpm.onlyBuiltDependencies: [esbuild]
├── pnpm-workspace.yaml             # packages: [packages/*, apps/*]
├── pnpm-lock.yaml                  # committed lockfile (34KB)
├── tsconfig.base.json              # shared TS settings (strict, ES2022, jsx: react-jsx, noEmit: true, ignoreDeprecations: "6.0")
├── .gitignore                      # node_modules, dist, .DS_Store, etc.
├── PROGRESS.md                     # ← this file
│
├── node_modules/                   # pnpm: virtual store at .pnpm/, symlinks in packages/ui/node_modules/
│
└── packages/
    └── ui/
        ├── package.json            # name: @plain-ds/ui, exports per-format, peerDeps: react/dom/tailwind/base-ui, deps: clsx + tailwind-merge
        ├── tsconfig.json           # extends ../../tsconfig.base.json, rootDir/outDir set
        ├── tsup.config.ts          # entry: src/index.ts, format: [esm, cjs], dts: true, external: peerDeps
        ├── src/
        │   ├── index.ts            # exports cn (only export so far)
        │   └── utils/
        │       └── cn.ts           # the clsx + tailwind-merge utility
        └── dist/                   # generated by `pnpm build` — gitignored
            ├── index.js + .map     # ESM bundle
            ├── index.cjs + .map    # CJS bundle
            ├── index.d.ts          # ESM types
            └── index.d.cts         # CJS types
```

---

## 6. Spec reference docs

Source of truth for design decisions (tokens, principles, MVP scope). **Always check these before making design decisions.**

| File | What's in it |
|---|---|
| `/Users/gade/Downloads/files2/design-system-fundamentals.md` | Base knowledge: token hierarchy (3 layers), color system, action hierarchy, naming conventions |
| `/Users/gade/Downloads/files2/design-system-spec.md` | The actual blueprint: cool gray + brand blue, 6 color families × 11 shades, 3-layer token architecture, MVP component list, design principles |
| `/Users/gade/Downloads/files2/learning-notes.md` | Mental models the user already absorbed + mistakes they've already learned from |

---

## 7. Verification — confirm the project is healthy

Run these and expect clean exit codes:

```bash
cd /Users/gade/Projects/Frontend/plain-design-system

# 1. Install deps (skip if node_modules already populated)
pnpm install

# 2. Typecheck packages/ui
pnpm -C packages/ui typecheck
# → expect no output (success)

# 3. Build packages/ui
pnpm -C packages/ui build
# → expect:
#   ESM dist/index.js      ~233 B
#   CJS dist/index.cjs     ~275 B
#   DTS dist/index.d.ts    ~371 B
#   DTS dist/index.d.cts   ~371 B

# 4. Confirm dist contents
ls packages/ui/dist/
# → index.js, index.cjs, index.d.ts, index.d.cts + sourcemaps
```

If any step fails, that's a regression. Compare against the file states described in `Files map` above.

---

## 8. What's next (very specific)

The next session's first concrete tasks:

### Task 1: Create `packages/ui/src/preset.css`

Tailwind v4's CSS-first config. Structure:

```css
@import "tailwindcss";

@theme {
  /* === Color families (6 × 11 shades) === */
  /* Cool gray (Slate) — workhorse */
  --color-gray-50:  #F8FAFC;
  --color-gray-100: #F1F5F9;
  /* ... etc through gray-950 */

  /* Brand (Blue) */
  --color-brand-50:  #EFF6FF;
  /* ... etc */

  /* Success (Green), Warning (Amber), Danger (Red), Info — see spec */

  /* === Semantic tokens === */
  --color-bg-primary:    var(--color-white);
  --color-bg-brand:      var(--color-brand-600);
  --color-text-primary:  var(--color-gray-900);
  /* ... etc per spec section 5 (Layer 2 — Semantic Tokens) */
}
```

Pull all primitive shade values from `design-system-spec.md` section 4.3 (Cool Gray Reference) and Tailwind's standard palettes for blue/green/amber/red. Pull semantic mappings from spec section 5 (Layer 2).

### Task 2: Update `tsup.config.ts` to ship preset.css

tsup doesn't bundle CSS by default. Add a copy step. Options:
- Use `onSuccess` hook with a shell `cp` command
- Use a tsup plugin like `tsup-plugin-static-files`
- Or just use `cp` in the `build` script in `package.json`

Simplest: extend the build script:
```json
"build": "tsup && cp src/preset.css dist/preset.css"
```

### Task 3: Verify
```bash
pnpm -C packages/ui build
ls packages/ui/dist/preset.css   # should exist
```

### Task 4: First component
Once preset.css works, write `src/components/Button.tsx` using Base UI's Button primitive + Tailwind classes + `cn()` for className override. Reference the action-hierarchy section in `design-system-fundamentals.md` for variant naming (primary / secondary / destructive).

---

## 9. How to resume in a fresh Claude chat

**Suggested opening message:**

> Continue work on `plain-design-system`. Read `/Users/gade/Projects/Frontend/plain-design-system/PROGRESS.md` for full context.
>
> Also attach for token values: `/Users/gade/Downloads/files2/design-system-spec.md`.
>
> Next step: create `packages/ui/src/preset.css` per section 8 of PROGRESS.md.

**Teaching style reminder for Claude:**
- Interview/audit-friendly — ask before answering, challenge with quizzes
- Small steps — don't dump info; pause for each decision
- Give 2–3 options with honest trade-offs, recommend one with reasoning
- Audit own claims when asked — don't pad with weak reasons
- Respond in English (was bilingual TH/EN earlier, switched mid-session)

---

## 10. Open questions / things to revisit later

- Bump `@base-ui-components/react` to stable `1.0.0` when published
- Remove `ignoreDeprecations: "6.0"` from `tsconfig.base.json` when tsup/rollup-plugin-dts drop `baseUrl` usage
- Decide on docs framework (Storybook vs Next.js) when scaffolding `apps/docs`
- Consider whether to add `Turborepo` for build caching once there's more than 1 package
- License: currently `MIT` in `packages/ui/package.json` — confirm or change before first publish
