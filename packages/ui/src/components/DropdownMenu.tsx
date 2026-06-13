"use client";

import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { Menu as BaseMenu } from "@base-ui/react/menu";
import { cn } from "../utils/cn";

type PopupProps = ComponentPropsWithoutRef<typeof BaseMenu.Popup>;
type ItemProps = ComponentPropsWithoutRef<typeof BaseMenu.Item>;
type CheckboxItemProps = ComponentPropsWithoutRef<typeof BaseMenu.CheckboxItem>;
type RadioItemProps = ComponentPropsWithoutRef<typeof BaseMenu.RadioItem>;
type GroupLabelProps = ComponentPropsWithoutRef<typeof BaseMenu.GroupLabel>;
type SeparatorProps = ComponentPropsWithoutRef<typeof BaseMenu.Separator>;

export interface DropdownMenuContentProps extends Omit<
  PopupProps,
  "className" | "render"
> {
  className?: string;
  sideOffset?: number;
  align?: "start" | "center" | "end";
}

const DropdownMenuContent = forwardRef<
  HTMLDivElement,
  DropdownMenuContentProps
>(({ className, sideOffset = 6, align = "start", children, ...props }, ref) => {
  return (
    <BaseMenu.Portal>
      <BaseMenu.Positioner
        sideOffset={sideOffset}
        align={align}
        className="pds-menu-positioner"
      >
        <BaseMenu.Popup
          ref={ref as never}
          className={cn("pds-menu-popup", className)}
          {...props}
        >
          {children}
        </BaseMenu.Popup>
      </BaseMenu.Positioner>
    </BaseMenu.Portal>
  );
});
DropdownMenuContent.displayName = "DropdownMenu.Content";

export interface DropdownMenuItemProps extends Omit<
  ItemProps,
  "className" | "render"
> {
  className?: string;
}

const DropdownMenuItem = forwardRef<HTMLDivElement, DropdownMenuItemProps>(
  ({ className, ...props }, ref) => {
    return (
      <BaseMenu.Item
        ref={ref as never}
        className={cn("pds-menu-item", className)}
        {...props}
      />
    );
  },
);
DropdownMenuItem.displayName = "DropdownMenu.Item";

export interface DropdownMenuCheckboxItemProps extends Omit<
  CheckboxItemProps,
  "className" | "render"
> {
  className?: string;
}

const DropdownMenuCheckboxItem = forwardRef<
  HTMLDivElement,
  DropdownMenuCheckboxItemProps
>(({ className, children, ...props }, ref) => {
  return (
    <BaseMenu.CheckboxItem
      ref={ref as never}
      className={cn("pds-menu-item", "pds-menu-item--indented", className)}
      {...props}
    >
      <BaseMenu.CheckboxItemIndicator className="pds-menu-item__indicator">
        <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path
            d="M3.5 8.5l3 3 6-6.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </BaseMenu.CheckboxItemIndicator>
      {children}
    </BaseMenu.CheckboxItem>
  );
});
DropdownMenuCheckboxItem.displayName = "DropdownMenu.CheckboxItem";

export interface DropdownMenuRadioItemProps extends Omit<
  RadioItemProps,
  "className" | "render"
> {
  className?: string;
}

const DropdownMenuRadioItem = forwardRef<
  HTMLDivElement,
  DropdownMenuRadioItemProps
>(({ className, children, ...props }, ref) => {
  return (
    <BaseMenu.RadioItem
      ref={ref as never}
      className={cn("pds-menu-item", "pds-menu-item--indented", className)}
      {...props}
    >
      <BaseMenu.RadioItemIndicator className="pds-menu-item__indicator pds-menu-item__indicator--radio">
        <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
          <circle cx="8" cy="8" r="8" />
        </svg>
      </BaseMenu.RadioItemIndicator>
      {children}
    </BaseMenu.RadioItem>
  );
});
DropdownMenuRadioItem.displayName = "DropdownMenu.RadioItem";

export interface DropdownMenuLabelProps extends Omit<
  GroupLabelProps,
  "className" | "render"
> {
  className?: string;
}

const DropdownMenuLabel = forwardRef<HTMLDivElement, DropdownMenuLabelProps>(
  ({ className, ...props }, ref) => {
    return (
      <BaseMenu.GroupLabel
        ref={ref}
        className={cn("pds-menu-label", className)}
        {...props}
      />
    );
  },
);
DropdownMenuLabel.displayName = "DropdownMenu.Label";

export interface DropdownMenuSeparatorProps extends Omit<
  SeparatorProps,
  "className" | "render"
> {
  className?: string;
}

const DropdownMenuSeparator = forwardRef<
  HTMLDivElement,
  DropdownMenuSeparatorProps
>(({ className, ...props }, ref) => {
  return (
    <BaseMenu.Separator
      ref={ref}
      className={cn("pds-menu-separator", className)}
      {...props}
    />
  );
});
DropdownMenuSeparator.displayName = "DropdownMenu.Separator";

export const DropdownMenu = {
  Root: BaseMenu.Root,
  Trigger: BaseMenu.Trigger,
  Content: DropdownMenuContent,
  Item: DropdownMenuItem,
  CheckboxItem: DropdownMenuCheckboxItem,
  RadioGroup: BaseMenu.RadioGroup,
  RadioItem: DropdownMenuRadioItem,
  Group: BaseMenu.Group,
  Label: DropdownMenuLabel,
  Separator: DropdownMenuSeparator,
};
