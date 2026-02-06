"use client";

import { useRouter } from "next/navigation";
import Button from "@/components/common/Button/Button";

type DefaultErrorFallbackProps = {
  message?: string;
  onReset: () => void;
};

export default function DefaultErrorFallback({ message, onReset }: DefaultErrorFallbackProps) {
  const router = useRouter();

  const handleRetry = () => {
    router.refresh();
    onReset();
  };

  return (
    <div className="flex flex-col items-center justify-center gap-400 py-600">
      <p className="typo-body-l-medium text-text-sub">
        {message ?? "데이터를 불러오는데 실패했습니다."}
      </p>
      <Button variant="secondary" size="medium" onClick={handleRetry}>
        다시 시도하기
      </Button>
    </div>
  );
}
