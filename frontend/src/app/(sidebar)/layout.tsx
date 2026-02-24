import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar/SideBar";
import SSEListener from "@/app/_components/SSEListener";
import { ServerEventProvider } from "@/hooks/ServerEventProvider";

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
          <Sidebar className="flex-1 min-w-[240px]" />
          <div className="flex min-w-0 flex-5 flex-col">
            <Header className="shrink-0" />
            <main className="flex-1 flex flex-col min-h-0 overflow-auto">{children}</main>
          </div>
        </div>
      </div>
      {modal}
    </ServerEventProvider>
  );
}
