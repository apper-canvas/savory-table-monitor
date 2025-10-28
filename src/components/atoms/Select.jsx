import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Select = forwardRef(({ 
  className, 
  children,
  label,
  error,
  required = false,
  ...props 
}, ref) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      <select
        className={cn(
          "input-field appearance-none bg-white",
          error && "border-error focus:ring-error focus:border-error",
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </select>
      {error && <p className="text-sm text-error">{error}</p>}
    </div>
  );
});

Select.displayName = "Select";

export default Select;