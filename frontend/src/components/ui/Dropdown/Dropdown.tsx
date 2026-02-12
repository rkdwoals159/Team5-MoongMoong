"use client";

import { useState, useRef, useEffect } from "react";
import { DropdownProps } from "@/components/ui/Dropdown/Dropdown.type";
import ChevronIcon from "@/components/ui/Dropdown/ChevronIcon";
import WarningIcon from "@/assets/components/ic_warning.svg";
import DropdownListBox from "@/components/ui/Dropdown/DropdownListBox";
import cn from "@/utils/style";

/**
 * Dropdown 컴포넌트
 * @param options - 옵션 배열
 * @param value - 선택된 값 (필수)
 * @param onChange - 값 변경 핸들러 (필수)
 * @param placeholder - 빈 상태 표시 텍스트
 * @param disabled - 비활성화 상태
 * @param errorMessage - 에러 메시지 (있으면 에러 상태로 표시)
 * @param fullWidth - 전체 너비 사용 여부
 * @param className - 추가 클래스 이름
 * @returns Dropdown 컴포넌트
 */

const Dropdown = ({
  options,
  value,
  onChange,
  placeholder = "선택하세요",
  disabled = false,
  errorMessage,
  fullWidth = true,
  className,
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // 선택된 값이 옵션에 있는지 확인
  const isValidSelection = value && options.includes(value);

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e?.target as Node)) {
        setIsOpen(false);
        setFocusedIndex(-1);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // 키보드 내비게이션
  // TODO: 키보드 내비게이션 기능 커스텀훅 분리
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    switch (e.key) {
      case "Enter":
      case " ":
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          setFocusedIndex(0);
        } else if (focusedIndex >= 0) {
          handleSelect(options[focusedIndex] ?? "");
        }
        break;
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        setFocusedIndex(-1);
        buttonRef.current?.focus();
        break;
      case "ArrowDown":
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          setFocusedIndex(0);
        } else {
          setFocusedIndex((prev) => Math.min(prev + 1, options.length - 1));
        }
        break;
      case "ArrowUp":
        e.preventDefault();
        if (isOpen) {
          setFocusedIndex((prev) => Math.max(prev - 1, 0));
        }
        break;
      case "Tab":
        if (isOpen) {
          setIsOpen(false);
          setFocusedIndex(-1);
        }
        break;
    }
  };

  // 옵션 선택
  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setFocusedIndex(-1);
    buttonRef.current?.focus();
  };

  // 드롭다운 토글
  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      if (!isOpen) {
        setFocusedIndex(0);
      }
    }
  };

  // 스타일 클래스
  const triggerClasses = cn(
    baseClasses,
    disabled ? disabledClasses : "",
    errorMessage
      ? errorClasses // errorMessage가 있으면 에러 스타일
      : value
        ? "border-yellow-300 hover:border-primary-hover"
        : defaultClasses,
    fullWidth ? "w-full" : "",
    className ?? "",
  );

  return (
    <div className={cn("relative", fullWidth ? "w-full" : "")} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={placeholder}
        className={triggerClasses}
      >
        <span className={cn("flex-1 text-left truncate", !isValidSelection ? "text-text-sub" : "")}>
          {isValidSelection ? value : placeholder}
        </span>
        <ChevronIcon isOpen={isOpen} className="shrink-0" />
      </button>

      {/* Error Message */}
      {errorMessage && (
        <div className="flex items-center mt-200 gap-200 px-250">
          <WarningIcon width={16} height={16} className="text-red-500" />
          <p className="typo-body-s-medium text-red-500">{errorMessage}</p>
        </div>
      )}

      {/* Dropdown Options */}
      {isOpen && !disabled && (
        <DropdownListBox
          options={options}
          selectedValue={value}
          focusedIndex={focusedIndex}
          onSelect={handleSelect}
          onMouseEnter={setFocusedIndex}
        />
      )}
    </div>
  );
};

export default Dropdown;

//--------------------------------
// Tailwind CSS classes

const baseClasses =
  "inline-flex items-center justify-between border transition-colors duration-200 select-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 px-500 py-400 rounded-300 min-h-10 typo-body-l-medium";

const defaultClasses =
  "bg-white-100 text-text-base border-border-normal hover:border-border-heavy active:border-blue-500";

const errorClasses =
  "bg-white-100 text-text-base border-red-500 hover:border-red-500 active:border-red-500";

const disabledClasses = "cursor-not-allowed bg-gray-50 text-text-sub border-border-light";
//--------------------------------
