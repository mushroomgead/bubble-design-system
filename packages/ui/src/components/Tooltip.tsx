"use client";

import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { Tooltip as BaseTooltip } from "@base-ui/react/tooltip";
import { cn } from "../utils/cn";

type BasePopupProps = ComponentPropsWithoutRef<typeof BaseTooltip.Popup>;

export interface TooltipContentProps extends Omit<
  BasePopupProps,
  "className" | "render"
> {
  className?: string;
  sideOffset?: number;
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
}

const TooltipContent = forwardRef<HTMLDivElement, TooltipContentProps>(
  (
    {
      className,
      sideOffset = 6,
      side = "top",
      align = "center",
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <BaseTooltip.Portal>
        <BaseTooltip.Positioner
          sideOffset={sideOffset}
          side={side}
          align={align}
          className="pds-tooltip-positioner"
        >
          <BaseTooltip.Popup
            ref={ref}
            className={cn("pds-tooltip-popup", className)}
            {...props}
          >
            {children}
          </BaseTooltip.Popup>
        </BaseTooltip.Positioner>
      </BaseTooltip.Portal>
    );
  },
);
TooltipContent.displayName = "Tooltip.Content";

export const Tooltip = {
  Provider: BaseTooltip.Provider,
  Root: BaseTooltip.Root,
  Trigger: BaseTooltip.Trigger,
  Content: TooltipContent,
};
