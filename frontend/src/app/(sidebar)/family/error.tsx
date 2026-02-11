"use client";

import AppRouteErrorFallback from "@/components/common/AppRouteErrorFallback/AppRouteErrorFallback";

type FamilyErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function FamilyError({ error, reset }: FamilyErrorProps) {
  return <AppRouteErrorFallback error={error} action={reset} />;
}
