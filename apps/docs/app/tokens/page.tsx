"use client";

import Link from "next/link";
import { ThemeBar } from "../ThemeBar";

const colorBgTokens = [
  { token: "--color-bg-primary", note: "App canvas" },
  { token: "--color-bg-secondary", note: "Subtle panel" },
  { token: "--color-bg-tertiary", note: "Pressed / nested panel" },
  { token: "--color-bg-inverse", note: "Tooltip / dark overlay surface" },
  { token: "--color-bg-brand", note: "Primary action fill" },
  { token: "--color-bg-brand-hover", note: "Primary action :hover" },
  { token: "--color-bg-brand-active", note: "Primary action :active" },
  { token: "--color-bg-brand-subtle", note: "Tinted brand background" },
  { token: "--color-bg-success", note: "Success alert / badge background" },
  { token: "--color-bg-success-strong", note: "Solid success fill" },
  { token: "--color-bg-warning", note: "Warning alert / badge background" },
  { token: "--color-bg-warning-strong", note: "Solid warning fill" },
  { token: "--color-bg-danger", note: "Danger alert / badge background" },
  { token: "--color-bg-danger-strong", note: "Destructive action fill" },
  { token: "--color-bg-danger-hover", note: "Destructive action :hover" },
  { token: "--color-bg-info", note: "Info alert background" },
  { token: "--color-bg-hover", note: "Generic row / item :hover" },
  { token: "--color-bg-pressed", note: "Generic row / item :active" },
  { token: "--color-bg-disabled", note: "Disabled control fill" },
];

const colorTextTokens = [
  { token: "--color-text-primary", note: "Body copy, headings" },
  { token: "--color-text-secondary", note: "Supporting text" },
  { token: "--color-text-tertiary", note: "Hints, placeholders" },
  { token: "--color-text-disabled", note: "Disabled labels" },
  { token: "--color-text-inverse", note: "Text on inverse surfaces" },
  { token: "--color-text-brand", note: "Branded links / labels" },
  { token: "--color-text-success", note: "Success messages" },
  { token: "--color-text-warning", note: "Warning messages" },
  { token: "--color-text-danger", note: "Error messages" },
  { token: "--color-text-on-brand", note: "Foreground on --color-bg-brand" },
  {
    token: "--color-text-on-danger",
    note: "Foreground on --color-bg-danger-strong",
  },
  {
    token: "--color-text-on-success",
    note: "Foreground on --color-bg-success-strong",
  },
];

const colorBorderTokens = [
  { token: "--color-border-primary", note: "Default control / divider" },
  { token: "--color-border-secondary", note: "Subtle section divider" },
  { token: "--color-border-tertiary", note: "Very subtle inner divider" },
  { token: "--color-border-brand", note: "Brand-highlighted border" },
  { token: "--color-border-success", note: "Success alert border" },
  { token: "--color-border-warning", note: "Warning alert border" },
  { token: "--color-border-danger", note: "Invalid input / danger border" },
  { token: "--color-border-focus", note: "Focus ring border" },
];

const radiusTokens = [
  { token: "--radius-xs" },
  { token: "--radius-sm" },
  { token: "--radius-md" },
  { token: "--radius-lg" },
  { token: "--radius-xl" },
  { token: "--radius-2xl" },
  { token: "--radius-full" },
];

const shadowTokens = [
  { token: "--shadow-xs" },
  { token: "--shadow-sm" },
  { token: "--shadow-md" },
  { token: "--shadow-lg" },
  { token: "--shadow-xl" },
  { token: "--shadow-focus" },
];

const fontSizeTokens = [
  { token: "--font-size-xs", value: "0.75rem" },
  { token: "--font-size-sm", value: "0.875rem" },
  { token: "--font-size-md", value: "1rem" },
  { token: "--font-size-lg", value: "1.125rem" },
  { token: "--font-size-xl", value: "1.25rem" },
  { token: "--font-size-2xl", value: "1.5rem" },
  { token: "--font-size-3xl", value: "1.875rem" },
  { token: "--font-size-4xl", value: "2.25rem" },
  { token: "--font-size-5xl", value: "3rem" },
  { token: "--font-size-6xl", value: "3.75rem" },
];

const lineHeightTokens = [
  { token: "--line-height-tight", value: "1.15" },
  { token: "--line-height-snug", value: "1.3" },
  { token: "--line-height-normal", value: "1.5" },
  { token: "--line-height-relaxed", value: "1.65" },
];

const fontWeightTokens = [
  { token: "--font-weight-regular", value: "400" },
  { token: "--font-weight-medium", value: "500" },
  { token: "--font-weight-semibold", value: "600" },
  { token: "--font-weight-bold", value: "700" },
];

