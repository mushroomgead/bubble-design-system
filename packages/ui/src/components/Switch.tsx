"use client";

import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { Switch as BaseSwitch } from "@base-ui/react/switch";
import { cn } from "../utils/cn";

type SwitchSize = "sm" | "md" | "lg";

type BaseSwitchRootProps = ComponentPropsWithoutRef<typeof BaseSwitch.Root>;

export interface SwitchProps extends Omit<
  BaseSwitchRootProps,
  "className" | "render"
> {
  size?: SwitchSize;
  className?: string;
}

export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
  ({ size = "md", className, ...props }, ref) => {
    return (
      <BaseSwitch.Root
        ref={ref as never}
        className={cn("pds-switch", `pds-switch--${size}`, className)}
        {...props}
      >
        <BaseSwitch.Thumb className="pds-switch__thumb" />
      </BaseSwitch.Root>
    );
  },
);
Switch.displayName = "Switch";
