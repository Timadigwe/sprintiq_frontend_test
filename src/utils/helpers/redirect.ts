import { type NextPageContext } from "next";
import Router from "next/router";

const redirectTo = async (path: string, ctx: NextPageContext) => {
  const serverSide = Boolean(ctx.res);

  if (serverSide) {
    ctx.res!.writeHead(302, {
      Location: path,
    });
    ctx.res?.end();
  } else {
    await Router.replace(path);
  }
  return {};
};

export default redirectTo;
