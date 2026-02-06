import { Metadata } from "next";

export const metadata: Metadata = {
  title: "대시보드",
  description: "대시보드",
};

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex-1 min-h-0 flex flex-col gap-600 px-8 select-none">{children}</div>;
};

export default DashboardLayout;
