import { useCallback, useState } from "react";
import type { MainCategoryFilter } from "@/api/types/dashboardApi.type";

/**
 * mainCategory 필터 상태 관리 훅
 *
 * API 스키마가 한국어 카테고리명을 그대로 받으므로 별도 변환 없이 상태만 관리한다.
 */
export function useMainCategoryFilter() {
  const [mainCategoryFilter, setMainCategoryFilter] = useState<MainCategoryFilter | null>(null);

  const handleFilterChange = useCallback((category: MainCategoryFilter | null) => {
    setMainCategoryFilter(category ?? null);
  }, []);

  return { mainCategoryFilter, handleFilterChange };
}
