import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mockGet = vi.fn();

vi.mock("@/lib/api", () => ({
  client: {
    GET: (...args: unknown[]) => mockGet(...args),
  },
}));

import { getCompareLastMonth } from "@/api/server/dashboardApi";

describe("server/dashboardApi", () => {
  const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => undefined);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    consoleErrorSpy.mockClear();
  });

  afterEach(() => {
    consoleErrorSpy.mockReset();
  });

  it("성공 시 지난달 비교 데이터를 반환한다", async () => {
    mockGet.mockResolvedValue({
      data: {
        totalRatio: 15,
        medicalRatio: 30,
        petName: "몽몽",
        petImageUrl: "https://example.com/pet.png",
      },
      error: undefined,
    });

    await expect(getCompareLastMonth()).resolves.toEqual({
      progressData: {
        totalRatio: 15,
        medicalRatio: 30,
        petName: "몽몽",
      },
      petImageUrl: "https://example.com/pet.png",
    });
  });

  it("응답 값이 비어 있으면 기본값으로 보정한다", async () => {
    mockGet.mockResolvedValue({
      data: {},
      error: undefined,
    });

    await expect(getCompareLastMonth()).resolves.toEqual({
      progressData: {
        totalRatio: 0,
        medicalRatio: 0,
        petName: "",
      },
      petImageUrl: "/images/img_dog_default.svg",
    });
  });

  it("error가 있거나 data가 없으면 에러를 throw한다", async () => {
    mockGet.mockResolvedValue({
      data: undefined,
      error: { message: "failed" },
    });

    await expect(getCompareLastMonth()).rejects.toThrow("지난달 비교 데이터를 불러오지 못했어요.");
    expect(consoleErrorSpy).toHaveBeenCalled();
  });
});
