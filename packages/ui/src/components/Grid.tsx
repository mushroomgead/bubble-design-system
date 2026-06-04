import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../utils/cn";

type ContainerSize = "sm" | "md" | "lg" | "xl" | "prose" | "fluid";

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  size?: ContainerSize;
}

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ size = "xl", className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("pds-container", `pds-container--${size}`, className)}
      {...props}
    />
  ),
);
Container.displayName = "Container";

type GridGutter = "default" | "tight" | "flush";

export interface GridRootProps extends HTMLAttributes<HTMLDivElement> {
  gutter?: GridGutter;
}

const GridRoot = forwardRef<HTMLDivElement, GridRootProps>(
  ({ gutter = "default", className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("pds-grid", `pds-grid--${gutter}`, className)}
      {...props}
    />
  ),
);
GridRoot.displayName = "Grid";

type Span = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | "full";

export interface GridColProps extends HTMLAttributes<HTMLDivElement> {
  span?: Span;
  smSpan?: Span;
  mdSpan?: Span;
  lgSpan?: Span;
}

const GridCol = forwardRef<HTMLDivElement, GridColProps>(
  ({ span = 12, smSpan, mdSpan, lgSpan, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        `pds-grid__col--span-${span}`,
        smSpan !== undefined && `pds-grid__col--sm-span-${smSpan}`,
        mdSpan !== undefined && `pds-grid__col--md-span-${mdSpan}`,
        lgSpan !== undefined && `pds-grid__col--lg-span-${lgSpan}`,
        className,
      )}
      {...props}
    />
  ),
);
GridCol.displayName = "Grid.Col";

export const Grid = Object.assign(GridRoot, {
  Col: GridCol,
});
