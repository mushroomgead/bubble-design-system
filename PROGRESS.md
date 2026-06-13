# Bubble Design System — Progress

> Read this first when resuming work. It catches you up on every decision, what's done, what's next, and how to verify everything still works.

**Last updated:** 2026-06-13 (Published `@bubble-design-system/ui@1.1.0` to npm)

---

## 1. What this project is

A neutral, minimal, token-driven design system built as a **portfolio + learning piece**. Architecturally inspired by shadcn/ui: **Base UI** provides headless primitives (a11y, keyboard, state), **Tailwind v4** provides styling, and users override defaults by passing `className` to any component. Goal: serve as a clean base layer that future projects can extend or rebrand.

---

## 2. Status

### Done

- [x] **Tailwind removed entirely — v0.2.0** (2026-06-04). The library no longer ships a Tailwind preset; it ships a single hand-authored `dist/styles.css` (63 KB) plus `dist/tokens.css` (29 KB) that consumers `@import` with zero PostCSS / Tailwind config. Components now emit stable BEM class names (`pds-btn`, `pds-btn--primary`, `pds-card__header`, …) so consumers can override defaults with plain CSS specificity instead of Tailwind utility precedence. `tailwindcss` peerDep + `@tailwindcss/postcss` + `tailwind-merge` removed. `cn()` shrunk to a clsx-only wrapper. New per-component CSS files at `src/components/*.css` are concatenated by `scripts/build-css.mjs` into the shipped `dist/styles.css`. Docs app also de-Tailwinded: globals.css now imports `styles.css` and adds a small set of `docs-*` page-chrome helpers; page.tsx + tokens/page.tsx rewritten without utility classes. See §3.13 for the full rationale.
- [x] Monorepo skeleton (pnpm workspaces)
- [x] Root `package.json` + `pnpm-workspace.yaml` + `.gitignore`
- [x] `packages/ui/` scaffolded with library-style `package.json` (exports, peerDeps, sideEffects, files, publishConfig)
- [x] Shared `tsconfig.base.json` + package-level `tsconfig.json` extending it
- [x] tsup build pipeline — emits `dist/index.js` (ESM) + `dist/index.cjs` (CJS) + types per format (`.d.ts` / `.d.cts`)
- [x] `cn()` utility (clsx + tailwind-merge) — typechecked and built
- [x] Build verified end-to-end with `pnpm -C packages/ui build`
- [x] Per-format type resolution in `exports` field (modern conditional exports pattern)
- [x] `packages/ui/src/preset.css` — initial Tailwind v4 `@theme {}` with 6 color families + flat semantic tokens. Build script copies it to `dist/preset.css`. _Superseded 2026-05-14 — see "Adopted user-provided tokens.css" entry below._
- [x] **Button** component — `packages/ui/src/components/Button.tsx`. Wraps Base UI's `Button` primitive. Variants: `primary` / `secondary` / `destructive` / `ghost`. Sizes: `sm` / `md` / `lg`. `forwardRef<HTMLElement>` to match Base UI. `className` narrowed to `string`. Handles both `disabled:` and `data-[disabled]:` states. Exported from `src/index.ts` along with `ButtonProps` type.
- [x] **`apps/docs`** — Next.js 16 + MDX scaffold consuming `@bubble-design-system/ui` via `workspace:*`. Tailwind v4 wired through `@tailwindcss/postcss`; `globals.css` imports `@bubble-design-system/ui/preset.css` and uses `@source "../../../packages/ui/src/**/*.{ts,tsx}"` so Tailwind picks up classes from the lib source (no rebuild needed during dev). Gallery at `app/page.tsx` renders Button variants × sizes × states + className-override examples. `pnpm -C apps/docs dev` boots on port 3000.
- [x] **Adopted user-provided `tokens.css`** (full design-token sheet, vendored at `packages/ui/src/tokens.css`). 558 lines of `:root` / `[data-*]` rules covering multi-gray (slate/neutral/stone), multi-brand (blue/violet/emerald/orange/mono), light + dark themes, multi-radius (default/sharp/soft/pill), multi-density (default/compact/comfortable), multi-font (geist/plex/system), plus typography / spacing / shadow / motion scales. Registered with Tailwind v4 via `@theme inline {}` in `preset.css` so every utility resolves through `var(...)` and switches live with `[data-*]` attributes (no rebuild). Button + docs gallery updated to the new token-aligned utility names (`bg-bg-brand`, `text-text-on-brand`, `shadow-focus`, etc.). Docs `<html>` sets all six data-attribute defaults. **This also closed spec §7 Phase 2** (typography, spacing, radius, shadow, motion primitives are all present in tokens.css).
- [x] **MVP batch 1 components** (2026-05-25): all eight components from §8 Task 1 shipped, following the Button pattern (Base UI primitive + `cn()` + Tailwind utilities that read from `tokens.css`).
  - **`Input`** — wraps Base UI's `Input`. Sizes `sm`/`md`/`lg` driven by `--control-h-*` / `--control-px-*`. `invalid` prop sets `aria-invalid` and switches border to `border-border-danger` with a red focus ring via `color-mix` on `--color-bg-danger-strong`.
  - **`Checkbox`** — wraps Base UI `Checkbox.Root` + `Checkbox.Indicator`. Renders two inline SVG icons (check + bar) and toggles their visibility with `group-data-[indeterminate]:`. _Why two SVGs instead of `{({ indeterminate }) => ...}`:_ Base UI's `Checkbox.Indicator` typing rejects render-prop children, so the CSS-driven swap is the conformant pattern. `data-[checked]` and `data-[indeterminate]` both flip the box to `bg-bg-brand`.
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
- [x] **ThemeBar — live token-switching UI in docs** (2026-05-25). Replaces the DevTools-snippet section. New file `apps/docs/app/ThemeBar.tsx` ("use client"): a sticky-top bar with six dropdowns (Theme / Gray / Brand / Radius / Density / Font) plus a Reset button. Each dropdown is a `<Select>` from `@bubble-design-system/ui` — dogfooding the lib's own primitive in the docs. On change, calls `document.documentElement.setAttribute(attr, value)` and persists the full state object to `localStorage` under key `plain-ds:theme`. **Flash-of-default avoidance:** `apps/docs/app/layout.tsx` injects a tiny synchronous `<script>` in `<head>` (via `dangerouslySetInnerHTML`) that reads localStorage and re-applies the data-attributes before first paint. Without that pre-paint script, the page would briefly render in the defaults (light/slate/orange/default/default/geist) before the React `useEffect` swapped them in on mount.

