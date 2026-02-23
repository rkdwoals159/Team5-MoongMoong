"use client";

import { useCallback, useState } from "react";
import type { ServerSortField, SortConfigItem, SortConfigV2 } from "@/api/types/dashboardApi.type";

// 기본 정렬 조건: spentAt 내림차순
const DEFAULT_SORT_CONFIG: SortConfigV2 = [{ field: "spentAt", order: "desc" }];

/** API 전달 순서 강제: spentAt → usage → cost */
const SORT_FIELD_ORDER: ServerSortField[] = ["spentAt", "usage", "cost"];

/**
 * 서버사이드 다중 정렬 상태 관리 훅
 *
 * - spentAt: 항상 포함, 방향 토글만 가능 (제거 불가)
 * - usage/cost: 미포함 → asc 추가 → desc → 제거 순환
 * - toSortParams(): API 전달용 ["spentAt,desc", "usage,asc"] 형태로 변환
 */
export function useServerSortConfig() {
  const [sortConfig, setSortConfig] = useState<SortConfigV2>(DEFAULT_SORT_CONFIG);

  const handleSort = useCallback((field: ServerSortField) => {
    setSortConfig((prev) => {
      // 1) spentAt 필드는 제거 불가, 방향만 토글
      if (field === "spentAt") {
        return prev.map((item) =>
          item.field === "spentAt"
            ? { ...item, order: item.order === "asc" ? ("desc" as const) : ("asc" as const) }
            : item,
        );
      }
      // 2) usage/cost 필드는 제거 가능, 없음 -> asc 추가 -> desc -> 제거 순환
      const existing = prev.find((item) => item.field === field);
      const withoutField = prev.filter((item) => item.field !== field);

      // 필드가 존재하지 않으면 asc 추가
      if (!existing) {
        return [...withoutField, { field, order: "asc" as const }];
      }
      // 필드가 존재하면 asc -> desc 변환
      if (existing.order === "asc") {
        return [...withoutField, { field, order: "desc" as const }];
      }

      // 필드가 존재하고 desc이면 제거
      return withoutField;
    });
  }, []);

  // API 전달 순서 강제: SORT_FIELD_ORDER 순서대로 정렬 조건 추출 (spentAt → usage → cost)
  /**
   * toSortParams 함수 동작 과정
   *
   * 1. SORT_FIELD_ORDER(= ['spentAt', 'usage', 'cost'])를 이용해
   *    각각의 필드에 대해 현재 sortConfig(정렬 배열)에 조건 객체가 들어있는지 찾는다.
   *
   * 2. find로 반환된 값 중 undefined가 아닌(= 실제로 존재하는 정렬 조건만) 원소만 남긴다.
   *
   * 3. 각 정렬 조건 객체를 `${item.field},${item.order}` 형태의 문자열로 변환한다.
   */
  const toSortParams = useCallback((): string[] => {
    return SORT_FIELD_ORDER.map((field) => sortConfig.find((item) => item.field === field))
      .filter((item): item is SortConfigItem => item !== undefined)
      .map((item) => `${item.field},${item.order}`);
  }, [sortConfig]);

  return { sortConfig, handleSort, toSortParams };
}
