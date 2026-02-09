import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import FilterChip from "./FilterChip";

const meta = {
  title: "Common/FilterChip",
  component: FilterChip,
  args: {
    label: "혈액 질환",
  },
} satisfies Meta<typeof FilterChip>;

export default meta;

type Story = StoryObj<typeof FilterChip>;

export const Default: Story = {};

export const Selected: Story = {
  args: {
    colorIndicator: true,
    color: "var(--color-red-500)",
    hasCancelIcon: true,
  },
};

export const SelectedOrder: Story = {
  render: () => {
    const colors = [
      "var(--color-red-500)",
      "var(--color-yellow-500)",
      "var(--color-blue-500)",
      "var(--color-green-500)",
      "var(--color-purple-500)",
      "var(--color-pink-500)",
    ];
    return (
      <div className="flex flex-wrap gap-3">
        {colors.map((color, index) => (
          <FilterChip
            key={index}
            label={`선택 ${index + 1}`}
            color={color}
            colorIndicator
            hasCancelIcon
          />
        ))}
      </div>
    );
  },
};
