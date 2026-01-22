import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import Button from "./Button";

const meta = {
  title: "Common/Button",
  component: Button,
  args: {
    children: "버튼",
    variant: "primary",
    size: "medium",
  },
  argTypes: {
    variant: { control: "radio", options: ["primary", "secondary"] },
    size: {
      control: "select",
      options: ["xsmall", "small", "medium", "large", "xlarge", "xxlarge"],
    },
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof Button>;

const ArrowIcon = (
  <svg viewBox="0 0 20 20" aria-hidden="true">
    <path d="M7.5 5.5l5 4.5-5 4.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
  </svg>
);

export const Primary: Story = {};

export const Secondary: Story = {
  args: {
    variant: "secondary",
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Button size="xsmall">xsmall</Button>
      <Button size="small">small</Button>
      <Button size="medium">medium</Button>
      <Button size="large">large</Button>
      <Button size="xlarge">xlarge</Button>
      <Button size="xxlarge">xxlarge</Button>
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Button>default</Button>
      <Button isDisabled>disabled</Button>
    </div>
  ),
};

export const WithIcons: Story = {
  args: {
    startIcon: ArrowIcon,
    endIcon: ArrowIcon,
    children: "아이콘 버튼",
  },
};

export const FullWidth: Story = {
  args: {
    fullWidth: true,
    children: "Full width",
  },
  render: (args) => (
    <div className="w-full max-w-sm">
      <Button {...args} />
    </div>
  ),
};
