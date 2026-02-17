import { useToast } from "@/components/ui/Toast/ToastProvider";
import { participatePetGroup } from "@/api/familyApiActions";

export function useFamilySettingActions() {
  const { showToast } = useToast();

  const handleInviteSubmit = async (inviteCode: string) => {
    // TODO: data.crewId 활용하여 그룹 참여 완료 처리
    const { data, error } = await participatePetGroup(inviteCode);

    if (error) {
      showToast({ message: error, variant: "error" });
      return;
    }

    showToast({ message: "가족에 참여했어요!", variant: "success" });
  };

  return { handleInviteSubmit };
}
