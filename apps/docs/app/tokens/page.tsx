"use client";

import Link from "next/link";
import { ThemeBar } from "../ThemeBar";

const colorBgTokens = [
  { token: "--color-bg-primary", utility: "bg-bg-primary", note: "App canvas" },
  { token: "--color-bg-secondary", utility: "bg-bg-secondary", note: "Subtle panel" },
  { token: "--color-bg-tertiary", utility: "bg-bg-tertiary", note: "Pressed / nested panel" },
  { token: "--color-bg-inverse", utility: "bg-bg-inverse", note: "Tooltip / dark overlay surface" },
  { token: "--color-bg-brand", utility: "bg-bg-brand", note: "Primary action fill" },
  { token: "--color-bg-brand-hover", utility: "bg-bg-brand-hover", note: "Primary action :hover" },
  { token: "--color-bg-brand-active", utility: "bg-bg-brand-active", note: "Primary action :active" },
  { token: "--color-bg-brand-subtle", utility: "bg-bg-brand-subtle", note: "Tinted brand background" },
  { token: "--color-bg-success", utility: "bg-bg-success", note: "Success alert / badge background" },
  { token: "--color-bg-success-strong", utility: "bg-bg-success-strong", note: "Solid success fill" },
  { token: "--color-bg-warning", utility: "bg-bg-warning", note: "Warning alert / badge background" },
  { token: "--color-bg-warning-strong", utility: "bg-bg-warning-strong", note: "Solid warning fill" },
  { token: "--color-bg-danger", utility: "bg-bg-danger", note: "Danger alert / badge background" },
  { token: "--color-bg-danger-strong", utility: "bg-bg-danger-strong", note: "Destructive action fill" },
  { token: "--color-bg-danger-hover", utility: "bg-bg-danger-hover", note: "Destructive action :hover" },
  { token: "--color-bg-info", utility: "bg-bg-info", note: "Info alert background" },
  { token: "--color-bg-hover", utility: "bg-bg-hover", note: "Generic row / item :hover" },
  { token: "--color-bg-pressed", utility: "bg-bg-pressed", note: "Generic row / item :active" },
  { token: "--color-bg-disabled", utility: "bg-bg-disabled", note: "Disabled control fill" },
];

const colorTextTokens = [
  { token: "--color-text-primary", utility: "text-text-primary", note: "Body copy, headings" },
  { token: "--color-text-secondary", utility: "text-text-secondary", note: "Supporting text" },
  { token: "--color-text-tertiary", utility: "text-text-tertiary", note: "Hints, placeholders" },
  { token: "--color-text-disabled", utility: "text-text-disabled", note: "Disabled labels" },
  { token: "--color-text-inverse", utility: "text-text-inverse", note: "Text on inverse surfaces" },
  { token: "--color-text-brand", utility: "text-text-brand", note: "Branded links / labels" },
  { token: "--color-text-success", utility: "text-text-success", note: "Success messages" },
  { token: "--color-text-warning", utility: "text-text-warning", note: "Warning messages" },
  { token: "--color-text-danger", utility: "text-text-danger", note: "Error messages" },
  { token: "--color-text-on-brand", utility: "text-text-on-brand", note: "Foreground on bg-bg-brand" },
  { token: "--color-text-on-danger", utility: "text-text-on-danger", note: "Foreground on bg-bg-danger-strong" },
  { token: "--color-text-on-success", utility: "text-text-on-success", note: "Foreground on bg-bg-success-strong" },
];

const colorBorderTokens = [
  { token: "--color-border-primary", utility: "border-border-primary", note: "Default control / divider" },
  { token: "--color-border-secondary", utility: "border-border-secondary", note: "Subtle section divider" },
  { token: "--color-border-tertiary", utility: "border-border-tertiary", note: "Very subtle inner divider" },
  { token: "--color-border-brand", utility: "border-border-brand", note: "Brand-highlighted border" },
  { token: "--color-border-success", utility: "border-border-success", note: "Success alert border" },
  { token: "--color-border-warning", utility: "border-border-warning", note: "Warning alert border" },
  { token: "--color-border-danger", utility: "border-border-danger", note: "Invalid input / danger border" },
  { token: "--color-border-focus", utility: "border-border-focus", note: "Focus ring border" },
];

