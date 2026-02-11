"use client";

import AppRouteErrorFallback from "@/components/common/AppRouteErrorFallback/AppRouteErrorFallback";

type ForecastErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ForecastError({ error, reset }: ForecastErrorProps) {
  return <AppRouteErrorFallback error={error} action={reset} />;
}
