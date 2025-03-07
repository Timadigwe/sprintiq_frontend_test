/**
 * YOU PROBABLY DON'T NEED TO EDIT THIS FILE, UNLESS:
 * 1. You want to modify request context (see Part 1).
 * 2. You want to create a new middleware or type of procedure (see Part 3).
 *
 * TL;DR - This is where all the tRPC server stuff is created and plugged in. The pieces you will
 * need to use are documented accordingly near the end.
 */
import { db } from "@src/server/db";
import { HelperService } from "@src/utils/class/helper.service";
import { COOKIE_KEY } from "@src/utils/constants/constants";
import { initTRPC, TRPCError } from "@trpc/server";
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import { sealData, unsealData } from "iron-session";
import { type RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { NextRequest } from "next/server";
import superjson from "superjson";
import { ZodError } from "zod";

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 *
 * These allow you to access things when processing a request, like the database, the session, etc.
 */

type CreateContextOptions = Record<string, never>;

/**
 * This helper generates the "internals" for a tRPC context. If you need to use it, you can export
 * it from here.
 *
 * Examples of things you may need it for:
 * - testing, so we don't have to mock Next.js' req/res
 * - tRPC's `createSSGHelpers`, where we don't have req/res
 *
 * @see https://create.t3.gg/en/usage/trpc#-serverapitrpcts
 */
const createInnerTRPCContext = (_opts: CreateNextContextOptions): Context => {
  const session: string | undefined = _opts?.req.cookies[COOKIE_KEY];
  return {
    db,
    helper: HelperService,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    _session: session ? session : undefined,
  };
};

/**
 * This is the actual context you will use in your router. It will be used to process every request
 * that goes through your tRPC endpoint.
 *
 * @see https://trpc.io/docs/context
 */
export const createTRPCContext = (_opts: CreateNextContextOptions) => {
  return createInnerTRPCContext(_opts);
};

/**
 * 2. INITIALIZATION
 *
 * This is where the tRPC API is initialized, connecting the context and transformer. We also parse
 * ZodErrors so that you get typesafety on the frontend if your procedure fails due to validation
 * errors on the backend.
 */

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your tRPC API. You should import these a lot in the
 * "/src/server/api/routers" directory.
 */

/**
 * This is how you create new routers and sub-routers in your tRPC API.
 *
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router;

/**
 * Public (unauthenticated) procedure
 *
 * This is the base piece you use to build new queries and mutations on your tRPC API. It does not
 * guarantee that a user querying is authorized, but you can still access user session data if they
 * are logged in.
 */
// TODO configure type
type SessionUser = {
  wallet_address: string;
  id: string;
  nonce: number;
};
interface Context {
  db: typeof db;
  helper: typeof HelperService;
  _session?: string;
  user?: SessionUser;
}
export const publicProcedure = t.procedure;
export const loginProcedure = publicProcedure.use(
  t.middleware(async ({ ctx, next }) => {
    const result = await next({ ctx });
    const resultCtx = "ctx" in result ? (result.ctx as Context) : undefined;
    if (resultCtx?.user) {
      // update nonce on sign in
      await db.profile.update({
        where: {
          id: resultCtx.user.id,
        },
        data: {
          nonce: resultCtx.user.nonce + 1,
        },
      });
      ctx._session = await sealData(
        {
          wallet_address: resultCtx.user.wallet_address,
          id: resultCtx.user.id,
          nonce: resultCtx.user.nonce,
        } satisfies SessionUser,
        { password: process.env.SECRET!, ttl: 60 * 60 * 24 * 7 }, // 7 days
      );
    }
    return result;
  }),
);
export const protectedProcedure = t.procedure.use(
  t.middleware(async ({ ctx, next }) => {
    if (!ctx._session) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    const decoded_session = await unsealData<SessionUser>(ctx._session, {
      password: process.env.SECRET!,
    });
    const user = await ctx.db.profile.findUnique({
      where: {
        wallet_address: decoded_session.wallet_address,
      },
    });
    if (!user) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    return next({ ctx: { ...ctx, user } });
  }),
);