const trackingTokens = [
  { token: "--letter-tight", value: "-0.022em" },
  { token: "--letter-snug", value: "-0.012em" },
  { token: "--letter-normal", value: "0" },
  { token: "--letter-wide", value: "0.04em" },
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
  { token: "--duration-instant", value: "50ms" },
  { token: "--duration-fast", value: "120ms" },
  { token: "--duration-normal", value: "200ms" },
  { token: "--duration-slow", value: "320ms" },
  { token: "--duration-slower", value: "500ms" },
];

const motionEaseTokens = [
  { token: "--ease-linear" },
  { token: "--ease-out" },
  { token: "--ease-in-out" },
  { token: "--ease-spring" },
];

const densityTokens = [
  {
    token: "--control-h-sm",
    note: "Small control height — Input/Button/Select sm",
  },
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
    effect:
      "Swaps every --color-bg-*, --color-text-*, --color-border-*, and --shadow-* token to its dark variant.",
  },
  {
    attr: "data-gray",
    values: ["slate", "neutral", "stone"],
    effect:
      "Re-aliases --gray-50…950 (cool, true, or warm). Every surface/text/border token derived from gray inherits.",
  },
  {
    attr: "data-brand",
    values: ["blue", "violet", "emerald", "orange", "mono", "teal"],
    effect:
      "Re-aliases --brand-50…950. Every --color-bg-brand-*, --color-text-brand, --color-border-brand follows.",
  },
  {
    attr: "data-radius",
    values: ["default", "sharp", "soft", "pill"],
    effect:
      "Re-binds --radius-xs…2xl. All rounded surfaces pick up new values instantly.",
  },
  {
    attr: "data-density",
    values: ["default", "compact", "comfortable"],
    effect:
      "Re-binds --control-h-*, --control-px-*, --card-p, --row-gap. All sized controls reflow.",
  },
  {
    attr: "data-font",
    values: ["roboto", "system"],
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
    <section id={id} className="docs-section">
      <div className="docs-section-header">
        <h2 className="docs-h2">{title}</h2>
        {description ? (
          <p className="docs-prose docs-text-sm">{description}</p>
        ) : null}
      </div>
      {children}
    </section>
  );
}

function TokenRow({
  swatch,
  token,
  note,
}: {
  swatch: React.ReactNode;
  token: string;
  note?: string;
}) {
  return (
    <div className="docs-token-row">
      <div className="docs-token-row__swatch">{swatch}</div>
      <div className="docs-token-row__body">
        <div className="docs-token-row__head">
          <code className="docs-mono docs-mono--md">{token}</code>
        </div>
        {note ? <div className="docs-token-row__note">{note}</div> : null}
      </div>
    </div>
  );
}

