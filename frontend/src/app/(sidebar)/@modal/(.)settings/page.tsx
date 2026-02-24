import SettingsModal from "@/app/(sidebar)/settings/_components/SettingsModal";
import SettingsManageModalView from "@/app/(sidebar)/settings/_components/SettingsManageModalView";
import { getMemberInfoServer } from "@/api/server/settingsApiQueries";
import { getPetInfo } from "@/api/server/petApi";
import type { SettingsTab } from "@/app/(sidebar)/settings/types";
import ServerComponentErrorFallback from "@/components/ui/ErrorBoundary/ServerComponentErrorFallback";
import { safeServerFetch } from "@/api/lib/client";

export default async function InterceptedSettingsPage({
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
    <SettingsModal>
      <SettingsManageModalView currentTab={currentTab} account={account} dog={dog} />
    </SettingsModal>
  );
}
