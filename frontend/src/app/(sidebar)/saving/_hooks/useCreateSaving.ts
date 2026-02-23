import { useState } from "react";
import { useRouter } from "next/navigation";
import { postBank } from "@/api/savingApi";
import { API_ERROR_MESSAGES } from "@/api/constants";
import { useToast } from "@/components/ui/Toast/ToastProvider";
import { executeWithToastError } from "@/lib/api/executeWithToastError";

export function useCreateSaving() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  const createSaving = async (amount: number) => {
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      await executeWithToastError(() => postBank(amount), {
        showToast,
        fallbackMessage: API_ERROR_MESSAGES.BANK_CREATE,
        onSuccess: () => {
          showToast({
            variant: "success",
            message: "저금통 생성에 성공했어요.",
          });
          router.refresh();
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    createSaving,
    isSubmitting,
  };
}
