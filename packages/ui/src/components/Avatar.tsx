import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { Avatar as BaseAvatar } from "@base-ui-components/react/avatar";
import { cn } from "../utils/cn";

type AvatarSize = "sm" | "md" | "lg" | "xl";

const sizeClasses: Record<AvatarSize, string> = {
  sm: "size-6 text-xs",
  md: "size-8 text-sm",
  lg: "size-10 text-md",
  xl: "size-12 text-lg",
};

const rootClasses =
  "inline-flex items-center justify-center overflow-hidden rounded-full " +
  "bg-bg-tertiary text-text-secondary font-medium select-none align-middle";

type BaseRootProps = ComponentPropsWithoutRef<typeof BaseAvatar.Root>;
type BaseImageProps = ComponentPropsWithoutRef<typeof BaseAvatar.Image>;
type BaseFallbackProps = ComponentPropsWithoutRef<typeof BaseAvatar.Fallback>;

export interface AvatarProps extends Omit<BaseRootProps, "className" | "render"> {
  size?: AvatarSize;
  className?: string;
}

const AvatarRoot = forwardRef<HTMLSpanElement, AvatarProps>(
  ({ size = "md", className, ...props }, ref) => {
    return (
      <BaseAvatar.Root
        ref={ref}
        className={cn(rootClasses, sizeClasses[size], className)}
        {...props}
      />
    );
  },
);
AvatarRoot.displayName = "Avatar";

export interface AvatarImageProps extends Omit<BaseImageProps, "className" | "render"> {
  className?: string;
}

const AvatarImage = forwardRef<HTMLImageElement, AvatarImageProps>(
  ({ className, ...props }, ref) => {
    return (
      <BaseAvatar.Image
        ref={ref}
        className={cn("size-full object-cover", className)}
        {...props}
      />
    );
  },
);
AvatarImage.displayName = "Avatar.Image";

export interface AvatarFallbackProps extends Omit<BaseFallbackProps, "className" | "render"> {
  className?: string;
}

const AvatarFallback = forwardRef<HTMLSpanElement, AvatarFallbackProps>(
  ({ className, ...props }, ref) => {
    return (
      <BaseAvatar.Fallback
        ref={ref}
        className={cn("inline-flex size-full items-center justify-center", className)}
        {...props}
      />
    );
  },
);
AvatarFallback.displayName = "Avatar.Fallback";

export const Avatar = Object.assign(AvatarRoot, {
  Image: AvatarImage,
  Fallback: AvatarFallback,
});
