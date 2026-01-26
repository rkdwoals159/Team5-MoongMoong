import Drawer from "@/components/common/drawer/Drawer";
import type { SidebarNavItem } from "@/components/layout/Sidebar/SideBar.type";

export default function SidebarNav({ items }: { items: SidebarNavItem[] }) {
  return items.map(({ label, href, icon: Icon, selectedIcon }) => {
    const SelectedIcon = selectedIcon ?? Icon;
    return (
      <Drawer
        key={label}
        href={href}
        fullWidth
        className="text-[var(--color-gray-600)] hover:bg-[var(--color-gray-50)]"
        startIcon={<Icon className="h-6 w-6" aria-hidden="true" />}
        startIconSelected={<SelectedIcon className="h-6 w-6" aria-hidden="true" />}
      >
        {label}
      </Drawer>
    );
  });
}
