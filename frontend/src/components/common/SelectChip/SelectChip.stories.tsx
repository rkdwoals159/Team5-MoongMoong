import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";

import SelectChip from "./SelectChip";

const meta = {
  title: "Common/SelectChip",
  component: SelectChip,
  args: {
    label: "피부",
  },
} satisfies Meta<typeof SelectChip>;

export default meta;

type Story = StoryObj<typeof SelectChip>;

export const Default: Story = {};

export const Labels: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      {["피부", "호흡기", "소화기", "신경", "관절"].map((label) => (
        <SelectChip key={label} label={label} />
      ))}
    </div>
  ),
};

export const Selected: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <SelectChip label="피부" data-selected="true" />
    </div>
  ),
};

export const OnSelect: Story = {
  render: () => {
    const [selectedCode, setSelectedCode] = useState<string | null>(null);
    const items = [
      { label: "피부", code: "DER" },
      { label: "호흡기", code: "RES" },
    ];

    return (
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap gap-3">
          {items.map(({ label, code }) => (
            <SelectChip
              key={code}
              label={label}
              code={code}
              data-selected={selectedCode === code ? "true" : undefined}
              onSelect={(nextCode) => setSelectedCode(nextCode)}
            />
          ))}
        </div>
        <p className="typo-body-m-medium text-gray-700">선택된 코드: {selectedCode ?? "없음"}</p>
      </div>
    );
  },
};
