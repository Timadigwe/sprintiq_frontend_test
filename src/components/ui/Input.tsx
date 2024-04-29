import { cn } from "@src/utils/lib";
import * as React from "react";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "placeholder:text-muted-foreground flex h-12 lg:h-14 w-full rounded-full border-2 border-secondary-700 bg-transparent  px-3 py-2 text-sm text-white ring-offset-secondary-700 file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-0  disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export default Input;
