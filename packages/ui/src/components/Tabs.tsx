import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { Tabs as BaseTabs } from "@base-ui/react/tabs";
import { cn } from "../utils/cn";

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
        className={cn("pds-tabs", className)}
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
        className={cn("pds-tabs__list", className)}
        {...props}
      >
        {children}
        <BaseTabs.Indicator className="pds-tabs__indicator" />
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
        className={cn("pds-tabs__tab", className)}
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
        className={cn("pds-tabs__panel", className)}
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
