import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../utils/cn";

type CardVariant = "elevated" | "muted";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
}

const CardRoot = forwardRef<HTMLDivElement, CardProps>(
  ({ variant = "elevated", className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("pds-card", `pds-card--${variant}`, className)}
        {...props}
      />
    );
  },
);
CardRoot.displayName = "Card";

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {}

const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("pds-card__header", className)}
      {...props}
    />
  ),
);
CardHeader.displayName = "Card.Header";

export interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {}

const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn("pds-card__title", className)}
      {...props}
    />
  ),
);
CardTitle.displayName = "Card.Title";

export interface CardDescriptionProps
  extends HTMLAttributes<HTMLParagraphElement> {}

const CardDescription = forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("pds-card__description", className)}
      {...props}
    />
  ),
);
CardDescription.displayName = "Card.Description";

export interface CardActionProps extends HTMLAttributes<HTMLDivElement> {}

const CardAction = forwardRef<HTMLDivElement, CardActionProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("pds-card__action", className)}
      {...props}
    />
  ),
);
CardAction.displayName = "Card.Action";

export interface CardBodyProps extends HTMLAttributes<HTMLDivElement> {}

const CardBody = forwardRef<HTMLDivElement, CardBodyProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("pds-card__body", className)}
      {...props}
    />
  ),
);
CardBody.displayName = "Card.Body";

export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {}

const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("pds-card__footer", className)}
      {...props}
    />
  ),
);
CardFooter.displayName = "Card.Footer";

export const Card = Object.assign(CardRoot, {
  Header: CardHeader,
  Title: CardTitle,
  Description: CardDescription,
  Action: CardAction,
  Body: CardBody,
  Footer: CardFooter,
});
