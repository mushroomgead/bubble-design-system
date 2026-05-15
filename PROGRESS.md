# Plain Design System — Progress

> Read this first when resuming work. It catches you up on every decision, what's done, what's next, and how to verify everything still works.

**Last updated:** 2026-05-15

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
- [x] `packages/ui/src/preset.css` — initial Tailwind v4 `@theme {}` with 6 color families + flat semantic tokens. Build script copies it to `dist/preset.css`. *Superseded 2026-05-14 — see "Adopted user-provided tokens.css" entry below.*
- [x] **Button** component — `packages/ui/src/components/Button.tsx`. Wraps Base UI's `Button` primitive. Variants: `primary` / `secondary` / `destructive` / `ghost`. Sizes: `sm` / `md` / `lg`. `forwardRef<HTMLElement>` to match Base UI. `className` narrowed to `string`. Handles both `disabled:` and `data-[disabled]:` states. Exported from `src/index.ts` along with `ButtonProps` type.
- [x] **`apps/docs`** — Next.js 16 + MDX scaffold consuming `@plain-ds/ui` via `workspace:*`. Tailwind v4 wired through `@tailwindcss/postcss`; `globals.css` imports `@plain-ds/ui/preset.css` and uses `@source "../../../packages/ui/src/**/*.{ts,tsx}"` so Tailwind picks up classes from the lib source (no rebuild needed during dev). Gallery at `app/page.tsx` renders Button variants × sizes × states + className-override examples. `pnpm -C apps/docs dev` boots on port 3000.
- [x] **Adopted user-provided `tokens.css`** (full design-token sheet, vendored at `packages/ui/src/tokens.css`). 558 lines of `:root` / `[data-*]` rules covering multi-gray (slate/neutral/stone), multi-brand (blue/violet/emerald/orange/mono), light + dark themes, multi-radius (default/sharp/soft/pill), multi-density (default/compact/comfortable), multi-font (geist/plex/system), plus typography / spacing / shadow / motion scales. Registered with Tailwind v4 via `@theme inline {}` in `preset.css` so every utility resolves through `var(...)` and switches live with `[data-*]` attributes (no rebuild). Button + docs gallery updated to the new token-aligned utility names (`bg-bg-brand`, `text-text-on-brand`, `shadow-focus`, etc.). Docs `<html>` sets all six data-attribute defaults. **This also closed spec §7 Phase 2** (typography, spacing, radius, shadow, motion primitives are all present in tokens.css).

### Todo (in order)
- [ ] Continue MVP components — first batch: Input, Textarea, Checkbox, Radio, Select, Card, Badge, Avatar, Divider
- [ ] MVP second batch: Modal, Toast, Tooltip, Tabs, Switch, Alert, Dropdown Menu, Skeleton
- [ ] Add a UI toggle in `apps/docs` for theme / brand / radius / density / font (currently driven via DevTools snippets)
- [ ] Push the 2 unpushed commits to origin once the above feels stable

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

### 3.8 ~~Flatten semantic-token names~~ → REVERSED by §3.9
- **Original decision (2026-05-13):** Layer 2 tokens use flat shadcn-idiom names (`--color-surface`, `--color-content`, `--color-line`) to avoid ugly Tailwind utilities like `bg-bg-primary`.
- **Status:** Reversed on 2026-05-14. See §3.9.

### 3.9 Reverse §3.8 — adopt the spec's `--color-bg-*` / `--color-text-*` / `--color-border-*` token names
- **Decision:** Use the user-authored `tokens.css` verbatim. Layer 2 tokens follow the spec: `--color-bg-primary`, `--color-text-on-brand`, `--color-border-focus`, etc.
- **Why:** The user provided a complete, hand-designed token sheet. Token names are part of the design and must round-trip 1:1 between spec docs and code. The §3.8 indirection (mapping spec names → flat names) was a workaround for an ergonomic concern (`bg-bg-primary` reads as redundant) — that concern is now subordinate to source-of-truth fidelity.
- **Trade-off accepted:** Utility names like `bg-bg-brand`, `text-text-on-brand`, `border-border-focus` look redundant. Worth it because (a) the design tokens are the product, (b) future automated tooling (Figma sync, token docs generation) can treat tokens.css as canonical without a translation table, (c) once readers internalize that the second prefix is the token category, the redundancy fades.

### 3.10 Wire tokens through Tailwind v4 with `@theme inline {}`
- **Decision:** `preset.css` registers every token from `tokens.css` inside `@theme inline { --color-bg-brand: var(--color-bg-brand); ... }`. The `inline` modifier instructs Tailwind to emit `var(...)` references in the generated utility CSS rather than resolving the values at build time.
- **Why:** The token sheet uses plain `:root` + `[data-*]` attribute selectors so the cascade rebinds variables at runtime. If `@theme` resolved values at build time, every utility would freeze to the light/blue/slate/default state and `[data-theme="dark"]` switching would be a no-op. With `inline`, `.bg-bg-brand` compiles to `background-color: var(--color-bg-brand)` — and that variable re-resolves every time an ancestor's data-attribute changes. Verified in the docs app: toggling `document.documentElement.setAttribute("data-theme", "dark")` re-skins the gallery instantly without a rebuild.
- **Note on non-Tailwind-namespace tokens:** `--control-h-*` and `--control-px-*` (density-driven control sizing) have no clean Tailwind namespace. Button.tsx uses arbitrary-value syntax instead: `h-[var(--control-h-md)] px-[var(--control-px-md)]`. These also respect `[data-density]` switching because the var resolves at runtime. `--space-*` is intentionally not registered — the user's spacing scale is 0.25rem-aligned so Tailwind's default `--spacing` multiplier already produces matching values.

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
├── packages/
│   └── ui/
│       ├── package.json            # name: @plain-ds/ui, exports per-format + ./preset.css + ./tokens.css, peerDeps: react/dom/tailwind/base-ui, deps: clsx + tailwind-merge. build: `tsup && cp src/preset.css dist/ && cp src/tokens.css dist/`
│       ├── tsconfig.json           # extends ../../tsconfig.base.json, rootDir/outDir set
│       ├── tsup.config.ts          # entry: src/index.ts, format: [esm, cjs], dts: true, external: peerDeps
│       ├── src/
│       │   ├── index.ts            # exports cn, Button, ButtonProps
│       │   ├── tokens.css          # 558-line design-token sheet (primitives + semantics + data-attr switching). Vendored from user's design.
│       │   ├── preset.css          # @import "tailwindcss" + @import "./tokens.css" + @theme inline {} mapping tokens to Tailwind utilities
│       │   ├── components/
│       │   │   └── Button.tsx      # Base UI Button + variants/sizes via cn(); classes use --color-bg-*/text-*/border-* utilities
│       │   └── utils/
│       │       └── cn.ts           # the clsx + tailwind-merge utility
│       └── dist/                   # generated by `pnpm build` — gitignored
│           ├── index.js + .map     # ESM bundle
│           ├── index.cjs + .map    # CJS bundle
│           ├── index.d.ts          # ESM types
│           ├── index.d.cts         # CJS types
│           ├── preset.css          # copied from src/preset.css, exported as `@plain-ds/ui/preset.css` (full Tailwind+tokens)
│           └── tokens.css          # copied from src/tokens.css, exported as `@plain-ds/ui/tokens.css` (tokens only, no Tailwind wrapper)
│
└── apps/
    └── docs/
        ├── package.json            # @plain-ds/docs, workspace:* dep on @plain-ds/ui, Next.js 16 + MDX + Tailwind v4
        ├── tsconfig.json           # extends tsconfig.base.json, jsx: preserve, moduleResolution: bundler, Next plugin
        ├── next.config.mjs         # withMDX wrapper, pageExtensions: [ts, tsx, mdx]
        ├── postcss.config.mjs      # @tailwindcss/postcss plugin
        ├── .gitignore              # .next/, out/, next-env.d.ts, tsconfig.tsbuildinfo
        └── app/
            ├── layout.tsx          # <html> sets data-theme/gray/brand/radius/density/font defaults; body uses bg-bg-primary text-text-primary font-sans
            ├── globals.css         # @import preset.css + @source pointing at packages/ui/src
            └── page.tsx            # Button gallery — "use client", variants × sizes × states + override examples + runtime [data-*] switching snippets
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
#   ESM dist/index.js      ~1.74 KB
#   CJS dist/index.cjs     ~1.81 KB
#   DTS dist/index.d.ts    ~971 B
#   DTS dist/index.d.cts   ~971 B
#   (then the cp steps copy preset.css and tokens.css silently)

# 4. Confirm dist contents
ls packages/ui/dist/
# → index.js, index.cjs, index.d.ts, index.d.cts + sourcemaps + preset.css + tokens.css

# 5. Confirm both CSS files resolve via the package exports
node --input-type=module -e "
  import { createRequire } from 'node:module';
  const require = createRequire('\${PWD}/packages/ui/');
  console.log(require.resolve('@plain-ds/ui/preset.css'));
  console.log(require.resolve('@plain-ds/ui/tokens.css'));
"
# → prints absolute paths to dist/preset.css and dist/tokens.css

