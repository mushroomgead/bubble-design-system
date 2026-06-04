"use client";

import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { Toast as BaseToast } from "@base-ui/react/toast";
import { cn } from "../utils/cn";

const { useToastManager } = BaseToast;

type ProviderProps = ComponentPropsWithoutRef<typeof BaseToast.Provider>;
type ViewportProps = ComponentPropsWithoutRef<typeof BaseToast.Viewport>;

const ToastProvider = ({ children, ...props }: ProviderProps) => {
  return <BaseToast.Provider {...props}>{children}</BaseToast.Provider>;
};
ToastProvider.displayName = "Toast.Provider";

const ToastViewport = forwardRef<HTMLDivElement, Omit<ViewportProps, "className"> & { className?: string }>(
  ({ className, ...props }, ref) => {
    return (
      <BaseToast.Viewport
        ref={ref}
        className={cn("pds-toast-viewport", className)}
        style={{ ["--gap" as string]: "12px" }}
        {...props}
      />
    );
  },
);
ToastViewport.displayName = "Toast.Viewport";

const Toaster = () => {
  const { toasts } = useToastManager();
  return (
    <ToastViewport>
      {toasts.map((toast) => (
        <BaseToast.Root
          key={toast.id}
          toast={toast}
          className="pds-toast-item"
        >
          {toast.title ? (
            <BaseToast.Title className="pds-toast-title" />
          ) : null}
          {toast.description ? (
            <BaseToast.Description className="pds-toast-description" />
          ) : null}
          <BaseToast.Close
            aria-label="Close"
            className="pds-toast-close"
          >
            <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M4 4l8 8M12 4l-8 8"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </BaseToast.Close>
        </BaseToast.Root>
      ))}
    </ToastViewport>
  );
};
Toaster.displayName = "Toaster";

export const Toast = {
  Provider: ToastProvider,
  Viewport: ToastViewport,
  Toaster,
};

export { useToastManager as useToast };
