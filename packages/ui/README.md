# @plain-design-system/ui

> Minimal, token-driven React component library built on [Base UI](https://base-ui.com/) and [Tailwind CSS v4](https://tailwindcss.com/).

The entire visual language — color, brand, gray family, radius, density, typography, motion — is driven by CSS custom properties. Toggle a single `data-*` attribute on `<html>` and the whole app re-skins live, with no rebuild.

```tsx
<html data-theme="dark" data-brand="violet" data-radius="soft" data-density="comfortable">
```

- **16 components** wrapped around [`@base-ui/react`](https://base-ui.com/) primitives — accessible by construction, styled with Tailwind v4 utilities.
- **A 280+ CSS custom property token system** spanning color (light/dark, 3 gray families, 6 brand palettes), radius (4 scales), density (3 scales), typography (3 font pairs), shadow and motion.
- **Live theme switching** via six `data-*` attributes on any ancestor. `@theme inline` keeps utilities resolving `var(--…)` at use-site, so swapping `data-theme="light"` for `data-theme="dark"` reflows the UI without re-rendering or rebuilding.
- **Dual ESM + CJS** with per-format `.d.ts` / `.d.cts`. `sideEffects: false` so unused components tree-shake out.
- **Composable by default** — components take `children`, spread `...props`, forward refs, and `tailwind-merge` lets your `className` win conflicts.

---

## Table of contents

- [Tech stack](#tech-stack)
- [Installation](#installation)
- [Setup](#setup)
- [Runtime theming](#runtime-theming)
- [Components](#components)
- [Design tokens](#design-tokens)
- [Project structure](#project-structure)
- [Local development](#local-development)
- [Contributing](#contributing)
- [License](#license)

---

## Tech stack

| Concern | Tool |
|---|---|
| Framework | React 19 (works with ≥ 18.2) |
| Primitives | `@base-ui/react` ≥ 1.0 (the post-rename successor to `@base-ui-components/react`) |
| Styling | Tailwind CSS v4 with `@theme inline` |
| Class composition | `clsx` + `tailwind-merge` (re-exported as `cn()`) |
| Build tool | `tsup` (ESM + CJS + dual `.d.ts`) |
| Language | TypeScript 6 |
| Package manager | `pnpm@10.33.0` |
| Node | ≥ 20 |

---

## Installation

```bash
# npm
npm install @plain-design-system/ui

# pnpm
pnpm add @plain-design-system/ui

# yarn
yarn add @plain-design-system/ui
```

Then install the peer dependencies your app must have:

```bash
npm install react react-dom tailwindcss @base-ui/react
```

| Peer dependency | Required version |
|---|---|
| `react` | ≥ 18.2 |
| `react-dom` | ≥ 18.2 |
| `tailwindcss` | ≥ 4.0 |
| `@base-ui/react` | ≥ 1.0.0 |

---

## Setup

### 1. Import the preset into your global stylesheet

The preset pulls in Tailwind v4, the design tokens, and registers them with Tailwind via `@theme inline`. One import wires everything up.

```css
/* app/globals.css — or wherever your global styles live */
@import "@plain-design-system/ui/preset.css";
```

If you only want the raw CSS custom properties (no Tailwind layer), import the tokens file directly:

```css
@import "@plain-design-system/ui/tokens.css";
```

### 2. Set the theme attributes on your root element

```tsx
// app/layout.tsx (Next.js App Router example)
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-theme="light"
      data-gray="slate"
      data-brand="blue"
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
import { Button, Modal, Divider } from "@plain-design-system/ui";

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

Six `data-*` attributes on any ancestor element (typically `<html>` or `<body>`) re-skin every descendant at runtime, with no rebuild.

| Attribute | Values | Default | What it controls |
|---|---|---|---|
| `data-theme` | `light` · `dark` | `light` | Semantic color mapping (background, text, border, shadow). |
| `data-gray` | `slate` · `neutral` · `stone` | `slate` | The gray family used for surfaces and text. |
| `data-brand` | `blue` · `violet` · `emerald` · `orange` · `mono` · `teal` | `blue` | The brand palette (`--brand-50` through `--brand-950`). |
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
  Alert, Avatar, Badge, Button, Checkbox, Divider, DropdownMenu,
  Input, Modal, Radio, RadioGroup, Select, Skeleton, Switch,
  Tabs, Toast, Tooltip, useToast, cn,
} from "@plain-design-system/ui";
```

Conventions shared by all components:

- They `forwardRef` to the underlying Base UI primitive.
- Native HTML attributes are spread via `...props` — `onClick`, `aria-*`, `id`, `style` all just work.
- `className` is the last argument to `cn()`, so your overrides win via `tailwind-merge`.
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
| `children` | `ReactNode` | — | The body copy, rendered in `text-secondary`. |
| `className` | `string` | — | Extra classes (merged via `cn`). |
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

### Divider

Horizontal or vertical separator with a semantic role from `@base-ui/react/separator`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` | Layout direction. |
| `className` | `string` | — | Extra classes. |
| `...props` | Base UI `Separator` props | — | Spread to the underlying element. |

```tsx
<Divider />
<div className="flex h-8 items-center"><span>A</span><Divider orientation="vertical" /><span>B</span></div>
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

Item components accept their Base UI props plus `className`.

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
    <div className="mt-4 flex justify-end gap-2">
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
| `className` | `string` | — | Defaults to `flex flex-col gap-2`. |
| `...props` | Base UI `RadioGroup` props | — | `value`, `defaultValue`, `onValueChange`. |

```tsx
<RadioGroup defaultValue="email">
  <label className="flex items-center gap-2"><Radio value="email" /> Email</label>
  <label className="flex items-center gap-2"><Radio value="sms" /> SMS</label>
</RadioGroup>
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

**`Select.Trigger` props:**

| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Density-aware control height. |
| `className` | `string` | — | Extra classes. |

**`Select.Value` props:**

| Prop | Type | Default | Description |
|---|---|---|---|
| `placeholder` | `ReactNode` | — | Rendered in `text-tertiary` when no value is selected. |
| `className` | `string` | — | Extra classes. |

**`Select.Content` props:**

| Prop | Type | Default | Description |
|---|---|---|---|
| `sideOffset` | `number` | `6` | Distance from trigger. |
| `className` | `string` | — | Extra classes on the popup. |

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

Loading placeholder with `animate-pulse`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `shape` | `"line" \| "circle" \| "block"` | `"line"` | Default dimensions and radius. |
| `className` | `string` | — | Override width/height/radius. |
| `...props` | `HTMLAttributes<HTMLDivElement>` | — | Native div attributes. |

```tsx
<Skeleton />
<Skeleton shape="circle" className="size-10" />
<Skeleton shape="block" className="h-24" />
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

### Toast

Built on `@base-ui/react/toast`. Provides a `<Toast.Provider>` boundary, a `<Toast.Viewport>` for positioning, a pre-built `<Toast.Toaster>` that renders the queue, and the `useToast()` hook to push toasts.

| Sub-component | Description |
|---|---|
| `Toast.Provider` | Wrap your app to enable toasts. |
| `Toast.Viewport` | Positioned region where toasts mount (bottom-right by default). |
| `Toast.Toaster` | Pre-styled queue renderer — drop this inside `Provider`. |
| `useToast()` | Hook returning Base UI's toast manager (`.add({ title, description })`). |

```tsx
import { Toast, useToast, Button } from "@plain-design-system/ui";

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

Re-exported helper that composes `clsx` with `tailwind-merge` — useful when building your own components on top of the design tokens.

```tsx
import { cn } from "@plain-design-system/ui";

cn("p-4", isActive && "bg-bg-brand", className);
cn("p-4", "p-8");               // → "p-8"
cn("bg-blue-600", "bg-red-600"); // → "bg-red-600"
```

---

## Design tokens

All tokens are CSS custom properties defined in `src/tokens.css` and registered with Tailwind v4 via `@theme inline` in `src/preset.css`. The 1:1 token-to-utility mapping (`--color-bg-brand` → `bg-bg-brand`) is intentional and load-bearing — token names mirror the design spec, so designers and engineers stay in sync.

### Color tokens

Semantic colors map to primitive palettes and are remapped by `[data-theme]`, `[data-gray]`, and `[data-brand]`.

| Token | Tailwind utility | Purpose |
|---|---|---|
| `--color-bg-primary` | `bg-bg-primary` | Page background. |
| `--color-bg-secondary` | `bg-bg-secondary` | Secondary surface (cards on page). |
| `--color-bg-tertiary` | `bg-bg-tertiary` | Tertiary surface (inset wells). |
| `--color-bg-inverse` | `bg-bg-inverse` | Inverted surface (tooltip, toast). |
| `--color-bg-brand` | `bg-bg-brand` | Brand primary fill. |
| `--color-bg-brand-hover` | `bg-bg-brand-hover` | Brand hover state. |
| `--color-bg-brand-active` | `bg-bg-brand-active` | Brand pressed state. |
| `--color-bg-brand-subtle` | `bg-bg-brand-subtle` | Tinted brand surface (info backgrounds, badges). |
| `--color-bg-success` | `bg-bg-success` | Soft success surface. |
| `--color-bg-success-strong` | `bg-bg-success-strong` | Solid success fill. |
| `--color-bg-warning` | `bg-bg-warning` | Soft warning surface. |
| `--color-bg-warning-strong` | `bg-bg-warning-strong` | Solid warning fill. |
| `--color-bg-danger` | `bg-bg-danger` | Soft danger surface. |
| `--color-bg-danger-strong` | `bg-bg-danger-strong` | Solid danger fill (destructive buttons). |
| `--color-bg-danger-hover` | `bg-bg-danger-hover` | Danger hover state. |
| `--color-bg-info` | `bg-bg-info` | Info alert surface. |
| `--color-bg-hover` | `bg-bg-hover` | Neutral hover. |
| `--color-bg-pressed` | `bg-bg-pressed` | Neutral pressed. |
| `--color-bg-disabled` | `bg-bg-disabled` | Disabled surface. |
| `--color-text-primary` | `text-text-primary` | Body text. |
| `--color-text-secondary` | `text-text-secondary` | Supporting text. |
| `--color-text-tertiary` | `text-text-tertiary` | Placeholder, hints. |
| `--color-text-disabled` | `text-text-disabled` | Disabled text. |
| `--color-text-inverse` | `text-text-inverse` | Text on `bg-inverse`. |
| `--color-text-brand` | `text-text-brand` | Brand-colored text (links). |
| `--color-text-success` | `text-text-success` | Success copy. |
| `--color-text-warning` | `text-text-warning` | Warning copy. |
| `--color-text-danger` | `text-text-danger` | Error copy. |
| `--color-text-on-brand` | `text-text-on-brand` | Text on `bg-brand`. |
| `--color-text-on-danger` | `text-text-on-danger` | Text on `bg-danger-strong`. |
| `--color-text-on-success` | `text-text-on-success` | Text on `bg-success-strong`. |
| `--color-border-primary` | `border-border-primary` | Default form/control border. |
| `--color-border-secondary` | `border-border-secondary` | Section dividers, cards. |
| `--color-border-tertiary` | `border-border-tertiary` | Subtle inner dividers. |
| `--color-border-brand` | `border-border-brand` | Selected/active accent. |
| `--color-border-success` | `border-border-success` | Success accent. |
| `--color-border-warning` | `border-border-warning` | Warning accent. |
| `--color-border-danger` | `border-border-danger` | Error accent (invalid inputs). |
| `--color-border-focus` | `border-border-focus` | Focus ring color. |

### Primitive palettes

These are the raw color swatches that the semantic tokens reference. You usually shouldn't touch them directly, but they're exposed if you need to.

| Family | Stops | Notes |
|---|---|---|
| `--slate-*` | 50–950 | Default gray family. |
| `--neutral-*` | 50–950 | True neutral (no temperature). |
| `--stone-*` | 50–950 | Warm gray. |
| `--blue-*` | 50–950 | Default brand. |
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

| Token | Tailwind utility | default | sharp | soft | pill |
|---|---|---|---|---|---|
| `--radius-xs` | `rounded-xs` | 2px | 0px | 4px | 4px |
| `--radius-sm` | `rounded-sm` | 4px | 1px | 8px | 9999px |
| `--radius-md` | `rounded-md` | 6px | 2px | 12px | 9999px |
| `--radius-lg` | `rounded-lg` | 8px | 3px | 14px | 9999px |
| `--radius-xl` | `rounded-xl` | 12px | 4px | 18px | 18px |
| `--radius-2xl` | `rounded-2xl` | 16px | 6px | 24px | 22px |
| `--radius-full` | `rounded-full` | 9999px | 9999px | 9999px | 9999px |

### Shadow

Light theme uses cool slate tints; dark theme uses opaque black. The focus ring tracks the brand color.

| Token | Tailwind utility | Purpose |
|---|---|---|
| `--shadow-xs` | `shadow-xs` | Hairline lift. |
| `--shadow-sm` | `shadow-sm` | Subtle card. |
| `--shadow-md` | `shadow-md` | Standard card. |
| `--shadow-lg` | `shadow-lg` | Popover, dropdown. |
| `--shadow-xl` | `shadow-xl` | Modal. |
| `--shadow-focus` | `shadow-focus` | Focus ring (3px brand-tinted). |

### Typography

| Token | Tailwind utility | Value |
|---|---|---|
| `--font-size-xs` | `text-xs` | 0.75rem |
| `--font-size-sm` | `text-sm` | 0.875rem |
| `--font-size-md` | `text-md` | 1rem |
| `--font-size-lg` | `text-lg` | 1.125rem |
| `--font-size-xl` | `text-xl` | 1.25rem |
| `--font-size-2xl` | `text-2xl` | 1.5rem |
| `--font-size-3xl` | `text-3xl` | 1.875rem |
| `--font-size-4xl` | `text-4xl` | 2.25rem |
| `--font-size-5xl` | `text-5xl` | 3rem |
| `--font-size-6xl` | `text-6xl` | 3.75rem |
| `--line-height-tight` | `leading-tight` | 1.15 |
| `--line-height-snug` | `leading-snug` | 1.3 |
| `--line-height-normal` | `leading-normal` | 1.5 |
| `--line-height-relaxed` | `leading-relaxed` | 1.65 |
| `--letter-tight` | `tracking-tight` | -0.022em |
| `--letter-snug` | `tracking-snug` | -0.012em |
| `--letter-normal` | `tracking-normal` | 0 |
| `--letter-wide` | `tracking-wide` | 0.04em |
| `--font-weight-regular` / `medium` / `semibold` / `bold` | `font-*` | 400 / 500 / 600 / 700 |
| `--font-sans` / `--font-mono` | `font-sans` / `font-mono` | Set by `[data-font]` |

### Spacing

`--space-0` through `--space-24` follow a 0.25rem (4px) scale, doubling to 0.5rem after 4. **Intentionally not registered with Tailwind** — Tailwind v4's default `--spacing` multiplier already produces identical values, so the standard `p-1`, `gap-4`, `m-8` utilities work as-is.

### Density (control sizing)

Selected by `[data-density]`. These tokens have no Tailwind namespace, so components reference them with arbitrary values (`h-[var(--control-h-md)]`).

| Token | default | compact | comfortable |
|---|---|---|---|
| `--control-h-sm` | 28px | 24px | 32px |
| `--control-h-md` | 36px | 30px | 42px |
| `--control-h-lg` | 44px | 38px | 52px |
| `--control-px-sm` | 10px | 8px | 12px |
| `--control-px-md` | 14px | 12px | 18px |
| `--control-px-lg` | 18px | 16px | 22px |
| `--card-p` | 24px | 16px | 32px |
| `--row-gap` | 16px | 12px | 20px |

### Motion

| Token | Tailwind utility | Value |
|---|---|---|
| `--duration-instant` | `duration-instant` | 50ms |
| `--duration-fast` | `duration-fast` | 120ms |
| `--duration-normal` | `duration-normal` | 200ms |
| `--duration-slow` | `duration-slow` | 320ms |
| `--duration-slower` | `duration-slower` | 500ms |
| `--ease-linear` | `ease-linear` | `linear` |
| `--ease-out` | `ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` |
| `--ease-in-out` | `ease-in-out` | `cubic-bezier(0.65, 0, 0.35, 1)` |
| `--ease-spring` | `ease-spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` |

### Browsing tokens visually

Clone the repository and run the docs app — `/tokens` renders live swatches that react to the `data-*` attribute switches:

```bash
pnpm install
pnpm -C apps/docs dev
# open http://localhost:3000/tokens
```

---

## Project structure

The library lives inside a pnpm-workspaces monorepo. The published package only ships `dist/`; everything else is for development.

```
plain-design-system/
├── apps/
│   └── docs/                        # Next.js 16 docs gallery (consumes the lib via workspace:*)
│       ├── app/
│       │   ├── layout.tsx           # Sets the six data-* attributes on <html>
│       │   ├── ThemeBar.tsx         # Live theme switcher with localStorage persistence
│       │   ├── globals.css          # @import "@plain-design-system/ui/preset.css"
│       │   ├── page.tsx             # Component gallery
│       │   └── tokens/page.tsx      # Token reference with live swatches
│       └── package.json
├── packages/
│   └── ui/                          # @plain-design-system/ui — this package
│       ├── src/
│       │   ├── components/          # Button, Input, Modal, Toast, Tooltip, …
│       │   │   ├── Alert.tsx
│       │   │   ├── Avatar.tsx
│       │   │   ├── Badge.tsx
│       │   │   ├── Button.tsx
│       │   │   ├── Checkbox.tsx
│       │   │   ├── Divider.tsx
│       │   │   ├── DropdownMenu.tsx
│       │   │   ├── Input.tsx
│       │   │   ├── Modal.tsx
│       │   │   ├── Radio.tsx
│       │   │   ├── Select.tsx
│       │   │   ├── Skeleton.tsx
│       │   │   ├── Switch.tsx
│       │   │   ├── Tabs.tsx
│       │   │   ├── Toast.tsx
│       │   │   └── Tooltip.tsx
│       │   ├── utils/cn.ts          # clsx + tailwind-merge
│       │   ├── tokens.css           # 558 lines of CSS custom properties
│       │   ├── preset.css           # @theme inline mapping → Tailwind utilities
│       │   └── index.ts             # Public entry point
│       ├── tsup.config.ts           # ESM + CJS + dual .d.ts build
│       ├── tsconfig.json
│       └── package.json
├── tsconfig.base.json               # Shared strict TS config (TS 6, NodeNext)
├── pnpm-workspace.yaml              # packages/*, apps/*
├── package.json                     # Monorepo root (private)
├── PROGRESS.md                      # Source of truth for project state + decisions
└── CLAUDE.md                        # Instructions for AI-assisted edits
```

---

## Local development

All commands run from the repo root. Package manager is `pnpm@10.33.0` (Node ≥ 20).

```bash
pnpm install                          # install all workspaces

# Library
pnpm -C packages/ui typecheck         # tsc --noEmit
pnpm -C packages/ui build             # tsup → dist/, then cp preset.css + tokens.css
pnpm -C packages/ui dev               # tsup --watch
pnpm -C packages/ui clean             # rm -rf dist

# Docs app
pnpm -C apps/docs typecheck
pnpm -C apps/docs dev                 # Next.js 16 Turbopack on :3000
pnpm -C apps/docs build               # next build
```

There is no test runner configured yet, and no root-level lint. Typecheck is the only static gate.

The docs app uses `@source "../../../packages/ui/src/**/*.{ts,tsx}"` so Tailwind scans the library source during docs dev — no library rebuild is needed when editing components.

---

## Contributing

1. **Read `PROGRESS.md` first.** It is the source of truth for project state, decision history (with rationale), the next-step task list, and verification commands. Update it after any non-trivial change.

2. **Component authoring rules** (enforced by convention, not lint):

   - Content goes through `children`, not `label`/`title`/`text` props. The exception is semantically distinct slots like `Toast` title + description.
   - Always `forwardRef` to the Base UI primitive.
   - Spread `...props` so consumers get every native HTML attribute for free.
   - `Omit<BaseProps, "className">` then re-add `className?: string` to narrow Base UI's union type.
   - Variant / size are discriminated string enums with sensible defaults.
   - `cn(baseClasses, variantClasses[variant], sizeClasses[size], className)` — user `className` **last**, so `tailwind-merge` lets it win.
   - Handle both `disabled:` and `data-[disabled]:` (Base UI uses the data-attr form).
   - Density-driven sizing uses arbitrary values (`h-[var(--control-h-md)]`) because `--control-h-*` has no Tailwind namespace.
   - Export the component and its `Props` type from `src/index.ts`.

3. **Token rules:**

   - Token names are part of the design spec and round-trip 1:1 with code. Do **not** rename tokens to make Tailwind utilities prettier (see `PROGRESS.md` §3.9 — an earlier flat-naming attempt was reversed).
   - Keep `@theme inline` in `preset.css`. Dropping the `inline` modifier silently breaks runtime theme switching by resolving tokens to literal values at build time.

4. **Stack gotchas:**

   - TypeScript 6 needs `ignoreDeprecations: "6.0"` (already set in `tsconfig.base.json`) because `tsup`'s `rollup-plugin-dts` still uses the deprecated `baseUrl`. Leave the flag until that toolchain catches up.
   - `@base-ui/react` was renamed from `@base-ui-components/react` at the 1.0 stable release (2025-12-11). Import paths use the new scope: `@base-ui/react/<primitive>`.
   - Tailwind v4 is required in consumer apps — this is an accepted architectural cost (shadcn-style override pattern).

5. **Before opening a PR:**

   - `pnpm -C packages/ui typecheck`
   - `pnpm -C packages/ui build`
   - `pnpm -C apps/docs typecheck`
   - Spot-check the docs gallery and verify toggling `data-theme` / `data-brand` / `data-radius` / `data-density` re-skins live (no rebuild needed). If live switching stops working, the most likely cause is that `@theme inline` lost its `inline` modifier.

---

## License

MIT
