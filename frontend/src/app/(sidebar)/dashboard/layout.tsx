import { Metadata } from "next";

export const metadata: Metadata = {
  title: "대시보드",
  description: "대시보드",
};

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex flex-col flex-1 min-h-0">{children}</div>;
};

export default DashboardLayout;
