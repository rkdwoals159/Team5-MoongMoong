import { ErrorInfo, ReactNode } from "react";

export type FallbackProps = {
  error: Error;
  resetErrorBoundary: () => void;
};

export type ErrorBoundaryProps = {
  children: ReactNode;
  fallback?: ReactNode;
  fallbackRender?: (props: FallbackProps) => ReactNode;
  message?: string;
  onError?: (error: Error, info: ErrorInfo) => void;
  onReset?: () => void;
  resetKeys?: unknown[];
  /** true면 리셋 시 router.refresh()로 서버 리페치 (Server Component 감쌀 때 사용) */
  refreshOnReset?: boolean;
};

export type ErrorBoundaryState = {
  error: Error | null;
};
