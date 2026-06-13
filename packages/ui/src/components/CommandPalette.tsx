"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import { cn } from "../utils/cn";

export interface CommandPaletteItem {
  id: string;
  label: string;
  description?: string;
  icon?: ReactNode;
  shortcut?: string;
  onSelect?: () => void;
  keywords?: string[];
}

export interface CommandPaletteGroup {
  label?: string;
  items: CommandPaletteItem[];
}

export interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groups?: CommandPaletteGroup[];
  placeholder?: string;
  onSelect?: (item: CommandPaletteItem) => void;
  className?: string;
}

function SearchIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M10.5 10.5L14 14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function XSmallIcon({ size = 10 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 10 10"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M2 2l6 6M8 2L2 8"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function useCommandPalette() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = (e: globalThis.KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return { open, setOpen };
}

export function CommandPalette({
  open,
  onOpenChange,
  groups = [],
  placeholder = "Search commands…",
  onSelect,
  className,
}: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [prevOpen, setPrevOpen] = useState(open);
  const [prevQuery, setPrevQuery] = useState(query);
  const inputRef = useRef<HTMLInputElement>(null);

  // Reset the search and selection whenever the palette opens, and reset
  // the selection whenever the query changes — done during render (the
  // React-recommended way to adjust state on prop/state changes) rather
  // than in an effect, to avoid an extra render pass.
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setQuery("");
      setActiveIndex(0);
      setPrevQuery("");
    }
  }
  if (query !== prevQuery) {
    setPrevQuery(query);
    setActiveIndex(0);
  }

  const filteredGroups = useMemo(() => {
    if (!query.trim()) return groups;
    const q = query.toLowerCase();
    return groups
      .map((group) => ({
        ...group,
        items: group.items.filter(
          (item) =>
            item.label.toLowerCase().includes(q) ||
            (item.description && item.description.toLowerCase().includes(q)) ||
            (item.keywords &&
              item.keywords.some((k) => k.toLowerCase().includes(q))),
        ),
      }))
      .filter((group) => group.items.length > 0);
  }, [groups, query]);

  const allItems = useMemo(
    () => filteredGroups.flatMap((group) => group.items),
    [filteredGroups],
  );

  const selectItem = (item: CommandPaletteItem) => {
    item.onSelect?.();
    onSelect?.(item);
    onOpenChange(false);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(allItems.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(0, i - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = allItems[activeIndex];
      if (item) selectItem(item);
    }
  };

  let flatIndex = 0;

  return (
    <BaseDialog.Root open={open} onOpenChange={onOpenChange}>
      <BaseDialog.Portal>
        <BaseDialog.Backdrop className="pds-command-palette-backdrop" />
        <BaseDialog.Popup
          className={cn("pds-command-palette", className)}
          aria-label="Command palette"
          initialFocus={inputRef}
        >
          <div className="pds-command-palette__search">
            <span className="pds-command-palette__search-icon">
              <SearchIcon size={16} />
            </span>
            <input
              ref={inputRef}
              className="pds-command-palette__input"
              type="text"
              placeholder={placeholder}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={onKeyDown}
              role="combobox"
              aria-autocomplete="list"
              aria-expanded="true"
            />
            {query && (
              <button
                type="button"
                className="pds-command-palette__clear"
                onClick={() => setQuery("")}
                aria-label="Clear"
              >
                <XSmallIcon />
              </button>
            )}
          </div>

          <div className="pds-command-palette__list" role="listbox">
            {allItems.length === 0 ? (
              <div className="pds-command-palette__empty">
                <SearchIcon size={20} />
                No results for &quot;{query}&quot;
              </div>
            ) : (
              filteredGroups.map((group, gi) => (
                <div
                  key={group.label ?? gi}
                  className="pds-command-palette__group"
                  role="group"
                  aria-label={group.label}
                >
                  {group.label && (
                    <div className="pds-command-palette__group-label">
                      {group.label}
                    </div>
                  )}
                  {group.items.map((item) => {
                    const thisIndex = flatIndex++;
                    const isActive = thisIndex === activeIndex;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        role="option"
                        aria-selected={isActive}
                        className={cn(
                          "pds-command-palette__item",
                          isActive && "pds-command-palette__item--active",
                        )}
                        onMouseEnter={() => setActiveIndex(thisIndex)}
                        onClick={() => selectItem(item)}
                      >
                        {item.icon && (
                          <span
                            className="pds-command-palette__item-icon"
                            aria-hidden="true"
                          >
                            {item.icon}
                          </span>
                        )}
                        <span className="pds-command-palette__item-body">
                          <span className="pds-command-palette__item-label">
                            {item.label}
                          </span>
                          {item.description && (
                            <span className="pds-command-palette__item-desc">
                              {item.description}
                            </span>
                          )}
                        </span>
                        {item.shortcut && (
                          <span
                            className="pds-command-palette__shortcut"
                            aria-label={`Shortcut: ${item.shortcut}`}
                          >
                            {item.shortcut.split("+").map((key, ki) => (
                              <kbd
                                key={ki}
                                className="pds-command-palette__kbd"
                              >
                                {key}
                              </kbd>
                            ))}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              ))
            )}
          </div>

          <div className="pds-command-palette__footer" aria-hidden="true">
            <span className="pds-command-palette__hint">
              <kbd className="pds-command-palette__kbd">↑</kbd>
              <kbd className="pds-command-palette__kbd">↓</kbd> navigate
            </span>
            <span className="pds-command-palette__hint">
              <kbd className="pds-command-palette__kbd">↵</kbd> select
            </span>
            <span className="pds-command-palette__hint">
              <kbd className="pds-command-palette__kbd">Esc</kbd> close
            </span>
          </div>
        </BaseDialog.Popup>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  );
}
