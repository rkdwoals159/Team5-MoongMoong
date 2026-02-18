import { ADMINISTRATIVE_DISTRICTS } from "@/constants";

// 서울특별시만 허용
export const CITY_VALUE = "서울특별시";
export const CITY_OPTIONS = [CITY_VALUE];
export const CITY_DISTRICT_OPTIONS = ADMINISTRATIVE_DISTRICTS[CITY_VALUE];
