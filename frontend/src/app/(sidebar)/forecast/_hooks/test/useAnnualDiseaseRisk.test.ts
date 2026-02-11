import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import useAnnualDiseaseRisk from "@/app/(sidebar)/forecast/_hooks/useAnnualDiseaseRisk";
import type { DiseaseCode } from "@/app/(sidebar)/forecast/_types";
import type { AnnualDiseaseRiskProps } from "@/app/(sidebar)/forecast/_types/annualDiseaseRisk";

const DISEASES: DiseaseCode[] = ["DER", "OCU", "HEM", "MUS", "NEU", "RES"];

const DEFAULT_PROPS: AnnualDiseaseRiskProps = {
  diseaseList: DISEASES,
  statisticsData: {
    startYear: 2024,
    statistics: [
      { disease: "DER", ratios: [10, 20] },
      { disease: "OCU", ratios: [30, 40] },
    ],
  },
};

describe("useAnnualDiseaseRisk", () => {
  // 초기 상태
  it("초기 선택은 DEFAULT_SELECT_COUNT(3)개이다", () => {
    const { result } = renderHook(() => useAnnualDiseaseRisk(DEFAULT_PROPS));

    expect(result.current.selectedDiseases).toHaveLength(3);
  });

  it("diseaseList 가 2개면 selectedDiseases도 2개다", () => {
    const { result } = renderHook(() =>
      useAnnualDiseaseRisk({
        diseaseList: ["DER", "OCU"],
        statisticsData: {
          startYear: 2024,
          statistics: [
            { disease: "DER", ratios: [10, 20] },
            { disease: "OCU", ratios: [30, 40] },
          ],
        },
      }),
    );

    expect(result.current.selectedDiseases).toHaveLength(2);
  });

  it("선택된 질병에 색상이 할당되어 있다", () => {
    const { result } = renderHook(() => useAnnualDiseaseRisk(DEFAULT_PROPS));

    for (const d of result.current.selectedDiseases) {
      expect(d.color).toBeDefined();
      expect(typeof d.color).toBe("string");
      expect(d.color.length).toBeGreaterThan(0);
    }
  });

  it("unselectedDiseases는 전체 - 선택된 질병이다", () => {
    const { result } = renderHook(() => useAnnualDiseaseRisk(DEFAULT_PROPS));

    const selectedCodes = new Set(result.current.selectedDiseases.map((d) => d.code));
    const expected = DISEASES.filter((code) => !selectedCodes.has(code));

    expect(result.current.unselectedDiseases).toEqual(expected);
  });

  // handleSelect
  it("handleSelect로 질병 추가 시 selectedDiseases에 포함된다", () => {
    const { result } = renderHook(() => useAnnualDiseaseRisk(DEFAULT_PROPS));

    const unselected = result.current.unselectedDiseases[0]!;

    act(() => {
      result.current.handleSelect(unselected);
    });

    const codes = result.current.selectedDiseases.map((d) => d.code);
    expect(codes).toContain(unselected);
  });

  it("select 시 이미 사용된 색상이 아닌 새 색상이 할당된다", () => {
    const { result } = renderHook(() => useAnnualDiseaseRisk(DEFAULT_PROPS));

    const usedColorsBefore = new Set(result.current.selectedDiseases.map((d) => d.color));
    const unselected = result.current.unselectedDiseases[0]!;

    act(() => {
      result.current.handleSelect(unselected);
    });

    const newDisease = result.current.selectedDiseases.find((d) => d.code === unselected);
    expect(newDisease).toBeDefined();
    expect(usedColorsBefore.has(newDisease!.color)).toBe(false);
  });

  // handleCancel
  it("handleCancel로 질병 제거 시 selectedDiseases에서 빠진다", () => {
    const { result } = renderHook(() => useAnnualDiseaseRisk(DEFAULT_PROPS));

    const toRemove = result.current.selectedDiseases[0]!.code;

    act(() => {
      result.current.handleCancel(toRemove);
    });

    const codes = result.current.selectedDiseases.map((d) => d.code);
    expect(codes).not.toContain(toRemove);
    expect(result.current.selectedDiseases).toHaveLength(2);
  });

  // handleReset
  it("handleReset 시 초기 3개 선택으로 돌아간다", () => {
    const { result } = renderHook(() => useAnnualDiseaseRisk(DEFAULT_PROPS));

    act(() => {
      result.current.handleSelect("NEU");
      result.current.handleCancel("DER");
    });

    act(() => {
      result.current.handleReset();
    });

    const codes = result.current.selectedDiseases.map((d) => d.code);
    expect(codes).toEqual(DISEASES.slice(0, 3));
    expect(result.current.selectedDiseases).toHaveLength(3);
  });

  // diseaseList가 비어있을 때
  it("diseaseList가 빈 배열이면 선택/미선택 모두 비어있다", () => {
    const { result } = renderHook(() =>
      useAnnualDiseaseRisk({
        diseaseList: [],
        statisticsData: { startYear: 2024, statistics: [] },
      }),
    );

    expect(result.current.selectedDiseases).toEqual([]);
    expect(result.current.unselectedDiseases).toEqual([]);
  });
});
