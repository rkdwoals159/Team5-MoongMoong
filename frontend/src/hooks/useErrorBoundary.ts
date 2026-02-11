"use client";
import { useState, useCallback } from "react";

/**
 * 이벤트 핸들러나 비동기 코드에서 발생한 에러를 가장 가까운 ErrorBoundary로 전달하는 훅.
 *
 * ErrorBoundary는 렌더링 중 throw만 잡으므로,
 * 이 훅은 에러를 state에 저장 → 리렌더 → 렌더링 중 throw 하여
 * ErrorBoundary가 잡을 수 있게 한다.
 */
export function useErrorBoundary() {
  const [error, setError] = useState<Error | null>(null);

  if (error != null) {
    throw error;
  }

  const showErrorBoundary = useCallback((error: Error) => {
    setError(error);
  }, []);

  return { showErrorBoundary };
}
