import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import Image from "./Image";

const SAMPLE_IMAGE = "/images/img_dog_sample.png";

const meta = {
  title: "Common/Image",
  component: Image,
  args: {
    src: SAMPLE_IMAGE,
    alt: "프로필 이미지",
    width: 210,
    height: 210,
    isHoverable: true,
    overlayText: "강아지 이미지 변경",
  },
  argTypes: {
    onImageChange: { action: "onImageChange" },
  },
} satisfies Meta<typeof Image>;

export default meta;

type Story = StoryObj<typeof Image>;

export const Default: Story = {};

export const NoHover: Story = {
  args: {
    isHoverable: false,
  },
};
