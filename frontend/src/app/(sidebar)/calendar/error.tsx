"use client";

import AppRouteErrorFallback from "@/components/common/AppRouteErrorFallback/AppRouteErrorFallback";

type CalendarErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function CalendarError({ error, reset }: CalendarErrorProps) {
  return <AppRouteErrorFallback error={error} action={reset} />;
}
