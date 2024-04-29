import { HistoryType, Status } from "@prisma/client";
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
  is_subscribed: boolean;
}
export const playerRouter = createTRPCRouter({
  join_game: protectedProcedure
    .input(
      z.object({
        game_code: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const game = await ctx.db.game.findFirst({
        where: {
          game_code: input.game_code,
          NOT: {
            creator_id: ctx.user.id,
          },
        },
      });
      if (!game) {
        return {
          success: false,
          error: "Game with code not found",
        };
      }

      if (game.status === Status.completed) {
        return {
          success: false,
          error: "Game already completed",
        };
      }
      if (game.status !== Status.ongoing) {
        return {
          success: false,
          error: "Game is not started yet",
        };
      }
      const userJoined = await ctx.db.profileHistory.findFirst({
        where: {
          game_id: game.id,
          user_id: ctx.user.id,
          status: "joined",
        },
      });
      if (userJoined) {
        return {
          success: true,
          error: "Already joined Game",
          game: {
            id: game.id,
          },
        };
      } else {
        const joined = await ctx.db.profileHistory.create({
          data: {
            user_id: ctx.user.id,
            game_id: game.id,
            status: "joined",
          },
        });
        return {
          success: true,
          message: "Joined Game",
          game: {
            id: game.id,
          },
        };
      }
    }),
  answer_question: protectedProcedure
    .input(
      z.object({
        game_id: z.string(),
        question_id: z.string(),
        option_id: z.string(),
        time_elapsed: z.boolean().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const question = await ctx.db.question.findUnique({
        where: {
          id: input.question_id,
        },
      });
      let option;
      if (!question) {
        return {
          success: false,
          error: "Question not found",
        };
      }
      if (!input.time_elapsed) {
        option = await ctx.db.options.findUnique({
          where: {
            id: input.option_id,
          },
        });
        if (!option) {
          return {
            success: false,
            error: "Option not found",
          };
        }
      }
      const questionAnswered = await ctx.db.profileHistory.findFirst({
        where: {
          game_id: input.game_id,
          user_id: ctx.user.id,
          question_id: input.question_id,
          status: HistoryType.answered,
        },
      });
      if (questionAnswered) {
        return {
          success: false,
          error: "Already answered Question",
          details: questionAnswered,
        };
      } else {
        const points = input?.time_elapsed
          ? 0
          : question.answer === option?.value
            ? question.points
            : 0;
        const data = input?.time_elapsed
          ? {
              user_id: ctx.user.id,
              game_id: input.game_id,
              question_id: input.question_id,
              points: 0,
              status: HistoryType.answered,
            }
          : {
              user_id: ctx.user.id,
              game_id: input.game_id,
              question_id: input.question_id,
              option_id: input.option_id,
              points,
              status: HistoryType.answered,
            };
        const anwsered = await ctx.db.profileHistory.create({
          data,
        });
        return {
          success: true,
          message: "Answered Question",
          details: anwsered,
        };
      }
    }),
  get_anwsered: protectedProcedure
    .input(
      z.object({
        game_id: z.string(),
        question_id: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const question = await ctx.db.question.findUnique({
        where: {
          id: input.question_id,
        },
      });
      if (!question) {
        return {
          success: false,
          error: "Question not found",
        };
      }
      const questionAnswered = await ctx.db.profileHistory.findFirst({
        where: {
          game_id: input.game_id,
          user_id: ctx.user.id,
          question_id: input.question_id,
          status: HistoryType.answered,
        },
      });
      if (questionAnswered) {
        return {
          success: true,
          message: "Already answered Question",
          details: questionAnswered,
        };
      } else {
        return {
          success: false,
          message: "Question Not Anwsered",
        };
      }
    }),
  get_questions: protectedProcedure
    .input(
      z.object({
        game_id: z.string(),
        page: z.number(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const questions = await ctx.db.question.findMany({
        where: {
          game_id: input.game_id,
        },
        select: {
          id: true,
          description: true,
          question: true,
          points: true,
          options: true,
          duration: true,
          game_id: true,
        },
        orderBy: {
          created_at: "asc",
        },
      });
      const history = await ctx.db.profileHistory.findMany({
        where: {
          game_id: input.game_id,
          user_id: ctx.user?.id,
          status: HistoryType.answered,
        },
      });
      const totalScore = history.reduce((acc, curr) => acc + curr.points, 0);
      let current_question;
      let is_last = false;
      if (input.page >= questions.length) {
        current_question = questions.at(-1);
        is_last = true;
      } else {
        current_question = questions[input.page - 1];
      }
      return {
        success: true,
        questions,
        score: totalScore,
        current_question,
        is_last,
      };
    }),
  finish_game: protectedProcedure
    .input(
      z.object({
        game_id: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const game = await ctx.db.game.findUnique({
        where: {
          id: input.game_id,
        },
      });
      if (!game) {
        return {
          success: false,
          error: "Game not found",
        };
      }
      const gameFinished = await ctx.db.profileHistory.findFirst({
        where: {
          game_id: input.game_id,
          user_id: ctx.user.id,
          status: HistoryType.completed,
        },
      });
      if (gameFinished) {
        return {
          success: false,
          error: "Already finished Game",
        };
      } else {
        const userAnswerHistory = await ctx.db.profileHistory.findMany({
          where: {
            game_id: input.game_id,
            user_id: ctx.user.id,
            status: HistoryType.completed,
          },
        });
        const totalPoints = userAnswerHistory.reduce(
          (acc, curr) => acc + curr.points,
          0,
        );
        const finished = await ctx.db.profileHistory.create({
          data: {
            user_id: ctx.user.id,
            game_id: input.game_id,
            status: HistoryType.completed,
            points: totalPoints,
          },
        });
        return {
          success: true,
          message: "Finished Game",
        };
      }
    }),
  get_history: protectedProcedure
    .input(
      z.object({
        game_id: z.string(),
        limit: z.number().optional(),
        page: z.number().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const currentPage = input.page ?? 1;
      const pageSize = input.limit ?? 10;
      const skip = (currentPage - 1) * pageSize;
      const history = await ctx.db.profileHistory.findMany({
        take: pageSize,
        skip,
        where: {
          game_id: input.game_id,
          user_id: ctx.user.id,
          status: HistoryType.answered,
        },
        orderBy: {
          points: "desc",
        },
      });
      const total_pages = await ctx.db.profileHistory.count({
        where: {
          game_id: input.game_id,
          user_id: ctx.user.id,
        },
      });
      return {
        success: true,
        history: history,
        page_info: {
          current_page: currentPage,
          total_pages: Math.ceil(total_pages / pageSize),
          total_count: total_pages,
        },
      };
    }),
  leader_board: protectedProcedure
    .input(
      z.object({
        game_id: z.string(),
        limit: z.number().optional(),
        skip: z.number().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const pageSize = input.limit ?? 10;
      const history = await ctx.db.profileHistory.groupBy({
        by: ["user_id"],
        take: pageSize,
        skip: input.skip ?? 0,
        where: {
          game_id: input.game_id,
          status: HistoryType.answered,
        },
        orderBy: [
          {
            _sum: {
              points: "desc",
            },
          },
          {
            _max: {
              created_at: "asc",
            },
          },
        ],
        _sum: {
          points: true,
        },
        _max: {
          created_at: true,
        },
      });
      const data = await Promise.all(
        history.map(async val => {
          const user = await ctx.db.profile.findUnique({
            where: {
              id: val.user_id,
            },
          });
          return { ...user, ...val };
        }),
      );
      return {
        success: true,
        history: data,
      };
    }),
  get_notifications: protectedProcedure
    .input(
      z.object({
        limit: z.number().optional(),
        skip: z.number().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const pageSize = input.limit ?? 10;
      const notifications = await ctx.db.notification.findMany({
        where: {
          user_id: ctx.user.id,
        },
        skip: input.skip ?? 0,
        take: pageSize,
        orderBy: {
          created_at: "desc",
        },
      });
      return {
        success: true,
        notifications,
      };
    }),
  get_winners: protectedProcedure
    .input(
      z.object({
        game_id: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const game = await ctx.db.game.findUnique({
        where: {
          id: input.game_id,
        },
        include: {
          percentages: true,
        },
      });
      const positions = game?.percentages ?? [];
      const history = await ctx.db.profileHistory.groupBy({
        by: ["user_id"],
        take: positions.length,
        where: {
          game_id: input.game_id,
          status: HistoryType.answered,
        },
        orderBy: [
          {
            _sum: {
              points: "desc",
            },
          },
          {
            _max: {
              created_at: "asc",
            },
          },
        ],
        _sum: {
          points: true,
        },
        _max: {
          created_at: true,
        },
      });
      const winners = await Promise.all(
        history.map(async val => {
          const user = await ctx.db.profile.findUnique({
            where: {
              id: val.user_id,
            },
          });
          return { ...user, ...val };
        }),
      );
      // send notifications to winner
      await Promise.all(
        winners.map(async (val, index) => {
          const exists = await ctx.db.notification.findFirst({
            where: {
              user_id: val.user_id,
              ref_id: input.game_id,
            },
          });
          if (exists) {
            return;
          }
          // send notification

          await ctx.db.notification.create({
            data: {
              user_id: val.user_id,
              message: `you took position ${index + 1}`,
              ref_id: input.game_id,
            },
          });
        }),
      );

      return {
        success: true,
        winners: winners.map((val, index) => {
          return {
            ...val,
            position: positions[index],
          };
        }),
      };
    }),
});
