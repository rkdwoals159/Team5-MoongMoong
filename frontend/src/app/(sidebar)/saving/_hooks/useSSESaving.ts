"use client";

import { useEffect, useRef } from "react";
import { useServerEvent } from "@/hooks/ServerEventProvider";
import { useSavingStatus } from "@/app/(sidebar)/saving/_hooks/useSavingStatus";
import { getBank } from "@/api/client/savingApi";

type UseSSESavingParams = {
  handleDrop: (name: string, amount: number, createdAt: string, targetAmount: number) => void;
};

export function useSSESaving({ handleDrop }: UseSSESavingParams) {
  const { lastEvent } = useServerEvent();
  const { status, setStatus } = useSavingStatus();
  const lastHandledEventRef = useRef<typeof lastEvent>(null);

  useEffect(() => {
    if (!lastEvent || lastEvent.event !== "SAVING") return;
    if (lastHandledEventRef.current === lastEvent) return;
    lastHandledEventRef.current = lastEvent;

    const { name, amount } = lastEvent.data;
    const createdAt = new Date().toISOString();

    handleDrop(name, amount, createdAt, status.target);

    getBank()
      .then((bankInfo) => {
        setStatus((prev) => ({
          ...prev,
          current: prev.current + amount,
          rankings: bankInfo?.rankings || prev.rankings,
          coins: [...prev.coins, { name, amount, createdAt }],
        }));
      })
      .catch(() => {
        setStatus((prev) => ({
          ...prev,
          current: prev.current + amount,
          coins: [...prev.coins, { name, amount, createdAt }],
        }));
      });
  }, [lastEvent, handleDrop, status.target, setStatus]);
}
