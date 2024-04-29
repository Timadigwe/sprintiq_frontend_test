import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { useQuizContext } from "@src/provider/QuizContext";
import { api } from "@src/utils/api";
import { Routes } from "@src/utils/constants/constants";
import { sendFundsToPlayers } from "@src/utils/helpers/sol_program_helpers";
import Link from "next/link";
import * as React from "react";
import { TfiReload } from "react-icons/tfi";
import { BeatLoader } from "react-spinners";
import { toast, Toaster } from "sonner";

import LeaderBoardItem from "../molecule/LeaderBoardItem";
import Button from "../ui/Button";
import Spinner from "../ui/Spinner";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ILeaderboardProps {
  gameId: string;
}
interface ILeaderBoard {
  user_id: string;
  _sum: {
    points: number;
  };
  id?: string;
  wallet_address?: string;
  username?: string;
  nonce?: number;
  avatar_url?: string;
  created_at?: Date;
}
const Leaderboard: React.FC<ILeaderboardProps> = props => {
  const { mutateAsync, data, isLoading } =
    api.player.leader_board.useMutation();
  const [players, setPlayers] = React.useState<Array<ILeaderBoard>>([]);
  const [noMoreFetch, setNoMoreFetch] = React.useState(false);
  const [firstFetch, setFirstFetch] = React.useState(true);

  const fetchLeaderboard = async (reset?: boolean) => {
    const PAGE_SIZE = 20;
    const newPlayers = await mutateAsync({
      game_id: props.gameId,
      limit: PAGE_SIZE,
      skip: players.length,
    });
    if (!newPlayers) return;
    if (newPlayers?.history?.length < PAGE_SIZE) {
      setNoMoreFetch(true);
    }
    setPlayers(prev =>
      (reset ? [] : [...prev]).concat(
        (newPlayers?.history || []) as Array<ILeaderBoard>,
      ),
    );
    setFirstFetch(false);
  };
  const resetState = async () => {
    setFirstFetch(true);
    setNoMoreFetch(false);
    void fetchLeaderboard(true);
  };

  React.useEffect(() => {
    void resetState();
  }, []);
  let content: React.ReactNode;
  if (firstFetch) {
    content = (
      <div className="my-8 flex flex-col items-center">
        <Spinner />
        <h2>Checking for your notifications...</h2>
      </div>
    );
  } else if (players.length === 0) {
    content = (
      <div className="flex flex-col items-center text-center">
        <h2 className="text-2xl font-medium">No Notifications Yet</h2>
        <p className="text-grey-200">Your Notifications will show up here</p>
      </div>
    );
  } else {
    content = (
      <div className="flex flex-col space-y-6">
        {players?.map((val, index) => (
          <LeaderBoardItem key={val.id} {...val} position={index + 1} />
        ))}

        {!noMoreFetch && !firstFetch && (
          <Button
            onClick={() => fetchLeaderboard()}
            text="Load more"
            className="mt-12"
          />
        )}
      </div>
    );
  }
  return (
    <main>
      <section className="px-6 py-24">
        <Toaster />
        <Link href={`/dashboard/${Routes.HOME}`} className="cursor-pointer">
          <div className="hidden h-0 w-0 border-b-[25px] border-r-[50px] border-t-[25px] border-b-transparent border-r-white border-t-transparent lg:block" />
        </Link>
        <div className="mx-auto w-10/12 rounded-xl border border-secondary-700 bg-secondary-300/10">
          <div className="flex items-center justify-center space-x-2 border-b border-b-secondary-700 py-16 text-center text-3xl font-bold text-secondary-700">
            <h1>Leaderboard</h1>
            <TfiReload
              className="h-6 w-auto cursor-pointer"
              onClick={() => {
                void resetState();
              }}
            />
          </div>
          <div className="px-16 py-8">{content}</div>
        </div>
      </section>
    </main>
  );
};
export default Leaderboard;
