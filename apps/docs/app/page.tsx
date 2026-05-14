"use client";

import { Button } from "@plain-ds/ui";

const variants = ["primary", "secondary", "destructive", "ghost"] as const;
const sizes = ["sm", "md", "lg"] as const;

export default function HomePage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16 space-y-16">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Plain DS</h1>
        <p className="text-text-secondary">
          Component gallery — verifying tokens render as expected.
        </p>
      </header>

      <section className="space-y-6">
        <h2 className="text-xl font-semibold">Button · variants × sizes</h2>
        <div className="space-y-4">
          {variants.map((variant) => (
            <div key={variant} className="flex items-center gap-4">
              <span className="w-28 text-sm text-text-secondary">{variant}</span>
              {sizes.map((size) => (
                <Button key={size} variant={variant} size={size}>
                  {size === "sm" ? "Small" : size === "md" ? "Medium" : "Large"}
                </Button>
              ))}
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-xl font-semibold">Button · states</h2>
        <div className="space-y-4">
          {variants.map((variant) => (
            <div key={variant} className="flex items-center gap-4">
              <span className="w-28 text-sm text-text-secondary">{variant}</span>
              <Button variant={variant}>Default</Button>
              <Button variant={variant} disabled>
                Disabled
              </Button>
            </div>
          ))}
        </div>
        <p className="text-sm text-text-secondary">
          Tab through the buttons to verify the focus ring (shadow-focus).
        </p>
      </section>

      <section className="space-y-6">
        <h2 className="text-xl font-semibold">Button · className override</h2>
        <div className="flex items-center gap-4">
          <Button className="rounded-full px-8">Rounded</Button>
          <Button variant="secondary" className="border-border-brand text-text-brand">
            Custom border
          </Button>
          <Button variant="ghost" className="text-text-danger hover:bg-bg-danger">
            Themed ghost
          </Button>
        </div>
        <p className="text-sm text-text-secondary">
          User-passed className wins via tailwind-merge.
        </p>
      </section>

      <section className="space-y-6">
        <h2 className="text-xl font-semibold">Runtime token switching</h2>
        <p className="text-sm text-text-secondary">
          Open DevTools and run these on{" "}
          <code className="font-mono text-xs">document.documentElement</code>{" "}
          to see the gallery re-skin live without a reload:
        </p>
        <pre className="text-xs font-mono bg-bg-secondary border border-border-secondary rounded-md p-4 overflow-x-auto">
{`document.documentElement.setAttribute("data-theme", "dark");
document.documentElement.setAttribute("data-brand", "violet");
document.documentElement.setAttribute("data-radius", "pill");
document.documentElement.setAttribute("data-density", "compact");`}
        </pre>
      </section>
    </main>
  );
}
