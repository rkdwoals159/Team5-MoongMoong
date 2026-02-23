"use client";

import { useEffect } from "react";
import type { UseOutsideClickOptions } from "@/types/common";

export const useOutsideClick = <T extends Element>({
  isActive,
  refs,
  onOutside,
}: UseOutsideClickOptions<T>) => {
  useEffect(() => {
    if (!isActive) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      const isInside = refs.some((ref) => ref.current?.contains(target));
      if (!isInside) onOutside();
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isActive, onOutside, refs]);
};
