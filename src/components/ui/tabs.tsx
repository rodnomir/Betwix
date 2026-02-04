import * as React from "react";

type TabsContextValue = {
  value: string;
  onValueChange: (v: string) => void;
};

const TabsContext = React.createContext<TabsContextValue | null>(null);

export interface TabsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  value: string;
  onValueChange: (v: string) => void;
}

const Tabs = ({ value, onValueChange, className = "", children, ...props }: TabsProps) => (
  <TabsContext.Provider value={{ value, onValueChange }}>
    <div className={className} data-state={value} {...props}>
      {children}
    </div>
  </TabsContext.Provider>
);

const TabsList = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className = "", ...props }, ref) => (
  <div
    ref={ref}
    role="tablist"
    className={`inline-flex h-10 items-center justify-center rounded-lg p-1 text-slate-600 ${className}`}
    {...props}
  />
));
TabsList.displayName = "TabsList";

export interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ value, className = "", children, ...props }, ref) => {
    const ctx = React.useContext(TabsContext);
    if (!ctx) return null;
    const isActive = ctx.value === value;
    return (
      <button
        ref={ref}
        type="button"
        role="tab"
        aria-selected={isActive}
        data-state={isActive ? "active" : "inactive"}
        onClick={() => ctx.onValueChange(value)}
        className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 disabled:pointer-events-none disabled:opacity-50 ${isActive ? "bg-slate-100 text-slate-900" : "hover:bg-slate-50"} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);
TabsTrigger.displayName = "TabsTrigger";

export { Tabs, TabsList, TabsTrigger };
