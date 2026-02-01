import * as React from "react";

// Кнопка с вариантами размеров и стилей (совместимость с shadcn/ui)

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "link";
  size?: "default" | "sm" | "lg";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "default", size = "default", ...props }, ref) => {
    const variantClasses = {
      default: "bg-slate-900 text-slate-50 hover:bg-slate-800",
      outline: "border border-[#DDE2E8] bg-white hover:bg-slate-50 hover:text-slate-900",
      ghost: "hover:bg-slate-100 hover:text-slate-900",
      link: "text-slate-900 underline-offset-4 hover:underline",
    };
    const sizeClasses = {
      default: "h-10 px-4 py-2",
      sm: "h-8 px-3 text-xs",
      lg: "h-11 px-8",
    };

    return (
      <button
        ref={ref}
        className={`inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 disabled:pointer-events-none disabled:opacity-50 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
