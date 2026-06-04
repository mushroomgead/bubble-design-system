"use client";

import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "../utils/cn";

type TextareaSize = "sm" | "md" | "lg";

export interface TextareaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "size"> {
  size?: TextareaSize;
  invalid?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ size = "md", invalid, className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        aria-invalid={invalid || undefined}
        className={cn("pds-textarea", `pds-textarea--${size}`, className)}
        {...props}
      />
    );
  },
);
Textarea.displayName = "Textarea";
