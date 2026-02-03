"use client";

import { useState } from "react";
import Button from "@/components/common/Button/Button";
import SavingModal from "@/app/(sidebar)/saving/_components/piggybank/SavingModal";

export default function SavingButton({
  handleDrop,
}: {
  handleDrop: (name: string, amount: number, createdAt: string, targetAmount: number) => void;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <>
      <Button
        variant="primary"
        size="large"
        className="w-1/3 mx-auto"
        onClick={() => setIsModalOpen(true)}
      >
        저금하기
      </Button>
      <SavingModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        handleDrop={handleDrop}
      />
    </>
  );
}
