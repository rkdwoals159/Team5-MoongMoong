import { describe, it, expect } from "vitest";
import { getChartLabelFromPayload } from "@/app/(sidebar)/analysis/_lib/getChartLabelFromPayload";

describe("getChartLabelFromPayload", () => {
  it("undefined인 경우 빈 문자열을 반환한다", () => {
    expect(getChartLabelFromPayload(undefined)).toBe("");
  });

  it("category가 있는 경우 category를 반환한다", () => {
    const payload = { category: "의료비", cost: 1000, ratio: 42.3 };
    expect(getChartLabelFromPayload(payload)).toBe("의료비");
  });

  it("category가 null인 경우 빈 문자열을 반환한다", () => {
    const payload = { category: null, cost: 1000, ratio: 42.3 };
    expect(getChartLabelFromPayload(payload)).toBe("");
  });

  it("subCategory가 있는 경우 subCategory를 반환한다", () => {
    const payload = { subCategory: "약/처방", cost: 1000, ratio: 42.3 };
    expect(getChartLabelFromPayload(payload)).toBe("약/처방");
  });

  it("medical subCategory가 enum 코드인 경우 매핑된 한글 라벨을 반환한다", () => {
    const payload = { subCategory: "SURGERY_HOSPITALIZATION", cost: 1000, ratio: 42.3 };

    expect(getChartLabelFromPayload(payload)).toBe("수술/입원");
  });

  it("category와 subCategory가 모두 있는 경우 category를 우선 반환한다", () => {
    const payload = { category: "의료비", subCategory: "약/처방", cost: 1000, ratio: 42.3 };
    expect(getChartLabelFromPayload(payload)).toBe("의료비");
  });

  it("category나 subCategory가 없는 경우 빈 문자열을 반환한다", () => {
    const payload = { cost: 1000, ratio: 42.3 };
    expect(getChartLabelFromPayload(payload)).toBe("");
  });
});
