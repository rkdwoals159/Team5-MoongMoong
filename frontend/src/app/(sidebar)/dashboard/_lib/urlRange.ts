"use client";

import { useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

/**
 * URL 쿼리(startDate, endDate)로 기간을 설정하는 훅
 */
export function useSetRangeToUrl() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  return useCallback(
    (start: string, end: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("startDate", start);
      params.set("endDate", end);
      router.replace(`${pathname}?${params.toString()}`);
    },
    [searchParams, router, pathname],
  );
}
