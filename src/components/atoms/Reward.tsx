import * as React from "react";

import Abstract from "../icons/Abstract.icon";
import Button from "../ui/Button";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IRewardProps {
  gameId?: string;
}

const Reward: React.FC<IRewardProps> = props => {
  let content;
  if (true) {
    content = (
      <div className="z-10 m-auto text-5xl font-bold text-secondary-700">
        Getting your Results...
      </div>
    );
  }
  if (false) {
    content = (
      <div className="z-10 flex flex-col items-center space-y-4">
        <h2 className="text-4xl font-bold text-secondary-700">
          Congratulations
        </h2>
        <p className="w-7/12 text-center text-2xl">
          You are one of the top winners
        </p>
        <Button className="" text="Claim Rewards" />
      </div>
    );
  }
  if (false) {
    content = <div></div>;
  }
  return (
    <section className="relative grid min-h-screen place-content-center">
      <Abstract className="absolute inset-0 w-full " />
      {content}
    </section>
  );
};
export default Reward;
