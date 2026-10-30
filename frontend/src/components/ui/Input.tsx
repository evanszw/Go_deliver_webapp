import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  numericOnly?: boolean;
  phoneOnly?: boolean;
  allowDecimal?: boolean;
  helperText?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      error,
      id,
      type,
      numericOnly,
      phoneOnly,
      allowDecimal = false,
      helperText,
      onKeyDown,
      onChange,
      onPaste,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const inputId = id || (label ? `input-${label.toLowerCase().replace(/[^a-z0-9]/g, "-")}` : generatedId);

    const isPhone = phoneOnly || type === "tel";
    const isStrictNumeric = numericOnly || (type === "number" && !isPhone);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      // Allow system / navigation keys
      const allowedSpecialKeys = [
        "Backspace",
        "Delete",
        "Tab",
        "Escape",
        "Enter",
        "ArrowLeft",
        "ArrowRight",
        "ArrowUp",
        "ArrowDown",
        "Home",
        "End",
      ];

      if (
        allowedSpecialKeys.includes(e.key) ||
        // Allow copy / paste / select all shortcuts
        e.ctrlKey ||
        e.metaKey ||
        e.altKey
      ) {
        if (onKeyDown) onKeyDown(e);
        return;
      }

      if (isStrictNumeric) {
        // Strict digits only, or single decimal if allowed
        if (allowDecimal && e.key === ".") {
          const currentVal = (e.currentTarget.value || "");
          if (currentVal.includes(".")) {
            e.preventDefault();
            return;
          }
        } else if (!/^[0-9]$/.test(e.key)) {
          // Block all letters and non-number characters
          e.preventDefault();
          return;
        }
      } else if (isPhone) {
        // Phone numbers: allow digits and optional leading '+' only. No letters, no other characters.
        const currentVal = e.currentTarget.value || "";
        const isLeadingPlus = e.key === "+" && currentVal.length === 0;

        if (!/^[0-9]$/.test(e.key) && !isLeadingPlus) {
          // Block any letter, symbol, or extra plus
          e.preventDefault();
          return;
        }
      }

      if (onKeyDown) {
        onKeyDown(e);
      }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
      if (isStrictNumeric || isPhone) {
        const pastedText = e.clipboardData.getData("text");
        let cleaned = pastedText;

        if (isStrictNumeric) {
          cleaned = allowDecimal
            ? pastedText.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1")
            : pastedText.replace(/[^0-9]/g, "");
        } else if (isPhone) {
          // Keep leading plus if present, strip all letters and other characters
          const hasLeadingPlus = pastedText.trim().startsWith("+");
          const digitsOnly = pastedText.replace(/[^0-9]/g, "");
          cleaned = hasLeadingPlus ? `+${digitsOnly}` : digitsOnly;
        }

        if (cleaned !== pastedText) {
          e.preventDefault();
          const target = e.currentTarget;
          const start = target.selectionStart || 0;
          const end = target.selectionEnd || 0;
          const currentVal = target.value;
          const newVal = currentVal.substring(0, start) + cleaned + currentVal.substring(end);

          // Trigger simulated change event
          const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
            window.HTMLInputElement.prototype,
            "value"
          )?.set;
          if (nativeInputValueSetter) {
            nativeInputValueSetter.call(target, newVal);
            const ev = new Event("input", { bubbles: true });
            target.dispatchEvent(ev);
          }
          return;
        }
      }

      if (onPaste) onPaste(e);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (isStrictNumeric) {
        let sanitized = allowDecimal
          ? e.target.value.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1")
          : e.target.value.replace(/[^0-9]/g, "");
        if (e.target.value !== sanitized) {
          e.target.value = sanitized;
        }
      } else if (isPhone) {
        const raw = e.target.value;
        const hasLeadingPlus = raw.startsWith("+");
        const digitsOnly = raw.replace(/[^0-9]/g, "");
        const sanitized = hasLeadingPlus ? `+${digitsOnly}` : digitsOnly;
        if (e.target.value !== sanitized) {
          e.target.value = sanitized;
        }
      }

      if (onChange) {
        onChange(e);
      }
    };

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          type={isStrictNumeric ? "text" : isPhone ? "tel" : type}
          inputMode={isStrictNumeric ? "numeric" : isPhone ? "tel" : props.inputMode}
          pattern={isStrictNumeric ? "[0-9]*" : isPhone ? "\\+?[0-9]*" : props.pattern}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          onChange={handleChange}
          className={cn(
            "block w-full px-4 py-2.5 border border-slate-200 rounded-lg bg-white text-brand-black placeholder-slate-400 focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-all shadow-sm text-sm",
            error && "border-red-500 focus:border-red-500 focus:ring-red-500",
            className
          )}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-red-600 font-medium">{error}</p>}
        {helperText && !error && (
          <p className="mt-1 text-[11px] text-slate-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
