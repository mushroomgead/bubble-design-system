# Plain Design System — Progress

> Read this first when resuming work. It catches you up on every decision, what's done, what's next, and how to verify everything still works.

**Last updated:** 2026-05-25 (ThemeBar shipped — live data-attribute toggles in apps/docs with localStorage persistence)

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
- [x] **MVP batch 1 components** (2026-05-25): all eight components from §8 Task 1 shipped, following the Button pattern (Base UI primitive + `cn()` + Tailwind utilities that read from `tokens.css`).
  - **`Input`** — wraps Base UI's `Input`. Sizes `sm`/`md`/`lg` driven by `--control-h-*` / `--control-px-*`. `invalid` prop sets `aria-invalid` and switches border to `border-border-danger` with a red focus ring via `color-mix` on `--color-bg-danger-strong`.
  - **`Checkbox`** — wraps Base UI `Checkbox.Root` + `Checkbox.Indicator`. Renders two inline SVG icons (check + bar) and toggles their visibility with `group-data-[indeterminate]:`. *Why two SVGs instead of `{({ indeterminate }) => ...}`:* Base UI's `Checkbox.Indicator` typing rejects render-prop children, so the CSS-driven swap is the conformant pattern. `data-[checked]` and `data-[indeterminate]` both flip the box to `bg-bg-brand`.
  - **`Radio` + `RadioGroup`** — wraps Base UI `Radio.Root` + `Radio.Indicator` and `RadioGroup`. `RadioGroup` defaults to `flex flex-col gap-2` (override via `className="flex-row gap-6"`). Indicator dot uses `data-[unchecked]:scale-0` for a soft pop on selection.
  - **`Switch`** — wraps Base UI `Switch.Root` + `Switch.Thumb`. Track recolors via `data-[checked]:bg-bg-brand`; thumb travel uses `data-[checked]:translate-x-{3,4,5}` per size with `transition-transform duration-normal`.
  - **`Select`** — first compound component. Exports a `Select` object with `Root`, `Trigger`, `Value`, `Content`, `Item`. `Content` pre-composes `Portal` → `Positioner` → `Popup` so consumers don't have to. Trigger reuses the `--control-h-*` sizing scale; popup uses `var(--anchor-width)` for width-matching, `var(--available-height)` for max-height, and `var(--transform-origin)` for the open animation. Item shows a leading check via `Select.ItemIndicator`.
  - **`Badge`** — pure CSS (no Base UI primitive). Variants `neutral` / `brand` / `success` / `warning` / `danger` map to the `--color-bg-*` subtle backgrounds + `--color-text-*` foregrounds. Always `rounded-full`.
  - **`Avatar`** — wraps Base UI `Avatar.Root` + `Avatar.Image` + `Avatar.Fallback`. Exported as a callable component with `.Image` / `.Fallback` properties via `Object.assign`. Sizes `sm`/`md`/`lg`/`xl`.
  - **`Divider`** — wraps Base UI `Separator`. Defaults to `horizontal` (`h-px w-full`); `vertical` uses `w-px self-stretch`. Uses `bg-border-secondary`.
  - All eight are exported from `src/index.ts` with their `*Props` types. `apps/docs/app/page.tsx` has a gallery section per component covering variants × sizes × states.
- [x] **MVP batch 2 components** (2026-05-25): all seven components from §8 Task 2 shipped. Same pattern as batch 1.
  - **`Modal`** — wraps Base UI `Dialog`. Compound `{ Root, Trigger, Close, Content, Title, Description }`. `Content` pre-composes `Portal → Backdrop → Popup` (so consumers don't have to thread all three). Backdrop is `bg-bg-inverse/50` with `backdrop-blur-sm`; popup is centered via translate, animates via `data-[starting-style]:opacity-0 scale-95` + `data-[ending-style]`. Trigger/Close re-export Base UI primitives as-is — consumers pass `render={(props) => <Button {...props}>…</Button>}` to swap the element.
  - **`Toast`** — uses Base UI's manager pattern. Exports `Toast = { Provider, Viewport, Toaster }` plus a `useToast` hook (re-export of `Toast.useToastManager` — the manager isn't a top-level value from `@base-ui/react/toast`, only from the namespace, so we destructure `BaseToast.useToastManager` and re-export it). `Toaster` is the convenience component that renders Viewport + maps `useToast().toasts` to styled `BaseToast.Root` + `Title` + `Description` + `Close`. Stacked-toast layout uses `--toast-index` and `--toast-offset-y` from Base UI for the fan-out + expand-on-hover. Usage: wrap with `<Toast.Provider>`, render `<Toast.Toaster />` once, call `useToast().add({ title, description })` from any descendant.
  - **`Tooltip`** — wraps Base UI `Tooltip`. Compound `{ Provider, Root, Trigger, Content }`. `Content` pre-wires Portal → Positioner → Popup with default `sideOffset=6` and `side="top"`. Popup uses `bg-bg-inverse text-text-inverse` so it inverts cleanly in both light + dark themes. `data-[instant]:duration-0` so reopening within the grace window skips the transition.
  - **`Tabs`** — wraps Base UI `Tabs`. Compound: `Tabs` is the callable Root with `.List`, `.Tab`, `.Panel` attached via `Object.assign`. `List` automatically appends a `BaseTabs.Indicator` so consumers don't need to remember to render it — the bar uses `var(--active-tab-width)` / `var(--active-tab-left)` for the slide.
  - **`Alert`** — pure CSS (no Base UI primitive). Variants `info` / `success` / `warning` / `danger` map to `--color-bg-*` + `--color-border-*` + a matching icon tint via `[&_[data-alert-icon]]:text-text-*`. Inline SVG icons default per variant; consumers can pass `icon={...}` to override or `icon={false}` to hide. `title` is a `ReactNode` slot — we `Omit<HTMLAttributes, "title">` first because the native HTML `title` is `string`.
  - **`DropdownMenu`** — wraps Base UI `Menu`. Compound `{ Root, Trigger, Content, Item, CheckboxItem, RadioGroup, RadioItem, Group, Label, Separator }`. `Content` pre-composes Portal → Positioner → Popup. `CheckboxItem` / `RadioItem` reserve `pl-7` for a leading indicator icon (check / dot) positioned absolutely at `left-2`, matching the Select item layout. `Trigger` is the raw Base UI primitive so consumers use `render` to swap to `<Button>`.
  - **`Skeleton`** — pure CSS. Tailwind's built-in `animate-pulse` over `bg-bg-tertiary`. Shapes `line` (h-4 w-full rounded-sm), `circle` (rounded-full, no default size — caller picks via className), `block` (rounded-md, no default size). Marked `aria-hidden="true"`.
  - All seven exported from `src/index.ts` with their `*Props` types. `apps/docs/app/page.tsx` wraps the gallery in `<Toast.Provider><Tooltip.Provider>` and adds a section per component (Modal has a destructive-confirm example, DropdownMenu exercises CheckboxItem + RadioGroup, Toast has a `ToastDemo` child component that calls `useToast().add()`).
- [x] **ThemeBar — live token-switching UI in docs** (2026-05-25). Replaces the DevTools-snippet section. New file `apps/docs/app/ThemeBar.tsx` ("use client"): a sticky-top bar with six dropdowns (Theme / Gray / Brand / Radius / Density / Font) plus a Reset button. Each dropdown is a `<Select>` from `@plain-ds/ui` — dogfooding the lib's own primitive in the docs. On change, calls `document.documentElement.setAttribute(attr, value)` and persists the full state object to `localStorage` under key `plain-ds:theme`. **Flash-of-default avoidance:** `apps/docs/app/layout.tsx` injects a tiny synchronous `<script>` in `<head>` (via `dangerouslySetInnerHTML`) that reads localStorage and re-applies the data-attributes before first paint. Without that pre-paint script, the page would briefly render in the defaults (light/slate/orange/default/default/geist) before the React `useEffect` swapped them in on mount.

### Todo (in order)
- [ ] Codify component-authoring styleguide (see §10 "In-flight items" — three sub-decisions still pending)
- [ ] Push unpushed commits to origin
- [ ] Polish for first publish (§8 Task 4)
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

### 3.11 Drop Textarea and Card from the MVP component list
- **Decision (2026-05-16):** remove `Textarea` and `Card` from §8 Task 1. Textarea folds into Input as a future `multiline` variant when needed. Card stays as a layout primitive expressible with Tailwind utilities and the `--card-p` / `--row-gap` density tokens — no controlled component required.
- **Why:** §2 Design Principle "Composable, not opinionated" — a Card-as-component would prescribe structure (header/body/footer slots) that a layout primitive doesn't need. Textarea is the same control surface as Input with one prop flipped, so shipping a separate component duplicates a variant rather than earning its keep.
- **Trade-off accepted:** Consumers who expect a `<Card>` or `<Textarea>` import by name won't find one. They compose with `<div>` + utilities, or pass `multiline` to Input. The MVP list shrinks from 10 to 8.
- **Tokens stay:** `--card-p` and `--row-gap` remain in `tokens.css` — useful for the layout pattern even without a component wrapper.

---

## 4. Stack & versions

| Tool | Version | Role |
|---|---|---|
| pnpm | 10.33.0 | Package manager + workspaces |
| Node | 25.9.0 (engines: `>=20`) | Runtime |
| TypeScript | 6.0.3 | Language (with `ignoreDeprecations: "6.0"`) |
| tsup | 8.5.1 | Library bundler (esbuild + rollup-plugin-dts) |
| Tailwind CSS | 4.3.0 | Styling — v4 with CSS-first `@theme` config |
| @base-ui/react | 1.5.0 | Headless primitives (peer dep) — renamed from `@base-ui-components/react` at 1.0 stable |
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
│       │   ├── index.ts            # exports cn + all components and their *Props types
│       │   ├── tokens.css          # 558-line design-token sheet (primitives + semantics + data-attr switching). Vendored from user's design.
│       │   ├── preset.css          # @import "tailwindcss" + @import "./tokens.css" + @theme inline {} mapping tokens to Tailwind utilities
│       │   ├── components/
│       │   │   ├── Button.tsx      # Base UI Button + variants/sizes via cn(); classes use --color-bg-*/text-*/border-* utilities
│       │   │   ├── Input.tsx       # Base UI Input; size + invalid (aria-invalid); danger focus ring via color-mix
│       │   │   ├── Checkbox.tsx    # Base UI Checkbox.Root/.Indicator; check + indeterminate icons toggled via group-data-[indeterminate]
│       │   │   ├── Radio.tsx       # Base UI Radio.Root/.Indicator + RadioGroup; indicator dot scales in
│       │   │   ├── Switch.tsx      # Base UI Switch.Root/.Thumb; track recolors and thumb translates on data-[checked]
│       │   │   ├── Select.tsx      # Compound: { Root, Trigger, Value, Content, Item }. Content pre-wires Portal→Positioner→Popup.
│       │   │   ├── Badge.tsx       # Pure CSS span; neutral/brand/success/warning/danger × sm/md/lg
│       │   │   ├── Avatar.tsx      # Base UI Avatar.Root/.Image/.Fallback; exposed as Avatar + Avatar.Image + Avatar.Fallback
│       │   │   ├── Divider.tsx     # Base UI Separator; horizontal/vertical via orientation prop
│       │   │   ├── Modal.tsx       # Base UI Dialog; { Root, Trigger, Close, Content, Title, Description }. Content = Portal→Backdrop→Popup
│       │   │   ├── Toast.tsx       # Base UI Toast manager; { Provider, Viewport, Toaster } + useToast hook (re-export of BaseToast.useToastManager)
│       │   │   ├── Tooltip.tsx     # Base UI Tooltip; { Provider, Root, Trigger, Content }. Inverse bg/text so it adapts to theme
│       │   │   ├── Tabs.tsx        # Base UI Tabs; Tabs (Root) with .List / .Tab / .Panel attached. List auto-renders Indicator
│       │   │   ├── Alert.tsx       # Pure CSS div; info/success/warning/danger; default icon per variant; title slot via ReactNode (omits native title attr)
│       │   │   ├── DropdownMenu.tsx# Base UI Menu; { Root, Trigger, Content, Item, CheckboxItem, RadioGroup, RadioItem, Group, Label, Separator }
│       │   │   └── Skeleton.tsx    # Pure CSS; animate-pulse on bg-bg-tertiary; shapes line/circle/block
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
            ├── layout.tsx          # <html> sets data-* defaults + inline <script> reads localStorage["plain-ds:theme"] pre-paint to avoid flash
            ├── globals.css         # @import preset.css + @source pointing at packages/ui/src
            ├── ThemeBar.tsx        # "use client" — 6 Select dropdowns (theme/gray/brand/radius/density/font) + Reset; persists to localStorage
            └── page.tsx            # Component gallery — "use client", wrapped in Toast.Provider + Tooltip.Provider, ThemeBar at top
```

---

## 6. Spec reference docs

| File | What's in it |
|---|---|
| `/Users/gade/Downloads/files2/design-system-fundamentals.md` | Token hierarchy, action hierarchy, naming conventions |
| `/Users/gade/Downloads/files2/design-system-spec.md` | Palette + 3-layer token architecture + MVP component list |
| `/Users/gade/Downloads/files2/learning-notes.md` | User's prior mental models / mistakes |

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

### Task 1: First MVP-batch components ✅ DONE 2026-05-25

All eight shipped: Input, Checkbox, Radio (+ RadioGroup), Switch, Select (compound), Badge, Avatar, Divider. See "MVP batch 1 components" entry under §2 Done for the per-component notes (which Base UI primitive, the size/variant axes, and the non-obvious styling tricks each one needed).

### Task 2: Second MVP-batch components ✅ DONE 2026-05-25

All seven shipped: Modal, Toast, Tooltip, Tabs, Alert, DropdownMenu, Skeleton. See "MVP batch 2 components" entry under §2 Done for the per-component notes.

### Task 3: Theme/density/brand toggle UI in `apps/docs` ✅ DONE 2026-05-25

Shipped as `apps/docs/app/ThemeBar.tsx`. Six dropdowns (Theme / Gray / Brand / Radius / Density / Font), each a `Select` from `@plain-ds/ui`. Sticky to top of `<main>`. State persists in `localStorage` under `plain-ds:theme` and is re-applied pre-paint via an inline `<script>` in `layout.tsx`. Reset button restores defaults. See "ThemeBar" entry under §2 Done.

### Task 4: Polish for first publish

- Add `@source "node_modules/@plain-ds/ui/dist/**/*.{js,cjs}"` to `preset.css` so consumer apps don't need to configure Tailwind sources manually (open question §10).
- Confirm or change the MIT license in `packages/ui/package.json` (§10).
- ~~Decide if/when to bump from `@base-ui-components/react@1.0.0-rc.0` to stable.~~ → Done 2026-05-26: bumped to `@base-ui/react@^1.5.0` (package renamed at 1.0 stable; old scope deprecated).
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

- ~~Bump `@base-ui-components/react` to stable `1.0.0` when published~~ → Done 2026-05-26: on `@base-ui/react@^1.5.0`
- Remove `ignoreDeprecations: "6.0"` from `tsconfig.base.json` when tsup/rollup-plugin-dts drop `baseUrl` usage
- ~~Decide on docs framework (Storybook vs Next.js) when scaffolding `apps/docs`~~ → Decided 2026-05-14: **Next.js 16 + MDX**
- Consider whether to add `Turborepo` for build caching once there's more than 1 package
- License: currently `MIT` in `packages/ui/package.json` — confirm or change before first publish
- Add a Tailwind v4 `@source` directive to `preset.css` once components ship, so consumers' Tailwind detects classes inside `node_modules/@plain-ds/ui/dist/` without per-app configuration
- ~~Dark mode: no dark palette designed yet~~ → Resolved 2026-05-14: dark tokens are wired in `tokens.css` under `[data-theme="dark"]`. Components inherit dark-mode behavior automatically through `@theme inline`. Adding a UI toggle in `apps/docs` is still open.

### In-flight items as of 2026-05-16 (resume here next session)

- **Codify a component-authoring styleguide.** User wants a documented rule that components stay flexible — content always comes through `children`, never through prescriptive `label` / `text` / `title` props (except in cases like Toast where title + description are semantically distinct). Pattern Button.tsx already follows: `forwardRef`, `...props` spread for native HTML attributes, `className` override via `cn()` last-arg, variant/size as discriminated enums with sensible defaults. Three open sub-decisions to make on resume:
  1. **Where it lives.** Options: new `STYLEGUIDE.md` at project root *(recommended — searchable, peer to PROGRESS.md)*; new section inside PROGRESS.md; or JSDoc headers in each component.
  2. **Scope.** Options: (a) just the children-first rule, (b) full authoring rules — children + spread + ref + className + variants + compound components (e.g. `<Modal.Header>`) + Base UI `render`/`asChild` for element swap + ARIA delegation, *(recommended)* or (c) full rules **plus** a `packages/ui/src/components/_Template.tsx` boilerplate to copy when starting a new component.
  User did not select on resume in either the 2026-05-15 or 2026-05-16 sessions. Re-ask next session.
