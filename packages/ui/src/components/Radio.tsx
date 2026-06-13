"use client";

import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { Radio as BaseRadio } from "@base-ui/react/radio";
import { RadioGroup as BaseRadioGroup } from "@base-ui/react/radio-group";
import { cn } from "../utils/cn";

type RadioSize = "sm" | "md" | "lg";

type BaseRadioRootProps = ComponentPropsWithoutRef<typeof BaseRadio.Root>;
type BaseRadioGroupProps = ComponentPropsWithoutRef<typeof BaseRadioGroup>;

export interface RadioProps extends Omit<
  BaseRadioRootProps,
  "className" | "render"
> {
  size?: RadioSize;
  className?: string;
}

export const Radio = forwardRef<HTMLButtonElement, RadioProps>(
  ({ size = "md", className, ...props }, ref) => {
    return (
      <BaseRadio.Root
        ref={ref as never}
        className={cn("pds-radio", `pds-radio--${size}`, className)}
        {...props}
      >
        <BaseRadio.Indicator className="pds-radio__indicator" />
      </BaseRadio.Root>
    );
  },
);
Radio.displayName = "Radio";

export interface RadioGroupProps extends Omit<
  BaseRadioGroupProps,
  "className"
> {
  className?: string;
}

export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ className, ...props }, ref) => {
    return (
      <BaseRadioGroup
        ref={ref}
        className={cn("pds-radio-group", className)}
        {...props}
      />
    );
  },
);
RadioGroup.displayName = "RadioGroup";
