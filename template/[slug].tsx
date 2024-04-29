import type { NextPage, NextPageContext } from "next";
import * as React from "react";

export interface Page {
  blockName: string;
}

const Page: NextPage<Page> = ({ blockName }) => {
  return <div>blockName</div>;
};
Page.getInitialProps = async ({ query }: NextPageContext): Promise<Page> => {
  const { blockName } = query as { blockName: string };
  return { blockName };
};
export default Page;
