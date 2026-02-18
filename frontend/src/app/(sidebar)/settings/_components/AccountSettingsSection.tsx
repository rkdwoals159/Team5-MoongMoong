"use client";

import Button from "@/components/common/Button/Button";
import type { AccountSettingsSectionProps } from "@/app/(sidebar)/settings/types";
import TextInput from "@/components/common/Input/TextInput";

export default function AccountSettingsSection({ account }: AccountSettingsSectionProps) {
  const { email, nickname } = account;

  return (
    <section
      aria-labelledby="account-settings-title"
      className="flex w-[32rem] h-full flex-col justify-between gap-600"
    >
      <div className="flex flex-col gap-600">
        <div className="flex flex-col gap-600">
          <div className="flex flex-col gap-200">
            <span className="typo-caption-s-bold text-gray-500">로그인 계정</span>
            <span className="typo-body-m text-gray-300">{email}</span>
          </div>

          <div className="flex flex-col gap-200">
            <span className="typo-caption-s-bold text-gray-500">사용자 닉네임</span>
            <TextInput
              value={nickname}
              onChange={() => {}}
              placeholder="닉네임을 입력해주세요"
              showCounter={true}
              maxLength={10}
            />
          </div>
        </div>
      </div>

      <div className="mt-600 flex w-[32rem] gap-200">
        <Button variant="secondary" size="medium" fullWidth={true} onClick={() => {}}>
          닫기
        </Button>
        <Button
          variant="primary"
          size="medium"
          fullWidth={true}
          onClick={() => {}}
          isDisabled={true}
        >
          저장하기
        </Button>
      </div>
    </section>
  );
}
