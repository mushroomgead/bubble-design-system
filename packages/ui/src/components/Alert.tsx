import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../utils/cn";

type AlertVariant = "info" | "success" | "warning" | "danger";

const baseClasses =
  "relative flex items-start gap-3 rounded-md border px-4 py-3 text-sm";

const variantClasses: Record<AlertVariant, string> = {
  info: "bg-bg-info border-border-secondary text-text-primary [&_[data-alert-icon]]:text-text-brand",
  success: "bg-bg-success border-border-success text-text-primary [&_[data-alert-icon]]:text-text-success",
  warning: "bg-bg-warning border-border-warning text-text-primary [&_[data-alert-icon]]:text-text-warning",
  danger: "bg-bg-danger border-border-danger text-text-primary [&_[data-alert-icon]]:text-text-danger",
};

const icons: Record<AlertVariant, ReactNode> = {
  info: (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 7.5v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="8" cy="5" r="0.75" fill="currentColor" />
    </svg>
  ),
  success: (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5 8.5l2 2 4-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  warning: (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M8 1.75L14.5 13.5h-13L8 1.75z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M8 6.5v3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="8" cy="11.75" r="0.75" fill="currentColor" />
    </svg>
  ),
  danger: (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5.5 5.5l5 5M10.5 5.5l-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
};

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  variant?: AlertVariant;
  icon?: ReactNode | false;
  title?: ReactNode;
}

export const Alert = forwardRef<HTMLDivElement, AlertProps>(
  (
    { variant = "info", icon, title, className, children, ...props },
    ref,
  ) => {
    const renderedIcon = icon === false ? null : icon ?? icons[variant];
    return (
      <div
        ref={ref}
        role="alert"
        className={cn(baseClasses, variantClasses[variant], className)}
        {...props}
      >
        {renderedIcon ? (
          <span
            data-alert-icon
            className="inline-flex size-5 shrink-0 items-center justify-center [&_svg]:size-5"
          >
            {renderedIcon}
          </span>
        ) : null}
        <div className="flex-1 space-y-0.5">
          {title ? <div className="font-semibold leading-snug">{title}</div> : null}
          {children ? (
            <div className="text-text-secondary leading-snug">{children}</div>
          ) : null}
        </div>
      </div>
    );
  },
);
Alert.displayName = "Alert";
