import { Routes } from "@src/utils/constants/constants";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface I404Props {}

const Page404: React.FC<I404Props> = () => {
  return (
    <section className="flex h-full min-h-screen w-full flex-col items-center justify-center space-y-5">
      <Image src="/404.png" alt="404" width={200} height={200} />
      <h2 className="text-4xl font-bold">404 Error</h2>
      <p className="text-xl">Sorry, page not found</p>
      <Link
        href={`/dashboard/${Routes.HOME}`}
        className="rounded-2xl border border-secondary-700 bg-secondary-300/10 px-8 py-4 text-white transition-colors duration-500 hover:bg-secondary-300"
      >
        Back to home
      </Link>
    </section>
  );
};
export default Page404;
