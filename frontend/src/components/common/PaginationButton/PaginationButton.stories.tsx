import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import PaginationButton from "./PaginationButton";

const meta = {
  title: "Common/PaginationButton",
  component: PaginationButton,
} satisfies Meta<typeof PaginationButton>;

export default meta;

type Story = StoryObj<typeof PaginationButton>;

export const Pair: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <PaginationButton direction="left" aria-label="이전 페이지" />
      <PaginationButton direction="right" aria-label="다음 페이지" />
    </div>
  ),
};

export const PaginationState: Story = {
  render: () => {
    const totalPages = 10;
    const [page, setPage] = useState(1);
    const isFirst = page <= 1;
    const isLast = page >= totalPages;

    return (
      <div className="flex items-center gap-4">
        <PaginationButton
          direction="left"
          aria-label="이전 페이지"
          isDisabled={isFirst}
          onClick={() => setPage((prev) => Math.max(1, prev - 1))}
        />
        <span className="typo-body-m-medium text-[var(--color-text-sub)]">
          {page} / {totalPages}
        </span>
        <PaginationButton
          direction="right"
          aria-label="다음 페이지"
          isDisabled={isLast}
          onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
        />
      </div>
    );
  },
};
