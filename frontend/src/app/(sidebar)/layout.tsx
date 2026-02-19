import Header from "@/components/layout/Header/Header";
import Sidebar from "@/components/layout/Sidebar/SideBar";
import SSEListener from "@/app/_components/SSEListener";
import { ServerEventProvider } from "@/store/ServerEventProvider";

export default function SidebarLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <ServerEventProvider>
      {process.env.NEXT_PUBLIC_LHCI !== "true" && <SSEListener />}
      <div className="h-screen bg-white-100">
        <div className="flex h-full">
          <Sidebar className="w-[240px] shrink-0" />
          <div className="flex flex-5 flex-col min-w-0">
            <Header className="shrink-0" />
            <main className="flex-1 flex flex-col min-h-0 overflow-auto">{children}</main>
          </div>
        </div>
      </div>
      {modal}
    </ServerEventProvider>
  );
}
