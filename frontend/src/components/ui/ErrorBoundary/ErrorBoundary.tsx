"use client";

import { Component, ErrorInfo, Fragment } from "react";
import DefaultErrorFallback from "./DefaultErrorFallback";
import type { ErrorBoundaryProps, ErrorBoundaryState } from "./errorBoundary.type";
import { isDifferentArray } from "@/utils/isDifferentArray";

const initialState: ErrorBoundaryState = { error: null, retryKey: 0, retryAttempts: 0 };

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = initialState;
  }

  // 렌더 단계에서 에러가 발생했을 때
  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { error };
  }

  // 에러 발생 시 호출
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.props.onError?.(error, errorInfo);
  }

  // 에러 리셋
  resetErrorBoundary = () => {
    this.props.onReset?.();
    this.setState((prev) => ({
      error: null,
      retryKey: prev.retryKey + 1,
      retryAttempts: prev.retryAttempts + 1,
    }));
  };

  componentDidUpdate(prevProps: ErrorBoundaryProps, prevState: ErrorBoundaryState) {
    // 에러에서 복구되었으면 (prev error 가 null 이 아니고 현재 error 가 null 이면) 연속 재시도 횟수 초기화
    if (prevState.error !== null && this.state.error === null) {
      this.setState({ retryAttempts: 0 });
      return;
    }

    if (this.state.error === null) return;
    if (prevState.error === null) return;

    // resetKeys가 변경되었을 때 에러 리셋 (외부 요인에 의한 복구이므로 retryAttempts도 초기화)
    if (isDifferentArray(prevProps.resetKeys, this.props.resetKeys)) {
      this.props.onReset?.();
      this.setState((prev) => ({
        error: null,
        retryKey: prev.retryKey + 1,
        retryAttempts: 0,
      }));
    }
  }

  render() {
    const { children, FallbackComponent, fallback, message } = this.props;
    const { error, retryKey, retryAttempts } = this.state;

    if (error !== null) {
      // 에러 접근 가능한 fallback 컴포넌트
      if (FallbackComponent) {
        return <FallbackComponent error={error} resetErrorBoundary={this.resetErrorBoundary} />;
      }

      // 정적 React Node
      if (fallback !== undefined) {
        return fallback;
      }

      // 기본 fallback 컴포넌트
      return (
        <DefaultErrorFallback
          message={message}
          onReset={this.resetErrorBoundary}
          refreshOnReset={this.props.refreshOnReset}
          retryAttempts={retryAttempts}
        />
      );
    }

    return <Fragment key={retryKey}>{children}</Fragment>;
  }
}

export default ErrorBoundary;
