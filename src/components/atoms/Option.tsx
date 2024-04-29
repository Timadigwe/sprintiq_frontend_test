import * as React from "react";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IOptionProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  option: {
    id: string;
    question_id: string;
    value: string;
    created_at: Date;
  };
}

const Option: React.FC<IOptionProps> = ({ option, ...props }) => {
  return (
    <button
      type="button"
      className="w-full cursor-pointer rounded-full bg-white px-4 py-3 text-left text-xl text-black transition-colors duration-1000 hover:bg-secondary-700 data-correct:animate-correct-flash data-wrong:animate-wrong-flash"
      {...props}
    >
      {option.value}
    </button>
  );
};
export default Option;
