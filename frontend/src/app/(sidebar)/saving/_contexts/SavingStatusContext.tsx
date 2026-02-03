"use client";

import { SavingStatus } from "@/app/(sidebar)/saving/_types";
import { createContext, Dispatch, PropsWithChildren, SetStateAction } from "react";

type SavingStatusContextType = {
  status: SavingStatus;
  setStatus: Dispatch<SetStateAction<SavingStatus>>;
};

export const SavingStatusContext = createContext<SavingStatusContextType | null>(null);

export const SavingStatusProvider = ({
  status,
  setStatus,
  children,
}: SavingStatusContextType & PropsWithChildren) => {
  return (
    <SavingStatusContext.Provider value={{ status, setStatus }}>
      {children}
    </SavingStatusContext.Provider>
  );
};
