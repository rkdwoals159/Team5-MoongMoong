import { describe, it, expect } from "vitest";
import {
  toRiskLineData,
  assignColors,
  getNextAvailableColor,
} from "@/app/(sidebar)/forecast/_utils";
import { INDICATOR_PALETTE, DEFAULT_COLOR } from "@/app/(sidebar)/forecast/_constants";
import type { AnnualDiseases, DiseaseCode, SelectedDisease } from "@/app/(sidebar)/forecast/_types";

describe("forecast utils test", () => {
  // 질병 확률 데이터를 Recharts 데이터로 변환
  describe("toRiskLineData", () => {
    it("statistics 데이터가 올바른 { year, [code]: ratio } 형태로 변환된다", () => {
      const input: AnnualDiseases = {
        startYear: 2024,
        statistics: [
          { disease: "RES", ratios: [10, 20, 30] },
          { disease: "CAR", ratios: [40, 50, 60] },
        ],
      };

      const result = toRiskLineData(input);

      expect(result).toEqual([
        { year: 2024, RES: 10, CAR: 40 },
        { year: 2025, RES: 20, CAR: 50 },
        { year: 2026, RES: 30, CAR: 60 },
      ]);
    });

    it("startYear가 주어지면 해당 연도부터 시작한다", () => {
      const input: AnnualDiseases = {
        startYear: 2030,
        statistics: [{ disease: "DER", ratios: [5, 10] }],
      };

      const result = toRiskLineData(input);
      expect(result[0]?.year).toBe(2030);
      expect(result[1]?.year).toBe(2031);
    });

    it("startYear 생략 시 현재 연도가 사용된다", () => {
      const currentYear = new Date().getFullYear();
      const input: AnnualDiseases = {
        statistics: [{ disease: "MUS", ratios: [1] }],
      };

      const result = toRiskLineData(input);

      expect(result[0]?.year).toBe(currentYear);
    });

    it("statistics가 빈 배열이면 빈 배열을 반환한다", () => {
      const input: AnnualDiseases = {
        startYear: 2024,
        statistics: [],
      };

      const result = toRiskLineData(input);

      expect(result).toEqual([]);
    });

    it("statistics가 undefined면 빈 배열을 반환한다", () => {
      const input: AnnualDiseases = {
        startYear: 2024,
      } as AnnualDiseases;

      const result = toRiskLineData(input);

      expect(result).toEqual([]);
    });

    it("질병마다 ratios 길이가 다르면 최소 길이로 맞춘다", () => {
      const input: AnnualDiseases = {
        startYear: 2024,
        statistics: [
          { disease: "RES", ratios: [10, 20, 30] },
          { disease: "CAR", ratios: [40, 50] },
        ],
      };

      const result = toRiskLineData(input);

      expect(result).toHaveLength(2);
      expect(result).toEqual([
        { year: 2024, RES: 10, CAR: 40 },
        { year: 2025, RES: 20, CAR: 50 },
      ]);
    });

    it("특정 질병의 ratios가 undefined이면 해당 질병 데이터가 row에서 제외된다", () => {
      const input: AnnualDiseases = {
        startYear: 2024,
        statistics: [
          { disease: "RES", ratios: [10, 20] },
          { disease: "CAR", ratios: undefined },
        ],
      };

      const result = toRiskLineData(input);

      // ratios가 undefined인 질병이 있으면 Math.min에 0이 포함되어 len=0 → 빈 배열
      expect(result).toEqual([
        { year: 2024, RES: 10 },
        { year: 2025, RES: 20 },
      ]);
    });
  });

  // 질병 코드에 색상을 할당
  describe("assignColors", () => {
    it("3개 질병 코드에 서로 다른 색상이 할당된다", () => {
      const codes: DiseaseCode[] = ["RES", "CAR", "DER"];

      const result = assignColors(codes);

      expect(result).toHaveLength(3);
      const colors = result.map((d) => d.color);
      expect(new Set(colors).size).toBe(3);
    });

    it("INDICATOR_PALETTE 순서대로 색상이 할당된다", () => {
      const codes: DiseaseCode[] = ["RES", "CAR", "DER"];

      const result = assignColors(codes);

      expect(result[0]).toEqual({ code: "RES", color: INDICATOR_PALETTE[0] });
      expect(result[1]).toEqual({ code: "CAR", color: INDICATOR_PALETTE[1] });
      expect(result[2]).toEqual({ code: "DER", color: INDICATOR_PALETTE[2] });
    });

    it("13개 초과 시 모듈로 연산으로 색상이 순환된다", () => {
      const codes: DiseaseCode[] = [
        "DER",
        "OCU",
        "HEM",
        "MUS",
        "NEU",
        "RES",
        "CAR",
        "URI",
        "REP",
        "END",
        "INF",
        "GAS",
        "DER",
        "OCU",
      ];

      const result = assignColors(codes);

      expect(result[13]?.color).toBe(INDICATOR_PALETTE[13 % INDICATOR_PALETTE.length]);
    });

    it("빈 배열 입력 시 빈 배열을 반환한다", () => {
      const result = assignColors([]);

      expect(result).toEqual([]);
    });
  });

  // 선택/해제 시 다음 미사용 색상 반환
  describe("getNextAvailableColor", () => {
    it("이미 사용된 색상을 건너뛰고 첫 미사용 색상을 반환한다", () => {
      const selected: SelectedDisease[] = [{ code: "RES", color: INDICATOR_PALETTE[0]! }];

      const result = getNextAvailableColor(selected);

      expect(result).toBe(INDICATOR_PALETTE[1]);
    });

    it("13개 색상 모두 사용 중이면 DEFAULT_COLOR를 반환한다", () => {
      const selected: SelectedDisease[] = INDICATOR_PALETTE.map((color) => ({
        code: "RES" as DiseaseCode,
        color,
      }));

      const result = getNextAvailableColor(selected);

      expect(result).toBe(DEFAULT_COLOR);
    });

    it("선택 목록이 비어있으면 첫 번째 팔레트 색상을 반환한다", () => {
      const result = getNextAvailableColor([]);

      expect(result).toBe(INDICATOR_PALETTE[0]);
    });

    it("0번, 2번 색상만 사용 시 1번 색상을 반환한다", () => {
      const selected: SelectedDisease[] = [
        { code: "RES", color: INDICATOR_PALETTE[0]! },
        { code: "CAR", color: INDICATOR_PALETTE[2]! },
      ];

      const result = getNextAvailableColor(selected);

      expect(result).toBe(INDICATOR_PALETTE[1]);
    });
  });
});
