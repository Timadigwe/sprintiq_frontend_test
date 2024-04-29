import * as React from "react";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IDashboardLayoutProps {
  children?: React.ReactNode;
}

const DashboardLayout: React.FC<IDashboardLayoutProps> = ({ children }) => {
  return <section className="h-full w-full">{children}</section>;
};
export default DashboardLayout;
