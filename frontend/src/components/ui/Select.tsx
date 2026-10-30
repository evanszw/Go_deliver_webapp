import * as React from "react";
import { cn } from "@/lib/utils";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, id, children, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && <label className="block text-sm font-medium text-brand-black mb-1">{label}</label>}
        <select
          ref={ref}
          id={id}
          className={cn(
            "block w-full px-4 py-2.5 border border-brand-black/20 rounded-md bg-white text-brand-black focus:outline-none focus:ring-1 focus:ring-brand-red focus:border-brand-red transition-colors appearance-none",
            error && "border-red-500",
            className
          )}
          {...props}
        >
          {children}
        </select>
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";

export { Select };
