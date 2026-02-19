import PageHeader from "@/components/layout/Header/PageHeader";
import AccountSettingsSection from "./_components/AccountSettingsSection";
import DogSettingsSection from "./_components/DogSettingsSection";
import { getMemberInfoServer } from "@/api/settingsApiQueries";
import { getPetInfo } from "@/api/petInfoApi";
import type { SettingsTab } from "./types";

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const resolved = await searchParams;
  const currentTabParam = resolved?.tab;
  const currentTab: SettingsTab = currentTabParam === "dog" ? "dog" : "account";

  const account = currentTab === "account" ? await getMemberInfoServer() : null;
  const dog = currentTab === "dog" ? await getPetInfo() : null;

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
