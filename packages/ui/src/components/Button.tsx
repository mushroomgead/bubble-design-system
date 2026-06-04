import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { Button as BaseButton } from "@base-ui/react/button";
import { cn } from "../utils/cn";

type ButtonVariant = "primary" | "secondary" | "destructive" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

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
          "pds-btn",
          `pds-btn--${variant}`,
          `pds-btn--${size}`,
          className,
        )}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";
