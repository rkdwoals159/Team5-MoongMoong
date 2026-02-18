"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import type { SettingsTab, NavItem } from "@/app/(sidebar)/settings/types";
import { cn } from "@/utils/style";

const NAV_ITEMS: NavItem[] = [
  { id: "account", label: "계정 관리" },
  { id: "dog", label: "반려견 관리" },
];

export default function SettingsTabs() {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const currentTabParam = searchParams.get("tab");
  const currentTab: SettingsTab = currentTabParam === "dog" ? "dog" : "account";

  return (
    <nav className="flex w-full flex-col gap-300" aria-label="설정 메뉴">
      {NAV_ITEMS.map((item) => {
        const isActive = item.id === currentTab;
        const className = cn(baseItemClasses, isActive ? activeItemClasses : inactiveItemClasses);

        return (
          <Link
            key={item.id}
            href={{
              pathname,
              query: { tab: item.id },
            }}
            replace
            className={className}
            aria-current={isActive ? "page" : undefined}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

const baseItemClasses = "flex items-center rounded-400 px-400 py-300 transition-colors";

const activeItemClasses = "bg-white-100 text-gray-700 typo-body-l-bold";

const inactiveItemClasses = "typo-body-l-medium text-gray-600 hover:bg-gray-100";
