import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { Separator } from "@base-ui-components/react/separator";
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
          "bg-border-secondary shrink-0",
          orientation === "horizontal" ? "h-px w-full" : "w-px self-stretch",
          className,
        )}
        {...props}
      />
    );
  },
);
Divider.displayName = "Divider";
