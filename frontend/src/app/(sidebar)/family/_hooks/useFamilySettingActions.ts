import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/Toast/ToastProvider";
import { participateGroup } from "@/app/(sidebar)/family/_api";

export function useFamilySettingActions() {
  const router = useRouter();
  const { showToast } = useToast();

  const handleInviteSubmit = async (inviteCode: string) => {
    const { error } = await participateGroup(inviteCode);

    if (error) {
      showToast({ message: error, variant: "error" });
      return;
    }

    showToast({ message: "가족에 참여했어요!", variant: "success" });
    router.push("/dashboard");
  };

  return { handleInviteSubmit };
}
