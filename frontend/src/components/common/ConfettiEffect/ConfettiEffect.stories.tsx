import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import ConfettiEffect from "./ConfettiEffect";

const meta = {
  title: "Common/ConfettiEffect",
  component: ConfettiEffect,
  args: {
    count: 30,
  },
  argTypes: {
    count: {
      control: { type: "range", min: 1, max: 100, step: 1 },
      description: "꽃가루 개수 결정에 사용되는 값",
    },
  },
  decorators: [
    (Story) => (
      <div className="relative h-[300px] w-full rounded-lg bg-gray-100">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ConfettiEffect>;

export default meta;

type Story = StoryObj<typeof ConfettiEffect>;

export const Default: Story = {};

export const Few: Story = {
  args: {
    count: 10,
  },
};

export const Many: Story = {
  args: {
    count: 60,
  },
};

export const InCard: Story = {
  args: {
    count: 30,
  },
  render: (args) => (
    <div className="relative mx-auto w-[420px] rounded-500 bg-white px-700 pt-800 pb-700 shadow-lg">
      <ConfettiEffect {...args} />
      <h2 className="typo-title-m-bold text-center text-gray-800">축하합니다!</h2>
      <p className="mt-400 typo-body-l-medium text-center text-gray-600">목표를 달성했어요.</p>
    </div>
  ),
};
