import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Conditionally joins Tailwind classes and resolves conflicts.
 *
 * Example:
 *   cn("p-4", isActive && "bg-blue-600", className)
 *   cn("p-4", "p-8")              // → "p-8"  (twMerge resolves)
 *   cn("bg-blue-600", "bg-red-600") // → "bg-red-600"
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
