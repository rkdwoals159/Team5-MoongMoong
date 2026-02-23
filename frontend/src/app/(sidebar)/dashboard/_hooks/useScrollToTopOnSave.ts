import { useCallback } from "react";
import type { RefObject } from "react";

/**
 * 저장 성공 시 스크롤 컨테이너를 맨 위로 부드럽게 올린 뒤 onSaveSuccess를 호출하는 콜백을 반환한다.
 * 무한 스크롤에서 맨 아래에서 저장 시 refetch 후 sentinel이 계속 보여 loadMore가 연쇄 호출되는 것을 방지하기 위함.
 */
export function useScrollToTopOnSave(
  scrollContainerRef: RefObject<HTMLDivElement | null>,
  onSaveSuccess: () => void,
): () => void {
  return useCallback(() => {
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    onSaveSuccess();
  }, [scrollContainerRef, onSaveSuccess]);
}
