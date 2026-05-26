import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { Button as BaseButton } from "@base-ui/react/button";
import { cn } from "../utils/cn";

type ButtonVariant = "primary" | "secondary" | "destructive" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

const baseClasses =
  "inline-flex items-center justify-center gap-2 rounded-md font-medium whitespace-nowrap select-none cursor-pointer transition-colors duration-fast ease-out " +
  "focus-visible:outline-none focus-visible:shadow-focus " +
  "disabled:opacity-55 disabled:pointer-events-none disabled:cursor-not-allowed " +
  "data-[disabled]:opacity-55 data-[disabled]:pointer-events-none data-[disabled]:cursor-not-allowed";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-bg-brand text-text-on-brand hover:bg-bg-brand-hover active:bg-bg-brand-active",
  secondary:
    "bg-bg-primary text-text-primary border border-border-primary hover:bg-bg-hover active:bg-bg-pressed",
  destructive:
    "bg-bg-danger-strong text-text-on-danger hover:bg-bg-danger-hover",
  ghost:
    "text-text-primary hover:bg-bg-hover active:bg-bg-pressed",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-[var(--control-h-sm)] px-[var(--control-px-sm)] text-xs",
  md: "h-[var(--control-h-md)] px-[var(--control-px-md)] text-sm",
  lg: "h-[var(--control-h-lg)] px-[var(--control-px-lg)] text-md",
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
