import { useRef, useState, useEffect, useLayoutEffect } from "react";
import { SCROLL_THRESHOLD, OBSERVER_THRESHOLD } from "@/constants";

export function useHorizontalScroll(storageKey?: string) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const [isAtStart, setIsAtStart] = useState(() => {
    if (typeof window === "undefined" || !storageKey) return true;
    const saved = sessionStorage.getItem(storageKey);
    return !saved || Number(saved) <= SCROLL_THRESHOLD;
  });
  const [isAtEnd, setIsAtEnd] = useState(false);

  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el || !storageKey) return;
    const saved = sessionStorage.getItem(storageKey);
    if (saved) {
      el.scrollLeft = Number(saved);
    }
  }, [storageKey]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsAtEnd(entry?.isIntersecting ?? false),
      { threshold: OBSERVER_THRESHOLD, root: scrollRef.current },
    );
    if (endRef.current) observer.observe(endRef.current);
    return () => observer.disconnect();
  }, []);

  const handleScroll = () => {
    if (scrollRef.current) {
      const scrollLeft = scrollRef.current.scrollLeft;
      setIsAtStart(scrollLeft <= SCROLL_THRESHOLD);
      if (storageKey) {
        sessionStorage.setItem(storageKey, String(scrollLeft));
      }
    }
  };

  return { scrollRef, endRef, isAtStart, isAtEnd, handleScroll };
}
