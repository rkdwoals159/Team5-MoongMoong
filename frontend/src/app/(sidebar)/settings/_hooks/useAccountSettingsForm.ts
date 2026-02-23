"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateMemberName } from "@/api/server/settingsApiActions";
import { useToast } from "@/components/ui/Toast/ToastProvider";
import type { MemberInfoResponse } from "@/api/types/settingsApi.type";
import { getErrorMessage } from "@/lib/api/errorMessage";

export default function useAccountSettingsForm(account: MemberInfoResponse) {
  const router = useRouter();
  const { showToast } = useToast();
  const [originalNickname, setOriginalNickname] = useState(account.memberName ?? "");
  const [nickname, setNickname] = useState(originalNickname);
  const email = account.memberEmail;

  const isChanged = nickname !== originalNickname;
  const isSaveDisabled = !isChanged || nickname.trim() === "";

  function handleNicknameChange(e: React.ChangeEvent<HTMLInputElement>) {
    setNickname(e.target.value);
  }

  async function handleSaveClick() {
    try {
      const response = await updateMemberName(nickname);
      setOriginalNickname(response.memberName ?? "");
      showToast({ variant: "success", message: "닉네임이 변경됐어요." });
      router.refresh();
      router.back();
    } catch (error) {
      showToast({
        variant: "error",
        message: getErrorMessage(error, "닉네임 변경에 실패했어요."),
      });
    }
  }

  return {
    nickname,
    email,
    isSaveDisabled,
    handleNicknameChange,
    handleSaveClick,
  };
}
