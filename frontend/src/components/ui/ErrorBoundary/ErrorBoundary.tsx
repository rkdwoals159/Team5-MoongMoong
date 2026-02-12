"use client";

import { Component, ErrorInfo } from "react";
import DefaultErrorFallback from "./DefaultErrorFallback";
import { ErrorBoundaryProps, ErrorBoundaryState, FallbackProps } from "./ErrorBoundary.type";
import { isDifferentArray } from "@/utils/isDifferentArray";

const initialState: ErrorBoundaryState = { error: null };

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = initialState;
  }

  // 렌더 단계에서 에러가 발생했을 때
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  // 에러 발생 시 호출
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.props.onError?.(error, errorInfo);
  }

  // 에러 리셋
  resetErrorBoundary = () => {
    this.props.onReset?.();
    this.setState(initialState);
  };

  // resetKeys가 변경되었을 때 에러 리셋
  componentDidUpdate(prevProps: ErrorBoundaryProps, prevState: ErrorBoundaryState) {
    if (this.state.error === null) return;
    if (prevState.error === null) return;

    if (isDifferentArray(prevProps.resetKeys, this.props.resetKeys)) {
      this.resetErrorBoundary();
    }
  }

  render() {
    const { children, fallbackRender, fallback, message } = this.props;
    const { error } = this.state;

    if (error !== null) {
      const props: FallbackProps = {
        error,
        resetErrorBoundary: this.resetErrorBoundary,
      };

      if (typeof fallbackRender === "function") {
        return fallbackRender(props);
      }

      if (fallback !== undefined) {
        return fallback;
      }

      return (
        <DefaultErrorFallback
          message={message}
          onReset={this.resetErrorBoundary}
          refreshOnReset={this.props.refreshOnReset}
        />
      );
    }

    return children;
  }
}

export default ErrorBoundary;
