"use client";

import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { Avatar as BaseAvatar } from "@base-ui/react/avatar";
import { cn } from "../utils/cn";

type AvatarSize = "sm" | "md" | "lg" | "xl";

type BaseRootProps = ComponentPropsWithoutRef<typeof BaseAvatar.Root>;
type BaseImageProps = ComponentPropsWithoutRef<typeof BaseAvatar.Image>;
type BaseFallbackProps = ComponentPropsWithoutRef<typeof BaseAvatar.Fallback>;

export interface AvatarProps extends Omit<
  BaseRootProps,
  "className" | "render"
> {
  size?: AvatarSize;
  className?: string;
}

const AvatarRoot = forwardRef<HTMLSpanElement, AvatarProps>(
  ({ size = "md", className, ...props }, ref) => {
    return (
      <BaseAvatar.Root
        ref={ref}
        className={cn("pds-avatar", `pds-avatar--${size}`, className)}
        {...props}
      />
    );
  },
);
AvatarRoot.displayName = "Avatar";

export interface AvatarImageProps extends Omit<
  BaseImageProps,
  "className" | "render"
> {
  className?: string;
}

const AvatarImage = forwardRef<HTMLImageElement, AvatarImageProps>(
  ({ className, ...props }, ref) => {
    return (
      <BaseAvatar.Image
        ref={ref}
        className={cn("pds-avatar__image", className)}
        {...props}
      />
    );
  },
);
AvatarImage.displayName = "Avatar.Image";

export interface AvatarFallbackProps extends Omit<
  BaseFallbackProps,
  "className" | "render"
> {
  className?: string;
}

const AvatarFallback = forwardRef<HTMLSpanElement, AvatarFallbackProps>(
  ({ className, ...props }, ref) => {
    return (
      <BaseAvatar.Fallback
        ref={ref}
        className={cn("pds-avatar__fallback", className)}
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
