import SettingsModal from "@/app/(sidebar)/settings/_components/SettingsModal";
import SettingsManageModalView from "@/app/(sidebar)/settings/_components/SettingsManageModalView";

export default function InterceptedSettingsPage() {
  return (
    <SettingsModal>
      <SettingsManageModalView />
    </SettingsModal>
  );
}
