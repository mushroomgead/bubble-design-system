import { clsx, type ClassValue } from "clsx";

/**
 * Conditionally joins CSS class names.
 *
 * Example:
 *   cn("pds-btn", "pds-btn--primary", isActive && "pds-btn--active", className)
 */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}
