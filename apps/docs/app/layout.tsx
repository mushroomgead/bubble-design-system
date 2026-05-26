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

const themeBootstrap = `(function(){try{var s=localStorage.getItem("plain-ds:theme");if(!s)return;var t=JSON.parse(s);var d=document.documentElement;Object.keys(t).forEach(function(k){if(typeof t[k]==="string")d.setAttribute(k,t[k]);});}catch(e){}})();`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      data-theme="light"
      data-gray="slate"
      data-brand="orange"
      data-radius="default"
      data-density="default"
      data-font="geist"
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
      </head>
      <body className="bg-bg-primary text-text-primary antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
