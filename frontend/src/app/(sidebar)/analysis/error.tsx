"use client";

import AppRouteErrorFallback from "@/components/common/AppRouteErrorFallback/AppRouteErrorFallback";

type AnalysisErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function AnalysisError({ error, reset }: AnalysisErrorProps) {
  return <AppRouteErrorFallback error={error} action={reset} />;
}
