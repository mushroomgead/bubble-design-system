"use client";

import { Select } from "@plain-design-system/ui";
import { useEffect, useState } from "react";

type Axis = {
  attr: string;
  label: string;
  options: readonly string[];
  defaultValue: string;
};

const axes: readonly Axis[] = [
  {
    attr: "data-theme",
    label: "Theme",
    options: ["light", "dark"],
    defaultValue: "light",
  },
  {
    attr: "data-gray",
    label: "Gray",
    options: ["slate", "neutral", "stone"],
    defaultValue: "slate",
  },
  {
    attr: "data-brand",
    label: "Brand",
    options: ["blue", "violet", "emerald", "orange", "mono", "teal"],
    defaultValue: "orange",
  },
  {
    attr: "data-radius",
    label: "Radius",
    options: ["default", "sharp", "soft", "pill"],
    defaultValue: "default",
  },
  {
    attr: "data-density",
    label: "Density",
    options: ["default", "compact", "comfortable"],
    defaultValue: "default",
  },
  {
    attr: "data-font",
    label: "Font",
    options: ["geist", "plex", "system"],
    defaultValue: "geist",
  },
];

const STORAGE_KEY = "plain-ds:theme";

type ThemeState = Record<string, string>;

function readStored(): ThemeState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ThemeState) : null;
  } catch {
    return null;
  }
}

export function ThemeBar() {
  const [state, setState] = useState<ThemeState>(() =>
    Object.fromEntries(axes.map((a) => [a.attr, a.defaultValue])),
  );

  useEffect(() => {
    const stored = readStored();
    const next: ThemeState = {};
    for (const axis of axes) {
      const current =
        stored?.[axis.attr] ??
        document.documentElement.getAttribute(axis.attr) ??
        axis.defaultValue;
      next[axis.attr] = current;
      document.documentElement.setAttribute(axis.attr, current);
    }
    setState(next);
  }, []);

  const update = (attr: string, value: string) => {
    document.documentElement.setAttribute(attr, value);
    setState((prev) => {
      const next = { ...prev, [attr]: value };
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore storage errors (private mode, quota, etc.)
      }
      return next;
    });
  };

  const reset = () => {
    const next: ThemeState = {};
    for (const axis of axes) {
      next[axis.attr] = axis.defaultValue;
      document.documentElement.setAttribute(axis.attr, axis.defaultValue);
    }
    setState(next);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  return (
    <div className="sticky top-0 z-40 -mx-6 px-6 py-3 bg-bg-primary/85 backdrop-blur border-b border-border-secondary">
      <div className="flex flex-wrap items-end gap-3">
        {axes.map((axis) => (
          <label key={axis.attr} className="flex flex-col gap-1 min-w-32">
            <span className="text-xs font-medium text-text-secondary">
              {axis.label}
            </span>
            <Select.Root
              value={state[axis.attr] ?? axis.defaultValue}
              onValueChange={(v) => update(axis.attr, v as string)}
            >
              <Select.Trigger size="sm">
                <Select.Value />
              </Select.Trigger>
              <Select.Content>
                {axis.options.map((opt) => (
                  <Select.Item key={opt} value={opt}>
                    {opt}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </label>
        ))}
        <button
          type="button"
          onClick={reset}
          className="ml-auto h-[var(--control-h-sm)] px-3 text-xs text-text-secondary hover:text-text-primary cursor-pointer focus-visible:outline-none focus-visible:shadow-focus rounded-md"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
