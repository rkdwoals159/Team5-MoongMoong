"use client";

import { useId, useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import CloseIcon from "@/assets/icons/modal/ic_bell.svg";

import Modal from "./Modal";

const meta = {
  title: "Common/Modal",
  component: Modal,
  args: {
    open: false,
    showOverlayClose: false,
    contentClassName: "max-w-[480px]",
  },
} satisfies Meta<typeof Modal>;

export default meta;

type Story = StoryObj<typeof Modal>;

export const Default: Story = {
  render: (args) =>
    (() => {
      const [open, setOpen] = useState(false);
      const titleId = useId();

      return (
        <div className="flex items-start gap-600">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="rounded-250 border border-border-normal px-400 py-200 typo-body-m-medium text-text-base"
          >
            모달 열기
          </button>
          <Modal {...args} open={open}>
            <div className="flex items-center justify-between px-600 pt-600">
              <h2 id={titleId} className="typo-title-m-bold text-text-base">
                모달 타이틀
              </h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="닫기"
                className="flex size-[36px] items-center justify-center rounded-300 transition-colors cursor-pointer"
              >
                <CloseIcon className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
            <div className="px-600 pb-700 pt-400">
              <p className="typo-body-m-regular text-text-base">
                버튼을 클릭하면 모달이 열리고, 닫기 버튼을 누르면 닫힙니다.
              </p>
              <div className="mt-600 flex justify-end">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-250 border border-border-normal px-400 py-200 typo-body-m-medium text-text-base cursor-pointer"
                >
                  확인
                </button>
              </div>
            </div>
          </Modal>
        </div>
      );
    })(),
};
export const Basic: Story = {
  render: (args) =>
    (() => {
      const [open, setOpen] = useState(false);

      return (
        <div className="flex items-start gap-600">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="rounded-250 border border-border-normal px-400 py-200 typo-body-m-medium text-text-base"
          >
            모달 열기
          </button>
          <Modal {...args} open={open}>
            <div className="">
              <h2>모달 기본</h2>
            </div>
          </Modal>
        </div>
      );
    })(),
};
