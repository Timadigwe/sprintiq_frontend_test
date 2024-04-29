import * as React from "react";
import { twMerge } from "tailwind-merge";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IActionButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  Icon: React.FC<React.SVGAttributes<SVGElement>>;
  text: string;
}

const ActionButton: React.FC<IActionButtonProps> = ({
  className,
  Icon,
  text,
  ...props
}) => {
  return (
    <button
      {...props}
      className={twMerge("grow-0 flex items-center lg:space-x-3 shrink-0 max-w-[calc(100%/3.5)]", className)}
    >
      <div className="flex items-center justify-center rounded-2xl bg-gradient-radial px-3.5 py-2">
        <Icon className="h-8 w-8"/>
      </div>
      <span className="text-xs lg:text-sm">{text}</span>
    </button>
  );
};
export default ActionButton;
