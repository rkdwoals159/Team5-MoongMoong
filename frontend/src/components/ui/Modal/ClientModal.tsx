"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useOutsideClick } from "@/hooks/useOutsideClick";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { cn } from "@/utils/style";
import type { ClientModalProps } from "./clientModal.type";

export default function ClientModal({
  open,
  onClose,
  variant = "overlay",
  outsideClickRefs = [],
  ariaLabel,
  overlayClassName,
  contentClassName,
  children,
}: ClientModalProps) {
  const [shouldRender, setShouldRender] = useState(open);
  const [isClosing, setIsClosing] = useState(false);
  const [prevOpen, setPrevOpen] = useState(open);
  const contentRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setShouldRender(true);
      setIsClosing(false);
    } else if (shouldRender) {
      setIsClosing(true);
    }
  }

  // overlay 변형에서만 포커스 트랩 활성화
  useFocusTrap(contentRef, variant === "overlay" && shouldRender && !isClosing);

  // 모달이 열릴 때: 이전 포커스 저장 + 모달 콘텐츠에 포커스
  useEffect(() => {
    if (variant !== "overlay") return;
    if (open && shouldRender) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      contentRef.current?.focus();
    }
  }, [open, shouldRender, variant]);

  // 모달이 완전히 닫힌 후 (애니메이션 종료): 이전 포커스 복원
  useEffect(() => {
    if (variant !== "overlay") return;
    if (!shouldRender && previousFocusRef.current) {
      previousFocusRef.current.focus();
      previousFocusRef.current = null;
    }
  }, [shouldRender, variant]);

  const handleAnimationEnd = useCallback(
    (e: React.AnimationEvent) => {
      if (e.target !== e.currentTarget) return;
      if (isClosing) {
        setShouldRender(false);
        setIsClosing(false);
      }
    },
    [isClosing],
  );

  // ESC 키로 모달 닫기 (WAI-ARIA Dialog Pattern)
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
      }
    },
    [onClose],
  );

  useOutsideClick({
    isActive: variant === "dropdown" && shouldRender && !isClosing,
    refs: [...outsideClickRefs, contentRef],
    onOutside: onClose,
  });

  if (!shouldRender) return null;

  if (variant === "dropdown") {
    return (
      <div
        ref={contentRef}
        role="dialog"
        aria-label={ariaLabel}
        className={cn(isClosing ? "dropdown-out" : "dropdown-in", contentClassName ?? "")}
        onAnimationEnd={handleAnimationEnd}
      >
        {children}
      </div>
    );
  }

  return (
    <section
      className={cn(
        baseOverlayClasses,
        isClosing ? "modal-overlay-out" : "modal-overlay-in",
        overlayClassName ?? "",
      )}
    >
      <div className="absolute inset-0" onClick={onClose} />
      <div
        ref={contentRef}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        className={cn(
          baseContentClasses,
          isClosing ? "modal-panel-out" : "modal-panel-in",
          contentClassName ?? "",
        )}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        onAnimationEnd={handleAnimationEnd}
      >
        {children}
      </div>
    </section>
  );
}

const baseOverlayClasses =
  "fixed inset-0 z-50 flex items-center justify-center overscroll-contain bg-[rgba(26,31,39,0.25)]";

const baseContentClasses =
  "relative z-10 w-full rounded-500 bg-white-100 shadow-[0px_4px_40px_0px_rgba(26,31,39,0.25)]";
