"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import ClientModal from "@/components/ui/Modal/ClientModal";

export default function SettingsModal({ children }: { children: ReactNode }) {
  const router = useRouter();
  const handleClose = useCallback(() => {
    router.back();
  }, [router]);

  return (
    <ClientModal
      open={true}
      onClose={handleClose}
      ariaLabel="설정"
      contentClassName="!w-auto !bg-transparent !shadow-none !rounded-none"
    >
      {children}
    </ClientModal>
  );
}
