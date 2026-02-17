"use client";

import { useState } from "react";
import { cn } from "@/utils/style";
import WarningIcon from "@/assets/icons/analysis/ic_warning.svg";
import type { InviteCodeFormProps } from "@/app/(sidebar)/family/_types";
import { MAX_INVITE_CODE_LENGTH } from "@/app/(sidebar)/family/_constants";
import { useFamilySettingActions } from "@/app/(sidebar)/family/_hooks/useFamilySettingActions";

export default function InviteCodeForm({ isAlone }: InviteCodeFormProps) {
  const [code, setCode] = useState("");
  const { handleInviteSubmit } = useFamilySettingActions();
  const [isOverLimit, setIsOverLimit] = useState(false);

  const isCodeEmpty = code.trim().length === 0;
  const isAtLimit = code.length >= MAX_INVITE_CODE_LENGTH;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length > MAX_INVITE_CODE_LENGTH) {
      setCode(value.slice(0, MAX_INVITE_CODE_LENGTH));
      setIsOverLimit(true);
    } else {
      setCode(value);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isCodeEmpty) return;
    handleInviteSubmit(code.trim());
    setCode("");
  };

  return (
    <div className="flex flex-col gap-350">
      <form onSubmit={handleSubmit} className="relative flex gap-350">
        <input
          type="text"
          value={code}
          onChange={handleChange}
          onAnimationEnd={() => setIsOverLimit(false)}
          disabled={!isAlone}
          placeholder="초대 URL을 입력해주세요."
          className={cn(
            inputClasses,
            "min-w-0 flex-1",
            !isAlone && "cursor-not-allowed opacity-50",
            isAtLimit && "border-red-500! focus:border-red-500!",
            isOverLimit && "animate-[shake_0.3s_ease]",
          )}
        />
        <button
          type="submit"
          disabled={isCodeEmpty || !isAlone}
          className={isCodeEmpty ? submitButtonDisabledClasses : submitButtonActiveClasses}
        >
          <span
            className={
              isCodeEmpty ? "typo-body-m-bold text-gray-300" : "typo-body-m-bold text-base"
            }
          >
            확인
          </span>
        </button>
        {isAtLimit && (
          <span className="typo-caption-s-medium text-red-500 absolute -bottom-5 left-1">
            초대 URL은 최대 {MAX_INVITE_CODE_LENGTH}자까지 입력 가능합니다.
          </span>
        )}
      </form>

      {!isAlone && (
        <div className="flex items-start gap-3">
          <WarningIcon className="size-4 text-gray-300" aria-hidden="true" />
          <div className="typo-caption-s-medium text-gray-500">
            <p>{`새 가족에 참여하려면 현재 가족 구성원이 '나'만 있어야 합니다.`}</p>
          </div>
        </div>
      )}
    </div>
  );
}

const inputClasses =
  "h-12 rounded-250 bg-gray-50 px-4 typo-body-m-medium text-base placeholder:text-gray-300 outline-none border border-transparent focus:border-yellow-300 focus:bg-white-100";

const submitButtonBase =
  "flex h-12 w-20 items-center justify-center rounded-300 transition-colors cursor-pointer disabled:cursor-not-allowed";

const submitButtonDisabledClasses = `${submitButtonBase} bg-gray-50`;

const submitButtonActiveClasses = `${submitButtonBase} bg-primary hover:bg-primary-hover active:bg-primary-pressed`;
