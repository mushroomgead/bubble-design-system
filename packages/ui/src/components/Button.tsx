import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { Button as BaseButton } from "@base-ui-components/react/button";
import { cn } from "../utils/cn";

type ButtonVariant = "primary" | "secondary" | "destructive" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

const baseClasses =
  "inline-flex items-center justify-center gap-2 rounded-md font-medium whitespace-nowrap select-none cursor-pointer transition-colors " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand " +
  "disabled:opacity-50 disabled:pointer-events-none " +
  "data-[disabled]:opacity-50 data-[disabled]:pointer-events-none";

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-brand text-on-brand hover:bg-brand-hover",
  secondary:
    "bg-surface text-content border border-line hover:bg-surface-muted",
  destructive: "bg-danger text-on-danger hover:bg-danger-hover",
  ghost: "text-content hover:bg-surface-muted",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-11 px-6 text-base",
};

type BaseButtonProps = ComponentPropsWithoutRef<typeof BaseButton>;

export interface ButtonProps extends Omit<BaseButtonProps, "className"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}

export const Button = forwardRef<HTMLElement, ButtonProps>(
  ({ variant = "primary", size = "md", className, ...props }, ref) => {
    return (
      <BaseButton
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
Button.displayName = "Button";
