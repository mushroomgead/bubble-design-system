"use client";

import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { Popover as BasePopover } from "@base-ui/react/popover";
import { cn } from "../utils/cn";

type BasePopupProps = ComponentPropsWithoutRef<typeof BasePopover.Popup>;
type BaseTitleProps = ComponentPropsWithoutRef<typeof BasePopover.Title>;
type BaseDescriptionProps = ComponentPropsWithoutRef<
  typeof BasePopover.Description
>;

export interface PopoverContentProps extends Omit<
  BasePopupProps,
  "className" | "render"
> {
  className?: string;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  sideOffset?: number;
  showArrow?: boolean;
}

const PopoverContent = forwardRef<HTMLDivElement, PopoverContentProps>(
  (
    {
      className,
      side = "bottom",
      align = "center",
      sideOffset = 10,
      showArrow = true,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <BasePopover.Portal>
        <BasePopover.Positioner
          side={side}
          align={align}
          sideOffset={sideOffset}
          className="pds-popover-positioner"
        >
          <BasePopover.Popup
            ref={ref}
            className={cn("pds-popover-popup", className)}
            {...props}
          >
            {showArrow && <BasePopover.Arrow className="pds-popover-arrow" />}
            {children}
          </BasePopover.Popup>
        </BasePopover.Positioner>
      </BasePopover.Portal>
    );
  },
);
PopoverContent.displayName = "Popover.Content";

export interface PopoverTitleProps extends Omit<
  BaseTitleProps,
  "className" | "render"
> {
  className?: string;
}

const PopoverTitle = forwardRef<HTMLHeadingElement, PopoverTitleProps>(
  ({ className, ...props }, ref) => {
    return (
      <BasePopover.Title
        ref={ref}
        className={cn("pds-popover-title", className)}
        {...props}
      />
    );
  },
);
PopoverTitle.displayName = "Popover.Title";

export interface PopoverDescriptionProps extends Omit<
  BaseDescriptionProps,
  "className" | "render"
> {
  className?: string;
}

const PopoverDescription = forwardRef<
  HTMLParagraphElement,
  PopoverDescriptionProps
>(({ className, ...props }, ref) => {
  return (
    <BasePopover.Description
      ref={ref}
      className={cn("pds-popover-description", className)}
      {...props}
    />
  );
});
PopoverDescription.displayName = "Popover.Description";

export interface PopoverHeaderProps extends ComponentPropsWithoutRef<"div"> {}

const PopoverHeader = forwardRef<HTMLDivElement, PopoverHeaderProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("pds-popover__header", className)}
        {...props}
      />
    );
  },
);
PopoverHeader.displayName = "Popover.Header";

export interface PopoverBodyProps extends ComponentPropsWithoutRef<"div"> {}

const PopoverBody = forwardRef<HTMLDivElement, PopoverBodyProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("pds-popover__body", className)}
        {...props}
      />
    );
  },
);
PopoverBody.displayName = "Popover.Body";

export interface PopoverFooterProps extends ComponentPropsWithoutRef<"div"> {}

const PopoverFooter = forwardRef<HTMLDivElement, PopoverFooterProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("pds-popover__footer", className)}
        {...props}
      />
    );
  },
);
PopoverFooter.displayName = "Popover.Footer";

export const Popover = {
  Root: BasePopover.Root,
  Trigger: BasePopover.Trigger,
  Content: PopoverContent,
  Title: PopoverTitle,
  Description: PopoverDescription,
  Close: BasePopover.Close,
  Header: PopoverHeader,
  Body: PopoverBody,
  Footer: PopoverFooter,
};
