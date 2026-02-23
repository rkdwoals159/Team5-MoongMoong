"use client";

import { useEffect, useRef, useState } from "react";
import Chip from "@/components/common/Chip/Chip";
import DropdownListBox from "@/components/ui/Dropdown/DropdownListBox";
import {
  MAIN_CATEGORIES,
  CATEGORY_COLOR_MAP,
  DEFAULT_CATEGORY_COLOR,
} from "@/app/(sidebar)/dashboard/_constants";
import type { MainCategoryFilter } from "@/api/types/dashboardApi.type";
import ArrowUpIcon from "@/assets/icons/components/arrow-up.svg";
import ArrowDownIcon from "@/assets/icons/components/arrow-down.svg";
import CloseIcon from "@/assets/icons/components/close.svg";

type CategoryFilterHeaderProps = {
  value: MainCategoryFilter | null;
  onChange: (category: MainCategoryFilter | null) => void;
};

const ALL_OPTION = "전체";
const OPTIONS = [ALL_OPTION, ...MAIN_CATEGORIES];

// --- 필터 아이콘 ---
const CategoryFilterIcon = ({ isOpen }: { isOpen: boolean }) => {
  const Icon = isOpen ? ArrowDownIcon : ArrowUpIcon;

  return (
    <span
      className="inline-flex shrink-0 text-gray-300"
      aria-label={isOpen ? "필터 열기" : "필터 닫기"}
    >
      <Icon aria-hidden="true" />
    </span>
  );
};

/**
 * mainCategory 컬럼 헤더용 인라인 필터 컴포넌트
 *
 * - 필터 없음: "항목 ▼" 버튼
 * - 필터 선택됨: Chip + × 버튼 (클릭 시 해제)
 * - 버튼 클릭 시 드롭다운 열림 → 카테고리 선택
 */
const CategoryFilterHeader = ({ value, onChange }: CategoryFilterHeaderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setFocusedIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
    setFocusedIndex(0);
  };

  const handleSelect = (option: string) => {
    onChange(option === ALL_OPTION ? null : (option as MainCategoryFilter));
    setIsOpen(false);
    setFocusedIndex(-1);
  };

  const handleClear = () => {
    onChange(null);
  };

  const color = value
    ? (CATEGORY_COLOR_MAP[value] ?? DEFAULT_CATEGORY_COLOR)
    : DEFAULT_CATEGORY_COLOR;

  return (
    <div ref={containerRef} className="relative h-full flex items-center">
      {value ? (
        // 필터 선택됨: Chip 버튼(드롭다운 토글) + × 버튼(필터 해제)
        <>
          <button
            type="button"
            onClick={handleToggle}
            className="flex items-center gap-100 focus:outline-none h-full cursor-pointer"
            aria-label="카테고리 필터 변경"
          >
            <Chip label={value} level="major" color={color} />
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="text-gray-500 ml-300 flex items-center justify-center hover:text-gray-600 typo-body-m-bold cursor-pointer focus:outline-none shrink-0"
            aria-label="필터 해제"
          >
            <CloseIcon aria-hidden="true" />
          </button>
        </>
      ) : (
        // 필터 없음: 텍스트 버튼
        <button
          type="button"
          onClick={handleToggle}
          className="flex items-center gap-100 typo-body-s-medium text-text-base focus:outline-none h-full w-full cursor-pointer"
          aria-label="카테고리 필터 선택"
        >
          항목
          <CategoryFilterIcon isOpen={isOpen} />
        </button>
      )}

      {isOpen && (
        <DropdownListBox
          options={OPTIONS}
          selectedValue={value ?? ALL_OPTION}
          focusedIndex={focusedIndex}
          onSelect={handleSelect}
          onMouseEnter={setFocusedIndex}
          className="left-0 top-full"
        />
      )}
    </div>
  );
};

export default CategoryFilterHeader;
