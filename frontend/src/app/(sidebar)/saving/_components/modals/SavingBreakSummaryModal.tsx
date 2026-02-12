"use client";

import { useEffect, useRef, useState } from "react";
import Button from "@/components/common/Button/Button";
import type { SavingBreakSummaryModalProps } from "@/app/(sidebar)/saving/_types";
import { useCountUp } from "@/app/(sidebar)/saving/_hooks/useCountUp";
import { ANIMATION_DELAY } from "@/app/(sidebar)/saving/_constants";
import ConfettiEffect from "@/components/common/ConfettiEffect/ConfettiEffect";

export default function SavingBreakSummaryModal({
  summary,
  onRefresh,
}: SavingBreakSummaryModalProps) {
  const [reduceMotion, setReduceMotion] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const refreshTimeoutRef = useRef<number | null>(null);
  const isMountedRef = useRef(true);

  const displayDays = useCountUp(summary?.days ?? 0, { disabled: reduceMotion });

  useEffect(() => {
    if (typeof window === "undefined") return;

    // 접근성을 위한 모션 감소 감지 (motion-reduce)
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotionPreference = () => setReduceMotion(mediaQuery.matches);

    updateMotionPreference();
    mediaQuery.addEventListener("change", updateMotionPreference);
    return () => mediaQuery.removeEventListener("change", updateMotionPreference);
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (refreshTimeoutRef.current !== null) {
        window.clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, []);

  if (!summary) return null;

  const handleRefreshClick = () => {
    if (isClosing) return;

    if (reduceMotion) {
      onRefresh();
      return;
    }

    setIsClosing(true);
    refreshTimeoutRef.current = window.setTimeout(() => {
      if (isMountedRef.current) {
        onRefresh();
      }
    }, ANIMATION_DELAY.CLOSE);
  };

  return (
    <section
      className={`fixed inset-0 z-50 flex items-center justify-center overscroll-contain bg-[rgba(0,0,0,0.71)] px-500 ${
        reduceMotion ? "" : isClosing ? "saving-break-overlay-out" : "saving-break-overlay-in"
      }`}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="저금통 깨기 완료"
        className={`relative z-10 w-full max-w-[420px] rounded-500 bg-white px-700 pt-800 pb-700 shadow-[0px_4px_40px_0px_rgba(26,31,39,0.25)] ${
          reduceMotion ? "" : isClosing ? "saving-break-panel-out" : "saving-break-panel-in"
        }`}
        tabIndex={-1}
      >
        {!reduceMotion && <ConfettiEffect count={summary.days} />}

        <h2
          className={`typo-title-m-bold text-center text-gray-800 ${
            reduceMotion ? "" : "saving-break-stagger-in"
          }`}
          style={reduceMotion ? undefined : { animationDelay: `${ANIMATION_DELAY.TITLE}ms` }}
        >
          저금통 달성 축하해요!
        </h2>
        <p
          className={`mt-400 typo-body-l-medium text-center text-gray-800 ${
            reduceMotion ? "" : "saving-break-stagger-in"
          }`}
          style={reduceMotion ? undefined : { animationDelay: `${ANIMATION_DELAY.SUBTITLE}ms` }}
        >
          총 <span className="typo-body-l-bold">{displayDays}일</span> 동안 저금했어요.
        </p>
        <p
          className={`mt-300 typo-body-m-medium text-center text-gray-400 ${
            reduceMotion ? "" : "saving-break-stagger-in"
          }`}
          style={reduceMotion ? undefined : { animationDelay: `${ANIMATION_DELAY.MESSAGE}ms` }}
        >
          {summary.message}
        </p>
        <div
          className={reduceMotion ? "" : "saving-break-stagger-in"}
          style={reduceMotion ? undefined : { animationDelay: `${ANIMATION_DELAY.CTA}ms` }}
        >
          <Button
            variant="primary"
            size="large"
            fullWidth
            className={`mt-700 ${reduceMotion ? "" : "saving-break-cta-pulse-once"}`}
            isDisabled={isClosing}
            onClick={handleRefreshClick}
          >
            저금통 다시 생성하기
          </Button>
        </div>
      </div>
    </section>
  );
}
