"use client";

import type { SavingStatusContextType } from "@/app/(sidebar)/saving/_types";
import { createContext, type PropsWithChildren } from "react";

export const SavingStatusContext = createContext<SavingStatusContextType | null>(null);

export function SavingStatusProvider({
  status,
  setStatus,
  children,
}: SavingStatusContextType & PropsWithChildren) {
  return (
    <SavingStatusContext.Provider value={{ status, setStatus }}>
      {children}
    </SavingStatusContext.Provider>
  );
}
