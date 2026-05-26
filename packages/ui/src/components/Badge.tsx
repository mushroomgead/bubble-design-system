import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../utils/cn";

type BadgeVariant =
  | "neutral"
  | "brand"
  | "success"
  | "warning"
  | "danger";
type BadgeSize = "sm" | "md" | "lg";

const baseClasses =
  "inline-flex items-center gap-1 font-medium rounded-full whitespace-nowrap select-none";

const variantClasses: Record<BadgeVariant, string> = {
  neutral:
    "bg-bg-tertiary text-text-secondary",
  brand:
    "bg-bg-brand-subtle text-text-brand",
  success:
    "bg-bg-success text-text-success",
  warning:
    "bg-bg-warning text-text-warning",
  danger:
    "bg-bg-danger text-text-danger",
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: "h-5 px-1.5 text-xs",
  md: "h-6 px-2 text-xs",
  lg: "h-7 px-2.5 text-sm",
};

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = "neutral", size = "md", className, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          className,
        )}
        {...props}
      />
    );
  },
);
Badge.displayName = "Badge";
