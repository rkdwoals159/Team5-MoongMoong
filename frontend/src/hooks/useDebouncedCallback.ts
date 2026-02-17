import { useCallback, useEffect, useRef } from "react";

/**
 * 디바운스가 적용된 콜백 훅.
 * fn이 delay(ms) 동안 추가 호출 없이 지나간 후에만 실행된다.
 *
 * @param fn - 실행할 함수
 * @param delay - 디바운스 지연 시간 (ms)
 * @returns 디바운스 적용된 함수
 */
export function useDebouncedCallback<Args extends unknown[]>(
  fn: (...args: Args) => void,
  delay: number,
): (...args: Args) => void {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fnRef = useRef(fn);

  useEffect(() => {
    fnRef.current = fn;
  }, [fn]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return useCallback(
    (...args: Args) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        timeoutRef.current = null;
        fnRef.current(...args);
      }, delay);
    },
    [delay],
  );
}
