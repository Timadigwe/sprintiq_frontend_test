import {
  createTRPCRouter,
  loginProcedure,
  protectedProcedure,
  publicProcedure,
} from "@src/server/api/trpc";
import { z } from "zod";

export interface PrismaProfile {
  id: string;
  wallet_address: string;
  username: string;
  nonce: number;
  avatar_url: string | null;
  created_at: Date;
}
export const authRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object({ wallet_address: z.string() }))
    .mutation(async ({ input, ctx }) => {
      try {
        let user: PrismaProfile | null;
        user = await ctx.db.profile.findUnique({
          where: {
            wallet_address: input.wallet_address,
          },
        });
        if (!user) {
          const generatedUserName = ctx.helper.generateUserName();
          const userImage =
            await ctx.helper.generateUserNameImage(generatedUserName);
          user = await ctx.db.profile.create({
            data: {
              wallet_address: input.wallet_address,
              username: generatedUserName,
              avatar_url: userImage,
            },
          });
        }
        return {
          success: true,
          user: user,
        };
      } catch (e) {
        return {
          success: false,
          error: e,
        };
      }
    }),
  login: loginProcedure.input(z.string()).mutation(async ({ input, ctx }) => {
    try {
      const user = await ctx.db.profile.findUnique({
        where: {
          wallet_address: input,
        },
      });
      if (!user) {
        return {
          success: false,
          error: "User not found",
        };
      }
      ctx.user = {
        wallet_address: user.wallet_address,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        nonce: user.nonce,
        id: user.id,
      };
      return {
        success: true,
        user: user,
      };
    } catch (e) {
      return {
        success: false,
        error: e,
      };
    }
  }),
  update_details: protectedProcedure
    .input(
      z.object({
        username: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const usernameExists = await ctx.db.profile.findFirst({
        where: {
          username: input.username,
        },
      });
      if (usernameExists) {
        return {
          success: false,
          error: "Username already exists",
        };
      } else {
        const user = await ctx.db.profile.update({
          where: {
            id: ctx.user.id,
          },
          data: {
            username: input.username,
          },
        });
        return {
          success: true,
          user: user,
        };
      }
    }),
});
