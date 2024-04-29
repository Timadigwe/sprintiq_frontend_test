/* eslint-disable @typescript-eslint/no-misused-promises */
import { Status } from "@prisma/client";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@src/server/api/trpc";
import { z } from "zod";

export const gameRouter = createTRPCRouter({
  create_game: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string(),
        game_code: z.string().optional(),
        reward: z.number().optional(),
        percentages: z
          .array(
            z.object({
              position: z.number(),
              percentage: z.number(),
            }),
          )
          .optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const query = [];
      // check if game with
      if (input.game_code) {
        query.push({
          game_code: input.game_code,
        });
      }
      if (input.title) {
        query.push({
          title: input.title,
          creator_id: ctx.user.wallet_address,
        });
      }
      const game_exists = await ctx.db.game.findFirst({
        where: {
          OR: query,
        },
      });

      if (game_exists) {
        return {
          success: false,
          error: "Game already exists",
        };
      }
      const game = await ctx.db.game.create({
        data: {
          title: input.title,
          description: input.description,
          game_code: input.game_code,
          reward: input.reward,
          creator_id: ctx.user.wallet_address,
        },
      });
      if (input.percentages) {
        await ctx.db.percentages.createMany({
          data: input.percentages.map(p => ({
            game_id: game.id,
            position: p.position,
            percentage: p.percentage,
          })),
        });
      }
      return {
        success: true,
        game: game,
      };
    }),
  get_games: publicProcedure
    .input(
      z.object({
        game_code: z.string().optional(),
        title: z.string().optional(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const games = await ctx.db.game.findMany({
        where: {
          game_code: input.game_code,
          title: input.title,
        },
        select: {
          percentages: true,
        },
      });
      return {
        success: true,
        games: games,
      };
    }),
  get_created_games: protectedProcedure
    .input(
      z.object({
        limit: z.number(),
        skip: z.number().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const games = await ctx.db.game.findMany({
        take: input.limit,
        skip: input.skip,
        where: {
          creator_id: ctx.user.wallet_address,
        },
        orderBy: {
          created_at: "desc",
        },
      });
      return {
        success: true,
        games: games,
      };
    }),
  get_game: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const game = await ctx.db.game.findUnique({
        where: {
          id: input.id,
        },
      });
      return {
        success: true,
        game: game,
      };
    }),
  update_game: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().optional(),
        description: z.string().optional(),
        game_code: z.string().optional(),
        reward: z.number().optional(),
        percentages: z
          .array(
            z.object({
              position: z.number(),
              percentage: z.number(),
            }),
          )
          .optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const game = await ctx.db.game.update({
        where: {
          id: input.id,
          creator_id: ctx.user.wallet_address,
        },
        data: {
          title: input.title,
          description: input.description,
          game_code: input.game_code,
          reward: input.reward,
        },
      });
      if (input.percentages) {
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        input.percentages.forEach(async p => {
          const percentages = await ctx.db.percentages.findFirst({
            where: {
              game_id: game.id,
              position: p.position,
            },
          });
          if (percentages) {
            await ctx.db.percentages.update({
              where: {
                id: percentages.id,
                game: {
                  creator_id: ctx.user.wallet_address,
                },
              },
              data: {
                percentage: p.percentage,
              },
            });
          } else {
            await ctx.db.percentages.create({
              data: {
                game_id: game.id,
                position: p.position,
                percentage: p.percentage,
              },
            });
          }
        });
      }
      return {
        success: true,
        game: game,
      };
    }),
  create_question: protectedProcedure
    .input(
      z.array(
        z.object({
          type: z.enum(["text", "image", "video"]),
          question: z.string(),
          description: z.string().optional(),
          game_id: z.string(),
          answer: z.string(),
          points: z.number(),
          // duration in milliseconds
          duration: z.number(),
          options: z.array(z.string()),
        }),
      ),
    )
    .mutation(async ({ input, ctx }) => {
      const questions = await Promise.all(
        input.map(async q => {
          return await ctx.db.question.create({
            data: {
              type: q.type,
              question: q.question,
              description: q.description,
              game_id: q.game_id,
              answer: q.answer,
              points: q.points,
              duration: q.duration,
              options: {
                createMany: {
                  data: q.options.map(o => ({
                    value: o,
                  })),
                },
              },
            },
          });
        }),
      );
      return {
        success: true,
        questions,
      };
    }),
  get_question: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const question = await ctx.db.question.findUnique({
        where: {
          id: input.id,
        },
      });
      return {
        success: true,
        question: question,
      };
    }),
  get_questions: publicProcedure
    .input(
      z.object({
        game_id: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const questions = await ctx.db.question.findMany({
        where: {
          game_id: input.game_id,
        },
        select: {
          description: true,
          question: true,
          points: true,
          options: true,
          duration: true,
          game_id: true,
        },
      });
      return {
        success: true,
        questions: questions,
      };
    }),
  update_question: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        type: z.enum(["text", "image", "video"]),
        question: z.string(),
        description: z.string().optional(),
        game_id: z.string(),
        answer: z.string(),
        points: z.number(),
        // duration in milliseconds
        duration: z.number(),
        options: z.array(
          z.object({
            id: z.string(),
            value: z.string(),
          }),
        ),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const question = await ctx.db.question.update({
        where: {
          id: input.id,
        },
        data: {
          type: input.type,
          question: input.question,
          description: input.description,
          game_id: input.game_id,
          answer: input.answer,
          points: input.points,
          duration: input.duration,
        },
      });
      if (input.options) {
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        input.options.forEach(async o => {
          const option = await ctx.db.options.findFirst({
            where: {
              question_id: question.id,
              id: o.id,
            },
          });
          if (!option) {
            await ctx.db.options.create({
              data: {
                question_id: question.id,
                value: o.value,
              },
            });
          } else {
            await ctx.db.options.update({
              where: {
                id: o.id,
              },
              data: {
                value: o.value,
              },
            });
          }
        });
      }
      return {
        success: true,
        question: question,
      };
    }),
  delete_question: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const question = await ctx.db.question.delete({
        where: {
          id: input.id,
          game: {
            creator_id: ctx.user?.wallet_address,
          },
        },
      });
      return {
        success: true,
        question: question,
      };
    }),
  delete_game: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const game = await ctx.db.game.delete({
        where: {
          id: input.id,
          creator_id: ctx.user?.wallet_address,
        },
      });
      return {
        success: true,
        game: game,
      };
    }),
  delete_option: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        question_id: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const option = await ctx.db.options.delete({
        where: {
          id: input.id,
          question_id: input.question_id,
          question: {
            game: {
              creator_id: ctx.user?.wallet_address,
            },
          },
        },
      });
      return {
        success: true,
        option: option,
      };
    }),
  full_game_create: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string(),
        game_code: z.string().optional(),
        reward: z.number().optional(),
        percentages: z.array(
          z.object({
            position: z.number(),
            percentage: z.number(),
          }),
        ),
        questions: z.array(
          z.object({
            type: z.enum(["text", "image", "video"]),
            question: z.string(),
            description: z.string().optional(),
            answer: z.string(),
            points: z.number(),
            // duration in milliseconds
            duration: z.number(),
            options: z.array(z.string()),
          }),
        ),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const query = [];
      // check if game with
      if (input.game_code) {
        query.push({
          game_code: input.game_code,
        });
      }
      if (input.title) {
        query.push({
          title: input.title,
          creator_id: ctx.user.wallet_address,
        });
      }
      const game_exists = await ctx.db.game.findFirst({
        where: {
          OR: query,
        },
      });

      if (game_exists) {
        return {
          success: false,
          error: "Game already exists",
        };
      }
      const game = await ctx.db.game.create({
        data: {
          title: input.title,
          description: input.description,
          creator_id: ctx.user?.wallet_address,
          game_code: input.game_code,
          reward: input.reward,
          percentages: {
            createMany: {
              data: input.percentages?.map(p => ({
                position: p.position,
                percentage: p.percentage,
              })),
            },
          },
        },
      });
      if (game) {
        input.questions.forEach(async data => {
          const question = await ctx.db.question.create({
            data: {
              question: data.question,
              description: data.description,
              answer: data.answer,
              points: data.points,
              duration: data.duration,
              game_id: game.id,
            },
          });
          if (question) {
            data.options.forEach(async data => {
              const option = await ctx.db.options.create({
                data: {
                  value: data,
                  question_id: question.id,
                },
              });
            });
          }
        });
      }
      return {
        success: true,
        game: game,
      };
    }),
  start_game: protectedProcedure
    .input(
      z.object({
        game_id: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const gameStarted = await ctx.db.game.findFirst({
        where: {
          id: input.game_id,
          creator_id: ctx.user.wallet_address,
        },
      });
      if (!gameStarted || gameStarted?.status === Status.completed) {
        return {
          success: false,
          message: "Game Already Started",
        };
      }
      const game = await ctx.db.game.update({
        where: {
          id: input.game_id,
          creator_id: ctx.user.wallet_address,
        },
        data: {
          status: Status.ongoing,
        },
      });
      return {
        success: true,
        message: "Game Started Successfully",
      };
    }),
});
