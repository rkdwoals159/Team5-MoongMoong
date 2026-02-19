"use client";

import AppRouteErrorFallback from "@/components/common/AppRouteErrorFallback/AppRouteErrorFallback";
import type { CalendarErrorProps } from "@/app/(sidebar)/calendar/_types";

export default function CalendarError({ error, reset }: CalendarErrorProps) {
  return <AppRouteErrorFallback error={error} action={reset} />;
}