- [x] **Default typeface switched to Roboto, `plex` removed** (2026-06-11). `[data-font]` in `tokens.css` now has two values: `roboto` (new `:root` default — `--font-sans: 'Roboto', ui-sans-serif, system-ui, -apple-system, sans-serif`, `--font-mono: 'Roboto Mono', ui-monospace, 'SF Mono', Menlo, monospace`) and `system` (unchanged). The `geist`/`plex` blocks were removed. Rationale: user preference for Roboto as the system typeface. CSS-variable-only, no font loading added — same as how `geist`/`plex` were handled (named font, falls back to system fonts where unavailable). Updated everywhere the axis is documented or exercised: `apps/docs/app/layout.tsx` (`data-font="roboto"`), `ThemeBar.tsx` (options `["roboto", "system"]`, default `roboto`), `apps/docs/app/tokens/page.tsx`, `packages/ui/README.md`, and `CLAUDE.md`'s canonical-defaults line. `packages/ui/src/assets/logo-wordmark.svg` still hard-codes `'Geist'` for the wordmark text — that's a static brand-mark asset independent of this token, left as-is.
- [x] **Prettier + ESLint added as repo-wide static gates, wired into a Claude Code `PostToolUse` hook** (2026-06-13). Root `.prettierrc.json` (double quotes, semicolons, trailing commas, printWidth 80, tabWidth 2) + `.prettierignore` (`dist`, `.next`, `.turbo`, `storybook-static`, `node_modules`, `pnpm-lock.yaml`, `CHANGELOG.md`). New root scripts: `pnpm format` (`prettier --write .`), `pnpm format:check` (`prettier --check .`), `pnpm lint` (`pnpm -r run lint`). Each workspace got its own ESLint 9 flat config (`packages/ui/eslint.config.mjs`, `apps/docs/eslint.config.mjs`) plus a `"lint": "eslint ."` script — flat-config resolution is cwd-based so a shared root config wouldn't resolve per-workspace. One-time full-repo `pnpm exec prettier --write .` reformatted 42 files (user-approved after reviewing the diff scope, including the 854-line `tokens.css` rewrite — hex colors lowercased, hand-aligned columns removed). New `.claude/hooks/format-and-lint.mjs` + `.claude/settings.json` (`PostToolUse` on `Edit|MultiEdit|Write`): Prettier `--write`s the touched file, then for JS/TS files under `packages/ui` or `apps/docs` runs ESLint `--fix` with `cwd` set to that workspace; if errors remain after `--fix`, the hook exits 2 with the ESLint output on stderr so Claude sees it as blocking feedback. See §3.14 for the full rationale and the rule-tuning decisions (`no-empty-object-type`, `no-undef`, `set-state-in-effect`).
- [x] **3 new components — Popover, DataTable, CommandPalette** (2026-06-13). See §3.15 for source, rationale, and the non-obvious implementation choices.
- [x] **Published `@bubble-design-system/ui@1.1.0` to npm** (2026-06-13). Minor bump from `1.0.1` — additive only (new `Popover`/`DataTable`/`CommandPalette` exports + the Prettier/ESLint formatting pass, no API removals or breaking changes). `npm publish --dry-run` verified the tarball (13 files, dist/ + README + LICENSE + package.json) before the real publish. Switched `~/.npmrc` from a stale `_authToken` to a fresh npm **Automation token** (Account Settings → Access Tokens → Classic Token → Automation) — automation tokens bypass the per-publish OTP/2FA prompt that a normal login token requires, since the regular web-OTP URL printed by `npm publish` is redacted as `***` by the npm CLI itself (no way to open it).

### Todo (in order)

- [ ] Codify component-authoring styleguide (see §10 "In-flight items" — three sub-decisions still pending)

---

## 3. Architecture decisions (chronological, with the why)

### 3.1 Styled library, not headless

- **Decision:** ship a library that includes default styling (visual is part of the product), not pure headless primitives.
- **Why:** Workflow is "designer hands over a spec → frontend dev encodes it into code". The token spec (colors, principles, shades) is the _product_. Headless libs serve a different goal (infrastructure for _other_ design systems).

### 3.2 Monorepo with pnpm workspaces

- **Decision:** structure as `packages/ui` + (future) `apps/docs`, managed by pnpm workspaces.
- **Why:** Every real design system (Radix, Mantine, shadcn, Polaris, Chakra) uses a monorepo because the library and its docs/playground need separate dependency surfaces. Single-repo would bleed Storybook/Next.js deps into the published lib.

### 3.3 shadcn-style (Base UI + Tailwind v4 + className override) — _pivoted_

- **Initial direction:** styled lib with Tailwind v4 used _internally_ and a single compiled `styles.css` shipped to users.
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

### 3.11 ~~Drop Textarea and Card from the MVP component list~~ → REVERSED by §3.12

- **Original decision (2026-05-16):** remove `Textarea` and `Card` from §8 Task 1. Textarea folds into Input as a future `multiline` variant when needed. Card stays as a layout primitive expressible with Tailwind utilities and the `--card-p` / `--row-gap` density tokens — no controlled component required.
- **Status:** Reversed on 2026-06-03 as part of the Bubble rebrand. See §3.12.

### 3.12 Rebrand to Bubble — adopt soft+teal floating-pill identity (2026-06-03)

