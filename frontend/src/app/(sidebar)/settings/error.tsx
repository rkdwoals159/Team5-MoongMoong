"use client";

import AppRouteErrorFallback from "@/components/common/AppRouteErrorFallback/AppRouteErrorFallback";
import type { SettingsErrorProps } from "@/app/(sidebar)/settings/types";

export default function SettingsError({ error, reset }: SettingsErrorProps) {
  return <AppRouteErrorFallback error={error} action={reset} />;
}
