"use client";

import { useRouter } from "next/navigation";
import ExpandIcon from "@/assets/icons/family/ic_expand.svg";
import SettingsTabs from "./SettingsTabs";
import AccountSettingsSection from "./AccountSettingsSection";
import DogSettingsSection from "./DogSettingsSection";
import type { SettingsManageModalViewProps } from "@/app/(sidebar)/settings/types";

export default function SettingsManageModalView({
  currentTab,
  account,
  dog,
}: SettingsManageModalViewProps) {
  const router = useRouter();
  const handleClose = () => router.back();

  return (
    <div className={cardClasses}>
      <div className={contentWrapperClasses}>
        <aside className="flex h-[580px] w-[14rem] flex-col justify-between bg-gray-50 px-850 py-850">
          <SettingsTabs />
        </aside>
        <div className="flex h-[580px] flex-1 flex-col gap-600 px-850 py-850 overflow-y-auto">
          <div className="flex items-center justify-between mb-200">
            <header className="flex flex-col gap-100">
              <h2 id="dog-settings-title" className="typo-title-l-bold text-base">
                {currentTab === "dog" ? "반려견 관리" : "계정 관리"}
              </h2>
            </header>
            <a
              href={`/settings?tab=${currentTab}`}
              className={expandButtonClasses}
              aria-label="전체 화면으로 보기"
              title="전체 화면으로 보기"
            >
              <ExpandIcon className="size-5" aria-hidden="true" />
            </a>
          </div>
          {currentTab === "account"
            ? account && <AccountSettingsSection account={account} onClose={handleClose} />
            : dog && <DogSettingsSection dog={dog} onClose={handleClose} />}
        </div>
      </div>
    </div>
  );
}

const cardClasses =
  "relative overflow-hidden rounded-600 bg-white-100 shadow-[0px_4px_40px_0px_rgba(26,31,39,0.25)]";

const contentWrapperClasses = "mx-auto flex w-[840px]";

const expandButtonClasses =
  "cursor-pointer rounded-300 p-200 text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-600";
