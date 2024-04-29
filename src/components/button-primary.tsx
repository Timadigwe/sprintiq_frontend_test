import type { NextPage } from "next";
import { type CSSProperties, useMemo } from "react";

export type ButtonPrimaryType = {
  addQuestion?: string;

  /** Style props */
  propWidth?: CSSProperties["width"];
  propAlignSelf?: CSSProperties["alignSelf"];
  propMinWidth?: CSSProperties["minWidth"];
  propWidth1?: CSSProperties["width"];

  /** Action props */
  onButtonPrimaryClick?: () => void;
  onButtonPrimary1Click?: () => void;
};

const ButtonPrimary: NextPage<ButtonPrimaryType> = ({
  addQuestion,
  propWidth,
  propAlignSelf,
  propMinWidth,
  propWidth1,
  onButtonPrimaryClick,
  onButtonPrimary1Click,
}) => {
  const buttonPrimaryStyle: CSSProperties = useMemo(() => {
    return {
      width: propWidth,
      alignSelf: propAlignSelf,
    };
  }, [propWidth, propAlignSelf]);

  const buttonPrimary1Style: CSSProperties = useMemo(() => {
    return {
      minWidth: propMinWidth,
    };
  }, [propMinWidth]);

  const addQuestionStyle: CSSProperties = useMemo(() => {
    return {
      width: propWidth1,
    };
  }, [propWidth1]);

  return (
    <div
      className="mx-auto mb-10 box-border flex w-fit flex-row items-start justify-center px-5 py-0"
      style={buttonPrimaryStyle}
    >
      <div className=" flex w-[834px] max-w-full flex-row flex-wrap items-start justify-start gap-[20px] md:gap-[38px]">
        <button
          className="hover:bg-forestgreen box-border flex min-w-[193px] max-w-full flex-1 cursor-pointer flex-row items-start justify-center whitespace-nowrap rounded-[2.5rem] bg-[#1FC04D] px-5 py-4 [border:none]"
          style={buttonPrimary1Style}
          onClick={onButtonPrimaryClick}
        >
          <div
            className="text-11xl font-inter relative inline-block w-[193px] text-center text-white"
            style={addQuestionStyle}
          >
            {addQuestion}
          </div>
        </button>
        <button
          className="hover:bg-forestgreen box-border flex w-[335px] max-w-full cursor-pointer flex-row items-start justify-center rounded-[40px] bg-[#1FC04D] px-5 py-4 [border:none]"
          onClick={onButtonPrimary1Click}
        >
          <div className="text-11xl font-inter mq450:text-lg mq1050:text-5xl relative inline-block w-[83px] min-w-[83px] text-center text-white">
            Continue
          </div>
        </button>
      </div>
    </div>
  );
};

export default ButtonPrimary;
