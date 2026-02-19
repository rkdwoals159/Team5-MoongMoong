import SettingsModal from "@/app/(sidebar)/settings/_components/SettingsModal";
import SettingsManageModalView from "@/app/(sidebar)/settings/_components/SettingsManageModalView";
import { getMemberInfoServer } from "@/api/settingsApiQueries";
import { getPetInfo } from "@/api/petInfoApi";
import type { SettingsTab } from "@/app/(sidebar)/settings/types";

export default async function InterceptedSettingsPage({
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
    <SettingsModal>
      <SettingsManageModalView currentTab={currentTab} account={account} dog={dog} />
    </SettingsModal>
  );
}
