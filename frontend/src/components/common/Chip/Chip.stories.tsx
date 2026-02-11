import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import Chip from "./Chip";
import type { ChipMajorColor } from "./chip.type";

const meta = {
  title: "Common/Chip",
  component: Chip,
  args: {
    label: "미용",
    level: "major",
    color: "green",
    price: 50000,
  },
} satisfies Meta<typeof Chip>;

export default meta;

type Story = StoryObj<typeof Chip>;

export const MajorWithPrice: Story = {};

export const MajorWithoutPrice: Story = {
  args: {
    price: undefined,
  },
};

export const Minor: Story = {
  args: {
    label: "진료비",
    level: "minor",
    color: "none",
    price: undefined,
  },
};

const majorColors: ChipMajorColor[] = [
  "green",
  "purple",
  "blue",
  "red",
  "turquoise",
  "orange",
  "yellow",
  "gray",
];

export const MajorColors: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      {majorColors.map((color) => (
        <Chip key={color} label={color} level="major" color={color} />
      ))}
    </div>
  ),
};

export const MinorExamples: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      {["진료비", "예방접종", "약/처방", "검사비", "수술/입원", "기타 의료비"].map((label) => (
        <Chip key={label} label={label} level="minor" />
      ))}
    </div>
  ),
};
