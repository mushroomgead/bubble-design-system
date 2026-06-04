"use client";

import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { Select as BaseSelect } from "@base-ui/react/select";
import { cn } from "../utils/cn";

type SelectSize = "sm" | "md" | "lg";

type BaseTriggerProps = ComponentPropsWithoutRef<typeof BaseSelect.Trigger>;
type BasePopupProps = ComponentPropsWithoutRef<typeof BaseSelect.Popup>;
type BaseItemProps = ComponentPropsWithoutRef<typeof BaseSelect.Item>;
type BaseValueProps = ComponentPropsWithoutRef<typeof BaseSelect.Value>;

export interface SelectTriggerProps extends Omit<BaseTriggerProps, "className" | "render"> {
  size?: SelectSize;
  className?: string;
}

const SelectTrigger = forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ size = "md", className, children, ...props }, ref) => {
    return (
      <BaseSelect.Trigger
        ref={ref}
        className={cn(
          "pds-select-trigger",
          `pds-select-trigger--${size}`,
          className,
        )}
        {...props}
      >
        {children}
        <BaseSelect.Icon className="pds-select-icon">
          <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M4 6l4 4 4-4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </BaseSelect.Icon>
      </BaseSelect.Trigger>
    );
  },
);
SelectTrigger.displayName = "Select.Trigger";

export interface SelectValueProps extends Omit<BaseValueProps, "className"> {
  placeholder?: ReactNode;
  className?: string;
}

const SelectValue = forwardRef<HTMLSpanElement, SelectValueProps>(
  ({ placeholder, className, children, ...props }, ref) => {
    return (
      <BaseSelect.Value
        ref={ref}
        className={cn("pds-select-value", className)}
        {...props}
      >
        {children ??
          ((value: unknown) =>
            value === null || value === undefined || value === "" ? (
              <span className="pds-select-value-placeholder">{placeholder}</span>
            ) : (
              String(value)
            ))}
      </BaseSelect.Value>
    );
  },
);
SelectValue.displayName = "Select.Value";

export interface SelectContentProps extends Omit<BasePopupProps, "className" | "render"> {
  className?: string;
  sideOffset?: number;
}

const SelectContent = forwardRef<HTMLDivElement, SelectContentProps>(
  ({ className, sideOffset = 6, children, ...props }, ref) => {
    return (
      <BaseSelect.Portal>
        <BaseSelect.Positioner sideOffset={sideOffset} className="pds-select-positioner">
          <BaseSelect.Popup
            ref={ref as never}
            className={cn("pds-select-popup", className)}
            {...props}
          >
            {children}
          </BaseSelect.Popup>
        </BaseSelect.Positioner>
      </BaseSelect.Portal>
    );
  },
);
SelectContent.displayName = "Select.Content";

export interface SelectItemProps extends Omit<BaseItemProps, "className" | "render"> {
  className?: string;
}

const SelectItem = forwardRef<HTMLDivElement, SelectItemProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <BaseSelect.Item
        ref={ref}
        className={cn("pds-select-item", className)}
        {...props}
      >
        <BaseSelect.ItemIndicator className="pds-select-item__indicator">
          <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M3.5 8.5l3 3 6-6.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </BaseSelect.ItemIndicator>
        <BaseSelect.ItemText>{children}</BaseSelect.ItemText>
      </BaseSelect.Item>
    );
  },
);
SelectItem.displayName = "Select.Item";

export const Select = {
  Root: BaseSelect.Root,
  Trigger: SelectTrigger,
  Value: SelectValue,
  Content: SelectContent,
  Item: SelectItem,
};
