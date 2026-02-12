"use client";

import AppRouteErrorFallback from "@/components/common/AppRouteErrorFallback/AppRouteErrorFallback";

type SettingsErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function SettingsError({ error, reset }: SettingsErrorProps) {
  return <AppRouteErrorFallback error={error} action={reset} />;
}
