import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import Checkbox from "./CheckBox";

const meta = {
  title: "Common/Checkbox",
  component: Checkbox,
} satisfies Meta<typeof Checkbox>;

export default meta;

type Story = StoryObj<typeof Checkbox>;

export const States: Story = {
  render: () => {
    const [checked, setChecked] = useState(false);

    return (
      <div className="flex flex-col gap-4">
        <Checkbox
          isChecked={checked}
          onChange={() => setChecked((v) => !v)}
          aria-label="기본 체크박스"
        />
        <Checkbox disabled />
        <Checkbox isChecked />
      </div>
    );
  },
};
