import { env } from "@src/env";
import { appRouter } from "@src/server/api/root";
import { createTRPCContext } from "@src/server/api/trpc";
import { COOKIE_KEY } from "@src/utils/constants/constants";
import { createNextApiHandler } from "@trpc/server/adapters/next";

// export API handler
const ENV = env.NODE_ENV;
export default createNextApiHandler({
  router: appRouter,
  createContext: createTRPCContext,

  onError:
    ENV === "development"
      ? ({ path, error }) => {
          console.error(
            `❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`,
          );
        }
      : undefined,
  responseMeta({ ctx, paths, errors }) {
    const allOk = errors.length === 0;
    console.log("Setting cookie...");
    if (
      allOk &&
      ctx?._session &&
      paths?.find(path => ["auth.login"].includes(path))
    ) {
      return {
        headers: {
          "set-cookie": `${COOKIE_KEY}=${
            ctx._session
          }; Max-Age=2592000; SameSite=Strict; Path=/; ${
            ENV === "development" ? "" : "Secure; "
          }HttpOnly`,
        },
      };
    }
    return {};
  },
});
