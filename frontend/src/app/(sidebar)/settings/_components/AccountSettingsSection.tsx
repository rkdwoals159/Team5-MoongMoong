"use client";

import Button from "@/components/common/Button/Button";
import type { AccountSettingsSectionProps } from "@/app/(sidebar)/settings/types";
import TextInput from "@/components/common/Input/TextInput";
import useAccountSettingsForm from "@/app/(sidebar)/settings/_hooks/useAccountSettingsForm";

export default function AccountSettingsSection({ account, onClose }: AccountSettingsSectionProps) {
  const { nickname, email, isSaveDisabled, handleNicknameChange, handleSaveClick } =
    useAccountSettingsForm(account);

  return (
    <section
      aria-labelledby="account-settings-title"
      className="flex w-[32rem] h-full flex-col justify-between gap-600"
    >
      <div className="flex flex-col gap-600">
        <div className="flex flex-col gap-600">
          <div className="flex flex-col gap-200">
            <span className="typo-caption-s-bold text-gray-500">로그인 계정</span>
            <span className="typo-body-m text-gray-500">{email}</span>
          </div>

          <div className="flex flex-col gap-200">
            <span className="typo-caption-s-bold text-gray-500">사용자 닉네임</span>
            <TextInput
              value={nickname}
              onChange={handleNicknameChange}
              placeholder="닉네임을 입력해주세요"
              showCounter={true}
              maxLength={10}
            />
          </div>
        </div>
      </div>

      <div className="mt-600 flex w-[32rem] gap-200">
        {onClose && (
          <Button variant="secondary" size="medium" fullWidth={true} onClick={onClose}>
            닫기
          </Button>
        )}
        <Button
          variant="primary"
          size="medium"
          fullWidth={true}
          onClick={handleSaveClick}
          isDisabled={isSaveDisabled}
        >
          저장하기
        </Button>
      </div>
    </section>
  );
}
