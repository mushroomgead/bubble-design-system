import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { Toast as BaseToast } from "@base-ui-components/react/toast";
import { cn } from "../utils/cn";

const { useToastManager } = BaseToast;

const viewportClasses =
  "fixed top-auto bottom-4 right-4 z-50 mx-auto flex w-[min(420px,calc(100vw-2rem))] flex-col-reverse outline-none";

const rootClasses =
  "absolute right-0 bottom-0 left-auto " +
  "[transform:translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--toast-index)*-20%+var(--toast-swipe-movement-y)))] " +
  "[transition:transform_350ms_var(--ease-out),opacity_350ms_var(--ease-out)] " +
  "data-[expanded]:[transform:translateY(calc(var(--toast-offset-y)*-1px-var(--toast-index)*var(--gap)))] " +
  "data-[limited]:opacity-0 " +
  "after:absolute after:left-0 after:right-0 after:h-[calc(var(--gap)+1px)] after:bottom-full after:content-['']";

const itemClasses =
  "w-full rounded-md border border-border-secondary bg-bg-primary text-text-primary " +
  "shadow-lg p-4 pr-10 flex flex-col gap-1 " +
  "[transition:background-color_200ms_var(--ease-out),color_200ms_var(--ease-out)]";

const closeClasses =
  "absolute top-2 right-2 inline-flex size-7 items-center justify-center rounded-md " +
  "text-text-tertiary hover:bg-bg-hover hover:text-text-primary " +
  "focus-visible:outline-none focus-visible:shadow-focus cursor-pointer transition-colors duration-fast";

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
        className={cn(viewportClasses, className)}
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
          className={cn(rootClasses, itemClasses)}
        >
          {toast.title ? (
            <BaseToast.Title className="text-sm font-semibold leading-snug" />
          ) : null}
          {toast.description ? (
            <BaseToast.Description className="text-sm text-text-secondary leading-snug" />
          ) : null}
          <BaseToast.Close
            aria-label="Close"
            className={closeClasses}
          >
            <svg viewBox="0 0 16 16" fill="none" className="size-4" aria-hidden="true">
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
