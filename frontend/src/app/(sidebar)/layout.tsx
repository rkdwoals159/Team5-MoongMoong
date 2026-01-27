import Header from "@/components/layout/Header/Header";
import Sidebar from "@/components/layout/Sidebar/SideBar";

export default function SidebarLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen bg-white-100">
      <div className="flex h-full">
        <Sidebar />
        <div className="flex flex-1 flex-col">
          <Header className="shrink-0" />
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </div>
    </div>
  );
}