# 6. Typecheck + boot the docs app
pnpm -C apps/docs typecheck
# → expect no output (success)
lsof -ti :3000 | xargs kill -9 2>/dev/null; true
pnpm -C apps/docs dev
# → "Ready in ~300ms" on http://localhost:3000 (Next.js 16 Turbopack)
#   The Button gallery should render with all 4 variants × 3 sizes
#   on the slate/blue/default/default/geist defaults.

# 7. Confirm runtime token switching works (open http://localhost:3000 in a browser, then in DevTools console):
#   document.documentElement.setAttribute("data-theme", "dark");
#   document.documentElement.setAttribute("data-brand", "violet");
#   document.documentElement.setAttribute("data-radius", "pill");
#   document.documentElement.setAttribute("data-density", "compact");
# → gallery re-skins instantly without reload. If anything stays frozen,
#   @theme inline in preset.css was set up wrong (values were inlined
#   at build time instead of kept as var(...) refs).
```

If any step fails, that's a regression. Compare against the file states described in `Files map` above.

---

## 8. What's next (very specific)

Foundations are **done** (tokens.css covers colors, typography, spacing, radius, shadow, motion). Button is **done**. Docs app is **done**. Remaining work is component breadth + polish.

### Task 1: First MVP-batch components

Build in this order — each one follows the Button pattern (Base UI primitive + `cn()` + Tailwind utilities reading `--color-bg-*` / `--color-text-*` / `--color-border-*` from tokens.css):

1. **Input** (`@base-ui-components/react/input` is just a styled native; spec out the focus / disabled / invalid states)
2. **Textarea** — same as Input, multiline
3. **Checkbox** (Base UI `Checkbox`)
4. **Radio** (Base UI `Radio` / `RadioGroup`)
5. **Switch** (Base UI `Switch`)
6. **Select** (Base UI `Select` — multipart; first chance to design composite styling)
7. **Badge** — pure CSS, no Base UI primitive; sizes + intent (neutral / brand / success / warning / danger)
8. **Avatar** (Base UI `Avatar` — image + fallback)
9. **Card** — pure CSS layout primitive (uses `--card-p` / `--row-gap` density tokens)
10. **Divider** — pure CSS (horizontal + vertical)

For each, add a gallery section in `apps/docs/app/page.tsx` covering variants × sizes × states. Verify in the browser before moving to the next.

### Task 2: Second MVP-batch components

Modal, Toast, Tooltip, Tabs, Alert, Dropdown Menu, Skeleton. Most have Base UI primitives — same wrap-and-style pattern. Toast and Modal will exercise the shadow tokens; Skeleton will exercise motion tokens for the pulse animation.

### Task 3: Theme/density/brand toggle UI in `apps/docs`

Replace the DevTools-snippet section in `page.tsx` with an actual header strip that toggles `data-*` attributes on `<html>`. Once it exists, the docs become a real interactive showcase.

### Task 4: Polish for first publish

- Add `@source "node_modules/@plain-ds/ui/dist/**/*.{js,cjs}"` to `preset.css` so consumer apps don't need to configure Tailwind sources manually (open question §10).
- Confirm or change the MIT license in `packages/ui/package.json` (§10).
- Decide if/when to bump from `@base-ui-components/react@1.0.0-rc.0` to stable.
- Decide if/when to add Turborepo for caching.
- Push the 2 unpushed commits to origin once the next round of work is ready.

---

## 9. How to resume in a fresh Claude chat

**Suggested opening message:**

> Continue work on `plain-design-system`. Read `/Users/gade/Projects/Frontend/plain-design-system/PROGRESS.md` for full context.
>
> Tokens, Button, and the docs app are shipped. Next step: build the **Input** component per §8 Task 1 of PROGRESS.md. Follow the Button pattern at `packages/ui/src/components/Button.tsx` — Base UI primitive + `cn()` + Tailwind utilities that read `--color-bg-*` / `--color-text-*` / `--color-border-*` from `tokens.css`. Add a gallery section in `apps/docs/app/page.tsx` and verify in the browser.

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
- ~~Decide on docs framework (Storybook vs Next.js) when scaffolding `apps/docs`~~ → Decided 2026-05-14: **Next.js 16 + MDX**
- Consider whether to add `Turborepo` for build caching once there's more than 1 package
- License: currently `MIT` in `packages/ui/package.json` — confirm or change before first publish
- Add a Tailwind v4 `@source` directive to `preset.css` once components ship, so consumers' Tailwind detects classes inside `node_modules/@plain-ds/ui/dist/` without per-app configuration
- ~~Dark mode: no dark palette designed yet~~ → Resolved 2026-05-14: dark tokens are wired in `tokens.css` under `[data-theme="dark"]`. Components inherit dark-mode behavior automatically through `@theme inline`. Adding a UI toggle in `apps/docs` is still open.
