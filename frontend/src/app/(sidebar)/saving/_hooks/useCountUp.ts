"use client";

import { useEffect, useState } from "react";
import type { UseCountUpOptions } from "@/app/(sidebar)/saving/_types";

/**
 * 숫자를 0에서 목표값까지 애니메이션하는 훅
 * @param target - 목표 숫자
 * @param options.duration - 애니메이션 지속 시간 (기본값: 800ms)
 * @param options.disabled - true면 애니메이션 없이 즉시 목표값 반환
 */
export function useCountUp(target: number, options: UseCountUpOptions = {}) {
  const { duration = 800, disabled = false } = options;
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (disabled || target === 0) {
      return;
    }

    let frameId = 0;
    let startedAt: number | null = null;

    const animate = (timestamp: number) => {
      if (startedAt === null) {
        startedAt = timestamp;
      }

      const progress = Math.min((timestamp - startedAt) / duration, 1);
      const easedProgress = 1 - (1 - progress) ** 3; // easeOutCubic
      setDisplayValue(Math.round(target * easedProgress));

      if (progress < 1) {
        frameId = window.requestAnimationFrame(animate);
      }
    };

    frameId = window.requestAnimationFrame(animate);

    return () => window.cancelAnimationFrame(frameId);
  }, [target, duration, disabled]);

  // disabled면 target 직접 반환, 아니면 애니메이션 값 반환
  return disabled ? target : displayValue;
}
