"use client";

import { useState } from "react";
import type { UseAmountInputOptions } from "@/app/(sidebar)/saving/_types";

const DEFAULT_MAX_INPUT_LENGTH = 12;
const INPUT_LENGTH_BUFFER = 2; // max 초과 입력 시 즉시 차단 대신 경고를 보여주기 위한 여유 자릿수

export function useAmountInput(options: UseAmountInputOptions = {}) {
  const { initialValue, min, minWarningMessage, max, maxWarningMessage } = options;
  const [value, setValue] = useState(() =>
    initialValue && initialValue > 0 ? String(initialValue) : "",
  );

  const numericValue = Number(value) || 0;
  const isUnderMin = min !== undefined && numericValue > 0 && numericValue < min;
  const isOverMax = max !== undefined && numericValue > max;
  const warningMessage = getAmountInputWarningMessage(
    isOverMax,
    maxWarningMessage,
    isUnderMin,
    minWarningMessage,
  );

  const maxInputLength =
    max !== undefined ? String(max).length + INPUT_LENGTH_BUFFER : DEFAULT_MAX_INPUT_LENGTH;

  const [isShaking, setIsShaking] = useState(false);

  const triggerShake = () => setIsShaking(true);
  const stopShaking = () => setIsShaking(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, "");
    if (raw.length > maxInputLength) {
      triggerShake();
      return;
    }
    setValue(raw);
  };

  const reset = () => {
    setValue(initialValue && initialValue > 0 ? String(initialValue) : "");
  };

  const addAmount = (amount: number) => {
    setValue((prev) => {
      const next = String(Number(prev || "0") + amount);
      if (next.length > maxInputLength) return prev;
      return next;
    });
  };

  return {
    value,
    numericValue,
    warningMessage,
    isShaking,
    stopShaking,
    handleChange,
    reset,
    addAmount,
  };
}

// 내부함수
function getAmountInputWarningMessage(
  isOverMax: boolean,
  maxWarningMessage?: string,
  isUnderMin?: boolean,
  minWarningMessage?: string,
) {
  if (isOverMax) return maxWarningMessage;
  if (isUnderMin) return minWarningMessage;
  return undefined;
}