const radiusTokens = [
  { token: "--radius-xs", utility: "rounded-xs" },
  { token: "--radius-sm", utility: "rounded-sm" },
  { token: "--radius-md", utility: "rounded-md" },
  { token: "--radius-lg", utility: "rounded-lg" },
  { token: "--radius-xl", utility: "rounded-xl" },
  { token: "--radius-2xl", utility: "rounded-2xl" },
  { token: "--radius-full", utility: "rounded-full" },
];

const shadowTokens = [
  { token: "--shadow-xs", utility: "shadow-xs" },
  { token: "--shadow-sm", utility: "shadow-sm" },
  { token: "--shadow-md", utility: "shadow-md" },
  { token: "--shadow-lg", utility: "shadow-lg" },
  { token: "--shadow-xl", utility: "shadow-xl" },
  { token: "--shadow-focus", utility: "shadow-focus" },
];

const fontSizeTokens = [
  { token: "--font-size-xs", utility: "text-xs", value: "0.75rem" },
  { token: "--font-size-sm", utility: "text-sm", value: "0.875rem" },
  { token: "--font-size-md", utility: "text-md", value: "1rem" },
  { token: "--font-size-lg", utility: "text-lg", value: "1.125rem" },
  { token: "--font-size-xl", utility: "text-xl", value: "1.25rem" },
  { token: "--font-size-2xl", utility: "text-2xl", value: "1.5rem" },
  { token: "--font-size-3xl", utility: "text-3xl", value: "1.875rem" },
  { token: "--font-size-4xl", utility: "text-4xl", value: "2.25rem" },
  { token: "--font-size-5xl", utility: "text-5xl", value: "3rem" },
  { token: "--font-size-6xl", utility: "text-6xl", value: "3.75rem" },
];

const lineHeightTokens = [
  { token: "--line-height-tight", utility: "leading-tight", value: "1.15" },
  { token: "--line-height-snug", utility: "leading-snug", value: "1.3" },
  { token: "--line-height-normal", utility: "leading-normal", value: "1.5" },
  { token: "--line-height-relaxed", utility: "leading-relaxed", value: "1.65" },
];

const fontWeightTokens = [
  { token: "--font-weight-regular", utility: "font-regular", value: "400" },
  { token: "--font-weight-medium", utility: "font-medium", value: "500" },
  { token: "--font-weight-semibold", utility: "font-semibold", value: "600" },
  { token: "--font-weight-bold", utility: "font-bold", value: "700" },
];

const trackingTokens = [
  { token: "--letter-tight", utility: "tracking-tight", value: "-0.022em" },
  { token: "--letter-snug", utility: "tracking-snug", value: "-0.012em" },
  { token: "--letter-normal", utility: "tracking-normal", value: "0" },
  { token: "--letter-wide", utility: "tracking-wide", value: "0.04em" },
];

const spacingTokens = [
  { token: "--space-0", value: "0" },
  { token: "--space-1", value: "0.25rem (4px)" },
  { token: "--space-2", value: "0.5rem (8px)" },
  { token: "--space-3", value: "0.75rem (12px)" },
  { token: "--space-4", value: "1rem (16px)" },
  { token: "--space-5", value: "1.25rem (20px)" },
  { token: "--space-6", value: "1.5rem (24px)" },
  { token: "--space-8", value: "2rem (32px)" },
  { token: "--space-10", value: "2.5rem (40px)" },
  { token: "--space-12", value: "3rem (48px)" },
  { token: "--space-16", value: "4rem (64px)" },
  { token: "--space-20", value: "5rem (80px)" },
  { token: "--space-24", value: "6rem (96px)" },
];

const motionDurationTokens = [
  { token: "--duration-instant", utility: "duration-instant", value: "50ms" },
  { token: "--duration-fast", utility: "duration-fast", value: "120ms" },
  { token: "--duration-normal", utility: "duration-normal", value: "200ms" },
  { token: "--duration-slow", utility: "duration-slow", value: "320ms" },
  { token: "--duration-slower", utility: "duration-slower", value: "500ms" },
];

