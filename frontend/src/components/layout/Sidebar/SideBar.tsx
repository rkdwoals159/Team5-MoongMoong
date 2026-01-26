import Logo from "@/components/ui/Logo/Logo";
import AnalysisHeavyIcon from "@/assets/icons/sidebar/ic_analysis_heavy.svg";
import AnalysisLightIcon from "@/assets/icons/sidebar/ic_analysis_light.svg";
import BankIcon from "@/assets/icons/sidebar/ic_bank_light.svg";
import BankHeavyIcon from "@/assets/icons/sidebar/ic_bank_heavy.svg";
import CalendarIcon from "@/assets/icons/sidebar/ic_calendar_light.svg";
import CalendarHeavyIcon from "@/assets/icons/sidebar/ic_calendar_heavy.svg";
import DashHeavyIcon from "@/assets/icons/sidebar/ic_dash_heavy.svg";
import DashLightIcon from "@/assets/icons/sidebar/ic_dash_light.svg";
import FamilyIcon from "@/assets/icons/sidebar/ic_family_light.svg";
import FamilyHeavyIcon from "@/assets/icons/sidebar/ic_family_heavy.svg";
import MedicIcon from "@/assets/icons/sidebar/ic_medic_light.svg";
import MedicHeavyIcon from "@/assets/icons/sidebar/ic_medic_heavy.svg";
import SettingsIcon from "@/assets/icons/sidebar/ic_settings.svg";
import SettingsHeavyIcon from "@/assets/icons/sidebar/ic_settings_heavy.svg";
import SideBarNav from "@/components/ui/Nav/SidebarNav";

const primaryNav = [
  {
    label: "대시보드",
    href: "/dashboard",
    icon: DashLightIcon,
    selectedIcon: DashHeavyIcon,
  },
  {
    label: "달력",
    href: "/calendar",
    icon: CalendarIcon,
    selectedIcon: CalendarHeavyIcon,
  },
  {
    label: "반려동물 소비분석",
    href: "/analysis",
    icon: AnalysisLightIcon,
    selectedIcon: AnalysisHeavyIcon,
  },
  {
    label: "의료비 AI 예측",
    href: "/forecast",
    icon: MedicIcon,
    selectedIcon: MedicHeavyIcon,
  },
  {
    label: "저금통",
    href: "/saving",
    icon: BankIcon,
    selectedIcon: BankHeavyIcon,
  },
];

const secondaryNav = [
  {
    label: "가족 관리",
    href: "/family",
    icon: FamilyIcon,
    selectedIcon: FamilyHeavyIcon,
  },
  {
    label: "설정",
    href: "/settings",
    icon: SettingsIcon,
    selectedIcon: SettingsHeavyIcon,
  },
];

export default function Sidebar() {
  return (
    <aside className="sticky top-0 flex h-screen w-[239px] flex-col bg-[var(--color-gray-30)] text-[var(--color-gray-600)]">
      <div className="px-[30px] pt-[30px]">
        <div className="flex h-[50px] items-center">
          <Logo
            href="/dashboard"
            ariaLabel="메인 대시보드 페이지로 이동"
            imageClassName="h-5 w-[90px]"
          />
        </div>
      </div>

      <nav className="flex flex-col gap-5 px-[18px] pt-[60px]">
        <SideBarNav items={primaryNav} />
      </nav>

      <div className="mt-auto px-[18px] pb-6">
        <div className="flex flex-col gap-3">
          <SideBarNav items={secondaryNav} />
        </div>
      </div>
    </aside>
  );
}
