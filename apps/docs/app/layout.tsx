import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bubble DS — Docs",
  description: "Component gallery for @bubble-design-system/ui",
};

export const viewport: Viewport = {
  themeColor: "#ECEDEF",
};

const themeBootstrap = `(function(){try{var s=localStorage.getItem("bubble-design-system:theme");if(!s)return;var t=JSON.parse(s);var d=document.documentElement;Object.keys(t).forEach(function(k){if(typeof t[k]==="string")d.setAttribute(k,t[k]);});}catch(e){}})();`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      data-theme="light"
      data-tone="soft"
      data-gray="slate"
      data-brand="teal"
      data-radius="default"
      data-density="default"
      data-font="geist"
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
