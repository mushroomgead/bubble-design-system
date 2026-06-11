"use client";

import { Select } from "@bubble-design-system/ui";
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
    attr: "data-tone",
    label: "Tone",
    options: ["soft", "vivid", "pastel"],
    defaultValue: "soft",
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
    defaultValue: "teal",
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
    options: ["roboto", "system"],
    defaultValue: "roboto",
  },
];

const STORAGE_KEY = "bubble-design-system:theme";

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
    <div className="docs-themebar">
      <div className="docs-themebar__row">
        {axes.map((axis) => (
          <label key={axis.attr} className="docs-themebar__axis">
            <span className="docs-themebar__label">{axis.label}</span>
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
          className="docs-themebar__reset"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
