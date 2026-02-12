"use client";

import { cn } from "@/utils/style";
import WarningIcon from "@/assets/icons/components/warning.svg";
import type { TextInputProps } from "./input.type";
import { useState } from "react";

type TextInputInternalProps = TextInputProps & {};

const TextInput = ({
  placeholder = "강아지 이름을 입력해주세요",
  maxLength = 10,
  showCounter = true,
  isDisabled = false,
  showError = false,
  errorMessage,
  renderError,
  touched,
  onTouchedChange,
  className,
  value,
  defaultValue,
  ...rest
}: TextInputInternalProps) => {
  const { onChange, onBlur, ...inputProps } = rest;
  const [internalTouched, setInternalTouched] = useState(false);
  const isTouched = typeof touched === "boolean" ? touched : internalTouched;
  const shouldShowError = isTouched && !!showError && !!errorMessage && !isDisabled;
  const isControlled = typeof value === "string";
  const inputValue = isControlled ? value : undefined;
  const inputDefaultValue =
    !isControlled && typeof defaultValue === "string" ? defaultValue : undefined;
  const stringValue = inputValue ?? inputDefaultValue ?? "";

  const wrapperClasses = cn(
    "data-[error=true]:focus-within:border-[var(--color-red-500)]",
    textBaseClasses,
    isDisabled ? textDisabledClasses : "",
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
    if (e.currentTarget.value.length > maxLength) {
      e.currentTarget.value = e.currentTarget.value.slice(0, maxLength);
    }
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
          type="text"
          value={inputValue}
          defaultValue={inputDefaultValue}
          placeholder={placeholder}
          maxLength={maxLength}
          disabled={isDisabled}
          onChange={handleChange}
          onBlur={handleBlur}
          className="flex-1 bg-transparent outline-none typo-body-m-medium placeholder:text-gray-300"
        />
        {showCounter && stringValue.length > 0 ? (
          <span className="typo-body-m-medium text-gray-300">
            {stringValue.length}/{maxLength}자
          </span>
        ) : null}
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

export default TextInput;

//--------------------------------
// Tailwind CSS classes

const sharedBaseClasses =
  "flex items-center gap-[var(--spacing-300)] w-full px-[var(--spacing-500)] rounded-[var(--radius-250)] border border-[var(--color-border-light)] bg-[var(--color-white-100)]";

const textBaseClasses = cn(
  sharedBaseClasses,
  "h-12 text-[var(--color-text-base)] transition-colors hover:bg-[var(--color-yellow-50)] hover:text-[var(--color-gray-500)] focus-within:border-[var(--color-yellow-300)]",
);

const textDisabledClasses =
  "bg-[var(--color-gray-50)] cursor-not-allowed text-[var(--color-primary-disabled)]";
