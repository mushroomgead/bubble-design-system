import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../utils/cn";

type BadgeVariant = "neutral" | "brand" | "success" | "warning" | "danger";
type BadgeSize = "sm" | "md" | "lg";

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
          "pds-badge",
          `pds-badge--${variant}`,
          `pds-badge--${size}`,
          className,
        )}
        {...props}
      />
    );
  },
);
Badge.displayName = "Badge";
