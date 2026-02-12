import type { ComponentType, SVGProps } from "react";

type SidebarNavIcon = ComponentType<SVGProps<SVGSVGElement>>;

export type SidebarNavItem = {
  label: string;
  href: string;
  icon: SidebarNavIcon;
  selectedIcon?: SidebarNavIcon;
};
