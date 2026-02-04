import * as React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "outline" | "destructive";
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className = "", variant = "default", ...props }, ref) => {
    const variantClasses = {
      default: "bg-slate-900 text-slate-50",
      secondary: "bg-slate-100 text-slate-700",
      outline: "border border-slate-200 bg-transparent",
      destructive: "bg-red-100 text-red-700",
    };

    return (
      <span
        ref={ref}
        className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium ${variantClasses[variant]} ${className}`}
        {...props}
      />
    );
  }
);
Badge.displayName = "Badge";

export { Badge };
