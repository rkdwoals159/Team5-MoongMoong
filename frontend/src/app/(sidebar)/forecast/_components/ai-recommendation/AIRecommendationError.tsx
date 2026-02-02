"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class AIRecommendationError extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("AIRecommendation error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <section>
          <div className={containerClasses}>
            <div className={contentClasses}>
              <span className={messageClasses}>AI 의료비 예측 정보를 불러오지 못했습니다.</span>
              <button
                type="button"
                className={buttonClasses}
                onClick={() => this.setState({ hasError: false })}
              >
                다시 시도
              </button>
            </div>
          </div>
        </section>
      );
    }

    return this.props.children;
  }
}

export default AIRecommendationError;

const containerClasses = "flex items-center justify-center gap-500 p-600 rounded-500 bg-yellow-100";
const contentClasses = "flex flex-col items-center gap-400";
const messageClasses = "typo-body-l-regular text-text-base";
const buttonClasses =
  "typo-body-l-medium text-text-base bg-yellow-150 py-300 px-400 rounded-250 cursor-pointer border-none";
