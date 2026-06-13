"use client";

import {
  createContext,
  forwardRef,
  useContext,
  useMemo,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";
import { Toggle } from "@base-ui/react/toggle";
import { ToggleGroup } from "@base-ui/react/toggle-group";
import { cn } from "../utils/cn";

type SegmentedSize = "sm" | "md" | "lg";

const SegmentedSizeContext = createContext<SegmentedSize>("md");

type ToggleGroupProps = ComponentPropsWithoutRef<typeof ToggleGroup>;

export interface SegmentedProps extends Omit<
  ToggleGroupProps,
  "className" | "value" | "defaultValue" | "onValueChange" | "multiple"
> {
  /** Selected item value. */
  value?: string;
  /** Uncontrolled initial selected item. */
  defaultValue?: string;
  /** Fired with the newly selected value. */
  onValueChange?: (value: string) => void;
  /** Controls item heights — sm 24px / md 28px / lg 32px. */
  size?: SegmentedSize;
  className?: string;
  children?: ReactNode;
}

const SegmentedRoot = forwardRef<HTMLDivElement, SegmentedProps>(
  (
    { value, defaultValue, onValueChange, size = "md", className, ...props },
    ref,
  ) => {
    const handleChange = useMemo(
      () =>
        onValueChange
          ? (groupValue: string[]) => {
              const next = groupValue[0];
              if (next !== undefined) onValueChange(next);
            }
          : undefined,
      [onValueChange],
    );

    return (
      <SegmentedSizeContext.Provider value={size}>
        <ToggleGroup
          ref={ref}
          value={value !== undefined ? [value] : undefined}
          defaultValue={defaultValue !== undefined ? [defaultValue] : undefined}
          onValueChange={handleChange}
          className={cn("pds-segmented", `pds-segmented--${size}`, className)}
          {...props}
        />
      </SegmentedSizeContext.Provider>
    );
  },
);
SegmentedRoot.displayName = "Segmented";

type ToggleItemProps = ComponentPropsWithoutRef<typeof Toggle>;

export interface SegmentedItemProps extends Omit<
  ToggleItemProps,
  "className" | "value"
> {
  value: string;
  className?: string;
}

const SegmentedItem = forwardRef<HTMLButtonElement, SegmentedItemProps>(
  ({ className, value, ...props }, ref) => {
    const size = useContext(SegmentedSizeContext);
    return (
      <Toggle
        ref={ref}
        value={value}
        className={cn(
          "pds-segmented__item",
          `pds-segmented__item--${size}`,
          className,
        )}
        {...props}
      />
    );
  },
);
SegmentedItem.displayName = "Segmented.Item";

export const Segmented = Object.assign(SegmentedRoot, {
  Item: SegmentedItem,
});
