import { authRouter } from "@src/server/api/routers/auth";
import { gameRouter } from "@src/server/api/routers/game";
import { createTRPCRouter } from "@src/server/api/trpc";

import { playerRouter } from "./routers/player";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  game: gameRouter,
  auth: authRouter,
  player: playerRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
