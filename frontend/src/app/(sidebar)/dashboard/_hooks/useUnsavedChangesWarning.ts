"use client";

import { useEffect } from "react";
import { UNSAVED_CHANGE_WARNING_MESSAGE } from "@/app/(sidebar)/dashboard/_constants/messages";

/**
 * 미저장 변경사항이 있을 때 페이지 이탈을 경고하는 훅
 * - 브라우저 새로고침/탭 닫기: beforeunload
 * - 클라이언트 라우팅(Link 클릭): anchor click 인터셉트
 * - 브라우저 뒤로가기/앞으로가기: popstate 인터셉트
 */
export function useUnsavedChangesWarning(hasUnsavedChanges: boolean) {
  // 브라우저 새로고침 / 탭 닫기
  useEffect(() => {
    if (!hasUnsavedChanges) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Next.js Link 클릭 (클라이언트 라우팅) 인터셉트
  useEffect(() => {
    if (!hasUnsavedChanges) return;

    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#")) return;

      // 외부 링크는 beforeunload가 처리
      if (anchor.target === "_blank" || anchor.origin !== window.location.origin) return;

      if (!window.confirm(UNSAVED_CHANGE_WARNING_MESSAGE)) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [hasUnsavedChanges]);

  // 브라우저 뒤로가기 / 앞으로가기
  useEffect(() => {
    if (!hasUnsavedChanges) return;

    const handlePopState = () => {
      if (!window.confirm(UNSAVED_CHANGE_WARNING_MESSAGE)) {
        window.history.pushState(null, "", window.location.href);
      }
    };

    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [hasUnsavedChanges]);
}
