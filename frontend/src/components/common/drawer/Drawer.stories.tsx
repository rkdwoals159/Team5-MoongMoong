import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import Drawer from "./Drawer";

const meta = {
  title: "Common/Drawer",
  component: Drawer,
} satisfies Meta<typeof Drawer>;

export default meta;

type Story = StoryObj<typeof Drawer>;

const navItems = [
  { id: "dashboard", label: "대시보드", href: "#dashboard" },
  { id: "calendar", label: "달력", href: "#calendar" },
  { id: "analysis", label: "소비분석", href: "#analysis" },
  { id: "medic", label: "의료비 예측", href: "#medic" },
  { id: "family", label: "가족 관리", href: "#family" },
];

export const Navigation: Story = {
  render: () => {
    const [activeId, setActiveId] = useState(navItems[0].id);

    return (
      <div className="flex flex-col gap-2 w-[240px]">
        {navItems.map((item) => (
          <Drawer
            key={item.id}
            href={item.href}
            urlMatch={activeId === item.id}
            onClick={(e) => {
              e.preventDefault();
              setActiveId(item.id);
            }}
          >
            {item.label}
          </Drawer>
        ))}
      </div>
    );
  },
};
