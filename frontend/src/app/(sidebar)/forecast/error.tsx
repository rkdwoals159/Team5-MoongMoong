"use client";

import AppRouteErrorFallback from "@/components/common/AppRouteErrorFallback/AppRouteErrorFallback";
import type { ForecastErrorProps } from "@/app/(sidebar)/forecast/_types";

export default function ForecastError({ error, reset }: ForecastErrorProps) {
  return <AppRouteErrorFallback error={error} action={reset} />;
}
