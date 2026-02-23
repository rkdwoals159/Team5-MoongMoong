"use client";

import AppRouteErrorFallback from "@/components/common/AppRouteErrorFallback/AppRouteErrorFallback";
import type { FamilyErrorProps } from "@/app/(sidebar)/family/_types";

export default function FamilyError({ error, reset }: FamilyErrorProps) {
  return <AppRouteErrorFallback error={error} action={reset} />;
}
