import { Routes } from "@src/utils/constants/constants";
import redirectTo from "@src/utils/helpers/redirect";
import { type NextPage } from "next";
import React from "react";

const Dashboard: NextPage = () => {
  return <></>;
};
Dashboard.getInitialProps = async ctx => {
  return redirectTo(`/dashboard/${Routes.HOME}`, ctx);
};

export default Dashboard;
