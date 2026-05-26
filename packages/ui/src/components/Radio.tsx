import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { Radio as BaseRadio } from "@base-ui-components/react/radio";
import { RadioGroup as BaseRadioGroup } from "@base-ui-components/react/radio-group";
import { cn } from "../utils/cn";

type RadioSize = "sm" | "md" | "lg";

const sizeClasses: Record<RadioSize, string> = {
  sm: "size-4",
  md: "size-[18px]",
  lg: "size-5",
};

const indicatorSize: Record<RadioSize, string> = {
  sm: "size-1.5",
  md: "size-2",
  lg: "size-2.5",
};

const rootClasses =
  "inline-flex items-center justify-center shrink-0 rounded-full " +
  "bg-bg-primary border border-border-primary " +
  "transition-colors duration-fast ease-out cursor-pointer " +
  "hover:border-border-brand " +
  "focus-visible:outline-none focus-visible:shadow-focus " +
  "data-[checked]:border-border-brand " +
  "data-[disabled]:bg-bg-disabled data-[disabled]:border-border-secondary data-[disabled]:cursor-not-allowed data-[disabled]:hover:border-border-secondary";

type BaseRadioRootProps = ComponentPropsWithoutRef<typeof BaseRadio.Root>;
type BaseRadioGroupProps = ComponentPropsWithoutRef<typeof BaseRadioGroup>;

export interface RadioProps extends Omit<BaseRadioRootProps, "className" | "render"> {
  size?: RadioSize;
  className?: string;
}

export const Radio = forwardRef<HTMLButtonElement, RadioProps>(
  ({ size = "md", className, ...props }, ref) => {
    return (
      <BaseRadio.Root
        ref={ref as never}
        className={cn(rootClasses, sizeClasses[size], className)}
        {...props}
      >
        <BaseRadio.Indicator
          className={cn(
            "rounded-full bg-bg-brand",
            indicatorSize[size],
            "data-[unchecked]:scale-0 transition-transform duration-fast ease-out",
          )}
        />
      </BaseRadio.Root>
    );
  },
);
Radio.displayName = "Radio";

export interface RadioGroupProps extends Omit<BaseRadioGroupProps, "className"> {
  className?: string;
}

export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ className, ...props }, ref) => {
    return (
      <BaseRadioGroup
        ref={ref}
        className={cn("flex flex-col gap-2", className)}
        {...props}
      />
    );
  },
);
RadioGroup.displayName = "RadioGroup";
