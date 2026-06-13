"use client";

import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { Checkbox as BaseCheckbox } from "@base-ui/react/checkbox";
import { cn } from "../utils/cn";

type CheckboxSize = "sm" | "md" | "lg";

type BaseCheckboxRootProps = ComponentPropsWithoutRef<typeof BaseCheckbox.Root>;

export interface CheckboxProps extends Omit<
  BaseCheckboxRootProps,
  "className" | "render"
> {
  size?: CheckboxSize;
  className?: string;
}

export const Checkbox = forwardRef<HTMLButtonElement, CheckboxProps>(
  ({ size = "md", className, ...props }, ref) => {
    return (
      <BaseCheckbox.Root
        ref={ref as never}
        className={cn("pds-checkbox", `pds-checkbox--${size}`, className)}
        {...props}
      >
        <BaseCheckbox.Indicator className="pds-checkbox__indicator">
          <svg
            viewBox="0 0 16 16"
            fill="none"
            className="pds-checkbox__icon pds-checkbox__icon--check"
            aria-hidden="true"
          >
            <path
              d="M3.5 8.5l3 3 6-6.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <svg
            viewBox="0 0 16 16"
            fill="none"
            className="pds-checkbox__icon pds-checkbox__icon--indeterminate"
            aria-hidden="true"
          >
            <path
              d="M3.5 8h9"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </BaseCheckbox.Indicator>
      </BaseCheckbox.Root>
    );
  },
);
Checkbox.displayName = "Checkbox";
