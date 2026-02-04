import { useState } from "react";
import { useRouter } from "next/navigation";
import { createNewSaving } from "@/app/(sidebar)/saving/_api";
import { useToast } from "@/components/ui/Toast/ToastProvider";

export const useCreateSaving = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  const createSaving = async (amount: number) => {
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const response = await createNewSaving(amount);
      if (!response) {
        showToast({
          variant: "error",
          message: "저금통 생성에 실패했어요.",
        });
        return;
      }
      showToast({
        variant: "success",
        message: "저금통 생성에 성공했어요.",
      });
      router.refresh();
    } catch {
      showToast({
        variant: "error",
        message: "저금통 생성 중 오류가 발생했어요.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    createSaving,
    isSubmitting,
  };
};
