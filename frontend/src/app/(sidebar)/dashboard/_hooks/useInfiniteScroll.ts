import { useEffect, useRef } from "react";

/**
 * Intersection Observer 기반 무한 스크롤 훅
 *
 * sentinelRef를 스크롤 컨테이너 하단에 부착하면,
 * sentinel이 뷰포트에 진입할 때 onLoadMore를 호출한다.
 */
export function useInfiniteScroll({
  hasNext,
  isLoading,
  onLoadMore,
}: {
  hasNext: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
}) {
  // 1. sentinelRef: 무한 스크롤 컨테이너 하단에 부착할 참조 요소
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 2. sentinelRef.current가 존재하는지 확인
    const el = sentinelRef.current;
    // 3. 아직 마운트 안 됐으면 중단
    if (!el) return;

    // 4. IntersectionObserver 설정
    const observer = new IntersectionObserver(
      ([entry]) => {
        // 5. 뷰포트에 진입하고 있고, 더 불러올 데이터가 있으며, 로딩 중이 아니면 더 불러오기
        if (entry?.isIntersecting && hasNext && !isLoading) {
          onLoadMore();
        }
      },
      // 6. threshold: 뷰포트에 진입하고 있는지 확인하는 임계값 (0.1 = 10%)
      // 0.1은 뷰포트에 10% 진입하면 더 불러오기 시작
      { threshold: 0.1 },
    );

    // 7. sentinelRef를 관찰 대상에 추가
    observer.observe(el);

    // 8. 언마운트 시 관찰 중단
    return () => observer.disconnect();
  }, [hasNext, isLoading, onLoadMore]);

  return { sentinelRef };
}
