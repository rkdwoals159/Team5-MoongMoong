import PageHeader from "@/components/layout/Header/PageHeader";
import AccountSettingsSection from "./_components/AccountSettingsSection";
import DogSettingsSection from "./_components/DogSettingsSection";
import { getMemberInfoServer } from "@/api/server/settingsApiQueries";
import { getPetInfo } from "@/api/server/petApi";
import type { SettingsTab } from "./types";
import ServerComponentErrorFallback from "@/components/ui/ErrorBoundary/ServerComponentErrorFallback";
import { safeServerFetch } from "@/api/lib/client";

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const resolved = await searchParams;
  const currentTabParam = resolved?.tab;
  const currentTab: SettingsTab = currentTabParam === "dog" ? "dog" : "account";

  const account =
    currentTab === "account" ? await safeServerFetch(() => getMemberInfoServer()) : null;
  if (account instanceof Error) {
    return <ServerComponentErrorFallback message={account.message} />;
  }

  const dog = currentTab === "dog" ? await safeServerFetch(() => getPetInfo()) : null;
  if (dog instanceof Error) {
    return <ServerComponentErrorFallback message={dog.message} />;
  }

  return (
    <article className="flex flex-col gap-850 px-850">
      <PageHeader title={currentTab === "dog" ? "반려견 관리" : "계정 관리"} />
      <section className="py-300">
        {currentTab === "account"
          ? account && <AccountSettingsSection account={account} />
          : dog && <DogSettingsSection dog={dog} />}
      </section>
    </article>
  );
}
