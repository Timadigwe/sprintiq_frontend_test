import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useCallback } from "react";

const ButtonContinue: NextPage = () => {
  const router = useRouter();

  const onButtonPrimaryClick = useCallback(() => {
    void router.push("/you-are-set");
  }, [router]);

  return (
    <div className="rounded-11xl bg-darkgreen text-11xl font-inter border-limegreen absolute left-[292px] top-[227px] z-[1] box-border h-[663px] w-[927px] border-[1px] border-solid text-center text-white">
      <div className="rounded-11xl bg-darkgreen border-limegreen absolute left-[0px] top-[0px] box-border hidden h-full w-full border-[1px] border-solid" />
      <div className="rounded-11xl bg-darkgreen border-limegreen absolute left-[0px] top-[0px] box-border h-full w-full border-[1px] border-solid" />
      <h1 className="text-41xl font-inherit mq450:text-17xl mq450:leading-[30px] mq750:text-29xl mq750:leading-[40px] absolute left-[146px] top-[145px] z-[3] m-0 flex h-[103px] w-[635px] items-center justify-center font-normal leading-[50px]">
        Game Token
      </h1>
      <button
        className="bg-limegreen rounded-81xl hover:bg-forestgreen absolute left-[295px] top-[517px] z-[3] box-border flex w-[335px] cursor-pointer flex-col items-center justify-start px-8 py-4 [border:none]"
        onClick={onButtonPrimaryClick}
      >
        <div className="text-11xl font-inter mq450:text-lg mq750:text-5xl relative inline-block w-32 min-w-[128px] text-center text-white">
          Continue
        </div>
      </button>
      <div className="rounded-81xl border-lime absolute left-[295px] top-[264px] z-[3] box-border flex w-[335px] flex-col items-center justify-start border-[1px] border-solid px-8 py-4">
        <div className="mq450:text-lg mq750:text-5xl relative inline-block w-28 min-w-[112px]">
          437200
        </div>
      </div>
      <div className="mq450:text-lg mq450:leading-[9px] mq750:text-5xl mq750:leading-[12px] absolute left-[138px] top-[402px] z-[3] flex w-[651px] items-center justify-center leading-[15px]">
        Participants can access Game with this code
      </div>
    </div>
  );
};

export default ButtonContinue;
