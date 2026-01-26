import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import RadioButton from "./RadioButton";

const meta = {
  title: "Common/RadioButton",
  component: RadioButton,
} satisfies Meta<typeof RadioButton>;

export default meta;

type Story = StoryObj<typeof RadioButton>;

export const States: Story = {
  render: () => {
    const [checked, setChecked] = useState(false);

    return (
      <div className="flex items-center gap-6">
        <RadioButton isChecked={checked} onChange={() => setChecked(true)} aria-label="선택" />
        <RadioButton isChecked={!checked} onChange={() => setChecked(false)} aria-label="미선택" />
      </div>
    );
  },
};
