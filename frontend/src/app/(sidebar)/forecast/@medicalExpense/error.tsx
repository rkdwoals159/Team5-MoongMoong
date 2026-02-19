"use client";

import { useEffect } from "react";
import Button from "@/components/common/Button/Button";
import MedicalExpenseHeader from "@/app/(sidebar)/forecast/_components/medical-expense/MedicalExpenseHeader";

export default function MedicalExpenseError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("MedicalExpense error:", error);
  }, [error]);

  return (
    <section>
      <MedicalExpenseHeader />
      <div className={containerClasses}>
        <div className={errorContainerClasses}>
          <p className={errorMessageClasses}>{error.message}</p>
          <Button variant="secondary" size="medium" onClick={reset}>
            다시 시도하기
          </Button>
        </div>
      </div>
    </section>
  );
}

const containerClasses =
  "flex flex-col gap-600 rounded-500 border border-gray-100 bg-white-100 p-600 overflow-hidden w-full mb-[150px] mt-[20px]";
const errorContainerClasses = "flex flex-col items-center justify-center gap-400 py-600";
const errorMessageClasses = "typo-body-l-medium text-text-sub";
