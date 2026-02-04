"use client";

import { useState, useCallback } from "react";

export type UseAmountInputOptions = {
  initialValue?: number;
};

export function useAmountInput(options: UseAmountInputOptions = {}) {
  const { initialValue } = options;
  const [value, setValue] = useState(() =>
    initialValue && initialValue > 0 ? String(initialValue) : "",
  );

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, "");
    setValue(raw);
  }, []);

  const reset = useCallback(() => {
    setValue(initialValue && initialValue > 0 ? String(initialValue) : "");
  }, [initialValue]);

  const addAmount = useCallback((amount: number) => {
    setValue((prev) => String(Number(prev || "0") + amount));
  }, []);

  return {
    value,
    numericValue: Number(value) || 0,
    setValue,
    handleChange,
    reset,
    addAmount,
  };
}
