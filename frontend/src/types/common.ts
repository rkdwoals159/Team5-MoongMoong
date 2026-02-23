import type { RefObject } from "react";

export type AdministrativeRegionName =
  | "서울시"
  | "부산광역시"
  | "인천광역시"
  | "대구광역시"
  | "광주광역시"
  | "대전광역시"
  | "울산광역시"
  | "세종특별자치시"
  | "경기도"
  | "강원특별자치도"
  | "충청북도"
  | "충청남도"
  | "경상북도"
  | "경상남도"
  | "전북특별자치도"
  | "전라남도"
  | "제주특별자치도";

export type AdministrativeDistricts = Record<AdministrativeRegionName, string[]>;

export type DogBreedCode =
  | "GRE"
  | "DAL"
  | "DAS"
  | "DOB"
  | "GOL"
  | "LAB"
  | "MAL"
  | "BUL"
  | "BEA"
  | "BIC"
  | "SHE"
  | "SCH"
  | "MIL"
  | "MIS"
  | "HUS"
  | "HOU"
  | "GER"
  | "JIN"
  | "CHS"
  | "CHL"
  | "COC"
  | "TER"
  | "POM"
  | "POO"
  | "SHI"
  | "WEL"
  | "ETC";

export type DogBreed = {
  code: DogBreedCode;
  koName: string;
  enName: string;
};

export type UseOutsideClickOptions<T extends Element> = {
  isActive: boolean;
  refs: Array<RefObject<T | null>>;
  onOutside: () => void;
};

export type SectionPlaceholderProps = {
  title: string;
  description?: string;
};

export type AnalysisReportButtonState = "idle" | "loading" | "sending" | "sent" | "error";