const motionEaseTokens = [
  { token: "--ease-linear", utility: "ease-linear" },
  { token: "--ease-out", utility: "ease-out" },
  { token: "--ease-in-out", utility: "ease-in-out" },
  { token: "--ease-spring", utility: "ease-spring" },
];

const densityTokens = [
  { token: "--control-h-sm", note: "Small control height — Input/Button/Select sm" },
  { token: "--control-h-md", note: "Medium control height (default)" },
  { token: "--control-h-lg", note: "Large control height" },
  { token: "--control-px-sm", note: "Horizontal padding for sm controls" },
  { token: "--control-px-md", note: "Horizontal padding for md controls" },
  { token: "--control-px-lg", note: "Horizontal padding for lg controls" },
  { token: "--card-p", note: "Card / panel padding" },
  { token: "--row-gap", note: "Vertical gap between stacked controls" },
];

const dataAttributes: { attr: string; values: string[]; effect: string }[] = [
  {
    attr: "data-theme",
    values: ["light", "dark"],
    effect: "Swaps every --color-bg-*, --color-text-*, --color-border-*, and --shadow-* token to its dark variant.",
  },
  {
    attr: "data-gray",
    values: ["slate", "neutral", "stone"],
    effect: "Re-aliases --gray-50…950 (cool, true, or warm). Every surface/text/border token derived from gray inherits.",
  },
  {
    attr: "data-brand",
    values: ["blue", "violet", "emerald", "orange", "mono", "teal"],
    effect: "Re-aliases --brand-50…950. Every --color-bg-brand-*, --color-text-brand, --color-border-brand follows.",
  },
  {
    attr: "data-radius",
    values: ["default", "sharp", "soft", "pill"],
    effect: "Re-binds --radius-xs…2xl. rounded-* utilities pick up new values instantly.",
  },
  {
    attr: "data-density",
    values: ["default", "compact", "comfortable"],
    effect: "Re-binds --control-h-*, --control-px-*, --card-p, --row-gap. All sized controls reflow.",
  },
  {
    attr: "data-font",
    values: ["geist", "plex", "system"],
    effect: "Re-binds --font-sans and --font-mono.",
  },
];

function Section({
  id,
  title,
  description,
  children,
}: {
  id: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="space-y-4 scroll-mt-24">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold">{title}</h2>
        {description ? (
          <p className="text-sm text-text-secondary">{description}</p>
        ) : null}
      </div>
      {children}
    </section>
  );
}

function TokenRow({
  swatch,
  token,
  utility,
  note,
}: {
  swatch: React.ReactNode;
  token: string;
  utility?: string;
  note?: string;
}) {
  return (
    <div className="grid grid-cols-[64px_1fr] gap-4 items-center py-2 border-b border-border-tertiary last:border-b-0">
      <div className="flex items-center justify-center">{swatch}</div>
      <div className="min-w-0 space-y-0.5">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
          <code className="font-mono text-sm text-text-primary">{token}</code>
          {utility ? (
            <code className="font-mono text-xs text-text-secondary">
              {utility}
            </code>
          ) : null}
        </div>
        {note ? (
          <div className="text-xs text-text-tertiary">{note}</div>
        ) : null}
      </div>
    </div>
  );
}

