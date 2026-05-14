import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Plain DS — Docs",
  description: "Component gallery for @plain-ds/ui",
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: { children: ReactNode }) {
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
      <body className="bg-bg-primary text-text-primary antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
