"use client";

import { useRouter } from "next/navigation";
import Button from "@/components/common/Button/Button";

/**
 * 서버 컴포넌트에서 사용하는 다시 시도하기 버튼 컴포넌트
 */
const RetryButton = () => {
  const router = useRouter();

  const handleRetry = () => {
    router.refresh();
  };

  return (
    <Button variant="secondary" size="medium" onClick={handleRetry}>
      다시 시도하기
    </Button>
  );
};

export default RetryButton;
