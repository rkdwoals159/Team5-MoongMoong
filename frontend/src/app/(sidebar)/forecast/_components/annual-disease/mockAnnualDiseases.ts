import type { AnnualDiseases, DiseaseCode } from "@/app/(sidebar)/forecast/forecast.type";

export const MOCK_ANNUAL_DISEASES = {
  startYear: 2026,
  statistics: [
    { disease: "DER", ratios: [42, 58, 46, 62, 49, 67, 55] },
    { disease: "MUS", ratios: [28, 44, 31, 50, 36, 54, 40] },
    { disease: "NEU", ratios: [18, 33, 22, 37, 26, 35, 24] },
    { disease: "OCU", ratios: [12, 29, 18, 34, 22, 31, 20] },
    { disease: "RES", ratios: [35, 47, 38, 52, 41, 49, 44] },
    { disease: "CAR", ratios: [50, 42, 55, 39, 58, 45, 52] },
    { disease: "HEM", ratios: [9, 24, 13, 29, 17, 27, 15] },
    { disease: "GAS", ratios: [46, 33, 49, 36, 52, 40, 47] },
    { disease: "URI", ratios: [26, 39, 30, 43, 33, 38, 31] },
    { disease: "REP", ratios: [20, 36, 24, 40, 28, 37, 26] },
    { disease: "END", ratios: [53, 41, 56, 44, 59, 47, 54] },
    { disease: "INF", ratios: [25, 41, 30, 46, 34, 50, 38] },
  ],
} satisfies AnnualDiseases;

export const MOCK_DISEASE_KO_NAMES = [
  "피부과 질환",
  "근골격계 질환",
  "신경계 질환",
  "안과 질환",
  "호흡기 질환",
  "심장/순환기 질환",
  "혈액 질환",
  "소화기 질환",
  "비뇨기 질환",
  "생식기 질환",
  "내분비 질환",
  "감염성 질환",
] as const;

export const DISEASE_CODE_ORDER: DiseaseCode[] = [
  "DER",
  "MUS",
  "NEU",
  "OCU",
  "RES",
  "CAR",
  "HEM",
  "GAS",
  "URI",
  "REP",
  "END",
  "INF",
] as const;
