import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import TextInput from "./TextInput";
import FileInput from "./FileInput";

const meta = {
  title: "Common/Input",
  component: TextInput,
  argTypes: {
    showCounter: { control: "boolean" },
    isDisabled: { control: "boolean" },
    maxLength: { control: "number" },
  },
} satisfies Meta<typeof TextInput>;

export default meta;

type TextStory = StoryObj<typeof TextInput>;
type FileStory = StoryObj<typeof FileInput>;

export const TextInputStory: TextStory = {
  render: () => {
    const [value, setValue] = useState("");
    const errorMessage =
      value.length === 0
        ? "필수입력항목입니다"
        : value.length === 1
          ? "최소 2글자 이상 입력해주세요"
          : "";

    return (
      <div className="flex flex-col gap-3 max-w-md">
        <TextInput
          value={value}
          onChange={(e) => setValue(e.target.value)}
          showError={errorMessage.length > 0}
          errorMessage={errorMessage || undefined}
        />
      </div>
    );
  },
};

export const FileInputStory: FileStory = {
  render: () => {
    const [file, setFile] = useState<File>();

    return (
      <div className="flex flex-col gap-3 max-w-md">
        <FileInput
          type="file"
          filePlaceholder="강아지 진료비 영수증을 업로드해주세요."
          fileName={file?.name || undefined}
          onClear={() => setFile(undefined)}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              setFile(file);
            }
          }}
        />
      </div>
    );
  },
};
