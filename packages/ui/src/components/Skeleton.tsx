import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../utils/cn";

type SkeletonShape = "line" | "circle" | "block";

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  shape?: SkeletonShape;
}

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ shape = "line", className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        aria-hidden="true"
        className={cn("pds-skeleton", `pds-skeleton--${shape}`, className)}
        {...props}
      />
    );
  },
);
Skeleton.displayName = "Skeleton";
