"use client";
import AppRouteErrorFallback from "@/components/common/AppRouteErrorFallback/AppRouteErrorFallback";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <AppRouteErrorFallback error={error} action={reset} />;
}
