import { api } from "@src/utils/api";
import { useRouter } from "next/router";
import * as React from "react";
import { toast } from "sonner";

import Button from "../ui/Button";
import Input from "../ui/Input";
import Spinner from "../ui/Spinner";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IJoinGameProps {}

const JoinGame: React.FC<IJoinGameProps> = props => {
  const [token, setToken] = React.useState<string | undefined>("");
  const { mutateAsync, isLoading } = api.player.join_game.useMutation();
  const createGame = api.game.full_game_create.useMutation();
  const { push } = useRouter();
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length <= 6) {
      setToken(e.target.value || undefined);
    }
  };
  const handleContinue = () => {
    if (!token) return;
    void mutateAsync({
      game_code: token,
    }).then(res => {
      console.log(res);
      if (res.success) {
        void push(`/dashboard/game?gameId=${res.game?.id}&page=1`);
      } else {
        toast(res.error);
      }
    });
  };
  // React.useEffect(() => {
  //   void createGame
  //     .mutateAsync({
  //       title: "Demo Game",
  //       description: "This is a game we can test at the demo.",
  //       game_code: "060424",
  //       reward: 100,
  //       percentages: [
  //         {
  //           position: 1,
  //           percentage: 45,
  //         },
  //         {
  //           position: 2,
  //           percentage: 30,
  //         },
  //         {
  //           position: 3,
  //           percentage: 25,
  //         },
  //       ],
  //       questions: [
  //         {
  //           type: "text",
  //           question:
  //             "Solana is the fastest and the cheapest layer two protocol.",
  //           description: "A question on the ecosystem",
  //           answer: "Not at all",
  //           points: 20,
  //           duration: 100000,
  //           options: ["Definitely", "Not at all", "Be like", "not that fast"],
  //         },
  //         {
  //           type: "text",
  //           question: "SuperteamNG is headed by:",
  //           description: "A question on administration.",
  //           answer: "Nzube Nzudo",
  //           points: 20,
  //           duration: 10000,
  //           options: ["Chrisdotsol", "Harri Obi", "Kash Dhanda", "Nzube Nzudo"],
  //         },
  //         {
  //           type: "text",
  //           question:
  //             "All these are projects from the SuperteamNG community at ongoing solana global hackathon except;",
  //           description: "A question on the hackathon",
  //           answer: "Verzio",
  //           points: 20,
  //           duration: 10000,
  //           options: ["Nomad", "FundusAi", "Kalo", "Verzio"],
  //         },
  //         {
  //           type: "text",
  //           question:
  //             "All Blockchain and crypto activities are banned in Nigeria",
  //           description:
  //             "This is a question on the state of blockchain in nigeria",
  //           answer: "False",
  //           points: 20,
  //           duration: 10000,
  //           options: ["True", "False"],
  //         },
  //         {
  //           type: "text",
  //           question: "ERC is to Ethereum what SPL is to Solana. What’s SPL?",
  //           description: "This is a question on solana and its ecosystem",
  //           answer: "Solana program library",
  //           points: 20,
  //           duration: 10000,
  //           options: [
  //             "Solana product library",
  //             "Solana program logic",
  //             "Solana programmable logic",
  //             "Solana program library",
  //           ],
  //         },
  //       ],
  //     })
  //     .then(console.log);
  // }, []);
  return (
    <section className="grid h-full min-h-screen w-full place-content-center text-lg">
      <div className="mx-auto flex w-full flex-col items-center space-y-4">
        <h2 className="text-2xl">Game Token</h2>
        <Input value={token} onChange={handleInput} className="text-center" />
        <p>Input 6 digit game code</p>
        {isLoading ? (
          <Spinner />
        ) : (
          <Button text="Continue" onClick={handleContinue} />
        )}
      </div>
    </section>
  );
};
export default JoinGame;
