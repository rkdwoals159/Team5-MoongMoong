import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/Toast/ToastProvider";
import { participateGroup } from "@/api/client/familyApi";

export function useFamilySettingActions() {
  const router = useRouter();
  const { showToast } = useToast();

  const handleInviteSubmit = async (inviteCode: string) => {
    try {
      await participateGroup(inviteCode);
      showToast({ message: "가족에 참여했어요!", variant: "success" });
      router.push("/dashboard");
    } catch (error) {
      const message = error instanceof Error ? error.message : "가족 참여에 실패했습니다.";
      showToast({ message, variant: "error" });
    }
  };

  return { handleInviteSubmit };
}
