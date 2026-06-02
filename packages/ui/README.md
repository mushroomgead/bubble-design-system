# @plain-ds/ui

Minimal, token-driven React component library built on [Base UI](https://base-ui.com/) and [Tailwind CSS v4](https://tailwindcss.com/).

- 16 unstyled-by-default components wrapped in opinionated Tailwind styles
- Live theme switching via `data-theme` / `data-brand` / `data-radius` / `data-density` attributes — no rebuild
- Dual ESM + CJS output, per-format `.d.ts` / `.d.cts`
- `sideEffects: false` so unused components tree-shake out

## Install

```bash
npm install @plain-ds/ui
# or: pnpm add @plain-ds/ui
```

Peer dependencies you must have installed in your app:

```bash
npm install react react-dom tailwindcss @base-ui/react
```

Required: React ≥ 18.2, Tailwind CSS ≥ 4.0, `@base-ui/react` ≥ 1.0.

## Setup

Import the preset into your app's global stylesheet. The preset pulls in Tailwind, the design tokens, and registers them as Tailwind theme values.

```css
/* app/globals.css (or wherever your global styles live) */
@import "@plain-ds/ui/preset.css";
```

Then set the runtime theme attributes on your root element:

```tsx
// app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      data-theme="light"
      data-brand="indigo"
      data-radius="md"
      data-density="comfortable"
    >
      <body>{children}</body>
    </html>
  );
}
```

Toggling any of those `data-*` attributes at runtime re-skins the whole app — no rebuild needed.

## Usage

```tsx
import { Button, Divider, Modal } from "@plain-ds/ui";

export function Example() {
  return (
    <div>
      <Button variant="primary">Save</Button>
      <Divider />
      <Modal>
        <Modal.Trigger>Open</Modal.Trigger>
        <Modal.Content>Hello</Modal.Content>
      </Modal>
    </div>
  );
}
```

## Available components

`Alert`, `Avatar`, `Badge`, `Button`, `Checkbox`, `Divider`, `DropdownMenu`, `Input`, `Modal`, `Radio` / `RadioGroup`, `Select`, `Skeleton`, `Switch`, `Tabs`, `Toast` (+ `useToast`), `Tooltip`.

Plus the `cn()` utility (clsx + tailwind-merge) for composing class names.

## Tokens only

If you only want the design tokens (no Tailwind layer), import the tokens sheet directly:

```css
@import "@plain-ds/ui/tokens.css";
```

## License

MIT
