import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { Separator } from "@base-ui/react/separator";
import { cn } from "../utils/cn";

type BaseSeparatorProps = ComponentPropsWithoutRef<typeof Separator>;

export interface DividerProps extends Omit<BaseSeparatorProps, "className" | "render"> {
  className?: string;
}

export const Divider = forwardRef<HTMLDivElement, DividerProps>(
  ({ orientation = "horizontal", className, ...props }, ref) => {
    return (
      <Separator
        ref={ref}
        orientation={orientation}
        className={cn(
          "pds-divider",
          orientation === "horizontal" ? "pds-divider--horizontal" : "pds-divider--vertical",
          className,
        )}
        {...props}
      />
    );
  },
);
Divider.displayName = "Divider";
