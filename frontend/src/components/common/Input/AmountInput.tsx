"use client";

import { useState } from "react";
import cn from "@/utils/style";
import WarningIcon from "@/assets/icons/components/warning.svg";
import { formatAmountPlain } from "@/utils/amount";
import type { AmountInputProps } from "./Input.type";

const AmountInput = ({
  placeholder = "금액을 입력해주세요",
  isDisabled = false,
  showError = false,
  errorMessage,
  renderError,
  touched,
  onTouchedChange,
  className,
  value,
  suffix = "원",
  onChange,
  onBlur,
  ref,
  ...inputProps
}: AmountInputProps) => {
  const [internalTouched, setInternalTouched] = useState(false);
  const isTouched = typeof touched === "boolean" ? touched : internalTouched;
  const shouldShowError = isTouched && !!showError && !!errorMessage && !isDisabled;

  const numericValue = Number(value) || 0;

  const wrapperClasses = cn(
    "data-[error=true]:focus-within:border-[var(--color-red-500)]",
    amountBaseClasses,
    isDisabled ? amountDisabledClasses : "",
    className ?? "",
  );

  const setTouchedValue = (nextTouched: boolean) => {
    if (typeof touched === "boolean") {
      onTouchedChange?.(nextTouched);
      return;
    }
    setInternalTouched(nextTouched);
  };

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const raw = e.target.value.replace(/[^0-9]/g, "");
    e.target.value = raw;
    if (!isTouched) {
      setTouchedValue(true);
    }
    onChange?.(e);
  };

  const handleBlur: React.FocusEventHandler<HTMLInputElement> = (e) => {
    setTouchedValue(true);
    onBlur?.(e);
  };

  return (
    <div className="flex flex-col gap-200">
      <div className={wrapperClasses} data-error={shouldShowError ? "true" : "false"}>
        <input
          {...inputProps}
          ref={ref}
          type="text"
          inputMode="numeric"
          value={value ? formatAmountPlain(numericValue) : ""}
          placeholder={placeholder}
          disabled={isDisabled}
          onChange={handleChange}
          onBlur={handleBlur}
          className="flex-1 bg-transparent outline-none typo-body-m-medium placeholder:text-gray-300"
        />
        <span className="typo-body-m-medium text-gray-400">{suffix}</span>
      </div>
      {shouldShowError ? (
        renderError ? (
          renderError(errorMessage ?? "")
        ) : (
          <div className="flex items-center gap-200 px-300 typo-body-s-medium text-red-500">
            <WarningIcon className="w-4 h-4" aria-hidden="true" />
            <span>{errorMessage}</span>
          </div>
        )
      ) : null}
    </div>
  );
};

export default AmountInput;

//--------------------------------
// Tailwind CSS classes

const sharedBaseClasses =
  "flex items-center gap-[var(--spacing-300)] w-full px-[var(--spacing-500)] rounded-[var(--radius-250)] border border-[var(--color-border-light)] bg-[var(--color-white-100)]";

const amountBaseClasses = cn(
  sharedBaseClasses,
  "h-12 text-[var(--color-text-base)] transition-colors hover:bg-[var(--color-yellow-50)] hover:text-[var(--color-gray-500)] focus-within:border-[var(--color-yellow-300)]",
);

const amountDisabledClasses =
  "bg-[var(--color-gray-50)] cursor-not-allowed text-[var(--color-primary-disabled)]";
