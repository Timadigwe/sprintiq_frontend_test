import { ProfileContext } from "@src/provider/ProfileProvider";
import { Routes } from "@src/utils/constants/constants";
import * as React from "react";

import Page404 from "./404";
import AddReward from "./AddReward";
import AddRewardToken from "./AddRewardToken";
import CreateGame from "./Create";
import Game from "./Game";
import GenerateCode from "./GenerateCode";
import GetCode from "./GetCode";
import Home from "./Home";
import JoinGame from "./JoinGame";
import Leaderboard from "./Leaderboard";
import Notification from "./Notification";
import Reward from "./Reward";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IDashboardContainerProps {
  currentSection: Routes;
  gameId: string;
  page: string;
}

const DashboardContainer: React.FC<IDashboardContainerProps> = ({
  currentSection,
  gameId,
  page,
}) => {
  const { currentProfile } = React.useContext(ProfileContext);

  const renderSelected = () => {
    switch (currentSection) {
      case Routes.HOME:
        return <Home />;
      case Routes.JOIN:
        return <JoinGame />;
      case Routes.GAME:
        return <Game gameId={gameId} page={page} />;
      case Routes.CREATE:
        return <CreateGame />;
      case Routes.GENERATE_CODE:
        return <GenerateCode />;
      case Routes.GET_CODE:
        return <GetCode />;
      case Routes.LEADER_BOARD:
        return <Leaderboard gameId={gameId} />;
      case Routes.REWARD:
        return <Reward gameId={gameId} />;
      case Routes.ADD_REWARD:
        return <AddReward />;
      case Routes.ADD_REWARD_TOKEN:
        return <AddRewardToken />;
      case Routes.NOTIFICATION:
        return <Notification gameId={gameId} />;
      default:
        return <Page404 />;
    }
  };
  return <section className="h-full w-full">{renderSelected()}</section>;
};
export default DashboardContainer;
