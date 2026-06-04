import {
  createContext,
  forwardRef,
  useContext,
  type CSSProperties,
  type HTMLAttributes,
} from "react";
import { cn } from "../utils/cn";

type StatusPillIntent = "neutral" | "success" | "warning" | "danger" | "info";

const intentVars: Record<StatusPillIntent, CSSProperties> = {
  neutral: {
    ["--pill-chip" as never]: "var(--gray-400)",
    ["--pill-text" as never]: "var(--color-text-tertiary)",
  },
  success: {
    ["--pill-chip" as never]: "var(--green-500)",
    ["--pill-text" as never]: "var(--color-text-success)",
  },
  warning: {
    ["--pill-chip" as never]: "var(--amber-500)",
    ["--pill-text" as never]: "var(--color-text-warning)",
  },
  danger: {
    ["--pill-chip" as never]: "var(--red-500)",
    ["--pill-text" as never]: "var(--color-text-danger)",
  },
  info: {
    ["--pill-chip" as never]: "var(--brand-500)",
    ["--pill-text" as never]: "var(--color-text-brand)",
  },
};

const StatusPillContext = createContext<StatusPillIntent>("neutral");

export interface StatusPillProps extends HTMLAttributes<HTMLSpanElement> {
  intent?: StatusPillIntent;
}

const StatusPillRoot = forwardRef<HTMLSpanElement, StatusPillProps>(
  ({ intent = "neutral", className, style, ...props }, ref) => {
    return (
      <StatusPillContext.Provider value={intent}>
        <span
          ref={ref}
          className={cn("pds-status-pill", className)}
          style={{ ...intentVars[intent], ...style }}
          {...props}
        />
      </StatusPillContext.Provider>
    );
  },
);
StatusPillRoot.displayName = "StatusPill";

export interface StatusPillIndicatorProps
  extends HTMLAttributes<HTMLSpanElement> {}

const StatusPillIndicator = forwardRef<HTMLSpanElement, StatusPillIndicatorProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        aria-hidden="true"
        className={cn("pds-status-pill__indicator", className)}
        {...props}
      >
        {children}
      </span>
    );
  },
);
StatusPillIndicator.displayName = "StatusPill.Indicator";

export interface StatusPillLabelProps extends HTMLAttributes<HTMLSpanElement> {}

const StatusPillLabel = forwardRef<HTMLSpanElement, StatusPillLabelProps>(
  ({ className, ...props }, ref) => {
    useContext(StatusPillContext);
    return (
      <span
        ref={ref}
        className={cn("pds-status-pill__label", className)}
        {...props}
      />
    );
  },
);
StatusPillLabel.displayName = "StatusPill.Label";

export const StatusPill = Object.assign(StatusPillRoot, {
  Indicator: StatusPillIndicator,
  Label: StatusPillLabel,
});
