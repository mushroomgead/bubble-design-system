import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { Tabs as BaseTabs } from "@base-ui-components/react/tabs";
import { cn } from "../utils/cn";

const rootClasses = "w-full";

const listClasses =
  "relative inline-flex items-center gap-1 border-b border-border-secondary";

const tabClasses =
  "relative inline-flex items-center justify-center h-9 px-3 text-sm font-medium " +
  "text-text-secondary cursor-pointer select-none " +
  "transition-colors duration-fast ease-out " +
  "hover:text-text-primary " +
  "focus-visible:outline-none focus-visible:shadow-focus rounded-sm " +
  "data-[selected]:text-text-primary " +
  "data-[disabled]:text-text-disabled data-[disabled]:cursor-not-allowed data-[disabled]:hover:text-text-disabled";

const indicatorClasses =
  "absolute left-0 -bottom-px h-0.5 w-[var(--active-tab-width)] " +
  "translate-x-[var(--active-tab-left)] bg-bg-brand " +
  "transition-[transform,width] duration-normal ease-out";

const panelClasses = "py-4 outline-none focus-visible:shadow-focus rounded-sm";

type RootProps = ComponentPropsWithoutRef<typeof BaseTabs.Root>;
type ListProps = ComponentPropsWithoutRef<typeof BaseTabs.List>;
type TabProps = ComponentPropsWithoutRef<typeof BaseTabs.Tab>;
type PanelProps = ComponentPropsWithoutRef<typeof BaseTabs.Panel>;

export interface TabsRootProps extends Omit<RootProps, "className" | "render"> {
  className?: string;
}

const TabsRoot = forwardRef<HTMLDivElement, TabsRootProps>(
  ({ className, ...props }, ref) => {
    return (
      <BaseTabs.Root
        ref={ref}
        className={cn(rootClasses, className)}
        {...props}
      />
    );
  },
);
TabsRoot.displayName = "Tabs";

export interface TabsListProps extends Omit<ListProps, "className" | "render"> {
  className?: string;
}

const TabsList = forwardRef<HTMLDivElement, TabsListProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <BaseTabs.List
        ref={ref}
        className={cn(listClasses, className)}
        {...props}
      >
        {children}
        <BaseTabs.Indicator className={indicatorClasses} />
      </BaseTabs.List>
    );
  },
);
TabsList.displayName = "Tabs.List";

export interface TabsTabProps extends Omit<TabProps, "className" | "render"> {
  className?: string;
}

const TabsTab = forwardRef<HTMLButtonElement, TabsTabProps>(
  ({ className, ...props }, ref) => {
    return (
      <BaseTabs.Tab
        ref={ref as never}
        className={cn(tabClasses, className)}
        {...props}
      />
    );
  },
);
TabsTab.displayName = "Tabs.Tab";

export interface TabsPanelProps extends Omit<PanelProps, "className" | "render"> {
  className?: string;
}

const TabsPanel = forwardRef<HTMLDivElement, TabsPanelProps>(
  ({ className, ...props }, ref) => {
    return (
      <BaseTabs.Panel
        ref={ref}
        className={cn(panelClasses, className)}
        {...props}
      />
    );
  },
);
TabsPanel.displayName = "Tabs.Panel";

export const Tabs = Object.assign(TabsRoot, {
  List: TabsList,
  Tab: TabsTab,
  Panel: TabsPanel,
});
