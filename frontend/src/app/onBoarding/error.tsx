"use client";

import type { OnboardingRouteErrorProps } from "@/app/onBoarding/_types";
import AppRouteErrorFallback from "@/components/common/AppRouteErrorFallback/AppRouteErrorFallback";

/**
 * 온보딩 라우트에서 처리되지 않은 에러를 표시한다.
 */
export default function Error({ error, reset }: OnboardingRouteErrorProps) {
  return <AppRouteErrorFallback error={error} action={reset} />;
}
