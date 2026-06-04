import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import { cn } from "../utils/cn";

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
        <BaseDialog.Backdrop className={cn("pds-modal-backdrop", backdropClassName)} />
        <BaseDialog.Popup
          ref={ref}
          className={cn("pds-modal-popup", className)}
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
        className={cn("pds-modal-title", className)}
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
        className={cn("pds-modal-description", className)}
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
