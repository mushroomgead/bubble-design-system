import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../utils/cn";

type SkeletonShape = "line" | "circle" | "block";

const baseClasses = "bg-bg-tertiary animate-pulse";

const shapeClasses: Record<SkeletonShape, string> = {
  line: "h-4 w-full rounded-sm",
  circle: "rounded-full",
  block: "rounded-md",
};

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  shape?: SkeletonShape;
}

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ shape = "line", className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        aria-hidden="true"
        className={cn(baseClasses, shapeClasses[shape], className)}
        {...props}
      />
    );
  },
);
Skeleton.displayName = "Skeleton";
