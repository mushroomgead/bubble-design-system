import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import { cn } from "../utils/cn";

const backdropClasses =
  "fixed inset-0 z-50 bg-bg-inverse/50 backdrop-blur-sm " +
  "transition-opacity duration-normal ease-out " +
  "data-[starting-style]:opacity-0 data-[ending-style]:opacity-0";

const popupClasses =
  "fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 " +
  "bg-bg-primary text-text-primary border border-border-secondary rounded-lg shadow-xl " +
  "p-6 outline-none " +
  "transition-[opacity,transform,scale] duration-normal ease-out " +
  "data-[starting-style]:opacity-0 data-[starting-style]:scale-95 " +
  "data-[ending-style]:opacity-0 data-[ending-style]:scale-95";

type BasePopupProps = ComponentPropsWithoutRef<typeof BaseDialog.Popup>;
type BaseTitleProps = ComponentPropsWithoutRef<typeof BaseDialog.Title>;
type BaseDescProps = ComponentPropsWithoutRef<typeof BaseDialog.Description>;

export interface ModalContentProps extends Omit<BasePopupProps, "className" | "render"> {
  className?: string;
  backdropClassName?: string;
}

const ModalContent = forwardRef<HTMLDivElement, ModalContentProps>(
  ({ className, backdropClassName, children, ...props }, ref) => {
    return (
      <BaseDialog.Portal>
        <BaseDialog.Backdrop className={cn(backdropClasses, backdropClassName)} />
        <BaseDialog.Popup
          ref={ref}
          className={cn(popupClasses, className)}
          {...props}
        >
          {children}
        </BaseDialog.Popup>
      </BaseDialog.Portal>
    );
  },
);
ModalContent.displayName = "Modal.Content";

export interface ModalTitleProps extends Omit<BaseTitleProps, "className" | "render"> {
  className?: string;
}

const ModalTitle = forwardRef<HTMLHeadingElement, ModalTitleProps>(
  ({ className, ...props }, ref) => {
    return (
      <BaseDialog.Title
        ref={ref}
        className={cn("text-lg font-semibold tracking-snug", className)}
        {...props}
      />
    );
  },
);
ModalTitle.displayName = "Modal.Title";

export interface ModalDescriptionProps extends Omit<BaseDescProps, "className" | "render"> {
  className?: string;
}

const ModalDescription = forwardRef<HTMLParagraphElement, ModalDescriptionProps>(
  ({ className, ...props }, ref) => {
    return (
      <BaseDialog.Description
        ref={ref}
        className={cn("mt-1 text-sm text-text-secondary", className)}
        {...props}
      />
    );
  },
);
ModalDescription.displayName = "Modal.Description";

export const Modal = {
  Root: BaseDialog.Root,
  Trigger: BaseDialog.Trigger,
  Close: BaseDialog.Close,
  Content: ModalContent,
  Title: ModalTitle,
  Description: ModalDescription,
};
