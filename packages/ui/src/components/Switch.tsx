import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { Switch as BaseSwitch } from "@base-ui-components/react/switch";
import { cn } from "../utils/cn";

type SwitchSize = "sm" | "md" | "lg";

const rootSizeClasses: Record<SwitchSize, string> = {
  sm: "h-4 w-7 p-0.5",
  md: "h-5 w-9 p-0.5",
  lg: "h-6 w-11 p-0.5",
};

const thumbSizeClasses: Record<SwitchSize, string> = {
  sm: "size-3 data-[checked]:translate-x-3",
  md: "size-4 data-[checked]:translate-x-4",
  lg: "size-5 data-[checked]:translate-x-5",
};

const rootClasses =
  "relative inline-flex items-center shrink-0 rounded-full " +
  "bg-bg-tertiary border border-transparent " +
  "transition-colors duration-fast ease-out cursor-pointer " +
  "focus-visible:outline-none focus-visible:shadow-focus " +
  "data-[checked]:bg-bg-brand " +
  "data-[disabled]:bg-bg-disabled data-[disabled]:cursor-not-allowed data-[disabled]:opacity-55";

const thumbClasses =
  "block rounded-full bg-bg-primary shadow-sm " +
  "transition-transform duration-normal ease-out";

type BaseSwitchRootProps = ComponentPropsWithoutRef<typeof BaseSwitch.Root>;

export interface SwitchProps extends Omit<BaseSwitchRootProps, "className" | "render"> {
  size?: SwitchSize;
  className?: string;
}

export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
  ({ size = "md", className, ...props }, ref) => {
    return (
      <BaseSwitch.Root
        ref={ref as never}
        className={cn(rootClasses, rootSizeClasses[size], className)}
        {...props}
      >
        <BaseSwitch.Thumb className={cn(thumbClasses, thumbSizeClasses[size])} />
      </BaseSwitch.Root>
    );
  },
);
Switch.displayName = "Switch";
