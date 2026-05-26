import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { Tooltip as BaseTooltip } from "@base-ui/react/tooltip";
import { cn } from "../utils/cn";

const popupClasses =
  "z-50 max-w-xs rounded-sm px-2 py-1 text-xs " +
  "bg-bg-inverse text-text-inverse shadow-md " +
  "origin-[var(--transform-origin)] " +
  "transition-[opacity,transform,scale] duration-fast ease-out " +
  "data-[starting-style]:opacity-0 data-[starting-style]:scale-95 " +
  "data-[ending-style]:opacity-0 data-[ending-style]:scale-95 " +
  "data-[instant]:duration-0";

type BasePopupProps = ComponentPropsWithoutRef<typeof BaseTooltip.Popup>;

export interface TooltipContentProps extends Omit<BasePopupProps, "className" | "render"> {
  className?: string;
  sideOffset?: number;
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
}

const TooltipContent = forwardRef<HTMLDivElement, TooltipContentProps>(
  ({ className, sideOffset = 6, side = "top", align = "center", children, ...props }, ref) => {
    return (
      <BaseTooltip.Portal>
        <BaseTooltip.Positioner
          sideOffset={sideOffset}
          side={side}
          align={align}
          className="outline-none z-50"
        >
          <BaseTooltip.Popup
            ref={ref}
            className={cn(popupClasses, className)}
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