export default function TokensPage() {
  return (
    <main className="docs-main docs-main--tokens">
      <ThemeBar />

      <header className="docs-page-header docs-page-header--tokens">
        <div className="docs-eyebrow">Reference</div>
        <h1 className="docs-h1">Design tokens</h1>
        <p className="docs-prose">
          Every visual decision in{" "}
          <code className="docs-mono docs-mono--md">
            @bubble-design-system/ui
          </code>{" "}
          reads from a CSS custom property. Switch theme, brand, gray, radius,
          density or font with the bar above — every swatch on this page updates
          live. No rebuild.
        </p>
        <p className="docs-prose">
          <Link href="/" className="docs-link">
            ← Component gallery
          </Link>
        </p>
      </header>

      <Section
        id="how-to-use"
        title="How to use tokens"
        description="Tokens are plain CSS custom properties — no preprocessor or framework needed."
      >
        <div className="docs-grid-cards">
          <div className="docs-howto-card">
            <div className="docs-howto-title">
              1. Reference directly via var(...)
            </div>
            <p className="docs-text-xs docs-muted">
              Use semantic tokens in your own CSS so dark mode, brand swaps, and
              tone changes follow automatically.
            </p>
            <pre className="docs-pre">
              {`.my-card {
  background: var(--color-bg-primary);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border-secondary);
  border-radius: var(--radius-lg);
  padding: var(--card-p);
  box-shadow: var(--shadow-md);
}`}
            </pre>
          </div>
          <div className="docs-howto-card">
            <div className="docs-howto-title">2. Use the component classes</div>
            <p className="docs-text-xs docs-muted">
              The shipped stylesheet provides stable, BEM-style class names you
              can apply directly without going through a React component. Useful
              for ad-hoc HTML, MDX, or static pages.
            </p>
            <pre className="docs-pre">
              {`<button class="pds-btn pds-btn--primary pds-btn--md">
  Save
</button>

<div class="pds-card pds-card--elevated">
  <h3 class="pds-card__title">Card</h3>
</div>`}
            </pre>
          </div>
        </div>

        <div className="docs-callout">
          <strong>Naming pattern:</strong>{" "}
          <code className="docs-mono">
            --color-{`{category}`}-{`{role}`}-{`{state?}`}
          </code>{" "}
          — categories are <code className="docs-mono">bg</code>,{" "}
          <code className="docs-mono">text</code>,{" "}
          <code className="docs-mono">border</code>; roles are{" "}
          <code className="docs-mono">primary</code>,{" "}
          <code className="docs-mono">brand</code>,{" "}
          <code className="docs-mono">success</code>, etc. So{" "}
          <code className="docs-mono">--color-bg-brand</code> reads as{" "}
          &quot;background-color, brand role&quot;.
        </div>
      </Section>

      <Section
        id="runtime-switches"
        title="Runtime switches (data-* attributes)"
        description="Set these on <html> (or any ancestor). Toggling them at runtime re-skins every descendant — no rebuild, no React state."
      >
        <div className="docs-table-wrap">
          <table className="docs-table">
            <thead>
              <tr>
                <th>Attribute</th>
                <th>Valid values</th>
                <th>What it changes</th>
              </tr>
            </thead>
            <tbody>
              {dataAttributes.map((d) => (
                <tr key={d.attr}>
                  <td className="docs-table-attr">{d.attr}</td>
                  <td className="docs-table-values">{d.values.join(" · ")}</td>
                  <td className="docs-table-effect">{d.effect}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <pre className="docs-pre">
          {`<html
  data-theme="light"
  data-gray="slate"
  data-brand="blue"
  data-radius="default"
  data-density="default"
  data-font="roboto"
>`}
        </pre>
      </Section>

      <Section
        id="color-bg"
        title="Color · background"
        description="Surface fills. Each swatch reacts live to data-theme, data-gray, and data-brand."
      >
        <div className="docs-token-list">
          {colorBgTokens.map((t) => (
            <TokenRow
              key={t.token}
              swatch={
                <div
                  className="docs-swatch-color"
                  style={{ background: `var(${t.token})` }}
                />
              }
              token={t.token}
              note={t.note}
            />
          ))}
        </div>
      </Section>

      <Section
        id="color-text"
        title="Color · text"
        description="Foreground colors. *-on-* tokens are paired with their corresponding strong background fill (e.g. text-on-brand on bg-brand)."
      >
        <div className="docs-token-list">
          {colorTextTokens.map((t) => (
            <TokenRow
              key={t.token}
              swatch={
                <div
                  className="docs-swatch-text"
                  style={{ color: `var(${t.token})` }}
                >
                  Aa
                </div>
              }
              token={t.token}
              note={t.note}
            />
          ))}
        </div>
      </Section>

      <Section
        id="color-border"
        title="Color · border"
        description="Pair with the matching bg-* and text-* tokens for variant systems."
      >
        <div className="docs-token-list">
          {colorBorderTokens.map((t) => (
            <TokenRow
              key={t.token}
              swatch={
                <div
                  className="docs-swatch-border"
                  style={{ border: `2px solid var(${t.token})` }}
                />
              }
              token={t.token}
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
        <div className="docs-token-list">
          {radiusTokens.map((t) => (
            <TokenRow
              key={t.token}
              swatch={
                <div
                  className="docs-swatch-radius"
                  style={{ borderRadius: `var(${t.token})` }}
                />
              }
              token={t.token}
            />
          ))}
        </div>
      </Section>

      <Section
        id="shadow"
        title="Shadow"
        description="Elevation scale. --shadow-focus is the ring used by focus-visible states."
      >
        <div className="docs-token-list">
          {shadowTokens.map((t) => (
            <TokenRow
              key={t.token}
              swatch={
                <div
                  className="docs-swatch-shadow"
                  style={{ boxShadow: `var(${t.token})` }}
                />
              }
              token={t.token}
            />
          ))}
        </div>
      </Section>

      <Section
        id="typography"
        title="Typography"
        description="Font size, line-height, weight, tracking, and font-family."
      >
        <div className="docs-section">
          <div>
            <h3 className="docs-h3">Font size</h3>
            <div className="docs-token-list">
              {fontSizeTokens.map((t) => (
                <TokenRow
                  key={t.token}
                  swatch={
                    <div
                      className="docs-swatch-font-size"
                      style={{ fontSize: `var(${t.token})` }}
                    >
                      Aa
                    </div>
                  }
                  token={t.token}
                  note={t.value}
                />
              ))}
            </div>
          </div>

          <div>
            <h3 className="docs-h3">Line height</h3>
            <div className="docs-token-list">
              {lineHeightTokens.map((t) => (
                <TokenRow
                  key={t.token}
                  swatch={
                    <div
                      className="docs-swatch-line-height"
                      style={{ lineHeight: `var(${t.token})` }}
                    >
                      Aa
                      <br />
                      Aa
                    </div>
                  }
                  token={t.token}
                  note={t.value}
                />
              ))}
            </div>
          </div>

          <div>
            <h3 className="docs-h3">Font weight</h3>
            <div className="docs-token-list">
              {fontWeightTokens.map((t) => (
                <TokenRow
                  key={t.token}
                  swatch={
                    <div
                      className="docs-swatch-text-aa"
                      style={{ fontWeight: `var(${t.token})` }}
                    >
                      Aa
                    </div>
                  }
                  token={t.token}
                  note={t.value}
                />
              ))}
            </div>
          </div>

          <div>
            <h3 className="docs-h3">Letter spacing</h3>
            <div className="docs-token-list">
              {trackingTokens.map((t) => (
                <TokenRow
                  key={t.token}
                  swatch={
                    <div
                      className="docs-swatch-tracking"
                      style={{ letterSpacing: `var(${t.token})` }}
                    >
                      Type
                    </div>
                  }
                  token={t.token}
                  note={t.value}
                />
              ))}
            </div>
          </div>

          <div>
            <h3 className="docs-h3">Font family</h3>
            <div className="docs-token-list">
              <TokenRow
                swatch={
                  <div
                    className="docs-swatch-text-aa"
                    style={{ fontFamily: "var(--font-sans)" }}
                  >
                    Aa
                  </div>
                }
                token="--font-sans"
                note="Body / UI font (switched by data-font)"
              />
              <TokenRow
                swatch={
                  <div
                    className="docs-swatch-text-aa"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    Aa
                  </div>
                }
                token="--font-mono"
                note="Code / monospaced (switched by data-font)"
              />
            </div>
          </div>
        </div>
      </Section>

      <Section
        id="spacing"
        title="Spacing"
        description="A 4px-aligned scale. Reach for these via var(--space-N) in your own CSS — they're not bound to any utility framework."
      >
        <div className="docs-token-list">
          {spacingTokens.map((t) => (
            <TokenRow
              key={t.token}
              swatch={
                <div
                  className="docs-swatch-spacing"
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
        description="Pair a duration with an easing. Components use these inside their own transition declarations."
      >
        <div className="docs-section">
          <div>
            <h3 className="docs-h3">Duration</h3>
            <div className="docs-token-list">
              {motionDurationTokens.map((t) => (
                <TokenRow
                  key={t.token}
                  swatch={<div className="docs-mono docs-muted">{t.value}</div>}
                  token={t.token}
                />
              ))}
            </div>
          </div>

          <div>
            <h3 className="docs-h3">Easing</h3>
            <div className="docs-token-list">
              {motionEaseTokens.map((t) => (
                <TokenRow
                  key={t.token}
                  swatch={<div className="docs-mono docs-tertiary">fn</div>}
                  token={t.token}
                />
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section
        id="density"
        title="Density (control sizing)"
        description="These tokens drive control heights and paddings. Switch data-density to default / compact / comfortable and watch components reflow."
      >
        <div className="docs-token-list">
          {densityTokens.map((t) => (
            <TokenRow
              key={t.token}
              swatch={<div className="docs-mono docs-tertiary">var</div>}
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
        <div className="docs-prose docs-text-sm">
          <p>
            Available scales (50 → 950):{" "}
            <code className="docs-mono">--slate-*</code>,{" "}
            <code className="docs-mono">--neutral-*</code>,{" "}
            <code className="docs-mono">--stone-*</code>,{" "}
            <code className="docs-mono">--blue-*</code>,{" "}
            <code className="docs-mono">--violet-*</code>,{" "}
            <code className="docs-mono">--emerald-*</code>,{" "}
            <code className="docs-mono">--orange-*</code>,{" "}
            <code className="docs-mono">--green-*</code>,{" "}
            <code className="docs-mono">--amber-*</code>,{" "}
            <code className="docs-mono">--red-*</code>.
          </p>
          <p>
            Two alias scales follow the active data-attribute:{" "}
            <code className="docs-mono">--gray-50…950</code> follows{" "}
            <code className="docs-mono">data-gray</code> and{" "}
            <code className="docs-mono">--brand-50…950</code> follows{" "}
            <code className="docs-mono">data-brand</code>. Reach for those when
            you need a brand-aware tint and no semantic token fits.
          </p>
        </div>
      </Section>

      <footer className="docs-footer">
        Token source of truth:{" "}
        <code className="docs-mono">packages/ui/src/tokens.css</code>. Component
        CSS: <code className="docs-mono">packages/ui/src/components/*.css</code>
        .
      </footer>
    </main>
  );
}
