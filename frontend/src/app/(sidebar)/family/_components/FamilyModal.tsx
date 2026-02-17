"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import type { ReactNode } from "react";
import ClientModal from "@/components/ui/Modal/ClientModal";

export default function FamilyModal({ children }: { children: ReactNode }) {
  const router = useRouter();
  const handleClose = useCallback(() => router.back(), [router]);

  return (
    <ClientModal
      open={true}
      onClose={handleClose}
      ariaLabel="가족 관리"
      contentClassName="!w-auto !bg-transparent !shadow-none !rounded-none"
    >
      {children}
    </ClientModal>
  );
}
