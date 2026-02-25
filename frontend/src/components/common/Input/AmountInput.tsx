"use client";

import { useId } from "react";
import { cn } from "@/utils/style";
import WarningIcon from "@/assets/icons/components/warning.svg";
import { formatAmountPlain } from "@/utils/amount";
import type { AmountInputProps } from "./input.type";

const AmountInput = ({
  placeholder = "금액을 입력해주세요",
  isDisabled = false,
  className,
  value,
  suffix = "원",
  warningMessage,
  isShaking = false,
  onChange,
  onBlur,
  onAnimationEnd,
  ref,
  id: idProp,
  ...inputProps
}: AmountInputProps) => {
  const generatedId = useId();
  const id = idProp ?? generatedId;
  const warningId = `${id}-warning`;
  const numericValue = Number(value) || 0;

  const wrapperClasses = cn(
    "data-[error=true]:border-red-500 data-[error=true]:focus-within:border-red-500",
    amountBaseClasses,
    isDisabled ? amountDisabledClasses : "",
    isShaking && "input-shake",
    className ?? "",
  );

  return (
    <div className="relative">
      <div
        className={wrapperClasses}
        data-error={!!warningMessage ? "true" : "false"}
        onAnimationEnd={onAnimationEnd}
      >
        <input
          {...inputProps}
          ref={ref}
          id={id}
          type="text"
          inputMode="numeric"
          value={value ? formatAmountPlain(numericValue) : ""}
          placeholder={placeholder}
          disabled={isDisabled}
          aria-invalid={!!warningMessage}
          aria-describedby={warningMessage ? warningId : undefined}
          onChange={onChange}
          onBlur={onBlur}
          className="flex-1 bg-transparent outline-none typo-body-m-medium placeholder:text-gray-300"
        />
        <span className="typo-body-m-medium text-gray-500">{suffix}</span>
      </div>
      {warningMessage ? (
        <div
          id={warningId}
          role="alert"
          className="absolute -bottom-700 left-0 flex items-center gap-200 px-300 typo-body-s-medium text-red-500"
        >
          <WarningIcon className="w-4 h-4" aria-hidden="true" />
          <span>{warningMessage}</span>
        </div>
      ) : null}
    </div>
  );
};

export default AmountInput;

//--------------------------------
// Tailwind CSS classes

const sharedBaseClasses =
  "flex items-center gap-300 w-full px-500 rounded-250 border border-border-light bg-white-100";

const amountBaseClasses = cn(
  sharedBaseClasses,
  "h-12 text-gray-800 transition-colors hover:bg-yellow-50 hover:text-gray-500 focus-within:border-yellow-300",
);

const amountDisabledClasses = "bg-gray-50 cursor-not-allowed text-primary-disabled";
