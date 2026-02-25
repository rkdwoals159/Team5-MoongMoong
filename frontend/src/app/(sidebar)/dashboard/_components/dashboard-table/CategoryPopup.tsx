"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  CATEGORY_POPUP_HEIGHT,
  MAIN_CATEGORIES,
  SUB_CATEGORIES,
} from "@/app/(sidebar)/dashboard/_constants";
import type { CategoryPopupProps } from "@/app/(sidebar)/dashboard/_types";
/**
 * 카테고리 선택 팝업
 * @param position - 팝업의 위치 (top, left)
 * @param onSelect - 카테고리 선택 시 호출되는 핸들러
 * @param onClose - 팝업 닫기 시 호출되는 핸들러
 * @param currentMainCategory - 현재 선택된 메인 카테고리
 * @returns 카테고리 선택 팝업 컴포넌트
 */
const CategoryPopup = ({
  position,
  onSelect,
  onClose,
  currentMainCategory,
  currentSubCategory,
}: CategoryPopupProps) => {
  const popupRef = useRef<HTMLDivElement>(null);
  const [selectedMain, setSelectedMain] = useState<string>(currentMainCategory || "");

  // 팝업 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  // 메인 카테고리 클릭
  const handleMainClick = useCallback((mainCategory: string) => {
    setSelectedMain(mainCategory);
  }, []);

  // 서브 카테고리 클릭
  const handleSubClick = useCallback(
    (subCategory: string) => {
      if (!selectedMain) return;

      onSelect(selectedMain, subCategory);
      onClose();
    },
    [onSelect, onClose, selectedMain],
  );

  // 선택된 메인 카테고리의 서브 카테고리 목록
  const subCategories = selectedMain ? SUB_CATEGORIES[selectedMain] || [] : [];
  const hasSubCategories = subCategories.length > 0;

  return (
    <div
      ref={popupRef}
      role="dialog"
      aria-label="카테고리 선택"
      className="fixed z-50 w-[288px] rounded-lg border border-border-light bg-white shadow-lg overflow-hidden"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
    >
      <div className="flex" style={{ height: CATEGORY_POPUP_HEIGHT }}>
        <div className="w-[110px] border-r border-border-light overflow-y-auto">
          {MAIN_CATEGORIES.map((category) => {
            const isMainSelected = category === selectedMain;

            return (
              <button
                key={category}
                type="button"
                className={`w-full h-[48px] px-4 flex items-center text-left transition-colors cursor-pointer hover:bg-gray-100 ${
                  isMainSelected ? "" : "bg-gray-50"
                }`}
                onClick={() => handleMainClick(category)}
              >
                <span
                  className={`text-text-base ${
                    isMainSelected ? "typo-body-m-bold" : "typo-body-m-regular"
                  }`}
                >
                  {category}
                </span>
              </button>
            );
          })}
        </div>
        <div className="flex-1 w-[178px] overflow-y-auto">
          {selectedMain &&
            (hasSubCategories ? (
              subCategories.map((subCategory) => {
                const isSubSelected = subCategory === currentSubCategory;
                return (
                  <button
                    key={subCategory}
                    type="button"
                    className="w-full h-[48px] px-4 flex items-center text-left transition-colors cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSubClick(subCategory)}
                  >
                    <span
                      className={`text-text-base ${
                        isSubSelected ? "typo-body-m-bold" : "typo-body-m-regular"
                      }`}
                    >
                      {subCategory}
                    </span>
                  </button>
                );
              })
            ) : (
              <button
                key={selectedMain}
                type="button"
                className="w-full h-[48px] px-4 flex items-center text-left transition-colors cursor-pointer hover:bg-gray-50"
                onClick={() => {
                  onSelect(selectedMain);
                  onClose();
                }}
              >
                <span
                  className={`text-text-base ${
                    selectedMain === currentMainCategory && !currentSubCategory
                      ? "typo-body-m-bold"
                      : "typo-body-m-regular"
                  }`}
                >
                  {selectedMain}
                </span>
              </button>
            ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryPopup;
