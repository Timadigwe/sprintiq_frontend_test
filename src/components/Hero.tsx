import type { NextPage } from "next";
import { Montserrat } from "next/font/google";

import Subtract from "./icons/Subtract.icon";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: "400",
});

const Hero: NextPage = () => {
  return (
    <div className="relative mx-auto flex max-w-screen-md flex-col text-center ">
      <div className="relative w-full">
        <h1
          className={`mx-auto text-center text-4xl font-normal ${montserrat.className} md:text-6xl`}
        >
          Enhance your Web3 Knowledge
        </h1>
        <Subtract className="absolute inset-x-0 top-8 mx-auto w-3/4 lg:top-20" />
      </div>
      <div className="md:mx-auto mx-8 mt-12 w-fit rounded-3xl border border-secondary-700 lg:px-6 px-3 py-3">
        <p className="">
          Conquer Quizzes, Expand Knowledge, and Thrive in the Blockchain
          Revolution
        </p>
      </div>
    </div>
  );
};

export default Hero;
