"use client";
import type { SSEEvent, ServerEventContextType } from "@/types/sse";
import { createContext, useContext, useState } from "react";

const ServerEventContext = createContext<ServerEventContextType | null>(null);

export function ServerEventProvider({ children }: { children: React.ReactNode }) {
  const [lastEvent, setLastEvent] = useState<SSEEvent | null>(null);

  const value = {
    lastEvent,
    setLastEvent,
  };

  return <ServerEventContext.Provider value={value}>{children}</ServerEventContext.Provider>;
}

export function useServerEvent() {
  const context = useContext(ServerEventContext);
  if (!context) throw new Error("useServerEvent는 ServerEventProvider 안에서 사용해야 합니다.");
  return context;
}
