# @bubble-design-system/ui

> Bubble — a **neutral, composable, token-driven UI foundation** built on [Base UI](https://base-ui.com/), shipped as a single plain CSS file.

Bubble's signature is the **soft tone with a teal brand**: a soft-gray page (`#ECEDEF`) on which **white pill-shaped surfaces float** via layered shadows + an inset white top-highlight, accented by teal (`#00CEC8`) and a pink→magenta→violet **gradient blob** mark. The canonical identity is `tone=soft · brand=teal · gray=slate · radius=default · density=default · font=geist · light`.

Every visual decision — tone, color, brand, gray family, radius, density, typography, motion — is driven by CSS custom properties. Toggle a single `data-*` attribute on `<html>` and the whole app re-skins live, with no rebuild.

```tsx
<html
  data-theme="light"
  data-tone="soft"
  data-brand="teal"
  data-gray="slate"
  data-radius="default"
  data-density="default"
  data-font="geist"
>
```

- **21 components** — Button, Input, Textarea, Checkbox, Radio, Switch, Select, Badge, Avatar, Divider, Modal, Toast, Tooltip, Tabs, Alert, DropdownMenu, Skeleton, Card, StatusPill, Segmented (plus Container + Grid layout primitives). Each wraps an [`@base-ui/react`](https://base-ui.com/) primitive where one exists — accessible by construction, styled with a single shipped stylesheet.
- **A 3-layer, multi-theme token system** spanning color (light/dark · 3 gray families · 6 brand palettes including teal), **3 tones** (vivid · pastel · soft — soft is the signature look), radius (4 scales), density (3 scales), typography (3 font pairs), layered shadows, and motion.
- **Live theme switching** via seven `data-*` attributes on any ancestor. Every CSS rule reads `var(--…)` at use-site, so swapping `data-tone="vivid"` for `data-tone="soft"` reflows the UI without re-rendering or rebuilding.
- **No build dependency in consumer apps.** One CSS import. No PostCSS, no Tailwind, no preprocessor required.
- **Dual ESM + CJS** with per-format `.d.ts` / `.d.cts`. `sideEffects` is scoped to the CSS so unused components tree-shake.
- **Composable, not opinionated** — components take `children`, spread `...props`, forward refs, expose compound sub-parts (`Card.Header`, `StatusPill.Indicator`, `Segmented.Item`), and emit stable BEM class names that you can target with plain CSS to override defaults.

## Design principles

The five rules every decision in Bubble traces back to:

1. **Restraint over decoration.** Few colors, light shadows, moderate radius. Every visual element must justify itself.
2. **Composable, not opinionated.** No business logic baked into components, so the next person can remix freely (a `Card` never forces a header).
3. **Accessible by default.** Contrast, focus state, keyboard nav pass WCAG AA without extra thought.
4. **Token-driven.** Nothing is hardcoded in a component — every value references a token, so a new theme re-skins the whole system instantly.
5. **One way to do things.** If there are two ways to do the same thing, pick one.

---

## Table of contents

- [Tech stack](#tech-stack)
- [Installation](#installation)
- [Setup](#setup)
- [Runtime theming](#runtime-theming)
- [Components](#components)
- [Design tokens](#design-tokens)
- [Overriding styles](#overriding-styles)
- [Local development](#local-development)
- [Contributing](#contributing)
- [License](#license)

---

## Tech stack

| Concern | Tool |
|---|---|
| Framework | React 19 (works with ≥ 18.2) |
| Primitives | `@base-ui/react` ≥ 1.0 (the post-rename successor to `@base-ui-components/react`) |
| Styling | Plain CSS — one shipped stylesheet, hand-authored per component |
| Class composition | `clsx` (re-exported as `cn()`) |
| Build tool | `tsup` (ESM + CJS + dual `.d.ts`) + a 50-line Node script for CSS bundling |
| Language | TypeScript 6 |
| Package manager | `pnpm@10.33.0` |
| Node | ≥ 20 |

---

## Installation

```bash
# npm
npm install @bubble-design-system/ui

# pnpm
pnpm add @bubble-design-system/ui

# yarn
yarn add @bubble-design-system/ui
```

Then install the peer dependencies your app must have:

```bash
npm install react react-dom @base-ui/react
```

| Peer dependency | Required version |
|---|---|
| `react` | ≥ 18.2 |
| `react-dom` | ≥ 18.2 |
| `@base-ui/react` | ≥ 1.0.0 |

---

## Setup

### 1. Import the stylesheet

The shipped CSS contains the design tokens, a minimal reset, and every component rule. One import wires everything up — no PostCSS plugin, no Tailwind config, no preprocessor.

```css
/* app/globals.css — or wherever your global styles live */
@import "@bubble-design-system/ui/styles.css";
```

Or, in a TS/JS entry file (Vite, Next.js App Router, Webpack, Parcel, …):

```ts
import "@bubble-design-system/ui/styles.css";
```

If you only want the raw CSS custom properties (no component rules), import the tokens file directly:

```css
@import "@bubble-design-system/ui/tokens.css";
```

### 2. Set the theme attributes on your root element

```tsx
// app/layout.tsx (Next.js App Router example)
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-theme="light"
      data-tone="soft"
      data-brand="teal"
      data-gray="slate"
      data-radius="default"
      data-density="default"
      data-font="geist"
    >
      <body>{children}</body>
    </html>
  );
}
```

Every attribute has a sensible default if omitted, but spelling them out makes the design surface explicit.

### 3. Use components

```tsx
import { Button, Modal, Divider } from "@bubble-design-system/ui";

export function Example() {
  return (
    <div>
      <Button variant="primary">Save</Button>
      <Divider />
      <Modal.Root>
        <Modal.Trigger render={<Button variant="secondary" />}>Open</Modal.Trigger>
        <Modal.Content>
          <Modal.Title>Confirm</Modal.Title>
          <Modal.Description>Are you sure?</Modal.Description>
        </Modal.Content>
      </Modal.Root>
    </div>
  );
}
```

---

## Runtime theming

Seven `data-*` attributes on any ancestor element (typically `<html>` or `<body>`) re-skin every descendant at runtime, with no rebuild.

| Attribute | Values | Default | What it controls |
|---|---|---|---|
| `data-theme` | `light` · `dark` | `light` | Semantic color mapping (background, text, border, shadow). |
| `data-tone` | `vivid` · `pastel` · `soft` | `soft` | Surface model, palette saturation, control radius. `soft` is the signature look. |
| `data-gray` | `slate` · `neutral` · `stone` | `slate` | The gray family used for surfaces and text. |
| `data-brand` | `blue` · `violet` · `emerald` · `orange` · `mono` · `teal` | `teal` | The brand palette (`--brand-50` through `--brand-950`). |
| `data-radius` | `default` · `sharp` · `soft` · `pill` | `default` | The corner radius scale (`--radius-xs` through `--radius-2xl`). |
| `data-density` | `default` · `compact` · `comfortable` | `default` | Control heights and padding (`--control-h-*`, `--control-px-*`). |
| `data-font` | `geist` · `plex` · `system` | `geist` | The font pair (`--font-sans` / `--font-mono`). |

Toggle them with any approach you like — `setAttribute`, React state, a media-query listener, a server cookie:

```ts
document.documentElement.setAttribute("data-theme", "dark");
document.documentElement.setAttribute("data-brand", "violet");
```

A working live-switcher implementation (with `localStorage` persistence and an SSR-safe bootstrap script) lives in the docs app — see `apps/docs/app/ThemeBar.tsx` and `apps/docs/app/layout.tsx` in the [repository](https://github.com/mushroomgead/plain-design-system).

---

## Components

Every component is exported from the package root:

```tsx
import {
  Alert, Avatar, Badge, Button, Card, Checkbox, Container, Divider,
  DropdownMenu, Grid, Input, Modal, Radio, RadioGroup, Segmented,
  Select, Skeleton, StatusPill, Switch, Tabs, Textarea, Toast, Tooltip,
  useToast, cn,
} from "@bubble-design-system/ui";
```

Conventions shared by all components:

- They `forwardRef` to the underlying Base UI primitive.
- Native HTML attributes are spread via `...props` — `onClick`, `aria-*`, `id`, `style` all just work.
- Each component emits stable BEM class names (`pds-btn`, `pds-btn--primary`, `pds-card__header`, …). Your `className` is appended last in the final class string.
- Variants and sizes are string-literal enums with documented defaults.
- Both `:disabled` and `[data-disabled]` are styled (Base UI uses the data-attr form).

---

### Alert

A static informational banner with a variant-specific icon, title, and body.

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `"info" \| "success" \| "warning" \| "danger"` | `"info"` | Visual tone and default icon. |
| `icon` | `ReactNode \| false` | variant-specific | Override the default icon, or pass `false` to hide it. |
| `title` | `ReactNode` | — | Optional bold header line. |
| `children` | `ReactNode` | — | The body copy, rendered in the secondary text color. |
| `className` | `string` | — | Extra classes (appended after the library's). |
| `...props` | `HTMLAttributes<HTMLDivElement>` (minus `title`) | — | All native div attributes. |

```tsx
<Alert variant="success" title="Saved">Your changes are live.</Alert>
<Alert variant="danger" title="Couldn't save" icon={false}>
  Try again in a moment.
</Alert>
```

---

### Avatar

Compound component built on `@base-ui/react/avatar` — handles image load failure with a fallback.

| Sub-component | Description |
|---|---|
| `Avatar` (root) | Sized circular surface. |
| `Avatar.Image` | The image element. |
| `Avatar.Fallback` | Shown while the image is loading or after it fails. |

**`Avatar` props:**

| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | `"sm" \| "md" \| "lg" \| "xl"` | `"md"` | 24 / 32 / 40 / 48 px. |
| `className` | `string` | — | Extra classes. |
| `...props` | Base UI `Avatar.Root` props | — | Spread to the root. |

`Avatar.Image` and `Avatar.Fallback` accept their Base UI props plus `className`.

```tsx
<Avatar size="lg">
  <Avatar.Image src="/me.jpg" alt="Ada" />
  <Avatar.Fallback>AL</Avatar.Fallback>
</Avatar>
```

---

### Badge

Small inline pill for status, counts, or labels.

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `"neutral" \| "brand" \| "success" \| "warning" \| "danger"` | `"neutral"` | Background and text color. |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Pill height and padding. |
| `className` | `string` | — | Extra classes. |
| `...props` | `HTMLAttributes<HTMLSpanElement>` | — | Native span attributes. |

```tsx
<Badge variant="success">Active</Badge>
<Badge variant="brand" size="sm">New</Badge>
```

---

### Button

Wraps `@base-ui/react/button`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `"primary" \| "secondary" \| "destructive" \| "ghost"` | `"primary"` | Visual style. |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Maps to `--control-h-*` / `--control-px-*` so density attribute affects it. |
| `className` | `string` | — | Extra classes. |
| `...props` | Base UI `Button` props | — | Includes `disabled`, `type`, `onClick`, etc. |

```tsx
<Button variant="primary" size="lg" onClick={save}>Save</Button>
<Button variant="destructive">Delete</Button>
<Button variant="ghost" disabled>Cancel</Button>
```

---

### Card

Compound component for floating-pill surface content.

| Sub-component | Description |
|---|---|
| `Card` (root) | The floating surface. Variant controls fill + shadow. |
| `Card.Header` | Row with title + optional action. |
| `Card.Title` | `<h3>` heading. |
| `Card.Description` | Supporting paragraph. |
| `Card.Action` | Right-aligned controls inside the header. |
| `Card.Body` | Main content area. |
| `Card.Footer` | Bordered footer row with right-aligned controls. |

**`Card` props:**

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `"elevated" \| "muted"` | `"elevated"` | `elevated` = white surface with shadow. `muted` = `bg-secondary`, no shadow. |
| `className` | `string` | — | Extra classes. |

```tsx
<Card>
  <Card.Header>
    <div>
      <Card.Title>Soft-pill surface</Card.Title>
      <Card.Description>White card floating on a gray page.</Card.Description>
    </div>
    <Card.Action>
      <Button size="sm" variant="ghost">Manage</Button>
    </Card.Action>
  </Card.Header>
  <Card.Body>…</Card.Body>
  <Card.Footer>
    <Button size="sm" variant="ghost">Cancel</Button>
    <Button size="sm">Save</Button>
  </Card.Footer>
</Card>
```

---

### Checkbox

Wraps `@base-ui/react/checkbox`. Supports checked, unchecked, and indeterminate states with built-in SVG indicators.

| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | 16 / 18 / 20 px. |
| `className` | `string` | — | Extra classes on the root button. |
| `...props` | Base UI `Checkbox.Root` props | — | `checked`, `defaultChecked`, `indeterminate`, `onCheckedChange`, etc. |

```tsx
<Checkbox defaultChecked />
<Checkbox indeterminate />
<Checkbox disabled />
```

---

### Container + Grid

Layout primitives. `Container` centers content and applies page margins. `Grid` is a 12-column grid; `Grid.Col` spans columns with optional responsive overrides.

```tsx
<Container size="lg">
  <Grid>
    <Grid.Col span={12}>full row</Grid.Col>
    <Grid.Col span={6} lgSpan={4}>half on mobile, third on lg</Grid.Col>
    <Grid.Col span={6} lgSpan={4}>…</Grid.Col>
    <Grid.Col span={12} lgSpan={4}>…</Grid.Col>
  </Grid>
</Container>
```

**`Container` props:** `size` = `"sm" | "md" | "lg" | "xl" | "prose" | "fluid"` (default `"xl"`).

**`Grid` props:** `gutter` = `"default" | "tight" | "flush"` (default `"default"`).

**`Grid.Col` props:** `span`, `smSpan`, `mdSpan`, `lgSpan` = `1 | 2 | … | 12 | "full"`. Default `span` is `12`.

---

### Divider

Horizontal or vertical separator with a semantic role from `@base-ui/react/separator`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` | Layout direction. |
| `className` | `string` | — | Extra classes. |
| `...props` | Base UI `Separator` props | — | Spread to the underlying element. |

```tsx
<Divider />
<div style={{ display: "flex", height: "2rem", alignItems: "center" }}>
  <span>A</span><Divider orientation="vertical" /><span>B</span>
</div>
```

---

### DropdownMenu

Compound component built on `@base-ui/react/menu`. Supports items, checkbox items, radio groups, labels, and separators.

| Sub-component | Description |
|---|---|
| `DropdownMenu.Root` | The state container. |
| `DropdownMenu.Trigger` | The element that opens the menu. |
| `DropdownMenu.Content` | The portalled popup. |
| `DropdownMenu.Item` | A selectable row. |
| `DropdownMenu.CheckboxItem` | A toggleable row with a check indicator. |
| `DropdownMenu.RadioGroup` | Wrapper for radio items. |
| `DropdownMenu.RadioItem` | A single radio choice. |
| `DropdownMenu.Group` | Logical group of items. |
| `DropdownMenu.Label` | Uppercase group label. |
| `DropdownMenu.Separator` | Thin horizontal divider. |

**`DropdownMenu.Content` props:**

| Prop | Type | Default | Description |
|---|---|---|---|
| `sideOffset` | `number` | `6` | Distance in px from the trigger. |
| `align` | `"start" \| "center" \| "end"` | `"start"` | Alignment relative to the trigger. |
| `className` | `string` | — | Extra classes on the popup. |
| `...props` | Base UI `Menu.Popup` props | — | Spread to the popup. |

```tsx
<DropdownMenu.Root>
  <DropdownMenu.Trigger render={<Button variant="secondary">Options</Button>} />
  <DropdownMenu.Content>
    <DropdownMenu.Label>Actions</DropdownMenu.Label>
    <DropdownMenu.Item>Edit</DropdownMenu.Item>
    <DropdownMenu.Item>Duplicate</DropdownMenu.Item>
    <DropdownMenu.Separator />
    <DropdownMenu.CheckboxItem checked>Pinned</DropdownMenu.CheckboxItem>
  </DropdownMenu.Content>
</DropdownMenu.Root>
```

---

### Input

Wraps `@base-ui/react/input`. Includes built-in invalid styling via `aria-invalid`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Density-aware control height. |
| `invalid` | `boolean` | — | Sets `aria-invalid` and applies the danger border + focus ring. |
| `className` | `string` | — | Extra classes. |
| `...props` | Base UI `Input` props (minus `size`) | — | All native input attributes: `value`, `placeholder`, `type`, `onChange`, `disabled`, etc. |

```tsx
<Input placeholder="Email" />
<Input size="lg" invalid value={email} onChange={(e) => setEmail(e.target.value)} />
```

---

### Modal

Compound component built on `@base-ui/react/dialog`. Renders into a portal, with backdrop blur and scale-in animation.

| Sub-component | Description |
|---|---|
| `Modal.Root` | Open-state container. |
| `Modal.Trigger` | Element that opens the modal. |
| `Modal.Close` | Element that closes the modal. |
| `Modal.Content` | The portalled popup with backdrop. |
| `Modal.Title` | Heading text. |
| `Modal.Description` | Sub-text under the title. |

**`Modal.Content` props:**

| Prop | Type | Default | Description |
|---|---|---|---|
| `className` | `string` | — | Extra classes on the popup. |
| `backdropClassName` | `string` | — | Extra classes on the backdrop. |
| `...props` | Base UI `Dialog.Popup` props | — | Spread to the popup. |

`Modal.Title` and `Modal.Description` accept their Base UI props plus `className`.

```tsx
<Modal.Root>
  <Modal.Trigger render={<Button>Open</Button>} />
  <Modal.Content>
    <Modal.Title>Delete project?</Modal.Title>
    <Modal.Description>This action cannot be undone.</Modal.Description>
    <div style={{ marginTop: "1rem", display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
      <Modal.Close render={<Button variant="secondary">Cancel</Button>} />
      <Button variant="destructive">Delete</Button>
    </div>
  </Modal.Content>
</Modal.Root>
```

---

### Radio / RadioGroup

Wraps `@base-ui/react/radio` and `@base-ui/react/radio-group`.

**`Radio` props:**

| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | 16 / 18 / 20 px. |
| `className` | `string` | — | Extra classes. |
| `...props` | Base UI `Radio.Root` props | — | `value`, `disabled`, etc. |

**`RadioGroup` props:**

| Prop | Type | Default | Description |
|---|---|---|---|
| `className` | `string` | — | Override the default vertical stack. |
| `...props` | Base UI `RadioGroup` props | — | `value`, `defaultValue`, `onValueChange`. |

```tsx
<RadioGroup defaultValue="email">
  <label><Radio value="email" /> Email</label>
  <label><Radio value="sms" /> SMS</label>
</RadioGroup>
```

---

### Segmented

Compound component built on `@base-ui/react/toggle-group` (single-select). The selected item rises as a white floating pill.

| Sub-component | Description |
|---|---|
| `Segmented` (root) | The toggle group. |
| `Segmented.Item` | A single segment. |

**`Segmented` props:**

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `string` | — | Controlled selected value. |
| `defaultValue` | `string` | — | Uncontrolled initial value. |
| `onValueChange` | `(value: string) => void` | — | Fired with the new value. |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | 24 / 28 / 32 px. |

```tsx
<Segmented value={range} onValueChange={setRange}>
  <Segmented.Item value="day">Day</Segmented.Item>
  <Segmented.Item value="week">Week</Segmented.Item>
  <Segmented.Item value="month">Month</Segmented.Item>
</Segmented>
```

---

### Select

Compound component built on `@base-ui/react/select`.

| Sub-component | Description |
|---|---|
| `Select.Root` | State container (`value`, `onValueChange`). |
| `Select.Trigger` | The clickable trigger; renders a chevron icon. |
| `Select.Value` | The selected value's display. |
| `Select.Content` | The portalled popup. |
| `Select.Item` | A selectable row with a check indicator when selected. |

**`Select.Trigger` props:** `size` = `"sm" | "md" | "lg"` (default `"md"`), plus `className`.

**`Select.Value` props:** `placeholder?: ReactNode`, plus `className`.

**`Select.Content` props:** `sideOffset?: number` (default `6`), plus `className`.

```tsx
<Select.Root value={fruit} onValueChange={setFruit}>
  <Select.Trigger size="md">
    <Select.Value placeholder="Pick one" />
  </Select.Trigger>
  <Select.Content>
    <Select.Item value="apple">Apple</Select.Item>
    <Select.Item value="banana">Banana</Select.Item>
    <Select.Item value="cherry">Cherry</Select.Item>
  </Select.Content>
</Select.Root>
```

---

### Skeleton

Loading placeholder with a pulse animation.

| Prop | Type | Default | Description |
|---|---|---|---|
| `shape` | `"line" \| "circle" \| "block"` | `"line"` | Default dimensions and radius. |
| `className` | `string` | — | Override width/height/radius via your own CSS. |
| `...props` | `HTMLAttributes<HTMLDivElement>` | — | Native div attributes. |

```tsx
<Skeleton />
<Skeleton shape="circle" style={{ width: "2.5rem", height: "2.5rem" }} />
<Skeleton shape="block" style={{ height: "6rem" }} />
```

---

### StatusPill

Compound floating-pill component for status indicators. Intent drives chip + label color via CSS custom properties.

| Sub-component | Description |
|---|---|
| `StatusPill` (root) | The pill surface. |
| `StatusPill.Indicator` | The leading colored chip. Children render an optional icon. |
| `StatusPill.Label` | The colored text label. |

**`StatusPill` props:** `intent` = `"neutral" | "success" | "warning" | "danger" | "info"` (default `"neutral"`).

```tsx
<StatusPill intent="success">
  <StatusPill.Indicator />
  <StatusPill.Label>On track</StatusPill.Label>
</StatusPill>
```

---

### Switch

Wraps `@base-ui/react/switch` — a thumb that slides on `data-[checked]`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | 16 / 20 / 24 px tall. |
| `className` | `string` | — | Extra classes on the root. |
| `...props` | Base UI `Switch.Root` props | — | `checked`, `defaultChecked`, `onCheckedChange`, `disabled`. |

```tsx
<Switch defaultChecked />
<Switch size="sm" />
```

---

### Tabs

Compound component built on `@base-ui/react/tabs`. The list renders an animated indicator that slides between active tabs.

| Sub-component | Description |
|---|---|
| `Tabs` (root) | State container; pass `value`, `defaultValue`, `onValueChange`. |
| `Tabs.List` | Horizontal tab strip with a sliding indicator. |
| `Tabs.Tab` | A single tab button. |
| `Tabs.Panel` | The panel paired with a tab `value`. |

All sub-components accept their Base UI props plus `className`.

```tsx
<Tabs defaultValue="profile">
  <Tabs.List>
    <Tabs.Tab value="profile">Profile</Tabs.Tab>
    <Tabs.Tab value="account">Account</Tabs.Tab>
    <Tabs.Tab value="billing">Billing</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel value="profile">Profile content</Tabs.Panel>
  <Tabs.Panel value="account">Account content</Tabs.Panel>
  <Tabs.Panel value="billing">Billing content</Tabs.Panel>
</Tabs>
```

---

### Textarea

A thin styled `<textarea>` mirroring Input's API.

| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Density-aware control padding. |
| `invalid` | `boolean` | — | Sets `aria-invalid` and applies the danger border + focus ring. |
| `className` | `string` | — | Extra classes. |
| `...props` | `TextareaHTMLAttributes` (minus `size`) | — | All native textarea attributes. |

```tsx
<Textarea placeholder="Notes" rows={4} />
<Textarea invalid value={text} onChange={(e) => setText(e.target.value)} />
```

---

### Toast

Built on `@base-ui/react/toast`. Provides a `<Toast.Provider>` boundary, a `<Toast.Viewport>` for positioning, a pre-built `<Toast.Toaster>` that renders the queue, and the `useToast()` hook to push toasts.

| Sub-component | Description |
|---|---|
| `Toast.Provider` | Wrap your app to enable toasts. |
| `Toast.Viewport` | Positioned region where toasts mount (bottom-right by default). |
| `Toast.Toaster` | Pre-styled queue renderer — drop this inside `Provider`. |
| `useToast()` | Hook returning Base UI's toast manager (`.add({ title, description })`). |

```tsx
import { Toast, useToast, Button } from "@bubble-design-system/ui";

function Root({ children }) {
  return (
    <Toast.Provider>
      {children}
      <Toast.Toaster />
    </Toast.Provider>
  );
}

function SaveButton() {
  const toast = useToast();
  return (
    <Button onClick={() => toast.add({ title: "Saved", description: "Changes are live." })}>
      Save
    </Button>
  );
}
```

---

### Tooltip

Compound component built on `@base-ui/react/tooltip`. Requires a `Tooltip.Provider` ancestor (typically once at the app root).

| Sub-component | Description |
|---|---|
| `Tooltip.Provider` | App-level provider. |
| `Tooltip.Root` | Single tooltip state container. |
| `Tooltip.Trigger` | The hovered/focused element. |
| `Tooltip.Content` | The portalled popup. |

**`Tooltip.Content` props:**

| Prop | Type | Default | Description |
|---|---|---|---|
| `side` | `"top" \| "bottom" \| "left" \| "right"` | `"top"` | Preferred side. |
| `align` | `"start" \| "center" \| "end"` | `"center"` | Alignment along the side. |
| `sideOffset` | `number` | `6` | Distance from the trigger. |
| `className` | `string` | — | Extra classes on the popup. |

```tsx
<Tooltip.Provider>
  <Tooltip.Root>
    <Tooltip.Trigger render={<Button variant="ghost">?</Button>} />
    <Tooltip.Content side="top">Helpful hint</Tooltip.Content>
  </Tooltip.Root>
</Tooltip.Provider>
```

---

### `cn()` utility

Re-exported `clsx` wrapper for composing class names — useful when building your own components against the design tokens.

```tsx
import { cn } from "@bubble-design-system/ui";

cn("my-card", isActive && "my-card--active", className);
// → "my-card my-card--active <consumer className>"
```

---

## Design tokens

All tokens are CSS custom properties defined in `src/tokens.css`. Reference them directly in your CSS with `var(--…)`. The semantic tokens (those prefixed `--color-bg-*`, `--color-text-*`, `--color-border-*`) re-resolve automatically when an ancestor `data-*` attribute changes.

### Color tokens

Semantic colors map to primitive palettes and are remapped by `[data-theme]`, `[data-gray]`, and `[data-brand]`.

| Token | Purpose |
|---|---|
| `--color-bg-primary` | Page background. |
| `--color-bg-secondary` | Secondary surface (cards on page). |
| `--color-bg-tertiary` | Tertiary surface (inset wells). |
| `--color-bg-inverse` | Inverted surface (tooltip, toast). |
| `--color-bg-brand` | Brand primary fill. |
| `--color-bg-brand-hover` | Brand hover state. |
| `--color-bg-brand-active` | Brand pressed state. |
| `--color-bg-brand-subtle` | Tinted brand surface (info backgrounds, badges). |
| `--color-bg-success` | Soft success surface. |
| `--color-bg-success-strong` | Solid success fill. |
| `--color-bg-warning` | Soft warning surface. |
| `--color-bg-warning-strong` | Solid warning fill. |
| `--color-bg-danger` | Soft danger surface. |
| `--color-bg-danger-strong` | Solid danger fill (destructive buttons). |
| `--color-bg-danger-hover` | Danger hover state. |
| `--color-bg-info` | Info alert surface. |
| `--color-bg-hover` | Neutral hover. |
| `--color-bg-pressed` | Neutral pressed. |
| `--color-bg-disabled` | Disabled surface. |
| `--color-text-primary` | Body text. |
| `--color-text-secondary` | Supporting text. |
| `--color-text-tertiary` | Placeholder, hints. |
| `--color-text-disabled` | Disabled text. |
| `--color-text-inverse` | Text on `bg-inverse`. |
| `--color-text-brand` | Brand-colored text (links). |
| `--color-text-success` | Success copy. |
| `--color-text-warning` | Warning copy. |
| `--color-text-danger` | Error copy. |
| `--color-text-on-brand` | Text on `bg-brand`. |
| `--color-text-on-danger` | Text on `bg-danger-strong`. |
| `--color-text-on-success` | Text on `bg-success-strong`. |
| `--color-border-primary` | Default form/control border. |
| `--color-border-secondary` | Section dividers, cards. |
| `--color-border-tertiary` | Subtle inner dividers. |
| `--color-border-brand` | Selected/active accent. |
| `--color-border-success` | Success accent. |
| `--color-border-warning` | Warning accent. |
| `--color-border-danger` | Error accent (invalid inputs). |
| `--color-border-focus` | Focus ring color. |

### Primitive palettes

These are the raw color swatches that the semantic tokens reference. You usually shouldn't touch them directly, but they're exposed if you need to.

| Family | Stops | Notes |
|---|---|---|
| `--slate-*` | 50–950 | Default gray family. |
| `--neutral-*` | 50–950 | True neutral (no temperature). |
| `--stone-*` | 50–950 | Warm gray. |
| `--blue-*` | 50–950 | Brand option. |
| `--violet-*` | 50–950 | Brand option. |
| `--emerald-*` | 50–950 | Brand option. |
| `--orange-*` | 50–950 | Brand option. |
| `--green-*` | 50–950 | Success palette. |
| `--amber-*` | 50–950 | Warning palette. |
| `--red-*` | 50–950 | Danger palette. |
| `--white`, `--black` | — | Pure values. |

Aliases follow the active `data-*` attribute: `--gray-*` resolves to whichever gray family is selected, `--brand-*` to whichever brand. The `mono` and `teal` brands have special-case treatment for contrast on light/dark themes.

### Radius

Selected by `[data-radius]`. Each scale rewrites the same custom properties.

| Token | default | sharp | soft | pill |
|---|---|---|---|---|
| `--radius-xs`   | 2px    | 0px    | 4px    | 4px |
| `--radius-sm`   | 4px    | 1px    | 8px    | 9999px |
| `--radius-md`   | 6px    | 2px    | 12px   | 9999px |
| `--radius-lg`   | 8px    | 3px    | 14px   | 9999px |
| `--radius-xl`   | 12px   | 4px    | 18px   | 18px |
| `--radius-2xl`  | 16px   | 6px    | 24px   | 22px |
| `--radius-full` | 9999px | 9999px | 9999px | 9999px |

Plus `--ctrl-radius` — the control radius used by Button/Input/Select. Pills under `[data-tone="soft"]`, `--radius-md` elsewhere.

### Shadow

Light theme uses cool slate tints; dark theme uses opaque black. The `soft` tone adds an inset white top-highlight on md/lg/xl. The focus ring tracks the brand color.

| Token | Purpose |
|---|---|
| `--shadow-xs` | Hairline lift. |
| `--shadow-sm` | Subtle card. |
| `--shadow-md` | Standard card. |
| `--shadow-lg` | Popover, dropdown. |
| `--shadow-xl` | Modal. |
| `--shadow-focus` | Focus ring (3–4px brand-tinted). |

### Typography

| Token | Value |
|---|---|
| `--font-size-xs`  | 0.75rem |
| `--font-size-sm`  | 0.875rem |
| `--font-size-md`  | 1rem |
| `--font-size-lg`  | 1.125rem |
| `--font-size-xl`  | 1.25rem |
| `--font-size-2xl` | 1.5rem |
| `--font-size-3xl` | 1.875rem |
| `--font-size-4xl` | 2.25rem |
| `--font-size-5xl` | 3rem |
| `--font-size-6xl` | 3.75rem |
| `--line-height-tight` / `snug` / `normal` / `relaxed` | 1.15 / 1.3 / 1.5 / 1.65 |
| `--letter-tight` / `snug` / `normal` / `wide` | -0.022em / -0.012em / 0 / 0.04em |
| `--font-weight-regular` / `medium` / `semibold` / `bold` | 400 / 500 / 600 / 700 |
| `--font-sans` / `--font-mono` | Set by `[data-font]` |

### Spacing

`--space-0` through `--space-24` follow a 0.25rem (4px) scale, doubling to 0.5rem after 4. Reference them with `var(--space-4)`, etc. — they have no utility-class shorthand because the library doesn't ship one.

### Density (control sizing)

Selected by `[data-density]`.

| Token | default | compact | comfortable |
|---|---|---|---|
| `--control-h-sm`  | 28px | 24px | 32px |
| `--control-h-md`  | 36px | 30px | 42px |
| `--control-h-lg`  | 44px | 38px | 52px |
| `--control-px-sm` | 10px | 8px  | 12px |
| `--control-px-md` | 14px | 12px | 18px |
| `--control-px-lg` | 18px | 16px | 22px |
| `--card-p`        | 24px | 16px | 32px |
| `--row-gap`       | 16px | 12px | 20px |

### Motion

| Token | Value |
|---|---|
| `--duration-instant` | 50ms |
| `--duration-fast`    | 120ms |
| `--duration-normal`  | 200ms |
| `--duration-slow`    | 320ms |
| `--duration-slower`  | 500ms |
| `--ease-linear`   | `linear` |
| `--ease-out`      | `cubic-bezier(0.16, 1, 0.3, 1)` |
| `--ease-in-out`   | `cubic-bezier(0.65, 0, 0.35, 1)` |
| `--ease-spring`   | `cubic-bezier(0.34, 1.56, 0.64, 1)` |

### Browsing tokens visually

Clone the repository and run the docs app — `/tokens` renders live swatches that react to the `data-*` attribute switches:

```bash
pnpm install
pnpm -C packages/ui build   # build the lib first
pnpm -C apps/docs dev
# open http://localhost:3000/tokens
```

---

## Overriding styles

Every component emits stable, low-specificity BEM class names. Override them from your own CSS with a single-class selector:

```css
/* Bump up button padding globally */
.pds-btn--md {
  padding-inline: 1.25rem;
}

/* Give your app's brand button a different shadow */
.my-app .pds-btn--primary {
  box-shadow: 0 6px 18px -4px rgba(0, 200, 200, 0.4);
}
```

Or pass `className` directly to a component — it's appended after the library's own classes:

```tsx
<Button className="my-special-button">Action</Button>
```

```css
.my-special-button {
  letter-spacing: 0.05em;
}
```

The full BEM block list lives in `dist/styles.css` if you want to grep it; the canonical authoring source is `packages/ui/src/components/*.css` in the repository.

---

## Local development

All commands run from the repo root. Package manager is `pnpm@10.33.0` (Node ≥ 20).

```bash
pnpm install                          # install all workspaces

# Library
pnpm -C packages/ui typecheck         # tsc --noEmit
pnpm -C packages/ui build             # tsup → dist/, then build-css.mjs concatenates styles.css
pnpm -C packages/ui dev               # tsup --watch (CSS changes need a fresh `pnpm -C packages/ui build`)
pnpm -C packages/ui clean             # rm -rf dist

# Docs app
pnpm -C apps/docs typecheck
pnpm -C apps/docs dev                 # Next.js 16 Turbopack on :3000
pnpm -C apps/docs build               # next build
```

There is no test runner configured yet, and no root-level lint. Typecheck is the only static gate.

The docs app imports `@bubble-design-system/ui/styles.css` directly from the lib's `dist/`, so any CSS change in the lib needs a fresh `pnpm -C packages/ui build` to show up in the docs dev server. (Component prop / JSX changes hot-reload normally.)

---

## Contributing

1. **Read `PROGRESS.md` first.** It is the source of truth for project state, decision history (with rationale), the next-step task list, and verification commands. Update it after any non-trivial change.

2. **Component authoring rules** (enforced by convention, not lint):

   - Content goes through `children`, not `label`/`title`/`text` props. The exception is semantically distinct slots like `Toast` title + description.
   - Always `forwardRef` to the Base UI primitive.
   - Spread `...props` so consumers get every native HTML attribute for free.
   - `Omit<BaseProps, "className">` then re-add `className?: string` to narrow Base UI's union type.
   - Variant / size are discriminated string enums with sensible defaults.
   - `cn("pds-block", `pds-block--${variant}`, `pds-block--${size}`, className)` — user `className` **last**, so it appears after the library's defaults in the output string.
   - Handle both `disabled:` and `[data-disabled]` (Base UI uses the data-attr form) in the component's CSS file.
   - Export the component and its `Props` type from `src/index.ts`.

3. **CSS authoring rules:**

   - One CSS file per component under `src/components/`. The block name is `pds-<component>` (kebab-case for multi-word components, e.g. `pds-status-pill`).
   - Use BEM: `.pds-btn`, `.pds-btn__icon`, `.pds-btn--primary`. Avoid descendant or nested selectors that raise specificity above (0, 1, 0).
   - Reference tokens directly: `background-color: var(--color-bg-brand)`. Never hard-code a value that has a token.
   - The build pipeline concatenates all component CSS plus `tokens.css` + `base.css` into one shipped `dist/styles.css`.

4. **Token rules:**

   - Token names are part of the design spec and round-trip 1:1 with code. Do **not** rename tokens for cosmetic reasons.
   - Component CSS reads `var(--…)` at use-site so runtime `data-*` switching keeps working. If a rule resolves a token to a literal value, it freezes — never inline a token's resolved value.

5. **Stack gotchas:**

   - TypeScript 6 needs `ignoreDeprecations: "6.0"` (already set in `tsconfig.base.json`) because `tsup`'s `rollup-plugin-dts` still uses the deprecated `baseUrl`. Leave the flag until that toolchain catches up.
   - `@base-ui/react` was renamed from `@base-ui-components/react` at the 1.0 stable release (2025-12-11). Import paths use the new scope: `@base-ui/react/<primitive>`.
   - The library ships a global `box-sizing: border-box` in `base.css`. Component CSS assumes it.

6. **Before opening a PR:**

   - `pnpm -C packages/ui typecheck`
   - `pnpm -C packages/ui build`
   - `pnpm -C apps/docs typecheck`
   - Spot-check the docs gallery and verify toggling `data-theme` / `data-brand` / `data-radius` / `data-density` re-skins live (no rebuild needed). If live switching stops working, the most likely cause is a CSS rule that hard-coded a value instead of referencing a token.

---

## License

MIT
