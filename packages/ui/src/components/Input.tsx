import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { Input as BaseInput } from "@base-ui/react/input";
import { cn } from "../utils/cn";

type InputSize = "sm" | "md" | "lg";

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
        className={cn("pds-input", `pds-input--${size}`, className)}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";
