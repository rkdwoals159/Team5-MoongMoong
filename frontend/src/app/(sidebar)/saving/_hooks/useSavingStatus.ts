"use client";

import { SavingStatusContext } from "@/app/(sidebar)/saving/_contexts/SavingStatusContext";
import { useContext } from "react";

export const useSavingStatus = () => {
  const context = useContext(SavingStatusContext);
  if (!context) {
    throw new Error("useSavingStatus must be used within a SavingStatusProvider");
  }
  return context;
};