export default function TokensPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 pb-20 space-y-12">
      <ThemeBar />

      <header className="space-y-3">
        <div className="text-xs uppercase tracking-wide text-text-tertiary">
          Reference
        </div>
        <h1 className="text-3xl font-semibold tracking-tight">Design tokens</h1>
        <p className="text-text-secondary max-w-2xl">
          Every visual decision in <code className="font-mono text-sm">@plain-design-system/ui</code>{" "}
          reads from a CSS custom property. Switch theme, brand, gray, radius,
          density or font with the bar above — every swatch on this page
          updates live. No rebuild.
        </p>
        <p className="text-text-secondary max-w-2xl">
          <Link
            href="/"
            className="text-text-brand hover:underline underline-offset-4"
          >
            ← Component gallery
          </Link>
        </p>
      </header>

      <Section
        id="how-to-use"
        title="How to use tokens"
        description="Two equally supported ways to consume the token sheet."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-border-secondary p-4 space-y-2 bg-bg-secondary">
            <div className="text-sm font-semibold">1. Tailwind utilities (recommended)</div>
            <p className="text-xs text-text-secondary">
              Every token is registered with Tailwind v4 via{" "}
              <code className="font-mono">@theme inline</code>, so you write
              utilities like any other Tailwind class.
            </p>
            <pre className="bg-bg-tertiary border border-border-tertiary rounded-md p-3 text-xs font-mono overflow-x-auto">
{`<div className="bg-bg-primary text-text-primary border border-border-secondary rounded-lg p-4 shadow-sm">
  <h3 className="text-lg font-semibold tracking-snug">Card</h3>
  <p className="text-sm text-text-secondary">Body copy goes here.</p>
</div>`}
            </pre>
          </div>
          <div className="rounded-lg border border-border-secondary p-4 space-y-2 bg-bg-secondary">
            <div className="text-sm font-semibold">2. Raw CSS variables</div>
            <p className="text-xs text-text-secondary">
              You don't need Tailwind to read these — they're plain CSS custom
              properties. Reach for{" "}
              <code className="font-mono">var(...)</code> when you need a token
              outside a className (style attributes, third-party CSS-in-JS, or
              tokens without a Tailwind namespace like{" "}
              <code className="font-mono">--control-h-md</code>).
            </p>
            <pre className="bg-bg-tertiary border border-border-tertiary rounded-md p-3 text-xs font-mono overflow-x-auto">
{`.my-card {
  background: var(--color-bg-primary);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border-secondary);
  border-radius: var(--radius-lg);
  padding: var(--card-p);
}`}
            </pre>
          </div>
        </div>

        <div className="rounded-md border border-border-tertiary bg-bg-secondary p-3 text-sm text-text-secondary">
          <strong className="text-text-primary">Naming pattern:</strong>{" "}
          <code className="font-mono text-xs">--color-{`{category}`}-{`{role}`}-{`{state?}`}</code>{" "}
          → <code className="font-mono text-xs">{`{category}`}-{`{category}`}-{`{role}`}-{`{state?}`}</code>{" "}
          utility. The category appears twice on purpose: the first prefix is
          the Tailwind property family (<code className="font-mono">bg</code>,{" "}
          <code className="font-mono">text</code>,{" "}
          <code className="font-mono">border</code>), and the second prefix is
          the token category from{" "}
          <code className="font-mono">tokens.css</code>. So{" "}
          <code className="font-mono">bg-bg-brand</code> reads as{" "}
          "background-color: var(--color-bg-brand)".
        </div>
      </Section>

      <Section
        id="runtime-switches"
        title="Runtime switches (data-* attributes)"
        description="Set these on <html> (or any ancestor). Toggling them at runtime re-skins every descendant — no rebuild, no React state."
      >
        <div className="rounded-lg border border-border-secondary overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-bg-secondary text-left">
              <tr>
                <th className="px-3 py-2 font-medium">Attribute</th>
                <th className="px-3 py-2 font-medium">Valid values</th>
                <th className="px-3 py-2 font-medium">What it changes</th>
              </tr>
            </thead>
            <tbody>
              {dataAttributes.map((d) => (
                <tr
                  key={d.attr}
                  className="border-t border-border-tertiary align-top"
                >
                  <td className="px-3 py-2 font-mono text-xs text-text-primary whitespace-nowrap">
                    {d.attr}
                  </td>
                  <td className="px-3 py-2 font-mono text-xs text-text-secondary">
                    {d.values.join(" · ")}
                  </td>
                  <td className="px-3 py-2 text-xs text-text-secondary">
                    {d.effect}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <pre className="bg-bg-tertiary border border-border-tertiary rounded-md p-3 text-xs font-mono overflow-x-auto">
{`<html
  data-theme="light"
  data-gray="slate"
  data-brand="blue"
  data-radius="default"
  data-density="default"
  data-font="geist"
>`}
        </pre>
      </Section>

      <Section
        id="color-bg"
        title="Color · background"
        description="Surface fills. Each swatch reacts live to data-theme, data-gray, and data-brand."
      >
        <div>
          {colorBgTokens.map((t) => (
            <TokenRow
              key={t.token}
              swatch={
                <div
                  className="h-10 w-10 rounded-md border border-border-secondary"
                  style={{ background: `var(${t.token})` }}
                />
              }
              token={t.token}
              utility={t.utility}
              note={t.note}
            />
          ))}
        </div>
      </Section>

      <Section
        id="color-text"
        title="Color · text"
        description="Foreground colors. *-on-* tokens are paired with their corresponding strong background fill (e.g. text-text-on-brand on bg-bg-brand)."
      >
        <div>
          {colorTextTokens.map((t) => (
            <TokenRow
              key={t.token}
              swatch={
                <div
                  className="h-10 w-10 rounded-md grid place-items-center text-base font-semibold border border-border-secondary bg-bg-primary"
                  style={{ color: `var(${t.token})` }}
                >
                  Aa
                </div>
              }
              token={t.token}
              utility={t.utility}
              note={t.note}
            />
          ))}
        </div>
      </Section>

      <Section
        id="color-border"
        title="Color · border"
        description="Used with border-* utilities. Pair with the matching bg-bg-* and text-text-* tokens for variant systems."
      >
        <div>
          {colorBorderTokens.map((t) => (
            <TokenRow
              key={t.token}
              swatch={
                <div
                  className="h-10 w-10 rounded-md bg-bg-primary"
                  style={{ border: `2px solid var(${t.token})` }}
                />
              }
              token={t.token}
              utility={t.utility}
              note={t.note}
            />
          ))}
        </div>
      </Section>

      <Section
        id="radius"
        title="Radius"
        description="Driven by data-radius. Toggle default / sharp / soft / pill to see every shape re-bind."
      >
        <div>
          {radiusTokens.map((t) => (
            <TokenRow
              key={t.token}
              swatch={
                <div
                  className="h-10 w-10 bg-bg-brand"
                  style={{ borderRadius: `var(${t.token})` }}
                />
              }
              token={t.token}
              utility={t.utility}
            />
          ))}
        </div>
      </Section>

      <Section
        id="shadow"
        title="Shadow"
        description="Elevation scale. --shadow-focus is the ring used by focus-visible states."
      >
        <div>
          {shadowTokens.map((t) => (
            <TokenRow
              key={t.token}
              swatch={
                <div
                  className="h-10 w-10 rounded-md bg-bg-primary"
                  style={{ boxShadow: `var(${t.token})` }}
                />
              }
              token={t.token}
              utility={t.utility}
            />
          ))}
        </div>
      </Section>

      <Section
        id="typography"
        title="Typography"
        description="Font size, line-height, weight, tracking, and font-family. Drives every text-*, leading-*, font-*, tracking-* utility."
      >
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-semibold mb-2">Font size</h3>
            {fontSizeTokens.map((t) => (
              <TokenRow
                key={t.token}
                swatch={
                  <div
                    className="font-semibold"
                    style={{ fontSize: `var(${t.token})`, lineHeight: 1 }}
                  >
                    Aa
                  </div>
                }
                token={t.token}
                utility={t.utility}
                note={t.value}
              />
            ))}
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-2">Line height</h3>
            {lineHeightTokens.map((t) => (
              <TokenRow
                key={t.token}
                swatch={
                  <div
                    className="text-xs text-text-secondary"
                    style={{ lineHeight: `var(${t.token})` }}
                  >
                    Aa<br />Aa
                  </div>
                }
                token={t.token}
                utility={t.utility}
                note={t.value}
              />
            ))}
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-2">Font weight</h3>
            {fontWeightTokens.map((t) => (
              <TokenRow
                key={t.token}
                swatch={
                  <div
                    className="text-base"
                    style={{ fontWeight: `var(${t.token})` }}
                  >
                    Aa
                  </div>
                }
                token={t.token}
                utility={t.utility}
                note={t.value}
              />
            ))}
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-2">Letter spacing</h3>
            {trackingTokens.map((t) => (
              <TokenRow
                key={t.token}
                swatch={
                  <div
                    className="text-sm"
                    style={{ letterSpacing: `var(${t.token})` }}
                  >
                    Type
                  </div>
                }
                token={t.token}
                utility={t.utility}
                note={t.value}
              />
            ))}
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-2">Font family</h3>
            <TokenRow
              swatch={
                <div className="font-sans text-sm">Aa</div>
              }
              token="--font-sans"
              utility="font-sans"
              note="Body / UI font (switched by data-font)"
            />
            <TokenRow
              swatch={
                <div className="font-mono text-sm">Aa</div>
              }
              token="--font-mono"
              utility="font-mono"
              note="Code / monospaced (switched by data-font)"
            />
          </div>
        </div>
      </Section>

      <Section
        id="spacing"
        title="Spacing"
        description="The spacing scale is intentionally NOT registered with Tailwind. The default Tailwind --spacing multiplier (0.25rem) already produces matching values — so use p-4, gap-3, mt-8 as usual. The tokens below exist so you can reference them in raw CSS."
      >
        <div>
          {spacingTokens.map((t) => (
            <TokenRow
              key={t.token}
              swatch={
                <div
                  className="h-2 bg-bg-brand rounded-sm"
                  style={{ width: `var(${t.token})` }}
                />
              }
              token={t.token}
              note={t.value}
            />
          ))}
        </div>
      </Section>

      <Section
        id="motion"
        title="Motion"
        description="Used by transition-* utilities and component animations. Pair a duration with an easing."
      >
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-semibold mb-2">Duration</h3>
            {motionDurationTokens.map((t) => (
              <TokenRow
                key={t.token}
                swatch={
                  <div className="font-mono text-xs text-text-secondary">
                    {t.value}
                  </div>
                }
                token={t.token}
                utility={t.utility}
              />
            ))}
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-2">Easing</h3>
            {motionEaseTokens.map((t) => (
              <TokenRow
                key={t.token}
                swatch={<div className="font-mono text-xs text-text-tertiary">fn</div>}
                token={t.token}
                utility={t.utility}
              />
            ))}
          </div>
        </div>
      </Section>

      <Section
        id="density"
        title="Density (control sizing)"
        description="These tokens drive control heights and paddings. They have no Tailwind namespace — read them with arbitrary values: h-[var(--control-h-md)]. Switch data-density to default / compact / comfortable and watch components reflow."
      >
        <div>
          {densityTokens.map((t) => (
            <TokenRow
              key={t.token}
              swatch={
                <div className="font-mono text-xs text-text-tertiary">var</div>
              }
              token={t.token}
              note={t.note}
            />
          ))}
        </div>
      </Section>

      <Section
        id="primitives"
        title="Primitive palette (Layer 1)"
        description="Raw color ramps that semantic tokens reference. You rarely need these directly — prefer semantic tokens (--color-bg-*, --color-text-*) so dark mode and brand swaps follow automatically."
      >
        <div className="text-sm text-text-secondary space-y-2">
          <p>
            Available scales (50 → 950):{" "}
            <code className="font-mono text-xs">--slate-*</code>,{" "}
            <code className="font-mono text-xs">--neutral-*</code>,{" "}
            <code className="font-mono text-xs">--stone-*</code>,{" "}
            <code className="font-mono text-xs">--blue-*</code>,{" "}
            <code className="font-mono text-xs">--violet-*</code>,{" "}
            <code className="font-mono text-xs">--emerald-*</code>,{" "}
            <code className="font-mono text-xs">--orange-*</code>,{" "}
            <code className="font-mono text-xs">--green-*</code>,{" "}
            <code className="font-mono text-xs">--amber-*</code>,{" "}
            <code className="font-mono text-xs">--red-*</code>.
          </p>
          <p>
            Two alias scales follow the active data-attribute:{" "}
            <code className="font-mono text-xs">--gray-50…950</code> follows{" "}
            <code className="font-mono">data-gray</code> and{" "}
            <code className="font-mono text-xs">--brand-50…950</code> follows{" "}
            <code className="font-mono">data-brand</code>. Reach for those when
            you need a brand-aware tint and no semantic token fits.
          </p>
        </div>
      </Section>

      <footer className="pt-8 border-t border-border-secondary text-sm text-text-secondary">
        Token source of truth:{" "}
        <code className="font-mono text-xs">
          packages/ui/src/tokens.css
        </code>
        . Tailwind v4 integration:{" "}
        <code className="font-mono text-xs">
          packages/ui/src/preset.css
        </code>
        .
      </footer>
    </main>
  );
}
