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
    number: 1,
    hasCancelIcon: true,
  },
};

export const SelectedOrder: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      {[1, 2, 3, 4, 5, 6].map((number) => (
        <FilterChip
          key={number}
          label={`선택 ${number}`}
          number={number}
          colorIndicator
          hasCancelIcon
        />
      ))}
    </div>
  ),
};
