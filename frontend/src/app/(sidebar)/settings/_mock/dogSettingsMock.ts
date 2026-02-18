import type { DogSettings } from "@/app/(sidebar)/settings/types";

/**
 * 반려견 관리 탭에서 사용할 목업 강아지 정보입니다.
 * 이후 실제 API 연동 시 교체됩니다.
 */
export const dogSettingsMock: DogSettings = {
  petName: "코코",
  breed: "달마시안",
  gender: "F",
  birthDate: "2016-01-08",
  city: "서울",
  district: "관악구",
  diseases: ["DER", "OCU", "HEM"],
};
