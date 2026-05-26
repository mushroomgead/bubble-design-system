import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { Select as BaseSelect } from "@base-ui/react/select";
import { cn } from "../utils/cn";

type SelectSize = "sm" | "md" | "lg";

const triggerSizeClasses: Record<SelectSize, string> = {
  sm: "h-[var(--control-h-sm)] px-[var(--control-px-sm)] text-xs",
  md: "h-[var(--control-h-md)] px-[var(--control-px-md)] text-sm",
  lg: "h-[var(--control-h-lg)] px-[var(--control-px-lg)] text-md",
};

const triggerClasses =
  "inline-flex w-full items-center justify-between gap-2 " +
  "bg-bg-primary text-text-primary border border-border-primary rounded-md " +
  "transition-colors duration-fast ease-out cursor-pointer " +
  "hover:bg-bg-hover " +
  "focus-visible:outline-none focus-visible:border-border-focus focus-visible:shadow-focus " +
  "data-[popup-open]:border-border-focus data-[popup-open]:shadow-focus " +
  "data-[disabled]:bg-bg-disabled data-[disabled]:text-text-disabled data-[disabled]:cursor-not-allowed data-[disabled]:hover:bg-bg-disabled";

const popupClasses =
  "min-w-[var(--anchor-width)] max-h-[var(--available-height)] overflow-y-auto " +
  "bg-bg-primary border border-border-primary rounded-md shadow-lg " +
  "p-1 outline-none origin-[var(--transform-origin)] " +
  "transition-[transform,opacity] duration-fast ease-out " +
  "data-[starting-style]:opacity-0 data-[starting-style]:scale-95 " +
  "data-[ending-style]:opacity-0 data-[ending-style]:scale-95";

const itemClasses =
  "relative flex items-center gap-2 rounded-sm pl-7 pr-2 py-1.5 text-sm cursor-pointer select-none " +
  "outline-none text-text-primary " +
  "data-[highlighted]:bg-bg-hover " +
  "data-[disabled]:text-text-disabled data-[disabled]:cursor-not-allowed data-[disabled]:bg-transparent";

type BaseTriggerProps = ComponentPropsWithoutRef<typeof BaseSelect.Trigger>;
type BasePopupProps = ComponentPropsWithoutRef<typeof BaseSelect.Popup>;
type BaseItemProps = ComponentPropsWithoutRef<typeof BaseSelect.Item>;
type BaseValueProps = ComponentPropsWithoutRef<typeof BaseSelect.Value>;

export interface SelectTriggerProps extends Omit<BaseTriggerProps, "className" | "render"> {
  size?: SelectSize;
  className?: string;
}

const SelectTrigger = forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ size = "md", className, children, ...props }, ref) => {
    return (
      <BaseSelect.Trigger
        ref={ref}
        className={cn(triggerClasses, triggerSizeClasses[size], className)}
        {...props}
      >
        {children}
        <BaseSelect.Icon className="text-text-tertiary shrink-0">
          <svg viewBox="0 0 16 16" fill="none" className="size-4" aria-hidden="true">
            <path
              d="M4 6l4 4 4-4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </BaseSelect.Icon>
      </BaseSelect.Trigger>
    );
  },
);
SelectTrigger.displayName = "Select.Trigger";

export interface SelectValueProps extends Omit<BaseValueProps, "className"> {
  placeholder?: ReactNode;
  className?: string;
}

const SelectValue = forwardRef<HTMLSpanElement, SelectValueProps>(
  ({ placeholder, className, children, ...props }, ref) => {
    return (
      <BaseSelect.Value
        ref={ref}
        className={cn("truncate", className)}
        {...props}
      >
        {children ??
          ((value: unknown) =>
            value === null || value === undefined || value === "" ? (
              <span className="text-text-tertiary">{placeholder}</span>
            ) : (
              String(value)
            ))}
      </BaseSelect.Value>
    );
  },
);
SelectValue.displayName = "Select.Value";

export interface SelectContentProps extends Omit<BasePopupProps, "className" | "render"> {
  className?: string;
  sideOffset?: number;
}

const SelectContent = forwardRef<HTMLDivElement, SelectContentProps>(
  ({ className, sideOffset = 6, children, ...props }, ref) => {
    return (
      <BaseSelect.Portal>
        <BaseSelect.Positioner sideOffset={sideOffset} className="outline-none z-50">
          <BaseSelect.Popup
            ref={ref as never}
            className={cn(popupClasses, className)}
            {...props}
          >
            {children}
          </BaseSelect.Popup>
        </BaseSelect.Positioner>
      </BaseSelect.Portal>
    );
  },
);
SelectContent.displayName = "Select.Content";

export interface SelectItemProps extends Omit<BaseItemProps, "className" | "render"> {
  className?: string;
}

const SelectItem = forwardRef<HTMLDivElement, SelectItemProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <BaseSelect.Item
        ref={ref}
        className={cn(itemClasses, className)}
        {...props}
      >
        <BaseSelect.ItemIndicator className="absolute left-2 inline-flex items-center text-text-brand">
          <svg viewBox="0 0 16 16" fill="none" className="size-3.5" aria-hidden="true">
            <path
              d="M3.5 8.5l3 3 6-6.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </BaseSelect.ItemIndicator>
        <BaseSelect.ItemText>{children}</BaseSelect.ItemText>
      </BaseSelect.Item>
    );
  },
);
SelectItem.displayName = "Select.Item";

export const Select = {
  Root: BaseSelect.Root,
  Trigger: SelectTrigger,
  Value: SelectValue,
  Content: SelectContent,
  Item: SelectItem,
};
