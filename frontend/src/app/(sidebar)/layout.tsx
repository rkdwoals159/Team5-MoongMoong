import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar/SideBar";
import SSEListener from "@/app/_components/SSEListener";
import { ServerEventProvider } from "@/hooks/ServerEventProvider";
import { getGroupCrew } from "@/api/client/familyApi";
import { safeServerFetch } from "@/api/lib/client";
import { redirect } from "next/navigation";

async function redirectToOnBoardingIfNotInGroup() {
  const groupInfo = await safeServerFetch(() => getGroupCrew());
  if (groupInfo instanceof Error) {
    if (groupInfo.status === 404) {
      return redirect("/onBoarding");
    }
  }
  return groupInfo;
}

export default async function SidebarLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  await redirectToOnBoardingIfNotInGroup();
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
