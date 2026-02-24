"use client";

import { useServerEvent } from "@/hooks/ServerEventProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AIRecommendationRefresher() {
  const { lastEvent } = useServerEvent();
  const router = useRouter();

  useEffect(() => {
    if (lastEvent?.event === "AI_ADVICE_CREATED") {
      router.refresh();
    }
  }, [lastEvent, router]);

  return null;
}
