"use client";

import { useRef } from "react";
import cn from "@/utils/style";
import type { NativeDateInputProps } from "./NativeDateInput.type";

export default function NativeDateInput({
  value,
  displayText,
  min,
  max,
  ariaLabel,
  onChange,
  className,
  focusable = true,
}: NativeDateInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    if (v) onChange(v);
  };

  const handleClick = () => {
    if (typeof inputRef.current?.showPicker === "function") {
      inputRef.current.showPicker();
    } else {
      inputRef.current?.click();
    }
  };

  return (
    <div
      role="button"
      tabIndex={focusable ? 0 : -1}
      onClick={handleClick}
      className={cn(
        "relative inline-flex min-h-10 min-w-[8rem] cursor-pointer select-none",
        className ?? "",
      )}
      aria-label={ariaLabel}
    >
      <input
        ref={inputRef}
        type="date"
        value={value}
        min={min}
        max={max}
        onChange={handleChange}
        aria-hidden
        tabIndex={-1}
        className="absolute left-0 top-full h-0 w-0 overflow-hidden opacity-0 [clip:rect(0,0,0,0)] [color-scheme:light]"
      />
      <span className="truncate">{displayText}</span>
    </div>
  );
}
