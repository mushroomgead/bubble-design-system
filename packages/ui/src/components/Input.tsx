import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { Input as BaseInput } from "@base-ui/react/input";
import { cn } from "../utils/cn";

type InputSize = "sm" | "md" | "lg";

const baseClasses =
  "w-full bg-bg-primary text-text-primary placeholder:text-text-tertiary " +
  "border border-border-primary rounded-md " +
  "transition-colors duration-fast ease-out " +
  "focus-visible:outline-none focus-visible:border-border-focus focus-visible:shadow-focus " +
  "disabled:bg-bg-disabled disabled:text-text-disabled disabled:cursor-not-allowed " +
  "data-[disabled]:bg-bg-disabled data-[disabled]:text-text-disabled data-[disabled]:cursor-not-allowed " +
  "aria-invalid:border-border-danger aria-invalid:focus-visible:border-border-danger " +
  "aria-invalid:focus-visible:shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-bg-danger-strong)_25%,transparent)]";

const sizeClasses: Record<InputSize, string> = {
  sm: "h-[var(--control-h-sm)] px-[var(--control-px-sm)] text-xs",
  md: "h-[var(--control-h-md)] px-[var(--control-px-md)] text-sm",
  lg: "h-[var(--control-h-lg)] px-[var(--control-px-lg)] text-md",
};

type BaseInputProps = ComponentPropsWithoutRef<typeof BaseInput>;

export interface InputProps extends Omit<BaseInputProps, "className" | "size"> {
  size?: InputSize;
  invalid?: boolean;
  className?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ size = "md", invalid, className, ...props }, ref) => {
    return (
      <BaseInput
        ref={ref}
        aria-invalid={invalid || undefined}
        className={cn(baseClasses, sizeClasses[size], className)}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";
