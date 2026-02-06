import { ReactNode } from "react";

export type ErrorBoundaryProps = {
  children: ReactNode;
  fallback?: ReactNode;
  message?: string;
};

export type ErrorBoundaryState = {
  hasError: boolean;
  resetKey: number;
};
