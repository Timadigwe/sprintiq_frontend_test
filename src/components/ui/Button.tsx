import { cn } from "@src/utils/lib";
import * as React from "react";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
}

const Button: React.FC<IButtonProps> = ({ text, ...props }) => {
  return (
    <button
      {...props}
      className={cn("rounded-full bg-secondary-700 px-8 py-2 lg:py-4", props.className)}
    >
      {text}
    </button>
  );
};
export default Button;