- **Decision:** Replace the "plain" identity with **Bubble** — a soft-gray page with white pill-shaped surfaces floating via layered shadows + inset white top-highlight, accented by **teal `#00CEC8`** brand and a **pink→magenta→violet gradient blob** mark. Canonical defaults: `tone=soft · brand=teal · gray=slate · radius=default · density=default · font=geist · light`.
- **Source:** Anthropic-bundled handoff from `claude.ai/design`, fetched as `https://api.anthropic.com/v1/design/h/wZZdIFAGPYUmVtFFYzFz3Q`. The bundle is a "bubble-design-system" project — vanilla JSX + plain CSS classes (no Base UI, no Tailwind). Its design tokens and visual spec transferred; its component code did **not** (we re-derived through our existing Base UI + Tailwind + `cn()` pattern).
- **Net-new architectural piece — `data-tone` axis.** Three values:
  - `soft` (default, the signature look) — pill controls via `--ctrl-radius: 9999px`, layered shadows w/ inset white top-highlight, gray page (`--color-bg-page: #ECEDEF`), white floating surfaces.
  - `vivid` — current/flat shadcn-like look (the previous Plain identity), single-layer shadows.
  - `pastel` — warm desaturated, off-white surfaces.
    Wired through `@theme inline {}` like the other data-attribute axes so tone switches live in the browser with no rebuild.
- **Net-new tokens:** `--gradient-accent` (pink→violet), `--gradient-accent-soft` (translucent overlay), `--ctrl-radius`, `--color-bg-page`, layout grid (`--grid-columns`, `--grid-gutter`, `--grid-margin*`, `--breakpoint-sm/md/lg/xl`, `--container-sm/md/lg/xl/prose`).
- **Reversal of §3.11 — Card and Textarea reinstated.** Bubble's API ships both, and the soft-pill Card is the literal embodiment of the signature look (the floating white surface). Earned the components back. Both shipped as composable: `Card` is compound (`Card.Header` / `.Title` / `.Description` / `.Action` / `.Body` / `.Footer`); `Textarea` is a thin styled `<textarea>` mirroring Input's size + invalid props.
- **2 more new components, both composable:**
  - `StatusPill` — compound: `StatusPill` + `StatusPill.Indicator` + `StatusPill.Label`. Intent (`neutral|success|warning|danger|info`) drives CSS custom properties (`--pill-chip`, `--pill-text`) the sub-parts read. The colored chip is a slot — consumer can pass any inline SVG as `<StatusPill.Indicator>` children. Bubble's flat `<StatusPill intent icon text>` API was converted on composability grounds.
  - `Segmented` — compound: `Segmented` + `Segmented.Item`. Wraps Base UI's `ToggleGroup` (single-select). Selected item flips to a white floating pill via `data-[pressed]`. Bubble's flat `<Segmented options={[...]} />` API was converted to children-based composition.
