import * as React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "default";
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? React.Fragment : "button";

    const base =
      "inline-flex items-center justify-center font-semibold rounded-md focus-visible-ring transition-colors disabled:opacity-50 disabled:pointer-events-none";

    const sizeStyles: Record<string, string> = {
      sm: "px-3 py-1.5 text-sm",
      default: "px-6 py-3 text-sm",
    };

    const variants: Record<string, string> = {
      primary: "bg-brand-red text-white hover:bg-red-700",
      secondary: "bg-brand-black text-white hover:bg-[#1B1B1B]",
      outline: "border-2 border-brand-black text-brand-black hover:bg-brand-black hover:text-white",
    };

    return (
      <Comp
        ref={ref}
        className={cn(base, sizeStyles[size], variants[variant], className)}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };
