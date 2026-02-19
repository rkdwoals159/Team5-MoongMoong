import type { ChartPayloadType } from "@/app/(sidebar)/analysis/_types";

const MEDICAL_SUB_CATEGORY_LABEL_MAP: Record<string, string> = {
  CONSULTATION: "진료비",
  VACCINATION: "예방접종",
  MEDICATION: "약/처방",
  EXAMINATION: "검사비",
  SURGERY_HOSPITALIZATION: "수술/입원",
  OTHER_MEDICAL: "기타 의료비",
};

export function getChartLabelFromPayload(payload: ChartPayloadType | undefined) {
  if (!payload) {
    return "";
  }
  if ("category" in payload) {
    return payload.category ?? "";
  }
  if ("subCategory" in payload) {
    const subCategory = payload.subCategory ?? "";
    if (!subCategory) {
      return "";
    }
    return MEDICAL_SUB_CATEGORY_LABEL_MAP[subCategory] || subCategory;
  }
  return "";
}