- **Layout primitives.** `Container` (size variants sm/md/lg/xl/prose/fluid; centered with `--grid-margin` page padding) + `Grid` (12-column with `--grid-gutter` gap; tightens to `--grid-gutter-tight` below sm) + `Grid.Col` (span 1–12 / "full" with `smSpan` / `mdSpan` / `lgSpan` responsive overrides). Tailwind v4 scans the static span-class lookup tables so the classes ship without arbitrary-value gymnastics.
- **No centralized icon module.** User decision. Bubble's bundle ships `CheckIcon`/`SunIcon`/etc. as a 10-icon namespace; we did not adopt it. Components keep their existing inline SVGs (Checkbox check + bar, Alert variant icons, Toast close, etc.). Consumers bring their own icons (Lucide is a clean visual match — same stroke weight + rounded caps).
- **Visual retune of existing components.** Only Button needed direct edits — secondary becomes a white floating pill (`bg-bg-primary shadow-md hover:shadow-lg hover:-translate-y-px`), primary picks up the colored drop-glow under soft tone via the layered `--shadow-md`. All other components re-skin automatically through tokens. Input's `rounded-md` switched to `rounded-ctrl` so it pills in soft and stays rounded elsewhere.
- **Assets.** `src/assets/logo-blob.svg` and `src/assets/logo-wordmark.svg` copied verbatim from the bundle and exposed via the package `exports` field as `@bubble-design-system/ui/assets/*`. Build script copies `src/assets/` → `dist/assets/`.
- **Package rebrand.** `@bubble-design-system/ui@0.1.1` → `@bubble-design-system/ui@0.1.0` (fresh start under the user's new `bubble-design-system` npm scope). `apps/docs` renamed to `@bubble-design-system/docs`, depends on the new lib via `workspace:*`. localStorage key bumped to `bubble-design-system:theme` so prior visitors don't get stale `plain-ds:theme` state. README rewritten with Bubble's narrative (5 design principles, soft tone identity, gradient blob).
- **What's still on `@bubble-design-system/ui` on npm:** version `0.1.1`, undisturbed. **Suggested follow-up** (not done automatically — user-driven): `npm deprecate @bubble-design-system/ui@"*" "Renamed to @bubble-design-system/ui — install the new package."` and `npm publish --access public` from `packages/ui/`.

### 3.13 Remove Tailwind, ship a single hand-authored CSS file (2026-06-04, v0.2.0)

- **Decision:** Drop Tailwind v4 (and `tailwind-merge`) from the library and the docs app entirely. The lib now ships `dist/styles.css` — a flat, plain-CSS bundle containing the design tokens, a minimal reset, and every component rule keyed by stable BEM class names (`.pds-btn`, `.pds-btn--primary`, `.pds-card__header`, …). Consumers `@import "@bubble-design-system/ui/styles.css"` and need no PostCSS or Tailwind configuration. The `./preset.css` export is renamed to `./styles.css` — breaking; hence the `0.1.x` → `0.2.0` bump. Components stop emitting Tailwind utility strings in JSX and instead pass stable BEM names through `cn()` (which is now a thin clsx-only wrapper).
- **Why:**
  - **No peer dep.** Pre-removal, consumer apps were required to install `tailwindcss >= 4.0` and import the lib's preset. That's a substantial install + configuration burden for a UI library. Removing the peer dep makes adoption a single import.
  - **Stable override surface.** With Tailwind utilities + `tailwind-merge`, consumers overrode component styling by stringing more utilities and trusting `twMerge`'s deduplication. Now they override by writing a plain CSS rule against `.pds-btn--primary` — single-class selector, specificity 0,1,0, deterministic. That's the override story design systems should ship.
  - **No `@source` config in consumer apps.** The original setup needed Tailwind to scan the lib's bundled JS for utility classes (via `@source "./*.{js,cjs}"` in `preset.css`). That's gone — no more cross-package class detection to keep working.
  - **Smaller runtime.** `tailwind-merge` was the heaviest runtime dep (~15 KB minified). Now the lib's only runtime dep is `clsx` (~250 bytes).
  - **Immunity to Tailwind churn.** The v3 → v4 migration was already non-trivial. Future Tailwind majors no longer block library releases.
- **What it cost:**
  - The ergonomic of writing utility classes in JSX during component authoring. We now hand-author CSS for each component instead. ~233 distinct utility strings translated into ~1300 lines of CSS across 21 files. Net code volume is up; clarity is also up (the cascade is explicit).
  - Consumers can no longer compose ad-hoc variants by stringing Tailwind utilities on a lib component at use-site (`<Button className="bg-red-500 px-10">`). They write a small CSS rule instead.
  - README/keywords/marketing changed — the lib previously sold itself as a "Tailwind v4 design system". The new positioning is "single-stylesheet design system with token-driven theming, no build dependency".
- **What it didn't change:**
  - **Token-driven theming.** `tokens.css` is unchanged. Every component rule still reads `var(--color-bg-brand)`, `var(--control-h-md)`, etc. at use-site, so `data-theme` / `data-tone` / `data-gray` / `data-brand` / `data-radius` / `data-density` / `data-font` runtime switching keeps working with zero regression. Verified by booting the docs dev server and switching every axis from ThemeBar — every component re-skins instantly.
  - **Public component API.** No props, refs, or composition shapes changed. All exports from `src/index.ts` remain stable.
  - **Base UI integration.** Components still wrap their Base UI primitive identically.
- **Implementation notes:**
  - **BEM convention.** Block = `pds-<component>`. Element = `pds-<component>__<element>`. Modifier = `pds-<component>--<modifier>`. Multi-word component names are kebab-cased: `pds-status-pill`, `pds-dropdown-menu`. The block list is canonical; see `dist/styles.css` or `src/components/*.css`.
  - **Build pipeline.** `scripts/build-css.mjs` (50-line Node script, zero dependencies) concatenates `src/tokens.css` + `src/base.css` + each `src/components/*.css` (alphabetical) into one `dist/styles.css`. It also emits a separate `dist/tokens.css` for consumers who only want the tokens. No PostCSS, no postcss-import — just `fs.readFileSync` + `fs.writeFileSync`.
  - **`base.css`.** A minimal reset that sets `box-sizing: border-box` globally and applies `font-family: var(--font-sans)` + `color: var(--color-text-primary)` + `background-color: var(--color-bg-page)` to `<html>`. Components assume these.
  - **`src/styles.css` source file.** A barrel that `@import`s tokens + base + every component CSS. It exists for authoring clarity and IDE preview only — consumers never see it; they receive the flattened `dist/styles.css`.
  - **`cn()` shrink.** Was `twMerge(clsx(inputs))`; now `clsx(inputs)`. Tail-end `className` from the consumer still wins in the JSX attribute order, so override behaviour is preserved at the className level. CSS-level overrides win via plain specificity.
  - **`tsup.config.ts`.** `tailwindcss` removed from the `external` array.
  - **`sideEffects`.** Changed from `false` to `["./dist/styles.css", "./dist/tokens.css"]` so consumers' bundlers tree-shake the JS but keep the CSS when imported.
  - **Docs app de-Tailwinded.** `apps/docs/postcss.config.mjs` deleted. `tailwindcss` + `@tailwindcss/postcss` removed from docs devDeps. `globals.css` now imports `styles.css` and adds ~250 lines of `docs-*` page-chrome helpers (themebar, token-row swatches, layout grids). `app/layout.tsx` body class moved into a CSS rule. `app/page.tsx` and `app/tokens/page.tsx` rewritten with `docs-*` class names — no utility soup, semantic markup. The tokens page's "How to use" section was rewritten too: the old "Tailwind utilities (recommended)" + "Raw CSS variables" pairing is now "Reference directly via var(...)" + "Use the component classes", which matches the new shipping model.
- **Verification.** `pnpm -C packages/ui typecheck`, `pnpm -C packages/ui build`, `pnpm -C apps/docs typecheck`, `pnpm -C apps/docs build` — all pass. `grep tailwind` over `packages/ui/src`, `apps/docs/app`, and all three `package.json` files returns zero matches. The docs dev server boots cleanly; both `/` and `/tokens` return 200; the served HTML contains `pds-btn`, `pds-card`, `pds-alert`, etc.; the bundled CSS contains the BEM rules and references `--color-bg-brand` in 25+ places.

### 3.14 Prettier + ESLint as static gates, enforced via a Claude Code hook (2026-06-13)

- **Decision:** add Prettier (single root config) and ESLint 9 flat config (one `eslint.config.mjs` per workspace) as the formatting/linting layer, and run both automatically after every Claude Code `Edit`/`MultiEdit`/`Write` via a `PostToolUse` hook.
- **Why:** the repo had no formatter or linter at all — `tsc --noEmit` was the only static gate. Hand-formatted CSS (`tokens.css`) had drifted (mixed hex case, manually-aligned columns) and there was no automated check for unused imports, hook-rule violations, etc. Wiring the checks into a hook means every file Claude touches is auto-fixed and re-checked without the user remembering to run `pnpm lint`/`pnpm format` themselves.
- **ESLint pinned to 9.39.4 (not 10.x):** installing `eslint@latest` (10.5.0) produced unmet-peer warnings — `eslint-plugin-react` caps at `^9.7`, and `eslint-config-next` transitively depends on `eslint-plugin-import` / `eslint-plugin-jsx-a11y` which cap at `^9`. Pinning `eslint` + `@eslint/js` to `9.39.4` resolved all peer warnings. Revisit once the React/Next ESLint plugin ecosystem ships v10-compatible releases.
- **Per-workspace flat configs, not one shared root config:** flat-config resolution is **cwd-based, not file-based** — `eslint <file>` run from the repo root fails to find `packages/ui/eslint.config.mjs` even though the file's directory has one. So `packages/ui` and `apps/docs` each get their own `eslint.config.mjs`, and the hook always sets `cwd` to the relevant workspace before invoking `eslint`.
  - `packages/ui/eslint.config.mjs` — `@eslint/js` recommended + `typescript-eslint` recommended + `eslint-plugin-react`/`react-hooks` (recommended + jsx-runtime), `eslint-config-prettier` last. Adds `"@typescript-eslint/no-empty-object-type": ["error", { allowInterfaces: "with-single-extends" }]` — without it, the project's established `interface FooProps extends BaseProps {}` re-export pattern (used 8× across `Card.tsx` and `StatusPill.tsx`) fails lint. Rewriting that pattern was rejected as out of scope for a tooling change.
  - `apps/docs/eslint.config.mjs` — just `eslint-config-next`'s flat-config array (already bundles react/react-hooks/jsx-a11y/import/@next rules) + `eslint-config-prettier`. **Deliberately does not include `@eslint/js`'s recommended config** — its `no-undef` rule false-positives on TypeScript's ambient `React` namespace (`React.ReactNode` in `apps/docs/app/tokens/page.tsx`), and `eslint-config-next`'s "next" config contributes zero core (`eslint:recommended`) rules anyway, so nothing is lost by omitting it.
- **`react-hooks/set-state-in-effect` (new in eslint-plugin-react-hooks v7):** `apps/docs/app/ThemeBar.tsx`'s mount-only `useEffect` calls `setState()` after reading `localStorage`/`document.documentElement` — a legitimate SSR-sync pattern, not a bug. Suppressed with a one-line `// eslint-disable-next-line react-hooks/set-state-in-effect` plus a comment explaining why, rather than restructuring the component.
- **One-time reformat scope:** `prettier --check .` initially flagged 42 files (mechanical: hex-color lowercasing, line wrapping, removing hand-aligned CSS columns — `tokens.css` alone was an 854-line diff). User chose to reformat everything in one pass (`pnpm exec prettier --write .`) rather than excluding `tokens.css`/`README.md` or leaving the codebase as-is, to start from a clean baseline.
- **Hook design (`.claude/hooks/format-and-lint.mjs` + `.claude/settings.json`):** `PostToolUse` on `Edit|MultiEdit|Write`. Reads `tool_input.file_path` from stdin JSON. Runs `prettier --write` (repo root cwd) on any file with a Prettier-supported extension. For `.ts`/`.tsx`/`.js`/`.jsx`/`.mjs`/`.cjs` files under `packages/ui/` or `apps/docs/`, runs `eslint --fix` then a plain `eslint` check, both with `cwd` set to that workspace. If the post-fix check still reports errors, the hook writes them to stderr and exits 2 — Claude Code surfaces this as blocking feedback in the same turn. Binaries are invoked directly from `node_modules/.bin/` (not via `pnpm exec`) to keep the hook fast.
- **Verification:** pipe-tested the hook's JSON-stdin contract directly, then proved both code paths live — introduced a formatting violation via Edit and confirmed Prettier silently fixed it, and introduced a lint error and confirmed the hook exited 2 with the ESLint output fed back. `pnpm -C packages/ui lint`, `pnpm -C apps/docs lint`, `pnpm format:check`, and both `typecheck` scripts all pass clean after the reformat.

### 3.15 Three new components — Popover, DataTable, CommandPalette (2026-06-13)

- **Source:** second Anthropic-bundled handoff from `claude.ai/design`, fetched as `https://api.anthropic.com/v1/design/h/XTU_wuyi4aa1fb1bH_xFPw` (a "bubble-design-system" project, `set3.jsx` + `set3.css`, vanilla JSX + plain CSS, no Base UI/Tailwind). As with §3.12, only the visual spec and component shapes transferred — code was re-derived through the existing Base UI + `cn()` + BEM-CSS pattern. These three were the only components in the bundle not already present in the library.
- **`Popover`** — `src/components/Popover.tsx` + `.css`. Compound: `{ Root, Trigger, Content, Title, Description, Close, Header, Body, Footer }`. `Root`/`Trigger`/`Close` are Base UI `@base-ui/react/popover` primitives re-exported directly (same as `Modal.Trigger`/`Modal.Close`). `Content` pre-composes `Portal → Positioner → Popup` (Tooltip's pattern) with `side="bottom"`, `align="center"`, `sideOffset=10`, and an optional `Arrow` (`showArrow`, default `true`). `Header`/`Body`/`Footer` are plain `forwardRef<HTMLDivElement>` divs (`pds-popover__header/__body/__footer`), `Title`/`Description` wrap `BasePopover.Title`/`.Description`.
  - **Arrow caret via `data-side`:** Base UI's `Popover.Arrow` sets a `data-side="top"|"bottom"|"left"|"right"` attribute. `.pds-popover-arrow` is a 10×10 square rotated 45° with a 1px border on all sides; each `[data-side="…"]` selector makes the two borders facing the popup transparent, so the visible two-border corner points at the trigger — recreates set3.css's caret without copying its `pop--bottom-start`/`pop--bottom-end` modifier-class approach.
- **`DataTable`** — `src/components/DataTable.tsx` + `.css`. Generic `DataTable<T extends { id: string | number }>({ columns, data, selectable, searchable, pageSize, actions, className })`. Client-side search (substring match across all column keys), sortable columns (click `<th>`, tri-state via `SortIcon`), row selection (reuses the existing **`Checkbox`** component for both the header select-all — wired to its `indeterminate` prop — and per-row checkboxes, rather than hand-rolling new checkbox markup), and pagination (max 5 page-number buttons with a sliding window, ‹/› buttons disabled at the ends).
- **`CommandPalette`** — `src/components/CommandPalette.tsx` + `.css`. `CommandPalette({ open, onOpenChange, groups, placeholder, onSelect, className })` built on `@base-ui/react/dialog` (`Backdrop` + `Popup`, no separate overlay wrapper div — `.pds-command-palette` itself is `position: fixed; top: 10vh; left: 50%; transform: translateX(-50%)`). `groups: CommandPaletteGroup[]` (each `{ label?, items: CommandPaletteItem[] }`) are filtered client-side across `label`/`description`/`keywords`. Arrow-key navigation + Enter-to-select via a controlled `activeIndex`; `Popup`'s `initialFocus={inputRef}` auto-focuses the search input on open (no `setTimeout`, unlike set3.jsx). Also exports **`useCommandPalette()`** — a small hook that owns `open` state and registers a `⌘K`/`Ctrl+K` `window` keydown listener to toggle it.
  - **State-reset pattern:** resetting `query`/`activeIndex` when the palette opens, and resetting `activeIndex` when `query` changes, is done via the **"adjust state during render"** pattern (compare current vs. a `prev*` state variable inside the render body, call `setState` conditionally — not inside `useEffect`). `eslint-plugin-react-hooks`'s `set-state-in-effect` rule (added in §3.14) rejected the naive `useEffect(() => setState(...), [dep])` version; this is the React-docs-recommended fix and avoids an extra render pass.
- **CSS architecture — no `[data-tone="soft"]` overrides (breaking from set3.css, continuing the convention from §3.12/§3.13):** set3.css has explicit `[data-tone="soft"]` blocks that strip borders and flatten radii for these three components. None of that was copied. Instead, all three containers use **shadow-only elevation** (`box-shadow: var(--shadow-md|lg|xl)`, no `border`) — the same pattern Card.css already established — because `--shadow-*` is already redefined per-tone (and per-theme) in `tokens.css`, so the container looks correct in vivid/pastel/soft without any component-specific tone branching. Pill-shaped controls (`DataTable`'s search input and pagination buttons) use `var(--ctrl-radius)`, which is likewise already tone-aware (`var(--radius-md)` in vivid/pastel, `9999px` in soft).
- **Exports:** all three added to `src/index.ts` — `Popover` (+ `PopoverContentProps`/`PopoverTitleProps`/`PopoverDescriptionProps`/`PopoverHeaderProps`/`PopoverBodyProps`/`PopoverFooterProps`), `DataTable` (+ `DataTableColumn`, `DataTableProps`), `CommandPalette` + `useCommandPalette` (+ `CommandPaletteItem`, `CommandPaletteGroup`, `CommandPaletteProps`).
- **Docs gallery:** `apps/docs/app/page.tsx` gained three sections (Popover, DataTable, Command Palette), placed just before "Brand mark · gradient blob". Popover demo is a "Column visibility" checkbox list with Reset/Apply footer and a close button; DataTable demo is a 12-row user-management table (`Avatar` + `StatusPill` composed into custom cell renderers); Command Palette demo wires `useCommandPalette()` to a trigger button plus two command groups (Navigation, Actions).
- **Verification:** `pnpm -C packages/ui typecheck` / `build`, `pnpm -C apps/docs typecheck` / `build`, `pnpm -C packages/ui lint`, `pnpm -C apps/docs lint`, `pnpm format:check` — all pass. `dist/styles.css` grew from 21 to 24 components (~72.6 KB).

---

## 4. Stack & versions

| Tool              | Version                  | Role                                                                                        |
| ----------------- | ------------------------ | ------------------------------------------------------------------------------------------- |
| pnpm              | 10.33.0                  | Package manager + workspaces                                                                |
| Node              | 25.9.0 (engines: `>=20`) | Runtime                                                                                     |
| TypeScript        | 6.0.3                    | Language (with `ignoreDeprecations: "6.0"`)                                                 |
| tsup              | 8.5.1                    | Library bundler (esbuild + rollup-plugin-dts)                                               |
| @base-ui/react    | 1.5.0                    | Headless primitives (peer dep) — renamed from `@base-ui-components/react` at 1.0 stable     |
| React / React DOM | 19.2.6                   | Peer dep (`>=18.2`)                                                                         |
| clsx              | 2.1.1                    | Class composition (regular dep) — only runtime dep after Tailwind removal                   |
| Prettier          | 3.8.4                    | Formatting (root `.prettierrc.json`, repo-wide)                                             |
| ESLint            | 9.39.4                   | Linting (flat config, one `eslint.config.mjs` per workspace — pinned below 10.x, see §3.14) |
| typescript-eslint | 8.61.0                   | TS-aware ESLint rules (`tseslint.config()`)                                                 |

Styling is hand-authored CSS — see §3.13. The lib has no PostCSS / Tailwind / preprocessor dependency.

---

## 5. Files map

```
bubble-design-system/
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
│       ├── package.json            # name: @bubble-design-system/ui@0.2.0, exports per-format + ./styles.css + ./tokens.css + ./assets/*, peerDeps: react/dom/@base-ui/react, deps: clsx. build: `tsup && node scripts/build-css.mjs && cp assets`
│       ├── tsconfig.json           # extends ../../tsconfig.base.json, rootDir/outDir set
│       ├── tsup.config.ts          # entry: src/index.ts, format: [esm, cjs], dts: true, external: react/dom/@base-ui/react
│       ├── scripts/
│       │   └── build-css.mjs       # Concatenates tokens.css + base.css + components/*.css → dist/styles.css. Also copies tokens.css → dist/. Zero deps.
│       ├── src/
│       │   ├── index.ts            # exports cn + all components and their *Props types
│       │   ├── tokens.css          # ~750-line design-token sheet (primitives + semantics + data-attr switching). Vendored from user's design.
│       │   ├── base.css            # Minimal reset: box-sizing, html font/color, button font-family inheritance
│       │   ├── styles.css          # Source barrel: @import tokens + base + every component CSS. Build flattens this into dist/styles.css.
│       │   ├── assets/             # logo-blob.svg + logo-wordmark.svg — copied to dist/assets/ by build script
│       │   ├── components/         # One .tsx + one .css per component. JSX emits BEM class names; CSS owns the rules.
│       │   │   ├── Alert.tsx + .css        # info/success/warning/danger; default icon per variant; title slot via ReactNode (omits native title attr)
│       │   │   ├── Avatar.tsx + .css       # Base UI Avatar.Root/.Image/.Fallback; sizes sm/md/lg/xl
│       │   │   ├── Badge.tsx + .css        # neutral/brand/success/warning/danger × sm/md/lg
│       │   │   ├── Button.tsx + .css       # primary/secondary/destructive/ghost × sm/md/lg; floating-pill hover lift on primary/secondary
│       │   │   ├── Card.tsx + .css         # elevated/muted root + Header/Title/Description/Action/Body/Footer subcomponents
│       │   │   ├── Checkbox.tsx + .css     # Base UI Checkbox.Root/.Indicator; check + indeterminate icons toggled via [data-indeterminate] selectors
│       │   │   ├── CommandPalette.tsx + .css # Base UI Dialog; fuzzy-searchable grouped command list + useCommandPalette() ⌘K hook
│       │   │   ├── DataTable.tsx + .css    # Generic <T extends {id}>; search/sort/select (reuses Checkbox)/pagination
│       │   │   ├── Divider.tsx + .css      # Base UI Separator; horizontal/vertical via orientation prop
│       │   │   ├── DropdownMenu.tsx + .css # Base UI Menu; { Root, Trigger, Content, Item, CheckboxItem, RadioGroup, RadioItem, Group, Label, Separator }
│       │   │   ├── Grid.tsx + .css         # Container (size variants) + Grid (12-col with gutter variants) + Grid.Col (span + responsive smSpan/mdSpan/lgSpan)
│       │   │   ├── Input.tsx + .css        # Base UI Input; size + invalid (aria-invalid); danger focus ring via color-mix
│       │   │   ├── Modal.tsx + .css        # Base UI Dialog; { Root, Trigger, Close, Content, Title, Description }. Content = Portal→Backdrop→Popup
│       │   │   ├── Popover.tsx + .css      # Base UI Popover; { Root, Trigger, Content, Title, Description, Close, Header, Body, Footer }. Arrow caret via data-side
│       │   │   ├── Radio.tsx + .css        # Base UI Radio.Root/.Indicator + RadioGroup; indicator dot scales in on [data-unchecked]
│       │   │   ├── Segmented.tsx + .css    # Compound: Segmented + Segmented.Item on Base UI ToggleGroup
│       │   │   ├── Select.tsx + .css       # Compound: { Root, Trigger, Value, Content, Item }. Content pre-wires Portal→Positioner→Popup.
│       │   │   ├── Skeleton.tsx + .css     # Pure CSS; pulse animation; shapes line/circle/block
│       │   │   ├── StatusPill.tsx + .css   # Compound: StatusPill + Indicator + Label; intent drives --pill-chip + --pill-text CSS vars
│       │   │   ├── Switch.tsx + .css       # Base UI Switch.Root/.Thumb; track recolors and thumb translates on [data-checked]
│       │   │   ├── Tabs.tsx + .css         # Base UI Tabs; List auto-renders Indicator using --active-tab-width/--active-tab-left
│       │   │   ├── Textarea.tsx + .css     # Plain styled <textarea>; size + invalid; min-heights via per-size CSS
│       │   │   ├── Toast.tsx + .css        # Base UI Toast manager; { Provider, Viewport, Toaster } + useToast hook
│       │   │   └── Tooltip.tsx + .css      # Base UI Tooltip; { Provider, Root, Trigger, Content }. Inverse bg/text so it adapts to theme
│       │   └── utils/
│       │       └── cn.ts           # clsx-only wrapper (tailwind-merge removed in v0.2.0)
│       └── dist/                   # generated by `pnpm build` — gitignored
│           ├── index.js + .map     # ESM bundle
│           ├── index.cjs + .map    # CJS bundle
│           ├── index.d.ts          # ESM types
│           ├── index.d.cts         # CJS types
│           ├── styles.css          # ~63 KB flat stylesheet: tokens + base + every component rule. Exported as `@bubble-design-system/ui/styles.css`.
│           ├── tokens.css          # ~25 KB tokens-only file. Exported as `@bubble-design-system/ui/tokens.css`.
│           └── assets/             # logo-blob.svg + logo-wordmark.svg. Exported as `@bubble-design-system/ui/assets/*`.
│
└── apps/
    └── docs/
        ├── package.json            # @bubble-design-system/docs, workspace:* dep on @bubble-design-system/ui, Next.js 16 + MDX. No Tailwind.
        ├── tsconfig.json           # extends tsconfig.base.json, jsx: preserve, moduleResolution: bundler, Next plugin
        ├── next.config.mjs         # withMDX wrapper, pageExtensions: [ts, tsx, mdx]
        └── app/
            ├── layout.tsx          # <html> sets all 7 data-* defaults + inline <script> reads localStorage["bubble-design-system:theme"] pre-paint
            ├── globals.css         # @import "@bubble-design-system/ui/styles.css" + ~250 lines of docs-* helpers (themebar, layouts, token rows, code blocks)
            ├── ThemeBar.tsx        # "use client" — 7 Select dropdowns (theme/tone/gray/brand/radius/density/font) + Reset; persists to localStorage
            ├── page.tsx            # Component gallery — "use client", wrapped in Toast.Provider + Tooltip.Provider, ThemeBar at top
            └── tokens/page.tsx     # Token reference with live swatches that react to data-* switches
```

---

## 6. Spec reference docs

| File                                                         | What's in it                                              |
| ------------------------------------------------------------ | --------------------------------------------------------- |
| `/Users/gade/Downloads/files2/design-system-fundamentals.md` | Token hierarchy, action hierarchy, naming conventions     |
| `/Users/gade/Downloads/files2/design-system-spec.md`         | Palette + 3-layer token architecture + MVP component list |
| `/Users/gade/Downloads/files2/learning-notes.md`             | User's prior mental models / mistakes                     |

---

## 7. Verification — confirm the project is healthy

Run these and expect clean exit codes:

```bash
cd /Users/gade/Projects/Frontend/bubble-design-system

# 1. Install deps (skip if node_modules already populated)
pnpm install

# 2. Typecheck packages/ui
pnpm -C packages/ui typecheck
# → expect no output (success)

# 3. Build packages/ui
pnpm -C packages/ui build
# → expect:
#   CJS dist/index.cjs     ~52 KB
#   ESM dist/index.js      ~49 KB
#   DTS dist/index.d.ts    ~21 KB
#   DTS dist/index.d.cts   ~21 KB
#   ✓ dist/styles.css      ~73 KB (24 components + tokens + base)
#   ✓ dist/tokens.css      ~25 KB

# 4. Confirm dist contents
ls packages/ui/dist/
# → index.js, index.cjs, index.d.ts, index.d.cts + sourcemaps + styles.css + tokens.css + assets/

# 5. Confirm both CSS files resolve via the package exports
node --input-type=module -e "
  import { createRequire } from 'node:module';
  const require = createRequire('${PWD}/packages/ui/');
  console.log(require.resolve('@bubble-design-system/ui/styles.css'));
  console.log(require.resolve('@bubble-design-system/ui/tokens.css'));
"
# → prints absolute paths to dist/styles.css and dist/tokens.css

# 6. Confirm no Tailwind leak
grep -r 'tailwind' packages/ui/src apps/docs/app 2>/dev/null
grep tailwind packages/ui/package.json apps/docs/package.json
# → both should return nothing

# 7. Typecheck + build the docs app
pnpm -C apps/docs typecheck
# → expect no output (success)
pnpm -C apps/docs build
# → "✓ Compiled successfully" + "✓ Generating static pages"

# 8. Boot the docs dev server
lsof -ti :3000 | xargs kill -9 2>/dev/null; true
pnpm -C apps/docs dev
# → "Ready in ~300ms" on http://localhost:3000 (Next.js 16 Turbopack)

# 9. Confirm runtime token switching works (open http://localhost:3000 in a browser, then in DevTools console):
#   document.documentElement.setAttribute("data-theme", "dark");
#   document.documentElement.setAttribute("data-brand", "violet");
#   document.documentElement.setAttribute("data-radius", "pill");
#   document.documentElement.setAttribute("data-density", "compact");
# → gallery re-skins instantly without reload. If anything stays frozen,
#   a component CSS rule hard-coded a value instead of var(--…).

# 10. Format check (whole repo)
pnpm format:check
# → "All matched files use Prettier code style!"

# 11. Lint both workspaces
pnpm -C packages/ui lint
pnpm -C apps/docs lint
# → expect no output (success) from both
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

Shipped as `apps/docs/app/ThemeBar.tsx`. Six dropdowns (Theme / Gray / Brand / Radius / Density / Font), each a `Select` from `@bubble-design-system/ui`. Sticky to top of `<main>`. State persists in `localStorage` under `plain-ds:theme` and is re-applied pre-paint via an inline `<script>` in `layout.tsx`. Reset button restores defaults. See "ThemeBar" entry under §2 Done.

### Task 4: Polish for first publish

- Add `@source "node_modules/@bubble-design-system/ui/dist/**/*.{js,cjs}"` to `preset.css` so consumer apps don't need to configure Tailwind sources manually (open question §10).
- Confirm or change the MIT license in `packages/ui/package.json` (§10).
- ~~Decide if/when to bump from `@base-ui-components/react@1.0.0-rc.0` to stable.~~ → Done 2026-05-26: bumped to `@base-ui/react@^1.5.0` (package renamed at 1.0 stable; old scope deprecated).
- Decide if/when to add Turborepo for caching.
- Push the 2 unpushed commits to origin once the next round of work is ready.

---

## 9. How to resume in a fresh Claude chat

**Suggested opening message:**

> Continue work on `bubble-design-system`. Read `/Users/gade/Projects/Frontend/bubble-design-system/PROGRESS.md` for full context.
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
- ~~Add a Tailwind v4 `@source` directive to `preset.css`~~ → Moot 2026-06-04: Tailwind removed (§3.13). Consumers now import a flat `styles.css`; no scanning required.
- ~~Dark mode: no dark palette designed yet~~ → Resolved 2026-05-14: dark tokens are wired in `tokens.css` under `[data-theme="dark"]`. Components inherit dark-mode behavior automatically through `@theme inline`. Adding a UI toggle in `apps/docs` is still open.

### In-flight items as of 2026-05-16 (resume here next session)

- **Codify a component-authoring styleguide.** User wants a documented rule that components stay flexible — content always comes through `children`, never through prescriptive `label` / `text` / `title` props (except in cases like Toast where title + description are semantically distinct). Pattern Button.tsx already follows: `forwardRef`, `...props` spread for native HTML attributes, `className` override via `cn()` last-arg, variant/size as discriminated enums with sensible defaults. Three open sub-decisions to make on resume:
  1. **Where it lives.** Options: new `STYLEGUIDE.md` at project root _(recommended — searchable, peer to PROGRESS.md)_; new section inside PROGRESS.md; or JSDoc headers in each component.
  2. **Scope.** Options: (a) just the children-first rule, (b) full authoring rules — children + spread + ref + className + variants + compound components (e.g. `<Modal.Header>`) + Base UI `render`/`asChild` for element swap + ARIA delegation, _(recommended)_ or (c) full rules **plus** a `packages/ui/src/components/_Template.tsx` boilerplate to copy when starting a new component.
     User did not select on resume in either the 2026-05-15 or 2026-05-16 sessions. Re-ask next session.
