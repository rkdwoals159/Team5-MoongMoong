import type { ChartPayloadType } from "@/app/(sidebar)/analysis/_types";

export function getChartLabelFromPayload(payload: ChartPayloadType | undefined) {
  if (!payload) {
    return "";
  }
  if ("category" in payload) {
    return payload.category ?? "";
  }
  if ("subCategory" in payload) {
    return payload.subCategory ?? "";
  }
  return "";
}
