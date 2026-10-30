import * as React from "react";
import { cn } from "@/lib/utils";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && <label className="block text-sm font-medium text-brand-black mb-1">{label}</label>}
        <textarea
          ref={ref}
          id={id}
          className={cn(
            "block w-full px-4 py-2.5 border border-brand-black/20 rounded-md bg-white text-brand-black placeholder-brand-grey/50 focus:outline-none focus:ring-1 focus:ring-brand-red focus:border-brand-red transition-colors",
            error && "border-red-500",
            className
          )}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea };
