import PageHeader from "@/components/layout/Header/PageHeader";
import AccountSettingsSection from "./_components/AccountSettingsSection";
import DogSettingsSection from "./_components/DogSettingsSection";
import { accountSettingsMock } from "./_mock/accountSettingsMock";
import { dogSettingsMock } from "./_mock/dogSettingsMock";
import type { SettingsTab } from "./types";

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const resolved = await searchParams;
  const currentTabParam = resolved?.tab;
  const currentTab: SettingsTab = currentTabParam === "dog" ? "dog" : "account";

  return (
    <article className="flex flex-col gap-850 px-850">
      <PageHeader title={currentTab === "dog" ? "반려견 관리" : "계정 관리"} />
      <section className="py-300">
        {currentTab === "account" ? (
          <AccountSettingsSection account={accountSettingsMock} />
        ) : (
          <DogSettingsSection dog={dogSettingsMock} />
        )}
      </section>
    </article>
  );
}
