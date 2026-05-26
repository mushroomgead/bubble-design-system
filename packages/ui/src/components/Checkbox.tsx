import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { Checkbox as BaseCheckbox } from "@base-ui-components/react/checkbox";
import { cn } from "../utils/cn";

type CheckboxSize = "sm" | "md" | "lg";

const sizeClasses: Record<CheckboxSize, string> = {
  sm: "size-4 rounded-xs",
  md: "size-[18px] rounded-sm",
  lg: "size-5 rounded-sm",
};

const rootClasses =
  "inline-flex items-center justify-center shrink-0 " +
  "bg-bg-primary border border-border-primary text-text-on-brand " +
  "transition-colors duration-fast ease-out cursor-pointer " +
  "hover:border-border-brand " +
  "focus-visible:outline-none focus-visible:shadow-focus " +
  "data-[checked]:bg-bg-brand data-[checked]:border-border-brand " +
  "data-[indeterminate]:bg-bg-brand data-[indeterminate]:border-border-brand " +
  "data-[disabled]:bg-bg-disabled data-[disabled]:border-border-secondary data-[disabled]:cursor-not-allowed data-[disabled]:hover:border-border-secondary";

const iconSize: Record<CheckboxSize, string> = {
  sm: "size-3",
  md: "size-3.5",
  lg: "size-4",
};

type BaseCheckboxRootProps = ComponentPropsWithoutRef<typeof BaseCheckbox.Root>;

export interface CheckboxProps extends Omit<BaseCheckboxRootProps, "className" | "render"> {
  size?: CheckboxSize;
  className?: string;
}

export const Checkbox = forwardRef<HTMLButtonElement, CheckboxProps>(
  ({ size = "md", className, ...props }, ref) => {
    return (
      <BaseCheckbox.Root
        ref={ref as never}
        className={cn(rootClasses, sizeClasses[size], className)}
        {...props}
      >
        <BaseCheckbox.Indicator className="flex items-center justify-center group">
          <svg
            viewBox="0 0 16 16"
            fill="none"
            className={cn(iconSize[size], "group-data-[indeterminate]:hidden")}
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
            className={cn(iconSize[size], "hidden group-data-[indeterminate]:block")}
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
