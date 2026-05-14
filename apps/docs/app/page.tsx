"use client";

import { Button } from "@plain-ds/ui";

const variants = ["primary", "secondary", "destructive", "ghost"] as const;
const sizes = ["sm", "md", "lg"] as const;

export default function HomePage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16 space-y-16">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Plain DS</h1>
        <p className="text-content-muted">
          Component gallery — verifying tokens render as expected.
        </p>
      </header>

      <section className="space-y-6">
        <h2 className="text-xl font-semibold">Button · variants × sizes</h2>
        <div className="space-y-4">
          {variants.map((variant) => (
            <div key={variant} className="flex items-center gap-4">
              <span className="w-28 text-sm text-content-muted">{variant}</span>
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
              <span className="w-28 text-sm text-content-muted">{variant}</span>
              <Button variant={variant}>Default</Button>
              <Button variant={variant} disabled>
                Disabled
              </Button>
            </div>
          ))}
        </div>
        <p className="text-sm text-content-muted">
          Tab through the buttons to verify the focus ring (ring-brand).
        </p>
      </section>

      <section className="space-y-6">
        <h2 className="text-xl font-semibold">Button · className override</h2>
        <div className="flex items-center gap-4">
          <Button className="rounded-full px-8">Rounded</Button>
          <Button variant="secondary" className="border-brand text-brand-fg">
            Custom border
          </Button>
          <Button variant="ghost" className="text-danger-fg hover:bg-danger-subtle">
            Themed ghost
          </Button>
        </div>
        <p className="text-sm text-content-muted">
          User-passed className wins via tailwind-merge.
        </p>
      </section>
    </main>
  );
}
