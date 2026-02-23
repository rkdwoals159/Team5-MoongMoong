"use client";

import AppRouteErrorFallback from "@/components/common/AppRouteErrorFallback/AppRouteErrorFallback";
import type { AnalysisErrorProps } from "@/app/(sidebar)/analysis/_types/componentPropsType.type";

export default function AnalysisError({ error, reset }: AnalysisErrorProps) {
  return <AppRouteErrorFallback error={error} action={reset} />;
}
