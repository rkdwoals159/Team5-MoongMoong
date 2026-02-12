"use client";

import { useState, useRef, useCallback } from "react";
import { useOutsideClick } from "@/hooks/useOutsideClick";
import cn from "@/utils/style";
import type { ClientModalProps } from "./ClientModal.type";

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

  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setShouldRender(true);
      setIsClosing(false);
    } else if (shouldRender) {
      setIsClosing(true);
    }
  }

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
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        className={cn(
          baseContentClasses,
          isClosing ? "modal-panel-out" : "modal-panel-in",
          contentClassName ?? "",
        )}
        tabIndex={-1}
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
