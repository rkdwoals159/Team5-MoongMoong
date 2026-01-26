import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import Button from "@/components/common/Button/Button";
import Toast from "./Toast";
import ToastProvider, { useToast } from "./ToastProvider";

const meta = {
  title: "UI/Toast",
  component: Toast,
  args: {
    variant: "success",
    message: "반려견 정보 저장에 문제가 생겼어요.",
  },
} satisfies Meta<typeof Toast>;

export default meta;

type Story = StoryObj<typeof Toast>;

export const Success: Story = {};

export const Error: Story = {
  args: {
    variant: "error",
  },
};

export const InContainer: Story = {
  render: (args) => (
    <div className="w-full max-w-[640px] space-y-3">
      <Toast {...args} />
      <Toast {...args} variant="error" />
    </div>
  ),
};

const ToastButtons = () => {
  const { showToast } = useToast();

  return (
    <div className="flex flex-wrap gap-3">
      <Button
        onClick={() =>
          showToast({
            variant: "success",
            message: "저장이 완료됐어요.",
          })
        }
      >
        Success
      </Button>
      <Button
        onClick={() =>
          showToast({
            variant: "error",
            message: "반려견 정보 저장에 문제가 생겼어요.",
          })
        }
      >
        Error
      </Button>
    </div>
  );
};

export const WithProvider: Story = {
  render: () => (
    <ToastProvider>
      <div className="p-[var(--spacing-500)]">
        <ToastButtons />
      </div>
    </ToastProvider>
  ),
};
