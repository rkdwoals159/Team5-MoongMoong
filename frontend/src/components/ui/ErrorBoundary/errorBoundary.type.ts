import { ComponentType, ErrorInfo, ReactNode } from "react";

export type FallbackProps = {
  error: Error;
  resetErrorBoundary: () => void;
};

export type ErrorBoundaryProps = {
  children: ReactNode;
  fallback?: ReactNode;
  FallbackComponent?: ComponentType<FallbackProps>;
  message?: string;
  onError?: (error: Error, info: ErrorInfo) => void;
  onReset?: () => void;
  resetKeys?: unknown[];
};

export type ErrorBoundaryState = {
  error: Error | null;
  /** children remount를 위한 단조 증가 키 */
  retryKey: number;
  /** 연속 재시도 횟수 (복구 시 초기화) */
  retryAttempts: number;
};

export type DefaultErrorFallbackProps = {
  message?: string;
  onReset: () => void;
  retryAttempts: number;
};
